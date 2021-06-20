// ==UserScript==
// @name               douban blocker
// @name:zh-CN         豆瓣屏蔽器
// @namespace          https://github.com/cologler/
// @version            0.5.6
// @description        block some user on douban.com.
// @description:zh-CN  在豆瓣上屏蔽某些智障及水军。
// @author             cologler
// @match              https://www.douban.com/people/*/
// @match              https://movie.douban.com/subject/*
// @match              https://movie.douban.com/review/*
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_removeValue
// @grant              GM_addStyle
// @grant              GM_registerMenuCommand
// @grant              GM_addValueChangeListener
// @grant              GM_removeValueChangeListener
// @grant              GM_info
// @grant              GM_unregisterMenuCommand
// @grant              GM_getResourceText
// @require            https://greasyfork.org/scripts/31539-singletondata/code/SingletonData.js
// @require            https://greasyfork.org/scripts/31497-styleswitcher/code/StyleSwitcher.js
// @resource           baddates    https://gist.github.com/Cologler/7e4ea59e9a379187b2c790e0ede34b48/raw/douban-baddates.json
// ==/UserScript==
 
// just let type script work.
(function() { function require(){}; require("greasemonkey"); })();
 
(function() {
    'use strict';
 
    let CLASS_BLOCKED = 'blocked';
    let CLASS_BLOCKED_ROOT = 'blocked-root';
    let CLASS_BLOCKED_AUTHOR = 'blocked-author';
    let CLASS_BLOCKED_CONTENT = 'blocked-content';
 
    let sw = new StyleSwitcher();
    sw.addStyle('block all',
    `
    .blocked-root {
    }
    .blocked-author {
        color: red !important;
    }
    .blocked-content {
        background-color: black;
    }
    .blocker-userinfo {
        color: orange;
        margin: 0;
    }
    `);
    sw.addStyle('hide all',
    `
    .blocked-root {
        display: none;
    }
    .blocker-userinfo {
        color: orange;
        margin: 0;
    }
    `);
    sw.load();
 
    class BlockedList {
        constructor() {
            this._key = 'blockedlist';
            self._sd = new SingletonData('blockedlist', {});
            this._data = self._sd.data;
        }
 
        loadData() {
            if (this._data === null) {
                this._data = self._sd.data;
            }
        }
 
        saveData() {
            self._sd.save();
        }
 
        addId(id) {
            if (!this.hasId(id)) {
                this._data[id] = true; // can add as group?
                this.saveData();
            }
        }
 
        removeId(id) {
            if (this.hasId(id)) {
                delete this._data[id];
                this.saveData();
            }
        }
 
        hasId(id) {
            return this._data[id] !== undefined;
        }
    }
    let blocked = new BlockedList();
 
    class BadDates {
        constructor (data) {
            const dates = {};
            const dateRanges = [];
            const dateRangesMap = {};
            data.forEach(z => {
                z.dates.forEach(x => {
                    if (typeof x === 'string') {
                        dates[x] = z.reason;
                    } else if (Object.prototype.toString.call(x) === '[object Array]' ) { // array
                        console.assert(x.length == 2);
                        dateRanges.push(x);
                        dateRangesMap[this.getDateRangeMapKey(x[0], x[1])] = z.reason;
                    }
                });
            });
            this.dates = dates;
            this.dateRanges = dateRanges;
            this.dateRangesMap = dateRangesMap;
        }
 
        getDateRangeMapKey(first, second) {
            return first + '~' + second;
        }
 
        getInfo(date) { // return null if not found.
            let value = this.dates[date];
            if (value !== undefined) {
                return value;
            }
            const d = new Date(date);
            for (var i = 0; i < this.dateRanges.length; i++) {
                var x = this.dateRanges[i];
                if (new Date(x[0]) <= d && d <= new Date(x[1])) {
                    return this.dateRangesMap[this.getDateRangeMapKey(x[0], x[1])];
                }
            }
            return null;
        }
    }
    const baddates = new BadDates(JSON.parse(GM_getResourceText('baddates')));
 
    const analyticsDate = new SingletonData('analytics-date', {});
 
    function onPeoplePage() {
        let url = window.location.href;
        let match = url.match(/https:\/\/www.douban.com\/people\/([^\/]+)\//);
        if (!match) return;
        let userid = match[1];
 
        let opt = document.querySelector('.user-opt');
        if (opt) {
            // info
            let uidiv = document.querySelector('.user-info .pl'); // div
            let dateMatcher = uidiv.innerText.match(/\d{4}-\d{2}-\d{2}/);
            let userRegisterDateText = dateMatcher[0];
            function getInfo() {
                let registerdDate = new Date(Date.parse(userRegisterDateText));
                let oneDay = 24 * 60 * 60 * 1000;
                let days = Math.round(Math.abs((new Date().getTime() - registerdDate.getTime())/(oneDay)));
 
                let value = 0;
                document.querySelectorAll('#movie .pl a').forEach(a => {
                    let n = Number(a.text.match(/\d+/)[0]);
                    if (a.text.endsWith('在看')) {
                        value += n;
                    } else if (a.text.endsWith('想看')) {
                        value += n;
                    } else { // 看过
                        value += n;
                    }
                });
 
                if (days <= 90) {
                    return '注册时间过短';
                }
                if (days < 365 * 3) {
                    if (days / value > 10) {
                        return '很有可能是水军\r\n（看过的作品太少）';
                    }
                } else {
                    if (days / value > 50) {
                        return '很有可能是水军\r\n（看过的作品太少）';
                    }
                }
            }
            function addNext(text) {
                //uidiv.appendChild(document.createElement('br'));
                let p = document.createElement('p');
                p.classList.add('blocker-userinfo');
                p.innerText = text;
                uidiv.appendChild(p);
            }
            let infoText = getInfo();
            if (infoText) {
                addNext(infoText);
            }
 
            infoText = baddates.getInfo(userRegisterDateText);
            if (infoText !== null) {
                addNext(infoText);
            }
 
            // add button `blocked`
            function newText() {
                return blocked.hasId(userid) ? '取消屏蔽' : '屏蔽';
            }
 
            let a = document.createElement('a');
            a.text = newText();
            a.classList.add('a-btn');
            a.classList.add('mr5');
            a.href = '/';
            a.onclick = () => {
                if (blocked.hasId(userid)) {
                    blocked.removeId(userid);
                    let c = analyticsDate.data[userRegisterDateText];
                    c--;
                    if (c <= 0) {
                        delete analyticsDate.data[userRegisterDateText];
                    } else {
                        analyticsDate.data[userRegisterDateText] = c;
                    }
                } else {
                    blocked.addId(userid);
                    analyticsDate.data[userRegisterDateText] = (analyticsDate.data[userRegisterDateText] || 0) + 1;
                }
                analyticsDate.save();
                a.text = newText();
                return false;
            };
            opt.insertBefore(a, opt.children[2]);
 
 
        } else {
            let msg = document.querySelector('.article .infobox');
            if (msg) {
                if (msg.innerText.match('依据用户管理细则， 帐号.+永久停用')) {
                    blocked.addId(userid);
                }
            }
 
            // 在自己的页面
        }
    }
 
    function getUserId(url) {
        let m = url.match(/https:\/\/www.douban.com\/people\/([^\/]+)\//);
        if (m) {
            return m[1];
        }
        return null;
    }
 
    function blockRoot(r) {
        r.classList.add(CLASS_BLOCKED);
        r.classList.add(CLASS_BLOCKED_ROOT);
    }
 
    function blockA(a) {
        if (a.tagName !== 'A') {
            throw new Error('a is not <a/>');
        }
        let userId = getUserId(a.href);
        if (blocked.hasId(userId)) {
            a.classList.add(CLASS_BLOCKED);
            a.classList.add(CLASS_BLOCKED_AUTHOR);
            a.text = '<已屏蔽的弱智>';
            return true;
        } else {
            return false;
        }
    }
 
    function blockContent(c) {
        c.classList.add(CLASS_BLOCKED);
        c.classList.add(CLASS_BLOCKED_CONTENT);
    }
 
    function blockContentIfNotNull(c) {
        if (c === null) {
            return;
        }
        c.classList.add(CLASS_BLOCKED);
        c.classList.add(CLASS_BLOCKED_CONTENT);
    }
 
    function clickButton(el) {
        let etype = 'click';
        if (el.fireEvent) {
            el.fireEvent('on' + etype);
        } else {
            var evObj = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            el.dispatchEvent(evObj);
        }
    }
 
    function onMovie(element) {
        if (!element.querySelectorAll) {
            return;
        }
 
        let url = window.location.pathname;
 
        let m = url.match(/^\/subject\/\d+\/$/);
        if (m) {
            // 小组讨论
            element.querySelectorAll('.section-discussion .olt tr').forEach(tr => {
                const authorEl = tr.children[1].querySelector('a');
                if  (authorEl) {
                    if (blockA(authorEl)) {
                        blockRoot(tr);
                        blockContent(tr.children[0]);
                    }
                }
            });
 
            // 短评
            element.querySelectorAll('.comments-section .comment-item').forEach(cm => {
                if (blockA(cm.querySelector('.comment-info a'))) {
                    blockRoot(cm);
                    blockContent(cm.querySelector('.comment').children[1]);
                }
            });
            return;
        }
 
        m = url.match(/^\/subject\/(\d+)\/discussion\/$/);
        if (m) {
            Array.from(element.querySelectorAll('.discussion-posts tbody tr')).slice(1).forEach(tr => {
                if (blockA(tr.children[1].children[0])) {
                    blockRoot(tr);
                    blockContent(tr.children[0].children[0]);
                }
            });
            return;
        }
 
        m = url.match(/^\/subject\/(\d+)\/discussion\/(\d+)\/$/);
        if (m) {
            let discussionId = m[2];
            element.querySelectorAll('#link-report').forEach(div => {
                const a = div.querySelector('.post-author-name a');
                if (blockA(a)) {
                    blockRoot(div);
                    blockContent(element.querySelector('#link-report').children[3].children[0]);
                    // 自动投反对票
                    voteuseless('c-' + discussionId, false);
                }
            });
            element.querySelectorAll('div.comment-item').forEach(div => {
                if (blockA(div.children[1].children[0].children[1])) {
                    blockRoot(div);
                    blockContent(div.querySelector('.content p'));
                }
            });
            element.querySelectorAll('div.reply-quote').forEach(div => {
                const a = div.querySelector('.pubdate a');
                if (blockA(a)) {
                    blockRoot(div);
                    blockContent(div.querySelector('span.short'));
                    blockContentIfNotNull(div.querySelector('span.all'));
                }
            });
            return;
        }
 
        m = url.match(/^\/review\/\d+\/$/);
        if (m) {
            element.querySelectorAll('.main-hd').forEach(header => {
                if (blockA(header.children[0])) {
                    let lr = document.querySelector('#link-report');
                    blockRoot(lr);
                    blockContent(lr.querySelector('.review-content'));
                }
            });
            document.querySelectorAll('div.comment-item').forEach(div => {
                if (blockA(div.children[1].children[0].children[0])) {
                    blockRoot(div);
                    blockContent(div.querySelector('.comment-text'));
                }
            });
            document.querySelectorAll('div.reply-quote').forEach(div => {
                let a = div.querySelector('.pubdate a');
                if (blockA(a)) {
                    div.querySelectorAll('.short, .all').forEach(z => {
                        blockContent(z);
                    });
                    blockRoot(div);
                }
            });
        }
 
        if (window.location.pathname.match(/^\/subject\/\d+\/episode\/\d+\/$/)) {
            console.debug('douban blocker: match single episode discussion');
            // single ep diss page
            element.querySelectorAll('.comment-item').forEach(root => {
                const right = root.querySelector('.bd');
                const userLink = right.children[0].children[0];
                if (blockA(userLink)) {
                    blockRoot(root);
                    blockContent(right.children[1].children[0]);
                }
            });
        }
    }
 
    if (window.location.href.startsWith('https://www.douban.com/people/')) {
        onPeoplePage();
    } else if (window.location.href.startsWith('https://movie.douban.com/')) {
        onMovie(document);
    }
 
    let observer = new MutationObserver(mrs => {
        mrs.forEach(mr => {
            mr.addedNodes.forEach(z => {
                onMovie(z);
            });
        });
    });
    observer.observe(document, {
        childList: true,
        subtree: true
    });
})();
