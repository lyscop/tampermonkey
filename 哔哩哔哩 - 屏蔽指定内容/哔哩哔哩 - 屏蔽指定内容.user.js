// ==UserScript==
// @name         哔哩哔哩 - 屏蔽指定内容
// @namespace    https://greasyfork.org/zh-CN/users/193133-pana
// @homepage     https://www.sailboatweb.com
// @version      4.3.4
// @description  实现可分别按用户名、关键字或正则表达式对视频(或直播间/相薄)和评论(或回复)进行屏蔽; 将鼠标移至网页右下角弹出悬浮按钮
// @author       pana
// @include      http*://www.bilibili.com/*
// @include      http*://search.bilibili.com/*
// @include      http*://live.bilibili.com/*
// @include      http*://space.bilibili.com/*
// @include      http*://t.bilibili.com/*
// @include      http*://h.bilibili.com/*
// @include      http*://manga.bilibili.com/*
// @include      http*://message.bilibili.com/*
// @require      https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @require      https://greasyfork.org/scripts/407543-block-obj/code/Block_Obj.js
// @license      GNU General Public License v3.0 or later
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_setClipboard
// @grant        GM.setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @run-at       document-start
// @noframes
// @note         ----------------------------------------------------------------
// @note         与"Bilibili 旧播放页"脚本(https://greasyfork.org/zh-CN/scripts/394296)的兼容问题:
// @note         如果同时启用脚本后发现本脚本无法保存设置到存储中，请前往脚本管理器调整脚本执行顺序。
// @note         具体方法可参考: https://greasyfork.org/zh-CN/scripts/397669
// @note         ----------------------------------------------------------------
// @note         关于 "读取仅拥有标题的视频的用户名信息"
// @note         原理是通过 API: "https://api.bilibili.com/x/web-interface/view"
// @note         这个方法本质上是不可靠的，因为可能会由于快速大量进行请求从而导致被拦截 (如:频繁地在页面内刷新)
// @note         ----------------------------------------------------------------
// @note         更新记录:
// @note         ver.4.3.4  修复部分页面屏蔽失效的问题
// @note         ver.4.3.3  补充覆盖当前在线页面
// @note         ver.4.3.2  修复部分页面下按用户屏蔽失效的问题
// @note         ver.4.3.1  修复了由于上一版本的改动导致的脚本失效的问题
// @note         ver.4.3.0  兼容 Greasemonkey 4
// @note         ver.4.2.0  添加支持允许作用于动态的功能
// @note         ver.4.1.1  补充覆盖频道页面下内容
// @note         ver.4.1.0  允许在评论区显示屏蔽用户和"爆炸"按钮
// @note         ver.4.0.6  修复播放器网页全屏模式下的冲突问题
// @note         ver.4.0.4  尝试修复播放器网页全屏模式下可能的冲突问题
// @note         ver.4.0.3  修复已知的问题
// @note         ver.4.0.2  更换依赖库的 CDN
// @note         ver.4.0.0  整理并优化代码; 修复对于新添加的正则表达式，其无法在其他同步数据的标签页上生效的问题
// @note         ver.3.18.0 尝试通过 API 获取其他仅拥有标题的视频的用户名信息
// @note         ver.3.17.1 尝试通过 API 的方式读取专区热门列表里视频的用户名
// @note         ver.3.17.0 处理与"Bilibili 旧播放页"脚本不兼容的问题
// @note         ver.3.16.4 补充之前忘记匹配消息中心页面的问题; 补充覆盖番剧区页内的评论区; 修复了其他已知的问题
// @note         ver.3.16.0 增加 "消息中心 >> 回复我的" 的相关屏蔽，同时允许自动删除通知
// @note         ver.3.14.4 补充覆盖漫画页内的评论区
// @note         ver.3.14.3 增加相薄区的相关屏蔽; 完善部分未被覆盖的页面内容; 调整了使用关键字匹配表情的逻辑
// @note         ver.3.13.2 补充覆盖动态首页内的评论区
// @note         ver.3.13.1 修复可能无法匹配到用户动态页的问题
// @note         ver.3.13.0 实现多标签页同步数据; 调整取消按钮的行为; 覆盖视频播放完毕后的推荐视频; 兼容"Bilibili 旧播放页"脚本; 依旧存在的兼容问题: 在主页和视频播放页等页面下同时开启脚本时，本脚本无法保存设置到存储中
// @note         ver.3.11.0 增加直播区的相关屏蔽; 覆盖个人动态内的评论; 添加展开列表按钮
// @note         ver.3.7.1 添加删除按钮; 完善部分未被覆盖的页面内容
// @note         ver.3.5.3 修复部分页面下输入框内容看不清以及其他小问题
// @note         ver.3.5.0 优化代码; 完善部分未被覆盖的页面内容; 悬浮图标自动隐藏等
// @note         ver.2.2.0 添加允许将评论中的 b 站内置表情包转换成对应文字的功能
// @note         ver.2.1.2 修复储存正则表达式出错的问题; 优化代码
// @note         ver.2.1.0 添加允许按正则表达式进行屏蔽的功能
// @note         ver.2.0.0 调整了添加与删除关键字的方式,方便操作; 将评论与视频标题的关键词分开作用
// @note         ver.1.2.1 完善部分未被覆盖的页面内容
// @note         ver.1.2.0 添加屏蔽评论的功能
// @note         ver.1.1.2 调整屏蔽按钮的位置到右下角; 尝试处理脚本偶尔会失效的问题
// @note         ver.1.1.1 修复搜索页面以关键字屏蔽无效的问题
// @note         ver.1.1.0 匹配视频播放页面; 优化代码
// ==/UserScript==
 
(async function () {
  'use strict';
  const OLD_URL = location.href;
  const CHECKBOX_VALUE = {
    START: {
      id: 'functionEnable',
      label: '启用屏蔽功能',
      title: '总开关',
    },
    VIDEO_USERNAME: {
      id: 'usernameEnable',
      label: '按用户名',
      title: '屏蔽指定用户发布的视频(或直播间/相薄)',
    },
    VIDEO_KEYWORD: {
      id: 'keywordEnable',
      label: '按关键字',
      title: '屏蔽标题中包含指定关键字的视频(或直播间/相薄)',
    },
    VIDEO_REG: {
      id: 'regEnable',
      label: '按正则',
      title: '屏蔽标题匹配指定正则表达式的视频(或直播间/相薄)',
    },
    COMMENT_USERNAME: {
      id: 'commentEnable',
      label: '按用户名',
      title: '屏蔽指定用户发布的评论(或回复)',
    },
    COMMENT_KEYWORD: {
      id: 'commentKeywordEnable',
      label: '按关键字',
      title: '屏蔽内容中包含指定关键字的评论(或回复)',
    },
    COMMENT_REG: {
      id: 'commentRegEnable',
      label: '按正则',
      title: '屏蔽内容匹配指定正则表达式的评论(或回复)',
    },
    CONVERT_EMOJI: {
      id: 'convertEmojiEnable',
      label: '表情转成文字',
      title:
        '判定时将表情包转换成对应的标识文字，例：[鸡腿]、[tv_白眼]等\n注意：使用关键字来匹配表情时，必须包含完整的中括号对；\n如 "鸡腿" 是无法匹配表情 [鸡腿] 的，需使用 "[鸡腿]" 进行匹配',
    },
    SHOW_BLOCK_USER_BTN: {
      id: 'showBlockUserBtnEnable',
      label: '显示屏蔽用户按钮',
      title: '在评论在底部显示一个屏蔽该用户的按钮',
    },
    SHOW_BANG_BTN: {
      id: 'showBangBtnEnable',
      label: '显示"爆炸"按钮',
      title: '在评论底部显示一个可以拆分并选择文本内容的按钮',
    },
    LIVE: {
      id: 'liveEnable',
      label: '直播间',
      title: '扩展作用范围以同时允许屏蔽直播间',
    },
    PIC: {
      id: 'picEnable',
      label: '相薄',
      title: '扩展作用范围以同时允许屏蔽相薄',
    },
    MESSAGE_REPLY: {
      id: 'messageReplyEnable',
      label: '消息中心里的回复',
      title: '扩展作用范围以同时允许屏蔽消息中心里的回复',
    },
    MESSAGE_REPLY_DEL: {
      id: 'messageReplyDelEnable',
      label: '自动删除回复通知',
      title: '同时将屏蔽的回复通知自动删除\n删除的记录可在控制台中查看\n请谨慎启用该选项，因为删除操作是不可逆的！',
    },
    DYNAMIC_VIDEO: {
      id: 'dynamicVideo',
      label: '动态',
      title: '允许屏蔽于视频标题匹配关键字或正则的动态',
    },
    DYNAMIC_CONTENT: {
      id: 'dynamicContent',
      label: '动态',
      title: '允许屏蔽内容匹配关键字或正则的动态',
    },
  };
  const INPUT_VALUE = {
    USERNAME: {
      id: 'usernameInput',
      label: '输入：',
      placeholder: ' 多个时以半角逗号分隔 ',
    },
    VIDEO_KEYWORD: {
      id: 'videoKeywordInput',
      label: '输入：',
      placeholder: ' 多个时以半角逗号分隔 ',
    },
    COMMENT_KEYWORD: {
      id: 'commentKeywordInput',
      label: '输入：',
      placeholder: ' 多个时以半角逗号分隔 ',
    },
    VIDEO_REG: {
      id: 'videoRegInput',
      label: '输入：',
      placeholder: ' / 建议写成 \\/ ',
      modifier_label: '修饰符：',
      modifier_placeholder: '如:gim',
    },
    COMMENT_REG: {
      id: 'commentRegInput',
      label: '输入：',
      placeholder: ' / 建议写成 \\/ ',
      modifier_label: '修饰符：',
      modifier_placeholder: '如:gim',
    },
  };
  const TEXTAREA_VALUE = {
    USERNAME: {
      id: 'usernameArray',
    },
    VIDEO_KEYWORD: {
      id: 'keywordArray',
    },
    COMMENT_KEYWORD: {
      id: 'commentArray',
    },
    VIDEO_REG: {
      id: 'regArray',
    },
    COMMENT_REG: {
      id: 'commentRegArray',
    },
  };
  const MODULE = {
    USERNAME: {
      className: 'li_username',
    },
    VIDEO_KEYWORD: {
      className: 'li_video_keyword',
    },
    COMMENT_KEYWORD: {
      className: 'li_comment_keyword',
    },
    VIDEO_REG: {
      className: 'li_video_reg',
    },
    COMMENT_REG: {
      className: 'li_comment_reg',
    },
  };
  const BASIC_STYLE = `
        .player-mode-webfullscreen, .mode-webfullscreen, .webfullscreen, .player-module {
            z-index: 100001 !important;
        }
        .bilibili_reply_bang_button,
        .bilibili_comment_bang_button,
        .bilibili_reply_user_block_button,
        .bilibili_comment_user_block_button {
            display: inline-block;
            padding: 0px 5px;
            border-radius: 4px;
            cursor: pointer;
        }
        .bilibili_reply_bang_button:hover,
        .bilibili_comment_bang_button:hover,
        .bilibili_reply_user_block_button:hover,
        .bilibili_comment_user_block_button:hover {
            color: #00a1d6;
            background-color: #e5e9ef;
        }
    `;
  var bilibili_config = {
    functionEnable: true,
    usernameEnable: true,
    keywordEnable: true,
    commentEnable: false,
    commentKeywordEnable: false,
    regEnable: false,
    commentRegEnable: false,
    convertEmojiEnable: false,
    showBlockUserBtnEnable: false,
    showBangBtnEnable: false,
    liveEnable: false,
    picEnable: false,
    messageReplyEnable: false,
    messageReplyDelEnable: false,
    dynamicVideo: false,
    dynamicContent: false,
    usernameArray: [],
    keywordArray: [],
    commentArray: [],
    regArray: [],
    commentRegArray: [],
  };
  var del_num = 0;
  var record_button = [];
  var bv_record = [];
  var request_total = 0;
  var send_status = true;
  const INTERVAL_TIME = 100;
  if (typeof Block_Obj !== 'function') {
    alert('Block_Obj.js was not loaded successfully.');
  } else if (typeof Block_Obj.fn.compare !== 'function') {
    alert('The version of Block_Obj.js is too low.');
  }
  var block_obj = new Block_Obj('bilibili_config', ['regArray', 'commentRegArray']);
  await document.arrive('body', { fireOnAttributesModification: true, onceOnly: true, existing: true }, async function () {
    await block_obj.init({
      id: 'bilibiliConfig',
      menu: 'bilibili_屏蔽设置',
      style: BASIC_STYLE,
      field: [
        {
          id: CHECKBOX_VALUE.START.id,
          label: CHECKBOX_VALUE.START.label,
          title: CHECKBOX_VALUE.START.title,
          type: 'c',
          default: true,
        },
        {
          label: '屏蔽视频(或直播间/相薄)：',
          type: 's',
        },
        {
          id: CHECKBOX_VALUE.VIDEO_USERNAME.id,
          label: CHECKBOX_VALUE.VIDEO_USERNAME.label,
          title: CHECKBOX_VALUE.VIDEO_USERNAME.title,
          type: 'c',
          default: true,
        },
        {
          id: CHECKBOX_VALUE.VIDEO_KEYWORD.id,
          label: CHECKBOX_VALUE.VIDEO_KEYWORD.label,
          title: CHECKBOX_VALUE.VIDEO_KEYWORD.title,
          type: 'c',
          default: true,
          move_right: true,
        },
        {
          id: CHECKBOX_VALUE.VIDEO_REG.id,
          label: CHECKBOX_VALUE.VIDEO_REG.label,
          title: CHECKBOX_VALUE.VIDEO_REG.title,
          type: 'c',
          default: false,
          move_right: true,
        },
        {
          type: 'br',
        },
        {
          id: CHECKBOX_VALUE.LIVE.id,
          label: CHECKBOX_VALUE.LIVE.label,
          title: CHECKBOX_VALUE.LIVE.title,
          type: 'c',
          default: false,
        },
        {
          id: CHECKBOX_VALUE.PIC.id,
          label: CHECKBOX_VALUE.PIC.label,
          title: CHECKBOX_VALUE.PIC.title,
          type: 'c',
          default: false,
          move_right: true,
        },
        {
          id: CHECKBOX_VALUE.DYNAMIC_VIDEO.id,
          label: CHECKBOX_VALUE.DYNAMIC_VIDEO.label,
          title: CHECKBOX_VALUE.DYNAMIC_VIDEO.title,
          type: 'c',
          default: false,
          move_right: true,
        },
        {
          label: '屏蔽评论(或回复)：',
          type: 's',
        },
        {
          id: CHECKBOX_VALUE.COMMENT_USERNAME.id,
          label: CHECKBOX_VALUE.COMMENT_USERNAME.label,
          title: CHECKBOX_VALUE.COMMENT_USERNAME.title,
          type: 'c',
          default: false,
        },
        {
          id: CHECKBOX_VALUE.COMMENT_KEYWORD.id,
          label: CHECKBOX_VALUE.COMMENT_KEYWORD.label,
          title: CHECKBOX_VALUE.COMMENT_KEYWORD.title,
          type: 'c',
          default: false,
          move_right: true,
        },
        {
          id: CHECKBOX_VALUE.COMMENT_REG.id,
          label: CHECKBOX_VALUE.COMMENT_REG.label,
          title: CHECKBOX_VALUE.COMMENT_REG.title,
          type: 'c',
          default: false,
          move_right: true,
        },
        {
          id: CHECKBOX_VALUE.CONVERT_EMOJI.id,
          label: CHECKBOX_VALUE.CONVERT_EMOJI.label,
          title: CHECKBOX_VALUE.CONVERT_EMOJI.title,
          type: 'c',
          default: false,
          move_right: true,
        },
        {
          id: CHECKBOX_VALUE.DYNAMIC_CONTENT.id,
          label: CHECKBOX_VALUE.DYNAMIC_CONTENT.label,
          title: CHECKBOX_VALUE.DYNAMIC_CONTENT.title,
          type: 'c',
          default: false,
          move_right: true,
        },
        {
          type: 'br',
        },
        {
          id: CHECKBOX_VALUE.SHOW_BLOCK_USER_BTN.id,
          label: CHECKBOX_VALUE.SHOW_BLOCK_USER_BTN.label,
          title: CHECKBOX_VALUE.SHOW_BLOCK_USER_BTN.title,
          type: 'c',
          default: false,
        },
        {
          id: CHECKBOX_VALUE.SHOW_BANG_BTN.id,
          label: CHECKBOX_VALUE.SHOW_BANG_BTN.label,
          title: CHECKBOX_VALUE.SHOW_BANG_BTN.title,
          type: 'c',
          default: false,
          move_right: true,
        },
        {
          type: 'br',
        },
        {
          id: CHECKBOX_VALUE.MESSAGE_REPLY.id,
          label: CHECKBOX_VALUE.MESSAGE_REPLY.label,
          title: CHECKBOX_VALUE.MESSAGE_REPLY.title,
          type: 'c',
          default: false,
        },
        {
          id: CHECKBOX_VALUE.MESSAGE_REPLY_DEL.id,
          label: CHECKBOX_VALUE.MESSAGE_REPLY_DEL.label,
          title: CHECKBOX_VALUE.MESSAGE_REPLY_DEL.title,
          type: 'c',
          default: false,
          move_right: true,
        },
        {
          type: 's',
        },
        {
          type: 's',
          label: '用户名：',
          classname: MODULE.USERNAME.className,
        },
        {
          id: INPUT_VALUE.USERNAME.id,
          label: INPUT_VALUE.USERNAME.label,
          placeholder: INPUT_VALUE.USERNAME.placeholder,
          type: 'i',
          list_id: TEXTAREA_VALUE.USERNAME.id,
          classname: MODULE.USERNAME.className,
        },
        {
          id: TEXTAREA_VALUE.USERNAME.id,
          type: 'l',
          default: [],
          classname: MODULE.USERNAME.className,
        },
        {
          type: 's',
        },
        {
          type: 's',
          label: '视频(或直播间/相薄)关键字：',
          classname: MODULE.VIDEO_KEYWORD.className,
        },
        {
          id: INPUT_VALUE.VIDEO_KEYWORD.id,
          label: INPUT_VALUE.VIDEO_KEYWORD.label,
          placeholder: INPUT_VALUE.VIDEO_KEYWORD.placeholder,
          type: 'i',
          list_id: TEXTAREA_VALUE.VIDEO_KEYWORD.id,
          classname: MODULE.VIDEO_KEYWORD.className,
        },
        {
          id: TEXTAREA_VALUE.VIDEO_KEYWORD.id,
          type: 'l',
          default: [],
          classname: MODULE.VIDEO_KEYWORD.className,
        },
        {
          type: 's',
        },
        {
          type: 's',
          label: '视频(或直播间/相薄)正则表达式：',
          classname: MODULE.VIDEO_REG.className,
        },
        {
          id: INPUT_VALUE.VIDEO_REG.id,
          label: INPUT_VALUE.VIDEO_REG.label,
          placeholder: INPUT_VALUE.VIDEO_REG.placeholder,
          modifier_label: INPUT_VALUE.VIDEO_REG.modifier_label,
          modifier_placeholder: INPUT_VALUE.VIDEO_REG.modifier_placeholder,
          type: 'ri',
          list_id: TEXTAREA_VALUE.VIDEO_REG.id,
          classname: MODULE.VIDEO_REG.className,
        },
        {
          id: TEXTAREA_VALUE.VIDEO_REG.id,
          type: 'l',
          default: [],
          classname: MODULE.VIDEO_REG.className,
        },
        {
          type: 's',
        },
        {
          type: 's',
          label: '评论(或回复)关键字：',
          classname: MODULE.COMMENT_KEYWORD.className,
        },
        {
          id: INPUT_VALUE.COMMENT_KEYWORD.id,
          label: INPUT_VALUE.COMMENT_KEYWORD.label,
          placeholder: INPUT_VALUE.COMMENT_KEYWORD.placeholder,
          type: 'i',
          list_id: TEXTAREA_VALUE.COMMENT_KEYWORD.id,
          classname: MODULE.COMMENT_KEYWORD.className,
        },
        {
          id: TEXTAREA_VALUE.COMMENT_KEYWORD.id,
          type: 'l',
          default: [],
          classname: MODULE.COMMENT_KEYWORD.className,
        },
        {
          type: 's',
        },
        {
          type: 's',
          label: '评论(或回复)正则表达式：',
          classname: MODULE.COMMENT_REG.className,
        },
        {
          id: INPUT_VALUE.COMMENT_REG.id,
          label: INPUT_VALUE.COMMENT_REG.label,
          placeholder: INPUT_VALUE.COMMENT_REG.placeholder,
          modifier_label: INPUT_VALUE.COMMENT_REG.modifier_label,
          modifier_placeholder: INPUT_VALUE.COMMENT_REG.modifier_placeholder,
          type: 'ri',
          list_id: TEXTAREA_VALUE.COMMENT_REG.id,
          classname: MODULE.COMMENT_REG.className,
        },
        {
          id: TEXTAREA_VALUE.COMMENT_REG.id,
          type: 'l',
          default: [],
          classname: MODULE.COMMENT_REG.className,
        },
        {
          type: 's',
        },
      ],
      events: {
        save: config => {
          bilibili_config = config;
          hide_Event();
        },
        change: config => {
          bilibili_config = config;
          hide_Event();
        },
      },
    });
    bilibili_config = block_obj.getConfig();
    hide_Event();
    try {
      let observer = new MutationObserver(() => {
        hide_Event();
      });
      observer.observe(document.querySelector('body'), {
        childList: true,
        subtree: true,
      });
    } catch (e) {
      console.error(e);
    }
    if (/www\.bilibili\.com\/?(\/\?spm_id_from=.*)?$/.test(OLD_URL)) {
      document.querySelector('.btn.next') &&
        document.querySelector('.btn.next').addEventListener('click', () => {
          setTimeout(() => {
            hide_Event();
          }, 250);
        });
      document.querySelector('.btn.prev') &&
        document.querySelector('.btn.prev').addEventListener('click', () => {
          setTimeout(() => {
            hide_Event();
          }, 250);
        });
      document.body.arrive(
        '.manga-panel .btn-change',
        {
          fireOnAttributesModification: true,
          onceOnly: true,
          existing: true,
        },
        item => {
          item.addEventListener('click', () => {
            setTimeout(() => {
              hide_Event();
            }, 1000);
          });
        }
      );
      document.body.arrive(
        '.manga-panel .tab-switch-item',
        {
          fireOnAttributesModification: true,
          onceOnly: true,
          existing: true,
        },
        item => {
          item.addEventListener('click', () => {
            setTimeout(() => {
              hide_Event();
            }, 1000);
          });
        }
      );
    }
    if (/live\.bilibili\.com\/all/.test(OLD_URL)) {
      document.body.arrive(
        '.content-panel h1.title > span',
        {
          fireOnAttributesModification: true,
          onceOnly: true,
          existing: true,
        },
        item => {
          item.addEventListener('click', () => {
            setTimeout(() => {
              hide_Event();
            }, 1000);
          });
        }
      );
    }
  });
  function display_Del(panel_id, num) {
    if (document.getElementById(panel_id)) {
      document.getElementById(panel_id).textContent = ' (自动删除了 ' + num + ' 条通知)';
    } else {
      let del_panel = document.createElement('span');
      del_panel.id = panel_id;
      del_panel.textContent = ' (自动删除了 ' + num + ' 条通知)';
      document.querySelector('.space-right-top .title').appendChild(del_panel);
    }
  }
  function decide_Text(
    text_value,
    is_comment = false,
    is_live = false,
    is_pic = false,
    source_text = null,
    is_message_reply = false,
    dynamic = null
  ) {
    let is_decide = false;
    let is_decide_comment = false;
    let is_decide_dynamic = false;
    let is_decide_dynamic_title = false;
    let is_decide_dynamic_content = false;
    if (bilibili_config.functionEnable) {
      if (text_value) {
        if (is_comment) {
          if (is_message_reply) {
            if (bilibili_config.messageReplyEnable) {
              is_decide_comment = true;
            }
          } else {
            is_decide_comment = true;
          }
        } else if (is_live) {
          if (bilibili_config.liveEnable) {
            is_decide = true;
          }
        } else if (is_pic) {
          if (bilibili_config.picEnable) {
            is_decide = true;
          }
        } else {
          is_decide = true;
        }
      } else if (dynamic) {
        if (dynamic.content) {
          if (bilibili_config.dynamicContent) {
            is_decide_dynamic = true;
            is_decide_dynamic_content = true;
          }
        }
        if (dynamic.title) {
          if (bilibili_config.dynamicVideo) {
            is_decide_dynamic = true;
            is_decide_dynamic_title = true;
          }
        }
      }
    }
    if (is_decide) {
      if (bilibili_config.keywordEnable) {
        for (let k of bilibili_config.keywordArray) {
          if (k && text_value.indexOf(k) !== -1) {
            return true;
          }
        }
      }
      if (bilibili_config.regEnable) {
        try {
          for (let l of bilibili_config.regArray) {
            if (l.test(text_value)) {
              return true;
            }
          }
        } catch (e) {
          console.error('bilibili_Block Ver.2.1.0: Invalid regular expression for comparison.');
          console.error(e);
          return false;
        }
      }
    } else if (is_decide_comment) {
      if (bilibili_config.commentKeywordEnable) {
        for (let i of bilibili_config.commentArray) {
          if (i) {
            if (text_value.indexOf(i) !== -1) {
              if (source_text) {
                if (source_text.indexOf(i) !== -1) {
                  return true;
                } else if (/\[.*\]/i.test(i)) {
                  return true;
                }
              } else {
                return true;
              }
            } else if (source_text && /\[.*\]/i.test(i)) {
              if (source_text.indexOf(i) !== -1) {
                return true;
              }
            }
          }
        }
      }
      if (bilibili_config.commentRegEnable) {
        try {
          for (let j of bilibili_config.commentRegArray) {
            if (j.test(text_value)) {
              return true;
            } else if (source_text) {
              if (j.test(source_text)) {
                return true;
              }
            }
          }
        } catch (e) {
          console.error('bilibili_Block Ver.2.1.0: Invalid regular expression for comparison.');
          console.error(e);
          return false;
        }
      }
    } else if (is_decide_dynamic) {
      let dynamic_status = false;
      if (dynamic.title && is_decide_dynamic_title) {
        if (bilibili_config.keywordEnable) {
          for (let o of bilibili_config.keywordArray) {
            if (o && dynamic.title.indexOf(o) !== -1) {
              dynamic_status = true;
              break;
            }
          }
        }
        if (!dynamic_status && bilibili_config.regEnable) {
          try {
            for (let p of bilibili_config.regArray) {
              if (p.test(dynamic.title)) {
                dynamic_status = true;
                break;
              }
            }
          } catch (e) {
            console.error('bilibili_Block Ver.4.2.0: Invalid regular expression for comparison.');
            console.error(e);
            dynamic_status = false;
          }
        }
      }
      if (!dynamic_status && dynamic.content && is_decide_dynamic_content) {
        if (bilibili_config.commentKeywordEnable) {
          for (let q of bilibili_config.commentArray) {
            if (q) {
              if (dynamic.content.indexOf(q) !== -1) {
                if (dynamic.sourceContent) {
                  if (dynamic.sourceContent.indexOf(q) !== -1) {
                    dynamic_status = true;
                    break;
                  } else if (/\[.*\]/i.test(q)) {
                    dynamic_status = true;
                    break;
                  }
                } else {
                  dynamic_status = true;
                  break;
                }
              } else if (dynamic.sourceContent && /\[.*\]/i.test(q)) {
                if (dynamic.sourceContent.indexOf(q) !== -1) {
                  dynamic_status = true;
                  break;
                }
              }
            }
          }
        }
        if (!dynamic_status && bilibili_config.commentRegEnable) {
          try {
            for (let r of bilibili_config.commentRegArray) {
              if (r.test(dynamic.content)) {
                dynamic_status = true;
                break;
              } else if (dynamic.sourceContent) {
                if (r.test(dynamic.sourceContent)) {
                  dynamic_status = true;
                  break;
                }
              }
            }
          } catch (e) {
            console.error('bilibili_BLock Ver.4.2.0: Invalid regular expression for comparison.');
            console.error(e);
            dynamic_status = false;
          }
        }
      }
      return dynamic_status;
    }
    return false;
  }
  function decide_Username(username, is_comment = false, is_live = false, is_pic = false, is_message_reply = false) {
    let is_decide = false;
    if (bilibili_config.functionEnable && username) {
      if (is_comment) {
        if (bilibili_config.commentEnable) {
          if (is_message_reply) {
            if (bilibili_config.messageReplyEnable) {
              is_decide = true;
            }
          } else {
            is_decide = true;
          }
        }
      } else if (is_live) {
        if (bilibili_config.liveEnable) {
          if (bilibili_config.usernameEnable) {
            is_decide = true;
          }
        }
      } else if (is_pic) {
        if (bilibili_config.picEnable) {
          if (bilibili_config.usernameEnable) {
            is_decide = true;
          }
        }
      } else {
        if (bilibili_config.usernameEnable) {
          is_decide = true;
        }
      }
    }
    if (is_decide) {
      if (bilibili_config.usernameArray.includes(username)) {
        return true;
      }
    }
    return false;
  }
  function hide_Handle(item_node, username, text_value, method = 0, type = {}) {
    if (username) {
      if (typeof username === 'object') {
        username = username.textContent;
      }
      username = username.replace(/^\s*|\s*$/g, '');
    }
    if (text_value && typeof text_value === 'object') {
      text_value = text_value.textContent;
    }
    let is_comment = type.comment ? true : false;
    let is_message_reply = type.messageReply ? true : false;
    let del_button = type.delButton ? type.delButton : null;
    let is_live = type.live ? true : false;
    let is_pic = type.pic ? true : false;
    let dynamic = type.dynamic != null && typeof type.dynamic === 'object' ? type.dynamic : null;
    let source_text = type.sourceText ? type.sourceText : null;
    let hide_status = false;
    if (decide_Username(username, is_comment, is_live, is_pic, is_message_reply)) {
      hide_status = true;
    } else if (decide_Text(text_value, is_comment, is_live, is_pic, source_text, is_message_reply, dynamic)) {
      hide_status = true;
    } else {
      hide_status = false;
    }
    if (item_node.constructor == Array) {
      for (let ele_node of item_node) {
        if (ele_node) {
          Block_Obj.fn.hideOperation(ele_node, hide_status, method);
        }
      }
    } else {
      Block_Obj.fn.hideOperation(item_node, hide_status, method);
    }
    if (hide_status) {
      if (del_button) {
        if (bilibili_config.messageReplyDelEnable && !record_button.includes(del_button)) {
          record_button.push(del_button);
          del_button.click();
          console.info('%c自动删除通知:', 'color: purple;', '\n用户名:', username, '\n评论内容:', text_value);
          del_num++;
          display_Del('messageDelPanel', del_num);
        }
      }
    }
  }
  function hide_Event() {
    if (OLD_URL.indexOf('www.bilibili.com') !== -1) {
      let video_common_card = document.getElementsByClassName('video-card-common');
      for (let video_common_card_item of video_common_card) {
        hide_Handle(
          video_common_card_item,
          (video_common_card_item.querySelector('a.up') && video_common_card_item.querySelector('a.up').textContent.replace(/\s+$/i, '')) ||
            (video_common_card_item.querySelector('a.ex-up') &&
              video_common_card_item.querySelector('a.ex-up').textContent.replace(/\s+$/i, '')),
          video_common_card_item.querySelector('a.title') || video_common_card_item.querySelector('p.ex-title'),
          1
        );
      }
      let video_card_reco = document.getElementsByClassName('video-card-reco');
      for (let video_card_reco_item of video_card_reco) {
        hide_Handle(
          video_card_reco_item,
          video_card_reco_item.querySelector('p.up') && video_card_reco_item.querySelector('p.up').textContent.replace(/\s+$/i, ''),
          video_card_reco_item.querySelector('p.title')
        );
      }
      let van_slide = document.querySelectorAll('.van-slide div.item');
      for (let van_slide_item of van_slide) {
        hide_Handle(van_slide_item, null, van_slide_item.querySelector('p.title'));
      }
      let rank_wrap = document.getElementsByClassName('rank-wrap');
      for (let rank_wrap_item of rank_wrap) {
        hide_Handle(
          rank_wrap_item,
          rank_wrap_item.querySelector('span.name'),
          rank_wrap_item.querySelector('p.f-title') ||
            rank_wrap_item.querySelector('p.title') ||
            rank_wrap_item.querySelector('div.txt a.link p')
        );
      }
      let article_card = document.getElementsByClassName('article-card');
      for (let article_card_item of article_card) {
        hide_Handle(article_card_item, article_card_item.querySelector('a.up'), article_card_item.querySelector('a.title'), 1);
      }
      let live_card = document.getElementsByClassName('live-card');
      for (let live_card_item of live_card) {
        hide_Handle(live_card_item, live_card_item.querySelector('p.name'), live_card_item.querySelector('p.desc'), 1, { live: true });
      }
      let card_live_module = document.getElementsByClassName('card-live-module');
      for (let card_live_module_item of card_live_module) {
        hide_Handle(card_live_module_item, card_live_module_item.querySelector('.auther'), card_live_module_item.querySelector('p.t'), 1, {
          live: true,
        });
      }
      let live_rank = document.getElementsByClassName('live-rank-item');
      for (let live_rank_item of live_rank) {
        hide_Handle(live_rank_item, live_rank_item.querySelector('div.txt > p'), live_rank_item.querySelector('p.p2'), 0, { live: true });
      }
      let manga_card = document.getElementsByClassName('manga-card');
      for (let manga_card_item of manga_card) {
        hide_Handle(manga_card_item, null, manga_card_item.querySelector('p.manga-title'), 1);
      }
      let manga_spread_module = document.getElementsByClassName('manga-spread-module');
      for (let manga_spread_module_item of manga_spread_module) {
        hide_Handle(manga_spread_module_item, null, manga_spread_module_item.querySelector('p.t'), 1);
      }
      let spread_module = document.querySelectorAll('.storey-box .spread-module');
      for (let spread_module_item of spread_module) {
        let bv_num = get_Bv_Number(spread_module_item.querySelector('a').href);
        async_Username_Handle(bv_num, spread_module_item, spread_module_item.querySelector('p.t'));
      }
      let groom_module = document.getElementsByClassName('groom-module');
      for (let groom_module_item of groom_module) {
        hide_Handle(
          groom_module_item,
          groom_module_item.querySelector('p.author') &&
            groom_module_item.querySelector('p.author').textContent.replace(/^up主：|\s+$/i, ''),
          groom_module_item.querySelector('p.title')
        );
      }
      try {
        let carousel_module_panel = document.querySelector('.carousel-module .panel');
        if (carousel_module_panel) {
          let carousel_module_panel_title = carousel_module_panel.querySelectorAll('ul.title a');
          let carousel_module_panel_pic = carousel_module_panel.querySelectorAll('ul.pic li');
          let carousel_module_panel_trig = carousel_module_panel.querySelectorAll('ul.trig span');
          for (let panel_index = 0; panel_index < carousel_module_panel_title.length; panel_index++) {
            hide_Handle(
              [carousel_module_panel_title[panel_index], carousel_module_panel_pic[panel_index], carousel_module_panel_trig[panel_index]],
              null,
              carousel_module_panel_title[panel_index],
              3
            );
          }
        }
      } catch (e) {
        console.error('bilibili_BLock Ver.3.7.0: Variable carousel_module_panel is error.');
        console.error(e);
      }
      let rank_item = document.getElementsByClassName('rank-item');
      for (let rank_item_ele of rank_item) {
        let text_value = '';
        if (rank_item_ele.querySelector('p.ri-title')) {
          text_value = rank_item_ele.querySelector('p.ri-title');
        }
        if (rank_item_ele.querySelector('a.title')) {
          text_value = rank_item_ele.querySelector('a.title');
        }
        if (rank_item_ele.querySelector('.detail > a')) {
          hide_Handle(rank_item_ele, rank_item_ele.querySelector('.detail > a'), text_value);
        } else if (rank_item_ele.querySelector('a')) {
          let link_a = rank_item_ele.querySelector('a');
          let bv_num = get_Bv_Number(link_a.href);
          async_Username_Handle(bv_num, rank_item_ele, text_value);
        }
      }
      let recent_hot = document.querySelectorAll('div#recent_hot li');
      for (let recent_hot_item of recent_hot) {
        let bv_num = get_Bv_Number(recent_hot_item.querySelector('a').href);
        async_Username_Handle(bv_num, recent_hot_item, recent_hot_item.title);
      }
      let vd_list = document.querySelectorAll('ul.vd-list li');
      for (let vd_list_item of vd_list) {
        hide_Handle(vd_list_item, vd_list_item.querySelector('a.v-author'), vd_list_item.querySelector('a.title'));
      }
      let video_page_card = document.getElementsByClassName('video-page-card');
      for (let video_page_card_item of video_page_card) {
        hide_Handle(video_page_card_item, video_page_card_item.querySelector('div.up'), video_page_card_item.querySelector('.title'));
      }
      let bilibili_player_recommend_video = document.getElementsByClassName('bilibili-player-recommend-video');
      for (let bilibili_player_recommend_video_item of bilibili_player_recommend_video) {
        let bv_num = get_Bv_Number(bilibili_player_recommend_video_item.href);
        async_Username_Handle(
          bv_num,
          bilibili_player_recommend_video_item,
          bilibili_player_recommend_video_item.querySelector('.bilibili-player-recommend-title')
        );
      }
      let bilibili_player_ending_panel_box_recommend = document.querySelectorAll('a.bilibili-player-ending-panel-box-recommend');
      for (let bilibili_player_ending_panel_box_recommend_item of bilibili_player_ending_panel_box_recommend) {
        let bv_num = '';
        try {
          bv_num = /(?:av|bv)(\w+)/i.exec(bilibili_player_ending_panel_box_recommend_item.getAttribute('data-bvid'))[1];
        } catch (e) {
          bv_num = null;
        }
        if (!bv_num) {
          try {
            bv_num = get_Bv_Number(bilibili_player_ending_panel_box_recommend_item.href);
          } catch (e) {
            bv_num = null;
          }
        }
        async_Username_Handle(
          bv_num,
          bilibili_player_ending_panel_box_recommend_item,
          bilibili_player_ending_panel_box_recommend_item.querySelector('.bilibili-player-ending-panel-box-recommend-cover-title')
        );
      }
      let read_rank_list = document.querySelectorAll('.rank-list li.item');
      for (let read_rank_list_item of read_rank_list) {
        hide_Handle(read_rank_list_item, null, read_rank_list_item.querySelector('> a'));
      }
      if (OLD_URL.indexOf('www.bilibili.com/video/') !== -1 || OLD_URL.indexOf('www.bilibili.com/bangumi/') !== -1) {
        const ebox = document.querySelectorAll('.ebox');
        for (let ebox_item of ebox) {
          hide_Handle(ebox_item, ebox_item.querySelector('.author'), ebox_item.querySelector('.etitle'));
        }
        hide_Comment();
      }
      if (OLD_URL.indexOf('www.bilibili.com/read/ranking')) {
        let article_list = document.querySelectorAll('.article-list li');
        for (let article_list_item of article_list) {
          hide_Handle(article_list_item, article_list_item.querySelector('.nick-name'), article_list_item.querySelector('.article-title'));
        }
      }
      if (OLD_URL.indexOf('www.bilibili.com/v/channel')) {
        let rank_video_card = document.querySelectorAll('.rank-video-card, .video-card');
        for (let rank_video_card_item of rank_video_card) {
          hide_Handle(
            rank_video_card_item,
            rank_video_card_item.querySelector('.up-name'),
            rank_video_card_item.querySelector('.video-name')
          );
        }
      }
    } else if (OLD_URL.indexOf('search.bilibili.com') !== -1) {
      let video_item = document.getElementsByClassName('video-item');
      for (let video_item_ele of video_item) {
        hide_Handle(video_item_ele, video_item_ele.querySelector('a.up-name'), video_item_ele.querySelector('a.title'));
      }
      let live_user_item = document.getElementsByClassName('live-user-item');
      for (let live_card_item_ele of live_user_item) {
        hide_Handle(live_card_item_ele, live_card_item_ele.querySelector('.uname'), null, 0, { live: true });
      }
      let live_room_item = document.getElementsByClassName('live-room-item');
      for (let live_room_item_ele of live_room_item) {
        hide_Handle(
          live_room_item_ele,
          live_room_item_ele.querySelector('.uname span'),
          live_room_item_ele.querySelector('.item-title'),
          0,
          { live: true }
        );
      }
      let photo_item = document.getElementsByClassName('photo-item');
      for (let photo_item_ele of photo_item) {
        hide_Handle(photo_item_ele, photo_item_ele.querySelector('.up-name'), photo_item_ele.querySelector('.title'), 0, { pic: true });
      }
    } else if (OLD_URL.indexOf('live.bilibili.com') !== -1) {
      let rank_item = document.getElementsByClassName('rank-item');
      for (let rank_item_ele of rank_item) {
        hide_Handle(rank_item_ele, rank_item_ele.querySelector('.room-anchor'), rank_item_ele.querySelector('.room-title'), 0, {
          live: true,
        });
      }
      let room_crad_wrapper = document.getElementsByClassName('room-card-wrapper');
      for (let room_crad_wrapper_item of room_crad_wrapper) {
        hide_Handle(
          room_crad_wrapper_item,
          room_crad_wrapper_item.querySelector('.room-anchor > span'),
          room_crad_wrapper_item.querySelector('.room-title'),
          0,
          { live: true }
        );
      }
      let ysly_room_ctnr = document.querySelectorAll('.ysly-room-ctnr li');
      for (let ysly_room_ctnr_item of ysly_room_ctnr) {
        hide_Handle(ysly_room_ctnr_item, ysly_room_ctnr_item.querySelector('.uname'), ysly_room_ctnr_item.querySelector('.room-name'), 0, {
          live: true,
        });
      }
      let list = document.querySelectorAll('ul.list li');
      for (let list_item of list) {
        hide_Handle(list_item, list_item.querySelector('.room-anchor > span'), list_item.querySelector('.room-title'), 0, { live: true });
      }
      let card_items = document.querySelectorAll('.card-items li');
      for (let card_items_ele of card_items) {
        hide_Handle(card_items_ele, card_items_ele.querySelector('.uname'), card_items_ele.querySelector('.room-name'), 0, { live: true });
      }
      hide_Comment();
    } else if (/(t|manga|space)\.bilibili\.com/.test(OLD_URL)) {
      let card = document.querySelectorAll('div.card');
      for (let card_item of card) {
        let content_full = card_item.querySelector('.content-full');
        let title = card_item.querySelector('.title');
        let source_content = null;
        let convert_text = null;
        let title_text = null;
        if (content_full) {
          source_content = content_full.textContent;
          if (bilibili_config.convertEmojiEnable) {
            convert_text = get_Convert_Text(content_full.innerHTML);
          }
        }
        if (title) {
          title_text = title.textContent;
        }
        if (bilibili_config.convertEmojiEnable) {
          hide_Handle(card_item, null, null, 0, {
            dynamic: {
              title: title_text,
              content: convert_text,
              sourceContent: source_content,
            },
          });
        } else {
          hide_Handle(card_item, null, null, 0, {
            dynamic: {
              title: title_text,
              content: source_content,
            },
          });
        }
      }
      hide_Comment();
    } else if (/h\.bilibili\.com/.test(OLD_URL)) {
      let a_fade_in = document.querySelectorAll('.content li');
      for (let a_fade_in_item of a_fade_in) {
        hide_Handle(
          a_fade_in_item,
          a_fade_in_item.querySelector('.user-container a span'),
          a_fade_in_item.querySelector('.article-title a'),
          0,
          { pic: true }
        );
      }
      let rank_list = document.querySelectorAll('.rank-list > div');
      for (let rank_list_item of rank_list) {
        hide_Handle(
          rank_list_item,
          rank_list_item.querySelector('.name') || rank_list_item.querySelector('.user-name'),
          rank_list_item.querySelector('.title') || rank_list_item.querySelector('.work-name'),
          0,
          { pic: true }
        );
      }
      let canvas_card = document.querySelectorAll('.canvas-card');
      for (let canvas_card_item of canvas_card) {
        hide_Handle(
          canvas_card_item,
          canvas_card_item.querySelector('.user-container a span'),
          canvas_card_item.querySelector('.article-title a'),
          1,
          { pic: true }
        );
      }
      hide_Comment();
    } else if (/message\.bilibili\.com\/#\/reply/.test(OLD_URL)) {
      let reply_item = document.getElementsByClassName('reply-item');
      for (let reply_item_ele of reply_item) {
        let next_node = null;
        if (reply_item_ele.nextElementSibling) {
          if (reply_item_ele.nextElementSibling.classList.contains('divider')) {
            next_node = reply_item_ele.nextElementSibling;
          }
        }
        let source_text = reply_item_ele.querySelector('.text').textContent;
        if (bilibili_config.convertEmojiEnable) {
          let convert_text = reply_item_ele.querySelector('.text span').innerHTML.replace(/<img.*alt="(.*)".*>/g, '$1');
          hide_Handle([reply_item_ele, next_node], reply_item_ele.querySelector('.name-field a'), convert_text, 0, {
            comment: true,
            messageReply: true,
            sourceText: source_text,
            delButton: reply_item_ele.querySelector('.bl-button--primary'),
          });
        } else {
          hide_Handle([reply_item_ele, next_node], reply_item_ele.querySelector('.name-field a'), source_text, 0, {
            comment: true,
            messageReply: true,
            delButton: reply_item_ele.querySelector('.bl-button--primary'),
          });
        }
      }
    }
  }
  function hide_Comment() {
    let comment_list = document.querySelectorAll('.comment-list .list-item');
    for (let comment_list_item of comment_list) {
      let source_text = comment_list_item.querySelector('.con > p.text').textContent;
      if (bilibili_config.convertEmojiEnable) {
        let convert_text = get_Convert_Text(comment_list_item.querySelector('.con > p.text').innerHTML);
        hide_Handle(comment_list_item, comment_list_item.querySelector('.con > .user a.name'), convert_text, 0, {
          comment: true,
          sourceText: source_text,
        });
      } else {
        hide_Handle(comment_list_item, comment_list_item.querySelector('.con > .user a.name'), source_text, 0, { comment: true });
      }
      let comment_reply_btn = comment_list_item.querySelector('.reply.btn-hover');
      if (bilibili_config.showBlockUserBtnEnable) {
        comment_reply_btn &&
          !comment_list_item.querySelector('.bilibili_comment_user_block_button') &&
          comment_reply_btn.after(
            block_obj.createBlockBtn(
              comment_list_item.querySelector('.con > .user a.name').textContent,
              'usernameArray',
              'bilibili_comment_user_block_button',
              'span',
              '屏蔽',
              '屏蔽该用户'
            )
          );
      } else {
        comment_list_item.querySelector('.bilibili_comment_user_block_button') &&
          comment_list_item.querySelector('.bilibili_comment_user_block_button').remove();
      }
      if (bilibili_config.showBangBtnEnable) {
        let comment_btn = comment_list_item.querySelector('.bilibili_comment_user_block_button') || comment_reply_btn;
        comment_btn &&
          !comment_list_item.querySelector('.bilibili_comment_bang_button') &&
          comment_btn.after(
            block_obj.createBigBangBtn(
              source_text,
              'commentArray',
              'bilibili_comment_bang_button',
              'span',
              '爆炸',
              '拆文并选择文本内容进行屏蔽'
            )
          );
      } else {
        comment_list_item.querySelector('.bilibili_comment_bang_button') &&
          comment_list_item.querySelector('.bilibili_comment_bang_button').remove();
      }
    }
    let reply_comment_list = document.querySelectorAll('.comment-list .reply-item');
    for (let reply_comment_list_item of reply_comment_list) {
      let reply_source_text = reply_comment_list_item.querySelector('.reply-con .text-con').textContent;
      if (bilibili_config.convertEmojiEnable) {
        let reply_convert_text = get_Convert_Text(reply_comment_list_item.querySelector('.reply-con .text-con').innerHTML);
        hide_Handle(reply_comment_list_item, reply_comment_list_item.querySelector('.reply-con .user a.name'), reply_convert_text, 0, {
          comment: true,
          sourceText: reply_source_text,
        });
      } else {
        hide_Handle(reply_comment_list_item, reply_comment_list_item.querySelector('.reply-con .user a.name'), reply_source_text, 0, {
          comment: true,
        });
      }
      let reply_btn = reply_comment_list_item.querySelector('.reply.btn-hover');
      if (bilibili_config.showBlockUserBtnEnable) {
        reply_btn &&
          !reply_comment_list_item.querySelector('.bilibili_reply_user_block_button') &&
          reply_btn.after(
            block_obj.createBlockBtn(
              reply_comment_list_item.querySelector('.reply-con .user a.name').textContent,
              'usernameArray',
              'bilibili_reply_user_block_button',
              'span',
              '屏蔽',
              '屏蔽该用户'
            )
          );
      } else {
        reply_comment_list_item.querySelector('.bilibili_reply_user_block_button') &&
          reply_comment_list_item.querySelector('.bilibili_reply_user_block_button').remove();
      }
      if (bilibili_config.showBangBtnEnable) {
        let p_btn = reply_comment_list_item.querySelector('.bilibili_reply_user_block_button') || reply_btn;
        p_btn &&
          !reply_comment_list_item.querySelector('.bilibili_reply_bang_button') &&
          p_btn.after(
            block_obj.createBigBangBtn(
              reply_source_text,
              'commentArray',
              'bilibili_reply_bang_button',
              'span',
              '爆炸',
              '拆文并选择文本内容进行屏蔽'
            )
          );
      } else {
        reply_comment_list_item.querySelector('.bilibili_reply_bang_button') &&
          reply_comment_list_item.querySelector('.bilibili_reply_bang_button').remove();
      }
    }
  }
  function get_Convert_Text(text) {
    return text
      .replace(/<img.*?alt="(.*?)".*?>/g, '$1')
      .replace(/<a.*?>(.*?)<\/\s*a>/g, '$1')
      .replace(/&nbsp;/g, ' ');
  }
  function async_Username_Handle(bv_num, main_ele, text_value, hide_method = 0, type_info = {}) {
    let user_name = '';
    if (bv_num) {
      let record_user = false;
      bv_record.forEach(item => {
        if (item.bv == bv_num) {
          user_name = item.username;
          record_user = true;
        }
      });
      if (record_user) {
        hide_Handle(main_ele, user_name, text_value, hide_method, type_info);
      } else {
        bv_record.push({
          bv: bv_num,
          username: user_name,
        });
        let api_url = bv_num.match(/^\d+$/)
          ? 'https://api.bilibili.com/x/web-interface/view?aid='
          : 'https://api.bilibili.com/x/web-interface/view?bvid=';
        let xhr = new XMLHttpRequest();
        xhr.open('GET', api_url + bv_num, true);
        xhr.responseType = 'json';
        xhr.onload = () => {
          if (xhr.status == 200) {
            if (xhr.response.data && xhr.response.data.owner && xhr.response.data.owner['name']) {
              user_name = xhr.response.data.owner['name'];
            }
          } else {
            send_status = false;
            console.info(api_url + bv_num + '\nresponse status: ' + xhr.status);
          }
          hide_Handle(main_ele, user_name, text_value, hide_method, type_info);
          bv_record.forEach(item => {
            if (item.bv == bv_num) {
              item.username = user_name;
            }
          });
        };
        xhr.onerror = () => {
          console.info(api_url + bv_num + '\nerror.');
          hide_Handle(main_ele, user_name, text_value, hide_method, type_info);
        };
        setTimeout(() => {
          send_status && xhr.send();
        }, INTERVAL_TIME * request_total);
        request_total++;
      }
    } else {
      hide_Handle(main_ele, user_name, text_value, hide_method, type_info);
    }
  }
  function get_Bv_Number(video_link) {
    let bv_num = '';
    try {
      bv_num = /\/video\/(?:av|bv)(\w+)/i.exec(video_link)[1];
    } catch (e) {
      bv_num = null;
    }
    return bv_num;
  }
})();
