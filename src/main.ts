// @ts-ignore
import setupEvents from "../installers/setupEvents";
if (setupEvents.handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
}
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import Store from "./store";
import requestAPI from "./requestAPI";
import menu from "./menu";
app.setName("CF App");
function createWindow() {
    const win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            // devTools: false,
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    win.setIcon(path.join(__dirname, "../assets/unnamed.png"));
    win.setMenu(menu);
    win.maximize();
    if (!store.get("auth")) {
        win.loadFile(path.join(__dirname, "../pages/auth/index.html"));
    } else {
        win.loadFile(path.join(__dirname, "../pages/index.html"));
    }
    win.webContents.setZoomFactor(1.0);

    // Upper Limit is working of 500 %
    win.webContents
        .setVisualZoomLevelLimits(1, 5)
        .then((e) =>
            console.log("Zoom Levels Have been Set between 100% and 500%"),
        )
        .catch((err) => console.log(err));

    win.webContents.on("zoom-changed", (event, zoomDirection) => {
        console.log(zoomDirection);
        var currentZoom = win.webContents.getZoomFactor();
        console.log("Current Zoom Factor - ", currentZoom);
        // console.log('Current Zoom Level at - '
        // , win.webContents.getZoomLevel());
        console.log("Current Zoom Level at - ", win.webContents.zoomLevel);

        if (zoomDirection === "in") {
            // win.webContents.setZoomFactor(currentZoom + 0.20);
            win.webContents.zoomFactor =
                currentZoom + 0.1 <= 0.1 ? 0.1 : currentZoom + 0.1;

            console.log(
                "Zoom Factor Increased to - ",
                win.webContents.zoomFactor * 100,
                "%",
            );
        }
        if (zoomDirection === "out") {
            // win.webContents.setZoomFactor(currentZoom - 0.20);
            win.webContents.zoomFactor =
                currentZoom - 0.1 <= 0.1 ? 0.1 : currentZoom - 0.1;

            console.log(
                "Zoom Factor Decreased to - ",
                win.webContents.zoomFactor * 100,
                "%",
            );
        }
    });
}
const store = new Store({
    configName: "user_data",
    defaults: {},
});
app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

ipcMain.handle("store-get", (event, key) => {
    return store.get(key);
});

ipcMain.handle("store-set", (event, key, value) => {
    return store.set(key, value);
});

ipcMain.handle("store-path", (event) => {
    return store.path;
});

ipcMain.handle("store-delete", (event, key) => {
    return store.delete(key);
});

ipcMain.handle("store-clear", (event) => {
    return store.clear();
});

ipcMain.handle("requestAPI", (event, path, params, auth) => {
    return requestAPI(path, params, auth);
});
