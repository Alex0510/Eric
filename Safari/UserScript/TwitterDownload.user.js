// ==UserScript==
// @name        Twitter视频下载
// @description 一键保存视频/图片，解除敏感内容警告，强制切换高品质画面
// @version     1.2.0
// @author      Eric
// @namespace   none
// @match       https://*.twitter.com/*
// @match       https://twitter.com
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_download
// ==/UserScript==
/* jshint esversion: 8 */

const filename = 'twitter_{user-name}(@{user-id})_{date-time}_{status-id}_{file-type}';

const language = {
  en: {download: 'Download', completed: 'Download Completed', settings: 'Settings', dialog: {title: 'Download Settings', save: 'Save', record: 'Remember Download History', clear: '(Clear)', confirm: 'Clear download history?', pattern: 'File Name Pattern'}},
  ja: {download: 'ダウンロード', completed: 'ダウンロード完了', settings: '設定', dialog: {title: 'ダウンロード設定', save: '保存', record: 'ダウンロード履歴を保存する', clear: '(クリア)', confirm: 'ダウンロード履歴を削除する？', pattern: 'ファイル名パターン'}},
  zh: {download: '下载', completed: '下载完成', settings: '设置', dialog: {title: '下载设置', save: '保存', record: '保存下载记录', clear: '(清除)', confirm: '确认要清除下载记录？', pattern: '文件名格式'}},
  'zh-Hant': {download: '下載', completed: '下載完成', settings: '設置', dialog: {title: '下載設置', save: '保存', record: '保存下載記錄', clear: '(清除)', confirm: '確認要清除下載記錄？', pattern: '文件名規則'}},
};

const svg = `
<g class="download"><path d="M3,14 v5 q0,2 2,2 h14 q2,0 2,-2 v-5 M7,10 l4,4 q1,1 2,0 l4,-4 M12,3 v11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></g>
<g class="completed"><path d="M3,14 v5 q0,2 2,2 h14 q2,0 2,-2 v-5 M7,10 l3,4 q1,1 2,0 l8,-11" fill="none" stroke="#1DA1F2" stroke-width="2" stroke-linecap="round" /></g>
<g class="loading"><circle cx="12" cy="12" r="10" fill="none" stroke="#1DA1F2" stroke-width="4" opacity="0.4" /><path d="M12,2 a10,10 0 0 1 10,10" fill="none" stroke="#1DA1F2" stroke-width="4" stroke-linecap="round" /></g>
<g class="failed"><circle cx="12" cy="12" r="11" fill="#f33" stroke="currentColor" stroke-width="2" opacity="0.8" /><path d="M14,5 a1,1 0 0 0 -4,0 l0.5,9.5 a1.5,1.5 0 0 0 3,0 z M12,17 a2,2 0 0 0 0,4 a2,2 0 0 0 0,-4" fill="#fff" stroke="none" /></g>
`;

const css = `
.tmd-down > div > div > div:nth-child(2) {display: none}
.tmd-down:hover > div > div {color: rgba(29, 161, 242, 1.0);}
.tmd-down:hover > div > div > div > div {background-color: rgba(29, 161, 242, 0.1);}
.tmd-down:active > div > div > div > div {background-color: rgba(29, 161, 242, 0.2);}
.tmd-down g {display: none;}
.tmd-down.download g.download, .tmd-down.completed g.completed, .tmd-down.loading g.loading,.tmd-down.failed g.failed {display: unset;}
.tmd-down.loading svg {animation: spin 1s linear infinite;}
@keyframes spin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}
.tmd-btn {display: inline-block; background-color: #1DA1F2; color: #FFFFFF; padding: 0 20px; border-radius: 99px;}
.tmd-tag {display: inline-block; background-color: #FFFFFF; color: #1DA1F2; padding: 0 10px; border-radius: 10px; border: 1px solid #1DA1F2;  font-weight: bold; margin: 5px;}
.tmd-btn:hover {background-color: rgba(29, 161, 242, 0.9);}
.tmd-tag:hover {background-color: rgba(29, 161, 242, 0.1);}
.tmd-notifier {display: none; position: fixed; left: 16px; bottom: 16px; background: #fff; border: 1px solid #ccc; border-radius: 8px; padding: 4px;}
.tmd-notifier.running {display: flex; align-items: center;}
.tmd-notifier label {display: inline-flex; align-items: center; margin: 0 8px;}
.tmd-notifier label:before {content: " "; width: 32px; height: 16px; background-position: center; background-repeat: no-repeat;}
.tmd-notifier label:nth-child(1):before {background-image:url("data:image/svg+xml;charset=utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22><path d=%22M3,14 v5 q0,2 2,2 h14 q2,0 2,-2 v-5 M7,10 l4,4 q1,1 2,0 l4,-4 M12,3 v11%22 fill=%22none%22 stroke=%22%23666%22 stroke-width=%222%22 stroke-linecap=%22round%22 /></svg>");}
.tmd-notifier label:nth-child(2):before {background-image:url("data:image/svg+xml;charset=utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22><path d=%22M12,2 a1,1 0 0 1 0,20 a1,1 0 0 1 0,-20 M12,5 v7 h6%22 fill=%22none%22 stroke=%22%23999%22 stroke-width=%222%22 stroke-linejoin=%22round%22 stroke-linecap=%22round%22 /></svg>");}
.tmd-notifier label:nth-child(3):before {background-image:url("data:image/svg+xml;charset=utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22><path d=%22M12,0 a2,2 0 0 0 0,24 a2,2 0 0 0 0,-24%22 fill=%22%23f66%22 stroke=%22none%22 /><path d=%22M14.5,5 a1,1 0 0 0 -5,0 l0.5,9 a1,1 0 0 0 4,0 z M12,17 a2,2 0 0 0 0,5 a2,2 0 0 0 0,-5%22 fill=%22%23fff%22 stroke=%22none%22 /></svg>");}
`;

const TMD = (function () {
  let lang, history;
  return {
    init: function () {
      GM_registerMenuCommand((language[navigator.language] || language.en).settings, this.settings);
      document.head.insertAdjacentHTML('beforeend', '<style>' + css + '</style>');
      lang = language[document.querySelector('html').lang] || language.en;
      history = this.storage('history');
    },
    inject: function (article) {
      let media_selector = [
        'a[href*="/photo/1"]',
        'div[role="progressbar"]',
        'div[data-testid="playButton"]',
        'a[href="/settings/safety"]'
      ];
      let media = article.querySelector(media_selector.join(','));
      if (media) {
        let status_id = article.querySelector('a[href*="/status/"]').href.split('/status/').pop().split('/').shift();
        let btn_group = article.querySelector('div[role="group"]');
        let btn_share = Array.from(btn_group.querySelectorAll(':scope>div>div')).pop().parentNode;
        let btn_down = btn_share.cloneNode(true);
        btn_down.querySelector('svg').innerHTML = svg;
        let is_exist = history.indexOf(status_id) >= 0;
        this.status(btn_down, 'tmd-down');
        this.status(btn_down, is_exist ? 'completed' : 'download', is_exist ? lang.completed : lang.download);
        btn_group.insertBefore(btn_down, btn_share.nextSibling);
        btn_down.onclick = () => this.click(btn_down, status_id, is_exist);
        article.dataset.injected = 'true';
      }
    },
    click: async function (btn, status_id, is_exist) {
      if (btn.classList.contains('loading')) return;
      this.status(btn, 'loading');
      let out = (await GM_getValue('filename', filename)).split('\n').join('');
      let record = await GM_getValue('record', true);
      let json = await this.fetchJson(status_id);
      let tweet = json.globalObjects.tweets[status_id];
      let user = json.globalObjects.users[tweet.user_id_str];
      let invalid_chars = {'\\': '＼', '\/': '／', '\|': '｜', '<': '＜', '>': '＞', ':': '：', '*': '＊', '?': '？', '"': '＂', '🔞': ''};
      let datetime = out.match(/{date-time(-local)?:[^{}]+}/) ? out.match(/{date-time(?:-local)?:([^{}]+)}/)[1].replace(/[\\\/\|<>\*\?:"]/g, v => invalid_chars[v]) : 'YYYYMMDD-hhmmss';
      let info = {};
      info['status-id'] = status_id;
      info['user-name'] = user.name.replace(/([\\\/\|\*\?:"]|🔞)/g, v => invalid_chars[v]);
      info['user-id'] = user.screen_name;
      info['date-time'] = this.formatDate(tweet.created_at, datetime);
      info['date-time-local'] = this.formatDate(tweet.created_at, datetime, true);
      info['full-text'] = tweet.full_text.split('\n').join(' ').replace(/\s*https:\/\/t\.co\/\w+/g, '').replace(/[\\\/\|<>\*\?:"]/g, v => invalid_chars[v]);
      let medias = tweet.extended_entities && tweet.extended_entities.media;
      if (medias.length > 0) {
        let tasks = medias.length;
        let tasks_result = [];
        medias.forEach((media, i) => {
          info.url = media.type == 'photo' ? media.media_url + ':orig' : media.video_info.variants.filter(n => n.content_type == 'video/mp4').sort((a, b) => b.bitrate - a.bitrate)[0].url;
          info.file = info.url.split('/').pop().split(/[:?]/).shift();
          info['file-name'] = info.file.split('.').shift();
          info['file-ext'] = info.file.split('.').pop();
          info['file-type'] = media.type.replace('animated_', '');
          info.out = (out.replace(/\.?{file-ext}/, '') + (medias.length > 1 && !out.match('{file-name}') ? '-' + i : '') + '.{file-ext}').replace(/{([^{}:]+)(:[^{}]+)?}/g, (match, name) => info[name]);
          this.downloader.add({
            url: info.url,
            name: info.out,
            onload: () => {
              tasks -= 1;
              tasks_result.push((medias.length > 1 ? i + 1 + ': ' : '') + lang.completed);
              this.status(btn, null, tasks_result.sort().join('\n'));
              if (tasks === 0) {
                this.status(btn, 'completed', lang.completed);
                if (record && !is_exist) {
                  history.push(status_id);
                  this.storage('history', status_id);
                }
              }
            },
            onerror: result => {
              tasks = -1;
              tasks_result.push((medias.length > 1 ? i + 1 + ': ' : '') + result.details.current);
              this.status(btn, 'failed', tasks_result.sort().join('\n'));
            }
          });
        });
      } else {
        this.status(btn, 'failed', 'MEDIA_NOT_FOUND');
      }
    },
    status: function (btn, css, title, style) {
      if (css) {
        btn.classList.remove('download', 'completed', 'loading', 'failed');
        btn.classList.add(css);
      }
      if (title) btn.title = title;
      if (style) btn.style.cssText = style;
    },
    settings: async function () {
      const $element = (parent, tag, style, content, css) => {
        let el = document.createElement(tag);
        if (style) el.style.cssText = style;
        if (typeof content !== 'undefined') {
          if (tag == 'input') {
            if (content == 'checkbox') el.type = content;
            else el.value = content;
          } else el.innerHTML = content;
        }
        if (css) css.split(' ').forEach(c => el.classList.add(c));
        parent.appendChild(el);
        return el;
      };
      let wapper = $element(document.body, 'div', 'position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; background-color: #0009; z-index: 10;');
      let wapper_close;
      wapper.onmousedown = e => {
        wapper_close = e.target == wapper;
      };
      wapper.onmouseup = e => {
        if (wapper_close && e.target == wapper) wapper.remove();
      };
      let dialog = $element(wapper, 'div', 'position: absolute; left: 50%; top: 50%; transform: translateX(-50%) translateY(-50%); width: fit-content; width: -moz-fit-content; background-color: #f3f3f3; border: 1px solid #ccc; border-radius: 10px;');
      let title = $element(dialog, 'h3', 'margin: 10px 20px;', lang.dialog.title);
      let options = $element(dialog, 'div', 'margin: 10px; border: 1px solid #ccc; border-radius: 5px;');
      let record_label = $element(options, 'label', 'display: block; margin: 10px;', lang.dialog.record);
      let record_input = $element(record_label, 'input', 'float: left;', 'checkbox');
      record_input.checked = await GM_getValue('history', true);
      record_input.onchange = () => GM_setValue('history', record_input.checked);
      let record_clear = $element(record_label, 'label', 'margin: 10px; color: blue;', lang.dialog.clear);
      record_clear.onclick = () => {
        if (confirm(lang.dialog.confirm)) {
          history = [];
          localStorage.removeItem('history');
        }
      };
      let filename_div = $element(dialog, 'div', 'margin: 10px; border: 1px solid #ccc; border-radius: 5px;');
      let filename_label = $element(filename_div, 'label', 'display: block; margin: 10px 15px;', lang.dialog.pattern);
      let filename_input = $element(filename_label, 'textarea', 'display: block; min-width: 500px; max-width: 500px; min-height: 100px; font-size: inherit;', await GM_getValue('filename', filename));
      let filename_tags = $element(filename_div, 'label', 'display: table; margin: 10px;', `
<span class="tmd-tag" title="user name">{user-name}</span>
<span class="tmd-tag" title="The user name after @ sign.">{user-id}</span>
<span class="tmd-tag" title="example: 1234567890987654321">{status-id}</span>
<span class="tmd-tag" title="{date-time} : Posted time in UTC.\n{date-time-local} : Your local time zone.\n\nDefault:\nYYYYMMDD-hhmmss => 20201231-235959\n\nExample of custom:\n{date-time:DD-MMM-YY hh.mm} => 31-DEC-21 23.59">{date-time}</span><br>
<span class="tmd-tag" title="Text content in tweet.">{full-text}</span>
<span class="tmd-tag" title="Type of &#34;video&#34; or &#34;photo&#34; or &#34;gif&#34;.">{file-type}</span>
<span class="tmd-tag" title="Original filename from URL.">{file-name}</span>
`);
      filename_input.selectionStart = filename_input.value.length;
      filename_tags.querySelectorAll('.tmd-tag').forEach(tag => {
        tag.onclick = () => {
          let ss = filename_input.selectionStart;
          let se = filename_input.selectionEnd;
          filename_input.value = filename_input.value.substring(0, ss) + tag.innerText + filename_input.value.substring(se);
          filename_input.selectionStart = ss + tag.innerText.length;
          filename_input.selectionEnd = ss + tag.innerText.length;
          filename_input.focus();
        };
      });
      let btn_save = $element(title, 'label', 'float: right;', lang.dialog.save, 'tmd-btn');
      btn_save.onclick = async () => {
        await GM_setValue('filename', filename_input.value);
        wapper.remove();
      };
    },
    fetchJson: async function (status_id) {
      let url = 'https://twitter.com/i/api/2/timeline/conversation/' + status_id + '.json?tweet_mode=extended&include_entities=false&include_user_entities=false';
      let cookies = this.getCookie();
      let headers = {
        'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
        'x-twitter-active-user': 'yes',
        'x-twitter-client-language': cookies.lang,
        'x-csrf-token': cookies.ct0
      };
      if (cookies.ct0.length == 32) headers['x-guest-token'] = cookies.gt;
      return await fetch(url, {headers: headers}).then(result => result.json());
    },
    getCookie: function (name) {
      let cookies = {};
      document.cookie.split(';').filter(n => n.indexOf('=') > 0).forEach(n => {
        n.replace(/^([^=]+)=(.+)$/, (match, name, value) => {
          cookies[name.trim()] = value.trim();
        });
      });
      return name ? cookies[name] : cookies;
    },
    storage: function (name, value) {
      let data = JSON.parse(localStorage.getItem(name) || '[]');
      if (value) data.push(value);
      else return data;
      localStorage.setItem(name, JSON.stringify(data));
    },
    formatDate: function (i, o, tz) {
      let d = new Date(i);
      if (tz) d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      let m = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      let v = {
        YYYY: d.getUTCFullYear().toString(),
        YY: d.getUTCFullYear().toString(),
        MM: d.getUTCMonth() + 1,
        MMM: m[d.getUTCMonth()],
        DD: d.getUTCDate(),
        hh: d.getUTCHours(),
        mm: d.getUTCMinutes(),
        ss: d.getUTCSeconds(),
        h2: d.getUTCHours() % 12,
        ap: d.getUTCHours() < 12 ? 'AM' : 'PM'
      };
      return o.replace(/(YY(YY)?|MMM?|DD|hh|mm|ss|h2|ap)/g, n => ('0' + v[n]).substr(-n.length));
    },
    downloader: (function () {
      let tasks = [], thread = 0, max_thread = 2, retry = 0, max_retry = 2, failed = 0, notifier, has_failed = false;
      return {
        add: function (task) {
          tasks.push(task);
          if (thread < max_thread) {
            thread += 1;
            this.next();
          } else this.update();
        },
        next: async function () {
          let task = tasks.shift();
          await this.start(task);
          if (tasks.length > 0 && thread <= max_thread) this.next();
          else thread -= 1;
          this.update();
        },
        start: function (task) {
          this.update();
          return new Promise(resolve => {
            GM_download({
              url: task.url,
              name: task.name,
              onload: result => {
                task.onload();
                resolve();
              },
              onerror: result => {
                this.retry(task, result);
                resolve();
              },
              ontimeout: result => {
                this.retry(task, result);
                resolve();
              }
            });
          });
        },
        retry: function (task, result) {
          retry += 1;
          if (retry == 3) max_thread = 1;
          if (task.retry && task.retry >= max_retry ||
              result.details && result.details.current == 'USER_CANCELED') {
            task.onerror(result);
            failed += 1;
          } else {
            if (max_thread == 1) task.retry = (task.retry || 0) + 1;
            this.add(task);
          }
        },
        update: function() {
          if (!notifier) {
            notifier = document.createElement('div');
            notifier.title = 'Twitter Media Downloader';
            notifier.classList.add('tmd-notifier');
            notifier.innerHTML = '<label>0</label>|<label>0</label>';
            document.body.appendChild(notifier);
          }
          if (failed > 0 && !has_failed) {
            has_failed = true;
            notifier.innerHTML += '|';
            let clear = document.createElement('label');
            notifier.appendChild(clear);
            clear.onclick = () => {
              notifier.innerHTML = '<label>0</label>|<label>0</label>';
              failed = 0;
              has_failed = false;
              this.update();
            }
          }
          notifier.firstChild.innerText = thread;
          notifier.firstChild.nextElementSibling.innerText = tasks.length;
          if (failed > 0) notifier.lastChild.innerText = failed;
          if (thread > 0 || tasks.length > 0 || failed > 0) notifier.classList.add('running');
          else notifier.classList.remove('running');
        }
      };
    })()
  };
})();

(function () {
  TMD.init();
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(node => {
    let article = node.tagName == 'DIV' && (node.querySelector('article') || node.closest('article'));
    if (article && !article.dataset.injected) TMD.inject(article);
  }))).observe(document.body, {childList: true, subtree: true});
})();
function hidden (div) {

  div.style.display = 'none'

}

function removeClass (div, className) {

  div.classList.remove(className)

}

function has (string, search){

  return string.includes(search)

}

function removeSensitiveContentWarning () {

	const buttons = document.querySelectorAll('.r-drfeu3')

	const blur = document.querySelectorAll('.r-yfv4eo.r-16y2uox')

	buttons.forEach(hidden)

	buttons.forEach(function (div) { removeClass(div, '.r-drfeu3') })

	blur.forEach(function (div) { removeClass(div, 'r-yfv4eo') })

}

(function () {

  'use strict';

  removeSensitiveContentWarning()

  setInterval(function () {

    const url = window.location.href

    if (has(url, 'twitter.com')) {

		removeSensitiveContentWarning()

    }

  }, 2000)

})()
(function() {
    'use strict';
    initHijack();
    initUI();
    
    function initHijack() {
        var realOpen = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = hijackedOpen;
        
        function hijackedOpen() {
            var url = arguments['1'];
            if (isHLSPlaylist(url)) {
                this.addEventListener('readystatechange', function(e) {
                    if (this.readyState === 4) {
                        var originalText = e.target.responseText;
                        if(isMasterPlaylist(originalText)) {
                            var modifiedText = modifyMasterPlaylist(originalText);
                            Object.defineProperty(this, 'response', {writable: true});
                            Object.defineProperty(this, 'responseText', {writable: true});
                            this.response = this.responseText = modifiedText;
                        }
                    }
                });
            }
            return realOpen.apply(this, arguments);
        };

        function isHLSPlaylist(url) {
            var reg = new RegExp(/^https:\/\/video\.twimg\.com\/.+m3u8?/, 'i') ;
            return reg.test(url);
        }

        function isMasterPlaylist(text) {
            return text.indexOf('#EXT-X-TARGETDURATION') === -1 && text.indexOf('#EXT-X-STREAM-INF') != -1;
        }

        function modifyMasterPlaylist(text) {
            var result = text;
            var reg = new RegExp(/^#EXT-X-STREAM-INF:.*BANDWIDTH=(\d+).*\r?\n.*$/, 'gm');
            var stream = reg.exec(text);
            if (stream) {
                var globalTags = text.substring(0, stream.index);

                // find max bitrate media playlist
                var maxBitrateStream = stream;
                while((stream = reg.exec(text)) != null){
                    if (parseInt(stream[1]) > parseInt(maxBitrateStream[1])) {
                        maxBitrateStream = stream;
                    }
                }
    
                result = globalTags + maxBitrateStream[0];
            }
            return result;
        }
    }
    
    function initUI() {
        // add a mark helps identify if userscript loaded successfully
        var disableHQ = localStorage.getItem('vqfft-disablehq');
        if(!disableHQ) {
            var mark = document.createElement('button');
            mark.innerText = 'HQ';
            mark.style = "position: fixed;right: 5px;top: 5px;color: white;border-width: 0px;border-radius: 5px;background-color: gray;opacity: 0.5;";
            mark.onclick = function() {
                if(confirm('Do not display HQ mark anymore?')){
                    localStorage.setItem('vqfft-disablehq', 'true');
                    mark.remove();
                }
            };
            document.body.appendChild(mark);
        }
    }
})();

