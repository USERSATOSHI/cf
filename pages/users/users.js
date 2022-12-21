/* <div class="handle"> <span class="${rank}">${userhandle}</span> ${
                        firstName || lastName
                        ? `(${firstName || ""} ${lastName || ""})`
                        : ""
                        } </div>
                    <div class="rating"> <span class="${rank}">${rating}</span>/(Max: <span
                            class="${maxRank}">${maxRating}</span> ) </div>
                    <div class="rank"> <span class="${rank}">${rank}</span>/(Max: <span
                            class="${maxRank}">${maxRank}</span> ) </div> 
    */
var results = [];
var orgres = [];
var countres = [];
var countryMap = new Map();
var organizationMap = new Map();
var currentPage = 0;
document.addEventListener( "DOMContentLoaded", async () =>
{
    const users = document.getElementById( "users" );
    if ( !results.length )
    {
        const ratedUsers = await window.electron.requestAPI( "user.ratedList", {
            activeOnly: true,
        } );
        if ( ratedUsers.status === "FAILED" )
        {
            users.innerHTML = `<div class="error"> ${ ratedUsers.comment } </div>`;
        } else
        {
            results = ratedUsers.result;
        }
    }
    const usersearch = document.getElementById( "usersearch" );
    usersearch.oninput = () =>
    { 
        const search = usersearch.value.toLowerCase();
        const filtered = results.filter( ( user ) =>
        {
            return user.handle.toLowerCase().includes( search );
        } );
        pageRender( filtered );
        nextbtn.disabled = false;
        prevbtn.disabled = false;
        currentPage = 0;
    };
    // console.log( results.length );
    pageRender( results );
    if ( !countryMap.size || !organizationMap.size )
    {
        results.forEach( ( user ) =>
        {
            countryMap.set( user.country, ( countryMap.get( user.country ) || 0 ) + 1 );
            organizationMap.set(
                user.organization,
                ( organizationMap.get( user.organization ) || 0 ) + 1,
            );
        } );
        countryMap.set( "ALL", results.length );
        organizationMap.set( "ALL", results.length );
        countryMap = new Map( [ ...countryMap.entries() ].sort() );
        organizationMap = new Map( [ ...organizationMap.entries() ].sort() );
    }
    const orglist = document.getElementById("orglist");
    const countrylist = document.getElementById("countrylist");
    countryMap.forEach((value, key) => {
        const country = document.createElement("option");
        country.value = `${key} , ${value}`;
        country.innerHTML = `${key} , ${value}`;
        countrylist.appendChild(country);
    });
    organizationMap.forEach((value, key) => {
        const org = document.createElement("option");
        org.value = `${key} , ${value}`;
        org.innerHTML = `${key} , ${value}`;
        orglist.appendChild(org);
    });
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
        const userinfo = document.getElementById("profileuserinfo");

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
        userimg.onclick = () =>
        {
            window.location.href = `../profile/index.html?handle=${handle}`
        }
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
});

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
    const users = document.getElementById("users");
    users.innerHTML = "";
    const pageResults = results.slice(currentPage * 50, (currentPage + 1) * 50);
    pageResults.forEach((user) => {
        const rateduser = document.createElement("div");
        rateduser.onclick = () => {
            window.location.href = `../profile/index.html?user=${user.handle}`;
        };
        rateduser.classList.add("user");
        rateduser.innerHTML = `
               <div class=img>
                    <img src="${user.titlePhoto}" alt="${user.handle}">
               </div>
               <div class= userinfo>
               <div class="handle"> <span class="${user.rank}">${user.handle}</span> </div>
                    <div class="rating"> <span class="${user.rank}">${user.rating}</span>/(Max: <span
                            class="${user.maxRank}">${user.maxRating}</span>) </div>
                    <div class="rank"> <span class="${user.rank}">${user.rank}</span>/(Max: <span
                            class="${user.maxRank}">${user.maxRank}</span>) </div> 
               </div>
                `;
        users.appendChild(rateduser);
    });
}

const nextbtn = document.getElementById("next");
const prevbtn = document.getElementById("prev");
nextbtn.onclick = () => {
    pageNext(orgres.length ? orgres : countres.length ? countres : results);
    if (currentPage >= results.length / 50) {
        nextbtn.disabled = true;
    }
};
prevbtn.onclick = () => {
    pagePrev(orgres.length ? orgres : countres.length ? countres : results);
    if (currentPage <= 0) {
        prevbtn.disabled = true;
    }
};

function myFunction(x) {
    x.classList.toggle("change");
    const sidebar = document.getElementById("sidebar");
    // change width to 100% and 0 when clicked
    // console.log(sidebar.style.width);
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
const orgs = document.getElementById("orgs");
const countries = document.getElementById("couns");
orgs.onchange = () => {
    // console.log( orgs.value );
    let org = orgs.value.split(",");
    org.pop();
    org = org.join(",").trim();
    if (org === "ALL") {
        orgres = [];
    } else {
        orgres = results.filter((user) => user.organization === org);
    }
    pageRender(orgres.length ? orgres : countres.length ? countres : results);
    nextbtn.disabled = false;
    prevbtn.disabled = false;
    currentPage = 0;
    // console.log( orgres );
};

countries.onchange = () => {
    let country = countries.value.split(",");
    country.pop();
    country = country.join(",").trim();
    if (country === "ALL") {
        countres = [];
    } else {
        countres = results.filter((user) => user.country === country);
    }
    console.log(countres);
    pageRender(countres.length ? countres : orgres.length ? orgres : results);
    nextbtn.disabled = false;
    prevbtn.disabled = false;
    currentPage = 0;
    // console.log( countres );
};
