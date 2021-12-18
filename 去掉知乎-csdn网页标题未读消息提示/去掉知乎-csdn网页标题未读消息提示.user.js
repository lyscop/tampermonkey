// ==UserScript==
// @name        去掉知乎/CSDN网页标题未读消息提示
// @namespace   Violentmonkey Scripts
// @home-url    https://greasyfork.org/zh-CN/scripts/435087
// @match       https://*.zhihu.com/*
// @match       https://*.csdn.net/*
// @grant       none
// @version     2.4
// @author      -
// @description 去掉那些该死的消息提示！
// @icon        https://tikolu.net/i/hfgls
// @license     GNU GPLv3
// ==/UserScript==
 
title = document.getElementsByTagName("title")[0];
setInterval(function(){  //定时循环执行
  title.innerText = title.innerText.match(/(\([0-9]+.*(?=私信|消息).*?\)\s*)?(.+)/)[2];
},100);//定时100ms
