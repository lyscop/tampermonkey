// ==UserScript==
// @name         CSDN不登录查看全文&CSDN移除广告
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  CSDN越来越流氓了，不登录只能查看文章的开头部分。但是其实这只是一个前端限制，文章的数据已经全部加载好了，所以可以通过脚本来让CSDN文章无所遁形。顺便移除了一下讨厌的广告。
// @author       Inoria
// @match        https://blog.csdn.net/*
// @match        http://blog.csdn.net/*
// @require      http://libs.baidu.com/jquery/1.7.2/jquery.min.js
// @grant        none
// ==/UserScript==

//deprecated
$("#article_content").css("overflow", "overlay");
$("#article_content").css("height", "auto");
$("article.baidu_pl > div.hide-article-box").remove();

//new
$("main > div.blog-content-box").css("overflow", "overlay");
$("main > div.blog-content-box").css("height", "auto");
$("main > div.hide-article-box").remove();

$("div.pulllog-box").remove();
$("div.container > aside > div:eq(1)").remove();
$("#asideFooter > .aside-box:eq(0)").remove();
$("li.bdsharebuttonbox").remove();
$("#dmp_ad_58").remove();
$("div.recommend-box > div.recommend-ad-box").remove();
$("div.indexSuperise").remove();

function removeRecommandAds() {
    var lastLength = $("div.recommend-box").children().size();
    for(var i = 0; i < lastLength; i++) {
        var content = $("div.recommend-box > div").eq(i).find("div.content > a").attr("title");
        if(content === null || content === undefined) {
            $("div.recommend-box > div").eq(i).remove();
            i--;
            lastLength--;
        }
    }
}

setTimeout(removeRecommandAds, 2333);
