// ==UserScript==
// @name              黑暗模式
// @namespace         
// @version           1.0.1
// @icon              
// @description       夜间开启
// @author            
// @license           MIT
// @supportURL        	https://greasyfork.org/scripts/398149-%E9%BB%91%E6%9A%97%E6%A8%A1%E5%BC%8F/code/%E9%BB%91%E6%9A%97%E6%A8%A1%E5%BC%8F.user.js
// @match             *://*/*
// @noframes
// @run-at            document-start
// @grant             GM_addStyle
// @grant             GM_getValue
// @grant             GM_setValue
// ==/UserScript==

;(function () {
  'use strict'

  let main = {
    addStyle() {
      //黑暗模式
      GM_addStyle(`
        .dark-mode, .dark-mode * { color: #eeeeee !important; background-color: #292929 !important; }
        .dark-mode img, .dark-mode video {z-index: 1}
        .dark-mode * {border-color: #555555 !important}
        .dark-mode cite, .dark-mode cite * {color: #029833 !important}
        .dark-mode :link, .dark-mode :link * {color: #8db2e5 !important}
        .dark-mode input, .dark-mode textarea {background-color: #333333 !important}
        .dark-mode a {background-color: rgba(255, 255, 255, 0.01) !important}
        .dark-mode :visited, .dark-mode :visited * {color: rgb(211, 138, 138) !important}
        .dark-mode, .dark-mode::before, .dark-mode body, .dark-mode body::before, .dark-mode input, .dark-mode select,.dark-mode button {background-image: none !important}
        .dark-mode video,.dark-mode code { background: transparent !important; }`
      )
    },

    hasClass(ele, cls) {
      return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"))
    },

    addClass(ele, cls) {
      if (!this.hasClass(ele, cls)) ele.className += " " + cls
    },

    removeClass(ele, cls) {
      if (this.hasClass(ele, cls)) {
        var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)")
        ele.className = ele.className.replace(reg, " ")
      }
    },

    toggleClass(ele, cls) {
      if (this.hasClass(ele, cls)) {
        this.removeClass(ele, cls)
      } else {
        this.addClass(ele, cls)
      }
    },

    addButton() {
      let o = document.createElement('div'),
        dark = GM_getValue('dark') ? GM_getValue('dark') : 0
      o.style.height = '30px'
      o.style.width = '30px'
      o.style.display = 'flex'
      o.style.alignItems = 'center'
      o.style.justifyContent = 'center'
      o.style.borderRadius = '50%'
      o.style.backgroundColor = '#333'
      o.style.color = '#fff'
      o.style.position = 'fixed'
      o.style.right = '32px'
      o.style.bottom = '32px'
      o.style.cursor = 'pointer'
      o.style.zIndex = '99999'
      o.innerHTML = '🌓'
      o.id = 'darkBtn'
      document.body.appendChild(o)

      if (dark) {
        o.style.setProperty('background-color', '#fff', 'important')
        this.addClass(document.getElementsByTagName('html')[0], 'dark-mode')
      } else {
        o.style.setProperty('background-color', '#333', 'important')
        this.removeClass(document.getElementsByTagName('html')[0], 'dark-mode')
      }

      o.addEventListener("click", () => {
        if (GM_getValue('dark')) { //回到正常模式
          GM_setValue('dark', 0)
          o.style.setProperty('background-color', '#333', 'important')
        } else {
          GM_setValue('dark', 1)
          o.style.setProperty('background-color', '#fff', 'important')
        }
        this.toggleClass(document.getElementsByTagName('html')[0], 'dark-mode')
      })
    }
  }
  window.addEventListener('DOMContentLoaded', () => {
    main.addStyle()
    main.addButton()
  })
})()
