// ==UserScript==
// @name         批量删除微博授权
// @namespace    com.uestc.rjw
// @version      0.1
// @description  批量删除微博已经授权的应用
// @author       rjw
// @include      http://app.weibo.com/my*
// @grant        none
// @run-at       document-end
// ==/UserScript==

function deleteApp(){
    'use strict';
    var as = document.getElementsByTagName('a');
    for(let index = 0; index < as.length; ++index){
        if(as[index].innerText == '删除'){
            as[index].click();
            console.log('点击删除：'+index);
        }
    }
    var ccc = document.getElementsByClassName('W_btn_a');
    if(ccc.length > 0){
        for(let index = 0; index < ccc.length; ++index){
            ccc[index].click();
        }
        console.log('当前页已删除，10s后翻页');
        setTimeout(function(){
            window.location.reload();
        },10000);
    }
}
window.onload = deleteApp;
