// ==UserScript==
// @name         百度搜索结果过滤
// @namespace    https://gitee.com/janbar/tampermonkey
// @version      0.0.1
// @description  去掉不想展示的结果
// @author       janbar
// @include      https://www.baidu.com/s*
// @match        https://www.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @license      GPL License
// @grant        window.onurlchange
// ==/UserScript==
 
(function() {
    'use strict';
 
    function filter(txt) {
        return txt.indexOf("csdn已为您找到关于") > -1 || txt.indexOf("CSDN下载") > -1;
    }
    function csdnDel(){
        // 循环找到需要屏蔽的结果,找不到则停止定时器
        var lp = setInterval(function(){
            var cnt=0,downList = document.getElementsByClassName("result c-container new-pmd");
            for (var i = 0; i < downList.length; i++) {
                if (downList[i].style.display != "none" && filter(downList[i].innerText)) {
                    downList[i].style.display = "none";
                    cnt++;
                }
            }
            if (cnt == 0) {
                clearInterval(lp);
            }
        }, 1000);
    }
 
    csdnDel();
    if (window.onurlchange === null) {
        window.addEventListener('urlchange', csdnDel)
    }
 
})();
