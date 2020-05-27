// ==UserScript==
// @name                Instagram为关注用户添加备注
// @name:en             Instagram - Add a note to the user
// @name:zh-CN          Instagram - 为用户添加备注
// @name:zh-TW          Instagram - 為使用者新增備註
// @name:ja             Instagram - ユーザーに備考を加える
// @name:ko             Instagram - 사용자에 대한 주석 추가
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://www.sailboatweb.com
// @icon                data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMCwxNSBMMjAsNCBMNCw0IEw0LDIwIEwxNSwyMCBMMTUsMTcgQzE1LDE1Ljg5NTQzMDUgMTUuODk1NDMwNSwxNSAxNywxNSBMMjAsMTUgWiBNMTkuNTg1Nzg2NCwxNyBMMTcsMTcgTDE3LDE5LjU4NTc4NjQgTDE5LjU4NTc4NjQsMTcgWiBNNCwyMiBDMi44OTU0MzA1LDIyIDIsMjEuMTA0NTY5NSAyLDIwIEwyLDQgQzIsMi44OTU0MzA1IDIuODk1NDMwNSwyIDQsMiBMMjAsMiBDMjEuMTA0NTY5NSwyIDIyLDIuODk1NDMwNSAyMiw0IEwyMiwxNy40MTQyMTM2IEwxNy40MTQyMTM2LDIyIEw0LDIyIFogTTcsMTcgTDcsMTUgTDEzLDE1IEwxMywxNyBMNywxNyBaIE03LDEzIEw3LDExIEwxNywxMSBMMTcsMTMgTDcsMTMgWiBNNyw5IEw3LDcgTDE3LDcgTDE3LDkgTDcsOSBaIi8+Cjwvc3ZnPgo=
// @version             2.1.0
// @description         为用户添加备注功能，以帮助识别和搜索
// @description:en      Add a note for users to help identify and search
// @description:zh-CN   为用户添加备注功能，以帮助识别和搜索
// @description:zh-TW   為使用者新增備註功能，以幫助識別和搜尋
// @description:ja      ユーザーに備考機能を追加し、識別と検索を助ける
// @description:ko      식별 및 검색에 도움이 되는 사용자에 대한 주석 추가 기능
// @license             GNU General Public License v3.0 or later
// @author              pana
// @include             http*://www.instagram.com/*
// @require             https://code.jquery.com/jquery-3.4.1.min.js
// @require             https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @grant               GM_getValue
// @grant               GM_setValue
// ==/UserScript==

(function() {
    'use strict';
    const LANG = {
        ZH: {
            div_title: '备注',
            input_placeholder: '(请输入备注，置空时删除；按下Enter键保存)',
            save_button_text: '保存',
            clear_button_text: '清除',
            cancel_button_text: '取消',
            search_placeholder: '搜索备注',
        },
        ZH_TW: {
            div_title: '備註',
            input_placeholder: '(請輸入備註，置空時刪除；按下Enter鍵儲存)',
            save_button_text: '儲存',
            clear_button_text: '清除',
            cancel_button_text: '取消',
            search_placeholder: '搜尋備註',
        },
        EN: {
            div_title: 'Note',
            input_placeholder: '(Enter a note, delete it when blanked; press Enter to save)',
            save_button_text: 'Save',
            clear_button_text: 'Clear',
            cancel_button_text: 'Cancel',
            search_placeholder: 'Search notes',
        },
        JA: {
            div_title: '備考',
            input_placeholder: '(注を入力して、空にした時に削除してください。)',
            save_button_text: '保存する',
            clear_button_text: 'クリア',
            cancel_button_text: 'キャンセル',
            search_placeholder: '検索備考',
        },
        KO: {
            div_title: '주석',
            input_placeholder: '(메모를 입력하십시오. 비어 있을 때 삭제하십시오. )',
            save_button_text: '보존',
            clear_button_text: '제거',
            cancel_button_text: '취소',
            search_placeholder: '검색 노트',
        },
    };
    var lang_value = {
        div_title: 'Note',
        input_placeholder: '(Enter a note, delete it when blanked; press Enter to save)',
        save_button_text: 'Save',
        clear_button_text: 'Clear',
        cancel_button_text: 'Cancel',
        search_placeholder: 'Search notes',
    };
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
            'comment_id': '.FPmhX'
        },
        'homepage_stories': {
            'id': '.eebAO',
            'id_shell': '.Fd_fQ',
        },
        'homepage_recommend': {
            'id': '._8UZ6e .fDxYl a'
        },
        'user_page': {
            'frame': '.zwlfE',
            'id': '.KV-D4',
            'bar': '.AFWDX',
            'box': '.nZSzR',
            'common': 'span._32eiM'
        },
        'stories': {
            'id': '.FPmhX',
            'id_shell': '.yn6BW'
        },
        'watch_list': {
            'initial_item': '.isgrP li',
            'later_item': '.d7ByH',
            'id': 'a.FPmhX'
        }
    };
    var instagram_config = {
        user_array: [],
    };
    var show_list = [];
    const PAGE_REG = {
        HOMEPAGE: /^https?:\/\/www\.instagram\.com\/?(\?[a-z]+=[a-z-]+)?$/i,
        USER_PAGE: /^https?:\/\/www\.instagram\.com\/[^/]*\/?(\?[a-z]+=[a-z-]+)?$/i,
        STORIES: /^https?:\/\/www\.instagram\.com\/stories\/[^/]*\/?(\?[a-z]+=[a-z-]+)?$/i,
        PIC: /^https?:\/\/www\.instagram\.com\/p\//i
    };
    const ICON = {
        TAGS: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMCwxNSBMMjAsNCBMNCw0IEw0LDIwIEwxNSwyMCBMMTUsMTcgQzE1LDE1Ljg5NTQzMDUgMTUuODk1NDMwNSwxNSAxNywxNSBMMjAsMTUgWiBNMTkuNTg1Nzg2NCwxNyBMMTcsMTcgTDE3LDE5LjU4NTc4NjQgTDE5LjU4NTc4NjQsMTcgWiBNNCwyMiBDMi44OTU0MzA1LDIyIDIsMjEuMTA0NTY5NSAyLDIwIEwyLDQgQzIsMi44OTU0MzA1IDIuODk1NDMwNSwyIDQsMiBMMjAsMiBDMjEuMTA0NTY5NSwyIDIyLDIuODk1NDMwNSAyMiw0IEwyMiwxNy40MTQyMTM2IEwxNy40MTQyMTM2LDIyIEw0LDIyIFogTTcsMTcgTDcsMTUgTDEzLDE1IEwxMywxNyBMNywxNyBaIE03LDEzIEw3LDExIEwxNywxMSBMMTcsMTMgTDcsMTMgWiBNNyw5IEw3LDcgTDE3LDcgTDE3LDkgTDcsOSBaIi8+Cjwvc3ZnPgo=)',
        DOWN_ARROW: 'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0OTEuOTk2IDQ5MS45OTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ5MS45OTYgNDkxLjk5NjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik00ODQuMTMyLDEyNC45ODZsLTE2LjExNi0xNi4yMjhjLTUuMDcyLTUuMDY4LTExLjgyLTcuODYtMTkuMDMyLTcuODZjLTcuMjA4LDAtMTMuOTY0LDIuNzkyLTE5LjAzNiw3Ljg2bC0xODMuODQsMTgzLjg0OCAgICBMNjIuMDU2LDEwOC41NTRjLTUuMDY0LTUuMDY4LTExLjgyLTcuODU2LTE5LjAyOC03Ljg1NnMtMTMuOTY4LDIuNzg4LTE5LjAzNiw3Ljg1NmwtMTYuMTIsMTYuMTI4ICAgIGMtMTAuNDk2LDEwLjQ4OC0xMC40OTYsMjcuNTcyLDAsMzguMDZsMjE5LjEzNiwyMTkuOTI0YzUuMDY0LDUuMDY0LDExLjgxMiw4LjYzMiwxOS4wODQsOC42MzJoMC4wODQgICAgYzcuMjEyLDAsMTMuOTYtMy41NzIsMTkuMDI0LTguNjMybDIxOC45MzItMjE5LjMyOGM1LjA3Mi01LjA2NCw3Ljg1Ni0xMi4wMTYsNy44NjQtMTkuMjI0ICAgIEM0OTEuOTk2LDEzNi45MDIsNDg5LjIwNCwxMzAuMDQ2LDQ4NC4xMzIsMTI0Ljk4NnoiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K)',
        UP_ARROW: 'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0OTIuMDAyIDQ5Mi4wMDIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ5Mi4wMDIgNDkyLjAwMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik00ODQuMTM2LDMyOC40NzNMMjY0Ljk4OCwxMDkuMzI5Yy01LjA2NC01LjA2NC0xMS44MTYtNy44NDQtMTkuMTcyLTcuODQ0Yy03LjIwOCwwLTEzLjk2NCwyLjc4LTE5LjAyLDcuODQ0ICAgIEw3Ljg1MiwzMjguMjY1QzIuNzg4LDMzMy4zMzMsMCwzNDAuMDg5LDAsMzQ3LjI5N2MwLDcuMjA4LDIuNzg0LDEzLjk2OCw3Ljg1MiwxOS4wMzJsMTYuMTI0LDE2LjEyNCAgICBjNS4wNjQsNS4wNjQsMTEuODI0LDcuODYsMTkuMDMyLDcuODZzMTMuOTY0LTIuNzk2LDE5LjAzMi03Ljg2bDE4My44NTItMTgzLjg1MmwxODQuMDU2LDE4NC4wNjQgICAgYzUuMDY0LDUuMDYsMTEuODIsNy44NTIsMTkuMDMyLDcuODUyYzcuMjA4LDAsMTMuOTYtMi43OTIsMTkuMDI4LTcuODUybDE2LjEyOC0xNi4xMzIgICAgQzQ5NC42MjQsMzU2LjA0MSw0OTQuNjI0LDMzOC45NjUsNDg0LjEzNiwzMjguNDczeiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=)',
    };
    const STYLE_VALUE = `
        .ins_visible {
            overflow: visible !important;
        }
        .ins_tag_p {
            margin-left: 5px;
            color: #336699;
            white-space: nowrap;
        }
        .ins_tag_a {
            background-image: ${ICON.TAGS};
            background-repeat: no-repeat;
            background-position: center;
            margin-left: 5px;
            cursor: pointer;
        }
        .ins_homepage_icon {
            width: 24px;
            height: 24px;
            background-size: 24px;
            margin-top: 8px;
        }
        .ins_user_page_icon {
            width: 24px;
            height: 24px;
            background-size: 24px;
            margin-top: 2px;
        }
        .presentation_div_for_user {
            display: flex;
            position: fixed;
            background-color: rgba(0, 0, 0, .5);
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1;
            align-items: center;
            justify-content: center;
        }
        .dialog_div_for_user {
            position: relative;
            width: 400px;
            background-color: #fff;
            border: 0 solid #000;
            border-radius: 12px;
        }
        .user_title_span_for_user {
            min-height: 48px;
            text-align: center;
            border: 1px solid #efefef;
            color: #003399;
            font-wight: bold;
            background-color: rgba(0, 0, 0, 0);
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
        }
        .tag_input_for_user {
            min-height: 32px;
            margin: 5px;
            border: 1px solid #cc6666;
            padding-left: 5px;
        }
        .button_for_user {
            min-height: 48px;
            cursor: pointer;
            border: 1px solid #efefef;
            background-color: rgba(0, 0, 0, 0);
        }
        .cancel_button_for_user {
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
        }
        #searchFrame {
            position: relative;
            margin-left: 15px;
        }
        #myInputSearch {
            width: 200px;
            height: 25px;
            border: 1px solid #999;
            border-raidus: 3px;
            padding: 0 3px;
            position: relative;
        }
        #dropDowns {
            width: 15px;
            height: 15px;
            background-repeat: no-repeat;
            background-size: 12px auto;
            position: absolute;
            top: 8px;
            right: 2px;
        }
        .ins_down_arrow {
            background-image: ${ICON.DOWN_ARROW};
        }
        .ins_up_arrow {
            background-image: ${ICON.UP_ARROW};
        }
        #tagsList {
            width: 208px;
            height: 218px;
            overflow-y: scroll;
            text-align: left;
            border: 1px solid #999;
            display: none;
            position: absolute;
            top: 27px;
            background-color: #fff;
        }
        .ins_list_item {
            cursor: pointer;
        }
        .ins_highlight {
            background-color: #6699cc;
        }
        .ins_hide {
            display: none;
        }
        .ins_tag_div {
            color: #336699;
            margin-bottom: 20px;
            font-size: 18px;
        }
        .ins_tag_span {
            margin-left: 5px;
            color: #336699;
        }
        .font_size_14 {
            font-size: 14px;
        }
        .font_blue_color {
            color: #336699 !important;
        }
    `;
    function judge_User(user_title) {
        for (let i = 0; i < instagram_config.user_array.length; i ++) {
            if (user_title === instagram_config.user_array[i].user_id) {
                return i;
            }
        }
        return -1;
    }
    function write_User(user_title, input_tag) {
        let judge_value = judge_User(user_title);
        if (judge_value !== -1) {
            if (input_tag) {
                instagram_config.user_array[judge_value].user_tag = input_tag;
            } else {
                instagram_config.user_array.splice(judge_value, 1);
            }
        } else {
            if (input_tag) {
                let temp_user_obj = {
                    user_id: user_title,
                    user_tag: input_tag,
                };
                instagram_config.user_array.push(temp_user_obj);
            }
        }
        GM_setValue('instagram_config', instagram_config);
    }
    function create_Add_Input_Div(user_title) {
        let presentation_div = document.createElement('div');
        presentation_div.className = 'presentation_div_for_user';
        presentation_div.addEventListener('click', function (event) {
            if (event.target === this) {
                $('.presentation_div_for_user').remove();
            }
        });
        let dialog_div = document.createElement('div');
        dialog_div.className = 'dialog_div_for_user';
        let user_title_p = document.createElement('button');
        user_title_p.className = 'user_title_span_for_user';
        user_title_p.innerText = user_title;
        let tag_input = document.createElement('input');
        tag_input.className = 'tag_input_for_user';
        tag_input.type = 'text';
        tag_input.placeholder = lang_value.input_placeholder;
        let judge_value = judge_User(user_title);
        if (judge_value !== -1) {
            tag_input.value = instagram_config.user_array[judge_value].user_tag;
        } else {
            tag_input.value = '';
        }
        $(tag_input).keyup(function (e) { 
            if (e.keyCode === 13) {
                write_User(user_title, $('.tag_input_for_user').val());
                save_Update_Event(user_title);
                $('.presentation_div_for_user').remove();
            }
        });
        setTimeout(function() {
            try {
                tag_input.focus();
                tag_input.select();
            } catch (e) {
                console.log(e);
            }
        }, 200);
        let save_button = document.createElement('button');
        save_button.className = 'button_for_user';
        save_button.type = 'button';
        save_button.innerText = lang_value.save_button_text;
        save_button.addEventListener('click', function () {
            write_User(user_title, $('.tag_input_for_user').val());
            save_Update_Event(user_title);
            $('.presentation_div_for_user').remove();
        });
        let clear_button = document.createElement('button');
        clear_button.className = 'button_for_user';
        clear_button.type = 'button';
        clear_button.innerText = lang_value.clear_button_text;
        clear_button.addEventListener('click', function() {
            write_User(user_title, '');
            save_Update_Event(user_title);
            $('.presentation_div_for_user').remove();
        });
        let cancel_button = document.createElement('button');
        cancel_button.className = 'button_for_user cancel_button_for_user';
        cancel_button.type = 'button';
        cancel_button.innerText = lang_value.cancel_button_text;
        cancel_button.addEventListener('click', function (_event) {
            $('.presentation_div_for_user').remove();
        });
        dialog_div.appendChild(user_title_p);
        dialog_div.appendChild(tag_input);
        dialog_div.appendChild(save_button);
        dialog_div.appendChild(clear_button);
        dialog_div.appendChild(cancel_button);
        presentation_div.appendChild(dialog_div);
        return presentation_div;
    }
    function create_Add_Tags_Icon(user_title, an_class_name) {
        let tags_div = document.createElement('div');
        tags_div.className = 'ins_tag_a';
        tags_div.classList.add(an_class_name);
        tags_div.title = lang_value.div_title;
        tags_div.addEventListener('click', function () {
            document.body.appendChild(create_Add_Input_Div(user_title));
        });
        return tags_div;
    }
    function create_Add_Tag_P(tag_string) {
        let tag_p = document.createElement('p');
        tag_p.className = 'ins_tag_p';
        tag_p.innerText = '[' + tag_string + ']';
        return tag_p;
    }
    function create_Add_Tag_Span(tag_string, an_class_name) {
        let tag_span = document.createElement('span');
        tag_span.className = 'ins_tag_span';
        tag_span.classList.add(an_class_name);
        tag_span.innerText = '[' + tag_string + ']';
        return tag_span;
    }
    function create_Add_Tag_Div(tag_string) {
        let tag_div = document.createElement('div');
        tag_div.className = 'ins_tag_div';
        tag_div.innerText = '[' + tag_string + ']';
        return tag_div;
    }
    function create_List_Div(id_number, user_obj) {
        let list_div = document.createElement('div');
        list_div.id = 'tags_' + id_number;
        list_div.className = 'ins_list_item';
        list_div.innerText = user_obj.user_tag;
        $(list_div).mouseenter(function() {
            $(this).addClass('ins_highlight').siblings().removeClass('ins_highlight');
        });
        $(list_div).on('click', function () {
            window.location.href = 'https://www.instagram.com/' + user_obj.user_id + '/';
        });
        return list_div;
    }
    function create_Search_Frame() {
        let search_frame = document.createElement('div');
        search_frame.id = 'searchFrame';
        let search_input = document.createElement('input');
        search_input.id = 'myInputSearch';
        search_input.type = 'text';
        search_input.placeholder = lang_value.search_placeholder;
        search_input.value = "";
        $(search_input).focus(function () {
            $('#tagsList').show();
            let arrow = $('#dropDowns');
            arrow.removeClass('ins_down_arrow');
            arrow.addClass('ins_up_arrow');
            search_Event(search_input);
        });
        search_frame.appendChild(search_input);
        let dropdowns = document.createElement('div');
        dropdowns.id = 'dropDowns';
        dropdowns.className = 'ins_down_arrow';
        $(dropdowns).click(function () {
            $(this).parent().find('#tagsList').toggle();
            $(this).toggleClass('ins_up_arrow');
            $(this).toggleClass('ins_down_arrow');
        });
        search_frame.appendChild(dropdowns);
        let tags_list = document.createElement('div');
        tags_list.id = 'tagsList';
        $.each(instagram_config.user_array, function (index, item) {
            tags_list.appendChild(create_List_Div(index, item));
        });
        search_frame.appendChild(tags_list);
        document.body.onclick = function(e){
            e = e || window.event;
            let target = e.target || e.srcElement;
            if(target !== $('#dropDowns')[0] && target !== $('#tagsList')[0] && target !== $('#myInputSearch')[0]){
                $('#tagsList').hide();
                let arrow = $('#dropDowns');
                arrow.removeClass('ins_up_arrow');
                arrow.addClass('ins_down_arrow');
            }
        };
        return search_frame;
    }
    function search_Event(input_dom) {
        let list_arr = [];
        $.each($('#tagsList div'), function (_index, item) {
            let arr_obj = {
                ele_container: item.innerText,
                ele: item,
            };
            list_arr.push(arr_obj);
        });
        let current_index = 0;
        $(input_dom).keyup(function (event) {
            $('#tagsList').show();
            let arrow = $('#dropDowns');
            arrow.removeClass('ins_down_arrow');
            arrow.addClass('ins_up_arrow');
            if (event.keyCode === 38) {
                event.returnValue = false;
            } else if (event.keyCode === 40) {
                event.returnValue = false;
            } else if (event.keyCode === 37) {
                event.returnValue = false;
            } else if (event.keyCode === 39) {
                event.returnValue = false;
            } else if (event.keyCode === 13) {
                $(show_list[current_index]).click();
            } else {
                let search_val = $(this).val();
                show_list = [];
                $.each(list_arr, function (_index, item) {
                    if (item.ele_container.indexOf(search_val) !== -1) {
                        item.ele.classList.remove('ins_hide');
                        show_list.push(item.ele);
                    } else {
                        item.ele.classList.add('ins_hide');
                    }
                });
                current_index = 0;
            }
            $.each(show_list, function (index, item) {
                if (index === current_index) {
                    item.classList.add('ins_highlight');
                    $('#tagsList').scrollTop(item.offsetTop);
                } else {
                    item.classList.remove('ins_highlight');
                }
            });
            let list_height = $('#tagsList div:first').height() * show_list.length;
            if (list_height < 218) {
                $('#tagsList').height(list_height);
            } else {
                $('#tagsList').height(218);
            }
        });
        $(input_dom).keydown(function (event) {
            if (event.keyCode === 38) {
                current_index--;
                if (current_index < 0) {
                    current_index = 0;
                }
            } else if (event.keyCode === 40) {
                current_index++;
                if (current_index >= show_list.length) {
                    current_index = show_list.length - 1;
                }
            }
            $.each(show_list, function (index, item) {
                if (index === current_index) {
                    item.classList.add('ins_highlight');
                    $('#tagsList').scrollTop(item.offsetTop);
                } else {
                    item.classList.remove('ins_highlight');
                }
            });
        });
    }
    function homepage_Event(dom_container) {
        let old_url = location.href;
        let user_title = $(dom_container).find(selector.homepage.id).text();
        let judge_value = judge_User(user_title);
        if (judge_value !== -1) {
            if (PAGE_REG.HOMEPAGE.test(old_url)) {
                $(dom_container).find(selector.homepage.id_shell).append(create_Add_Tag_P(instagram_config.user_array[judge_value].user_tag));
            } else if (PAGE_REG.PIC.test(old_url)) {
                $(dom_container).find(selector.homepage.id).attr('title', instagram_config.user_array[judge_value].user_tag).addClass('font_blue_color');
            }
        }
        $(dom_container).find(selector.homepage.icon).before(create_Add_Tags_Icon(user_title, 'ins_homepage_icon'));
        $(dom_container).find(selector.homepage.id_shell).addClass('ins_visible');
        $(dom_container).find(selector.homepage.comment_id).each(function (_index, item) {
            let comment_title = $(item).attr('href').replace(/^\/|\/$/gi, '');
            let comment_judge_value = judge_User(comment_title);
            if (comment_judge_value !== -1) {
                $(item).attr('title', instagram_config.user_array[comment_judge_value].user_tag).addClass('font_blue_color');
            }
        });
    }
    function homepage_Stories_Event(dom_container) {
        let user_title = $(dom_container).find(selector.homepage_stories.id).text();
        let judge_value = judge_User(user_title);
        if (judge_value !== -1) {
            $(dom_container).attr('title', instagram_config.user_array[judge_value].user_tag);
        }
    }
    function homepage_Recommend_Event(dom_container) {
        let user_title = $(dom_container).attr('href').replace(/^\/|\/$/gi, '');
        let judge_value = judge_User(user_title);
        if (judge_value !== -1) {
            $(dom_container).attr('title', instagram_config.user_array[judge_value].user_tag);
        }
    }
    function user_Page_Event(selector_container) {
        let user_title = selector_container.find(selector.user_page.id).text();
        selector_container.find(selector.user_page.bar).after(create_Add_Tags_Icon(user_title, 'ins_user_page_icon'));
        let judge_value = judge_User(user_title);
        if (judge_value !== -1) {
            selector_container.find(selector.user_page.box).after(create_Add_Tag_Div(instagram_config.user_array[judge_value].user_tag));
        }
        $.each(selector_container.find(selector.user_page.common), function (_index, item) {
            let em_user_title = item.innerText;
            let em_judge_value = judge_User(em_user_title);
            if (em_judge_value !== -1) {
                item.title = instagram_config.user_array[em_judge_value].user_tag;
                item.classList.add('font_blue_color');
            }
        });
    }
    function stories_Page_Event(selector_container) {
        let user_title = selector_container.find(selector.stories.id).text();
        let judge_value = judge_User(user_title);
        if (judge_value !== -1) {
            selector_container.append(create_Add_Tag_Span(instagram_config.user_array[judge_value].user_tag, 'font_size_14'));
        }
    }
    function follow_Page_Event(selector_container) {
        if (selector_container.find('.ins_tag_span').length === 0) {
            let user_title = selector_container.find(selector.watch_list.id).attr('href').replace(/^\/|\/$/gi, '');
            let judge_value = judge_User(user_title);
            if (judge_value !== -1)  {
                selector_container.find(selector.watch_list.id).attr('title', instagram_config.user_array[judge_value].user_tag).addClass('font_blue_color');
            }
        }
    }
    function save_Update_Event(user_title) {
        let old_url = location.href;
        let tags_list = $('#tagsList');
        if (tags_list.length === 1) {
            tags_list.empty();
            $.each(instagram_config.user_array, function (index, item) {
                tags_list.append(create_List_Div(index, item));
            });
        }
        if (PAGE_REG.HOMEPAGE.test(old_url)) {
            $.each($(selector.homepage.article), function (_index, item) {
                let page_user_title = $(item).find(selector.homepage.id).text();
                if (user_title === page_user_title) {
                    let judge_value = judge_User(user_title);
                    if (judge_value !== -1) {
                        if ($(item).find('p.ins_tag_p').length !== 0) {
                            $(item).find('p.ins_tag_p').text('[' + instagram_config.user_array[judge_value].user_tag + ']');
                        } else {
                            $(item).find(selector.homepage.id_shell).append(create_Add_Tag_P(instagram_config.user_array[judge_value].user_tag));
                        }
                    } else {
                        if ($(item).find('p.ins_tag_p').length !== 0) {
                            $(item).find('p.ins_tag_p').remove();
                        }
                    }
                }
                $(item).find(selector.homepage.comment_id).each(function (_index, ele_item) {
                    let comment_title = $(ele_item).attr('href').replace(/^\/|\/$/gi, '');
                    let comment_judge_value = judge_User(comment_title);
                    if (comment_judge_value !== -1) {
                        $(ele_item).attr('title', instagram_config.user_array[comment_judge_value].user_tag).addClass('font_blue_color');
                    } else {
                        $(ele_item).attr('title', comment_title).removeClass('font_blue_color');
                    }
                });
            });
            $.each($(selector.homepage_stories.id_shell), function (_index, item) {
                let page_user_title = $(item).find(selector.homepage_stories.id).text();
                if (user_title === page_user_title) {
                    let judge_value = judge_User(user_title);
                    if (judge_value !== -1) {
                        $(item).attr('title', instagram_config.user_array[judge_value].user_tag);
                    } else {
                        $(item).attr('title', '');
                    }
                }
            });
        } else if (PAGE_REG.USER_PAGE.test(old_url)) {
            let judge_value = judge_User(user_title);
            if (judge_value !== -1) {
                if ($('.ins_tag_div').length !== 0) {
                    $('.ins_tag_div').text('[' + instagram_config.user_array[judge_value].user_tag + ']');
                } else {
                    $(selector.user_page.box).after(create_Add_Tag_Div(instagram_config.user_array[judge_value].user_tag));
                }
            } else {
                if ($('.ins_tag_div').length !== 0) {
                    $('.ins_tag_div').remove();
                }
            }
        } else if (PAGE_REG.PIC.test(old_url)) {
            $.each($(selector.homepage.article), function (_index, item) {
                let pic_judge_value = judge_User(user_title);
                if (pic_judge_value !== -1) {
                    $(item).find(selector.homepage.id).attr('title', instagram_config.user_array[pic_judge_value].user_tag).addClass('font_blue_color');
                } else {
                    $(item).find(selector.homepage.id).attr('title', '').removeClass('font_blue_color');
                }
            });
        }
    }
    function set_Language(lang_string) {
        switch (lang_string) {
            case 'zh':
            case 'zh-cn':
                lang_value = LANG.ZH;
                break;
            case 'zh-hk':
            case 'zh-tw':
                lang_value = LANG.ZH_TW;
                break;
            case 'en':
                lang_value = LANG.EN;
                break;
            case 'ja':
                lang_value = LANG.JA;
                break;
            case 'ko':
                lang_value = LANG.KO;
                break;
            default:
                lang_value = LANG.EN;
                break;
        }
        instagram_config.lang_value = lang_value;
        GM_setValue('instagram_config', instagram_config);
    }
    function init() {
        let style_dom = document.createElement('style');
        style_dom.type = 'text/css';
        style_dom.innerHTML = STYLE_VALUE;
        document.body.appendChild(style_dom);
        if (instagram_config.lang_value) {
            lang_value = instagram_config.lang_value;
        } else {
            set_Language($('html:first').attr('lang'));
        }
        $(selector.search.frame).after(create_Search_Frame());
        $(selector.root).arrive(selector.search.frame, function () {
            $(this).after(create_Search_Frame());
        });
        $.each($(selector.homepage.article), function (_index, item) {
            homepage_Event(item);
        });
        setTimeout(function () {
            $.each($(selector.homepage_stories.id_shell), function (_index, item) {
                homepage_Stories_Event(item);
            });
        }, 1000);
        setTimeout(function () {
            $.each($(selector.homepage_recommend.id), function (_index, item) {
                homepage_Recommend_Event(item);
            });
        }, 1000);
        $(selector.root).arrive(selector.homepage.article, function () {
            homepage_Event(this);
        });
        $(selector.root).arrive(selector.homepage_stories.id_shell, function () {
            homepage_Stories_Event(this);
        });
        $(selector.root).arrive(selector.homepage_recommend.id, function () {
            homepage_Recommend_Event(this);
        });
        if ($(selector.user_page.frame).length !== 0) {
            user_Page_Event($(selector.user_page.frame));
        }
        $(selector.root).arrive(selector.user_page.frame, function () {
            user_Page_Event($(this));
        });
        if ($(selector.stories.id_shell).length !== 0) {
            stories_Page_Event($(selector.stories.id_shell));
        }
        $(selector.root).arrive(selector.stories.id_shell, function () {
            stories_Page_Event($(this));
        });
        $(selector.body).arrive(selector.watch_list.initial_item, {onceOnly: true}, function () {
            follow_Page_Event($(this));
        });
        $(selector.body).arrive(selector.watch_list.later_item, function () {
            follow_Page_Event($(this));
        });
    }
    Promise.all([GM_getValue('instagram_config')]).then(function (data) {
        if (data[0] !== undefined) {
            instagram_config = data[0];
        }
        init();
    }).catch(function(e) {
        console.error('Error reading value.');
        console.error(e);
    });
})();
