https://greasyfork.org/zh-CN/scripts/27183-%E6%8B%92%E7%BB%9D%E4%BA%8C%E7%BB%B4%E7%A0%81%E7%99%BB%E5%BD%95-%E6%B7%98%E5%AE%9D-%E4%BA%AC%E4%B8%9C%E7%AD%89%E7%BD%91%E7%AB%99%E9%BB%98%E8%AE%A4%E5%87%BA%E7%8E%B0%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95%E7%95%8C%E9%9D%A2

淘宝、京东等网站默认使用账号密码登录，不出现二维码
开发缘由<br>
淘宝、京东等网站的登录界面默认都使用的二维码登录，想要账号密码登录就需要点击切换 很不方便，因此写了个脚本帮我点击 毕竟懒惰是第一生产力~<br>

适配网站<br>
目前适配的网站有：

淘宝网<br>
天猫<br>
聚划算<br>
一淘网<br>
1688<br>
阿里妈妈<br>
阿里旅行（飞猪）<br>
阿里云<br>
京东<br>
新浪微博<br>
百度网盘（20170209 添加）<br>
QQ 互联、QQ 快速登录（20170210 添加)<br>
腾讯微云（20170213 添加）<br>
苏宁易购（20170710 添加）<br>
知乎（20170813 添加）<br>
支付宝（20180513 添加，感谢 @lfeng1420）<br>
虾米音乐（20180513 添加）<br>
斗鱼（20180513 添加）<br>
百度搜索（20180516 添加）<br>
百度贴吧（20180516 添加）<br>
百度通行证（20180929 添加）<br>
CSDN (20180929 添加)<br>
反馈<br>
脚本目前支持的网站不多，如果您发现有网站有同样需求，请提交给我 脚本目前还不成熟，条件受限无法进行各种兼容性测试，如果您在使用过程中发现bug也请在反馈论坛中提出

关于脚本安全性<br>
脚本代码简单，不对您的账号信息作任何记录，没有混淆，您可自行查看，如有不足欢迎指出

对于 QQ 快速登录支持的说明<br>
各大论坛和网站普遍使用的 QQ 账号登录自动切换现已支持 QQ登录和其他的二维码登录不同，当您已经登录 QQ 客户端且被它检测到时，可以点击头像快速登录，这还是很方便的一个功能，所以我不想一刀切地全弄成账号密码登录

因此，当系统检测到您已经登录一个 QQ 时，脚本将不做切换，但会帮您取消勾选右边很恶心的权限 

当您没有登录 QQ 时，不会显示二维码，帮您自动切换到账号密码登录界面 

QQ 会检测您是否已经登录手机端，如果已经登录手机端，没有登录电脑端，则仍然会要求扫码，此时脚本自动帮您切换到账号密码登录（2017.8.24更新）

衷心感谢各位的支持
