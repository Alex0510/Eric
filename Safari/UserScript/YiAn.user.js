// ==UserScript==
// @name         易安全网VIP视频解析
// @name:en      易安解析
// @version      22.6.4
// @description  精选VIP视频解析和在线观看源，视频广告少，原网页解析，享受VIP的原画观影体验。支持腾讯视频、爱奇艺、优酷、芒果TV、搜狐视频、PPTV、1905、乐视等网站。易安解析评分排序，不同网站不同排序，越好用的解析越靠前。
// @description:en  NO VIP NO VIDEO. For v.qq, iqiyi, youku, mgtv, tv.sohu, pptv, 1905, letv.
// @author       (o˘◡˘o)
// @namespace    https://https://github.com/zbaiicn
// @supportURL   https://https://github.com/zbaiicn
// @icon         https://b2.kuibu.net/file/imgdisk/imgs/2022/04/84573e6854fa3b12.jpg
// @license      GPL License
// @run-at       document-start
// @include      *
// ==/UserScript==

! function() {
  var 易安解析 = "",
    搜索源 = "\n\n  豆瓣  https://search.douban.com/movie/subject_search?search_text=**  https://m.douban.com/search/?type=movie&query=**\n\n  腾讯  https://m.v.qq.com/search.html?act=0&keyWord=**   https://v.qq.com/x/search/?q=**\n\n  爱奇艺  https://m.iqiyi.com/search.html?source=default&key=**  https://so.iqiyi.com/so/q_**\n\n  优酷  https://www.soku.com/m/y/video?q=**  https://so.youku.com/search_video/q_**\n\n  芒果  https://m.mgtv.com/so/?k=**  https://so.mgtv.com/so/k-**\n\n  哔哩哔哩  https://m.bilibili.com/search.html?keyword=**  https://search.bilibili.com/all?keyword=**\n\n  1090  https://1090ys.com/?c=search&sort=addtime&order=desc&page=1&wd=**\n\n  哔滴  https://bde4.com/search/**\n\n  云播  https://m.yunbtv.com/vodsearch/-------------.html?wd=**  https://www.yunbtv.com/vodsearch/-------------.html?wd=**\n\n  飞极速  http://m.feijisu8.com/search/**  http://feijisu8.com/search/**\n\n  PPTV https://sou.pptv.com/s_video?kw=**  https://msou.pptv.com/s_video/pg_result?keyword=**\n\n  搜狐  https://m.tv.sohu.com/upload/h5/m/mso.html?key=**  https://so.tv.sohu.com/mts?wd=**\n\n  1905 https://vip.1905.com/Search?q=**\n\n  乐视  https://m.le.com/search?wd=**  https://so.le.com/s?wd=**\n\n  完美  https://www.wanmeikk.me/search/-------------.html?wd=**\n\n",
    BETTER_ADDONS = [{
      name: "哔哩哔哩·搜索",
      match: /bilibili.com\/search|search.bilibili.com/,
      jump: "#all-list | append, .index__board__src-search-board-"
    }, {
      name: "哔哩哔哩 - m",
      match: /m\.bilibili\.com/,
      sign: ".mg-footer-copyright",
      hide: ".index__openAppBtn__src-commonComponent-topArea-, .index__container__src-commonComponent-bottomOpenApp-, .bili-app, .recom-wrapper, .b-footer, .open-app-bar, .open-app-float, .more-review-wrapper"
    }, {
      name: "腾讯·搜索",
      match: /v.qq.com\/(\w+\/)?search/,
      jump: "#result, .wrapper_main > .mod_pages",
      sign: ".copyright",
      hide: ".tvp_app_bar"
    }, {
      name: "腾讯·播放页",
      match: /v\.qq\.com\/(cover|play|x\/cover|x\/page|x\/play|x\/m\/cover|x\/m\/page|x\/m\/play)/,
      vip: "#vip_title, .U_box_bg_a, .player_headline, .mod_video_info",
      title: ".mod_video_info .video_title, ._main_title, .player_title",
      fixUrl: function(n) {
        if (n.includes("cid=")) {
          var e = n.match(/cid=(\w+)/)[1],
            t = n.match(/vid=(\w+)/);
          return t = t ? "/" + t[1] : "", "https://v.qq.com/x/cover/".concat(e).concat(t, ".html")
        }
        return n.includes("/x/cover") ? n.replace(/\.html.*/, ".html") : n
      },
      hide: '.mod_source, .video_function, .mod_promotion, #vip_privilege, #vip_activity, .U_bg_b, .btn_open_v, .btn_openapp, #vip_header, .btn_user_hd, .mod_sideslip_privileges, .mod_game_rec, .mod_source, .mod_promotion, .mod_sideslip_h, .btn_open, .btn_pay, .mod_box_lastview, .mod_vip_popup, .mod_vip_popup + .mask_layer, txpdiv[data-role="hd-ad-adapter-interactivelayer"]',
      css: "\nbody, #vip_title {\n  padding-bottom: 0 !important;\n}\n\n.mod_episodes_numbers.is-vip .item {\n  width: auto;\n  padding: 0 1em;\n}\n\n.U_html_bg .container {\n  padding-bottom: 30px;\n}\n\n.mod_play .mod_player_viptips .btn_try {\n  left: 30%;\n}"
    }, {
      name: "爱奇艺·搜索",
      match: /m.iqiyi.com\/search|so.iqiyi.com/,
      jump: "-.m-box, .search-con-page",
      sign: ".m-footer",
      hide: ".btn-ticket, .btn-yuyue, .btn-download, .m-iqyDown"
    }, {
      name: "爱奇艺·播放页",
      match: /\.iqiyi\.com\/v_/,
      vip: 'div[name="m-videoInfo"], #block-C',
      title: "#widget-videotitle, .video-title, .c-title-link, .player-title a",
      fixUrl: !0,
      sign: ".m-footer",
      hide: '.m-iqyDown, .header-login + div, .m-video-action, div[name="m-vipRights"], div[name="m-extendBar"], .m-iqylink-diversion, .m-iqylink-guide, .c-openVip, .c-score-btn, .m-videoUser-spacing, .m-pp-entrance, .m-hotWords-bottom, div[template-type="ALBUM"] .m-player-tip, .iqp-box-integral',
      css: '\n.page_play {\n  padding-bottom: 0;\n}\n\ndiv[name="m-videoInfo"] {\n  padding-top: 1em;\n}\n\n.m-box-items .oo-album-item {\n  border-radius: 0.05em;\n  background-color: #e9ecef;\n  color: #495057;\n  padding: 0.5em 1em;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n  margin: 0.25em;\n  font-weight: bold;\n}\n\n.m-video-player #oo-player {\n  padding-top: 56.25%;\n  top: 50%;\n  transform: translateY(-50%);\n}\n'
    }, {
      name: "优酷·搜索",
      match: /soku.com\/m.+q=|so.youku.com\/search_video/,
      jump: "#bpmodule-main, .yk_result"
    }, {
      name: "优酷·播放页",
      match: /m\.youku\.com\/a|m\.youku\.com\/v|v\.youku\.com\/v_/,
      vip: ".h5-detail-info, .player-title",
      title: ".player-title .subtitle a, .module-name, .anthology-title-wrap .title, .title-link",
      fixUrl: !0,
      sign: ".copyright",
      hide: ".h5-detail-guide, .h5-detail-ad, .brief-btm, .smartBannerBtn, .cmt-user-action, #right-title-ad-banner, .Corner-container",
      css: "\n#bpmodule-playp\n// NOTE SPLITERage-lefttitle {\n  height: auto !important;\n}"
    }, {
      name: "土豆·播放页",
      match: /\.tudou.com\/v\//,
      vip: ".play-video-desc, .td-play__baseinfo",
      title: ".td-listbox__title, .video-desc-title",
      fixUrl: !0,
      hide: ".video-player-topbar, .td-h5__player__appguide, #tudou-footer, .dropdown__panel__con"
    }, {
      name: "芒果·搜索",
      match: /m.mgtv.com\/so\/|so.mgtv.com\/so/,
      jump: "#paginator, .result-box .media",
      keyword: /k[-=]([^&\?\/\.]+)/
    }, {
      name: "芒果·播放页",
      match: /\.mgtv\.com\/(b|l)\//,
      vip: [".xuanji | before", ".v-panel-box"],
      title: ".v-panel-title, .vt-txt",
      fixUrl: !0,
      sign: ".mg-footer-copyright",
      hide: ".ad-banner, .video-area-bar, .video-error .btn, .m-vip-list, .m-vip-list + div:not([class]), .toapp, .video-comment .ft, .mg-app-swip"
    }, {
      name: "搜狐·搜索",
      match: /m.tv.sohu.com.+key=|so.tv.sohu.com.+wd=/,
      jump: ".ssMore | before, .select-container | before"
    }, {
      name: "搜狐·播放页",
      match: /film\.sohu\.com\/album\/|tv\.sohu\.com\/(v|phone_play_film)/,
      vip: ".title-wrap, .videoInfo, .tw-info, .player-detail, .movie-info-content",
      title: "#vinfobox h2, .t-info, .movie-t h3",
      fixUrl: function(n) {
        if (/phone_play_film.+channeled=/.test(n)) {
          var e = n.match(/channeled=(\w+)/)[1],
            t = n.match(/aid=(\w+)/)[1];
          return "https://film.sohu.com/album/".concat(t, ".html?channeled=").concat(e)
        }
        return n
      },
      sign: ".links",
      hide: ".actv-banner, .btn-xz-app, .twinfo_iconwrap, .btn-comment-app, #ad_banner, .advertise, .main-ad-view-box, .foot.sohu-swiper, .app-star-vbox, .app-guess-vbox, .main-rec-view-box, .app-qianfan-box, .comment-empty-bg, .copyinfo, .ph-vbox, .btn_m_action, .btn-xz-app, #film_top_banner, .btn-comment-app",
      css: "\n.comment-empty-txt {\n  margin-bottom: 0;\n}\n\n.app-view-box + footer {\n  padding: 0;\n  opacity: 0.5;\n}\n\n#sohuplayer #menu {\n  z-index: 2147483647;\n}"
    }, {
      name: "乐视·搜索",
      match: /m.le.com\/search|so.le.com\/s/,
      jump: ".column_tit | before, .Relate | before"
    }, {
      name: "乐视·播放页",
      match: /\.le\.com\/(ptv\/vplay\/|vplay_)/,
      vip: ".introduction_box, .briefIntro_left .info_list",
      title: ".briefIntro_info .info_tit, #j-introduction h2",
      fixUrl: !0,
      hide: ".gamePromotion, .gamePromotionTxt, #j-leappMore, .lbzDaoliu, .arkBox"
    }, {
      name: "咪咕.cn·搜索",
      match: /\.migu\.cn\/search\.html/,
      jump: ".pagination, .copyright | before",
      keyword: /content=([^&\?\/\.]+)/,
      hide: ".down-btn"
    }, {
      name: "咪咕·搜索",
      match: /\.miguvideo\.com\/.*search.html/,
      jump: ".search-pagination, .search-main",
      keyword: /keywords=([^&\?\/\.]+)|\?.*#([^&\?\/\.]+)/
    }, {
      name: "咪咕·播放页",
      match: /miguvideo\.com\/.+\/detail\.html/,
      vip: ".playerFooter, .programgroup",
      title: ".left-box .title, .episodeTitle, .video_title",
      hide: '.group-item[name*="广告"], .openClient'
    }, {
      name: "PPTV·搜索",
      match: /sou.pptv.com\/s_video.+kw=|msou.pptv.com\/s_video\/.+keyword=/,
      jump: ".pagination, .zhengpian-box | append"
    }, {
      name: "PPTV·播放页",
      match: /(v|m)\.pptv\.com\/show\//,
      vip: ".m .cf, .vod-tit, .vod-intor",
      title: "#video-info h1, .vod-tit-in span, .tit",
      fixUrl: !0,
      hide: '.w-video-vastad, #video-download-game, div[class*="openapp"], div[class*="side-adv"], div[id*="afp_"], div[id*="-afp"], iframe[src*="/game/"], .afpPosition, .download-iconbar'
    }, {
      name: "华数·搜索",
      match: /wasu\.cn\/.+Search\/.+k=/,
      jump: "#topVod"
    }, {
      name: "华数·播放页",
      match: /wasu\.cn\/.*[pP]lay\/show\//,
      vip: ".movie_title",
      title: ".movie_title h2",
      fixUrl: !0,
      hide: 'div[id*="BAIDU"], .player_menu_con, body > div[style*="fixed"]'
    }, {
      name: "1905·搜索",
      match: /\.1905\.com\/(Search|search)/,
      jump: ".pagination, #new_page"
    }, {
      name: "1905·播放页",
      match: /1905.com\/play/,
      vip: ".playerBox-info, #movie_info, .player-nav",
      title: "#movie_info .infoInner .title, .movie-title, .tv_title",
      fixUrl: !0,
      hide: "#app_store, .openMembershipBtn, body > div[id] > iframe, .pv2-advertisement, .open-app",
      css: "\n#movie_info {\n  margin-top: 1em;\n}"
    }, {
      name: "完美看看·搜索",
      match: /wanmeikk\.me\/search/,
      jump: ".stui-page, .stui-pannel"
    }, {
      name: "完美看看",
      match: /wanmeikk\.me/,
      hide: ".container ~ *[id]"
    }, {
      name: "飞极速·搜索",
      match: "feijisu8.com/search",
      jump: "#result"
    }, {
      name: "飞极速",
      match: /feijisu8\.com/,
      hide: ".index-top ~ div, .v-top ~ div, .footer ~ div, .footer ~ brde, body > div:not([class])"
    }, {
      name: "1090影视·搜索",
      match: /1090ys.com\/.+c=search/,
      jump: ".stui-page, .stui-pannel"
    }, {
      name: "1090影视",
      match: /1090ys\.com/,
      hide: ".container ~ *[id]",
      css: "\nbody {\n  padding-bottom: 0 !important;\n}"
    }, {
      name: "哔滴·搜索",
      match: /bde4.com\/search\//,
      jump: ".search-list"
    }, {
      name: "哔滴",
      match: /bde4\.com/,
      hide: "body > *[id]"
    }, {
      name: "云播·搜索",
      match: "yunbtv.com/vodsearch",
      jump: ".pager",
      keyword: ".breadcrumb font"
    }],
    PurifyKeywordRegex = /.*《|》.*|\s*第.{1,3}[季集][\s\d]*$|\s+\d{2,3}\s*$/g,
    CommonSearchKeywordRegex = /(wd|key|keyword|keyWord|kw|q)=([^&\?\/\.-]+)|(search\/|seacher-|q_)([^&\?\/\.-]+)/,
    PurifyStyle = "\ndisplay: none !important;\nvisibility: hidden !important;\nwidth: 0 !important;\nheight: 0 !important;\nmax-width: 0 !important;\nmax-height: 0 !important;\noverflow: hidden !important;\nposition: absolute !important;\nleft: -99999px !important;\nopacity: 0 !important;\npointer-events: none !important;\nz-index: -1 !important;",
    PlayerSelector = "#iframaWrapper, #mgtv-player-wrap, #sohuplayer .x-player, #wPlayer, #video-box, #playerbox, .td-h5__player, .td-playbox, .iqp-player, .g-play .video-area, #mod_player, #playBox, #j-player, #video, .m-video-player, .site_player",
    VERSION = "22.6.4",
    Href = location.href;

  function Is(n) {
    return n.test(Href)
  }

  function IsNot(n) {
    return !Is(n)
  }
  if (!Is(/m\.le\.com/) || !IsNot(/m.le.com\/search|so.le.com\/s|\.le\.com\/(ptv\/vplay\/|vplay_)/)) {
    var D = decodeURIComponent,
      charToNum = function(n) {
        return n.charCodeAt(0) - 97
      },
      numToChar = function(n) {
        return String.fromCharCode(97 + n)
      },
      CaesarShift = (new Date).getMonth() + 3,
      caesar = function(n, e) {
        return numToChar(charToNum(n) + e % 26)
      },
      caesarDec = function(n, e) {
        return numToChar(charToNum(n) - e % 26)
      },
      PLUGIN_ID = CaesarDecrypt(D(Reverse(atob("QzIlc0M5JUJDJTVBJTc5JTJFJUM5JUJDJXMtNDIlc3MycXN6bWk"))), 4),
      PLUGIN_ATTR = "oo-movie",
      HTML = document.getElementsByTagName("html")[0];
    if (HTML.getAttribute(PLUGIN_ATTR) !== PLUGIN_ID) {
      var DEBUG = !1,
        screenWidth = window.screen.width,
        isMobile = screenWidth <= 600 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || DEBUG && Is(/\/\/m\./);
      log(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), navigator.userAgent);
      var collapseNum = isMobile ? 8 : 12,
        VIP_URLS = "";
      try {
        VIP_URLS = (window.VIP_URLS || 易安解析 || "").trim()
      } catch (n) {}
      搜索源 = window.搜索源 || 搜索源 || "", IsNot(/douban\.com/) && isMobile && 搜索源 && (搜索源 = "选影视  https://movie.douban.com/tag/#/\n\n" + 搜索源);
      var OO_SIGN = CaesarDecrypt(D(Reverse(atob("QzIlc0M5JUJDJTVBJTc5JTJFJUM5JUJDJXMt"))), 4);
      log("✔ Loaded", isMobile ? "isMobile" : "isNotMobile"), 搜索源 = ensureArray(搜索源).map((function(n) {
        var e = parseOoUrl(n);
        return {
          url: e.url,
          name: e.name
        }
      }));
      var DEFAULT_VIP_URLS = CaesarDecrypt(D(Reverse(atob("RTAlRTAlNDIlNDIlNjQyNTQyJThCJTBCJTZFJTM5JUI4JThFJTQyJTlBJUZCJUZFJTQyJTVEMyU0OTA3MHE0MiUwOCUyQyU0MiVtdW1ENyVtMDUwcTQyJTA4JTJDJTQyJXFreHowOTBxNDIlMDglMkMlNDIldHR4ejA5MHE0MiUwOCUyQyU0MiV3c2x5MDUyQzMlMHE0MiUwOCUyQyU0MiV6MnV1MDYyNTBxNDIlMDglMkMlNDIlRDclc3lveTA2MjYwcTQyJTQyJWx4eHR3RTMlMzN0dDJlbXdxMmdnM3RldndpM0N5dnBBODklQzklMkUlRTAlRTAlNDIlNDIlNUIzJTI3NDIlNUIlMUIlNUUlNDglMEElNkUlNDIlOUElRkIlRkUlNDIlNUQzJTQ5MDQyQTMlNDIlMDglMkMlNDIlbXVtRDclbTA1MkMzJTBxNDIlMDglMkMlNDIlcGkwNTBxNDIlMDglMkMlNDIlcWt4ejA3MkMzJTBxNDIlMDglMkMlNDIldHR4ejA4MkMzJTBxNDIlMDglMkMlNDIld3NseTA1MHE0MiUwOCUyQyU0MiV6MnV1MDYyNzBxNDIlMDglMkMlNDIlRDclc3lveTA2MHE0MiU0MiVseHh0d0UzJTMzc29uQzclMmdnM0N5dnBBODklQzklMkUlRTAlRTAlNDIlNDIlNUIzJTI1NDIlMTglNEIlNkUlNEIlNTglNUUlNDIlOUElRkIlRkUlNDIlNUQzJTQ5MDcwcTQyJTA4JTJDJTQyJW11bUQ3JW0wNTBxNDIlMDglMkMlNDIlcGkwNTBxNDIlMDglMkMlNDIlcWt4ejA4MHE0MiUwOCUyQyU0MiV0dHh6MDcwcTQyJTA4JTJDJTQyJXoydXUwNTQyJTA4JTJDJTQyJUQ3JXN5b3kwNjI1MHE0MiU0MiVseHh0d0UzJTMzZkQ3JTJoRDclZmxyMmdzcTNDeXZwQTg5JUM5JTJFJUUwJUUwJTQyJTQyJTVBMyUyNTQyJUQ4JUQ5JThFJTdBJTFBJThFJTQyJTlBJUZCJUZFJTQyJTVEMyU0OTA1MHE0MiUwOCUyQyU0MiVtdW1ENyVtMDUwcTQyJTA4JTJDJTQyJXBpMDUwcTQyJTA4JTJDJTQyJXFreHowODBxNDIlMDglMkMlNDIldHR4ejA3MHE0MiUwOCUyQyU0MiV6MnV1MDgwcTQyJTA4JTJDJTQyJUQ3JXN5b3kwNjI1MHE0MiU0MiVseHh0d0UzJTMzejJnZXJ+bG13c3JrMmdyM3oydGx0Q3l2cEE4OSVDOSUyRSVFMCVFMCU0MiU0MiU1QTMlNDIlQjklRDglNUUlM0ElODklNkUlNDIlOUElRkIlRkUlNDIlbXVtRDclbTA4NDIlMDglMkMlNDIlcGkwODQyJTA4JTJDJTQyJXFreHowODQyJTA4JTJDJTQyJXoydXUwODQyJTQyJWx4eHRFMyUzM2ZpbW5tQzcldzJncjNDeXZwQUUwJUUwJTQyJTQyJTU4Mjk0MiUyOCVFOSU2RSU2OCVBOCU4RSU0MiU5QSVGQiVGRSU0MiU1RDMlNDkwNTBxNDIlMDglMkMlNDIlbXVtRDclbTA1MHE0MiUwOCUyQyU0MiVwaTA1MHE0MiUwOCUyQyU0MiVxa3h6MDgwcTQyJTA4JTJDJTQyJXR0eHowNzBxNDIlMDglMkMlNDIlejJ1dTA4MHE0MiUwOCUyQyU0MiVENyVzeW95MDQyOTBxNDIlNDIlbHh4dHdFMyUzM25DNyUyRDclbXJrQzclbWVya2ZlczJncjN6bXQydGx0Q3l2cEE4OSVDOSUyRSVFMCVFMCU0MiU0MiU1ODI4NDIlODglRTglN0UlNjglRjglNUUlNDIlOUElRkIlRkUlNDIlNUQzJTQ5MDQyQTMlMHE0MiUwOCUyQyU0MiVtdW1ENyVtMDUwcTQyJTA4JTJDJTQyJXBpMDUwcTQyJTA4JTJDJTQyJXFreHowNzBxNDIlMDglMkMlNDIldHR4ejA3MHE0MiUwOCUyQyU0MiV3c2x5MDUyOTBxNDIlMDglMkMlNDIlejJ1dTA2MjYwcTQyJTA4JTJDJTQyJUQ3JXN5b3kwNjI1MHE0MiU0MiVseHh0d0UzJTMzQjclQjclQjclMnFENyVDNyVtcjJ4c3QzbkM3JTNldG0zQ3l2cEE4OSVDOSUyRSVFMCVFMCU0MiU0MiU1ODJBMyU0MiU2QiVCOSU2RSU2QiVFOCU4RSU0MiU5QSVGQiVGRSU0MiU1RDMlNDkwNDI1MHE0MiUwOCUyQyU0MiVtdW1ENyVtMDU0MiUwOCUyQyU0MiVxa3h6MDkwcTQyJTA4JTJDJTQyJXdzbHkwNTBxNDIlMDglMkMlNDIlejJ1dTA2MjkwcTQyJTA4JTJDJTQyJUQ3JXN5b3kwOTBxNDIlNDIlbHh4dHdFMyUzM0I3JUI3JUI3JTJnb3FzejJ6bXQzZXRtMnRsdEN5dnBBODklQzklMkUlRTAlRTAlNDIlNDIlNTgyNzQyJTY5JUQ5JTlFJTQ5JUI5JTdFJTQyJTlBJUZCJUZFJTQyJTVEMyU0OTA1MHE0MiUwOCUyQyU0MiVtdW1ENyVtMDUyOTBxNDIlMDglMkMlNDIlcGkwNTBxNDIlMDglMkMlNDIlcWt4ejA3MHE0MiUwOCUyQyU0MiV0dHh6MDYwcTQyJTA4JTJDJTQyJXdzbHkwNTI5MHE0MiUwOCUyQyU0MiV6MnV1MDYyNjBxNDIlMDglMkMlNDIlRDclc3lveTA2MjU0MiU0MiVseHh0d0UzJTMzQjclQjclQjclMnJDNyVqcHoyZ3NxM0N5dnBBODklQzklMkUlRTAlRTAlNDIlNDIlNTcyOTQyJURBJTRBJTVFJTBCJTY4JTVFJTQyJTlBJUZCJUZFJTQyJTVEMyU0OTA1MHE0MiUwOCUyQyU0MiVtdW1ENyVtMDYwcTQyJTA4JTJDJTQyJXBpMDUwcTQyJTA4JTJDJTQyJXFreHowNTBxNDIlMDglMkMlNDIldHR4ejA3MHE0MiUwOCUyQyU0MiV3c2x5MDUyOTBxNDIlMDglMkMlNDIlejJ1dTA4MjkwcTQyJTA4JTJDJTQyJUQ3JXN5b3kwNDI5MHE0MiU0MiVseHh0d0UzJTMzZXRtMnh6RDMlNjQyZ3NxM25DNyUzQ3l2cEE4OSVDOSUyRSVFMCVFMCU0MiU0MiU1NjI4NDIlQjglNjklNkUlREIlQkElN0UlNDIlOUElRkIlRkUlNDIlNUQzJTQ5MDUwcTQyJTA4JTJDJTQyJXFreHowODBxNDIlMDglMkMlNDIldHR4ejA3MHE0MiUwOCUyQyU0MiV6MnV1MDYyNzBxNDIlMDglMkMlNDIlRDclc3lveTA2MjU0MiU0MiVseHh0d0UzJTMzQjclQjclQjclMmxpbXFtbkM3JTJnc3EzbkM3JTNldG0zbkM3JTJ0bHRDeXZwQTg5JUM5JTJFJUUwJUUwJTQyJTQyJTU2Mjc0MiU1QSVGQiU0RSU3QiVGOSU3RSU0MiU5QSVGQiVGRSU0MiVxa3h6MDgwcTQyJTA4JTJDJTQyJW11bUQ3JW0wNjBxNDIlMDglMkMlNDIlejJ1dTA3MjcwcTQyJTA4JTJDJTQyJUQ3JXN5b3kwNzBxNDIlNDIlbHh4dHdFMyUzM25taUM3JW0yNEIzJTVDMyU1NTJnZzNuQzclMnRsdEN5dnBBODklQzklMkUlRTAlRTAlNDIlNDIlNTQyQjMlNDIlMDklNzglNUUlRDglM0IlNkUlNDIlOUElRkIlRkUlNDIlNUQzJTQ5MDUwcTQyJTA4JTJDJTQyJW11bUQ3JW0wNjI5MHE0MiUwOCUyQyU0MiVxa3h6MDQyOTBxNDIlMDglMkMlNDIldHR4ejA1MHE0MiUwOCUyQyU0MiV3c2x5MDUyNjBxNDIlMDglMkMlNDIlejJ1dTA4MHE0MiUwOCUyQyU0MiVENyVzeW95MDQyOTBxNDIlNDIlbHh4dHdFMyUzM25taUM3JW0yN0MzJTRvMmdzcTNDeXZwQTg5JUM5JTJFJUUwJUUwJTQyJTQyJTU0Mjk0MiU1OCVCQiU0RSUyQSVEOSU2RSU0MiU5QSVGQiVGRSU0MiU1RDMlNDkwNTBxNDIlMDglMkMlNDIlbXVtRDclbTA1MHE0MiUwOCUyQyU0MiVxa3h6MDYwcTQyJTA4JTJDJTQyJXR0eHowNzBxNDIlMDglMkMlNDIlejJ1dTA4MHE0MiUwOCUyQyU0MiVENyVzeW95MDQyOTBxNDIlNDIlbHh4dHdFMyUzM2d1RDclbXdsaXJ4ZXJrMmdyM3ptaGlzMnRsdEN5dnBBODklQzklMkUlRTAlRTAlNDIlNDIlRDMlMkIzJTQyJTFBJTdCJTVFJTM5JUY5JTZFJTQyJTlBJUZCJUZFJTQyJTVEMyU0OTA1MjUwcTQyJTA4JTJDJTQyJW11bUQ3JW0wNDI2MHE0MiUwOCUyQyU0MiVxa3h6MDcwcTQyJTA4JTJDJTQyJXdzbHkwNTI2MHE0MiUwOCUyQyU0MiV6MnV1MDYyNjQyJTA4JTJDJTQyJUQ3JXN5b3kwNjBxNDIlNDIlbHh4dHdFMyUzM0I3JUI3JUI3JTJ0cGVENyVxN3lDMyUyZ3Izbm1pQzclbTJ0bHRDeXZwQTg5JUM5JTJFJUUwJUUwJTQyJTQyJUMzJTJDMyU0MiVEOCVEOCU4RSUwOSU5QiU0RSU0MiU5QSVGQiVGRSU0MiU1RDMlNDkwNDJBMyUwcTQyJTA4JTJDJTQyJW11bUQ3JW0wNDI5MHE0MiUwOCUyQyU0MiVwaTA1MHE0MiUwOCUyQyU0MiVxa3h6MDYyOTBxNDIlMDglMkMlNDIld3NseTA1MjYwcTQyJTA4JTJDJTQyJXoydXUwNjI5MHEwQjclNDIlMDglMkMlNDIlRDclc3lveTA0MjkwcTQyJTQyJWx4eHR3RTMlMzNCNyVCNyVCNyUyNUIzJTVCMyVENyV5cjJnc3EzbkM3JTN4RDclMnRsdEN5dnBBODklQzklMkUlRTAlRTAlNDIlNDIlQzMlMjk0MiVGQSU0QiU3RSVEOSVBOCU4RSU0MiU5QSVGQiVGRSU0MiU1RDMlNDkwNTBxNDIlMDglMkMlNDIlbXVtRDclbTA2MHE0MiUwOCUyQyU0MiVxa3h6MDQyOTBxNDIlMDglMkMlNDIld3NseTA1MjkwcTQyJTA4JTJDJTQyJXoydXUwNzBxNDIlMDglMkMlNDIlRDclc3lveTA0MjkwcTQyJTQyJWx4eHR3RTMlMzNubWlDNyVtMmZxQTMlbWsyZ3IzQ3l2cEE4OSVDOSUyRSVFMCVFMCU0MiU0MiU1OTQyJTRCJUVCJThFJTY4JTBBJTdFJTQyJTlBJUZCJUZFJTQyJTVEMyU0OTA1MHE0MiUwOCUyQyU0MiVtdW1ENyVtMDgwcTQyJTA4JTJDJTQyJXBpMDcwcTQyJTA4JTJDJTQyJXFta3l6bWhpczA1MHE0MiUwOCUyQyU0MiVxa3h6MDUyOTBxNDIlMDglMkMlNDIldHR4ejA2MHE0MiUwOCUyQyU0MiV3c2x5MDU0MiUwOCUyQyU0MiV6MnV1MDYwcTQyJTA4JTJDJTQyJUQ3JXN5b3kwNzBxNDIlNDIlbHh4dHdFMyUzM341MnE1RDMlNEIzJTJncjNDbkM3JUFFMCVFMCU"))), 4),
        maxVipWeight = 1,
        NoInnerVipUrlRegex = /\/beijixs\.cn/,
        NoMobileVipUrlRegex = /jx\.wslmf\.com|beijixs\.cn/;
      VIP_URLS = ensureArray(VIP_URLS).filter((function(n) {
        return n.includes("http")
      }));
      var isUseDefaultVipUrls = !1;
      0 === VIP_URLS.length && (VIP_URLS = ensureArray(DEFAULT_VIP_URLS), isUseDefaultVipUrls = !0), VIP_URLS = VIP_URLS.filter((function(n) {
        return !isMobile || !NoMobileVipUrlRegex.test(n)
      }));
      var VIP_ADDON_URLS = VIP_URLS.filter((function(n) {
          return n.includes("✔")
        })),
        isVipUrlRegex = toUrlRegex(VIP_URLS),
        isVipAddonUrlRegex = VIP_ADDON_URLS.length > 0 ? toUrlRegex(VIP_ADDON_URLS) : /$^/,
        vipSiteSign = Href.match(/[\.\/](\w+)\.(\w+)\//);
      vipSiteSign = vipSiteSign ? vipSiteSign[1] : "易安解析", VIP_URLS = VIP_URLS.map((function(n) {
        var e = parseOoUrl(n.replace(/=http.+/g, "=").replace(/\s*✔.*/g, ""));
        if (e.weight = 0, e.name.includes("￥")) {
          var t = e.name.split(/\s*￥\s*/);
          if (1 === t.length ? t = t[0] : (e.name = t[0].replace(/^\s*[\d\.]+\s*/, ""), t = t[1]), t.includes(vipSiteSign)) {
            var i = t.split(/\s*\|\s*/);
            e.weight += .05 * (i.length + 1), i.forEach((function(n) {
              if (n.includes(vipSiteSign)) {
                isMobile && n.includes(",m") && (e.isM = !0);
                var t = n.match(/,([\d\.]+)/);
                t && (e.weight += Number(t[1]))
              }
            })), e.url.includes("m1907") ? e.weight = e.weight * (isMobile ? .45 : .75) : e.url.includes("yingxiangbao") ? e.weight = .7 * e.weight : e.url.includes("beijixs") && (e.weight = .65 * e.weight)
          }
        } else e.weight = -1;
        return maxVipWeight = Math.max(maxVipWeight, e.weight), e
      }));
      var getVipUrlWeight = function(n) {
        return n.isM ? n.weight + 100 : n.weight
      };
      VIP_URLS.sort((function(n, e) {
        return getVipUrlWeight(e) - getVipUrlWeight(n)
      })), maxVipWeight *= isMobile ? 1.2 : 1.1;
      var playerTitle = "",
        isHiker = !!window.fy_bridge_app,
        isMixia = !!window.mx_browser_obj,
        isAllowHikerSniff = isHiker && !!window.fy_bridge_app.getNetworkRecords,
        isAllowMixiaSniff = isMixia && !!window.mx_browser_obj.getweblog,
        isAllowSniff = isUseDefaultVipUrls && (isAllowHikerSniff || isAllowMixiaSniff),
        sniffTimestamp = Date.now(),
        sniffName = isHiker ? "视界" : isMixia ? "米侠" : "嗅探",
        isSniffing = !1,
        sniffTick = 0;
      log("【".concat(sniffName, "】isAllowSniff:"), isAllowSniff);
      var isInvalidSniffUrlRegex = /btrace\.video\.qq\.com/,
        isVideoUrlRegex = /\.(mp4|m3u8|3gp|wmv|flv|avi|rmvb|m4v|ts)/,
        isBadVideoUrlRegex = /(71edge|com-l-youku)\.com/,
        Zepto = function() {
          var n, e, t, i, o, r = [],
            a = r.concat,
            l = r.filter,
            s = r.slice,
            c = window.document,
            p = {},
            u = {},
            d = {
              "column-count": 1,
              columns: 1,
              "font-weight": 1,
              "line-height": 1,
              opacity: 1,
              "z-index": 1,
              zoom: 1
            },
            f = /^\s*<(\w+|!)[^>]*>/,
            m = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
            h = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
            v = /^(?:body|html)$/i,
            g = /([A-Z])/g,
            y = ["val", "css", "html", "text", "data", "width", "height", "offset"],
            b = c.createElement("table"),
            M = c.createElement("tr"),
            w = {
              tr: c.createElement("tbody"),
              tbody: b,
              thead: b,
              tfoot: b,
              td: M,
              th: M,
              "*": c.createElement("div")
            },
            T = /complete|loaded|interactive/,
            U = /^[\w-]*$/,
            x = {},
            D = x.toString,
            J = {},
            N = c.createElement("div"),
            k = {
              tabindex: "tabIndex",
              readonly: "readOnly",
              for: "htmlFor",
              class: "className",
              maxlength: "maxLength",
              cellspacing: "cellSpacing",
              cellpadding: "cellPadding",
              rowspan: "rowSpan",
              colspan: "colSpan",
              usemap: "useMap",
              frameborder: "frameBorder",
              contenteditable: "contentEditable"
            },
            I = Array.isArray || function(n) {
              return n instanceof Array
            };

          function _(n) {
            return null == n ? String(n) : x[D.call(n)] || "object"
          }

          function S(n) {
            return "function" == _(n)
          }

          function Q(n) {
            return null != n && n == n.window
          }

          function V(n) {
            return null != n && n.nodeType == n.DOCUMENT_NODE
          }

          function j(n) {
            return "object" == _(n)
          }

          function E(n) {
            return j(n) && !Q(n) && Object.getPrototypeOf(n) == Object.prototype
          }

          function R(n) {
            var t = !!n && "length" in n && n.length,
              i = e.type(n);
            return "function" != i && !Q(n) && ("array" == i || 0 === t || "number" == typeof t && t > 0 && t - 1 in n)
          }

          function A(n) {
            return n.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
          }

          function O(n) {
            return n in u ? u[n] : u[n] = new RegExp("(^|\\s)" + n + "(\\s|$)")
          }

          function C(n, e) {
            return "number" != typeof e || d[A(n)] ? e : e + "px"
          }

          function $(n) {
            return "children" in n ? s.call(n.children) : e.map(n.childNodes, (function(n) {
              if (1 == n.nodeType) return n
            }))
          }

          function z(n, e) {
            var t, i = n ? n.length : 0;
            for (t = 0; t < i; t++) this[t] = n[t];
            this.length = i, this.selector = e || ""
          }

          function H(e, t, i) {
            for (n in t) i && (E(t[n]) || I(t[n])) ? (E(t[n]) && !E(e[n]) && (e[n] = {}), I(t[n]) && !I(e[n]) && (e[n] = []), H(e[n], t[n], i)) : void 0 !== t[n] && (e[n] = t[n])
          }

          function B(n, t) {
            return null == t ? e(n) : e(n).filter(t)
          }

          function P(n, e, t, i) {
            return S(e) ? e.call(n, t, i) : e
          }

          function F(n, e, t) {
            null == t ? n.removeAttribute(e) : n.setAttribute(e, t)
          }

          function L(n, e) {
            var t = n.className || "",
              i = t && void 0 !== t.baseVal;
            if (void 0 === e) return i ? t.baseVal : t;
            i ? t.baseVal = e : n.className = e
          }

          function q(n) {
            try {
              return n ? "true" == n || "false" != n && ("null" == n ? null : +n + "" == n ? +n : /^[\[\{]/.test(n) ? e.parseJSON(n) : n) : n
            } catch (e) {
              return n
            }
          }

          function X(n, e) {
            e(n);
            for (var t = 0, i = n.childNodes.length; t < i; t++) X(n.childNodes[t], e)
          }
          return J.matches = function(n, e) {
            if (!e || !n || 1 !== n.nodeType) return !1;
            var t = n.matches || n.webkitMatchesSelector || n.mozMatchesSelector || n.oMatchesSelector || n.matchesSelector;
            if (t) return t.call(n, e);
            var i, o = n.parentNode,
              r = !o;
            return r && (o = N).appendChild(n), i = ~J.qsa(o, e).indexOf(n), r && N.removeChild(n), i
          }, i = function(n) {
            return n.replace(/-+(.)?/g, (function(n, e) {
              return e ? e.toUpperCase() : ""
            }))
          }, o = function(n) {
            return l.call(n, (function(e, t) {
              return n.indexOf(e) == t
            }))
          }, J.fragment = function(n, t, i) {
            var o, r, a;
            return m.test(n) && (o = e(c.createElement(RegExp.$1))), o || (n.replace && (n = n.replace(h, "<$1></$2>")), void 0 === t && (t = f.test(n) && RegExp.$1), t in w || (t = "*"), (a = w[t]).innerHTML = "" + n, o = e.each(s.call(a.childNodes), (function() {
              a.removeChild(this)
            }))), E(i) && (r = e(o), e.each(i, (function(n, e) {
              y.indexOf(n) > -1 ? r[n](e) : r.attr(n, e)
            }))), o
          }, J.Z = function(n, e) {
            return new z(n, e)
          }, J.isZ = function(n) {
            return n instanceof J.Z
          }, J.init = function(n, t) {
            var i, o;
            if (!n) return J.Z();
            if ("string" == typeof n)
              if ("<" == (n = n.trim())[0] && f.test(n)) i = J.fragment(n, RegExp.$1, t), n = null;
              else {
                if (void 0 !== t) return e(t).find(n);
                i = J.qsa(c, n)
              }
            else {
              if (S(n)) return e(c).ready(n);
              if (J.isZ(n)) return n;
              if (I(n)) o = n, i = l.call(o, (function(n) {
                return null != n
              }));
              else if (j(n)) i = [n], n = null;
              else if (f.test(n)) i = J.fragment(n.trim(), RegExp.$1, t), n = null;
              else {
                if (void 0 !== t) return e(t).find(n);
                i = J.qsa(c, n)
              }
            }
            return J.Z(i, n)
          }, (e = function(n, e) {
            return J.init(n, e)
          }).extend = function(n) {
            var e, t = s.call(arguments, 1);
            return "boolean" == typeof n && (e = n, n = t.shift()), t.forEach((function(t) {
              H(n, t, e)
            })), n
          }, J.qsa = function(n, e) {
            var t, i = "#" == e[0],
              o = !i && "." == e[0],
              r = i || o ? e.slice(1) : e,
              a = U.test(r);
            return n.getElementById && a && i ? (t = n.getElementById(r)) ? [t] : [] : 1 !== n.nodeType && 9 !== n.nodeType && 11 !== n.nodeType ? [] : s.call(a && !i && n.getElementsByClassName ? o ? n.getElementsByClassName(r) : n.getElementsByTagName(e) : n.querySelectorAll(e))
          }, e.contains = c.documentElement.contains ? function(n, e) {
            return n !== e && n.contains(e)
          } : function(n, e) {
            for (; e && (e = e.parentNode);)
              if (e === n) return !0;
            return !1
          }, e.type = _, e.isFunction = S, e.isWindow = Q, e.isArray = I, e.isPlainObject = E, e.isEmptyObject = function(n) {
            var e;
            for (e in n) return !1;
            return !0
          }, e.isNumeric = function(n) {
            var e = Number(n),
              t = typeof n;
            return null != n && "boolean" != t && ("string" != t || n.length) && !isNaN(e) && isFinite(e) || !1
          }, e.inArray = function(n, e, t) {
            return r.indexOf.call(e, n, t)
          }, e.camelCase = i, e.trim = function(n) {
            return null == n ? "" : String.prototype.trim.call(n)
          }, e.uuid = 0, e.support = {}, e.expr = {}, e.noop = function() {}, e.map = function(n, t) {
            var i, o, r, a, l = [];
            if (R(n))
              for (o = 0; o < n.length; o++) null != (i = t(n[o], o)) && l.push(i);
            else
              for (r in n) null != (i = t(n[r], r)) && l.push(i);
            return (a = l).length > 0 ? e.fn.concat.apply([], a) : a
          }, e.each = function(n, e) {
            var t, i;
            if (R(n)) {
              for (t = 0; t < n.length; t++)
                if (!1 === e.call(n[t], t, n[t])) return n
            } else
              for (i in n)
                if (!1 === e.call(n[i], i, n[i])) return n;
            return n
          }, e.grep = function(n, e) {
            return l.call(n, e)
          }, window.JSON && (e.parseJSON = JSON.parse), e.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), (function(n, e) {
            x["[object " + e + "]"] = e.toLowerCase()
          })), e.fn = {
            constructor: J.Z,
            length: 0,
            forEach: r.forEach,
            reduce: r.reduce,
            push: r.push,
            sort: r.sort,
            splice: r.splice,
            indexOf: r.indexOf,

            concat: function() {
              var n, e, t = [];
              for (n = 0; n < arguments.length; n++) e = arguments[n], t[n] = J.isZ(e) ? e.toArray() : e;
              return a.apply(J.isZ(this) ? this.toArray() : this, t)
            },
            map: function(n) {
              return e(e.map(this, (function(e, t) {
                return n.call(e, t, e)
              })))
            },
            slice: function() {
              return e(s.apply(this, arguments))
            },
            ready: function(n) {
              return T.test(c.readyState) && c.body ? n(e) : c.addEventListener("DOMContentLoaded", (function() {
                n(e)
              }), !1), this
            },
            get: function(n) {
              return void 0 === n ? s.call(this) : this[n >= 0 ? n : n + this.length]
            },
            toArray: function() {
              return this.get()
            },
            size: function() {
              return this.length
            },
            remove: function() {
              return this.each((function() {
                null != this.parentNode && this.parentNode.removeChild(this)
              }))
            },
            each: function(n) {
              return r.every.call(this, (function(e, t) {
                return !1 !== n.call(e, t, e)
              })), this
            },
            filter: function(n) {
              return S(n) ? this.not(this.not(n)) : e(l.call(this, (function(e) {
                return J.matches(e, n)
              })))
            },
            add: function(n, t) {
              return e(o(this.concat(e(n, t))))
            },
            is: function(n) {
              return this.length > 0 && J.matches(this[0], n)
            },
            not: function(n) {
              var t = [];
              if (S(n) && void 0 !== n.call) this.each((function(e) {
                n.call(this, e) || t.push(this)
              }));
              else {
                var i = "string" == typeof n ? this.filter(n) : R(n) && S(n.item) ? s.call(n) : e(n);
                this.forEach((function(n) {
                  i.indexOf(n) < 0 && t.push(n)
                }))
              }
              return e(t)
            },
            has: function(n) {
              return this.filter((function() {
                return j(n) ? e.contains(this, n) : e(this).find(n).size()
              }))
            },
            eq: function(n) {
              return -1 === n ? this.slice(n) : this.slice(n, +n + 1)
            },
            first: function() {
              var n = this[0];
              return n && !j(n) ? n : e(n)
            },
            last: function() {
              var n = this[this.length - 1];
              return n && !j(n) ? n : e(n)
            },
            find: function(n) {
              var t = this;
              return n ? "object" == typeof n ? e(n).filter((function() {
                var n = this;
                return r.some.call(t, (function(t) {
                  return e.contains(t, n)
                }))
              })) : 1 == this.length ? e(J.qsa(this[0], n)) : this.map((function() {
                return J.qsa(this, n)
              })) : e()
            },
            closest: function(n, t) {
              var i = [],
                o = "object" == typeof n && e(n);
              return this.each((function(e, r) {
                for (; r && !(o ? o.indexOf(r) >= 0 : J.matches(r, n));) r = r !== t && !V(r) && r.parentNode;
                r && i.indexOf(r) < 0 && i.push(r)
              })), e(i)
            },
            parents: function(n) {
              for (var t = [], i = this; i.length > 0;) i = e.map(i, (function(n) {
                if ((n = n.parentNode) && !V(n) && t.indexOf(n) < 0) return t.push(n), n
              }));
              return B(t, n)
            },
            parent: function(n) {
              return B(o(this.pluck("parentNode")), n)
            },
            children: function(n) {
              return B(this.map((function() {
                return $(this)
              })), n)
            },
            contents: function() {
              return this.map((function() {
                return this.contentDocument || s.call(this.childNodes)
              }))
            },
            siblings: function(n) {
              return B(this.map((function(n, e) {
                return l.call($(e.parentNode), (function(n) {
                  return n !== e
                }))
              })), n)
            },
            empty: function() {
              return this.each((function() {
                this.innerHTML = ""
              }))
            },
            pluck: function(n) {
              return e.map(this, (function(e) {
                return e[n]
              }))
            },
            show: function() {
              return this.each((function() {
                var n, e, t;
                "none" == this.style.display && (this.style.display = ""), "none" == getComputedStyle(this, "").getPropertyValue("display") && (this.style.display = (n = this.nodeName, p[n] || (e = c.createElement(n), c.body.appendChild(e), t = getComputedStyle(e, "").getPropertyValue("display"), e.parentNode.removeChild(e), "none" == t && (t = "block"), p[n] = t), p[n]))
              }))
            },
            replaceWith: function(n) {
              return this.before(n).remove()
            },
            wrap: function(n) {
              var t = S(n);
              if (this[0] && !t) var i = e(n).get(0),
                o = i.parentNode || this.length > 1;
              return this.each((function(r) {
                e(this).wrapAll(t ? n.call(this, r) : o ? i.cloneNode(!0) : i)
              }))
            },
            wrapAll: function(n) {
              if (this[0]) {
                var t;
                for (e(this[0]).before(n = e(n));
                  (t = n.children()).length;) n = t.first();
                e(n).append(this)
              }
              return this
            },
            wrapInner: function(n) {
              var t = S(n);
              return this.each((function(i) {
                var o = e(this),
                  r = o.contents(),
                  a = t ? n.call(this, i) : n;
                r.length ? r.wrapAll(a) : o.append(a)
              }))
            },
            unwrap: function() {
              return this.parent().each((function() {
                e(this).replaceWith(e(this).children())
              })), this
            },
            clone: function() {
              return this.map((function() {
                return this.cloneNode(!0)
              }))
            },
            hide: function() {
              return this.css("display", "none")
            },
            toggle: function(n) {
              return this.each((function() {
                var t = e(this);
                (void 0 === n ? "none" == t.css("display") : n) ? t.show(): t.hide()
              }))
            },
            prev: function(n) {
              return e(this.pluck("previousElementSibling")).filter(n || "*")
            },
            next: function(n) {
              return e(this.pluck("nextElementSibling")).filter(n || "*")
            },
            html: function(n) {
              return 0 in arguments ? this.each((function(t) {
                var i = this.innerHTML;
                e(this).empty().append(P(this, n, t, i))
              })) : 0 in this ? this[0].innerHTML : null
            },
            text: function(n) {
              return 0 in arguments ? this.each((function(e) {
                var t = P(this, n, e, this.textContent);
                this.textContent = null == t ? "" : "" + t
              })) : 0 in this ? this.pluck("textContent").join("") : null
            },
            attr: function(e, t) {
              var i;
              return "string" != typeof e || 1 in arguments ? this.each((function(i) {
                if (1 === this.nodeType)
                  if (j(e))
                    for (n in e) F(this, n, e[n]);
                  else F(this, e, P(this, t, i, this.getAttribute(e)))
              })) : 0 in this && 1 == this[0].nodeType && null != (i = this[0].getAttribute(e)) ? i : void 0
            },
            removeAttr: function(n) {
              return this.each((function() {
                1 === this.nodeType && n.split(" ").forEach((function(n) {
                  F(this, n)
                }), this)
              }))
            },
            prop: function(n, e) {
              return n = k[n] || n, 1 in arguments ? this.each((function(t) {
                this[n] = P(this, e, t, this[n])
              })) : this[0] && this[0][n]
            },
            removeProp: function(n) {
              return n = k[n] || n, this.each((function() {
                delete this[n]
              }))
            },
            data: function(n, e) {
              var t = "data-" + n.replace(g, "-$1").toLowerCase(),
                i = 1 in arguments ? this.attr(t, e) : this.attr(t);
              return null !== i ? q(i) : void 0
            },
            val: function(n) {
              return 0 in arguments ? (null == n && (n = ""), this.each((function(e) {
                this.value = P(this, n, e, this.value)
              }))) : this[0] && (this[0].multiple ? e(this[0]).find("option").filter((function() {
                return this.selected
              })).pluck("value") : this[0].value)
            },
            offset: function(n) {
              if (n) return this.each((function(t) {
                var i = e(this),
                  o = P(this, n, t, i.offset()),
                  r = i.offsetParent().offset(),
                  a = {
                    top: o.top - r.top,
                    left: o.left - r.left
                  };
                "static" == i.css("position") && (a.position = "relative"), i.css(a)
              }));
              if (!this.length) return null;
              if (c.documentElement !== this[0] && !e.contains(c.documentElement, this[0])) return {
                top: 0,
                left: 0
              };
              var t = this[0].getBoundingClientRect();
              return {
                left: t.left + window.pageXOffset,
                top: t.top + window.pageYOffset,
                width: Math.round(t.width),
                height: Math.round(t.height)
              }
            },
            css: function(t, o) {
              if (arguments.length < 2) {
                var r = this[0];
                if ("string" == typeof t) {
                  if (!r) return;
                  return r.style[i(t)] || getComputedStyle(r, "").getPropertyValue(t)
                }
                if (I(t)) {
                  if (!r) return;
                  var a = {},
                    l = getComputedStyle(r, "");
                  return e.each(t, (function(n, e) {
                    a[e] = r.style[i(e)] || l.getPropertyValue(e)
                  })), a
                }
              }
              var s = "";
              if ("string" == _(t)) o || 0 === o ? s = A(t) + ":" + C(t, o) : this.each((function() {
                this.style.removeProperty(A(t))
              }));
              else
                for (n in t) t[n] || 0 === t[n] ? s += A(n) + ":" + C(n, t[n]) + ";" : this.each((function() {
                  this.style.removeProperty(A(n))
                }));
              return this.each((function() {
                this.style.cssText += ";" + s
              }))
            },
            index: function(n) {
              return n ? this.indexOf(e(n)[0]) : this.parent().children().indexOf(this[0])
            },
            hasClass: function(n) {
              return !!n && r.some.call(this, (function(n) {
                return this.test(L(n))
              }), O(n))
            },
            addClass: function(n) {
              return n ? this.each((function(i) {
                if ("className" in this) {
                  t = [];
                  var o = L(this);
                  P(this, n, i, o).split(/\s+/g).forEach((function(n) {
                    e(this).hasClass(n) || t.push(n)
                  }), this), t.length && L(this, o + (o ? " " : "") + t.join(" "))
                }
              })) : this
            },
            removeClass: function(n) {
              return this.each((function(e) {
                if ("className" in this) {
                  if (void 0 === n) return L(this, "");
                  t = L(this), P(this, n, e, t).split(/\s+/g).forEach((function(n) {
                    t = t.replace(O(n), " ")
                  })), L(this, t.trim())
                }
              }))
            },
            toggleClass: function(n, t) {
              return n ? this.each((function(i) {
                var o = e(this);
                P(this, n, i, L(this)).split(/\s+/g).forEach((function(n) {
                  (void 0 === t ? !o.hasClass(n) : t) ? o.addClass(n): o.removeClass(n)
                }))
              })) : this
            },
            scrollTop: function(n) {
              if (this.length) {
                var e = "scrollTop" in this[0];
                return void 0 === n ? e ? this[0].scrollTop : this[0].pageYOffset : this.each(e ? function() {
                  this.scrollTop = n
                } : function() {
                  this.scrollTo(this.scrollX, n)
                })
              }
            },
            scrollLeft: function(n) {
              if (this.length) {
                var e = "scrollLeft" in this[0];
                return void 0 === n ? e ? this[0].scrollLeft : this[0].pageXOffset : this.each(e ? function() {
                  this.scrollLeft = n
                } : function() {
                  this.scrollTo(n, this.scrollY)
                })
              }
            },
            position: function() {
              if (this.length) {
                var n = this[0],
                  t = this.offsetParent(),
                  i = this.offset(),
                  o = v.test(t[0].nodeName) ? {
                    top: 0,
                    left: 0
                  } : t.offset();
                return i.top -= parseFloat(e(n).css("margin-top")) || 0, i.left -= parseFloat(e(n).css("margin-left")) || 0, o.top += parseFloat(e(t[0]).css("border-top-width")) || 0, o.left += parseFloat(e(t[0]).css("border-left-width")) || 0, {
                  top: i.top - o.top,
                  left: i.left - o.left
                }
              }
            },
            offsetParent: function() {
              return this.map((function() {
                for (var n = this.offsetParent || c.body; n && !v.test(n.nodeName) && "static" == e(n).css("position");) n = n.offsetParent;
                return n
              }))
            }
          }, e.fn.detach = e.fn.remove, ["width", "height"].forEach((function(n) {
            var t = n.replace(/./, (function(n) {
              return n[0].toUpperCase()
            }));
            e.fn[n] = function(i) {
              var o, r = this[0];
              return void 0 === i ? Q(r) ? r["inner" + t] : V(r) ? r.documentElement["scroll" + t] : (o = this.offset()) && o[n] : this.each((function(t) {
                (r = e(this)).css(n, P(this, i, t, r[n]()))
              }))
            }
          })), ["after", "prepend", "before", "append"].forEach((function(n, t) {
            var i = t % 2;
            e.fn[n] = function() {
              var n, o, r = e.map(arguments, (function(t) {
                  var i = [];
                  return "array" == (n = _(t)) ? (t.forEach((function(n) {
                    return void 0 !== n.nodeType ? i.push(n) : e.zepto.isZ(n) ? i = i.concat(n.get()) : void(i = i.concat(J.fragment(n)))
                  })), i) : "object" == n || null == t ? t : J.fragment(t)
                })),
                a = this.length > 1;
              return r.length < 1 ? this : this.each((function(n, l) {
                o = i ? l : l.parentNode, l = 0 == t ? l.nextSibling : 1 == t ? l.firstChild : 2 == t ? l : null;
                var s = e.contains(c.documentElement, o);
                r.forEach((function(n) {
                  if (a) n = n.cloneNode(!0);
                  else if (!o) return e(n).remove();
                  o.insertBefore(n, l), s && X(n, (function(n) {
                    if (!(null == n.nodeName || "SCRIPT" !== n.nodeName.toUpperCase() || n.type && "text/javascript" !== n.type || n.src)) {
                      var e = n.ownerDocument ? n.ownerDocument.defaultView : window;
                      e.eval.call(e, n.innerHTML)
                    }
                  }))
                }))
              }))
            }, e.fn[i ? n + "To" : "insert" + (t ? "Before" : "After")] = function(t) {
              return e(t)[n](this), this
            }
          })), J.Z.prototype = z.prototype = e.fn, J.uniq = o, J.deserializeValue = q, e.zepto = J, e
        }();
      window.Zepto = Zepto, void 0 === window.$ && (window.$ = Zepto),
        function(n) {
          var e = 1,
            t = Array.prototype.slice,
            i = n.isFunction,
            o = function(n) {
              return "string" == typeof n
            },
            r = {},
            a = {},
            l = "onfocusin" in window,
            s = {
              focus: "focusin",
              blur: "focusout"
            },
            c = {
              mouseenter: "mouseover",
              mouseleave: "mouseout"
            };

          function p(n) {
            return n._zid || (n._zid = e++)
          }

          function u(n, e, t, i) {
            if ((e = d(e)).ns) var o = (a = e.ns, new RegExp("(?:^| )" + a.replace(" ", " .* ?") + "(?: |$)"));
            var a;
            return (r[p(n)] || []).filter((function(n) {
              return n && (!e.e || n.e == e.e) && (!e.ns || o.test(n.ns)) && (!t || p(n.fn) === p(t)) && (!i || n.sel == i)
            }))
          }

          function d(n) {
            var e = ("" + n).split(".");
            return {
              e: e[0],
              ns: e.slice(1).sort().join(" ")
            }
          }

          function f(n, e) {
            return n.del && !l && n.e in s || !!e
          }

          function m(n) {
            return c[n] || l && s[n] || n
          }

          function h(e, t, i, o, a, l, s) {
            var u = p(e),
              h = r[u] || (r[u] = []);
            t.split(/\s/).forEach((function(t) {
              if ("ready" == t) return n(document).ready(i);
              var r = d(t);
              r.fn = i, r.sel = a, r.e in c && (i = function(e) {
                var t = e.relatedTarget;
                if (!t || t !== this && !n.contains(this, t)) return r.fn.apply(this, arguments)
              }), r.del = l;
              var p = l || i;
              r.proxy = function(n) {
                if (!(n = w(n)).isImmediatePropagationStopped()) {
                  n.data = o;
                  var t = p.apply(e, null == n._args ? [n] : [n].concat(n._args));
                  return !1 === t && (n.preventDefault(), n.stopPropagation()), t
                }
              }, r.i = h.length, h.push(r), "addEventListener" in e && e.addEventListener(m(r.e), r.proxy, f(r, s))
            }))
          }

          function v(n, e, t, i, o) {
            var a = p(n);
            (e || "").split(/\s/).forEach((function(e) {
              u(n, e, t, i).forEach((function(e) {
                delete r[a][e.i], "removeEventListener" in n && n.removeEventListener(m(e.e), e.proxy, f(e, o))
              }))
            }))
          }
          a.click = a.mousedown = a.mouseup = a.mousemove = "MouseEvents", n.event = {
            add: h,
            remove: v
          }, n.proxy = function(e, r) {
            var a = 2 in arguments && t.call(arguments, 2);
            if (i(e)) {
              var l = function() {
                return e.apply(r, a ? a.concat(t.call(arguments)) : arguments)
              };
              return l._zid = p(e), l
            }
            if (o(r)) return a ? (a.unshift(e[r], e), n.proxy.apply(null, a)) : n.proxy(e[r], e);
            throw new TypeError("expected function")
          }, n.fn.bind = function(n, e, t) {
            return this.on(n, e, t)
          }, n.fn.unbind = function(n, e) {
            return this.off(n, e)
          }, n.fn.one = function(n, e, t, i) {
            return this.on(n, e, t, i, 1)
          };
          var g = function() {
              return !0
            },
            y = function() {
              return !1
            },
            b = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
            M = {
              preventDefault: "isDefaultPrevented",
              stopImmediatePropagation: "isImmediatePropagationStopped",
              stopPropagation: "isPropagationStopped"
            };

          function w(e, t) {
            return !t && e.isDefaultPrevented || (t || (t = e), n.each(M, (function(n, i) {
              var o = t[n];
              e[n] = function() {
                return this[i] = g, o && o.apply(t, arguments)
              }, e[i] = y
            })), e.timeStamp || (e.timeStamp = Date.now()), (void 0 !== t.defaultPrevented ? t.defaultPrevented : "returnValue" in t ? !1 === t.returnValue : t.getPreventDefault && t.getPreventDefault()) && (e.isDefaultPrevented = g)), e
          }

          function T(n) {
            var e, t = {
              originalEvent: n
            };
            for (e in n) b.test(e) || void 0 === n[e] || (t[e] = n[e]);
            return w(t, n)
          }
          n.fn.delegate = function(n, e, t) {
            return this.on(e, n, t)
          }, n.fn.undelegate = function(n, e, t) {
            return this.off(e, n, t)
          }, n.fn.live = function(e, t) {
            return n(document.body).delegate(this.selector, e, t), this
          }, n.fn.die = function(e, t) {
            return n(document.body).undelegate(this.selector, e, t), this
          }, n.fn.on = function(e, r, a, l, s) {
            var c, p, u = this;
            return e && !o(e) ? (n.each(e, (function(n, e) {
              u.on(n, r, a, e, s)
            })), u) : (o(r) || i(l) || !1 === l || (l = a, a = r, r = void 0), void 0 !== l && !1 !== a || (l = a, a = void 0), !1 === l && (l = y), u.each((function(i, o) {
              s && (c = function(n) {
                return v(o, n.type, l), l.apply(this, arguments)
              }), r && (p = function(e) {
                var i, a = n(e.target).closest(r, o).get(0);
                if (a && a !== o) return i = n.extend(T(e), {
                  currentTarget: a,
                  liveFired: o
                }), (c || l).apply(a, [i].concat(t.call(arguments, 1)))
              }), h(o, e, l, a, r, p || c)
            })))
          }, n.fn.off = function(e, t, r) {
            var a = this;
            return e && !o(e) ? (n.each(e, (function(n, e) {
              a.off(n, t, e)
            })), a) : (o(t) || i(r) || !1 === r || (r = t, t = void 0), !1 === r && (r = y), a.each((function() {
              v(this, e, r, t)
            })))
          }, n.fn.trigger = function(e, t) {
            return (e = o(e) || n.isPlainObject(e) ? n.Event(e) : w(e))._args = t, this.each((function() {
              e.type in s && "function" == typeof this[e.type] ? this[e.type]() : "dispatchEvent" in this ? this.dispatchEvent(e) : n(this).triggerHandler(e, t)
            }))
          }, n.fn.triggerHandler = function(e, t) {
            var i, r;
            return this.each((function(a, l) {
              (i = T(o(e) ? n.Event(e) : e))._args = t, i.target = l, n.each(u(l, e.type || e), (function(n, e) {
                if (r = e.proxy(i), i.isImmediatePropagationStopped()) return !1
              }))
            })), r
          }, "focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach((function(e) {
            n.fn[e] = function(n) {
              return 0 in arguments ? this.bind(e, n) : this.trigger(e)
            }
          })), n.Event = function(n, e) {
            o(n) || (n = (e = n).type);
            var t = document.createEvent(a[n] || "Events"),
              i = !0;
            if (e)
              for (var r in e) "bubbles" == r ? i = !!e[r] : t[r] = e[r];
            return t.initEvent(n, i, !0), w(t)
          }
        }(Zepto),
        function(n) {
          var e, t, i = +new Date,
            o = window.document,
            r = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            a = /^(?:text|application)\/javascript/i,
            l = /^(?:text|application)\/xml/i,
            s = /^\s*$/,
            c = o.createElement("a");

          function p(e, t, i, r) {
            if (e.global) return function(e, t, i) {
              var o = n.Event(t);
              return n(e).trigger(o, i), !o.isDefaultPrevented()
            }(t || o, i, r)
          }

          function u(n, e) {
            var t = e.context;
            if (!1 === e.beforeSend.call(t, n, e) || !1 === p(e, t, "ajaxBeforeSend", [n, e])) return !1;
            p(e, t, "ajaxSend", [n, e])
          }

          function d(n, e, t, i) {
            var o = t.context;
            t.success.call(o, n, "success", e), i && i.resolveWith(o, [n, "success", e]), p(t, o, "ajaxSuccess", [e, t, n]), m("success", e, t)
          }

          function f(n, e, t, i, o) {
            var r = i.context;
            i.error.call(r, t, e, n), o && o.rejectWith(r, [t, e, n]), p(i, r, "ajaxError", [t, i, n || e]), m(e, t, i)
          }

          function m(e, t, i) {
            var o = i.context;
            i.complete.call(o, t, e), p(i, o, "ajaxComplete", [t, i]),
              function(e) {
                e.global && !--n.active && p(e, null, "ajaxStop")
              }(i)
          }

          function h() {}

          function v(n, e) {
            return "" == e ? n : (n + "&" + e).replace(/[&?]{1,2}/, "?")
          }

          function g(e, t, i, o) {
            return n.isFunction(t) && (o = i, i = t, t = void 0), n.isFunction(i) || (o = i, i = void 0), {
              url: e,
              data: t,
              success: i,
              dataType: o
            }
          }
          c.href = window.location.href, n.active = 0, n.ajaxJSONP = function(e, t) {
            if (!("type" in e)) return n.ajax(e);
            var r, a, l = e.jsonpCallback,
              s = (n.isFunction(l) ? l() : l) || "Zepto" + i++,
              c = o.createElement("script"),
              p = window[s],
              m = function(e) {
                n(c).triggerHandler("error", e || "abort")
              },
              h = {
                abort: m
              };
            return t && t.promise(h), n(c).on("load error", (function(i, o) {
              clearTimeout(a), n(c).off().remove(), "error" != i.type && r ? d(r[0], h, e, t) : f(null, o || "error", h, e, t), window[s] = p, r && n.isFunction(p) && p(r[0]), p = r = void 0
            })), !1 === u(h, e) ? (m("abort"), h) : (window[s] = function() {
              r = arguments
            }, c.src = e.url.replace(/\?(.+)=\?/, "?$1=" + s), o.head.appendChild(c), e.timeout > 0 && (a = setTimeout((function() {
              m("timeout")
            }), e.timeout)), h)
          }, n.ajaxSettings = {
            type: "GET",
            beforeSend: h,
            success: h,
            error: h,
            complete: h,
            context: null,
            global: !0,
            xhr: function() {
              return new window.XMLHttpRequest
            },
            accepts: {
              script: "text/javascript, application/javascript, application/x-javascript",
              json: "application/json",
              xml: "application/xml, text/xml",
              html: "text/html",
              text: "text/plain"
            },
            crossDomain: !1,
            timeout: 0,
            processData: !0,
            cache: !0,
            dataFilter: h
          }, n.ajax = function(i) {
            var r, m, g = n.extend({}, i || {}),
              y = n.Deferred && n.Deferred();
            for (e in n.ajaxSettings) void 0 === g[e] && (g[e] = n.ajaxSettings[e]);
            ! function(e) {
              e.global && 0 == n.active++ && p(e, null, "ajaxStart")
            }(g), g.crossDomain || ((r = o.createElement("a")).href = g.url, r.href = r.href, g.crossDomain = c.protocol + "//" + c.host != r.protocol + "//" + r.host), g.url || (g.url = window.location.toString()), (m = g.url.indexOf("#")) > -1 && (g.url = g.url.slice(0, m)),
              function(e) {
                e.processData && e.data && "string" != n.type(e.data) && (e.data = n.param(e.data, e.traditional)), !e.data || e.type && "GET" != e.type.toUpperCase() && "jsonp" != e.dataType || (e.url = v(e.url, e.data), e.data = void 0)
              }(g);
            var b = g.dataType,
              M = /\?.+=\?/.test(g.url);
            if (M && (b = "jsonp"), !1 !== g.cache && (i && !0 === i.cache || "script" != b && "jsonp" != b) || (g.url = v(g.url, "_=" + Date.now())), "jsonp" == b) return M || (g.url = v(g.url, g.jsonp ? g.jsonp + "=?" : !1 === g.jsonp ? "" : "callback=?")), n.ajaxJSONP(g, y);
            var w, T = g.accepts[b],
              U = {},
              x = function(n, e) {
                U[n.toLowerCase()] = [n, e]
              },
              D = /^([\w-]+:)\/\//.test(g.url) ? RegExp.$1 : window.location.protocol,
              J = g.xhr(),
              N = J.setRequestHeader;
            if (y && y.promise(J), g.crossDomain || x("X-Requested-With", "XMLHttpRequest"), x("Accept", T || "*/*"), (T = g.mimeType || T) && (T.indexOf(",") > -1 && (T = T.split(",", 2)[0]), J.overrideMimeType && J.overrideMimeType(T)), (g.contentType || !1 !== g.contentType && g.data && "GET" != g.type.toUpperCase()) && x("Content-Type", g.contentType || "application/x-www-form-urlencoded"), g.headers)
              for (t in g.headers) x(t, g.headers[t]);
            if (J.setRequestHeader = x, J.onreadystatechange = function() {
                if (4 == J.readyState) {
                  J.onreadystatechange = h, clearTimeout(w);
                  var e, t = !1;
                  if (J.status >= 200 && J.status < 300 || 304 == J.status || 0 == J.status && "file:" == D) {
                    if (b = b || function(n) {
                        return n && (n = n.split(";", 2)[0]), n && ("text/html" == n ? "html" : "application/json" == n ? "json" : a.test(n) ? "script" : l.test(n) && "xml") || "text"
                      }(g.mimeType || J.getResponseHeader("content-type")), "arraybuffer" == J.responseType || "blob" == J.responseType) e = J.response;
                    else {
                      e = J.responseText;
                      try {
                        e = function(n, e, t) {
                          if (t.dataFilter == h) return n;
                          var i = t.context;
                          return t.dataFilter.call(i, n, e)
                        }(e, b, g), "script" == b ? (0, eval)(e) : "xml" == b ? e = J.responseXML : "json" == b && (e = s.test(e) ? null : n.parseJSON(e))
                      } catch (n) {
                        t = n
                      }
                      if (t) return f(t, "parsererror", J, g, y)
                    }
                    d(e, J, g, y)
                  } else f(J.statusText || null, J.status ? "error" : "abort", J, g, y)
                }
              }, !1 === u(J, g)) return J.abort(), f(null, "abort", J, g, y), J;
            var k = !("async" in g) || g.async;
            if (J.open(g.type, g.url, k, g.username, g.password), g.xhrFields)
              for (t in g.xhrFields) J[t] = g.xhrFields[t];
            for (t in U) N.apply(J, U[t]);
            return g.timeout > 0 && (w = setTimeout((function() {
              J.onreadystatechange = h, J.abort(), f(null, "timeout", J, g, y)
            }), g.timeout)), J.send(g.data ? g.data : null), J
          }, n.get = function() {
            return n.ajax(g.apply(null, arguments))
          }, n.post = function() {
            var e = g.apply(null, arguments);
            return e.type = "POST", n.ajax(e)
          }, n.getJSON = function() {
            var e = g.apply(null, arguments);
            return e.dataType = "json", n.ajax(e)
          }, n.fn.load = function(e, t, i) {
            if (!this.length) return this;
            var o, a = this,
              l = e.split(/\s/),
              s = g(e, t, i),
              c = s.success;
            return l.length > 1 && (s.url = l[0], o = l[1]), s.success = function(e) {
              a.html(o ? n("<div>").html(e.replace(r, "")).find(o) : e), c && c.apply(a, arguments)
            }, n.ajax(s), this
          };
          var y = encodeURIComponent;
          n.param = function(e, t) {
            var i = [];
            return i.add = function(e, t) {
                n.isFunction(t) && (t = t()), null == t && (t = ""), this.push(y(e) + "=" + y(t))
              },
              function e(t, i, o, r) {
                var a, l = n.isArray(i),
                  s = n.isPlainObject(i);
                n.each(i, (function(i, c) {
                  a = n.type(c), r && (i = o ? r : r + "[" + (s || "object" == a || "array" == a ? i : "") + "]"), !r && l ? t.add(c.name, c.value) : "array" == a || !o && "object" == a ? e(t, c, o, i) : t.add(i, c)
                }))
              }(i, e, t), i.join("&").replace(/%20/g, "+")
          }
        }(Zepto),
        function(n) {
          n.fn.serializeArray = function() {
            var e, t, i = [];
            return this[0] && n.each(this[0].elements, (function(o, r) {
              t = r.type, (e = r.name) && "fieldset" != r.nodeName.toLowerCase() && !r.disabled && "submit" != t && "reset" != t && "button" != t && "file" != t && ("radio" != t && "checkbox" != t || r.checked) && function n(t) {
                if (t.forEach) return t.forEach(n);
                i.push({
                  name: e,
                  value: t
                })
              }(n(r).val())
            })), i
          }, n.fn.serialize = function() {
            var n = [];
            return this.serializeArray().forEach((function(e) {
              n.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value))
            })), n.join("&")
          }, n.fn.submit = function(e) {
            if (0 in arguments) this.bind("submit", e);
            else if (this.length) {
              var t = n.Event("submit");
              this.eq(0).trigger(t), t.isDefaultPrevented() || this.get(0).submit()
            }
            return this
          }
        }(Zepto),
        function() {
          try {
            getComputedStyle(void 0)
          } catch (e) {
            var n = getComputedStyle;
            window.getComputedStyle = function(e, t) {
              try {
                return n(e, t)
              } catch (n) {
                return null
              }
            }
          }
        }();
      var $ = window.Zepto || window.jQuery || window.$;
      if (Is(isVipUrlRegex) || Is(/oo\.movie&/)) Is(/=http/) && ($("title").html(PLUGIN_ID), _$((function() {
        if ($("title").html(PLUGIN_ID), Is(/beijixs\.cn\//))
          if (Is(/%\d/)) {
            addStyle("\nbody > form {\n  position: absolute !important;\n  left: 0 !important;\n  right: 0 !important;\n  top: 0 !important;\n  bottom: 0 !important;\n  background: #eee8d3 !important;\n  z-index: 2147483647 !important;\n}\n\nform #divcss5 {\n  height: auto;\n  min-height: 90vh;\n}\n\n.oo-fail {\n  height: auto !important;\n}\n\n.oo-fail > div {\n  text-align: center;\n  border-top: 1px solid #495057;\n  border-bottom: 1px solid #495057;\n  padding: 1em;\n  color: #d9480f;\n  font-weight: bold;\n  font-size: 16px;\n  background-color: #fff4e6;\n}\n\n.oo-fail > div > div + div {\n  margin-top: 1em;\n}\n");
            t = 0, i = setInterval((function() {
              var n = document.querySelector("video");
              if (n.duration < 390) {
                n.pause();
                var e = $("#TextBox2").attr("value") || "";
                $(".video-js").addClass("oo-fail").html("<div>\n  <div>解析失败</div>".concat(e ? "<div>" + e + "</div>" : "", "\n</div>")), clearInterval(i)
              }
              t++ > 100 && clearInterval(i)
            }), 100)
          } else {
            var n = Href.split("url=")[1];
            if (n) {
              $("#TextBox1").val(decodeURI(n));
              var e = $("#Button1");
              e.length > 0 && ($(".video-js").css("display", "none !important"), e.click())
            }
            var t = 0,
              i = setInterval((function() {
                var n = document.querySelector("video");
                n && n.pause(), t++ > 100 && clearInterval(i)
              }), 100)
          }
        else if (Is(/m1907\.cn/)) {
          addStyle("\n#s-player + .show > div[title],\n#s-controls + div > div:nth-child(n+5):not(:last-child)\n{".concat(PurifyStyle, "}\n"));
          t = 0, i = setInterval((function() {
            ($("#s-player + .show").length > 0 || t++ > 15) && (clearInterval(i), $("#s-controls > div img + span").click())
          }), 200);
          window.alert = function() {}
        }
      }))), (Is(/=http/) && (Is(isVipAddonUrlRegex) || window.top !== window.self && IsNot(/m1907\.cn/)) || Is(/oo\.movie&/)) && vipAddonGo();
      else if (Is(/search\.douban\.com\/movie\//)) log("豆瓣·电影·搜索 - pc"), addStyle("\n#dale_movie_subject_search_bottom,\n#dale_movie_subject_search_top_right,\n#dale_movie_subject_top_right,\n#dale_movie_subject_bottom_super_banner,\n#dale_movie_subject_middle_right {".concat(PurifyStyle, "}\n\n.oo-sources {\n  padding-left: 1em;\n}\n\n.oo-sources a {\n  display: inline-flex !important;\n  align-items: center;\n  border-radius: 4px;\n  font-size: 0.75em;\n  height: 2em;\n  justify-content: center;\n  line-height: 1.5;\n  padding-left: 0.75em;\n  padding-right: 0.75em;\n  white-space: nowrap;\n  background-color: #effaf3;\n  color: #257942;\n  margin-top: 0.5em;\n  margin-right: 0.5em;\n}\n")), _$((function() {
        $("#icp").html(OO_SIGN), $(".gemzcp").each((function(n, e) {
          var t = $(".title", e).text();
          $(e).append('<p class="oo-sources">\n'.concat(getSearchSourcesHtml(t), "\n</p>"))
        }))
      }));
      else if (Is(/m\.douban\.com\/search\/\?.*type=movie/)) log("豆瓣·电影·搜索 - m"), addStyle("\n#TalionNav,\n.search-results-modules-name {".concat(PurifyStyle, "}\n\n.search-module {\n  margin-top: 0;\n}\n\n.search-results img {\n  width: 80px;\n}\n\n.search-results {\n  padding-bottom: 10px;\n}\n\n.search-results li a {\n  display: flex;\n  align-items: center;\n}\n\n.search-results img {\n  height: 100%;\n  padding: 0;\n  margin: 5px 0;\n  border: 2px solid;\n  border-image: linear-gradient(to bottom, #2b68c4 0%,#cf2d6e 100%)1;\n}\n")), _$((function() {
        $("#more-search").append("    " + OO_SIGN), $(".subject-info").each((function(n, e) {
          insertSearchAddon($(".subject-title", e).text(), e, "append")
        })), $(".search-hd input").on("keyup", (function(n) {
          13 === n.keyCode && (n.preventDefault(), location.href = "/search/?query=" + n.target.value + "&type=movie")
        })), $(".search-hd .button-search").attr("id", OO_SIGN), $(".search-hd .button-search").on("click", (function(n) {
          n.preventDefault();
          var e = $(".search-hd input").val();
          location.href = "/search/?query=" + e + "&type=movie"
        }))
      }));
      else if (Is(/movie.douban.com\/subject\//)) log("豆瓣·电影·详情 - pc"), addStyle("\n#dale_movie_subject_search_bottom,\n#dale_movie_subject_search_top_right,\n#dale_movie_subject_top_right,\n#dale_movie_subject_bottom_super_banner,\n#dale_movie_subject_middle_right {".concat(PurifyStyle, "}\n")), _$((function() {
        $("#icp").html(OO_SIGN), log("tick");
        var n = purifyKeyword($("title").text().replace("(豆瓣)", "").trim());
        log("title:", n), log("#info:", $("#info").length), $("#info").append('<div>\n<span class="pl">在线观看:</span>\n<span>\n'.concat(搜索源.filter((function(n) {
          return !/douban\.com/.test(n.url)
        })).map((function(e) {
          return "<span><a " + (isMobile ? "" : 'target="_blank" ') + 'href="' + toSearchUrl(e.url, n) + '">' + e.name + "</a>"
        })).join(" / </span>"), "\n</span></span></div>\n"))
      }));
      else if (Is(/m\.douban\.com\/movie\/subject\//)) log("豆瓣·电影·详情 - m"), addStyle("\n.score-write,\na[href*='to_app']:not(.sub-honor):not(.sub-cover),\na[href*='doubanapp'],\ndiv[id*='BAIDU'],\ndiv[id*='google'],\nsection + .center,\n.bottom_ad_download,\n.sub-vendor,\n.to_pc,\n.TalionNav-static,\n.sub-detail .mark-movie,\n.sub-detail .mark-tv,\n.subject-banner,\n.bottom_ad_download,\n.cover-count,\n#google_esf,\n.adsbygoogle,\n.Advertisement,\n.TalionNav-primary .nav-btns.cancel {".concat(PurifyStyle, '}\n\n.sub-info .sub-cover {\n  display: block !important;\n}\n\n.TalionNav-primary {\n  position: relative !important;\n}\n\n.subject-comments,\n.subject-reviews {\n  margin-bottom: 0 !important;\n}\n\n.TalionNav .TalionNav-primary .search-box {\n  width: 220px;\n  flex: 220px 0 0;\n  animation: none;\n}\n\n.sub-original-title {\n  padding: 0.25em 0;\n}\n\n._V_sign {\n  font-size: 0.85em;\n  opacity: 0.15;\n  text-align: center;\n  padding-bottom: 1em;\n}\n\n._V_source, .sub-score + .sub-score {\n  margin-top: 1.5em !important;\n  color: #fff;\n}\n\n._V_source .sub-score .sub-content {\n  display: block;\n}\n\n._V_source .sub-score a {\n  padding: 0.25em 0.5em;\n  line-height: 1.5;\n  margin: 0 0.15em;\n  border: 1px solid rgba(255,255,255,0.2);\n  font-size: 1.05em;\n  font-weight: bold;\n  letter-spacing: 1px;\n  margin-top: 0.5em;\n  display: inline-block;\n  color: #ffe8cc;\n  background: rgba(239, 238, 238, 0.05);\n  border-radius: 4px;\n}\n\n#TalionNav {\n  display: none;\n}\n\n#TalionNav .logo {\n  background: none;\n  font-size: 1em;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n  color: #dee2e6;\n}\n\n.search-box:not(.on-search) {\n  opacity: 0.7;\n}\n\n#channel_tags {\n  margin-bottom: 10px;\n}\n\n.subject-header-wrap .sub-detail {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n}\n\n#channel_tags {\n  margin-top: 10px;\n}\n\ninput[type="search"]::-webkit-search-decoration,\ninput[type="search"]::-webkit-search-cancel-button,\ninput[type="search"]::-webkit-search-results-button,\ninput[type="search"]::-webkit-search-results-decoration {\n  -webkit-appearance:none;\n}\n')), _$((function() {
        $(".movie-reviews .show-all").after('<div class="_V_sign"><a href="https://https://github.com/zbaiicn">豆瓣·净化 '.concat(OO_SIGN, "</a></div>")), $("section + .center").each((function(n, e) {
          $(e).remove()
        })), $(".subject-header-wrap").after($("#TalionNav")), $("#TalionNav").css("display", "block"), $("#TalionNav .logo").html(OO_SIGN).attr("href", "https://movie.douban.com/tag/#/"), $(".search-box").remove(), $(".TalionNav-primary .logo").after('<div class="search-box"><input class="search-input" type="search" placeholder="搜索"></div>'), $(".search-input").on("focus", (function() {
          $(this).parent().addClass("on-search")
        })).on("blur", (function() {
          $(this).parent().removeClass("on-search")
        })), $(".search-input").on("keyup", (function(n) {
          13 === n.keyCode && (n.preventDefault(), location.href = "/search/?query=" + n.target.value + "&type=movie")
        }));
        var n = purifyKeyword($(".sub-title").text().trim());
        0 === $("._V_source").length && $(".subject-header-wrap").append('<div class="_V_source subject-mark">\n\n<div class="sub-score">\n  <div class="sub-trademark">\n  在线观看\n  </div>\n  <div class="sub-content">\n'.concat(getSearchSourcesHtml(n, !1), "\n  </div>\n</div>\n\n</div>")), setTimeout((function() {
          $(".subject-intro .bd p").click(), $(".sub-cover").attr("href", "#"), $("#subject-honor-root a").attr("href", "#")
        }), 1e3);
        var e = 0,
          t = setInterval((function() {
            $("body > ins, body > iframe, .adsbygoogle").remove(), e++ > 5 && clearInterval(t)
          }), 500);
        ! function n() {
          var e = $("#subject-header-container").attr("style");
          if (e) {
            var t = e.match(/:\s*([^;]+);?/)[1],
              i = t.replace(")", ", 0)");
            try {
              addStyle("\n.sub-cover::before {\n  background: -webkit-linear-gradient(bottom, ".concat(t, " 0%, ").concat(i, " 15%), -webkit-linear-gradient(right, ").concat(t, " 0%, ").concat(i, " 15%),-webkit-linear-gradient(top, ").concat(t, " 0%, ").concat(i, " 15%), -webkit-linear-gradient(left, ").concat(t, " 0%, ").concat(i, ' 15%);\n  content: "";\n  bottom: 0;\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  width: 102px;\n  height: 142px;\n  border-radius: 4px;\n}\n'))
            } catch (n) {
              console.error("syncCoverColor:", n)
            }
          } else setTimeout((function() {
            n()
          }), 100)
        }()
      }));
      else {
        if (Is(/m\.tv\.sohu\.com\/phone_play_film.+vid=/)) return location.href = Href.replace("phone_play_film", "v".concat(Href.match(/vid=(\d+)/)[1], ".shtml"));
        if (isMobile && Is(/movie\.douban\.com\/tag\/#/)) {
          log("豆瓣·选影视");
          var num = 3;
          addStyle(prefixCss("\n.category {\n  width: 100%;\n  white-space: nowrap;\n  overflow-x: auto;\n}\n\n.tags {\n  margin-bottom: 1em;\n}\n\n.checkbox__input {\n  vertical-align: text-top;\n}\n\n.tag-nav {\n  margin: 0 auto;\n  font-size: 12px;\n}\n\n.tag-nav .tabs, .tag-nav .check {\n  display: flex;\n  justify-content: space-around;\n}\n\n.tag-nav .tabs a {\n  padding: 7.5px 5px 5px;\n}\n\n.tabs a:not(.tab-checked) {\n  border: 1px solid #dfdfdf;\n}\n\n.tabs .tab-checked {\n  border: 1px solid #258dcd!important;\n}\n\n.tab-checked:after {\n  display: none;\n}\n\n.checkbox, .range {\n  margin-right: 5px;\n}\n\n.check {\n  float: none;\n  margin-top: 5px;\n}\n\n.list-wp, .item .cover-wp {\n  overflow: unset;\n}\n\na img {\n  padding: 2px;\n  border-radius: 5px;\n  background: linear-gradient(to bottom, #2b68c4 0%,#cf2d6e 100%);\n}\n\na.item {\n  width: ".concat(parseInt(100 / num), "%;\n  text-align: center;\n}\n\na.item p {\n  padding-right: 0;\n}\n\na.item .cover-wp {\n  height: auto;\n  padding: 0 0.5em;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\na.item .cover-wp:after, .poster:after {\n  display: none;\n}\n\na.item .pic img {\n  width: 100%;\n  height: ").concat(parseInt(4 * screenWidth / 3 / num), "px;\n  max-width: 150px;\n  object-fit: cover;\n}\n\n.tag-nav .range-dropdown {\n  left: 0 !important;\n  width: auto !important;\n  right: 0 !important;\n  top: -4em !important;\n}\n\n.more {\n  margin: 0 1em 0.5em;\n}\n\n"), ".oo") + "\nbody > *:not(.oo) {".concat(PurifyStyle, "}\n\n#app .article, .article.oo {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  padding: 10px 6px;\n  transition: all 0.8s;\n}\n\n.category::-webkit-scrollbar {\n  width: 1px;\n  height: 1px;\n  background-color: rgba(223, 223, 223, 0.25);\n}\n\n.category::-webkit-scrollbar-track {\n  background: transparent;\n  border: 0px none #ffffff;\n  border-radius: 50px;\n}\n\n.category::-webkit-scrollbar-thumb {\n  -webkit-box-shadow: inset 0 0 2.5px rgba(0, 0, 0, 0.1);\n  box-shadow: inset 0 0 2.5px rgba(0, 0, 0, 0.1);\n  border-radius: 2.5px;\n  background-color: rgba(223, 223, 223, 0.25);\n  opacity: 0.7;\n  transition: opacity ease-in-out 200ms;\n}\n\n.category::-webkit-scrollbar-thumb:hover {\n  opacity: 1;\n  background-color: rgba(223, 223, 223, 0.25);\n}\n\n.oo-search {\n  position: relative;\n  display: flex;\n  margin-bottom: 5px;\n}\n\n.oo-search .inp {\n  height: 34px;\n  text-align: center;\n  cursor: text;\n  width: 90%;\n}\n\n.oo-search .inp input {\n  background: #fff;\n  width: 96%;\n  margin: 0;\n  text-align: left;\n  height: 30px;\n  padding-left: 10px;\n  outline: none;\n}\n\n.oo-search input {\n  -webkit-appearance: none;\n  border: none;\n  background: transparent;\n}\n\n.oo-search .inp-btn {\n  position: relative;\n  width: 37px;\n  height: 34px;\n}\n\n.oo-search .inp-btn input {\n  width: 100%;\n  height: 100%;\n  font-size: 0;\n  padding: 35px 0 0 0;\n  overflow: hidden;\n  color: transparent;\n  cursor: pointer;\n}\n\n.oo-search .inp-btn input:focus {\n  outline: none;\n}\n\n.oo-search .inp {\n  background-image: url(//img3.doubanio.com/dae/accounts/resources/a4a38a5/movie/assets/nav_mv_bg.png?s=1);\n}\n\n.oo-search .inp-btn input {\n  background: url(//img3.doubanio.com/dae/accounts/resources/a4a38a5/movie/assets/nav_mv_bg.png?s=1) no-repeat 0 -40px;\n}\n")), _$((function() {
            $("title").html("选影视 - 易安解析"), $("#app .article .tags").before('<div class="oo-search">\n  <div class="inp"><input name="'.concat(OO_SIGN, '" size="22" maxlength="60" placeholder="搜索电影、电视剧、综艺、影人" value="" autocomplete="off"></div>\n  <div class="inp-btn"><input type="submit" value="搜索"></div>\n</div>')), $("body").append($("#app .article").addClass("oo")), $(".oo-search input").on("keyup", (function(n) {
              13 === n.keyCode && (n.preventDefault(), location.href = "https://m.douban.com/search/?query=" + n.target.value + "&type=movie")
            })), $(".oo-search .inp-btn input").on("click", (function(n) {
              n.preventDefault();
              var e = $(".oo-search input").val();
              location.href = "https://m.douban.com/search/?query=" + e + "&type=movie"
            })), $("a.item").each((function(n, e) {
              $(e).attr("href", $(e).attr("href").replace("movie.douban.com", "m.douban.com/movie")).removeAttr("target")
            }));
            var n = !1;

            function e() {
              !n && $(window).scrollTop() + $(window).height() > $(document).height() - 40 && (n = !0, setTimeout((function() {
                $(window).scrollTop() + $(window).height() > $(document).height() - 40 && ($(window).unbind("scroll"), $(".more").click()), n = !1
              }), 1200))
            }
            var t = document.querySelector(".list-wp");
            new MutationObserver((function(n) {
              var t = !1,
                i = !0,
                o = !1,
                r = void 0;
              try {
                for (var a, l = n[Symbol.iterator](); !(i = (a = l.next()).done); i = !0) {
                  var s = a.value;
                  "childList" == s.type && (t = !0, s.addedNodes.forEach((function(n) {
                    n.classList.contains("item") && (n.setAttribute("href", n.getAttribute("href").replace("movie.douban.com", "m.douban.com/movie")), n.removeAttribute("target"))
                  }))), t && setTimeout((function() {
                    $(window).scroll(e)
                  }), 1500)
                }
              } catch (n) {
                o = !0, r = n
              } finally {
                try {
                  i || null == l.return || l.return()
                } finally {
                  if (o) throw r
                }
              }
            })).observe(t, {
              attributes: !0,
              childList: !0
            })
          }))
        } else Is(/\w+:1234|ecruos\.gitee\.io\/one/) ? (log("One·主页"), _$((function() {
          localStorage.setItem("One.plugin.version", VERSION)
        }))) : Is(/\.bilibili\.com\/bangumi\/play\//) && (log("哔哩哔哩·影视播放页"), _$((function() {
          var n = 0,
            e = setInterval((function() {
              if ($(".ep-info-image img, .media-cover img").length > 0) {
                var t = $(".media-title, .ep-info-title").eq(0).text();
                t && (clearInterval(e), insertSearchAddon(t, ".media-wrapper, .ep-list-pre-wrapper"))
              }
              n++ > 50 && clearInterval(e)
            }), 200)
        })))
      }
      makeBetterAddons(), callbackWhenDone(), Is(/m\.v\.qq\.com/) && urlDetector((function() {
        if (Is(/v\.qq\.com\/(cover|play|x\/cover|x\/page|x\/play|x\/m\/cover|x\/m\/page|x\/m\/play)/)) var n = 0,
          e = !1,
          t = setInterval((function() {
            e || (e = !0, makeBetterAddons(), n++ > 40 || $(".oo-vip").length > 0 ? clearInterval(t) : e = !1)
          }), 250)
      })), _$((function() {
        $("#a1, .dplayer").length > 0 && addStyle("\nbody:after,\n#a1 ~ script ~ div,\n.dplayer > *[id^=ad]\n{".concat(PurifyStyle, "}\n"))
      }))
    }
  }

  function Reverse(n) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
    return n.split("").reverse().join(e)
  }

  function RReverse(n) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
    return n.split(e).reverse().join("")
  }

  function randomInt(n, e) {
    return Math.floor(Math.random() * (e - n + 1) + n)
  }

  function CaesarEncrypt(n) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : CaesarShift,
      t = n.split("").reverse();
    return t.map((function(n) {
      return caesar(n, e)
    })).join("")
  }

  function CaesarDecrypt(n) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : CaesarShift,
      t = n.split("").reverse();
    return t.map((function(n) {
      return caesarDec(n, e)
    })).join("")
  }

  function log() {
    if (DEBUG) {
      var n = [];
      n.push(PLUGIN_ID + "  ");
      for (var e = 0; e < arguments.length; e++) n.push(arguments[e]);
      console.log.apply(console, n)
    }
  }

  function _$(n) {
    $((function() {
      try {
        n()
      } catch (n) {
        console.error("易安解析: " + n)
      }
    }))
  }

  function getKeywordFromUrl(n, e) {
    var t = (e || location.href).match(n || CommonSearchKeywordRegex);
    return t ? D((n ? t[1] || t[2] : t[2] || t[4]) || "") : ""
  }

  function purifyKeyword(n) {
    return (PurifyKeywordRegex ? n.replace(PurifyKeywordRegex, "") : n).replace(/\s*:\s*$/, "").trim()
  }

  function prefixCss(n, e) {
    var t, i, o, r, a = e.length;
    e += " ", n = (n = (n = n.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "")).replace(/}(\s*)@/g, "}@")).replace(/}(\s*)}/g, "}}");
    for (var l = 0; l < n.length - 2; l++) t = n[l], i = n[l + 1], "@" === t && (o = !0), o || "{" !== t || (r = !0), r && "}" === t && (r = !1), r || "@" === i || "}" === i || "}" !== t && "," !== t && ("{" !== t && ";" !== t || !o) || (n = n.slice(0, l + 1) + e + n.slice(l + 1), l += a, o = !1);
    return 0 !== n.indexOf(e) && 0 !== n.indexOf("@") && (n = e + n), n
  }

  function addStyle(n, e) {
    e && (n = prefixCss(n, e)), n = n.replace(/\n+\s*/g, " ");
    var t = document.createElement("style");
    t.type = "text/css", t.styleSheet ? t.styleSheet.cssText = n : t.appendChild(document.createTextNode(n)), document.getElementsByTagName("head")[0].appendChild(t)
  }

  function fixUrl(n) {
    return n.replace(/[\?#].+/g, "")
  }

  function fixVipUrl(n) {
    var e = BETTER_ADDONS.find((function(e) {
      return e.fixUrl && e.match.test(n)
    }));
    return e ? !0 === e.fixUrl ? fixUrl(n) : e.fixUrl(n) : n
  }

  function parseOoUrl(n, e) {
    var t, i, o = n.trim().split(/[\s@]+/),
      r = o.filter((function(n) {
        return /https?:\/\//.test(n)
      }));
    o = o.filter((function(n) {
      return !/https?:\/\//.test(n)
    })), r.forEach((function(n) {
      /\/\/m\.|\/m\/|\/\/msou/.test(n) ? t = n : i = n
    }));
    var a = (isMobile ? t : i) || r[0];
    e && (a = toSearchUrl(a, e));
    var l = o.length > 0 ? o.join(" ") : a.match(/\/\/(.+\.)?([^\/]+)\.\w+\//)[2].replace(/^(\w)/, (function(n) {
      return n.toUpperCase()
    }));
    return {
      url: a,
      name: l
    }
  }

  function toSearchUrl(n, e) {
    return n.includes("**") ? n.replace("**", e) : /movie\.douban\.com\/tag/.test(n) ? n : n + e
  }

  function ensureArray(n) {
    return Array.isArray(n) ? n : n.trim().split(/[\n\s]*\n+[\n\s]*/)
  }

  function toUrlRegex(n) {
    return new RegExp(n.map((function(n) {
      return n.replace(/.+\/\/|\/.+/g, "").replace(/\./g, "\\.")
    })).join("|"))
  }

  function pausePlay() {
    try {
      $("video, audio").each((function(n, e) {
        e.pause(), e.muted = "muted", $(e).remove()
      }))
    } catch (n) {
      console.error("易安解析 play: " + n)
    }
  }

  function smartCollapse(n) {
    log("smartCollapse:", n);
    var e = 0,
      t = !1;
    $(n).each((function(n, i) {
      n < collapseNum ? n >= collapseNum - 1 && (e = $(i).position().top) : t || e !== $(i).position().top ? (t = !0, $(i).prev("").addClass("oo-hide")) : !t && $(i).hasClass("oo-collapse") && $(i).addClass("oo-hide")
    }))
  }

  function getVipTargetUrl() {
    var n = Is(isVipUrlRegex) ? location.href.replace(/.+=http/, "http") : location.href.replace(/&?\w+=http[^&]+/, "").replace(/.+http/, "http");
    return n = decodeURI(fixVipUrl(n) || n)
  }

  function isValidVideoUrl(n) {
    return isVideoUrlRegex.test(n) && !isInvalidSniffUrlRegex.test(n) && (!isBadVideoUrlRegex.test(n) || Date.now() - sniffTimestamp > 8e3)
  }

  function sniffStart(n) {
    isSniffing = !0, sniffTimestamp = Date.now(), n && ($(".oo-vip-list").addClass("is-sniffing"), $(".oo-notification").remove())
  }

  function sniffDone() {
    isSniffing = !1, $(".oo-vip-list").removeClass("is-sniffing")
  }

  function sniffSuccess(n) {
    log("✔ sniffSuccess:", n), sniffDone(), $(".oo-iframes").empty(), $(".oo-notification").remove(), $(".oo-vip-list").after('<div class="oo-notification oo-success">解析成功，嗅探到播放地址：<br><code>'.concat(n, "</code></div>"))
  }

  function sniffFail(n) {
    log("× sniffFail"), sniffDone(), $(".oo-notification").remove(), $(".oo-vip-list").after('<div class="oo-notification oo-warning">解析失败，'.concat(n ? "" : "可以尝试其它解析源，也", "可以考虑在其它正版网站上解析，或使用搜索源搜索在线观看</div>"))
  }

  function hikerSniff(sniffTickId) {
    if (sniffTickId === sniffTick) {
      log("hikerSniff");
      var resource = eval(window.fy_bridge_app.getNetworkRecords());
      if (resource = resource.filter((function(n) {
          return n.timestamp > sniffTimestamp && /video/i.test(n.mediaType.name) && isValidVideoUrl(n.url)
        })), DEBUG) {
        var logInfo = "Count: ".concat(resource.length, " (").concat((new Date).toISOString(), ")<br>") + resource.map((function(n, e) {
          return "".concat(e + 1, " - ").concat(n.mediaType.name, "(").concat(n.mediaType.type, ") - ").concat(n.url)
        })).join("<br>");
        $(".oo-sources").html(logInfo)
      }
      if (0 !== resource.length) {
        if (isSniffing) {
          var resourceUrl = resource[0].url;
          sniffSuccess(resourceUrl), window.fy_bridge_app.playVideo(resourceUrl)
        }
      } else isSniffing && setTimeout((function() {
        hikerSniff(sniffTickId)
      }), 100)
    }
  }

  function mixiaSniff(n) {
    if (n === sniffTick) {
      log("mixiaSniff");
      var e = [],
        t = window.mx_browser_obj.getweblogs("http");
      if ("error" !== t && (e = (e = t.trim().split(/\s*\n[\n\s]*/)).filter((function(n) {
          return isValidVideoUrl(n)
        }))), DEBUG) {
        var i = "Count: ".concat(e.length, " (").concat((new Date).toISOString(), ")<br>") + e.map((function(n, e) {
          return "".concat(e + 1, " - ").concat(n)
        })).join("<br>");
        $(".oo-sources").html(i)
      }
      if (0 !== e.length) {
        if (isSniffing) {
          var o = e[0];
          sniffSuccess(o), window.mx_browser_obj.playvideo(o, o)
        }
      } else isSniffing && setTimeout((function() {
        mixiaSniff(n)
      }), 100)
    }
  }

  function sniff(n) {
    var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
    if (log("sniff:", playerTitle), sniffStart(e), isAllowHikerSniff) hikerSniff(n);
    else {
      if (!isAllowMixiaSniff) return void sniffDone();
      mixiaSniff(n)
    }
    e ? sniffVip() : setTimeout((function() {
      n === sniffTick && sniffFail(e)
    }), 13e3)
  }

  function sniffVip() {
    var n = getVipPlayer();
    n.length > 0 && n.empty().append('<div class="oo-player-box"><div class="oo-player-bg"></div></div>'), pausePlay(), 0 === $(".oo-iframes").length && $("body").append('<div class="oo-iframes"></div>'), goSniff()
  }

  function goSniff() {
    var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
    if (isSniffing) {
      var e = VIP_URLS[n];
      if (log("【".concat(n, "】goSniff:"), e), e) {
        var t = getVipTargetUrl(),
          i = e.url + t;
        log("sniff: " + i), $(".oo-iframes").append('<iframe src="'.concat(i, '"></iframe>')), setTimeout((function() {
          log("remove iframe"), $(".oo-iframes > iframe").eq(0).remove(), n === VIP_URLS.length && sniffFail(!0)
        }), 1e4), setTimeout((function() {
          goSniff(n + 1)
        }), n < 5 ? 50 : Math.min(100 + 50 * n, 1e3))
      }
    }
  }

  function getVipPlayer() {
    var n = $(PlayerSelector).eq(0);
    return 0 === n.length && (n = $("#player, .player").eq(0)), n
  }

  function insertVipSource(n) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "after",
      t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
    if (!($(".oo-vip").length > 0 || t > 20)) {
      var i = $(n);
      if (0 !== i.length) {
        log("insertVipSource"), addStyle("\n.oo-vip {\n  padding-bottom: 0.5em;\n  background-color: rgba(255, 255, 255, 0.05);\n  border-radius: 5px;\n  width: 100%;\n  overflow: hidden;\n}\n\n.oo-vip + .oo-vip, .oo-iframes {".concat(PurifyStyle, "}\n\n.oo-iframes > iframe {\n  max-width: 33.3%;\n  display: inline-block;\n}\n\n.oo-vip-panel {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 10px 10px 0;\n  font-size: 15px;\n  width: 100%;\n}\n\n.oo-vip-panel.is-setting {\n  padding-bottom: 0.5em;\n  border-bottom: 1px solid rgba(73, 80, 87, 0.15);\n  border-top: 1px solid rgba(73, 80, 87, 0.15);\n  font-size: 0.95em;\n  opacity: 0.8;\n}\n\n.oo-vip-panel.is-setting a {\n  color: #1c7ed6;\n  text-decoration: underline;\n  font-weight: bold;\n  margin-right: 1em;\n}\n\n.oo-vip-panel.is-setting .oo-nav-links {\n  display: flex;\n  justify-content: space-around;\n  width: 100%;\n}\n\n.oo-vip-panel.is-setting:not(.is-open) {\n  display: none;\n}\n\n.oo-vip-title {\n  font-weight: bold;\n  color: #257942;\n  width: 100%;\n}\n\n.oo-vip-small {\n  font-size: 0.75em;\n  margin: 0 10px;\n  color: #ced4da;\n}\n\n.oo-vip-title, .oo-vip-sign {\n  padding: 0.5em;\n}\n\n.oo-vip-title-text, .oo-vip-sign {\n  cursor: pointer;\n}\n\n.oo-vip-panel, .oo-vip-list {\n  height: auto !important;\n}\n\n.oo-vip-sign {\n  opacity: 0.25;\n  margin-right: 1em;\n  min-width: 5em;\n  text-align: right;\n  animation: oo-color-change-opacity 5s normal infinite ease-in-out;\n}\n\n@keyframes oo-color-change-opacity {\n  0%   { opacity: 0.25; }\n  50% { opacity: 0.45; }\n  100% { opacity: 0.25; }\n}\n\n.oo-vip-list {\n  padding: 0.5em;\n  letter-spacing: 1px;\n}\n\n.oo-vip-list .oo-vip-item {\n  border-radius: 4px;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n  white-space: nowrap;\n  background-color: #eef6fc;\n  color: #1d72aa;\n  margin: 4px;\n  padding: 0.5em 0.5em 0.35em;\n  cursor: pointer;\n  font-size: 14px;\n  line-height: 1.2;\n  font-weight: 600;\n  text-decoration: none;\n  position: relative;\n  overflow: hidden;\n  transition: all 0.25s;\n}\n\n.oo-vip-list.is-sniffing .oo-vip-item {\n  cursor: not-allowed;\n  opacity: 0.5;\n}\n\n.oo-vip-list.is-sniffing .oo-sniff {\n  animation: oo-beat 0.25s infinite alternate;\n}\n\n.oo-vip-list .oo-vip-item.oo-sniff {\n  color: #099268;\n}\n\n.oo-vip-list.is-sniffing .oo-sniff .oo-vip-weight {\n  background-color: #099268;\n}\n\n.oo-notification {\n  border-radius: 4px;\n  padding: 1em 2em 1em 1em;\n  margin: 0.5em;\n  font-weight: bold;\n  font-size: 0.9em;\n}\n\n.oo-notification.oo-warning {\n  background-color: #ffdd57;\n  color: rgba(0,0,0,0.7);\n}\n\n.oo-notification.oo-success {\n  background-color: #48c774;\n  color: #fff;\n}\n\n@keyframes oo-beat{\n\tto { transform: scale(1.4); }\n}\n\n.oo-collapse {\n  min-width: 2em;\n}\n\n.oo-vip-weight-bg, .oo-vip-weight {\n  position: absolute;\n  bottom: 0;\n  height: 2px;\n  left: -1px;\n  right: -1px;\n  transition: all 0.5s;\n}\n\n.oo-vip-weight-bg {\n  position: absolute;\n  right: -1px;\n  background-color: #ced4da;\n}\n\n.oo-vip-weight-bg.is-full {\n  background-color: #0ca678;\n}\n\n.oo-vip-weight {\n  background-color: #2b8a3e;\n  border-radius: 1px;\n}\n\n.oo-vip-list .oo-vip-item:hover .oo-vip-weight-bg, .oo-vip-list .oo-vip-item:hover .oo-vip-weight, .oo-vip-list .oo-vip-item.is-active .oo-vip-weight-bg, .oo-vip-list .oo-vip-item.is-active .oo-vip-weight {\n  opacity: 0;\n}\n\n.oo-vip-list .oo-vip-item:hover, .oo-vip-list .oo-vip-item:active {\n  background-color: #1d72aa;\n  color: #eef6fc !important;\n}\n\n.oo-vip-list .oo-vip-item.is-good {\n  color: rgb(14, 95, 149);\n}\n\n.oo-vip-list .oo-vip-item.is-bad {\n  opacity: 0.85;\n}\n\n.oo-vip-list .oo-vip-item.is-bad:hover, .oo-vip-list .oo-vip-item.is-bad:active {\n  opacity: 0.95;\n}\n\n.oo-vip-list .oo-vip-item.is-active {\n  background-color: #2b8a3e;\n  color: #eef6fc;\n}\n\n.oo-vip-list.is-open .oo-collapse,\n.oo-sources.is-open .oo-collapse {\n  transform:scaleX(-1);\n}\n\n.oo-vip-list:not(.is-open) .oo-hide {\n  display: none !important;\n}\n\n.oo-vip-tip {\n  border-top: 1px solid rgba(73, 80, 87, 0.15);\n  padding: 1em 1em 0.5em;\n  font-size: 0.85em;\n  color: #343a40;\n  opacity: 1;\n  animation: oo-color-change-light 5s normal forwards ease-in-out;\n}\n\n.oo-vip-tip.is-warning {\n  color: #e8590c;\n  animation: oo-color-change-light2 5s normal forwards ease-in-out;\n}\n\n@keyframes oo-color-change-light {\n  0%   { color: #343a40; opacity: 1; }\n  100% { color: #979aab; opacity: 0.85; }\n}\n\n@keyframes oo-color-change-light2 {\n  0%   { color: #e8590c; opacity: 1; }\n  100% { color: #fd7e14; opacity: 0.85; }\n}\n\n.oo-vip-tip strong {\n  margin: 0 0.5em;\n  font-size: 1.25em;\n  opacity: 0.8;\n}\n\n.oo-vip-tip strong a, .oo-vip-tip strong a:visited{\n  color: #228be6;\n  text-decoration: underline;\n}\n\n.oo-vip-warning {\n  background-color: #e67700;\n  padding: 0.5em 1em;\n  text-align: center;\n  font-size: 0.85em;\n}\n\n.oo-vip-warning a {\n  color: #fff !important;\n}\n\n.oo-player-bg {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: cover;\n  background-image: url(https://p.pstatp.com/origin/ff460000f53068309d77);\n  z-index: 2147483646;\n  pointer-events: none;\n}\n"));
        var o = DEBUG || isMobile ? '<div class="oo-vip-panel is-setting">\n<div class="oo-nav-links">\n  <a href="https://greasyfork.org/zh-CN/scripts/440614" target="_blank">油猴地址</a><a href="https://https://github.com/zbaiicn" target="_blank">代码仓库</a><a href="https://https://github.com/zbaiicn" target="_blank">One主页</a>\n</div>\n</div>' : "";
        i.eq(0)[e]('\n<div class="oo-vip">\n  <div class="oo-vip-panel">\n    <div class="oo-vip-title"><span class="oo-vip-title-text">易安 解析<span class="oo-vip-small">v'.concat(VERSION, '</span></span></div>\n    <div class="oo-vip-sign">').concat(OO_SIGN, "</div>\n  </div>").concat(o, '\n  <div class="oo-vip-list">\n').concat(isAllowSniff ? '<span class="oo-vip-item oo-normal oo-sniff">'.concat(sniffName, '<span class="oo-vip-weight" style="width:100%;"></span></span>') : "", "\n").concat(VIP_URLS.map((function(n, e) {
          return '<span class="' + ("oo-vip-item" + (Is(isVipUrlRegex) || !isUseDefaultVipUrls ? "" : isMobile && n.isM || !isMobile && n.weight >= 1 ? " is-good" : " is-bad")) + '" _ooKey="' + CaesarEncrypt(String(e)) + '" _ooWeight="' + n.weight.toFixed(2) + '">' + n.name + '<span class="oo-vip-weight-bg' + (n.isM ? " is-full" : "") + '"></span><span class="oo-vip-weight" style="width:' + n.weight / maxVipWeight * 100 + '%;"></span></span>'
        })).join("\n")).concat(VIP_URLS.length > collapseNum ? '<span class="oo-vip-item oo-normal oo-collapse">➢</span>' : "", "\n  </div>\n  ").concat(isMobile ? '<div class="oo-vip-tip'.concat(isAllowSniff ? "" : " is-warning", '">配合浏览器的<strong>广告拦截</strong>和<strong>嗅探播放</strong>功能使用，体验更佳。').concat(isHiker ? "" : '<br>可自行拦截解析网站的图片广告，或订阅 <strong><a href="https://greasyfork.org/zh-CN/scripts/440614" target="_blank">易安解析</a></strong> 拦截规则。', "</div>") : "", "\n</div>\n")), smartCollapse(".oo-vip-item");
        var r = !1;
        u();
        var a = 0,
          l = setInterval((function() {
            u(), a++ > 25 && clearInterval(l)
          }), 500)
      } else setTimeout((function() {
        insertVipSource(n, e, t + 1)
      }), 250)
    }

    function s(n) {
      $(".oo-notification").remove();
      var e = getVipPlayer();
      if (0 !== e.length) {
        pausePlay(), e.empty().append('<div class="oo-player-box"><div class="oo-player-bg"></div><iframe id="oo-player" style="'.concat("width: 100%; height: 100%; border: none; outline: none; margin: 0; padding: 0; position: absolute; z-index: 2147483647; left: 0;", '" ').concat(' width="100%" height="100%" allowfullscreen="true" allowtransparency="true" frameborder="0" scrolling="no"', ' src="').concat(n, '"></iframe></div>'))
      } else location.href = n
    }

    function c(n, e) {
      var t = n + getVipTargetUrl();
      log("click: " + t), $(".oo-vip-item").removeClass("is-active"), $(e).addClass("is-active"), NoInnerVipUrlRegex.test(n) || /http:/.test(n) ? (pausePlay(), $("#oo-player").remove(), setTimeout((function() {
        window.open(t, "_blank")
      }), 100)) : s(t)
    }

    function p(n, e) {
      $(n).click((function(n) {
        r || (r = !0, n.preventDefault(), e(this), setTimeout((function() {
          r = !1
        }), 500))
      }))
    }

    function u() {
      p(".oo-vip-item:not(.oo-normal)", (function(n) {
        $(".oo-vip-list.is-sniffing").length > 0 || (sniffDone(), sniff(++sniffTick), c(VIP_URLS[CaesarDecrypt($(n).attr("_ooKey"))].url, n))
      })), p(".oo-vip-list .oo-collapse", (function(n) {
        $(n).parent(".oo-vip-list").toggleClass("is-open")
      })), p(".oo-vip-list .oo-sniff", (function() {
        sniff(++sniffTick, !0)
      })), p(".oo-vip-sign", (function(n) {
        DEBUG || isMobile ? $(n).parent(".oo-vip-panel").siblings(".is-setting").toggleClass("is-open") : location.href = "https://https://github.com/zbaiicn"
      })), p(".oo-vip-title-text", (function(n) {
        isMobile ? $(n).parent(".oo-vip-panel").siblings(".is-setting").toggleClass("is-open") : location.href = "https://greasyfork.org/zh-CN/scripts/440614"
      }))
    }
  }

  function callbackWhenDone() {
    _$((function() {
      HTML.setAttribute(PLUGIN_ATTR, PLUGIN_ID), setTimeout((function() {
        HTML.removeAttribute(PLUGIN_ATTR)
      }), 3e3)
    }))
  }

  function getSearchSourcesHtml(n) {
    var e = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
      t = Href.match(/\/\/([^\/]+)/)[1];
    return 搜索源.map((function(e) {
      return e.url.includes(t) ? "" : '<a target="_blank" href="' + toSearchUrl(e.url, n) + '">' + e.name + "</a>"
    })).join("\n") + (e && 搜索源.length > collapseNum ? '<a class="oo-collapse">➢</a>' : "")
  }

  function insertSearchAddon(n, e) {
    var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "after",
      i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0,
      o = Href.includes("m.douban.com/search");
    if (!(!n || !o && $(".oo-sources").length > 0 || i > 20)) {
      var r;
      log("insertSearchAddon");
      var a = !1;
      playerTitle = n, "string" == typeof e && (a = e.startsWith("-")) && (e = e.slice(1)), 0 !== (r = $(e)).length ? (addStyle("\n.oo-sources {\n  max-width: 1000px;\n  margin: 0 auto;\n  padding: 10px;\n}\n\n.oo-vip .oo-sources {\n  max-width: unset;\n  border-top: 1px solid rgba(73, 80, 87, 0.15);\n  margin-top: 5px;\n}\n\n.oo-sources + .oo-sources {".concat(PurifyStyle, "}\n\n.oo-sources a {\n  display: inline-flex !important;\n  align-items: center;\n  justify-content: center;\n  border-radius: 4px;\n  font-size: 12px !important;\n  line-height: 1.2;\n  padding: 5px 10px 3px;\n  margin-top: 8px;\n  margin-right: 6px;\n  white-space: nowrap;\n  background-color: #effaf3 !important;\n  color: #257942 !important;\n  cursor: pointer;\n  border: 1px solid #f1f3f5;\n  text-decoration: none;\n  transition: all 0.25s;\n}\n\n.oo-vip-list + .oo-sources .oo-collapse {\n  display: inline-flex !important;\n}\n\n.oo-sources:not(.is-open) .oo-hide {\n  display: none !important;\n}\n\n.oo-collapse {\n  min-width: 2em;\n}\n\n.oo-sources a:hover {\n  border: 1px solid #099268;\n  background-color: #257942 !important;\n  color: #effaf3 !important;\n}\n")), r[a ? "last" : "first"]()[t]('<div class="oo-sources">\n'.concat(getSearchSourcesHtml(purifyKeyword(n), !o), "\n</div>")), o || smartCollapse(".oo-sources a"), $(".oo-sources .oo-collapse").click((function() {
        $(this).parent(".oo-sources").toggleClass("is-open")
      }))) : setTimeout((function() {
        insertSearchAddon(n, e, t, i + 1)
      }), 500)
    }
  }

  function vipAddonGo() {
    var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "body";

    function e(e) {
      $(n).addClass("oo").append(e), $(e).attr({
        autoplay: !0,
        controls: !0
      }), e.play(), e.oncanplay = function() {
        e.play()
      }
    }
    addStyle("\nbody:after,\n#a1 ~ script ~ div,\n.dplayer > *[id^=ad] {".concat(PurifyStyle, "}\n\n").concat(n, " > video {\n  position: fixed !important;\n  top: 0px !important;\n  left: 0px !important;\n  min-width: 0px !important;\n  min-height: 0px !important;\n  max-width: 99.99% !important;\n  max-height: 99.99% !important;\n  margin: 0px !important;\n  visibility: visible !important;\n  border-width: 0px !important;\n  background: black !important;\n  z-index: 2147483647 !important;\n  width: 100% !important;\n  height: 100% !important;\n}\n\n.oo.is-fail {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  background-color: #000;\n}\n\n.oo.is-fail .tip {\n  text-align: center;\n  padding: 1em;\n  color: white;\n}\n    ")), _$((function() {
      var t, i = !0,
        o = !1,
        r = !1,
        a = setInterval((function() {
          if (!r)
            if (r = !0, $(n).hasClass("oo")) clearInterval(a);
            else {
              (t = $("video").get(0)) && e(t);
              var l = $("iframe");
              if (0 !== l.length) {
                for (var s; 0 === (t = l.contents().find("video")).length && (s = l.contents().find("iframe")).length > 0;) l = s;
                t.length > 0 && t.attr("src") ? (clearInterval(a), i && (i = !0, e(t))) : o && clearInterval(a), r = !1, $("title").html() !== PLUGIN_ID && $("title").html(PLUGIN_ID)
              }
            }
        }), 250);
      setTimeout((function() {
        o = !0
      }), 15e3)
    }))
  }

  function execQuickAddons(n) {
    log("execQuickAddons:", n.name || n.match);
    var e = "";
    n.hide && (e += "\n".concat(n.hide, " {").concat(PurifyStyle, "}\n")), n.css && (e += n.css), e && addStyle(e), _$((function() {
      if ((n.sign && $(n.sign).html(OO_SIGN), n.vip) && ((Array.isArray(n.vip) ? n.vip : [n.vip]).forEach((function(n) {
          insertVipSource((n = n.split(/\s*\|\s*/))[0], n[1])
        })), n.title)) var e = 0,
        t = setInterval((function() {
          var i = $(n.title).eq(0).text();
          i && (clearInterval(t), insertSearchAddon(i, ".oo-vip-list", "after")), e++ > 50 && clearInterval(t)
        }), 200);
      n.jump && (log("searchAddon:", n), _$((function() {
        var e = "string" == typeof n.keyword ? $(n.keyword).eq(0).text() : "function" == typeof n.keyword ? n.keyword($) : getKeywordFromUrl(n.keyword);
        (Array.isArray(n.jump) ? n.jump : n.jump.split(/\s*,\s*/)).forEach((function(n) {
          n = n.split(/\s*\|\s*/), insertSearchAddon(e, n[0], n[1] || "after")
        }))
      })))
    }))
  }

  function makeBetterAddons() {
    BETTER_ADDONS.forEach((function(n) {
      ("string" == typeof n.match ? Href.includes(n.match) : Is(n.match)) && execQuickAddons(n)
    }))
  }

  function urlDetector(n) {
    setInterval((function() {
      Href !== window.location.href && (Href = window.location.href, n && n())
    }), 250)
  }
}();
