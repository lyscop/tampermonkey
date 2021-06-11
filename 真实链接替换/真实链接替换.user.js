// ==UserScript==
// @name         真实链接替换
// @namespace    https://www.frank6.com/
// @version      0.4
// @description  将页面中所有链接文本为网址，href却不一致的a标签替换的小工具
// @author       Frank6
// @grant        none
// @include      http*
// ==/UserScript==
(function() {
    'use strict';
    let urlArr = document.getElementsByTagName('a');
 
    for(let item of urlArr){
        let regex = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
        if(regex.test(item.text)){
            item.href = item.text;
        }
    }
})();

