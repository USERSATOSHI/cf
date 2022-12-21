var currentPage = 0;
var userStatus = null;
//works for nested objects
function convertObjectToUrlParams(obj) {
    var str = "";
    for (var key in obj) {
        if (str != "") {
            str += "&";
        }
        if (typeof obj[key] === "object") {
            str += key + "=" + encodeURIComponent(JSON.stringify(obj[key]));
        } else str += key + "=" + encodeURIComponent(obj[key]);
    }
    return str;
}
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
        userimg.onclick = () => {
            window.location.href = `../profile/index.html?handle=${handle}`;
        };
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
    let uuser = window.location.search.split("=")[1];
    console.log(uuser);
    const auth = await window.electron.store.get("auth");
    console.log(auth);
    if (!uuser) uuser = auth.handle;
    const userStatus = (
        await window.electron.requestAPI("user.status", {
            handle: uuser,
            from: 1,
        })
    ).result;
    console.log(userStatus);
    pageRender(userStatus);
});
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

function pageNext(results) {
    if (currentPage <= results.length / 50 - 1) {
        currentPage++;
        pageRender(results);
    }
}

function pagePrev(results) {
    if (currentPage > 0) {
        currentPage--;
        pageRender(results);
    }
}

function pageRender(results) {
    const subdiv = document.getElementById("subdiv");
    subdiv.innerHTML = "";
    const pageResults = results.slice(currentPage * 50, (currentPage + 1) * 50);
    pageResults.forEach((x) => {
        const sub = document.createElement("div");
        sub.classList.add("sub");
        sub.onclick = () => {
            window.location.href = `./submission.html?${convertObjectToUrlParams(
                x,
            )}`;
        };
        sub.innerHTML = `
                <div class = "subinfo">
                    <div class = "subname">
                    <h3> Name </h3> 
                    ${x.problem.name} </div>
                    <div class = "subtime">
                    <h3> Time </h3>
                    ${new Date(
                        x.creationTimeSeconds * 1000,
                    ).toLocaleString()} </div>
                    <div class = "sublang">
                    <h3> Language </h3>
                    ${x.programmingLanguage} </div>
                    <div class = "extime">
                    <h3> Execution Time </h3>
                    ${x.timeConsumedMillis} ms </div>
                    <div class = "exmemory">
                    <h3> Execution Memory </h3>
                    ${(x.memoryConsumedBytes/1024/1024).toFixed(2)} MB </div>
                    <div class = "testcases">
                    <h3> Test Cases </h3>
                    ${x.passedTestCount }/${ x.testset} </div>
                    
                    <div class = "subverdict">
                    <h3> Verdict </h3>
                    <span class= "${x.verdict }">${ x.verdict}</span> </div>
                    
                </div>
        `;
        subdiv.appendChild(sub);
    });
}
