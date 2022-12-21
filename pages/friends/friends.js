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

function closeProfile() {
    const profile = document.getElementById("profile");
    profile.style.width = "0px";
}

function openProfile() {
    const profile = document.getElementById("profile");
    profile.style.width = "25%";
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
    loadProfile();
    const auth = await window.electron.store.get("auth");
    const uuser = window.location.search.split("=")[1];
    const allfriends = (await window.electron.requestAPI("user.friends", {
        onlyOnline: false,
    }, auth )).result;
    const online = (await window.electron.requestAPI("user.friends", {
        onlyOnline: true,
    }, auth )).result;
    const rest = allfriends.filter( x => !online.includes( x ) );
    const container = document.getElementById( "container" );
    container.innerHTML = `
        <div class= online >
            <div class=head >
                <h3>Online</h3>
                <h6> ${online.length} </h6>
            </div>
            <div class=list>
                ${online
                    .map((x) => {
                        return `<a href="../profile/index.html?handle=${x}"><h4> ${x} </h4> </a>`;
                    })
                    .join("\n")}
            </div>
        </div>
                <div class= rest >
            <div class=head >
                <h3>Offline</h3>
                <h6> ${rest.length} </h6>
            </div>
            <div class=list>
                ${rest
                    .map((x) => {
                        return `<a href="../profile/index.html?handle=${x}"><h4> ${x} </h4> </a>`;
                    })
                    .join("\n")}
            </div>
        </div>
    `;
    
});
