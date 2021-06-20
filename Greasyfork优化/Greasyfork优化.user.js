// ==UserScript==
// @name         Greasyfork优化
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  1.代码页添加"复制源码"按钮 2.发布时间显示到秒 3.未汉化部分增加汉化 4.脚本链接后面显示源码链接
// @author       AN drew
// @match        https://greasyfork.org/*
// @require      https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js
// @run-at       document-end
// @grant        GM_setClipboard
// ==/UserScript==
 
//复制源码
function execCopy() {
 
    var code='';
    $(".prettyprint li").each(function(){
        code += $(this).text()+'\n';
    });
 
    //&nbsp;转正常空格
    code = encodeURI(code)
    code = code.replace(/%C2%A0/g,'%20');
    code = decodeURI(code);
 
    /*
    const input = document.createElement('textarea');
    input.style.opacity  = 0;
    input.style.position = 'absolute';
    input.style.left = '-100000px';
    document.body.appendChild(input);
 
    input.value = code;
    input.select();
    input.setSelectionRange(0, code.length);
    document.execCommand('copy');
    document.body.removeChild(input);
    */
 
    GM_setClipboard(code, 'text');
    alert("复制成功")
    return true;
}
 
(function() {
    'use strict';
 
    //脚本链接后面显示源码链接
    $(".script-list h2 a").each(function(){
        if(!$(this).next().hasClass("code-link"))
        {
            let short_link = $(this).attr("href");
            let $code_link = $('https://greasyfork.org'+short_link+'/code\" class=\"code-link\">code</a>');
            $(this).after($code_link);
        }
    })
 
    //UTC时间转北京时间
    $("gf-relative-time").each(function(){
        let datetime =  new Date($(this).attr("datetime"));
        let month = (datetime.getMonth()+1)<10 ? "0"+(datetime.getMonth()+1) : (datetime.getMonth()+1);
        let date = datetime.getDate()<10 ? "0"+datetime.getDate() : datetime.getDate();
        let hours = datetime.getHours()<10 ? "0"+datetime.getHours() : datetime.getHours();
        let minutes = datetime.getMinutes()<10 ? "0"+datetime.getMinutes() : datetime.getMinutes();
        let seconds = datetime.getSeconds()<10 ? "0"+datetime.getSeconds() : datetime.getSeconds();
        let posttime = datetime.getFullYear()+"-"+month+"-"+date+"\xa0\xa0"+hours+":"+minutes+":"+seconds;
        $(this).text(posttime);
    })
 
    //翻译
    var translate = new Map();
    translate.set("发布你编写的脚本","发布JavaScript脚本");
    translate.set("发布你编写的样式","发布CSS样式");
    translate.set("New script set","新建脚本收藏夹");
    translate.set("Greasy Fork can import scripts that already hosted elsewhere, for example in a version control system (like GitHub), your own server, or another user script hosting site.","Greasy Fork可以导入已经托管在其他地方的脚本，例如在版本控制系统（如GitHub）、或你自己的服务器、或其他用户脚本托管网站。");
    translate.set("Provide URLs to import from, separated by newlines. These should be URLs to the raw .user.js files.","在下方填写需要导入的脚本URL，每个URL独占一行。这些URL指向的必须是后缀名为.user.js的原始文本文件。");
    translate.set("After the initial import, the script(s) should be synced:","脚本导入后的同步设置：");
    translate.set("Automatically - periodically update it from the URL you provided","自动--定期同步导入的脚本");
    translate.set("Manually - only when you trigger it","手动--只有手动点击时才同步");
    translate.set("For scripts from source control, ensure that the URL you use refers to a branch and not a specific commit, otherwise it will never get updated. For example, ","对于来自源码控制系统的脚本，确保你使用的URL是指一个分支，而不是一个特定的提交，否则它将永远不会被更新。例如这个分支 ");
    translate.set(" rather than ","，而不是特定提交");
    translate.set("Scripts imported from GitHub, Bitbucket, or GitLab can also be set up to sync using a webhook. A webhook will make it so your scripts are immediately updated on Greasy Fork when you push to your repository. If you want to use a webhook but haven't set it up yet, do the import first, then ","从GitHub、Bitbucket、GitLab导入的脚本也可以通过webhook进行同步设置。当推送到你的版本库时，webhook会让你的脚本在Greasy Fork上立即更新。如果你想使用webhook，但还没有设置，请先导入脚本URL，然后");
    translate.set("set up the webhook after","设置 webhook");
    translate.set("A webhook connected with Greasy Fork makes it so any push to repository automatically updates your scripts on Greasy Fork in a matter of minutes. Greasy Fork currently supports GitHub, Bitbucket, and GitLab webhooks.","webhook连接成功后，可以让任何推送到版本库的内容在几分钟内自动更新到你的Greasy Fork上。webhook功能目前支持GitHub、Bitbucket、GitLab")
    translate.set("Your scripts will continue to show a sync type of \"Automatic\" or \"Manual\" until the first push happens, and then they'll be set to \"Webhook\".","在脚本首次同步前将会一直显示手动/自动同步选项，在首次同步后将默认保存您的同步设置")
    translate.set("Just the push event.","(选中 Just the push event. )");
    translate.set("(Checked)","(此项打勾选中)");
    translate.set("(Unchecked)","(此项不选)");
    translate.set("Repository push","(选中 Repository push )");
    translate.set("(Push events only)","(只勾选 Push events )");
    translate.set("To set up the webhook on GitHub, access your GitHub repository and go to Settings, Webhooks, Add webhook, then enter the data below.","打开自己的Github仓库 → 点击 Settings → 点击左侧边栏 Webhooks → 点击 Add webhook 按钮。按照以下信息填写，点击下方的\"生成\"按钮生成Secret")
    translate.set("To set up the webhook on Bitbucket, access your Bitbucket repository and go to Settings, Webhooks, Add webhook, then enter the data below.","打开自己的Bitbucket仓库 → 点击左侧边栏 Repository settings → 点击左侧边栏下方的 Webhooks → 点击 Add webhook 按钮。按照以下信息填写，点击下方的\"生成\"按钮生成附带Secret的URL")
    translate.set("To set up the webhook on GitLab, access your GitLab repository and go to Settings, Integrations, then enter the data below.","打开自己的GitLab仓库 → 鼠标悬停在左侧边栏最下面的 Settings → 点击展开子选项中的 Webhooks。按照以下信息填写，点击下方的\"生成\"按钮生成Secret Token")
    translate.set("Some scripts on Greasy Fork can be installed as user styles.","Greasy Fork上的一些脚本可以作为CSS样式安装。");
    translate.set("The presence of some user CSS features precludes conversion to user JS format. When these features are detected, user JS conversion will not be done.","某些CSS特性不能转换为JavaScript。当检测到这些特性时，不会进行转换。");
    translate.set("Greasy Fork's user JS may load the CSS somewhat differently than user CSS does.","使用JavaScript加载CSS可能使用Stylus插件加载CSS有些不同");
    translate.set("In user JS, the CSS will be calculated and applied once on page load. The page's use of the JavaScript history API may result in the CSS not being applied as expected.","在JavaScript中，CSS将在页面加载时计算并应用一次。如果页面使用JavaScript history API可能导致CSS不能实现预期效果。");
    translate.set("If you find the user JS conversion doesn't work, you should choose the option to make it unavailable when you update your user CSS.","如果你发现CSS转JS不成功，请在发布CSS时取消转换")
    translate.set("用户样式如何被转换为用户脚本","CSS样式发布时转换为JavaScript脚本")
    translate.set("You can optionally sync your script's additional info.","同步脚本时添写附加信息");
    translate.set("Script Sets","脚本收藏夹");
    translate.set("View scripts","查看收藏夹");
    translate.set("Edit","编辑");
    translate.set("Install as user style","安装CSS样式");
 
    if(window.location.href.indexOf("https://greasyfork.org/zh-CN/users/webhook-info")!= -1) //webhook
    {
        $("h4").attr("style",`
font-size:25px;`);
 
        $("dt").attr("style",`
font-weight:bold;`);
 
        $("dd").attr("style",`
margin-right: 5px;
background-color: #d3d3d342;
border: 1px solid #e1e4e8;
border-radius: 6px;
box-shadow: inset 0 1px 0 rgba(225,228,232,.2);`);
 
        $("input").each(function(){
            if($(this).val()=="Generate")
                $(this).val("生成");
            if($(this).val()=="Regenerate")
                $(this).val("重新生成");
        })
    }
    else if(window.location.href.indexOf("https://greasyfork.org/zh-CN/help/installing-user-styles")!= -1) //help
    {
        $("body > div.width-constraint > section > p:nth-child(2)").html('CSS样式可以通过这些插件安装: https://addons.mozilla.org/firefox/addon/styl-us/" one-link-mark="yes">Stylus for Firefox, https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne" one-link-mark="yes">Stylus for Chrome, and https://addons.opera.com/extensions/details/stylus/" one-link-mark="yes">Stylus for Opera.')
    }
    else if(window.location.href.indexOf("https://greasyfork.org/zh-CN/help/user-js-conversions")!= -1) //help
    {
        $("title").text("CSS样式发布时转换为JavaScript脚本");
        $("body > div.width-constraint > section > p:nth-child(2)").html('Greasy Fork可以将CSS转换为JavaScript。 <code>@-moz-document</code>规则将被转换为JavaScript <code>if</code> 语句。 其中CSS将被附加到 <code>&lt;head&gt;</code>下的<code>&lt;style&gt;</code> 标签中。')
        $("body > div.width-constraint > section > ul:nth-child(4) > li:nth-child(1)").html('除了<code>default</code>之外的<code>@preprocessor</code> 元键');
        $("body > div.width-constraint > section > ul:nth-child(4) > li:nth-child(2)").html('<code>@var</code> 元键');
        $("body > div.width-constraint > section > ul:nth-child(6) > li:nth-child(1)").html('JavaScript会将CSS插入到<code>&lt;head&gt;</code>的最后一个<code>&lt;style&gt;</code>标签中。而使用Stylus插件不一定在最后，所以建议使用<code>!important</code>来提升样式优先级。');
        $("body > div.width-constraint > section > ul:nth-child(6) > li:nth-child(3)").html("JavaScript不能将CSS应用于<code>&lt;frame&gt;</code>或<code>&lt;iframe&gt;</code>。");
 
    }
    else if(window.location.href.indexOf("/code")!= -1) //code
    {
        var source_btn = $("<a></a>")
        source_btn.addClass("source");
        source_btn.text("复制源码");
        source_btn.click(function(){
            execCopy();
        });
        $("#install-area").after(source_btn);
    }
 
    $("a").each(function(){
        $(this).text(translate.get($(this).text()));
    })
 
    if($(".radio-group").length>0)
    {
        $($(".radio-group").get(0).childNodes[0]).wrap("<span>");
        $(".radio-group span").text("After the initial import, the script(s) should be synced:");
    }
 
 
    $("p").each(function(){
        if($(this).text().indexOf("For scripts from source control, ensure that the URL you use refers to a branch") != -1)
        {
            $($(this).get(0).childNodes[0]).wrap("<span>");
        }
        if($(this).text().indexOf(" rather than ") != -1)
        {
            $($(this).get(0).childNodes[2]).wrap("<span>");
        }
        if($(this).text().indexOf("Scripts imported from GitHub, Bitbucket") != -1)
        {
            $($(this).get(0).childNodes[0]).wrap("<span>");
        }
        if($(this).text().indexOf("To use this feature, you must have scripts on Greasy Fork set up to sync by URL to your repository.") != -1)
        {
            $(this).html('使用webhook之前，必须先'+'<a href="/zh-CN/import" one-link-mark="yes">导入脚本</a>'+'，导入后可以自动/手动同步脚本');
        }
        $(this).text(translate.get($(this).text()));
    })
 
    $('[data-disable-with="Import"]').val("导入");
 
    $("label, span, dd, li, h3, a").each(function(){
        $(this).text(translate.get($(this).text()));
    })
 
    $("#add-synced-additional-info").text("增加一个本地化的附加信息。")
 
    $(".label-note").each(function(){
        if($(this).text().indexOf("向您捐款")!= -1)
        {
            $(this).html('(其他用户可通过 https://flattr.com" one-link-mark="yes">Flattr 向您捐款)');
        }
    })
 
    $('.radio-label[for="discussion_rating_0"]').html('<span class="rating-icon rating-icon-none">无评分</span> -  只是一个询问或评论');
    $('.radio-label[for="discussion_rating_2"]').html('<span class="rating-icon rating-icon-bad">差评</span> -  脚本失效或无法使用');
    $('.radio-label[for="discussion_rating_3"]').html('<span class="rating-icon rating-icon-ok">一般</span> -  脚本有用，但还有一些问题');
    $('.radio-label[for="discussion_rating_4"]').html('<span class="rating-icon rating-icon-good">好评</span> -  一切运行良好');
 
 
 
 
    if(!$('.announcement').hasClass('translate')){
        let notification; //链接
        let dismiss; //关闭按钮
        if( $('.announcement').text().indexOf('the @antifeature meta key.') > -1)
        {
            notification = $('.announcement a').clone(true);
            dismiss = $('#announcement-dismiss').clone(true);
            $('.announcement').empty();
            $('.announcement').append('<span>如果您的脚本包含货币化方法，如跟踪、广告或矿工，您现在必须使用</span>');
            notification.text(' @antifeature元键 ');
            $('.announcement').append(notification);
            $('.announcement').append('<span>披露这些方法。含有未用@antifeature公开的货币化方法的脚本将在2021年2月1日后被删除。</span>');
            $('.announcement').append(dismiss);
            $('.announcement').addClass('translate');
        }
        else if( $('.announcement').text().indexOf('@userName') > -1)
        {
            notification = $('.announcement a').clone(true);
            dismiss = $('#announcement-dismiss').clone(true);
            $('.announcement').empty();
            $('.announcement').append('<span>GreasyFork现已支持@其他用户，您可以在评论、消息、脚本和个人资料中使用 "@用户名" 来@其他用户；当其他用户@您时，您也能收到通知</span>');
            notification.text(' (点击此处修改通知设置) ');
            $('.announcement').append(notification);
            $('.announcement').append(dismiss);
            $('.announcement').addClass('translate');
        }
        else if( $('.announcement').text().indexOf('old-format image URLs') > -1)
        {
 
        }
    }
 
 
 
    $("head").append('<style>'+
                     '.source{'+
                     'transition: box-shadow 0.2s;'+
                     'display: inline-block;'+
                     'background-color: #0084FF;'+
                     'padding: 0.5em 1em;'+
                     'color: white;'+
                     'text-decoration: none;'+
                     'cursor:pointer}'+
                     '.source:hover{'+
                     'transition: box-shadow 0.2s;'+
                     'box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);'+
                     '}'+
                     '.code-link'+
                     '{'+
                     '	margin-left:10px; '+
                     '	padding-left:2px;'+
                     '	padding-right:2px; '+
                     '	font-size:12px; '+
                     '	background:#0084ff; '+
                     '	color:white!important; '+
                     '	text-decoration: none;'+
                     '}'+
                     '.rating-icon-none {'+
                     '    border-color: #bbbbbb;'+
                     '    background-color: #8590a612;'+
                     '    color: gray;'+
                     '}'+
                     '</style>');
 
})();
