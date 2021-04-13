// ==UserScript==
// @name 微博视频取消自动播放下一个视频
// @namespace http://tampermonkey.net/
// @version 0.1.1
// @description 微博视频取消自动播放
// @author 王泥巴
// @grant none
// @icon https://weibo.com/favicon.ico
// @include https://weibo.com/*
 
// ==/UserScript==
 
 
setInterval(function () {
var next_close = document.querySelector('a[action-type="next_close"]')
if (next_close){
next_close.click();
}
    var video_box_more = document.querySelector('div.video_box_more')
    if (video_box_more){
        video_box_more.remove();
    }
}, 1000);
