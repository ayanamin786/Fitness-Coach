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

const S = {
    get: (k, d) => {
        try {
            return JSON.parse(localStorage.getItem(k)) ?? d;
        } catch {
            return d;
        }
    },

    set: (k, v) => {
        localStorage.setItem(k, JSON.stringify(v));
    }
};


/* =========================================================
   THEME
========================================================= */

// function applyTheme(theme) {
//     const resolved = theme || S.get("theme", "system");

//     if (resolved === "light") {
//         document.documentElement.setAttribute("data-theme", "light");
//     } 
//     else if (resolved === "dark") {
//         document.documentElement.setAttribute("data-theme", "dark");
//     } 
//     else {
//         document.documentElement.removeAttribute("data-theme");
//     }

//     document.documentElement.style.colorScheme =
//         resolved === "light"
//             ? "light"
//             : resolved === "dark"
//                 ? "dark"
//                 : "light";
// }


// function toggleTheme() {
//     const current = S.get("theme", "system");

//     const next =
//         current === "light"
//             ? "dark"
//             : "light";

//     S.set("theme", next);

//     applyTheme(next);

//     updateThemeToggle();
// }


// function updateThemeToggle() {
//     const button = document.getElementById("themeToggle");

//     if (!button) return;

//     const current = S.get("theme", "system");

//     if (current === "light") {
//         button.innerHTML = "☀️";
//     } 
//     else {
//         button.innerHTML = "🌙";
//     }
// }


// applyTheme(S.get("theme", "system"));


/* =========================================================
   WORKOUTS
========================================================= */

const workouts = [
    ["Push Ups", "Chest", "3", "12", "10 min", "💪"],
    ["Goblet Squats", "Legs", "4", "15", "12 min", "🏋️"],
    ["Dumbbell Row", "Back", "3", "10", "10 min", "🔥"],
    ["Shoulder Press", "Shoulders", "3", "12", "8 min", "⚡"],
    ["Plank", "Core", "3", "45 sec", "5 min", "◈"],
    ["Lunges", "Legs", "3", "12", "9 min", "🦵"]
];


function renderWorkouts() {

    const el = document.getElementById("workoutGrid");

    if (!el) return;

    const d = S.get("workouts", []);

    el.innerHTML = workouts.map((w, i) => `
        <div class="workout-card">

            <div class="exercise-top">
                <span class="exercise-icon">${w[5]}</span>
                <span class="status-chip">${w[1]}</span>
            </div>

            <div class="exercise-name">
                ${w[0]}
            </div>

            <div class="exercise-meta">
                Strength • Beginner friendly
            </div>

            <div class="exercise-data">
                <span>${w[2]} sets</span>
                <span>${w[3]} reps</span>
                <span>${w[4]}</span>
            </div>

            <button
                class="complete-btn ${d.includes(i) ? "done" : ""}"
                onclick="toggleWorkout(${i})"
            >
                ${d.includes(i) ? "✓ Completed" : "Mark complete"}
            </button>

        </div>
    `).join("");
}


function toggleWorkout(i) {

    let d = S.get("workouts", []);

    d = d.includes(i)
        ? d.filter(x => x !== i)
        : [...d, i];

    S.set("workouts", d);

    renderWorkouts();
}


/* =========================================================
   MEALS
========================================================= */

const meals = [
    ["BREAKFAST", "Protein Oat Bowl", 420, "28g", "08:00"],
    ["LUNCH", "Chicken Power Bowl", 610, "46g", "13:00"],
    ["SNACK", "Greek Yogurt + Berries", 280, "20g", "16:30"],
    ["DINNER", "Salmon & Rice", 530, "42g", "20:00"]
];


function renderMeals() {

    const el = document.getElementById("mealGrid");

    if (!el) return;

    const d = S.get("meals", []);

    el.innerHTML = meals.map((m, i) => `
        <div class="meal-card">

            <span class="meal-type">
                ${m[0]}
            </span>

            <h3>${m[1]}</h3>

            <p>
                Balanced fuel • ${m[4]}
            </p>

            <div class="meal-kcal">
                ${m[2]}
                <small>
                    kcal · ${m[3]} protein
                </small>
            </div>

            <button
                class="meal-btn ${d.includes(i) ? "done" : ""}"
                onclick="toggleMeal(${i})"
            >
                ${d.includes(i)
                    ? "✓ Meal completed"
                    : "Complete meal"}
            </button>

        </div>
    `).join("");
}


function toggleMeal(i) {

    let d = S.get("meals", []);

    d = d.includes(i)
        ? d.filter(x => x !== i)
        : [...d, i];

    S.set("meals", d);

    renderMeals();
}


/* =========================================================
   HABITS
========================================================= */

const habits = [
    ["💧", "Water", "6 of 8 glasses"],
    ["🥗", "Meals", "3 of 4 completed"],
    ["🏋️", "Workout", "Today's session"],
    ["😴", "Sleep", "7+ hours target"]
];


function renderHabits() {

    const el = document.getElementById("habitList");

    if (!el) return;

    let h = S.get(
        "habits",
        [true, true, true, false]
    );

    el.innerHTML = habits.map((x, i) => `
        <div class="habit-row">

            <div class="habit-info">

                <i>${x[0]}</i>

                <div>
                    <b>${x[1]}</b>
                    <small>${x[2]}</small>
                </div>

            </div>

            <button
                class="check-btn ${h[i] ? "done" : ""}"
                onclick="toggleHabit(${i})"
            >
                ${h[i] ? "✓" : "+"}
            </button>

        </div>
    `).join("");


    const p =
        Math.round(
            h.filter(Boolean).length / 4 * 100
        );


    const habitScore =
        document.getElementById("habitScore");

    if (habitScore) {
        habitScore.textContent = p + "%";
    }


    const habitRing =
        document.getElementById("habitRing");

    if (habitRing) {
        habitRing.textContent = p + "%";
    }
}


function toggleHabit(i) {

    let h = S.get(
        "habits",
        [true, true, true, false]
    );

    h[i] = !h[i];

    S.set("habits", h);

    renderHabits();
}


/* =========================================================
   BMI
========================================================= */

function calcBMI() {

    const height =
        Number(
            document.getElementById("height")?.value
        );

    const weight =
        Number(
            document.getElementById("weight")?.value
        );


    if (!height || !weight) {
        return;
    }


    const bmi =
        Number(
            (
                weight /
                ((height / 100) ** 2)
            ).toFixed(1)
        );


    const bmiValue =
        document.getElementById("bmiValue");

    const bmiStatus =
        document.getElementById("bmiStatus");


    if (bmiValue) {
        bmiValue.textContent = bmi;
    }


    if (bmiStatus) {

        bmiStatus.textContent =
            bmi < 18.5
                ? "UNDERWEIGHT"
                : bmi < 25
                    ? "NORMAL"
                    : bmi < 30
                        ? "OVERWEIGHT"
                        : "OBESITY";
    }


    S.set("bmi", bmi);
}


/* =========================================================
   CALORIES
========================================================= */

function calcCalories() {

    const weight =
        Number(
            document.getElementById("weight")?.value
        ) || 70;


    const height =
        Number(
            document.getElementById("height")?.value
        ) || 175;


    const age = 13;


    const calories =
        Math.round(
            (
                10 * weight +
                6.25 * height -
                5 * age +
                5
            ) * 1.55 + 250
        );


    const calorieValue =
        document.getElementById("calorieValue");


    if (calorieValue) {
        calorieValue.textContent =
            calories.toLocaleString();
    }


    S.set("calories", calories);
}


/* =========================================================
   CHAT
========================================================= */

function chatReply(m) {

    m = m.toLowerCase();


    if (m.includes("water")) {
        return "Your target is 8 glasses. You are currently at 6/8.";
    }


    if (m.includes("workout")) {
        return "Today's workout includes Push Ups, Goblet Squats, Dumbbell Row, Shoulder Press, Plank and Lunges.";
    }


    if (m.includes("bmi")) {
        return "Your saved BMI is " +
            S.get("bmi", 22.9) +
            ".";
    }


    if (
        m.includes("eat") ||
        m.includes("nutrition")
    ) {
        return "Try the Protein Oat Bowl, Chicken Power Bowl, Greek Yogurt + Berries and Salmon & Rice.";
    }


    return "I can help with workout, water, BMI, nutrition and progress.";
}


function sendChat(t) {

    if (!t.trim()) return;


    const b =
        document.getElementById("chatMessages");


    if (!b) return;


    b.innerHTML += `
        <div class="message user">
            <div>
                <p>${safeHTML(t)}</p>
            </div>
        </div>
    `;


    setTimeout(() => {

        b.innerHTML += `
            <div class="message bot">

                <span class="bot-avatar">
                    ✦
                </span>

                <div>
                    <small>
                        AI FITNESS COACH
                    </small>

                    <p>
                        ${safeHTML(chatReply(t))}
                    </p>
                </div>

            </div>
        `;


        b.scrollTop = b.scrollHeight;

    }, 350);
}


/* =========================================================
   FIREBASE ADMIN STUDENTS
========================================================= */

let adminStudents = {};
let adminPresence = {};
let selectedStudentUID = null;


function initAdminFirebase() {

    if (
        typeof firebase === "undefined" ||
        !firebase.database
    ) {

        console.error(
            "Firebase Database SDK is not loaded."
        );

        return;
    }


    const studentsRef =
        firebase.database().ref("students");


    const presenceRef =
        firebase.database().ref("presence");


    /* =====================================================
       STUDENTS REALTIME
    ===================================================== */

    studentsRef.on(
        "value",

        function(snapshot) {

            adminStudents =
                snapshot.val() || {};


            updateAdminStats();

            renderFirebaseStudents();


            if (selectedStudentUID) {

                const student =
                    adminStudents[
                        selectedStudentUID
                    ];


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

                badge.textContent =
                    "❌ Firebase Error";
            }
        }
    );


    /* =====================================================
       PRESENCE REALTIME
    ===================================================== */

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
                "Presence Firebase Error:",
                error
            );
        }
    );
}


/* =========================================================
   ADMIN STATS
========================================================= */

function updateAdminStats() {

    const students =
        Object.keys(adminStudents);


    const total =
        students.length;


    const totalElement =
        document.getElementById(
            "totalUsers"
        );


    if (totalElement) {
        totalElement.textContent = total;
    }


    let active = 0;


    students.forEach(uid => {

        if (
            adminPresence[uid] &&
            adminPresence[uid].online === true
        ) {
            active++;
        }
    });


    const activeElement =
        document.getElementById(
            "activeUsers"
        );


    if (activeElement) {
        activeElement.textContent = active;
    }


    let plans = 0;


    students.forEach(uid => {

        const student =
            adminStudents[uid];


        if (
            student &&
            student.goal &&
            String(student.goal).trim() !== ""
        ) {
            plans++;
        }
    });


    const plansElement =
        document.getElementById(
            "plansGenerated"
        );


    if (plansElement) {
        plansElement.textContent = plans;
    }


    const syncElement =
        document.getElementById(
            "aiConversations"
        );


    if (syncElement) {
        syncElement.textContent = total;
    }


    const badge =
        document.getElementById(
            "syncBadge"
        );


    if (badge) {

        badge.innerHTML =
            '<span class="live-sync-dot"></span> Live — Firebase synced';
    }
}


/* =========================================================
   RENDER FIREBASE STUDENTS
========================================================= */

function renderFirebaseStudents() {

    const table =
        document.getElementById(
            "userTable"
        );


    if (!table) return;


    const studentEntries =
        Object.entries(adminStudents);


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


    table.innerHTML =
        studentEntries.map(
            function(entry) {

                const uid =
                    entry[0];


                const student =
                    entry[1] || {};


                const name =
                    student.name ||
                    (
                        student.email
                            ? student.email.split("@")[0]
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


                const score =
                    student.score ?? 0;


                const online =
                    adminPresence[uid] &&
                    adminPresence[uid].online === true;


                return `
                    <tr class="student-row">

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


                        <td>
                            ${safeHTML(goal)}
                        </td>


                        <td>
                            ${student.bmi ?? "--"}
                        </td>


                        <td>
                            ${student.calories ?? "--"}
                        </td>


                        <td>
                            <b>
                                ${safeHTML(score)}
                            </b>
                        </td>


                        <td>

                            <span class="badge-status">

                                ${
                                    online
                                        ? "🟢 Online"
                                        : "⚪ Offline"
                                }

                            </span>

                        </td>


                        <td>

                            <button
                                type="button"
                                class="view-student-btn"
                                data-uid="${safeHTML(uid)}"
                            >

                                <i class="bi bi-person-vcard"></i>

                                View Student

                            </button>

                        </td>

                    </tr>
                `;
            }
        ).join("");


    /* =====================================================
       IMPORTANT:
       NO INLINE onclick
    ===================================================== */

    table
        .querySelectorAll(".view-student-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    const uid =
                        this.dataset.uid;

                    openStudentDetails(uid);
                }
            );
        });
}


/* =========================================================
   OPEN STUDENT DETAILS
========================================================= */

function openStudentDetails(uid) {

    console.log(
        "Opening student:",
        uid
    );


    selectedStudentUID = uid;


    const student =
        adminStudents[uid];


    if (!student) {

        console.error(
            "Student not found:",
            uid
        );


        if (typeof Swal !== "undefined") {

            Swal.fire({
                icon: "error",
                title: "Student Not Found",
                text: "This student's data could not be found in Firebase."
            });

        } 
        else {

            alert(
                "Student data not found."
            );
        }


        return;
    }


    const section =
        document.getElementById(
            "studentDetailsSection"
        );


    if (!section) {

        console.error(
            "studentDetailsSection not found in HTML."
        );


        alert(
            "studentDetailsSection admin.html mein nahi mila."
        );


        return;
    }


    section.style.display =
        "block";


    renderStudentDetails(
        uid,
        student
    );


    setTimeout(() => {

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);
}


/* =========================================================
   RENDER STUDENT DETAILS
========================================================= */

function renderStudentDetails(
    uid,
    student
) {

    if (!student) return;


    const name =
        student.name ||
        (
            student.email
                ? student.email.split("@")[0]
                : "Student"
        );


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


    setText(
        "detailGoal",
        student.goal ||
        "General Fitness"
    );


    setText(
        "detailBMI",
        student.bmi ?? "--"
    );


    setText(
        "detailWeight",
        student.weight
            ? student.weight + " kg"
            : "--"
    );


    setText(
        "detailHeight",
        student.height
            ? student.height + " cm"
            : "--"
    );


    setText(
        "detailCalories",
        student.calories ?? "--"
    );


    setText(
        "detailScore",
        student.score ?? 0
    );


    setText(
        "detailAccountStatus",
        student.status || "Active"
    );


    setText(
        "detailProvider",
        student.provider || "email"
    );


    setText(
        "detailMeals",
        formatStudentData(student.meals)
    );


    setText(
        "detailWorkouts",
        formatStudentData(student.workouts)
    );


    setText(
        "detailHabits",
        formatStudentData(student.habits)
    );


    setText(
        "detailHobbies",
        formatStudentData(student.hobbies)
    );


    setText(
        "detailWater",
        formatStudentData(student.water)
    );


    setText(
        "detailSleep",
        formatStudentData(student.sleep)
    );


    updateSelectedStudentPresence(uid);


    const sync =
        document.getElementById(
            "studentDetailSync"
        );


    if (sync) {

        sync.innerHTML =
            "🟢 Live Firebase — Automatically updating";
    }
}


/* =========================================================
   STUDENT PRESENCE
========================================================= */

function updateSelectedStudentPresence(uid) {

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

    } 
    else {

        status.textContent =
            "Offline";

        dot.classList.remove(
            "online"
        );
    }
}


/* =========================================================
   CLOSE STUDENT DETAILS
========================================================= */

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


            selectedStudentUID = null;
        }
    );
}


/* =========================================================
   SAFE TEXT
========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value ?? "--";
    }
}


/* =========================================================
   FORMAT STUDENT DATA
========================================================= */

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


/* =========================================================
   HTML ESCAPE
========================================================= */

function safeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   MAKE FUNCTIONS GLOBAL
========================================================= */

window.openStudentDetails =
    openStudentDetails;

window.toggleWorkout =
    toggleWorkout;

window.toggleMeal =
    toggleMeal;

window.toggleHabit =
    toggleHabit;

window.calcBMI =
    calcBMI;

window.calcCalories =
    calcCalories;


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        initAdminFirebase();

        renderWorkouts();
        renderMeals();
        renderHabits();


        const bmiBtn =
            document.getElementById(
                "bmiBtn"
            );

        if (bmiBtn) {
            bmiBtn.addEventListener(
                "click",
                calcBMI
            );
        }


        const calorieBtn =
            document.getElementById(
                "calorieBtn"
            );

        if (calorieBtn) {
            calorieBtn.addEventListener(
                "click",
                calcCalories
            );
        }


        const themeToggle =
            document.getElementById(
                "themeToggle"
            );

        if (themeToggle) {

            themeToggle.addEventListener(
                "click",
                toggleTheme
            );

            updateThemeToggle();
        }


        const sendChatButton =
            document.getElementById(
                "sendChat"
            );


        if (sendChatButton) {

            sendChatButton.addEventListener(
                "click",
                function() {

                    const input =
                        document.getElementById(
                            "chatInput"
                        );


                    if (!input) return;


                    sendChat(
                        input.value
                    );


                    input.value = "";
                }
            );
        }


        const chatInput =
            document.getElementById(
                "chatInput"
            );


        if (chatInput) {

            chatInput.addEventListener(
                "keydown",
                function(e) {

                    if (e.key === "Enter") {

                        const send =
                            document.getElementById(
                                "sendChat"
                            );

                        if (send) {
                            send.click();
                        }
                    }
                }
            );
        }


        const logout =
            document.getElementById(
                "logoutBtn"
            );


        if (logout) {

            logout.addEventListener(
                "click",
                function() {

                    localStorage.removeItem(
                        "fitnessLoggedIn"
                    );

                    localStorage.removeItem(
                        "fitnessUserRole"
                    );

                    localStorage.removeItem(
                        "fitnessUserEmail"
                    );

                    location.href =
                        "login.html";
                }
            );
        }

    }
);

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
renderWorkouts();
renderMeals();
renderHabits();
renderUsers();

window.openStudentDetails = openStudentDetails;


document.addEventListener("DOMContentLoaded", function () {

    const menuBtn = document.getElementById("mobileMenuBtn");
    const sidebar = document.getElementById("mainSidebar");

    if (!menuBtn || !sidebar) {
        console.error("Sidebar ya menu button nahi mila.");
        return;
    }


    function toggleSidebar() {

        const isOpen =
            sidebar.classList.toggle("sidebar-open");

        document.body.classList.toggle(
            "sidebar-menu-open",
            isOpen
        );

        menuBtn.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );


        const icon = menuBtn.querySelector("i");

        if (icon) {

            icon.className = isOpen
                ? "bi bi-x-lg"
                : "bi bi-list";

        }

    }


    menuBtn.addEventListener(
        "click",
        toggleSidebar
    );


    /* Close sidebar when clicking overlay */

    document.addEventListener(
        "click",
        function (event) {

            if (!sidebar.classList.contains("sidebar-open")) {
                return;
            }


            const clickedInsideSidebar =
                sidebar.contains(event.target);

            const clickedMenuButton =
                menuBtn.contains(event.target);


            if (
                !clickedInsideSidebar &&
                !clickedMenuButton
            ) {

                sidebar.classList.remove(
                    "sidebar-open"
                );

                document.body.classList.remove(
                    "sidebar-menu-open"
                );

                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );


                const icon =
                    menuBtn.querySelector("i");

                if (icon) {
                    icon.className = "bi bi-list";
                }

            }

        }
    );


    /* Close sidebar after clicking navigation link */

    sidebar.querySelectorAll(".nav-item").forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    sidebar.classList.remove(
                        "sidebar-open"
                    );

                    document.body.classList.remove(
                        "sidebar-menu-open"
                    );

                    menuBtn.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    const icon =
                        menuBtn.querySelector("i");

                    if (icon) {
                        icon.className =
                            "bi bi-list";
                    }

                }
            );

        }
    );


    /* Close with ESC */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                sidebar.classList.remove(
                    "sidebar-open"
                );

                document.body.classList.remove(
                    "sidebar-menu-open"
                );

                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );


                const icon =
                    menuBtn.querySelector("i");

                if (icon) {
                    icon.className =
                        "bi bi-list";
                }

            }

        }
    );

});