// ==UserScript==
// @name         百度文库允许复制
// @namespace    https://greasyfork.org/zh-CN/users/412790-smoke-n-mirrors
// @version      1.2
// @description  破解百度文库的禁止复制限制, because it's your web!
// @author       Permission
// @match        https://wenku.baidu.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==
/*globals $,jQuery*/

GM_addStyle(`
#reader-helper-el
{
display:none;
}
`);
const init=()=> {
    $("[class='bd doc-reader']").removeAttr("oncopy");
}
window.onload=()=> {
    init();
}
