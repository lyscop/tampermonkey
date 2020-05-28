https://greasyfork.org/zh-CN/scripts/398562-%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%85%81%E8%AE%B8%E5%A4%8D%E5%88%B6

隐藏选中时的碍眼菜单

```
GM_addStyle(`
#reader-helper-el
{
display:none;
}


移除 oncopy 属性, 相当于移除了对应的 EventListener
$("[class='bd doc-reader']").removeAttr("oncopy");


在文档完全加载完毕后执行函数
window.onload=()=>{init();}

```
