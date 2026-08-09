
var login = document.getElementById("loginBtn");
var email = document.getElementById("loginEmail");
var pass = document.getElementById("loginPassword");

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

