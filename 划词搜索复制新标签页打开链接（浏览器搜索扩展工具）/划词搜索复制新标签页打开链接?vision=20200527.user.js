// ==UserScript==
// @name         划词搜索复制新标签页打开链接
// @name:zh		 划词搜索复制新标签页打开链接（浏览器搜索扩展工具）
// @version      1.1.0
// @namespace    http://tampermonkey.net/
// @description  划词搜索,一键跳转哔哩哔哩，谷歌，百度等。注：第一个图标为打开网址的按钮，仅当选中文本为链接时可用。
// @author       Levy258
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

//     var hide_controls = function(e){
         // console.log(this);
//          if(e.relatedTarget!==e.currentTarget && e.currentTarget.getElementsByClassName(e.relatedTarget.className).length===0){
//        if(e.relatedTarget!==e.currentTarget){
//              fadeOut(icon);
//          }
//     }


    var iconArray = [
        {
            name: '百度搜索',
            image: 'https://i.ibb.co/R9HMTyR/1-5.png',
            host: ['www.baidu.com'],
            popup: function (text) {
                open('https://www.baidu.com/s?wd=' + encodeURIComponent(text));
/*                 try {
                    //这里
                    if(GM_openInTab("https://www.baidu.com/s?wd=" + encodeURIComponent(text), { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://www.baidu.com/s?wd=" + encodeURIComponent(text), { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
        {
            name: 'Google搜索',
            image: 'https://i.ibb.co/fxpm6Wc/image.png',
//            image: 'https://i.ibb.co/Pjbc7Hv/icons8-google-web-search-512.png',
            host: ['www.google.co.jp'],
            popup: function (text) {
                open('https://www.google.co.jp/search?q=' + encodeURIComponent(text));
/*              try {
                    //这里
                    if(GM_openInTab("https://www.google.com/search?q=" + encodeURIComponent(text), { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://www.google.com/search?q=" + encodeURIComponent(text), { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
        {
            name: '微博搜索',
            image: 'https://i.ibb.co/VC2HfBF/bnmabu2sfk4kus4dv6obkriqne-082bc03f376b8c0ffd7eff29bd9816871587215670-5-1-1.png',
            host: ['s.weibo.com'],
            popup: function (text) {
                open('https://s.weibo.com/weibo/' + encodeURIComponent(text));
/*                try {
                    //这里
                    if(GM_openInTab("https://s.weibo.com/weibo/" + encodeURIComponent(text), { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://s.weibo.com/weibo/" + encodeURIComponent(text), { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
        {
            name: '知乎',
            image:'https://i.ibb.co/PQ5xM2R/2-1.png',
            host: ['www.zhihu.com'],
            popup: function (text) {
                open('https://www.zhihu.com/search?type=content&q=' + encodeURIComponent(text));
/*                try {
                    //这里
                    if(GM_openInTab("https://www.zhihu.com/search?type=content&q=" + encodeURIComponent(text), { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://www.zhihu.com/search?type=content&q=" + encodeURIComponent(text), { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
        {
            name: '豆瓣电影',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAMBQTFRFAAAAJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NjZqR9AAAAEB0Uk5TAB9cZlJN/8wIJTUaS5UwgN/T1dfzagsVv5BIQFDP4MrO8o7jrPu7iC4Qt/ERcPlhAYPrabHhN3v49Pr22qSZeqkWK+0AAACGSURBVHicY2DAAIxMzAjAAhRgZUMC7EABDk4uBOAG6eHhRQA+kAA/m4CgEAgIi7CxQgRExcDGi0vgFJCUkgYBGVmYgBy7PAgoKEIEpJWUFfmBQEVVTV0DrFdTS1sHSOnq6XNAHG9gaGQMpExMzcBccyEhZQtLoDOsrG2EbIECTHZIwB7T8wBnLQ8Enf/6ngAAAABJRU5ErkJggg==',
            host: ['www.douban.com'],
            popup: function (text) {
                open('https://search.douban.com/movie/subject_search?search_text=' + encodeURIComponent(text) + '&cat=1002');
/*                try {
                    //这里
                    if(GM_openInTab("https://search.douban.com/movie/subject_search?search_text=" + encodeURIComponent(text) + "&cat=1002", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://search.douban.com/movie/subject_search?search_text=" + encodeURIComponent(text) + "&cat=1002", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
        {
            name: '豆瓣图书',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAMBQTFRFAAAAWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEp08JwzQAAAEB0Uk5TAB9cZlJN/8wIJTUaS5UwgN/T1dfzagsVv5BIQFDP4MrO8o7jrPu7iC4Qt/ERcPlhAYPrabHhN3v49Pr22qSZeqkWK+0AAACGSURBVHicY2DAAIxMzAjAAhRgZUMC7EABDk4uBOAG6eHhRQA+kAA/m4CgEAgIi7CxQgRExcDGi0vgFJCUkgYBGVmYgBy7PAgoKEIEpJWUFfmBQEVVTV0DrFdTS1sHSOnq6XNAHG9gaGQMpExMzcBccyEhZQtLoDOsrG2EbIECTHZIwB7T8wBnLQ8Enf/6ngAAAABJRU5ErkJggg==',
            host: ['www.douban.com'],
            popup: function (text) {
                open('https://search.douban.com/book/subject_search?search_text=' + encodeURIComponent(text) + '&cat=1001');
/*                try {
                    //这里
                    if(GM_openInTab("https://search.douban.com/book/subject_search?search_text=" + encodeURIComponent(text) + "&cat=1001", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://search.douban.com/book/subject_search?search_text=" + encodeURIComponent(text) + "&cat=1001", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
        {
            name: 'bdfilm',
            image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACGFjVEwAAAANAAAAAHHdBKEAAAAaZmNUTAAAAAAAAAAQAAAAEAAAAAAAAAAAAB4D6AAAOSVkVgAAAZ9JREFUOI2Nkr9r01EUxT+x2CBuXQS1oNAObv4B9l/QqSii4NAqRIMp6qAJvHeDCiIIZhPRoYNDqLiFipH8uCeuHdSpXRXpqoNbHL5fY5oXtQfe8O6579x77rswidA5TrlVTOK33h4mdE4k8TEUiP6A+mCIaSlhTedy7iFQSJ9H36A+GBK1RmjOJny5VST6zVzk9eTjvZWvPjtI8IvcbR9JLfqZsU6A0FnIKvv17K6jmD4R/QP32scAWGsewvSGau9kZqdfoj4YEjoLEP0Rpl2WmzMZ6VuYV9IZ+G3MtwBYbs5g2iXqMZg+YnqRWelfxvQ+HdBvq2oTdCkXfI7pM5i+E1XOg0+wfin1HQ7kfGVUzPwGph9g+kbQlSyxOTtKHscfexVML/NuzmPahrA5N0r4H2rdUwSdToT3oNqbJ+jsvgSnotqbx3wH0zuiX8P6JUyvCJtz+xcpt4oErWBax7RO1OrU7UxgWsp/YcquUyCqTOhf+LtA1J18Tb9i3iBoJevEG5h/yTi//+8uat1Fop5i2sb0Mzu+g3mDWndxMv0Xd/7J/PC3XHUAAAAaZmNUTAAAAAEAAAAQAAAAEAAAAAAAAAAAAB4D6AAAolaOggAAAZlmZEFUAAAAAjiNjZI/a1RREMV/JgTSBD+Ahf82dgELwSZ+AjshgpAUgWXFRHAtRHAD986TFNqI0WbxT6GYIuQbJOElb87aiigiaGuTxsIUdmvxHm/j27dLDly43Jk5c87cgZMg+A1ML+nsnR2d1OpOEXWHB5oZJtAipiOSXp/o6/UE0bdJen2CLtfGF7YmiX6vINmuFq+T9PqYrg3UZEtEPQZOVezM/68kpI3iYRWAR7tnMH0l+kcSbx0rvEBIzwFg2UquNm1A9CeYDlnYmsyD/gnz9rDF7Bamz6Ud0yHmT8H0BdObImkJ0179kICoXYIWi0avMP8Opj+Y3wWgc3A+l1VBCBNFURvT6/x+cD2/m45K/6MwsNcu1ZYwfSNRdyi5DubvidlyRZ7PE7JLxwg/YNlKLcHDndOEdHqsWjq6iOkHph2i3ybqPmv7c+OLqgjpNEFNTO8wbRJ0ZaAwuzpyW4F8Bq3uVD2xmsXGvh3T3W9i+o35BkFNgppEPcf8V76xelZ+6wj5DaJeFHP4mx//ifkGa/uz1fR/oqjJFLqwpRgAAAAaZmNUTAAAAAMAAAAQAAAAEAAAAAAAAAAAAB4D6AAAT8BdawAAAZ5mZEFUAAAABDiNhZIxa1RBFIU/shoUsRNExIgQBG0tFFTwJ9gsooUgrGlijEFE3RVm7oMgpEgQEQzEQqx8FjY2YnTduWf/QUgTsbMJdlrYrcU+nuY9XnJhmuGeb865c2GvMr3HtEXUU3qfT+7ZX6uoa5heY/pJNhwRfbHeNLO6H/Mlgk81gtp5i+jzZMMRpneVV3yRbDgi83MlMKbrmL8hpluVSJd3Ogn96eJiFoDu+nFMG0QJU5fgl+qxfJZsOCL0p8F8CdM2IUwQ+vswbWLpbk30QIcxvSTkk7TzFqZtolbAtIFpDYDe4ASmrHmgngh+Y+w8XSX4FTD9wvxOowgghIkxQAvlY/8N5XeZv6naeatwMI/pVRWwSaZVAB6vH8X83i4RvhD8ZgXgy/+GmE8WW3e7Jl7IDxL1gvsfD1XypbOYPypt9ganMG1h+kTUHJYu1mDBL9AdHGvOHPoHCOpgekvU3E7H6XyxNw+bAY1gdcZifSh/psHBEcyXyXyGoA5RzzD/UYhXdhcDPPl6BtN3TH/Gx78R9ZyQTldb/wKgsMsaKa72kwAAABpmY1RMAAAABQAAABAAAAAQAAAAAAAAAAAAHgPoAACiCi8RAAABo2ZkQVQAAAAGOI2Vk71rVFEQxX/mQ11FsLPxA0HEP0FQIf9DCKiFICRRiCu7EQvdYu48FEFBISC4SCorn52IICpL3pz9B4SkMZ2ICFZiKazFe27Mrs+P083cOeeembkX6mC9/bg+4PEV1zuS7mBxuLb+NwJTpLiEaxnXKq4vZP0BHrf+XeRXzOWTeLRKET3bfuhaxmJmGC92p0nFOTyekIqLI7VnyPoDUtz+afVYZe1KFR/EtU6ScN3E4vSYmxRLZP0BnbdHIOkers+YTWC9KVwbeHF1jHRd+3A9wvKd2PM9WMyw2J0G1zoejwHorB3CldXOIUWBxfnR/r+RYqmWBGA2UQqoPbzsvwTm8smyNlq4VkcFNsjUBeDGmwN4tGqFXD0sLowk4z6uTwA0X+7CY5OkhTFyO2+Q9JB23qCdN3DNcu3VXrDeiWqvZRudtaO43uN6TVITL06NiSUtkPUHWHG8SoRjxdlhgfV2Y5rH9ZSk5jayxcnq3dytbbUWpvnSrV4AO/5OcM3iuozHCh4fK/KD4Vr/iPLzbOL6Xs4kVrZ63sIPq0LKOBaKw/8AAAAaZmNUTAAAAAcAAAAQAAAAEAAAAAAAAAAAAB4D6AAAT5z8+AAAAatmZEFUAAAACDiNjZO/a9NRFMU/sQSK4OIkiAVR/DHpIro4uotQpGDp0qagS624mMB794s4VJCiIIRGhI4pOIhDhULa7z35ByTq4CzWQXBwj8P7mpDkG+mFt9x7OPeee+6Dsgh+A9NXTL+L9wnTM4LPleInCTrnMW0T9RDzNUxvMP0i6/Yxf3o0kvGYb89gvpZItPN/cK1ZJeYLmFqYv6Wxf3lQM90k6/aJvjocN+ruAFA/OIPpM1Ei+iPMGzR0cVSirvJYJwpG38D0k/n2DABR7zCtl04Wdk8SOrOjSVMPU2sIen8cqJQSmNoE3RtP/iH6g2nrSKThWIFdx3xrksDy+wnYOcWTvdMTBP/kJUtbo0XTFzI1AYi+RNTu1EnMPxJ9KWHzRYLfAfMXmH4AleS1ekStTMrIb2PqFXIqmA6JegWhc4ms2ydoGYD6wVlM34jaK7qlhQafo65zqbtWyLr9ob1Rz9OF7V8rdjFL9FVMm9Sa1VEZ+fXipDeGyVqzimmbhl+Zqh8gaDldoT4wzeqSxd3C/DXm34t/sDlw5YgEW5gOMX9JyC+Ml/8CnOPJYMU7mq0AAAAaZmNUTAAAAAkAAAAQAAAAEAAAAAAAAAAAAB4D6AAAou/NpAAAAaNmZEFUAAAACjiNjZM/a5RBEMZ/MSoRaxtBjYJGG8HCPx/AxlpSRMQiGhFFOKMgcge7c4iGEEhjkeiZ0uJASKFgCr27d577AAYlhb3YCBYKdmfxbl713rsjAwszu/M8M/vsLPRb8GNEPcW0ielHWh8xPSH44VJ+yUzzmH5jeol5JV9aw/SdereH+ePRBKE1wb3mvtL+dHMc80pOooXRJDdX9xD8CqYGpgYxm2G6OZ532D5L9f2R4eBq5xCmLUyOaZ7oDzG94v7G/sGAWvsUj7IDf2NNEXR1dIv/mukzpmc7yg3ZaWrtM/0EP4l+J0Vjg4FhV57rDzB/0U/wC8tuJ3+B4LMlgkJAr2BqpNzLRF8nCbYCQPTrRL0begXzDYJfS/5zTFsQtYzpa1HJ9ImouRI46i6mzXSdMUzfMC1BaJ2k3u0RdAOAaucopi9E/1CMbmjtxvSakJ1IZHPUuz1qmtrWYSkn6ZxLgAlMtwitybKgfiGN9OL/Kpu/zQ+y80M12K4c9YbSi4XmXqICQQcHiHep+ExRy8Wz7tiCX8S0Rq19vP/oD5IjysBjq0pjAAAAGmZjVEwAAAALAAAAEAAAABAAAAAAAAAAAAAeA+gAAE95Hk0AAAGmZmRBVAAAAAw4jZWSvWtUURDFf242YKHEXvCrCf4DksJGe8sFERQkuqCEqImyYBbmzisUJKCpJCSidVpBwSgv++ZsIVaGgL2IWCgIYr0Wb7MkebtRB25x75w558zcgb2x8O44SQ9xbeL62T8fcT3A4lgFvys82mTdHq7vuFbxuE3SHVzPcP0oc8XsaIJUXCZFi8baWCVneR2Pu7jO7e8CoLk8jsWlvosVrLhIc3n874WDVvQC13tcc6SYx+MDSUv/TtBan8CsNrg31saw/NBw8E7g/4RZjdb6BLg+4dEAIMU0FlMjRaxzHo+ZEltcxfUVXL/x4iYAHs9JcatCsP0rKeZxrZbYYhbXr9JBiqc7WF+PtJ30BosrfbEVXFvgelJa6Su5tki6PqT4Bq5NzGqY1XB9w7UI7Y3TZN0eKaYBWOicxPWFFK1BsWsO12csPwFAFk2ybo+2JrcBi2TdHtY5Uw4rPzIAA9x/e7ScOGAxVa50PNo95aRXJYmuYXm90oLl9YGy6yVwoDrppKU++4UqQZwtW9Xj/XenrUnu6fAQBwexOLX3+Q9jwc9OVBVYYgAAABpmY1RMAAAADQAAABAAAAAQAAAAAAAAAAAAHgPoAACis2w3AAABrmZkQVQAAAAOOI2Nkz9rFFEUxX+7MZjOwsqAfwqNCJJGEMUP4BdwQbEQFVcUEqOCill4705hEAxoJWs0YpvCQjCCQSc79+wHSNgqvYVgIQq2azHj6u5kJAcG5r17zrn3HngwivlPB4lawLSJ6XvxbRC1QPADJf4/qGF6RNLtY/qG6SXmc0TdxrSM6RchO1ctN3+Ri7NZQqiX6iGdIKS7qg0SP4FlZwBotseJulhMsUTIzv9fPIoHa3uJeovpHtHvEiVMPR529u3cZBQxu8B8Z//gHNLDBD81TArpcVrrR3ZkaHqFaXP0chnzuRL5T6gh1Gm2x/OJ/BbmPyBRG+uczQ38NVEzJYPGylhez24SfbH4n8X0E0xbRH9e7HkZ04fKsaM+Ev1S0WwJUw9MTzH/Muhk6hH9+jbiG8XONUKoY/qK6Qm01o+RdPsEvwJAS0cxf8/M6u58b00S/TOmLUJ6CIDEm7kmmyrcfTG/6JwsB6hJoq4R0oki6NMk3T7RHw+nHLVaFK5WZhCy6Zyjd0BtuNhYGSPq2eAxbfdw7q/twXRnsF5FlylMbzBvVJP+4jefz8z3PhGI6gAAABpmY1RMAAAADwAAABAAAAAQAAAAAAAAAAAAHgPoAABPJb/eAAABqGZkQVQAAAAQOI2Fks9LVFEUxz86ZguXbcVq0UDLCNpE9AeE4GagTQUGRotJySDBoXvP24wgLfqxKMQmaPcWbQJFRGfmnjP/gEaL9gqChNQfMC3uc2De8+mBC5dzv+f7Ped7D+Rjeecq3pqI7SF2kp19Gp0bBWwuRvDWJOn1ETtGbB3RBcReIvaJpe0r55d7+07S6+OtjnOjF6nlivV1VA53B7lG5xaiLUTXcOEhrj1WTuDak4jdG8olehuxN3hdRKyH2D6uPQlALa0g+qroi0vHWdyaKO1S9NsAJ/YHb8086AliX0s7nft8aXAXbSG2NwwQ+4LX+eKIZ5jqdR7RvzkCbeGtXgDX0goAy93rOJ2K2PACsX8g4T7SfRCVdBaxzdIRxLZx+jgTW0PsJ4h9RPRgoCT2Cxdmii3b82zmEZwbRewIb6vQ6Nwk6fVxOhu7CNWh7/HhEV53EfuNa1/L5n8Wa0L11JC3MdG9UzDP2yqJzlHfuAzE/YjrvpIHbsRV1qelHpwaKfoel44PP9TSCt7eRXY9yLyZPpfszHChircPiB0i9uMi+H9sHMtvoD6TpgAAABpmY1RMAAAAEQAAABAAAAAQAAAAAAAAAAAAHgPoAACjJAjOAAABpGZkQVQAAAASOI2Vkr1rFFEUxX/xIxFEQVshLETQf8BGC0n+Bz8g2mjMIhpRE41E4b07qYQQRbQIKKYTtkkTFoXAmLlnsRHBxjQKFkEL0VK02hQzWbIzG4yneu9y7jn3vPugjJDWiJrF9AHTL0yfCOmeCq8nTAlJq43pJ6ZFzKeI2cWdNr8qmm8z0RzYWdMmombz5ux0qX6VRAtEjRLCrk49+FnMY3FJax3nMsLqCNGniVrB9JHgg/m0fpOk1SakR+GODhB1jpDuY3xhL+bzTL7ZX42Y3cD0ldA8CPRh+o7pcckxO0+i95xp7O4Z1XyKmZUjxfkJ5p9LBD0n+mQ1ypb8nZrGMP0pC7wg6laF3Gui6Jcx/S2rXsD0rqdjbnCXkNZyAT3C9AUmmgNYdorQ6Cc0+jF/WTxUNxIfx7TOPT9UiK1jegrBB/M1+vWq49sTRL9G1DKmNe5rqBi/Xqzx+Gaeh3lh9WR3JL+EaZGoK12/0zSMaWYrtQ/TEkmrTfT6tmv8J0xzxa/8RtQzoteJGv0/wQc6hvk8pjVMvzH9ILw+vB19A/CHy5khQV06AAAAGmZjVEwAAAATAAAAEAAAABAAAAAAAAAAAAAeA+gAAE6y2ycAAAGoZmRBVAAAABQ4jZWTO2tUURDHfxt1Y2MjCKIYAgpB/ARiIX4IX0hsNK5IFhVjYbJwZjaVgg8kjeCrE7YQCw0WytU7/20FETQgdqKFaClarcW9LvuKrFOdGeb/mHPmwGCkbBrTMq43uH7ges/h1oahvpFhWqbZ7uD6jushHgtYPjse2PWIZruD6SL11cnxQEPK+cG++pk7m7C4iuWzpDTRrac4goeVSTbdVS7y7aSYKs5pAlMd10tcb1l6vatwGxdotjukbA9c1hZMR6mvTpKyjbjeYfnxYZdxHo81UrYZqOD6iutWf1PKj+Fq/+OeMkxzpYvbuD4ONtzF4tIQ8O/8STtYfLGzPJ/G9WuQ4B4eC0MEo/bA4hSu3wNKcRLT43VH6H1e001cn4qi5wdIrSqpVeVKvm0k2HUWj2dApcw/41qBFFPFDsR8H2BJu/GYx/NzmJ7i+kDj1d7Sfo1mu0NDMyV7XCtXeH+XoBH7cN3H4wGmOVKr2uPmEK7FXr0KFk+KhYra+J9nMCyul06+4FrBoobpxP8RNjSDxw081nD9xPWN9Hzreu1/AJWczMkfsOFuAAAAGmZjVEwAAAAVAAAAEAAAABAAAAAAAAAAAAAeA+gAAKN4qV0AAAGdZmRBVAAAABY4jZWSP2tUURDFfzEaQT+CfxBRIohVqhTiR7CQLYQIgroJoviv0jy4d14qQSUsBLXQgAjCViISCERe3Dn7AbaKqK1YiZVitxb3usF9m5AMXLjMnDlnZjgwHKE6RtQCph6mZ7X6tmEqKbt9TD8wX8Z0fjfNbyi7faLucHNl/5a4Yv0M0Z8CY5vJqIWk3DlXawjVYYJmCGFPFprOUz7KAD+aEn4bgAdrhzB/TWhP5PpxTB8w9Zj/eCQJ+ixlt0+oToB5C9MvGu1xQrUXU4/o92uTRL+FaSOvN4bpO6ZFMG8QdDmBOhcxdbe5U0XpzfT3FqYvw4AXmO7W75D3j51LRH+YcrqK6c8wwSui5msEjfZ4jWwkQelTlD615Qr/iy1i/nVH2NxwgUKTADSf78P0k6ilVLy3epDCT2+O+e5AuoffwDrXiXqP+SdCdWqwUtAMxfrJf+xz2RzTA4XoVzC9xHyZqGsDX4yM0J4g+ttkZZ8dHGrXEf1xduU3opaS47yJeSu5bidRaBLzJ5g2MP3O7zOms6PgfwEtyMus/wVV0wAAABpmY1RMAAAAFwAAABAAAAAQAAAAAAAAAAAAHgPoAABO7nq0AAABoGZkQVQAAAAYOI2Fkr1rVEEUxX9x/ULtF4UECwsLLexEESt7m0UsA2YjihKJhRsDM3cFsQgqiY1NVCyCW6RIEVAWX/bds/+AIBq0sFGrtGq3FvPUuO8luTDFzLlzzpkzF4YrZEcxPcB0roTtWFH3aPcHmDYI+cUS3urWiT5dfdm0RLs/IOoWzad7KntC70zRswyMVCjn5wFodGq0uvV/F3WEG6v7klB+tnA5V4A+lg58CoCZ3mFM74ne2uRuBtM6wceSoE/S7g8I2TEw3ce0QaNTI2S7Mb3D/Hb5iflNTB8KJyOYvmN6DOafMT1PzPllolQdEhD9LTEfL569gOkTRK0QdSmp+EvM75TDC7s2uXhVEExg+jlk06cwv1AiaHRqRV6nMV0FoO1NTL+2dLtjRT3C9KUaDNn+irND/+1b3TqzayerCcwfpsD8OpZfI+oNphfbW7rbG2V27VRSWzlAzMcxLWL+jKArTL8+uD2BaS6NqU9u2fPnN6rBzt6/JOZfMT1JE+dNzOcxfascsDJRdjwl7B8x/SjWOubzhOzEcPtvMOHHU2kn5uQAAAAASUVORK5CYII=",
      host: ['www.bd-film.cc'],
            popup: function (text) {
                open('https://www.bd-film.cc/search.jspx?q=' + encodeURIComponent(text) );
/*                try {
                    //这里
                    if(GM_openInTab("https://www.bd-film.cc/search.jspx?q=" + encodeURIComponent(text), { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://www.bd-film.cc/search.jspx?q=" + encodeURIComponent(text), { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
        {
            name: 'chrome网上应用商店',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAblQTFRFAAAA421j4FxQ31dL3lNH3VJG3lJG31ZL4mti3VxQ3lhM3lVJ3lNH3lFF3VBE3U5C3U5C3U5C3lNGzVdK1FJF21RI3lRI3U1B3Es/3Es/3VBDR7R+gW9Pzk0/11FE3VNH3lJG3FNH21JE21VA3FQ/3FM+3FM93Vc95pNNJqdoKaJlplVB0U0/2VJFv2NuVIzvUo3vwp1k6Ks88rM797g7+708/MJDI6VmIaRkTYhXv0k7xVhVUI71To31TIz1TIz168BZ/cdC/shC/spC/8xEIaVkH6RjI6JifmtKcHq/TY31TIv1Sor0fp7C/s5I/85E/85DH6NjHqNiNJZdVIe5SYr0kKWz/s5G/85D/81CIKNkHKJhHKJhJ6RsTYz1Sor09MtS/85C/s1DH6JiGqJgGqJgGqFgJaVqPJi1OpOyTZdZ+s1G/81B/cxFJqFlGqFfGKFfF6BeGaFeGZVYpLJL/81B/cxD+MpLLKJmGaBeF6BdFqBdFZ5bSptP98xE/81B/cxB9MdMHp9gF59dFZ9cFJ9bE5dVxr1H/sxB/MtC+MlFIZpdGJ1cFpxaLZZS+cpD+8pC+clD78JIw+1U6gAAAJN0Uk5TAARAhaGhhEAEF6bz//////OmFxPS/////9ERA6H/////9vD/////oQIr9v//73hfXnfw///3LXv///9r2f//2mz///97pf//8nf///938f+jn//xZ/9r9P+db//+grOzev9sH/D//pBcW4768B8Bi///+vr//4wBB7X9//////20BxGB5v///+eCEQIhW3t6WiECbON5bQAAANBJREFUeJxjYMAGGJmYWVjZ2DlgfE4ubh5ePn4BQSEIX1hEVAwkIC4hKQXiS8vIyskrKCopq6iqqWsABTS1tHV09fQNDI2MTUzNgALmFpZW1ja2dvYOjk7OLkABVzd3D08vO28fXz9//wCgQGBQUHAIkB8aFu4fEQkUiIqOjomN8wmNT/CPSEwCCiSnpKampWdkZmVHJObkAgXy8gsKCguLiksiEkvLykEOqaisqq6uqa1LrG9ohDi1qbmlta09saOzC+aZ7p7evv4JEydh9TkAym8xvWYfqH4AAAAASUVORK5CYII=',
//            image: 'https://i.ibb.co/xqNGyXL/icons8-chrome-512-1.png',
            host: ['chrome.google.com'],
            popup: function (text) {
                open('https://chrome.google.com/webstore/search/' + encodeURIComponent(text) + '?utm_source=chrome-ntp-icon');
/*                try {
                    //这里
                    if(GM_openInTab("https://chrome.google.com/webstore/search/" + encodeURIComponent(text) + "?utm_source=chrome-ntp-icon", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://chrome.google.com/webstore/search/" + encodeURIComponent(text) + "?utm_source=chrome-ntp-icon", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
        {
            name: '百度',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAXdQTFRFAAAAV53/RZL/ZKT/WZ7/ZKT/Wp//P4//aqj/PY7/M4j/Spb/VZz/OIv/NYn/T5n/N4r/M4j/NIn/QI//V53/mcP/T5n/UJn/aKb/P4//T5j/TJb/OIv/Upr/WJ7/QJD/QpD/Wp//RJL/bqr/Z6b/TJb/YKL/Upr/UZn/TJf/OYz/NYn/NYn/O4z/hrj/X6L/YqP/WZ//O43/QpH/YKL/Q5H/NIn/Spb/Z6f/OYz/NYn/SZX/T5n/OYv/T5j/PY7/bKn/RJL/Tpj/QZD/NIn/VJv/QpH/Ooz/TZj/ZaX/Po7/PY7/d7D/UJn/Nor/NYn/P4//T5j/cq3/WZ7/QZD/UJn/XaD/UJn/ZaX/Ooz/Po7/SZX/XqH/Y6T/NIj/cq3/OYv/M4j/Zqb/NIn/Po//R5T/RJL/aaf/QJD/YqP/M4j/W5//bKn/b6v/PI3/QpH/ebH/WZ7/N4r/UJn/RZP/SZX/nMX/mcP/zOH/stL/a6n/TJf/VZv/dNrSSwAAAH10Uk5TAFyZHwNFOAMf2/+FPfDgPTPmmZSPBWG9Usxwj/VHJuWzSGYPKZR1l7gfM//MGi6ZXGb/sxSt5oo49fp9af/RMy698PXwe8/mZinP65nH8PzjZBof45mPSJ516Ix1XP9mzGaZZuaA21KoUh+oOEVu2wq/////VCkzCgUuPR9mIu36AAAAuklEQVR4nGNgwAoYmZhZWNnY4XwOTi5uHl4+friAgCCXkDAXlwiEJyomLiHJJSXNJSMLEZCT51JQVFJWUVVT19AECWhpc+no6ukbMBgacRmDBExMzcwtLLmsrG1suezAekzsHRydnLlcXN3cPSCmeHp5+/j6+QcEBkH4wSGhYeERkVHRLjEQgdi4+ITEpOSUVK40iEC6dkZmVnZObh5XPkSgoDCOq6i4hIurqBTm9LLyCobKquoarB4HAH9zIFo+b0WcAAAAAElFTkSuQmCC',
            host: ['www.baidu.com'],
            popup: function (text) {
                open('https://www.baidu.com');
/*                 try {
                    //这里
                    if(GM_openInTab("https://www.baidu.com", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://www.baidu.com", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
        {
            name: 'Google',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAATVQTFRFAAAA7FRI60s960w+601A725j7FRH60s96kU36kQ26kU36kQ26kc5601A61FE6kY46kM16kM16kU37FBE7FJG6kc66kY460k760o96kc56kQ260g67FFF9ZIf7VUu6kg68YN67VdL+70K+a4L8Goq7E9BWZT2S4v1S4v1To31+70K+7wF+7wN96ZfU5D1RYf0RYf0Roj0+70K+74MUI71QoX0QoX0+70K97wHrbYpT7FfU5D1RYf0RYf0RYf0RIf05rwTibEyNalUPKxaY5v2RIb0Rof0QK1cNqlVNKhTNahUOapYPqxcPaxbPKtaPpqdQYfsQoX0SYr1bMCDPqxbNalUNqlVOKlWNKhTOpqURorsVJH1W7l0P61cN6lWNalUOqpZUKuNRK9gNqlVNKhTPKtaTrNppjY/PAAAAGd0Uk5TABUqLiEEFH3h9vrtuDEmz/3/3BkUr9GDd6f8bwN3/6MCGcj/0yABICYl7/+SAga+5uP2hwbS/9v/tQ8DX3PA9Jf//mMG0cMs2v/5hjkuUtL/+1sBVPH79v79sA4BS83ykgsPMjMmA50P8goAAACrSURBVHicY2DADhiZmFlYEVw2dg5OLm4eXhifj19AEASEhCF8EVFBQTFxCUkpaRmIgKycoLwCkFaE6VBSVlFlUFPXAAJNsICWto4ug56+ARAYggWMtI0ZGExMzUAALGBuYWnFYG1ja2tnZg8WcHB0cgbRLq5mbmABdw9PL28fXz//gMAgsEBwSKinZ1h4hGdkVDTE3pjYuAhPT8/4hES4Z5KSU1JSUtOw+hsA45cah2D8CjUAAAAASUVORK5CYII=',
//            image: 'https://i.ibb.co/2qy4PVn/icons8-google-512-1.png',
            host: ['www.google.co.jp'],
            popup: function (text) {
                open('https://www.google.co.jp');
/*              try {
                    //这里
                    if(GM_openInTab("https://www.google.com", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://www.google.com", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },        {
            name: 'Google图片',
            image: 'https://i.ibb.co/ZBJgr7K/icons8-google-images-512-1.png',
//            image: 'https://i.ibb.co/ZBJgr7K/icons8-google-images-512-1.png',
            host: ['www.google.co.jp'],
            popup: function (text) {
                open('https://www.google.co.jp/imghp?hl=zh-CN&tab=wi&ei=z4qyWPK6Goug8QX_8Zgw&ved=0EKouCBQoAQ');
/*              try {
                    //这里
                    if(GM_openInTab("https://www.google.co.jp/imghp?hl=zh-CN&tab=wi&ei=z4qyWPK6Goug8QX_8Zgw&ved=0EKouCBQoAQ", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://www.google.co.jp/imghp?hl=zh-CN&tab=wi&ei=z4qyWPK6Goug8QX_8Zgw&ved=0EKouCBQoAQ", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
/*        {
            name: 'Google翻译',
            image: 'https://i.ibb.co/9wvXZpx/icons8-google-translate-512-1.png',
            host: ['translate.google.cn'],
            popup: function (text) {
                open('https://translate.google.cn/');
//              try {
                    //这里
//                    if(GM_openInTab("https://translate.google.cn/", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
//                         fadeOut(icon);
//                         console.log("doSomethingOk");
//                     } else{
                         //fail info
//                         console.log("doSomethingNotOk");
//                     }
//                    return GM_setClipboard(selText, "text");
//                } catch (error) {
//                    return GM_openInTab("https://translate.google.cn/", { loadInBackground: true, insert: true, setParent :true });
//                }
            }
        },
*/        {
            name: 'Instagram',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAaFQTFRFAAAAVFfOUlzQUWDRU1/PWlzMZljJcFLGeUzEgkbCij/Bkzi+lja8aTu+Y0fFXlDIW1XJYFTIa1HEd03Agke9i0G7kzu6mDi5nje5oza4cju4cT26bz67Z0K9tjKPuDOPuDGitzKkrDSwrzSxfzuugjushDqqvDOMvTOPvzOPwzOPxzOOvzCcvjGftzGluzKojjmilTmfmzibxTCCwzKGwzKIxTKKyTKKzTKJ0DGIwy6VxTCfojeVqjeQrzaLzjZ3zzR6zTF9zy9/1TCA1i+B1y5+zS+Wtz2Bvz97xUFz3Udg30Vg30Ff3S133C552i570i6P0VJj11Vd3FhV61xI7V1G715D5DNn4S5u3i101jCH4WVL5mlG6mtA8Wg69W819m8z9mo181w/7kpO6Dxb2TCC7Hc78Hw39IAz+Xgr+Xgs+HQv92g081o/3Sx12i9+9Ik3+JU6+6I/3i102y98/K9N/sBb/sxn/s9t/sxr/cJj/LBY+ZVM9G5I7E1S4TVs2y54/tBu/td5/tl8/9V5/sxw/bxj+6FV9XxN7VVQ5D5iWL+6FwAAAIt0Uk5TAARCoMPKzMzJvpk1AQFb2J1/enh4eoOk2z8T1FYBAQEybXTOK9cTDVaVkUtkww77MdULBo7Qg4rQZwbxM9UJJt1FAVfIEO4z1Qk60w8pzCjuM9UJJt9CU80N7jHVCwOP4o2V4GTxK9cTBUWVjzsH/BLZTnHRVOytiYF/f4GPtPI1PJOZmZmZmZmRKXHf6gQAAADCSURBVHicY2AgAjAyMbOwsrFzcHJx84D4vHz8AoJCwiKiYuISkiABKWkZWQYGOXkGBUUlZZCAiqoag7qGppa2jq6ePkjAwNDI2MTUzNzC0orBGiRgY2tn7+DI4OTs4srgBhJw9/D08vZhYPD182cIAAkEBgWHhIYxMIRHRDJEgQSiY2Lj4hMSk5JTGBhSQQJp6RkMmVnZObkMDHn5IIGCwiKYm4tLwFRpWXlFZVV1TW1dfQNEorGpuaW1rb2jswubVwE7TyV4+ZqioQAAAABJRU5ErkJggg==',
//            image: 'https://i.ibb.co/NZmysXw/icons8-instagram-512-1.png',
            host: ['www.instagram.com'],
            popup: function (text) {
                open('https://www.instagram.com/');
/*                try {
                    //这里
                    if(GM_openInTab("https://www.instagram.com/", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://www.instagram.com/", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
        {
            name: '微博',
            image: 'data:image/png;base64,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',
            host: ['www.weibo.com'],
            popup: function (text) {
                open('https://weibo.com/mygroups?gid=3979203194137677&wvr=6&leftnav=1&isspecialgroup=1');
/*                try {
                    //这里
                    if(GM_openInTab("https://weibo.com/mygroups?gid=3979203194137677&wvr=6&leftnav=1&isspecialgroup=1", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://weibo.com/mygroups?gid=3979203194137677&wvr=6&leftnav=1&isspecialgroup=1", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
                {
            name: '豆瓣电影我想看',
            image: 'https://i.ibb.co/pwkLTFc/1.png',
            host: ['movie.douban.com'],
            popup: function (text) {
                open('https://movie.douban.com/people/soooulp/wish?sort=time&tags_sort=count&filter=all&tag=%E6%9C%AA%E7%9C%8B&mode=grid');
/*                try {
                    //这里
                    if(GM_openInTab("https://movie.douban.com/people/soooulp/wish?sort=time&tags_sort=count&filter=all&tag=%E6%9C%AA%E7%9C%8B&mode=grid", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://movie.douban.com/people/soooulp/wish?sort=time&tags_sort=count&filter=all&tag=%E6%9C%AA%E7%9C%8B&mode=grid", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
        {
            name: '知乎收藏',
            image: 'https://i.ibb.co/qJg9gMm/zhihu.png',
            host: ['www.zhihu.com'],
            popup: function (text) {
                open('https://www.zhihu.com/collections/mine');
/*                try {
                    //这里
                    if(GM_openInTab("https://www.zhihu.com/collections/mine", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://www.zhihu.com/collections/mine", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },{
            name: '哔哩哔哩',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAX1QTFRFAAAAOLXiLa/jLa/hNLLjPrfhKa7kLa7jMbHiKK7jNrPiM7DiLbDkLK/kLrHkJ63lK6/kK7DkKK7kLLDkLLDkLK/kMLHjM7PiKK3kKK3kKK3kJ67kJ63kKK7lKK7kKK7kJ63lL7HjLK/kJq3lMrHiOrXjOrbjOLbjObfjOrbiObbiOLbhOrXiM7LhKK3kJ67lLq/kJazkotnfJ63kJazkLrDlJa3kZsLeKq7kKq7kLK/kLq/kKa3kKq7jMrLjJq3kJqzlLrDkJqzlltPfK6/jLbDjPbPjO7PfL7HjK6/jM7LgJq3jJq3kodjdWL3ePrTfL6/kJazlotreM7LiLbDjLa/iMLHiJq3lLK/kdcXftN/rueTvJ63kL7HiJqzkLa/jLa/iLq/jLK/jLa/jLrDjLK/jJq3kKq7jPLbhKq7kJ63lJ63kKK7kJ63kKK3kKa7kJ67lKK7kKK3kNbPhRrjeM7PlJq3kLa/kNbTmNLTlNbPlL7DlJq3lM7PkObThlarHMgAAAH90Uk5TAAcgFhMSzEcqyjIubXCi7Hlx2b1wbzsf5+PT09PT09zxOHz/UCgoKCgoKCgoO/eUmf8I4JmZ/xeazK1/1qQm4JmZ/wt/TxwSRncb4JkIBA2Z/whfpql0mZUMAgLlVv99WFhYWFhr+ngHnt3839/f3+vhshEFGDElGhoaITMcCNG/cEUAAADFSURBVHicY2DABhiZQCQzC1yAlY2dgYGDkwvK5ebh5eMXEBQSFhEVA/HFJSSlpGWkZaXlZOUVFIECSsoqqmrqGppa2jq6evpAAQNDI7hhxiZAwtTM3MLSioHB2sbWzt4BKODo5Ozi6sbA4O7h6eXtA9Ki7Ask/fxBWsAqAgKDGBiCQ0LDgGzvcCARYRYJJKOiQSpiQAKxcfEJiUkJySnJCalp6UCBjMysbIWc3Lz8AuXComKQupLSsvKKyqqq6praOiw+BwCPTyMfthoNdQAAAABJRU5ErkJggg==',
            host: ['www.bilibili.com'],
            popup: function (text) {
                open('https://www.bilibili.com/');
/*                try {
                    //这里
                    if(GM_openInTab("https://www.bilibili.com/", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://www.bilibili.com/", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
        {
            name: '百度云',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAYxQTFRFAAAAW93/Sdn/QtT/PM//NMn/MsX/LL//aeD/Rdn/P9b/OND/M8r/JsL/Ib3/I7v/Utn9R9X8QtX/Utb/meT/LML/Hbf9HrL7wqO1zpOkiLbUO8T/mn+xvmeVr5/HTdf/R9P/wZyx/3qD/nyI/4mZ/lFx/0lsVKflM7v/Rtj/QNT/OdD/Xbzm9HuI/3KA/2t//2d//1h2/01v1FmGEbH/Dq7/GK//J7T/Rdf/PdP/PNH/S8v31oeb/2t7/2N4/1t1/1Fw+E5ypXiqH7b/D67/Cqr/Dqv/Q9f/QNT/U9j/qarJkprAwXudy2+TtHSgu2+bJLb/CKn/B6j/Q9f/QNT/Wtr/eN3/McX9PbfwRbDqSbDrPr35Mbr/RNf/P9T/RNT/adr/O8v/LMb/KcL/N8X/J73/I7r/ML3/Ob7/FbD/RNb/PtP/M8z/MMn/LMb/KsT/Jrz/Grj/FbX/ELH/Da7/Eaz/Gq//Stj/QdT/OND/M8z/L8j/NMj/O8n/M8D/HLj/FbT/ELD/Dq7/H7P/DaNwzQAAAIR0Uk5TAAlt4fewQQMGkfv////jWD70wx8FaOfccv9mCrP9GQg0rv9cAq3/bSMdsf///8knGm/r////ageh+s90xP/m2ffyoYjv8ivyyhsF1f//41ZL/zP6vwsBxv/qXhYx1OhrE03z8WdmjDEgolXi///sP5v5////uRYCJDMzMyEEDS8zMzAP4jHjiQAAALNJREFUeJxjYCATMDIxs7CyscP5HJxc3Dy8fPxwAQFBIWERUTFxuICEpBQDg7SMrByEK6+gqKTMwKCiqqauAeJramnr6OrpGxgaGZuYmpkzMFhYWlnb2NrZOzg6Obu4ujEwuHt4Mnh5+/j6+TMwBAQGMTAEh4QyhIVHREZFMzDEgARi4+ITEpOSU1LT0jMyQQJZ2dw5uXn5DAWFRcUlpWUMDOUVlVXVNbUMdfUNjU3NmN4CAGNZIxjBpgzOAAAAAElFTkSuQmCC',
            host: ['pan.baidu.com'],
            popup: function (text) {
                open('https://pan.baidu.com/disk/home?#/all?vmode=list&path=%2F%E6%88%91%E7%9A%84%E8%B5%84%E6%BA%90%2F0');
/*                try {
                    //这里
                    if(GM_openInTab("https://pan.baidu.com/disk/home?#/all?vmode=list&path=%2F%E6%88%91%E7%9A%84%E8%B5%84%E6%BA%90%2F0", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://pan.baidu.com/disk/home?#/all?vmode=list&path=%2F%E6%88%91%E7%9A%84%E8%B5%84%E6%BA%90%2F0", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
/*        {
            name: '印象笔记',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAANJQTFRFAAAAEKkpEKozD6kqEqknBKgmAKgtBKguHa86Hqw2JKwrE6svAKcoAagiAagsBagpicKNFKooAKgoAKcmE60xFaoqFqosFqozFaoyH689B6kvEKouAaclAKgsAKckDqktDqszRLdOBqkuAKcqHqstAKgsCKktAqgrEKoxJa4yB6grAqgrAKcpC6kuAKEACqglEKszAagtAKgoC6glDKkvEqcjEqszBKgnAacnG644AKklGK44EagpBKgoC6oxIK89BKkuBKgqE6oiCKgqCqgpa7t1SRDOXAAAAEZ0Uk5TABhaMkWH//dtQBVi4o3+nwJh/92cRRV5dXrsd2T/lVLkWfuZI5m39qsOoOv9mgJVtv+ZGpollIikpQR6PZvXkfmxDIhwAzWe/NQAAACCSURBVHicY2DADhiZmFH4LKxs7BycXHA+Nw8vGxDw8QtA+IJCwiJsYCAK5ouJS0hKQQSkwQIybFAgyyYHFpCH8hUUlZTBAiqyMCVsqhBD1YBMdQ0kAU0tbR1dPX0DQzYjJLcZm5iasZkjCVhYWlmz2SAJ2NrZOzgie8fJWdXFFZu/AWCxCwlg64eoAAAAAElFTkSuQmCC',
            host: ['app.yinxiang.com'],
            popup: function (text) {
                open('https://app.yinxiang.com/client/web#?an=true&n=6f9ede55-c0be-4c9b-8fde-590ce3885333&s=s44&');
//                try {
                    //这里
//                    if(GM_openInTab("https://app.yinxiang.com/client/web#?an=true&n=6f9ede55-c0be-4c9b-8fde-590ce3885333&s=s44&", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
//                         fadeOut(icon);
//                         console.log("doSomethingOk");
//                     } else{
                         //fail info
//                         console.log("doSomethingNotOk");
//                     }
//                    return GM_setClipboard(selText, "text");
//                } catch (error) {
//                    return GM_openInTab("https://app.yinxiang.com/client/web#?an=true&n=6f9ede55-c0be-4c9b-8fde-590ce3885333&s=s44&", { loadInBackground: true, insert: true, setParent :true });
//                }
//            }
        },
*/        {
            name: '网易云音乐',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAXdQTFRFAAAA4CAk4hgd4hgd4Rwg4Roe4Rsg4R8j4xYb5BQZ5BQZ4xcc4R4i4R0h4xkd4xUa4xUa4Rwh4xUa4xcc4Rwg4hoe4R4i4hke5BQZ4xcc4Bwh4B4j4xYb4xQZ4hcc4B8j3yQo4xUa4xYb4hkd4xUa5BQZ4xYa5BQZ4hcc2DxB4hoe4xUa4hkd3yYr4xUa4xUa4hoe4xUa4xgc4xYb4xUa4hgd4xke4xYb4B8j4x0h5BUa4xYb3C0v5BQZ4xcc3yEk5BUa5BMY4xkd4xYb4R4i3yAl4xQZ4xUa4hkd5BQZ4xcb4xYb5BMY4hsg4xUa4hcc4hsg4xUa5BUZ4xcb3yMo3icq4xYa5BMY3iYp4xcb4xUZ4hsg3Csu4Bwg4hsf4CMn2yQo4xgc4xUa4hke4Rsf4xUa4xYb4hsf3Cov3iIm4hcc5BQZ4xYb3ikt3iEl4xUa5BQZ4xQZ4xQZ5BQZ5BQZ4hke3yEm4B8k4hcc5BMY5BQZ4hsf2DEz9FM9EAAAAH10Uk5TABJ0jCogQxiu7Nq+IAhQ1rg31ZccKwZD4JEjFtbUcBYQwatf6PPW7W4BQtJVFbzCYdqDms40YM8lNtNyDcSkEcRkXNEyFcPGc9+OpmYw03JFy+KfFwq+ZQSS2yIDEiMLA3vUPyzFt0gKGmDukQURvfD77/rpbQsJKDMxHwF7H+1nAAAAp0lEQVR4nGNgIBowMjGzIHisbOwcnFzcPFAuLx+/gKCQsIioGFRAXEJSSlpGVk4eyldQVGJQ5lRRVVPX0AQLaGnr6OrpGxgaGZuYggXMzC0sraxtbO3sHRzBAk7OLq5u7h6eXgzePmABXz9/hoDAoOCQ0LBwsEBEZFR0TGxcfEJiUjLEmpTUtPQMhsys7JxcqMV5+QWFRcUlpWVwp5dXVFZWVddg9SQA1N4eyTu5EdIAAAAASUVORK5CYII=',
            host: ['music.163.com'],
            popup: function (text) {
                open('https://music.163.com/#/my/m/music/playlist?id=10490120');
/*                try {
                    //这里
                    if(GM_openInTab("https://music.163.com/#/my/m/music/playlist?id=10490120", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://music.163.com/#/my/m/music/playlist?id=10490120", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
        {
            name: '吾爱破解',
            image:'https://i.ibb.co/FWVJ3Kf/1-2.png',
            host: ['www.52pojie.cn'],
            popup: function (text) {
                open('https://www.52pojie.cn/forum.php?mod=forumdisplay&fid=16&filter=typeid&typeid=231');
/*                try {
                    //这里
                    if(GM_openInTab("https://www.52pojie.cn/forum.php?mod=forumdisplay&fid=16&filter=typeid&typeid=231", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://www.52pojie.cn/forum.php?mod=forumdisplay&fid=16&filter=typeid&typeid=231", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
        {
            name: 'CSDN',
            image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAALdQTFRFAAAA4jI79w4b+wcW/AUV/QUU/QMT/QUU/AUU+wcW8BQg+QcW/gER/QIR5g0a8QQS9QEQ9QER9QMS9QcW9gkY9wwb9wkX9ggW8w0a1CQt4wUS5wEP5gEP5wYT6hIe0g4Z2QEO2QEP2RYhzQkQ0AEJzwQM3GVqywoLzAABzAECyBMUxxMUyQEBygAAyAQEwx0dxgkLxwECxgIDxQUGxAUGxAUGxQUGxQsNxA8QwwUGwwEBxAABwwoKvxT9XwAAAD10Uk5TAAVWptv5//vmcSTN/5kv3P//4aV6cHmXVQjQ//++I1v//y2T//oCg//+Lyz9/88gf//6z7m91I1Py///exTHXpgAAABlSURBVHicY2AgEzAyMbOwsrFzcEL5XNw8EMAL4fPxCwgKCYuIiolLgPmSUtIysnJIBsgrKCoqIZuorKKiqoYsoK6hoamFLKCto6urp48sYmBoaGhkbGJqZg4TsbC0sgYBG/K8BQAG1glXveTymAAAAABJRU5ErkJggg==",
            host: ['bbs.csdn.net'],
            popup: function (text) {
                open('https://bbs.csdn.net/forums/JavaScript');
/*                try {
                    //这里
                    if(GM_openInTab("https://bbs.csdn.net/forums/JavaScript", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://bbs.csdn.net/forums/JavaScript", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
        {
            name: 'Greasyfork',
            image: 'data:image/png;base64,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',
            host: ['greasyfork.org'],
            popup: function (text) {
                open('https://greasyfork.org/zh-CN/scripts?set=359618');
/*                try {
                    //这里
                    if(GM_openInTab("https://greasyfork.org/zh-CN/scripts?set=359618", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://greasyfork.org/zh-CN/scripts?set=359618", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },{
            name: '油猴',
            image: 'https://i.ibb.co/Fb2STTZ/1.png',
            host: [''],
            popup: function (text) {
                open('chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=dashboard');
/*                try {
                    //这里
                    if(GM_openInTab("chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=dashboard", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=dashboard", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
        {
            name: 'Github',
            image: 'data:image/png;base64,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',
//            image: 'https://i.ibb.co/84bSvBk/icons8-github-512-1.png',
            host: ['github.com'],
            popup: function (text) {
                open('https://github.com/issues');
/*                try {
                    //这里
                    if(GM_openInTab("https://github.com/issues", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://github.com/issues", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },{
            name: 'V2EX',
            image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAOFQTFRFAAAAXFxcOTk5Ly8vQEBALy8vLy8vYWFhNzc3CwsLAAAAEhISeHh4iIiIHh4eBgYGAwMDLy8vVVVVExMTCwsLPT09SUlJGxsbAQEBDw8PQkJCOjo6AwMDCAgIKCgoqqqqIiIiFBQUAgICNjY2aWlpDg4OIyMjZmZmHBwcCQkJCgoKbGxsJiYmFhYWKioqGxsbAQEBFxcXTExMBQUFFBQUICAgFRUVJCQkwMDAFxcXKysrCAgIIyMjICAgGxsbDg4OR0dHGhoaBAQEBgYGFhYWW1tbT09PMTExJycnKioqRkZGiyCsfwAAAEt0Uk5TAFHp/3Ir1YQewf+qCgRT9v4uA5jJHxV+/t0FQf/yTgM+0v9hFO50EF/09B2Wsy+g/7lG/+lK0oMBzLLiOJT1xx5O7++MAyehzLQyHRLPvQAAAHpJREFUeJxjYCAHMDIxswApVjZmdogABycXNw8DLx+/gCBEQEiYS0SUQUxcQlIKqkdaRlZOXkFRSRlmiIqqgJq6hqaWNtxYHS5dPX0DQ4Q9RsYmpmYy5ggBC0suKwlrGySn2ErYSdg7IAk4Ohk4u7giCbi5e3h6EeszAAFZC51LZPODAAAAAElFTkSuQmCC",
      host: ['www.v2ex.com'],
            popup: function (text) {
                open('https://www.v2ex.com/go/share');
/*                try {
                    //这里
                    if(GM_openInTab("https://www.v2ex.com/go/share", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://www.v2ex.com/go/share", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
        {
            name: '网易邮箱',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAQJQTFRFAAAA6GBl5kpP5DxD4iAu4yw15T5H4Roq5ElQ8szM5UBG4ykz4h8s4iEv5C424h8t4iAu4iw34yk24Rgp4icz4y854iMx4hso4ygz4RYl5URM4ycz4RYn4iQw4Rgp4R0o4iIu4RQj4BIf4BIh76Kl4yc04h0t4Rco4A8b4BEe5kZQ4yw54y874Rci4ykw4iMu4Rgo4iIs4ykw4yg05lFS4ycz4RMi4RUg5TpE756h4ycz4iAt4RUl4RMi4yw44hsq4Rko4Rcj4ycv4ys04h4r4yYv4iIs4Rcm4h0r4RUk5DM65C845DQ64ic04iIw5DU/5D9G5DtD5DQ/5DVA4Rkk4RkmKSzE6wAAAFZ0Uk5TABYcgv9mmf8EBkFziyQMdKaAyP+zgKbdPfFPwjNZ+Yiz/2bZDbNm/3NmOsQuiIXL/7p4xk7KM3iVDbOz/988zS+rZpCxgmvguOZdTgY9a01NTUcbXp0hunl1AAAAi0lEQVR4nGNgwAoYmVD5zCysqAJs7EABDk4ubh5eBgY+fgFBIWERUTFxCUkpaRkGBlk5ebAKBUUlZRVVoICaugZUQBNTQEtbBySgq6dvYGhkDBQwMTUDCZgzWODSYmmFJGBto2lrZ+8AEnB0cnZxdXP30PT08vZhYPD18w8AgsCgYE1lNB+GhGL1OADWQhYBtDv43wAAAABJRU5ErkJggg==',
            host: ['mail.163.com'],
            popup: function (text) {
                open('https://mail.163.com/js6/main.jsp?sid=SBpqmfNetDkAGMIdNDeesPizPEYtMYqF');
/*                try {
                    //这里
                    if(GM_openInTab("https://mail.163.com/js6/main.jsp?sid=SBpqmfNetDkAGMIdNDeesPizPEYtMYqF", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://mail.163.com/js6/main.jsp?sid=SBpqmfNetDkAGMIdNDeesPizPEYtMYqF", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
        {
            name: 'QQ邮箱',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAIdQTFRFAAAAv7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/9TJlxAAAAC10Uk5TAA13zs8MdnOH+/+IcXj5oV/0nbxW7LiMMt0zxWbDOWXJXelbxsH3XsBQaOZa++X9KAAAAHVJREFUeJytz0kDQzAQhmH78lma1FJbUFol/P/fRyqcHby3eS4zoyh3pGq6IdM1cwPLdlz8cz3f2iAIH4SKmZJnGAgAojgBkjgFJOCV5Xnh4ISyYnXNGnZA+6boOtD+s8OXDPuW4TcKmPgM2cwncdnCz5Yrn6zDjQnl9CnXXwAAAABJRU5ErkJggg==',
//            image: 'https://i.ibb.co/vQcMyHJ/icons8-new-post-96-1.png',
            host: ['mail.qq.com'],
            popup: function () {
                open('https://mail.qq.com/cgi-bin/frame_html');
/*                try {
                    //这里
                    if(GM_openInTab("https://mail.qq.com/cgi-bin/frame_html", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://mail.qq.com/cgi-bin/frame_html", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
                {
            name: '历史',
            image: 'https://i.ibb.co/3zdGrsw/3-3.png',
            host: [''],
            popup: function () {
                open('chrome://history/');
/*                try {
                    //这里
                    if(GM_openInTab("chrome://history/", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("chrome://history/", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },{
            name: '扩展',
            image: 'https://i.ibb.co/0h8rvd4/1-2.png',
            host: ['mail.qq.com'],
            popup: function () {
                open('chrome://extensions/');
/*                try {
                    //这里
                    if(GM_openInTab("chrome://extensions/", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("chrome://extensions/", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
        },
        {
            name: '下载',
            image: 'https://i.ibb.co/t2nY9c8/2-1.png',
            host: [''],
            popup: function () {
                open('chrome://downloads/');
/*                try {
                    //这里
                    if(GM_openInTab("chrome://downloads/", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("chrome://downloads/", { loadInBackground: true, insert: true, setParent :true });
                }
*/            }
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
//                if ((typeof GM_info !== "undefined" && GM_info !== null ? GM_info.scriptHandler : void 0) === "Violentmonkey") {
//                    return document.execCommand('copy'); //重复
//                }
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
//                document.execCommand("Cut", "false", null);
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
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return document.execCommand("Cut", "false", null);
                }
            }
        },
        {
           name: '退格',
//           image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAACFQTFRFAAAAf39/f39/f39/f39/f39/f39/f39/f39/f39/f39/fqoK0AAAAAt0Uk5TAB+2DROq/77S4R2U0NWIAAAAVklEQVR4nGNgwARCBgwMLIFAhloJA4NHEpBhnunANa0ZyGCZVuyRsQCkyD1jWjFYNXNbugGYwTItwwHMWJHe1sKArNgjw4ClbQqQEdbFwLAyFdkKdAAASLITTx0dwwIAAAAASUVORK5CYII=',
           image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
           host: [''],
           popup: function (text) {
               text = document.defaultView.getSelection().toString();
//               document.execCommand("Delete", "false", null);
               try {
                    //这里
                    if(document.execCommand("Delete", "false", null)){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return document.execCommand("Delete", "false", null);
                }
            }
        },
        {
          name: '粘贴',
          image: 'data:image/png;base64,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Uf/1j1H/9Y9R//WOUP/1jlD/9Y5Q//WOUP/1jk//9Y5P//WOT//1jU//9Y1P//WNT//SfU8tAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9ZBT//WQU//1kFP/9ZBT//WQU//1kFP/9ZBT//WQU//1kFP/9ZBT//WQUv/1kFL/9ZBS//WQUv/1j1L/9Y9S//WPUv/1j1H/9Y9R//WPUf/1j1H/9Y5Q//WOUP/1jlD/9Y5P//WOT//1jk//9Y1P//WNT//yiEnvAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPWQVP/1kFT/9ZBU//WQVP/1kFT/9ZBU//WQU//1kFP/9ZBT//WQU//1kFP/9ZBS//WQUv/1kFL/9Y9S//WPUv/1j1L/9Y9S//WPUf/1j1H/9Y9R//WOUP/1jlD/9Y5Q//WOT//1jk//9Y5P//WOT//1jU//5oRNhQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD1kFT/9ZBU//WQVP/1kFT/9ZBU//WQVP/1kFT/9ZBT//WQU//1kFP/9ZBT//WQUv/1kFL/9ZBS//WQUv/1j1L/9Y9S//WPUv/1j1H/9Y9R//WPUf/1jlD/9Y5Q//WOUP/1jlD/9Y5P//WOT//1jk//9Y1P/9mAUygAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9ZBU//WQVP/1kFT/9ZBU//WQVP/1kFT/9ZBU//WQVP/1kFP/9ZBT//WQU//1kFP/9ZBS//WQUv/1kFL/9Y9S//WPUv/1j1L/9Y9R//WPUf/1j1H/9Y9R//WOUP/1jlD/9Y5Q//WOT//1jk//9Y5P/+2GTOkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPWRVf/1kVX/9ZFV//WRVf/1kVX/9ZBU//WQVP/1kFT/9ZBU//WQU//1kFP/9ZBT//WQUv/1kFL/9ZBS//WQUv/1j1L/9Y9S//WPUv/1j1H/9Y9R//WPUf/1jlD/9Y5Q//WOUP/1jk//9Y5P//WOT//ph059AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxkFPi9ZFV//WRVf/1kVX/9ZFV//WRVf/1kFT/9ZBU//WQVP/1kFP/9ZBT//WQU//1kFP/9ZBS//WQUv/1kFL/9Y9S//WPUv/1j1L/9Y9R//WPUf/1j1H/9Y5Q//WOUP/1jlD/9Y5P//WOT//1jk//2oBTIgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8pJad/WRVf/1kVX/9ZFV//WRVf/1kVX/9ZFV//WQVP/1kFT/9ZBU//WQU//1kFP/9ZBT//WQUv/1kFL/9ZBS//WPUv/1j1L/9Y9S//WPUf/1j1H/9Y9R//WOUP/1jlD/9Y5Q//WOT//1jk//841O4QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN+fgAj0kVPZ9ZFV//WRVf/1kVX/9ZFV//WRVf/1kFT/9ZBU//WQVP/1kFP/9ZBT//WQU//1kFL/9ZBS//WQUv/1j1L/9Y9S//WPUv/1j1H/9Y9R//WPUf/1jlD/9Y5Q//WOUP/1jk//9Y5P/++LUHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA35+ACPKUXHrwkFHk9ZFV//WRVf/1kVX/9ZBV//WQVf/1kFX/9ZBU//WQVP/1kFT/9ZBT//WQU//1kFP/9Y9S//WPUv/1j1L/9Y9S//WPUv/1j1L/9Y5R//WOUf/1jlH/9Y5Q//WOUP/0kFkXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          host: [''],
          popup: function () {
//             text = document.defaultView.getSelection().toString();
//             document.execCommand("Paste", "false", null);
              try {
                    //这里
                    if(window.navigator.clipboard.readText()
  .then(text => {
    console.log('Pasted content: ', text);
//typeInTextarea(text);
//typeInTextarea("lol");
//  insertAtCaret('en-note',text);
document.execCommand("insertText", "false", text);
  })
  .catch(err => {
    console.error('Failed to read clipboard contents: ', err);
  })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return paste();
                }


          }
        },
                {
           name: '加粗',
//           image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAACFQTFRFAAAAf39/f39/f39/f39/f39/f39/f39/f39/f39/f39/fqoK0AAAAAt0Uk5TAB+2DROq/77S4R2U0NWIAAAAVklEQVR4nGNgwARCBgwMLIFAhloJA4NHEpBhnunANa0ZyGCZVuyRsQCkyD1jWjFYNXNbugGYwTItwwHMWJHe1sKArNgjw4ClbQqQEdbFwLAyFdkKdAAASLITTx0dwwIAAAAASUVORK5CYII=',
           image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
           host: [''],
           popup: function () {

//               document.execCommand("bold", "false", null);

               try {
                    //这里
                    if(document.execCommand("bold", "false", null)){
//                   if(document.execCommand("insertHTML", false, "<b>"+ document.getSelection()+"</b>")){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return document.execCommand("bold", "false", null);
                }
            }
        },        {
           name: '撤销',
//           image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAACFQTFRFAAAAf39/f39/f39/f39/f39/f39/f39/f39/f39/f39/fqoK0AAAAAt0Uk5TAB+2DROq/77S4R2U0NWIAAAAVklEQVR4nGNgwARCBgwMLIFAhloJA4NHEpBhnunANa0ZyGCZVuyRsQCkyD1jWjFYNXNbugGYwTItwwHMWJHe1sKArNgjw4ClbQqQEdbFwLAyFdkKdAAASLITTx0dwwIAAAAASUVORK5CYII=',
           image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
           host: [''],
           popup: function (text) {
               text = document.defaultView.getSelection().toString();
//               document.execCommand("Delete", "false", null);
               try {
                    //这里
                    if(document.execCommand("Undo", "false", null)){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return document.execCommand("Undo", "false", null);
                }
            }
        },
        {
           name: '重做',
//           image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAACFQTFRFAAAAf39/f39/f39/f39/f39/f39/f39/f39/f39/f39/fqoK0AAAAAt0Uk5TAB+2DROq/77S4R2U0NWIAAAAVklEQVR4nGNgwARCBgwMLIFAhloJA4NHEpBhnunANa0ZyGCZVuyRsQCkyD1jWjFYNXNbugGYwTItwwHMWJHe1sKArNgjw4ClbQqQEdbFwLAyFdkKdAAASLITTx0dwwIAAAAASUVORK5CYII=',
           image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
           host: [''],
           popup: function (text) {
               text = document.defaultView.getSelection().toString();
//               document.execCommand("Delete", "false", null);
               try {
                    //这里
                    if(document.execCommand("Redo", "false", null)){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return document.execCommand("Redo", "false", null);
                }
            }
        },
        {
           name: '全选',
//           image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAACFQTFRFAAAAf39/f39/f39/f39/f39/f39/f39/f39/f39/f39/fqoK0AAAAAt0Uk5TAB+2DROq/77S4R2U0NWIAAAAVklEQVR4nGNgwARCBgwMLIFAhloJA4NHEpBhnunANa0ZyGCZVuyRsQCkyD1jWjFYNXNbugGYwTItwwHMWJHe1sKArNgjw4ClbQqQEdbFwLAyFdkKdAAASLITTx0dwwIAAAAASUVORK5CYII=',
           image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
           host: [''],
           popup: function (text) {
               text = document.defaultView.getSelection().toString();
//               document.execCommand("Delete", "false", null);
               try {
                    //这里
                    if(document.execCommand("selectAll", "false", null)){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return document.execCommand("selectAll", "false", null);
                }
            }
        },
        {
           name: '删除线',
//           image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAACFQTFRFAAAAf39/f39/f39/f39/f39/f39/f39/f39/f39/f39/fqoK0AAAAAt0Uk5TAB+2DROq/77S4R2U0NWIAAAAVklEQVR4nGNgwARCBgwMLIFAhloJA4NHEpBhnunANa0ZyGCZVuyRsQCkyD1jWjFYNXNbugGYwTItwwHMWJHe1sKArNgjw4ClbQqQEdbFwLAyFdkKdAAASLITTx0dwwIAAAAASUVORK5CYII=',
           image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
           host: [''],
           popup: function (text) {
               text = document.defaultView.getSelection().toString();
//               document.execCommand("Delete", "false", null);
               try {
                    //这里
                    if(document.execCommand("strikeThrough", "false", null)){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return document.execCommand("strikeThrough", "false", null);
                }
            }
        },{
           name: '移除格式',
//           image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAACFQTFRFAAAAf39/f39/f39/f39/f39/f39/f39/f39/f39/f39/fqoK0AAAAAt0Uk5TAB+2DROq/77S4R2U0NWIAAAAVklEQVR4nGNgwARCBgwMLIFAhloJA4NHEpBhnunANa0ZyGCZVuyRsQCkyD1jWjFYNXNbugGYwTItwwHMWJHe1sKArNgjw4ClbQqQEdbFwLAyFdkKdAAASLITTx0dwwIAAAAASUVORK5CYII=',
           image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
           host: [''],
           popup: function (text) {
               text = document.defaultView.getSelection().toString();
//               document.execCommand("Delete", "false", null);
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
//                    return GM_setClipboard(selText, "text");
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
//                window.open(text, "_blank");
//                else window.open("http://"+text, "_blank");
//                else GM.openInTab("http://"+text, open_in_background);
//这里
//                GM_openInTab(text, { loadInBackground: true, insert: true, setParent :true });
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
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab(text, { loadInBackground: true, insert: true, setParent :true });
                }
               }
//                else GM_openInTab("http://"+text, { loadInBackground: true, insert: true, setParent :true });
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
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("http://"+text, { loadInBackground: true, insert: true, setParent :true });
                }
               }
            }

        },
/*      {
            name: 'bdfilm',
            image:"data:image/png;base64,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",
      host: ['www.bd-film.cc'],
            popup: function (text) {
//                open('https://www.bd-film.cc/search.jspx?q=' + encodeURIComponent(text) );
                try {
                    //这里
                    if(GM_openInTab("https://www.bd-film.cc/search.jspx?q=" + encodeURIComponent(text), { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("https://www.bd-film.cc/search.jspx?q=" + encodeURIComponent(text), { loadInBackground: true, insert: true, setParent :true });
                }
            }
        },

        {
            name: 'Tampermonkey',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAAAw1BMVEUAAACJZkyJZkyJZkyJZkyJZkyJZkyJZkyJZkyJZkyJZkyJZkyJZkyJZkyJZkyJZkyJZkyZc1WfeFmkfFy1iWWqgF/Km3LgrH7bqHu6jWiUb1K/kmvQn3WvhWLVo3jFlm6Oak+3jWmshWSOblTBlW7LnXSYdllkTz87MCpFOC9vV0Sifl/WpHl5X0qDZk+QbFS1in+nfm5aRzqYcl3ToaD/xdPElpBQQDXap6nwucL4v8u9kIeuhHbirbHps7qfeGXLm5g0FbNKAAAAEXRSTlMAMEBQgL+PcJ/f/yDvr2AQz4J8ZvoAABhUSURBVHgB7MGBAAAAAICg/akXqQIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGbvPhAsBWEADAckCBHFLfe/6tbpvTpq/u8KCUkoz7cJhBjjkC7olZz+G+MfQU4F4W/Ii2q1l6uq+i8fJjkqxJiSqr2baknjgeoCppiyNvtoTee0xC7YsThmtU/UEgmw39iX1T5XGwV71Ierde9t9WNaSrUtzJNgfyu/2jZqFOxLSGqbyV2wJ8NF3Xe4/NGXuZmZ1+VP9G1bbRDsxVCabWydBPsQcrPt5TRE2QFK/2pfp2lJXAx+oVhsDzSPUXxh8d+zli2zAFNqtj9rXugIWwjFdqvNYxB8pqh2wWESYFC74DAJsFQ7kFqWLvg4sdrhrIlC4Kb3P6JRCD5AUDsyHSfB203FDm/NQfAmPTU7hZoHwasN1c6jFXLgdSa1C+SAQz3ZBXKAnf+ZaBQ8pxc7p5YnwbOGZqdUxy54Vp/tlOoieIHYHIcfPXsOP8LqOfxYmp0OvyVk82eVa2G35f9CK5PAVfm/Z46Cx2U7v5Vh8DFdbW/YD9D+mQc5/Nvg84JY7IrDRoBkZqSAX8VcWqNc4PTPKZ0EfTXHcif+5lpbiL9zGpzHH6n7jj9qdB5/5E78KQLEnyLgOP6oQTyZDXeNzs//od338y+0wP0/beD8BsOjSpezC83g+D9pejV4HgTU8IzF+QYQyfkGAIUBkM2A6wEQa+cGgAw4m9HcIQMYAMgAngCQAVwBkgHR/CAD2AGSATQAzgRpAGQADYBHQjQAboeDwfULkdXeAa37vgPAKofWm8HlVoAJkEGQCZBBUA1uz4Q5A2QMqPYhMPAOnNMACoBnMwXAuZECQBOgANAEKAB+DRQA32qnAPiWKADOTb5vAaDubgG+ff/+4+e13+TcZaLkKhAF4OtSV4MdQiXA/lf5/o69qbSg820g3UEOwbRSioahfvvxC13o7p+5DUZZ4xz+zDtnjFbUKaXN6pzHnzlnrKJzvd6M4o3OFixvOMK7dVfUEbWvzuOIjW2Ye2/IA51Hc8RpYjIqU2NZmXTyD2c9cRfwSmfQCQKhRTUg9FiCpCddErink4XV4yI+7QtVtuzp0l+9hhmXBD7oRMrhGmLFniBYjrgGp6abDXorWvyCbVVUnFo3yEpUgff5DoMsDlfm2WYqJlv2uDK30FGfkw0B84oiUpkwCDahiDXP8yFwS8dpj2K2PdBVhX1DMV5P0wU80VGZUdZ2vSzIdkNZnOmIx3kSYIkoL9l8jdJPKC8udMTdLAlgParwrOkimmv9UksHvEySAAb1RBPoTMFE1GPogLcpEoBRl7N0ButQFw8/GXTbtPyFadcC09MNasDrBAnAaMLZ9o1fwoNvEP5uX/7CaKB58guYJC+jrwMYtMSKBIrRkiHJ19i7gS0ac7Zx3y+wA88GfpBo8Wgu7pn+KO8Rzfll3NnAd5LkiB54E/4U/R49iHnUqYBbEiX0ggP9JDB6kUbdGvZMEo2OcGhW/AI96PWRHyTIHl3h0Kj4BT6PmQHvJGD0hkN/xS/PBnwOOgRQ6BAzOqRGvC/ikwQb/mPvXPjSVoIovqAoLilgtS5VryUkkA0J2qJpqm3t/f5f6r6f/oQDYc+YbfP/AH1kDvPa2dmGDbnUa/HzSuAb0+CoHbTn5UHAldmYhiu9jgNVRxoH4JI33p0JtxsH4JIr7wrBfuMAnPLGt0LwoCkBnHLp21BAx20PoOG1Z0lA4LYJ2HDhVxIw0OsYmwanJwJ7HhQBxBSwSQMPPCsC3pkGp3MBHb9WQ52bCjSc+3Qc0G0igGgMaHlUBTYRgBAD+l7dCjSVaPApCySMAjaceJQF6jW8NZVoeOtPFtgmnAM0XPrTC2w3bUAGY2+WxbSbFIDBiTebIvYZ94EbTv0oA9qH3XVV4JmpSMOZXknQ2d8bqJentd/RgJGpSMMILYzp9l9UBHvdQEPOTWUazjVkeNhTL0ILWN/dMFAzFgQYvoAf6A+11E7AJgvEBF1RNzDYDzTA7TRYMxeG6bRrYH5CEdCUAXWTwCEwP6sIaMoATKel2LSP9JaYHWjQW9IdKCaDrgZQi4CmDMAEh8y6P9CNAF5YAJhOT/Dnj/nJ7EDDT3p7gr5i0BpqTNMGEGgEYF4NCJ2fQDcC8EUAetgSvvzbtAFEGwGYYI8S/hsBeCAAwuD4YKgbAfgmAN2Vtj9hNUzDlaYqgG9/bSiEk+h3wti8OHEY/c4kNBQ0QQFU+/MFMJ0l9h/SeZabFyPP5qn9h2Q2FRUApku3v7wAwsQ+ZTE1L8J0YZ+ShGQByCugo+skgPiJ+ZEE+OZ/ShLLC4B5h7CraySA/NquIJ0ZYWapXcF1Li8AWjV4qDfg5v0HEQHES7uaJDeC5IldzTIWEcDtDf+96bbGfLgrio8SApikdh1lbMSIS7uOdCIhgI/Fp/caE/RUZQYB/vHfF4WMADILSMUUEKcWkIkIoCgePmI3MCQmgJ8fimK9AM759ucrANufp4DxOgFsJoEDVgLw5b74izu6B5hYK6oAYH/MhO4BPhV/8vCZ9N5wL9DruP1a/MNXvRLJj26XuaGTL62kGPVK/v3+j99AGjAgBID3DwVBAOCjQ+aGztxaSTFCAYAY/AevnAeAm7uiEBTAtd2UmSEzs5tyTRbAY/EfHm/d1oKgArh9LP4PVwCh3Zh0aqhMU7sxIVcAxf94WBsGjty2AL89FJICyEu7OYmhktjNKXOuAJ7wXmuHC0V6W9m/uGXOA0R2G0JDJLTbEDHnAb4VWAE75IGvtrJ/8YE4EZSndhtKQ6S025DmxImgDwVWQPVzwfZ29i++EAUQ2e3IDI3MbkdEFMDnYjsF9Co7AGB/UIa8dewAMAk1AxB2AW9BI3DjH6LuuskAbu6L57jj3QvI7LaExAxA2hud4jYArAUquIAu/Guf8JW3Kn5pt2VhSCzstix5K+Mfi+e4v3FRCAyw33kK7XJobAEExwuC0TbEtMuhxfN8clEIHG5eesA6cExoAiIy+RSQ1Q4cwyLgKZ8dDAcdQbezRfYxIhRegIVUBMCUrA0h74sVPNzuPBjQQgHgGT6S6sCprUBqKKS2AlNSFfhzUWwdBHo7XgS9fShW8pVUB2a2CrEhENsqZE6rQJCNg67cwY4R4K5YzQOpDFjYKsykzgExC1IRUKzmER8JVYoAt8U6Vhagx4QiELGQSQH4heDxljkgaAi2qkQA7ABAF9LsguV+db4WrdkFUI+v4F6v4FBtwrCKAyjuKFlgaKthCNhqhJQc8FOxjg+7PDU1AJoDqnPbDJ7YakyNc6a2GhNKI7hYASgEBgqzp5/nvljPN0YvMGL/7PjOKHLbBwQpAOjL7VVPAb4UgM+MJCBi/+z4ziiSSwGwMfarDwPfFYBPjJdjF+yvztfigpECPBbredwhCdDP81Agbgi7IhP/BZAQtkTeFEW1GBBUHgX4VkC+OL4e1gjgHBwEVIgBPYVoo6BToRC8bARQhStUBFYIyG2F2Ad/ZZVu8GkjAKcHATfVjbFftQh4KHaIAceNAJz2gd8XmNuq50EdoDnZGDD3XwBzRgTAfKhaBnQqNB5gDPhJ+qtnxjmZtBZPQQRYz8eqAsBD6BUOhM6bTqDbGgDzc9U6EBcBkr2gzFYjlpoHwWSSXSA8oUMRAB4NPWlOA53NgtwWLyCAr8VGfHR9RzS3lSjF7gViclOJEZgGRDySBCB9JlxyM29+RVI6nwZ8KDZCWgCgFTAW/eqRIRCJaRGkgHUWwFfXTwjPpOIuJpScT30HxoFrKACQBp5L5t6GgmQ98hpczqqtAO5cV4Il0+3yw1Hpuga8KzbjkVMGYm4cT4Yt/L4buHDsAHANKNsH4N8RmzArL35NOnHsAD6yBQBawZiHG8dngiUvAvBjQOnYAdzgGhC0gnmHQdgFXAhVXxODEfJGkbADwIdBvONg7ALOZebxS7ElYZipvAPAx8GkgRAsgIoXhRf+bglbOHYAWAB4IIQ3Eob3Fo9HfBdA3xPIdwDnGocA3kgYHgrFDsDxYMiC4wD4LmDh+BQAuwA8FEocC99kcfklfTnT0lBZ0pdVjcZaYxfAGgvHF0Nw7FnHa/qBQGiohPRjgDd6HTe7mSGgXA0DrWAHeWBC38pF2FqWOMgAgR0IV8PA5VDIN72e8RV1S//S0FlyXy441uu53SkC7Lu5Hg4akIQgEHI+OlOMoYNRYHAuR7gejhdE4LlgShDIpBIATEgsRi41ALhivCCCsCIGV584CGAWvAqQIcaFYQQA7IrxihjMfvX042cNoJ4LZ0aIjGB/EACAK3a1JAqvicOhB3NKmQ5LJ0aMSYoKQEIFgO2A18Q5WBSJiw/MGeGzl7ERJC4JUhyd6434VNUMR8RVsTAFxGcCmGliVzHPjSj53K4imZpqnGgEngvGq2IJy6LxOJizxWFZap+jDI04YWmfI80crgMAXdkKy6IJ6+LB3+z4unAelfYpZWZehOyZf0qUm60BFSCIxYR18fjBCBQBMBemMpNFav+lXITmxQgXpf2XdDExGHwGVLEVgB+MIDwZAyIAOBesTDyL5kmSzKMsNi9MnP31T5nFhLXQIAYQnoyBj0ZV+KtBP6gBnAGCGEB4NAo/GwcjAOZ4ZBpAAghiAO/ZOPxwJIwAmGMjTh6GqNIMYyPPhQbgqQD8cCTh6VjQfkC8McJEqbVliBoNibgELvW2fNreCfeYj0fjWTAxBeDThAye9GbC9h/rbfm8tf27hOfjQf+pbgqYwUPjJbjSy+EK2B/U46Tn41UXKwCfBFc/F2IOcpQ5uoNUGjlGx7oC98j+oATADAK9mttHWATyG0LVj5MjOHwc1dz++g7k//AYCHOo13BzVz0FwANC7Ku9aY6Om8t62R8fCD3e6nW0VQU66/8FDyAFqFkekMHz+iXrginB/vrbVj+/V6oKvUCv4/Yr3kjCV0C1q90lvIG2qI/9cTf4EcxiBwNViUPUj7oH48B1UoD9HzGa80rrYn/ck3/4rAF7qiIdWI4+4GnADTgZSY/yzuDMYWzoXJ5rCDyWe/h4owEHqiqDQANu3t/jGkT8XAAPFM7hhY9MpP9TnS/Q/HgMANPWmA93MAfEnF/K3ugqUYzgF4JnyP54NPTTe40JegqC0wDgBu4e9I6MzwyVxP4fuAEqkTn/qc6n9zcaAypATFdLcSEqgBAkCWwB/KSF6Ksd6WgpqMVAua0ASkNkdKKFOFC7MhhqKY6vDA27rQCs4XF1rIXoKuWTAsZnP4QAzsY+2V9UAfr0BxDAqfbA/kAB/oWBtC45wOjEO/vLKmD87ruuAs7Oa2h/zKCrqfAbwwna4BeLCOBUi9FXTjnQfjuBOYzweNuUR9m/DvaUY/qB104ggsukUnor+O1YSzFsKee0hj47gQk8DErI64auXmsxXg0UgUFXC/L6ykCqLxyeQR+R+/vzD/qKxF4g6QROib3gGE0MLI1TLl9rMTo9BfDFCZzSzoNL2CqYGafIFX/BoaLSPtJSHPPefo7gGrIp5fIXn+5AsTkMhELAFe88cIqmxuZ+NgA6LSXAYD/wcT5gAkd+E+ZE4GsB87cVxhsJnPCagWmOLo9d828Acs3Ppz8kB4CRcU2+/Mv+Mbo8sswpOyCIBN2ekqbVDTQPxpFQnqCNkpOUuHOQFwSG/YF6EfZoGnhtKMRRlOVrNZJFUcy7Bs5geNhTL0hrv8OvAPyHVAkcdcFvX4b2YYfQAvIcfjuoszdQdaGtnXJuvk/eaZe0VX1oi7QA/Od1IwBCBugRl9+rAHraJWfNQtBN6Kka0TiAzbjS7lB1Qt4BNC5A1YmhtANoXMBQ1YmOdBO4KQQ6qk4cND2ADTmTuPcrz77GON0b2LQD9xXGx0bAqHkagNAGoNOS2hLhPyPthpaqFU0KKF0JqnoxbFLATXnnfxXIWyb1k/kBGPMvf8tzqJ1w2bwQBgAPgXteBoyNaWIApQjgI1sDNHWAqhudZhJEsh3cURgPm8FX5ofg1L9GMGZPsghszgP2VN0YNCnA5uidGajaMWwOgjbmmN8G8vJA8Kx5K5x4FOjBeZBpHgvnnQTxCZocUCoLDFQd6cpMA06j35iFYW7qRBxOot+YykwGdlUd2RM5CYpT+zfL5DoKY/Oi5GEWzZPUWrB74Ak+FoGYQOBKaF7ap5RJNAunRppwEi2S1D5hKTEXFqh60hVoBGd2FUspHcRhdJ2kdgWxQDO4q+rJnkAVOLeAP3QQGwL5H7/50q4nEhDAnqopAV8Aid2MNJn/nim6MnyUJHYzrvmPhgWqrnTFBYBJkkUUheF0e7OH2e92L+12zPnHQV1VV1r8PlBiK1MmyTyKoiwMn9XDNPyN32u5RZIsbWUivgBaqrYM6yYAefgCGKr60qcL4NrWnJAugL6qL4OALYCJrTn0kZBgoGpMly2A3NabOV0AXVVnevSBsLmtNRO6AHqq1nTY4wChrTMlfSqwo+pNmz4PUtoaM6NPhLRVzemwBZDZ+pLm7MHwjqo7ffpIYGlrS2bYAuir2nPE3hAc2rpS0u+HHqn606dPhc89aAIBPHYAmCP2grhpamvJNX1l7JHygTb9bvDM1pEypw+FtpUXdAgLojwIAjH9cmBH+UGbfjEkT+vcAsCceO0AMK/oD4XEtm7M+bsCXylf6PHfCsxsvVjm/A0RPeUN+/yrQQtbJ9Ipf0fMvvKHwRHhPLDGiSC8D+JgJPRooDxij38/PF/WtADAHHs6C87PA0+MlwrIBJZEvVJ+0Qv4a+LypZf2Nxd6e4Ke8oxDgVXB+dJH+5sTb/dC8vuBb4xvCkhDiTWBHeUfvUBgVWie1C3/x1wQAkAtOSTEgLr1A5ax2ZoT/wMAsRI4MdsS1ar/h7kiVAA1ZRCILAvNUvtCLGTWhAYD5SltmZfj49K+BGkm9GhUW3nLvszG+Hxu5SljU4ULwhlAjekIbQyfWWkWudCm8I7ymUEgtC0wXlpJ0onUhsBgoLymJeAC5KuBeS72VEBLeU6f7QLknUA6kVsR2lfe05V7NyRK5aM/1wF01XdAR25n8HRu2SSh4HNRHfU9MBg66wVgwqVlUmaSD0cPB+q7oBXo7RhfmepkpWWRRrnkW0FBS3kARQEnxrAlIG9+czWWsr//pcCZIUiAbn7AiXwB4K0CzkdmN7KlfOwHvOPZ3wP64q9Ihwvrinlodmc0JtrfAw7kH5DKZ6XdnTKaGhecyD8M6XVDaDwyDogXqd2FdBEbN1zIN4A8V8CJccNkUdpqlNcTUw1cAWD7Nwp4a1wRR4ndlmQWG3eMjre3f6OAS+OQcHMRpEkUGre8aez/B11yGgCIs+skBW8KRFlsnHPhY/5Xg2rweER67itKnjwB88dbEmFoOJxVrP8aBbwx3wOX4x/Z/o0CRueN/aufDF34b/9jv85/+LSO/FcAx/5HBPv7PyHiuQJ+ZdcusGYHYSgA56+TugF19r/J50eeh5npHGjzbeFeLG1/u/8/COrsNg0YkSyr4T6imzRgRLIIbiUskG65/vlfhHAzHw3SLVfPv/mA26nLi88D9hapyhruKEW6UV94/pfCTQXC/ruALw6DRCIAAj4G5lV5ZODtnyYtkMosyhe6R6IiBTJ+DYzKD2trcftnEZK1u/LAYqyGPywQVzoGdG97+2N1gmS9Vk6TMxIlNTyAbwLmUO7SG5/+D4oK/zcB+vIvIvgFy2PfbwJ6RKI4h9+xUCBVt3p8+Rch/BGrIyTbtHKKbJEoquFvWF4ilZmUO/YRicoc/oUFDVLNi3KDHpCoCeB/WCWQqpVOxE8+/Ct4MX4SdtKb+OlPP1ZHhR8HwW4Rfw3spApM2vWr37nxcwXMtqu3Ozp34ucKYLe8ee+fOf7z1ZVAMrOt6k2OHqlEVcMTWBUjXTvt6nTraJAqruBZLMjQnQ6s24xkWQCvwPKosOvAqk5xjAbJiigHdsJJQDKPh1YvtU49kvHef4I8EWil3Q79svANWhBJDuwEYYmW2vHJ40DLoTNopQyBnaWuGrTWjZPUytp6DP2Mlhp+9Z0tTxt8RDcOi9xJyctp6Fq016Q5OIw78JXpunEYBvnVqn6QXx3DMPQPBc/pf263Pq4bB2AoAEogwEcx91+tdV+vs800UwLSxxYzUP2OlO5v8Q90Y78DY7dZ7hO59ptaM26bYmnatd/E2jZW/6pDoPm7s0TW2P+BsTI0f6eGJmv81d43w42dGyKntf9h65RxsN4bg7Ye/bc9qj1w67nHnF1V/2lVXc5xv50EQ8ScmfW09q9a6ykz5/jFjQcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgBKQUUaDHL6FIAAAAASUVORK5CYII=',
            host: [''],
            popup: function (text) {
                try {
                    //这里
                    if(GM_openInTab("chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=c3faa09a-17a5-4994-9cae-a79f905ef1f3+editor", { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
//                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return GM_openInTab("chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=c3faa09a-17a5-4994-9cae-a79f905ef1f3+editor", { loadInBackground: true, insert: true, setParent :true });
                }
            }
        },{
            name: 'google翻译',
            image: 'data:image/png;base64,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Uf/1j1H/9Y9R//WOUP/1jlD/9Y5Q//WOUP/1jk//9Y5P//WOT//1jU//9Y1P//WNT//SfU8tAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9ZBT//WQU//1kFP/9ZBT//WQU//1kFP/9ZBT//WQU//1kFP/9ZBT//WQUv/1kFL/9ZBS//WQUv/1j1L/9Y9S//WPUv/1j1H/9Y9R//WPUf/1j1H/9Y5Q//WOUP/1jlD/9Y5P//WOT//1jk//9Y1P//WNT//yiEnvAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPWQVP/1kFT/9ZBU//WQVP/1kFT/9ZBU//WQU//1kFP/9ZBT//WQU//1kFP/9ZBS//WQUv/1kFL/9Y9S//WPUv/1j1L/9Y9S//WPUf/1j1H/9Y9R//WOUP/1jlD/9Y5Q//WOT//1jk//9Y5P//WOT//1jU//5oRNhQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD1kFT/9ZBU//WQVP/1kFT/9ZBU//WQVP/1kFT/9ZBT//WQU//1kFP/9ZBT//WQUv/1kFL/9ZBS//WQUv/1j1L/9Y9S//WPUv/1j1H/9Y9R//WPUf/1jlD/9Y5Q//WOUP/1jlD/9Y5P//WOT//1jk//9Y1P/9mAUygAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9ZBU//WQVP/1kFT/9ZBU//WQVP/1kFT/9ZBU//WQVP/1kFP/9ZBT//WQU//1kFP/9ZBS//WQUv/1kFL/9Y9S//WPUv/1j1L/9Y9R//WPUf/1j1H/9Y9R//WOUP/1jlD/9Y5Q//WOT//1jk//9Y5P/+2GTOkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPWRVf/1kVX/9ZFV//WRVf/1kVX/9ZBU//WQVP/1kFT/9ZBU//WQU//1kFP/9ZBT//WQUv/1kFL/9ZBS//WQUv/1j1L/9Y9S//WPUv/1j1H/9Y9R//WPUf/1jlD/9Y5Q//WOUP/1jk//9Y5P//WOT//ph059AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxkFPi9ZFV//WRVf/1kVX/9ZFV//WRVf/1kFT/9ZBU//WQVP/1kFP/9ZBT//WQU//1kFP/9ZBS//WQUv/1kFL/9Y9S//WPUv/1j1L/9Y9R//WPUf/1j1H/9Y5Q//WOUP/1jlD/9Y5P//WOT//1jk//2oBTIgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8pJad/WRVf/1kVX/9ZFV//WRVf/1kVX/9ZFV//WQVP/1kFT/9ZBU//WQU//1kFP/9ZBT//WQUv/1kFL/9ZBS//WPUv/1j1L/9Y9S//WPUf/1j1H/9Y9R//WOUP/1jlD/9Y5Q//WOT//1jk//841O4QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN+fgAj0kVPZ9ZFV//WRVf/1kVX/9ZFV//WRVf/1kFT/9ZBU//WQVP/1kFP/9ZBT//WQU//1kFL/9ZBS//WQUv/1j1L/9Y9S//WPUv/1j1H/9Y9R//WPUf/1jlD/9Y5Q//WOUP/1jk//9Y5P/++LUHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA35+ACPKUXHrwkFHk9ZFV//WRVf/1kVX/9ZBV//WQVf/1kFX/9ZBU//WQVP/1kFT/9ZBT//WQU//1kFP/9Y9S//WPUv/1j1L/9Y9S//WPUv/1j1L/9Y5R//WOUf/1jlH/9Y5Q//WOUP/0kFkXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            host: ['www.google.com'],
            popup: function (text) {
        },
        {
            name: '豆瓣',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAL9SURBVEhLxVdbSBRRGD4VpakZUeRS0UMvBkIFXehCEhlG+FJY9NZLRhQlZVphyRJ2o7LU3cBK80EIigKJHqzoroIRQRRRkNlKJJqW91gIv/7vOGMzzrRUs1s/fOzZf77Lzu6Zc86qxtBTxBemQBUkQx2YEltIBrOYqeIKfVD5Se7EWECydKbtTvdPhtqXAJU3MbqgJ73NHGZaQyfI17CgNF1jfunKqMD0o7ctfGQgn2reuRWIVdFb37lbcNrZZQYt+kVv9+D8SUgpTkV5/QUEGysRaLgYFdCLnvRmhjPYCFe5Y6B2KqgcwVaPoAe96GkNJWxviPxEpJ5ZgpLHQZz3cOfU0oNe9HTkOBp747Du8ibjl/Fe9KKnI8fRENKayg3oD/dr4UB4EA+an+Dai1rceHkzIsghlxoWPej1V8GhL61YW7URiUUzMfXInIggh1xqWJ6C33e1YHEgA2rP+OEJEgnCIZcalqfglq4PWBrMHF76RnNHQzjkUsPyFPyusxlpJcuhdshjsVsei0gQDrnUsDwFdw/2oub5VRy/X4JTD8sighxyqWH9cXBmVTbC38Na7KXoQa/fC5bfKb0iC6/b36D7Ww8wZLhItfd14FNPG9p6221gj9dGSjTU0oNervPD0SBI3Ka0qPXrR8NrCAvLV+m9dNzBaTawx2vksKjRgeLxy0np2iTkpOA7Ohd1b+9pM1bO9dzhTZwnFr5axrxmFjXURjzZuDYJbtp58SirrzDsgNpXt/QioQrkmTV5MmaP18yihlrbxj8atjdcBHLH/sR2heyaLejo+6wNB8IDSPbPhtrFHcfgyJg9XmORSw21Ni96W7OsoT7ZM08/CsB/96RGYV0xqp9dQWd/lzZlcec5fPsY/HdOaHDMnlnkUkOt6UNPetvCRwYyCRaVrzbk0S962yaaNZjrbKxKr/euwTIzk4pmIat6MzIurY8q6Elv/RQ4go1wvcrEAtZQwtH4F2Dm//kLI4f7hlCTnPKnO7+KWEAyEg7NQH2oCT8Abq/6YUUWn/EAAAAASUVORK5CYII=',
            host: ['www.douban.com'],
            popup: function (text) {
                open('https://www.douban.com/search?source=suggest&q=' + encodeURIComponent(text));
            }
        },
        {
            name: '影视搜索',
            image: 'data:image/png;base64,/9j/4AAQSkZJRgABAgAAAQABAAD//gAQTGF2YzU3LjI0LjEwMgD/2wBDAAgQEBMQExYWFhYWFhoYGhsbGxoaGhobGxsdHR0iIiIdHR0bGx0dICAiIiUmJSMjIiMmJigoKDAwLi44ODpFRVP/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsBAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKCxAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/wAARCAIAAgADARIAAhIAAxIA/9oADAMBAAIRAxEAPwD3aigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigA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O8YTI+29USIT9+NQrr/wEfKw/I/WgAA+iqoW11DdxiWCRZEPdf5EdQfY80AAF+igAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAADwLxv1sfpP8A+0qPG/Wx+k//ALSoAAPBqKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAA6PSP+QlZf9fEX/oYo0j/AJCVl/18Rf8AoYoAAPtOigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAAPK/GH/IMH/XdP/QWo8Yf8gwf9d0/9BagAA+XaKAADastQudPk8y3kKHuOqsPRl6Efy7Vi0AAH1RpPie2v9sc2Lebpgn925/2WPQ/7LfgTXyvQAAfe1fLGk+J7mw2xzZuIRxgn94g/2WPUf7LfgRQAAfU9Y1lqFtqMfmW8gcdx0ZT6MvUH9D2oAANmigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAADwLxv1sfpP8A+0qPG/Wx+k//ALSoAAPBqKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAA6PSP+QlZf9fEX/oYo0j/AJCVl/18Rf8AoYoAAPtOigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAAPK/GH/IMH/XdP/QWo8Yf8gwf9d0/9BagAA+XaKAAAooAACigAAKKAADQtrqa0kEsMjRuOhX+R7Eex4rPoAAPpPSfFkNxiK82wydBIP9U31/uH/wAd9xXzZQAAfeoIIyDkGvkXSvEF3pZCg+bD3icnj/cbqp/8d9qAAD67rmdN1e01RMwv8wHzRtw6/h3HuMigAA6aigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAADwLxv1sfpP/wC0qPG/Wx+k/wD7SoAAPBqKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAA6PSP8AkJWX/XxF/wChijSP+QlZf9fEX/oYoAAPtOigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAAPK/GH/IMH/XdP8A0FqPGH/IMH/XdP8A0FqAAD5dooAACigAAKKAAAooAACigAAKKAAAooAALEUrwuHjZkZTkMpIIPsRVegAA9+0nxcDtiv+OwnUcf8AbRR/NfyrwGgAA+8I5ElUOjK6sMhlOQR7EcGvjrTdYu9LfML5Qn5om5Rvw7H3FAAB9l1xGla9aaoAqnypu8Tnn/gB6MPpz6igAA7eigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAADwLxv1sfpP8A+0qPG/Wx+k//ALSoAAPBqKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAA6PSP+QlZf9fEX/oYo0j/AJCVl/18Rf8AoYoAAPtOigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAAPK/GH/IMH/XdP/QWo8Yf8gwf9d0/9BagAA+XaKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAB4JUggkEcgjgg+1MoAAPadJ8WywYivcyp0Eo/1i/wC9/fHv97614tQAAfdNvcQ3UYlhkWRG6MpyPx9D7HkV8Z2Oo3WnSeZbyFf7y9Ub2Zeh+vUdjQAAfbNea6T4ltdR2xyYgn6bWPyOf9hj3/2Tz6ZoAAPSqKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAAPAvG/Wx+k/wD7So8b9bH6T/8AtKgAA8GooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAADo9I/5CVl/18Rf+hijSP8AkJWX/XxF/wChigAA+06KAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAA8r8Yf8gwf9d0/9Bajxh/yDB/13T/0FqAAD5dooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAA9U0nxRcWO2O4zcQ9OT+8Qf7JP3h7N+BFeV0AAH3BZ31tfx+ZbyLIvf+8p9GU8g/WvjG1u57KQSwSNG47juPQjoR7HigAA+5K8y0DxB/apMMqBJ0XdlfuOAQCRnkEZHHPqKAAD02igAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAADwLxv1sfpP/wC0qPG/Wx+k/wD7SoAAPBqKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAA6PSP8AkJWX/XxF/wChijSP+QlZf9fEX/oYoAAPtOigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAAPK/GH/IMH/XdP8A0FqPGH/IMH/XdP8A0FqAAD5dooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAK9X0nwtcXu2W5zbw9cY/euPYH7o92/AUAAHnlpZz3soigjaRj2HQe7HoB7mvs2zsrewjEVvGsa98dWPqxPJP1oAAOJ0Hw+NKzNI4knddvy/cQEgkDPJJIHPHsK9LoAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAADwLxv1sfpP/AO0qPG/Wx+k//tKgAA8GooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAADo9I/5CVl/wBfEX/oYo0j/kJWX/XxF/6GKAAD7TooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAADyvxh/yDB/13T/0FqPGH/IMH/XdP/QWoAAPl2igAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKkVSxAUEk8ADkkn0HrQAAR17ZpPhKSbEt9mJOohH+sb/AHz/AAD2+99KAADzKw0261KTZBGW/vMeET/ebt9Op7CvsyC3itYxHCixovRVGB/9c+55NAABwek+G7XTtskmJ5/77D5UP+wvb/ePPpivR6AAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAA8C8b9bH6T/8AtKjxv1sfpP8A+0qAADwaigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAAOj0j/AJCVl/18Rf8AoYo0j/kJWX/XxF/6GKAAD7TooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAADyvxh/yDB/13T/ANBajxh/yDB/13T/ANBagAA+XaKAAAooAACigAAKKAAAooAACigAAKKAAAqzFFJO6xxozuxwFUEk/gKAACtX0BpPhELtlv8Ak9RAp4H/AF0YdfovHvQAAeWaZo13qjful2xg/NK3CD/4o+w/GvsRESJQiKqKowFUYAHoAOKAADj9L0K00sAqPMlxzM4+b/gI6KPpz6mu1oAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAADwLxv1sfpP/AO0qPG/Wx+k//tKgAA8GooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAADo9I/5CVl/wBfEX/oYo0j/kJWX/XxF/6GKAAD7TooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAADyvxh/yDB/13T/0FqPGH/IMH/XdP/QWoAAPl2igAAKKAAAooAACigAAK0ba1nvJBFBG0jnsv8yegHueKAADOr6V0nwpDbbZbzbPJ1Ef/LJfrn75+vy+1AAB5RpXh+71Mh8eTD/z1Ydf9xerfXhfevrcDAwOKAADm9O0m00tNsCfMR80jcu31PYewwK6WgAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAAPAvG/Wx+k/wD7So8b9bH6T/8AtKgAA8GooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAADo9I/5CVl/18Rf+hijSP8AkJWX/XxF/wChigAA+06KAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAA8r8Yf8gwf9d0/9Bajxh/yDB/13T/0FqAAD5dooAACtux0+51GTy7eMuf4m6Ko9WboP5ntQAAYlfVWk+GbbT9skuLiYc5I+RD/sKep/2jz6YoAAPJtJ8MXN/tknzbw9eR+8cf7KnoP9pvwBr6loAAMeysLbT4/Lt4wg7nqzH1ZjyT/kVsUAABRQAAFFAAAUUAABRQAAFFAAAUUAABRQAAFFAAAUUAABRQAAFFAAAUUAABRQAAFFAAAUUAABRQAAFFAAAUUAABRQAAFFAAAUUAABRQAAFFAAAUUAABRQAAFFAAB4F4362P0n/wDaVHjfrY/Sf/2lQAAeDUUAABRQAAFFAAAUUAABRQAAFFAAAUUAABRQAAFFAAAUUAABRQAAFFAAB0ekf8hKy/6+Iv8A0MUaR/yErL/r4i/9DFAAB9p0UAABRQAAFFAAAUUAABRQAAFFAAAUUAABRQAAFFAAAUUAABRQAAFFAAAUUAABRQAAFFAAAUUAABRQAAFFAAByOuac2p2TwowVwyumehK9j9QSM111AAB88ad4OmZ9164RB/yzjOXb6t0UfTJ+lfQ9AABRt7aG0jEUMaxoOiqP1Pcn3PNXqAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAA8C8b9bH6T/wDtKjxv1sfpP/7SoAAPBqKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAA6PSP+QlZf8AXxF/6GKNI/5CVl/18Rf+higAA+06KAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAK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T/x73X/XRP8A0Go/BbqsF1uYD94nU4/hoAAPcar+bH/fT/voUAAFiq/mx/30/wC+hQAAWKr+bH/fT/voUAAFiq/mx/30/wC+hQAAWKr+bH/fT/voUAAHxrrH/ISvf+viX/0M0mrkHUbwjn/SJf8A0M0AAHOUUAABRQAAFFAAAUUAABRQAAfd8f8Aq0/3R/KoI5Y9ifOn3R/EPSgAAvVX82P++n/fQoAALFV/Nj/vp/30KAACxVfzY/76f99CgAAsVX82P++n/fQoAAOG8U/8gi4+sX/o1Kh8TyI2k3ADKTmLoQf+Wq0AAHyhRQAAFFAAAUUAABRQAAFFAAAUUAAH2/p//Hla/wDXCL/0AVBYSxiztvnX/URfxD+4KAADeqv5sf8AfT/voUAAFiq/mx/30/76FAABYqv5sf8AfT/voUAAFiq/mx/30/76FAABy+v/APIKu/8Arn/7MKh16RDpd2A6n932I/vCgAA+P6KAAAooAACigAAKKAAAooAAPTvCP/IUX/rlJ/Sm+E2C6mpJA/dSdT9KAAD6qqv5sf8AfT/voUAAFiq/mx/30/76FAABYqv5sf8AfT/voUAAFiq/mx/30/76FAABYqv5sf8AfT/voUAAHzh40/4/4f8Ar3X/ANGSU3xkytfw4IP+jr0Of+WklAAB5FRQAAFFAAAUUAABRQAAdt4c/wCQtaf7zf8AotqTw6QNVtSTgbm/9AagAA+war+bH/fT/voUAAFiq/mx/wB9P++hQAAWKr+bH/fT/voUAAFiq/mx/wB9P++hQAAWKr+bH/fT/voUAAHhXjfrY/Sf/wBpUzxqysbLawP+v6EH/nn6UAAHhNFAAAUUAABRQAAFFAAAUUAABWpeWr2VxLA4IMbEc9x2b6EYIoAAMuigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAAooAACigAAKKAAArUs7V724igQEm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',
            host: ['z1.m1907.cn'],
            popup: function (text) {
                open('http://z1.m1907.cn/?jx=' + encodeURIComponent(text));
            }
        },
        {
            name: '百度翻译',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAUsSURBVEhLxVdpbFRlFJ2YiFCRpSJQEDUxLijESGLcEiMxGDVxC4mJifhDEiEmKjGgqChaECibsiiKUimLFOLSFgSKsmglti7IIkgEClhDKyoW5s1bZt6b4znfm9dOh2moUuNNzmTmW+75vnvPve9NDBlrPBVgzFoPg+YkUDjdQp8ZiU6BfMnnmCoPjVaQYQMMcdmOJGLj4ygotjqVNIJ8yrc4xGWIG+OBGci34b+AuBTd2FiGQKfJXXDhdMHKIPyduyYftK7XNAs9XssfPXGJM3ZJnpxqs8Z6crMcyJF+C/ouaC6av2Cqhe4ZdKPjy19P4JZ3bRTNTJg12b7lQ5yxXFKhNx1fMS+BRz9yMXGThwc+cDCATopmJXDVfIJzQxbaGLbIxs0kGF7q4K5lDu5d4eBBrl3CPB78M8C49S4GcI/8ZfsXZyx7IIJuMKLMRv2JtBHCxp9TuJJkA+mkdEcK6/ansOGAj/I9Kazn3EZ+rz6QQvVBHwf+aFVuk5XGyFUOepMoN1XtEt+x1Ma+46GTyp9S5pbdpyZMBEpqPDP+4d4Uo+LgsQoXI8sdPL3ewzGKVdbspLH4uyRuZUT6zOggcRTqUQz1s9Ue7mf4dFuNd1VZTIrj7W+SaGgOcM9yG7GJFvoxFat2pwyp66dR8mUS/WdaOH/K6aRCC7Em5TiCRNP1VQvnvhJuztaCxNWH6+tPBOZmc7cnUfZDSOrzwvNrPSMgRS7akwtDLFKVTdEsnbwtioiLGKrCzLpoYwEPM5hC+4W3jghTQRoL65LmoLGXwwNL1YXGfx5iTQ5ZYMPy0jhKRwZ/BThEZR5jsT9R5ZobR5t1k9iLcTy8xoHnG96MpdFwMo2KfT5e2uzhvpUOrubhCqbEDUc2uSHuxcHBC3T6NHY1Bth5LMCepgCn3FDVkz4nMcMbEV7PMqo50spYvNXDzK/CVhiZxzyf5P44L6N0qK6VvjbEUYdSwfcrCSfUBFb/GObthU2u6TjD3rKx+VBIeIQRmUCFX8NI1TX4GPWxixsX2y17Imsm+UOrWVI8uDjaEEfk2cIaNJsqZZ3Knqt2TeOYV5vEk+tcDJzDDkXhSeF9SyyzRraW9R2bEGdu4xjBhvLG10ncucw2HS07VW2IsyHyS6nK8qwb9+TmLlR4lwyhxHUev/el8CLbUu/j9lIbo1nX41jTQxkNVUUuqdBhYuVYRJO3eLBNOpX/UAPt2e4mH7ctaZvbCP+I2KSB3Wv8Rg+PV7E3U7UjljpmjaxsJ0M9ngKcGA9BIeqhcVY31pjqUc1DQlOoVad6CBjj5VfsSnG/ZUroujdtIza1zIupF+3/VznuwRzL2VOfuqZ8irexhNiz1TAi2/+7j/e+T+IT9vDtRwMcpvKPx9MYXenSbzuqzkY+4u683fD3bdSydHaxxr/91UfNUR9b68M1sr2/BZjN9jmbNT3tC4/1H0IPElVJdtttl/gyEq+JiD8Lc6zwqr7lRGXUjb/7ZcopzVAvqmOOmVspX5AYhdxeL7RPPLe1jp9no9DGKMeaFxT+a1kykS2juM6ZfLqC8yEvsUj6s4vdvdzBMxs83ESRhN2tdY2+q/8O5ZtIZBVsIB0mzg1BBI2rN6tZqA5zy8EQ89Y3vBMSbzvs4xHmUunIXpcP8p33Za8jELH2DWS+9RSS4pX3M/nSvHnZa+/1tiOIyNWLw+fumf2IS/8qYubl+v94oVd+Wv7CGNnn33A2kE/5FkfLXxjzSdObxthKj+2tc8nlSz7H0LduGhrwN1fH/x1DJk9SAAAAAElFTkSuQmCC',
            host: ['fanyi.baidu.com'],
            popup: function (text) {
                open('https://fanyi.baidu.com/?aldtype=85&keyfrom=alading#auto/zh/' + encodeURIComponent(text));
            }
        },
          {

            name: 'Youtube',
            image: 'data:img/jpg;base64,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',
            host: ['www.youtube.com'],
            popup: function (text) {
                open('https://www.youtube.com/results?search_query=' + encodeURIComponent(text));
            }
        },
         {

            name: 'Youtube cover',
            image: 'data:img/jpg;base64,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',
            host: ['www.youtube.com'],
            popup: function (text) {
                open('https://img.youtube.com/vi/' + encodeURIComponent(text) + '/maxresdefault.jpg');
            }
        },
        {

            name: '必应',
            image: 'data:image/png;base64,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',
            host: ['cn.bing.com'],
            popup: function (text) {
                open('https://www.bing.com/search?q=' + encodeURIComponent(text));
            }
        },
*/
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
        img.addEventListener('mouseup', function () {
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
//        'white-space:normal;'+
        //'overflow:hidden;'+
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
        if ((text && icon.style.display == 'none')||((e.target.localName.toLowerCase() === 'input' || e.target.localName.toLowerCase() === 'textarea') && e.target.disabled === false)) {
            icon.style.top = e.pageY +15 + 'px';//设置文字下方距离
            if(e.pageX -70<10)
                icon.style.left='10px';
            else
                icon.style.left = e.pageX -70 + 'px';
//                icon.style.left = e.pageX -35 + 'px';
//                icon.style.left = e.pageX -55 + 'px';
//                icon.style.left = e.pageX +10 + 'px';
//            icon.style.display = 'block';
//            fadeIn(icon, display);
            fadeIn(icon);
            // 这里





//            window.setTimeout(function(){icon.style.display='none'}, 6000);
            clearTimeout(timer);
//            timer = window.setTimeout(function(){icon.style.display='none'}, 6000);
//            timer = window.setTimeout(function(){fadeOut(icon);}, 6000);
//iconArray.mouseIn = 0;
//iconArray.onmouseenter = 1;
            timer = window.setTimeout(TimeOutHide, 6000);
/*               var ismouseenter = false; // 初态未移入鼠标
               icon.onmouseenter = function(){
                   if(ismouseenter == true){ //已经移入直接返回
                       console.log("doSomethingOk");
                       return;
                   } else {

                       ismouseenter = true; // 状态设为移入
                   }
               }
               icon.onmouseleave = function(){
                   if(ismouseenter == false){
                       console.log("doSomethingok");
                       timer = window.setTimeout(function(){fadeOut(icon);}, 6000);

                   } else {
                       return;
                       ismouseenter = false;
                   }
               }
*/




//        } else if (!text) {
//            icon.style.display = 'none';
//            fadeOut(icon);
        }
        console.log(document.activeElement.tagName)
         console.log(e.target.localName)
//        if ((e.target.localName.toLowerCase() === 'input' || e.target.localName.toLowerCase() === 'textarea') && e.target.disabled === false) {
//        if (document.activeElement.tagName.toLowerCase() === 'en-note' && ((e.target.localName.toLowerCase() === 'div'||e.target.localName.toLowerCase() === 's'||e.target.localName.toLowerCase() === 'p'||e.target.localName.toLowerCase() === 'span'||e.target.localName.toLowerCase() === 'b'))) {
        if (document.activeElement.tagName.toLowerCase() === 'en-note' && e.target.localName.toLowerCase() !== 'en-note'){
//        if (document.activeElement.tagName.toLowerCase() === 'en-note'){
            icon.style.top = e.pageY +15 + 'px';//设置文字下方距离
            if(e.pageX -70<10)
                icon.style.left='10px';
            else
                icon.style.left = e.pageX -70 + 'px';
//            console.log('input&textarea')
//            console.log(document.activeElement.tagName)
            console.log(e.target.localName)
//            icon.style.display = 'block';
            fadeIn(icon);
            clearTimeout(timer);

            timer = window.setTimeout(TimeOutHide, 6000);
            //同时判断 前面条件成立一直显示
//        }else if (e.target.localName.toLowerCase() === 'en-note') {
//            icon.style.display = 'none';
//            fadeOut(icon);
        }

    });

    var TimeOutHide;
    var ismouseenter = false;
/*    icon.onmouseenter = function(e){
//        onmouseenter = true;
        console.log("ismouseenter");
//        return;
        if(ismouseenter == true){ //已经移入直接返回
            return;
        } else {
            ismouseenter = true; // 状态设为移入
        }
    }

    icon.onmouseleave = function(){
//        ismouseenter = false;
        console.log("ismouseleave");
//        return;
        if(ismouseenter == false){
            return;
        } else {
            ismouseenter = false;
        }
    };
*/
    //延时消失
    TimeOutHide = function () {
        if (ismouseenter == false) {
            return fadeOut(icon);
            console.log("doSomethingOk");
        }
   };
    //鼠标在图标栏 清除定时器 不消失
    icon.onmouseenter = function(e){

        console.log("ismouseenter");

        if(timer){ //定时器
            clearTimeout(timer);
        }
    }
    //鼠标移开图标栏 清除定时器 不消失
    icon.onmouseleave = function(){

        console.log("ismouseleave");

        if(timer){ //定时器
            clearTimeout(timer);
        }
        timer = window.setTimeout(function(){fadeOut(icon);}, 6000);
    };
    // 这里 鼠标滚动 图标栏消失
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

//    function fadeIn(el, display){
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



/*
    function paste() {
//        document.addEventListener('click', function (e) {


                        console.log('pasted')
                        window.navigator.clipboard.readText()
                            .then(text => {
                            console.log('Pasted content: ', text);

                        })
                            .catch(err => {
                            console.error('Failed to read clipboard contents: ', err);
                        });

    }*/

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
function getSelectionStart() {
   var node = document.getSelection().anchorNode;
   return (node.nodeType == 3 ? node.parentNode.nodeName : node.nodeName);
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
