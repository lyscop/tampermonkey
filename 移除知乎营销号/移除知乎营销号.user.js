// ==UserScript==
// @name         移除知乎营销号
// @namespace    https://960960.xyz
// @version      0.5
// @description  从回答结果中移除包含公众号、微信、咨询、中介、资料、关注、扫码等字眼的结果
// @author       Troye Guo
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @match        https://*.zhihu.com/*
// @grant        none
// ==/UserScript==
 
(function () {
  "use strict";
  if (window.top != window.self) {
    return;
  }
  var window_url = window.location.href;
  var keywords = ["微信", "公众号", "咨询", "资料", "中介", "关注","点击","加入"];
  var moreArr = [];
  if (window_url.indexOf("https://www.zhihu.com/question/") != -1) {
    hideFromAnswerResult();
    addEventListener("scroll", hideFromAnswerResult);
  }
  function hideFromAnswerResult() {
    var viewAll = $(".ViewAll-QuestionMainAction")[0];
    if (viewAll) {
      viewAll.click();
    }
   $(".Button.ContentItem-more.Button--plain").click();
    var moreAnswers = $(".List-item");
    if (moreAnswers[0]) {
      for (var i = 0; i < moreAnswers.length; i++) {
        for (var j = 0; j < keywords.length; j++) {
          if (moreAnswers[i].innerText.indexOf(keywords[j]) > -1) {
            moreAnswers[i].style.display = "none";
          }
        }
      }
    }
  }
})();
