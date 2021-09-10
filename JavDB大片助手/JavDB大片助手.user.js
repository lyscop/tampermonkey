// ==UserScript==
// @name         JavDB大片助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  点击页面上方开始按钮，一键显示当前页面番号评分及人数，突出显示人气作品
// @author       dee949
// @grant        none
// @include     *://*javdb.com/*
// ==/UserScript==

(function() {
    'use strict';

    $(".navbar-start").append("<input type=\"button\" id=\"btn1\" value=\"      开始      \"/>");
    $.ajaxSettings.async=false;
    $("#btn1").click(function(){
        (this).value="      已完成      ";
        doit();
        set_css();
    });

    function set_css(){
        $(".class01").css({fontSize:"16px",color:"#ffffff",background:"#27408B"});
        $(".class02").css({fontSize:"16px",color:"#ffffff",background:"#CD2626"});
    }

    function doit(){
        $("a.box").each(function(){
            var s = $(this).attr('href');
            var res_data = getdata(s);
            if( res_data[2] < 30){
            }
            else{
                if(res_data[2] >= 30){
                    (this).style.background = "#ffecec";
                }
                if(res_data[2] >= 60){
                    (this).style.background = "#ffd2d2";
                }
                if(res_data[2] >= 90){
                    (this).style.background = "#ffb5b5";
                }
                if(res_data[2] >= 120){
                    (this).style.background = "#ff9797";
                }
                if(res_data[2] >= 150){
                    (this).style.background = "#ff7575";
                }
                if(res_data[2] >= 180){
                    (this).style.background = "#ff5151";
                }
                if(res_data[2] >= 240){
                    (this).style.background = "#ff44ff";
                }
                if(res_data[2] >= 320){
                    (this).style.background = "#ff00ff";
                }
                if(res_data[2] >= 500){
                    (this).style.background = "#e800e8";
                }
            }
            if(res_data[1] && res_data[2]){
                $(this).append("<span class=\"class02\"> " + res_data[2] + " </span>");
                $(this).append("<span> </span>");
                $(this).append("<span class=\"class01\"> " + res_data[1] + " </span>");
            }
        })
    }

    function getdata(s){
        var http_prefix = "https://javdb.com";
        var http_reqs = http_prefix + s;
        var ret_ar = new Array();
        $.get(http_reqs,function(data,status){
            var score = String(data.match(/(?=\d).*(?= users)|(?=\d).*(?=人評價)/));
            if(!(score&&score!='null')){
                score = "0.0, by 0";
            }
            ret_ar[1] = get_s(score);
            ret_ar[2] = get_n(score);
        });
        return ret_ar;
    }

    function get_s(res_data){
        return Number(res_data.match(/\d.*.(?=, by)|\d.*.(?=分,)/));
    }

    function get_n(res_data){
        return Number(res_data.match(/(?<=by ).*$|(?<=由).*$/));
    }

})();
