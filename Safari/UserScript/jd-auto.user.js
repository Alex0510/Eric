// ==UserScript==
// @name         京东任务自动完成
// @version      1.0.1
// @description  Run jd_scripts in your browser
// @author       Eric
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @connect      github.com
// @connect      raw.githubusercontent.com
// @connect      jd.com
// @connect      jdfcloud.com
// @connect      turinglabs.net
// @match        *://*/*
// ==/UserScript==
//##简介：
//打开任意页面会触发脚本自动运行并检查是否需要执行相应的任务。
//每个任务运行最大间隔 3 小时。
//##如何食用：
//升级到最新版本油猴，在设置中通过链接导入 script.user.js 。
//修改脚本顶部的 cookies 为自己的 cookie。
//##已知问题：
//只测试了最新版 Chrome。
(function () {
  const cookies = [
    "pt_pin=jd_652d521e59733;pt_key=AAJfoNW3ADD-1NLWTSxKk4dhtnLhGnvHnRZSdDaB5IP5t0eKPROTSahhwwTJXZUksLklyOBCCkQ;",
  ];

  const project = "jd_scripts";

  // 加载远程代码的方法，超时设置为 5 秒
  function loadScript(url, success, error) {
    GM_xmlhttpRequest({
      method: "GET",
      url,
      timeout: 5000,
      responseType: "text",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36",
      },
      onload: (resp) => {
        console.log(`[jd_scripts] loaded: ${url}`);
        success && success(resp.responseText);
      },
      onabort: error,
      onerror: error,
      ontimeout: error,
    });
  }
  const parsedCookies = {};
  // 原代码是 cjs 的，默认页面上不会有 require（就算有也不行），patch 掉
  window.require = (path) => {
    console.warn(`[jd_scripts] requiring: ${path}`);
    if (path.includes("jdCookie")) {
      if (!parsedCookies)
        parsedCookies = cookies.reduce((all, c, i) => {
          all[`CookieJD${i == 0 ? "" : i}`] = c;
          return all;
        }, {});
      return parsedCookies;
    } else if (path.includes("jdFruitShareCodes")) {
      // 农场助力码
      return {};
    } else if (path.includes("sendNotify")) {
      return {
        sendNotify: () => {
          console.warn(`[jd_scripts] notify:`);
          console.log(arguments);
        },
      };
    } else if (path.includes("jdPetShareCodes")) {
      // 萌宠助力码
      return {};
    } else if (path.includes("jdPlantBeanShareCodes")) {
      // 种豆得豆
      return {};
    } else if (path.includes("jdSuperMarketShareCodes")) {
      // 京小超
      return {};
    }
  };
  // 原来的代码有些地方会调用 process，patch 掉
  window.process = {
    env: {},
  };
  // patch scripts 原代码里的 Env 定义
  window.Env = function (t, e) {
    class s {
      constructor(t) {
        this.env = t;
      }
      send(t, e = "GET") {
        t = "string" == typeof t ? { url: t } : t;
        let s = this.get;
        return (
          "POST" === e && (s = this.post),
          new Promise((e, i) => {
            s.call(this, t, (t, s, o) => {
              t ? i(t) : e(s);
            });
          })
        );
      }
      get(t) {
        return this.send.call(this.env, t);
      }
      post(t) {
        return this.send.call(this.env, t, "POST");
      }
    }
    return new (class {
      constructor(t, e) {
        (this.name = t),
          (this.http = new s(this)),
          (this.data = null),
          (this.dataFile = "box.dat"),
          (this.logs = []),
          (this.isMute = !1),
          (this.logSeparator = "\n"),
          (this.startTime = new Date().getTime()),
          Object.assign(this, e),
          this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`);
      }
      isNode() {
        //   return "undefined" != typeof module && !!module.exports;
        return true;
      }
      isQuanX() {
        return "undefined" != typeof $task;
      }
      isSurge() {
        return "undefined" != typeof $httpClient && "undefined" == typeof $loon;
      }
      isLoon() {
        return "undefined" != typeof $loon;
      }
      toObj(t, e = null) {
        try {
          return JSON.parse(t);
        } catch (e) {
          return e;
        }
      }
      toStr(t, e = null) {
        try {
          return JSON.stringify(t);
        } catch (e) {
          return e;
        }
      }
      getjson(t, e) {
        let s = e;
        const i = this.getdata(t);
        if (i)
          try {
            s = JSON.parse(this.getdata(t));
          } catch (e) {}
        return s;
      }
      setjson(t, e) {
        try {
          return this.setdata(JSON.stringify(t), e);
        } catch (e) {
          return !1;
        }
      }
      getScript(t) {
        return new Promise((e) => {
          this.get({ url: t }, (t, s, i) => e(i));
        });
      }
      runScript(t, e) {
        return new Promise((s) => {
          let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
          i = i ? i.replace(/\n/g, "").trim() : i;
          let o = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
          (o = o ? 1 * o : 20), (o = e && e.timeout ? e.timeout : o);
          const [r, h] = i.split("@"),
            a = {
              url: `http://${h}/v1/scripting/evaluate`,
              body: { script_text: t, mock_type: "cron", timeout: o },
              headers: { "X-Key": r, Accept: "*/*" },
            };
          this.post(a, (t, e, i) => s(i));
        }).catch((t) => this.logErr(t));
      }
      loaddata() {
        if (!this.isNode()) return {};
        else {
          const data = GM_getValue(`${project}_data`, "{}");
          return JSON.parse(data);
          //   (this.fs = this.fs ? this.fs : _require("fs")),
          //     (this.path = this.path ? this.path : _require("path"));
          //   const t = this.path.resolve(this.dataFile),
          //     e = this.path.resolve(process.cwd(), this.dataFile),
          //     s = this.fs.existsSync(t),
          //     i = !s && this.fs.existsSync(e);
          //   if (!s && !i) return {};
          //   {
          //     const i = s ? t : e;
          //     try {
          //       return JSON.parse(this.fs.readFileSync(i));
          //     } catch (t) {
          //       return {};
          //     }
          //   }
        }
      }
      writedata() {
        if (this.isNode()) {
          const data = JSON.stringify(this.data);
          GM_setValue(`${project}_data`, data);
          //   (this.fs = this.fs ? this.fs : _require("fs")),
          //     (this.path = this.path ? this.path : _require("path"));
          //   const t = this.path.resolve(this.dataFile),
          //     e = this.path.resolve(process.cwd(), this.dataFile),
          //     s = this.fs.existsSync(t),
          //     i = !s && this.fs.existsSync(e),
          //     o = JSON.stringify(this.data);
          //   s
          //     ? this.fs.writeFileSync(t, o)
          //     : i
          //     ? this.fs.writeFileSync(e, o)
          //     : this.fs.writeFileSync(t, o);
        }
      }
      lodash_get(t, e, s) {
        const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
        let o = t;
        for (const t of i) if (((o = Object(o)[t]), void 0 === o)) return s;
        return o;
      }
      lodash_set(t, e, s) {
        return Object(t) !== t
          ? t
          : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []),
            (e
              .slice(0, -1)
              .reduce(
                (t, s, i) =>
                  Object(t[s]) === t[s]
                    ? t[s]
                    : (t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}),
                t
              )[e[e.length - 1]] = s),
            t);
      }
      getdata(t) {
        let e = this.getval(t);
        if (/^@/.test(t)) {
          const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t),
            o = s ? this.getval(s) : "";
          if (o)
            try {
              const t = JSON.parse(o);
              e = t ? this.lodash_get(t, i, "") : e;
            } catch (t) {
              e = "";
            }
        }
        return e;
      }
      setdata(t, e) {
        let s = !1;
        if (/^@/.test(e)) {
          const [, i, o] = /^@(.*?)\.(.*?)$/.exec(e),
            r = this.getval(i),
            h = i ? ("null" === r ? null : r || "{}") : "{}";
          try {
            const e = JSON.parse(h);
            this.lodash_set(e, o, t), (s = this.setval(JSON.stringify(e), i));
          } catch (e) {
            const r = {};
            this.lodash_set(r, o, t), (s = this.setval(JSON.stringify(r), i));
          }
        } else s = this.setval(t, e);
        return s;
      }
      getval(t) {
        return this.isSurge() || this.isLoon()
          ? $persistentStore.read(t)
          : this.isQuanX()
          ? $prefs.valueForKey(t)
          : this.isNode()
          ? ((this.data = this.loaddata()), this.data[t])
          : (this.data && this.data[t]) || null;
      }
      setval(t, e) {
        return this.isSurge() || this.isLoon()
          ? $persistentStore.write(t, e)
          : this.isQuanX()
          ? $prefs.setValueForKey(t, e)
          : this.isNode()
          ? ((this.data = this.loaddata()),
            (this.data[e] = t),
            this.writedata(),
            !0)
          : (this.data && this.data[e]) || null;
      }
      initGotEnv(t) {
        // (this.got = this.got ? this.got : _require("got")),
        //   (this.cktough = this.cktough ? this.cktough : _require("tough-cookie")),
        //   (this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()),
        //   t &&
        //     ((t.headers = t.headers ? t.headers : {}),
        //     void 0 === t.headers.Cookie &&
        //       void 0 === t.cookieJar &&
        //       (t.cookieJar = this.ckjar));
        t &&
          ((t.headers = t.headers ? t.headers : {}),
          void 0 === t.headers.Cookie);
      }
      get(t, e = () => {}) {
        t.headers &&
          (delete t.headers["Content-Type"],
          delete t.headers["Content-Length"]),
          this.isSurge() || this.isLoon()
            ? $httpClient.get(t, (t, s, i) => {
                !t && s && ((s.body = i), (s.statusCode = s.status)),
                  e(t, s, i);
              })
            : this.isQuanX()
            ? $task.fetch(t).then(
                (t) => {
                  const {
                    statusCode: s,
                    statusCode: i,
                    headers: o,
                    body: r,
                  } = t;
                  e(null, { status: s, statusCode: i, headers: o, body: r }, r);
                },
                (t) => e(t)
              )
            : this.isNode() &&
              (this.initGotEnv(t),
              GM_xmlhttpRequest({
                url: t.url || t,
                method: "GET",
                timeout: 5000,
                headers: t.headers || null,
                onload: (resp) => {
                  e(
                    null,
                    {
                      status: resp.statusText,
                      statusCode: resp.status,
                      headers: resp.responseHeaders,
                      body: resp.response,
                    },
                    resp.response
                  );
                },
                onabort: e,
                onerror: e,
                ontimeout: e,
              }));
              //   this.got(t)
              //     .on("redirect", (t, e) => {
              //       try {
              //         const s = t.headers["set-cookie"]
              //           .map(this.cktough.Cookie.parse)
              //           .toString();
              //         this.ckjar.setCookieSync(s, null), (e.cookieJar = this.ckjar);
              //       } catch (t) {
              //         this.logErr(t);
              //       }
              //     })
              //     .then(
              //       (t) => {
              //         const {
              //           statusCode: s,
              //           statusCode: i,
              //           headers: o,
              //           body: r,
              //         } = t;
              //         e(null, { status: s, statusCode: i, headers: o, body: r }, r);
              //       },
              //       (t) => e(t)
              //     )
      }
      post(t, e = () => {}) {
        if (
          (t.body &&
            t.headers &&
            !t.headers["Content-Type"] &&
            (t.headers["Content-Type"] = "application/x-www-form-urlencoded"),
          t.headers && delete t.headers["Content-Length"],
          this.isSurge() || this.isLoon())
        )
          $httpClient.post(t, (t, s, i) => {
            !t && s && ((s.body = i), (s.statusCode = s.status)), e(t, s, i);
          });
        else if (this.isQuanX())
          (t.method = "POST"),
            $task.fetch(t).then(
              (t) => {
                const { statusCode: s, statusCode: i, headers: o, body: r } = t;
                e(null, { status: s, statusCode: i, headers: o, body: r }, r);
              },
              (t) => e(t)
            );
        else if (this.isNode()) {
          this.initGotEnv(t);
          const { url, headers, body } = t;
          GM_xmlhttpRequest({
            url,
            data: body,
            method: "POST",
            timeout: 5000,
            headers: headers,
            onload: (resp) => {
              e(
                null,
                {
                  status: resp.statusText,
                  statusCode: resp.status,
                  headers: resp.responseHeaders,
                  body: resp.response,
                },
                resp.response
              );
            },
            onabort: e,
            onerror: e,
            ontimeout: e,
          });
          //   this.got.post(s, i).then(
          //     (t) => {
          //       const { statusCode: s, statusCode: i, headers: o, body: r } = t;
          //       e(null, { status: s, statusCode: i, headers: o, body: r }, r);
          //     },
          //     (t) => e(t)
          //   );
        }
      }
      time(t) {
        let e = {
          "M+": new Date().getMonth() + 1,
          "d+": new Date().getDate(),
          "H+": new Date().getHours(),
          "m+": new Date().getMinutes(),
          "s+": new Date().getSeconds(),
          "q+": Math.floor((new Date().getMonth() + 3) / 3),
          S: new Date().getMilliseconds(),
        };
        /(y+)/.test(t) &&
          (t = t.replace(
            RegExp.$1,
            (new Date().getFullYear() + "").substr(4 - RegExp.$1.length)
          ));
        for (let s in e)
          new RegExp("(" + s + ")").test(t) &&
            (t = t.replace(
              RegExp.$1,
              1 == RegExp.$1.length
                ? e[s]
                : ("00" + e[s]).substr(("" + e[s]).length)
            ));
        return t;
      }
      msg(e = t, s = "", i = "", o) {
        const r = (t) => {
          if (!t || (!this.isLoon() && this.isSurge())) return t;
          if ("string" == typeof t)
            return this.isLoon()
              ? t
              : this.isQuanX()
              ? { "open-url": t }
              : void 0;
          if ("object" == typeof t) {
            if (this.isLoon()) {
              let e = t.openUrl || t["open-url"],
                s = t.mediaUrl || t["media-url"];
              return { openUrl: e, mediaUrl: s };
            }
            if (this.isQuanX()) {
              let e = t["open-url"] || t.openUrl,
                s = t["media-url"] || t.mediaUrl;
              return { "open-url": e, "media-url": s };
            }
          }
        };
        this.isMute ||
          (this.isSurge() || this.isLoon()
            ? $notification.post(e, s, i, r(o))
            : this.isQuanX() && $notify(e, s, i, r(o)));
        let h = [
          "",
          "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3==============",
        ];
        h.push(e),
          s && h.push(s),
          i && h.push(i),
          console.log(h.join("\n")),
          (this.logs = this.logs.concat(h));
      }
      log(...t) {
        t.length > 0 && (this.logs = [...this.logs, ...t]),
          console.log(t.join(this.logSeparator));
      }
      logErr(t, e) {
        const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
        s
          ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack)
          : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t);
      }
      wait(t) {
        return new Promise((e) => setTimeout(e, t));
      }
      done(t = {}) {
        const e = new Date().getTime(),
          s = (e - this.startTime) / 1e3;
        this.log(
          "",
          `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`
        ),
          this.log(),
          (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t);
      }
    })(t, e);
  };
  // 去掉最后一行 Env 的定义，并通过 Babel 来编译 es6 代码
  function createRunningSandbox(text) {
    const script = text.split("\n").slice(0, -2).join("\n");
    console.log(`[jd_scripts] 编译中`);
    let compiled = undefined;
    try {
      compiled = Babel.transform(script, { presets: ["es2015", "es2016"] });
    } catch (e) {
      console.error(`[jd_scripts] 编译脚本错误`);
      console.error(e);
    }
    if (compiled) {
      try {
        eval(compiled.code);
      } catch (e) {
        console.error(`[jd_scripts] 脚本运行错误`);
        console.error(e);
      }
    }
  }

  // 启动方法
  const start = () => {
    // 创建单个任务
    const createTask = (name, url) => {
      const runningKey = `${project}_${name}_running`,
        lastTimeKey = `${project}_${name}_lastTime`,
        lastTimeFailedKey = `${project}_${name}_lastTimeFailed`,
        lastTime = GM_getValue(lastTimeKey, 0),
        lastTimeFailed = GM_getValue(lastTimeFailedKey, false),
        running = GM_getValue(runningKey, false);
      return {
        name,
        lastTimeFailed,
        lastTime,
        running,
        task: () => {
          return new Promise((resolve, reject) => {
            GM_setValue(`${project}_${name}_running`, true);

            loadScript(
              url,
              (text) => {
                console.warn(`[jd_scripts] ${name} - 加载成功，开始工作`);
                GM_setValue(lastTimeKey, Date.now());
                GM_setValue(runningKey, false);
                GM_setValue(lastTimeFailedKey, false);

                createRunningSandbox(text);

                resolve();
              },
              () => {
                GM_setValue(runningKey, false);
                GM_setValue(lastTimeFailedKey, true);
                console.error(
                  `[jd_scripts] ${name}脚本加载失败，将在下次继续处理`
                );
                reject();
              }
            );
          });
        },
      };
    };

    // 实际运行的任务数组
    const all = [
      createTask(
        "星推官",
        "https://github.com/shunia/jd_scripts/raw/master/jd_xtg.js"
      ),
      // 到 11 月 12 日为止
      createTask(
        "狂欢城",
        "https://github.com/shunia/jd_scripts/raw/master/jd_818.js"
      ),
      createTask(
        "签到",
        "https://github.com/shunia/jd_scripts/raw/master/jd_bean_sign.js"
      ),
      createTask(
        "东东农场",
        "https://github.com/shunia/jd_scripts/raw/master/jd_fruit.js"
      ),
      createTask(
        "种豆得豆",
        "https://github.com/shunia/jd_scripts/raw/master/jd_plantBean.js"
      ),
      createTask(
        "宠汪汪",
        "https://github.com/shunia/jd_scripts/raw/master/jd_joy.js"
      ),
      createTask(
        "宠汪汪喂食",
        "https://github.com/shunia/jd_scripts/raw/master/jd_joy_feedPets.js"
      ),
      createTask(
        "宠汪汪兑换",
        "https://github.com/shunia/jd_scripts/raw/master/jd_joy_reward.js"
      ),
      createTask(
        "京东萌宠",
        "https://github.com/shunia/jd_scripts/raw/master/jd_pet.js"
      ),
      createTask(
        "京小超",
        "https://github.com/shunia/jd_scripts/raw/master/jd_superMarket.js"
      ),
      createTask(
        "京小超兑奖品",
        "https://github.com/shunia/jd_scripts/raw/master/jd_blueCoin.js"
      ),
      createTask(
        "全民抢红包",
        "https://github.com/shunia/jd_scripts/raw/master/jd_redPacket.js"
      ),
      createTask(
        "摇钱树",
        "https://github.com/shunia/jd_scripts/raw/master/jd_moneyTree.js"
      ),
      // 京东金融领金币
      createTask(
        "金融提鹅",
        "https://github.com/shunia/jd_scripts/raw/master/jd_daily_egg.js"
      ),
      createTask(
        "金融养猪",
        "https://github.com/shunia/jd_scripts/raw/master/jd_pigPet.js"
      ),
      createTask(
        "摇一摇",
        "https://github.com/shunia/jd_scripts/raw/master/jd_club_lottery.js"
      ),
      createTask(
        "全民领金币",
        "https://github.com/shunia/jd_scripts/raw/master/jd_collectProduceScore.js"
      ),
      createTask(
        "天天加速",
        "https://github.com/shunia/jd_scripts/raw/master/jd_speed.js"
      ),
      createTask(
        "狂欢城",
        "https://github.com/shunia/jd_scripts/raw/master/jd_818.js"
      ),
      // 还没写完
      // createTask('京喜工厂', 'https://github.com/shunia/jd_scripts/raw/master/jd_dreamFactory.js'),
    ]
      .filter((r) => {
        console.warn(`[jd_scripts] ${r.name} - 启动`);
        console.log(
          `[jd_scripts] ${r.name} - running: ${r.running}, lastTime: ${
            r.lastTime == 0 ? r.lastTime : Date.now() - r.lastTime
          }`
        );
        let valid = false;
        if (!r.running) {
          if (r.lastTime == 0 && !!r.lastTimeFailed) {
            // 没有成功启动过，需要再次启动
            valid = true;
          } else if (r.lastTime < Date.now() - 10800000) {
            // 3 小时间隔 10800000
            // 超过设定的上次运行间隔了，需要再次启动
            valid = true;
          }
        }
        if (!valid) console.log(`[jd_scripts] ${r.name} - 无需运行`);

        return valid;
      })
      .map((r) => {
        console.warn(`[jd_scripts] ${r.name} - 运行中`);
        return r.task();
      });

    // 启动
    console.log("[jd_scripts] 启动");
    Promise.all(all)
      .then(() => console.log(`[jd_scripts] 本次任务全部运行结束`))
      .catch(() => console.warn(`[jd_scripts] 部分任务运行失败，本次任务中断`));
  };

  window.addEventListener("message", (e) => {
    switch (e.data) {
      case "jd_scripts_start":
        start();
        break;
    }
  });

  window.postMessage("jd_scripts_start", "*");
})();
