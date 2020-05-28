// ==UserScript==
// @name         让微博按正确的时间线排序
// @namespace    https://hehome.xyz/
// @version      0.1.2
// @icon         https://weibo.com/favicon.ico
// @description  自动切换到最新微博，恢复正确的时间线
// @author       hemengyang
// @match        https://weibo.com/*
// @match        https://www.weibo.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    var user_id = document.querySelector('a.gn_name').href.split('/')[3];
    var is_home = window.location.pathname.split('/')[3] == 'home';
    var is_new = window.location.search.indexOf('is_new') != -1;

    // 自动切换到最新微博
    if (is_home && !is_new) {
        window.location = '/home?is_new=1';
    }
    // 替换左上角的微博图标点击后网址为最新微博
    document.querySelector('a.box').setAttribute('href', '/u/' + user_id + '/home?is_new=1');
})();
