// ==UserScript==
// @name                Instagram为关注用户添加备注
// @name:en             Instagram - Add notes(aliases/tags) to the user
// @name:zh-CN          Instagram - 为用户添加备注(别名/标签)
// @name:zh-TW          Instagram - 為用戶添加備註(別名/標籤)
// @name:ja             Instagram - ユーザーへのメモの追加（エイリアス/ラベル）
// @name:ko             Instagram - 사용자에게 메모 추가 (별칭/라벨)
// @name:fr             Instagram - ajouter des notes aux utilisateurs (alias/tag)
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://www.sailboatweb.com
// @icon                data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiBhcmlhLWxhYmVsbGVkYnk9Im5ld0ljb25UaXRsZSIgc3Ryb2tlPSJyZ2JhKDI5LDE2MSwyNDIsMS4wMCkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgZmlsbD0ibm9uZSIgY29sb3I9InJnYmEoMjksMTYxLDI0MiwxLjAwKSI+IDx0aXRsZSBpZD0ibmV3SWNvblRpdGxlIj5OZXc8L3RpdGxlPiA8cGF0aCBkPSJNMTkgMTRWMjJIMi45OTk5N1Y0SDEzIi8+IDxwYXRoIGQ9Ik0xNy40NjA4IDQuMDM5MjFDMTguMjQxOCAzLjI1ODE3IDE5LjUwODIgMy4yNTgxNiAyMC4yODkyIDQuMDM5MjFMMjAuOTYwOCA0LjcxMDc5QzIxLjc0MTggNS40OTE4NCAyMS43NDE4IDYuNzU4MTcgMjAuOTYwOCA3LjUzOTIxTDExLjU4NTggMTYuOTE0MkMxMS4yMTA3IDE3LjI4OTMgMTAuNzAyIDE3LjUgMTAuMTcxNiAxNy41TDcuNSAxNy41TDcuNSAxNC44Mjg0QzcuNSAxNC4yOTggNy43MTA3MSAxMy43ODkzIDguMDg1NzkgMTMuNDE0MkwxNy40NjA4IDQuMDM5MjFaIi8+IDxwYXRoIGQ9Ik0xNi4yNSA1LjI1TDE5Ljc1IDguNzUiLz4gPC9zdmc+
// @version             5.2.0
// @description         为用户添加备注(别名/标签)功能，以帮助识别和搜索
// @description:en      Add a note(alias/tag) for users to help identify and search
// @description:zh-CN   为用户添加备注(别名/标签)功能，以帮助识别和搜索
// @description:zh-TW   為用戶添加備註(別名/標籤)功能，以幫助識別和搜尋
// @description:ja      ユーザーが識別と検索に役立つメモ(エイリアス/タグ)機能を追加する
// @description:ko      사용자 식별 및 검색에 도움이되는 메모 (별칭/태그) 기능 추가
// @description:fr      Ajouter une fonction de notes (alias/tag) pour les utilisateurs pour aider à identifier et rechercher
// @license             GNU General Public License v3.0 or later
// @compatible          chrome
// @compatible          firefox
// @author              pana
// @include             http*://*instagram.com/*
// @include             http*://*veryins.com/*
// @include             http*://*inswanghong.xyz/*
// @include             http*://*ins89.com/*
// @require             https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @require             https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js
// @require             https://greasyfork.org/scripts/408454-note-obj/code/Note_Obj.js?version=848809
// @grant               GM_info
// @grant               GM.info
// @grant               GM_getValue
// @grant               GM.getValue
// @grant               GM_setValue
// @grant               GM.setValue
// @grant               GM_deleteValue
// @grant               GM.deleteValue
// @grant               GM_listValues
// @grant               GM.listValues
// @grant               GM_openInTab
// @grant               GM.openInTab
// @grant               GM_registerMenuCommand
// @grant               GM_unregisterMenuCommand
// @grant               GM_addValueChangeListener
// @grant               GM_removeValueChangeListener
// ==/UserScript==

(async function() {
    'use strict';
    const INS_ICON = {
        'NOTE_BLACK': 'url(data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiBhcmlhLWxhYmVsbGVkYnk9Im5ld0ljb25UaXRsZSIgc3Ryb2tlPSJyZ2IoMzgsIDM4LCAzOCkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgZmlsbD0ibm9uZSIgY29sb3I9InJnYigzOCwgMzgsIDM4KSI+IDx0aXRsZSBpZD0ibmV3SWNvblRpdGxlIj5OZXc8L3RpdGxlPiA8cGF0aCBkPSJNMTkgMTRWMjJIMi45OTk5N1Y0SDEzIi8+IDxwYXRoIGQ9Ik0xNy40NjA4IDQuMDM5MjFDMTguMjQxOCAzLjI1ODE3IDE5LjUwODIgMy4yNTgxNiAyMC4yODkyIDQuMDM5MjFMMjAuOTYwOCA0LjcxMDc5QzIxLjc0MTggNS40OTE4NCAyMS43NDE4IDYuNzU4MTcgMjAuOTYwOCA3LjUzOTIxTDExLjU4NTggMTYuOTE0MkMxMS4yMTA3IDE3LjI4OTMgMTAuNzAyIDE3LjUgMTAuMTcxNiAxNy41TDcuNSAxNy41TDcuNSAxNC44Mjg0QzcuNSAxNC4yOTggNy43MTA3MSAxMy43ODkzIDguMDg1NzkgMTMuNDE0MkwxNy40NjA4IDQuMDM5MjFaIi8+IDxwYXRoIGQ9Ik0xNi4yNSA1LjI1TDE5Ljc1IDguNzUiLz4gPC9zdmc+)',
        'SERACH_BLUE': 'url(data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiBhcmlhLWxhYmVsbGVkYnk9InNlYXJjaEljb25UaXRsZSIgc3Ryb2tlPSJyZ2JhKDI5LDE2MSwyNDIsMS4wMCkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgZmlsbD0ibm9uZSIgY29sb3I9InJnYmEoMjksMTYxLDI0MiwxLjAwKSI+IDx0aXRsZSBpZD0ic2VhcmNoSWNvblRpdGxlIj5TZWFyY2g8L3RpdGxlPiA8cGF0aCBkPSJNMTQuNDEyMTEyMiwxNC40MTIxMTIyIEwyMCwyMCIvPiA8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSI2Ii8+IDwvc3ZnPg==)'
    };
    const INS_STYLE = `
        .note-obj-ins-font-blue-color {
            color: #336699;
        }
        .note-obj-ins-background-box {
            display: inline-block;
            align-items: center;
            white-space: nowrap;
            border-radius: 50px;
            padding: 0px 10px;
            background-color: #336699;
            color: #fff;
        }
        .note-obj-ins-add-btn {
            background-image: ${INS_ICON.NOTE_BLACK};
            background-size: 24px;
            background-repeat: no-repeat;
            background-position: center;
            margin-left: 5px;
            cursor: pointer;
            width: 24px;
            height: 24px;
        }
        .note-obj-ins-homepage-btn {
            margin-top: 8px;
        }
        .note-obj-ins-userpage-btn {
            margin-top: 2px;
        }
        .note-obj-ins-userpage-tag {
            display: block;
            font-size: 20px;
            margin-bottom: 20px;
            white-space: nowrap;
        }
        .note-obj-ins-mobile-search-button {
            background-image: ${INS_ICON.SERACH_BLUE};
            background-size: 24px;
            background-repeat: no-repeat;
            background-position: center;
            cursor: pointer;
            min-width: 0px;
            height: 100%;
            flex: 1 1 auto;
        }
        .note-obj-ins-font-bold {
            font-weight: bold;
        }
        .note-obj-veryins-blue-tag {
            background-color: #3c81df;
            color: #fff;
            display: inline-flex;
            align-items: center;
            padding: 0px 10px;
            white-space: nowrap;
            line-height: 100%;
            border-radius: 50px;
            padding: 2px 10px;
        }
        .note-obj-veryins-userpage-btn {
            display: inline-block;
            vertical-align: middle;
        }
    `;
    var selector = {
        'body': 'body',
        'root': '#react-root',
        'search': {
            'frame': '.LWmhU'
        },
        'homepage': {
            'article': 'article',
            'id': '.e1e1d a',
            'id_shell': '.e1e1d',
            'icon': 'span.wmtNn',
            'comment_id': '.FPmhX',
            'comment_at': '._8Pl3R .notranslate'
        },
        'homepage_stories': {
            'id': '.eebAO',
            'id_shell': '.Fd_fQ',
        },
        'homepage_recommend': {
            'id': '.fDxYl a'
        },
        'user_page': {
            'frame': '.zwlfE',
            'id': '.KV-D4',
            'bar': '.AFWDX',
            'box': '.nZSzR',
            'common': 'span._32eiM',
            'suggest': '.Qj3-a',
            'info_at': '.notranslate',
            'user_name': '.-vDIg .rhpdm'
        },
        'stories': {
            'id': '.FPmhX',
            'id_shell': '.yn6BW'
        },
        'watch_list': {
            'initial_item': '.isgrP li',
            'later_item': '.d7ByH',
            'id': 'a.FPmhX'
        },
        'dialog': {
            'frame': '._2dDPU article',
            'comment_id': '.EtaWk .ZIAjV',
            'comment_at': '.EtaWk .notranslate'
        },
        'request': {
            'follow': '.yrJyr'
        },
        'mobile': {
            'bottom_bar': '.BvyAW'
        },
        'suggest': {
            'user': '.FPmhX.notranslate.MBL3Z'
        }
    };
    function instagram_Change_Event(note_obj, user_id = null) {
        for (let article of document.querySelectorAll(selector.homepage.article)) {
            let article_user = article.querySelector(selector.homepage.id);
            if (article_user) {
                let article_user_id = Note_Obj.fn.getUserIdFromLink(article_user.href);
                (! user_id || user_id == article_user_id) && note_obj.handler(article_user_id, article_user, null, {
                    'add': note_obj.getConfig().other.replaceHomepageID ? null : 'span',
                    'classname': note_obj.getConfig().other.replaceHomepageID ? 'note-obj-ins-font-blue-color' : 'note-obj-ins-background-box',
                    'title': note_obj.getConfig().other.replaceHomepageID
                });
            }
            for (let comment of article.querySelectorAll(selector.homepage.comment_id)) {
                let comment_id = Note_Obj.fn.getUserIdFromLink(comment.href);
                (! user_id || user_id == comment_id) && note_obj.handler(comment_id, comment, null, {
                    'classname': 'note-obj-ins-font-blue-color'
                });
            }
            for (let comment_at of article.querySelectorAll(selector.homepage.comment_at)) {
                let comment_at_id = Note_Obj.fn.getUserIdFromLink(comment_at.href);
                (! user_id || user_id == comment_at_id) && note_obj.handler(comment_at_id, comment_at, null, {
                    'symbol': {
                        'prefix': '@'
                    },
                    'title': true,
                    'classname': 'note-obj-ins-font-blue-color'
                });
            }
            for (let pic_comment_user of (article.querySelectorAll(selector.dialog.comment_id))) {
                let pic_comment_id = Note_Obj.fn.getUserIdFromLink(pic_comment_user.href);
                (! user_id || user_id == pic_comment_id) && note_obj.handler(pic_comment_id, pic_comment_user, null, {
                    'title': true,
                    'classname': 'note-obj-ins-font-blue-color'
                });
            }
            for (let pic_comment_at of article.querySelectorAll(selector.dialog.comment_at)) {
                if (! pic_comment_at.classList.contains(selector.homepage.comment_id.replace(/^\.|\s+.*$/g, ''))) {
                    let pic_comment_at_id = Note_Obj.fn.getUserIdFromLink(pic_comment_at.href);
                    (! user_id || user_id == pic_comment_at_id) && note_obj.handler(pic_comment_at_id, pic_comment_at, null, {
                        'symbol': {
                            'prefix': '@'
                        },
                        'title': true,
                        'classname': 'note-obj-ins-font-blue-color'
                    });
                }
            }
        }
        for (let homepage_stories of document.querySelectorAll(selector.homepage_stories.id_shell)) {
            if (homepage_stories.querySelector(selector.homepage_stories.id)) {
                let homepage_stories_id = homepage_stories.querySelector(selector.homepage_stories.id).textContent;
                if (! user_id || user_id == homepage_stories_id) {
                    homepage_stories.title = note_obj.getUserTag(homepage_stories_id);
                }
            }
        }
        for (let homepage_recommend of document.querySelectorAll(selector.homepage_recommend.id)) {
            let homepage_recommend_id = note_obj.getUserIdFromLink(homepage_recommend.href);
            (! user_id || user_id == homepage_recommend_id) && note_obj.handler(homepage_recommend_id, homepage_recommend, null, {
                'classname': 'note-obj-ins-font-blue-color'
            });
        }
        for (let user_page of document.querySelectorAll(selector.user_page.frame)) {
            if (user_page.querySelector(selector.user_page.id)) {
                let user_page_id = user_page.querySelector(selector.user_page.id).textContent;
                if (! user_id || user_id == user_page_id) {
                    let user_page_tag = user_page.querySelector('.note-obj-user-tag');
                    user_page_tag && user_page_tag.remove();
                    note_obj.judgeUsers(user_page_id) && user_page.querySelector(selector.user_page.box).after(note_obj.createNoteTag(user_page_id, {
                        'secondaryColor': false,
                        'offsetWidth': -20
                    }, 'div', ['note-obj-ins-userpage-tag', 'note-obj-ins-font-blue-color', 'note-obj-ins-font-bold']));
                }
            }
            for (let common_user of user_page.querySelectorAll(selector.user_page.common)) {
                let common_user_id = common_user.textContent;
                if (! user_id || user_id == common_user_id) {
                    if (note_obj.judgeUsers(common_user_id)) {
                        common_user.title = note_obj.getUserTag(common_user_id);
                        if (note_obj.getShowNoteColorConfig()) {
                            common_user.style.setProperty('color', note_obj.getPrimaryColor(common_user_id), 'important');
                        } else {
                            common_user.style.setProperty('color', '');
                        }
                        common_user.classList.add('note-obj-ins-font-blue-color');
                    } else {
                        common_user.title = '',
                        common_user.style.setProperty('color', '');
                        common_user.classList.remove('note-obj-ins-font-blue-color');
                    }
                }
            }
            for (let info_at_user of user_page.querySelectorAll(selector.user_page.info_at)) {
                let info_at_user_id = Note_Obj.fn.getUserIdFromLink(info_at_user.href);
                (! user_id || user_id == info_at_user_id) && note_obj.handler(info_at_user_id, info_at_user, null, {
                    'symbol': {
                        'prefix': '@'
                    },
                    'classname': 'note-obj-ins-font-blue-color',
                    'title': true
                });
            }
        }
        for (let stories_shell of document.querySelectorAll(selector.stories.id_shell)) {
            let stories = stories_shell.querySelector(selector.stories.id);
            if (stories) {
                let stories_user_id = Note_Obj.fn.getUserIdFromLink(stories.href);
                (! user_id || user_id == stories_user_id) && note_obj.handler(stories_user_id, stories, null, {
                    'classname': 'note-obj-ins-font-blue-color'
                });
            }
        }
        for (let initial of document.querySelectorAll(selector.watch_list.initial_item)) {
            let initial_item = initial.querySelector(selector.watch_list.id);
            if (initial_item) {
                let initial_item_id = Note_Obj.fn.getUserIdFromLink(initial_item.href);
                (! user_id || user_id == initial_item_id) && note_obj.handler(initial_item_id, initial_item, null, {
                    'classname': 'note-obj-ins-font-blue-color'
                });
            }
        }
        for (let later of document.querySelectorAll(selector.watch_list.later_item)) {
            let later_item = later.querySelector(selector.watch_list.id);
            if (later_item) {
                let later_item_id = Note_Obj.fn.getUserIdFromLink(later_item.href);
                (! user_id || user_id == later_item_id) && note_obj.handler(later_item_id, later_item, null, {
                    'classname': 'note-obj-ins-font-blue-color'
                });
            }
        }
        for (let dialog of document.querySelectorAll(selector.dialog.frame)) {
            let dialog_a = dialog.querySelector(selector.homepage.id);
            if (dialog_a) {
                let dialog_a_id = Note_Obj.fn.getUserIdFromLink(dialog_a.href);
                (! user_id || user_id == dialog_a_id) && note_obj.handler(dialog_a_id, dialog_a, null, {
                    'title': true,
                    'classname': 'note-obj-ins-font-blue-color'
                });
            }
            for (let like of dialog.querySelectorAll(selector.homepage.comment_id)) {
                let like_id = Note_Obj.fn.getUserIdFromLink(like.href);
                (! user_id || user_id == like_id) && note_obj.judgeUsers(like_id) && note_obj.handler(like_id, like, null, {
                    'classname': 'note-obj-ins-font-blue-color'
                });
            }
            for (let comment_user of dialog.querySelectorAll(selector.dialog.comment_id)) {
                let comment_id = Note_Obj.fn.getUserIdFromLink(comment_user.href);
                (! user_id || user_id == comment_id) && note_obj.handler(comment_id, comment_user, null, {
                    'classname': 'note-obj-ins-font-blue-color',
                    'title': true
                });
            }
            for (let comment_at of dialog.querySelectorAll(selector.dialog.comment_at)) {
                let comment_at_id = Note_Obj.fn.getUserIdFromLink(comment_at.href);
                (! user_id || user_id == comment_at_id) && note_obj.handler(comment_at_id, comment_at, null, {
                    'symbol': {
                        'prefix': '@'
                    },
                    'classname': 'note-obj-ins-font-blue-color',
                    'title': true
                });
            }
        }
        for (let follow of document.querySelectorAll(selector.request.follow)) {
            let follow_user_id = Note_Obj.fn.getUserIdFromLink(follow.href);
            (! user_id || user_id == follow_user_id) && note_obj.handler(follow_user_id, follow, null, {
                'classname': 'note-obj-ins-font-blue-color'
            });
        }
        for (let suggest_user of document.querySelectorAll(selector.suggest.user)) {
            let suggest_user_id = Note_Obj.fn.getUserIdFromLink(suggest_user.href);
            (! user_id || user_id == suggest_user_id) && note_obj.handler(suggest_user_id, suggest_user, null, {
                'classname': 'note-obj-ins-font-blue-color'
            });
        }
        for (let suggest of document.querySelectorAll(selector.user_page.suggest)) {
            let suggest_user_id = Note_Obj.fn.getUserIdFromLink(suggest.href);
            (! user_id || user_id == suggest_user_id) && note_obj.handler(suggest_user_id, suggest, null, {
                'classname': 'note-obj-ins-font-blue-color'
            });
        }
    }
    function veryins_Change_Event(note_obj, id = null) {
        document.querySelectorAll('#list .item').forEach(item => {
            let user = item.querySelector('.item-body > div > a');
            if (user) {
                let user_id = Note_Obj.fn.getUserIdFromLink(user.href);
                (! id || id == user_id) && note_obj.handler(user_id, user, null, {
                    'add': 'span',
                    'classname': 'note-obj-veryins-blue-tag'
                });
            }
        });
        document.querySelectorAll('.row.header').forEach(item => {
            let user = item.querySelector('section > div > div');
            if (user) {
                let user_id = user.querySelector('#username') && user.querySelector('#username').textContent;
                (! id || id == user_id) && user.querySelector('div > strong') && note_obj.handler(user_id, user.querySelector('div > strong'), null, {
                    'add': 'span',
                    'classname': 'note-obj-veryins-blue-tag'
                });
            }
        });
        document.querySelectorAll('.img-container .article .caption-header a').forEach(item => {
            let user_id = Note_Obj.fn.getUserIdFromLink(item.href, value => /^[^/]+$/i.test(value));
            (!id || id == user_id) && note_obj.handler(user_id, item, null, {
                'add': 'span',
                'classname': 'note-obj-veryins-blue-tag'
            });
        });
    }
    function inswanghong_Change_Event(note_obj, id = null) {
        document.querySelectorAll('#tiles .info').forEach(item => {
            let user_id = item.title || item.textContent;
            (! id || id == user_id) && note_obj.handler(user_id, item, null, {
                'title': true,
                'classname': 'note-obj-ins-font-blue-color'
            });
        });
    }
    function ins89_Change_Event(note_obj, id = null) {
        document.querySelectorAll('.container .row.pt-2 .card').forEach(item => {
            let card_header_user = item.querySelector('.card-header .username');
            if (card_header_user) {
                let card_header_user_id = Note_Obj.fn.getUserIdFromLink(card_header_user.href);
                (! id || id == card_header_user_id) && note_obj.handler(card_header_user_id, card_header_user, null, {
                    'title': true
                });
                let card_body_user = item.querySelector('.card-body .username');
                if (card_body_user) {
                    (! id || id == card_header_user_id) && note_obj.handler(card_header_user_id, card_body_user, null, {
                        'title': true
                    });
                }
            }
        });
        document.querySelectorAll('.profile-info-pannel .container').forEach(item => {
            let profile_avatar = item.querySelector('.profile-avatar a');
            if (profile_avatar) {
                let user_id = Note_Obj.fn.getUserIdFromLink(profile_avatar.href);
                if (! id || id == user_id) {
                    let username_bar = item.querySelector('.username-bar h1');
                    username_bar && note_obj.handler(user_id, username_bar, null, {
                        'title': true
                    });
                }
            }
        });
        document.querySelectorAll('.postComponent .card .status-username .username .username-link').forEach(item => {
            let user_id = item.textContent;
            (! id || id == user_id) && note_obj.handler(user_id, item, null);
        });
        document.querySelectorAll('.modal-content .blogger-list .concern .concern-box').forEach(item => {
            let user_a = item.querySelector('a');
            if (user_a) {
                let user_id = Note_Obj.fn.getUserIdFromLink(user_a.href);
                let concern_text = item.querySelector('.concern-text .text-name');
                concern_text && (! id || id == user_id) && note_obj.handler(user_id, concern_text, null);
            }
        });
    }
    function instagram_Homepage_Event(newValue, oldValue) {
        if (newValue != oldValue) {
            for (let article of document.querySelectorAll(selector.homepage.article)) {
                let article_user = article.querySelector(selector.homepage.id);
                if (article_user) {
                    let article_user_id = Note_Obj.fn.getUserIdFromLink(article_user.href);
                    note_obj.handler(article_user_id, article_user, null, {
                        'add': oldValue ? null : 'span',
                        'classname': oldValue ? 'note-obj-ins-font-blue-color' : 'note-obj-ins-background-box',
                        'title': oldValue,
                        'restore': true
                    });
                    note_obj.handler(article_user_id, article_user, null, {
                        'add': newValue ? null : 'span',
                        'classname': newValue ? 'note-obj-ins-font-blue-color' : 'note-obj-ins-background-box',
                        'title': newValue
                    });
                } 
            }
        }
    }
    function init_Instagram(note_obj) {
        let arrive_option = {
            'fireOnAttributesModification': true,
            'existing': true
        };
        Note_Obj.fn.isMobilePage() && document.querySelector(selector.root).arrive(selector.mobile.bottom_bar, arrive_option, item => item.appendChild(note_obj.createSearchButton('note-obj-ins-mobile-search-button')));
        document.querySelector(selector.root).arrive(selector.homepage.article, arrive_option, article => {
            let article_user = article.querySelector(selector.homepage.id);
            if (article_user) {
                let article_user_id = Note_Obj.fn.getUserIdFromLink(article_user.href);
                note_obj.judgeUsers(article_user_id) && note_obj.handler(article_user_id, article_user, null, {
                    'add': note_obj.getConfig().other.replaceHomepageID ? null : 'span',
                    'classname': note_obj.getConfig().other.replaceHomepageID ? 'note-obj-ins-font-blue-color' : 'note-obj-ins-background-box',
                    'title': note_obj.getConfig().other.replaceHomepageID
                });
                article.querySelector(selector.homepage.icon) && article.querySelector(selector.homepage.icon).insertAdjacentElement('beforebegin', note_obj.createNoteBtn(article_user_id, null, ['note-obj-ins-add-btn', 'note-obj-ins-homepage-btn']));
            }
            for (let comment of article.querySelectorAll(selector.homepage.comment_id)) {
                let comment_id = Note_Obj.fn.getUserIdFromLink(comment.href);
                note_obj.judgeUsers(comment_id) && note_obj.handler(comment_id, comment, null, {
                    'classname': 'note-obj-ins-font-blue-color'
                });
            }
            article.arrive(selector.homepage.comment_at, arrive_option, comment_at => {
                let comment_at_id = Note_Obj.fn.getUserIdFromLink(comment_at.href);
                note_obj.judgeUsers(comment_at_id) && note_obj.handler(comment_at_id, comment_at, null, {
                    'symbol': {
                        'prefix': '@'
                    },
                    'title': true,
                    'classname': 'note-obj-ins-font-blue-color'
                });
            });
            article.arrive(selector.dialog.comment_id, arrive_option, pic_comment_user => {
                let pic_comment_id = Note_Obj.fn.getUserIdFromLink(pic_comment_user.href);
                note_obj.judgeUsers(pic_comment_id) && note_obj.handler(pic_comment_id, pic_comment_user, null, {
                    'title': true,
                    'classname': 'note-obj-ins-font-blue-color'
                });
            });
            article.arrive(selector.dialog.comment_at, arrive_option, pic_comment_at => {
                if (! pic_comment_at.classList.contains(selector.homepage.comment_id.replace(/^\.|\s+.*$/g, ''))) {
                    let pic_comment_at_id = Note_Obj.fn.getUserIdFromLink(pic_comment_at.href);
                    note_obj.judgeUsers(pic_comment_at_id) && note_obj.handler(pic_comment_at_id, pic_comment_at, null, {
                        'symbol': {
                            'prefix': '@'
                        },
                        'title': true,
                        'classname': 'note-obj-ins-font-blue-color'
                    });
                }
            });
        });
        document.querySelector(selector.root).arrive(selector.homepage_stories.id_shell, arrive_option, homepage_stories => {
            if (homepage_stories.querySelector(selector.homepage_stories.id)) {
                let homepage_stories_id = homepage_stories.querySelector(selector.homepage_stories.id).textContent;
                if (note_obj.judgeUsers(homepage_stories_id)) {
                    homepage_stories.title = note_obj.getUserTag(homepage_stories_id);
                }
            }
        });
        document.querySelector(selector.root).arrive(selector.homepage_recommend.id, arrive_option, homepage_recommend => {
            let homepage_recommend_id = note_obj.getUserIdFromLink(homepage_recommend.href);
            note_obj.judgeUsers(homepage_recommend_id) && note_obj.handler(homepage_recommend_id, homepage_recommend, null, {
                'classname': 'note-obj-ins-font-blue-color'
            });
        });
        document.querySelector(selector.root).arrive(selector.user_page.frame, arrive_option, user_page => {
            if (user_page.querySelector(selector.user_page.id)) {
                let user_page_id = user_page.querySelector(selector.user_page.id).textContent;
                let user_name = user_page.querySelector(selector.user_page.user_name);
                let user_name_text = '';
                if (user_name) {
                    user_name_text = user_page.querySelector(selector.user_page.user_name).textContent;
                }
                user_page.querySelector(selector.user_page.bar) && user_page.querySelector(selector.user_page.bar).after(note_obj.createNoteBtn(user_page_id, user_name_text, ['note-obj-ins-add-btn', 'note-obj-ins-userpage-btn']));
                note_obj.judgeUsers(user_page_id) && user_page.querySelector(selector.user_page.box).after(note_obj.createNoteTag(user_page_id, {
                    'secondaryColor': false,
                    'offsetWidth': -20
                }, 'div', ['note-obj-ins-userpage-tag', 'note-obj-ins-font-blue-color', 'note-obj-ins-font-bold'], user_name_text));
            }
            for (let common_user of user_page.querySelectorAll(selector.user_page.common)) {
                let common_user_id = common_user.textContent;
                if (note_obj.judgeUsers(common_user_id)) {
                    common_user.title = note_obj.getUserTag(common_user_id);
                    note_obj.getShowNoteColorConfig() && common_user.style.setProperty('color', note_obj.getPrimaryColor(common_user_id), 'important');
                    common_user.classList.add('note-obj-ins-font-blue-color');
                }
            }
            for (let info_at_user of user_page.querySelectorAll(selector.user_page.info_at)) {
                let info_at_user_id = Note_Obj.fn.getUserIdFromLink(info_at_user.href);
                note_obj.judgeUsers(info_at_user_id) && note_obj.handler(info_at_user_id, info_at_user, null, {
                    'symbol': {
                        'prefix': '@'
                    },
                    'classname': 'note-obj-ins-font-blue-color',
                    'title': true
                });
            }
        });
        document.querySelector(selector.root).arrive(selector.stories.id_shell, arrive_option, stories_shell => {
            let stories = stories_shell.querySelector(selector.stories.id);
            if (stories) {
                let stories_user_id = Note_Obj.fn.getUserIdFromLink(stories.href);
                note_obj.judgeUsers(stories_user_id) && note_obj.handler(stories_user_id, stories, null, {
                    'classname': 'note-obj-ins-font-blue-color'
                });
            }
        });
        document.querySelector(selector.body).arrive(selector.watch_list.initial_item, arrive_option, initial => {
            let initial_item = initial.querySelector(selector.watch_list.id);
            if (initial_item) {
                let initial_item_id = Note_Obj.fn.getUserIdFromLink(initial_item.href);
                note_obj.judgeUsers(initial_item_id) && note_obj.handler(initial_item_id, initial_item, null, {
                    'classname': 'note-obj-ins-font-blue-color'
                });
            }
        });
        document.querySelector(selector.body).arrive(selector.watch_list.later_item, arrive_option, later => {
            let later_item = later.querySelector(selector.watch_list.id);
            if (later_item) {
                let later_item_id = Note_Obj.fn.getUserIdFromLink(later_item.href);
                note_obj.judgeUsers(later_item_id) && note_obj.handler(later_item_id, later_item, null, {
                    'classname': 'note-obj-ins-font-blue-color'
                });
            }
        });
        document.querySelector(selector.body).arrive(selector.dialog.frame, arrive_option, dialog => {
            let dialog_a = dialog.querySelector(selector.homepage.id);
            if (dialog_a) {
                let dialog_a_id = Note_Obj.fn.getUserIdFromLink(dialog_a.href);
                note_obj.judgeUsers(dialog_a_id) && note_obj.handler(dialog_a_id, dialog_a, null, {
                    'title': true,
                    'classname': 'note-obj-ins-font-blue-color'
                });
                dialog.querySelector(selector.homepage.icon) && dialog.querySelector(selector.homepage.icon).insertAdjacentElement('beforebegin', note_obj.createNoteBtn(dialog_a_id, null, ['note-obj-ins-add-btn', 'note-obj-ins-homepage-btn']));
            }
            for (let like of dialog.querySelectorAll(selector.homepage.comment_id)) {
                let like_id = Note_Obj.fn.getUserIdFromLink(like.href);
                note_obj.judgeUsers(like_id) && note_obj.handler(like_id, like, null, {
                    'classname': 'note-obj-ins-font-blue-color'
                });
            }
            dialog.arrive(selector.dialog.comment_id, arrive_option, comment_user => {
                let comment_id = Note_Obj.fn.getUserIdFromLink(comment_user.href);
                note_obj.judgeUsers(comment_id) && note_obj.handler(comment_id, comment_user, null, {
                    'classname': 'note-obj-ins-font-blue-color',
                    'title': true
                });
            });
            dialog.arrive(selector.dialog.comment_at, arrive_option, comment_at => {
                let comment_at_id = Note_Obj.fn.getUserIdFromLink(comment_at.href);
                note_obj.judgeUsers(comment_at_id) && note_obj.handler(comment_at_id, comment_at, null, {
                    'symbol': {
                        'prefix': '@'
                    },
                    'classname': 'note-obj-ins-font-blue-color',
                    'title': true
                });
            });
        });
        document.querySelector(selector.root).arrive(selector.request.follow, arrive_option, follow => {
            let follow_user_id = Note_Obj.fn.getUserIdFromLink(follow.href);
            note_obj.judgeUsers(follow_user_id) && note_obj.handler(follow_user_id, follow, null, {
                'classname': 'note-obj-ins-font-blue-color'
            });
        });
        document.querySelector(selector.root).arrive(selector.suggest.user, arrive_option, suggest_user => {
            let suggest_user_id = Note_Obj.fn.getUserIdFromLink(suggest_user.href);
            note_obj.judgeUsers(suggest_user_id) && note_obj.handler(suggest_user_id, suggest_user, null, {
                'classname': 'note-obj-ins-font-blue-color'
            });
        });
        document.querySelector(selector.root).arrive(selector.user_page.suggest, arrive_option, suggest => {
            let suggest_user_id = Note_Obj.fn.getUserIdFromLink(suggest.href);
            note_obj.judgeUsers(suggest_user_id) && note_obj.handler(suggest_user_id, suggest, null, {
                'classname': 'note-obj-ins-font-blue-color'
            });
        });
    }
    function init_Veryins(note_obj) {
        let arrive_option = {
            'fireOnAttributesModification': true,
            'existing': true
        };
        document.getElementById('list') && document.getElementById('list').arrive('.item', arrive_option, item => {
            let user = item.querySelector('.item-body > div > a');
            if (user) {
                let user_id = Note_Obj.fn.getUserIdFromLink(user.href);
                note_obj.judgeUsers(user_id) && note_obj.handler(user_id, user, null, {
                    'add': 'span',
                    'classname': 'note-obj-veryins-blue-tag'
                }, user.textContent);
            }
        });
        document.querySelectorAll('.row.header').forEach(item => {
            let user = item.querySelector('section > div > div');
            if (user) {
                let user_id = user.querySelector('#username') && user.querySelector('#username').textContent;
                let user_name = user.querySelector('#username') && user.querySelector('#username').dataset.fullname;
                user.querySelector('div > strong') && note_obj.judgeUsers(user_id) && note_obj.handler(user_id, user.querySelector('div > strong'), null, {
                    'add': 'span',
                    'classname': 'note-obj-veryins-blue-tag'
                }, user_name);
                user.querySelector('#similar') && user.querySelector('#similar').after(note_obj.createNoteBtn(user_id, user_name, ['note-obj-ins-add-btn', 'note-obj-veryins-userpage-btn']));
            }
        });
        document.querySelector('.img-container .article .caption-header') && document.querySelector('.img-container .article .caption-header').arrive('a', arrive_option, item => {
            let user_id = Note_Obj.fn.getUserIdFromLink(item.href, value => /^[^/]+$/i.test(value));
            note_obj.judgeUsers(user_id) && note_obj.handler(user_id, item, null, {
                'add': 'span',
                'classname': 'note-obj-veryins-blue-tag'
            }, item.textContent);
        });
    }
    function init_Inswanghong(note_obj) {
        document.querySelectorAll('#tiles .info').forEach(item => {
            let user_id = item.textContent;
            note_obj.judgeUsers(user_id) && note_obj.handler(user_id, item, null, {
                'title': true,
                'classname': 'note-obj-ins-font-blue-color'
            });
        });
    }
    function init_Ins89(note_obj) {
        let arrive_option = {
            'fireOnAttributesModification': true,
            'existing': true
        };
        document.querySelector('.container .row.pt-2') && document.querySelector('.container .row.pt-2').arrive('.card', arrive_option, item => {
            let card_header_user = item.querySelector('.card-header .username');
            if (card_header_user) {
                let card_header_user_id = Note_Obj.fn.getUserIdFromLink(card_header_user.href);
                note_obj.judgeUsers(card_header_user_id) && note_obj.handler(card_header_user_id, card_header_user, null, {
                    'title': true
                });
                let card_body_user = item.querySelector('.card-body .username');
                if (card_body_user) {
                    note_obj.judgeUsers(card_header_user_id) && note_obj.handler(card_header_user_id, card_body_user, null, {
                        'title': true
                    });
                }
            }
        });
        document.querySelectorAll('.profile-info-pannel .container').forEach(item => {
            let profile_avatar = item.querySelector('.profile-avatar a');
            if (profile_avatar) {
                let user_id = Note_Obj.fn.getUserIdFromLink(profile_avatar.href);
                if (note_obj.judgeUsers(user_id)) {
                    let username_bar = item.querySelector('.username-bar h1');
                    username_bar && note_obj.handler(user_id, username_bar, null, {
                        'title': true
                    });
                }
                let fa_ellipsis_h = item.querySelector('.fa-ellipsis-h');
                fa_ellipsis_h && fa_ellipsis_h.after(note_obj.createNoteBtn(user_id, null, ['note-obj-ins-add-btn', 'note-obj-veryins-userpage-btn']));
            }
        });
        document.querySelectorAll('.postComponent .card .status-username .username .username-link').forEach(item => {
            let user_id = item.textContent;
            note_obj.judgeUsers(user_id) && note_obj.handler(user_id, item, null);
        });
        document.querySelector('.modal-content .blogger-list') && document.querySelector('.modal-content .blogger-list').arrive('.concern .concern-box', arrive_option, item => {
            let user_a = item.querySelector('a');
            if (user_a) {
                let user_id = Note_Obj.fn.getUserIdFromLink(user_a.href);
                let concern_text = item.querySelector('.concern-text .text-name');
                concern_text && note_obj.judgeUsers(user_id) && note_obj.handler(user_id, concern_text, null);
            }
        });
    }
    var cur_url = location.hostname;
    let note_obj = new Note_Obj('myInstagramNote');
    await note_obj.init({
        'style': INS_STYLE,
        'changeEvent': (cur_url.includes('instagram.com') && instagram_Change_Event) || (cur_url.includes('veryins.com') && veryins_Change_Event) || (cur_url.includes('inswanghong.xyz') && inswanghong_Change_Event) || (cur_url.includes('ins89.com') && ins89_Change_Event),
        'script': {
            'author': {
                'name': 'pana',
                'homepage': 'https://www.sailboatweb.com/'
            },
            'address': 'https://greasyfork.org/scripts/387871',
            'updated': '2020-9-17',
            'library': [
                {
                    'name': 'arrive.js',
                    'version': '2.4.1',
                    'url': 'https://github.com/uzairfarooq/arrive'
                }
            ]
        },
        'itemClick': cur_url.includes('inswanghong.xyz') ? (key => 'https://veryins.com/' + key) : null,
        'primaryColor': '#336699',
        'settings': {
            'replaceHomepageID': {
                'type': 'checkbox',
                'lang': {
                    'en': 'Allow to replace the user ID on the instagram homepage',
                    'zh_cn': '允许替换 Instagram 首页上的用户 ID',
                    'zh_tw': '允許替換 Instagram 首頁上的用戶 ID',
                    'ja': 'Instagram ホームページのユーザーIDの置き換えを許可する',
                    'ko': 'Instagram 첫 페이지에 있는 사용자 ID 바꾸기 허용',
                    'fr': 'Permettre de remplacer l\'ID utilisateur sur la page d\'accueil Instagram'
                },
                'default': true,
                'event': cur_url.includes('instagram.com') ? instagram_Homepage_Event : null
            }
        }
    });
    if (cur_url.includes('instagram.com')) {
        init_Instagram(note_obj);
    } else if (cur_url.includes('veryins.com')) {
        init_Veryins(note_obj);
    } else if (cur_url.includes('inswanghong.xyz')) {
        init_Inswanghong(note_obj);
    } else if (cur_url.includes('ins89.com')) {
        init_Ins89(note_obj);
    }
})();
