// ==UserScript==
// @name         万能验证码自动输入
// @namespace    https://www.wan7.xin/
// @version      1.3
// @description  在将来的时间里将会在后台默默的为你自动识别页面是否存在验证码并填入。对于一些书写不规整的验证码页面请手动配置规则。
// @author       刘老六
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
  constructor() {
    this.Tip = this.AddTip();
    if (GM_listValues().indexOf("set") == -1) {
      GM_setValue("set", {
        "ApiKey": ""
      });
      var WhetherHelp = confirm("万能验证码填入\n初始化完毕!\n在将来的时间里将会在后台默默的为你\n自动识别页面是否存在验证码并填入。\n对于一些书写不规整的验证码页面请手动配置规则。\n查看添加方法请点击确定。");
      if (WhetherHelp == true) {
        GM_openInTab('https://www.wan7.xin/captchawrite.html', 'active')
      }
    }
    Set = GM_getValue("set");
  }
  IdCard() {
    var that = this;
    var Card = '';
    $("body").children("div").each(function() {
      Card = Card + ($(this).attr("id") ? '#' + $(this).attr("id") : '') + ($(this).attr("class") ? '.' + $(this).attr("class").replace(/\s/g, ".") : '')
    });
    return md5(Card);
  }
  //查询余额
  Remaining() {
    var that = this;
    $.ajax({
      url: 'https://project.wan7.xin/CaptchaWrite/balance.php',
      type: 'get',
      dateType: 'json',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'key': Set.ApiKey
      },
      success: function(data) {
        that.Hint('当前余额：' + data.balance);
        // console.log(data.balance);
        // console.log("sucess");
      },
      error: function(data) {
        // console.log("error");
      }
    });
  }
  //设置ApiKey
  SetApiKey() {
    var that = this;
    var ApiKey = prompt("请输入您的ApiKey：\n验证api申请地址https://www.3023data.com/");
    if (ApiKey == null || ApiKey == "") {
      that.Hint('取消设置');
    } else {
      console.log(Set);
      GM_setValue("set", {
        "ApiKey": ApiKey
      });
      that.Hint('ApiKey设置完成，刷新页面生效。');
    }
    return;
  }
  //手动添加规则
  PickUp() {
    var that = this;
    var AddRule = {};
    var IdentifyResult = '';
    that.Hint('请对验证码图片点击右键！')
    $("img").each(function() {
      $(this).on("contextmenu", function() {
        that.Hint('等待识别')
        var img = that.Aimed($(this));
        IdentifyResult = that.Identify(img)
        console.log('PickUp_Img:' + img);
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
              AddRule['url'] = window.location.host + window.location.pathname;
              AddRule['title'] = document.title;
              AddRule['hot'] = window.location.host;
              AddRule['idcard'] = that.IdCard();
              that.WriteResults(AddRule['img'], AddRule['input'])
              that.Hint('完成')
              //移除事件
              $("input").each(function() {
                $(this).off("click");
              });
              //添加信息
              that.Query({
                "method": "CaptchaAdd",
                "rule": AddRule
              });
            });
          });
        } else {
          that.Hint('点击图片非验证码图片')
        }
      });
    });
  }
  //创建提示元素
  AddTip() {
    var TipHtml = $("<div></div>").text("Text.");
    TipHtml.css({
      "background-color": "rgba(211,211,211,0.86)",
      "display": "flex",
      "align-items": "center",
      "justify-content": "center",
      "position": "fixed",
      "color": "black",
      "top": "-2em",
      "height": "2em",
      "margin": "0em",
      "padding": "0em",
      "font-size": "1.2em",
      "width": "100%",
      "text-align": "center",
      "z-index": "999",
    })
    $("body").prepend(TipHtml);
    return TipHtml;
  }
  //展示提醒
  Hint(Content, Duration) {
    var that = this;
    that.Tip.stop(true, false).animate({
      top: '-2em'
    }, 300, function() {
      that.Tip.text(Content);
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
  Query(Json) {
    // console.log('请求信息' + JSON.stringify(Json));
    var that = this;
    var QueryRule = '';
    $.ajax({
      url: 'https://project.wan7.xin/CaptchaWrite/CaptchaWrite.php',
      type: 'post',
      dateType: 'json',
      cache: false,
      async: false,
      headers: {
        "Content-type": "application/json; charset=utf-8"
      },
      data: JSON.stringify(Json),
      success: function(data) {
        // console.log("sucess");
        // console.log(data);
        if (data.info) {
          that.Hint(data.info);
        }
        QueryRule = data;
      },
      error: function(data) {
        console.log("error");
        console.log(data);
      }
    });
    return QueryRule;
  }
  //开始识别
  Start() {
    //检查配置中是否有此网站
    var that = this;
    var Pathname = window.location.host + window.location.pathname;
    var Card = that.IdCard()
    var Rule = that.Query({
      "method": "CaptchaQuery",
      "Pathname": Pathname,
      "hot": window.location.host,
      "idcard": Card
    });
    // console.log(Card);
    // console.log(Pathname);
    // console.log(Rule);
    Rule.forEach(function(RuleItem) {
      // console.log(RuleItem);
      if (RuleItem.error == 'exist') {
        console.log('有规则执行规则' + Pathname);
        console.log(RuleItem.img, RuleItem.input);
        that.WriteResults(RuleItem.img, RuleItem.input);
      } else if (RuleItem.error == 'black') {
        console.log('黑名单' + Pathname);
        return
      } else if (RuleItem.error == 'not') {
        console.log('新网站开始自动化' + Pathname);
        var MatchList = that.AutoRules();
        if (MatchList.length) {
          console.log('检测到开始写入，并添加规则');
          for (var i in MatchList) {
            console.log(MatchList[i].img, MatchList[i].input);
            that.Query({
              "method": "CaptchaAdd",
              "rule": {
                "hot": window.location.host,
                "url": Pathname,
                "img": MatchList[i].img,
                "input": MatchList[i].input,
                "title": document.title,
                "idcard": Card
              }
            });
            that.WriteResults(MatchList[i].img, MatchList[i].input)
          }
        } else {
          console.log('添加到黑名单' + Pathname);
          that.Query({
            "method": "CaptchaBlack",
            "pathname": {
              "pathname": Pathname,
              "hot": window.location.host,
              "url": Pathname,
              "title": document.title,
              "idcard": Card
            }
          });
        }
      }
    })
  }
  //解析验证码得到结果####付费
  Identify_wan7(ImgBase) {
    console.log('Identify_wan7');
    var that = this;
    var Base = encodeURIComponent(ImgBase.toDataURL("image/png"));
    var Postinfo = 'type=1001&image=' + Base;
    var Results = '';
    var ErrorInfo = {
      "302311": "验证码类型无效",
      "302312": "图片格式无效",
      "302313": "图片大小超过30KB",
      "302314": "识别失败",
      "302303": "余额不足",
      "302302": "无效的密钥",
      "302305": "接口维护请稍后重试"
    }
    $.ajax({
      url: 'https://project.wan7.xin/CaptchaWrite/captcha.php',
      type: 'post',
      dateType: 'json',
      cache: false,
      async: false,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'key': Set.ApiKey
      },
      data: Postinfo,
      success: function(data) {
        // console.log(data);
        // console.log("sucess");
        if (data.code == 0) {
          Results = data.data.captcha;
        } else {
          that.Hint(ErrorInfo[data.code] + data.message, 10000);
          return;
        }
      },
      error: function(data) {
        that.Hint('ajax请求错误', 10000);
      }
    });
    return Results;
  }
  //解析免费
  Identify_Baidu(ImgBase) {
    console.log('Identify_Baidu');
    var that = this;
    var Base = ImgBase.toDataURL("image/png").replace(/.*,/, "");
    var Results = '';
    $.ajax({
      url: 'https://project.wan7.xin/CaptchaWrite/baidu.php',
      type: 'post',
      dateType: 'json',
      cache: false,
      async: false,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: Base,
      success: function(IdentifyResults) {
        // console.log(data);
        // console.log("sucess");
        if (IdentifyResults['error_msg']) {
          that.Hint('识别请求发生错误： ' + IdentifyResults['error_msg'], 10000);
        } else {
          Results = IdentifyResults['words_result'][0]['words'].replace(/\s/ig, '');
          if (Results.length < 4) {
            that.Hint('免费接口只能识别简单验证码，如需高精度识别请购买Api，价格：0.01元/次。或点击验证码从新识别。', 5000)
          }
        }
        return
      },
      error: function(data) {
        that.Hint('ajax请求错误', 10000);
      }
    });
    return Results;
  }
  //识别操作
  Identify(img) {
    var that = this;
    var Base = that.ConversionBase(img)
    if (Base.width) {
      if (Set.ApiKey) {
        return that.Identify_wan7(Base);
      } else {
        return that.Identify_Baidu(Base);
      }
    } else {
      console.log('验证码没有加载加载后自动识别');
    }
  }
  //根据配置识别写入
  WriteResults(img, input) {
    var that = this;
    //创建一个触发操作
    document.querySelector(img).onload = function() {
      that.WriteResults(img, input)
    }
    this.Write(this.Identify(img), input)
  }
  //写入操作
  Write(ResultsImg, WriteInput) {
    var that = this;
    var WriteInput = document.querySelector(WriteInput);
    WriteInput.value = ResultsImg;
  }
  //转换图片
  ConversionBase(img) {
    var img = document.querySelector(img);
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
      // console.log($(this));
      // console.log($(this).prev());
      // console.log($(this).next());
      var Randomcolor = "red";
      //console.log(Randomcolor);
      if ($(this).siblings("input").length == 1) {
        // console.log('内部' + that.Aimed($(this)));
        MatchList.push({
          "img": that.Aimed($(this)),
          "input": that.Aimed($(this).siblings("input"))
        })
        $(this).css("borderStyle", "solid").css("borderColor", Randomcolor).css("border-width", "4px");
        $(this).siblings("input").css("borderStyle", "solid").css("borderColor", Randomcolor);
      } else {
        if ($(this).prev().children("input").length == 1) {
          // console.log('哥哥有姓梁的媳妇');
          MatchList.push({
            "img": that.Aimed($(this)),
            "input": that.Aimed($(this).prev().children("input"))
          })
          $(this).css("borderStyle", "solid").css("borderColor", Randomcolor).css("border-width", "4px");
          $(this).prev().children("input").css("borderStyle", "solid").css("borderColor", Randomcolor);
        }
        if ($(this).next().children("input").length == 1) {
          // console.log('弟弟有姓梁的媳妇');
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
    var Symbol = (Element.id ? "#" : Element.className ? "." : false);
    if (!Symbol) {
      // console.log('上级');
      return that.Climb(Element.parentNode, ElementLocalName);
    } else {
      // console.log('本级');
      return that.Climb(Element, ElementLocalName);
    }
  }
  //爬层级
  Climb(Element, ElementLocalName, Joint = '') {
    // console.log('上次过来值' + Joint);
    var ElementType = (Element.id ? Element.id : Element.className ? Element.className.replace(/\s/g, ".") : false);
    var Symbol = (Element.id ? "#" : Element.className ? "." : false);
    if (ElementType && ElementLocalName == Element.localName) {
      var Address = ElementLocalName + Symbol + ElementType;
    } else {
      var Address = Symbol + ElementType + ' ' + ElementLocalName;
    }
    // console.log('我叫' + Address);
    // console.log('叫这个名字的有' + $(Address).length);
    if ($(Address).length == 1) {
      // console.log('只有一个' + Address);
      // console.log('最后一次拼接' + Address + ' ' + Joint);
      return Address + ' ' + Joint;
      //我的名字唯一
    } else {
      // console.log(Element);
      // console.log('这是我的父辈' + $(Element).parent()[0].className);
      //让我的父辈去一辈一辈问我的老祖宗是谁
      var Joint = this.Climb($(Element).parent()[0], $(Element).parent()[0].localName, Address + ' ' + Joint)
      return Joint;
    }
  }
}
 
(function() {
  var Captcha = new CaptchaWrite();
  GM_registerMenuCommand('设置ApiKey', function() {
    Captcha.SetApiKey();
  }, 's')
  GM_registerMenuCommand('手动添加规则', function() {
    Captcha.PickUp();
  }, 'a');
  if (GM_getValue("set").ApiKey) {
    GM_registerMenuCommand('查询余额', function() {
      Captcha.Remaining();
    }, 'm');
  }
  window.onload = function() {
    Captcha.Start();
  };
})();
