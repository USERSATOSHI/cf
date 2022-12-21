Chart.defaults.backgroundColor = "#9BD0F5";
Chart.defaults.borderColor = "#ffffff";
Chart.defaults.color = "#ffffff";
var userStatus = null;
function randomrgb() {
    var o = Math.round,
        r = Math.random,
        s = 255;
    return "rgb(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + ")";
}
//   bright colors
var colorMaprgba = {
    OK: "rgba(0, 255, 0, 0.5)",
    WRONG_ANSWER: "rgba(255, 0, 0, 0.5)",
    PARTIAL: "rgba(255, 255, 0, 0.5)",
    COMPILATION_ERROR: "rgba(255, 0, 255, 0.5)",
    RUNTIME_ERROR: "rgba(0, 255, 255, 0.5)",
    TIME_LIMIT_EXCEEDED: "rgba(0, 0, 255, 0.5)",
    MEMORY_LIMIT_EXCEEDED: "rgba(0, 0, 0, 0.5)",
    PRESENTATION_ERROR: "rgba(255, 255, 255, 0.5)",
    CHALLENGED: "rgba(255, 255, 255, 0.5)",
    SKIPPED: "rgba(255, 255, 255, 0.5)",
};

var borderColorMap = {
    OK: "rgba(0, 255, 0, 0.5)",
    WRONG_ANSWER: "rgba(255, 0, 0, 0.5)",
    COMPILATION_ERROR: "rgba(255, 255, 0, 0.5)",
    RUNTIME_ERROR: "rgba(255, 0, 255, 0.5)",
    TIME_LIMIT_EXCEEDED: "rgba(0, 0, 255, 0.5)",
    MEMORY_LIMIT_EXCEEDED: "rgba(0, 255, 255, 0.5)",
    PRESENTATION_ERROR: "rgba(255, 255, 255, 0.5)",
    CHALLENGED: "rgba(255, 255, 255, 0.5)",
    SKIPPED: "rgba(255, 255, 255, 0.5)",
};

var currentVerdictChart = null;
var currentProblemChart = null;
var currentLanguageChart = null;
var currentRatesChart = null;
var currentTagsChart = null;

var userStatusVerdicts = new Map();
var userstatusProblems = new Map();
var userStatusLanguages = new Map();
var userstatusRates = new Map();
var userstatusTags = new Map();
async function loadProfile() {
    const auth = await window.electron.store.get("auth");
    console.log(auth);
    const { handle, apiKey, secret } = auth;
    console.log(apiKey, secret, handle);
    const user = await window.electron.requestAPI("user.info", {
        handles: handle,
    });
    if (user.status === "FAILED") {
        window.location.href = "./auth/index.html";
        alert("Invalid Credentials");
    } else {
        const userinfo = document.getElementById("userinfo");

        const { result } = user;
        const {
            lastName,
            country,
            lastOnlineTimeSeconds,
            city,
            rating,
            friendOfCount,
            titlePhoto,
            avatar,
            firstName,
            contribution,
            organization,
            rank,
            maxRating,
            registrationTimeSeconds,
            maxRank,
        } = result[0];
        const userhandle = result[0].handle;
        const userimg = document.getElementById("userimg");
        userimg.src = titlePhoto;
        userinfo.innerHTML = `
    <div class = "handle">  <span class= "${rank}">${userhandle}</span> ${
            firstName || lastName
                ? `(${firstName || ""} ${lastName || ""})`
                : ""
        } </div>
    <div class = "rating">  <span class= "${rank}">${rating}</span>/(Max: <span class= "${maxRank}">${maxRating}</span> ) </div>
    <div class = "rank">   <span class= "${rank}">${rank}</span>/(Max: <span class= "${maxRank}">${maxRank}</span> ) </div>
    <div class = "organization">  ${organization} </div>
    <div class = "location">  ${city || "N/A"},${country || "N/A"} </div>
    <div class = "contribution">  ${contribution} </div>
    <div class = "lastonline">  Last Online: ${new Date(
        lastOnlineTimeSeconds * 1000,
    ).toLocaleString()} </div>
    <div class = "registration">  Registration: ${new Date(
        registrationTimeSeconds * 1000,
    ).toLocaleString()} </div>
     <div class = "friends" id=fri>  Friends: ${friendOfCount} </div>
    `;

        const fri = document.getElementById("fri");

        if (apiKey && secret) {
            fri.style.cursor = "pointer";
        }
        fri?.addEventListener("click", async () => {
            if (
                apiKey &&
                secret
            ) {
                window.location.href = `../friends/index.html`;
            }
        });
    }
}
document.addEventListener("DOMContentLoaded", async () => {
    await loadProfile();
    const uuser = window.location.search.split("=")[1];
    console.log(uuser);
    const user = (
        await window.electron.requestAPI("user.info", { handles: uuser })
    ).result[0];
    const {
        lastName,
        country,
        lastOnlineTimeSeconds,
        city,
        rating,
        friendOfCount,
        titlePhoto,
        avatar,
        firstName,
        handle,
        contribution,
        organization,
        rank,
        maxRating,
        registrationTimeSeconds,
        maxRank,
    } = user;
    const userStatus = (
        await window.electron.requestAPI("user.status", {
            handle,
            from: 1,
        })
    ).result;

    const rateduser = document.getElementById("rateduser");
    rateduser.innerHTML = `
                <h1>USER</h1>
               <div class=uimg>
                    <img src="${user.titlePhoto}" alt="${user.handle}">
               </div>
               <div class = "handle">  <span class= "${rank}">${handle}</span> ${
        firstName || lastName ? `(${firstName || ""} ${lastName || ""})` : ""
    } </div>
    <div class = "urating">  <span class= "${rank}">${rating}</span>/(Max: <span class= "${maxRank}">${maxRating}</span> ) </div>
    <div class = "urank">   <span class= "${rank}">${rank}</span>/(Max: <span class= "${maxRank}">${maxRank}</span> ) </div>
    <div class = "uorganization">  ${organization} </div>
    <div class = "ulocation">  ${city || "N/A"},${country || "N/A"} </div>
    <div class = "ucontribution">  ${contribution} </div>
    <div class = "ulastonline">  Last Online: ${new Date(
        lastOnlineTimeSeconds * 1000,
    ).toLocaleString()} </div>
    <div class = "uregistration">  Registration: ${new Date(
        registrationTimeSeconds * 1000,
    ).toLocaleString()} </div>
    <div class = "ufriends" id=fribtn >  Friends: ${friendOfCount} </div>
    <div class="submissions" id="subopen">Submissions</div>
                `;
    const subopen = document.getElementById("subopen");
    subopen?.addEventListener("click", () => {
        window.location.href = `../submissions/index.html?handle=${user.handle}`;
    });

    const fribtn = document.getElementById("fribtn");
    const auth = await window.electron.store.get( "auth" );
    if ( auth.apiKey && auth.secret && auth.handle.toLowerCase() === uuser.toLowerCase() )
    {
        fribtn.style.cursor = "pointer";
        fribtn.style.color = "blue";
    }
    fribtn?.addEventListener("click", async () => {
        if (user.handle.toLowerCase() === auth.handle.toLowerCase() && auth.apiKey && auth.secret) {
            window.location.href = `../friends/index.html`;
        }
    });

    userStatus.forEach((x) => {
        userStatusVerdicts.set(
            x.verdict,
            userStatusVerdicts.get(x.verdict) + 1 || 1,
        );
        userstatusProblems.set(
            x.problem.index,
            userstatusProblems.get(x.problem.index) +
                (x.verdict === "OK" ? 1 : 0) || (x.verdict === "OK" ? 1 : 0),
        );
        userstatusRates.set(
            x.problem.rating,
            userstatusRates.get(x.problem.rating) +
                (x.verdict === "OK" ? 1 : 0) || (x.verdict === "OK" ? 1 : 0),
        );
        x.problem.tags.forEach((y) => {
            userstatusTags.set(
                y,
                userstatusTags.get(y) + (x.verdict === "OK" ? 1 : 0) ||
                    (x.verdict === "OK" ? 1 : 0),
            );
        });
        userStatusLanguages.set(
            x.programmingLanguage,
            userStatusLanguages.get(x.programmingLanguage) + 1 || 1,
        );
    });
    userStatusLanguages = new Map([...userStatusLanguages.entries()].sort());
    userstatusTags = new Map(
        [...userstatusTags.entries()].filter((x) => x[1]).sort(),
    );
    userstatusRates = new Map(
        [...userstatusRates.entries()]
            .filter((x) => x[1])
            .sort((a, b) => a[0] - b[0]),
    );
    userstatusProblems = new Map(
        [...userstatusProblems.entries()].filter((x) => x[1]).sort(),
    );
    userStatusVerdicts = new Map([...userStatusVerdicts.entries()].sort());
    renderPieChart();
    renderprobPieChart();
    renderlangPieChart();
    renderRatesPieChart();
    renderTagsPieChart();
    renderRatingLineChart();
});

function renderPieChart() {
    currentVerdictChart?.destroy();

    const ctx = document.getElementById("stats");

    const keys = Array.from(userStatusVerdicts.keys());
    currentVerdictChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: keys,
            datasets: [
                {
                    label: "User Status",
                    data: Array.from(userStatusVerdicts.values()),
                    backgroundColor: keys.map((x) => colorMaprgba[x]),
                    borderColor: keys.map((x) => borderColorMap[x]),
                    borderWidth: 1,
                    hoverOffset: 20,
                },
            ],
        },
        options: {
            borderRadius: 0,
            animation: {
                animateRotate: true,
                animateScale: true,
            },
            radius: "75%",
        },
    });
}
function renderBarChart() {
    currentVerdictChart?.destroy();
    const ctx = document.getElementById("stats");
    const keys = Array.from(userStatusVerdicts.keys());
    currentVerdictChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: keys,
            datasets: [
                {
                    label: "User Status",
                    data: Array.from(userStatusVerdicts.values()),
                    backgroundColor: keys.map((x) => colorMaprgba[x]),
                    borderColor: keys.map((x) => borderColorMap[x]),
                    borderWidth: 1,
                    hoverOffset: 20,
                },
            ],
        },
        options: {
            indexAxis: "y",
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                },
                y: {
                    grid: {
                        display: false,
                    },
                },
            },
        },
    });
}
function renderRadarChart() {
    currentVerdictChart?.destroy();
    const ctx = document.getElementById("stats");
    const keys = Array.from(userStatusVerdicts.keys());
    currentVerdictChart = new Chart(ctx, {
        type: "radar",
        data: {
            labels: keys,
            datasets: [
                {
                    label: "User Status",
                    data: Array.from(userStatusVerdicts.values()),
                    fill: true,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderColor: "rgba(255, 255, 255,0.5)",
                    pointBackgroundColor: "rgba(255, 255, 255,0.5)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgb(54, 162, 235)",
                },
            ],
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3,
                },
            },
            scales: {
                r: {
                    angleLines: {
                        display: false,
                    },
                    animate: true,
                    pointLabels: {
                        display: true,
                        color: "white",
                    },
                    ticks: {
                        display: false,
                    },
                },
            },
        },
    });
}

function renderprobPieChart() {
    currentProblemChart?.destroy();
    const ctxprobtypes = document.getElementById("probtypes");
    const keysprob = Array.from(userstatusProblems.keys());
    currentProblemChart = new Chart(ctxprobtypes, {
        type: "doughnut",
        data: {
            labels: keysprob,
            datasets: [
                {
                    label: "Problem Types",
                    data: Array.from(userstatusProblems.values()),
                    backgroundColor: keysprob.map((x) => `${randomrgb()}`),
                    borderWidth: 1,
                    hoverOffset: 20,
                },
            ],
        },
        options: {
            borderRadius: 0,
            animation: {
                animateRotate: true,
                animateScale: true,
            },
            radius: "75%",
        },
    });
}
function renderprobBarChart() {
    currentProblemChart?.destroy();
    const ctxprobtypes = document.getElementById("probtypes");
    const keysprob = Array.from(userstatusProblems.keys());
    currentProblemChart = new Chart(ctxprobtypes, {
        type: "bar",
        data: {
            labels: keysprob,
            datasets: [
                {
                    label: "Problem Types",
                    data: Array.from(userstatusProblems.values()),
                    backgroundColor: keysprob.map((x) => `${randomrgb()}`),
                    borderWidth: 1,
                    hoverOffset: 20,
                },
            ],
        },
        options: {
            indexAxis: "y",
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                },
                y: {
                    grid: {
                        display: false,
                    },
                },
            },
        },
    });
}
function renderprobRadarChart() {
    currentProblemChart?.destroy();
    const ctxprobtypes = document.getElementById("probtypes");
    const keysprob = Array.from(userstatusProblems.keys());
    currentProblemChart = new Chart(ctxprobtypes, {
        type: "radar",
        data: {
            labels: keysprob,
            datasets: [
                {
                    label: "Problem Types",
                    data: Array.from(userstatusProblems.values()),
                    fill: true,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderColor: "rgba(255, 255, 255,0.5)",
                    pointBackgroundColor: "rgba(255, 255, 255,0.5)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgb(54, 162, 235)",
                },
            ],
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3,
                },
            },
            scales: {
                r: {
                    angleLines: {
                        display: false,
                    },
                    animate: true,
                    pointLabels: {
                        display: true,
                        color: "white",
                    },
                    ticks: {
                        display: false,
                    },
                },
            },
        },
    });
}

function renderlangPieChart() {
    currentLanguageChart?.destroy();
    const ctxlang = document.getElementById("lang");
    const keyslang = Array.from(userStatusLanguages.keys());
    currentLanguageChart = new Chart(ctxlang, {
        type: "doughnut",
        data: {
            labels: keyslang,
            datasets: [
                {
                    label: "Language",
                    data: Array.from(userStatusLanguages.values()),
                    backgroundColor: keyslang.map((x) => `${randomrgb()}`),
                    borderWidth: 1,
                    hoverOffset: 20,
                },
            ],
        },
        options: {
            borderRadius: 0,
            animation: {
                animateRotate: true,
                animateScale: true,
            },
            radius: "75%",
        },
    });
}
function renderlangBarChart() {
    currentLanguageChart?.destroy();
    const ctxlang = document.getElementById("lang");
    const keyslang = Array.from(userStatusLanguages.keys());
    currentLanguageChart = new Chart(ctxlang, {
        type: "bar",
        data: {
            labels: keyslang,
            datasets: [
                {
                    label: "Language",
                    data: Array.from(userStatusLanguages.values()),
                    backgroundColor: keyslang.map((x) => `${randomrgb()}`),
                    borderWidth: 1,
                    hoverOffset: 20,
                },
            ],
        },
        options: {
            indexAxis: "y",
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                },
                y: {
                    grid: {
                        display: false,
                    },
                },
            },
        },
    });
}
function renderlangRadarChart() {
    currentLanguageChart?.destroy();
    const ctxlang = document.getElementById("lang");
    const keyslang = Array.from(userStatusLanguages.keys());
    currentLanguageChart = new Chart(ctxlang, {
        type: "radar",
        data: {
            labels: keyslang,
            datasets: [
                {
                    label: "Language",
                    data: Array.from(userStatusLanguages.values()),
                    fill: true,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderColor: "rgba(255, 255, 255,0.5)",
                    pointBackgroundColor: "rgba(255, 255, 255,0.5)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgb(54, 162, 235)",
                },
            ],
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3,
                },
            },
            scales: {
                r: {
                    angleLines: {
                        display: false,
                    },
                    animate: true,
                    pointLabels: {
                        display: true,
                        color: "white",
                    },
                    ticks: {
                        display: false,
                    },
                },
            },
        },
    });
}

function renderRatesPieChart() {
    currentRatesChart?.destroy();
    const ctxrates = document.getElementById("rates");
    const keysrates = Array.from(userstatusRates.keys());
    currentRatesChart = new Chart(ctxrates, {
        type: "doughnut",
        data: {
            labels: keysrates,
            datasets: [
                {
                    label: "Rates",
                    data: Array.from(userstatusRates.values()),
                    backgroundColor: keysrates.map((x) => `${randomrgb()}`),
                    borderWidth: 1,
                    hoverOffset: 20,
                },
            ],
        },
        options: {
            borderRadius: 0,
            animation: {
                animateRotate: true,
                animateScale: true,
            },
            radius: "75%",
        },
    });
}
function renderRatesBarChart() {
    currentRatesChart?.destroy();
    const ctxrates = document.getElementById("rates");
    const keysrates = Array.from(userstatusRates.keys());
    currentRatesChart = new Chart(ctxrates, {
        type: "bar",
        data: {
            labels: keysrates,
            datasets: [
                {
                    label: "Rates",
                    data: Array.from(userstatusRates.values()),
                    backgroundColor: keysrates.map((x) => `${randomrgb()}`),
                    borderWidth: 1,
                    hoverOffset: 20,
                },
            ],
        },
        options: {
            indexAxis: "y",
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                },
                y: {
                    grid: {
                        display: false,
                    },
                },
            },
        },
    });
}
function renderRatesRadarChart() {
    currentRatesChart?.destroy();
    const ctxrates = document.getElementById("rates");
    const keysrates = Array.from(userstatusRates.keys());
    currentRatesChart = new Chart(ctxrates, {
        type: "radar",
        data: {
            labels: keysrates,
            datasets: [
                {
                    label: "Rates",
                    data: Array.from(userstatusRates.values()),
                    fill: true,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderColor: "rgba(255, 255, 255,0.5)",
                    pointBackgroundColor: "rgba(255, 255, 255,0.5)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgb(54, 162, 235)",
                },
            ],
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3,
                },
            },
            scales: {
                r: {
                    angleLines: {
                        display: false,
                    },
                    animate: true,
                    pointLabels: {
                        display: true,
                        color: "white",
                    },
                    ticks: {
                        display: false,
                    },
                },
            },
        },
    });
}

function renderTagsPieChart() {
    currentTagsChart?.destroy();
    const ctxtags = document.getElementById("tags");
    const keystags = Array.from(userstatusTags.keys());
    currentTagsChart = new Chart(ctxtags, {
        type: "doughnut",
        data: {
            labels: keystags,
            datasets: [
                {
                    label: "Tags",
                    data: Array.from(userstatusTags.values()),
                    backgroundColor: keystags.map((x) => `${randomrgb()}`),
                    borderWidth: 1,
                    hoverOffset: 20,
                },
            ],
        },
        options: {
            borderRadius: 0,
            animation: {
                animateRotate: true,
                animateScale: true,
            },
            radius: "75%",
        },
    });
}
function renderTagsBarChart() {
    currentTagsChart?.destroy();
    const ctxtags = document.getElementById("tags");
    const keystags = Array.from(userstatusTags.keys());
    currentTagsChart = new Chart(ctxtags, {
        type: "bar",
        data: {
            labels: keystags,
            datasets: [
                {
                    label: "Tags",
                    data: Array.from(userstatusTags.values()),
                    backgroundColor: keystags.map((x) => `${randomrgb()}`),
                    borderWidth: 1,
                    hoverOffset: 20,
                },
            ],
        },
        options: {
            indexAxis: "y",
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                },
                y: {
                    grid: {
                        display: false,
                    },
                },
            },
        },
    });
}
function renderTagsRadarChart() {
    currentTagsChart?.destroy();
    const ctxtags = document.getElementById("tags");
    const keystags = Array.from(userstatusTags.keys());
    currentTagsChart = new Chart(ctxtags, {
        type: "radar",
        data: {
            labels: keystags,
            datasets: [
                {
                    label: "Tags",
                    data: Array.from(userstatusTags.values()),
                    fill: true,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderColor: "rgba(255, 255, 255,0.5)",
                    pointBackgroundColor: "rgba(255, 255, 255,0.5)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgb(54, 162, 235)",
                },
            ],
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3,
                },
            },
            scales: {
                r: {
                    angleLines: {
                        display: false,
                    },
                    animate: true,
                    pointLabels: {
                        display: true,
                        color: "white",
                    },
                    ticks: {
                        display: false,
                    },
                },
            },
        },
    });
}

async function renderRatingLineChart ()
{
    const ratingdata = ( await window.electron.requestAPI( "user.rating", { handle: window.location.search.split( "=" )[ 1 ] } ) ).result;
    const CurrentRatingChartdiv = document.getElementById( "ratingChart" );
    // shade different regions in line graph as different bg colors
    const CurrentRatingChart = new Chart( CurrentRatingChartdiv, {
        type: "line",
        data: {
            labels: ratingdata.map( ( x ) => `contest: ${x.contestName} \n rank: ${x.rank} \n time: ${new Date(1000*x.ratingUpdateTimeSeconds).toLocaleString()}`),
            datasets: [
                {
                    label: "Rating",    
                    data: ratingdata.map( ( x ) => x.newRating ),
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
                x: {
                    // hide labels
                    display: false,
                }
            },
        },
    } );
    
}

function myFunction(x) {
    x.classList.toggle("change");
    const sidebar = document.getElementById("sidebar");
    // change width to 100% and 0 when clicked
    console.log(sidebar.style.width);
    if (sidebar.style.width === "0px" || !sidebar.style.width) {
        sidebar.style.width = "100%";
    } else {
        sidebar.style.width = "0";
    }
}

function openProfile() {
    const profile = document.getElementById("profile");
    profile.style.width = "25%";
}

function closeProfile() {
    const profile = document.getElementById("profile");
    profile.style.width = "0px";
}

function logout() {
    window.Selection.store.clear();
    window.location.href = "./auth/index.html";
}
