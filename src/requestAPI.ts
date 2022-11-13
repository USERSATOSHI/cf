const url = "https://codeforces.com/api/";
import crypto from "crypto";
import { fetch } from "undici";
//  sha512hex code
const sha512hex = (str: string) => {
    const hash = crypto.createHash("sha512");
    hash.update(str);
    return hash.digest("hex");
};
// random 6 digitnumber only
const random = () => {
    return Math.floor(100000 + Math.random() * 900000);
};
const requestAPI = async ( path: string, params: Record<string, unknown> = {}, auth: { apiKey: string, secret: string; } | null = null) => {
    let parsedParams = "";
    let parsedAuth = "";
    if (auth) {
        const time = Math.floor(Date.now() / 1000);
        const randomNum = random();
        params["time"] = time;
        params["apiKey"] = auth.apiKey;
        parsedParams = Object.keys(params)
            .sort()
            .map((key) => `${key}=${params[key]}`)
            .join("&");
        const sig = sha512hex(
            `${randomNum}/${path}?${parsedParams}#${auth.secret}`,
        );
        parsedAuth = `&apiKey=${auth.apiKey}&time=${time}&apiSig=${sig}`;
    } else {
        parsedParams = Object.keys(params)
            .sort()
            .map((key) => `${key}=${params[key]}`)
            .join("&");
    }
    const res = await fetch(
        `${url + path}${
            parsedParams !== "" ? `?${parsedParams}` : parsedParams
        }${parsedAuth != "" ? `&${parsedAuth}` : parsedAuth}`,
        {
            method: "GET",
            // headers: {
            //     "Content-Type": "application/json",
            // },
        },
    );
    return await res.json();
};

export default requestAPI;