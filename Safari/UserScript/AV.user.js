// ==UserScript==
// @name         优质资源和麻豆视频
// @version      1.6.5
// @description  优质资源和麻豆解锁VIP直接免费看
// @author       Eric
// @match        http://www.nnu77.com/*
// @match        https://www.nnu55.com/*
// @match        https://lpvk14zw.com/*
// @match        https://kd773sg3.com/*
// @match        https://n4iu0n36.com/*
// @match        https://v0k83j2i.com/*
// @match        https://madougrh.com/*
// @match        https://madou.tv
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @run-at document-end
// @connect      *
// ==/UserScript==

(function() {
	'use strict';
	GM_log('vip破解 v1.0 load');

	let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	let config = {
		childList: true,
		subtree: true
	};
	let target = document.documentElement;
	let observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.type == 'childList' && mutation.addedNodes !== null) {
				for (let i = 0; i < mutation.addedNodes.length; i++) {
					let n = mutation.addedNodes[i];

					if (n.tagName == 'DIV' && n.querySelectorAll('#dplayer').length > 0 && checkBrowserType()) {
						document.getElementsByClassName('dplayer-dtime')[0].addEventListener('DOMNodeInserted', () => {
							if (document.getElementsByClassName('dplayer-dtime')[0].innerText != '00:00') {
								document.getElementsByClassName('dplayer-icon dplayer-play-icon')[0].click();
								setTimeout(() => {
									document.getElementsByClassName('dplayer-icon dplayer-play-icon')[0].click();
									GM_log('双击了');
								}, 100);
							}
						});
					}
				}
			}
		});
	});
	observer.observe(target, config);

	function checkBrowserType() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}
	//  破解vip
	var originalSetItem = localStorage.setItem;
	localStorage.setItem = function(key, value) {
		if (this.vip_level != '2') {
			this.vip_level = '2';
		}
		originalSetItem.apply(this, arguments);
	};
var vl = localStorage.getItem("vip_level");
    if(vl==="undefined" || vl==null || vl==='0'){
        localStorage.setItem("vip_level",'1');
    }
})();
