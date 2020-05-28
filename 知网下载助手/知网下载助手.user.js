// ==UserScript==
// @name         知网下载助手
// @namespace    wyn665817@163.com
// @version      1.5.2
// @description  解析CNKI论文PDF格式下载地址，论文搜索结果页面和硕博论文详述页面的caj格式下载链接替换为pdf格式下载链接
// @author       wyn665817
// @match        *://*.cnki.net/*
// @include      */brief.aspx*
// @include      */detail.aspx*
// @include      */DefaultResult/Index*
// @include      */CatalogViewPage.aspx*
// @connect      cnki.net
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @supportURL   https://greasyfork.org/zh-CN/scripts/371938/feedback
// @license      MIT
// ==/UserScript==

var $ = unsafeWindow.jQuery,
url = location.pathname;

if (!$) {
} else if (url.match(/brief\.aspx$/)) {
    $('.briefDl_Y, .briefDl_D', '.GridTableContent').attr('href', reUrl);
} else if (url.match(/DefaultResult\/Index$/)) {
    $(document).ajaxSuccess(function() {
        if (arguments[2].url == '/kns/Brief/GetGridTableHtml') $('.downloadlink').attr('href', reUrl);
    });
} else if (url.match(/detail\.aspx$/) && location.search.match(/dbcode=C[DM][FM]D&/i)) {
    $('.dllink > .icon').add('.operate-btn a').attr('href', function(index, url) {
        var tip = $(this).text().trim();
        if (tip == '整本下载') {
            return reUrl(0, url);
        } else if (tip.match(/^分[页章]下载$/)) {
            tip = this.href.replace(/^https/, 'http').replace(/%20/g, '').replace(/kns/, 'new.gb.oversea');
            return tip.replace(/new\.gb\.oversea8/, 'gb.kns8') + '&cflag=pdf';
        }
        return url;
    });
    url = $('a[href*=kns8]:contains(分章下载)').attr('href');
    url = url && url.replace(/^.+\?/, 'http://kns8.cnki.net/kdoc/download.aspx?');
    GM_xmlhttpRequest({
        method: 'GET',
        url: url || $('a:contains(分章下载)').attr('href').replace(/^.+\?/, 'http://gb.oversea.cnki.net/kcms/download.aspx?'),
        onload: function(xhr) {
            var list = $('tr', xhr.responseText).map(function() {
                var $dom = $(this).find('a, td:last');
                return $dom.eq(0).html().trim().replace(/&nbsp;/g, ' ') + '\t' + $dom.eq(1).text().trim().split('-')[0];
            }).get().join('\n'),
            $now = $('<a class="icon icon-dlBlue" style="cursor: pointer;">复制目录</a>').prependTo('.dllink');
            $('<li class="btn-dlpdf"><a>复制目录</a></li>').prependTo('.operate-btn').add($now).click(function() {
                GM_setClipboard(list);
                alert('目录已复制到剪贴板');
            }).toggle(!!list);
        }
    });
} else if (url.match(/CatalogViewPage\.aspx$/)) {
    $('#downLoadFile img').last().attr('src', function(index, url) {
        return url.replace('CAJ', 'PDF');
    }).next().attr('href', reUrl).text('PDF全文下载').attr('title', 'PDF全文下载');
}

function reUrl(index, url) {
    return url.replace(/&dflag=\w*|$/, '&dflag=pdfdown');
}
