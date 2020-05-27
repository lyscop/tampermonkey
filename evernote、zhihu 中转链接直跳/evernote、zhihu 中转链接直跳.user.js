// ==UserScript==
// @name         evernote、zhihu 中转链接直跳
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  evernote 网页版点击链接中转页自动跳转
// @author       You
// @include      https://www.evernote.com/OutboundRedirect.action?dest=*
// @include      https://app.yinxiang.com/OutboundRedirect.action?dest=*
// @include      https://link.zhihu.com/?target=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var link = document.location + "";
    var key = "?dest=";
    if (link.indexOf("zhihu")>-1) {
        key = "?target=";
    }
    document.location = decodeURIComponent(document.location.search.replace(key, ""));
})();
