// ==UserScript==
// @name BiliBili关键词屏蔽
// @description BiliBili哔哩哔哩B站屏蔽与相应关键词有关的视频与直播。左下角隐藏按钮进入设置页面、显示当前页面过滤数量。可批量添加关键词，用英文逗号,分割。支持导入导出。
// @namespace https://space.bilibili.com/482343
// @author 古海沉舟
// @license 古海沉舟
// @version 5.0
// @include *t.bilibili.com*
// @include *www.bilibili.com*
// @include *live.bilibili.com*
// @include *space.bilibili.com*
// @exclude *message.bilibili.com*
// @require https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==
var i, c, fl, fk, x, a, b, mo = 0,
    glzs = 0;
 
function debugx() {
     glzs++;
     $(".xfsz_sz").text(glzs);
     return 1; // 1 显示log； 0 隐藏log
}
var toObj = (arr) => {
     var obj = {};
     for (var temp in arr) {
          obj[arr[temp]] = true;
     }
     return obj;
};
var toArr = (obj) => {
     var arr = [];
     for (var temp in obj) {
          arr.push(temp);
     }
     return arr;
};
var together = (a, b) => {
     for (var temp = 0; temp < b.length; temp++) {
          if (b[temp] != null && b[temp] != "" && b[temp] != "null" && b[temp].length < 40) {
               a.push(b[temp] + "");
          }
     }
};
var getUniq = (arr) => Array.from(new Set(arr))
//dd 都屏蔽， bt 只屏蔽标题， zz 只屏蔽up主  gz 屏蔽个人页面和动态的标题
var dd = GM_getValue("dd", new Array(""));
var bt = GM_getValue("bt", new Array(""));
var zz = GM_getValue("zz", new Array(""));
var gz = GM_getValue("gz", new Array(""));
var ddx = new Array();
var btx = new Array();
var zzx = new Array();
var gzx = new Array();
let glc = new Array(ddx, btx, zzx, gzx)
let glcx = new Array(dd, bt, zz, gz)
let nglc = new Array();
let ml = new Array("dd", "bt", "zz", "gz")
let xfz = 0;
together(ddx, dd);
together(btx, bt);
together(zzx, zz);
together(gzx, gz);
 
function bc() {
     //保存
     for (var i = 0; i < 4; i++) {
          glc[i] = getUniq(glc[i]);
          glcx[i] = new Array();
          together(glcx[i], glc[i]);
          GM_setValue(ml[i], glcx[i]);
          glc[i] = new Array();
          together(glc[i], glcx[i]);
     }
     dd = glc[0].concat();
     bt = glc[1].concat();
     zz = glc[2].concat();
     gz = glc[3].concat();
     bt.push.apply(bt, dd);
     zz.push.apply(zz, dd);
}
bc();
 
//主页推荐
function gltjzy() {
     let x;
     let sytj = 0;
     sytj = Math.floor($(".rcmd-box-wrap").width() / $(".video-card-reco").width()) * 2;
     //console.log("数量:  ",sytj)
     $(".video-card-reco").each(function (index, element) {
          $(this).show();
     });
     for (x = 0; x < zz.length; x++) {
          if (zz[x] != "") {
               $(".video-card-reco .info-box .info .up").each(function (index, element) {
                    if ($(this).text().indexOf(zz[x]) > -1) {
                         if (debugx()) console.log("主页推荐过滤作者 " + "\t" + zz[x] + " :\t" + $(this).text())
                         $(this).parent().parent().parent().parent().hide();
                         return false;
                    }
               });
          }
     }
     for (x = 0; x < bt.length; x++) {
          if (bt[x] != "") {
               $(".video-card-reco .info-box .info .title").each(function (index, element) {
                    if ($(this).parent().parent().parent().parent().is(":hidden")) return;
                    if ($(this).text().indexOf(bt[x]) > -1) {
                         if (debugx()) console.log("主页推荐过滤标题 " + "\t" + bt[x] + " :\t" + $(this).text())
                         $(this).parent().parent().parent().parent().hide();
                    }
               });
          }
     }
     x = 0;
     $(".video-card-reco").each(function (index, element) {
          if ($(this).is(":hidden")) return;
          x++;
          if (x > sytj) $(this).hide();
     });
}
$(".rcmd-box-wrap .change-btn").click(function () {
     setTimeout(function(){gltjzy()},500);
})
 
//频道推荐
function gltjpd() {
     let x
     $(".game-groom-box-m .game-groom-m").show();
     for (x = 0; x < zz.length; x++) {
          if (zz[x] != "") {
               $(".game-groom-m .num .author").each(function (index, element) {
                    // element == this
                    if ($(this).text().indexOf(zz[x]) > -1) {
                         if (debugx()) console.log("过滤作者 " + "\t" + zz[x] + " :\t" + $(this).text())
                         $(this).parent().parent().parent().hide();
                         return false;
                    }
               });
          }
     }
     for (x = 0; x < bt.length; x++) {
          if (bt[x] != "") {
               $(".game-groom-box-m .game-groom-m .title").each(function (index, element) {
                    if ($(this).parent().parent().is(":hidden")) return;
                    // element == this
                    if ($(this).text().indexOf(bt[x]) > -1) {
                         if (debugx()) console.log("过滤标题 " + "\t" + bt[x] + " :\t" + $(this).text())
                         $(this).parent().parent().hide();
                    }
               });
          }
     }
}
$(".game-groom-box-m .rec-btn.next,.game-groom-box-m .rec-btn.prev").click(function () {
     gltjpd();
})
 
function glyc() {
     for (x = 0; x < zz.length; x++) {
          if (zz[x] != "") {
               if (mo == 1) { //主页
                    fl = document.evaluate('//div[@class="live-card"]/a/div[@class="up"]/div[@class="txt"]/p[@class="name" and contains(text(),"' + zz[x] + '")]/../../../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                         for (i = fl.snapshotLength - 1; i > -1; i--) {
                              if (debugx()) console.log("主页作者 1" + "\t" + zz[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                              fl.snapshotItem(i).remove();
                         }
                    }
                    fl = document.evaluate('//div[@class="zone-list-box storey-box"]/div[@class="video-card-common"]/a[@class="up" and contains(text(),"' + zz[x] + '")]/..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                         for (i = fl.snapshotLength - 1; i > -1; i--) {
                              if (debugx()) console.log("主页作者 2" + "\t" + zz[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                              fl.snapshotItem(i).remove();
                         }
                    }
               }
               if (mo == 3) { //视频
                    fl = document.evaluate('//div[@class="rec-list"]/div[@class="video-page-card"]/div[@class="card-box"]/div[@class="info"]/div[@class="count up"]/a[contains(text(),"' + zz[x] + '")]/../../../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                         for (i = fl.snapshotLength - 1; i > -1; i--) {
                              if (debugx()) console.log("视频作者 1" + "\t" + zz[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                              fl.snapshotItem(i).remove();
                         }
                    }
               }
               if (mo == 6) { //直播
                    fl = document.evaluate('//div[@class="room-ctnr w-100"]/div[@class="room-card-wrapper p-relative dp-i-block"]/a/div[@class="card-info-ctnr"]/div[@class="text-info-ctnr body-bg p-relative dp-i-block v-middle"]/div[@class="room-anchor card-text p-relative"]/span[contains(text(),"' + zz[x] + '")]/../../../../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                         for (i = fl.snapshotLength - 1; i > -1; i--) {
                              if (debugx()) console.log("直播作者 1" + "\t" + zz[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                              fl.snapshotItem(i).remove();
                         }
                    }
               }
               if (mo == 7) { //在线列表up主
                    fl = document.evaluate('//div[@class="online-list"]/div[@class="ebox"]/div[@class="dlo"]/a[contains(text(),"' + zz[x] + '")]/../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                         for (i = fl.snapshotLength - 1; i > -1; i--) {
                              if (debugx()) console.log("在线作者 1" + "\t" + zz[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\s\s/g, " "));
                              fl.snapshotItem(i).remove();
                         }
                    }
                    fl=document.querySelectorAll("#app > div.popular-video-container.popular-list > div > ul > div > div.video-card__info > div > span.up-name > span");
                    for (i = fl.length - 1; i > -1; i--) {
                         if (fl[i].innerText.indexOf(zz[x])>-1){
                              if (debugx()) console.log("热门作者 1" + "\t" + zz[x] + " :\t" + fl[i].parentNode.parentNode.parentNode.parentNode.innerText.replace(/\s\s/g, " "));
                              fl[i].parentNode.parentNode.parentNode.parentNode.remove();
                         }
                    }
               }
               fl = document.evaluate('//div[@class="zone-list-box"]/div[@class="video-card-common"]/a[@class="up"]/i[contains(text(),"' + zz[x] + '")]/../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
               if (fl.snapshotLength) {
                    for (i = fl.snapshotLength - 1; i > -1; i--) {
                         if (debugx()) console.log("作者1" + "\t" + zz[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                         fl.snapshotItem(i).remove();
                    }
               }
               fl = document.evaluate('//div[@class="ext-box"]/div[@class="video-card-common ex-card-common"]/a[@class="ex-up"]/i[contains(text(),"' + zz[x] + '")]/../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
               if (fl.snapshotLength) {
                    for (i = fl.snapshotLength - 1; i > -1; i--) {
                         if (debugx()) console.log("作者2" + "\t" + zz[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                         fl.snapshotItem(i).remove();
                    }
               }
               fl = document.evaluate('//div[@class="ext-box"]/div[@class="video-card-common ex-card-common"]/a[contains(text(),"' + zz[x] + '")]/..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
               if (fl.snapshotLength) {
                    for (i = fl.snapshotLength - 1; i > -1; i--) {
                         if (debugx()) console.log("作者3" + "\t" + zz[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                         fl.snapshotItem(i).remove();
                    }
               }
               fl = document.evaluate('//div[@class="zone-list-box"]/div[@class="article-card"]/div/a[@class="up" and contains(text(),"' + zz[x] + '")]/../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
               if (fl.snapshotLength) {
                    for (i = fl.snapshotLength - 1; i > -1; i--) {
                         if (debugx()) console.log("作者4" + "\t" + zz[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                         fl.snapshotItem(i).remove();
                    }
               }
               fl = document.evaluate('//div[@class="groom-box-m clearfix"]/div[@class="groom-module"]/a/div[@class="card-mark"]/p[@class="author"  and contains(text(),"' + zz[x] + '")]/../../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
               if (fl.snapshotLength) {
                    for (i = fl.snapshotLength - 1; i > -1; i--) {
                         if (debugx()) console.log("作者6" + "\t" + zz[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                         fl.snapshotItem(i).remove();
                    }
               }
          }
     }
     for (x = 0; x < bt.length; x++) {
          if (bt[x] != "") {
               if (mo == 1) { //主页
                    fl = document.evaluate('//div[@class="live-card"]/a/div[@class="up"]/div[@class="txt"]/p[@class="desc" and contains(text(),"' + bt[x] + '")]/../../../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                         for (i = fl.snapshotLength - 1; i > -1; i--) {
                              if (debugx()) console.log("主页 标题 1" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                              fl.snapshotItem(i).remove();
                         }
                    }
 
                    fl = document.evaluate('//div[@class="zone-list-box"]/div[@class="video-card-common"]/a[@class="title" and contains(text(),"' + bt[x] + '")]/..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                         for (i = fl.snapshotLength - 1; i > -1; i--) {
                              if (debugx()) console.log("主页 标题 2" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                              fl.snapshotItem(i).remove();
                         }
                    }
                    fl = document.evaluate('//div[@class="zone-list-box storey-box"]/div[@class="video-card-common"]/a[@class="title" and contains(text(),"' + bt[x] + '")]/..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                         for (i = fl.snapshotLength - 1; i > -1; i--) {
                              if (debugx()) console.log("主页 标题 3" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                              fl.snapshotItem(i).remove();
                         }
                    }
                    fl = document.evaluate('//div[@class="zone-list-box"]/div[@class="article-card"]/div/a[@class="title" and contains(text(),"' + bt[x] + '")]/../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                         for (i = fl.snapshotLength - 1; i > -1; i--) {
                              if (debugx()) console.log("主页 标题 4" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                              fl.snapshotItem(i).remove();
                         }
                    }
                    fl = document.querySelectorAll("#ranking-all > div > ul.rank-list.hot-list > li > a")
                    for (i = fl.length - 1; i > -1; i--) {
                         if (fl[i].innerText.indexOf(bt[x]) > -1) {
                              if (debugx()) console.log("主页 标题 5" + "\t" + bt[x] + " :\t" + fl[i].parentElement.innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                              fl[i].parentElement.remove();
                         }
                    }
                    fl = document.querySelectorAll("div.rank-list > div > a > p")
                    for (i = fl.length - 1; i > -1; i--) {
                         if (fl[i].innerText.indexOf(bt[x]) > -1) {
                              if (debugx()) console.log("主页 标题 6" + "\t" + bt[x] + " :\t" + fl[i].innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                              fl[i].parentElement.parentElement.remove();
                         }
                    }
               }
               if (mo == 2) { //频道
                    fl = document.evaluate('//div[@class="storey-box clearfix"]/div[@class="spread-module"]/a/p[@class="t" and contains(text(),"' + bt[x] + '")]/../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                         for (i = fl.snapshotLength - 1; i > -1; i--) {
                              if (debugx()) console.log("频道标题 2 " + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                              fl.snapshotItem(i).remove();
                         }
                    }
                    fl = document.querySelectorAll("div.rank-list-wrap > ul > li")
                    for (i = fl.length - 1; i > -1; i--) {
                         if (fl[i].innerText.indexOf(bt[x]) > -1) {
                              if (debugx()) console.log("频道标题 3" + "\t" + bt[x] + " :\t" + fl[i].innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                              fl[i].remove();
                         }
                    }
                    fl = document.evaluate('//div[@class="groom-box-m clearfix"]/div[@class="groom-module"]/a/div[@class="card-mark"]/p[@class="title"  and contains(text(),"' + bt[x] + '")]/../../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                         for (i = fl.snapshotLength - 1; i > -1; i--) {
                              if (debugx()) console.log("频道标题 4" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                              fl.snapshotItem(i).remove();
                         }
                    }
               }
               if (mo == 3) { //视频
                    fl = document.evaluate('//div[@class="rec-list"]/div[@class="video-page-card"]/div[@class="card-box"]/div[@class="info"]/a[@class="title" and contains(text(),"' + bt[x] + '")]/../../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                         for (i = fl.snapshotLength - 1; i > -1; i--) {
                              if (debugx()) console.log("视频标题 1" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                              fl.snapshotItem(i).remove();
                         }
                    }
               }
               if (mo == 4) { //
                    $(".small-item .title").each(function (index, element) {
                         if ($(this).parent().is(":hidden")) return;
                         gz.forEach(x => {
                              if (x != "") {
                                   if ($(this).text().indexOf(x) > -1) {
                                        $(this).parent().hide();
                                        if (debugx()) console.log("个人空间 标题", x, " ：", $(this).text());
                                   }
                              }
                         })
                    });
               }
               if (mo == 6) { //直播
                    fl = document.evaluate('//div[@class="room-ctnr w-100"]/div[@class="room-card-wrapper p-relative dp-i-block"]/a/div[@class="card-info-ctnr"]/div[@class="text-info-ctnr body-bg p-relative dp-i-block v-middle"]/span[contains(text(),"' + bt[x] + '")]/../../../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                         for (i = fl.snapshotLength - 1; i > -1; i--) {
                              if (debugx()) console.log("直播标题 1" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                              fl.snapshotItem(i).remove();
                         }
                    }
               }
               if (mo == 7) { //在线热门列表标题
                    fl = document.evaluate('//div[@class="online-list"]/div[@class="ebox"]/a[1]/p[contains(text(),"' + bt[x] + '")]/../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                         for (i = fl.snapshotLength - 1; i > -1; i--) {
                              if (debugx()) console.log("在线标题 1" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                              fl.snapshotItem(i).remove();
                         }
                    }
                    fl=document.querySelectorAll("#app > div.popular-video-container.popular-list > div > ul > div > div.video-card__info > p")
                    for (i= fl.length-1;i>-1;i--){
                         if (fl[i].innerText.indexOf(bt[x])>-1){
                              if (debugx()) console.log("热门标题 1" + "\t" + bt[x] + " :\t" + fl[i].parentNode.parentNode.innerText.replace(/\s\s/g, " "));
                              fl[i].parentNode.parentNode.remove();
                         }
                    }
               }
               //视频标题
               fl = document.evaluate('//div[@class="ext-box"]/div[@class="video-card-common"]/a[@class="title" and contains(text(),"' + bt[x] + '")]/..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
               if (fl.snapshotLength) {
                    for (i = fl.snapshotLength - 1; i > -1; i--) {
                         if (debugx()) console.log("标题1" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                         fl.snapshotItem(i).remove();
                    }
               }
               fl = document.evaluate('//div[@class="ext-box"]/div[@class="video-card-common"]/a[@class="title"]/span[contains(text(),"' + bt[x] + '")]/../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
               if (fl.snapshotLength) {
                    for (i = fl.snapshotLength - 1; i > -1; i--) {
                         if (debugx()) console.log("标题2" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                         fl.snapshotItem(i).remove();
                    }
               }
               fl = document.evaluate('//div[@class="ext-box"]/div[@class="video-card-common ex-card-common"]/div/a/p[contains(text(),"' + bt[x] + '")]/../../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
               if (fl.snapshotLength) {
                    for (i = fl.snapshotLength - 1; i > -1; i--) {
                         if (debugx()) console.log("标题3" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                         fl.snapshotItem(i).remove();
                    }
               }
          }
     }
     if (mo == 5) { //动态
          fl = document.querySelectorAll("#app > div > div.container > div > div > div > div > div.center-box > a");
          for (x in gz) {
               if (gz[x] != "") {
                    for (i = fl.length - 1; i > -1; i--) {
                         if (fl[i].innerText.indexOf(gz[x]) > -1) {
                              if (debugx()) console.log("动态标题 ", gz[x] + "\t" + "\t:" + "\t" + fl[i].innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                              fl[i].parentElement.parentElement.parentElement.remove();
                         }
                    }
               }
          }
     }
     return true;
}
 
var wz = location.href;
var kj = 3000;
var xh;
if ((wz.indexOf("live.bilibili.com") > -1 && wz.split(".com/")[1].length > 0)) {
     return
}
//mo 模式 1主页 2频道 3视频 4个人页面 5动态 6直播 7在线热门
var mode = ['', '主页', '频道', '视频', '个人页面', '动态', '直播', '在线热门'];
if (wz.split("bilibili.com")[1].length < 2) {
     kj = 15000;
     mo = 1;
}
if (wz.indexOf("/v/") > -1 || wz.indexOf("guochuang/") > -1) {
     kj = 3000;
     mo = 2;
}
if ((wz.indexOf("video/") > -1 && wz.indexOf("online.html") < 0) || wz.indexOf("play/") > -1) {
     kj = 10000;
     mo = 3;
}
if (wz.indexOf("space.bilibili.com") > -1) {
     kj = 2000;
     mo = 4;
}
if (wz.indexOf("t.bilibili.com") > -1) {
     kj = 3000;
     mo = 5;
}
if (wz.indexOf("live.bilibili.com") > -1) {
     kj = 15000;
     mo = 6;
}
if (wz.indexOf("online.html") > -1 || wz.indexOf("popular") > -1) {
     kj = 5000;
     mo = 7;
}
if (mo == 0) return;
if (mo == 3) {
     console.log("模式 ", mo, ' ', mode[mo], ' ', kj, '   ', location.href);
     setTimeout(glyc, kj);
} else {
     console.log("模式 ", mo, ' ', mode[mo], ' ', kj, '   ', location.href);
     gltjzy();
     gltjpd();
     setTimeout(glyc, 2000);
     setInterval(glyc, kj);
}
 
//--------------左下角按钮--设置界面-------------
let wdstyle = document.createElement('style');
wdstyle.innerHTML = `
.xfsz {
    height: 80px;
    width: 80px;
    position: fixed;
    transition: 0.5s;
    z-index: 10;
    opacity: 0;
    left: 0px;
    bottom: 0px;
  }
  .xfsz:hover {
    opacity: 1;
  }
  .xfsz_an {
    left: 1vw;
    bottom: 1vw;
    background-color: rgb(29, 161, 242);
    border-radius: 19px;
    color: #fff;
    cursor: pointer;
    font-size: 20px;
    height: 38px;
    width: 38px;
    line-height: 38px;
    position: absolute;
    text-align: center;
    z-index: 9999;
    user-select: none;
    display: block;
  }
  .xfsz_sz{
    left: 30px;
    bottom: 0px;
    background-color: #333;
    border-radius: 25px;
    color: #fff;
    cursor: pointer;
    font-size: 10px;
    height: 25px;
    width: 25px;
    line-height: 25px;
    position: absolute;
    text-align: center;
    z-index: 99999;
    user-select: none;
    display: block;
  }
  .xfck {
    display: none;
    background: #222;
    width: 700px;
    height: 640px;
    text-align: center;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    z-index: 99999;
    border: solid 3px #000000;
  }
  .xfsc {
    background: #444;
    right: 20px;
    border-radius: 35px;
    margin-bottom: 13px;
    margin-right: 10px;
    margin-left: 10px;
    cursor: pointer;
    border: solid 5px #444;
    white-space: nowrap;
    float: left;
  }
  .xfsc:hover {
    background: #000;
    border: solid 5px #000;
  }
  .xfan {
    width: 100px;
    height: 40px;
  }
  .xfyy {
    overflow: auto;
    width: 700px;
    height: 430px;
    margin: auto;
  }
  #xf_sr {
    width: 580px;
    height: 32px;
    margin: auto;
  }
  #xf_dc {
    margin-left: 40px;
    margin-right: 40px;
  }
  .xfgb {
    position: absolute;
    right: 3px;
    top: 3px;
    cursor: pointer;
    font-size: 40px;
    width: 40px;
    height: 40px;
    line-height: 40px;
  }
  .xfgb:hover {
    background: #f00;
  }
  .tabbox ul {
    list-style: none;
    display: table;
    margin: 0;
    padding-left: 70px;
    width: 1000px;
  }
  .tabbox ul li {
    float: left;
    width: 120px;
    height: 50px;
    line-height: 50px;
    font-size: 12px;
    border: 1px solid #aaccff;
    cursor: pointer;
    margin-left: 10px;
    margin-right: 10px;
  }
 
  .tabbox ul li:hover{
    background-color: #111;
    color: white;
    font-weight: bold;
  }
  .tabbox ul li.active {
    background-color: #004f69;
    color: white;
    font-weight: bold;
  }
  .xfan,
  #xf_sr {
    background: #333;
    color: #ddd;
  }
  .xfan:hover,
  #xf_sr:focus {
    background: #111;
    color: #fff;
  }
 
  `;
let wddiv = `
<div class="xfsz">
    <span class="xfsz_an" title="过滤设置">
    滤
    <span class="xfsz_sz">0
    </span>
    </span>
</div>
<div class="xfck">
    <div>BiliBili过滤设置 前三者作用于主页、频道、直播推荐 最后一项用于个人主页与动态推荐</div>
    <div class="xfgb">X
    </div>
    <div>
        <textarea type="text" name="textfield" id="xf_sr" width="auto"></textarea>
        <br>
        不同过滤词用英文 , 分隔；导入会清空已有的，替换为导入的，导入空白等于删除全部过滤词。
        <br>
        <input type="submit" name="submit" id="xf_zj" class="xfan" value="增加">
        <input type="submit" name="submit" id="xf_dc" class="xfan" value="导出">
        <input type="submit" name="submit" id="xf_dr" class="xfan" value="导入">
    </div>
    <div class="tabbox">
        　　<ul>
            　　　　<li class="active">标题+up主</li>
            　　　　<li>标题</li>
            　　　　<li>up主</li>
            　　　　<li>个人页面+动态推荐</li>
            　　</ul>
        <br>
        <div class="xfyy"></div>
    </div>
</div>
`;
document.body.appendChild(wdstyle);
setTimeout(() => {
     document.querySelector("body").innderHTML += wddiv;
     $(wddiv).appendTo($("body"));
     //关闭
     $(".xfgb").click(function () {
          $(".xfck").toggle();
     })
     $(".xfsz_an").click(function () {
          $(".xfck").toggle();
     });
 
     $(".tabbox ul li").click(function () {
          $(this).addClass("active").siblings().removeClass("active");
          //获取选中元素的下标
          var index = $(this).index();
          $(this).parent().siblings().children().eq(index).addClass("active")
               .siblings().removeClass("active");
          xfz = index;
          sc();
     })
     //删除
     function sc() {
          $(".xfyy").empty();
          glc[xfz].forEach(glcc => {
               let a = document.createElement("span");
               $(a).text(glcc).addClass("xfsc");
               $(a).click(function () {
                    glc[xfz] = glc[xfz].filter(item => {
                         return item != $(a).text();
                    })
                    if (mo == 4) {
                         $(".small-item").show();
                    }
                    bc();
                    sc();
               })
               $(a).appendTo($(".xfyy"));
          });
     }
     sc();
 
     //增加
     $("#xf_zj").click(function () {
          nglc = $("#xf_sr").val().split(",");
          together(glc[xfz], nglc);
          glc[xfz] = getUniq(glc[xfz]);
          bc();
          sc();
          $("#xf_sr").val("")
     });
 
     //导出
     $("#xf_dc").click(function () {
          let s = "";
          glc[xfz].forEach((x) => {
               s += x + ","
          })
          $("#xf_sr").val(s).select();
     });
     //导入
     $("#xf_dr").click(function () {
          glc[xfz] = $("#xf_sr").val().split(",");
          bc();
          sc();
          $("#xf_sr").val("");
     });
 
     function glsjy() {
 
     }
}, 1000);
