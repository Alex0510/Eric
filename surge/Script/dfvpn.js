(async () => {
  const ENV_URL = "https://raw.githubusercontent.com/Alex0510/Eric/master/surge/Script/evn.js";

  const Env = await loadEnv();
  if (!Env) return $done({}); // 如果加载失败，终止脚本

  const $ = new Env("东方Pro解密", { logLevel: "info" });

  const htmlBody = $response.body;

  try {
    const utils = await loadUtils($);
    if (!utils || typeof utils.createCryptoJS !== "function") {
      throw new ReferenceError("Utils 或 createCryptoJS 方法未正确加载");
    }

    const CryptoJS = utils.createCryptoJS();

    const keyString = "secretkey75395125865414739516543";
    const ivString = "75395125865414739516543";

    const keyCBC = CryptoJS.enc.Utf8.parse(normalizeKey(keyString, 32));
    const iv = CryptoJS.enc.Utf8.parse(normalizeKey(ivString, 16));

    // 解密 HTML 页面
    const decryptedHtml = AES_Decrypt_CBC(htmlBody, keyCBC, iv, CryptoJS);

    // 获取用户 UID
    const uid = await getUID(CryptoJS, keyCBC, iv, $);
    if (!uid) throw new Error("未能获取 UID");

    // 提取 host 和 name
    const pairs = extractHostNamePairs(decryptedHtml);
    if (pairs.length === 0) throw new Error("未提取到 host 和 name");

    const ecbKey = CryptoJS.enc.Utf8.parse("VXH2THdPBsHEp+TY");

    const result = pairs.map(p => {
      try {
        const decryptedHost = AES_Decrypt_ECB_ZeroPadding(p.host, ecbKey, CryptoJS);
        return `trojan://${uid}@${decryptedHost}:443?mux=1#${p.name}`;
      } catch {
        return `❌ 解密失败: ${p.host} - ${p.name}`;
      }
    }).join("\n");

    $.log("最终生成的 Trojan 配置：\n" + result);
    $.msg($.name, "🎉 Trojan 解密成功", "trojan 内容已写入日志");
    $.done({ body: decryptedHtml });

  } catch (err) {
    $.logErr("❌ 解密失败: " + err.message);
    $.done({ body: htmlBody });
  }

  // ========== 工具函数区域 ==========

  function AES_Decrypt_CBC(encryptedData, key, iv, CryptoJS) {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  function AES_Decrypt_ECB_ZeroPadding(encryptedBase64, key, CryptoJS) {
    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.ZeroPadding
    });
    return decrypted.toString(CryptoJS.enc.Utf8).replace(/\0+$/, "");
  }

  function extractHostNamePairs(html) {
    const hostRegex = /"host"\s*:\s*"([^"]+)"/g;
    const nameRegex = /"name"\s*:\s*"([^"]+)"/g;
    const hosts = [], names = [];

    let m;
    while ((m = hostRegex.exec(html)) !== null) hosts.push(m[1]);
    while ((m = nameRegex.exec(html)) !== null) names.push(m[1]);

    return hosts.map((h, i) => ({ host: h, name: names[i] || "" }));
  }

  function normalizeKey(str, length) {
    return str.length > length ? str.slice(0, length) : str.padEnd(length, "0");
  }

  async function getUID(CryptoJS, key, iv, $) {
    return new Promise(resolve => {
      $.http.post({
        url: "http://47.238.34.149/v2/user.php",
        headers: { "Content-Type": "application/json" },
        body: CryptoJS.AES.encrypt(
          JSON.stringify({ udid: randomUdid() }),
          key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
        ).toString()
      }, (err, resp, data) => {
        if (err) return resolve(null);
        try {
          const decrypted = AES_Decrypt_CBC(data, key, iv, CryptoJS);
          const json = JSON.parse(decrypted);
          if (json?.data?.uid) {
            $.setdata(json.data.uid.toString(), "eric_uid");
            return resolve(json.data.uid.toString());
          }
        } catch (e) {
          $.logErr("解析 UID 失败：" + e.message);
        }
        resolve(null);
      });
    });
  }

  function randomUdid() {
    let str = "";
    for (let i = 0; i < 12; i++) {
      str += Math.floor(Math.random() * 10);
    }
    return str;
  }

  async function loadUtils($) {
    const utilsCode = $.getdata("Utils_Code") || "";
    if (utilsCode) {
      $.log("✅ 使用缓存的 Utils");
      eval(utilsCode);
      return creatUtils();
    }
    $.log("⏬ 正在下载 Utils...");
    return new Promise(resolve => {
      $.getScript("https://cdn.jsdelivr.net/gh/xzxxn777/Surge@main/Utils/Utils.js").then(script => {
        $.setdata(script, "Utils_Code");
        eval(script);
        resolve(creatUtils());
      }).catch(() => resolve(null));
    });
  }

  async function loadEnv() {
    const envCode = $persistentStore.read("Eric_Env_Code") || "";
    if (envCode) {
      console.log("✅ 使用缓存的 Env");
      eval(envCode);
      return Env;
    }

    console.log("⏬ 正在下载 Env...");
    return new Promise(resolve => {
      $httpClient.get({ url: ENV_URL }, (err, resp, data) => {
        if (!err && data) {
          $persistentStore.write(data, "Eric_Env_Code");
          eval(data);
          resolve(Env);
        } else {
          console.log("❌ Env 下载失败：" + err);
          resolve(null); // 避免卡死
        }
      });
    });
  }

})();