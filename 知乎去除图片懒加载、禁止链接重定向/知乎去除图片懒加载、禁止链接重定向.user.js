// ==UserScript==
// @name         知乎去除图片懒加载、禁止链接重定向
// @namespace https://greasyfork.org/users/2646
// @version      0.3
// @description  f**k zhihu!
// @author       https://clso.fun
// @contributionURL    https://clso.fun/donate/
// @contributionAmount 6.66
// @match        http://*.zhihu.com/*
// @match        https://*.zhihu.com/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/1.9.1/jquery.min.js
// @run-at       document-end
// ==/UserScript==
 
(function() {
    'use strict';
 
    var cleardoc = function(doc) {
        doc.querySelectorAll("a").forEach(function(e){
            var regRet = e.href.match(/target=(.+?)(&|$)/);
            if(regRet && regRet.length==3){
                e.href = decodeURIComponent(regRet[1]);
            }
        });
 
        $("img.lazy").each(function(){
            var orig = this.getAttribute("data-original");
            var hd = this.getAttribute("data-actualsrc");
            this.src = (orig) ? orig : hd;
            this.setAttribute("data-lazy-status", "ok");
        }).removeClass("lazy");
 
    };
 
    //cleardoc(document);
 
    $("body").bind("DOMNodeInserted", function(e) {
        cleardoc(e.target);
    });
 
})();
