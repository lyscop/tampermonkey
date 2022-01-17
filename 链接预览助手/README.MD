https://greasyfork.org/zh-CN/scripts/438622

用途<br>
长按链接将打开内置窗口预览，避免频繁的切换窗口。

前置条件<br>
部分网站不支持在内嵌 iframe 中打开，需要修改响应头。可以使用 ModHeader 来修改。

```
Response Headers

Content-Security-Policy: ''
X-Frame-Options: ''
```
