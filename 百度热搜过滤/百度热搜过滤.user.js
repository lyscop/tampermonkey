//更新前务必备份好自己的敏感词！！！
// ==UserScript==
// @name         百度热搜过滤
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  百度热搜关键词屏蔽，匹配到设定的关键词后，对应热搜会隐藏
// @author       who
// @match        https://www.baidu.com/*
// @grant        unsafeWindow
// ==/UserScript==
 
(function() {
    'use strict';
    function checkword(k){
        //敏感词可以按照如下形式添加，逗号和引号需要为英文格式，不需要的敏感词可以删除
        var banned_list = ["男","女","恋","美国","特朗"]
        for (let i = 0; i < banned_list.length; i++){
            if (k.indexOf(banned_list[i])>-1){
                return true;
            }
        }
    }
     function doit(){
     var tble=document.getElementsByClassName("c-table opr-toplist1-table")[0].children[0]
     var b=tble.rows.length
     var state=document.getElementsByClassName("cr-content  new-pmd").length
     if(state>0){
         for(var i=0;i<b;i++){
             const c=tble.children[i]
             const txt=c.children[0].children[1].innerHTML
             const result=checkword(txt)
             if (result){
                 c.style="display:none"
             }
         }
 
     }
     else{
         for(var l=0;l<b;l++){
             const c=tble.children[l]
             const txt=c.children[0].children[0].children[1].innerHTML
             const result=checkword(txt)
             if (result){
                 c.style="display:none"
             }
         }
     }
     }
    let $ = unsafeWindow.jQuery
    $(document).ajaxComplete(function() {
    doit()
});
    doit();
 
    // Your code here...
})();
