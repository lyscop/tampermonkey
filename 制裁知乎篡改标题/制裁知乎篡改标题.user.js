// ==UserScript==
// @name        制裁知乎篡改标题
// @namespace   Violentmonkey Scripts
// @match       http*://*.zhihu.com/*
// @grant       none
// @version     1
// @author      -
// @description 众所周知，恼人的知乎，总是会给它旗下的大部分网页的标题加上一个(xx 封私信 / xx 条消息)的前缀，由于万恶的main.app.cf533f9cb2f8a9c4cd00.js这个文件所造成的。本脚本制裁了知乎这种卑鄙的行径。建议电脑端使用。这个脚本永久开源和免费。
// @icon         https://bbs.mountblade.com.cn/uc_server/images/noavatar_small.gif
// @run-at document-start The script will be injected as fast as possible.
// ==/UserScript==
 
// identify an element to observe
 
var originalInnerHTML=document.getElementsByTagName("title")[0].innerHTML;  //抢先获得原始标题内容
var elementToObserve = window.document.getElementsByTagName("title")[0];
 
// create a new instance of 'MutationObserver' named 'observer', 
// passing it a callback function
observer = new MutationObserver(function(mutationsList, observer) {
    console.log(mutationsList);
    var titleElement=document.getElementsByTagName("title")[0];
    titleElement.innerHTML=originalInnerHTML;
    observer.disconnect();//stop the MutationObserver
});
 
// call 'observe' on that MutationObserver instance, 
// passing it the element to observe, and the options object
observer.observe(elementToObserve, {characterData: false, childList: true, attributes: false});
