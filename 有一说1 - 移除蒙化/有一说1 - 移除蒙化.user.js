// ==UserScript==
// @name         有一说1 - 移除蒙化
// @namespace    https://sleazyfork.org/zh-CN/users/193133-pana
// @version      1.0.0
// @description  移除蒙化处理，免登录查看原图
// @author       pana
// @match        *://www.avus.me/*
// @match        *://www.avny.in/*
// @license      GNU General Public License v3.0 or later
// @grant        none
// ==/UserScript==
 
(function() {
    'use strict';
    $('.img-polaroid').unwrap();
    $('.img-polaroid').removeClass('img-polaroid');
})();
