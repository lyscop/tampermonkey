https://greasyfork.org/zh-CN/scripts/2998-search-by-image

Search-By-Image
Search By Image | 以图搜图

一个以图搜图的脚本。通过该脚本，你可以快速地搜索图片。

备用下载地址：

https://greasyfork.org/scripts/2998-search-by-image

http://ext.ccloli.com/search-by-image/search-by-image.user.js

使用方法：

搜索图片：按住快捷键（默认设置为 Ctrl 键），同时在图片上点击鼠标右键，在菜单中选择欲使用的搜索引擎

上传搜索：按住快捷键（默认设置为 Ctrl 键），同时在非图片上点击鼠标右键，在菜单中上传图片后选择欲使用的搜索引擎（1.4 版本）

传输过程中点击进度条取消上传，上传后图片临时保存于中转服务器上供搜索引擎抓取

上传方式包括以下几种（仅支持单个文件）

点击“上传图片并搜索”并选择文件

拖拽文件至菜单内

按下 Ctrl + V 粘贴剪贴板内图片（暂不支持 Firefox，原因不明）

另外搜索 base64 形式图片也需要上传

设置脚本：按住快捷键（默认设置为 Ctrl 键），同时点击鼠标右键，在菜单中选择“Setting”打开设置界面

或在用户脚本命令中选择“Search By Image Setting”打开设置界面

在设置页面中可以更改、添加、删除搜索引擎，进行“多搜”及快捷键的配置和重置设置

更改搜索引擎：“名称”栏指定搜索引擎名称，“地址”栏指定搜索引擎调用地图（图片地址以 {%s} 代替）


添加搜索引擎：点击“Add Item”按钮可添加搜索引擎

删除搜索引擎：点击搜索引擎右侧的“×”可删除该搜索引擎

设置多搜　　：勾选“多搜”复选框并保存后，在搜索图片时点击“All”将打开所有勾选“多搜”的搜索引擎

更改快捷键　：在左下角的“HotKey”处可修改呼出搜索菜单的快捷键

重置设置　　：点击“Reset”按钮可重置所有设置（不可逆）

保存设置　　：点击“Save”按钮可保存设置

修改中转服务器：在脚本内 47 行（可能有变动）找到 server_url，按需进行修改（更新后也需重新设置），相关介绍已列在脚本中
各界面的使用请参考下面的预览图

默认支持的网站：

Google<br>
百度识图<br>
百度图片<br>
Bing<br>
TinEye<br>
Яндекс (Yandex)<br>
搜狗<br>
360<br>
SauceNAO<br>
IQDB<br>
3D IQDB<br>

内部测试：

864907600cc (ccloli)
文科 (wenketel)
本脚本基于 GPLv3 协议开源 http://www.gnu.org/licenses/gpl.html‎
