import fs from "fs/promises";
import { contextBridge, ipcRenderer, app } from "electron";

window.addEventListener("DOMContentLoaded", () => {
    const replaceText = (selector: string, text: string) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const type of ["chrome", "node", "electron"]) {
        replaceText(`${type}-version`, <string>process.versions[type]);
    }
});

contextBridge.exposeInMainWorld("electron", {
    store: {
        get: (key: string) => ipcRenderer.invoke("store-get", key),
        set: (key: string, value: string) =>
            ipcRenderer.invoke("store-set", key, value),
        delete: (key: string) => ipcRenderer.invoke("store-delete", key),
        clear: () => ipcRenderer.invoke("store-clear"),
    },
    path: ipcRenderer.invoke("store-path"),
    requestAPI: (
        path: string,
        params: Record<string, unknown> = {},
        auth: { apiKey: string; secret: string } | null = null,
    ) => ipcRenderer.invoke( "requestAPI", path, params, auth ),
    gobackpage: () => ipcRenderer.invoke( "gobackpage" ),
    getAppDetails: () => ipcRenderer.invoke( "getAppDetails" ),
});
