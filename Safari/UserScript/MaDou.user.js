// ==UserScript==
// @name         麻豆影视
// @version      1.0.0
// @description  免费观看电影，手机电脑均可使用
// @author       Eric
// @match        https://lpvk14zw.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lpvk14zw.com
// @grant        none
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
    var vl = localStorage.getItem("vip_level");
    if(vl==="undefined" || vl==null || vl==='0'){
        localStorage.setItem("vip_level",'1');
    }
})();
