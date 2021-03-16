// ==UserScript==
// @name 新标签页打开
// @namespace undefined
// @version 0.1
// @description 强制所有链接在新标签页打开
// @match https://*/*
// @match http://*/*
// @grant none
// @run-at document-end
// ==/UserScript==
document.body.addEventListener('mousedown', function (e) {
	e.target.target = '_blank';
    e.target.parentNode.target='_blank';
	e.target.parentNode.parentNode.target='_blank';
	e.target.parentNode.parentNode.parentNode.target='_blank';
	e.target.parentNode.parentNode.parentNode.parentNode.target='_blank';
})
