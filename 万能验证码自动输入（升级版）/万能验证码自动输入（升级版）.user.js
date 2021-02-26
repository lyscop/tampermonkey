// ==UserScript==
// @name         万能验证码自动输入（升级版）
// @namespace    https://www.like996.icu:1205/
// @version      2.1
// @description  在将来的时间里将会在后台默默的为你自动识别页面是否存在验证码并填入。对于一些书写不规整的验证码页面请手动配置规则。感谢老六提供基础代码
// @author       crab
// @match        http://*/*
// @match        https://*/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @require      https://cdn.bootcss.com/blueimp-md5/1.1.0/js/md5.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @nocompat     Chrome
// ==/UserScript==
class CaptchaWrite {
 
    IdCard() {
        return "请在此处填写您的识别授权码（游客用户一小时仅能识别两次）";
    }
    getCaptchaServerUrl(){
        return "https://www.like996.icu:1205/";
    }
    constructor() {
        this.Tip = this.AddTip();
        if (GM_listValues().indexOf("set") == -1) {
            GM_setValue("set", {
                "ApiKey": ""
            });
            var WhetherHelp = confirm("万能验证码填入\n初始化完毕!\n在将来的时间里将会在后台默默的为你\n自动识别页面是否存在验证码并填入。\n对于一些书写不规整的验证码页面请手动配置规则。\n查看添加方法请点击确定。");
            if (WhetherHelp == true) {
                GM_openInTab(this.getCaptchaServerUrl(), 'active')
            }
        }
        Set = GM_getValue("set");
    }
 
    //手动添加规则
    PickUp() {
        var that = this;
        var AddRule = {};
        var IdentifyResult = '';
        that.Hint('请对验证码图片点击右键！')
        $("img").each(function() {
            $(this).on("contextmenu", function() {
               
                var img = that.Aimed($(this));
                console.log('PickUp_Img:' + img);
                if($(img).length!=1){
                    that.Hint('验证码选择错误，该图片实际对应多个元素。')
                    return;
                }
                 that.Hint('等待识别')
                IdentifyResult = that.Identify(img,function ManualRule(img,IdentifyResult){
                    if (img && IdentifyResult) {
                        console.log('记录信息' + img + IdentifyResult);
                        AddRule['img'] = img;
                        $("img").each(function() {
                            $(this).off("click");
                            $(this).off("on");
                            $(this).off("load");
                        });
                        that.Hint('接下来请点击验证码输入框')
                        $("input").each(function() {
                            $(this).click(function() {
                                var input = that.Aimed($(this));
                                // console.log('PickUp_input' + input);
                                AddRule['input'] = input;
                                AddRule['path'] = window.location.href;
                                AddRule['title'] = document.title;
                                AddRule['host'] = window.location.host;
                                AddRule['idcard'] = that.IdCard();
                                that.Write(IdentifyResult,input);
                                //that.WriteResults(AddRule['img'], AddRule['input'])
                                that.Hint('完成')
                                //移除事件
                                $("input").each(function() {
                                    $(this).off("click");
                                });
                                //添加信息
                                that.Query({
                                    "method": "captchaHostAdd",
                                    "data": AddRule
                                },function(data){});
                                that.delCapFoowwLocalStorage(window.location.host);
                            });
                        });
                    }
                });
 
 
            });
        });
    }
    //创建提示元素
    AddTip() {
        var TipHtml = $("<div id='like996_identification'></div>").text("Text.");
        TipHtml.css({
            "background-color": "rgba(211,211,211,0.86)",
            "align-items": "center",
            "justify-content": "center",
            "position": "fixed",
            "color": "black",
            "top": "-5em",
            "height": "2em",
            "margin": "0em",
            "padding": "0em",
            "font-size": "1.2em",
            "width": "100%",
            "left": "0",
            "right": "0",
            "text-align": "center",
            "z-index": "9999999999999",
            "padding-top": "3px",
 
        });
        $("body").prepend(TipHtml);
        return TipHtml;
    }
    //展示提醒
    Hint(Content, Duration) {
        var that = this;
        that.Tip.stop(true, false).animate({
            top: '-2em'
        }, 300, function() {
            that.Tip.html(Content+"<span style='color:red;float: right;margin-right: 20px;' onclick='document.getElementById(\"like996_identification\").remove()'>X</span>");
        });
        that.Tip.animate({
            top: '0em'
        }, 500).animate({
            top: '0em'
        }, Duration ? Duration : 3000).animate({
            top: '-2em'
        }, 500)
        return;
    }
    //查询规则
    Query(Json,callback) {
        var that = this;
        var QueryRule = '';
        var LocalStorageData=this.getCapFoowwLocalStorage(Json.method + "_" + Json.data.host);
        if(Json.method=='captchaHostAdd'){
            that.delCapFoowwLocalStorage("captchaHostQuery_"+Json.data.host);
            LocalStorageData=null;
        }
        if(LocalStorageData!=null){
            console.log("存在本地缓存的验证码识别规则直接使用。")
            if(callback!=null){
                callback(LocalStorageData);
                return;
            }else{
                return LocalStorageData;
            }
        }
        $.ajax({
            url: that.getCaptchaServerUrl() + Json.method,
            type: "POST",
            dateType: 'json',
            cache: false,
            async: callback!=null,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(Json.data),
            success: function(data) {
                if (data.info) {
                    that.Hint(data.info);
                }
                QueryRule = data;
                that.setCapFoowwLocalStorage(Json.method + "_" + Json.data.host,data,new Date().getTime()+1000*60)
                if(callback!=null){
                    callback(QueryRule);
                }
 
            },
            error: function(data) {
                console.log("error");
            }
        });
        return QueryRule;
    }
    //开始识别
    Start() {
        //检查配置中是否有此网站
        var that = this;
        var Pathname = window.location.href;
        var Card = that.IdCard()
        that.Query({
            "method": "captchaHostQuery",
            "data": {
                "host": window.location.host,
                "path": Pathname,
                "idcard": Card
            }
        },function(Rule){
            if (Rule.code ==531 || Rule.code ==532) {
                console.log('有规则执行规则' + Pathname);
                var data=Rule.data;
                for(var i=0;i<data.length;i++){
                    writeResultIntervals[i]=data[i];
                }
                console.log('等待验证码图片出现');
                writeResultInterval= setInterval(function(){that.WriteResultsInterval();},500);
 
            } else if (Rule.code == 530) {
                console.log('黑名单' + Pathname);
                that.Hint('该页面在黑名单中,无法识别', 5000);
                return
            } else if (Rule.code == 533) {
                console.log('新网站开始自动化验证码查找' + Pathname);
                var MatchList = that.AutoRules();
                if (MatchList.length) {
                    console.log('检测到开始写入，并添加规则');
                    for (i in MatchList) {
                        console.log(MatchList[i].img, MatchList[i].input);
                        that.WriteResults(MatchList[i].img, MatchList[i].input)
                        // 自动规则存在bug，后期修复，只识别，不提交云端。
/*                         that.Query({
                            "method": "captchaHostAdd",
                            "data": {
                                "host": window.location.host,
                                "path": Pathname,
                                "img": MatchList[i].img,
                                "input": MatchList[i].input,
                                "title": document.title,
                                "type": 2,
                                "idcard": Card
                            }
                        },function(data){
                            
                        }); */
                    }
                } else {
                }
            }
        });
 
    }
    // 定时执行绑定验证码img操作
    WriteResultsInterval(){
        for(var i=0;i< writeResultIntervals.length;i++){
            var imgAddr=writeResultIntervals[i].img;
            var inputAddr=writeResultIntervals[i].input;
            if(document.querySelector(imgAddr)==null||document.querySelector(inputAddr)==null){
                continue;
            }
            try{
                if(this.getCapFoowwLocalStorage("err_"+writeResultIntervals[i].img)==null){// 写入识别规则之前，先判断她是否有错误
                    this.WriteResults(imgAddr, inputAddr);
                }
            }catch(e){
                this.Hint('识别过程中发生错误，已停止识别此网站！（若验证码消失，请刷新网站）', 10000);
                console.log(e);
                this.setCapFoowwLocalStorage("err_"+writeResultIntervals[i].img,"可能存在跨域等问题停止操作它",new Date().getTime()+(1000*1000))
                this.Query({
                            "method": "captchaHostAdd",
                            "data": {
                                "host": window.location.host,
                                "path": window.location.href,
                                "img": writeResultIntervals[i].img,
                                "input": writeResultIntervals[i].input,
                                "title": document.title,
                                "type": 0,
                                "idcard": this.IdCard()
                            }
                    },null);
 
            }
        }
    }
    //解析
    Identify_Baidu(img,ImgBase,callback) {
        var that = this;
        var Base;
        try{
            Base = "img="+encodeURIComponent(ImgBase.toDataURL("image/png").replace(/.*,/, ""));
            // 丢弃小图片
            if(Base.length<255){
                return;
            }
        }catch(e){
            return;
        }
        var Results = that.getCapFoowwLocalStorage(Base.substring(Base.length-32));
        if(Results!=null){
//             if(callback.name == 'ManualRule' ){
//                 that.Hint('该验证码已识别过，请刷新后重试')
//             }
            if(callback.name != 'ManualRule' ){// 不为手动直接返回结果
                 return Results;
            }
        }
        that.setCapFoowwLocalStorage(Base.substring(Base.length-32),"识别中..",new Date().getTime()+(1000*99999));//同一个验证码只识别一次
        var url=that.getCaptchaServerUrl() + "/hello";
        console.log("验证码变动，开始识别")
        $.ajax({
            url: url,
            type: 'post',
            cache: false,
            async: callback!=null,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: Base+"&idCard="+that.IdCard(),
            success: function(data) {
                if (!data.valid) {
                    if(data.description!=undefined){
                        that.Hint('识别请求发生错误： ' + data.description, 10000);
                    }
                    that.setCapFoowwLocalStorage(Base.substring(Base.length-32),data.description,new Date().getTime()+(1000*1000))
 
                } else {
                    Results = data.data;
                    if (Results.length < 4) {
                        that.Hint('验证码识别结果可能错误，请刷新验证码尝试', 5000)
                    }else{
                        that.Hint('验证码识别完成', 500)
                    }
                    that.setCapFoowwLocalStorage(Base.substring(Base.length-32),Results,new Date().getTime()+(1000*1000))
                    if(callback!=null){
                        if(callback.name=='WriteRule'){
                            callback(Results);
                        }else if(callback.name=='ManualRule'){
                            callback(img,Results);
                        }
                    }
                }
            },error: function(data) {
               // that.Hint('ajax请求错误', 10000);
            }
        });
        return Results;
    }
    //识别操作
    Identify(img,callback) {
        var that = this;
        var Base = that.ConversionBase(img);
        try{
            if(Base.toDataURL("image/png").replace(/.*,/, "").length<255){
                throw new Error("图片大小异常");
            }
        }catch(e){
            if(callback.name=='ManualRule'){
                that.Hint('跨域策略，请重新右键点击图片');
            }
            return;
        }
        if (Base.width) {
            if(!$(img).is(":visible")){
                console.log("验证码不可见，本次不识别");
                return;
            }
            that.Identify_Baidu(img,Base,callback);
        } else {
            console.log('验证码没有加载加载后自动识别');
            that.Hint('点击图片非验证码图片，或存在跨域问题')
        }
    }
    //根据配置识别写入
    WriteResults(img, input) {
        var that = this;
        //创建一个触发操作
        if(document.querySelector(img)==null){
            return;
        }
        document.querySelector(img).onload = function() {
            that.WriteResults(img, input)
        }
        this.Identify(img,function WriteRule(vcode){
            that.Write(vcode, input)
        })
 
    }
    //写入操作
    Write(ResultsImg, WriteInput) {
        var that = this;
        WriteInput = document.querySelector(WriteInput);
        WriteInput.value = ResultsImg;
        if(typeof(InputEvent)!=='undefined') {
            //使用 InputEvent 方法，主流浏览器兼容
            WriteInput.dispatchEvent(new InputEvent("input")); //模拟事件
        } else if(KeyboardEvent) {
            //使用 KeyboardEvent 方法，ES6以下的浏览器方法
            WriteInput.dispatchEvent(new KeyboardEvent("input"));
        }
    }
    //转换图片
    ConversionBase(img) {
        img = document.querySelector(img);
        img.setAttribute("crossOrigin",'Anonymous');// 设置允许跨域
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        return canvas;
    }
    //自动规则
    AutoRules() {
        var that = this;
        var MatchList = [];
        $("img").each(function() {
            var Randomcolor = "red";
            if ($(this).siblings("input").length == 1) {
                MatchList.push({
                    "img": that.Aimed($(this)),
                    "input": that.Aimed($(this).siblings("input"))
                })
                $(this).css("borderStyle", "solid").css("borderColor", Randomcolor).css("border-width", "4px");
                $(this).siblings("input").css("borderStyle", "solid").css("borderColor", Randomcolor);
            } else {
                if ($(this).prev().children("input").length == 1) {
                    MatchList.push({
                        "img": that.Aimed($(this)),
                        "input": that.Aimed($(this).prev().children("input"))
                    })
                    $(this).css("borderStyle", "solid").css("borderColor", Randomcolor).css("border-width", "4px");
                    $(this).prev().children("input").css("borderStyle", "solid").css("borderColor", Randomcolor);
                }
                if ($(this).next().children("input").length == 1) {
                    MatchList.push({
                        "img": that.Aimed($(this)),
                        "input": that.Aimed($(this).next().children("input"))
                    })
                    $(this).css("borderStyle", "solid").css("borderColor", Randomcolor).css("border-width", "4px");
                    $(this).next().children("input").css("borderStyle", "solid").css("borderColor", Randomcolor);
                }
            }
        });
        return MatchList;
    }
    //生成标识
    Aimed(Element) {
        // console.log('---根据元素创建配置信息---');
        Element = Element[0]
        var that = this;
        var ElementLocalName = Element.localName;
        var result;
        // 如果有vue的id，则直接返回
        var vueId=that.getDataV(Element);
        if(vueId != null){
            result = ElementLocalName+"["+vueId+"]";
            if( $(result).length == 1){
                return result;
            }
        }
        // 如果有placeholder，则直接返回
        var placeholder=that.getPlaceholder(Element);
        if(placeholder != null){
            result = ElementLocalName+"["+placeholder+"]";
             if( $(result).length == 1){
                return result;
            }
        }
        // 如果有alt，则直接返回
        var alt=that.getAlt(Element);
        if(alt != null){
            result = ElementLocalName+"["+alt+"]";
             if( $(result).length == 1){
                return result;
            }
        }
        // 如果有src，切src后面无参数则直接返回
        var src=that.getSrc(Element);
        if(src != null){
            result = ElementLocalName+"["+src+"]";
             if( $(result).length == 1){
                return result;
            }
        }
 
        // 如果有name且只有一个，则直接返回
        var selectElement=that.getElementName(Element);
        if(selectElement != null){
            return selectElement;
        }
 
        var Symbol = ( this.getElementId(Element)  ? "#" :Element.className ? "." : false);
        if (!Symbol) {
            // console.log('上级');
            return that.Climb(Element.parentNode, ElementLocalName);
        } else {
            // console.log('本级');
            return that.Climb(Element, ElementLocalName);
        }
    }
    //判断元素id是否可信
    getElementId(element){
        var id=element.id;
        if(id){
            if(id.indexOf("exifviewer-img-")==-1){// 对抗类似vue这种无意义id
                if(id.length<40){// 对抗某些会自动变换id的验证码
                    return true;
                }
            }
        }
        return false;
    }
 
    //爬层级
    Climb(Element, ElementLocalName, Joint = '') {
        var ElementType = (this.getElementId(Element)  ? Element.id : Element.className ? Element.className.replace(/\s/g, ".") : false);
        var Symbol = (this.getElementId(Element) ? "#" : Element.className ? "." : false);
        var Address ;
        if (ElementType && ElementLocalName == Element.localName) {
            Address = ElementLocalName + Symbol + ElementType;
        } else {
            Address ="";
            if(Symbol!=false){
                Address=Address+Symbol;
            }
            if(ElementType!=false){
                Address=Address+ElementType;
            }
            Address= ' ' + ElementLocalName
        }
        if ($(Address).length == 1) {
 
            return Address + ' ' + Joint;
        } else {
            Joint = this.Climb($(Element).parent()[0], $(Element).parent()[0].localName, Address + ' ' + Joint)
            return Joint;
        }
    }
    // 获取vue的data-v-xxxx
    getDataV(element){
        var elementKeys=element.attributes;
        if(elementKeys==null){
            return null;
        }
        for(var i=0;i<elementKeys.length;i++){
            var key=elementKeys[i].name;
            if(key.indexOf("data-v-")!=-1){
                return key;
            }
        }
        return null;
    }
    // 获取placeholder="验证码"
    getPlaceholder(element){
        var elementKeys=element.attributes;
        if(elementKeys==null){
            return null;
        }
        for(var i=0;i<elementKeys.length;i++){
            var key=elementKeys[i].name.toLowerCase();
            if(key=="placeholder"&&elementKeys[i].value!=""){
                return elementKeys[i].name+"='"+elementKeys[i].value+"'";
            }
        }
        return null;
    }
    // 获取alt="kaptcha"
    getAlt(element){
        var elementKeys=element.attributes;
        if(elementKeys==null){
            return null;
        }
        for(var i=0;i<elementKeys.length;i++){
            var key=elementKeys[i].name.toLowerCase();
            if(key=="alt"){
                return elementKeys[i].name+"='"+elementKeys[i].value+"'";
            }
        }
        return null;
    }
 
    // 获取src="http://xxx.com"
    getSrc(element){
        var elementKeys = element.attributes;
        if(elementKeys == null){
            return null;
        }
        for(var i=0;i<elementKeys.length;i++){
            var key=elementKeys[i].name.toLowerCase();
            var value = elementKeys[i].value;
            if(key=="src" && value.indexOf("?") == -1){
                return elementKeys[i].name + "='" + value + "'";
            }
        }
        return null;
    }
 
    // 判断name是否只有一个
    getElementName(element){
        var elementName=element.name;
        if(elementName==null || elementName==""){
            return null;
        }
        var selectElement=element.localName + "[name='"+elementName+"']";
        if ($(selectElement).length == 1) {
            return selectElement;
        }
        return null;
    }
    // 操作webStorage 增加缓存，减少对服务端的请求
    setCapFoowwLocalStorage (key, value, ttl_ms) {
        var data = { value: value, expirse: new Date(ttl_ms).getTime() };
        sessionStorage.setItem(key, JSON.stringify(data));
    }
    getCapFoowwLocalStorage (key) {
        var data = JSON.parse(sessionStorage.getItem(key));
        if (data !== null) {
            if (data.expirse != null && data.expirse < new Date().getTime()) {
                sessionStorage.removeItem(key);
            } else {
                return data.value;
            }
        }
        return null;
    }
    delCapFoowwLocalStorage(key){
        window.sessionStorage.removeItem(key);
    }
 
}
//所有验证码img的对象数组
var writeResultIntervals=[];
 
//定时执行验证码绑定操作定时器
var writeResultInterval;
 
(function() {
    var Captcha = new CaptchaWrite();
    GM_registerMenuCommand('手动添加规则', function() {
        Captcha.PickUp();
    }, 'a');
    window.onload = function() {
        Captcha.Start();
    };
})();
