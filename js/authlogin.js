var login = document.getElementById("loginBtn");
var email = document.getElementById("loginEmail");
var pass = document.getElementById("loginPassword");


// ==========================================
// SAVE LOGIN SESSION
// ==========================================

function saveSession(role, userEmail) {

    localStorage.setItem(
        "fitnessLoggedIn",
        "true"
    );

    localStorage.setItem(
        "fitnessUserRole",
        role
    );

    localStorage.setItem(
        "fitnessUserEmail",
        userEmail
    );
}


// ==========================================
// NORMAL EMAIL/PASSWORD LOGIN
// ==========================================

if (login) {

    login.addEventListener(
        "click",
        async function () {

            var emailValue =
                (email?.value || "").trim();

            var passwordValue =
                pass?.value || "";


            // ==========================================
            // CHECK EMPTY FIELDS
            // ==========================================

            if (!emailValue || !passwordValue) {

                Swal.fire({
                    icon: "warning",
                    title: "Missing Information",
                    text:
                        "Please enter your email and password."
                });

                return;
            }


            // ==========================================
            // FIREBASE LOGIN
            // ==========================================

            try {

                var userCred =
                    await firebase
                        .auth()
                        .signInWithEmailAndPassword(
                            emailValue,
                            passwordValue
                        );


                var user =
                    userCred.user;


                console.log(
                    "Logged in UID:",
                    user.uid
                );

                console.log(
                    "Logged in Email:",
                    user.email
                );


                // ==========================================
                // ADMIN LOGIN
                // ==========================================

                if (
                    user.email ===
                    "admin@example.com" &&
                    passwordValue ===
                    "admin"
                ) {

                    saveSession(
                        "admin",
                        user.email
                    );


                    Swal.fire({

                        title:
                            "Success",

                        text:
                            "Admin login successful",

                        icon:
                            "success"

                    }).then(function () {

                        window.location.replace(
                            "admin.html"
                        );

                    });


                    return;
                }


                // ==========================================
                // STUDENT LOGIN
                // ==========================================

                saveSession(
                    "student",
                    user.email
                );


                Swal.fire({

                    title:
                        "Success",

                    text:
                        "Login Successful",

                    icon:
                        "success"

                }).then(function () {

                    window.location.replace(
                        "dashboard.html"
                    );

                });


            } catch (err) {

                console.error(
                    "Firebase Login Error:",
                    err
                );


                Swal.fire({

                    icon:
                        "error",

                    title:
                        "Login Failed",

                    text:
                        "Email or password is incorrect.",

                    footer:
                        err?.message || ""

                });

            }

        }
    );

}


// ==========================================
// GOOGLE LOGIN
// ==========================================

var continuewithgoogle =
    document.getElementById(
        "continuewithgoogle"
    );


if (continuewithgoogle) {

    continuewithgoogle.addEventListener(
        "click",
        async function () {

            try {

                // ==========================================
                // GOOGLE PROVIDER
                // ==========================================

                var provider =
                    new firebase.auth.GoogleAuthProvider();


                // ==========================================
                // GOOGLE LOGIN
                // ==========================================

                var result =
                    await firebase
                        .auth()
                        .signInWithPopup(
                            provider
                        );


                // ==========================================
                // GET USER
                // ==========================================

                var user =
                    result.user;


                console.log(
                    "Google Login User:",
                    user
                );


                // ==========================================
                // SAVE SESSION
                // ==========================================

                saveSession(
                    "student",
                    user.email
                );


                // ==========================================
                // SUCCESS
                // ==========================================

                Swal.fire({

                    title:
                        "Login Successful!",

                    text:
                        "Welcome back, " +
                        (user.displayName || "User"),

                    icon:
                        "success"

                }).then(function () {

                    // ==========================================
                    // OPEN DASHBOARD
                    // ==========================================

                    window.location.replace(
                        "dashboard.html"
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

