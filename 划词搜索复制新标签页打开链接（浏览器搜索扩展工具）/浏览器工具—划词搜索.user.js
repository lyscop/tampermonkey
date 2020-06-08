// ==UserScript==
// @name         浏览器工具—划词搜索
// @name:zh		 浏览器工具—划词搜索
// @version      1.0.0
// @namespace    http://tampermonkey.net/
// @description  划词搜索，默认默认自带百度搜索、Google搜索、微博搜索、百度翻译、豆瓣电影搜索、Chrome应用商店搜索引擎图标、默认自带复制、剪切、移除格式、新标签页打开链接功能图标。
// @author       12style
// @match        http://*/*
// @include      https://*/*
// @include      file:///*
// @run-at document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant		 GM_setClipboard
// @grant		 GM_info
// @grant        GM_openInTab
// ==/UserScript==

(function () {
    'use strict';
    var keyword = {
        beforePopup: function (popup) {
            var text = window.getSelection().toString().trim();
            GM_setValue('search', text);
            popup(text);
        },
        beforeCustom: function (custom) {
            var text = GM_getValue('search');
            GM_setValue('search', '');
            custom(text);
        },

    };




    var iconArray = [
        {
            name: '百度搜索',
            image: 'https://i.ibb.co/R9HMTyR/1-5.png',
            host: ['www.baidu.com'],
            popup: function (text) {
                open('https://www.baidu.com/s?wd=' + encodeURIComponent(text));
            }
        },
        {
            name: 'Google搜索',
            image: 'https://i.ibb.co/fxpm6Wc/image.png',
//            image: 'https://i.ibb.co/Pjbc7Hv/icons8-google-web-search-512.png',
            host: ['www.google.co.jp'],
            popup: function (text) {
                open('https://www.google.co.jp/search?q=' + encodeURIComponent(text));
            }
        },
        {
            name: '微博搜索',
            image: 'https://i.ibb.co/VC2HfBF/bnmabu2sfk4kus4dv6obkriqne-082bc03f376b8c0ffd7eff29bd9816871587215670-5-1-1.png',
            host: ['s.weibo.com'],
            popup: function (text) {
                open('https://s.weibo.com/weibo/' + encodeURIComponent(text));
            }
        },
        {
            name: '知乎',
            image:'https://i.ibb.co/PQ5xM2R/2-1.png',
            host: ['www.zhihu.com'],
            popup: function (text) {
                open('https://www.zhihu.com/search?type=content&q=' + encodeURIComponent(text));
            }
        },

        {
            name: '豆瓣图书',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAMBQTFRFAAAAWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEp08JwzQAAAEB0Uk5TAB9cZlJN/8wIJTUaS5UwgN/T1dfzagsVv5BIQFDP4MrO8o7jrPu7iC4Qt/ERcPlhAYPrabHhN3v49Pr22qSZeqkWK+0AAACGSURBVHicY2DAAIxMzAjAAhRgZUMC7EABDk4uBOAG6eHhRQA+kAA/m4CgEAgIi7CxQgRExcDGi0vgFJCUkgYBGVmYgBy7PAgoKEIEpJWUFfmBQEVVTV0DrFdTS1sHSOnq6XNAHG9gaGQMpExMzcBccyEhZQtLoDOsrG2EbIECTHZIwB7T8wBnLQ8Enf/6ngAAAABJRU5ErkJggg==',
            host: ['www.douban.com'],
            popup: function (text) {
                open('https://search.douban.com/book/subject_search?search_text=' + encodeURIComponent(text) + '&cat=1001');
            }
        },

        {
            name: 'chrome网上应用商店',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAblQTFRFAAAA421j4FxQ31dL3lNH3VJG3lJG31ZL4mti3VxQ3lhM3lVJ3lNH3lFF3VBE3U5C3U5C3U5C3lNGzVdK1FJF21RI3lRI3U1B3Es/3Es/3VBDR7R+gW9Pzk0/11FE3VNH3lJG3FNH21JE21VA3FQ/3FM+3FM93Vc95pNNJqdoKaJlplVB0U0/2VJFv2NuVIzvUo3vwp1k6Ks88rM797g7+708/MJDI6VmIaRkTYhXv0k7xVhVUI71To31TIz1TIz168BZ/cdC/shC/spC/8xEIaVkH6RjI6JifmtKcHq/TY31TIv1Sor0fp7C/s5I/85E/85DH6NjHqNiNJZdVIe5SYr0kKWz/s5G/85D/81CIKNkHKJhHKJhJ6RsTYz1Sor09MtS/85C/s1DH6JiGqJgGqJgGqFgJaVqPJi1OpOyTZdZ+s1G/81B/cxFJqFlGqFfGKFfF6BeGaFeGZVYpLJL/81B/cxD+MpLLKJmGaBeF6BdFqBdFZ5bSptP98xE/81B/cxB9MdMHp9gF59dFZ9cFJ9bE5dVxr1H/sxB/MtC+MlFIZpdGJ1cFpxaLZZS+cpD+8pC+clD78JIw+1U6gAAAJN0Uk5TAARAhaGhhEAEF6bz//////OmFxPS/////9ERA6H/////9vD/////oQIr9v//73hfXnfw///3LXv///9r2f//2mz///97pf//8nf///938f+jn//xZ/9r9P+db//+grOzev9sH/D//pBcW4768B8Bi///+vr//4wBB7X9//////20BxGB5v///+eCEQIhW3t6WiECbON5bQAAANBJREFUeJxjYMAGGJmYWVjZ2DlgfE4ubh5ePn4BQSEIX1hEVAwkIC4hKQXiS8vIyskrKCopq6iqqWsABTS1tHV09fQNDI2MTUzNgALmFpZW1ja2dvYOjk7OLkABVzd3D08vO28fXz9//wCgQGBQUHAIkB8aFu4fEQkUiIqOjomN8wmNT/CPSEwCCiSnpKampWdkZmVHJObkAgXy8gsKCguLiksiEkvLykEOqaisqq6uqa1LrG9ohDi1qbmlta09saOzC+aZ7p7evv4JEydh9TkAym8xvWYfqH4AAAAASUVORK5CYII=',
//            image: 'https://i.ibb.co/xqNGyXL/icons8-chrome-512-1.png',
            host: ['chrome.google.com'],
            popup: function (text) {
                open('https://chrome.google.com/webstore/search/' + encodeURIComponent(text) + '?utm_source=chrome-ntp-icon');
            }
        },

        {
            name: '复制',
//            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAJZQTFRFAAAAioqKhoaGhYWFhISEhYWFiIiIhISEhISEf39/gICAioqKf39/kJCQgICAgoKCgYGBh4eHf39/goKCh4eHf39/f39/h4eHgYGBjY2Ng4ODg4ODhoaGf39/goKChISEhoaGg4ODgICAf39/gICAgoKCh4eHg4ODhoaGhISEgoKCf39/goKCjo6OgICAf39/gYGBiIiIC5GKlgAAADJ0Uk5TAA+AmZlrQkWT/7OZ8kTLs+U7zLWB/fBa3y2f2cf+w3lzbnMza9zM2ntwreblKZaZmTzl/vXRAAAAbUlEQVR4nGNgIAYwMjGzsLKxIwQ4ODk5ubh5eOECfEABfm5OAUGYgBBQQFhElFNMHElAQlJKWloGSUBWTl5BQRFJAALgAkrKQKCCJKCqBgTqSAIaIBWacAEtTh5tIBDj1IEK6Orpg4GBIVE+BQAJfwm1GnKh0QAAAABJRU5ErkJggg==',
            image: 'https://i.ibb.co/nPT0yN9/icons8-copy-96-2.png',
            host: [''],
            popup: function (selText) {
                if (selText == null) {
                    selText = document.defaultView.getSelection().toString();
                }

                try {
                    //这里拷贝到剪切板 图标栏消失
                    if(document.execCommand('copy', false, null)){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return document.execCommand('copy', false, null);
                }
            }
        },
{
            name: '剪切',
//            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAPZQTFRFAAAAf39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/gICAf39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/GB9x2QAAAFJ0Uk5TAFBFGD253SQEwJik/7wgiJkr58wIT/77a1r3niPvdAkDhPzoqwEfoeGj6RYvLJR2WC4iB73HzXLJz4AZcawn4xxWgm2wO5GaQXqJDp/FmxVZxvRH6G8AAACKSURBVHicY2AgBjAyQWhmFqgAKxs7iOLg5IIKcPPw8gEpfh4BqICgEI+wCIOomLgEzBBJKR5pGVkeOXmYgIKiEo8yj4oqwh41dQ1NLUEEX1tHV0/fwNDIGMrXNTE1MzDnsrCEGWrFZW1ja2fv4OgEFXB2cXVzdxDy8PSCCnj7+Pr5MwQEcnoQ5VMAbc4Of/wBTLsAAAAASUVORK5CYII=',
            image: 'https://i.ibb.co/pbq8Pzr/icons8-cut-96-2.png',
            host: [''],
            popup: function (text) {
                text = document.defaultView.getSelection().toString();

                try {
                    //这里
                    if(document.execCommand("Cut", "false", null)){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }

                } catch (error) {
                    return document.execCommand("Cut", "false", null);
                }
            }
        },
        {
           name: '移除格式',
//           image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAACFQTFRFAAAAf39/f39/f39/f39/f39/f39/f39/f39/f39/f39/fqoK0AAAAAt0Uk5TAB+2DROq/77S4R2U0NWIAAAAVklEQVR4nGNgwARCBgwMLIFAhloJA4NHEpBhnunANa0ZyGCZVuyRsQCkyD1jWjFYNXNbugGYwTItwwHMWJHe1sKArNgjw4ClbQqQEdbFwLAyFdkKdAAASLITTx0dwwIAAAAASUVORK5CYII=',
           image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
           host: [''],
           popup: function (text) {
               text = document.defaultView.getSelection().toString();

               try {
                    //这里
                    if(document.execCommand("removeFormat", "false", null)){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }

                } catch (error) {
                    return document.execCommand("removeFormat", "false", null);
                }
            }
        },
     {
            name: '新标签页打开链接',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAATwAAAE8BY4r91wAAAHVQTFRFAAAAf39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/4eK64AAAACd0Uk5TAClmUiv+8u+zKMf/VzAkMuUKi/n311hM8zh1CGgzEM/wPR/S/Nj2e2jMEAAAAGxJREFUeJyNj0cOwCAMBI1TCem9k/7/JwYBQuSWOazkkeUC8AOCiA64IpFIgZ4fhEAjxhgq4cdJCpDlRgSJyKKsaluIumkjS3R9MwB1rY5xMGvVDME0L1+xcj1j21fJcWpx3VxyPmhO15A/r761wQX91jXAvAAAAABJRU5ErkJggg==',
//            image: 'https://i.ibb.co/hHk6Mtv/icons8-link-96-1.png',
            host: [''],
            popup: function (text) {
                if(text.indexOf("http://")==0||text.indexOf("https://")==0)

                {
                 try {
                    //这里
                    if(GM_openInTab(text, { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }

                } catch (error) {
                    return GM_openInTab(text, { loadInBackground: true, insert: true, setParent :true });
                }
               }

               else
               {
                try {
                    //这里
                    if(GM_openInTab("http://"+text, { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }

                } catch (error) {
                    return GM_openInTab("http://"+text, { loadInBackground: true, insert: true, setParent :true });
                }
               }
            }

        },

    ],


    hostCustomMap = {};
    iconArray.forEach(function (obj) {
        obj.host.forEach(function (host) {// 赋值DOM加载后的自定义方法Map
            hostCustomMap[host] = obj.custom;
        });
    });
    var text = GM_getValue('search');
    if (text && window.location.host in hostCustomMap) {
        keyword.beforeCustom(hostCustomMap[window.location.host]);
    }
    var icon = document.createElement('div');
    iconArray.forEach(function (obj) {
        var img = document.createElement('img');
        img.setAttribute('src', obj.image);
        img.setAttribute('alt', obj.name);
        img.setAttribute('title', obj.name);
        img.addEventListener('mouseup', function () {//鼠标弹起响应open函数
                keyword.beforePopup(obj.popup);
        });

        img.setAttribute('style', '' +
            'cursor:pointer!important;' +
            'display:inline-block!important;' +
            'width:16px!important;' +//图标尺寸设置
            'height:16px!important;' +
            'border:0!important;' +
            'background-color:rgba(255,255,255,0.3)!important;' +//透明度
            'padding:0!important;' +
            'margin:0!important;' +
            'margin-right:3px!important;' +//图标间距
            '');
        icon.appendChild(img);
    });
    icon.setAttribute('style', '' +
        'display:none!important;' +
//        'width:720px!important;' +//宽度换行
        'position:absolute!important;' +
        'padding:0!important;' +
        'margin:0!important;' +
        'font-size:13px!important;' +
        'text-align:left!important;' +
        'border:0!important;' +
        'background:transparent!important;' +
        'z-index:2147483647!important;' +

        '');
    // 添加到 DOM
    document.documentElement.appendChild(icon);
    // 鼠标事件：防止选中的文本消失
    document.addEventListener('mousedown', function (e) {
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon)) {
            e.preventDefault();
        }
    });
    // 选中变化事件：
    document.addEventListener("selectionchange", function () {
        if (!window.getSelection().toString().trim()) {
            icon.style.display = 'none';
        }
    });

    // 鼠标事件
    var timer;
    document.addEventListener('mouseup', function (e) {
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon)) {
            e.preventDefault();
            return;
        }
        var text = window.getSelection().toString().trim();
        if (text && icon.style.display == 'none') {
            icon.style.top = e.pageY +15 + 'px';//设置文字下方距离
            if(e.pageX -70<10)
                icon.style.left='10px';
            else
                icon.style.left = e.pageX -70 + 'px';

            fadeIn(icon);

            clearTimeout(timer);

            timer = window.setTimeout(TimeOutHide, 6000);

        }


    });




    var TimeOutHide;
    var ismouseenter = false;

 // 这里
    //延时消失
    TimeOutHide = function () {
        if (ismouseenter == false) {
            return fadeOut(icon);
            console.log("doSomethingOk");
        }
   };
    //鼠标在图标栏 清除定时器 不自动关闭
    icon.onmouseenter = function(e){

        console.log("ismouseenter");

        if(timer){ //定时器
            clearTimeout(timer);
        }
    }
    //鼠标移开图标栏 清除定时器 自动关闭
    icon.onmouseleave = function(){

        console.log("ismouseleave");

        if(timer){ //定时器
            clearTimeout(timer);
        }
        timer = window.setTimeout(function(){fadeOut(icon);}, 6000);
    };

    //鼠标滚动 图标栏消失
    document.addEventListener('scroll', function(e){
//        icon.style.display='none';
        fadeOut(icon);
    });

    // fade out 渐出

    function fadeOut(el){
        el.style.opacity = 1;

        (function fade() {
            if ((el.style.opacity -= .1) < 0) {
                el.style.display = "none";
            } else {
                requestAnimationFrame(fade);
            }
        })();
    }

    // fade in 渐入

    function fadeIn(el, display){
        el.style.opacity = 0;
//        el.style.display = display || "block";
        el.style.display = "block";

        (function fade() {
            var val = parseFloat(el.style.opacity);
            if (!((val += .1) > 1)) {
                el.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    }




    function typeInTextarea(newText, el = document.activeElement) {
        const start = el.selectionStart
        const end = el.selectionEnd
        const text = el.value
        const before = text.substring(0, start)
        const after = text.substring(end, text.length)
        el.value = (before + newText + after)
        el.selectionStart = el.selectionEnd = start + newText.length
        el.focus()
    }


    /**触发事件*/
    function tiggerEvent(el, type) {
        if ('createEvent' in document) {// modern browsers, IE9+
            var e = document.createEvent('HTMLEvents');
            e.initEvent(type, false, true);// event.initEvent(type, bubbles, cancelable);
            el.dispatchEvent(e);
        } else {// IE 8
            e = document.createEventObject();
            e.eventType = type;
            el.fireEvent('on' + e.eventType, e);
        }
    }



    /**在新标签页中打开*/
/*    function open(url) {
        // 这里
//        icon.style.display='none';
                var win;
            win = window.open(url);
        if (window.focus) {
            win.focus();
        }
       return win;
    }
*/
//这里后台打开标签页
    function open(url) {
         try {
            if(GM_openInTab(url, { loadInBackground: true, insert: true, setParent :true })){
                //success info
               fadeOut(icon);
               console.log("doSomethingOk");
               } else{
               //fail info
               console.log("doSomethingNotOk");
               }
          } catch (error) {
               return GM_openInTab(url, { loadInBackground: true, insert: true, setParent :true });
          }
    }
})();
