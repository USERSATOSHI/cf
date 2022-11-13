import { Menu, MenuItem } from "electron";

const menu = new Menu();
const m = new MenuItem({
        label: "Open Web",
    submenu: [
        {
            label: "Web",
            accelerator: "CmdOrCtrl+N",
            click: () =>
            {
                // redirect to codeforces.com

                window.location.href = "https://codeforces.com";
            },
        }],
    });

const menuItems = [
    m
]
menu.insert( 0, m );
export default menu;