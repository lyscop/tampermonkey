// ==UserScript==
// @name                oneClickDeleteInstagramPost
// @name:en             oneClickDeleteInstagramPost
// @name:ja             oneClickDeleteInstagramPost
// @name:zh-CN          oneClickDeleteInstagramPost 一键删除 Instagram 帖子
// @name:zh-TW          oneClickDeleteInstagramPost 一鍵刪除 Instagram 帖子
// @namespace           https://github.com/catscarlet/oneClickDeleteInstagramPost
// @description         Add [Delete] button on the post in Personal Page on Instagram. Directly delete post without confirm.
// @description:en      Add a [Delete] button to the Personal Page on Instagram. Directly delete post without confirm.
// @description:ja      Instagramの個人ページの投稿に[削除]ボタンを追加してください。 確認なしで投稿を直接削除します。
// @description:zh-CN   在 Instagram 的个人页面的图片上添加 [Delete] 按钮，点击直接删除图片，不再有确认提示框
// @description:zh-TW   在 Instagram 的個人頁面的圖片上添加 [Delete] 按鈕，點擊直接刪除图片，不再有確認提示框
// @version             1.0.5
// @author              catscarlet
// @license             MIT License
// @match               *://www.instagram.com/*
// @require             https://cdn.jsdelivr.net/npm/bignumber.js@2.4.0/bignumber.min.js
// @run-at              document-end
// @grant               none
// ==/UserScript==

(function() {
    'use strict';

    let safe_lock = 1; //Set this to 0 to unlock the 'Delete this' button.
    let show_alt = 0; //Hide alt by default. Set this to 1 to show alt of images.

    let rmap = {
        '0': 'Q',
        '1': 'R',
        '2': 'S',
        '3': 'T',
        '4': 'U',
        '5': 'V',
        '6': 'W',
        '7': 'X',
        '8': 'Y',
        '9': 'Z',
        '-': '$',
        'A': '0',
        'B': '1',
        'C': '2',
        'D': '3',
        'E': '4',
        'F': '5',
        'G': '6',
        'H': '7',
        'I': '8',
        'J': '9',
        'K': 'a',
        'L': 'b',
        'M': 'c',
        'N': 'd',
        'O': 'e',
        'P': 'f',
        'Q': 'g',
        'R': 'h',
        'S': 'i',
        'T': 'j',
        'U': 'k',
        'V': 'l',
        'W': 'm',
        'X': 'n',
        'Y': 'o',
        'Z': 'p',
        'a': 'q',
        'b': 'r',
        'c': 's',
        'd': 't',
        'e': 'u',
        'f': 'v',
        'g': 'w',
        'h': 'x',
        'i': 'y',
        'j': 'z',
        'k': 'A',
        'l': 'B',
        'm': 'C',
        'n': 'D',
        'o': 'E',
        'p': 'F',
        'q': 'G',
        'r': 'H',
        's': 'I',
        't': 'J',
        'u': 'K',
        'v': 'L',
        'w': 'M',
        'x': 'N',
        'y': 'O',
        'z': 'P',
        '_': '_',
    };

    let article = document.getElementsByTagName('article');
    let old_path = '';
    let new_path = '';
    let temp_lock = 0;

    historyPushStateMonitor(window.history);
    historyOnpushstate();

    history.onpushstate = function(e) {
        goPendingUrl();
    };

    window.onpopstate = function(event) {
        goPendingUrl();
    };

    function historyPushStateMonitor(history) {
        let pushState = history.pushState;
        history.pushState = function(state) {
            old_path = location.pathname.toString();

            if (typeof history.onpushstate == 'function') {
                history.onpushstate({state: state});
            }

            return pushState.apply(history, arguments);
        };
    }

    function goPendingUrl() {
        new_path = location.pathname.toString();

        if (old_path == new_path) {
            setTimeout(goPendingUrl, 1000);
        } else {
            historyOnpushstate();
        }
    }

    function historyOnpushstate() {
        pending();
    }

    function pending() {
        if (!article.length || !article[0].children[0].childElementCount || !article[0].children[0].children[0].childElementCount) {
            setTimeout(pending, 500);
        } else {
            ob();
            getPost();
        }
    }

    function ob() {
        let articles = document.getElementsByTagName('article')[0].children[0].children[0];

        let observerOptions = {
            childList: true,
            attributes: true,
            subtree: true,
        };

        let observer = new MutationObserver(getPost);

        observer.observe(articles, observerOptions);
    }

    function getPost() {
        let articles = document.getElementsByTagName('article')[0].children[0].children[0];
        let own_it = pageOwnerCheck();

        for (let articlesline of articles.children) {
            for (let post of articlesline.children) {
                let link = post.children[0];
                if (!link) {
                    return false;
                }
                if (link.hasAttribute('alte')) {
                    continue;
                }

                let url = link.href;
                let urlSegment = GetUrlSegmentByUrl(url);
                if (!urlSegment) {
                    continue;
                }
                let block = link.children[0];
                let img = block.children[0].children[0];
                let alt = img.alt;

                let btn_div = document.createElement('div');
                let media_id = getMediaIdByUrlSegment(urlSegment);

                let btn = document.createElement('button');
                btn.innerHTML = 'delete this';
                btn.style.margin = '0.5em';
                btn.style.backgroundColor  = 'darksalmon';
                btn.onclick = function() {
                    deleteByMediaId(media_id, btn, post);
                };

                if (own_it) {
                    if (safe_lock) {
                        btn.disabled = true;
                        btn.title = 'Safe_lock is ON! You need to edit the script and change the "safe_lock" to 0 in order to delete your post without confirm.';
                    }
                    btn_div.appendChild(btn);
                    post.appendChild(btn_div);
                }

                let alt_div = document.createElement('div');
                let alt_div_style = 'word-break: break-word;';
                if (!show_alt) {
                    alt_div_style += 'display: none;';
                }
                alt_div.innerHTML = '<span style="' + alt_div_style + '">' + alt + '</span>';
                post.appendChild(alt_div);

                link.setAttribute('alte', 1);
            }
        }
    };

    function GetUrlSegmentByUrl(url) {
        let regexp = /https:\/\/www.instagram.com\/p\/(\S+)\/(\?taken-by=\S+)?/;
        let result = url.match(regexp);
        if (result) {
            return result[1];
        } else {
            return false;
        }
    }

    function getMediaIdByUrlSegment(urlSegment) {
        let id = '';
        for (let i in urlSegment) {
            let char = urlSegment[i];
            let value = rmap[char];
            id += value;
        }

        let media_id = (new BigNumber(id, 64)).toString(10);
        return media_id;
    }

    function deleteByMediaId(media_id, btn, post) {
        btn.innerHTML = 'deleting';
        btn.style.backgroundColor  = 'yellow';
        btn.onclick = false;
        btn.disabled = true;

        let url = 'https://www.instagram.com/create/' + media_id + '/delete/';

        let xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', url, true);
        xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlhttp.setRequestHeader('x-csrftoken', window._sharedData.config.csrf_token);
        xmlhttp.send(null);

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    let rst = JSON.parse(xmlhttp.response);
                    if (rst.did_delete) {
                        post.style.visibility = 'hidden';
                    } else {
                        btn.innerHTML = 'Failed';
                    }
                } else {
                    btn.innerHTML = 'Failed';
                }
            }
        };
    }

    function pageOwnerCheck() {
        let not_own_it = 0;
        let match_regex = /https:\/\/www.instagram.com\/([^\/]+)\/$/;
        let href = location.href;

        let array1 = match_regex.exec(href);
        if (array1 !== null) {
            if (array1[1] == 'explore') {
                not_own_it++;
            }
        }

        if (document.getElementsByClassName('fx7hk').length && document.getElementsByClassName('fx7hk')[0].childElementCount == 2) {
            not_own_it += 2;
        }

        return !not_own_it;
    };
})();
