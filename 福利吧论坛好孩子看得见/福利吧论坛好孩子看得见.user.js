// ==UserScript==
// @name                福利吧论坛好孩子看得见
// @name:zh-CN          福利吧论坛 - 好孩子看得见
// @name:zh-TW          福利吧論壇 - 好孩子看得見
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://www.sailboatweb.com
// @version             9.2.2
// @description         好孩子才看得见，支持移动端
// @description:zh-CN   好孩子才看得见，论坛小助手
// @description:zh-TW   好孩子才看得見，論壇小助手
// @author              pana
// @include             http*://www.wnflb66.com/*
// @require             https://cdn.bootcss.com/crypto-js/4.0.0/core.min.js
// @require             https://cdn.bootcss.com/crypto-js/4.0.0/enc-base64.min.js
// @require             https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @require             https://greasyfork.org/scripts/403716-gm-config-cn/code/GM_config_CN.js
// @connect             pan.baidu.com
// @connect             keyfc.net
// @connect             search.pandown.cn
// @resource            settings https://cdn.jsdelivr.net/gh/LightAPIs/PicGoImg@master/img/settings.svg
// @resource            code_blue https://cdn.jsdelivr.net/gh/LightAPIs/PicGoImg@master/img/code_blue.svg
// @resource            code_gray https://cdn.jsdelivr.net/gh/LightAPIs/PicGoImg@master/img/code_gray.svg
// @resource            mode_day https://cdn.jsdelivr.net/gh/LightAPIs/PicGoImg@master/img/mode_day.svg
// @resource            mode_night https://cdn.jsdelivr.net/gh/LightAPIs/PicGoImg@master/img/mode_night.svg
// @resource            signature_add https://cdn.jsdelivr.net/gh/LightAPIs/PicGoImg@master/img/signature_add.svg
// @resource            signature_minus https://cdn.jsdelivr.net/gh/LightAPIs/PicGoImg@master/img/signature_minus.svg
// @grant               GM_info
// @grant               GM_setClipboard
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_registerMenuCommand
// @grant               GM_xmlhttpRequest
// @grant               GM_addStyle
// @run-at              document-start
// @license             GNU General Public License v3.0 or later
// @note                注意: 9.0.0 以前的版本的配置不兼容新版本，若之前改动过默认设置，请升级后重新设置一遍
// ==/UserScript==

(function() {
    'use strict';
    if (typeof(GM_config) == 'undefined') {
        alert ('福利吧论坛 - 好孩子看得见:\nGM_config 库文件加载失败，脚本无法正常工作，请尝试刷新网页以重新加载。\n(若一直弹出此提示请手动禁用脚本并将问题反馈给我！)');
    } else if (typeof(document.arrive) == 'undefined') {
        alert ('福利吧论坛 - 好孩子看得见:\narrive 库文件加载失败，脚本可能无法正常工作，请尝试刷新网页以重新加载。\n(若一直弹出此提示请手动禁用脚本并将问题反馈给我！)');
    } else if (typeof(CryptoJS) == 'undefined') {
        console.warn('福利吧论坛 - 好孩子看得见:\nCryptoJS 库文件加载失败，BASE64 编解码功能无法使用。');
    } else {
        console.debug('福利吧论坛 - 好孩子看得见:\n脚本工作环境正常。');
    }
    function get_GM_Info_Resources(name) {
        for (let ele of GM_info.script.resources) {
            if (ele.name == name) {
                return ele.url;
            }
        }
        return '';
    }
    const SETTINGS_ICON = 'url(' + get_GM_Info_Resources('settings') + ')';
    const CODE_ICON = {
        'GRAY': 'url('+ get_GM_Info_Resources('code_gray') +')',
        'BLUE': 'url(' + get_GM_Info_Resources('code_blue') + ')'
    };
    const MODE_ICON = {
        'NIGHT': 'url(' + get_GM_Info_Resources('mode_night') + ')',
        'DAY': 'url(' + get_GM_Info_Resources('mode_day') + ')'
    };
    const SIGNATURE_ICON = {
        'ADD': 'url(' + get_GM_Info_Resources('signature_add') + ')',
        'MINUS': 'url(' + get_GM_Info_Resources('signature_minus') + ')'
    };
    const SETTINGS_STYLE = `
        #myGoodBoyConfig input, #myGoodBoyConfig button {
            cursor: pointer;
        }
        #myGoodBoyConfig .reset_holder {
            float: left;
            position: relative;
            bottom: -3vh;
        }
        #myGoodBoyConfig .section_header a {
            color: #F5F9FB;
            text-decoration: none;
        }
    `;
    const CODE_PANEL_STYLE = `
        #myCodePanel input, #myCodePanel button {
            cursor: pointer;
        }
        #myCodePanel_bjxEncodeBtn_var, #myCodePanel_bjxDecodeBtn_var,
        #myCodePanel_coreValuesEncodeBtn_var, #myCodePanel_coreValuesDecodeBtn_var,
        #myCodePanel_yflcEncodeBtn_var, #myCodePanel_yflcDecodeBtn_var,
        #myCodePanel_base64EncodeBtn_var, #myCodePanel_base64DecodeBtn_var,
        #myCodePanel_baiduQueryBtn_var {
            display: inline;
        }
        #myCodePanel {
            width: 600px !important;
            height: 430px !important;
        }
        #myCodePanel .reset_holder {
            float: left;
            position: relative;
            bottom: -1vh;
        }
        #myCodePanel .nav-tabs {
            text-align: center;
        }
        #myCodePanel .nav-tabs > div {
            padding: 5px 20px;
        }
        #myCodePanel #myCodePanel_saveBtn {
            display: none;
        }
        #myCodePanel #myCodePanel_resetLink {
            text-decoration: underline;
        }
        #myCodePanel textarea {
            width: 96%;
        }
    `;
    const NIGHT_STYLE =`
        html, body, .bm, .bdl, .bdl dt, .bdl dd.bdl_a a, .tb .a a, .pn, .fl .bm_h, .ct2_a, .ct3_a, .t_table, table.plhin {
            background-color: #282A36 !important;
            background-blend-mode: multiply;
        }
        .bdl dl.a, .tl .th, .tl .ts th, .tl .ts td, .pg a, .pg strong, .pgb a, .pg label, .bml .bm_h, #scrolltop a, .bmn, .bm_h, td.pls, .ad td.plc, div.exfm, .tb a, .tb_h, .ttp li.a a, div.uo a, input#addsubmit_btn, #gh .bm .bm_h, .jump_bdl li, .newthread tr th, .newthread tr td, .tl .threadpre td, .tl .threadpre:hover td, .nfl .f_c, #myCodePanel {
            background-color: #282A36 !important;
        }
        #nv, .card_gender_0, .card .o a, .tbn li.a, #p_btn a, #p_btn i {
            background: #40444D !important;
        }
        #toptb, .tedt .bar, .edt .bar, .edt .bbar, #post_extra_tb label.a, #extcreditmenu.a, #g_upmine.a, .tl #forumnewshow, .jump_bdl .a a, .jump_bdl .a a:hover, .psth, .pl .quote, .pm_tac, .pm .c, .pml .hover, #uhd, #flw_header .bar, .ttp a, .ttp strong, .bmw .bm_h, .GzList ul li a, .m_c, .m_c .o, .dt th, .section_header_holder p, #fx_checkin_menu,#fx_checkin_menub, .pl .blockcode ol li:hover {
            background-color: #40444D !important;
        }
        #nv li a:hover, #nv li.hover a, #nv li.hover a:hover, #nv > a {
            background: #1A1A1A !important;
            background-blend-mode: multiply;
        }
        .p_pop, .p_pof, .sllt, .tl #forumnewshow a:hover, #autopbn:hover, .pgbtn a:hover, #hiddenpoststip {
            background-color: #1A1A1A !important;
        }
        #threadlist > div > table > tbody > tr:hover > *, #threadlist > div > form > table > tbody > tr:not(.threadpre):hover > *, div.tl > form > table > tbody > tr:hover > * {
            background-color: #1A1A1A !important;
        }
        .p_pop a:hover {
            background: #3D3D3D !important;
        }
        a, #um, #um a, body, input, button, select, textarea, .xi2, .xi2 a, .pg a, .pg strong, .pgb a, .pg label, .jump_bdl a, div#forum_rules_37 font {
            color: #C0C0C0 !important;
        }
        .tps a, .chart em {
            color: #666 !important;
        }
        .GzList ul li a {
            color: #000 !important !important;
        }
        .tedt .pt, .px, .pt, .ps, select, input,
        #myCodePanel textarea, #myCodePanel button
         {
            background-color: #38383D !important;
        }
        .pl .blockcode {
            background: #38383D !important;
        }
        ul.cl.nav li a, ul.cl.nav li a:hover {
            background-repeat: no-repeat !important;
            background-position: 50% 5px !important;
        }
        #fastpostsmilie_88_td, #fx_checkin_topb, #hd h2 a,#newspecial, #newspecialtmp, #post_reply, #post_replytmp, .ico_fall, .ico_increase, .o img, fieldset legend, div.ac1 {
            mix-blend-mode: multiply;
        }
        .p_pop a, .tl #forumnewshow a {
            filter: brightness(.7);
        }
        #category_36 tbody td p>a, .bm_c tbody h2>a, .common font, .fl .bm_h h2 a, .tl th a, .xw0.xi1, .y.xg1 font {
            mix-blend-mode: color-dodge;
        }
        .ignore_notice {
            right: -3px !important;
            top: -53px !important;
        }
        .tps a:hover {
            background-color: #C0C0C0 !important;
        }
    `;
    const BASIC_STYLE = `
        .my_good_boy_div_float {
            position: absolute;
            max-width: 430px;
            padding-left: 20px;
            padding-right: 10px;
            margin-left: 962px;
            margin-top: -170px;
            border: 2px solid #CDCDCD;
            border-radius: 8px;
        }
        .my_good_boy_div_basic {
            margin-top: 10px;
        }
        .my_good_boy_p {
            color: red;
            font-size: 15px;
        }
        .my_good_boy_p_float {
            margin-left: 0px !important;
        }
        .my_good_boy_li {
            list-style-type: disc;
        }
        .my_good_boy_a {
            display: inline;
            font-size: 15px;
            white-space: nowrap;
        }
        .my_good_boy_a_copy {
            display: inline-block;
            font-size: 15px;
            margin-left: 20px;
            text-decoration: underline;
        }
        .a_copy_completed {
            color: #F60 !important;
        }
        .link_faild {
            color: #999 !important;
            text-decoration: line-through;
        }
        .show_more_link {
            text-decoration: underline;
        }
        #settingsIcon {
            display: block;
            float: right;
            cursor: pointer;
            margin-top: 5px;
            width: 23px;
            height: 18px;
            background-image: ${SETTINGS_ICON};
            background-repeat: no-repeat;
            background-size: 16px auto;
            background-position: center;
        }
        .expand_box {
            bottom: 0px;
            height: 60px;
            position: fixed;
            right: -6vw;
            transition: 0.5s;
            width: 12vw;
            z-index: 999;
        }
        .expand_box_h {
            bottom: 0px;
            height: 120px;
            position: fixed;
            right: -6vw;
            transition: 0.5s;
            width: 12vw;
            z-index: 999;
        }
        .show_expand_box {
            right: 0;
            width: 6vw;
        }
        #myCodeSpan {
            background-image: ${CODE_ICON.GRAY};
            background-repeat: no-repeat;
            background-size: 32px auto;
            background-position: center;
            background-color: #787878;
            border-radius: 19px;
            border: 1px solid #787878;
            bottom: 10px;
            color: #FFF;
            cursor: pointer;
            display: block;
            font-size: 13px;
            height: 38px;
            line-height: 38px;
            position: absolute;
            right: 1vw;
            text-align: center;
            width: 38px;
            z-index: 999;
        }
        #myCodeSpan:hover {
            box-shadow: 0 0 5px green;
            background-image: ${CODE_ICON.BLUE};
        }
        #myNightSpan {
            background-repeat: no-repeat;
            background-size: 32px auto;
            background-position: center;
            background-color: #00A1D6;
            border-radius: 19px;
            border: 1px solid #00A1D6;
            bottom: 10px;
            color: #FFF;
            cursor: pointer;
            display: block;
            font-size: 13px;
            height: 38px;
            line-height: 38px;
            position: absolute;
            right: 1vw;
            text-align: center;
            width: 38px;
            z-index: 999;
        }
        #myNightSpan_2 {
            background-repeat: no-repeat;
            background-size: 32px auto;
            background-position: center;
            background-color: #00A1D6;
            border-radius: 19px;
            border: 1px solid #00A1D6;
            bottom: 60px;
            color: #FFF;
            cursor: pointer;
            display: block;
            font-size: 13px;
            height: 38px;
            line-height: 38px;
            position: absolute;
            right: 1vw;
            text-align: center;
            width: 38px;
            z-index: 999;
        }
        #myNightSpan:hover, #myNightSpan_2:hover {
            box-shadow: 0 0 5px green;
        }
        .collapsed_hide {
            display: none;
        }
        .signature_switch_div {
            width: 16px;
            height: 16px;
            display: block;
            position: relative;
            top: -5px;
            cursor: pointer;
            background-image: ${SIGNATURE_ICON.MINUS};
            background-size: 16px auto;
            background-repeat: no-repeat;
            background-position: center;
        }
        .signature_switch_close {
            background-image: ${SIGNATURE_ICON.ADD};
        }
        .signature_hide {
            display: none;
        }
    `;
    const COLLAPSED_IMG = {
        'YES': 'static/image/common/collapsed_yes.gif',
        'NO': 'static/image/common/collapsed_no.gif'
    };
    const URL_REG = /^[\S\s]*?(magnet:\?xt=urn:btih:(?:[a-z0-9]{40}|[a-z0-9]{32})|ftp:\/\/\S*|ed2k:\/\/\S*|thunder:\/\/\S*|flashget:\/\/\S*|qqdl:\/\/\S*|xfplay:\/\/\S*|https?:\/\/[\w零一二三四五六七八九壹贰叁肆伍陆柒捌玖-]*\.?[\w零一二三四五六七八九壹贰叁肆伍陆柒捌玖-]+\.+\w+\S*)/i;
    const DOWNLOAD_REG = /^[\S\s]*?(magnet:\?xt=urn:btih:(?:[a-z0-9]{40}|[a-z0-9]{32})|ed2k:\/\/\S*|thunder:\/\/\S*)/i;
    const WWW_REG = /^[\S\s]*?(www\.[\w-]+\.[a-z]+[\w#=%+?/-]*)/i;
    const BAIDUPAN_REG = /^https?:\/\/pan\.baidu\.com\/s(?:hare)?\/[\w=?&-]+$/i;
    const BAIDUPAN_INCLUDE_CODE_REG = /^https?:\/\/pan\.baidu\.com\/s(?:hare)?\/[\w=?#&-]+$/i;
    const CODE_REG = /(?:提取)+[^a-z0-9解压]*([a-z0-9]{4})[^a-z0-9]*/i;
    const BAIDUPAN_CODE_REG = /^(?:(?:下载)?链接\S+\s+)?(?:[^解压]+\s+)?[^a-z0-9解压]*([a-z0-9]{4})[^a-z0-9]*(?:app)?[^a-z0-9]*$/i;
    const SINGLE_CHAR_CODE_REG = /^[a-z0-9]$/i;
    const MISSING_HEADER_BAIDUPAN_REG = /^[\S\s]*?[^/\w-]?(\/?s(?:hare)?\/[\w=?-]{10,50})/i;
    const MISSING_HEADER_BAIDUPAN_TEST_REG = /^([\w=?-]{15,50})\s+[a-z0-9]{4}$/i;
    const PAN_REG = /^[\S\s]*?(pan\.baidu\.com\/s(?:hare)?\/[\w=?&-]+)/i;
    const HASH_REG = /(?:[^a-z0-9]|^)([a-z0-9]{40}|[a-z0-9]{32})(?:&dn=.*|[^a-z0-9]|$)/i;
    const MD5_REG = /(?:md5[^a-z0-9]+|sha1[^a-z0-9]+)/i;
    const CORE_VALUES_REG = /^.*?((?:富强|民主|文明|和谐|自由|平等|公正|法治|爱国|敬业|诚信|友善){10,}).*?$/i;
    const BAIJIA_REG = /^.*?([赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻福水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳唐罗薛伍余米贝姚孟顾尹江钟]{10,}).*?$/i;
    const FOYU_REG = /^.*?((?:佛曰：|如是我闻：)\S{10,}).*?$/i;
    const PREFIX_LINK_REG = {
        'MAGNET': /^https?:\/\/www\.wnflb\d*\.com\/magnet:\?xt=.*$/i,
        'MAGNET_SWITCH': /^https?:\/\/www\.wnflb\d*\.com\//i,
    };
    const PREFIX_CODE_REG = {
        'CODE': /^https?:\/\/www\.wnflb\d*\.com\/(\w+-\w+$|chrome-extension:\/\/)/i,
        'HASH': /^https?:\/\/www\.wnflb\d*\.com\/([a-z0-9]{40}|[a-z0-9]{32})$/i,
        'SWITCH': /^https?:\/\/www\.wnflb\d*\.com\//i,
    };
    const BASE_IMAGE_REG = /^https?:\/\/(data:)/i;
    const FILTER_LINK_REG = {
        'PAN_TEXT': /^https?:\/\/pan\.baidu\.com\/(?:s|share|mbox)?\/[\w#?%=/&-]*[^\w#?%=/&-]+/i,
        'POJIE': /^https?:\/\/www\.52pojie\.cn\/?#?$/i,
        'POJIE_PHP': /^https?:\/\/www\.52pojie\.cn\/(?:forum|home|misc)\.php\?/i,
        'POJIE_HTML': /^https?:\/\/www\.52pojie\.cn\/(?:forum|thread)-\d+-\d+(?:-\d+)?\.html$/i,
        'FULIBA': /^https?:\/\/www\.wnflb\d*\.com\/?$/i,
        'FULIBA_PHP': /^https?:\/\/www\.wnflb\d*\.com\/(?:home|forum)\.php\?/i,
        'FULIBA_HTML': /^https?:\/\/www\.wnflb\d*\.com\/(?:thread|forum)-\d+-\d+(?:-\d+)?\.html$/i,
        'IMDB': /^https?:\/\/www\.imdb\.com\/title\//i,
        'DOUBAN': /^https?:\/\/movie\.douban\.com\/(?:subject|celebrity)/i,
        'PHOTO_WEIBO': /^https?:\/\/photo\.weibo\.com\//i,
        'S_WEIBO': /^https?:\/\/s\.weibo\.com\/weibo\?q=/i,
        'BAIKE': /^https?:\/\/baike\.(?:so|baidu|sogou)\.com/i,
        'BILIBILI_APP': /^https?:\/\/app\.bilibili\.com/i,
        'ZHIYOO': /^https?:\/\/bbs\.zhiyoo\.com\/(?:forum|gforum)-\d+-\d+\.html/i,
        'TAG_3DM': /^https?:\/\/www\.3dmgame\.com\/tag\//i,
        'GAMES_3DM': /^https?:\/\/www\.3dmgame\.com\/games\/[^/]*\/?$/i,
        'TV432': /^https?:\/\/www\.tv432\.com\/search\.php\?searchword=/i,
        'VIIDII': /^https?:\/\/www\.viidii\.info\/\?/i,
        'DAYBOX': /^https?:\/\/www\.daybox\.net\/image\//i,
        'YIDIANZIXUN': /^https?:\/\/www\.yidianzixun\.com\/channel\//i,
        'SINA': /^https?:\/\/[\w-]*\.?sina\.com\.cn\/?/i,
        'SMZDM': /^https?:\/\/(www|post)\.smzdm\.com\/(?:fenlei|p)\//i,
        'LAOD': /^https?:\/\/laod\.cn\/tag\//i,
        'SMMIMG':/^https?:\/\/www\.smmimg\.com\/i\//i
    };
    const CORE_VALUES = '富强民主文明和谐自由平等公正法治爱国敬业诚信友善';
    const BAIJIA_VALUES = {
        "赵":"0", "钱":"1", "孙":"2", "李":"3", "周":"4", "吴":"5", "郑":"6", "王":"7", "冯":"8", "陈":"9", "褚":"a", "卫":"b", "蒋":"c", "沈":"d", "韩":"e", "杨":"f", "朱":"g", "秦":"h", "尤":"i", "许":"j", "何":"k", "吕":"l", "施":"m", "张":"n", "孔":"o", "曹":"p", "严":"q", "华":"r", "金":"s", "魏":"t", "陶":"u", "姜":"v", "戚":"w", "谢":"x", "邹":"y", "喻":"z", "福":"A", "水":"B", "窦":"C", "章":"D", "云":"E", "苏":"F", "潘":"G", "葛":"H", "奚":"I", "范":"J", "彭":"K", "郎":"L", "鲁":"M", "韦":"N", "昌":"O", "马":"P", "苗":"Q", "凤":"R", "花":"S", "方":"T", "俞":"U", "任":"V", "袁":"W", "柳":"X", "唐":"Y", "罗":"Z", "薛":".", "伍":"-", "余":"_", "米":"+", "贝":"=", "姚":"/", "孟":"?", "顾":"#", "尹":"%", "江":"&", "钟":"*"
    };
    var night_enable = GM_config.getValue('nightEnable', false);
    var switch_config = {
        'collapsedGwwzEnable': GM_config.getValue('collapsedGwwzEnable', false)
    };
    var access_num = GM_config.getValue('accessNumber', 90);
    var night_style_dom;
    var check_date = GM_config.getValue('checkDate', '2000-1-1');
    var time_start = 0;
    var old_url = location.href;
    class Good_Boy_Obj {
        constructor(config, link_array = []) {
            this.config = config;
            if (this.isMobilePage()) {
                this.floatEnable = false;
            } else {
                this.floatEnable = config.get('displayPosition') == '右侧';
            }
            this.linkArray = link_array;
            this.totalCount = link_array.length;
            this.currentCount = 0;
            this.showMoreStatus = false;
            this.insertUlStatus = false;
            this.ulNode = document.createElement('ul');
        }
        insertLinkItem(link_array = []) {
            this.linkArray = this.linkArray.concat(link_array);
            this.totalCount = this.linkArray.length;
            if (this.currentCount < this.config.get('maxLinkNumber') || this.config.get('maxLinkNumber') < 0) {
                for ( ; this.currentCount < this.totalCount && this.currentCount != this.config.get('maxLinkNumber'); this.currentCount ++) {
                    let temp_a = this.createLink(this.linkArray[this.currentCount]);
                    if (temp_a) {
                        this.ulNode.appendChild(temp_a);
                    }                    
                }
            }
            if (this.config.get('maxLinkNumber') > -1 && this.totalCount > this.config.get('maxLinkNumber')) {
                this.ulNode.getElementsByTagName('p')[0].textContent = '[共提取到 ' + this.totalCount +  ' 个链接，仅显示前 ' + this.config.get('maxLinkNumber') + ' 个]:';
                if (! this.showMoreStatus) {
                    this.ulNode.appendChild(this.showMoreLink());
                    this.showMoreStatus = true;
                }
            } else {
                this.ulNode.getElementsByTagName('p')[0].textContent = '[共提取到 ' + this.totalCount + ' 个链接]:';
            }
        }
        isMobilePage() {
            return /android|webos|iphone|ipod|blackberry/i.test(navigator.userAgent);
        }
        getCutLinkText(link_text) {
            if (this.isMobilePage()) {
                return (link_text.length >= 35) ? (link_text.slice(0, 15) + ' ... ' + link_text.slice(-10)) : (link_text);
            } else if (this.floatEnable) {
                return (link_text.length >= 50) ? (link_text.slice(0, 25) + ' ... ' + link_text.slice(-15)) : (link_text);
            }
            return (link_text.length >= 80) ? (link_text.slice(0, 45) + ' ... ' + link_text.slice(-25)) : (link_text);
        }
        managePrefixCode(input_link) {
            if (PREFIX_CODE_REG.CODE.test(input_link)) {
                return input_link.replace(PREFIX_CODE_REG.SWITCH, '');
            } else if (PREFIX_CODE_REG.HASH.test(input_link)) {
                return input_link.replace(PREFIX_CODE_REG.SWITCH, 'magnet:?xt=urn:btih:');
            }
            return input_link;
        }
        createLink(link_href) {
            if (link_href.length > 2000) {
                return null;
            }
            let link_li = document.createElement('li');
            link_li.className = 'my_good_boy_li';
            let link_a = document.createElement('a');
            link_a.title = '点击访问';
            link_href = this.managePrefixCode(link_href);
            link_a.className = 'my_good_boy_a';
            link_a.href = encodeURI(link_href);
            link_a.target = '_blank';
            link_a.textContent = this.getCutLinkText(link_href);
            link_a.style.color = this.config.get('linkColor');
            link_li.appendChild(link_a);
            if (this.config.get('copyEnable')) {
                let copy_a = document.createElement('a');
                copy_a.className = 'my_good_boy_a_copy';
                copy_a.title = '复制链接';
                copy_a.href = 'javascript:;';
                copy_a.target = '_self';
                copy_a.textContent = '复制';
                copy_a.style.color = this.config.get('linkColor');
                copy_a.addEventListener('click', function() {
                    GM_setClipboard(link_href, "text");
                    this.classList.add('a_copy_completed');
                    this.title = '复制成功';
                });
                link_li.appendChild(copy_a);
                if (BAIDUPAN_INCLUDE_CODE_REG.test(link_href) && (/#[a-z0-9]{4}$/i.test(link_href))) {
                    let code_value = /#([a-z0-9]{4})$/i.exec(link_href)[1];
                    let code_copy_a = document.createElement('a');
                    code_copy_a.className = 'my_good_boy_a_copy';
                    code_copy_a.title = '复制提取码';
                    code_copy_a.href = 'javascript:;';
                    code_copy_a.target = '_self';
                    code_copy_a.textContent = '复制提取码';
                    code_copy_a.style.color = this.config.get('linkColor');
                    code_copy_a.addEventListener('click', function() {
                        GM_setClipboard(code_value, "text");
                        this.classList.add('a_copy_completed');
                        this.title = '复制成功';
                    });
                    link_li.appendChild(code_copy_a);
                }
            }
            if (this.config.get('queryEnable')) {
                this.queryBaidupan(link_a.href, link_a); 
            }              
            if (this.config.get('checkEnable')) {
                if (BAIDUPAN_INCLUDE_CODE_REG.test(link_href)) {
                    this.checkBaidupan(link_href, link_a);
                }
            }
            return link_li;
        }
        showMoreLink() {
            let link_li = document.createElement('li');
            link_li.className = 'my_good_boy_li';
            let link_a = document.createElement('a');
            link_a.className = 'my_good_boy_a show_more_link';
            link_a.href = 'javascript:;';
            link_a.title = '显示全部提取链接';
            link_a.textContent = '显示全部';
            link_a.target = '_self';
            link_a.style.color = this.config.get('linkColor');
            link_a.addEventListener('click', () => {
                this.ulNode.removeChild(link_li);
                for ( ; this.currentCount < this.totalCount; this.currentCount ++) {
                    let temp_a = this.createLink(this.linkArray[this.currentCount]);
                    if (temp_a) {
                        this.ulNode.appendChild(temp_a);
                    }                    
                }
                this.ulNode.getElementsByTagName('p')[0].textContent = '[共提取到 ' + this.totalCount + ' 个链接]:';
                this.showMoreStatus = false;
            }, false);
            link_li.appendChild(link_a);
            return link_li;
        }
        createGoodBoyFrame(container, link_array = []) {
            if (this.insertUlStatus) {
                this.insertLinkItem(link_array);
            } else {
                let good_boy_div = document.createElement('div');
                if (this.floatEnable) {
                    good_boy_div.className = 'my_good_boy_div_float';
                } else {
                    good_boy_div.className = 'my_good_boy_div_basic';
                }
                let good_boy_p = document.createElement('p');
                good_boy_p.className = 'my_good_boy_p';
                if (this.floatEnable) {
                    good_boy_p.className = 'my_good_boy_p my_good_boy_p_float';
                }
                this.ulNode.appendChild(good_boy_p);
                this.insertLinkItem(link_array);
                good_boy_div.appendChild(this.ulNode);
                container.appendChild(good_boy_div);
                this.insertUlStatus = true;
            }
        }
        createGoodBoyElement(container ,link_obj, text_obj, node_text_array) {
            let back_link_array = this.autoEvent(container, link_obj.link_obj_array, link_obj.baidu_obj_array, link_obj.links_array, text_obj.hide_text_array, text_obj.show_text_array, node_text_array);
            if (back_link_array.length > 0) {
                this.createGoodBoyFrame(container, back_link_array);
            }
        }
        managePrefix(input_link_array) {
            let return_link_array = [];
            input_link_array.forEach(function(item) {
                return_link_array.push(PREFIX_LINK_REG.MAGNET.test(item) ? item.replace(PREFIX_LINK_REG.MAGNET_SWITCH, '') : item);
            });
            return return_link_array;
        }
        pickUpMagnet(item) {
            let temp_link = '';
            let item_1 = item.replace(/[^a-z0-9:=?/\\.&%|-]/gi, '');
            if (DOWNLOAD_REG.test(item_1)) {
                temp_link = DOWNLOAD_REG.exec(item_1)[1];
            } else {
                let item_2 = item.replace(/[^a-z0-9:=?/\\.,，。|\s+-]/gi, '');
                if ((! MD5_REG.test(item_2)) && HASH_REG.test(item_2) && (! (URL_REG.test(item_2)))) {
                    let temp_hash = HASH_REG.exec(item_2)[1];
                    if (! (/^(?:[a-z]+|[0-9]+)$/i.test(temp_hash))) {
                        temp_link = 'magnet:?xt=urn:btih:' + temp_hash;
                    }
                }
            }
            return temp_link;
        }
        manageText(text_array) {
            let temp_array = [];
            text_array.forEach((item) => {
                let temp_link = '';
                if (PAN_REG.test(item)) {
                    temp_link = 'https://' + PAN_REG.exec(item)[1];
                } else if (/magnet:|ed2k:|thunder:/i.test(item)) {
                    if (DOWNLOAD_REG.test(item)) {
                        temp_link = DOWNLOAD_REG.exec(item)[1];
                    }
                } else if (URL_REG.test(item)) {
                    temp_link = URL_REG.exec(item)[1];
                } else if (WWW_REG.test(item)) {
                    temp_link = 'http://' + WWW_REG.exec(item)[1];
                } else if (MISSING_HEADER_BAIDUPAN_REG.test(item)) {
                    let link_miss_value = MISSING_HEADER_BAIDUPAN_REG.exec(item)[1];
                    temp_link = (/^\//i.test(link_miss_value)) ? ('https://pan.baidu.com' + link_miss_value) : ('https://pan.baidu.com/' + link_miss_value);
                } else if (MISSING_HEADER_BAIDUPAN_TEST_REG.test(item)) {
                    temp_link = 'https://pan.baidu.com/s/' + MISSING_HEADER_BAIDUPAN_TEST_REG.exec(item)[1];
                } else if ((! MD5_REG.test(item)) && HASH_REG.test(item)) {
                    temp_link = 'magnet:?xt=urn:btih:' + HASH_REG.exec(item)[1];
                } else if (item.length > 32) {
                    temp_link = this.pickUpMagnet(item);
                }
                if (filter_Link(temp_link)) {
                    temp_array.push(temp_link);
                }
            });
            return this.managePrefix(temp_array);
        }
        decodeLink(input_link_array) {
            input_link_array.forEach(function(item, index) {
                if (URL_REG.test(item)) {
                    input_link_array[index] = decodeURI(item);
                }
            });
            return input_link_array;
        }
        pickUpBaidupanCode(text_array) {
            let code_array = [];
            let char_array = [];
            for (let i = 0; i < text_array.length; i ++) {
                let temp_value = '';
                if (CODE_REG.test(text_array[i])) {
                    temp_value = CODE_REG.exec(text_array[i])[1];
                } else if (BAIDUPAN_CODE_REG.test(text_array[i])) {
                    temp_value = BAIDUPAN_CODE_REG.exec(text_array[i])[1];
                } else if (SINGLE_CHAR_CODE_REG.test(text_array[i])) {
                    char_array.push(text_array[i]);
                }
                if (temp_value && (!(/\d{4}/i.test(temp_value))) && (code_array.indexOf(temp_value) === -1)) {
                    code_array.push(temp_value);
                }
            }
            while ((char_array.length > 0) && (char_array.length % 4 === 0)) {
                let temp_code = char_array.splice(0, 4);
                let char_value = temp_code.join("");
                if ((!(/\d{4}/i.test(char_value))) && (code_array.indexOf(char_value) === -1)) {
                    code_array.push(char_value);
                }
            }
            return code_array;
        }
        manageRepeatArray(input_link_array) {
            let output_link_array = [];
            for (let i = 0, l = input_link_array.length; i < l; i++) {
                for (let j = i + 1; j < l; j++) {
                    if (get_Pure_Link(input_link_array[i]) === get_Pure_Link(input_link_array[j])) {
                        ++i;
                        j = i;
                    }
                }
                output_link_array.push(input_link_array[i]);
            }
            return output_link_array;
        }
        autoEvent(container, link_obj_array, baidu_obj_array, _links_array, hide_text_array, show_text_array, node_text_array) {
            let link_array = [];
            let link_text_array = [];
            link_obj_array.forEach(function(item) {
                link_array.push(item.ele_value);
                link_text_array.push(item.ele_container);
            });
            let concat_text_array = this.manageRepeatArray(this.decodeLink(hide_text_array));
            let concat_link_array = this.manageRepeatArray(this.decodeLink(this.manageText(link_array.concat(concat_text_array))));
            let general_text_array = show_text_array.concat(node_text_array.concat(link_text_array));
            let index_a = [];
            let code_b = this.pickUpBaidupanCode(concat_text_array);
            let code_c = [];
            if (code_b.length > 0) {
                for (let j = 0; j < concat_link_array.length; j ++) {
                    if (BAIDUPAN_REG.test(concat_link_array[j])) {
                        index_a.push(j);
                    }
                }
                if (code_b.length === index_a.length) {
                    for (let k = 0; k < index_a.length; k ++) {
                        concat_link_array[index_a[k]] += ('#' + code_b[k]);
                    }
                } else if (code_b.length === baidu_obj_array.length) {
                    for (let l =0; l < baidu_obj_array.length; l ++) {
                        baidu_obj_array[l].ele.textContent = baidu_obj_array[l].ele_container + '#' + code_b[l];
                        baidu_obj_array[l].ele.href = baidu_obj_array[l].ele_value + '#' + code_b[l];
                    }
                }
            } else {
                code_c = this.pickUpBaidupanCode(general_text_array);
                if (code_c.length > 0) {
                    for (let j = 0; j < concat_link_array.length; j ++) {
                        if (BAIDUPAN_REG.test(concat_link_array[j])) {
                            index_a.push(j);
                        }
                    }
                    if (code_c.length === index_a.length) {
                        for (let k = 0; k < index_a.length; k ++) {
                            concat_link_array[index_a[k]] += ('#' + code_c[k]);
                        }
                    } else if (code_c.length === baidu_obj_array.length) {
                        for (let l =0; l < baidu_obj_array.length; l ++) {
                            baidu_obj_array[l].ele.textContent = baidu_obj_array[l].ele_container + '#' + code_c[l];
                            baidu_obj_array[l].ele.href = baidu_obj_array[l].ele_value + '#' + code_c[l];
                        }
                    }
                }
            }
            let hash_array = [];
            general_text_array.forEach((item) => {
                if (! URL_REG.test(item)) {
                    if ((! MD5_REG.test(item)) && (HASH_REG.test(item))) {
                        hash_array.push('magnet:?xt=urn:btih:' + HASH_REG.exec(item)[1]);
                    } else if (item.length > 32) {
                        let temp_link = this.pickUpMagnet(item);
                        if (temp_link) {
                            hash_array.push(temp_link);
                        }
                    }
                }
            });
            hash_array = this.decodeLink(hash_array);
            concat_link_array = this.manageRepeatArray(concat_link_array.concat(hash_array));
            if (this.config.get('checkEnable')) {
                for (let pan_index = 0; pan_index < baidu_obj_array.length; pan_index ++) {
                    this.checkBaidupan(baidu_obj_array[pan_index].ele_value, baidu_obj_array[pan_index].ele);
                }
            }
            if (this.config.get('queryEnable')) {
                for (let query_index = 0; query_index < baidu_obj_array.length; query_index ++) {
                    this.queryBaidupan(baidu_obj_array[query_index].ele.href, baidu_obj_array[query_index].ele);
                }
            }
            let hide_code_text_array = this.decodeCoreValues(container, hide_text_array.concat(general_text_array));
            if (hide_code_text_array.length > 0) {
                concat_link_array = this.manageRepeatArray(concat_link_array.concat(hide_code_text_array));
            }
            return concat_link_array;
        }
        foyuPromise(encoded) {
            return new Promise(function(resolve, _reject) {
                let details = {
                    'method': 'POST',
                    'url': 'http://keyfc.net/bbs/tools/tudou.aspx',
                    'data': 'orignalMsg=' + encoded.replace(/\s/g, '') + '&action=Decode',
                    'headers': {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    'onload': function(res) {
                        if (res.status == 200 && res.readyState == 4) {
                            resolve(res.responseText.replace(/^<BUDDHIST><Message><!\[CDATA\[|\]\]><\/Message><\/BUDDHIST>$/g, ''));
                        } else {
                            console.warn('福利吧论坛 - 好孩子看得见:\n自动解码出错！');
                            resolve('');
                        }
                    },
                    'onerror': function() {
                        console.error('福利吧论坛 - 好孩子看得见:\n网络链接出错！');
                        resolve('');
                    }
                };
                GM_xmlhttpRequest(details);
            });
        }
        async foyuDecode(container, encoded) {
            await this.foyuPromise(encoded).then((data) => {
                if (data) {
                    this.createGoodBoyFrame(container, [data]);
                }
            });
        }
        decodeCoreValues(container, text_array) {
            let decode_array = [];
            text_array.forEach((item) => {
                if (CORE_VALUES_REG.test(item)) {
                    decode_array.push(core_Values_Decode(CORE_VALUES_REG.exec(item)[1]));
                } else if (BAIJIA_REG.test(item)) {
                    decode_array.push(baijia_Decode(BAIJIA_REG.exec(item)[1]));
                } else if (FOYU_REG.test(item)) {
                    this.foyuDecode(container, FOYU_REG.exec(item)[1]);
                }
            });
            return decode_array;
        }
        queryBaidupan(link_value, link_dom) {
            if (BAIDUPAN_REG.test(link_value, link_dom)) {
                let temp_time = 0;
                let time_now = new Date().getTime();
                if (time_now - time_start < 2000) {
                    temp_time = time_start - time_now + 2000;
                    time_start += 2000;
                } else {
                    time_start = time_now;
                }
                setTimeout(function() {
                    let details = {
                        'method': 'GET',
                        'url': 'http://search.pandown.cn/api/query?surl=' + link_value.split('/').pop(),
                        'responseType': 'json',
                        'headers': {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        'onload': function(res) {
                            try {
                                if ((res.response.code === 0) && (res.response.data[0].password)) {
                                    link_dom.href = link_value + '#' + res.response.data[0].password;
                                    link_dom.textContent = link_dom.textContent + '#' + res.response.data[0].password;
                                    console.info('福利吧论坛 - 好孩子看得见:\n查询成功。\n', link_dom.href);
                                } else {
                                    console.info(res.response.message);
                                }
                            } catch (e) {
                                console.error(e);
                            }
                        },
                        'onerror': function() {
                            console.warn('福利吧论坛 - 好孩子看得见:\n网络连接失败。\n', 'http://search.pandown.cn/api/query?surl=' + link_value.split('/').pop());
                        }
                    };
                    GM_xmlhttpRequest(details);
                }, temp_time); 
            }
        }
        checkBaidupan(link_value, link_dom) {
            let pan_details = {
                method: 'GET',
                url: link_value,
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                onload: function(res) {
                    if ((res.responseText.indexOf('此链接分享内容可能因为涉及侵权') !== -1) || (res.responseText.indexOf('你所访问的页面不存在了') !== -1) || (res.responseText.indexOf('分享的文件已经被取消了') !== -1)) {
                        link_dom.classList.add('link_faild');
                        link_dom.title = '链接资源已经失效!';
                    } else {
                        link_dom.title = '链接资源正常。';
                    }
                },
                onerror: function() {
                    console.wran('福利吧论坛 - 好孩子看得见:\n网络连接失败。\n', link_value);
                }
            };
            GM_xmlhttpRequest(pan_details);
        }
    }
    function rand_Bin(){
        return Math.random() >= 0.5;
    }
    function str_2_Utf8(str){
        let not_encoded = /[A-Za-z0-9\-_.!~*'()]/g;
        let str1 = str.replace(not_encoded, c => c.codePointAt(0).toString(16) );
        let str2 = encodeURIComponent(str1);
        let concated = str2.replace(/%/g, '').toUpperCase();
        return concated;
    }
    function hex_2_Duo(hexs){
        let duo = [];
        for(let c of hexs){
            let n = Number.parseInt(c, 16);
            if(n < 10){
                duo.push(n);
            }else{
                if(rand_Bin()){
                    duo.push(10);
                    duo.push(n - 10);
                }else{
                    duo.push(11);
                    duo.push(n - 6);
                }
            }
        }
        return duo;
    }
    function utf8_2_Str(utfs){
        let l = utfs.length;
        let splited = [];
        for(let i = 0; i < l; i++){
            if((i & 1) === 0){
                splited.push('%');
            }
            splited.push(utfs[i]);
        }
        return decodeURIComponent(splited.join(''));
    }
    function duo_2_Hex(duo){
        let hex = [];
        let l = duo.length;
        let i = 0;
        while(i < l){
            if(duo[i] < 10){
                hex.push(duo[i]);
            }else{
                if(duo[i] === 10){
                    i++;
                    hex.push(duo[i] + 10);
                }else{
                    i++;
                    hex.push(duo[i] + 6);
                }
            }
            i++;
        }
        return hex.map( v => v.toString(16).toUpperCase() ).join('');
    }
    function duo_2_Values(duo){
        return duo.map( d => CORE_VALUES[2*d] + CORE_VALUES[2*d+1] ).join('');
    }
    function core_Values_Encode(str){
        return duo_2_Values(hex_2_Duo(str_2_Utf8(str)));
    }
    function core_Values_Decode(encoded){
        let duo = [];
        for(let c of encoded){
            let i = CORE_VALUES.indexOf(c);
            if(i === -1){
                continue;
            }else if(i & 1){
                continue;
            }else{
                duo.push(i >> 1);
            }
        }
        let hexs = duo_2_Hex(duo);
        let str;
        try{
            str = utf8_2_Str(hexs);
        } catch (e) {
            throw e;
        }
        return str;
    }
    function is_Float(str) {
        return str == '右侧';
    }
    function baijia_Encode(str) {
        str = str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        let v = str.replace(/magnet:\?xt=urn:btih:/, "");
        let strc = v.split("");
        let a = '';
        for(let i = 0; i < strc.length; i ++){
            for (let key in BAIJIA_VALUES) {
                if (BAIJIA_VALUES[key] === strc[i]) {
                    a += key;
                    break;
                }
            }
        }
        return a;
    }
    function baijia_Decode(encoded) {
        let char_array = encoded.split("");
        let str = '';
        for (let i = 0; i < char_array.length; i ++) {
            if (BAIJIA_VALUES[char_array[i]]) {
                str += BAIJIA_VALUES[char_array[i]];
            }
        }
        if (/^https?\/\/[\w-]*\.*[\w-]+\.+\w+/i.test(str)) {
            return str.replace('https//', 'https://').replace('http//', 'http://');
        } else {
            return 'magnet:?xt=urn:btih:' + str;
        }
    }
    function convert_Chinese_Number(text_string) {
        return text_string.replace(/[零一二三四五六七八九壹贰叁肆伍陆柒捌玖]/gi, (arg0) => {
            let index = '零一二三四五六七八九'.indexOf(arg0);
            if (index === -1) {
                index = '壹贰叁肆伍陆柒捌玖'.indexOf(arg0) + 1;
            }
            return index;
        });
    }
    function filter_Link(input_link) {
        let status = true;
        if (input_link) {
            for (let i in FILTER_LINK_REG) {
                if (FILTER_LINK_REG[i].test(input_link)) {
                    status = false;
                    break;
                }
            }
        } else {
            status = false;
        }
        return status;
    }
    function get_Pure_Link(input_link, depth_boolean) {
        let output_link = input_link;
        if (depth_boolean) {
            if (BAIDUPAN_INCLUDE_CODE_REG.test(output_link)) {
                if (/#[a-z0-9]{4}$/i.test(output_link)) {
                    output_link = output_link.replace(/#[a-z0-9]{4}$/i, '');
                }
            } else if (/^https?:\/\/www\.bilibili\.com\/video\/av\d+\?from=search/i.test(output_link)) {
                output_link = output_link.replace(/\?from=search.*/, '');
            }     
        }
        let return_link = output_link.replace(/(^(?:\s+)?(?:\[url\])?(?:\s+)?(?:https?:\/\/)?|(?:\/+)?(?:\s+)?(?:\[\/url\])?$|%C2%A0$)/gi, '').replace(/%C2%A0/gi,'%20');
        try {
            return_link = decodeURI(return_link);
        } catch(e) {
            console.warn('福利吧论坛 - 好孩子看得见:\n出现一处编码转换错误。', output_link);
            console.warn(e);
            return_link = output_link.replace(/(^(?:\s+)?(?:\[url\])?(?:\s+)?(?:https?:\/\/)?|(?:\/+)?(?:\s+)?(?:\[\/url\])?$|%C2%A0$)/gi, '').replace(/%C2%A0/gi,'%20');
        }
        return return_link;
    }
    function contrast_Text_And_Link(text_value, link_value)
    {
        let status = true;
        text_value = get_Pure_Link(text_value, true);
        link_value = get_Pure_Link(link_value, true);
        if (/\s...\s/i.test(text_value)) {
            status = false;
        } else if (text_value === link_value) {
            status = false;
        }
        return status;
    }
    function find_Link(container) {
        let link_a = container.getElementsByTagName('a');
        let temp_obj = {
            link_obj_array: [],
            baidu_obj_array: [],
            links_array: [],
        };
        let temp_baidu_array = [];
        for (let i = 0; i < link_a.length; i ++) {
            if (link_a[i].closest('div.aimg_tip')) {
                continue;
            }
            let temp_link = link_a[i].href;
            if (filter_Link(temp_link)) {
                let temp_img =link_a[i].querySelectorAll('img');
                if ((temp_img.length === 0) || ((temp_img.length > 0) && (temp_img[0].src !== temp_link) && (temp_img[0].getAttribute('file') !== temp_link))) {
                    let temp_text = link_a[i].innerText.replace(/^\s+|\s+$/gi, '');
                    if (contrast_Text_And_Link(temp_text, temp_link)) {
                        let link_obj = {
                            ele_value: temp_link,
                            ele_container: temp_text,
                            ele: link_a[i],
                        };
                        temp_obj.link_obj_array.push(link_obj);
                    } else if (BAIDUPAN_REG.test(temp_link)) {
                        let baidu_obj = {
                            ele_value: temp_link,
                            ele_container: temp_text,
                            ele: link_a[i],
                        };
                        if (temp_baidu_array.indexOf(temp_link) === -1) {
                            temp_baidu_array.push(temp_link);
                            temp_obj.baidu_obj_array.push(baidu_obj);
                        }
                    }
                }
                if (temp_obj.links_array.indexOf(temp_link) === -1) {
                    temp_obj.links_array.push(temp_link);
                }
            }
        }
        return temp_obj;
    }
    function judge_Color(rgb_color_value) {
        if (/rgb\(/i.test(rgb_color_value)) {
            let rgb_value = rgb_color_value.replace('rgb(', '').replace(')', '');
            let rgb_value_array = rgb_value.split(',');
            let gray_level = rgb_value_array[0] * 0.299 + rgb_value_array[1] * 0.587 + rgb_value_array[2] * 0.114;
            return gray_level > 192;
        } else if (/rgba\(/i.test(rgb_color_value)) {
            let rgba_value = rgb_color_value.replace('rgba(', '').replace(')', '');
            let rgba_value_array = rgba_value.split(',');
            if (rgba_value_array[3] <= 0.2) {
                return true;
            } else {
                let gray_level_2 = rgba_value_array[0] * 0.299 + rgba_value_array[1] * 0.587 + rgba_value_array[2] * 0.114;
                return gray_level_2 > 192;
            }
        }
        return false;
    }
    function rgb_To_Rgba(color_string) {
        let color_value = color_string.match(/\d+/g);
        if (color_value.length === 3) {
            return 'rgba(' + color_value[0] + ', ' + color_value[1] + ', ' + color_value[2] + (', 1)');
        }
        return color_string;
    }
    function display_Text(container, new_text_color, new_text_background_color) {
        let text_font = container.getElementsByTagName('font');
        let temp_obj = {
            hide_text_array: [],
            show_text_array: [],
        };
        for (let i = 0; i < text_font.length; i++) {
            if ((text_font[i].closest('.quote')) || (text_font[i].getElementsByClassName('aimg_tip').length !== 0)) {
                continue;
            }
            let temp_text = text_font[i].innerText.replace(/^\s+|\s+$/gi, '');
            if (!/^\s*$/i.test(temp_text)) {
                let text_color = window.getComputedStyle(text_font[i]).color;
                let text_background_color = window.getComputedStyle(text_font[i]).backgroundColor;
                if ((judge_Color(text_color)) && (judge_Color(text_background_color))) {
                    text_font[i].style.color = new_text_color;
                    temp_obj.hide_text_array.push(temp_text);
                } else if (rgb_To_Rgba(text_background_color) === rgb_To_Rgba(text_color)) {
                    text_font[i].style.backgroundColor = new_text_background_color;
                    text_font[i].style.color = new_text_color;
                    temp_obj.hide_text_array.push(temp_text);
                } else if ((!judge_Color(text_background_color)) && (!judge_Color(text_color))) {
                    text_font[i].style.backgroundColor = new_text_background_color;
                    text_font[i].style.color = new_text_color;
                    temp_obj.hide_text_array.push(temp_text);
                } else if (text_font[i].childNodes.length === 1 && text_font[i].childNodes[0].nodeType === 3) {
                    if (GM_config.get('extractEnable')) {
                        if (URL_REG.test(temp_text)) {
                            text_font[i].innerHTML = text_font[i].innerHTML.replace(URL_REG, (_arg0, arg1) => {
                                return '<a href="' + convert_Chinese_Number(arg1) + '" title="点击访问" target="_blank">' + convert_Chinese_Number(arg1) + '</a>';
                            });
                        }
                    }
                    if (!temp_obj.show_text_array.includes(temp_text)) {
                        temp_obj.show_text_array.push(temp_text);
                    }
                } else if (text_font[i].childNodes.length > 1) {
                    let t_font = text_font[i].childNodes;
                    for (let child_index = 0; child_index < t_font.length; child_index++) {
                        analysis_Text(t_font[child_index]);
                    }
                    if (!temp_obj.show_text_array.includes(temp_text)) {
                        temp_obj.show_text_array.push(temp_text);
                    }
                }
            }
        }
        let temp_table = container.getElementsByTagName('table');
        for (let j = 0; j < temp_table.length; j ++) {
            if ((! judge_Color(temp_table[j].style.backgroundColor)) && (! judge_Color(temp_table[j].style.color))) {
                temp_table[j].style.backgroundColor = new_text_background_color;
            } else if ((judge_Color(temp_table[j].style.color)) && (judge_Color(temp_table[j].style.backgroundColor))) {
                temp_table[j].style.color = new_text_color;
            }
        }
        return temp_obj;
    }
    function text_2_A(node) {
        let temp_span = document.createElement('span');
        temp_span.innerHTML = node.nodeValue.replace(URL_REG, (arg0, arg1) => {
            if (arg1.length > 2000) {
                return arg0;
            }
            return arg0.replace(arg1, '<a href="' + convert_Chinese_Number(arg1) + '" title="点击访问" target="_blank">' + convert_Chinese_Number(arg1) + '</a>');
        });
        node.parentNode.replaceChild(temp_span, node);
    }
    function analysis_Text(dom_point) {
        let node_list = dom_point.childNodes;
        let node_text_array = [];
        for (let i = 0; i < node_list.length; i ++) {
            if (node_list[i].nodeType === 3) {
                let temp_text = node_list[i].nodeValue.replace(/^\s+|\s+$/gi, '');
                if (! /^\s*$/i.test(temp_text)) {
                    if (GM_config.get('extractEnable')) {
                        if (URL_REG.test(temp_text)) {
                            text_2_A(node_list[i]);
                        }
                    }
                    node_text_array.push(temp_text);
                }
            } else if ((node_list[i].nodeType === 1) && (! node_list[i].className.includes('quote')) && (! node_list[i].className.includes('pstatus')) && (! node_list[i].className.includes('aimg_tip')) && (! node_list[i].className.includes('blockcode')) && (node_list[i].nodeName !== 'FONT') && (node_list[i].nodeName !== 'A') && (node_list[i].nodeName !== 'SCRIPT') && (node_list[i].childNodes.length > 0)) {
                let recursive_array = analysis_Text(node_list[i]);
                for (let j = 0; j < recursive_array.length; j ++) {
                    node_text_array.push(recursive_array[j]);
                }
            }
        }
        return node_text_array;
    }
    function is_Mobile_Page() {
        return /android|webos|iphone|ipod|blackberry/i.test(navigator.userAgent);
    }
    function get_Now_Date() {
        let now = new Date();
        return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    }
    function time_Add_Zero(value) {
        return (value < 10) ? '0' + value : value;
    }
    function get_Update_Time(unix_time) {
        if (unix_time) {
            let temp_time = new Date(unix_time);
            return ' (更新时间: ' + temp_time.getFullYear() + '-' + time_Add_Zero(temp_time.getMonth() + 1) + '-' + time_Add_Zero(temp_time.getDate()) + ' ' + time_Add_Zero(temp_time.getHours()) + ':' + time_Add_Zero(temp_time.getMinutes()) + ':' + time_Add_Zero(temp_time.getSeconds()) + ')';
        }
        return '';
    }
    function highlight_Post() {
        try {
            let user_access_num = 90;
            let upmime_num = document.getElementById('g_upmine').textContent;
            upmime_num = /LV\.(-?[0-9])/.exec(upmime_num)[1];
            if (upmime_num == -1) {
                user_access_num = 0;
            } else if (upmime_num == 0) {
                user_access_num = 5;
            } else if (upmime_num >= 1 && upmime_num <= 8) {
                user_access_num = upmime_num * 10;
            }
            if (access_num != user_access_num) {
                access_num = user_access_num;
                GM_config.setValue('accessNumber', access_num);
            }
        } catch (e) {
            console.warn('福利吧论坛 - 好孩子看得见:\n识别用户阅读权限出错，将使用存储中记录的用户阅读权限。');
        }
        console.debug('福利吧论坛 - 好孩子看得见:\n用户阅读权限:', access_num);
        document.arrive('div#threadlist form table tbody', {onceOnly: true}, function() {
            let item = this.querySelectorAll('.common, .new, .lock')[0];
            if (item) {
                let read_num = item.querySelector('.xw1');
                let temp_status = true;
                if (read_num) {
                    read_num = Number(read_num.textContent);
                    if (read_num > 90) {
                        item.querySelector('.xst').setAttribute('style', 'color: #999; font-weight: bold; text-decoration-line: line-through; text-decoration-color: #000000;');
                        temp_status = false;
                    } else if (read_num > access_num) {
                        item.querySelector('.xst').setAttribute('style', 'color: #999; font-weight: bold;');
                        temp_status = false;
                    }
                }
                if (temp_status && item.querySelector('.xst').style.fontWeight === '700') {
                    temp_status = false;
                }
                if (temp_status) {
                    let agree_num = 0;
                    let font_ele = item.querySelectorAll('font');
                    for (let j = 0; j < font_ele.length; j ++) {
                        let font_num = font_ele[j].textContent;
                        if (font_num) {
                            font_num = Number(font_num.replace('+', ''));
                            if (font_num > agree_num) {
                                agree_num = font_num;
                            }
                        }
                    }
                    if (agree_num > 0) {
                        if (agree_num >= GM_config.get('agreeThreshold')) {
                            item.querySelector('.xst').setAttribute('style', 'font-weight: bold; color: ' + GM_config.get('agreeColor') + ';');
                            temp_status = false;
                        }
                    }
                }
                if (temp_status) {
                    let reply_num = item.parentNode.querySelector('td.num a').textContent;
                    if (reply_num) {
                        reply_num = Number(reply_num);
                        if (reply_num >= GM_config.get('replyTHreshold')) {
                            item.querySelector('.xst').setAttribute('style', 'font-weight: bold; color: ' + GM_config.get('replyColor') + ';');
                        }
                    }
                }
            }
        });
    }
    function create_Settings_Icon() {
        let icon_span = document.createElement('span');
        icon_span.id = 'settingsIcon';
        icon_span.title = '打开好孩子看得见设置';
        icon_span.addEventListener('click', function() {
            GM_config.open();
        });
        return icon_span;
    }
    function operate_Code(input_id, output_id, callback, wait_str = '') {
        let str = document.getElementById(input_id).value;
        if (str) {
            document.getElementById(output_id).value = wait_str;
            let result = callback(str, output_id);
            if (result) {
                document.getElementById(output_id).value = result;
            }
        }
    }
    function copy_Code(copy_btn, result_id) {
        let copy_str = document.getElementById(result_id).value;
        if (copy_str) {
            GM_setClipboard(copy_str, "text");
            copy_btn.title = '复制成功';
            copy_btn.classList.add('a_copy_completed');
        }
    }
    function create_Switch_Span(key_value, dom_array) {
        let switch_span = document.createElement('span');
        switch_span.className = 'o';
        let switch_img = document.createElement('img');
        switch_img.id = key_value + '_user_img';
        switch_img.title = '收起/展开';
        switch_img.alt = '收起/展开';
        if (switch_config[key_value]) {
            dom_array.forEach(function(item) {
                item.classList.add('collapsed_hide');
            });
            switch_img.src = COLLAPSED_IMG.YES;
        } else {
            switch_img.src = COLLAPSED_IMG.NO;
        }
        switch_img.addEventListener('click', function() {
            if (switch_config[key_value]) {
                dom_array.forEach(function(item) {
                    item.classList.remove('collapsed_hide');
                });
                switch_img.src = COLLAPSED_IMG.NO;
                switch_config[key_value] = false;
            } else {
                dom_array.forEach(function(item) {
                    item.classList.add('collapsed_hide');
                });
                switch_img.src = COLLAPSED_IMG.YES;
                switch_config[key_value] = true;
            }
            GM_config.setValue(key_value, switch_config[key_value]);
        });
        switch_span.appendChild(switch_img);
        return switch_span;
    }
    function create_Signature_Switch(signature, switch_status = true) {
        let switch_div = document.createElement('div');
        switch_div.className = 'signature_switch_div';
        if (switch_status) {
            switch_div.title = '收起';
        } else {
            switch_div.title = '展开';
            switch_div.classList.add('signature_switch_close');
            signature.classList.add('signature_hide');
        }
        switch_div.addEventListener('click', function() {
            if (switch_status) {
                switch_status = false;
                switch_div.title = '展开';
                switch_div.classList.add('signature_switch_close');
                signature.classList.add('signature_hide');
            } else {
                switch_status = true;
                switch_div.title = '收起';
                switch_div.classList.remove('signature_switch_close');
                signature.classList.remove('signature_hide');
            }
        }, false);
        return switch_div;
    }
    function mobile_Init() {
        if (GM_config.get('highlightEnable')) {
            if ((old_url.indexOf('mod=forumdisplay') !== -1) || (/forum-\d+-\d+\.html/i.test(old_url))) {
                document.body.arrive('.threadlist li', {fireOnAttributesModification: true, existing: true}, function() {
                    let reply_num = this.querySelector('span.num.icon.iconfont').textContent;
                    if (reply_num) {
                        reply_num = Number(/\d+/.exec(reply_num)[0]);
                        if (reply_num >= GM_config.get('replyTHreshold')) {
                            this.querySelector('div.thread-item-sub').setAttribute('style', 'font-weight: bold; color: ' + GM_config.get('replyColor') + ';');
                        }
                    }
                });
            }
        }
        if ((old_url.indexOf('mod=viewthread') !== -1) || (/thread-\d+-\d+(?:-\d+)?\.html/i.test(old_url))) {
            let phone_background_color = window.getComputedStyle(document.body).backgroundColor;
            let message_dom = document.querySelectorAll('.message');
            for (let message_ele of message_dom) {
                let text_obj = display_Text(message_ele, GM_config.get('textColor'), phone_background_color);
                let text_array = analysis_Text(message_ele);
                let link_obj = find_Link(message_ele);
                let good_boy_obj = new Good_Boy_Obj(GM_config);
                good_boy_obj.createGoodBoyElement(message_ele, link_obj, text_obj, text_array);
            }
        }
        if (GM_config.get('autoCheckInEnable')) {
            document.body.arrive('.bg > a', {onceOnly: true, existing: true}, function(item) {
                if (item.textContent === '签到领奖') {
                    let now_date = get_Now_Date();
                    if (now_date !== check_date) {
                        GM_config.setValue('checkEnable', now_date);
                        setTimeout(function() {
                            item.click();
                        }, 2000);
                        console.info('福利吧论坛 - 好孩子看得见:\n完成自动签到。');
                    }
                }
            });
        }
    }
    function pc_Init() {
        if ((old_url.indexOf('mod=forumdisplay') !== -1) || (/forum-\d+-\d+\.html/i.test(old_url))) {
            if ((old_url.indexOf('fid=37') !== -1) || (/forum-37-/i.test(old_url))) {
                document.arrive('div.bm_h.cl', {fireOnAttributesModification: true, onceOnly: true, existing: true}, function() {
                    if (this.querySelectorAll('span.y').length === 0) {
                        let theme_array = [];
                        theme_array.push(this.nextElementSibling);
                        this.insertBefore(create_Switch_Span('collapsedGwwzEnable', theme_array), this.childNodes[0]);
                    }
                });                        
            }
            if (GM_config.get('highlightEnable')) {
                highlight_Post();
            }
            if (GM_config.get('visitedEnable')) {
                let visited_style = '.tl th a.s.xst:visited, .tl td.fn a:visited { color: ' + GM_config.get("visitedColor") + ' !important; }';
                GM_addStyle(visited_style);
                console.debug('福利吧论坛 - 好孩子看得见:\n完成注入自定义己访问帖子的样式。');
            }
        }
        if ((old_url.indexOf('mod=viewthread') !== -1) || (/thread-\d+-\d+(?:-\d+)?\.html/i.test(old_url))) {
            document.addEventListener('DOMContentLoaded', function() {
                let t_f_img = document.querySelectorAll('td.t_f img');
                for (let img_ele of t_f_img) {
                    let base_src = img_ele.getAttribute('file');
                    if (BASE_IMAGE_REG.test(base_src)) {
                        base_src = base_src.replace(BASE_IMAGE_REG, '$1');
                        img_ele.setAttribute('file', base_src);
                        img_ele.src = base_src;
                    }
                }
                let zoom_img = document.querySelectorAll('.t_f img.zoom');
                for (let zoom_ele of zoom_img) {
                    zoom_ele.removeAttribute('height');
                }
                let html_background_color = window.getComputedStyle(document.body).backgroundColor;
                let t_f_dom = document.querySelectorAll('td.t_f');
                for (let dom_ele of t_f_dom) {
                    let good_boy_obj = new Good_Boy_Obj(GM_config);
                    if (is_Float(GM_config.get('displayPosition'))) {
                        let favatar_btn = dom_ele.closest('table.plhin').querySelector('div.favatar');
                        let text_obj = display_Text(dom_ele, GM_config.get('textColor'), html_background_color);
                        let text_array = analysis_Text(dom_ele);
                        let link_obj = find_Link(dom_ele);
                        good_boy_obj.createGoodBoyElement(favatar_btn, link_obj, text_obj, text_array);
                    } else {
                        let main_btn = dom_ele.closest('div.pcb').querySelector('div.t_fsz');
                        let text_obj = display_Text(dom_ele, GM_config.get('textColor'), html_background_color);
                        let text_array = analysis_Text(dom_ele);
                        let link_obj = find_Link(dom_ele);
                        good_boy_obj.createGoodBoyElement(main_btn, link_obj, text_obj, text_array);
                    }
                }
                let sign_a = document.querySelectorAll('div.sign a');
                for (let sign_ele of sign_a) {
                    if (/member\.php\?mod=logging&action=logout/i.test(sign_ele.href)) {
                        sign_ele.style.display = 'none';
                    }
                }
                if (GM_config.get('signatureEnable')) {
                    let sign = document.querySelectorAll('div.sign');
                    let sign_status = GM_config.get('signatureSwitch') == '展开';
                    for (let sign_item of sign) {
                        sign_item.insertAdjacentElement('beforebegin', create_Signature_Switch(sign_item, sign_status));
                    }
                }
            }, false);
            if (GM_config.get('clickEnable')) {
                document.arrive('.buttona', {fireOnAttributesModification: true, onceOnly: true, existing: true}, function () {
                    let click_status = true;
                    let uid_href = document.querySelector('.vwmy a').href;
                    let uid = /&uid=(\d+)/.exec(uid_href)[1];
                    let ratl_l = document.querySelectorAll('.ratl_l tr');
                    for (let ra = 0; ra < ratl_l.length; ra++) {
                        let rate_id = ratl_l[ra].id.replace(/rate_\d+_/, '');
                        if (rate_id === uid) {
                            click_status = false;
                            break;
                        }
                    }
                    if (click_status) {
                        document.querySelector(".buttona").click();
                        if (document.querySelectorAll('.ratl_l tr').length > ratl_l.length) {
                            location.reload();
                        } else {
                            document.querySelector('#postlist > div').leave('.t_f', function() {
                                location.reload();
                            });
                        }
                    }
                });
            }
        }
        if (GM_config.get('autoCheckInEnable')) {
            document.arrive('#fx_checkin_topb', {fireOnAttributesModification: true, onceOnly: true, existing: true}, function() {
                if (this.getElementsByTagName('img')[0].alt !== '已签到') {
                    if (typeof (fx_checkin) === 'function') {
                        this.click();
                    } else {
                        setTimeout(() => {
                            this.click();
                        }, 2000);
                    }
                    console.info('福利吧论坛 - 好孩子看得见:\n自动签到完成。');
                }
            });
        }
        if (GM_config.get('codeEnable') || GM_config.get('nightBtnEnable')) {
            document.addEventListener('DOMContentLoaded', function() {
                let expand_box = document.createElement('div');
                expand_box.className = 'expand_box';
                if (GM_config.get('codeEnable') && GM_config.get('nightBtnEnable')) {
                    expand_box.className = 'expand_box_h';
                }
                expand_box.onmouseenter = function() {
                    this.classList.add('show_expand_box');
                };
                expand_box.onmouseleave = function() {
                    this.classList.remove('show_expand_box');
                };
                if (GM_config.get('codeEnable')) {
                    let code_frame = document.createElement('div');
                    document.body.appendChild(code_frame);
                    var code_panel = new GM_configStruct({
                        'id': 'myCodePanel',
                        'title': '编解码工具',
                        'isTabs': true,
                        'skin': 'tab',
                        'frame': code_frame,
                        'css': CODE_PANEL_STYLE,
                        'fields': {
                            'bjxInput': {
                                'label': '输入:',
                                'section': ['百家姓', GM_config.create('a', {
                                    'textContent': '百家姓编码原示例地址',
                                    'title': '点击跳转到百家姓编码示例',
                                    'target': '_blank',
                                    'href': 'https://fulibus.net/anhao.html',
                                })],
                                'type': 'textarea',
                                'labelPos': 'above',
                                'placeholder': '请输入内容',
                                'default': '',
                                'save': false
                            },
                            'bjxEncodeBtn': {
                                'label': '编码 >>>',
                                'title': '使用"百家姓"进行编码',
                                'type': 'button',
                                'click': function() {
                                    operate_Code('myCodePanel_field_bjxInput', 'myCodePanel_field_bjxOutput', baijia_Encode, '编码中...');
                                }
                            },
                            'bjxDecodeBtn': {
                                'label': '解码 >>>',
                                'title': '对"百家姓"的编码进行解码',
                                'type': 'button',
                                'click': function() {
                                    operate_Code('myCodePanel_field_bjxInput', 'myCodePanel_field_bjxOutput', baijia_Decode, '解码中...');
                                }
                            },
                            'bjxOutput': {
                                'label': '输出:',
                                'type': 'textarea',
                                'labelPos': 'above',
                                'placeholder': '此处显示结果',
                                'default': '',
                                'save': false
                            },
                            'bjxCopyBtn': {
                                'label': '复制结果',
                                'title': '将输出的结果复制到剪贴板中',
                                'type': 'button',
                                'click': function() {
                                    copy_Code(this, 'myCodePanel_field_bjxOutput');
                                }
                            },
                            'coreValuesInput': {
                                'label': '输入:',
                                'section': ['社会主义核心价值观', GM_config.create('a', {
                                    'textContent': '社会主义核心价值观编码项目地址',
                                    'title': '点击跳转到社会主义核心价值观编码项目',
                                    'target': '_blank',
                                    'href': 'https://github.com/sym233/core-values-encoder',
                                })],
                                'type': 'textarea',
                                'labelPos': 'above',
                                'placeholder': '请输入内容',
                                'default': '',
                                'save': false
                            },
                            'coreValuesEncodeBtn': {
                                'label': '编码 >>>',
                                'title': '使用"社会主义核心价值观"进行编码',
                                'type': 'button',
                                'click': function() {
                                    operate_Code('myCodePanel_field_coreValuesInput', 'myCodePanel_field_coreValuesOutput', core_Values_Encode, '编码中...');
                                }
                            },
                            'coreValuesDecodeBtn': {
                                'label': '解码 >>>',
                                'title': '对"社会主义核心价值观"的编码进行解码',
                                'type': 'button',
                                'click': function() {
                                    operate_Code('myCodePanel_field_coreValuesInput', 'myCodePanel_field_coreValuesOutput', core_Values_Decode, '解码中...');
                                }
                            },
                            'coreValuesOutput': {
                                'label': '输出:',
                                'type': 'textarea',
                                'labelPos': 'above',
                                'placeholder': '此处显示结果',
                                'default': '',
                                'save': false
                            },
                            'coreValuesCopyBtn': {
                                'label': '复制结果',
                                'title': '将输出的结果复制到剪贴板中',
                                'type': 'button',
                                'click': function() {
                                    copy_Code(this, 'myCodePanel_field_coreValuesOutput');
                                }
                            },
                            'yflcInput': {
                                'label': '输入:',
                                'section': ['与佛论禅', GM_config.create('a', {
                                    'textContent': '与佛论禅编码原工具地址',
                                    'title': '点击跳转到与佛论禅编码工具',
                                    'target': '_blank',
                                    'href': 'http://keyfc.net/bbs/tools/tudoucode.aspx',
                                })],
                                'type': 'textarea',
                                'labelPos': 'above',
                                'placeholder': '请输入内容',
                                'default': '',
                                'save': false
                            },
                            'yflcEncodeBtn': {
                                'label': '编码 >>>',
                                'title': '使用"与佛论禅"进行编码',
                                'type': 'button',
                                'click': function() {
                                    operate_Code('myCodePanel_field_yflcInput', 'myCodePanel_field_yflcOutput', function(str, result_id) {
                                        GM_xmlhttpRequest({
                                            'method': 'POST',
                                            'url': 'http://keyfc.net/bbs/tools/tudou.aspx',
                                            'data': 'orignalMsg=' + encodeURIComponent(str) + '&action=Encode',
                                            'headers': {
                                                'Content-Type': 'application/x-www-form-urlencoded'
                                            },
                                            'onload': function(res) {
                                                if (res.status == 200 && res.readyState == 4) {
                                                    document.getElementById(result_id).value = res.responseText.replace(/^<BUDDHIST><Message><!\[CDATA\[|\]\]><\/Message><\/BUDDHIST>$/g, '');
                                                } else {
                                                    document.getElementById(result_id).value = '编码出现错误!';
                                                }
                                            },
                                            'onerror': function() {
                                                document.getElementById(result_id).value = '网络连接出错!';
                                            }
                                        });
                                        return false;
                                    }, '联网进行编码中...');
                                }
                            },
                            'yflcDecodeBtn': {
                                'label': '解码 >>>',
                                'title': '对"与佛论禅"的编码进行解码',
                                'type': 'button',
                                'click': function() {
                                    operate_Code('myCodePanel_field_yflcInput', 'myCodePanel_field_yflcOutput', function(str, result_id) {
                                        GM_xmlhttpRequest({
                                            'method': 'POST',
                                            'url': 'http://keyfc.net/bbs/tools/tudou.aspx',
                                            'data': 'orignalMsg=' + str.replace(/\s/g, '') + '&action=Decode',
                                            'headers': {
                                                'Content-Type': 'application/x-www-form-urlencoded'
                                            },
                                            'onload': function(res) {
                                                if (res.status == 200 && res.readyState == 4) {
                                                    document.getElementById(result_id).value = res.responseText.replace(/^<BUDDHIST><Message><!\[CDATA\[|\]\]><\/Message><\/BUDDHIST>$/g, '');
                                                } else {
                                                    document.getElementById(result_id).value = '解码出现错误!';
                                                }
                                            },
                                            'onerror': function() {
                                                document.getElementById(result_id).value = '网络连接出错!';
                                            }
                                        });
                                        return false;
                                    }, '联网进行解码中...');
                                }
                            },
                            'yflcOutput': {
                                'label': '输出:',
                                'type': 'textarea',
                                'labelPos': 'above',
                                'placeholder': '此处显示结果',
                                'default': '',
                                'save': false
                            },
                            'yflcCopyBtn': {
                                'label': '复制结果',
                                'title': '将输出的结果复制到剪贴板中',
                                'type': 'button',
                                'click': function() {
                                    copy_Code(this, 'myCodePanel_field_yflcOutput');
                                }
                            },
                            'base64Input': {
                                'label': '输入:',
                                'section': ['BASE64', GM_config.create('a', {
                                    'textContent': 'crypto-js 项目地址',
                                    'title': '点击跳转到 crypto-js 项目',
                                    'target': '_blank',
                                    'href': 'https://github.com/brix/crypto-js',
                                })],
                                'type': 'textarea',
                                'labelPos': 'above',
                                'placeholder': '请输入内容',
                                'default': '',
                                'save': false
                            },
                            'base64EncodeBtn': {
                                'label': '编码 >>>',
                                'title': '使用"BASE64"进行编码',
                                'type': 'button',
                                'click': function() {
                                    operate_Code('myCodePanel_field_base64Input', 'myCodePanel_field_base64Output', function(str) {
                                        if (typeof(CryptoJS) == 'undefined') {
                                            return 'crypto-js 库文件不存在！';
                                        } else {
                                            str = CryptoJS.enc.Utf8.parse(str);
                                            return CryptoJS.enc.Base64.stringify(str);
                                        }
                                    }, '编码中...');
                                }
                            },
                            'base64DecodeBtn': {
                                'label': '解码 >>>',
                                'title': '对"BASE64"的编码进行解码',
                                'type': 'button',
                                'click': function() {
                                    operate_Code('myCodePanel_field_base64Input', 'myCodePanel_field_base64Output', function(str) {
                                        if (typeof(CryptoJS) == 'undefined') {
                                            return 'crypto-js 库文件不存在！';
                                        } else {
                                            let words = CryptoJS.enc.Base64.parse(str);
                                            return words.toString(CryptoJS.enc.Utf8);
                                        }
                                    }, '解码中...');
                                }
                            },
                            'base64Output': {
                                'label': '输出:',
                                'type': 'textarea',
                                'labelPos': 'above',
                                'placeholder': '此处显示结果',
                                'default': '',
                                'save': false
                            },
                            'base64CopyBtn': {
                                'label': '复制结果',
                                'title': '将输出的结果复制到剪贴板中',
                                'type': 'button',
                                'click': function() {
                                    copy_Code(this, 'myCodePanel_field_base64Output');
                                }
                            },
                            'baiduQueryInput': {
                                'label': '输入:',
                                'section': ['百度网盘提取码', GM_config.create('a', {
                                    'textContent': 'PanDownload',
                                    'title': '点击跳转到 PanDownload',
                                    'target': '_blank',
                                    'href': 'https://www.pandownload.com/',
                                })],
                                'type': 'textarea',
                                'labelPos': 'above',
                                'placeholder': '请输入内容',
                                'default': '',
                                'save': false
                            },
                            'baiduQueryBtn': {
                                'label': '查询提取码 >>>',
                                'title': '查询百度网盘地址的提取码',
                                'type': 'button',
                                'click': function() {
                                    operate_Code('myCodePanel_field_baiduQueryInput', 'myCodePanel_field_baiduQueryOutput', function(str, result_id) {
                                        GM_xmlhttpRequest({
                                            'method': 'GET',
                                            'url': 'http://search.pandown.cn/api/query?surl=' + str.split('/').pop(),
                                            'responseType': 'json',
                                            'headers': {
                                                'Content-Type': 'application/x-www-form-urlencoded'
                                            },
                                            'onload': function(res) {
                                                try {
                                                    if ((res.response.code === 0) && (res.response.data[0].password)) {
                                                        document.getElementById(result_id).value = res.response.data[0].password;
                                                    } else {
                                                        console.info(res.response.message);
                                                        document.getElementById(result_id).value = '没有查询到提取码哦。';
                                                    }
                                                } catch (e) {
                                                    document.getElementById(result_id).value = '查询百度网盘提取码出错！';
                                                    console.error('福利吧论坛 - 好孩子看得见:\n查询百度网盘提取码出错！');
                                                    console.error(e);
                                                }
                                            },
                                            'onerror': function() {
                                                document.getElementById(result_id).value = '网络连接出问题啦。';
                                            }
                                        });
                                        return false;
                                    }, '联网查询网盘提取码中...');
                                }
                            },
                            'baiduQueryOutput': {
                                'label': '输出:',
                                'type': 'textarea',
                                'labelPos': 'above',
                                'placeholder': '此处显示结果',
                                'default': '',
                                'save': false
                            },
                            'baiduQueryCopyBtn': {
                                'label': '复制结果',
                                'title': '将输出的结果复制到剪贴板中',
                                'type': 'button',
                                'click': function() {
                                    copy_Code(this, 'myCodePanel_field_baiduQueryOutput');
                                }
                            },
                        },
                        'events': {
                            'open': function(doc) {
                                let config = this;
                                doc.getElementById(config.id + '_closeBtn').title = '关闭面板';
                                doc.getElementById(config.id + '_resetLink').textContent = '清空内容';
                                doc.getElementById(config.id + '_resetLink').title = '清空所有内容';
                            }
                        }
                    });
                    let code_span = document.createElement('span');
                    code_span.id = 'myCodeSpan';
                    code_span.title = '打开编解码工具';
                    code_span.addEventListener('click', function() {
                        code_panel.open();
                    }, false);
                    expand_box.appendChild(code_span);
                }
                if (GM_config.get('nightBtnEnable')) {
                    let night_btn_span = document.createElement('span');
                    night_btn_span.id = 'myNightSpan';
                    if (GM_config.get('codeEnable')) {
                        night_btn_span.id = 'myNightSpan_2';
                    }
                    if (night_enable) {
                        night_btn_span.style.backgroundImage = MODE_ICON.NIGHT;
                        night_btn_span.title = '切换到日间模式';
                    } else {
                        night_btn_span.style.backgroundImage = MODE_ICON.DAY;
                        night_btn_span.title = '切换到夜间模式';
                    }
                    night_btn_span.addEventListener('click', function() {
                        if (night_enable) {
                            night_style_dom.parentNode.removeChild(night_style_dom);
                            night_enable = false;
                            GM_config.setValue('nightEnable', night_enable);
                            night_btn_span.title = '切换到夜间模式';
                            night_btn_span.style.backgroundImage = MODE_ICON.DAY;
                        } else {
                            night_style_dom = GM_addStyle(NIGHT_STYLE);
                            night_enable = true;
                            GM_config.setValue('nightEnable', night_enable);
                            night_btn_span.title = '切换到日间模式';
                            night_btn_span.style.backgroundImage = MODE_ICON.NIGHT;
                        }
                    }, false);
                    expand_box.appendChild(night_btn_span);
                }
                document.body.appendChild(expand_box);
            });
        }
        document.arrive('#sslct', { fireOnAttributesModification: true, onceOnly: true, existing: true }, function() {
            document.getElementById('sslct').after(create_Settings_Icon());
        });
    }
    function my_Init() {
        try {
            GM_registerMenuCommand('好孩子看得见 - 设置', function() {
                GM_config.open();
            });
        } catch (e) {
            console.error('福利吧论坛 - 好孩子看得见:\n在扩展中注册菜单项出错！');
            console.error(e);
        }
        GM_addStyle(BASIC_STYLE);
        if (is_Mobile_Page()) {
            console.info('福利吧论坛 - 好孩子看得见:\n当前页面为移动端页面。');
            document.addEventListener('DOMContentLoaded', function() {
                mobile_Init();
            });
        } else {
            if (document.head.querySelector('title')) {
                if (night_enable) {
                    night_style_dom = GM_addStyle(NIGHT_STYLE);
                }
                pc_Init();
            } else {
                document.addEventListener('DOMContentLoaded', function() {
                    console.warn('福利吧论坛 - 好孩子看得见:\n网页加载失败。即将自动刷新重载。');
                    setTimeout(function() {
                        location.reload();
                    }, 2000);
                });
            }
        }
    }
    GM_config.init(
        {
            'id': 'myGoodBoyConfig',
            'title': GM_config.create('a', {
                'textContent': '好孩子看得见-设置 ver.' + GM_info.script.version,
                'title': '点击跳转到脚本页面' + get_Update_Time(GM_info.script.lastModified),
                'target': '_blank',
                'href': 'https://sleazyfork.org/zh-CN/scripts/381494'
            }),
            'skin': 'tab',
            'css': SETTINGS_STYLE,
            'frameStyle': {
                'width': '400px',
                'height': '760px'
            },
            'fields': {
                'autoCheckInEnable': {
                    'label': '自动签到',
                    'title': '进入论坛后自动点击签到按钮',
                    'labelPos': 'right',
                    'type': 'checkbox',
                    'default': true,
                    'section': GM_config.create('a', {
                        'textContent': 'author: pana',
                        'title': '点击反馈问题',
                        'target': '_blank',
                        'href': 'https://www.wnflb66.com/home.php?mod=spacecp&ac=pm&op=showmsg&touid=8548'
                    })
                },
                'nightBtnEnable': {
                    'label': '显示切换夜间模式的悬浮按钮',
                    'title': '将鼠标移至网页右下角弹出 (仅支持电脑端页面)',
                    'labelPos': 'right',
                    'type': 'checkbox',
                    'default': false
                },
                'codeEnable': {
                    'label': '显示编解码工具的悬浮按钮',
                    'title': '将鼠标移至网页右下角弹出 (仅支持电脑端页面)',
                    'labelPos': 'right',
                    'type': 'checkbox',
                    'default': false
                },
                'copyEnable': {
                    'label': '显示复制按钮',
                    'title': '在所提取链接后显示复制按钮',
                    'labelPos': 'right',
                    'type': 'checkbox',
                    'default': true
                },
                'extractEnable': {
                    'label': '识别文字中的网址并转换为超链接',
                    'title': '将帖子中网址文字转换为可点击访问的超链接',
                    'labelPos': 'right',
                    'type': 'checkbox',
                    'default': true,
                },
                'clickEnable': {
                    'label': '自动点击张国立',
                    'title': '进入帖子后自动点击张国立 (仅支持电脑端页面。注: 网络不好时慎用!)',
                    'labelPos': 'right',
                    'type': 'checkbox',
                    'default': false
                },
                'queryEnable': {
                    'label': '自动查询百度网盘提取码',
                    'title': '查询百度网盘提取码并进行自动填充 (API: PanDownload)',
                    'labelPos': 'right',
                    'type': 'checkbox',
                    'default': false
                },
                'checkEnable': {
                    'label': '自动检测百度网盘链接有效性',
                    'title': '检测并标记出已经失效的百度网盘链接',
                    'labelPos': 'right',
                    'type': 'checkbox',
                    'default': false
                },
                'displayPosition': {
                    'label': '自定义提取链接的显示位置: ',
                    'title': '指定所提取链接的显示位置 (仅支持电脑端页面)',
                    'labelPos': 'left',
                    'type': 'select',
                    'options': ['底部', '右侧'],
                    'default': '底部'
                },
                'maxLinkNumber': {
                    'label': '所提取链接的最大显示数量: ',
                    'title': '每个楼层所提取链接的默认最大显示数量值 (-1 表示无限制)',
                    'labelPos': 'left',
                    'type': 'int',
                    'size': 18,
                    'default': 5
                },
                'linkColor': {
                    'label': '自定义提取链接的文字颜色: ',
                    'title': '设定所提取链接显示的文字颜色',
                    'labelPos': 'left',
                    'type': 'text',
                    'size': 18,
                    'default': '#369'
                },
                'textColor': {
                    'label': '自定义隐藏文字的高亮颜色: ',
                    'title': '设定将隐藏文字高亮的颜色',
                    'labelPos': 'left',
                    'type': 'text',
                    'size': 18,
                    'default': '#FF33CC'
                },
                'signatureEnable': {
                    'label': '显示签名档折叠图标',
                    'title': '在签名档的左上方显示一个折叠图标',
                    'labelPos': 'right',
                    'type': 'checkbox',
                    'default': true,
                    'line': 'start'
                },
                'signatureSwitch': {
                    'label': '签名档的默认折叠状态: ',
                    'title': '自定义签名档默认的折叠状态',
                    'labelPos': 'left',
                    'type': 'select',
                    'options': ['展开', '收起'],
                    'default': '展开',
                    'line': 'end'
                },
                'highlightEnable': {
                    'label': '启用热帖高亮功能',
                    'title': '在帖子列表页面开启热帖高亮 (移动端页面只支持回复高亮)',
                    'labelPos': 'right',
                    'type': 'checkbox',
                    'default': true,
                    'line': 'start'
                },
                'agreeThreshold': {
                    'label': '按分享值高亮的阈值: ',
                    'title': '分享值>=阈值时高亮',
                    'labelPos': 'left',
                    'type': 'unsigned int',
                    'size': 18,
                    'default': 20
                },
                'agreeColor': {
                    'label': '按分享值高亮的颜色: ',
                    'title': '优化级高',
                    'labelPos': 'left',
                    'type': 'text',
                    'size': 18,
                    'default': '#EE1B2E'
                },
                'replyTHreshold': {
                    'label': '按回复数高亮的阈值: ',
                    'title': '回复数>=阈值时高亮',
                    'labelPos': 'left',
                    'type': 'unsigned int',
                    'size': 18,
                    'default': 50,
                },
                'replyColor': {
                    'label': '按回复数高亮的颜色: ',
                    'title': '优化级低',
                    'labelPos': 'left',
                    'type': 'text',
                    'size': 18,
                    'default': '#2B65B7',
                    'line': 'end'
                },
                'visitedEnable': {
                    'label': '标记已打开过的帖子',
                    'title': '允许将已打开过的帖子设置成自定义的颜色',
                    'labelPos': 'right',
                    'type': 'checkbox',
                    'default': false,
                    'line': 'start'
                },
                'visitedColor': {
                    'label': '自定义已打开过的帖子的颜色',
                    'title': '优先级最高',
                    'labelPos': 'left',
                    'type': 'text',
                    'size': 18,
                    'default': '#666',
                    'line': 'end'
                }
            },
            'events': {
                'init': function() {
                    console.debug('福利吧论坛 - 好孩子看得见:\n配置信息读取完成。');
                    my_Init();
                },
                'save': function() {
                    location.reload();
                }
            }
        }
    );
})();
