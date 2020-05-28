// ==UserScript==
// @name         双击关闭页面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  双击页面任意位置即可关闭页面
// @author       inch
// @match        http*://*/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        window.close
// ==/UserScript==

(function () {
    document.addEventListener('dblclick', function (e) {
        window.close();
    });
})();
