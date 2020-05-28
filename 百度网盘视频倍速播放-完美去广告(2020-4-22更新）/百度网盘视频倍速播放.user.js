// ==UserScript==
// @name         百度网盘视频倍速播放+完美去广告(2020/4/22更新）
// @namespace    http://tampermonkey.net/
// @version      0.91
// @description  去除百度云盘视频播放页产生的烦人的广告,考虑增加倍速播放按键放哪里，有利于用户体验，大家也可以给点意见
// @author       Shawsw  我的美文微信公众号  潇潇书旅   欢迎你！！！
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://code.jquery.com/jquery-latest.js
// @include      *://pan.baidu.com/disk/home*
// @include      *://yun.baidu.com/disk/home*
// @include      *://pan.baidu.com/s*
// @include      *://yun.baidu.com/s*
// @include      *://pan.baidu.com/play*

// ==/UserScript==
//var videoElement = document.getElementById("html5player_html5_api");


var bbsInterval = 500; // 在AD之后运行

(function() {
    'use strict';


    window.onload=function(){

     
        var btn_only_video = document.createElement("li");
        var btn_only_video_node=document.createTextNode("Only Video");
        btn_only_video.id='Only_Video_li';
        btn_only_video.className ='Only_Video_li_class';
        btn_only_video.appendChild(btn_only_video_node);

        var setpoint=document.getElementsByClassName("tips-ul")[0];
        if(setpoint)
        setpoint.appendChild(btn_only_video);



        //倍速播放标签
        var quick_ddiv = "<div > <font face='微软雅黑' color='#238E23' size=4>更多倍速选择： </font><select class='select_class_name'><option value=1 id ='select_option_1id' class='select_option_1'>1</option><option value=1.25 id ='select_option_1id' class='select_option_125'>1.25（慢推荐）</option><option value=1.3 id ='select_option_1id' class='select_option_1'>1.3</option><option value=1.5 id ='select_option_1id' class='select_option_1'>1.5</option><option value=1.8 id ='select_option_1id' class='select_option_1'>1.8</option><option value=2 class='select_option_2'>2</option><option value=2.6 class='select_option_25'>2.6（快推荐）</option><option value=3 class='select_option_3'>3</option><option value=4 class='select_option_4'>4</option></select></div>";

        //登录页面没了
        var login_div="
帐号密码登录


76486962@qq.com
••••••••••
下次自动登录

忘记密码？

"
        var login__div="
帐号密码登录


76486962@qq.com
••••••••••
下次自动登录

忘记密码？

"
        //if($(".header-login").length > 0){ $(".header-login").append(login__div); }




      

        //增加倍速播放按键vjs-control-bar
        $(".video-title").append(quick_ddiv);
        $(".select_class_name").change(function() {
            //获取下拉框选中项的value属性值
            window.videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate($(this).val());
        });


        //除烦人的标签广告
        setTimeout(function () {
            document.getElementsByClassName("privilege-box")[0].remove(); // 按键处广告
            $(".app-download").remove();       // 右上角app下载提醒
            $(".video-title-right").remove();//视频上边角广告
            $(".dis-footer").remove(); //尾部广告的剔除
            $(".top-right-box").remove();//开通会员广告
            $(".gOIbzPb").remove();//好书推荐广告
            //$(".video-toolbar").remove();//分享下载等等



        }, bbsInterval);


        $(".Only_Video_li_class").click(function(){
            if($(".other-video-box").is(':hidden')){
                //如果隐藏时。。。
                //$(".module-header-wrapper").show(); // 顶部菜单栏
                $(".video-toolbar-buttonbox").show(); // 视频下部菜单栏
                $(".other-video-box").show(); // 视频下部菜单栏
                $(".Only_Video_li_class").text("Only Video");
                $(".video-toolbar").remove();

            }else{
                //如果显示时。。。
                $(".module-header-wrapper").hide(); // 顶部菜单栏
                $(".video-toolbar-buttonbox").hide(); // 视频下部菜单栏
                $(".other-video-box").hide(); // 视频下部菜单栏
                $(".Only_Video_li_class").text("Other");



            }
        });


   //window.onload=function

    $(document).keydown(function(event){
        console.log("Key: "+event.keyCode);
        if (event.keyCode === 97) {

           down(1)
        }
        else if (event.keyCode === 98) {

            // 二倍

            return false;

        } else if (event.keyCode === 99) {

            // 三倍
            window.videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(3);
            return false;

        }


    });


    
    }

    // Your best code ...
})();
