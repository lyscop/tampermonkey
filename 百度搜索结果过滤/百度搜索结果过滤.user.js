// ==UserScript==
// @name         百度搜索结果过滤
// @namespace    https://gitee.com/huelse/baidu-filter
// @version      1.9
// @description  在下方block_list中添加你想过滤的网站，世界都将清净了
// @author       THENDINGs
// @include      https://www.baidu.com/s*
// @match        https://www.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @license      GPL License
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 屏蔽列表（默认为搜索结果的脚标）
    const block_list = ['广告', 'CSDN', '脚本之家', '百度知道', '百度经验', '腾讯云', '阿里云', '达内', '搜索智能聚合', 'zzvips', 'tedu', 'imooc', 'csdn', 'b2b', 'voidcn'];
 
    // 屏蔽关键词
    function block() {
        const arr = Array.from(new Set($('#content_left a span').get().concat($('#content_left span.c-color-gray').get(), $('#content_left a.c-color-gray').get(), $('#content_left a.c-showurl').get())));
        $.each(arr, function(idx, el) {
            const container = $(el).parents('.c-container');
            $.each(block_list, function(index, ele) {
                if (el.innerText.indexOf(ele) !== -1 && container.css('display') !== 'none') {
                    container.css('display', 'none');
                    // console.log('屏蔽: ' + el.innerText + ' ' + el.href);
                }
            });
        });
    }
 
    // 获取有效链接
    function relink() {
        const a = $('#content_left a');
        let visited = [];
        $.each(a, function(idex, el) {
            const container = $(el).parents('.c-container');
            if (container.css('display') === 'none') return;
            // 屏蔽百家号1
            if (el.href.includes('baijiahao')) {
                container.css('display', 'none');
                // console.log('屏蔽百家号1: ' + el.href);
                return;
            }
            // 过滤图片
            if (el.className.includes('img')) return;
            // 只匹配://www.baidu.com且不带/s的域名
            if (!/\:\/\/www.baidu.com(?!\/s)/.test(el.href)) return;
            // 避免重复请求
            if (visited.indexOf(el.href) !== -1) return;
            else visited.push(el.href);
            let url = el.href.replace('http://', 'https://');
            // 带上eqid参数
            if (!url.includes('eqid')) url += '&wd=&eqid=';
            $.get(url, function(data) {
                const real_url = /URL='(.+)'">/.exec(data);
                if (real_url && real_url[1]) {
                    el.href = real_url[1];
                    // 屏蔽百家号2
                    if (real_url[1].includes('baijiahao') && container.css('display') !== 'none') {
                        container.css('display', 'none');
                        // console.log('屏蔽百家号2: ' + el.href);
                    }
                }
            });
        });
    }
 
    // 屏蔽热搜榜
    function hot() {
        $('#content_right').css('display', 'none');
    }
 
    // 屏蔽相关搜索
    function rs() {
        $('#rs').css('display', 'none');
        $('.c-container[tpl="recommend_list"]').css('display', 'none');
    }
 
    // 监听事件，兼容AC-baidu
    function listen() {
        if(!document.querySelector('#content_left')) return;
        document.querySelector('#content_left').addEventListener("DOMNodeInserted", function (e) {
            if (!e.target || !e.target.className || !e.target.className.includes('c-container') ) return;
            const container = $(e.target);
            const a = container.find('a');
            let visited = [];
 
            $.each(a.get().reverse(), function(index, el) {
                // 过滤图片
                if (el.className.includes('img')) return;
                // 目标屏蔽标签=block()
                if (el.className.includes('c-color-gray')) {
                    $.each(block_list, function(index, ele) {
                        if (container.css('display') !== 'none' && el.innerText.indexOf(ele) !== -1) {
                            container.css('display', 'none');
                            // console.log('屏蔽: ' + el.innerText + ' ' + el.href);
                        }
                    });
                }
                // 标题链接获取真实链接=relink()
                else if (el.className.length === 0) {
                    if (container.css('display') === 'none') return;
                    // 屏蔽百家号1
                    if (el.href.includes('baijiahao')) {
                        container.css('display', 'none');
                        // console.log('屏蔽百家号1: ' + el.href);
                        return;
                    }
                    // 只匹配://www.baidu.com且不带/s的域名
                    if (!/\:\/\/www.baidu.com(?!\/s)/.test(el.href)) return;
                    // 避免重复请求
                    if (visited.indexOf(el.href) !== -1) return;
                    else visited.push(el.href);
                    let url = el.href.replace('http://', 'https://');
                    // 带上eqid参数
                    if (!url.includes('eqid')) url += '&wd=&eqid=';
                    $.get(url, function(data) {
                        const real_url = /URL='(.+)'"/.exec(data);
                        if (real_url && real_url[1]) {
                            el.href = real_url[1];
                            // 屏蔽百家号2
                            if (real_url[1].includes('baijiahao') && container.css('display') !== 'none') {
                                container.css('display', 'none');
                                // console.log('屏蔽百家号2: ' + el.href);
                            }
                        }
                    });
                }
            });
        }, false);
    }
 
    // 兼容百度async
    document.querySelector('#wrapper_wrapper').addEventListener("DOMNodeInserted", function (e) {
        if (e.target.id === 'container') {
            rs();
            hot();
            block();
            relink();
        }
    });
 
    // 启用功能
    $(function() {
        rs();
        hot();
        block();
        relink();
        listen();
    });
 
})();
