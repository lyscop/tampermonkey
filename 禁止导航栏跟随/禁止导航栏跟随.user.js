// ==UserScript==
// @name         禁止导航栏跟随
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  禁止“今日头条”的导航栏跟随功能！
// @author       abevol
// @match        https://www.toutiao.com/*
// @icon         https://www.google.com/s2/favicons?domain=toutiao.com
// @grant        none
// ==/UserScript==
 
(function() {
    'use strict';
 
    var bar = document.querySelector("#root > div.ttp-sticky-container");
    if (bar) {
        bar.style.position="unset";
    }
 
    bar = document.querySelector("#root > div > div.fix-header.common-component-wrapper");
    if (bar) {
        bar.style.position="unset";
    }
 
})();
