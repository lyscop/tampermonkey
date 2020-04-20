[Link](https://greasyfork.org/zh-CN/scripts/398533-bilibili-%E5%90%8C%E6%97%B6%E6%98%BE%E7%A4%BA-av-%E5%8F%B7%E5%92%8C-bv-%E5%8F%B7)

av 与 bv 的转化在本地进行. 没有使用当前常见的调用 bilibili api 的做法<br>

具体算法请见源码<br>

功能<br>
找回 bilibili 视频的 av 号<br>

如果当前地址是bv地址, 那么将增加av号显示: https://www.bilibili.com/video/BV19b411s7dY => https://www.bilibili.com/video/BV19b411s7dY?aid=av47480567<br>
<br>
如果当前是av地址, 那么增加bv号显示: https://www.bilibili.com/video/av2 =>https://www.bilibili.com/video/BV1xx411c7mD?aid=av2<br>
<br>
另外, 如果原始地址包含其他参数, 那么这些参数也会保留下来. 例如: https://www.bilibili.com/video/BV1db411W7Qg/?spm_id_from=333.788.videocard.1 => https://www.bilibili.com/video/BV1db411W7Qg?spm_id_from=333.788.videocard.1&aid=av47783317<br>
<br>
地址的变化不会刷新页面.<br>
