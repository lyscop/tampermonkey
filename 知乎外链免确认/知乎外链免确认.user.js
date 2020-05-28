// ==UserScript==
// @name         知乎外链免确认
// @version      0.13
// @description  RT
// @author       Erimus
// @match        *link.zhihu.com/*
// @grant        none
// @namespace http://erimus.cc/
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var pAll = document.getElementsByTagName("p");
    for(var i=0;i<pAll.length;i++){
        if(pAll[i].innerHTML.indexOf("http")!=-1){
            window.location=pAll[i].innerHTML;
        }
    }
})();
