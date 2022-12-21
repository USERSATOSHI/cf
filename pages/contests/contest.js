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

async function getContestList ()
{
    const id = window.location.search.split("=")[1];
    const url = `https://codeforces.com/contest/${ id }`;
    const response = await fetch( url );
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString( html, "text/html" );
    const contest = doc.querySelector( ".datatable" );
    const contestList = contest.querySelectorAll( "tr" );
    const results = [];
    for ( let i = 1; i < contestList.length; i++ )
    {
        const contest = contestList[ i ];
        const id = contest.querySelector( "td:nth-child(1)" )?.textContent;
        const name = contest.querySelector( "td:nth-child(2)" )?.textContent;
        const solvedcount = contest.querySelector( "td:nth-child(4)" )?.textContent;
        results.push( {
            id,
            name,
            solvedcount,
        } );
    }
    return results;
}

function pageRender(results) {
    const container = document.getElementById("container");
    container.innerHTML = "";
    const page = results;
    const contestId = window.location.search.split("=")[1];
    page.forEach((problem) => {
        const { id, name, solvedcount } = problem;
        const div = document.createElement("div");
        div.className = "problem";
        div.style.cursor = "pointer";
        div.onclick = () =>
        { 
            window.location.href = `../problems/problem.html?contestId=${contestId}&index=${id}`;
        }
        div.innerHTML = `
        <div class=wrap>
        <h4> Id: </h4>
        <div class="problemid">${id}</div>
        </div>
        <div class=wrap>
        <h4> Name: </h4>
        <div class="problemname">${name}</div>
        </div>
        <div class=wrap>
        <h4> Solved Count: </h4>
        <div class="problemsolved">${solvedcount}</div>
        </div>
        `;
        container.appendChild(div);
    });
}


document.addEventListener("DOMContentLoaded", async () => {
    await loadProfile();
    results = await getContestList();
    const id = window.location.search.split( "=" )[ 1 ];
    const title = document.getElementById( "title" );
    title.innerHTML = `Contest : ${ id }`;
    pageRender( results );
});

