// ==UserScript==
// @name         WeiXinUrlAutoRedirect
// @namespace https://greasyfork.org/users/194463
// @version      0.1.1
// @description  微信打开的链接自动跳转
// @author       WayneShao
// @match        http*://*.weixin.qq.com/*
// ==/UserScript==

(function() {
    if(getQueryVariable('url'))
        window.location = decodeURIComponent(getQueryVariable('url'));
})();
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
