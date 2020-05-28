// ==UserScript==
// @name         知乎/简书去除安全中心，直接跳转链接地址。
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  屏蔽知乎/简书安全中心，直接跳转链接地址。
// @author       CeeYang
// @match        https://*.zhihu.com/*
// @match        https://*.jianshu.com/*
// @grant        none
// @license      GPLv3
// ==/UserScript==

// changelog：    2020-04-09 10:26:08： 更新简书规则；
// changelog:    2020-04-21 10:56:30： 简书规则更新，跟下判断模式，理论上简书规则更新后脚本依旧能用

(function() {
    'use strict';


    /// 地址类型
    /// https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Falibaba%2Ffish-redux
    /// https://link.jianshu.com/?t=https%3A%2F%2Fgithub.com%2Falibaba%2Ffish-redux

    /// 获取所以a标签
    /// 循环判断 a 标签是否包含两个 http 字样
    /// 截取最后一个 http 内容

    getRightHref();

    window.onscroll = function() { setTimeout(function() { getRightHref(); }, 500); }

    /// 知乎
    function getRightHrefForZhiHu() {
        /// 获取所有 a 标签
        var documents = document.getElementsByTagName("a");
        for (var i = 0; i < documents.length; i++) {if (documents[i].href.indexOf("link.zhihu.com") != -1) { documents[i].setAttribute("href",decodeURIComponent(documents[i].href.split("target=")[1])) } }
    }

    /// 简书
    function getRightHrefForJianShu() {

        var documents = document.getElementsByTagName("a");
        for (var i = 0; i < documents.length; i++) {if (documents[i].href.split("http").length > 2) {documents[i].setAttribute("href",decodeURIComponent("http" + documents[i].href.split("http")[2]))}}
    }

    /// 获取正确的地址用于跳转
    function getRightHref() {
        var documents = document.getElementsByTagName("a");
        for (var i = 0; i < documents.length; i++) {if (documents[i].href.split("http").length > 2) {documents[i].setAttribute("href",decodeURIComponent("http" + documents[i].href.split("http")[2]))}}

        //getRightHrefForZhiHu();
        //getRightHrefForJianShu();
    }

})();
