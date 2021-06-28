// ==UserScript==
// @name         网易云音乐禁用扫码登录
// @version      0.1
// @description  描述不能与名称相同
// @match        *://music.163.com/*
// @include      *://music.163.com/*
// @grant        none
// @run-at       document-end
// @license      WTFPL
// @namespace https://greasyfork.org/users/141
// ==/UserScript==

window.GDegradeConfig.degradeLogin = true;
