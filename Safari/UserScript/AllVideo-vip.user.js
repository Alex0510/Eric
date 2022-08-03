// ==UserScript==
// @name         全网VIP视频全自动解析播放无广告
// @version      1.4.6
// @author       Mr.Eric
// @description  视频自动解析：1、支持B站大会员番剧，全网独创自由选择自动解析接口；2、爱奇艺、腾讯、优酷、芒果等全网VIP视频免费解析去广告(免跳出观影特方便)；
// @icon         https://www.zhihupe.com/favicon.ico
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/crypto-js/4.1.1/crypto-js.min.js
// @require      https://lib.baomitu.com/echarts/4.6.0/echarts.min.js
// @match          *://laisoyiba.com/*
// @match           *://*.youku.com/v_*
// @match           *://*.iqiyi.com/v_*
// @match           *://*.iqiyi.com/w_*
// @match           *://*.iqiyi.com/a_*
// @match           *://v.qq.com/x/cover/*
// @match           *://v.qq.com/x/page/*
// @match           *://v.qq.com/tv/*
// @match           *://*.mgtv.com/b/*
// @match           *://*.bilibili.com/video/*
// @match           *://*.bilibili.com/bangumi/play/*
// @match           *://www.acfun.cn/bangumi/*
// @match           *://www.le.com/ptv/vplay/*
// @match           *://www.wasu.cn/Play/show/*
// @match           *://vip.1905.com/play/*
// @match           *://tv.sohu.com/v/*
// @match           *://film.sohu.com/album/*
// @match           *://v.pptv.com/show/*

// @match           *://m.v.qq.com/*
// @match           *://m.iqiyi.com/v_*
// @match           *://m.iqiyi.com/w_*
// @match           *://m.iqiyi.com/a_*
// @match           *://m.youku.com/alipay_video/*
// @match           *://m.youku.com/video/*
// @match           *://m.mgtv.com/b/*
// @match           *://m.bilibili.com/video/*
// @match           *://m.bilibili.com/anime/*
// @match           *://m.bilibili.com/bangumi/play/*
// @match           *://m.le.com/vplay_*
// @match           *://vip.1905.com/m/play/*
// @match           *://www.wasu.cn/wap/Play/show/*
// @match           *://m.tv.sohu.com/v.*
// @match           *://m.pptv.com/show/*

// @connect      tool.zhihupe.com
// @connect      47.99.158.118
// @connect      api.bilibili.com
// @grant        GM_openInTab
// @grant        GM.openInTab
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle

// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow
// @run-at       document-body
// @license      End-User License Agreement
// ==/UserScript==

(function() {
    'use strict';
    

    const config ={
        "playhref":window.location.href,
        "host":window.location.host,
        "UA":navigator.userAgent,
        "scriptInfo":GM_info.script,
        "hdapikey":"FF9529914C44",
    }
    const playList=[
        {"id":"71","name":"M3U8.TV","category":1,"url":"https://jx.m3u8.tv/jiexi/?url=", "showType":3},
        {"id":"70","name":"纯净/B站","category":1,"url":"https://z1.m1907.cn/?a=1&amp;jx=", "showType":3},
        {"id":"2","name":"思古高速","category":1,"url":"https://jsap.attakids.com/?url=", "showType":3},
        {"id":"3","name":"综合/B站","category":1,"url":"https://jx.bozrc.com:4433/player/?url=", "showType":3},
        {"id":"4","name":"OK解析","category":1,"url":"https://okjx.cc/?url=", "showType":3},
        {"id":"1","name":"618g","category":1,"url":"https://jx.618g.com/?url=", "showType":3},
        {"id":"5","name":"夜幕1","category":1,"url":"https://www.yemu.xyz/?url=", "showType":3},
        {"id":"6","name":"夜幕2","category":1,"url":"https://www.yemu.xyz/v/c.php?url=", "showType":3},
        {"id":"7","name":"夜幕3","category":1,"url":"https://www.yemu.xyz/v/d.php?url=", "showType":3},
        {"id":"8","name":"夜幕4","category":1,"url":"https://www.yemu.xyz/v/e.php?url=", "showType":3},
        {"id":"9","name":"乐多资源","category":1,"url":"https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid=", "showType":3},
        {"id":"10","name":"爱豆","category":1,"url":"https://jx.aidouer.net/?url=", "showType":3},
        {"id":"11","name":"虾米","category":1,"url":"https://jx.xmflv.com/?url=", "showType":3},
        {"id":"12","name":"人人迷","category":1,"url":"https://jx.blbo.cc:4433/?url=", "showType":3},
        {"id":"13","name":"全民","category":1,"url":"https://660e.com/?url=", "showType":3},
        {"id":"14","name":"七哥","category":1,"url":"https://jx.mmkv.cn/tv.php?url=", "showType":3},
        {"id":"15","name":"BL解析","category":1,"url":"https://svip.bljiex.cc/?v=", "showType":3},
        {"id":"16","name":"8090","category":1,"url":"https://www.8090g.cn/jiexi/?url=", "showType":3},
        {"id":"17","name":"CK","category":1,"url":"https://www.ckplayer.vip/jiexi/?url=", "showType":3},
        {"id":"18","name":"小七","category":1,"url":"https://2.08bk.com/?url=", "showType":3},
        {"id":"19","name":"LE","category":1,"url":"https://lecurl.cn/?url=", "showType":3},
        {"id":"20","name":"ckmov","category":1,"url":"https://www.ckmov.vip/api.php?url=", "showType":3},
        {"id":"21","name":"playerjy/B站","category":1,"url":"https://jx.playerjy.com/?url=", "showType":3},
        {"id":"22","name":"1717云","category":1,"url":"https://ckmov.ccyjjd.com/ckmov/?url=", "showType":3},
        {"id":"23","name":"爱豆","category":1,"url":"https://jx.aidouer.net/?url=", "showType":3},
        {"id":"24","name":"5gseo","category":1,"url":"https://sb.5gseo.net/?url=", "showType":3},
        {"id":"25","name":"H8","category":1,"url":"https://www.h8jx.com/jiexi.php?url=", "showType":3},
        {"id":"26","name":"解析la","category":1,"url":"https://api.jiexi.la/?url=", "showType":3},
        {"id":"27","name":"云解析jj","category":1,"url":"https://lngyjj.cn/4/?url=", "showType":3},
        {"id":"28","name":"老板","category":1,"url":"https://vip.laobandq.com/jiexi.php?url=", "showType":3},
        {"id":"29","name":"盘古","category":1,"url":"https://www.pangujiexi.cc/jiexi.php?url=", "showType":3},
        {"id":"30","name":"盖世","category":1,"url":"https://www.gai4.com/?url=", "showType":3},
        {"id":"31","name":"YiTV","category":1,"url":"https://jiexi.us/?url=", "showType":3},
        {"id":"32","name":"0523","category":1,"url":"https://go.yh0523.cn/y.cy?url=", "showType":3},
        {"id":"33","name":"17云","category":1,"url":"https://www.1717yun.com/jx/ty.php?url=", "showType":3},
        {"id":"34","name":"4K","category":1,"url":"https://jx.4kdv.com/?url=", "showType":3},
        {"id":"35","name":"云析","category":1,"url":"https://jx.yparse.com/index.php?url=", "showType":3},
        {"id":"36","name":"8090","category":1,"url":"https://www.8090g.cn/?url=", "showType":3},
        {"id":"37","name":"江湖","category":1,"url":"https://api.jhdyw.vip/?url=", "showType":3},
        {"id":"38","name":"诺讯","category":1,"url":"https://www.nxflv.com/?url=", "showType":3},
        {"id":"39","name":"PM","category":1,"url":"https://www.playm3u8.cn/jiexi.php?url=", "showType":3},
        {"id":"40","name":"MaoPlayer","category":1,"url":"https://jx.dj6u.com/?url=", "showType":3},
        {"id":"41","name":"180","category":1,"url":"https://jx.000180.top/jx/?url=", "showType":3},
        {"id":"42","name":"无名","category":1,"url":"https://www.administratorw.com/video.php?url=", "showType":3},
        {"id":"43","name":"cd①号vip","category":1,"url":"https://vip.26db.cn/play/?v=", "showType":3},
        {"id":"44","name":"cd②号vip","category":1,"url":"https://vip.26db.cn/b/?url=", "showType":3},
        {"id":"45","name":"cd③号vip","category":1,"url":"https://vip.26db.cn/a/?url=", "showType":3},
        {"id":"46","name":"cd④号vip","category":1,"url":"https://vip.26db.cn/c/?url=", "showType":3},
        {"id":"47","name":"cd⑤号vip","category":1,"url":"https://vip.26db.cn/d/?url=", "showType":3},
        {"id":"48","name":"cd⑥号vip","category":1,"url":"https://vip.26db.cn/f/?url=", "showType":3},
        {"id":"49","name":"cd⑧号vip","category":1,"url":"https://vip.26db.cn/g/?url=", "showType":3},
        {"id":"50","name":"CC解析","category":1,"url":"https://thinkibm.now.sh/?url=", "showType":3},
        {"id":"51","name":"truechat365","category":1,"url":"https://chaxun.truechat365.com/?url=", "showType":3},
        {"id":"52","name":"lngyjj","category":1,"url":"http://lngyjj.cn/4/?url=", "showType":3},
        {"id":"53","name":"铭人云解析","category":1,"url":"https://parse.123mingren.com/?url=", "showType":3},
        {"id":"54","name":"铭人备用","category":1,"url":"https://parse.123mingren.com/Bei/?url=", "showType":3},
        {"id":"55","name":"七彩","category":1,"url":"https://jx.xymav.com/?url=", "showType":3},
        {"id":"56","name":"吾爱解析","category":1,"url":"https://jx.xymav.com/?url=", "showType":3},
        {"id":"57","name":"freeget","category":1,"url":"http://www.freeget.org/jx.php?url=", "showType":3},
        {"id":"58","name":"奥特曼解析","category":1,"url":"https://api.aoteman.tv/?url=", "showType":3},
        {"id":"59","name":"ivito","category":1,"url":"https://jx.ivito.cn/?url=", "showType":3},
        {"id":"60","name":"vipjx","category":1,"url":"https://vipjx.cc/?url=", "showType":3},
        {"id":"61","name":"k8aa","category":1,"url":"https://k8aa.com/jx/index.php?url=", "showType":3},
        {"id":"72","name":"70808","category":1,"url":"https://jx.70808.net/?url=", "showType":3},
        {"id":"73","name":"全面解析","category":1,"url":"https://api.quanminjiexi.com/?v=", "showType":3},
        {"id":"74","name":"弹幕版VIP","category":1,"url":"https://vip.parwix.com:4433/player/?url=", "showType":3},
        {"id":"75","name":"二千线路","category":1,"url":"https://jx.ergan.top/?url=", "showType":3},
        {"id":"76","name":"无广告解析","category":1,"url":"https://jx.iztyy.com/Bei/?url=", "showType":3},


        {"id":"62","name":"综合线路","category":2,"url":"https://laisoyiba.com/mov/s/?sv=3&url=", "showType":1},
        {"id":"63","name":"纯净/B站","category":2,"url":"https://z1.m1907.cn/?jx=", "showType":1},
        {"id":"64","name":"高速接口","category":2,"url":"https://jsap.attakids.com/?url=", "showType":1},
        {"id":"65","name":"综合/B站1","category":2,"url":"https://vip.parwix.com:4433/player/?url=", "showType":1},
        {"id":"66","name":"OK解析","category":2,"url":"https://okjx.cc/?url=", "showType":1},
        {"id":"67","name":"夜幕","category":2,"url":"https://www.yemu.xyz/?url=", "showType":1},
        {"id":"68","name":"虾米","category":2,"url":"https://jx.xmflv.com/?url=", "showType":1},
        {"id":"69","name":"全民","category":2,"url":"https://jx.quanmingjiexi.com/?url=", "showType":1},
];
    var author = config.scriptInfo.author;

    var commonFunction = {
        Toast:function(msg, duration = 3000){
            var m = document.createElement('div');
            m.innerHTML = msg;
            m.setAttribute('id','msg');
            m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;min-height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 9999999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
            document.body.appendChild(m);
            setTimeout(() => {
                var d = 0.5;
                m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
                m.style.opacity = '0';
                setTimeout(() => { document.body.removeChild(document.querySelector("#msg")) }, d * 1000);
            }, duration);
        },
        //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
        GMopenInTab:function(url, open_in_background) {
            if (typeof GM_openInTab === "function") {
                GM_openInTab(url, open_in_background);
            } else {
                GM.openInTab(url, open_in_background);
            }
        },

        //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
        GMgetValue:function(name, value) {
            if (typeof GM_getValue === "function") {
                return GM_getValue(name, value);
            } else {
                return GM.getValue(name, value);
            }
        },

        //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
        GMsetValue:function(name, value) {
            if (typeof GM_setValue === "function") {
                GM_setValue(name, value);
            } else {
                GM.setValue(name, value);
            }
        },

        //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
        GMxmlhttpRequest:function(obj) {
            if (typeof GM_xmlhttpRequest === "function") {
                GM_xmlhttpRequest(obj);
            } else {
                GM.xmlhttpRequest(obj);
            }
        },
        setItem:function(name, Value) {
            localStorage.setItem(name, Value);
        },
        getItem:function(name) {
            let StorageValue = localStorage.getItem(name);
            return StorageValue;
        },
        removeItem:function(name) {
            localStorage.removeItem(name);
        },
        GMaddStyle:function(data,id=null) {
            var addStyle = document.createElement('style');
            addStyle.textContent = data;
            addStyle.type = 'text/css';
            addStyle.id = id;
            var doc = document.head || document.documentElement;
            doc.appendChild(addStyle);
        },
        GMaddScript:function(data) {
            let script = document.createElement('script');
            script.src = data;
            var docu = document.head || document.documentElement;
            docu.appendChild(script);
        },
        GMaddlink:function(data) {
            let mylink = document.createElement('link');
            mylink.href = data;
            mylink.rel = 'stylesheet';
            var docl = document.head || document.documentElement;
            docl.appendChild(mylink);
        },
        GMopenInTab:function(url, open_in_background) {
            if (typeof GM_openInTab === "function") {
                GM_openInTab(url, open_in_background);
            } else {
                GM.openInTab(url, open_in_background);
            }
        },
        sleep:function(time) {
            return new Promise(resolve => setTimeout(resolve, time));
        },
        Commonsetinterval:function(data){
            var Count;
            var num ="";
            return new Promise(function(resolve, reject){
                Count = setInterval(function() {
                    var node = document.querySelector(data);
                    num++;
                    if(node != null ){
                        resolve(node);
                        clearInterval(Count);
                    }
                    if(num ==100){
                        clearInterval(Count);
                    }
                    console.log(node)
                },200);
            });
        },
        Videosetinterval:function(data){
            var Count;
            return new Promise(function(resolve, reject){
                Count = setInterval(function() {
                    var node = document.querySelector(data).children;
                    if(node != null ){
                        resolve(Count);
                        console.log(node)
                    }
                    console.log(node)
                },200);
            });
        },
       

     
        IsPC:function() {
            var userAgentInfo = config.UA;
            var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone", "iPad", "iPod"];
            var flag = true;
            for (let i = 0; i < Agents.length; i++) {
                if (userAgentInfo.indexOf(Agents[i]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        },
        IsWap:function(){
            var com = null;
            if(config.host.indexOf('item.') > -1) {
                com = "pc";
            }else if (config.host.indexOf('m.') > -1||config.playhref.indexOf('/m/') > -1||config.playhref.indexOf('/wap/') > -1) {
                com = "wap";
            }else {
                com = "pc";
            }
            return com
        },
        Getgoodid:function(data){
            var reg = new RegExp("(^|&)" + data + "=([^&]*)(&|$)");
            var s = window.location.search.substr(1).match(reg);
            if (s != null) {
                return s[2];
            }
            return "";
        },
        geturlid:function(url) {
            var id ="";
            if (url.indexOf("?") != -1) {
                url = url.split("?")[0]
            }
            if (url.indexOf("#") != -1) {
                url = url.split("#")[0]
            }
            var text = url.split("/");
            id = text[text.length - 1];
            id = id.replace(".html", "");
            return id
        },
        request:function(method,url,headers,data=null){
            return new Promise(function(resolve, reject){
                commonFunction.GMxmlhttpRequest({
                    url: url,
                    method: method,
                    data:data,
                    headers:headers,
                    onload: function(res) {
                        var status = res.status;
                        var responseText = res.responseText;
                        if(status==200||status=='200'){
                            resolve({"result":"success", "data":responseText});
                        }else{
                            reject({"result":"error", "data":null});
                        }
                    }
                });
            })
        },
        open:function(data){
            var main = document.createElement('div');
            var width = data.area[0];
            var height = data.area[1];
            var margintop = height/2;
            var marginleft = width/2;
            var style = "z-index: 999999998;width: "+width+"px;height:"+height+"px;position: fixed;top: 50%;left: 50%;margin-left:-"+marginleft+"px;margin-top:-"+margintop+"px;"
            var btnHTML = '<a class="zhihu-layer-btn0">'+data.btn[0]+'</a><a class="zhihu-layer-btn1">'+data.btn[1]+'</a>';
            main.innerHTML = '<div class="zhihu-layer-title" style="cursor: move;">'+data.title+'</div><div class="zhihu-layer-content" >'+data.content+'</div><span class="zhihu-layer-setwin"><a class="zhihu-layer-ico zhihu-layer-close1" href="javascript:;"></a></span><div class="zhihu-layer-btn zhihu-layer-btn-c">'+btnHTML+'</div>';
            main.setAttribute('id',data.id);
            main.setAttribute('style',style);
            main.setAttribute('class',"zhihu-layer-page");
            document.body.appendChild(main);
            var shade = document.createElement('div');
            shade.setAttribute('style',"z-index: 999999997;background-color: rgb(0, 0, 0);opacity: 0.3;");
            shade.setAttribute('class',"zhihu-layer-shade");
            shade.setAttribute('id',"zhihu-layer-shade");
            shade.innerHTML =''
            document.body.appendChild(shade);
            var css = `
             ::-webkit-scrollbar {
                height: 6px;
                width: 6px;
             }
             ::-webkit-scrollbar-track {
                background: transparent;
                width: 6px;
             }
             ::-webkit-scrollbar-thumb {
                background-color: #54be99;
                border-radius: 4px;
                -webkit-transition: all 1s;
                transition: all 1s;
                width: 6px;
             }
             ::-webkit-scrollbar-corner {
                background-color: #54be99;
             }
             li {
               list-style: none;
             }
             .zhihu-form-label, .zhihu-form-select, .zhihu-input-block, .zhihu-input-inline{
               position: relative;
             }
             .zhihu-layer-shade {
               top: 0;
               left: 0;
               width: 100%;
               height: 100%;
               position: fixed;
               _height: expression(document.body.offsetHeight+"px");
             }
             .zhihu-layer-page{
                   margin: 0;
                   padding: 0;
                   background-color: #fff;
                   border-radius: 10px;
                   box-shadow: 1px 1px 50px rgba(0,0,0,.4);
                   font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;
             }
             .zhihu-layer-title{
                   padding: 0 80px 0 20px;
                   height: 50px;
                   line-height: 50px;
                   border-bottom: 1px solid #F0F0F0;
                   border-radius: 2px 2px 0 0;
                   font-size: 14px;
                   color: #333;
                   overflow: visible;
                   text-overflow: ellipsis;
                   white-space: nowrap;
                   font-weight: bold;
             }
             .zhihu-layer-setwin {
                   position: absolute;
                   right: 15px;
                   top: 17px;
                   font-size: 0;
                   line-height: initial;
              }
              .zhihu-layer-setwin .zhihu-layer-close1 {
                   background-position: 1px -40px;
                   cursor: pointer;
              }
              .zhihu-layer-setwin a {
                   position: relative;
                   width: 16px;
                   height: 16px;
                   margin-left: 10px;
                   font-size: 12px;
                   _overflow: hidden;
              }
             .zhihu-layer-btn a, .zhihu-layer-setwin a {
                   display: inline-block;
                   vertical-align: top;
              }
              .zhihu-layer-ico {
                   background: url(https://www.layuicdn.com/layui/css/modules/layer/default/icon.png) no-repeat;
              }
              .zhihu-layer-btn {
                   text-align: right;
                   padding: 10px 15px 12px;
                   pointer-events: auto;
                   user-select: none;
                   -webkit-user-select: none;
              }
              .zhihu-layer-btn-c {
                   text-align: center;
              }
              .zhihu-layer-btn a {
                   height: 28px;
                   line-height: 28px;
                   margin: 5px 5px 0;
                   padding: 0 15px;
                   border: 1px solid #dedede;
                   background-color: #fff;
                   color: #333;
                   border-radius: 4px;
                   font-weight: 400;
                   cursor: pointer;
                   text-decoration: none;
               }
               .zhihu-layer-btn1 {
                   border-color: #54be99!important;
                   background-color: #54be99!important;
                   color: #fff!important;
               }
               .zhihu-form-item {
                   margin-bottom: 5px;
                   clear: both;
               }
               .zhihu-form-label {
                   float: left;
                   display: block;
                   padding: 9px 15px;
                   width: 80px;
                   font-weight: 400;
                   line-height: 20px;
                   text-align: right;
                   box-sizing: content-box;
                }
                .zhihu-input-inline {
                   display: inline-block;
                   vertical-align: middle;
                   width: 190px;
                   margin-right: 10px;
                }
                .zhihu-input, .zhihu-select, .zhihu-textarea {
                   height: 38px;
                   line-height: 1.3;
                   border-width: 1px;
                   border-style: solid;
                   border-color: #eee;
                   display: block;
                   width: 100%;
                   padding-left: 10px;
                   background-color: #fff;
                   color: rgba(0,0,0,.85);
                   border-radius: 2px;
                   outline: 0;
                   -webkit-appearance: none;
                   transition: all .3s;
                   -webkit-transition: all .3s;
                   box-sizing: border-box;
                }
                .zhihu-input-block {
                   min-height: auto;
                   margin-left: 110px;
                }
                .zhihu-input-block p {
                   font-size: 12px;
                   line-height: 22px;
                }
                .zhihu-form {
                   display: flex;
                   margin-top: 20px;
                }

            `;
            commonFunction.GMaddStyle(css,"open");
            // await commonFunction.sleep(1000);
            //获取表单对象
            var zhihuform = document.querySelector('.zhihu-form');
            //保存按钮点击事件
            document.querySelector('.zhihu-layer-btn1').addEventListener('click',function() {
                data.btn1(zhihuform);
                document.body.removeChild(document.querySelector(".zhihu-layer-page"));
                document.body.removeChild(document.querySelector("#zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("open"));
            })
            //取消钮点击事件
            document.querySelector(".zhihu-layer-btn0").addEventListener('click',function() {
                document.body.removeChild(document.querySelector(".zhihu-layer-page"));
                document.body.removeChild(document.querySelector("#zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("open"));
            })
            //关闭钮点击事件
            document.querySelector(".zhihu-layer-close1").addEventListener('click',function() {
                document.body.removeChild(document.querySelector(".zhihu-layer-page"));
                document.body.removeChild(document.querySelector("#zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("open"));
            })
        },
        tab:async function(data){
            var main = document.createElement('div');
            var width = data.area[0];
            var height = data.area[1];
            var margintop = height/2;
            var marginleft = width/2;
            var style = "z-index: 999999998;width: "+width+"px;height:"+height+"px;position: fixed;top: 50%;left: 50%;margin-left:-"+marginleft+"px;margin-top:-"+margintop+"px;"
            var titleHTML ="";
            var contentHTML = "";
            var btnHTML = '<a class="zhihu-layer-btn0">'+data.btn[0]+'</a><a class="zhihu-layer-btn1">'+data.btn[1]+'</a>'
            for (let i = 0; i < data.tab.length; i++) {
                if(i === 0 ){
                    titleHTML +='<span class="tab-title zhihu-this">'+data.tab[i].title+'</span>';
                    contentHTML += '<li class="zhihu-layer-tabli zhihu-this">'+data.tab[i].content+'</li>';
                }else{
                    titleHTML +='<span class="tab-title">'+data.tab[i].title+'</span>';
                    contentHTML += '<li class="zhihu-layer-tabli ">'+data.tab[i].content+'</li>';
                }
            }
            main.innerHTML = '<div class="zhihu-layer-title" style="cursor: move;">'+titleHTML+'</div><div class="zhihu-layer-content" ><ul class="zhihu-layer-tabmain">'+contentHTML+'</ul></div><span class="zhihu-layer-setwin"><a class="zhihu-layer-ico zhihu-layer-close1" href="javascript:;"></a></span><div class="zhihu-layer-btn zhihu-layer-btn-c">'+btnHTML+'</div>';
            main.setAttribute('id',data.id);
            main.setAttribute('style',style);
            main.setAttribute('class',"zhihu-layer-tab");
            document.body.appendChild(main);
            var tabtitle = document.getElementsByClassName('tab-title');
            for (let i = 0; i < tabtitle.length; i++) {
                let tabli = document.getElementsByClassName('zhihu-layer-tabli')[i];
                tabtitle[i].addEventListener('click',function() {
                    document.querySelector(".zhihu-layer-title>.zhihu-this").classList.remove("zhihu-this");
                    this.classList.add("zhihu-this");
                    document.querySelector(".zhihu-layer-tabmain>.zhihu-this").classList.remove("zhihu-this");
                    tabli.classList.add("zhihu-this");
                });

            }
            var shade = document.createElement('div');
            shade.setAttribute('style',"z-index: 999999997;background-color: rgb(0, 0, 0);opacity: 0.3;");
            shade.setAttribute('class',"zhihu-layer-shade");
            shade.setAttribute('id',"");
            shade.innerHTML =''
            document.body.appendChild(shade);
            var css = `
             ::-webkit-scrollbar {
                height: 6px;
                width: 6px;
             }
             ::-webkit-scrollbar-track {
                background: transparent;
                width: 6px;
             }
             ::-webkit-scrollbar-thumb {
                background-color: #54be99;
                border-radius: 4px;
                -webkit-transition: all 1s;
                transition: all 1s;
                width: 6px;
             }
             ::-webkit-scrollbar-corner {
                background-color: #54be99;
             }
             li {
               list-style: none;
             }
             .zhihu-form-label, .zhihu-form-select, .zhihu-input-block, .zhihu-input-inline{
               position: relative;
             }
             .zhihu-layer-shade {
               top: 0;
               left: 0;
               width: 100%;
               height: 100%;
               position: fixed;
               _height: expression(document.body.offsetHeight+"px");
             }
             .zhihu-layer-tab{
                   margin: 0;
                   padding: 0;
                   background-color: #fff;
                   border-radius: 10px;
                   box-shadow: 1px 1px 50px rgba(0,0,0,.4);
                   font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;
             }
             .zhihu-layer-title{
                   padding: 0 80px 0 20px;
                   height: 50px;
                   line-height: 50px;
                   border-bottom: 1px solid #F0F0F0;
                   border-radius: 2px 2px 0 0;
                   font-size: 14px;
                   color: #333;
                   padding-left: 0;
                   overflow: visible;
                   text-overflow: ellipsis;
                   white-space: nowrap;
             }
             .zhihu-layer-title span {
                   position: relative;
                   float: left;
                    min-width: 80px;
                   max-width: 300px;
                   padding: 0 20px;
                   text-align: center;
                   overflow: hidden;
                   cursor: pointer;
                   font-weight: bold;
                   color: #000;
              }
              .zhihu-layer-title span:first-child {
                   border-left: none;
              }
              .zhihu-layer-title span.zhihu-this {
                   height: 51px;
                   border-left: 1px solid #eee;
                   border-right: 1px solid #eee;
                   background-color: #fff;
                   z-index: 10;
              }
              .zhihu-layer-title span:first-child.zhihu-this {
                    border-radius: 10px 0 0 0;
              }
              .zhihu-layer-content {
                   position: relative;
                   overflow: hidden;
                   height:290px;
              }
              .zhihu-layer-tabmain {
                   line-height: 24px;
                   clear: both;
                   padding: 0;
                   margin: 0;
              }
              .zhihu-layer-tabli{
                   display:none;
                   height: 100%;
              }
              .zhihu-layer-tabmain .zhihu-this{
                   display:block;
              }
              .zhihu-layer-setwin {
                   position: absolute;
                   right: 15px;
                   top: 17px;
                   font-size: 0;
                   line-height: initial;
              }
              .zhihu-layer-setwin .zhihu-layer-close1 {
                   background-position: 1px -40px;
                   cursor: pointer;
              }
              .zhihu-layer-setwin a {
                   position: relative;
                   width: 16px;
                   height: 16px;
                   margin-left: 10px;
                   font-size: 12px;
                   _overflow: hidden;
              }
             .zhihu-layer-btn a, .zhihu-layer-setwin a {
                   display: inline-block;
                   vertical-align: top;
              }
              .zhihu-layer-ico {
                   background: url(https://www.layuicdn.com/layui/css/modules/layer/default/icon.png) no-repeat;
              }
              .zhihu-layer-btn {
                   text-align: right;
                   padding: 10px 15px 12px;
                   pointer-events: auto;
                   user-select: none;
                   -webkit-user-select: none;
              }
              .zhihu-layer-btn-c {
                   text-align: center;
              }
              .zhihu-layer-btn a {
                   height: 28px;
                   line-height: 28px;
                   margin: 5px 5px 0;
                   padding: 0 15px;
                   border: 1px solid #dedede;
                   background-color: #fff;
                   color: #333;
                   border-radius: 4px;
                   font-weight: 400;
                   cursor: pointer;
                   text-decoration: none;
               }
               .zhihu-layer-btn1 {
                   border-color: #54be99!important;
                   background-color: #54be99!important;
                   color: #fff!important;
               }

               .zhihu-form-item {
                   margin-bottom: 15px;
                   clear: both;
               }
               .zhihu-form-label {
                   float: left;
                   display: block;
                   padding: 9px 15px;
                   width: 80px;
                   font-weight: 400;
                   line-height: 20px;
                   text-align: right;
               }
               .zhihu-input-block {
                   margin-left: 110px;
                   min-height: 36px;
                   width: 190px;
               }
               .zhihu-form input[type=checkbox], .zhihu-form input[type=radio], .zhihu-form select {
                   display: none;
               }
               .zhihu-form-switch {
                   position: relative;
                   height: 22px;
                   line-height: 22px;
                   min-width: 35px;
                   padding: 0 5px;
                   margin-top: 8px;
                   border: 1px solid #d2d2d2;
                   border-radius: 20px;
                   cursor: pointer;
                   background-color: #fff;
                   -webkit-transition: .1s linear;
                   transition: .1s linear;
               }
               .zhihu-form-checkbox, .zhihu-form-checkbox *, .zhihu-form-switch {
                   display: inline-block;
                   vertical-align: middle;
               }
               .zhihu-unselect {
                   -moz-user-select: none;
                   -webkit-user-select: none;
                   -ms-user-select: none;
               }
               .zhihu-form-switch em {
                   position: relative;
                   top: 0;
                   width: 25px;
                   margin-left: 21px;
                   padding: 0!important;
                   text-align: center!important;
                   color: #999!important;
                   font-style: normal!important;
                   font-size: 12px;
               }
               .zhihu-form-switch i {
                   position: absolute;
                   left: 5px;
                   top: 3px;
                   width: 16px;
                   height: 16px;
                   border-radius: 20px;
                   background-color: #d2d2d2;
                   -webkit-transition: .1s linear;
                   transition: .1s linear;
               }
               .zhihu-form-onswitch {
                   border-color: #54be99;
                   background-color: #54be99;
               }
               .zhihu-form-onswitch em {
                   margin-left: 5px;
                   margin-right: 21px;
                   color: #fff!important;
               }
               .zhihu-form-onswitch i {
                   left: 100%;
                   margin-left: -21px;
                   background-color: #fff;
               }
               .zhihu-form-select .zhihu-input {
                   padding-right: 30px;
                   cursor: pointer;
               }
               .zhihu-input, .zhihu-textarea {
                   display: block;
                   width: 100%;
                   padding-left: 10px;
               }
               .zhihu-input, .zhihu-select, .zhihu-textarea {
                   height: 38px;
                   line-height: 1.3;
                   border-width: 1px;
                   border-style: solid;
                   background-color: #fff;
                   color: rgba(0,0,0,.85);
                   border-radius: 2px;
               }
               .zhihu-btn, .zhihu-input, .zhihu-select, .zhihu-textarea, .zhihu-upload-button {
                   outline: 0;
                   -webkit-appearance: none;
                   transition: all .3s;
                   -webkit-transition: all .3s;
                   box-sizing: border-box;
                   border-color: #eee;
               }
               .zhihu-form-select .zhihu-edge {
                   position: absolute;
                   right: 10px;
                   top: 50%;
                   margin-top: -3px;
                   cursor: pointer;
                   border-width: 6px;
                   border-top-color: #c2c2c2;
                   border-top-style: solid;
                   transition: all .3s;
                   -webkit-transition: all .3s;
               }
               .zhihu-edge {
                   width: 0;
                   border-width: 6px;
                   border-style: dashed;
                   border-color: transparent;
               }
               .zhihu-edge {
                   display: inline-block;
               }
               .zhihu-form-selected .zhihu-edge {
                   margin-top: -9px;
                   -webkit-transform: rotate(180deg);
                   transform: rotate(180deg);
               }
               .zhihu-anim {
                   -webkit-animation-duration: .3s;
                   -webkit-animation-fill-mode: both;
                   animation-duration: .3s;
                   animation-fill-mode: both;
               }
               .zhihu-form-select dl, .zhihu-panel {
                   box-shadow: 1px 1px 4px rgb(0 0 0 / 8%);
               }
               .zhihu-form-select dl {
                   display: none;
                   position: absolute;
                   left: 0;
                   top: 42px;
                   padding: 5px 0;
                   z-index: 899;
                   min-width: 100%;
                   border: 1px solid #eee;
                   max-height: 300px;
                   overflow-y: auto;
                   background-color: #fff;
                   border-radius: 2px;
                   box-sizing: border-box;
                   margin: 0;
               }
               .zhihu-form-selected dl {
                   display: block;
               }
               .zhihu-form-select dl dd, .zhihu-form-select dl dt {
                   padding: 0 10px;
                   line-height: 36px;
                   white-space: nowrap;
                   overflow: hidden;
                   text-overflow: ellipsis;
                   margin: 0;
               }
               .zhihu-form-select dl dd {
                   cursor: pointer;
               }
               .zhihu-form-select dl dd.zhihu-select-tips {
                   padding-left: 10px!important;
                   color: #999;
               }
               .zhihu-form-select dl dd.zhihu-this {
                   background-color: #5FB878;
                   color: #fff;
               }
         `;
            commonFunction.GMaddStyle(css,"tab");
            await commonFunction.sleep(1000);
            //获取表单对象
            var zhihuform = document.querySelector('.zhihu-form');
            //保存按钮点击事件
            document.querySelector('.zhihu-layer-btn1').addEventListener('click',function() {
                data.btn1(zhihuform);
                document.body.removeChild(document.querySelector(".zhihu-layer-tab"));
                document.body.removeChild(document.querySelector(".zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("tab"));
            })
            //取消钮点击事件
            document.querySelector(".zhihu-layer-btn0").addEventListener('click',function() {
                document.body.removeChild(document.querySelector(".zhihu-layer-tab"));
                document.body.removeChild(document.querySelector(".zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("tab"));
            })
            //关闭钮点击事件
            document.querySelector(".zhihu-layer-close1").addEventListener('click',function() {
                document.body.removeChild(document.querySelector(".zhihu-layer-tab"));
                document.body.removeChild(document.querySelector(".zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("tab"));
            })
            //开关添加开始
            var zhihuinput = zhihuform.getElementsByClassName('checkbox');
            for (let i = 0; i < zhihuinput.length; i++) {
                let name = zhihuinput[i].getAttribute("name");
                if(name =="switch"){
                    if(zhihuinput[i].checked){
                        zhihuinput[i].insertAdjacentHTML('afterEnd', '<div class="zhihu-unselect zhihu-form-switch zhihu-form-onswitch"><em>ON</em><i></i></div>');
                    }else{
                        zhihuinput[i].insertAdjacentHTML('afterEnd', '<div class="zhihu-unselect zhihu-form-switch "><em>OFF</em><i></i></div>');
                    }
                }
            }
            //开关添加结束
            //开关点击事件开始
            var zhihuswitch = document.getElementsByClassName('zhihu-form-switch');
            for (let i = 0; i < zhihuinput.length; i++) {
                zhihuswitch[i].addEventListener('click',function() {
                    let onswitch = this.getAttribute("class");
                    if(onswitch.indexOf("zhihu-form-onswitch")!=-1){
                        this.parentNode.querySelector('input').removeAttribute("checked");
                        this.classList.remove("zhihu-form-onswitch");
                        this.innerHTML ="<em>OFF</em><i></i>"
                    }else{
                        this.parentNode.querySelector('input').setAttribute("checked",true);
                        this.classList.add("zhihu-form-onswitch");
                        this.innerHTML ="<em>ON</em><i></i>"
                    }

                })
            }
            //开关点击事件结束
            //下拉框添加开始
            var zhihuselect = zhihuform.getElementsByTagName('select');
            for (let i = 0; i < zhihuselect.length; i++) {
                let optionHtml ='';
                let zhihuoption = zhihuselect[i].getElementsByTagName('option');
                if(zhihuselect[i].selectedIndex < 0){
                    var Index = 0
                    }else{
                        Index = zhihuselect[i].selectedIndex;
                    }
                let selecttext = zhihuselect[i].options[Index].text;
                var selectvalue = zhihuselect[i].options[Index].value;
                for (let l = 0; l < zhihuoption.length; l++) {
                    let optionText = zhihuoption[l].innerText;
                    let optionvalue = zhihuoption[l].value;
                    if(optionvalue == selectvalue){
                        optionHtml += '<dd zhihu-value="'+optionvalue+'"  class="zhihu-select-tips zhihu-this">'+optionText+'</dd>'
                    }else{
                        optionHtml += '<dd zhihu-value="'+optionvalue+'" class="">'+optionText+'</dd>'
                    }
                }
                var selectHtml = '<div class="zhihu-unselect zhihu-form-select"><div class="zhihu-select-title"><input type="text" placeholder="直接选择或搜索选择" value="'+selecttext+'" readonly="" class="zhihu-input zhihu-unselect"><i class="zhihu-edge"></i></div><dl class="zhihu-anim" style="">'+optionHtml+'</dl></div>';
                zhihuselect[i].insertAdjacentHTML('afterEnd',selectHtml);
            }
            //下拉框添加结束
            //下拉框操作事件开始
            var zhihuunselect = document.getElementsByClassName("zhihu-form-select");
            for (let i = 0; i < zhihuunselect.length; i++) {
                //下拉框点击事件
                zhihuunselect[i].addEventListener('click',function() {
                    var selected = this.getAttribute("class");
                    if(selected.indexOf("zhihu-form-selected")!=-1){
                        this.classList.remove("zhihu-form-selected");
                    }else{
                        this.classList.add("zhihu-form-selected");
                    };
                },false);
                //下拉框选择事件
                var zhihudd = zhihuunselect[i].getElementsByTagName('dd');
                for (let l = 0; l < zhihudd.length; l++) {
                    zhihudd[l].addEventListener('click',function() {
                        var a = zhihuunselect[i].querySelector('.zhihu-this');
                        if(a){
                            a.classList.remove("zhihu-this");
                            a.classList.remove("zhihu-select-tips");
                        }
                        this.classList.add("zhihu-this");
                        this.classList.add("zhihu-select-tips");
                        console.log(this.getAttribute("zhihu-value"));
                        console.log(zhihuunselect[i].parentNode.querySelector('select'))
                        zhihuunselect[i].parentNode.querySelector('select').value = this.getAttribute("zhihu-value");
                        zhihuunselect[i].parentNode.querySelector('input').setAttribute("value",this.innerText);
                    });
                };
            }
            //下拉框操作事件结束
        },
    }
    //--------------------------------------------------------------
    var ControllerVideo = {
        //播放节点
        Playid:function(){
            var PlayidList = [
                { url:"v.qq.com", node:"#mod_player"},
                { url:"www.iqiyi.com", node:"#flashbox"},
                { url:"v.youku.com", node:"#player"},
                { url:"w.mgtv.com", node:"#mgtv-player-wrap"},
                { url:"www.mgtv.com", node:"#mgtv-player-wrap"},
                { url:"tv.sohu.com", node:"#player"},
                { url:"film.sohu.com", node:"#playerWrap"},
                { url:"www.le.com", node:"#le_playbox"},
                { url:"v.pptv.com", node:"#pptv_playpage_box"},
                { url:"vip.pptv.com", node:".w-video"},
                { url:"www.wasu.cn", node:"#flashContent"},
                { url:"www.bilibili.com", node:"#player_module"},
                { url:"vip.1905.com", node:"#player"},
                { url:"m.v.qq.com", node:"#player"},
                { url:"m.youku.com", node:"#player"},
                { url:"m.iqiyi.com", node:".m-video-player-wrap"},
                { url:"m.mgtv.com", node:".video-area"},
                { url:"m.bilibili.com", node:"#bofqi"},
                { url:"m.le.com", node:"#j-player"},
                { url:"m.tv.sohu.com", node:".player"},
                { url:"m.pptv.com", node:".pp-details-video"},
            ];
            var Playid = null;
            for(let i in PlayidList) { //获得窗口ID
                if (PlayidList[i].url == config.host) {
                    if(config.playhref.indexOf("www.wasu.cn/wap/Play")!=-1){
                        Playid ="#pop"
                    }else if(PlayidList[i].url == "v.qq.com"){
                        var player = document.querySelector(".player_side_bd");
                        console.log(player)
                        if(player!=null){
                            Playid = "#mod_player";
                        }else{
                            Playid = "#player-container"
                        }
                    }else{
                        Playid = PlayidList[i].node;
                    }
                    return Playid
                    break;
                }
            }
            if(!Playid){
                return;
            }

        },
        //----------------------------------------------------------------------
        //接口列表
        Videolist:function(f){
            var ListHtml={
                "Insidehtml":"",
                "selecthtml":"",
                "mobhtml":"",
                "Outsidehtml":"",
            };
            //-----------------------------
            let v = commonFunction.GMgetValue("userplayurl");
            //  GM_deleteValue("userplayurl");
            if(v){
                var e = v.concat(f);
            }else{
                e = f;
            }

            console.log(f)
            console.log(e)
            for (let i = 0; i < e.length; i++) {
                if (e[i].category == 1) {
                    ListHtml.Insidehtml += "<span  class='jiexi inside' id='Inside_" + i + "'  title='" + e[i].name + "' data-index='" + i + "' data-url='" + e[i].url + "'>" + e[i].name + "</span>";
                    ListHtml.selecthtml += "<option value='" +i + "' name='select' data-url='" + e[i].url + "'>" + e[i].name + "</option>"
                    if (e[i].showType == 3) {
                        ListHtml.mobhtml += "<span  class='mob-jiexi' id='mob_" + i + "'  title='" + e[i].name + "' data-index='" + i + "' data-url='" + e[i].url + "'>" + e[i].name + "</span>";
                    }
                } else {
                    ListHtml.Outsidehtml += "<span  class='jiexi outside 'title='" + e[i].name + "' data-index='" + i + "' data-url='" + e[i].url + "'>" + e[i].name + "</span>";
                }

            }
            //-----------------------------
            return ListHtml
        },
        //增加接口列表
        Videoaddlist:function(){
            var addListHtml="";
            //-----------------------------
            let e = commonFunction.GMgetValue("userplayurl");
            console.log(e);
            if(e != null&&e != ""&&e != undefined){
                for (let i = 0; i < e.length; i++) {
                    if(e[i].category == 1){
                        addListHtml += '<li><span>'+e[i].name+'</span><span>内部播放</span><span class="urllist">'+e[i].url+'</span><span class="delurl" data-id='+i+'>删除</span></li>';
                    }else if(e[i].category == 2){
                        addListHtml += '<li><span>'+e[i].name+'</span><span>跳转播放</span><span class="urllist">'+e[i].url+'</span><span class="delurl" data-id='+i+'>删除</span></li>';
                    }else{
                        continue;
                    }
                }
            }else{
                addListHtml = '<p style="text-align: center;margin: 20px 0;">暂无数据</p>'
            }
            //-----------------------------
            return addListHtml
        },
        //----------------------------------------------------------------------
        //电脑端
        addbtn:async function(){
            await commonFunction.sleep(1000);
            var css = `body, html {
		        font: 14px/1.5 "PingFang SC","微软雅黑","Microsoft YaHei",Helvetica,"Helvetica Neue",Tahoma,Arial,sans-serif;
		        color: #1c1f21;
		        height: 100%;
		    }
			.elevator {
				position: fixed;
				    padding: 0 16px;
				    top: 55%;
				    margin-top: -140px;
				    left: 0;
				    z-index: 999999996;
				    background: rgb(134 134 134 / 40%);
                    box-shadow: 1px 1px 8px 1px rgb(98 99 99 / 34%);
				    border-radius: 0 8px 8px 0;
			}

			.elevator a {
				position: relative;
				display: block;
				width: 26px;
				height: 56px;
				font-size: 22px;
				line-height: 20px;
				color: #b5b9bc;
				box-sizing: border-box;
				text-align: center;
			}

			.elevator a+a:after {
				position: absolute;
				top: 0;
				left: 50%;
				margin-left: -12px;
				content: '';
				width: 24px;
				border: 1px solid #F3F5F7;
			}

			.elevator a:hover {
				color: #14191e;
			}

			.elevator svg {
				font-size: 24px;
				line-height: 56px;
				color: #199b6d;
				width: 28px;
				height: 28px;
				margin: 14px 0;
			}

			.elevator svg:hover {
				color: #14191e;
			}

			.elevator a span {
				display: none;
				padding: 14px 0;
				font-size: 10px;
				color: #fff;
				line-height: 14px;
			}

			.elevator a:hover svg
			{
				display: none;
			}

			.elevator a:hover span
            {
				display: inline-block;
			}
			.jiexi{
				padding: 8px 10px;
				background: #e5e5e5a3;
				font-size: 10px;
				border-radius: 4px;
				margin:0 8px 10px 8px;
			    color: #505050;
				display: inline-block;
				width: 80px;
				text-align: center;
			}
			.jiexiselect{
				color: #fff;
				background:#54be99;
			}
            .zhihu-scan{
               width:144px;
			   display:inline-block;
			   text-align: center;
               margin-left:8px;
            }
			.zhihu-scan img{
				width: 140px;
				margin: 0 5px 10px 5px;
			}
			.zhihu-scan h1{
				font-size: 10px;
				font-weight: bold;
				margin: 0px 0 20px 0;
			}
			.zhihu-scan p{
			  margin: 0;
			  color: #666;
			  font-size: 10px;
              line-height: 26px;
			}
            .addlist{
              margin: 10px 0 0 0;
              padding: 0;
            }
            .addlist li{
              font-size: 10px;
              color: #333;
              line-height:36px;
              height: 36px;
            }
            .addlist li span{
              width: 60px;
              display: inline-block;
              text-align: center;
              overflow: hidden;
              font-size: 10px;
              color: #333;
              white-space:nowrap;
              text-overflow:ellipsis;
            }
            .addlist li .urllist{
              width: 180px;
            }
			::-webkit-input-placeholder{color:#999;font-size:10px;line-height:16px}
			:-moz-placeholder{color:#999;font-size:10px;line-height:16px}
			::-moz-placeholder{color:#999;font-size:10px;line-height:16px}
			:-ms-input-placeholder{color:#999;font-size:10px;line-height:16px}
            `;
            commonFunction.GMaddStyle(css);
            var jiexitime = commonFunction.getItem('jiexitime') != null ? commonFunction.getItem('jiexitime'): 3;
            ControllerVideo.CheckAutoplay(jiexitime);
            var btnhtml = '<div class="elevator" id=""><a href="javascript:;" class="elevator-msg" id="PlayMain"><svg t="1651763850342" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2320" width="200" height="200"><path d="M661.333333 665.6l51.2 12.8 42.666667-72.533333-34.133333-38.4c4.266667-21.333333 4.266667-38.4 4.266666-55.466667s0-34.133333-4.266666-51.2l34.133333-38.4-42.666667-72.533333-51.2 12.8c-25.6-21.333333-55.466667-42.666667-89.6-51.2L554.666667 256h-85.333334l-17.066666 51.2c-34.133333 8.533333-64 25.6-89.6 51.2l-51.2-12.8-42.666667 72.533333 34.133333 38.4c-4.266667 21.333333-4.266667 38.4-4.266666 55.466667s0 34.133333 4.266666 51.2l-34.133333 38.4 42.666667 72.533333 51.2-12.8c25.6 21.333333 55.466667 42.666667 89.6 51.2L469.333333 768h85.333334l17.066666-51.2c34.133333-8.533333 64-25.6 89.6-51.2z m38.4 81.066667c-21.333333 17.066667-51.2 34.133333-76.8 42.666666L597.333333 853.333333h-170.666666l-25.6-64c-29.866667-12.8-55.466667-25.6-76.8-42.666666l-68.266667 12.8-85.333333-149.333334 42.666666-51.2V512c0-17.066667 0-29.866667 4.266667-42.666667l-42.666667-51.2 85.333334-149.333333 68.266666 12.8c21.333333-17.066667 51.2-34.133333 76.8-42.666667L426.666667 170.666667h170.666666l25.6 64c29.866667 12.8 55.466667 25.6 76.8 42.666666l68.266667-12.8 85.333333 149.333334-42.666666 51.2c4.266667 12.8 4.266667 29.866667 4.266666 42.666666s0 29.866667-4.266666 42.666667l42.666666 51.2-85.333333 149.333333-68.266667-4.266666zM512 554.666667c25.6 0 42.666667-17.066667 42.666667-42.666667s-17.066667-42.666667-42.666667-42.666667-42.666667 17.066667-42.666667 42.666667 17.066667 42.666667 42.666667 42.666667z m0 85.333333c-72.533333 0-128-55.466667-128-128s55.466667-128 128-128 128 55.466667 128 128-55.466667 128-128 128z" fill="#ffffff" p-id="2321"></path></svg><span class="">解析设置</span></a><a href="javascript:;" id="addjiexi" class="elevator-faq" ><svg t="1656638904518" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7918" width="200" height="200"><path d="M469.333333 469.333333V341.333333h85.333334v128h128v85.333334h-128v128h-85.333334v-128H341.333333v-85.333334h128z m42.666667 384c-187.733333 0-341.333333-153.6-341.333333-341.333333s153.6-341.333333 341.333333-341.333333 341.333333 153.6 341.333333 341.333333-153.6 341.333333-341.333333 341.333333z m0-85.333333c140.8 0 256-115.2 256-256s-115.2-256-256-256-256 115.2-256 256 115.2 256 256 256z" fill="#ffffff" p-id="7919"></path></svg><span class="">添加接口</span></a><a href="javascript:;" id="playing" class="elevator-faq" ><svg t="1651762741797" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1235" width="200" height="200"><path d="M512 853.333333c-187.733333 0-341.333333-153.6-341.333333-341.333333s153.6-341.333333 341.333333-341.333333 341.333333 153.6 341.333333 341.333333-153.6 341.333333-341.333333 341.333333z m0-85.333333c140.8 0 256-115.2 256-256s-115.2-256-256-256-256 115.2-256 256 115.2 256 256 256z m128-256l-213.333333 128V384l213.333333 128z" fill="#ffffff" p-id="1236"></path></svg><span class="">解析播放</span></a></div>';
            document.body.insertAdjacentHTML('afterbegin', btnhtml);
            commonFunction.removeItem('selectid');
            document.querySelector('#playing').onclick = function() {
                ControllerVideo.autoplay(jiexitime);
                commonFunction.Toast(jiexitime+'秒后自动解析视频',jiexitime*1000);
            };
            //弹窗开始-------------------------------------------------
            document.querySelector('#PlayMain').addEventListener('click',function() {
                console.log("点击成功");
                var ListHtml = ControllerVideo.Videolist(playList);
                //   console.log(ListHtml);
                var jiexi = commonFunction.getItem('AutoPlay') == 1 ? "checked": "";
                commonFunction.tab({
                    area: ['450', '400'],
                    id: "",
                    btn: ['取消', '保存设置'],
                    btnAlign: 'c',
                    tab: [{
                        title: '内嵌播放',
                        content: '<div style="margin:10px 10px 10px 30px;display:flex"><div style="width:356px;display:inline-block;margin-left: -8px;height: 280px;overflow-y: scroll;" id="jiexilist">' +ListHtml.Insidehtml + '</div></div>'
                    },
                          {
                              title: '跳转播放',
                              content: '<div style="margin:10px 30px 0 30px;display:flex"><div style="width:356px;display:inline-block;margin-left: -8px;height: 280px;overflow-y: scroll;" id="jiexilist">' + ListHtml.Outsidehtml + '</div></div>'
                          },
                          {
                              title: '解析设置',
                              content: '<div style="margin:10px 30px 0 30px;display:flex"><div style="width:356px;display:inline-block;padding-right: 15px;height: 280px;overflow-y: scroll;" id="jiexilist"><form class="zhihu-form" ><div class="zhihu-form-item"><label class="zhihu-form-label">解析接口</label><div class="zhihu-input-block"><select name="selectjiexi" lay-verify="required"  id ="selectjiexi"><option value="">直接选择或搜索选择</option>' + ListHtml.selecthtml + '</select></div></div><div class="zhihu-form-item"><label class="zhihu-form-label">延迟时间</label><div class="zhihu-input-block"><input type="number" placeholder="'+jiexitime+'" name="jiexitime" class="zhihu-input" style="display: inline-block;width: 100px;padding: 2px;margin-right: 10px;text-align: center;"><span style="font-size: 14px;color: #333;">秒</span></div></div><div class="zhihu-form-item"><label class="zhihu-form-label">自动解析</label><div class="zhihu-input-block"><input class="checkbox" type="checkbox" ' + jiexi + ' name="switch"  id="autoplay" ></div></div></form></div></div>'
                          }],
                    btn1: function(data) {
                        var s = data.getElementsByTagName('select');
                        for(let i= 0; i < s.length; i++ ){
                            let Index = s[i].selectedIndex;
                            let selectedid = s[i].options[Index].value;
                            let selecturl = s[i].options[Index].getAttribute("data-url");
                            commonFunction.setItem('selectedid', selectedid);
                            commonFunction.setItem('selecturl', selecturl);

                        }
                        var n = data.getElementsByTagName('input');
                        var time =jiexitime
                        for(let i= 0; i <n.length; i++ ){
                            if(n[i].getAttribute("name") == "switch"){
                                let onswitch = document.querySelector("#autoplay+div").getAttribute("class");
                                if (onswitch.indexOf("zhihu-form-onswitch") != -1) {
                                    commonFunction.setItem('AutoPlay', '1');
                                    ControllerVideo.autoplay(time);
                                    commonFunction.Toast(time+'秒后自动解析视频',time*1000);
                                } else {
                                    commonFunction.setItem('AutoPlay', '0');
                                }
                            }else if(n[i].getAttribute("name") == "jiexitime"){
                                time = n[i].value;
                                if(time)commonFunction.setItem("jiexitime", time);
                            }
                        }
                    }
                });
                if (commonFunction.getItem('selectid') != null) {
                    document.querySelector('#' + commonFunction.getItem('selectid')).className += " jiexiselect";
                }
                if (commonFunction.getItem('selectedid') != null) {
                    document.querySelector('#selectjiexi').value = commonFunction.getItem('selectedid');
                }
                var inList = document.getElementsByClassName('inside');
                for (var i = 0; i < inList.length; i++) {
                    inList[i].addEventListener('click',function() {
                        if (commonFunction.getItem('selectid') != null) {
                            document.querySelector('#' + commonFunction.getItem('selectid')).classList.remove("jiexiselect");
                        }
                        commonFunction.Toast('开始解析视频',2000);
                        var playObjecturl = this.getAttribute("data-url");
                        var playid = this.getAttribute("id");
                        console.log(playid);
                        commonFunction.setItem('selectid', playid);
                        console.log(commonFunction.getItem('selectid'));
                        this.className = "jiexi inside jiexiselect";
                        document.body.removeChild(document.querySelector(".zhihu-layer-tab"));
                        document.body.removeChild(document.querySelector(".zhihu-layer-shade"));
                        document.getElementsByTagName("head").item(0).removeChild(document.getElementById("tab"));
                        let url = playObjecturl + window.location.href;
                        console.log(url);
                        ControllerVideo.GoPlay(url);
                    });
                }

                var outList = document.getElementsByClassName('outside');
                console.log(outList);
                for (var u = 0; u < outList.length; u++) {
                    outList[u].addEventListener('click',
                                                function() {
                        let playObjecturl = this.getAttribute("data-url");
                        let Outsideurl = playObjecturl + window.location.href;
                        document.body.removeChild(document.querySelector(".zhihu-layer-tab"));
                        document.body.removeChild(document.querySelector(".zhihu-layer-shade"));
                        document.getElementsByTagName("head").item(0).removeChild(document.getElementById("tab"));
                        console.log(Outsideurl);
                        window.open(Outsideurl);
                    });
                }
            });
            //弹窗结束-----------------------------------------
            document.querySelector('#addjiexi').addEventListener('click',function() {
                let e = commonFunction.GMgetValue("userplayurl");
                console.log(e);
                if(e == null||e == ""||e == undefined){
                    let arr =[];
                    commonFunction.GMsetValue("userplayurl",arr);
                }
                let addListHtml = ControllerVideo.Videoaddlist();
                let addjiexihtml ="";
                addjiexihtml +='<form class="zhihu-form" style="height: 325px;margin: 10px 30px 0 30px;"><div style="width:400px;display:inline-block;height:280px;overflow-y: scroll;">'
                addjiexihtml +='<div class="zhihu-form-item"><textarea placeholder="B站,1,https://jx.m3u8.tv/jiexi/?url=&#10;B站,2,https://jx.m3u8.tv/jiexi/?url=&#10;分隔符使用英文逗号,解析名字：B站;1为内部播放,2为跳转播放,解析接口：https://jx.m3u8.tv/jiexi/?url=&#10;如需添加多个解析接口，每行设置一个" class="zhihu-input zhihu-unselect" style="min-height:100px;max-height:160px;max-width:380px;min-width:380px;padding: 10px;"></textarea>'
                addjiexihtml +='<ul class="addlist"><li><span>解析名称</span><span>播放类型</span><span class="urllist">接口地址</span><span>操作</span></li>'+addListHtml+'</ul></div></div>'
                addjiexihtml +='</form>'
                commonFunction.open({
                    area: ['445', '400'],
                    title: "添加解析接口",
                    shade: 0,
                    id:"",
                    btn: ['取消', '添加接口'],
                    content:addjiexihtml,
                    btn1: function(data) {
                        var s= data.getElementsByTagName('textarea');
                        for (var i = 0; i < s.length; i++) {
                            let jiexitext = s[i].value;
                            if(jiexitext){
                                let Alljiexitext = jiexitext.split(/[(\r\n)\r\n]+/); // 根据换行或者回车进行识别
                                Alljiexitext.forEach((item, index) => { // 删除空项
                                    if (!item) {
                                        Alljiexitext.splice(index, 1);
                                    }
                                })
                                Alljiexitext = Array.from(new Set(Alljiexitext)); // 去重
                                if(Alljiexitext){
                                    Alljiexitext.forEach((item, index) => {
                                        if (item) {
                                            let jiexiitem = item.split(/,/);
                                            let num = index+1
                                            if(jiexiitem.length == 3){
                                                if(jiexiitem[1]==1||jiexiitem[1]==2){
                                                    let j = {name:jiexiitem[0],category:jiexiitem[1],url:jiexiitem[2],showType:"1"};
                                                    let v= commonFunction.GMgetValue("userplayurl");
                                                    let l = v.push(j);
                                                    commonFunction.GMsetValue("userplayurl",v);
                                                    commonFunction.Toast("添加成功，请重新设置自动解析接口",1500)

                                                    console.log(v)
                                                }else{
                                                    commonFunction.Toast("第"+num+"行格式错误，请按照示例格式重新添加")
                                                }
                                            }else{
                                                commonFunction.Toast("第"+num+"行格式错误，请按照示例格式重新添加")
                                            }

                                        }
                                    })
                                }
                            }
                        }

                    }
                });
                var addurlList = document.getElementsByClassName('delurl');
                for (var u = 0; u < addurlList.length; u++) {
                    addurlList[u].addEventListener('click', function() {
                        let urlid = this.getAttribute("data-id");
                        let v= commonFunction.GMgetValue("userplayurl");
                        v.forEach((item, index) => {
                            if (index == urlid) {
                                v.splice(index, 1);
                            }
                        });
                        commonFunction.GMsetValue("userplayurl",v);
                        console.log(commonFunction.GMgetValue("userplayurl"));
                        commonFunction.Toast("删除成功，请重新设置自动解析接口",1500)
                        document.body.removeChild(document.querySelector(".zhihu-layer-page"));
                        document.body.removeChild(document.querySelector(".zhihu-layer-shade"));
                        document.getElementsByTagName("head").item(0).removeChild(document.getElementById("open"));
                        document.querySelector('#addjiexi').click();
                    });
                }
            });
        },
        //---------------------------------------------------------------------
        //手机端
        addmobbtn:async function() {
            await commonFunction.sleep(1000);
            if(config.host.indexOf("m.le.com")!=-1){
                var player = commonFunction.Commonsetinterval("#j-player");
                player.then(function(playernode){
                    playernode.style.display="block";
                });
                var vipLook = commonFunction.Commonsetinterval("#j-vipLook");
                vipLook.then(function(vipLooknode){
                    vipLooknode.parentNode.removeChild(vipLooknode);
                });
                var daoliu1 = commonFunction.Commonsetinterval(".daoliu1");
                daoliu1.then(function(daoliu1node){
                    daoliu1node.parentNode.removeChild(daoliu1node);
                });
            }
            var ListHtml = ControllerVideo.Videolist(playList);
            var offautohtml = '<span id="off">关闭自动解析</span><img src="data:image/png;base64,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">'
            var onautohtml = '<span id="on">开启自动解析</span><img src="data:image/png;base64,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">'
            var autohtml;
            if (commonFunction.getItem("AutoPlay") == 1) {
                autohtml = offautohtml
            } else {
                autohtml = onautohtml
            }
            var mainhtml = '<div class="mob-main"><div class="shaw"></div><div class="listmian"><div class="listmian-tit"><p>解析接口列表</p><div class="title_right" id="autobtn">' + autohtml + '</div></div><div class="list">' + ListHtml.mobhtml + '</div><p class="tips"><span class="ico">*</span><span>开启自动解析后，最后一次选择的接口即自动解析默认接口</span></p><p class="tips"><span class="ico">*</span><span>本脚本仅学习使用，解析接口收集于网络，版权问题联系接口制作者，请勿相信解析接口显示的任何广告</span></p></div></div>'
            var btnhtml = '<div><div class="elevator"><a class="elevator-msg" id="Showmain"><svg t="1651763850342" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2320" width="200" height="200"><path d="M661.333333 665.6l51.2 12.8 42.666667-72.533333-34.133333-38.4c4.266667-21.333333 4.266667-38.4 4.266666-55.466667s0-34.133333-4.266666-51.2l34.133333-38.4-42.666667-72.533333-51.2 12.8c-25.6-21.333333-55.466667-42.666667-89.6-51.2L554.666667 256h-85.333334l-17.066666 51.2c-34.133333 8.533333-64 25.6-89.6 51.2l-51.2-12.8-42.666667 72.533333 34.133333 38.4c-4.266667 21.333333-4.266667 38.4-4.266666 55.466667s0 34.133333 4.266666 51.2l-34.133333 38.4 42.666667 72.533333 51.2-12.8c25.6 21.333333 55.466667 42.666667 89.6 51.2L469.333333 768h85.333334l17.066666-51.2c34.133333-8.533333 64-25.6 89.6-51.2z m38.4 81.066667c-21.333333 17.066667-51.2 34.133333-76.8 42.666666L597.333333 853.333333h-170.666666l-25.6-64c-29.866667-12.8-55.466667-25.6-76.8-42.666666l-68.266667 12.8-85.333333-149.333334 42.666666-51.2V512c0-17.066667 0-29.866667 4.266667-42.666667l-42.666667-51.2 85.333334-149.333333 68.266666 12.8c21.333333-17.066667 51.2-34.133333 76.8-42.666667L426.666667 170.666667h170.666666l25.6 64c29.866667 12.8 55.466667 25.6 76.8 42.666666l68.266667-12.8 85.333333 149.333334-42.666666 51.2c4.266667 12.8 4.266667 29.866667 4.266666 42.666666s0 29.866667-4.266666 42.666667l42.666666 51.2-85.333333 149.333333-68.266667-4.266666zM512 554.666667c25.6 0 42.666667-17.066667 42.666667-42.666667s-17.066667-42.666667-42.666667-42.666667-42.666667 17.066667-42.666667 42.666667 17.066667 42.666667 42.666667 42.666667z m0 85.333333c-72.533333 0-128-55.466667-128-128s55.466667-128 128-128 128 55.466667 128 128-55.466667 128-128 128z" fill="#ffffff" p-id="2321"></path></svg><span class="">解析设置</span></a><a href="javascript:;" id="addjiexi" class="elevator-faq" ><svg t="1656638904518" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7918" width="200" height="200"><path d="M469.333333 469.333333V341.333333h85.333334v128h128v85.333334h-128v128h-85.333334v-128H341.333333v-85.333334h128z m42.666667 384c-187.733333 0-341.333333-153.6-341.333333-341.333333s153.6-341.333333 341.333333-341.333333 341.333333 153.6 341.333333 341.333333-153.6 341.333333-341.333333 341.333333z m0-85.333333c140.8 0 256-115.2 256-256s-115.2-256-256-256-256 115.2-256 256 115.2 256 256 256z" fill="#ffffff" p-id="7919"></path></svg><span class="">添加接口</span></a><a  id="playing" class="elevator-faq" target="_blank"><svg t="1651762741797" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1235" width="200" height="200"><path d="M512 853.333333c-187.733333 0-341.333333-153.6-341.333333-341.333333s153.6-341.333333 341.333333-341.333333 341.333333 153.6 341.333333 341.333333-153.6 341.333333-341.333333 341.333333z m0-85.333333c140.8 0 256-115.2 256-256s-115.2-256-256-256-256 115.2-256 256 115.2 256 256 256z m128-256l-213.333333 128V384l213.333333 128z" fill="#ffffff" p-id="1236"></path></svg><span class="">解析播放</span></a></div>' + mainhtml+'</div>';
            document.body.insertAdjacentHTML('afterbegin', btnhtml);
            var css = `body, html {
		         font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;
		    }
			.elevator {
				position: fixed;
				padding: 0 10px;
				top: 80%;
				margin-top: -140px;
				right: 10px;
				z-index: 899;
				background: rgb(64 64 64 / 81%);
				box-shadow: 1px 1px 8px 1px rgb(98 99 99 / 34%);
				border-radius: 30px;
			}

			.elevator a {
				position: relative;
				display: block;
				width: 26px;
				height: 56px;
				font-size: 22px;
				line-height: 20px;
				color: #b5b9bc;
				box-sizing: border-box;
				text-align: center;
			}

			.elevator a+a:after {
				position: absolute;
				top: 0;
				left: 50%;
				margin-left: -12px;
				content: '';
				width: 24px;
				border: 1px solid #F3F5F7;
			}

			.elevator a:hover {
				color: #14191e;
			}

			.elevator .icon {
				font-size: 24px;
				line-height: 56px;
				color: #199b6d;
				width: 28px;
				height: 28px;
				margin: 14px 0;
			}

			.elevator .icon:hover {
				color: #14191e;
			}

			.elevator a span {
				display: none;
				padding: 14px 0;
				font-size: 12px;
				color: #fff;
				line-height: 14px;
			}

			.elevator .elevator-msg:hover .icon,
			.elevator .elevator-faq:hover .icon, {
				display: none;
			}

			.elevator .elevator-msg:hover span,
			.elevator .elevator-faq:hover span, {
				display: inline-block;
			}
            .mob-main{
               display: none;
            }
            .shaw{
                  width: 100%;
                  height: 100%;
                  position: fixed;
                  top: 0;
                  left: 0;
                  z-index: 99998;
                  background: rgba(0,0,0,0.3);
            }
            .listmian{
                position: fixed;
                width:100%;
                height:400px;
				bottom: 0;
				z-index: 99999;
                border-radius: 14px 14px 0 0;
                background: #fff;
                box-shadow: 0 -8px 10px 0 rgba(0,0,0,.09);
               }
            .listmian-tit{
               background-color: #f5f5f5;
               height: 60px;
               position: relative;
               border-radius: 14px 14px 0 0;
            }
            .listmian-tit p {
               color: #222;
               font-size: 18px;
               font-weight: 600;
               margin-left: 20px;
               line-height: 60px;
               float: left;
            }
            .listmian-tit .title_right {
               float: right;
               margin-right: 20px;
               line-height: 60px;
             }
             .listmian-tit .title_right span{
               display: inline-block;
               color: #222;
               font-size: 14px;
               vertical-align: middle;
               font-weight: 900;
             }
             .title_right img{
                display: inline-block;
                width: 12px;
                height: 12px;
                margin-left: 3px;
                vertical-align: middle;
             }
             .list{
                margin: 10px 20px;
                display:flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: space-between;
                height: 240px;
                overflow-y: scroll;
                align-content: flex-start
             }
             .list span{
               display: inline-block;
               padding: 10px 5px;
               margin: 0 0 10px 0;
               background-color: #f6f8fa;
               border-radius: .07rem;
               min-width: 90px;
               text-align: center;
               font-size: 12px;
               line-height: 18px;
             }
             .jiexiselect{
             color: #fc5531;
             }
             .tips{
               margin: 5px 20px;
             }
             .tips span{
               font-size: 12px;
               font-weight: 700;
               color: #333;
               line-height: 14px;
             }
             .tips .ico{
               margin-right: 5px;
               color: #ff6022;
             }

          `;
            commonFunction.GMaddStyle(css);
            ControllerVideo.CheckAutoplay(3);
            if (commonFunction.getItem('selectid') != null) {
                document.querySelector('#' + commonFunction.getItem('selectid')).classList.add("jiexiselect");
            }

            document.querySelector('#playing').addEventListener('click',
                                                                function() {
                ControllerVideo.autoplay(3);
                commonFunction.Toast('3秒后自动解析视频',3000);

            });
            document.querySelector('#Showmain').addEventListener('click',function() {
                document.querySelector(".mob-main").style.display = "block"
            });
            document.querySelector('.shaw').addEventListener('click',function() {
                document.querySelector(".mob-main").style.display = "none"
            })

            document.querySelector('#autobtn').addEventListener('click',function() {
                if (commonFunction.getItem('AutoPlay') == 1) {
                    this.innerHTML = onautohtml;
                    commonFunction.setItem('AutoPlay', '0');
                } else {
                    this.innerHTML = offautohtml;
                    commonFunction.setItem('AutoPlay', '1');
                    commonFunction.Toast('请选择自动解析接口',2000);
                };
            });
            var list = document.getElementsByClassName('mob-jiexi');
            for (var i in list) {
                list[i].addEventListener('click',function() {
                    commonFunction.Toast('开始解析视频',2000);
                    if (commonFunction.getItem('selectid') != null) {
                        document.querySelector('#' + commonFunction.getItem('selectid')).classList.remove("jiexiselect");
                    }
                    var playObjecturl = this.getAttribute("data-url");
                    var playid = this.getAttribute("id");
                    console.log(playid);
                    commonFunction.setItem('selectid', playid);
                    commonFunction.setItem('selecturl', playObjecturl);
                    this.classList.add("jiexiselect");
                    document.querySelector(".mob-main").style.display = "none";
                    let url = playObjecturl + window.location.href;
                    console.log(url);
                    ControllerVideo.GoPlay(url);
                })
            }
        },


        //---------------------------------------------------------------

      //检查自动播放
        CheckAutoplay:function(jiexitime) {
            if (commonFunction.getItem("AutoPlay") == 1) {
                ControllerVideo.autoplay(jiexitime);
                commonFunction.Toast(jiexitime+'秒后自动解析视频',jiexitime*1000);

            }
        },
        //-----------------------------------------------------------------------
        //自动播放
        autoplay:async function(jiexitime){
            await commonFunction.sleep(jiexitime*1000);
            var f = "";
            var autoplayurl;
            if (commonFunction.getItem('selecturl') != null&&commonFunction.getItem('selecturl') != "null") {
                f = commonFunction.getItem('selecturl');
            }
            if (f != "") {
                autoplayurl = f + config.playhref;
            } else {
                let defurl = playList[0].url;
                console.log(defurl);
                autoplayurl = defurl + config.playhref;
            }
            ControllerVideo.GoPlay(autoplayurl);
        },
        //-------------------------------------------
        //执行播放
        GoPlay:function(e){
            var playurl = e;
            var PlayID = ControllerVideo.Playid();
            var iframeDivCss = "width:100%;height:100%;"
            if (config.host.indexOf("m.iqiyi.com") != -1) {
                iframeDivCss += "position: absolute;top: 0;right: 0;bottom: 0;left: 0;"
            }
            var videoPlayer = "<div style='" + iframeDivCss + "' id='zhihuplay'><iframe id='iframe-player-99087lkj' src='" + playurl + "' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe></div>";
            var b = commonFunction.Videosetinterval(PlayID);
            b.then(function(Count){
                clearInterval(Count);
                document.querySelector(PlayID).innerHTML = "";
                document.querySelector(PlayID).innerHTML = videoPlayer;
            });
        }
    }

    //视频解析结束

    //-------------------------------------

    //-------------------------------------------------------------------------
    //统一判断运行
    if(commonFunction.GMgetValue("isuser") == 1){
        switch (config.host) {
            case 'v.qq.com':
                if(commonFunction.GMgetValue("videosetting")===1){
                    ControllerVideo.addbtn();
                    commonFunction.setItem("playwork","1");
                    console.log('已进入腾讯');
                    var mask = commonFunction.Commonsetinterval("#mask_layer");
                    mask.then(function(masknode){
                        masknode.parentNode.removeChild(masknode);
                    });
                    var mod = commonFunction.Commonsetinterval(".mod_vip_popup");
                    mod.then(function(modnode){
                        modnode.parentNode.removeChild(modnode);
                    });
                    var panel = commonFunction.Commonsetinterval(".panel-tip-pay");
                    panel.then(function(panelnode){
                        panelnode.parentNode.removeChild(panelnode);
                    });
                }
                break;
            case 'v.youku.com':
                if(commonFunction.GMgetValue("videosetting")===1){
                    ControllerVideo.addbtn();
                    console.log('已进入优酷')
                }
                break;
            case 'www.iqiyi.com':
                if(commonFunction.GMgetValue("videosetting")===1){
                    ControllerVideo.addbtn();
                    commonFunction.setItem("playwork","1");
                    console.log('已进入爱奇艺')
                }
                break;
            case 'www.mgtv.com':
                if(commonFunction.GMgetValue("videosetting")===1){
                    ControllerVideo.addbtn();
                    commonFunction.setItem("playwork","1");
                    console.log('已进入芒果TV')
                }
                break;
            case 'w.mgtv.com':
                if(commonFunction.GMgetValue("videosetting")===1){
                    ControllerVideo.addbtn();
                    commonFunction.setItem("playwork","1");
                    console.log('已进入芒果TV')
                }
                break;
            case 'www.bilibili.com':
                commonFunction.setItem("playwork","1");
                if(commonFunction.GMgetValue("videosetting")===1){
                    if (config.playhref.indexOf("www.bilibili.com/bangumi/play") != -1) {
                        ControllerVideo.addbtn();
                    }
                }
                if(commonFunction.GMgetValue("Bilibilisetting")===1){
                    var Bv = null;
                    var pathname = window.location.pathname;
                    if (pathname.indexOf("/medialist/play/watchlater/") != -1) {
                        Bv = pathname.replace("/medialist/play/watchlater/","").replace("/","");
                    }else{
                        Bv = pathname.replace("/video/","").replace("/","");
                    }
                    console.log(Bv)
                    if(Bv!=null){
                        ControllerBilibili.Getaid(Bv);
                    }
                }
                console.log('已进入bilibili')
                break;
            case 'www.le.com':
                if(commonFunction.GMgetValue("videosetting")===1){
                    ControllerVideo.addbtn();
                    commonFunction.setItem("playwork","1");
                }
                console.log('已进入乐视TV')
                break;
            case 'film.sohu.com':
                if(commonFunction.GMgetValue("videosetting")===1){
                    ControllerVideo.addbtn();
                    commonFunction.setItem("playwork","1");
                }
                console.log('已进入搜狐会员')
                break;
            case 'tv.sohu.com':
                if(commonFunction.GMgetValue("videosetting")===1){
                    ControllerVideo.addbtn();
                    commonFunction.setItem("playwork","1");
                }
                console.log('已进入搜狐')
                break;
            case 'www.wasu.cn':
                if(commonFunction.GMgetValue("videosetting")===1){
                    if(config.playhref.indexOf("www.wasu.cn/Play/")!=-1){
                        ControllerVideo.addbtn();
                    }else{
                        ControllerVideo.addmobbtn();
                    }
                }
                console.log('已进入华数TV')
                break;
            case 'vip.1905.com':
                if(commonFunction.GMgetValue("videosetting")===1){
                    if(config.playhref.indexOf("vip.1905.com/play/")!=-1){
                        ControllerVideo.addbtn();
                    }else{
                        ControllerVideo.addmobbtn();
                    }
                }
                console.log('已进入1905电影网')
                break;
            case 'v.pptv.com':
                if(commonFunction.GMgetValue("videosetting")===1){
                    ControllerVideo.addbtn();
                }
                console.log('已进入PPTV')
                break;
            case 'laisoyiba.com':
                var jconfirm = commonFunction.Commonsetinterval(".jconfirm-scrollpane");
                jconfirm.then(function(e){
                    e.parentNode.removeChild(e);
                });
                break;
            case 'm.v.qq.com':
                if(config.playhref.indexOf('/play') > -1||config.playhref.indexOf('/cover') > -1){
                    ControllerVideo.addmobbtn();
                    commonFunction.setItem("playwork","1");
                    var Poster = commonFunction.Commonsetinterval("#vipPosterContent");
                    Poster.then(function(Posternode){
                        Posternode.parentNode.removeChild(Posternode);
                    });
                    var at = commonFunction.Commonsetinterval(".at-app-banner");
                    at.then(function(atnode){
                        atnode.parentNode.removeChild(atnode);
                    });
                    console.log('已进入手机腾讯');
                }
                break;
            case 'm.youku.com':
                var callEnd_box = commonFunction.Commonsetinterval(".callEnd_box");
                callEnd_box.then(function(callEnd_boxnode){
                    callEnd_boxnode.parentNode.removeChild(callEnd_boxnode);
                });
                ControllerVideo.addmobbtn();
                console.log('已进入手机优酷');
                break;
            case 'm.iqiyi.com':
                ControllerVideo.addmobbtn();
                commonFunction.setItem("playwork","1");
                console.log('已进入手机爱奇艺');
                break;
            case 'm.mgtv.com':
                var mg = commonFunction.Commonsetinterval(".mg-down-btn");
                mg.then(function(mgnode){
                    mgnode.parentNode.removeChild(mgnode);
                });
                var fixed = commonFunction.Commonsetinterval(".ad-fixed-bar");
                fixed.then(function(fixednode){
                    fixednode.parentNode.removeChild(fixednode);
                });
                ControllerVideo.addmobbtn();
                commonFunction.setItem("playwork","1");
                console.log('已进入手机芒果TV');
                break;
            case 'm.bilibili.com':
                if (config.playhref.indexOf("m.bilibili.com/bangumi/play") != -1) {
                    ControllerVideo.addmobbtn();
                    commonFunction.setItem("playwork","1");
                }
                console.log('已进入手机bilibili');
                break;
            case 'm.le.com':
                ControllerVideo.addmobbtn();
                commonFunction.setItem("playwork","1");
                console.log('已进入手机乐视TV');
                break;
            case 'm.tv.sohu.com':
                ControllerVideo.addmobbtn();
                commonFunction.setItem("playwork","1");
                var cover = commonFunction.Commonsetinterval(".player_film_cover");
                cover.then(function(covernode){
                    covernode.parentNode.removeChild(covernode);
                });
                console.log('已进入手机搜狐');
                break;
            case 'm.pptv.com':
                ControllerVideo.addmobbtn();
                console.log('已进入手机PPTV');
                break;


        }

        //网站判断执行结束
    }
    // Your code here...
})();
