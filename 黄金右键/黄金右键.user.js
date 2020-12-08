// ==UserScript==
// @name         黄金右键
// @description  按住右键→倍速播放, 松开右键→恢复原样, 灵活追剧看视频~ 支持b站、YouTube、腾讯视频、优酷...
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @author       SkyJin
// @include    https://www.bilibili.com/*
// @include    https://www.youtube.com/*
// @include    https://v.youku.com/v_show/id_*
// @include    https://www.iqiyi.com/*
// @include    https://v.qq.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let down_count = 0
    const faster_rate = 3
    let normal_rate = 1
    const add_time = 7
    let page_video

    const tryPageVideo = () => Array.prototype.find.call(document.getElementsByTagName('video'), e => e.offsetWidth > 9)
    const getPageVideo = () => {
        return new Promise(resolve => {
            const timer = setInterval(() => {
                const page_video = tryPageVideo()
                if (page_video) {
                    clearInterval(timer)
                    resolve(page_video)
                }
            }, 500);
        })
    };
    const checkPageVideo = async () => {
        if (page_video.offsetWidth <= 9) {
            page_video = await getPageVideo()
            if (page_video.offsetWidth <= 9) {
                console.error('播放器检查失败，请检查当前页面是否存在html5播放器')
                return false
            }
        }
        return true
    }
    const relativeEvent = {
        _stopper: e => e.stopPropagation(),
        // 目前针对腾讯视频
        shouldPrevent: location.origin.indexOf('qq.com') > -1,
        prevent () {
            document.body.addEventListener('ratechange', this._stopper, true)
            document.body.addEventListener('timeupdate', this._stopper, true)
        },
        allow () {
            document.body.removeEventListener('ratechange', this._stopper, true)
            document.body.removeEventListener('timeupdate', this._stopper, true)
        }
    }
    const downEvent = async e => {
        if (e.keyCode !== 39) return
        e.stopPropagation()

        // 计数+1
        down_count++

        // 长按右键-开始
        if (down_count === 2 && await checkPageVideo()) {
            relativeEvent.shouldPrevent && relativeEvent.prevent()
            normal_rate = page_video.playbackRate
            page_video.playbackRate = faster_rate
            console.log('加速播放中')
        }
    }
    const upEvent = async e => {
        if (e.keyCode !== 39) return
        e.stopPropagation()

        // 单击右键时
        if (down_count === 1 && await checkPageVideo()) {
            page_video.currentTime += add_time
            console.log('前进' + add_time + '秒')
        }

        // 长按右键-结束
        if (page_video.playbackRate !== normal_rate) {
            page_video.playbackRate = normal_rate
            relativeEvent.shouldPrevent && relativeEvent.allow()
        }

        // 计数-重置
        down_count = 0
    }
    const init = async () => {
        page_video = await getPageVideo()
        document.body.addEventListener('keydown', downEvent, true)
        document.body.parentElement.addEventListener('keyup', upEvent, true)
    }

    init()
})();
