[anti-redirect](https://greasyfork.org/zh-CN/scripts/11915-anti-redirect)

GM 脚本，反重定向<br>
去除各搜索引擎/常用网站的重定向<br>

反馈地址<br>
反馈最好能带上出问题的网页地址<br>

https://github.com/axetroy/anti-redirect/issues/new<br>
https://github.com/axetroy/anti-redirect/issues/new<br>
https://github.com/axetroy/anti-redirect/issues/new<br>
如果这能够帮助到你, 不妨点个 star, 你的支持就是我更新的动力<br>
点击从 Github 安装<br>

点击从 GreasyFork 安装<br>

工作原理<br>
根据 URL 上暴露出来的跳转链接，正则匹配提取真实的地址，例如知乎，Google<br>
如果 A 标签的内容为真实的地址，则替换，例如百度贴吧<br>
逐一发送请求，获取真实的地址，例如百度搜索<br>
根据请求特殊页面，这个特殊页面没有重定向地址，然后覆盖当前页，例如百度搜索，搜狗搜索<br>
覆盖原本的链接点击事件，比如 qq 邮箱<br>
更新日志<br>
https://github.com/axetroy/anti-redirect/blob/master/CHANGELOG.md<br>

支持的站点<br>
[x] 知乎<br>
[x] 知乎专栏<br>
[x] 知乎日报<br>
[x] Google 搜索<br>
[x] Google 文档<br>
[x] Google Play<br>
[x] Google Gmail<br>
[x] Google Youtube<br>
[x] 360 搜索<br>
[x] 新浪微博<br>
[x] Twitter<br>
[x] 搜狗搜索<br>
[x] 百度搜索<br>
[x] 百度视频<br>
[x] 百度学术<br>
[x] 掘金<br>
[x] QQ 邮箱<br>
[x] Mozilla<br>
[x] 简书<br>
[x] 豆瓣<br>
[x] Pocket<br>
[x] DogeDoge<br>
我想支持更多的站点<br>
点击这个链接，提交 issues，说出你想要支持的站点<br>

贡献代码<br>
需要通过 NodeJs 把 TypeScript 编译成 javascript<br>

git clone https://github.com/axetroy/anti-redirect.git<br>

cd ./anti-redirect<br>

npm install<br>
npm run watch<br>
