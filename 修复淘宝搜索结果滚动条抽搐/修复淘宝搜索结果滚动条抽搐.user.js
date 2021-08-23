// ==UserScript==
// @name         修复淘宝搜索结果滚动条抽搐
// @namespace    https://greasyfork.org/zh-CN/users/193133-pana
// @homepage     https://greasyfork.org/zh-CN/users/193133-pana
// @version      1.0.2
// @description  临时修复淘宝搜索结果滚动条无限抽搐的问题
// @author       pana
// @license      GNU General Public License v3.0 or later
// @match        *://s.taobao.com/search*
// @require      https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @icon         https://icons.duckduckgo.com/ip2/taobao.com.ico
// @grant        none
// ==/UserScript==
 
(function () {
  'use strict';
 
  const main = document.getElementById('main');
  if (main) {
    main.arrive(
      '#mainsrp-header',
      {
        fireOnAttributesModification: true,
        onceOnly: true,
        existing: true,
      },
      item => {
        const jClose = item.querySelector('.J_Close');
        jClose && jClose.click();
      }
    );
  }
})();
