// ==UserScript==
// @name         拒绝二维码登录（淘宝、京东等网站默认出现账号密码登录界面）
// @namespace    undefined
// @version      0.3.4
// @description  淘宝、京东、阿里云等网站默认使用账号密码登录，不出现二维码登录界面
// @author       Vizards
// @match        *://login.taobao.com/*
// @match        *://login.1688.com/*
// @match        *://account.aliyun.com/*
// @match        *://passport.jd.com/*
// @match        *://*.weibo.com/*
// @match        *://login.tmall.com/*
// @match        *://*.baidu.com/*
// @match        *://graph.qq.com/*
// @match        *://xui.ptlogin2.qq.com/*
// @match        *://ssl.xui.ptlogin2.qq.com/*
// @match        *://ui.ptlogin2.qq.com/*
// @match        *://passport.suning.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.douyu.com/*
// @match        *://*.alipay.com/*
// @match        *://passport.xiami.com/*
// @match        *://passport.csdn.net/*
// @grant        none
// ==/UserScript==

/**
 * login.taobao.com/*
 * login.1688.com/*
 * login.tmall.com/*
 */

if (location.hostname === 'login.taobao.com') {
   var auto = setInterval(function() {
       if (window.getComputedStyle(document.getElementById('J_StaticForm')).display === 'none') {
           document.getElementById('J_Quick2Static').click();
           clearInterval(auto);
       }
   }, 50);
}

// passport.jd.com/*
if (location.hostname === 'passport.jd.com') {
   var auto = setInterval(function() {
       if (document.getElementsByClassName('login-box')[0].style.display === 'none') {
           document.getElementsByClassName('login-tab-r')[0].click();
           clearInterval(auto);
       }
   }, 50);
}

// account.aliyun.com/*
if (location.hostname === 'account.aliyun.com') {
	miniLoginEmbedder.init({
	    targetId: 'alibaba-login-iframe',
	    appName: 'aliyun',
	    appEntrance: 'aliyun',
	    iframeUrl: 'https://passport.alibaba.com/mini_login.htm',
	    lang: 'zh_CN',
	    notLoadSsoView: '',
	    notKeepLogin: 'true',
	    loginId: '',
	    iframeHeight: '305px',
	    queryStr: '®Url=https%3A%2F%2Faccount.aliyun.com%2Fregister%2Fregister.htm%3Foauth_callback%3Dhttps%253A%252F%252Fcn.aliyun.com%252F&qrCodeFirst=false'
	});

	setInterval(function () {
	    document.getElementById('alibaba-login-iframe').getElementsByTagName('iframe')[0].style.display = 'none';
	    document.getElementById('alibaba-login-iframe').getElementsByTagName('iframe')[1].height = '320';
        document.getElementById('alibaba-login-iframe').getElementsByTagName('iframe')[1].width = '250';
	    document.getElementsByClassName('agreement')[0].style.bottom = '-25px';
	},50);
}

// weibo.com/*
if (location.hostname === 'weibo.com') {
    var auto = setInterval(function() {
        if (document.getElementsByClassName('W_login_form')[0] !== undefined && document.getElementsByClassName('W_login_form')[0].style.display === 'none') {
            document.getElementsByClassName('W_fb')[0].click();
            clearInterval(auto);
        }
    }, 50);
}

// pan.baidu.com/*
if (location.hostname === 'pan.baidu.com' && location.href.indexOf('disk/home') === -1) {
    var auto = setInterval(function() {
        if (document.getElementById('login-middle') !== null && document.getElementById('login-middle').style.display === 'none') {
            console.log('aaa');
            document.getElementsByClassName("pass-link")[3].click();
            clearInterval(auto);
        }
        if (document.getElementById('passport-login-pop') !== null && document.getElementById('passport-login-pop-api').style.display === 'none') {
            document.getElementsByClassName("pass-link")[3].click();
            clearInterval(auto);
        }
    }, 50);
}

// graph.qq.com/*
// xui.ptlogin2.qq.com/*
// ui.ptlogin2.qq.com/*
if (location.hostname === 'xui.ptlogin2.qq.com' || location.hostname === 'ssl.xui.ptlogin2.qq.com' || location.hostname === 'ui.ptlogin2.qq.com') {
    var auto = setInterval(function() {
        const ele = document.querySelector('.qrlogin_img_out');
        ele && ele.parentNode.removeChild(ele);
        if (document.getElementsByClassName('onekey_logo').length === 1 || document.getElementsByClassName('face').length === 1) {
            document.getElementById('switcher_plogin').click();
            document.getElementById('qrlogin_img').onload = function() {
                clearInterval(auto);
            };
        }
    }, 50);
}
if (location.hostname === 'graph.qq.com') {
    window.onload = function () {
        document.getElementById('select_all').click();
    };
}

// passport.suning.com/*
if (location.hostname === 'passport.suning.com') {
    var auto = setInterval(function() {
        if (document.getElementsByClassName('pc-login')[0].style.display === 'none') {
            document.getElementsByClassName('tab-item')[1].click();
            clearInterval(auto);
        }
    },50);
}

// www.zhihu.com

if (location.hostname === 'www.zhihu.com' || location.hostname === 'zhihu.com') {
   var auto = setInterval(function() {
        if (document.getElementsByTagName('form')[0].style.display === 'none') {
            document.getElementsByClassName('signin-switch-password')[0].click();
            clearInterval(auto);
        }
    },50);
}

// douyu
if (location.hostname === 'passport.douyu.com' || location.hostname === 'douyu.com') {
    var auto = setInterval(function() {
        if (document.getElementsByClassName('loginNormal')[0].className.indexOf('hide') !== -1) {
            document.getElementsByClassName('scanicon-toLogin')[0].click();
            clearInterval(auto);
        }
    }, 50);
}

// alipay
function isNull(v)
{
    return (v === undefined) || (v === null);
}

if (location.hostname.indexOf('alipay.com') !== -1) {
    // 移除video
    var video = document.getElementById('J_video_player');
    video.parentNode.removeChild(video);
    var poster = document.getElementById('J_poster');
    poster.parentNode.removeChild(poster);
    var auto = setInterval(function() {
        // 条件：用户点了登录按钮
        var popbox = document.getElementsByClassName('popbox stat-login');
        if (popbox.length !== 0)
        {
            // 获取嵌套的iframe
            var iframe = document.getElementById('J_loginIframe');
            if(!isNull(iframe))
            {
                var contentWindow = iframe.contentWindow;
                if(!isNull(contentWindow))
                {
                    var loginMethod = contentWindow.document.getElementById('J-loginFormMethod');
                    if(!isNull(loginMethod))
                    {
                        contentWindow.document.getElementById('J-qrcode-target').click();
                        clearInterval(auto);
                    }
                }
            }
        }
    }, 50);
}
if (location.hostname === 'auth.alipay.com') {
   var pathname = location.pathname;
   if (pathname === '/login/express.htm')
   {
       var auto = setInterval(function() {
           var loginMethod = document.getElementById('J-loginFormMethod');
           if(!isNull(loginMethod))
           {
               var style = window.getComputedStyle(loginMethod);
               if (!isNull(style) && isNull(style.value)) {
                   var qrcode = document.getElementById('J-qrcode-target');
                   if (!isNull(qrcode))
                   {
                       qrcode.click();
                       clearInterval(auto);
                   }
               }
           }
       }, 50);
   }
   else if (pathname === '/login/index.htm')
   {
       // 显示账密登录
       var loginForm = document.getElementById('J-login');
       if(!isNull(loginForm))
       {
           loginForm.setAttribute('class', 'login login-modern');
       }
       // 隐藏扫码登录
       var qrCodeForm = document.getElementById('J-qrcode');
       if(!isNull(qrCodeForm))
       {
           qrCodeForm.setAttribute('class', 'qrcode qrcode-modern  fn-hide');
       }
   }
}

// passport.xiami.com
if (location.hostname === 'passport.xiami.com') {
    var auto = setInterval(function() {
        if (document.getElementsByClassName('login-xm')[0].style.display === 'none') {
            document.getElementById('J_LoginSwitch').click();
            clearInterval(auto);
        }
    }, 50);
}

// www.baidu.com
// tieba.baidu.com
// passport.baidu.com
if (location.hostname === 'www.baidu.com' || location.hostname === 'tieba.baidu.com' || location.hostname === 'passport.baidu.com') {
    var auto = setInterval(function(){
      if (document.getElementById('passport-login-pop') !== null || document.getElementsByClassName('tang-pass-qrcode')[0].style.display === 'block') {
          document.getElementsByClassName('tang-pass-footerBarULogin')[0].click();
          clearInterval(auto);
      }
    }, 50);
}

// passport.csdn.com
if (location.hostname === 'passport.csdn.net') {
    var auto = setInterval(function(){
        if (document.getElementsByClassName('login-user')[0].className.indexOf('hide') === -1) {
            document.getElementsByClassName('js_login_trigger')[0].click();
        }
        if (document.getElementsByClassName('login-user')[0].className.indexOf('hide') !== -1) {
            clearInterval(auto);
        }
    })
}
