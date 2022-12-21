var results = [];
var ratesearched = false, tagsearched = false;
var tags = [];
var ratings = [];
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

async function getProblemList() {
    const auth = await window.electron.store.get("auth");
    const resData = await window.electron.requestAPI(
        "problemset.problems",
        {},
        auth,
    );
    return resData.result.problems;
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
    page.forEach(({ name, contestId, index, type, rating, tags }) => {
        const div = document.createElement("div");
        div.className = "problem";
        div.innerHTML = `
        <div class="problem-name">
            <a href="./problem.html?contestId=${contestId}&index=${index}">${name}</a>
        </div>
        <div class=wrap>
        <h4> Tags: </h4>
        <div class="problem-tags">
            ${tags?.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
        </div>
        <div class="wrap">
        <h4> Rating: </h4>
        <div class="problem-rating">
            <span class="${type}">${rating}</span>
        </div>
        <div class="wrap">
        <h4> ContestId: </h4>
        <div class="problem-type">
            <a href="../contests/contest.html?id=${contestId}" style="text-decoration:none;" class="${type}">${contestId}</a>
        </div>
        </div>
        
        `;
        container.appendChild(div);
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
    results = await getProblemList();
    tags = results.map(({ tags }) => tags).flat();
    tags = [...new Set(tags)];
    ratings = results.map(({ rating }) => rating);
    ratings = [...new Set(ratings)];
    ratings.sort((a, b) => a - b);
    ratings.forEach((x) => {
        const option = document.createElement("option");
        option.value = x;
        option.innerHTML = x;
        ratingsSelect.appendChild(option);
    });
    tags.forEach((x) => {
        const option = document.createElement("option");
        option.value = x;
        option.innerHTML = x;
        tagsSelect.appendChild(option);
    });
    pageRender(results);
});

const search = document.getElementById("prosearch");
search.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = results.filter(({ name, tags }) => {
        const nameMatch = name.toLowerCase().includes(query);
        const tagMatch = tags?.some((tag) => tag.toLowerCase().includes(query));
        return nameMatch || tagMatch;
    });
    pageRender(filtered);
});

var rates = document.getElementById("rates");
var ratingsSelect = document.getElementById("ratings");
var tagsSelect = document.getElementById( "tags" );
var tagger = document.getElementById( "tagger" );

rates?.addEventListener( "change", ( e ) =>
{ 
    const query = e.target.value;
    if(query == "") {
        ratesearched = false;
    } else {
        ratesearched = true;
    }
    const filtered = results.filter(({ rating }) => rating == query);
    if(tagsearched) { 
        filtered = filtered.filter(({ tags }) => tags?.includes(tagger.value));
    }
    pageRender(filtered);
} );

tagger?.addEventListener( "change", ( e ) =>
{ 
    const query = e.target.value;
    if(query == "") {
        tagsearched = false;
    } else {
        tagsearched = true;
    }
    let filtered =  results.filter(({ tags }) =>  tags?.includes(query));
    if(ratesearched) {
        filtered = filtered.filter(({ rating }) => rating == rates.value);
    }
    pageRender(filtered);
} );