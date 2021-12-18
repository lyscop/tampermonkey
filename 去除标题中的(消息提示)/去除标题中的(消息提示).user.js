// ==UserScript==
// @name         去除标题中的(消息提示)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  知乎，CSDC等网站打开时，浏览器的标题栏会显示消息提示，例如[(10条消息)首页 - 知乎]，[(5条消息)某CSDN博客]。本脚本可以去除标题中括号里的消息这一段文字，简化标签。
// @author       Zhou Yucheng
// @match        https://www.zhihu.com/*
// @match        https://blog.csdn.net/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 不使用windows.onload()，否则更改标题后可能再被改回来
    window.addEventListener(
        'load',
        function() {
            let x=document.getElementsByTagName("title")[0]
            let s=x.innerHTML

            /*let i=s.indexOf('(')
            let j=s.indexOf(')')
            let k=s.indexOf('消息')

            if (i==0 && k>i && j>k){
                x.innerHTML=s.substring(j+1).trim()
            }*/
            let i=s.indexOf('(')
            let n=s.substr(1,1)
            let j=s.indexOf(')')

            if (i==0 && n>0){
                x.innerHTML=s.substring(j+1).trim()
            }
        }, false);
})();
