// ==UserScript==
// @name                Greasyfork - Add notes to the script
// @name:en             Greasyfork - Add notes(aliases/tags) to the script
// @name:zh-CN          Greasyfork - 为脚本添加备注(别名/标签)
// @name:zh-TW          Greasyfork - 為腳本新增備註(別名/標籤)
// @name:ja             Greasyfork - スクリプトにメモを追加する(エイリアス/タグ)
// @name:ko             Greasyfork - 스크립트에 메모 추가 (별칭/태그)
// @name:fr             Greasyfork - Ajouter des notes (alias/tag) au script
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://www.sailboatweb.com
// @icon                data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiBhcmlhLWxhYmVsbGVkYnk9Im5ld0ljb25UaXRsZSIgc3Ryb2tlPSJyZ2JhKDI5LDE2MSwyNDIsMS4wMCkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgZmlsbD0ibm9uZSIgY29sb3I9InJnYmEoMjksMTYxLDI0MiwxLjAwKSI+IDx0aXRsZSBpZD0ibmV3SWNvblRpdGxlIj5OZXc8L3RpdGxlPiA8cGF0aCBkPSJNMTkgMTRWMjJIMi45OTk5N1Y0SDEzIi8+IDxwYXRoIGQ9Ik0xNy40NjA4IDQuMDM5MjFDMTguMjQxOCAzLjI1ODE3IDE5LjUwODIgMy4yNTgxNiAyMC4yODkyIDQuMDM5MjFMMjAuOTYwOCA0LjcxMDc5QzIxLjc0MTggNS40OTE4NCAyMS43NDE4IDYuNzU4MTcgMjAuOTYwOCA3LjUzOTIxTDExLjU4NTggMTYuOTE0MkMxMS4yMTA3IDE3LjI4OTMgMTAuNzAyIDE3LjUgMTAuMTcxNiAxNy41TDcuNSAxNy41TDcuNSAxNC44Mjg0QzcuNSAxNC4yOTggNy43MTA3MSAxMy43ODkzIDguMDg1NzkgMTMuNDE0MkwxNy40NjA4IDQuMDM5MjFaIi8+IDxwYXRoIGQ9Ik0xNi4yNSA1LjI1TDE5Ljc1IDguNzUiLz4gPC9zdmc+
// @version             2.1.0
// @description         Add a note(alias/tag) for scripts to help identify and search
// @description:en      Add a note(alias/tag) for scripts to help identify and search
// @description:zh-CN   为脚本添加备注(别名/标签)功能，以帮助识别和搜索
// @description:zh-TW   為腳本新增備註(別名/標籤)功能，以幫助識別和搜尋
// @description:ja      識別と検索に役立つコメント(エイリアス/タグ)関数をスクリプトに追加
// @description:ko      식별 및 검색을 돕기 위해 스크립트에 주석 (별칭/태그) 기능 추가
// @description:fr      Ajouter une fonction de commentaire (alias/tag) au script pour aider à identifier et rechercher
// @author              pana
// @license             GNU General Public License v3.0 or later
// @compatible          chrome
// @compatible          firefox
// @include             http*://*greasyfork.org/*
// @include             http*://*sleazyfork.org/*
// @require             https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js
// @require             https://greasyfork.org/scripts/408454-note-obj/code/Note_Obj.js?version=848152
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
    const GF_ICON = {
        'NOTE_BLACK': 'url(data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiBhcmlhLWxhYmVsbGVkYnk9Im5ld0ljb25UaXRsZSIgc3Ryb2tlPSJyZ2IoMzgsIDM4LCAzOCkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgZmlsbD0ibm9uZSIgY29sb3I9InJnYigzOCwgMzgsIDM4KSI+IDx0aXRsZSBpZD0ibmV3SWNvblRpdGxlIj5OZXc8L3RpdGxlPiA8cGF0aCBkPSJNMTkgMTRWMjJIMi45OTk5N1Y0SDEzIi8+IDxwYXRoIGQ9Ik0xNy40NjA4IDQuMDM5MjFDMTguMjQxOCAzLjI1ODE3IDE5LjUwODIgMy4yNTgxNiAyMC4yODkyIDQuMDM5MjFMMjAuOTYwOCA0LjcxMDc5QzIxLjc0MTggNS40OTE4NCAyMS43NDE4IDYuNzU4MTcgMjAuOTYwOCA3LjUzOTIxTDExLjU4NTggMTYuOTE0MkMxMS4yMTA3IDE3LjI4OTMgMTAuNzAyIDE3LjUgMTAuMTcxNiAxNy41TDcuNSAxNy41TDcuNSAxNC44Mjg0QzcuNSAxNC4yOTggNy43MTA3MSAxMy43ODkzIDguMDg1NzkgMTMuNDE0MkwxNy40NjA4IDQuMDM5MjFaIi8+IDxwYXRoIGQ9Ik0xNi4yNSA1LjI1TDE5Ljc1IDguNzUiLz4gPC9zdmc+)'
    };
    const GF_STYLE = `
        .note-obj-gf-note-btn {
            background-image: ${GF_ICON.NOTE_BLACK};
            background-repeat: no-repeat;
            background-position: center;
            cursor: pointer;
            vertical-align: top;
        }
        .note-obj-gf-info-note-btn {
            background-size: 32px auto;
            width: 32px;
            height: 32px;
            margin-left: 20px;
            display: inline-block;
        }
        .note-obj-gf-library-note-btn {
            background-size: 24px auto;
            width: 24px;
            height: 24px;
            margin-left: 20px;
            display: inline-block;
        }
        .note-obj-gf-list-note-btn {
            background-size: 24px auto;
            width: 24px;
            height: 24px;
            margin-left: 10px;
            display: none;
        }
        .note-obj-gf-ts-note-btn {
            background-size: 16px auto;
            width: 16px;
            height: 16px;
            margin-left: 10px;
            display: none;
            vertical-align: sub;
        }
        ol.script-list li:hover .note-obj-gf-list-note-btn,
        #script-table tbody tr:hover .note-obj-gf-ts-note-btn {
            display: inline-block;
        }
        .note-obj-gf-note-tag,
        .note-obj-gf-ts-note-tag {
            background-color: #3c81df;
            color: #fff;
            display: inline-block;
            align-items: center;
            white-space: nowrap;
            border-radius: 50px;
            padding: 1px 10px;
            line-height: 1em;
        }
        .note-obj-gf-list-note-tag {
            text-decoration: none;
        }
    `;
    function change_Event(note_obj, id = null) {
        let pathname = location.pathname;
        if (/^\/[\w-]+\/scripts\/\d+-/i.test(pathname)) {
            let script_id = /^\/[\w-]+\/scripts\/(\d+)-/i.exec(pathname)[1];
            let ele = document.querySelector('#script-info h2');
            ele && (! id || id == script_id) && note_obj.handler(script_id, ele, null, {
                'add': 'span',
                'class': 'note-obj-gf-note-tag'
            });
        } else if (/^\/[\w-]+\/scripts/i.test(pathname) || /^\/[\w-]+\/users\/\d+/i.test(pathname)) {
            let browse_list = document.querySelectorAll('ol.script-list li');
            for (let ele of browse_list) {
                let script_id = ele.getAttribute('data-script-id');
                if (script_id) {
                    let header = ele.querySelector('article > h2 > a');
                    header && (! id || id == script_id) && note_obj.handler(script_id, header, null, {
                        'add': 'span',
                        'class': ['note-obj-gf-note-tag', 'note-obj-gf-list-note-tag']
                    });
                }
            }
            document.querySelectorAll('#script-table tbody tr').forEach(item => {
                let script_title = item.querySelector('.thetitle a');
                if (script_title) {
                    let script_id = script_title.href.match(/\d+$/) && script_title.href.match(/\d+$/)[0];
                    (! id || id == script_id) && note_obj.handler(script_id, script_title, null, {
                        'add': 'span',
                        'class': 'note-obj-gf-ts-note-tag'
                    });
                }
            });
        }
    }
    function init_Script(note_obj) {
        let browse_list = document.querySelectorAll('ol.script-list li');
        for (let ele of browse_list) {
            let script_id = ele.getAttribute('data-script-id');
            if (script_id) {
                let description = ele.querySelector('.description');
                let script_name = (ele.querySelector('article > h2 > a') && ele.querySelector('article > h2 > a').textContent) || '';
                description && ! description.parentNode.querySelector('.note-obj-add-note-btn') && description.before(note_obj.createNoteBtn(script_id, script_name, ['note-obj-gf-note-btn', 'note-obj-gf-list-note-btn']));
                let header = ele.querySelector('article > h2 > a');
                header && note_obj.judgeUsers(script_id) && note_obj.handler(script_id, header, null, {
                    'add': 'span',
                    'class': ['note-obj-gf-note-tag', 'note-obj-gf-list-note-tag']
                }, script_name);
            }
        }
    }
    function init_TS(note_obj) {
        document.querySelectorAll('#script-table tbody tr').forEach(item => {
            let script_title = item.querySelector('.thetitle a');
            if (script_title) {
                let script_id = script_title.href.match(/\d+$/) && script_title.href.match(/\d+$/)[0];
                let thetitle = item.querySelector('.thetitle');
                script_id && thetitle.appendChild(note_obj.createNoteBtn(script_id, script_title.textContent, ['note-obj-gf-note-btn', 'note-obj-gf-ts-note-btn'])); 
                note_obj.judgeUsers(script_id) && note_obj.handler(script_id, script_title, null, {
                    'add': 'span',
                    'class': 'note-obj-gf-ts-note-tag'
                }, script_title.textContent);                                       
            }
        });
    }
    async function init() {
        let old_config = await Note_Obj.GM.getValue('greasyfork_config', null);
        if (old_config && old_config.scripts_array) {
            for (let item of old_config.scripts_array) {
                Note_Obj.GM.setValue(item.id, {
                    'tag': item.tag
                });
            }
            await Note_Obj.GM.deleteValue('greasyfork_config');
        }
        let note_obj = new Note_Obj('myGreasyForkNote');
        await note_obj.init({
            'style': GF_STYLE,
            'changeEvent': change_Event,
            'script': {
                'author': {
                    'name': 'pana',
                    'homepage': 'https://www.sailboatweb.com/'
                },
                'address': 'https://greasyfork.org/scripts/404275',
                'updated': '2020-9-17'
            },
            'itemClick': key => 'https://greasyfork.org/scripts/' + key,
            'type': 'script'
        });
        let pathname = location.pathname;
        if (/^\/[\w-]+\/scripts\/\d+-/i.test(pathname)) {
            let script_id = /^\/[\w-]+\/scripts\/(\d+)-/i.exec(pathname)[1];
            let install_help_link = document.querySelector('#install-area .install-help-link:last-child');
            let suggestion = document.querySelector('#script-feedback-suggestion');
            let script_name = (document.querySelector('header h2') && document.querySelector('header h2').textContent) || '';
            if (install_help_link) {
                install_help_link.after(note_obj.createNoteBtn(script_id, script_name, ['note-obj-gf-note-btn', 'note-obj-gf-info-note-btn']));
            } else if (suggestion) {
                suggestion.appendChild(note_obj.createNoteBtn(script_id, script_name, ['note-obj-gf-note-btn', 'note-obj-gf-library-note-btn']));
            }
            let ele = document.querySelector('#script-info h2');
            ele && note_obj.judgeUsers(script_id) && note_obj.handler(script_id, ele, null, {
                'add': 'span',
                'class': 'note-obj-gf-note-tag'
            }, script_name);
        } else if (/^\/[\w-]+\/scripts/i.test(pathname) || /^\/[\w-]+\/users\/\d+/i.test(pathname)) {
            init_Script(note_obj);
            let browse_script_list = document.querySelector('#browse-script-list');
            if (browse_script_list) {
                let script_observer = new MutationObserver(() => {
                    init_Script(note_obj);
                });
                script_observer.observe(browse_script_list, {
                    'childList': true
                });
            }
            init_TS(note_obj);
            let ts_tbody = document.querySelector('#script-table tbody');
            if (ts_tbody) {
                let observer = new MutationObserver(() => {
                    init_TS(note_obj);
                });
                observer.observe(ts_tbody, {
                    'childList': true
                });
            }
        }
    }
    init();
})();
