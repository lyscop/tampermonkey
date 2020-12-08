https://greasyfork.org/zh-CN/scripts/371031-%E8%AF%8D%E9%A2%91%E7%BB%9F%E8%AE%A1

利用COCA一万五词频表分析网页文单词词频，建议手动替换为五万词库

词频脚本<br>
分析网页文章英语词频的油猴脚本<br>
由于油猴脚本的字符数量限制，建议手动替换<br>
var words = ["the",...];<br>
一行 为 文件 COCA_47000 的五万词频库。<br>
<br>
在线安装<br>
开源地址<br>
博客<br>
<br>
主要功能<br>
双击单词自动显示词频范围<br>
选中文章自动分析每一个词语<br>

兼容性<br>
安装了 TamperMonkey 的 Chrome浏览器<br>
已知问题<br>
没有判断网页类型和元素<br>
暂时没有对英文进行判断<br>
受限于JS运行效率，长篇段落比 较慢<br>
<br>
TODO<br>
判断英文<br>
性能优化<br>
元素判断<br>
