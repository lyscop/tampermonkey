// ==UserScript==
// @name         百度搜索结果屏蔽csdn博客
// @namespace    gcud
// @version      20200119
// @description  csdn让我不爽很久了,尤其是是它的博客会导致不能用鼠标关闭网页,那我干脆就屏蔽你
// @author       gcud
// @match        https://www.baidu.com/s?*
// @grant        none
// ==/UserScript==
function HideCSDN(){
let Elements=document.querySelectorAll(".result.c-container ");
Elements.forEach(function(Item){
    let Content=Item.querySelector(".f13 a:first-child").innerText;
    if(Content==="CSDN技术社区"){
    Item.style.display="none";
    }
});
}
HideCSDN();
setInterval(function(){
    HideCSDN();
},1000);
