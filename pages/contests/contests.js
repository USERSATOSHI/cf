var results = [];
var currentPage = 0;
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
    window.electron.store.clear();
    window.location.href = "./auth/index.html";
}
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
            if (apiKey && secret) {
                window.location.href = `../friends/index.html`;
            }
        });
    }
}

async function getContestList() {
    const auth = await window.electron.store.get("auth");
    const resData = await window.electron.requestAPI(
        "contest.list",
        { gym: false },
        auth,
    );
    return resData.result;
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
    const container = document.getElementById("container");
    container.innerHTML = "";
    const start = currentPage * 50;
    const end = start + 50;
    const page = results.slice(start, end);
    page.forEach((contest) => {
        const {
            name,
            type,
            phase,
            durationSeconds,
            startTimeSeconds,
            relativeTimeSeconds,
            id,
        } = contest;
        const contestCard = document.createElement("div");
        contestCard.className = "contest-card";
        contestCard.innerHTML = `
        <div class=headWrap>
        ${phase!=="BEFORE" ? `<a href = "./contest.html?id=${id}"` : `<div `} class = "contest-name" ><h4>  ${name} </h4>${phase!=="BEFORE" ? `</a>` : "</div>" }
        <div class=expand data-cid="${id}" onclick=expand(this)> <span class="material-symbols-outlined">expand_more</span> </div>
        </div>
        <div id = "expand-${id}" class=expandWrap>
        <div class=wrap>
        <h4> Type: </h4>
        <div class = "contest-type">  ${type} </div>
        </div>
        <div class=wrap>
        <h4> Phase: </h4>
        <div class = "contest-phase">  ${phase} </div>
        </div>
        <div class=wrap>
        <h4> Duration: </h4>
        <div class = "contest-duration">  ${
            durationSeconds % 3600 === 0
                ? durationSeconds / 3600 + "h"
                : durationSeconds % 60 === 0
                ? durationSeconds / 60 + "m"
                : durationSeconds + "s"
        } </div>
        </div>
        <div class=wrap>
        <h4> Start Time: </h4>
        <div class = "contest-starttime">  ${new Date(
            1000 * startTimeSeconds,
        ).toLocaleString()} </div>
        </div>
        <div class=wrap>
        <h4> Relative Time: </h4>
        <div class = "contest-relativetime">  ${
            relativeTimeSeconds > 0
                ? "Ended"
                : Math.abs(relativeTimeSeconds) < 60
                ? Math.abs(relativeTimeSeconds) + "s"
                : Math.abs(relativeTimeSeconds) < 3600
                ? Math.floor(Math.abs(relativeTimeSeconds) / 60) + "m"
                : Math.floor(Math.abs(relativeTimeSeconds) / 3600) + "h"
        } </div>
        </div>
        <div class=wrap>
        <h4> ID: </h4>
        <div class = "contest-id">  ${id} </div>
        </div>
        </div>
        `;
        if ( phase !== "BEFORE" )
        {
            contestCard.style.cursor = "pointer";
            contestCard.onclick = () => {
                window.location.href = `../contests/contest.html?id=${id}`;
            };
        }
        container.appendChild(contestCard);
    });
}

const nextbtn = document.getElementById("next");
const prevbtn = document.getElementById("prev");
nextbtn.onclick = () => {
    pageNext(results);
    if (currentPage >= results.length / 50) {
        nextbtn.disabled = true;
    }
};
prevbtn.onclick = () => {
    pagePrev(results);
    if (currentPage <= 0) {
        prevbtn.disabled = true;
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    await loadProfile();
    results = await getContestList();
    pageRender(results);
});

function expand ( e )
{
    const id = e.getAttribute( "data-cid" );
    const expander = document.getElementById( "expand-" + id );
    if ( expander.style.display === "none" || expander.style.display === "" )
    {
        expander.style.display = "block";
        e.innerHTML = `<span class="material-symbols-outlined">expand_less</span>`;
    }
    else
    {
        expander.style.display = "none";
        e.innerHTML = `<span class="material-symbols-outlined">expand_more</span>`;
    }

    
}

const search = document.getElementById( "contestsearch" );
search.addEventListener( "input", ( e ) =>
{ 
    const val = e.target.value;
    const container = document.getElementById( "container" );
    container.innerHTML = "";
    const filtered = results.filter( ( contest ) =>
    {
        return contest.name.toLowerCase().includes( val.toLowerCase() );
    } )
    pageRender( filtered );
} );