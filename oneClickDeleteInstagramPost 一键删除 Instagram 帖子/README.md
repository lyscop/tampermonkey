https://greasyfork.org/zh-CN/scripts/373339-oneclickdeleteinstagrampost

在 Instagram 的个人页面的图片上添加 [Delete] 按钮，点击直接删除图片，不再有确认提示框

oneClickDeleteInstagramPost 一键删除Instagram帖子

这是一个用于快速删除 Instagram 帖子的 用户脚本。

用户可以在 PC 端的个人页面直接删除自己的 Post，并且没有 Yes/No 的确认提示框。可以非常快速且直接了当的进行删除。

安装、截图、使用方式

安装和软件截图：oneClickDeleteInstagramPost On Greasy Fork

用户需先安装用户脚本管理器，推荐

暴力猴：chrome 网上应用店，火狐附加组件，GitHub

或其他同类扩展程序。用户脚本管理器的安装等相关资料均可参见 Greasy Fork。

新安装用户是无法使用删除功能的，必须将脚本中的 safe_lock; 修改为 0 方能进行删除。这个项目原本只是为特殊目的而制作并使用的，并不建议一直开启。但是由于脚本同时可显示每个 Post 的注释，所以可能会有用户在日常也开启这个功能，所以设置了一个安全锁，当用户不需要删除功能时，可以将删除按钮锁定，以避免误点击造成数据丢失。

其他疑问请先阅读 已知问题 或 提Issue。

反馈
关于使用的反馈，可以发送到 greasyfork 对应项目页、GitHub 项目。

欢迎对项目进行 Pull Request。请将 Pull Request 发到 dev 分支。

安全性

信息收集

脚本不会以任何方式记录或收集您的任何个人信息。

数据恢复

脚本不会存储您的任何操作记录。如果您把某个照片或视频删掉了，是 没有恢复的余地的 。本脚本不会备份您的资料，Instagram 也没有回收站功能。

删掉了就是删掉了，找不回来！

本项目对您的数据丢失不负任何责任。

已知问题

~~需要刷新个人首页才能启动脚本~~ (Fixed in 1.0.4)

~~部分用户的首页会变形，触发条件不详~~ (Fixed in 1.0.1)

主页前 12 条 POST 的 alt 变成了图像识别，不再是图片描述了。

视频描述读不到

删除内容后，如果用户滚动页面超过一定行数之后再滚动回来，被删除的内容还会出现在列表中，但是内容已删除，无法访问。

~~即使进入其他用户的主页，也能看到删除按钮~~ (Fixed in 1.0.5)

License

MIT

Source Code
https://github.com/catscarlet/oneClickDeleteInstagramPost
