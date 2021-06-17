// ==UserScript==
// @name         知乎屏蔽用户
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽特定知乎用户的答案
// @author       MeursaulT
// @match        https://www.zhihu.com/*
// @grant        none
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 将想要屏蔽的用户写入userList即可
    var userList = ['你想屏蔽的人1','你想屏蔽的人2']
    var answers = document.getElementsByClassName('ContentItem AnswerItem')
    function deleteAns(){
        for(var i = 0 ; i < answers.length ; i++){
            for(var j = 0 ; j < userList.length ; j++){
                if(answers[i].dataset.zop.includes(userList[j])){
                    answers[i].remove()
                }
            }
        }
    }
    (function(open) {
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("readystatechange", function() {
                deleteAns();
            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);
 
})();
