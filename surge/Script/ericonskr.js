// === 外部工具脚本 URL ===
const ENV_URL = "https://raw.githubusercontent.com/Alex0510/Eric/master/surge/Script/evn.js";
const UTILS_URL = "https://cdn.jsdelivr.net/gh/xzxxn777/Surge@main/Utils/Utils.js";
const CRYPTOJS_URL = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js";

// === 请求头和 POST body ===
const headers = {
  "content-type": "application/x-www-form-urlencoded",
  "user-agent": "OnSkrApp/1.1 (iPhone; iOS 16.1.1; Scale/3.00)",
  "cookie": "PHPSESSID=d67onj4srth0o18ocv58iclsi5"
};
const bodyPost = "formInfo=4265a9c353cd8624fd2bc7b5d75d2f180a40d7443bd9fd7d755b804f9362c53f538e090ac89cf7b63208e2053985e88284f7192ae496021bb2e97854bc5db44746bd2312d8dc9cc2f44a5c194b8ec2d7f3a25ebd08c584e825f20045c703dfea";

// === 拦截 URL 重定向 ===
if (typeof $request !== "undefined" && $request.url.includes("onskr.vpn.eric/web/sub")) {
  const newURL = "https://ioa.onskrgames.uk/getLines";
  $done({ response: { status: 302, headers: { Location: newURL } } });
}

// === 处理目标请求 ===
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
  $task.fetch({ url }).then(resp => {
    try { eval(resp.body); console.log("加载完成:", url); }
    catch (e) { console.log("执行脚本出错:", url, e.message); }
    callback && callback();
  }, err => {
    console.log("加载失败:", url, err.error);
    callback && callback();
  });
}

// === 发起 POST 请求并解密 ===
function decryptAndReturn() {
  const opts = { method: "POST", url: "https://ioa.onskrgames.uk/getLines", headers, body: bodyPost };
  $task.fetch(opts).then(resp => {
    const list = decryptData(resp.body);
    const result = formatNodes(list);
    $done({ body: result.join("\n") });
  }, err => {
    console.log("POST 请求失败:", err.error);
    $done();
  });
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