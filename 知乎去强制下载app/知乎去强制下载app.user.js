// ==UserScript==
// @name         知乎去强制下载app
// @namespace    https://greasyfork.org/zh-CN/users/329780-zs6
// @version      1.8
// @description  知乎去强制下载app,评论关闭按钮优化单手操作
// @author       zs6
// @license      GPL-3.0-only
// @match        https://www.zhihu.com/*
// @grant GM_addStyle
// @run-at document-start
// ==/UserScript==

(function() {
    'use strict';
    function setUserAgent(window, userAgent) {
    if (window.navigator.userAgent != userAgent) {
        var userAgentProp = { get: function () { return userAgent; } };
        try {
            Object.defineProperty(window.navigator, 'userAgent', userAgentProp);
        } catch (e) {
            window.navigator = Object.create(navigator, {
                userAgent: userAgentProp
            });
        }
    }
}
    setUserAgent(window, 'Mozilla/5.0 (Windows Phone 10)');
    GM_addStyle(".MobileModal-closeButton { bottom:150px;top:initial;} .MobileModal-content--default {padding-top: 0px;}");
})();
