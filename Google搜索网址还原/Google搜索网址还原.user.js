// ==UserScript==
// @name     Google搜索网址还原/Change Google URL back
// @version  1.0.3
// @icon         https://www.iconfinder.com/icons/682665/download/png/32
// @description  将Google搜索结果隐藏不显示的url还原，让其继续显示。
// @author       Mrxn
// @homepage     https://mrxn.net/
// @namespace    http://tampermonkey.net/
// @include    /(http|https):\/\/www\.google\.(ca|co\.in|co\.uk|com|com\.br|de|es|fr|it|pl|ru)\/search\?/
// @grant    none
// ==/UserScript==
 
(function () {
    'use strict';
    Array.from(document.querySelectorAll('cite')).forEach(el => el.textContent = el.parentElement.parentElement.href);
    // forEach method, could be shipped as part of an Object Literal/Module
    var forEach = function (array, callback, scope) {
        for (var i = 0; i < array.length; i++) {
            callback.call(scope, i, array[i]); // passes back stuff we need
        }
    };
    // optionally change the scope as final parameter too, like ECMA5
    var all_cites = document.querySelectorAll('cite');
    forEach(all_cites, function (index) {
        all_cites[index].setAttribute("style", "word-break: break-word; white-space: pre-wrap;display: inline-block;");
    })
})();
