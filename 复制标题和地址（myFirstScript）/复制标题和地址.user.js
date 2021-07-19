// ==UserScript==
// 脚本名称
// @name         复制标题和地址（myFirstScript）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一键复制标题和地址（myFirstScript）
// @author       LiarCoder
// 在哪些页面生效, 支持通配符
// @match        *://*/*
// @grant        none
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABTklEQVQ4jY3TO0tcURQF4G/ixFdhCIg2qWysZPwDsUkXSJk2Qso0IpLOTtLERkGwEjQhXV5d0gkGK6v7E/IHgg9EHR0nHLLvzGHujGbB5pzLOXvttfc6twaNRiMta1g1GG28xJfyRlEU6rF/FskpjvA4o7nABD7gM17hY3lYEjzHOd4NqP8QW3gURA+wJzYJI2hV0rq4xtfsexdPcwW3EQmLaSw4wVCQr+M1DtDEJt7iVz1jLRUsB0GOn9iPymWRJ7mChOFY5ysNVFHrHaKwKWEGUyG1HZcnMY4/0UarH0Ez1u+Yq9T8h5tw5BTTg1p4EYfNnuR6WC3srCgo+/odcRdK+7ubrGIRvfeLq7hz3KsgESXPE97HDFKfOUazxLFegst4MAmf7pGfkP6NNNAOwTesYAM/YkgdrzOcYRYLeJMTHMbTTE926T8U7GAb/gI+kkP5n3CsvwAAAABJRU5ErkJggg==
// ==/UserScript==
 
(function() {
    'use strict';
    
    // 该函数用于创建一个<eleName k="attrs[k]">text</eleName>样式的页面元素
    function createEle(eleName, text, attrs){
        let ele = document.createElement(eleName);
        // innerText 也就是 <p>text会被添加到这里</p>
        ele.innerText = text;
        // attrs 的类型是一个 map
        for (let k in attrs) {
            // 遍历 attrs, 给节点 ele 添加我们想要的属性
           ele.setAttribute(k, attrs[k]);
        }
        // 返回节点
        return ele;
    }
    
    // alert('hhhhh');  
    // 下面我特意加了font-size和line-height两个属性，并写死了相关的数值，我发现我的脚本小按钮在不同的网页中有时会有不同的显示效果，
    // 经过开发者工具调试发现是不同的网页对于body、html等较高层的元素有相关的样式设置，其子元素就继承了部分设置，所以想要一致的效果，把这两个属性写死就可以了。
    // https://www.cnblogs.com/llhthinker/p/6719779.html，在这个网页上我的按钮显示效果与预期不同，怎么调都没反应 width: 124px;
    // 2021年6月20日23:20:01：因为在苹果官网发现了按钮样式有点奇怪，所以加上了font-family属性，还顺便把width由固定的124px改成了auto
    // 2021年7月13日00:47:55：在https://www.linuxidc.com/Linux/2016-11/137495.htm发现按钮的高度不对劲，通过开发者工具发现了该网页把button元素的高度设置为固定的22px，
    //   于是我在下面的样式中加上了height: 26px将高度固定为合适值
    let initialBtnStyle = '#copy-title-and-location {position: fixed; top: 100px; left: -100px; z-index:  2147483647; opacity: 0.5; background-image: none;\
                    background-color: #0084ff !important; margin: 5px 0px; cursor:pointer; font-size: 12px; line-height: 17px; width: auto; font-family: Arial, sans-serif;\
                    color: #fff; border-radius: 3px; border: 1px solid; padding: 3px 6px ; transition: left, 0.5s; height: 26px;}';
  
    // 如果下面的这个left值设置为原先的5px的话（事实上>0px的时候都会出现那样的情况，所以设为0px才比较好），
    // 当鼠标移到按钮最左边时可能会反复出现mouseover和mouseleave事件从而导致比较鬼畜的现象
    let emergeBtnStyle = '#copy-title-and-location {left: 0px; opacity: 1;}';
    let icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABTklEQVQ4jY3TO0tcURQF4G/ixFdhCIg2qWysZPwDsUkXSJk2Qso0IpLOTtLERkGwEjQhXV5d0gkGK6v7E/IHgg9EHR0nHLLvzGHujGbB5pzLOXvttfc6twaNRiMta1g1GG28xJfyRlEU6rF/FskpjvA4o7nABD7gM17hY3lYEjzHOd4NqP8QW3gURA+wJzYJI2hV0rq4xtfsexdPcwW3EQmLaSw4wVCQr+M1DtDEJt7iVz1jLRUsB0GOn9iPymWRJ7mChOFY5ysNVFHrHaKwKWEGUyG1HZcnMY4/0UarH0Ez1u+Yq9T8h5tw5BTTg1p4EYfNnuR6WC3srCgo+/odcRdK+7ubrGIRvfeLq7hz3KsgESXPE97HDFKfOUazxLFegst4MAmf7pGfkP6NNNAOwTesYAM/YkgdrzOcYRYLeJMTHMbTTE926T8U7GAb/gI+kkP5n3CsvwAAAABJRU5ErkJggg==';
    let btn = createEle('button', '复制标题和地址', {id: "copy-title-and-location"});
    // 2021年6月22日00:33:02：在outlook官网发现我的按钮的那个复制图标异常得大，样式完全不符合预期，通过控制台发现是img的width属性被默认设置为了100%，尝试设置为auto之后就好了
    let imgTag = createEle('img', '', {src:icon, style: "width: auto; vertical-align: middle; margin-left: 10px; border-style: none;text-align: center;display: inline-block;margin-bottom: 2px"});
    btn.appendChild(imgTag);
  
    btn.addEventListener('click', () => {
      let date = new Date();
      let timeStamp = date.toLocaleDateString().replace('\/', '年').replace('\/', '月') + '日' + date.toLocaleTimeString('chinese', {hour12: false});
      let titleTag = document.querySelector('title');
      let result = '更新：' + timeStamp + '\n> 参考：[' + titleTag.innerText + ']' + '(' + location + ')';
      let reg = /https:\/\/mp.weixin.qq.com\//;
      if (reg.test(location.toString())) {
        let officialAccount = document.getElementById('js_name');
        let publishDate = document.getElementById('publish_time');
        publishDate.click();
        result = '更新：' + timeStamp + '\n> 参考：[【微信公众号：' + officialAccount.innerText + ' ' + publishDate.innerText + '】'+ titleTag.innerText + ']' + '(' + location + ')';
      }
      // 我以为把上面的@match参数改成 *://*/*/ 之后就可以解决在阮一峰博客无法使用我的脚本的bug，结果还是没有效果，后来通过控制台观察，看到了【无法从 undefined 中找到writeText属性】
      // 这个错误，那就说明是 navigator.clipboard.writeText(result); 这句出了问题，通过不同网页的控制台测试，发现其他网页中是有navigator.clipboard这一属性的，而且也可以使用writeText方法，
      // 于是我又瞄了一眼阮一峰那篇讲剪切板的博客：http://www.ruanyifeng.com/blog/2021/01/clipboard-api.html，发现了错误所在：Chrome 浏览器规定，只有 HTTPS 协议的页面才能使用这个 API
      // 我尝试在http后加了个s然后回车，发现可以跳转至相同内容的页面，而协议也变成了https。
      // 于是我就开始找把http转换成https的方法，没有找到合适的答案，后来就记起来好像location这一对象中有许多有关页面地址的属性，于是就开始试验，发现了location.protocol就是我想找的，一开始
      // 我想通过正则表达式把http换成https，然后再让浏览器重新跳转至https协议下的网页，后来我发现只要直接对location.protocol重新赋值就行了，所以在使用navigator.clipboard接口前做一下判断
      // 如果当前页面不是https协议，那就把它换成https再说！试验过后完美解决我的问题。只不过遇到http协议的网页要重新跳转一下了，多花了点时间。
      if (location.protocol !== 'https:') {
        location.protocol = 'https:';
      }
      navigator.clipboard.writeText(result);
      // alert(result);
      // alert('成功复制！');
    });
    // document.body.appendChild(btn);
    // let isIframeNode = document.querySelector('body').parentNode.parentNode 
    if(window.self === window.top) {
      if (document.querySelector('body')){
          document.body.appendChild(btn);
      } else {
          document.documentElement.appendChild(btn);
      }
      // document.querySelector('body').appendChild(btn);
      // document.body.appendChild(style);
    }
    
  
    // btn.click();
  
    let style = createEle('style', initialBtnStyle, {type: "text/css"});
    // document.body.appendChild(style); // 这种写法会导致脚本在<iframe>标签的html文档的body标签也被选中
    // self === top 是用来判断当前页面是否是在<iframe>标签内，如果为true则表示不<iframe>标签内
    if(window.self === window.top) {
      // 下面这个判断是我看【网页限制解除（改）】这个油猴脚本里的写法，感觉更全面一点。
      // 但是其实我一开始改的目的是想解决我的脚本在阮一峰的网络日志里不起作用的事，但是后来发现不是这里的问题，
      // 而是上面写@match参数的时候没有考虑到网络协议是http的情况，所以一开始写成了@match https://*/*，而恰好阮一峰的博客所用的
      // 协议是http，所以怎么都显示不出来我的小按钮，原来是压根就没匹配到，所以改成了@match *://*/*/，这样一来所有网页理论上都会有我的小按钮了
      if (document.querySelector('body')){
          document.body.appendChild(style);
      } else {
          document.documentElement.appendChild(style);
      }
      // document.querySelector('body').appendChild(style);
      // document.body.appendChild(style);
    }
    btn.addEventListener('mouseover',function(){
            // btn.classList.add("copy-title-and-location-active");
      style.innerText = initialBtnStyle + emergeBtnStyle;
    });
    btn.addEventListener('mouseleave',function(){
            // btn.classList.remove("copy-title-and-location-active");
      style.innerText = initialBtnStyle;
    });
})();
