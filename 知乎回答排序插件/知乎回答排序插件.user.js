// ==UserScript==
// @name         知乎回答排序插件
// @namespace    https://github.com/discountry/zhihumarkdown
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @version      0.2
// @description  为知乎问题页面多添加两种排序方式
// @author       Discountry
// @match        https://www.zhihu.com/question/*
// @exclude      https://www.zhihu.com/question/*/answer/*
// @copyright    2017+, @余博伦
// ==/UserScript==
 
(function() {
    'use strict';
    var wrapper = $('#QuestionAnswers-answers');
    var toolbar = $('.QuestionButtonGroup');
    toolbar.width('36rem');
    toolbar.append($('<button id="orderByVote" class="Button Button--primary Button--green" type="button">按赞数排序</button>'));
    toolbar.append($('<button id="orderByComments" class="Button Button--primary Button--red" type="button">按评论数排序</button>'));
    // Your code here...
    var orderByVote = function(){
      wrapper.find('.List').html(wrapper.find('.List-item').sort(function(a, b) {
      return b.querySelector('.VoteButton--up').innerText - a.querySelector('.VoteButton--up').innerText;
      }));
    };
 
    var orderByComments = function () {
       wrapper.find('.List').html(wrapper.find('.List-item').sort(function(a, b) {
          return b.querySelector('.ContentItem-actions .Button--plain').innerText.replace(/ 条评论/g, '') - a.querySelector('.ContentItem-actions .Button--plain').innerText.replace(/ 条评论/g, '');
      }));
    };
    //event listeners
    $("#orderByVote").click(function(){
        orderByVote();
    });
    $("#orderByComments").click(function(){
        orderByComments();
    });
})();
