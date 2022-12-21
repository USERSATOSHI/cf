const installer = require( "electron-winstaller" );
installer.createWindowsInstaller( {
    appDirectory: "./releases/CodeForces.App-win32-x64",
    outputDirectory: "./releases/installer",
    authors: "USERSATOSHI",
    exe: "CodeForces.App.exe",
    setupIcon: "./assets/unnamed.ico",
    iconUrl: "https://raw.githubusercontent.com/usersatoshi/CodeForces.App/main/assets/unnamed.ico",
    loadingGif: "./assets/loading.gif",
    noMsi: true,
    setupExe: "CodeForces.App.Setup.exe",
    description: "CodeForces.App",
    title: "CodeForces.App",
    name: "CodeForces.App",
    version: "1.0.0-alpha.1",
    
} ).then(
    ( appPaths ) => {
        console.log( "App has been packaged at " + appPaths );
    }
).catch(
    ( err ) => {
        console.log( "Error: " + err );
    }
);
