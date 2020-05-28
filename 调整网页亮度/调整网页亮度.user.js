// ==UserScript==
// @name         调整网页亮度
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  调整网页亮度,护眼
// @description:en  Adjust page brightness,eyeshield
// @author       wodexianghua
// @match        http://*/*
// @match        https://*/*
// @match        file:///*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
    'use strict';
    //保证iframe不起作用
    if (self == top) {
        var timer = null;
        var mousemove = false;
        var liangduui;
        var liangduuitz;
        var liangduuitzmouse;
        var __nightingale_view_cover;

        function insertHTML(lv) {
            if (self == top) {
                document.body.insertAdjacentHTML("beforebegin",
                    ' +
                    lv + ';"></div>');
            }

            liangduui = document.querySelector(".liangduui");
            liangduuitz = document.querySelector(".liangduuitz");
            liangduuitzmouse = document.querySelector(".liangduuitzmouse");
            __nightingale_view_cover = document.querySelector("#__nightingale_view_cover");

            liangduui.style.top = ((window.innerHeight / 2) - (liangduui.style.height.replace("px", "")/2)) + "px";
            liangduui.style.left = ((window.innerWidth / 2) - (liangduui.style.width.replace("px", "")/2)) + "px";
            
            liangduuitzmouse.addEventListener('mousedown', function (event) {
                mousemove = true;
                liangduuitz.style.height = (100 - (event.clientY - liangduui.offsetTop - liangduuitzmouse.offsetTop)) + "%"
                lv = (event.clientY - liangduui.offsetTop - liangduuitzmouse.offsetTop) / 100;
                GM_setValue("lv", lv);
                __nightingale_view_cover.style.opacity = lv
            });

            liangduuitzmouse.addEventListener('mousemove', function (event) {
                if (!mousemove) return;
                if (liangduuitz.offsetTop <= 0 || liangduuitz.offsetTop > 100) return;
                liangduuitz.style.height = (100 - (event.clientY - liangduui.offsetTop - liangduuitzmouse.offsetTop)) + "%"
                lv = (event.clientY - liangduui.offsetTop - liangduuitzmouse.offsetTop) / 100;
                GM_setValue("lv", lv);
                __nightingale_view_cover.style.opacity = lv
            });

            liangduuitzmouse.addEventListener('mouseup', function (event) {
                mousemove = false;
            });
        }

        if (GM_getValue("lv") == undefined) {
            GM_setValue("lv", '0.35');
        }

        document.addEventListener('keydown', function (event) {
            if (event.altKey && event.which == 40) {
                var lv = parseFloat(GM_getValue("lv"));
                lv += 0.02;
                if (lv > 1.0) lv = 1.0;
                GM_setValue('lv', lv);
                __nightingale_view_cover.style.opacity = lv;
                liangduui.style.display = "block";
                liangduuitz.style.height = (100 - (lv * 100)) + "%";
                window.clearTimeout(timer);
                timer = setTimeout(function () {
                    liangduui.style.display = "none";
                }, 2000);
            } else if (event.altKey && event.which == 38) {
                var lv = parseFloat(GM_getValue("lv"));
                lv -= 0.02;
                if (lv < 0) lv = 0;
                GM_setValue("lv", lv);
                __nightingale_view_cover.style.opacity = lv;
                liangduui.style.display = "block";
                liangduuitz.style.height = (100 - (lv * 100)) + "%";
                window.clearTimeout(timer);
                timer = setTimeout(function () {
                    liangduui.style.display = "none";
                }, 2000);
            } else if (event.ctrlKey && event.altKey && event.which == 83) {
                liangduuitz.style.height = (100 - (GM_getValue("lv") * 100)) + "%"
                liangduui.style.display = "block";
            }
        });

        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState == 'hidden') { //状态判断

            } else {
                var lv = parseFloat(GM_getValue("lv"));
                if (document.querySelector("#__nightingale_view_cover") == null) {
                    insertHTML(GM_getValue("lv"));
                }
                GM_setValue("lv", lv);
                document.querySelector("#__nightingale_view_cover").style.opacity = lv
            }
        });

        document.body.addEventListener('click', function () {
            liangduui.style.display = "none";
            mousemove = false;
        });

        // window.addEventListener("storage", function(event) {
        //     console.log(event.key + '=' +event.newValue);
        // });

        setTimeout(insertHTML(GM_getValue("lv")), 300);
    }

    // Your code here...
})();
