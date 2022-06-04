// ==UserScript==
// @name         抖音快手短视频无水印下载
// @namespace    https://t.me/Mr_Alex
// @version      1.2.0
// @description  本脚本适用于短视频无水印下载(抖音、快手)
// @author       Eric
// @icon         data:image/png;base64,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

// @match        *://*.douyin.com/*
// @match        *://*.kuaishou.com/*
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/crypto-js/4.1.1/crypto-js.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @run-at       document-body
// ==/UserScript==

(function() {
    'use strict';

    /*--config--*/
    var Config ={
         couponUrl:window.location.href,
         couponHost:window.location.host,
         isMobile:/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent),
        couponWaitTime : 1500,
        dyVideoDownload:GM_getValue('dyVideoDownload',22),
        ksVideoDownload:GM_getValue('ksVideoDownload',22),
     }

    var {couponUrl,
         couponWaitTime,
         dyVideoDownload,
         ksVideoDownload
        } = Config;

    /*--lang--*/
    var lang = {        
        dyVideoDownload:'抖音下载',
        ksVideoDownload:'快手下载',
    };

    /*--datas--*/
    var datas = {
/*
        douYin:[{isOpen:GM_getValue('douyinList','22'),web:[
            {funcName:'douyinDownload',match:/^https?:\/\/www\.douyin\.com\/?[^.+]$/},
            {funcName:'douyinDownload',match:/^https?:\/\/www\.douyin\.com\/\?enter\=guide$/},
        ]}],
*/
        videoDownload:[{isOpen:GM_getValue('videoDownloadList','22'),web:[
            /*
            {funcName:'videoDownload',name:'dyVideoDownload',match:/^https?:\/\/www\.douyin\.com\/?[^.+]$/},
            {funcName:'videoDownload',name:'dyVideoDownload',match:/^https?:\/\/www\.douyin\.com\/\?enter\=guide$/},
            {funcName:'videoDownload',name:'dyVideoDownload',match:/^https?:\/\/www\.douyin\.com\/follow$/},
            {funcName:'videoDownload',name:'dyVideoDownload',match:/^https?:\/\/www\.douyin\.com\/vs$/},
            {funcName:'videoDownload',name:'dyVideoDownload',match:/^https?:\/\/www\.douyin\.com\/discover\?modal_id=.+$/}
            */
            {funcName:'videoDownload',name:'dyVideoDownload',match:/^https?:\/\/www\.douyin\.com\/?.+$/,isWebOpen:dyVideoDownload},
            {funcName:'videoDownload',name:'ksVideoDownload',match:/^https?:\/\/www\.kuaishou\.com\/?.+$/,isWebOpen:ksVideoDownload},
        ]}],

       downloadOption:[{name:'直接下载',id:'toDownload'},{name:'复制链接',id:'toCopy'},{name:'打开文件',id:'toLink'}]

    }

    var {videoDownload,downloadOption} = datas;
    /*--create style--*/
    var domHead = document.getElementsByTagName('head')[0];

    var domStyle = document.createElement('style');

    domStyle.type = 'text/css';

    domStyle.rel = 'stylesheet';
    /*--Class--*/
    class BaseClass{

        constructor(){

            var _this = this;
            var videoDownloadOptionJson = [
                {'optionName':lang.dyVideoDownload,'optionID':'dyVideoDownload','default':dyVideoDownload},
                {'optionName':lang.ksVideoDownload,'optionID':'ksVideoDownload','default':ksVideoDownload},
            ];

        }

        createElement(dom,domId){

            var rootElement = document.body;

            var newElement = document.createElement(dom);

            newElement.id = domId;

            var newElementHtmlContent = document.createTextNode('');

            rootElement.appendChild(newElement);

            newElement.appendChild(newElementHtmlContent);

        }

        request(method,url,data){

            let request = new XMLHttpRequest();

            return new Promise((resolve,reject)=>{

                request.onreadystatechange=function(){

                    if(request.readyState==4){

                        if(request.status==200){

                            resolve(request.responseText);

                        }else{

                            reject(request.status);
                        }

                    }
                }

                request.open(method,url);

                request.send(data);

            })

        }



        static getElement(css){

            return new Promise((resolve,reject)=>{

                let num = 0;

                let timer = setInterval(function(){

                    num++

                    let dom = document.querySelector(css);

                    if(dom){

                        clearInterval(timer);

                        resolve(dom);

                    }else{

                        if(num==20){clearInterval(timer);resolve(false);}
                    }

                },300)

            })


        }

        static toast(msg,duration){

            duration=isNaN(duration)?3000:duration;

            let toastDom = document.createElement('div');

            toastDom.innerHTML = msg;

            //toastDom.style.cssText="width: 60%;min-width: 150px;opacity: 0.7;height: 30px;color: rgb(255, 255, 255);line-height: 30px;text-align: center;border-radius: 5px;position: fixed;top: 40%;left: 20%;z-index: 999999;background: rgb(0, 0, 0);font-size: 12px;";
            toastDom.style.cssText='padding:2px 15px;min-height: 36px;line-height: 30px;text-align: center;transform: translate(-50%);border-radius: 4px;color: rgb(255, 255, 255);position: fixed;top: 50%;left: 50%;z-index: 999999;background: rgb(0, 0, 0);font-size: 16px;'

            document.body.appendChild(toastDom);

            setTimeout(function() {
                var d = 0.5;

                toastDom.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';

                toastDom.style.opacity = '0';

                setTimeout(function() { document.body.removeChild(toastDom) }, d * 1000);

            }, duration);
        }

    }


        
       
    

    class VideoDownloadClass extends BaseClass{

        constructor(){

            super();
        }

        dyVideoDownload(){

            var _this = this;

            window.addEventListener('load',function(){

                 async function getControls(){

                     let videoDom = await BaseClass.getElement('.xg-video-container');

                     if(!videoDom){

                         console.log('没有找到DOM');return;
                     }

                     let vsNav = document.querySelector('.fuy_wmct:nth-of-type(5)');

                     if((vsNav && vsNav.className.indexOf('LXX79le5') != -1) || couponUrl.indexOf('vsdetail') != -1){
                         console.log('综艺栏目关闭下载');return;
                     }

                     _this.createDyVideoDownload();

                     let videoPlayDomAll = document.querySelectorAll('video');

                     let videoIndex = videoPlayDomAll.length>1?videoPlayDomAll.length-2:videoPlayDomAll.length-1;

                     let videoPlayDom = videoPlayDomAll[videoIndex];

                     //let videoPlayDom = videoPlayDomAll.length>1?videoPlayDomAll[videoPlayDomAll.length-2]:videoPlayDomAll[videoPlayDomAll.length-1];

                     videoPlayDom.addEventListener('ended',function(){ //结束

                         console.log("播放结束");

                         let autoPlay = document.querySelector('.xg-switch-checked');

                         if(autoPlay){

                             getControls();
                             return;
                         }

                     }, false);

                     document.querySelector('#toDownload').addEventListener('click',function(){

                         BaseClass.toast('正在下载请稍侯');

                         let dataUrl = document.querySelector('#zhmDouyinDownload').getAttribute('data-url');

                         let match = /[https]?:?\/\/www\.douyin\.com\/.+\/([0-9]+)/;

                         let video = dataUrl.match(match);

                         let videoId = video[1];

                         let url = 'https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids='+video[1];

                         let uri = videoDownloadClass.request('get',url).then((result)=>{

                             let resp = JSON.parse(result);

                             //let playUrl = resp.item_list[0].video.play_addr.url_list[0];//下载有水印

                             if(resp.item_list.length > 0){

                                 let uriId = resp.item_list[0].video.play_addr.uri;

                                 let playUrl = `https://aweme.snssdk.com/aweme/v1/play/?video_id=${uriId}&line=0&ratio=540p&media_type=4&vr_type=0&improve_bitrate=0&is_play_url=1&is_support_h265=0&source=PackSourceEnum_PUBLISH`;

                                 let info = document.querySelectorAll('.Nu66P_ba');

                                 let account = info[videoIndex*2].innerText;

                                 let titleArr = info[videoIndex*2+1].innerText.split('#');

                                 let title = titleArr[0]?titleArr[0]:titleArr[1];

                                 //console.log(account,title);

                                 GM_download(playUrl,title+account+".mp4");

                             }else{
                                 console.log('API没有获取视频ID');
                             }

                         }).catch((error)=>{ console.log(error);})

                     })

                     document.querySelector('#toCopy').addEventListener('click',function(){

                         BaseClass.toast('已复制到剪贴板');

                         GM_setClipboard(videoPlayDom.children[0].src);
                     })

                     document.querySelector('.toLink').addEventListener('click',function(){

                         window.open(videoPlayDom.children[0].src);

                     })

                     return;
                 }

                 getControls();

                 window.addEventListener("wheel",getControls);

                 window.addEventListener('keydown',function(e){

                     if(e.code=='ArrowDown' || e.code=='ArrowUp'){

                         getControls();
                     }

                 })

                 async function insertedDom(){

                     let videoDom = await BaseClass.getElement('video');

                     if(!videoDom){

                         console.log('没有找到DOM');return;
                     }

                     videoDom.addEventListener('DOMNodeInserted',(e) => {

                         getControls();

                     })

                 }

                 insertedDom();

                 window.addEventListener('click',getControls);

             })

        }

        createDyVideoDownload(){

            let controlAll = document.querySelectorAll('.xg-right-grid');

            let controls = controlAll.length>1?controlAll[controlAll.length-2]:controlAll[controlAll.length-1];

            let videoDownloadDom = document.querySelector('#zhmDouyinDownload');

            if(videoDownloadDom){

                //videoDownloadDom.parentNode.removeChild(videoDownloadDom);

                videoDownloadDom.parentNode.parentNode.parentNode.removeChild(videoDownloadDom.parentNode.parentNode)
            }

            let playSeting = controls.querySelector('.xgplayer-playback-setting');

            let downloadDom = playSeting.cloneNode(true);

            downloadDom.style='margin-right:20px;';

            let downloadText = downloadDom.querySelector('div:first-child > span:first-child');

            downloadText.innerText='下载';

            downloadText.style = 'font-size:12px;font-weight:400;';

            downloadText.setAttribute('id','zhmDouyinDownload');

            let detail = controls.querySelector('xg-icon:nth-of-type(1)').children[0];

            let linkUrl = detail.getAttribute('href')?detail.getAttribute('href'):location.href;

            downloadText.setAttribute('data-url',linkUrl);

            downloadText.removeAttribute('target');

            downloadText.setAttribute('href','javascript:void(0);');

            downloadDom.onmouseover=function(){

                downloadDom.className='xgplayer-playback-setting slide-show';

            }

             downloadDom.onmouseout=function(){

                downloadDom.className='xgplayer-playback-setting';
            }

            let downloadHtml = '';

            downloadOption.forEach(function(item){

                downloadHtml += `<div class="xgplayer-playratio-item ${item.id}" id="${item.id}">${item.name}</div>`;

            })

            downloadDom.querySelector('.xgplayer-playratio-wrap').innerHTML = downloadHtml;

            downloadDom.querySelector('.xgplayer-slider').style='width:60px important;';

            let autoPlay = document.querySelector('.xgplayer-autoplay-setting');

            autoPlay.after(downloadDom);

            let divDom = document.createElement('div');

            divDom.style="position: absolute;z-index:-999;height:80px;width:40px;margin-top:-80px;"

            downloadDom.appendChild(divDom);

            /*
            let detailDom = controls.querySelector('xg-icon:nth-of-type(1)');

            let xgIcon = detailDom.cloneNode(true);

            if(xgIcon.children[1] && xgIcon.children[1].className=='xg-tips'){

                xgIcon.children[1].innerHTML='下载视频';
            }

            xgIcon.className='xgplayer-detail-entry';

            xgIcon.children[0].style='margin-right:16px;';

            xgIcon.children[0].setAttribute('id','zhmDouyinDownload');

            let linkUrl = xgIcon.children[0].getAttribute('href')?xgIcon.children[0].getAttribute('href'):location.href;

            xgIcon.children[0].setAttribute('data-url',linkUrl);

            xgIcon.children[0].removeAttribute('target');

            xgIcon.children[0].setAttribute('href','javascript:void(0);');

            xgIcon.children[0].innerHTML="<div class='desc' style='font-size:12px;line-height:20px;'>下载</div>";

            let autoPlay = document.querySelector('.xgplayer-autoplay-setting');

            autoPlay.after(xgIcon);
            */

        }

        ksVideoDownload(){

            var _this = this;

            window.addEventListener('load',function(){

                async function getControls(){

                     let videoDom = await BaseClass.getElement('.player-video');

                    if(!videoDom){

                        console.log('没有找到DOM');return;

                    }

                    if(videoDom.getAttribute('src').match(/^blob/)){
                        console.log('blob视频无法下载');return;
                    }

                    _this.createKsVideoDownload(videoDom);

                    videoDom.addEventListener('playing',function(){ //播放中
                        console.log("播放中");
                    });

                    videoDom.addEventListener('ended',function(){ //结束

                        console.log("播放结束");

                        let autoPlay = document.querySelector('.auto-warpper').getAttribute('autoplay');

                        if(autoPlay){
                            getControls();
                            return;

                        }

                    }, false);

                    document.querySelector('#toDownload').addEventListener('click',function(){

                        BaseClass.toast('正在下载请稍侯');

                        let playTimeTotal = document.querySelector('.total').innerText;

                        let second = playTimeTotal.match(/(.+):(.+)/);

                        let secondTotal = second[1]*60+parseInt(second[2]);

                        let dataUrl = document.querySelector('#zhmKsDownload').getAttribute('data-url');

                        let account = document.querySelector('.profile-user-name-title').innerText;

                        let title = document.querySelector('.video-info-title').innerText;

                        let videoFileName = (account && title)?account+'-'+title+'.mp4':new Date().getTime()+'.mp4';

                        GM_download(dataUrl,videoFileName);

                        /*

                        if(secondTotal<30){

                            let videoFileName = new Date().getTime()+'.mp4';

                            GM_download(dataUrl,videoFileName);

                        }else{

                            window.open(dataUrl);
                        }
                        */
                    })

                    document.querySelector('#toCopy').addEventListener('click',function(){

                         BaseClass.toast('已复制到剪贴板');

                         GM_setClipboard(videoDom.getAttribute('src'));
                     })

                     document.querySelector('#toLink').addEventListener('click',function(){

                         window.open(videoDom.getAttribute('src'));

                     })

                }

               getControls();

                document.addEventListener('click',function(e){

                    getControls();


                })

            })


        }

        createKsVideoDownload(videoDom){

             let match = /^https?:\/\/www\.kuaishou\.com\/(.+)\/.+/;

            let resp = location.href.match(match);

            if(!resp || (resp[1] != 'short-video' && resp[1] != 'video')){

                console.log('当前不是视频播放页');return;
            }

            if(resp[1] == 'short-video'){

                let playerArea = document.querySelector('.video-container-player');

                let playerAreaWidth = playerArea.style.width.match(/(.+)px/);

                let playerBarProgress = document.querySelector('.player-bar-progress');

                playerBarProgress.style.width = playerAreaWidth[1]-260+'px';

                let timeTotal = document.querySelector('.total');

                timeTotal.style.right='120px';
            }

            let controls = document.querySelector('.right');

            let videoDownloadDom = document.querySelector('#zhmKsDownload');

            if(videoDownloadDom){

                videoDownloadDom.parentNode.removeChild(videoDownloadDom);
            }

            let detailDom = controls.querySelector('div:nth-of-type(1)');

            let xgIcon = detailDom.cloneNode(true);

            let linkUrl = videoDom.getAttribute('src');

            xgIcon.querySelector('.kwai-player-volume-sound').innerHTML="<div style='cursor:pointer;'>下载</div>";

            let slider = xgIcon.querySelector('.pl-slider');

            slider.style = 'width:49px;padding:10px 5px 20px;';

            let downloadList = '';

            downloadOption.forEach(function(item){

                downloadList += `<div style="margin-top:10px;color:#FFF;cursor:pointer;" id="${item.id}">${item.name}</div>`;

            })

            slider.innerHTML = downloadList;

            xgIcon.setAttribute('data-url',linkUrl);

            xgIcon.setAttribute('id','zhmKsDownload');

            //console.log(xgIcon);

            //xgIcon.innerHTML="<div style='cursor:pointer;'>下载</div>";

            detailDom.before(xgIcon);

            //重构播放操作按钮

            let zhmKsButton = document.querySelector('#zhmKsButton');

            //console.log(zhmKsButton);

            if(zhmKsButton){

                //zhmKsButton.parentNode.removeChild(zhmKsButton);

                return false;
            }

            let buttonIcon = detailDom.cloneNode(true);
            //console.log(buttonIcon);
            buttonIcon.setAttribute('id','zhmKsButton');

            let buttonIconImg = buttonIcon.querySelector('.unmuted-icon');

            buttonIconImg.style = 'background: url(https://s2-10623.kwimgs.com/udata/pkg/cloudcdn/img/player-setting.ad1f5ce8.svg) no-repeat';

            detailDom.after(buttonIcon);

            let plSlider = buttonIcon.querySelector('.pl-slider');

            plSlider.style='width:auto;padding:10px 10px 25px 10px;';

            plSlider.innerHTML = "";

            let buttonFour = controls.querySelector('div:nth-of-type(4)');

            buttonFour.style.margin='0px';

            let autoPlay = document.querySelector('.play-setting-container');

            autoPlay.style.margin='0px 40px 0px 0px';

            let buttonFive = controls.querySelector('div:nth-of-type(5)');

            buttonFive.style.margin='15px 0px';

            buttonFive.onmouseover=function(){

                setTimeout(function(){

                    let toolTip = document.querySelector('.kwai-player-rotate-tooltip');

                    if(toolTip){

                        toolTip.parentNode.removeChild(toolTip);
                    }


                },30)

            }

            let buttonSix = controls.querySelector('div:nth-of-type(6)');

            buttonSix.style.margin='15px 0px';

            let toolTip = document.querySelector('.kwai-player-fullscreen-tooltip');

            buttonSix.onmouseover=function(){

                setTimeout(function(){

                    let toolTip = document.querySelector('.kwai-player-fullscreen-tooltip');

                    if(toolTip){

                        toolTip.parentNode.removeChild(toolTip);

                    }

                },30)

            }

            plSlider.appendChild(buttonFour);

            plSlider.appendChild(buttonFive);

            plSlider.appendChild(buttonSix);

        }

    }
 var allWeb = [...videoDownload];

    var nowWeb=[];

    allWeb.forEach(function(item){

        if(item.isOpen == 0) return true;

        item.web.forEach(function(val){

            let result = couponUrl.match(val.match);

            if(result){

                nowWeb.push(val);

            }
        })

    })

    if(nowWeb.length==0){

        let baseClass = new BaseClass();

        console.log('没有匹配该网站或该模块已关闭');return;
    }

    let {funcName,match:nowMatch,node:nowNode,name:nowName} = nowWeb[0];

    switch(funcName){

        case 'videoDownload':

            var videoDownloadClass = new VideoDownloadClass();

             if(nowWeb[0].isWebOpen == 0){

                console.log(nowWeb[0].name+'已关闭');return;

            }else{

                videoDownloadClass[nowName]();
            }
            break;
    }


   

})();
