const { app } = require( "electron" );
const packager = require( "electron-packager" );

const options = {
    dir: "./",
    out: "releases",
    name: "CodeForces.App",
    appVersion: "1.0.0-alpha.1",
    overwrite: true,
    appBuildId: "1.0.0-alpha.1",
    icon: "./assets/unnamed.ico",
    asar: true,
    all: true,
    electronVersion: "22.0.0",
    ignore: [
        "releases",
        "src",
        ".gitignore"
    ],
    win32metadata: {
        CompanyName: "USERSATOSHI",
        FileDescription: "CodeForces.App",
        OriginalFilename: "CodeForces.App.exe",
        ProductName: "CodeForces.App",
        InternalName: "CodeForces.App"
    }
};

packager( options ).then(
    ( appPaths ) => {
        console.log( "App has been packaged at " + appPaths );
    }
).catch(
    ( err ) => {
        console.log( "Error: " + err );
    }
)