(async () => {
  const ENV_URL = "https://raw.githubusercontent.com/Alex0510/Eric/master/surge/Script/evn.js";
  const UTILS_URL = "https://cdn.jsdelivr.net/gh/xzxxn777/Surge@main/Utils/Utils.js";

  const Env = await loadEnv();
  const $ = new Env("东方Pro解密", { logLevel: "info" });

  const body = $response.body;

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
    const ecbKey = CryptoJS.enc.Utf8.parse("VXH2THdPBsHEp+TY"); // ECB 密钥

    const url = $request.url;

    // 处理 user.php
    if (url.includes("/user.php")) {
      const decryptedUserBody = AES_Decrypt_CBC(body, keyCBC, iv, CryptoJS);

      const uidMatch = decryptedUserBody.match(/(?:UID|uid)[^\d]*(\d{14,20})/i);
      const uid = uidMatch ? uidMatch[1] : null;

      if (uid) {
        $.setdata(uid, "Trojan_UID");
      } else {
        throw new Error("未找到 uid 字段");
      }

      $.done({ body: decryptedUserBody });
      return;
    }

    // 处理 node.php
    if (url.includes("/node.php")) {
      const decryptedHtml = AES_Decrypt_CBC(body, keyCBC, iv, CryptoJS);
      const uid = $.getdata("Trojan_UID") || "74260691621269200";

      const pairs = extractHostNamePairs(decryptedHtml);
      if (pairs.length > 0) {
        const result = pairs.map(p => {
          try {
            const decryptedHost = AES_Decrypt_ECB_ZeroPadding(p.host, ecbKey, CryptoJS);
            return `trojan://${uid}@${decryptedHost}:443?allowInsecure=1&peer=${decryptedHost}&tfo=1&mux=1#${p.name}`;
          } catch (err) {
            return `❌ 解密失败: ${p.host} - ${p.name}`;
          }
        }).join("\n");

        $.log("最终生成的 Trojan 配置：\n" + result);
        $.msg($.name, "🎉 Trojan 解密成功", "trojan 内容已写入日志");
      } else {
        $.log("未提取到任何 host 和 name 的组合");
      }

      $.done({ body: decryptedHtml });
      return;
    }

    // 其他 URL
    $.done({ body });

  } catch (err) {
    $.logErr("❌ 解密失败: " + err.message);
    $.done({ body });
  }

  // ===== 工具函数部分 =====

  function AES_Decrypt_CBC(encryptedData, key, iv, CryptoJS) {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      iv: iv,
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
    return hosts.map((h, i) => ({ host: h, name: names[i] || "未知名称" }));
  }

  function normalizeKey(str, length) {
    return str.length > length ? str.slice(0, length) : str.padEnd(length, "0");
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
      $.getScript(UTILS_URL).then(script => {
        $.setdata(script, "Utils_Code");
        eval(script);
        resolve(creatUtils());
      });
    });
  }

  async function loadEnv() {
    const envCode = $persistentStore.read("Eric_Env_Code") || "";
    if (envCode) {
      console.log("✅ 使用缓存的 Env");
      try {
        const loadedEnv = eval(`(function() {\n${envCode}\n;return Env; })()`);
        return loadedEnv;
      } catch (e) {
        console.log("❌ 缓存 Env 加载失败：" + e.message);
      }
    }

    console.log("⏬ 正在下载 Env...");
    return new Promise((resolve, reject) => {
      $httpClient.get({ url: ENV_URL }, (err, resp, data) => {
        if (!err && resp.status === 200) {
          try {
            $persistentStore.write(data, "Eric_Env_Code");
            const loadedEnv = eval(`(function() {\n${data}\n;return Env; })()`);
            resolve(loadedEnv);
          } catch (e) {
            console.log("❌ Env 加载失败：" + e.message);
            $done({});
          }
        } else {
          console.log("❌ Env 下载失败：" + (err || resp.status));
          $done({});
        }
      });
    });
  }
})();