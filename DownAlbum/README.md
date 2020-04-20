[Link](https://greasyfork.org/zh-CN/scripts/2180-downalbum)

DownAlbum<br>
Facebook, Instagram, Pinterest, Twitter, Ask.fm, Weibo Album Downloader<br>
<br>
Facebook: Album, Photos of, Tagged photos, Search, Group, Message<br>

Leave comments&bugs @ https://getsatisfaction.com/downalbum<br>
Facebook Page: https://www.facebook.com/DownAlbum<br>
Firefox user can read this userguide: http://goo.gl/crkup<br>
Donate for my work: (Thank you very much!) http://goo.gl/T9gVE<br>
Supported browser: Chrome & Firefox. ( May work for Opera / Safari )<br>
<br>
Modified from 'Download FB album' by blackbing | Credit to fancyBox(by Janis Skarnelis), FileSaver(by Eli Grey), zip.js (by Gildas Lormeau) & File API tool (thecssninja.com)<br>
<br>
<br>
Installation Steps:<br>
Rename only works in Chrome Extension<br>
<br>
-Chrome: (Extension has much higher performance)<br>
Install Tampermonkey -> Install the script. OR Install the Extension Directly<br>
<br>
-Firefox:<br>
Install Scriptish or Greasemonkey -> Install the script. (userguide)<br>
p.s. If you installed 'NoScript', please allow 'dropbox.com' for my script to work in https environment.<br>
<br>
If it isn't work in Opera & Safari, please wait for fixes.<br>
<br>
-Opera: Install violentmonkey -> install this script Or refer to Support Docs of Userscripts.org and Opera<br>
After installation, please refer to this guide to save photos.<br>
<br>
-Safari: install Ninjakit -> install this script<br>
<br>
Easy to read tutorial(Thanks Brian Mahoney): http://brianmahoney.ca/2013/02/download-facebook-albums/<br>

Download Steps:<br>
Go to any albums/photos tab in profile.<br>
Click the link 'DownFbAlbum' in the top menu.<br>
( click DownFbAlbum(Setup) to reset saved settings )<br>
Type in download mode:<br>
--1/press Enter -> Normal Download<br>
--2 -> Download without auto load ( For large album )<br>
--3 -> Load from specific id ( For very large album to optimize performance )<br>
( e.g. "500th -> end" not "1st -> end" )<br>
www.facebook.com/photo.php?fbid=123456 <- Enter this number<br>
--4 -> Optimization for large album ( Save the page as usual )<br>
-- Load Captions, Comments & Friend tag ( Take longer time )<br>
-- Open page in current / new window ( New window may not work for large album )<br>
Save the new content loaded. "Press Ctrl+S"<br>
(5. Click 'ReStyle' if the images' position are wrong.)<br>
---------------------<br>
各選項解釋：<br>
Normal Download 普通下載 ( 嘗試載入整個相簿的圖片 )<br>
Without auto load 只下載已載入的圖片 ( 針對太多相片的專頁 )<br>
Autoload from specific id 從特定相片後繼續載入 ( 針對非常多相片的專頁 )<br>
www.facebook.com/photo.php?fbid=123456 <- 請輸入這個數字<br>
Optimization for large album 對大相簿優化 ( 如常儲存網頁便可 )<br>
-- 載入相片的說明文字, 評論 及 標籤 ( 需等待一段時間 )<br>
-- 使用 現在的/新視窗 開啟頁面 ( 新視窗有時不能開啟太多相片的相簿 )<br>
