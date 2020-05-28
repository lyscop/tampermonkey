// ==UserScript==
// @name         百度文库原文件下载！
// @namespace    aiwenku
// @version      2.0.3
// @description  【长期稳定下载，永久维护更新】百度文库破解，每天下载百度文库原文件，无需登录百度文库，无需百度文库下载券，下载百度文库的原文件，非文字提取。脚本用户每天都有福利。1、必须微信扫码登录并关注公众号，为了防止下载接口被别人刷爆，扫码登录是必须的，没办法，谢谢大家的理解2、只能免费下载标注着“下载券”的文档，“付费文档”和“会员专享文档”需要额外收费，但是都比官方的便宜。使用方法：安装插件后打开百度文库文档页面，在页面下方会出现工具栏，直接点击下载按钮微信扫码关注公众号即可。
// @author       zengyutong
// @include      *://wenku.baidu.com/view/*
// @require      https://cdn.bootcss.com/jquery/2.1.2/jquery.min.js
// ==/UserScript==


(function () {
    'use strict';
    var loginUUID;
    var countdownTimer = null;
    var timer = null;
    const COOKIE = {
	  getItem(name) {
	    let v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	    return v ? v[2] : null;
	  },
	  setItem(name, value, days) {
	    let d = new Date();
	    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * (days || 30 ));
	    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
	  },
	  remove(name) {
	    this.setItem(name, '', -1);
	  }
	};
    function generateUUID(){
	    var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0;
	        d = Math.floor(d/16);
	        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
	    });
	    return uuid;
	};
    function loginUp(callback){
		loginUUID = generateUUID();
		var url = 'https://www.258wk.com/api/wx/qrcode/get/aiwk_web:'+loginUUID;
		$.ajax({
          url:url,
          method:'get',
          success:function(res){
              if(res.success){
                 callback(res.data)
              }
          },
          error:function(err){
              message('danger','请求失败，请稍后重试')
          }
        });
	}
    function message(type,text){
      var message = '<div id="awk-message" class='+ type +'>'+
             text+
       '</div>';
      clearTimeout(timer);
      if($('#awk-message').length === 0){
          $('body').append(message);
      }else{
         $('#awk-message').remove();
         $('body').append(message);
      }
      
      timer = setTimeout(function(){
         $('#awk-message').fadeOut();
      },5000)
    }

    function check_login(){

		timer = setTimeout(function(){
			var url = 'https://www.258wk.com/api/wx/user/checklogin/aiwk_web:'+loginUUID;
            $.ajax({
               url:url,
               method:'get',
               success:function(res){
                   if(res.success){
                       COOKIE.setItem('openId',res.data.openId);
                       COOKIE.setItem('cardNo',res.data.cardNo);
                       COOKIE.setItem('secenKey',res.data.key);
                       downloadDoc();
                       $('.awk-modal').fadeToggle();
                   }else{
                      check_login();
                   }
               },
               error:function(err){
                   message('danger','请求失败，请稍后重试')
               }
            })
		}, 2000)
	}
    function downloadDoc(){
    	var secenKey = COOKIE.getItem('secenKey');
    	var openId = COOKIE.getItem('openId');
        var cardNo = COOKIE.getItem('cardNo');
        var docRequestUrl = window.location.href;
        var body = {
            docRequestUrl,
            cardNo,
            origin: 'aiwk_web',
            openId,
            secenKey
        };
        $('.awk-loading').fadeIn();
        $.ajax({
          url:'https://www.258wk.com/apiDown/getDoc',
          method:'post',
          dataType:'json',
          contentType:'application/json',
          data:JSON.stringify(body),
          success:function(res){
             if(res.success){
                var a = document.createElement('a');
                a.href= res.data.downloadUrl;
				a.rel = 'noreferrer';
                a.click();
                a = null;
                var text = '更多免费领下载码的活动见公众号。【如见到本提示但浏览器没有进行下载，是你浏览器拦截了下载弹窗，请允许本站弹出窗口，具体解除拦截的方法百度一下！】 如未自动下载，请点击<a href='+res.data.downloadUrl+' target="_blank">这里下载</a>'
                message('info',text)
              }else if(res.hasError && res.data === 'empty'){
                countdownInit();
                $('.awk-modal-tip').fadeToggle();
                message('info',res.message)
              }else if(res.success && !res.data){
                 message('info',res.message)
              }else{
                message('info',res.message)
                loginUp(function(src){
                   var href = window.location.href;
                   href = 'http://www.258wk.com/?url=' + href;
                   var content = '<div>'+
                       '<h2>打开微信扫码即可完成下载</h2>'+
                       '<p>爱文库官方微信公众号</p>'+
                       '<img src='+src+' />'+
                       '<p>注：为防止恶意盗刷接口，请您微信扫码完成登录</p>'+
                       '<a class=awk-button href='+href+' target=_blank>跳转插件网站下载</a>'
                   '</div>'
                   $('.awk-modal-content').empty();
                   $('.awk-modal-content').append(content)
                   $('.awk-modal').fadeToggle();
                   check_login();
               });
              }

          },
          error:function(err){
              message('danger','请求失败，请稍后重试')
          },
          complete:function(){
             $('.awk-loading').fadeOut();
          }
        })
    }
     function countdownInit(){
        var cDate = COOKIE.getItem('countdown-date');
        var todayDate =  new Date().toLocaleDateString();
        if(!cDate || cDate !== todayDate){
        	COOKIE.setItem('countdown-date', todayDate);
            COOKIE.setItem('countdown-count', 0);
        }

        function countdownStart(){
            var _countdown = $(".awk-count-down");
            var count = COOKIE.getItem('countdown-count');
            if(count && Number(count) >=3){
            	clearInterval(countdownTimer);
            	countdownTimer = null;
                return;
            }
            var endTime = COOKIE.getItem('countdown-start');
            if(!endTime) {
                endTime = Date.parse(new Date()) + 60000 * 90;
                // endTime = Date.parse(new Date()) + 20000;
                COOKIE.setItem('countdown-start', endTime);
                setAdImg(true);
            };
            var startTime  = Date.parse(new Date()) ;
            var upgradeTime = (endTime - startTime)  / 1000;
            var seconds = upgradeTime;

            var days        = Math.floor(seconds/24/60/60);
            var hoursLeft   = Math.floor((seconds) - (days*86400));
            var hours       = Math.floor(hoursLeft/3600);
            var minutesLeft = Math.floor((hoursLeft) - (hours*3600));
            var minutes     = Math.floor(minutesLeft/60);
            var remainingSeconds = seconds % 60;
            function pad(n) {
                return (n < 10 ? "0" + n : n);
            }

            if (seconds <= 0) {
                clearInterval(countdownTimer);
                countdownTimer = null;
                COOKIE.remove('countdown-start');
                count = COOKIE.getItem('countdown-count');
                COOKIE.setItem('countdown-count', count ? Number(count)+ 1 : 1);
                // var dd = "剩余时间：00&nbsp;小时&nbsp;00&nbsp;分&nbsp;00&nbsp;秒";
                // _countdown.html(dd);
                setAdImg(false);
            } else {
                seconds--;
                var  dd = "剩余时间："+ pad(hours) + "&nbsp;小时&nbsp;" + pad(minutes) + "&nbsp;分&nbsp;" + pad(remainingSeconds) + "&nbsp;秒";
                _countdown.html(dd);
            }
        }
        if(!countdownTimer){
        	countdownTimer = setInterval(countdownStart, 1000);
        }
    }
    function render() {
        var style = $('<style>', {
            type: 'text/css',
        })
        var styleContent = document.createTextNode(
            'a{text-decoration:none !important}'+
            '.awk-content{height:100px;width:150px;position:fixed;left:0;top:200px;text-align:center;font-size:16px;text-decoration: none;z-index:999999}' +
            '.awk-download{margin-bottom:20px;display:inline-block;width:100%;background-color:rgba(26, 169, 123, 1);color:white;line-height:50px;cursor:pointer;text-decoration: none;}' +
            '.awk-toolbar{width:965px;background-color:#f4f4f4;padding:20px 50px;text-align:left;border:1px solid rgba(39, 173, 132, 1);transition:all .2s;box-sizing:border-box;transition:all .2s}' +
            '.awk-toolbar:after{content:"";display:block;clear:both;}'+
            '.awk-toolbar b{font-weight:600}'+
            '.awk-toolbar-content{display:inline-block;width:50%;float:left;}' +
            '.awk-title{font-size:20px;color:#1AA97B;margin:0;border-bottom:1px solid #1AA97B;padding-bottom:20px;line-height:22px;}' +
            '.awk-button{cursor:pointer;width:140px;line-height:40px;border-radius:4px;transition:all .2s linear;outline:none;border:1px solid rgb(188, 188, 188);color:rgb(39, 173, 132)}' +
            '.awk-button-green{background-color:rgb(39, 173, 132);color:white;margin-right:20px}' +
            '.awk-support{color:#797979;font-size:12px;margin-top:-12px;text-align:center}' +
            '.awk-adv{color:#797979;}' +
            '.awk-adv img{width:100%;height:110px}' +
            '.awk-tip{font-size:18px;}'+
            '.reader-tools-bar-wrap.tools-bar-small{height:auto !important}'+
            '.reader-tools-bar{height:auto !important;}'+
            '.awk-modal,.awk-modal-tip{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.4);z-index:99999;display:none}'+
            '.awk-modal>div,.awk-modal-tip>div{width:600px;height:400px;background-color:white;border-radius:5px;position:absolute;top:50%;left:50%;transform: translate(-50%,-50%);}'+
            '.awk-close,.awk-close-tip{font-size:24px;border:1px solid #666;border-radius:50%;display:inline-block;width:20px;height:20px;line-height:17px;text-align:center;font-style:normal;position:absolute;top:15px;right:15px;cursor:pointer;}'+
            '.awk-modal-content{text-align:center;padding-top:55px;font-size:14px;}'+
            '.awk-modal-content>div>h2{color:#3f7ae9;font-size:18px;margin-bottom:30px;}'+
            '.awk-modal-content>div>img{width:140px;height:140px;margin:10px 0 20px;}'+
            '.awk-modal-content>div>a{display:inline-block;margin-top:20px;color: rgb(188,188,188);line-height: 30px;}'+
            '.awk-modal-tip .awk-close-tip{border-color:white;color:white;}'+
            '.awk-modal-tip-head{background: linear-gradient(270deg, rgba(63, 122, 233, 1) 0%, rgba(63, 122, 233, 1) 0%, rgba(30, 83, 187, 1) 100%, rgba(30, 83, 187, 1) 100%);height:155px;text-align:center;padding-top:40px;box-sizing:border-box;}'+
            '.awk-modal-tip-head>h2{color:white;font-size:20px;font-weight:600;margin-bottom:20px;}'+
            '.awk-modal-tip-head>h3{color:white;font-size:18px;font-weight:500}'+
            '.awk-modal-tip p{color:#3F7AE9;font-size:18px;text-align:center;margin:20px 0;}'+
            '.awk-modal-tip-head p{color: white;margin-top: 10px;}'+
            '.awk-modal-top-img{overflow:hidden;padding:0 10px}'+
            '.awk-modal-top-img>a{display:inline-block;float:left;width:49%;height:150px;position:relative;}'+
            '.awk-modal-top-img img{width:100%;height:100%}'+
            '.awk-modal-top-img>div{float:right;width:49%;height:150px;}'+
            '.awk-modal-top-img>div>a{width:100%;height:46.5%;display:inline-block}'+
            '.awk-modal-top-img>div>a:first-child{margin-bottom:10px}'+
            '.awk-modal-top-img>div>a>img{height:100%}'+
            '.awk-modal-tip .tip{text-align:right;color:#949494;font-size: 12px;margin-top: 8px;padding-right:10px;}'+
            '.awk-count-down{position:absolute;    position: absolute;right: 5px;bottom: 7px;color: rgba(108,62,40,1);}'+
            '.info{color: #8a6d3b;background-color: #fcf8e3;border-color: #faebcc;}'+
            '.danger{color: #a94442;background-color: #f2dede;border-color: #ebccd1;}'+
            '#awk-message{position: fixed;top: 50%;left: 50%;z-index: 99999;transform: translate(-50%,-50%);padding: 10px;box-shadow: 0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08), 0 9px 28px 8px rgba(0,0,0,.05);}'+
            '.awk-loading{position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.4);z-index:100000;display:none}'+
            '.awk-loading>svg{position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);color:white;animation:loadingCircle 1s infinite linear;font-size:60px;}'+
            '@keyframes loadingCircle {100% {-webkit-transform: rotate(360deg);transform:translate(-50%, -50%) rotateZ(360deg);transform-origin:50% 50%;}}'+
            '.awk-spread{margin-left:50px;cursor:pointer;text-decoration: underline !important;font-size:14px;}'+
            '.awk-spread svg{width:14px;height:14px;vertical-align:middle;transform:rotate(180deg);transition:all .2s}'+
            '.awk-active{height:60px;overflow:hidden}'+
            '.awk-active .awk-spread svg{transform:rotate(360deg)}'

        );
        style.append(styleContent);
        $('head').append(style);
        var content = $('<div>', {
            class: 'awk-content'
        });
        var download = $('<a>', {
            class: 'awk-download',
            href: '#toolbar'
        })
        var vipDownload = $('<a>', {
            style: 'line-height:60px',
            class: 'awk-download'
        })
        var buttonGroup = '';
        var modal = $('<div>',{
            class:'awk-modal'
        })
        var modalConten = '<div id=modal><i class=awk-close>×</i><div class=awk-modal-content></div></div>'
        modal.append(modalConten);
        var tipModal = '<div class=awk-modal-tip>'+
             '<div id=modal><i class=awk-close-tip>×</i>'+
                 '<div class=awk-modal-tip-head>'+
                     '<h2>您今日免费下载次数已用完！</h2>'+
                     '<h3>如需更多下载次数，请购码完成充值</h3>'+
                     '<p>如已完成购卡，请在“青睐黑科技”公众号内完成充值</p>'+
                 '</div>'+
                 '<p>您获得一次限时优惠购码资格</p>'+
                 '<div class=awk-modal-top-img>'+
                     'https://www.510ka.com/details/A04BE12E" target="_blank">https://wenku-static.oss-cn-shenzhen.aliyuncs.com/img/1000wk/200.png" />'+
                     '<div>'+
                       'https://www.510ka.com/details/C25D54E6" target="_blank">https://wenku-static.oss-cn-shenzhen.aliyuncs.com/img/1000wk/100.png" />'+
                       'https://www.510ka.com/details/0B8CF595" target="_blank">https://wenku-static.oss-cn-shenzhen.aliyuncs.com/img/1000wk/50.png" />'+
                    '</div>'+
                 '</div>'+
                 '<p class=tip>注：为保障插件下载资源，每人每天可免费下载3次</p>'+
             '<div>'+
        '</div>'
        download.text('共享文档免费下载');
        // download.on('click', function () {
        //     var href = window.location.href;
        //     window.open('http://www.258wk.com/?url=' + href, '_blank');
        // })
        vipDownload.append('VIP专享文档代下')
         if($('.toolbar-core-btns-value-text').html().trim().length === 0){
            content.append(vipDownload);
             buttonGroup = '<p class=awk-tip>经过插件检测，本<b>VIP专享文档</b><span style="color:#27AD84">可加群联系管理员人工代下</span></p><button class="awk-button awk-button-green" data-attr=group>点此立即加群</button><button class=awk-button data-attr=jump>打开插件主页</button>';

         }else{
             content.append(download);
             buttonGroup = '<p class=awk-tip><span style="color:#27AD84">恭喜！</span>经过插件检测，本<b>共享文档</b><span style="color:#27AD84">可免费下载</span></p><button class="awk-button awk-button-green" data-attr=login>点此在本页下载</button><button class=awk-button data-attr=jump>跳转插件网站下载</button>'
         }
        var toolbar = (
            '<div class=awk-toolbar name=toolbar>' +

            '<div class=awk-toolbar-content style="width:60%">' +
            '
插件工具栏收起插件
' +
            buttonGroup +
            '</div>' +

            '<div class=awk-toolbar-content style="float:right;width:35%">' +
            '<div class=awk-support>点击下侧广告支持插件作者，O(∩_∩)O谢谢！</div>' +
            '<div class=awk-adv></div>' +
            '</div>'

            + '</div>'
        )
        toolbar = $(toolbar);

        function tips(){
           $('.awk-toolbar').css({border:'10px solid #ff7875',boxShadow:'0px 1px 10px 0px #ff7875'});
            setTimeout(function(){
                $('.awk-toolbar').css({border:'1px solid rgba(39, 173, 132, 1)',boxShadow:'none'});
            },500)
        }
        download.on('click', function () {
            tips();
        })
        vipDownload.on('click',function(){
           tips();
        })
        var loading = $('<div class=awk-loading><svg viewBox="0 0 1024 1024" focusable="false" class="anticon-spin" data-icon="loading" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path></svg></div>')

       
        // content.append(toolbar);
        $('.reader-tools-bar-wrap .reader-tools-bar').append(toolbar);
        $('body').append(content);
        $('body').append(tipModal);
        $('body').append(modal);
        $('body').append(loading);
        $('body').append('
http://www.258wk.com/apiDown/getRightAdv"> type="text" value="11111" name="22222">'
)
        $('[data-attr=jump]').on('click',function(){
            var href = window.location.href;
            window.open('http://www.258wk.com/?url=' + href, '_blank');
        })
        $('.awk-spread').on('click',function(){
          if($('.awk-toolbar').hasClass('awk-active')){
              $('.awk-spread a').text('收起插件');
              $('.awk-toolbar').removeClass('awk-active');
          }else{
              $('.awk-spread a').text('展开插件');
              $('.awk-toolbar').addClass('awk-active');
          }
        })
        $('[data-attr=group]').on('click',function(){
           $.ajax({
               url:'https://www.258wk.com/apiDown/getInformation',
               method:'get',
               success:function(res){
                    if(res.success){
                       window.open(res.data.rmbQq,'_blank')
                    }
               },
               error:function(err){
                  message('danger','请求失败，请稍后重试')
               }
             })
        })
        $('[data-attr=login]').on('click',function(){
            var secenKey = COOKIE.getItem('secenKey');
            var openId = COOKIE.getItem('openId');
            var cardNo = COOKIE.getItem('cardNo');
            if(secenKey&&openId&&cardNo){
              downloadDoc()
            }else{
               loginUp(function(src){
                   var href = window.location.href;
                   href = 'http://www.258wk.com/?url=' + href;
                   var content = '<div>'+
                       '<h2>打开微信扫码即可完成下载</h2>'+
                       '<p>爱文库官方微信公众号</p>'+
                       '<img src='+src+' />'+
                       '<p>注：为防止恶意盗刷接口，请您微信扫码完成登录</p>'+
                       '<a class=awk-button href='+href+' target=_blank>跳转插件网站下载</a>'
                   '</div>'
                   $('.awk-modal-content').empty();
                   $('.awk-modal-content').append(content)
                   $('.awk-modal').fadeToggle();
                   check_login();
               });
            }

            
        })
        $('.awk-close').on('click',function(){
           $('.awk-modal').fadeToggle();
           $('.awk-modal-content').empty();
        })
        $('.awk-close-tip').on('click',function(){
           $('.awk-modal-tip').fadeToggle();
        })
        $.ajax({
          url:'https://www.258wk.com/apiDown/getRightAdv',
            method:'get',
          success:function(res){
              if(res.success){
                  var img = res.data[0] && res.data[0].imgPath;
                  var href = res.data[0] && res.data[0].url;
                  $('.awk-adv').append('<a href='+ href +' target=_blank><img src='+ img  +' /></a>')
              }
          },
          error:function(err){
              message('danger','请求失败，请稍后重试')
          }
        })
    }
   var timer = setInterval(function(){
       if($('.reader-tools-bar-wrap').length){
              clearInterval(timer);
              render();

         }
    },1000)

    
})();
