// ==UserScript==
// @name         知乎浏览历史记录
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  你有没有经历过"浏览了一个知乎回答后因为没有收藏或点赞当再次想看时却找不到"的痛苦?本脚本将你在知乎首页点开过的回答保存到你的知乎收藏夹"浏览记录"下, 这样再也不用担心找不到看过的回答了
// @author       wang0.618@qq.com
// @match        https://www.zhihu.com/
// ==/UserScript==

(function() {
    'use strict';
    function getAncestorBySelector(elem, selector) {
        if (!elem.matches(selector + ' ' + elem.tagName)) {
            // If element is not inside needed element, returning immediately.
            return null;
        }
        var node = elem;
        for(var i=0;i<100;i++){
            node = node.parentElement;
            if(node.matches(selector))
                return node;
        }
        return null;
    }
    function getJson(api,callback){
        var oReq = new XMLHttpRequest();
        oReq.onload = function (e) {
            if(callback)
                callback(e.target.response);
        };
        oReq.open('GET', api, true);
        oReq.setRequestHeader("Content-type","application/json");
        oReq.responseType = 'json';
        oReq.send();
    }
    function postJson(api,data,callback){
        var oReq = new XMLHttpRequest();
        oReq.onload = function (e) {
            if(callback)
                callback(e.target.response);
        };
        oReq.open('POST', api, true);
        oReq.setRequestHeader("Content-type","application/json");
        oReq.responseType = 'json';
        oReq.send(JSON.stringify(data));
    }

    var collection_name = '浏览记录';
    if(!window.localStorage.zhihu_collect_id){
        var id = JSON.parse(document.querySelector('#root div').dataset.zopUsertoken)['urlToken'];
        getJson('https://www.zhihu.com/api/v4/members/'+id+'/favlists?limit=100&offset=0',function(data) {
            var c_id = undefined;
            for (var i = data.data.length - 1; i >= 0; i--) {
                if(data.data[i].title==collection_name){
                    c_id = data.data[i].id;
                    break;
                }
            }
            if(!c_id){
                postJson('https://www.zhihu.com/api/v4/favlists',{
                    "title":collection_name,
                    "description":"知乎浏览记录, 记录您在知乎首页点开过的回答",
                    "is_public":false
                },function(data) {
                    window.localStorage.zhihu_collect_id = data.id;
                });
            }else{
                window.localStorage.zhihu_collect_id = c_id;
            }
        });
    }


    var ques = document.querySelector('.TopstoryMain > div');
    ques.addEventListener("click", function (evt) {
        var n = getAncestorBySelector(evt.target,'.TopstoryItem');
        try{
            var info = JSON.parse(n.querySelector('.ContentItem').dataset.zop);
            postJson('https://www.zhihu.com/api/v4/favlists/'+window.localStorage.zhihu_collect_id+'/items',
                {"content_id":info['itemId'], "content_type":info['type']});
        }catch(e){
            console.log(e);
        }
    }, true);

})();
