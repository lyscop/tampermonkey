// ==UserScript==
// @name         javdb性癖净化器
// @namespace    psrx
// @version      0.1
// @description  过滤掉你不喜欢的内容
// @author       psrx
// @include      https://javdb.com/*
// @grant        none
// ==/UserScript==
;(function () {
  'use strict'
 
  const 你不喜欢的关键字 = [
    '剛毛',
    '虐',
    '奴',
    '調教',
    '熟女',
    '熟娘',
    '五十路',
    '拷問',
    'vr',
    '拘束',
    '糞',
    '大便',
    '飲尿',
    'ドM',
    '唾',
    'M男',
  ].map((i) => i.toLowerCase())
  // 如DKWT-010,只需要写DKWT
  const 你不喜欢的番号 = [].map((i) => i.toLowerCase())
 
  const avDoms = [...document.querySelectorAll('.grid-item.column')]
  const avs = avDoms.map((i) => {
    return {
      title: i.querySelector('.video-title').textContent.toLowerCase(),
      id: i.querySelector('.uid').textContent.toLowerCase(),
    }
  })
 
  avs.forEach((av, index) => {
    ;(你不喜欢的关键字.find((关键字) => av.title.includes(关键字)) ||
      你不喜欢的番号.find((番号) => av.id.includes(番号))) &&
      avDoms[index].remove()
  })
})()
