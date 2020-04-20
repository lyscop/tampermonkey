// ==UserScript==
// @name         bilibili 显示 av 号
// @namespace    https://github.com/8qwe24657913
// @version      0.1
// @description  在视频播放页面显示视频的 av 号
// @author       8q
// @match        http://www.bilibili.com/*
// @match        https://www.bilibili.com/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

// eslint-disable-next-line no-extra-semi
;(function() {
    'use strict'
    let aid, link, inject, observer
    const setData = () => {
        link.href = `//www.bilibili.com/video/av${aid}/`
        link.textContent = `av${aid}`
    }
    const run = () => {
        // aid 应为全数字
        if (!/^\d+$/.test(aid)) {
            console.error('bilibili 显示 av 号: aid 格式错误', 'aid=', aid)
            return
        }
        // 已插入链接且未被 vue 删除，常见于通过 pushState + ajax 实现的无刷新跳页
        if (link && document.contains(link)) {
            setData()
            return
        }
        // 视频统计信息加载完成之前不能插入 aid 信息，否则轻者被 vue 删除，重者页面错乱
        const anchor = document.querySelector('.video-data .view, .media-count')
        if (!anchor) {
            console.error('bilibili 显示 av 号: 未能找到元素插入点', 'aid=', aid)
            return
        }
        link = document.createElement('a')
        link.target = '_blank'
        setData()
        if (anchor.classList.contains('view')) {
            // 普通视频，使用 .a-crumbs 的样式
            const span = document.createElement('span')
            span.className = 'a-crumbs'
            span.setAttribute('style', 'margin: 0 16px;')
            span.appendChild(link)
            inject = () => anchor.parentNode.previousElementSibling.appendChild(span)
        } else {
            // 番剧，使用 .av-link 的样式
            link.className = 'av-link'
            inject = () => anchor.nextElementSibling.appendChild(link)
        }
        // 等待视频统计信息加载完成再插入
        if (/\d+/.test(anchor.textContent)) {
            inject()
        } else {
            if (observer) {
                observer.disconnect()
            } else {
                observer = new MutationObserver(() => {
                    observer.disconnect()
                    inject()
                })
            }
            observer.observe(anchor, {
                childList: true,
                subtree: true,
                characterData: true,
            })
        }
    }
    const target = window.__INITIAL_STATE__ && 'aid' in window.__INITIAL_STATE__ ? window.__INITIAL_STATE__ : window
    if (target === window && !('aid' in window)) window.aid = ''
    aid = target.aid
    // 我可能比 vue hook 得早，也可能比它晚
    // 如果我比 vue 早，vue 的 hook 触发时会自动触发我的 hook
    // 如果我比 vue 晚，我的 hook 触发时就需要触发 vue 的 hook
    const desc = Object.getOwnPropertyDescriptor(target, 'aid')
    const vueHook = desc.set
    Object.defineProperty(target, 'aid', {
        get: desc.get || (() => aid),
        set(id) {
            aid = id
            setTimeout(run)
            if (vueHook) vueHook.call(this, id)
        },
        enumerable: true,
        configurable: true,
    })
    // 如果已经有 aid 了就开始第一次运行
    if (aid) run()
})()
