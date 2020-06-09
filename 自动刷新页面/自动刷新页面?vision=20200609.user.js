// ==UserScript==
// @name         自动刷新页面
// @namespace    http://oixm.cn/
// @version      1.0
// @description  每隔一段时间自动刷新页面，可自定义刷新间隔时间，适合挂机、PT 等需要保持心跳的网页
// @author       oixm
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var title, time;



    config(ready);


    // 配置
    function config(callback) {

        if (!sessionStorage.oixmRefreshTime) {
            document.body.addEventListener('keydown',function(event){
                var keynum;
                if(window.event) // IE
                {
                    keynum = event.keyCode;

                }
                else if(event.which) // Netscape/Firefox/Opera
                {
                    keynum = event.which;
                }

                //console.log(event.keyCode)
                if(keynum==73&&event.altKey){
                    time = parseInt(prompt("请设置要自动刷新的间隔时间（秒）：", 60));
                    if (isNaN(time)) return;
                    sessionStorage.oixmRefreshTime = time;

            }});
        } else {
            time = parseInt(sessionStorage.oixmRefreshTime);
            document.body.addEventListener('keydown',function(event){
                var keynum;
                if(window.event) // IE
                {
                    keynum = event.keyCode;

                }
                else if(event.which) // Netscape/Firefox/Opera
                {
                    keynum = event.which;
                }

                //console.log(event.keyCode)
            if(keynum==85&&event.altKey){
//                sessionStorage.clear();
                sessionStorage.removeItem('oixmRefreshTime');
//                console.log(time)
                console.log(sessionStorage)
//            } else if (keynum==76&&event.altKey) {
//                console.log(sessionStorage)
            }


            });
        }
        callback();

    }

    // Ready
    function ready() {
        title = document.title;
        loop();
    }

    // 循环时间
    function loop() {
        document.title = "[" + formatTime(time) + "] " + title;
        if (time === 0) {
            location.reload();
            return;
        } else if (sessionStorage.oixmRefreshTime == null){
            document.title = title;
        }

        time--;
        setTimeout(loop, 1000);
    }

    // 格式化时间
    function formatTime(t) {
        if (isNaN(t)) return "";
        var s = "";
        var h = parseInt(t / 3600);
        s += (pad(h) + ":");
        t -= (3600 * h);
        var m = parseInt(t / 60);
        s += (pad(m) + ":");
        t -= (60 * m);
        s += pad(t);
        return s;
    }

    // 补零
    function pad(n) {
        return ("00" + n).slice(-2);
    }

})();
