// ==UserScript==
// @name         划词使用百度搜索
// @namespace    https://greasyfork.org/zh-CN/users/150560
// @version      2.0.0
// @description  选中文本后弹出搜索框，使用百度搜索该文本
// @author       iceFish
// @match        http://*/*
// @include      https://*/*
// @run-at document-end
// ==/UserScript==
(function () {
  'use strict';

  var iconSize = 24;
  var translationTestSize = 16;
  var searchIcon = document.createElement('div');
  var style = '' + 'width:24px;' + 'height:24px;' + 'margin:4px!important;' + 'position:absolute' + '';
  searchIcon.innerHTML = "\n      \n      ";
  searchIcon.setAttribute('style', '' + 'width:32px!important;' + 'height:32px!important;' + 'display:none!important;' + 'background:#fff!important;' + 'border-radius:16px!important;' + 'box-shadow:4px 4px 8px #888!important;' + 'position:absolute!important;' + 'z-index:2147483647!important;' + ''); // 添加翻译图标到 DOM

  document.documentElement.appendChild(searchIcon); // 鼠标事件：防止选中的文本消失/显示、隐藏 图标

  document.addEventListener('mousedown', function (e) {
    if (e.target === searchIcon || e.target.parentNode && e.target.parentNode === searchIcon || e.target.parentNode.parentNode && e.target.parentNode.parentNode === searchIcon) {
      // 点击了 图标
      e.preventDefault();
      return;
    }

    var text = window.getSelection().toString().trim();
    searchIcon.style.display = 'none';
  });
  document.addEventListener('mouseup', function (e) {
    if (e.target === searchIcon || e.target.parentNode && e.target.parentNode === searchIcon || e.target.parentNode.parentNode && e.target.parentNode.parentNode === searchIcon) {
      // 点击了 图标
      e.preventDefault(); // return;
    }

    var text = window.getSelection().toString().trim();

    if (text) {
      searchIcon.style.top = e.pageY + 12 + 'px';
      searchIcon.style.left = e.pageX - 36 + 'px';
      searchIcon.style.display = 'block';
    }
  }); // 选中变化事件：当点击已经选中的文本的时候，

  document.addEventListener("selectionchange", function () {
    var text = window.getSelection().toString().trim();
  }); // 图标点击事件

  searchIcon.addEventListener('click', function (e) {
    var text = window.getSelection().toString().trim();

    if (text) {
      searchIcon.style.display = 'none';
      window.open("https://www.baidu.com/s?ie=UTF-8&wd=".concat(text));
    }
  });
})();
