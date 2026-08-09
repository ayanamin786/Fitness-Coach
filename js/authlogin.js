
var login = document.getElementById("loginBtn");
var email = document.getElementById("loginEmail");
var pass = document.getElementById("loginPassword");
async function saveStudentProfile(user, extraData = {}) {
    const studentData = {
        uid: user.uid,
        name: extraData.name || user.displayName || (user.email ? user.email.split("@")[0] : "New Student"),
        email: user.email || "",
        pass:user.password || "", // Do not store password in plaintext
        goal: extraData.goal || "General Fitness",
        score: extraData.score || 0,
        status: extraData.status || "Active",
        active: extraData.active !== false,
        provider: extraData.provider || "email",
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
        lastSeenAt: firebase.database.ServerValue.TIMESTAMP
    };
}

// Save login session
function saveSession(role, userEmail) {
    localStorage.setItem("fitnessLoggedIn", "true");
    localStorage.setItem("fitnessUserRole", role);
    localStorage.setItem("fitnessUserEmail", userEmail);
}


// Login button
if (login) {

    login.addEventListener("click", async function () {

        var emailValue = (email?.value || "").trim();
        var passwordValue = pass?.value || "";


        // Check empty fields
        if (!emailValue || !passwordValue) {

            Swal.fire({
                icon: "warning",
                title: "Missing Information",
                text: "Please enter your email and password."
            });

            return;
        }


        // Firebase Login
        try {

            var userCred =
                await firebase.auth().signInWithEmailAndPassword(
                    emailValue,
                    passwordValue
                );

            var user = userCred.user;

            console.log("Logged in UID:", user.uid);
            console.log("Logged in Email:", user.email);


            // ==========================================
            // ADMIN LOGIN
            // ==========================================

            if (user.email === "admin@example.com") {

                saveSession("admin", user.email);

                Swal.fire({
                    title: "Success",
                    text: "Admin login successful",
                    icon: "success"
                }).then(function () {

                    window.location.replace("admin.html");

                });

                return;
            }


            // ==========================================
            // STUDENT LOGIN
            // ==========================================

            saveSession("student", user.email);

            Swal.fire({
                title: "Success",
                text: "Login Successful",
                icon: "success"
            }).then(function () {

                window.location.replace("dashboard.html");

            });


        } catch (err) {

            console.error("Firebase Login Error:", err);

            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: "Email or password is incorrect.",
                footer: err?.message || ""
            });

        }

    });

}


// ==========================================
// GOOGLE LOGIN
// ==========================================


// ==========================================
// GOOGLE LOGIN
// ==========================================

var continuewithgoogle =
    document.getElementById("continuewithgoogle");


if (continuewithgoogle) {

    continuewithgoogle.addEventListener(
        "click",
        async function () {

            try {

                // ==========================================
                // GOOGLE AUTH PROVIDER
                // ==========================================

                var provider =
                    new firebase.auth.GoogleAuthProvider();


                // ==========================================
                // GOOGLE LOGIN
                // ==========================================

                var result =
                    await firebase
                        .auth()
                        .signInWithPopup(provider);


                // ==========================================
                // GET LOGGED-IN USER
                // ==========================================

                var user = result.user;


                console.log(
                    "Google Login User:",
                    user
                );


                // ==========================================
                // SAVE / UPDATE USER PROFILE
                // ==========================================

                await saveStudentProfile(
                    user,
                    {

                        // Google account name
                        name:
                            user.displayName || "",

                        // Google profile picture
                        profilePic:
                            user.photoURL || "",

                        // Login provider
                        provider:
                            "google",

                        active:
                            true
                    }
                );


                console.log(
                    "Google user login data saved!"
                );


                // ==========================================
                // SUCCESS MESSAGE
                // ==========================================

                Swal.fire({

                    title:
                        "Login Successful!",

                    text:
                        "Welcome back, " +
                        (user.displayName || "User"),

                    icon:
                        "success",

                    timer:
                        1500,

                    showConfirmButton:
                        false

                }).then(function () {

                    // ==========================================
                    // GO TO DASHBOARD
                    // ==========================================

                    window.location.replace(
                        "./dashboard.html"
                    );

                });


            } catch (error) {

                // ==========================================
                // GOOGLE LOGIN ERROR
                // ==========================================

                console.error(
                    "Google Login Error:",
                    error
                );


                Swal.fire({

                    icon:
                        "error",

                    title:
                        "Google Login Failed",

                    text:
                        error.message,

                    footer:
                        "Error Code: " +
                        error.code
                });

            }

        }
    );

}



