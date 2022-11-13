document.addEventListener( "DOMContentLoaded", async () =>
{
    const uuser = window.location.search.split( "=" )[ 1 ];
    console.log(uuser)
    const user = ( await window.electron.requestAPI( "user.info", { handles: uuser } ) ).result[ 0 ];
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
    const rateduser = document.getElementById( "rateduser" );
    rateduser.innerHTML = `
                <h1>USER</h1>
               <div class=img>
                    <img src="${user.titlePhoto}" alt="${user.handle}">
               </div>
               <div class = "handle">  <span class= "${rank}">${handle}</span> ${
        firstName || lastName ? `(${firstName || ""} ${lastName || ""})` : ""
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
    <div class = "friends">  Friends: ${friendOfCount} </div>
                `;
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
    window.electron.store.clear();
    window.location.href = "./auth/index.html";
}
