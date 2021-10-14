// ==UserScript==
// @name         百度网盘自定义分享密码
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  让事情恢复成本来就应该是本来的样子
// @author       You
// @match        https://pan.baidu.com/disk/home*
// @match        https://pan.baidu.com/disk/main*
// @match        https://pan.baidu.com/play/video*
// @match        https://yun.baidu.com/disk/home*
// @match        https://yun.baidu.com/disk/main*
// @match        https://yun.baidu.com/play/video*
// @icon         https://eyun.baidu.com/box-static/page-common/images/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require      https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @grant        none
// ==/UserScript==
 
(function() {
    'use strict';
    var $ = $ || window.$;
 
    if (window.require) {
        $(document).on("DOMNodeInserted", ".share-file__link-expired", function() {
            if ($(".input-share-pwd").length == 0) {
                var sharePwd = localStorage.getItem("share_pwd");
                var html = '<div style="margin:20px;"></div><div class="share-file__link-expired-title">自定义分享密码</div>';
                html += '<div class="share-file__link-expired"><div class="share-file__link-expired-label">提取码</div>';
                html += '<input type="text" class="input-share-pwd" value="' + (sharePwd ? sharePwd : "") + '" placeholder="为空则随机四位" style="margin-left: 16px; width: 120px; height: 32px; line-height: 28px; border: 1px solid #D4D7DE; border-radius: 8px; text-align: left; padding-left: 12px"></div>';
                $(".share-file__link-expired").after(html);
            }
        });
 
        window.require.async("function-widget-1:share/util/newShare/linkSetting.js", function (prototype) {
            prototype.makePrivatePasswordA = prototype.makePrivatePassword;
            prototype.makePrivatePassword = function () {
                var sharePwd = localStorage.getItem("share_pwd");
                return sharePwd ? sharePwd : this.makePrivatePasswordA();
            };
        });
 
        $(document).on("change", ".input-share-pwd", function () {
            var value = this.value;
            if (value && !value.match(/^[a-z\d]{4}$/i)) {
                unsafeWindow.require("system-core:system/uiService/tip/tip.js").show({mode: "failure", msg: "提取码不合规范，只能是四位字母数字组合"});
            }
            localStorage.setItem("share_pwd", value);
        });
 
        return;
    }
    /*=============================================================== 分割线 ===============================================================*/
 
    $(document).on("DOMNodeInserted", ".wp-share-file__link-expired", function() {
        if ($(".wp-input-share-pwd").length == 0) {
            var sharePwd = localStorage.getItem("share_pwd");
            var html = '<div style="margin:20px;"></div><div class="wp-share-file__link-expired-title">自定义分享密码</div>';
            html += '<div class="wp-share-file__link-expired"><div class="wp-share-file__link-expired-label inline-block-v-middle">提取码</div>';
            html += '<input type="text" class="wp-input-share-pwd" value="' + (sharePwd ? sharePwd : "") + '" placeholder="为空则随机四位" style="margin-left: 13px; width: 120px; height: 32px; line-height: 28px; border: 1px solid #D4D7DE; border-radius: 8px; text-align: left; padding-left: 12px"></div>'
            $(".wp-share-file__link-expired").after(html);
        }
    });
 
    window.ah.proxy({
        onRequest: (config, handler) => {
            if (config.url.indexOf("/share/set") > -1) {
                var sharePwd = localStorage.getItem("share_pwd");
                config.body = config.body.replace(/pwd=\w+/, "pwd=" + sharePwd);
            }
            handler.next(config);
        },
        onResponse: (response, handler) => {
            if ((response.config.url).indexOf("/share/set") > -1) {
                var sharePwd = localStorage.getItem("share_pwd");
                if ((response.config.body).indexOf(sharePwd) > 0 && response.response.errno == 0) {
                    sessionStorage.setItem("share_pwd", sharePwd);
                }
                else {
                    sessionStorage.removeItem("share_pwd");
                }
            }
            handler.next(response);
        }
    })
 
    document.querySelector("body").addEventListener("copy", function(event) {
        try {
            var sharePwd = sessionStorage.getItem("share_pwd");
            if (sharePwd) {
                event.clipboardData.setData("text/plain", event.target.value.replace(/提取码: [a-z\d]{4}/, "提取码: " + sharePwd));
                event.preventDefault();
            }
        } catch (a) { };
    });
 
    $(document).on("DOMNodeInserted", ".wp-share-file__link-created", function () {
        var sharePwd = sessionStorage.getItem("share_pwd");
        if (sharePwd) {
            var $linkPwdVal = $(this).find(".wp-share-file__link-pwd-val");
            var $pwdInput = $linkPwdVal.children("input");
            if ($linkPwdVal.length && $pwdInput.val() != sharePwd) {
                $pwdInput.remove();
                $linkPwdVal.prepend('<input type="text" readonly="readonly" value="' + sharePwd + '" class="u-input__inner">');
            }
 
            var $img = $(this).find("img");
            var src = $img.attr("src");
            if (src && src.indexOf(sharePwd) == -1) {
                $img.attr("src", src.replace(/pwd=\w+/, "pwd=" + sharePwd))
            }
 
            var $a = $(this).find("a");
            var href = $a.attr("href");
            if (href && href.indexOf(sharePwd) == -1) {
                $a.attr("href", href.replace(/pwd=\w+/, "pwd=" + sharePwd))
            }
        }
    });
 
    $(document).on("change", ".wp-input-share-pwd", function () {
        var value = this.value;
        if (value && !value.match(/^[a-z\d]{4}$/i)) {
            $("body").append('<div role="alert" class="u-message u-message--error" style="top: 20px; z-index: 2014;"><i class="u-message__icon u-icon-delete"></i> <p class="u-message__content">提取码不合规范，只能是四位字母数字组合</p> <!----></div>')
            setTimeout(function () {$(".u-message").remove()}, 3000)
        }
        localStorage.setItem("share_pwd", value);
    });
 
    // Your code here...
})();
