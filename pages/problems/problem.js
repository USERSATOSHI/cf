var can_copy_input = true;
var can_copy_output = true;
function myFunction ( x )
{
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

document.addEventListener("DOMContentLoaded", async function () {
    loadProfile();
    draggers();
    const prodata = await getProblem();

    console.log(prodata);
    const cr = document.getElementById("cr");
    const cl = document.getElementById( "cl" );
    const title = document.getElementById( "title" );
    title.innerText += ": "+prodata.problemName;
    cr.innerHTML = `
        <div class="header">
        <h1>${prodata.problemName}</h1>
        </div>
        <div class="body">
        <div class=statement>${prodata.problemStatementText}</div>
        <div class="inputSpe">
        <div class=statement>${prodata.inputSpecification}</div>
        </div>
        <div class="outputSpe">
        <div class=statement>${prodata.outputSpecification}</div>
        </div>
        </div>
    `;
    cl.innerHTML =
        `
        <div class="header">
        <h1> Info </h1>
        </div>
        <div class="body2">
        <div class="info">
${prodata.timeLimit} 
        </div>
        <div class="info">
${prodata.memoryLimit}
        </div>
        <div class="info2">
${prodata.sampleTests}
        </div>` + (prodata.note ?
        `
        <div class="info2">
${prodata.note}
        </div>` : "") +
            `</div>
        `;
    (function () {
        MathJax = {
            tex: {
                inlineMath: [
                    ["$$$", "$$$"],
                    ["\\(", "\\)"],
                ],
            },
            svg: {
                fontCache: "global",
            },
            loader: { load: [ "input/tex", "output/chtml" ] },
            
            // startup: {
            //     typeset: false,
            // },
            // set $$$ as the default delimiter for inline math
        };
        var script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
        script.async = true;
        document.head.appendChild(script);
    } )();
    

    const input = document.querySelector(".input");
    const output = document.querySelector(".output");
    if (input) input.style.cursor = "pointer";
    if (output) output.style.cursor = "pointer";
    // copy input whn clicked
    input?.addEventListener( "click", () =>
    {
        const d = input.innerHTML;
        if ( can_copy_input )
        {
            can_copy_input = false;
            navigator.clipboard.writeText( input.innerText.slice( 5 ).trim() );
            input.innerHTML = "Copied!";
            setTimeout( () =>
            {
                can_copy_input = true;
                input.innerHTML = d;
            }, 1000 );
        }
    });
    // copy output whn clicked
    output?.addEventListener("click", () => {
        const d = output.innerHTML;
        if (can_copy_output) {
            can_copy_output = false;
            navigator.clipboard.writeText(output.innerText.slice(7).trim());
            output.innerHTML = "Copied!";
            setTimeout(() => {
                can_copy_output = true;
                output.innerHTML = d;
            }, 1000);
        }
    } );
    
});

function draggers() {
    // Query the element
    const resizer = document.getElementById("dragMe");
    const leftSide = resizer.previousElementSibling;
    const rightSide = resizer.nextElementSibling;

    // The current position of mouse
    let x = 0;
    let y = 0;
    let leftWidth = 0;

    // Handle the mousedown event
    // that's triggered when user drags the resizer
    const mouseDownHandler = function (e) {
        // Get the current mouse position
        x = e.clientX;
        y = e.clientY;
        leftWidth = leftSide.getBoundingClientRect().width;

        // Attach the listeners to `document`
        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        // How far the mouse has been moved
        const dx = e.clientX - x;
        const dy = e.clientY - y;

        const newLeftWidth =
            ((leftWidth + dx) * 100) /
            resizer.parentNode.getBoundingClientRect().width;
        leftSide.style.width = `${newLeftWidth}%`;

        resizer.style.cursor = "col-resize";
        document.body.style.cursor = "col-resize";

        leftSide.style.userSelect = "none";
        leftSide.style.pointerEvents = "none";

        rightSide.style.userSelect = "none";
        rightSide.style.pointerEvents = "none";
    };

    const mouseUpHandler = function () {
        resizer.style.removeProperty("cursor");
        document.body.style.removeProperty("cursor");

        leftSide.style.removeProperty("user-select");
        leftSide.style.removeProperty("pointer-events");

        rightSide.style.removeProperty("user-select");
        rightSide.style.removeProperty("pointer-events");

        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
    };

    // Attach the handler
    resizer.addEventListener("mousedown", mouseDownHandler);
}

async function getProblem() {
    const params = new URLSearchParams(window.location.search);
    const contestId = params.get("contestId");
    const problemIndex = params.get("index");
    const url = `https://codeforces.com/problemset/problem/${contestId}/${problemIndex}`;
    const resData = await (await fetch(url)).text();
    console.log(window.localStorage);
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(resData, "text/html");
    // console.log( htmlDoc );
    const problemStatement = htmlDoc.querySelector(".problem-statement");
    console.log(problemStatement);
    const header = problemStatement.querySelector(".header");
    // console.log( header )
    const problemName = header.querySelector(".title")?.innerHTML;
    const timeLimit = header.querySelector(".time-limit")?.innerHTML;
    const memoryLimit = header.querySelector(".memory-limit")?.innerHTML;

    const problemStatementText = problemStatement?.childNodes["1"].innerHTML;
    console.log(problemStatementText);
    const inputSpecification = htmlDoc.querySelector(
        ".input-specification",
    )?.innerHTML;
    const outputSpecification = htmlDoc.querySelector(
        ".output-specification",
    )?.innerHTML;
    const sampleTests = htmlDoc.querySelector(".sample-test")?.innerHTML;
    const note = htmlDoc.querySelector(".note")?.innerHTML;
    return {
        problemName,
        timeLimit,
        memoryLimit,
        problemStatementText,
        inputSpecification,
        outputSpecification,
        sampleTests,
        note,
    };
}
