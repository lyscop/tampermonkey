// ==UserScript==
// @namespace   https://greasyfork.org/users/39670
 
// @name  百度Baidu网盘HTTP转HTTPS
// @description 将百度网盘的链接(http://pan.baidu.com/)转换为HTTPS协议(https://pan.bidu.com)，可以直接下载大文件。
 
// @author      Netplaier
// @version     1.01
// @license     LGPLv3
 
// @include     http://pan.baidu.com/*
// @include     http://yun.baidu.com/*
 
// @grant       none
 
// @icon        https://pan.baidu.com/res/static/images/favicon.ico
 
// ==/UserScript==
 
 
(function(){
  var debug = 0;
  var new_location = location.href.replace(/http\:/, 'https:');
  if ( debug > 0 ) {
    alert(  "Hash:     "+location.hash+
          "\nHost:     "+location.host+
          "\nHostname: "+location.hostname+
          "\nHREF:     "+location.href+
          "\nPathname: "+location.pathname+
          "\nPort:     "+location.port+
          "\nProtocol: "+location.protocol+
          "\n"+
          "\nNew Location: "+new_location);
  };
  location.href = new_location;
})();
