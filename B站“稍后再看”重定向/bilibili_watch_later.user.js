// ==UserScript==
// @id             BilibiliWatchlaterRedirect@Laster2800
// @name           B站“稍后再看”重定向
// @version        1.2.4
// @namespace      laster2800
// @author         Laster2800
// @description    B站“稍后再看”播放页重定向至常规播放页面
// @include        https://www.bilibili.com/watchlater/*
// @run-at         document-start
// ==/UserScript==

redirect()
window.onhashchange = redirect
function redirect() {
    var hash = location.hash
    if (hash && /^#\/(b|a)v/.test(hash.toLowerCase())) {
        var vid = hash.replace(/^#\//, '').replace(/(?<=\/)p(?=\d+$)/, '?p=')
        location.replace('https://www.bilibili.com/video/' + vid)
    }
}
