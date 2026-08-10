
/* =========================================================
   AI FITNESS COACH
   CLOUDINARY PROFILE PICTURE SYSTEM
   ========================================================= */


/* =========================================================
   CLOUDINARY CONFIG
   ========================================================= */

const CLOUDINARY_CLOUD_NAME = "dwes3qupj";

const CLOUDINARY_UPLOAD_PRESET = "image_upload";

const CLOUDINARY_UPLOAD_URL =
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


/* =========================================================
   PROFILE IMAGE INPUT
   ========================================================= */

const profilePicInput =
    document.getElementById("profilePicInput");


/* =========================================================
   FILE SELECT
   ========================================================= */

if (profilePicInput) {

    profilePicInput.addEventListener(
        "change",
        async function () {

            const file =
                this.files && this.files[0];

            if (!file) {
                return;
            }

            console.log(
                "Profile image selected:",
                file.name
            );


            /* ---------------------------------------------
               FILE TYPE
            --------------------------------------------- */

            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            if (!allowedTypes.includes(file.type)) {

                showProfileMessage(
                    "error",
                    "Invalid Image",
                    "Please select JPG, PNG or WEBP."
                );

                this.value = "";

                return;
            }


            /* ---------------------------------------------
               FILE SIZE
            --------------------------------------------- */

            if (file.size > 5 * 1024 * 1024) {

                showProfileMessage(
                    "error",
                    "Image Too Large",
                    "Profile picture must be smaller than 5MB."
                );

                this.value = "";

                return;
            }


            /* ---------------------------------------------
               UPLOAD
            --------------------------------------------- */

            await uploadProfilePicture(file);

        }
    );

}


/* =========================================================
   UPLOAD PROFILE PICTURE
   ========================================================= */

async function uploadProfilePicture(file) {

    try {

        console.log(
            "Starting Cloudinary upload..."
        );


        /* ---------------------------------------------
           CHECK FIREBASE
        --------------------------------------------- */

        if (
            typeof firebase === "undefined"
        ) {

            throw new Error(
                "Firebase SDK is not loaded."
            );

        }


        /* ---------------------------------------------
           CHECK LOGIN
        --------------------------------------------- */

        const user =
            firebase.auth().currentUser;


        if (!user) {

            showProfileMessage(
                "warning",
                "Login Required",
                "Please login before uploading your profile picture."
            );

            return;
        }


        console.log(
            "Logged in UID:",
            user.uid
        );


        /* ---------------------------------------------
           BUTTON LOADING
        --------------------------------------------- */

        setProfileUploadLoading(true);


        /* ---------------------------------------------
           CLOUDINARY FORM DATA
        --------------------------------------------- */

        const formData =
            new FormData();

        formData.append(
            "file",
            file
        );

        formData.append(
            "upload_preset",
            CLOUDINARY_UPLOAD_PRESET
        );


        /* ---------------------------------------------
           CLOUDINARY UPLOAD
        --------------------------------------------- */

        const response =
            await fetch(
                CLOUDINARY_UPLOAD_URL,
                {
                    method: "POST",
                    body: formData
                }
            );


        /* ---------------------------------------------
           CLOUDINARY ERROR
        --------------------------------------------- */

        if (!response.ok) {

            const errorData =
                await response
                    .json()
                    .catch(
                        () => ({})
                    );

            console.error(
                "Cloudinary response:",
                errorData
            );

            throw new Error(
                errorData?.error?.message ||
                "Cloudinary upload failed."
            );
        }


        /* ---------------------------------------------
           CLOUDINARY RESPONSE
        --------------------------------------------- */

        const cloudinaryData =
            await response.json();


        console.log(
            "Cloudinary upload successful:",
            cloudinaryData
        );


        const originalUrl =
            cloudinaryData.secure_url;


        if (!originalUrl) {

            throw new Error(
                "Cloudinary did not return an image URL."
            );
        }


        console.log(
            "Original Cloudinary URL:",
            originalUrl
        );


        /* ---------------------------------------------
           FACE-CENTERED AVATAR
        --------------------------------------------- */

        const profilePicUrl =
            createFaceAvatarUrl(
                originalUrl
            );


        console.log(
            "Face avatar URL:",
            profilePicUrl
        );


        /* ---------------------------------------------
           SAVE TO FIREBASE
        --------------------------------------------- */

        await saveProfilePictureToFirebase(
            user,
            profilePicUrl
        );


        console.log(
            "Profile picture saved to Firebase."
        );


        /* ---------------------------------------------
           UPDATE ALL AVATARS
        --------------------------------------------- */

        updateAllProfileAvatars(
            profilePicUrl
        );


        /* ---------------------------------------------
           CHANGE BUTTON TEXT
        --------------------------------------------- */

        setProfileButtonToChange();


        /* ---------------------------------------------
           SUCCESS
        --------------------------------------------- */

        showProfileMessage(
            "success",
            "Profile Picture Updated",
            "Your profile picture has been uploaded and saved successfully."
        );


    } catch (error) {

        console.error(
            "PROFILE UPLOAD ERROR:",
            error
        );


        showProfileMessage(
            "error",
            "Upload Failed",
            error.message ||
            "Unable to upload profile picture."
        );


    } finally {

        setProfileUploadLoading(false);


        if (profilePicInput) {

            profilePicInput.value = "";

        }

    }

}


/* =========================================================
   CREATE FACE-CENTERED CLOUDINARY URL
   ========================================================= */

function createFaceAvatarUrl(originalUrl) {

    const marker =
        "/upload/";


    if (!originalUrl.includes(marker)) {

        return originalUrl;

    }


    return originalUrl.replace(
        marker,
        "/upload/c_fill,g_face,w_300,h_300,q_auto,f_auto/"
    );

}


/* =========================================================
   SAVE PROFILE PICTURE TO FIREBASE
   ========================================================= */

async function saveProfilePictureToFirebase(
    user,
    profilePicUrl
) {

    const updates = {};


    /* USERS */

    updates[
        `users/${user.uid}/profilePic`
    ] = profilePicUrl;


    updates[
        `users/${user.uid}/updatedAt`
    ] =
        firebase.database.ServerValue.TIMESTAMP;


    /* STUDENTS */

    updates[
        `students/${user.uid}/profilePic`
    ] = profilePicUrl;


    updates[
        `students/${user.uid}/updatedAt`
    ] =
        firebase.database.ServerValue.TIMESTAMP;


    await firebase
        .database()
        .ref()
        .update(updates);

}


/* =========================================================
   UPDATE EVERY PROFILE AVATAR
   ========================================================= */

function updateAllProfileAvatars(
    profilePicUrl
) {

    /* ---------------------------------------------
       SPECIFIC PROFILE AVATARS
    --------------------------------------------- */

    const avatars =
        document.querySelectorAll(
            "#headerProfilePic, .profile-avatar, [data-profile-avatar]"
        );


    avatars.forEach(
        function (avatar) {

            avatar.src =
                profilePicUrl;

            avatar.style.objectFit =
                "cover";

        }
    );


    /* ---------------------------------------------
       HEADER AVATAR
    --------------------------------------------- */

    const headerAvatar =
        document.getElementById(
            "headerProfilePic"
        );


    if (headerAvatar) {

        headerAvatar.src =
            profilePicUrl;

    }


    /* ---------------------------------------------
       SAVE LOCALLY FOR INSTANT UI
    --------------------------------------------- */

    localStorage.setItem(
        "profilePic",
        profilePicUrl
    );

}


/* =========================================================
   LOAD SAVED PROFILE PICTURE
   ========================================================= */

function loadSavedProfilePicture() {

    if (
        typeof firebase === "undefined"
    ) {

        console.error(
            "Firebase SDK not loaded."
        );

        return;
    }


    firebase
        .auth()
        .onAuthStateChanged(
            async function (user) {

                if (!user) {

                    console.log(
                        "No logged-in Firebase user."
                    );

                    return;
                }


                console.log(
                    "Loading profile picture for:",
                    user.uid
                );


                try {

                    const snapshot =
                        await firebase
                            .database()
                            .ref(
                                `users/${user.uid}/profilePic`
                            )
                            .once("value");


                    const profilePic =
                        snapshot.val();


                    if (profilePic) {

                        console.log(
                            "Saved profile picture found."
                        );


                        updateAllProfileAvatars(
                            profilePic
                        );


                        setProfileButtonToChange();

                    } else {

                        console.log(
                            "No profile picture saved yet."
                        );

                    }

                } catch (error) {

                    console.error(
                        "Profile picture load error:",
                        error
                    );

                }

            }
        );

}


/* =========================================================
   CHANGE PROFILE BUTTON
   ========================================================= */

function setProfileButtonToChange() {

    const button =
        document.getElementById(
            "profilePicBtn"
        );


    if (!button) {
        return;
    }


    button.innerHTML = `
        <i class="bi bi-camera-fill"></i>
        <span>Change Profile Pic</span>
    `;

}


/* =========================================================
   LOADING BUTTON
   ========================================================= */

function setProfileUploadLoading(
    loading
) {

    const button =
        document.getElementById(
            "profilePicBtn"
        );


    if (!button) {
        return;
    }


    if (loading) {

        button.innerHTML = `
            <span
                class="spinner-border spinner-border-sm"
                aria-hidden="true"
            ></span>

            <span>Uploading...</span>
        `;

        button.style.pointerEvents =
            "none";


    } else {

        button.style.pointerEvents =
            "auto";

    }

}


/* =========================================================
   ALERT SYSTEM
   ========================================================= */

function showProfileMessage(
    icon,
    title,
    text
) {

    if (
        typeof Swal !== "undefined"
    ) {

        Swal.fire({
            icon: icon,
            title: title,
            text: text
        });

    } else {

        alert(
            title + "\n\n" + text
        );

    }

}


/* =========================================================
   START PROFILE SYSTEM
   ========================================================= */

loadSavedProfilePicture();

