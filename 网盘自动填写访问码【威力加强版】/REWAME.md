https://greasyfork.org/zh-CN/scripts/29762

智能融合网盘密码到网址中，打开网盘链接时不再需要手动复制密码，并自动提交密码，一路畅通无阻。同时记录网盘信息，当你再次打开该分享文件时，不再需要去找提取码，同时可追溯网盘地址的来源。

安装此脚本?加入黑名单



使用说明<br>
本脚本将应用于所有的网页中，可能会造成未知的网页兼容性问题！如果出现网页兼容性问题，请主动添加白名单，或者反馈作者进行白名单添加。

本脚本主要功能为“密码融合”与“网盘自动填写密码并提交”，为了避免脚本占用不必要的资源，脚本生效于网页 DOM 加载完毕，不会事先融合超链接与密码，而是在点击超链接时产生进行融合，因此出现密码无法融合时，可先尝试刷新页面。

本脚本未使用“访问码”云查询接口，不支持对未知访问码的网盘直接进行访问，请不要再通过赞助渠道咨询云查询访问码的API了

本脚本并不完美，遇到无法支持的网站，请按照“特殊网站支持”反馈格式发帖，拜托不要给差评，问题解决了，麻烦改个好评，谢谢。否则我可能会深受打击

正确的使用方法<br>
链接: https://pan.baidu.com/s/1kVgPgUj 密码: qtr5

鼠标左键点击上方的超链接！<br>
打开网盘链接时，脚本将融合密码到网址中，并自动填写密码，你无需人工填写密码操作。<br>
脚本默认自带对网盘链接添加 target="_blank" 属性，也就是默认以新页面打开网盘链接。<br>
“不支持右键菜单打开，不支持中键打开超链接”，这不是 click 事件的正确触发方式，以上行为无法触发 click 事件。<br>
关于不支持 iframe 的说明<br>
例子：https://note.youdao.com/ynoteshare1/index.html?id=718155e20b0315f5b517748cd5192dec&type=note 脚本默认对iframe页面不支持注入，如上面的例子，如果需要支持iframe页面，可以将脚本中的 @noframes 删除掉 某些网站的iframe注入，可能会因为iframe内容的刷新和加载等行为，导致网盘脚本不断的被重复加载，严重可能导致iframe页面的功能异常（少数情况）

关于主要功能 及 增强部分<br>
网盘自动填写提取密码<br>
融合网盘超链接与提取码<br>
特定网站跳转链处理<br>
特殊支持网站<br>
★ 提高了“提取码”提取的准确度，避免提取“解压密码：”<br>
★ 提高了“提取码”获取的适配范围

关于特殊网站支持<br>
这是一个通用脚本，但它“不是全能”，一些不能融合密码，或密码提取出错的网站，都是因为其网站结构的特殊性所导致！这些网站都是单独处理！

反馈问题请按照以下格式进行：

浏览器版本：EDGE/FireFox/Chrome

脚本插件：Tampermonkey/Greasemonkey(油猴）/Violent monkey（暴力猴）/无脚本插件

问题网址：（网盘来源网站，不是网盘地址）

问题描述：

问题图片：（如果描述无法说清时请附上）

反馈时希望能给予“Good！”评价，并附上需要支持的网址，以及你所期望的需求！

另外，不接受论坛的链接无法融合密码的反馈，一些人发帖乱加粗加颜色，因排版混乱导致无法融合密码。

关于信息记录说明<br>
★ 记录功能所保存的信息，仅储存在你的本地电脑中，不会上传至任何网络服务器。<br>
★ 目前该功能仅支持百度网盘，不支持百度企业网盘。<br>
★ 脚本会将网页中所包含的“网盘地址，提取码，解压密码，网页来源地址，网页标题”信息进行记录，并在 pan.baidu.com 中使用 localStorage 进行保存。<br>
★ 记录的保存时间默认为 365 天（参数可自行修改），该功能主要是便于使用迅雷下载的人，在无法找回来源地址时，可通过保存的记录追溯网盘来源！ +☆ 如果你是频繁访问带密码的度盘，建议你将记录的保存时间减少至1个月，以避免 localStorage 的数据库因为满了而炸掉。

关于“链接失效检查”功能与“提取码云查询”功能<br>
可以理解小伙伴们的整合需求，但是本脚本不提供任何的“提取码”云查询功能，请勿询问云查询API事宜。 个人精力有限，免费的脚本没有任何收入，实在不愿意花太多的精力做这么多事情。 链接失效检查的脚本已经很多了，所以我就不插一脚了。

提取码云查询功能，其实也有一些脚本可以做，但是本人不在此处推荐了。 这类功能需要将你所访问的网盘地址发送至服务器，这涉及到你的个人隐私（例如你的私人文件），某些“云查询”脚本可能会上传你的网盘来源地址等其它信息，甚至可能包含你的账户数据（Cookies），建议慎用此类脚本和插件，或在具备相关安全知识的使用人员推荐下使用此类的脚本。

【威力加强版】完全体的正确使用方法<br>
想必大家都体验过度盘限速是有多么恶心，某些赚钱网盘的限速又是多么的让人抓狂，万一遇到没下载完就得重下，结果提取码忘了！好不容易下载完了，卧槽，解压密码是啥，这个网盘的文件到底是哪个网站下载的！！！！！ 于是【威力加强版】诞生了

完全体必须使用支持IE右键菜单的浏览器+迅雷5，通过修改迅雷IE右键菜单的脚本，实现获取信息的功能，保存在迅雷的任务信息中。 这里推荐：傲游浏览器（4.4.3版本+迅雷5），或者自己找其它支持IE右键菜单的浏览器吧。 使用“迅雷5”的原因是，这是目前好用的下载软件中，唯一一个可以手动修改“下载地址”的下载软件，这样就避免了下载链失效，需要重新下载文件的尴尬。
