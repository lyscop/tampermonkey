// ==UserScript==
// @name                 AdBlock-Baidu
// @name:zh-CN           百度搜索去广告 + 反重定向
// @namespace            https://greasyfork.org/zh-CN/users/42351
// @require              https://code.jquery.com/jquery-3.2.1.min.js
// @version              0.7
// @description          Remove ads from Baidu search
// @description:zh-CN    移除百度搜索中的广告,解析重定向地址为直接地址
// @author               Antecer
// @include              http*://www.baidu.com/*
// @grant                GM_xmlhttpRequest
// @connect              *
// @run-at               document-end
// @compatible           chrome 测试通过
// ==/UserScript==

jQuery.noConflict();
(function($) { $(function() {
    // 左侧广告选择器
    var Ad_L  = ['span:contains(广告)',
                 'a:contains(广告):not(:has(em))',
                 'a[href*="bzclk.baidu.com"]'
                ].join(',');
    // 右侧广告选择器
    var Ad_R = ['.ad-block',
                'a:contains(广告):has(em)',
                'a[href*="bzclk.baidu.com"]',
                'a[data-mu*="http:"]'
               ].join(',');
    setInterval(function(){
        $('#content_left>*').has(Ad_L).remove();     // 移除左侧广告
        $('td[align="left"]>*').has(Ad_R).remove();  // 移除右侧广告
        $('#content_right br').remove();             // 移除右侧空行
    },200);

    // 检索搜索结果，解析重定向地址为直接地址
    function direct(){
        $.each($('#content_left a[href*="baidu.com/link"]'), function (n,value) {
            (function (targURL) {
                var thisReq = GM_xmlhttpRequest ( {
                    url:targURL,
                    method: "GET",
                    onreadystatechange: function (result) {
                        if(/finalurldhdg/.test(result.responseHeaders)){
                            $("a[href='"+targURL+"']").attr("href", result.responseHeaders.match(/finalurldhdg: (.*?)\r\n/)[1]);
                        }
                        if(result.readyState > 2) thisReq.abort();
                    }
                } );
            } ) (value);
        });
    }
    direct();

    // 监听页面标题变动，以达到监听搜索内容变化的目的
    $('title').bind('DOMNodeInserted', function(e) {
        direct();
    });
});})(jQuery);
