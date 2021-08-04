// ==UserScript==
// @name      百度搜索自动跳转谷歌搜索
// @namespace  hanero.club
// @author    HaneRo
// @version    0.0.1
// @include        http://www.baidu.com/*
// @include        https://www.baidu.com/*
// @description 自动从百度跳转到谷歌，可能有数秒延迟。
// ==/UserScript==
 
 
 
        function baiduswitchgoogle() {
                    window.open("https://www.google.com/ncr?gws_rd=ssl#newwindow=1&q=" + $('#kw') .val(), "_self");
        }
        if(window.location.search.lastIndexOf("wd=")>0 || window.location.search.lastIndexOf("word=")>0){
            baiduswitchgoogle();
        }
function loadJs(sid,jsurl,callback){
    var nodeHead = document.getElementsByTagName('head')[0];
    var nodeScript = null;
    if(document.getElementById(sid) === null){
        nodeScript = document.createElement('script');
        nodeScript.setAttribute('type', 'text/javascript');
        nodeScript.setAttribute('src', jsurl);
        nodeScript.setAttribute('id',sid);
        if (callback !== null) {
            nodeScript.onload = nodeScript.onreadystatechange = function(){
                if (nodeScript.ready) {
                    return false;
                }
                if (!nodeScript.readyState || nodeScript.readyState == "loaded" || nodeScript.readyState == 'complete') {
                    nodeScript.ready = true;
                    callback();
                }
            };
        }
        nodeHead.appendChild(nodeScript);
    } else {
        if(callback !== null){
            callback();
        }
    }
}
