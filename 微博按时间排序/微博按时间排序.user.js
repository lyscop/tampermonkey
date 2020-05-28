// ==UserScript==
// @name 微博按时间排序
// @description 微博个人主页显示全部微博
// @version 2.0
// @include http://weibo.com/*
// @include http://www.weibo.com/*
// @grant none
// @run-at document-start
// @namespace https://greasyfork.org/users/23185
// ==/UserScript==

;(function(href,arg){
    (href.indexOf(arg) !== -1) || 
    (location.href = href + ((href.indexOf("?") === -1 ? "?" : "&") + arg))
})(location.href,"is_all=1");
