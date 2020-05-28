// ==UserScript==
// @name         划词翻译 translate
// @namespace    https://greasyfork.org/zh-CN/users/372485
// @version      0.0.3
// @description  划词翻译
// @author       Chegde
// @match        http://*/*
// @include      https://*/*
// @run-at document-end
// @connect      dict.youdao.com
// @connect      translate.google.cn
// @grant        GM_xmlhttpRequest
// ==/UserScript==
// fork from https://greasyfork.org/zh-CN/scripts/35251-%E6%99%BA%E8%83%BD%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91
/*
    changelog:
    2018-9-28 不存在英文单词则不出现翻译按钮
    2018-9-29 过滤标点符号 只匹配字母
    2019-4-17 快捷键控制 翻译 - 翻译文本左上角 按键为alt+c
    2019-6-14 变更快捷键 为 f2
    to do:
    2. 中文翻译成英文 由快捷键进行开关
*/
(function () {
    'use strict';

    var youdaoUrl = 'http://dict.youdao.com/jsonapi?xmlVersion=5.1&jsonversion=2&q=';
    var googleUrl = 'https://translate.google.cn/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&source=input&hl=zh-CN&sl=auto&tl=';

    var iconSize = 24;
    var translationTestSize = 16;
    var icon = document.createElement('div');
    var style = '' +
        'width:20px;' +
        'height:20px;' +
        'margin:4px!important;' +
        '';
    icon.innerHTML = '译';

    icon.setAttribute('style', '' +
        'display:none!important;' +
        'background:#fff!important;' +
        'position:absolute!important;' +
        'padding:2px!important;' +
        'cursor:pointer!important;' +
        'z-index:2147483647!important;' +
        '');

    // 添加翻译按钮到 DOM
    document.documentElement.appendChild(icon);

    // 鼠标事件：防止选中的文本消失
    document.addEventListener('mousedown', function (e) {
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon) || (e.target.parentNode.parentNode && e.target.parentNode.parentNode == icon)) {// 点击了翻译图标
            e.preventDefault();
        }
    });
    // 选中变化事件：当点击已经选中的文本的时候，隐藏翻译图标和翻译面板（此时浏览器动作是：选中的文本已经取消选中了）
    document.addEventListener("selectionchange", function () {
        if (!window.getSelection().toString().trim()) {
            icon.style.display = 'none';
            server.containerDestroy();
        }
    });
    // 鼠标事件：防止选中的文本消失；显示、隐藏翻译图标
    document.addEventListener('mouseup', function (e) {
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon) || (e.target.parentNode.parentNode && e.target.parentNode.parentNode == icon)) {// 点击了翻译图标
            e.preventDefault();
            return;
        }
        for (var i = 0; i < server.rendered.length; i++) {// 点击了翻译内容面板
            if (e.target == server.rendered[i])
                return;// 不再创建翻译图标
        }

        var text = window.getSelection().toString().trim();
        if (text && isChina(text) === false && icon.style.display == 'none') {
            icon.style.top = e.pageY + 12 + 'px';
            icon.style.left = e.pageX + 'px';
            icon.style.display = 'block';
        } else if (!text) {
            icon.style.display = 'none';
            server.containerDestroy();// 销毁翻译内容面板
        }
    });

    var translateProgress = function (e) {
        var text = window.getSelection().toString().trim();
        if (text) {
            icon.style.display = 'none';
            server.containerDestroy();// 销毁翻译内容面板
            // 新建翻译内容面板
            var container = server.container();
            let top = 0;//e.pageY ||
            let left = 0;//e.pageX ||
            container.style.top = top + 'px';
            if (left + 350 <= document.body.clientWidth)// container 面板css最大宽度为250px
                container.style.left = left + 'px';
            else
                container.style.left = document.body.clientWidth - 350 + 'px';
            document.body.appendChild(container);
            server.rendered.push(container);

            if (isChina(text)) {
                ajax(googleUrl + 'en&q=', encodeURIComponent(text), 1, container);
            } else {
                if (countOfWord(text) == 1) {
                    ajax(youdaoUrl, text, 0, container);
                } else {
                    ajax(googleUrl + 'zh-CN&q=', encodeURIComponent(text), 1, container);
                }
            }
        }
    };


    var inputBlock = function (e) {
        server.containerDestroy();

        var i = document.querySelector('#chegde-translation');
        if (i) {
            i.focus();
            return;
        }

        let input = document.createElement('input');
        input.id = 'chegde-translation'
        let top = 0;
        let left = 0;
        input.style.top = top + 'px';
        input.style.left = left + 'px';
        input.style.position = 'fixed';
        input.style.zIndex = '2147483647';

        // 新建翻译内容面板
        var container = server.container();
        container.style.top = top + 'px';
        container.style.left = left + 'px';
        container.style.position = 'fixed';
        container.style.zIndex = '2147483647';

        document.body.appendChild(input);
        input.focus();

        input.addEventListener('keypress', function (e) {
            var key = e.which || e.keyCode;
            if (key === 13) { // 13 is enter

                document.body.removeChild(input);
                document.body.appendChild(container);
                server.rendered.push(container);

                if (isChina(input.value)) {
                    ajax(googleUrl + 'en&q=', encodeURIComponent(input.value), 1, container);
                } else {
                    if (countOfWord(input.value) == 1) {
                        ajax(youdaoUrl, input.value, 0, container);
                    } else {
                        ajax(googleUrl + 'zh-CN&q=', encodeURIComponent(input.value), 1, container);
                    }
                }
            }
        });

    };

    // 翻译图标点击事件
    icon.addEventListener('click', translateProgress);


    window.addEventListener("keyup", function (event) {
        let key = event.key.toUpperCase();
        if (event.altKey === true && key == 'C') {
            console.log('keyup');

            translateProgress(event);
        }

        if (key == 'F2') {
            inputBlock();
        }
    })

    function countOfWord(str) {
        var value = String(str);

        value = value.replace(/^\s+|\s+$/gi, ""); // 前后空格不计算为单词数

        value = value.replace(/\s+/gi, " ");// 多个空格替换成一个空格

        var length = 0; // 更新计数
        var match = value.match(/\s/g);//没有匹配到则返回null
        if (match) {
            length = match.length + 1;
        } else if (value) {
            length = 1;
        }
        return length;
    }

    function isChina(str) {
        // [\u4E00-\u9FA5]|[\uFF00-\uFF20]|[\u3000-\u301C]
        var reg = /^([a-zA-Z])+$/;
        return !reg.test(str);
    }
    // ajax 跨域访问公共方法
    function ajax(url, text, target, element, method, data, headers) {
        if (!!!method)
            method = 'GET';
        // >>>因为Tampermonkey跨域访问(a.com)时会自动携带对应域名(a.com)的对应cookie
        // 不会携带当前域名的cookie
        // 所以，GM_xmlhttpRequest【不存在】cookie跨域访问安全性问题
        // 以下设置默认headers不起作用<<<
        url += text;
        if (!!!headers)
            headers = { 'cookie': '' };
        GM_xmlhttpRequest({
            method: method,
            url: url,
            headers: headers,
            data: data,
            onload: function (res) {
                if (target == 0) {
                    youdao(res.responseText, text, element);
                } else {
                    google(res.responseText, element);
                }
            },
            onerror: function (res) {
                displaycontainer("连接失败", element);
            }
        });
    }

    // 有道翻译 引擎
    function youdao(rst, text, element) {
        var ec = JSON.parse(rst).ec;
        if (!!ec) {
            var word = JSON.parse(rst).ec.word[0], html = '', tr = '';

            var trs = word.trs, ukphone = word.ukphone, usphone = word.usphone, phone = word.phone;
            var phoneStyle = '' +
                'color:#9E9E9E!important;' +
                '';
            if (!!ukphone && ukphone.length != 0) {
                html += '<span style="' + phoneStyle + '">英[' + ukphone + '] </span>';
            }
            if (!!usphone && usphone.length != 0) {
                html += '<span style="' + phoneStyle + '">美[' + usphone + '] </span>';
            }
            if (html.length != 0) {
                html += '<br />';
            } else if (!!phone && phone.length != 0) {
                html += '<span style="' + phoneStyle + '">[' + phone + '] </span><br />';
            }
            trs.forEach(element => {
                tr += element.tr[0].l.i[0] + '<br />';
            });
            html += tr;
            displaycontainer(html, element);
        } else {
            ajax(googleUrl + 'zh-CN&q=', text, 1, element);
        }
    }

    // 谷歌翻译 引擎
    function google(rst, element) {
        var json = JSON.parse(rst), html = '';
        for (var i = 0; i < json.sentences.length; i++) {
            html += json.sentences[i].trans;
        }
        displaycontainer(html, element);
    }

    function displaycontainer(text, element) {
        element.innerHTML = text;
        element.style.display = 'block';// 显示结果
    }

    // 翻译server
    var server = {
        // 存放已经生成的翻译内容面板（销毁的时候用）
        rendered: [],
        // 销毁已经生成的翻译内容面板
        containerDestroy: function () {
            for (var i = this.rendered.length - 1; i >= 0; i--) {
                if (this.rendered[i] && this.rendered[i].parentNode) {
                    this.rendered[i].parentNode.removeChild(this.rendered[i]);
                }
            }
        },
        // 生成翻译结果面板 DOM （此时还未添加到页面）
        container: function () {
            var div = document.createElement('div');
            div.setAttribute('style', '' +
                'display:none!important;' +
                'position:fixed!important;' +
                'font-size:13px!important;' +
                'overflow:auto!important;' +
                'background:#fff!important;' +
                'font-family:sans-serif,Arial!important;' +
                'font-weight:normal!important;' +
                'text-align:left!important;' +
                'color:#000!important;' +
                'padding:0.5em 1em!important;' +
                'line-height:1.5em!important;' +
                'border:1px solid #ccc!important;' +
                'max-width:350px!important;' +
                'max-height:216px!important;' +
                'z-index:2147483647!important;' +
                '');
            return div;
        }
    };// 翻译server结束
})();
