// ==UserScript==
// @name         链接预览助手
// @namespace    https://github.com/CheckCoder
// @version      0.1
// @description  长按链接将打开内置窗口预览。
// @author       check
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license      GPL
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 自动将 http 请求升级为 https
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute('content', 'upgrade-insecure-requests');
    document.head.appendChild(meta);
 
    // 界面
    const iframeContainer = document.createElement('div');
    iframeContainer.setAttribute('style', 'width: 100vw; height: 100vh; position: fixed; z-index: 99999; top: 0; left:0; display:none; background: rgba(0,0,0,0.5); justify-content: center; align-items:center');
    const iframe = document.createElement('iframe');
    iframe.setAttribute('style', 'width:90vw; height: 80vh; background: white; border: none');
 
    iframeContainer.appendChild(iframe);
    document.body.appendChild(iframeContainer);
 
    // 显示和隐藏控制
    function show() {
        iframeContainer.style.display = 'flex';
    }
 
    function hide() {
        iframeContainer.style.display = 'none';
        iframe.src = '';
    }
    iframeContainer.addEventListener('click', hide);
 
    function getATagByEvent(event) {
        for(let i = 0; i < event.path.length; i++) {
            const nodeName = event.path[i].nodeName;
            if (nodeName && nodeName.toLocaleLowerCase() === 'a') {
                return event.path[i];
            }
        }
    }
 
    // 长按逻辑
    let pressTimer = null;
    let hasIntoTimeout = false;
    let loogPressThreshold = 350;
    document.body.addEventListener('mousedown', function(event) {
        const aTag = getATagByEvent(event);
        if (!aTag) return;
 
        const href = aTag.getAttribute('href');
        if (!href || href.indexOf('javascript:') === 0) return;
 
        pressTimer = setTimeout(function() {
            hasIntoTimeout = true;
            iframe.src = href;
            show();
        }, loogPressThreshold);
    });
    document.body.addEventListener('mouseup', function() {
        clearTimeout(pressTimer);
    });
    document.body.addEventListener('click', function(event) {
        if (hasIntoTimeout) event.preventDefault();
        hasIntoTimeout = false;
    });
 
    function onKeyDown(event) {
        if (event.key === 'Escape') {
            hide();
        }
    }
    // esc 关闭
    document.body.addEventListener('keydown', onKeyDown);
})();
