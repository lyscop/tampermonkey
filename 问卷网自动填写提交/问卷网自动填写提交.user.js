// ==UserScript==
// @name         问卷网自动填写提交
// @namespace    https://juzibiji.top
// @version      1.0.0
// @description  自动填写问卷并提交
// @author       桔子
// @match        https://www.wenjuan.com/s/*
// @grant        none
// ==/UserScript==
 
(function() {
    'use strict';
 
    $(".wjques.maxtop.question").each((index,item)=>{
        let ans = $(item).find("input")
        if(ans.eq(0).attr("type")=="radio"){
            ans.eq(randomNum(0,ans.length-1)).attr("checked",true);
        }else{
            let num = randomNum(2,3)
          for(let i=0;i<num;i++){
               ans.eq(randomNum(0,ans.length-1)).attr("checked",true);
          }
        }
 
         setTimeout(function(){
             // 延时两秒防止验证
             document.getElementById("next_button").click();
             console.log("答题成功!");
         },2000);
 
        setTimeout(function(){
            location.reload();
        },4000)
    })
})();
 
function randomNum(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
        break;
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
        break;
            default:
                return 0;
            break;
    }
}
