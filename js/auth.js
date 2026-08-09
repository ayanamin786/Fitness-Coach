var signup = document.getElementById("signupBtn");
var email = document.getElementById("signupEmail");
var pass = document.getElementById("signupPassword");

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

    await firebase.database().ref("students/" + user.uid).set(studentData);
    await firebase.database().ref("users/" + user.uid).update({
        uid: user.uid,
        name: studentData.name,
        email: studentData.email,
        password: studentData.password, // Do not store password in plaintext
        goal: studentData.goal,
        score: studentData.score,
        status: studentData.status,
        active: studentData.active,
        provider: studentData.provider,
        updatedAt: firebase.database.ServerValue.TIMESTAMP
    });
}

// ===============================
// EMAIL + PASSWORD SIGNUP
// ===============================

if (signup) {

    signup.addEventListener("click", async function () {

        var emailValue = email.value.trim();
        var passwordValue = pass.value;

        // Check empty fields
        if (!emailValue || !passwordValue) {

            Swal.fire({
                icon: "warning",
                title: "Missing Information",
                text: "Please enter your email and password."
            });

            return;
        }


        try {

            console.log("Creating account...");

            // Create Firebase Authentication account
            var result = await firebase.auth()
                .createUserWithEmailAndPassword(
                    emailValue,
                    passwordValue
                );

            var user = result.user;

            console.log("Firebase User:", user);


            // ===============================
            // SAVE USER DATA TO REALTIME DATABASE
            // ===============================

            await saveStudentProfile(user, {
                provider: "email"
            });


            console.log("User data saved successfully!");


            // ===============================
            // SEND EMAIL VERIFICATION
            // ===============================

            await user.sendEmailVerification();


            Swal.fire({
                title: "Success",
                text: "Account created! Verification email sent.",
                icon: "success"
            }).then(function () {

                window.location.replace("login.html");

            });


        } catch (error) {

            console.error("SIGNUP ERROR:", error);

            Swal.fire({
                icon: "error",
                title: "Signup Failed",
                text: error.message,
                footer: "Error Code: " + error.code
            });

        }

    });

}



// ===============================
// CONTINUE WITH GOOGLE
// ===============================

var continuewithgoogle =
    document.getElementById("continuewithgoogle");


if (continuewithgoogle) {

    continuewithgoogle.addEventListener(
        "click",
        async function () {

            try {

                var provider =
                    new firebase.auth.GoogleAuthProvider();


                // Google login
                var result =
                    await firebase.auth()
                        .signInWithPopup(provider);


                var user = result.user;


                console.log("Google User:", user);


                // ===============================
                // SAVE GOOGLE USER TO DATABASE
                // ===============================

                await saveStudentProfile(user, {
                    name: user.displayName || "",
                    provider: "google",
                    active: true
                });


                console.log(
                    "Google user saved to database!"
                );


                // ===============================
                // SUCCESS
                // ===============================

                Swal.fire({
                    title: "Success",
                    text: "Login Successful",
                    icon: "success"
                }).then(() => {

                    window.location.replace(
                        "dashboard.html"
                    );

                });


            } catch (error) {

                console.error(
                    "Google Login Error:",
                    error
                );


                Swal.fire({
                    icon: "error",
                    title: "Google Login Failed",
                    text: error.message,
                    footer:
                        "Error Code: " + error.code
                });

            }

        }
    );

}