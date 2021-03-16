// ==UserScript==
// @name         双击输入框显示密码
// @namespace    www.qqkzw.com
// @version      2.1.1
// @description  鼠标双击密码输入框，显示出密码，单击则隐藏密码。
// @author       Horjer
// @include      http*://*
// @run-at	 document-end
// ***********************************特此声明***********************************************
// 该脚本完全免费，仅供学习使用，严谨倒卖！！！ 如果您是通过购买所得，请找卖家退款！！！
// 尊重作者权益，请勿在未经允许的情况下擅自修改代码和发布到其他平台!
// 作者: Horjer
// ****************************************************************************************
// ==/UserScript==
 
(function(window, self, unsafeWindow) {
    var inputs = document.getElementsByTagName("input");
    for (const input of inputs) {
        if(input.type === "password"){
            input.addEventListener("dblclick",function (){
                input.type = "text";
            });
            input.addEventListener("click",function (){
                input.type = "password";
            });
            input.addEventListener("blur",function (){
                input.type = "password";
            });
        }
    }
})();
