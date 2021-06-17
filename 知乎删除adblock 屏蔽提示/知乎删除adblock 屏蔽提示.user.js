// ==UserScript==
// @name         知乎，掘金删除adblock 屏蔽提示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.zhihu.com/*
// @match        https://juejin.im/*
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
    $(document).ready(function(){
        var adb = $('.AdblockBanner');
        if(adb){
            adb.remove();
        }
        var juejinad = $('.extension');
        if(juejinad){
         juejinad.remove();
        }
        var juejiner = $('.request-health-alert');
        if(juejiner){
            juejiner.remove();
        }
    });
})();
