// ==UserScript==
// @name        您访问该网站多少次
// @description   您是否访问过
// @description:en 您是否访问过
// @version       0.2.1
// @description  try to take over the world!
// @author       chancoki
// @include      /.*:.*/
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/754467
// ==/UserScript==
 
(function () {
  "use strict";
  const body = document.body;
  const div = document.createElement("div");
  const p = document.createElement("p");
  body.appendChild(div);
  body.appendChild(p);
  div.className = "aView1";
  p.innerHTML = `
<style>
.aView1 {
  display: none;
  width: 210px;
  height: 40px;
  border-radius: 20px;
  line-height: 40px;
  text-align: center;
  font-size: 15px;
  box-shadow: 0 0 10px #aaa;
  font-weight: bolder;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: saturate(180%) blur(20px);
  position: fixed;
  left: 50%;
  top: -65px;
  transform: translate(-50%,0);
  z-index:3000;
  color: #222;
  user-select: none;
  animation: run 10s;
  }
.aView1 div{
  display: flex;
  justify-content: center;
  align-items: center;
}
.aView1 div img{
  width: 18px;
  height: 18px;
  margin-right: 5px;
}
@keyframes run{
  0%,100%{
    top: -65px;
    opacity: .3;
  }
  20%,80%{
    top:75px;
    opacity: 1;
  }
}}
</style>
`;
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const m = date.getMinutes();
 
  let storage = JSON.parse(window.localStorage.getItem("myview"));
  let storageList = Object.keys(localStorage);
  const item = storageList.filter((item) =>
    /\d\d?-\d\d? \d\d?:\d\d? 访问备份/.test(item)
  );
  let beifen = [];
  if (item.length > 0) {
    for (let i = 0, len = item.length; i < len; i++) {
      beifen = beifen.concat(JSON.parse(localStorage[item[i]]));
    }
  }
  if (!storage) {
    storage = [];
  }
 
  if (
    storage.some((item) => item.url == location.pathname) ||
    beifen.some((item) => item.url == location.pathname)
  ) {
    let tmp = storage.filter((item) => item.url == location.pathname);
    if (tmp.length <= 0) {
      tmp = beifen.filter((item) => item.url == location.pathname);
    }
    storage[storage.indexOf(tmp[0])].record =
      (storage[storage.indexOf(tmp[0])].record || 2) + 1;
    aView("您已访问 " + storage[storage.indexOf(tmp[0])].record + " 次该网站");
  } else {
    const time = `${month}-${day} ${hour}:${m}`;
    if (storage.length >= 100) {
      window.localStorage.setItem(time + " 访问备份", JSON.stringify(storage));
      storage = [];
    }
    storage.push({
      url: location.pathname,
      title: document.title,
      time,
      record: 1,
    });
    aView("已经加入访问记录");
  }
  window.localStorage.setItem("myview", JSON.stringify(storage));
 
  function aView(flag) {
    setTimeout(() => {
      div.style.display = "block";
      div.innerHTML = `<div><img src='${
        window.location.protocol + "//" + window.location.host + "/favicon.ico"
      }'class = 'img'/><span>${flag}</span></div>`;
      const img = document.querySelector(".img");
      img.onerror = () => {
        img.style.display = "none";
      };
    }, 3500);
  }
  div.addEventListener("click", () => {
    div.style.display = "none";
  });
  // Your code here...
})();
