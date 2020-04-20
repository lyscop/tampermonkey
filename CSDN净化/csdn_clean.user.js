// ==UserScript==
// @name         CSDN 净化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去除CSDN多余的广告侧边栏信息，阅读全文自动展开
// @author       贺墨于
// @match        *://*.csdn.net/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// ==/UserScript==

var gList = [];

$(function(){
    push('.aside-box');
    push('.recommend-box');
    push('.template-box');
    execHidden();
    fitContent();
})

function fitContent(){
    $('.hide-article-box').remove();
    $('#mainBox main').css('cssText', 'width:100% !important');
    $('#article_content').css('height','auto');
    setTimeout(function(){
        $('.tool-box.vertical').css('right', '33px');
        $('div.csdn-side-toolbar').css('right', '33px');
    }, 1000);
}

function execHidden(){
    for(var i = 0; i < gList.length; i++){
        hidden(gList[i]);
    }
}

function push(content){
    gList.push(content);
}

function log(msg){
    console.log(msg);
}

function hidden(obj){
    if(typeof(obj)=== 'string'){
        obj = $(obj);
    }
    obj.css('display', 'none')
}
