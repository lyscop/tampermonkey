// ==UserScript==
// @name           手机端浏览器功能扩展(原yandex视频横屏插件)
// @name:en        Add additional functions to mobile browser
// @description    手机端可装插件浏览器(如yandex，kiwi)添加额外的功能。例如:双击视频全屏，双击快速搜索，左右滑动视频进度，单手手势操作等。(手势如：↓↑回到顶部，↑↓回到底部，→←后退，←→前进，→↓关闭标签页，→↑重新打开页面等)
// @description:en Add additional functions to mobile browser(like yandex browser).For example, double click to make video full screen , double click to search for selected text , slide to adjust video progress and sliding gesture by one hand.
// @version        4.2.6
// @author         L.Xavier
// @namespace      https://greasyfork.org/zh-CN/users/128493
// @include        *
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addStyle
// @grant          unsafeWindow
// @grant          window.close
// @grant          GM_openInTab
// @grant          GM_addValueChangeListener
// @run-at         document-start
// @note           功能说明:1.视频重力感应横屏。   2.双击页面进入全屏/退出全屏。   3.视频左右滑动调整视频播放进度。  4.单手手势操作。(↑→↓←打开手势设置界面)    5.双击快速搜索。    6.复制视频地址。    （详情请查看”脚本描述“）
// @v4.2.4         2020-04-13 - 修复双击退出全屏会触发a链接点击事件的问题。
// @v4.2.5         2020-05-03 - 调整滑动距离限制为屏幕最小边的1/4。
// @v4.2.6         2020-05-12 - 修复网址中包含-而无法识别问题。
// ==/UserScript==
(function(){
    'use strict';
    var Ti=null;

    //video标签变量
    var videoEle=document.getElementsByTagName('video'),_videoEle=[],videoPlayer=null,videoNum=0;
    var oriHway='landscape-primary',oriHgamma=0,oriHbeta=0,isLock=true;

    function setVideo(){videoPlayer=this;videoOriLock();}
    function videoOriLock(){
        if(videoPlayer.videoWidth>videoPlayer.videoHeight){isLock=true;}
        else{isLock=false;screen.orientation.unlock();}
    }

    //video标签事件绑定
    function videoEvent(){
        if(videoEle.length>videoNum){
            //播放video标签查找
            for(Ti=videoNum;Ti<videoEle.length;Ti++){
                videoEle[Ti].addEventListener('playing',setVideo);
                if(!videoEle[Ti].paused){
                    videoPlayer=videoEle[Ti];
                    videoOriLock();
                }
                _videoEle[Ti]=videoEle[Ti];
            }
            videoNum=videoEle.length;
        }else if(videoEle.length>0){
            for(Ti=0;Ti<_videoEle.length;Ti++){
                if(!_videoEle[Ti].offsetWidth>0){
                    for(Ti=0;Ti<videoEle.length;Ti++){
                        videoEle[Ti].addEventListener('playing',setVideo);
                        if(!videoEle[Ti].paused){
                            videoPlayer=videoEle[Ti];
                            videoOriLock();
                        }
                        _videoEle[Ti]=videoEle[Ti];
                    }
                    videoNum=videoEle.length;
                    break;
                }
            }
        }
    }

    //重力感应
    window.addEventListener('deviceorientation',function(e){
        if(isLock){
            oriHgamma=e.gamma;
            oriHbeta=(e.beta>0) ? e.beta : -e.beta;
            if((oriHbeta<65 || oriHbeta>115) && (oriHgamma<-25 || oriHgamma>25)){
                oriHway=((oriHbeta<65 && oriHgamma<-25) || (oriHbeta>115 && oriHgamma>25)) ? 'landscape-primary' : 'landscape-secondary';
            }
            screen.orientation.lock(oriHway);
        }
    });

    //手指滑动变量
    var startX=0,startY=0,endX=0,endY=0,angX=0,angY=0,direction='',path='';
    var touchTime=0,nowTime=0,clickTime=0,limit=(window.screen.width>window.screen.height) ? window.screen.height/4 : window.screen.width/4;
    var _startX=0,_startY=0,videoRect=null,saveWords='',saveTime=0,reg=new RegExp(/^(https?:\/\/)?([\w\-]+\.)+\w{2,4}(\/\S*)?$/);

    //手指滑动事件绑定
    function sliderbackListener(){
        //手指接触屏幕
        window.addEventListener('touchstart',function(e){
            touchTime=new Date().getTime();
            startX=e.changedTouches[0].screenX;
            startY=e.changedTouches[0].screenY;
            if(videoPlayer){
                _startX=e.changedTouches[0].clientX;
                _startY=e.changedTouches[0].clientY;
            }
            if(window.getSelection().toString()){
                saveWords=window.getSelection().toString();
                saveTime=touchTime;
            }
        });
        //手指滑动屏幕
        window.addEventListener('touchmove',function(e){
            e.preventDefault();
            if(e.changedTouches.length==1){
                endX=e.changedTouches[0].screenX;
                endY=e.changedTouches[0].screenY;
                angX=(endX>startX) ? endX-startX : startX-endX;
                angY=(endY>startY) ? endY-startY : startY-endY;
                if(angX>limit || angY>limit){
                    if(angX>angY){direction=(endX>startX) ? '→' : '←';}
                    else{direction=(endY>startY) ? '↓' : '↑';}
                    if(path.charAt(path.length-1)!=direction){path+=direction;}
                    startX=endX;startY=endY;
                }
            }else{path='';}
        });
        //手指离开屏幕。
        window.addEventListener('touchend', function(e){
            nowTime=new Date().getTime();
            //操作判定
            if((nowTime-clickTime)<300 && (touchTime-clickTime)>50){//双击
                if((nowTime-saveTime)<450){
                    if(!reg.test(saveWords)){
                        saveWords='https://www.baidu.com/s?wd='+saveWords;
                    }else if(saveWords.indexOf('http')<0){
                        saveWords='//'+saveWords;
                    }
                    GM_openInTab(saveWords,{active:true});
                }else{
                    if(document.webkitFullscreenElement){
                        e.preventDefault();
                        document.webkitExitFullscreen();
                        setTimeout(function(){
                            Ti=document.createElement('input');
                            document.body.appendChild(Ti);
                            Ti.setAttribute('value',videoPlayer.src);
                            Ti.select();
                            document.execCommand('copy');
                            document.body.removeChild(Ti);
                        },500);
                    }
                    else if(videoPlayer){videoPlayer.webkitRequestFullScreen();}
                    else if(iframeEle.length>0){GM_setValue('fullscreen',Date());}
                }
            }else if((touchTime-clickTime)<150 && (touchTime-clickTime)>50){//双击滑动
            }else if((nowTime-touchTime)<150){//点击
                clickTime=nowTime;
                videoEvent();
            }else{//滑动
                if(videoPlayer && path.length<2){
                    //视频滑动
                    videoRect=videoPlayer.getBoundingClientRect();
                    if(_startX>videoRect.x && _startX<(videoRect.x+videoRect.width) && _startY>videoRect.y && _startY<(videoRect.y+videoRect.height)){
                        endX=e.changedTouches[0].clientX;
                        angX=endX-_startX;
                        if(angX>30 || angX<-30){
                            videoPlayer.currentTime+=angX*angX*angX/(27000*(1+(angX*angX-900)/(angX*angX+43650)));
                        }
                    }
                }else if(gesture[path]){
                    //手势执行
                    if(top.location==location){
                        try{eval(pathFn[gesture[path]]);}
                        catch(error){alert('“'+path+'” 手势执行脚本错误：\n'+error+' ！');}
                    }else{
                        GM_setValue('gestureIfr',path);
                    }
                }
            }
            path='';
        });
    }

    //手势功能原始数据
    var gesture={
        '↑→↓←':'打开设置',
        '→←':'后退',
        '←→':'前进',
        '↓↑':'回到顶部',
        '↑↓':'回到底部',
        '←↓':'刷新页面',
        '←↑':'新建页面',
        '→↓':'关闭页面',
        '→↑':'恢复页面',
        '↑→↓':'关闭其他页面',
        '→←→':'视频解析'
    },
    pathFn={
        '打开设置':'openSet()',
        '后退':'var oldUrl=location.href;history.go(-1);setTimeout(function(){if(oldUrl==location.href && (!document.referrer || history.length<2)){GM_setValue("lastTab",location.href);window.close();}},500)',
        '前进':'history.go(1)',
        '回到顶部':'document.documentElement.scrollTop=0',
        '回到底部':'document.documentElement.scrollTop=document.documentElement.scrollHeight',
        '刷新页面':'history.go(0)',
        '新建页面':'GM_openInTab("about:blank",{active:true})',
        '关闭页面':'GM_setValue("lastTab",location.href);window.close()',
        '恢复页面':'GM_openInTab(GM_getValue("lastTab"),{active:true})',
        '关闭其他页面':'GM_setValue("closeAll", Date())',
        '视频解析':'GM_openInTab("http://jx.51yfx.com/?url="+location.href,{active:true})'
    };

    //手势存储数据读取
    gesture=GM_getValue('gesture',gesture);
    pathFn=GM_getValue('pathFn',pathFn);

    sliderbackListener();//事件绑定

    //手势操作设置UI
    var gestureUL=null,gestureEle=null,pathEle=null,gestureName='',gesturePath='';

    function openSet(){
        //页面生成
         GM_addStyle('html{font-size:62.5% !important}'+
                     '#gestureBox{background-color:#fff;width:100%;height:100%;position:fixed;padding:0;margin:0;top:0;left:0;overflow-y:auto;z-index:999998}'+
                     '#gestureBox *{font-family:"Microsoft YaHei";margin:0;padding:0;text-align:center}'+
                     '#gestureBox h1{width:60%;height:4rem;line-height:4rem;font-size:2rem;color:#0074d9;background-color:#dee6ef;margin:1rem auto;border-radius:4rem;box-shadow:.3rem .3rem 1rem #dfdfdf}'+
                     '#gestureBox #addGesture{width:4rem;height:4rem;margin:0 auto 1rem auto;line-height:4rem;background-color:#dee6ef;color:#032e58;font-size:3rem;border-radius:4rem;box-shadow:.1rem .1rem .5rem #dfdfdf}'+
                     '#gestureBox .gestureLi{height:5rem;line-height:5rem;margin-top:1rem;width:100%;border-bottom:.3rem dashed #dfdfdf}'+
                     '#gestureBox .gestureLi p{width:38%;height:4rem;line-height:4rem;font-size:2rem;border-left:0.6rem solid;margin-left:1%;color:#ffb400;background-color:#fff1cf;float:left}'+
                     '#gestureBox .gestureLi .gesturePath{float:left;width:40%;height:4rem;background-color:#f3f3f3;color:#000;font-size:2rem;line-height:4rem;box-shadow:.1rem .1rem .5rem #ccc9c9;border-radius:1rem;margin-left:3%}'+
                     '#gestureBox .gestureLi .delGesture{width:5rem;height:4rem;line-height:4rem;border-radius:4rem;float:right;margin-right:1%;font-size:2rem;color:#f00;text-decoration:line-through}'+
                     '#gestureBox #revisePath{background-color:rgba(0,0,0,.5);width:100%;height:100%;position:fixed;top:0;left:0;overflow:hidden;z-index:999999;display:none;color:#000}'+
                     '#gestureBox #revisePath span{width:5rem;height:5rem;font-size:5rem;line-height:5rem;position:absolute}'+
                     '#gestureBox #revisePath div{position:absolute;width:30%;height:3rem;line-height:3rem;font-size:3rem;bottom:15%}'+
                     '#gestureBox #revisePath p{position:absolute;top:15%;font-size:4rem;line-height:4rem;height:4rem;width:100%}'+
                     '#gestureBox #revisePath #path{top:40%;color:#ffee03;font-size:6rem}'+
                     '#gestureBox #editGesture{background-color:#fff;width:100%;height:100%;position:fixed;top:0;left:0;overflow:hidden;z-index:999999;display:none;color:#000}'+
                     '#gestureBox #editGesture p{font-size:3rem;text-align:left;margin-top:3rem;margin-left:3rem;width:100%;height:3rem;line-height:3rem}'+
                     '#gestureBox #editGesture #gestureName{margin-top:1rem;width:80%;height:4rem;line-height:4rem;font-size:2rem;color:#000;border:0.1rem solid #dadada;border-radius:1rem;text-align:left;padding:0 1rem}'+
                     '#gestureBox #editGesture #pathFn{width:80%;margin-top:1rem;height:40%;font-size:2rem;text-align:left;line-height:2.2rem;padding:1rem;border:0.1rem solid #dadada;border-radius:1rem}'+
                     '#gestureBox #editGesture div{width:10rem;height:5rem;font-size:3rem;line-height:5rem;display:inline-block;color:#fff;background-color:#2866bd;margin:3rem 1rem 0rem 1rem}');
        Ti=document.createElement('div');
        Ti.setAttribute('id','gestureBox');
        document.body.appendChild(Ti);
        Ti.innerHTML='<h1>手势轨迹设置</h1><div id="addGesture">+</div><div id="gestureUL"></div>'+
                              '<div id="revisePath"><span style="top:0;left:0;text-align:left;">┌</span><span style="top:0;right:0;text-align:right;">┐</span><span style="bottom:0;left:0;text-align:left;">└</span><span style="bottom:0;right:0;text-align:right;">┘</span>'+
                              '<p>请滑动手指</p><p id="path"></p>'+
                              '<div id="clearPath" style="left:10%;">Clear</div><div id="cancleRevise" style="right:10%;">Cancle</div></div>'+
                              '<div id="editGesture"><p>手势名称：</p><input type="text" id="gestureName" maxlength="12" placeholder="最大输入12个字符">'+
                              '<p>手势路径脚本：</p><textarea id="pathFn" placeholder="全局参数方法说明→ (startX,startY):滑动初始坐标， (endX,endY):滑动结束坐标， videoPlayer:当前播放的video标签。"></textarea>'+
                              '<div id="saveGesture">保存</div><div id="closeEdit">关闭</div></div>';
        gestureUL=document.getElementById('gestureUL');
        pathEle=document.getElementById('path');
        init();
        //路径修改事件
        document.getElementById('revisePath').addEventListener('touchmove',function(e){
            e.stopPropagation();
            e.preventDefault();
            if(e.changedTouches.length==1){
                endX=e.changedTouches[0].screenX;
                endY=e.changedTouches[0].screenY;
                angX=(endX>startX) ? endX-startX : startX-endX;
                angY=(endY>startY) ? endY-startY : startY-endY;
                if(angX>limit || angY>limit){
                    if(angX>angY){direction=(endX>startX) ? '→' : '←';}
                    else{direction=(endY>startY) ? '↓' : '↑';}
                    if(pathEle.innerHTML.charAt(pathEle.innerHTML.length-1)!=direction){pathEle.innerHTML+=direction;}
                    startX=endX;startY=endY;
                }
            }
        });
        //清除路径
        document.getElementById('clearPath').addEventListener('click',function(){pathEle.innerHTML='';});
        //修改路径
        document.getElementById('cancleRevise').addEventListener('click',function(){
            if(pathEle.innerHTML){
                delete gesture[gesturePath];
                gesture[pathEle.innerHTML]=gestureName;
                GM_setValue('gesture',gesture);
                init();
            }
            document.getElementById('revisePath').style.display='none';
        });
        //.新建手势
        document.getElementById('addGesture').addEventListener('click',function(){
            document.getElementById('gestureName').value='';
            document.getElementById('pathFn').value='';
            gestureName='';
            document.getElementById('editGesture').style.display='block';
        });
        //保存手势
        document.getElementById('saveGesture').addEventListener('click',function(){
            if(document.getElementById('gestureName').value){
                if(gestureName){
                    delete pathFn[gestureName];
                    for(Ti in gesture){
                        if(gesture[Ti]==gestureName){
                            gesture[Ti]=document.getElementById('gestureName').value;
                            break;
                        }
                    }
                }
                pathFn[document.getElementById('gestureName').value]=document.getElementById('pathFn').value;
                GM_setValue('pathFn',pathFn);
                GM_setValue('gesture',gesture);
                init();
                document.getElementById('editGesture').style.display='none';
            }else{
                alert('请输入手势名称！');
            }
        });
        //关闭编辑
        document.getElementById('closeEdit').addEventListener('click',function(){
            document.getElementById('editGesture').style.display='none';
        });
    }

    function editGesture(){
        gestureName=this.getAttribute('name');
        document.getElementById('gestureName').value=gestureName;
        document.getElementById('pathFn').value=pathFn[gestureName];
        document.getElementById('editGesture').style.display='block';
    }
    function revisePath(){
        gestureName=this.getAttribute('name');
        gesturePath=this.innerHTML;
        pathEle.innerHTML='';
        document.getElementById('revisePath').style.display='block';
    }
    function delGesture(){
        gestureName=this.getAttribute('name');
        delete pathFn[gestureName];
        for(Ti in gesture){
            if(gesture[Ti]==gestureName){
                delete gesture[Ti];
                break;
            }
        }
        GM_setValue('pathFn',pathFn);
        GM_setValue('gesture',gesture);
        init();
    }

    function init(){
        gestureUL.innerHTML='';
        for(Ti in pathFn){
            gesturePath='';
            for(gestureName in gesture){
                if(gesture[gestureName]==Ti){
                    gesturePath=gestureName;
                    break;
                }
            }
            gestureUL.innerHTML+='<div class="gestureLi"><p name="'+Ti+'">'+Ti+'</p><div class="gesturePath" name="'+Ti+'">'+gesturePath+'</div><div class="delGesture" name="'+Ti+'">删除</div></div>';
        }
        //编辑手势
        gestureEle=document.querySelectorAll('#gestureBox .gestureLi p');
        for(Ti=0;Ti<gestureEle.length;Ti++){
            gestureEle[Ti].addEventListener('click',editGesture);
        }
        //修改路径
        gestureEle=document.querySelectorAll('#gestureBox .gestureLi .gesturePath');
        for(Ti=0;Ti<gestureEle.length;Ti++){
            gestureEle[Ti].addEventListener('click',revisePath);
        }
        //删除手势
        gestureEle=document.querySelectorAll('#gestureBox .gestureLi .delGesture');
        for(Ti=0;Ti<gestureEle.length;Ti++){
            gestureEle[Ti].addEventListener('click',delGesture);
        }
    }

    //关闭其他页面
    GM_addValueChangeListener('closeAll',function(name,old_value,new_value,remote){if(remote){window.close();}});

    //iframe视频全屏
    var iframeEle=document.getElementsByTagName('iframe');
    GM_addValueChangeListener('fullscreen',function(name,old_value,new_value,remote){if(remote && !document.hidden && videoPlayer && top.location!=location){videoPlayer.webkitRequestFullScreen();}});

    //iframe手势执行
    GM_addValueChangeListener('gestureIfr',function(name,old_value,new_value,remote){if(remote && !document.hidden && new_value && top.location==location){try{eval(pathFn[gesture[new_value]]);}catch(error){alert('“'+new_value+'” 手势执行脚本错误：\n'+error+' ！');}GM_setValue('gestureIfr','');}});

})();
