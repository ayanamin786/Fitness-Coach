const S={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
function applyTheme(theme){const resolved=theme||S.get('theme','system');if(resolved==='light'){document.documentElement.setAttribute('data-theme','light');}else if(resolved==='dark'){document.documentElement.setAttribute('data-theme','dark');}else{document.documentElement.removeAttribute('data-theme');}document.documentElement.style.colorScheme=resolved==='light'?'light':resolved==='dark'?'dark':'light';}
function toggleTheme(){const current=S.get('theme','system');const next=current==='light'?'dark':current==='dark'?'light':'light';S.set('theme',next);applyTheme(next);updateThemeToggle();}
function updateThemeToggle(){const button=document.getElementById('themeToggle');if(!button)return;const current=S.get('theme','system');if(current==='light')button.innerHTML='<i class="bi bi-sun-fill"></i>';else if(current==='dark')button.innerHTML='<i class="bi bi-moon-fill"></i>';else button.innerHTML='<i class="bi bi-circle-half"></i>';} 
applyTheme(S.get('theme','system'));
const workouts=[["Push Ups","Chest","3","12","10 min","💪"],["Goblet Squats","Legs","4","15","12 min","🏋️"],["Dumbbell Row","Back","3","10","10 min","🔥"],["Shoulder Press","Shoulders","3","12","8 min","⚡"],["Plank","Core","3","45 sec","5 min","◈"],["Lunges","Legs","3","12","9 min","🦵"]];
const meals=[["BREAKFAST","Protein Oat Bowl",420,"28g","08:00"],["LUNCH","Chicken Power Bowl",610,"46g","13:00"],["SNACK","Greek Yogurt + Berries",280,"20g","16:30"],["DINNER","Salmon & Rice",530,"42g","20:00"]];
function renderWorkouts(){let el=document.getElementById("workoutGrid");if(!el)return;let d=S.get("workouts",[]);el.innerHTML=workouts.map((w,i)=>`<div class="workout-card"><div class="exercise-top"><span class="exercise-icon">${w[5]}</span><span class="status-chip">${w[1]}</span></div><div class="exercise-name">${w[0]}</div><div class="exercise-meta">Strength • Beginner friendly</div><div class="exercise-data"><span>${w[2]} sets</span><span>${w[3]} reps</span><span>${w[4]}</span></div><button class="complete-btn ${d.includes(i)?"done":""}" onclick="toggleWorkout(${i})">${d.includes(i)?"✓ Completed":"Mark complete"}</button></div>`).join("")}
function toggleWorkout(i){let d=S.get("workouts",[]);d=d.includes(i)?d.filter(x=>x!==i):[...d,i];S.set("workouts",d);renderWorkouts()}
function renderMeals(){let el=document.getElementById("mealGrid");if(!el)return;let d=S.get("meals",[]);el.innerHTML=meals.map((m,i)=>`<div class="meal-card"><span class="meal-type">${m[0]}</span><h3>${m[1]}</h3><p>Balanced fuel • ${m[4]}</p><div class="meal-kcal">${m[2]} <small>kcal · ${m[3]} protein</small></div><button class="meal-btn ${d.includes(i)?"done":""}" onclick="toggleMeal(${i})">${d.includes(i)?"✓ Meal completed":"Complete meal"}</button></div>`).join("")}
function toggleMeal(i){let d=S.get("meals",[]);d=d.includes(i)?d.filter(x=>x!==i):[...d,i];S.set("meals",d);renderMeals()}
const habits=[["💧","Water","6 of 8 glasses"],["🥗","Meals","3 of 4 completed"],["🏋️","Workout","Today's session"],["😴","Sleep","7+ hours target"]];
function renderHabits(){let el=document.getElementById("habitList");if(!el)return;let h=S.get("habits",[true,true,true,false]);el.innerHTML=habits.map((x,i)=>`<div class="habit-row"><div class="habit-info"><i>${x[0]}</i><div><b>${x[1]}</b><small>${x[2]}</small></div></div><button class="check-btn ${h[i]?"done":""}" onclick="toggleHabit(${i})">${h[i]?"✓":"+"}</button></div>`).join("");let p=Math.round(h.filter(Boolean).length/4*100);const habitScore=document.getElementById("habitScore");if(habitScore)habitScore.textContent=p+"%";const habitRing=document.getElementById("habitRing");if(habitRing)habitRing.textContent=p+"%"}
function toggleHabit(i){let h=S.get("habits",[true,true,true,false]);h[i]=!h[i];S.set("habits",h);renderHabits()}
function calcBMI(){let h=+document.getElementById("height").value,w=+document.getElementById("weight").value,b=+(w/((h/100)**2)).toFixed(1);document.getElementById("bmiValue").textContent=b;document.getElementById("bmiStatus").textContent=b<18.5?"UNDERWEIGHT":b<25?"NORMAL":b<30?"OVERWEIGHT":"OBESITY";S.set("bmi",b)}
function calcCalories(){let w=+document.getElementById("weight").value||70,h=+document.getElementById("height").value||175,t=Math.round((10*w+6.25*h-5*13+5)*1.55+250);document.getElementById("calorieValue").textContent=t.toLocaleString();S.set("calories",t)}
function chatReply(m){m=m.toLowerCase();if(m.includes("water"))return"Your target is 8 glasses. You are currently at 6/8.";if(m.includes("workout"))return"Today's workout includes Push Ups, Goblet Squats, Dumbbell Row, Shoulder Press, Plank and Lunges.";if(m.includes("bmi"))return"Your saved BMI is "+(S.get("bmi",22.9))+".";if(m.includes("eat")||m.includes("nutrition"))return"Try the Protein Oat Bowl, Chicken Power Bowl, Greek Yogurt + Berries and Salmon & Rice.";return"I can help with workout, water, BMI, nutrition and progress."}
function sendChat(t){if(!t.trim())return;let b=document.getElementById("chatMessages");if(!b)return; b.innerHTML+=`<div class="message user"><div><p>${t}</p></div></div>`;setTimeout(()=>{b.innerHTML+=`<div class="message bot"><span class="bot-avatar">✦</span><div><small>AI FITNESS COACH</small><p>${chatReply(t)}</p></div></div>`;b.scrollTop=b.scrollHeight},350)}
const users=[["Ayan","Muscle Gain",87,"Active"],["Ahmed","Weight Loss",81,"Active"],["Sara","Maintenance",76,"Active"],["Hamza","Muscle Gain",69,"Inactive"],["Maha","Weight Loss",91,"Active"]];
function renderUsers(){

    // ==========================================================
// ADMIN REALTIME SYSTEM
// ==========================================================

const studentsRef =
    firebase.database().ref("students");

const presenceRef =
    firebase.database().ref("presence");


let adminStudents = {};

let adminPresence = {};

let selectedStudentUID = null;

let selectedStudentListener = null;

let selectedPresenceListener = null;


// ==========================================================
// STUDENTS REALTIME
// ==========================================================

studentsRef.on(
    "value",
    function(snapshot) {

        adminStudents =
            snapshot.val() || {};

        updateAdminStats();

        renderFirebaseStudents();

        // If a student is already selected,
        // refresh his details automatically.
        if (selectedStudentUID) {

            const student =
                adminStudents[selectedStudentUID];

            if (student) {

                renderStudentDetails(
                    selectedStudentUID,
                    student
                );

            }

        }

    },

    function(error) {

        console.error(
            "Students Firebase Error:",
            error
        );

        const badge =
            document.getElementById(
                "syncBadge"
            );

        if (badge) {

            badge.innerHTML =
                "❌ Firebase Error";

        }

    }
);


// ==========================================================
// PRESENCE REALTIME
// ==========================================================

presenceRef.on(
    "value",
    function(snapshot) {

        adminPresence =
            snapshot.val() || {};

        updateAdminStats();

        renderFirebaseStudents();


        if (selectedStudentUID) {

            updateSelectedStudentPresence(
                selectedStudentUID
            );

        }

    },

    function(error) {

        console.error(
            "Presence Error:",
            error
        );

    }
);


// ==========================================================
// ADMIN STATS
// ==========================================================

function updateAdminStats() {


    const students =
        Object.keys(
            adminStudents
        );


    // TOTAL STUDENTS

    const total =
        students.length;


    const totalElement =
        document.getElementById(
            "totalUsers"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }



    // ACTIVE / ONLINE STUDENTS

    let active = 0;


    students.forEach(
        function(uid) {

            if (
                adminPresence[uid] &&
                adminPresence[uid].online === true
            ) {

                active++;

            }

        }
    );


    const activeElement =
        document.getElementById(
            "activeUsers"
        );


    if (activeElement) {

        activeElement.textContent =
            active;

    }



    // ACTIVE PLANS

    let plans = 0;


    students.forEach(
        function(uid) {

            const student =
                adminStudents[uid];


            if (
                student &&
                student.goal &&
                String(student.goal).trim() !== ""
            ) {

                plans++;

            }

        }
    );


    const plansElement =
        document.getElementById(
            "plansGenerated"
        );


    if (plansElement) {

        plansElement.textContent =
            plans;

    }



    // SYNCED STUDENTS

    const syncElement =
        document.getElementById(
            "aiConversations"
        );


    if (syncElement) {

        syncElement.textContent =
            total;

    }



    // SYNC BADGE

    const badge =
        document.getElementById(
            "syncBadge"
        );


    if (badge) {

        badge.innerHTML = `
            <span class="live-sync-dot"></span>
            Live — Firebase synced
        `;

    }

}


// ==========================================================
// RENDER STUDENT LIST
// ==========================================================

function renderFirebaseStudents() {


    const table =
        document.getElementById(
            "userTable"
        );


    if (!table) return;


    const studentEntries =
        Object.entries(
            adminStudents
        );


    if (studentEntries.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:40px;
                    "
                >

                    <i class="bi bi-people"></i>

                    <br><br>

                    No students registered yet.

                </td>

            </tr>

        `;

        return;

    }


    // ======================================================
    // SORT NEWEST FIRST
    // ======================================================

    studentEntries.sort(
        function(a, b) {

            const studentA =
                a[1] || {};

            const studentB =
                b[1] || {};


            return (
                (studentB.createdAt || 0) -
                (studentA.createdAt || 0)
            );

        }
    );



    // ======================================================
    // BUILD TABLE
    // ======================================================

    table.innerHTML =
        studentEntries
            .map(
                function(entry) {

                    const uid =
                        entry[0];

                    const student =
                        entry[1] || {};


                    const name =
                        student.name ||
                        (
                            student.email
                                ? student.email
                                    .split("@")[0]
                                : "Student"
                        );


                    const email =
                        student.email || "";


                    const photo =
                        student.profilePic ||
                        "default-avatar.png";


                    const goal =
                        student.goal ||
                        "General Fitness";


                    const bmi =
                        student.bmi ??
                        "--";


                    const calories =
                        student.calories ??
                        "--";


                    const score =
                        student.score ??
                        0;


                    const online =
                        adminPresence[uid] &&
                        adminPresence[uid].online === true;


                    return `

                        <tr
                            class="student-row"
                        >

                            <!-- USER -->

                            <td>

                                <div
                                    style="
                                        display:flex;
                                        align-items:center;
                                        gap:12px;
                                    "
                                >

                                    <img
                                        src="${safeHTML(photo)}"
                                        style="
                                            width:44px;
                                            height:44px;
                                            border-radius:50%;
                                            object-fit:cover;
                                        "
                                        onerror="
                                            this.src='default-avatar.png'
                                        "
                                        alt="Student"
                                    >

                                    <div>

                                        <b>
                                            ${safeHTML(name)}
                                        </b>

                                        <small
                                            style="
                                                display:block;
                                                opacity:.6;
                                            "
                                        >
                                            ${safeHTML(email)}
                                        </small>

                                    </div>

                                </div>

                            </td>


                            <!-- GOAL -->

                            <td>
                                ${safeHTML(goal)}
                            </td>


                            <!-- BMI -->

                            <td>
                                ${safeHTML(bmi)}
                            </td>


                            <!-- CALORIES -->

                            <td>
                                ${safeHTML(calories)}
                            </td>


                            <!-- SCORE -->

                            <td>

                                <b>
                                    ${safeHTML(score)}
                                </b>

                            </td>


                            <!-- STATUS -->

                            <td>

                                <span
                                    class="badge-status"
                                >

                                    ${
                                        online
                                            ? "🟢 Online"
                                            : "⚪ Offline"
                                    }

                                </span>

                            </td>


                            <!-- ACTION -->

                            <td>

                                <button
                                    type="button"
                                    class="view-student-btn"
                                    onclick="
                                        openStudentDetails('${uid}')
                                    "
                                >

                                    <i
                                        class="bi bi-person-vcard"
                                    ></i>

                                    View Student

                                </button>

                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}


// ==========================================================
// OPEN SPECIFIC STUDENT
// ==========================================================

function openStudentDetails(uid) {


    selectedStudentUID =
        uid;


    const student =
        adminStudents[uid];


    if (!student) {

        console.error(
            "Student not found:",
            uid
        );

        return;

    }


    // Show section

    const section =
        document.getElementById(
            "studentDetailsSection"
        );


    if (section) {

        section.style.display =
            "block";

    }


    // Render current data

    renderStudentDetails(
        uid,
        student
    );


    // Scroll to section

    setTimeout(
        function() {

            if (section) {

                section.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            }

        },
        100
    );

}


// ==========================================================
// RENDER SPECIFIC STUDENT DETAILS
// ==========================================================

function renderStudentDetails(
    uid,
    student
) {


    if (!student) return;


    const name =
        student.name ||
        (
            student.email
                ? student.email
                    .split("@")[0]
                : "Student"
        );


    // PROFILE

    setText(
        "detailName",
        name
    );


    setText(
        "detailEmail",
        student.email || "--"
    );


    const profile =
        document.getElementById(
            "detailProfilePic"
        );


    if (profile) {

        profile.src =
            student.profilePic ||
            "default-avatar.png";

    }



    // GOAL

    setText(
        "detailGoal",
        student.goal ||
        "General Fitness"
    );



    // BMI

    setText(
        "detailBMI",
        student.bmi ?? "--"
    );



    // WEIGHT

    setText(
        "detailWeight",
        student.weight
            ? student.weight + " kg"
            : "--"
    );



    // HEIGHT

    setText(
        "detailHeight",
        student.height
            ? student.height + " cm"
            : "--"
    );



    // CALORIES

    setText(
        "detailCalories",
        student.calories ?? "--"
    );



    // SCORE

    setText(
        "detailScore",
        student.score ?? 0
    );



    // ACCOUNT STATUS

    setText(
        "detailAccountStatus",
        student.status ||
        "Active"
    );



    // PROVIDER

    setText(
        "detailProvider",
        student.provider ||
        "email"
    );



    // MEALS

    setText(
        "detailMeals",
        formatStudentData(
            student.meals
        )
    );



    // WORKOUTS

    setText(
        "detailWorkouts",
        formatStudentData(
            student.workouts
        )
    );



    // HABITS

    setText(
        "detailHabits",
        formatStudentData(
            student.habits
        )
    );



    // HOBBIES

    setText(
        "detailHobbies",
        formatStudentData(
            student.hobbies
        )
    );



    // WATER

    setText(
        "detailWater",
        formatStudentData(
            student.water
        )
    );



    // SLEEP

    setText(
        "detailSleep",
        formatStudentData(
            student.sleep
        )
    );



    // ONLINE STATUS

    updateSelectedStudentPresence(
        uid
    );



    // LAST UPDATE

    const sync =
        document.getElementById(
            "studentDetailSync"
        );


    if (sync) {

        sync.innerHTML =
            "🟢 Live Firebase — " +
            "Automatically updating";

    }

}


// ==========================================================
// UPDATE SELECTED STUDENT ONLINE STATUS
// ==========================================================

function updateSelectedStudentPresence(uid) {


    if (!selectedStudentUID) return;


    const presence =
        adminPresence[uid] || {};


    const online =
        presence.online === true;


    const status =
        document.getElementById(
            "detailOnlineStatus"
        );


    const dot =
        document.getElementById(
            "detailStatusDot"
        );


    if (!status || !dot) return;


    if (online) {

        status.textContent =
            "Online now";

        dot.classList.add(
            "online"
        );

    } else {

        status.textContent =
            "Offline";

        dot.classList.remove(
            "online"
        );

    }

}


// ==========================================================
// CLOSE STUDENT SECTION
// ==========================================================

const closeStudentDetails =
    document.getElementById(
        "closeStudentDetails"
    );


if (closeStudentDetails) {

    closeStudentDetails.addEventListener(
        "click",
        function() {

            const section =
                document.getElementById(
                    "studentDetailsSection"
                );


            if (section) {

                section.style.display =
                    "none";

            }


            selectedStudentUID =
                null;

        }
    );

}


// ==========================================================
// SET TEXT SAFELY
// ==========================================================

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value ?? "--";

    }

}


// ==========================================================
// FORMAT ARRAYS / OBJECTS
// ==========================================================

function formatStudentData(value) {


    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return "--";

    }


    if (Array.isArray(value)) {

        return value.join(", ");

    }


    if (typeof value === "object") {

        return Object.values(value)
            .join(", ");

    }


    return String(value);

}


// ==========================================================
// BASIC HTML ESCAPE
// ==========================================================

function safeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

} 
document.querySelectorAll(".nav-item").forEach(a=>{if(location.pathname.endsWith(a.getAttribute("href")))a.classList.add("active")});
const logout=document.getElementById("logoutBtn");if(logout)logout.onclick=()=>{localStorage.removeItem("fitnessLoggedIn");localStorage.removeItem("fitnessUserRole");localStorage.removeItem("fitnessUserEmail");location.href="login.html"};
const themeToggle=document.getElementById("themeToggle");if(themeToggle){themeToggle.addEventListener("click",toggleTheme);updateThemeToggle();}
document.getElementById("bmiBtn")?.addEventListener("click",calcBMI);document.getElementById("calorieBtn")?.addEventListener("click",calcCalories);
document.getElementById("sendChat")?.addEventListener("click",()=>{let i=document.getElementById("chatInput");if(!i)return;sendChat(i.value);i.value=""});document.getElementById("chatInput")?.addEventListener("keydown",e=>{if(e.key==="Enter")document.getElementById("sendChat").click()});document.querySelectorAll(".suggestions button").forEach(b=>b.onclick=()=>sendChat(b.dataset.q));
renderWorkouts();renderMeals();renderHabits();renderUsers();

// ==========================================================
// REALTIME STUDENT PRESENCE
// ==========================================================

firebase.auth().onAuthStateChanged(
    function(user) {

        if (!user) return;


        const connectedRef =
            firebase
                .database()
                .ref(".info/connected");


        const presenceRef =
            firebase
                .database()
                .ref(
                    "presence/" +
                    user.uid
                );


        connectedRef.on(
            "value",
            function(snapshot) {


                if (
                    snapshot.val() !== true
                ) {

                    return;

                }


                // Browser close / internet disconnect
                // par Firebase automatically offline karega.

                presenceRef
                    .onDisconnect()
                    .set({

                        online: false,

                        lastSeen:
                            firebase.database.ServerValue.TIMESTAMP

                    });


                // Abhi online

                presenceRef.set({

                    online: true,

                    lastSeen:
                        firebase.database.ServerValue.TIMESTAMP

                });

            }
        );

    }
);