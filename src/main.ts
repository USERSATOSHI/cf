import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import Store from "./store";
import requestAPI from "./requestAPI";
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
    win.maximize();
    if ( !store.get( "auth" ) )
    {
        win.loadFile( "../pages/auth/index.html" );
    } else
    {
        win.loadFile( "../pages/index.html" );
    }
     // win.setMenu(null);
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

ipcMain.handle( "store-path", ( event ) => {
    return store.path;
} );

ipcMain.handle( "store-delete", ( event, key ) => {
    return store.delete( key );
});

ipcMain.handle( "store-clear", ( event ) =>
{
    return store.clear();
} );

ipcMain.handle( "requestAPI", ( event, path, params, auth ) =>
{
    return requestAPI( path, params, auth );
} );