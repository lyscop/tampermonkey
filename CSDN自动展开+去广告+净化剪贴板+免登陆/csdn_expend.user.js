// ==UserScript==
// @name         CSDN自动展开+去广告+净化剪贴板+免登陆
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  ITeye CSDN自动展开阅读，可以将剪贴板的推广信息去除，去除大多数广告。
// @author       whoami
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @match        *://bbs.csdn.net/topics/*
// @match        *://*.iteye.com/blog/*
// @grant        none
// @icon         https://csdnimg.cn/public/favicon.ico
// @run-at       document-end
// ==/UserScript==


// 根据网速自己设置时间间隔
var interval = 3000;
var sideInterval = 4000;
var bbsInterval = 3000; // 在ADBlock之后运行
var iteyeInterval = 100;

(function () {
    'use strict';
    var currentURL = window.location.href;
    var blog = /article/;
    var bbs = /topics/;
    var iteye = /iteye/;
    //若为CSDN论坛,则：
    if(bbs.test(currentURL)){
        setTimeout(function () {
            $(".js_show_topic").click();
            document.getElementsByClassName("pulllog-box")[0].remove(); // 底部广告
            $(".mediav_ad").remove();       // 帖子尾部广告
            $(".post_recommend").remove();  // 帖子内[CSDN推荐]
            $(".ad_item").remove(); // 右侧广告
        }, bbsInterval);
    }else if (blog.test(currentURL)){
        csdn.copyright.init("", "", ""); //去除剪贴板劫持
        localStorage.setItem("anonymousUserLimit", ""); // 免登陆
        if (document.getElementsByClassName("btn-readmore")[0]){
            document.getElementsByClassName("btn-readmore")[0].click();
        } //自动展开
        if (document.getElementsByClassName("hide-article-box")[0]){
            document.getElementsByClassName("hide-article-box")[0].remove();
            document.getElementById("content_views").setAttribute("style", "user-select: text;")
        } //移除专栏
        if (document.getElementsByClassName("comment-list-box")[0]){
            document.getElementsByClassName("comment-list-box")[0].removeAttribute("style");
        } //自动展开
        $("#content_views").unbind("click");//移除url拦截
        setTimeout(function () {
            if (document.getElementsByClassName("csdn-tracking-statistics mb8 box-shadow")[0]) {
                document.getElementsByClassName("csdn-tracking-statistics mb8 box-shadow")[0].remove(); //左上广告
            }
            document.getElementById("asideFooter").remove();
            if (document.getElementById("adContent")) {
                document.getElementById("adContent").remove();
            }
            if (document.getElementsByClassName("p4course_target")[0]) {
                document.getElementsByClassName("p4course_target")[0].remove(); //左上广告
            }
            document.getElementsByClassName("bdsharebuttonbox")[0].remove();
            document.getElementsByClassName("vip-caise")[0].remove();
            if (document.getElementsByClassName("fourth_column")[0]) {
                document.getElementsByClassName("fourth_column")[0].remove(); //左上广告
            }
        }, interval);
        setTimeout(function () {
            if ($("div[id^='dmp_ad']")[0]) {
                $("div[id^='dmp_ad']")[0].remove();
            }
            if (document.getElementsByClassName("fourth_column")[0]) {
                document.getElementsByClassName("fourth_column")[0].remove();
            }
        }, sideInterval);
        setTimeout(function () {
            if (document.getElementsByClassName("pulllog-box")[0]) {
                document.getElementsByClassName("pulllog-box")[0].remove(); // 底部广告
            }
            var recommendObj = document.getElementsByClassName("recommend-fixed-box")[0].getElementsByClassName("right-item");
            for (var h = (recommendObj.length - 1); h>=0; h--) {
                if (recommendObj[h].tagName == "DIV") {
                    recommendObj[h].remove();
                }
            }
            if (document.getElementsByClassName("p4course_target")[0]) {
                document.getElementsByClassName("p4course_target")[0].remove();
            }
        }, sideInterval);
        setTimeout(function () {
            var hot = document.getElementsByClassName("type_hot_word");
            var recommend = document.getElementsByClassName("recommend-ad-box");
            for (var i = (hot.length - 1); i >= 0; i--) {
                hot[i].remove();
            }
            for (var j = (recommend.length - 1); j >= 0; j--) {
                recommend[j].remove();
            }
            if (document.getElementsByClassName("fourth_column")[0]) {
                document.getElementsByClassName("fourth_column")[0].remove();
            }
        }, sideInterval);
        setTimeout(function () {
            for(var x=470; x<490; x++){
                var kp_box = document.getElementById("kp_box_"+x); //右侧广告
                if(kp_box) {
                    kp_box.remove();
                }
            }
        }, 5000);
    } else if (iteye.test(currentURL)) {
        setInterval(function(){
            document.getElementById('btn-readmore').click();
        }, iteyeInterval);
        setTimeout(function () {
            document.getElementsByClassName("blog-sidebar")[0].remove();
            document.getElementById('main').style.width = '1000px';
        }, sideInterval);
    }
})();
