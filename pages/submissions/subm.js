var currentPage = 0;
var userStatus = null;

function toNumbers(d) {
    var e = [];
    d.replace(/(..)/g, function (d) {
        e.push(parseInt(d, 16));
    });
    return e;
}
function toHex() {
    for (
        var d = [],
            d =
                1 == arguments.length && arguments[0].constructor == Array
                    ? arguments[0]
                    : arguments,
            e = "",
            f = 0;
        f < d.length;
        f++
    )
        e += (16 > d[f] ? "0" : "") + d[f].toString(16);
    return e.toLowerCase();
}
var a = toNumbers("e9ee4b03c1d0822987185d27bca23378"),
    b = toNumbers("188fafdbe0f87ef0fc2810d5b3e34705"),
    c = toNumbers("7a407ff11ef174a7b1e2743ceacc59f9");

function convertParamsToObject ( params )
{
    // param may contain encoded objects

    var obj = {};
    var arr = params.split( '&' );
    
    for ( var i = 0; i < arr.length; i++ )
    {
        var param = arr[i].split( '=' );
        var key = param[0];
        var val = decodeURIComponent( param[ 1 ] );
        // console.log(val)
        if ( val.startsWith( '{' ) && val.endsWith( '}' ) )
        {
            val = JSON.parse( val );
        }
        obj[key] = val;
    }
    return obj;
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
}
document.addEventListener( "DOMContentLoaded", async () =>
{
    await loadProfile();
    document.cookie =
        "RCPC=" +
        toHex(slowAES.decrypt(c, 2, a, b)) +
        "; expires=Thu, 31-Dec-37 23:55:55 GMT; path=/";
    console.log( window.location.search.substring( 1 ) );
    const data = convertParamsToObject( window.location.search.substring( 1 ) );
    console.log( data );
    // window.location.href = `https://codeforces.com/contest/${data.contestId}/submission/${data.id}`;
    const title = document.getElementById( "title" );
    title.innerHTML = `Submission: ${ data.id } | Problem: ${ data.problem.name } | Contest: ${ data.contestId }`;
    
    let site = await (
        await fetch(
            `https://codeforces.com/contest/${ data.contestId }/submission/${ data.id }`,
        )
    ).text();
    console.log( site );
    let code = site
        .split(
            ` <pre id="program-source-text"`,
    )[ 1 ].split( ">" ).slice(1).join();
    console.log( code );
    code = code
        .split( "</pre>" )[ 0 ];
    // const lang = site.split( "<span class=\"info\">" )[ 1 ].split( "</span>" )[ 0 ];
    // console.log( lang,code );

    pageRender( code, data );
        hljs.highlightAll();
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



async function pageRender(code,data) {
    
    // hightlight code;
    const codeElement = document.createElement( 'code' );
    // codeElement.classList.add( 'code' );
    codeElement.innerHTML = code;
        const container = document.getElementById("code");
        container.appendChild(codeElement);

    const subinfo = document.getElementById( "subinfo" );
    subinfo.innerHTML = `
    <div class = head>
    <h2>Submission Info</h2>
    <span class="material-symbols-outlined" id=copy>
copy_all
</span>
    </div>
    <div class=infoinfo>
    <div class = "id">  ID: ${data.id} </div>
    <a href="../problems/problem.html?contestId=${data.contestId}&index=${data.problem.index}" class = "problem">  Problem: ${data.problem.name} | (${
        data.problem.index
    }) </a>
    <div class = "contest">  Contest: ${data.contestId} </div>
    <div class = "tags">  Tags: ${data.problem.tags?.join(", ") ?? "N/A"} </div>
    <div class = "verdict">  Verdict: ${data.verdict} </div>
    <div class = "time">  Time: ${new Date(
        data.creationTimeSeconds * 1000,
    ).toLocaleString()} </div>
    <div class = "lang">  Language: ${data.programmingLanguage} </div>
    <div class = "points">  Points: ${data.problem.points} </div>
    <div class = "passed">  Passed: ${data.passedTestCount} TestCases </div>
    <div class = "time">  Time: ${data.timeConsumedMillis}  ms </div>
    <div class = "memory">  Memory: ${(data.memoryConsumedBytes / 1024).toFixed(
        3,
    )}  KB </div>
    <div class = "author" > Author : ${data.author.members
        .map((x) => {
            return `<a href="../profile/index.html?handle=${x.handle}" style="text-decoration: none; color: #003cff;" >${x.handle}</a>`;
        })
        .join(", ")} </div>
    </div>
    `;

        const copy = document.getElementById("copy");
        copy.onclick = () => {
            if(can_copy){
                navigator.clipboard.writeText( code );
                can_copy = false;
                                copy.innerHTML = "done";
            setTimeout( () => {
                copy.innerHTML = "copy_all";
                can_copy = true;
            }, 5000 )
                    ;
            }
    };
    


}


var can_copy = true;





// __utmb	71512449.1.10.1669460297	.codeforces.com	/	2022-11-26T11:28:17.000Z	30						Medium	
// __utmc	71512449	.codeforces.com	/	Session	14						Medium	
// JSESSIONID	B8BEB106C315C70CE6C86C00B665536F-n1	codeforces.com	/	Session	45	✓					Medium	
// __utmt	1	.codeforces.com	/	2022-11-26T11:08:17.000Z	7						Medium	
// __utmz	71512449.1669460297.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)	.codeforces.com	/	2023-05-27T22:58:17.000Z	75						Medium	
// __utma	71512449.1096387368.1669460297.1669460297.1669460297.1	.codeforces.com	/	2023-12-31T10:58:17.025Z	60						Medium	
// 39ce7	CFzD9OxP	codeforces.com	/	2022-12-08T00:44:56.650Z	13						Medium	
// RCPC	30298c956d72a76f40e15c3a3edfc85a	codeforces.com	/	2023-12-31T10:58:16.177Z	36						Medium	
