// ==UserScript==
// @name         吾爱破解论坛美化
// @version      1.0.6
// @author       X.I.U
// @description  精简多余内容、样式优化
// @match        *://www.52pojie.cn/*
// @icon         https://www.52pojie.cn/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @license      GPL-3.0 License
// @run-at       document-start
// @namespace    https://greasyfork.org/scripts/412681
// ==/UserScript==
 
(function() {
    var menu_rule = GM_getValue('xiu2_menu_rule');
    var menu_rule_ID, menu_feedBack_ID;
    if (menu_rule == null){menu_rule = false; GM_setValue('xiu2_menu_rule', menu_rule)};
    registerMenuCommand();
    addStyle();
 
    // 注册脚本菜单
    function registerMenuCommand() {
        let menu_rule_;
        if (menu_feedBack_ID){ // 如果反馈菜单ID不是 null，则删除所有脚本菜单
            GM_unregisterMenuCommand(menu_rule_ID);
            GM_unregisterMenuCommand(menu_feedBack_ID);
            menu_rule = GM_getValue('xiu2_menu_rule');
        }
 
        if (menu_rule){menu_rule_ = "√";}else{menu_rule_ = "×";}
 
        menu_rule_ID = GM_registerMenuCommand(`[ ${menu_rule_} ] 隐藏版规`, function(){menu_switch(menu_rule,'xiu2_menu_rule','隐藏版规')});
        menu_feedBack_ID = GM_registerMenuCommand('反馈 & 建议', function () {window.GM_openInTab('https://github.com/XIU2/UserScript#xiu2userscript', {active: true,insert: true,setParent: true});});
    }
 
    // 菜单开关
    function menu_switch(menu_status, Name, Tips) {
        if (menu_status){
            GM_setValue(`${Name}`, false);
            GM_notification({text: `已关闭 [${Tips}] 功能\n（刷新网页后生效）`, timeout: 3000});
        }else{
            GM_setValue(`${Name}`, true);
            GM_notification({text: `已开启 [${Tips}] 功能\n（刷新网页后生效）`, timeout: 3000});
        }
        registerMenuCommand(); // 重新注册脚本菜单
    };
 
    function addStyle() {
        let style,
            style_1 = `.bml {display:none !important;}`,
            style_2 = `
a[href="connect.php?mod=config"], #toptb, #navmenu, #nv_ph, #nv, #pt .y, #chart, #ft, #custominfo_pmenu, .bm.lk, .dnch_eo_pt, .dnch_eo_pr, .dnch_eo_f, dl.pil.cl, td.plc.plm .sign, .dnch_eo_pb, .dnch_eo_pt, .pls .side-star, .pls .side-group, .res-footer-note, .comiis_nav, .scbar_hot_td, .md_ctrl, .pls.favatar .xg1 {
	display:none !important;
}
 
@media (max-width:650px) {
	#postlist .favatar.pls .avatar img {
		margin:0 0 2px;
	}
	.pls .avatar img {
		width:100px;
		height:100px;
		background:none;
		padding:0;
		border:4px solid #ffffff
	}
	.avtm img {
		width:60px;
	}
}
.pls .avatar {
	text-align:center;
}
.t_fsz {
	min-height:60px;
}
.pls .pi {
	text-align:center;
	padding:10px 0 0 0;
	border:none;
	overflow:visible;
}
.xw1 {
	font-size:15px;
}
textarea#fastpostmessage {
	background:none !important;
}
.pcb img {
	max-width:60%;
	margin:4px;
}
.rate {
	margin:0;
}
.ratl td {
	padding:0px;
}
.xw1 {
	font-size:12px;
	font-weight:500;
}
.xi2,.xi2 a,.xi3 a {
	color:red;
}
.toptitle_7ree td {
    border-top: 1px solid #CDCDCD;
}
.mtw {
	margin-top:0px !important;
}
 
#p_btn {
	padding:0px;
	margin:0 0 0 1px;
	display:flex;
	justify-content:space-evenly;
}
#scbar {
	border-top:0;
	border-bottom:0;
	background:0;
}
/* 链接点击后颜色变浅（灰白色） */
.tl th a:visited, .tl td.fn a:visited {
    color: #aaa;
}`,
            style_Add = document.createElement('style');
        if (menu_rule) {
            style = style_1 + style_2;
        }else{
            style = style_2;
        }
        style_Add.innerHTML = style;
        document.head.appendChild(style_Add);
    }
})();
