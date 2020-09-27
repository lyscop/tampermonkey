// ==UserScript==
// @name         大力盘\小白盘 自动跳转
// @namespace    https://jingmatrix.github.io/
// @version      1.3
// @description  自动跳转大力盘\小白盘详情页面到百度云盘链接，省去可能的扫码环节
// @author       JingMatrxi
// @match        https://www.dalipan.com/detail/*
// @match        https://www.xiaobaipan.com/file*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
      if(document.location.href.includes("xiaobaipan.com")){
          document.location.href = $("#rel-url a").attr("href");
      } else if(document.location.href.includes("dalipan.com")){
          if (window.__NUXT__.data['0'].pwd) {
              navigator.clipboard.writeText(window.__NUXT__.data['0'].pwd);
              alert("链接提取码已复制到剪贴板");
          };
          window.location.href = window.__NUXT__.data['0'].url
      }
})();
