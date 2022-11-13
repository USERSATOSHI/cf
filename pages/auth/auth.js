// const { existsSync } = require( "original-fs" );
// const { writeFileSync } = require( "original-fs" );

function toggleFormPart() {
    const visibleParts = document.querySelectorAll(".visible");
    const hiddenParts = document.querySelectorAll(".hidden");
    visibleParts.forEach((part) => {
        part.classList.remove("visible");
        part.classList.add("hidden");
        part.removeAttribute("required");
    });
    hiddenParts.forEach((part) => {
        part.classList.remove("hidden");
        part.classList.add("visible");
        part.setAttribute("required", "");
    });
}

async function submitAuth() {
    // const { writeFileSync } = await import("graceful-fs");
    const apiKey = document.getElementById("apiKey").value;
    const secret = document.getElementById("apiSecret").value;
    const handle = document.getElementById("handle").value;
    const isChecked = document.getElementById("checkbox").checked;
    const user = await window.electron.requestAPI("user.info", {
        handles: handle,
    });
    if ( user.status === "FAILED" )
    {
        const error = document.getElementById( "error" );
        error?.classList.add( "visible" );
        setTimeout( () =>
        {
            const handleinput = document.getElementById( "handle" );
            handleinput.focus();
            error?.classList.remove( "visible" );
        }, 2000 );
    } else {
        const data = {
            apiKey,
            secret,
            handle,
        };
        if (!isChecked) {
            delete data.apiKey;
            delete data.secret;
        }
        window.electron.store.set("auth", data);
        window.location.href = "../index.html";

        // ("a.json", JSON.stringify({ apiKey, secret, handle, isChecked }));
    }
}
