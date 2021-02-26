// ==UserScript==
// @name B站(Bilibili)搜索页面、个人主页已看视频标记
// @version 1.6.3
// @description 在B站搜索结果页面标记哪些视频是已经看过的，直观区分已看和未看的视频。已增加个人主页各页面支持。
// @author Truazusa
// @namespace BiliSearchViewed
// @match https://search.bilibili.com/*
// @match https://space.bilibili.com/*
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==
 
var GM_addStyle = GM_addStyle || function(css) {
  var style = document.createElement("style");
  style.type = "text/css";
  style.appendChild(document.createTextNode(css));
  document.getElementsByTagName("head")[0].appendChild(style);
};
 
// 增加自定义样式
GM_addStyle(".btnView{opacity:0.8;width:25px;text-align:center;display:inline-block;position:absolute;right:0;top:0;z-index:1;border:2px solid #999;border-radius:4px;padding:3px 5px;background:#fff;color:#999;}.btnView:hover{opacity:1;background:#aaa;color:#fff;}");
 
 
GM_addStyle(".up-videos .btnView{left:0;top:0;right:unset;}");
GM_addStyle(".btnNotView{}");
GM_addStyle(".btnIsView{background:rgba(255,255,255,0.5);opacity:0.2;}.btnIsView:hover{background:rgba(255,255,255,1);opacity:1;color:#999;}");
 
// 图文模式
GM_addStyle(".list .btnView{left:0;top:20px;right:unset;}");
 
GM_addStyle(".btnRefresh{display:inline-block;position:absolute;z-index:1;right:52px;top:17px;background:#fff;border:2px solid #999;border-radius:5px;color:#999;padding:1px 5px;}.btnList:hover{background:#aaa;color:#fff;}");
GM_addStyle(".btnList{display:inline-block;position:absolute;z-index:1;right:97px;top:17px;background:#fff;border:2px solid #999;border-radius:5px;color:#999;padding:1px 5px;}.btnList:hover{background:#aaa;color:#fff;}");
GM_addStyle(".btnListSave{display:inline-block;position:absolute;z-index:1;right:170px;top:17px;background:#fff;border:2px solid #999;border-radius:5px;color:#999;padding:1px 5px;display:none;}.btnListSave:hover{background:#aaa;color:#fff;}");
GM_addStyle(".btnAvToBv{display:inline-block;position:absolute;z-index:1;right:240px;top:17px;background:#fff;border:2px solid #999;border-radius:5px;color:#999;padding:1px 5px;display:none;}.btnAvToBv:hover{background:#aaa;color:#fff;}");
 
GM_addStyle(".viewList{width:100%;height:120px;display:none;color:#999;padding:1px 5px;}");
 
// 空间页
GM_addStyle(".small-item .btnView{left:10px;top:10px;right:unset;cursor:pointer;z-index:10;}");
GM_addStyle(".btnSpaceRefresh{display:inline-block;cursor:pointer;position:absolute;z-index:1;right:30%;top:19px;background:#fff;border:2px solid #999;border-radius:5px;color:#999;padding:1px 5px;}.btnList:hover{background:#aaa;color:#fff;}");
 
// 代表作
GM_addStyle("#i-masterpiece .small-item .btnView{left:10px;top:0;}");
 
// 收藏页
GM_addStyle(".fav-video-list .small-item .btnView{left:0;top:0;}");
 
 
// 图文模式
GM_addStyle(".list-list .small-item .btnView{left:0;top:20px;right:unset;}");
 
GM_addStyle(".video .content div.small-item:nth-child(4n+1) .btnView{left:0;right:unset;}");
 
 
 
var isSetView = 0;
var timer = null;
var viewVideoList = null;
window.onload = function(){
  viewVideoList = localStorage.BiliViewed;
  // 从缓存中读取已看视频列表
  if(viewVideoList){
    // 判断是否已经av转bv了
    if(!localStorage.BiliAvToBvFin){
      // 未有转
      convertListAvToBv();
    }
    // 转存到GM本地
    saveWebListToGMLocal();
  }
  // 已在GM本地 
  viewVideoList = getGMVideoList();
  var domain = document.domain;
  domain = domain.toLowerCase();
  if(domain.indexOf("search.") > -1){
    // 搜索页
    setMethod = setBtnView;
    checkItem = ".video-item";
    setSearchPage();
  }else if(domain.indexOf("space.") > -1){
    // 个人空间
    setMethod = setSpaceBtnView;
    checkItem = ".small-item";
    setSpacePage();
  }
  // 检查执行结果
  timer = setInterval(checkBtnViewLoad,1000);
}
 
// 转存web-localStorage的list到GM本地
var saveWebListToGMLocal = function(){
  var viewVideoList = localStorage.BiliViewed;
  if(!viewVideoList){
    return;
  }
  // 开始转存
  GM_setValue("BiliViewed",viewVideoList);
  // 清空web-localStorage
  localStorage.BiliViewed = null;
  localStorage.removeItem("BiliViewed");
}
 
// 获取GM本地存储的列表
var getGMVideoList = function(){
  return GM_getValue("BiliViewed","start\n");
}
 
// 设置GM本地存储的列表
var saveGMVideoList = function(value){
  return GM_setValue("BiliViewed",value);
}
 
// 设置空间页
var setSpacePage = function(){
  setSpaceBtnView();
  $("#navigator .wrapper").prepend("<a class='btnSpaceRefresh' title='如果列表没出现已看/未看标识，请手动点击这个按钮进行刷新'>刷新</a>");
  $(".btnSpaceRefresh").click(function(){
    // 从缓存中读取已看视频列表
    setSpaceBtnView();
  })
}
 
 
// 设置空间页视频Item
var setSpaceBtnView = function(){
  // 清空所有已看和未看
  $(".btnView").remove();
  // 重新读取
  viewVideoList = getGMVideoList();
  videoArr = viewVideoList.split('\n');
  $(".small-item").each(function(){
    // 获取av
    av = $(this).data("aid") + "";
    if(av == null || av.indexOf("BV") == -1){
      return;
    }
    var avId = av.replace("BV","");
    // 设置是否已看
    isView = 0;
    for(var i = 0 ; i < videoArr.length;i++){
      if(avId == videoArr[i]){
        // 已看
        isView = 1;
        break;
      }
    }
    if(isView == 1){
      // 已看
      $(this).append("<a class='btnView btnIsView' data-view='1' data-av='"+avId+"'>已看</a>");
      $(this).find(".cover").css("opacity","0.1");
    }else{
      // 未看
      $(this).append("<a class='btnView btnNotView' data-view='0' data-av='"+avId+"'>未看</a>");
      $(this).find(".cover").css("opacity","1");
    }
 
    $(this).find(".btnView").click(function(e){
      var avId = $(this).data("av");
      var view = $(this).data("view");
      // 先读再存（跨页操作）
      viewVideoList = getGMVideoList();
      if(view == 0){
        // 未看 -> 已看
        viewVideoList += avId+"\n";
        $(this).text("已看");
        $(this).removeClass("btnNotView");
        $(this).addClass("btnIsView");
        $(this).data("view","1");
        $(this).parent().find(".cover").css("opacity","0.1");
      }else{
        // 已看 -> 未看
        viewVideoList = viewVideoList.replace(avId+"\n","");
        $(this).text("未看");
        $(this).removeClass("btnIsView");
        $(this).addClass("btnNotView");
        $(this).data("view","0");
        $(this).parent().find(".cover").css("opacity","1");
      }
      // 即时存储
      saveGMVideoList(viewVideoList);
      // 重新读取
      setSpaceBtnView()
    });
  });
  // 分页按钮响应
  $(".be-pager li").unbind('click').click(function(){
    reloadPage();
  })
  // 搜索视频按钮响应
  $(".search-btn").unbind('click').click(function(){
    reloadPage();
  })
  // 回车监听响应
  $(document).unbind('keyup').keyup(function(event){
    if(event.keyCode ==13){
      reloadPage();
    }
  });
  // 导航栏响应
  $(".n-tab-links a").unbind('click').click(function(){
    reloadPage();
  })
  // 侧栏按钮响应
  $(".contribution-item").unbind('click').click(function(){
    reloadPage();
  })
  // 排序按钮响应
  $(".be-tab-item").unbind('click').click(function(){
    reloadPage();
  })
  // Tag点击响应
  $("#submit-video-type-filter a").unbind('click').click(function(){
    reloadPage();
  })
  // 收藏列表响应
  $(".fav-item a").unbind('click').click(function(){
    reloadPage();
  })
}
 
// 重新读取页面
var reloadPage = function(){
  checkCount = 0;
  setTimeout(function(){
    // 执行一次
    setMethod();
    // 检查执行结果
    timer = setInterval(checkBtnViewLoad,2000);
  },1000);
}
 
 
// （多域名公用）检测按钮是否已加载，6次内有效
var itemCount = 0;
var btnCount = 0;
var checkCount = 0;
var checkItem = "";
var setMethod = null;
var checkBtnViewLoad = function(){
  itemCount = $(checkItem).size();
  btnCount = $(".btnView").size();
  if(itemCount == btnCount || checkCount > 6){
    clearInterval(timer);
    timer = null;
  }else{
    setMethod();
  }
  checkCount++;
}
 
 
// 设置搜索页面
var setSearchPage = function(){
  setBtnView();
  $(".filter-wrap").append("<a class='btnList' title='显示/隐藏已看ID的数据列表，建议定期复制到其他地方进行保存，避免因事故造成丢失'>显示/隐藏</a>");
  $(".filter-wrap").append("<a class='btnRefresh' title='如果列表没出现已看/未看标识，请手动点击这个按钮进行刷新'>刷新</a>");
  $(".filter-wrap").append("<a class='btnListSave' title='如果文本框内容有修改，请点击这个按钮进行保存。'>保存列表</a>");
  $(".filter-wrap").append("<a class='btnAvToBv' title='转换列表上的av号为bv号'>转换</a>");
  $(".filter-wrap").append("<textarea class='viewList'></textarea>");
  
  $(".btnAvToBv").click(function(){
    convertListAvToBv();
    $(".viewList").text(getGMVideoList());
  })
  
  $(".btnList").click(function(){
    $(".viewList").text(getGMVideoList());
    $(".viewList").toggle();
    $(".btnListSave").toggle();
    $(".btnAvToBv").toggle();
  })
  
  $(".btnRefresh").click(function(){
    setBtnView();
  })
  
  $(".btnListSave").click(function(){
    viewVideoList = $(".viewList").val();
    saveGMVideoList(viewVideoList);
    $(".viewList").toggle();
    $(".btnListSave").toggle();
    $(".btnAvToBv").toggle();
  })
  
}
 
var isView = 0;
var avStartStr = "//www.bilibili.com/video/BV";
var avStartIndex = -1;
var avEndIndex = -1;
var av = null;
var videoArr = null;
// 设置搜索页视频Item
var setBtnView = function(){
  // 清空所有已看和未看
  $(".btnView").remove();
  // 重新读取
  viewVideoList = getGMVideoList();
  videoArr = viewVideoList.split('\n');
  $(".video-item").each(function(){
    // 获取av
    av = $(this).find("a:eq(0)").attr("href");
    avStartIndex = av.indexOf(avStartStr);
    avEndIndex = av.indexOf("?");
    var avId = av.substring(avStartIndex+avStartStr.length,avEndIndex);
    // 设置是否已看
    isView = 0;
    for(var i = 0 ; i < videoArr.length;i++){
      if(avId == videoArr[i]){
        // 已看
        isView = 1;
        break;
      }
    }
    if(isView == 1){
      // 已看
      $(this).append("<a class='btnView btnIsView' data-view='1' data-av='"+avId+"'>已看</a>");
      $(this).find(".lazy-img").css("opacity","0.1");
    }else{
      // 未看
      $(this).append("<a class='btnView btnNotView' data-view='0' data-av='"+avId+"'>未看</a>");
      $(this).find(".lazy-img").css("opacity","1");
    }
 
    $(this).find(".btnView").click(function(e){
      var avId = $(this).data("av");
      var view = $(this).data("view");
      // 先读再存（跨页操作）
      viewVideoList = getGMVideoList();
      if(view == 0){
        // 未看 -> 已看
        viewVideoList += avId+"\n";
        $(this).text("已看");
        $(this).removeClass("btnNotView");
        $(this).addClass("btnIsView");
        $(this).data("view","1");
        $(this).parent().find(".lazy-img").css("opacity","0.1");
      }else{
        // 已看 -> 未看
        viewVideoList = viewVideoList.replace(avId+"\n","");
        $(this).text("未看");
        $(this).removeClass("btnIsView");
        $(this).addClass("btnNotView");
        $(this).data("view","0");
        $(this).parent().find(".lazy-img").css("opacity","1");
      }
      // 即时存储
      saveGMVideoList(viewVideoList);
      // 重新读取和设置
      setBtnView();
    });
  });
  // 分页按钮响应
  $(".page-item").unbind('click').click(function(){
    reloadPage();
  })
  // 搜索按钮响应
  $(".search-button").unbind('click').click(function(){
    reloadPage();
  })
  // 排序按钮响应
  $(".filter-item a").unbind('click').click(function(){
    reloadPage();
  })
  // 分类菜单响应
  $(".v-switcher-header-item a").unbind('click').click(function(){
    reloadPage();
  })
  // 回车监听响应
  $(document).unbind('keyup').keyup(function(event){
    if(event.keyCode ==13){
      reloadPage();
    }
  });
}
 
 
// 转换列表上面的av号为bv号
var convertListAvToBv = function(){
  var reg=/^\d{1,}$/
  var pattern=new RegExp(reg);
  videoArr = viewVideoList.split('\n');
  for(var i = 0 ; i < videoArr.length;i++){
    if(pattern.test(videoArr[i])){
      // 是av号
      videoArr[i] = bvid.encode(videoArr[i]).substr(2);
    }
  }
  // 转换完毕，重新组合
  viewVideoList = "";
  for(var i = 0 ; i < videoArr.length;i++){
    viewVideoList += videoArr[i]+"\n";
  }
  // 记入storage
  saveGMVideoList(viewVideoList);
  // 记入av转bv完成
  localStorage.BiliAvToBvFin = 1;
}
 
 
 
// av转bv，参考来源：https://github.com/Coxxs/bvid/blob/master/bvid.js
var bvid = (function () {
  var table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF'
  var tr = {}
  for (var i = 0; i < 58; i++) {
    tr[table[i]] = i
  }
  var s = [11, 10, 3, 8, 4, 6]
  var r = ['B', 'V', '1', '', '', '4', '', '1', '', '7', '', '']
  var xor = 177451812
  var add = 8728348608
 
 function encode(x) {
    if (x <= 0 || x >= 1e9) {
      return null
    }
    x = (x ^ xor) + add
    var result = r.slice()
    for (var i = 0; i < 6; i++) {
      result[s[i]] = table[Math.floor(x / 58 ** i) % 58]
    }
    return result.join('')
  }
 
  return { encode }
})()
 
if (typeof module !== 'undefined' && module != null) {
  module.exports = bvid
}
 
