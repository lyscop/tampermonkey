// ==UserScript==
// @name         知乎热搜信息过滤器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  知乎热搜信息过滤器 | 去除明星相关信息
// @require https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @author       夏2同学
// @match        https://www.zhihu.com*
// @match        https://www.zhihu.com/*
// @match        http://www.zhihu.com/*
// @grant        none
// ==/UserScript==
 
'use strict'
let beforeUrl = window.location.href
let blackList = ['于谦', '郑爽', '王鸥', '宋丹丹', '杨幂', '魏大勋', '汪峰'] // 黑名单
let whiteList = [] // 白名单
 
window.setInterval(__init__, 1000)
 
if (window.location.href.indexOf('hot') !== -1) {
  // 在hot页面
  storeInit()
  filterHot()
  noAds()
  addBtns()
  $(document).on('click', '.blockHot', function (e) {
    BlockItem(e)
  })
}
 
function __init__() {
  // 每隔1s检测url是否改变,初始化函数
  if (window.location.href !== beforeUrl) {
    console.log('---------------分割线start------------------')
    // url 发生改变了
    beforeUrl = window.location.href
    console.log('url发生了改变')
    if (window.location.href.indexOf('hot') !== -1) {
      // 过滤热门页面的信息
      storeInit()
      filterHot()
      noAds()
      addBtns()
    }
    console.log('---------------分割线end-----------------')
  }
}
 
function isHavingKeyWord(str, keywords = blackList) {
  let index
  if (
    localStorage.getItem('blackList') !== undefined ||
    localStorage.getItem('blackList') !== null
  ) {
    // 初始化读取 本地存储
    keywords = JSON.parse(localStorage.getItem('blackList'))
  }
 
  for (index in keywords) {
    // console.log('index=', keywords[index])
    if (str.indexOf(keywords[index]) != -1) {
      // 说明包含关键词
      return {
        res: true,
        keyword: keywords[index],
      }
    }
  }
  return false
}
 
function noAds() {
  // 去除首页广告
  let adList = $('*[alt="广告"]')
  // console.log(adList)
  adList = Array.from(adList)
  if (adList.length !== 0) {
    let item
    adList.forEach((item) => {
      item.style.display = 'none'
      console.log('有一条广告被隐藏了！', item)
    })
  }
}
 
function filterHot() {
  let list = $('#TopstoryContent > div > div > div.HotList-list > section')
 
  // console.log(list)
  let key
  for (key in list) {
    //  执行返回操作
    if (key === 'length') {
      return
    }
 
    // 依次遍历
    let detail = list[key].innerHTML
    console.log('key=', key - 0 + 1)
    // console.log(detail)
 
    let msg = isHavingKeyWord(detail)
 
    if (msg.res) {
      // console.log(list[key])
      // 隐藏该元素
      list[key].style.display = 'none'
      console.log(
        `移除了一条热搜信息，其key =  ${key - 0 + 1},keyword = ${
          msg['keyword']
        }`,
      )
    }
  }
}
 
function addBtns() {
  let dom =
    '
 
 https://www.zhihu.com/qrcode?url=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F440614545%23showWechatShareTip" alt="微信二维码" /> ​ 屏蔽  
 
 '
 
  list = $(
    '#TopstoryContent > div > div > div.HotList-list > section > div.HotItem-content > div',
  )
 
  list = Array.from(list)
  let item
  list.forEach((item) => {
    item.append($(dom)[0])
  })
}
 
//string字符串转为dom
function parseToDOM(str) {
  var div = document.createElement('div')
  if (typeof str == 'string') div.innerHTML = str
  return div.childNodes
}
 
function addKeyWord(keyword) {
  let blackList = localStorage.getItem('blackList')
  let keywords
  if (blackList !== undefined || blackList !== null) {
    // 初始化读取 本地存储
    keywords = JSON.parse(localStorage.getItem('blackList'))
    keywords.push(keyword)
  }
  localStorage.setItem('blackList', JSON.stringify(keywords))
 
  location.reload()
}
 
function storeInit() {
  let item = localStorage.getItem('blackList')
  if (item === undefined || item === null) {
    localStorage.setItem('blackList', JSON.stringify(blackList))
  }
}
 
function BlockItem(e) {
  let element = e.currentTarget || e.srcElement || e.toElement
  console.log(
    element.parentElement.parentElement.children[0].getAttribute('title'),
  )
  let defaultValue = element.parentElement.parentElement.children[0].getAttribute(
    'title'
  )
  let keyword = prompt('请确认屏蔽关键词！', defaultValue)
  console.log(keyword)
 
  if (keyword !== null) {
    // 说明用户点击了确认
    addKeyWord(keyword)
  }
}
