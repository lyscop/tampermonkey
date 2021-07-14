// ==UserScript==
// @name         javdb添加跳转在线观看网站
// @version      0.00016.1
// @description  在影片详情页显示跳转到在线观看网站的按钮，并检查对应是否存在资源，如果对应网站上存在该资源则为绿色，否则显示红色，目前支持[netflav，javhhh，jable]三个网站。
// @author       misssion522
// @match        https://javdb.com/*
// @include      /^https:\/\/(\w*\.)?javdb(\d)*\.com.*$/
// @icon         https://www.google.com/s2/favicons?domain=javdb.com
// @license      MIT
// @connect      jable.tv
// @connect      javhhh.com
// @connect      netflav.com
// @connect      translate.google.cn
// @connect      *
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/qs/6.7.0/qs.min.js
// @resource     mycss    https://192.168.1.321
// @namespace http://tampermonkey.net/
// ==/UserScript==
 
'use strict';
 
// document.querySelectorAll('img').forEach((item) => {
//   item.style.display = 'none';
// });
 
// 网站列表
let site = [
  { siteId: '0', hostname: 'Jable.tv', url: 'https://jable.tv/videos/(code)/', search: 'false', reg: /reg/ },
  { siteId: '1', hostname: 'Javhhh.com', url: 'https://javhhh.com/video/(code)', search: 'return200', reg: /<div class="text">獲取數據失敗<\/div>/ },
  {
    siteId: '2',
    hostname: 'Netflav.com',
    url: 'https://netflav.com/search?type=title&keyword=(code)',
    search: 'search',
    // reg: '<div class="grid_title">.?(code)',
    reg: /reg/,
  },
  // { siteId: '99', hostname: 'test', url: 'https://lkoipfdsanjkfhasnbqjzlqajfs.com/', search: 'search', reg: /reg/ },
];
 
let curLocation = location.pathname;
if (document.querySelector('.tabs.is-boxed')) {
  console.log('mainPage');
  // mainPage();
} else if (curLocation.includes('/v/') && document.querySelector('h2')) {
  console.log('vPage');
  vPage();
}
 
// function mainPage() {
//   let items = document.querySelectorAll('.grid-item.column>a');
//   items.forEach((item) => {
//     getScore(item.href);
//   });
// }
 
function vPage() {
  translateTitle(document.querySelector('h2.title.is-4').innerHTML);
  site.forEach((item) => {
    getWebsite(item);
  });
}
 
//获取分数,   不写了
// function getScore(link) {
//   GM_xmlhttpRequest({
//     method: 'GET',
//     url: link,
//     headers: {
//       'Content-type': 'application/x-www-form-urlencoded',
//     },
//     onload: function (result) {
//       console.dir(result.responseText);
//     },
//   });
// }
 
//传入网站，处理网站
function getWebsite(site) {
  let videoCode = document.querySelector('[data-clipboard-text]').attributes[2].value;
  let xhrResult = '';
  let siteUrl = site.url.replace('(code)', videoCode);
  let siteReg = site.reg;
  // let siteReg = new RegExp(site.reg.replace('(code)', videoCode), 'gim');
 
  const buttonG = document.createElement('a');
  document.querySelectorAll('.panel-block div.buttons')[1].appendChild(buttonG);
  buttonG.classList.add('button', 'is-info', 'is-outlined', 'button-g');
  buttonG.innerHTML = site.hostname;
  buttonG.setAttribute('target', '_blank');
  // buttonG.style.background = '#3298dc';
  // buttonG.style.color = 'white';
  buttonG.href = siteUrl;
  function setbuttonGColor(color) {
    buttonG.style.color = color;
    buttonG.style.borderColor = color;
  }
 
  // 获取xhr状态函数，立即执行
  (function xhr() {
    GM_xmlhttpRequest({
      method: 'GET',
      url: siteUrl,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
      },
      onload: function (result) {
        xhrResult = result.status;
        console.log(`----${site.hostname} onload,${xhrResult}`);
        // 默认search=’false‘，不用任何搜索，直接200 显示绿色
        // search=’return200’，用于实际网页是 404，返回result.status却为 200
        if (site.search == 'return200' && result.status == 200) {
          if (siteReg.test(result.responseText)) {
            xhrResult = 404;
          }
        }
        // search=‘search‘，用于在网站搜索，并返回搜索结果（视频地址）
        else if (site.search == 'search') {
          let newDocument = new DOMParser().parseFromString(result.responseText, 'text/html');
          if (newDocument.querySelectorAll('img[src="/static/assets/404.gif"]').length > 0) {
            xhrResult = 404;
          } else if (newDocument.querySelectorAll('.grid_title')[0].innerText.includes(videoCode) == false) {
            xhrResult = 404;
          } else {
            buttonG.href = `https://${site.hostname}${newDocument.querySelectorAll('.grid_cell>a')[0].pathname}${newDocument.querySelectorAll('.grid_cell>a')[0].search}`;
          }
        }
        xhrResult == 404 ? setbuttonGColor('red') : setbuttonGColor('green');
      },
      onerror: function (result) {
        // xhrResult = false;
        console.log(`----${site.hostname} onerror`, xhrResult);
        console.log(result);
        setbuttonGColor('red');
      },
    });
  })();
}
 
//谷歌翻译
function translateTitle(query) {
  const ButtonT = document.createElement('h2');
  let h2title = document.querySelector('h2.title.is-4');
  h2title.appendChild(ButtonT);
  ButtonT.classList.add('title', 'is-6');
  ButtonT.innerHTML = '翻译';
  ButtonT.style.display = 'none';
  ButtonT.style.background = '#EEEEEB';
  ButtonT.style.padding = '.5em 0';
  ButtonT.style.cursor = 'pointer';
 
  h2title.addEventListener('mouseover', () => {
    ButtonT.style.display = 'block';
  });
  h2title.addEventListener('mouseout', () => {
    ButtonT.style.display = 'none';
  });
 
  ButtonT.addEventListener('click', getTranslate);
 
  let data = {
    client: 'gtx',
    dt: 't',
    dj: 1,
    ie: 'UTF-8',
    sl: 'auto', //目的类型
    tl: 'zh-CN', //目标语言
    q: query,
  };
  let requestUrl = 'https://translate.google.cn/translate_a/single?' + Qs.stringify(data);
  let flag = true;
  function getTranslate() {
    if (!flag) {
      return;
    }
    GM_xmlhttpRequest({
      method: 'GET',
      url: requestUrl,
      onload: function (res) {
        console.log('tarnslateXHR');
        let json = JSON.parse(res.responseText);
        // console.log(json.sentences[0].trans);
        ButtonT.innerHTML = json.sentences[0].trans;
        flag = false;
      },
    });
  }
}
