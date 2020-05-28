// ==UserScript==
// @name        批量移除粉丝（QQ群：189574683）
// @namespace   wdssmq
// @description 批量移除新浪微博粉丝
// @include     http://weibo.com/*/fans*
// @version     1.0.0
// @grant       none
// ==/UserScript==
(function () {
  'use strict';

  var s = document.createElement("script");
  s.setAttribute("src", "https://lib.sinaapp.com/js/jquery/2.0.3/jquery-2.0.3.min.js");
  s.onload = function () {
    $(".opt_box .layer_menu_list").show();
    setInterval(function () {
      if ($('a[action-type="removeFan"]').length === 0)
        location.reload(true);
      if ($('.W_layer .W_btn_a').length === 0)
        $('a[action-type="removeFan"]')[0].click();
      else
        $('.W_layer .W_btn_a')[0].click();
    }, 379);
  }
  document.head.appendChild(s);
})();
