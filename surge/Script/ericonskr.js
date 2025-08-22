// === 外部工具脚本 URL ===
const ENV_URL = "https://raw.githubusercontent.com/Alex0510/Eric/master/surge/Script/evn.js";
const UTILS_URL = "https://cdn.jsdelivr.net/gh/xzxxn777/Surge@main/Utils/Utils.js";
const CRYPTOJS_URL = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js";

const isQuanX = typeof $task !== "undefined";
const isSurge = typeof $httpClient !== "undefined";
const $http = isQuanX ? $task.fetch : $httpClient;

// === 全局请求头和 POST body ===
const headers = {
    "content-type": "application/x-www-form-urlencoded",
    "user-agent": "OnSkrApp/1.1 (iPhone; iOS 16.1.1; Scale/3.00)",
    "cookie": "PHPSESSID=d67onj4srth0o18ocv58iclsi5"
};
const bodyPost = "formInfo=4265a9c353cd8624..."; // 省略

// === 第一步：拦截 URL 并替换 ===
if (typeof $request !== "undefined" && $request.url.includes("onskr.vpn.eric/web/sub")) {
    const newURL = "https://ioa.onskrgames.uk/getLines";
    if (isQuanX) {
        $done({ response: { status: 302, headers: { Location: newURL } } });
    } else {
        $done({ url: newURL });
    }
}

// === 第二步：处理目标请求 ===
else if (typeof $request !== "undefined" && $request.url.includes("ioa.onskrgames.uk/getLines")) {
    loadScript(CRYPTOJS_URL, () => {
        loadScript(ENV_URL, () => {
            loadScript(UTILS_URL, () => {
                decryptAndReturn();
            });
        });
    });
} else {
    $done({});
}

// === 动态加载脚本 ===
function loadScript(url, callback) {
    if (isQuanX) {
        $task.fetch({ url }).then(resp => {
            try { eval(resp.body); console.log("加载完成:", url); } 
            catch (e) { console.log("执行脚本出错:", url, e.message); }
            callback && callback();
        });
    } else {
        $httpClient.get({ url }, (err, resp, body) => {
            if (!err) {
                try { eval(body); console.log("加载完成:", url); }
                catch (e) { console.log("执行脚本出错:", url, e.message); }
            }
            callback && callback();
        });
    }
}

// === POST 请求并解密 ===
function decryptAndReturn() {
    request("POST", "https://ioa.onskrgames.uk/getLines", headers, bodyPost, (err, data) => {
        if (err) { console.log("POST 请求失败:", err); $done(); return; }
        const list = decryptData(data);
        const result = formatNodes(list);
        $done({ body: result.join("\n") });
    });
}

// === 通用请求函数 ===
function request(method, url, headers, body, callback) {
    if (isQuanX) {
        const opts = { method, url, headers };
        if (body) opts.body = body;
        $task.fetch(opts).then(resp => callback(null, resp.body), err => callback(err.error));
    } else {
        const opts = { url, headers, body };
        if (method === "POST") $httpClient.post(opts, (err, resp, data) => callback(err, data));
        else $httpClient.get(opts, (err, resp, data) => callback(err, data));
    }
}

// === 解密函数 ===
function decryptData(data) {
    const key = CryptoJS.enc.Utf8.parse("65151f8d966bf596");
    const iv = CryptoJS.enc.Utf8.parse("88ca0f0ea1ecf975");
    try {
        const hexData = CryptoJS.enc.Hex.parse(data);
        const decrypted = CryptoJS.AES.decrypt({ ciphertext: hexData }, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8)).data;
    } catch (e) {
        console.log("解密失败:", e.message);
        return [];
    }
}

// === 格式化节点 ===
function formatNodes(list) {
    const countMap = {};
    return list.map(item => {
        const { title, ip, port, password, encrypt } = item;
        if (!countMap[title]) countMap[title] = 0;
        countMap[title]++;
        const nodeName = countMap[title] > 1 ? `${title}-${countMap[title]}` : title;
        return `${nodeName}=ss,${ip},${port},encrypt-method=${encrypt.toLowerCase()},password=${password}`;
    });
}