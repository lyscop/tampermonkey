// ==UserScript==
// @name         微博快转屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  辣鸡微博！
// @author       zycat
// @match        *://*.weibo.com/*
// @grant        none
// ==/UserScript==
 
(function() {
    'use strict';
   console.log('执行屏蔽开始。。。')
  setInterval(()=>{
      const s=document.querySelector('div[isfastforward="1"]');
      if(!!s){
      s.remove();
      console.log('移除了快转部分')
      }},5000)
})();
