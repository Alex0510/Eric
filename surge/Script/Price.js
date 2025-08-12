/**
 * 人民币汇率监控（双向换算 + 每日推送 + 波动提醒）+ 黄金金价监控面板
 * Author: Mr.Eric
 * Version: 4.3
 * Last Updated: 2025-08-12
 */

const baseCurrency = "CNY";
const threshold = 1; // 汇率波动百分比阈值
const googleCurrencies = ["USD", "EUR", "GBP", "HKD", "JPY", "KRW", "TRY", "TWD", "AUD", "PHP", "THB"];
const apiUrls = [
  "https://open.er-api.com/v6/latest/CNY",
  "https://api.exchangerate-api.com/v4/latest/CNY",
  "https://api.frankfurter.app/latest?from=CNY"
];

// 币种配置
const currencyConfig = {
  USD: { name: "美元", decimals: 4, flag: "🇺🇸" },
  EUR: { name: "欧元", decimals: 4, flag: "🇪🇺" },
  GBP: { name: "英镑", decimals: 4, flag: "🇬🇧" },
  HKD: { name: "港币", decimals: 4, flag: "🇭🇰" },
  JPY: { name: "日元", decimals: 4, flag: "🇯🇵" },
  KRW: { name: "韩元", decimals: 4, flag: "🇰🇷" },
  TRY: { name: "里拉", decimals: 4, flag: "🇹🇷" },
  TWD: { name: "台币", decimals: 4, flag: "🏴‍☠️" },
  AUD: { name: "澳元", decimals: 4, flag: "🇦🇺" },
  PHP: { name: "披索", decimals: 4, flag: "🇵🇭" },
  THB: { name: "泰铢", decimals: 4, flag: "🇹🇭" }
};

// 黄金商家配置，带图标
const goldMap = {
  "周大生黄金": { code: "JO_52678", icon: "👑" },
  "周六福黄金": { code: "JO_42653", icon: "🌟" },
  "老凤祥黄金": { code: "JO_42657", icon: "🐦" },
  "周大福黄金": { code: "JO_42660", icon: "🏆" },
  "老庙黄金": { code: "JO_42634", icon: "🏅" },
  "菜百黄金": { code: "JO_42638", icon: "🥇" },
  "周生生黄金": { code: "JO_42625", icon: "💎" },
  "潮宏基黄金": { code: "JO_52670", icon: "🌙" },
  "金至尊黄金": { code: "JO_42632", icon: "⭐" },
  "六福珠宝黄金": { code: "JO_56044", icon: "🔶" }
};

let globalRates = {};
let globalLastUpdate = "未知";

let rateContent = ""; // 汇率面板内容
let goldContent = ""; // 黄金面板内容
let fluctuationList = [];

(async () => {
  try {
    // 获取汇率
    await fetchRates();
    // 获取黄金金价
    await fetchGoldPrices();

    // 合并两个面板内容
    const content = `💰人民币汇率↓（更新时间：${globalLastUpdate}）\n${rateContent}\n💎国内黄金价格监控↓\n\n${goldContent}`;

    // 发送汇率波动提醒通知（如果有）
    if (fluctuationList.length > 0) {
      $notification.post(`📈 汇率波动提醒（>${threshold}%）`, "", fluctuationList.join("\n"));
    }

    $done({
      title: `汇率与黄金价格 ${beijingTime()}`,
      content,
      icon: "arrow.left.arrow.right.circle",
      "icon-color": "#EF8F1C"
    });
  } catch (e) {
    $notification.post("❌ 监控脚本异常", "", e.message || e.toString());
    $done();
  }
})();

async function fetchRates() {
  const googleResult = await fetchFromGoogle();
  if (googleResult) {
    globalRates = { ...globalRates, ...googleResult.rates };
    globalLastUpdate = googleResult.lastUpdate;
  }
  const missing = googleCurrencies.filter(c => !(c in globalRates));
  if (missing.length > 0) {
    const apiResult = await fetchFromApiForCurrencies(missing);
    if (apiResult) {
      globalRates = { ...globalRates, ...apiResult.rates };
      if (globalLastUpdate === "未知" && apiResult.lastUpdate) globalLastUpdate = apiResult.lastUpdate;
    }
  }
  if (Object.keys(globalRates).length === 0) {
    await fetchWithFallback(apiUrls);
  }
  processRates(globalRates);
}

function fetchFromGoogle() {
  return new Promise(resolve => {
    const results = {};
    let done = 0, lastUpdate = 0;

    googleCurrencies.forEach(curr => {
      if (curr === baseCurrency) {
        results[curr] = 1;
        checkDone();
        return;
      }
      $httpClient.get(`https://www.google.com/finance/quote/${curr}-${baseCurrency}`, (err, res, data) => {
        if (!err && data) {
          const match = data.match(/data-last-price="([\d\.]+)".*data-last-normal-market-timestamp="(\d+)"/);
          if (match) {
            results[curr] = 1 / parseFloat(match[1]);
            lastUpdate = Math.max(lastUpdate, parseInt(match[2]));
          }
        }
        checkDone();
      });
    });

    function checkDone() {
      done++;
      if (done === googleCurrencies.length) {
        resolve(Object.keys(results).length ? {
          rates: results,
          lastUpdate: formatTime(lastUpdate * 1000)
        } : null);
      }
    }
  });
}

function fetchFromApiForCurrencies(list) {
  return new Promise(resolve => {
    let index = 0;
    function tryNext() {
      if (index >= apiUrls.length) return resolve(null);
      $httpClient.get(apiUrls[index], (err, res, data) => {
        if (!err && data) {
          try {
            const parsed = JSON.parse(data);
            const rates = parsed.rates || {};
            const filtered = {};
            list.forEach(c => { if (rates[c]) filtered[c] = rates[c]; });
            if (Object.keys(filtered).length) {
              return resolve({
                rates: filtered,
                lastUpdate: formatTime(parsed.time_last_update_utc || parsed.date || parsed.time_last_updated * 1000)
              });
            }
          } catch {}
        }
        index++;
        tryNext();
      });
    }
    tryNext();
  });
}

function fetchWithFallback(urls, i = 0) {
  return new Promise(resolve => {
    if (i >= urls.length) {
      resolve(null);
      return;
    }
    $httpClient.get(urls[i], (err, res, data) => {
      if (!err && data) {
        try {
          const parsed = JSON.parse(data);
          globalRates = parsed.rates || {};
          globalLastUpdate = formatTime(parsed.time_last_update_utc || parsed.date || parsed.time_last_updated * 1000);
          processRates(globalRates);
          resolve();
          return;
        } catch {}
      }
      resolve(fetchWithFallback(urls, i + 1));
    });
  });
}

function processRates(rates) {
  const list = [];

  Object.keys(currencyConfig).forEach(key => {
    const cfg = currencyConfig[key];
    if (!rates[key]) return;

    const rate = rates[key]; // 1 CNY -> X 外币
    const rateInverse = 1 / rate; // 1 外币 -> Y CNY

    const prevRate = parseFloat($persistentStore.read("rate_" + key) || NaN);
    const prevInverse = parseFloat($persistentStore.read("rate_inverse_" + key) || NaN);

    // 检查波动，人民币兑外币
    if (!isNaN(prevRate)) {
      const change = ((rate - prevRate) / prevRate) * 100;
      if (Math.abs(change) >= threshold) {
        fluctuationList.push(`${cfg.flag} ${cfg.name} ${change > 0 ? "↑" : "↓"} ${change.toFixed(2)}%（1 RMB → ${rate.toFixed(cfg.decimals)}）`);
      }
    }

    // 检查波动，外币兑人民币
    if (!isNaN(prevInverse)) {
      const changeInv = ((rateInverse - prevInverse) / prevInverse) * 100;
      if (Math.abs(changeInv) >= threshold) {
        fluctuationList.push(`${cfg.flag} ${cfg.name} ${changeInv > 0 ? "↑" : "↓"} ${changeInv.toFixed(2)}%（1 ${cfg.name} → ${rateInverse.toFixed(cfg.decimals)} RMB）`);
      }
    }

    $persistentStore.write(rate.toString(), "rate_" + key);
    $persistentStore.write(rateInverse.toString(), "rate_inverse_" + key);

    list.push(`1 RMB🇨🇳 ≈ ${cfg.name} ${cfg.flag} ${rate.toFixed(cfg.decimals)}`);
    list.push(`1 ${cfg.name} ${cfg.flag} ≈ RMB🇨🇳 ${rateInverse.toFixed(cfg.decimals)}`);
    list.push("");
  });

  rateContent = list.join("\n");
}

function fetchGoldPrices() {
  return new Promise((resolve) => {
    const codes = Object.values(goldMap).map(v => v.code).join(",");
    const url = `https://api.jijinhao.com/quoteCenter/realTime.htm?codes=${codes}&_=${Date.now()}`;
    const headers = {
      authority: "api.jijinhao.com",
      accept: "*/*",
      "accept-encoding": "gzip, deflate, br",
      "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/604.1",
      "accept-language": "zh-CN,zh-Hans;q=0.9",
      referer: "https://m.quheqihuo.com/"
    };
    $httpClient.get({ url, headers }, (err, resp, data) => {
      if (err || !data) {
        $notification.post("❌ 黄金价格获取失败", "", "接口请求失败");
        resolve();
        return;
      }
      const match = data.match(/var quote_json\s*=\s*(\{[\s\S]*\});?/);
      if (!match) {
        $notification.post("❌ 黄金价格解析失败", "", "未找到JSON数据");
        resolve();
        return;
      }
      try {
        const json = JSON.parse(match[1]);
        processGoldPrices(json);
        resolve();
      } catch {
        $notification.post("❌ 黄金价格解析失败", "", "JSON解析异常");
        resolve();
      }
    });
  });
}

function processGoldPrices(json) {
  const lines = [];

  for (const [name, { code, icon }] of Object.entries(goldMap)) {
    const item = json[code];
    if (item && typeof item.q1 === "number") {
      const nameStr = (icon + " " + name).padEnd(12, " "); 
      const priceStr = item.q1.toFixed(2).padStart(8, " ") + " 元/克\n" ;
      const changeStr = `涨跌: ${item.q70.toFixed(2).padStart(7, " ")}  涨跌幅: ${item.q80.toFixed(2).padStart(6, " ")}%`;
      lines.push(`${nameStr}${priceStr}  ${changeStr}`);
    } else {
      const nameStr = (icon + " " + name).padEnd(12, " ");
      lines.push(`${nameStr}无数据`);
    }
  }

  goldContent = lines.join("\n");
}

function beijingTime() {
  return new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
}
function formatTime(t) {
  if (!t || t === "未知") return "未知";
  return new Date(t).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
}