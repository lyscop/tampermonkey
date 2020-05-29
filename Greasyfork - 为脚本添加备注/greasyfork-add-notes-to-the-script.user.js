// ==UserScript==
// @name                Greasyfork - Add notes to the script
// @name:zh-CN          Greasyfork - 为脚本添加备注
// @name:zh-TW          Greasyfork - 為腳本新增備註
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://www.sailboatweb.com
// @version             1.0.0
// @description         Add a note for scripts to help identify and search
// @description:zh-CN   为脚本添加备注功能，以帮助识别和搜索
// @description:zh-TW   為腳本新增備註功能，以幫助識別和搜尋
// @author              pana
// @license             GNU General Public License v3.0 or later
// @include             http*://*greasyfork.org/*
// @include             http*://*sleazyfork.org/*
// @grant               GM_getValue
// @grant               GM_setValue
// ==/UserScript==

(function() {
    'use strict';
    const LANG = {
        'EN': {
            'title': 'Note',
            'add_button_text': 'Add note',
            'add_button_title': 'Add notes to the script',
            'modify_button_text': 'Modify note',
            'modify_button_title': 'Modify notes for the script',
            'input_placeholder': '(Enter a note, delete it when blanked; press Enter to save)',
            'save_button_text': 'Save',
            'clear_button_text': 'Clear',
            'cancel_button_text': 'Cancel',
            'search_placeholder': 'Search notes'
        },
        'ZH_CN': {
            'title': '备注',
            'add_button_text': '添加备注',
            'add_button_title': '为脚本添加备注',
            'modify_button_text': '修改备注',
            'modify_button_title': '为脚本修改备注',
            'input_placeholder': '(请输入备注，置空时删除；按下Enter键保存)',
            'save_button_text': '保存',
            'clear_button_text': '清除',
            'cancel_button_text': '取消',
            'search_placeholder': '搜索备注'
        },
        'ZH_TW': {
            'title': '備註',
            'add_button_text': '新增備註',
            'add_button_title': '為腳本新增備註',
            'modify_button_text': '修改備註',
            'modify_button_title': '為腳本修改備註',
            'input_placeholder': '(請輸入備註，置空時刪除；按下Enter鍵儲存)',
            'save_button_text': '儲存',
            'clear_button_text': '清除',
            'cancel_button_text': '取消',
            'search_placeholder': '搜尋備註'
        }
    };
    const ICON = {
        'DOWN_ARROW': 'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0OTEuOTk2IDQ5MS45OTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ5MS45OTYgNDkxLjk5NjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik00ODQuMTMyLDEyNC45ODZsLTE2LjExNi0xNi4yMjhjLTUuMDcyLTUuMDY4LTExLjgyLTcuODYtMTkuMDMyLTcuODZjLTcuMjA4LDAtMTMuOTY0LDIuNzkyLTE5LjAzNiw3Ljg2bC0xODMuODQsMTgzLjg0OCAgICBMNjIuMDU2LDEwOC41NTRjLTUuMDY0LTUuMDY4LTExLjgyLTcuODU2LTE5LjAyOC03Ljg1NnMtMTMuOTY4LDIuNzg4LTE5LjAzNiw3Ljg1NmwtMTYuMTIsMTYuMTI4ICAgIGMtMTAuNDk2LDEwLjQ4OC0xMC40OTYsMjcuNTcyLDAsMzguMDZsMjE5LjEzNiwyMTkuOTI0YzUuMDY0LDUuMDY0LDExLjgxMiw4LjYzMiwxOS4wODQsOC42MzJoMC4wODQgICAgYzcuMjEyLDAsMTMuOTYtMy41NzIsMTkuMDI0LTguNjMybDIxOC45MzItMjE5LjMyOGM1LjA3Mi01LjA2NCw3Ljg1Ni0xMi4wMTYsNy44NjQtMTkuMjI0ICAgIEM0OTEuOTk2LDEzNi45MDIsNDg5LjIwNCwxMzAuMDQ2LDQ4NC4xMzIsMTI0Ljk4NnoiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K)',
        'UP_ARROW': 'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0OTIuMDAyIDQ5Mi4wMDIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ5Mi4wMDIgNDkyLjAwMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik00ODQuMTM2LDMyOC40NzNMMjY0Ljk4OCwxMDkuMzI5Yy01LjA2NC01LjA2NC0xMS44MTYtNy44NDQtMTkuMTcyLTcuODQ0Yy03LjIwOCwwLTEzLjk2NCwyLjc4LTE5LjAyLDcuODQ0ICAgIEw3Ljg1MiwzMjguMjY1QzIuNzg4LDMzMy4zMzMsMCwzNDAuMDg5LDAsMzQ3LjI5N2MwLDcuMjA4LDIuNzg0LDEzLjk2OCw3Ljg1MiwxOS4wMzJsMTYuMTI0LDE2LjEyNCAgICBjNS4wNjQsNS4wNjQsMTEuODI0LDcuODYsMTkuMDMyLDcuODZzMTMuOTY0LTIuNzk2LDE5LjAzMi03Ljg2bDE4My44NTItMTgzLjg1MmwxODQuMDU2LDE4NC4wNjQgICAgYzUuMDY0LDUuMDYsMTEuODIsNy44NTIsMTkuMDMyLDcuODUyYzcuMjA4LDAsMTMuOTYtMi43OTIsMTkuMDI4LTcuODUybDE2LjEyOC0xNi4xMzIgICAgQzQ5NC42MjQsMzU2LjA0MSw0OTQuNjI0LDMzOC45NjUsNDg0LjEzNiwzMjguNDczeiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=)',
    };
    const STYLE_VALUE = `
        .my_greasyfork_note_btn {
            margin-left: 10px;
        }
        .list_show, .show_separator {
            display: block !important;
        }
        #presentation_div_for_user {
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
            display: flex;
            flex-direction: column;
        }
        .user_title_span_for_user {
            min-height: 48px;
            text-align: center;
            border: 1px solid #efefef;
            color: #003399;
            font-weight: bold;
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
            width: 175px;
            height: 25px;
            border: 1px solid #999;
            border-radius: 3px;
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
            width: 180px;
            height: 220px;
            overflow-y: scroll;
            text-align: left;
            border: 1px solid #999;
            display: none;
            position: absolute;
            top: 27px;
            background-color: #fff;
            z-index: 1;
        }
        .ins_list_item {
            cursor: pointer;
            color: #000;
            padding-left: 5px;
        }
        .ins_highlight {
            background-color: #6699cc;
        }
        .ins_hide {
            display: none;
        }
        .ins_tag_span {
            margin-left: 20px;
            color: #336699;
        }
        .my_note_btn_hide {
            display: none;
        }
        ol.script-list li:hover .my_greasyfork_note_btn {
            display: inline !important;
        }
    `;
    class Greasyfork_Note {
        constructor(config, lang, show_list = []) {
            this.config = config;
            this.lang = lang;
            this.showList = show_list;
        }
        createNoteBtn(script_id, callback, class_name = "my_greasyfork_note_btn") {
            let btn = document.createElement('a');
            btn.className = class_name;
            btn.target = '_self';
            btn.href = 'javascript:;';
            if (this.judgeScripts(script_id)) {
                btn.textContent = this.lang.modify_button_text;
                btn.title = this.lang.modify_button_title;
            } else {
                btn.textContent = this.lang.add_button_text;
                btn.title = this.lang.add_button_title;
            }
            btn.addEventListener('click', () => {
                document.body.appendChild(this.createNoteFrame(script_id, () => {    
                    if (this.judgeScripts(script_id)) {
                        btn.textContent = this.lang.modify_button_text;
                        btn.title = this.lang.modify_button_title;
                    } else {
                        btn.textContent = this.lang.add_button_text;
                        btn.title = this.lang.add_button_title;
                    }
                    if (typeof(callback) == 'function') {
                        callback();
                    }
                }));
            });
            return btn;
        }
        judgeScripts(script_id) {
            if (this.getScriptIndex(script_id) == -1) {
                return false;
            }
            return true;
        }
        getScriptIndex(script_id) {
            for (let i in this.config.scripts_array) {
                if (script_id == this.config.scripts_array[i].id) {
                    return i;
                }
            }
            return -1;
        }
        getScriptTag(script_id) {
            if (this.judgeScripts(script_id)) {
                return this.config.scripts_array[this.getScriptIndex(script_id)].tag;
            }
            return '';
        }
        getScriptFormatTag(script_id) {
            if (this.judgeScripts(script_id)) {
                return '[' + this.getScriptTag(script_id) + ']';
            }
            return '';
        }
        writeScripts(script_id, tag_value) {
            if (this.judgeScripts(script_id)) {
                let index = this.getScriptIndex(script_id);
                if (tag_value) {
                    this.config.scripts_array[index].tag = tag_value;
                } else {
                    this.config.scripts_array.splice(index, 1);
                }
            } else {
                if (tag_value) {
                    let temp_scripts_obj = {
                        'id': script_id,
                        'tag': tag_value
                    };
                    this.config.scripts_array.push(temp_scripts_obj);
                }
            }
            GM_setValue('greasyfork_config', this.config);
        }
        removeNoteFrame(frame_id = 'presentation_div_for_user') {
            let temp_ele = document.getElementById(frame_id);
            temp_ele.parentNode.removeChild(temp_ele);
        }
        createNoteFrame(script_id, callback) {
            let that = this;
            let presentation_div = document.createElement('div');
            presentation_div.id = 'presentation_div_for_user';
            presentation_div.addEventListener('click', function (event) {
                if (event.target === this) {
                    that.removeNoteFrame();
                }
            });
            let dialog_div = document.createElement('div');
            dialog_div.className = 'dialog_div_for_user';
            let user_title_p = document.createElement('button');
            user_title_p.className = 'user_title_span_for_user';
            user_title_p.textContent = "ID: " + script_id;
            let tag_input = document.createElement('input');
            tag_input.className = 'tag_input_for_user';
            tag_input.type = 'text';
            tag_input.placeholder = this.lang.input_placeholder;
            if (this.judgeScripts(script_id)) {
                tag_input.value = this.config.scripts_array[this.getScriptIndex(script_id)].tag;
            } else {
                tag_input.value = '';
            }
            tag_input.addEventListener('keyup', (e) => {
                if (e.keyCode === 13) {
                    this.writeScripts(script_id, tag_input.value);
                    this.resetSearchFrame();
                    if (typeof(callback) == 'function') {
                        callback();
                    }
                    this.removeNoteFrame();
                }
            });
            setTimeout(function() {
                try {
                    tag_input.focus();
                    tag_input.select();
                } catch(e) {
                    console.error(e);
                }
            }, 200);
            let save_button = document.createElement('button');
            save_button.className = 'button_for_user';
            save_button.type = 'button';
            save_button.innerText = this.lang.save_button_text;
            save_button.addEventListener('click', () => {
                this.writeScripts(script_id, tag_input.value);
                this.resetSearchFrame();
                if (typeof(callback) == 'function') {
                    callback();
                }
                this.removeNoteFrame();
            });
            let clear_button = document.createElement('button');
            clear_button.className = 'button_for_user';
            clear_button.type = 'button';
            clear_button.innerText = this.lang.clear_button_text;
            clear_button.addEventListener('click', () => {
                this.writeScripts(script_id, '');
                this.resetSearchFrame();
                if (typeof(callback) == 'function') {
                    callback();
                }
                this.removeNoteFrame();
            });
            let cancel_button = document.createElement('button');
            cancel_button.className = 'button_for_user cancel_button_for_user';
            cancel_button.type = 'button';
            cancel_button.innerText = this.lang.cancel_button_text;
            cancel_button.addEventListener('click', () => {
                this.removeNoteFrame();
            });
            dialog_div.appendChild(user_title_p);
            dialog_div.appendChild(tag_input);
            dialog_div.appendChild(save_button);
            dialog_div.appendChild(clear_button);
            dialog_div.appendChild(cancel_button);
            presentation_div.appendChild(dialog_div);
            return presentation_div;
        }
        resetSearchFrame() {
            let tags_list = document.getElementById('tagsList');
            if (tags_list) {
                tags_list.innerHTML = "";
                this.config.scripts_array.forEach((item, index) => {
                    tags_list.appendChild(this.createListDiv(index, item));
                });
            }
        }
        cretaeSearchFrame() {
            let search_frame = document.createElement('div');
            search_frame.id = 'searchFrame';
            let search_input = document.createElement('input');
            search_input.id = 'myInputSearch';
            search_input.type = 'text';
            search_input.placeholder = this.lang.search_placeholder;
            search_input.value = "";
            search_input.addEventListener('focusin', () => {
                document.getElementById('tagsList').classList.add('list_show');
                let arrow = document.getElementById('dropDowns');
                arrow.classList.remove('ins_down_arrow');
                arrow.classList.add('ins_up_arrow');
                this.searchEvent(search_input);
            });
            search_frame.appendChild(search_input);
            let dropdowns = document.createElement('div');
            dropdowns.id = 'dropDowns';
            dropdowns.className = 'ins_down_arrow';
            dropdowns.addEventListener('click', function() {
                let tags_list = document.getElementById('tagsList');
                if (tags_list.classList.contains('list_show')) {
                    tags_list.classList.remove('list_show');
                } else {
                    tags_list.classList.add('list_show');
                }
                if (this.classList.contains('ins_up_arrow')) {
                    this.classList.remove('ins_up_arrow');
                } else {
                    this.classList.add('ins_up_arrow');
                }
                if (this.classList.contains('ins_down_arrow')) {
                    this.classList.remove('ins_down_arrow');
                } else {
                    this.classList.add('ins_down_arrow');
                }
            });
            search_frame.appendChild(dropdowns);
            let tags_list = document.createElement('div');
            tags_list.id = 'tagsList';
            for (let i = 0; i < this.config.scripts_array.length; i ++) {
                tags_list.appendChild(this.createListDiv(i, this.config.scripts_array[i]));
            }
            search_frame.appendChild(tags_list);
            document.body.onclick = function(e){
                e = e || window.event;
                let target = e.target || e.srcElement;
                if(target !== document.getElementById('dropDowns') && target !== document.getElementById('tagsList') && target !== document.getElementById('myInputSearch')){
                    document.getElementById('tagsList').classList.remove('list_show');
                    let arrow = document.getElementById('dropDowns');
                    arrow.classList.remove('ins_up_arrow');
                    arrow.classList.add('ins_down_arrow');
                }
            };
            return search_frame;
        }
        createListDiv(id_number, scripts_obj) {
            let list_div = document.createElement('div');
            list_div.id = 'tags_' + id_number;
            list_div.className = 'ins_list_item';
            list_div.textContent = scripts_obj.tag;
            list_div.addEventListener('mouseenter', function() {
                for (let ele of document.querySelectorAll('#tagsList div')) {
                    ele.classList.remove('ins_highlight');
                }
                this.classList.add('ins_highlight');
            });
            list_div.addEventListener('click', function() {
                location.pathname = location.pathname.replace(/^(\/[\w-]+)\/?.*/i, "$1" + "/scripts/" + scripts_obj.id);
            });
            return list_div;
        }
        searchEvent(input_dom) {
            let list_arr = [];
            for (let ele of document.querySelectorAll('#tagsList div')) {
                let arr_obj = {
                    'eleContainer': ele.textContent,
                    'ele': ele
                };
                list_arr.push(arr_obj);
            }
            let current_index = 0;
            input_dom.addEventListener('keyup', (event) => {
                document.getElementById('tagsList').classList.add('list_show');
                let arrow = document.getElementById('dropDowns');
                arrow.classList.remove('ins_down_arrow');
                arrow.classList.add('ins_up_arrow');
                let search_val;
                switch (event.keyCode) {
                    case 38:
                    case 40:
                    case 37:
                    case 39:
                        event.returnValue = false;
                        break;
                    case 13:
                        this.showList[current_index].click();
                        break;
                    default:
                        search_val = input_dom.value;
                        this.showList = [];
                        list_arr.forEach((item) => {
                            if (item.eleContainer.indexOf(search_val) !== -1) {
                                item.ele.classList.remove('ins_hide');
                                this.showList.push(item.ele);
                            } else {
                                item.ele.classList.add('ins_hide');
                            }
                        });
                        current_index = 0;
                        break;
                }
                this.showList.forEach(function(item, index) {
                    if (index === current_index) {
                        item.classList.add('ins_highlight');
                        document.getElementById('tagsList').scrollTop = item.offsetTop;
                    } else {
                        item.classList.remove('ins_highlight');
                    }
                });
                let list_height = 22 * this.showList.length;
                if (list_height < 220) {
                    document.getElementById('tagsList').style.height = list_height + 'px';
                } else {
                    document.getElementById('tagsList').style.height = '220px';
                }
            });
            input_dom.addEventListener('keydown', (event) => {
                if (event.keyCode === 38) {
                    current_index --;
                    if (current_index < 0) {
                        current_index = 0;
                    }
                } else if (event.keyCode === 40) {
                    current_index ++;
                    if (current_index >= this.showList.length) {
                        current_index = this.showList.length - 1;
                    }
                }
                this.showList.forEach(function(item, index) {
                    if (index === current_index) {
                        item.classList.add('ins_highlight');
                        document.getElementById('tagsList').scrollTop = item.offsetTop;
                    } else {
                        item.classList.remove('ins_highlight');
                    }
                });
            });
        }
        createNoteSpan(script_id, an_class_name = "") {
            let note_span = document.createElement('span');
            note_span.className = 'ins_tag_span';
            if (an_class_name) {
                note_span.classList.add(an_class_name);
            }
            note_span.textContent = '[' + this.getScriptTag(script_id) + ']';
            return note_span;
        }
    }
    function init(greasyfork_config) {
        let pathname = location.pathname;
        let style_dom = document.createElement('style');
        style_dom.type = 'text/css';
        style_dom.innerHTML = STYLE_VALUE;
        document.body.appendChild(style_dom);
        let lang_str = document.documentElement.lang;
        let lang_value;
        switch (lang_str) {
            case 'zh':
            case 'zh-cn':
            case 'zh-CN':
                lang_value = LANG.ZH_CN;
                break;
            case 'zh-hk':
            case 'zh-HK':
            case 'zh-tw':
            case 'zh-TW':
                lang_value = LANG.ZH_TW;
                break;
            case 'en':
            default:
                lang_value = LANG.EN;
                break;
        }
        let note_obj = new Greasyfork_Note(greasyfork_config, lang_value);
        let search_li = document.createElement('li');
        search_li.appendChild(note_obj.cretaeSearchFrame());
        document.querySelector('#site-nav nav').insertAdjacentElement('afterbegin', search_li);
        if (/^\/[\w-]+\/scripts\/\d+-/i.test(pathname)) {
            let script_id = /^\/[\w-]+\/scripts\/(\d+)-/i.exec(pathname)[1];
            if (document.getElementById('script-feedback-suggestion')) {
                document.getElementById('script-feedback-suggestion').appendChild(note_obj.createNoteBtn(script_id, function() {
                    if (document.querySelector('#script-info h2 > span')) {
                        let span_dom = document.querySelector('#script-info h2 > span');
                        if (note_obj.judgeScripts(script_id)) {
                            span_dom.textContent = note_obj.getScriptFormatTag(script_id);
                        } else {
                            document.querySelector('#script-info h2').removeChild(span_dom);
                        }
                    } else {
                        if (note_obj.judgeScripts(script_id)) {
                            document.querySelector('#script-info h2').appendChild(note_obj.createNoteSpan(script_id));
                        }
                    }
                }));
            }
            if (note_obj.judgeScripts(script_id)) {
                document.querySelector('#script-info h2').appendChild(note_obj.createNoteSpan(script_id));
            }
        } else if (/^\/[\w-]+\/scripts/i.test(pathname) || /^\/[\w-]+\/users\/\d+/i.test(pathname)) {
            let browse_list = document.querySelectorAll('ol.script-list li');
            for (let ele of browse_list) {
                let script_id = ele.getAttribute('data-script-id');
                if (script_id) {
                    if (ele.querySelector('dd.script-list-author span')) {
                        ele.querySelector('dd.script-list-author span').appendChild(note_obj.createNoteBtn(script_id, function() {
                            if (ele.querySelector('h2 > .ins_tag_span')) {
                                let span_dom = ele.querySelector('h2 .ins_tag_span');
                                if (note_obj.judgeScripts(script_id)) {
                                    span_dom.textContent = note_obj.getScriptFormatTag(script_id);
                                } else {
                                    ele.querySelector('h2').removeChild(span_dom);
                                }
                            } else {
                                if (note_obj.judgeScripts(script_id)) {
                                    ele.querySelector('.name-description-separator').after(note_obj.createNoteSpan(script_id));
                                }
                            }
                        }, 'my_greasyfork_note_btn my_note_btn_hide'));
                    }
                    if (note_obj.judgeScripts(script_id)) {
                        ele.querySelector('.name-description-separator').after(note_obj.createNoteSpan(script_id));
                    }
                }
            }
        }
    }
    Promise.all([GM_getValue('greasyfork_config')]).then(function(data) {
        let greasyfork_config = {
            scripts_array: []
        };
        if (data[0] !== undefined) {
            greasyfork_config = data[0];
        }
        init(greasyfork_config);
    }).catch(function(e) {
        console.error('Script error.');
        console.error(e);
    });
})();
