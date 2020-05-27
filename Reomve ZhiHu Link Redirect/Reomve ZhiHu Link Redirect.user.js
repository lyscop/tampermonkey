// ==UserScript==
// @name         Reomve ZhiHu Link Redirect
// @namespace    https://greasyfork.org/users/20921
// @version      0.3
// @description  去除知乎链接的重定向
// @author       roshanca
// @match        http://*.zhihu.com/*
// @match        https://*.zhihu.com/*
// @icon         https://pic1.zhimg.com/2e33f063f1bd9221df967219167b5de0_m.jpg
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var DOMObserverTimer = null;
    var DOMObserverConfig = {
        attributes: true,
        childList: true,
        subtree: true
    };
    var DOMObserver = new MutationObserver(function () {
        if (DOMObserverTimer) {
            clearTimeout(DOMObserverTimer);
        }
        DOMObserverTimer = setTimeout(function () {
            DOMObserver.disconnect();
            handleLinks();
            DOMObserver.observe(document.body, DOMObserverConfig);
        }, 100);
    });
    DOMObserver.observe(document.body, DOMObserverConfig);

    // first run
    handleLinks();

    // cache
    var processedLinks = new WeakMap();

    var handleLinks = function () {
        var allLink = document.querySelectorAll('a.external, a.LinkCard');

        if (!allLink.length) return;

        for (var i = 0, len = allLink.length; i < len; i++) {
            var link = allLink[i];
            if (processedLinks.has(link)) {
                continue;
            } else {
                processedLinks.set(link, 1);
                replaceLink(link);
            }
        }
    };

    var replaceLink = function(link) {
        var href = link.href;
        var regRet = href.match(/target=(.+?)(&|$)/);
        var newHref = href;

        if (regRet && regRet.length === 3) {
            newHref = decodeURIComponent(regRet[1]);
        }

        link.href = newHref;
    };
})();
