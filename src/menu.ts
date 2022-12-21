import { Menu, MenuItem, BrowserWindow, shell} from "electron";

const menu = new Menu();
const m = new MenuItem({
        label: "App",
    submenu: [
        {
            label: "Codeforces",
            accelerator: "CmdOrCtrl+O",
            click: () =>
            {
                // redirect to codeforces.com
                shell.openExternal( "https://codeforces.com" );
                
            },
        }, {
            label: "About",
            accelerator: "CmdOrCtrl+Alt+A",
            click: () =>
            {
                // redirect to cf app about page
                
                
            }
        }],
} );
    
const m2 = new MenuItem( {
    label: "Navigate",
    submenu: [
        {
            label: "Home",
            accelerator: "CmdOrCtrl+H",
            click: () =>
            {
                // redirect to home page
                const win = <BrowserWindow>BrowserWindow.getFocusedWindow();
                win.loadFile( "../pages/index.html" );

            },
        }, {
            label: "back",
            accelerator: "CmdOrCtrl+Left",
            click: () =>
            {
 
                const win = <BrowserWindow>BrowserWindow.getFocusedWindow();
                win.webContents.goBack();

            }
        }, {
            label: "next",
            accelerator: "CmdOrCtrl+Right",
            click: () =>
            {
                const win = <BrowserWindow>BrowserWindow.getFocusedWindow();
                win.webContents.goForward();
            }
        }, {
            label: "reload",
            accelerator: "CmdOrCtrl+R",
            click: () =>
            {
                const win = <BrowserWindow>BrowserWindow.getFocusedWindow();
                win.webContents.reload();
            }
        }, {
            label: "dev tools",
            accelerator: "CmdOrCtrl+Shift+I",
            click: () =>
            {
                const win = <BrowserWindow>BrowserWindow.getFocusedWindow();
                win.webContents.openDevTools();
            }
        }
    ]
} );

const m3 = new MenuItem( {
    label: "Misc",
    submenu: [
        {
            label: "Compare",
            accelerator: "CmdOrCtrl+Shift+C",
            click: () =>
            {
                // redirect to compare page
                const win = <BrowserWindow> BrowserWindow.getFocusedWindow();
                win.loadFile( "../pages/misc/compare/index.html" );
            }
        }, {
            label: "Rating Change",
            accelerator: "CmdOrCtrl+Shift+R",
            click: () =>
            {
                // redirect to rating change page
                const win = <BrowserWindow> BrowserWindow.getFocusedWindow();
                win.loadFile( "../pages/misc/ratingChange/index.html" );
            }
        }
    ]
} );


const menuItems = [
    m,m2
]
menu.insert( 0, m );
menu.insert( 1, m2 );
menu.insert( 2, m3 );
export default menu;