// ==UserScript==
// @name         知乎删除指定回答
// @namespace    gcud
// @version      20210430
// @description  删除问题指定回答,便于降低cpu和内存占用,也可以过滤不想看的回答
// @author       gcud
// @match        https://www.zhihu.com/question/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// ==/UserScript==
//检测间隔秒数
let Interval = 1;
 
/**
 * 以下为逻辑代码,不懂的不要修改
 */
/**
 * 修改配置
 * @param Key 键
 * @param Value 值
 */
function SetConfig(Key, Value) {
    GM_setValue("Config:" + Key, Value);
}
 
/**
 * 获取配置
 * @param Key 键
 * @param Default 默认值
 * @returns {*}
 */
function GetConfig(Key,Default) {
    Default=Default===undefined?null:Default;
   return GM_getValue("Config:" + Key, Default);
}
 
/**
 * 获取当前问题id
 * @returns {number}
 */
function GetQuestionId() {
    return parseInt(location.pathname.substring(10));
}
 
/**
 * 获取当前时间戳
 * @returns {number}
 */
function GetNowTime() {
    let Now = new Date();
    return parseInt(Now.getFullYear().toString() + (Now.getMonth() + 1).toString().padStart(2, "0") + Now.getDate().toString().padStart(2, "0"));
}
 
/**
 * 获取问题id列表
 * @returns {*}
 */
function GetQuestionIds() {
    return GM_getValue("QuestionIds", []);
}
 
/**
 * 修改问题id列表
 * @param QuestionIds
 */
function SetQuestionIds(QuestionIds) {
    GM_setValue("QuestionIds", QuestionIds);
}
 
/**
 * 添加问题id
 * @param QuestionId
 */
function AddQuestionId(QuestionId) {
    let Ids = GetQuestionIds();
    if (Ids.indexOf(QuestionId) === -1) {
        Ids.push(QuestionId);
    }
    SetQuestionIds(Ids);
}
 
/**
 * 设置指定问题的回答数据
 * @param QuestionId
 * @param Answers
 */
function SetAnswerData(QuestionId, Answers) {
    GM_setValue("Question:" + QuestionId, Answers);
}
 
/**
 * 获取指定问题的回答数据
 * @param QuestionId
 * @returns {*}
 */
function GetAnswerData(QuestionId) {
    return GM_getValue("Question:" + QuestionId, {Length: 0});
}
 
/**
 * 删除指定问题的回答数据
 * @param QuestionId
 */
function RemoveAnswerData(QuestionId) {
    GM_deleteValue("Question:" + QuestionId);
}
 
/**
 * 检测指定问题的指定回答是否被标记为删除
 * @param QuestionId
 * @param AnswerId
 * @returns {boolean}
 */
function AnswerIsRemove(QuestionId, AnswerId) {
    return GetAnswerData(QuestionId)[AnswerId] !== undefined;
}
 
/**
 * 清理过期的回答数据
 */
function ClearExpiredAnswer() {
    let QuestionIds = GetQuestionIds();
    if (QuestionIds.length > 0) {
        console.log(QuestionIds)
        QuestionIds.forEach(function (QuestionId, Index) {
            let AnswerData = GetAnswerData(QuestionId);
            console.log(AnswerData)
            if (AnswerData.Length > 0) {
                //检测每个回答id有效期
                for (let i in AnswerData) {
                    if (i !== "Length") {
                        if (AnswerData[i] < NowTime) {
                            delete AnswerData[i];
                            AnswerData.Length--;
                        }
                    }
                }
                SetAnswerData(QuestionId, AnswerData);
            } else {
                //删除回答数据
                RemoveAnswerData(QuestionId);
                //从id列表删除
                QuestionIds.splice(Index, 1);
            }
        });
        SetQuestionIds(QuestionIds);
    }
}
 
/**
 * 给指定问题添加回答标记
 * @param QuestionId
 * @param AnswerId
 */
function AddAnswer(QuestionId, AnswerId) {
    let QuestionAnswerData = GetAnswerData(QuestionId);
    QuestionAnswerData[AnswerId] = GetNowTime() + GetConfig("ExpireDay",7);
    QuestionAnswerData.Length++;
    SetAnswerData(QuestionId, QuestionAnswerData);
}
 
/**
 * 删除指定问题的指定回答标记
 * @param QuestionId
 * @param AnswerId
 */
function RemoveAnswer(QuestionId, AnswerId) {
    let QuestionAnswerData = GetAnswerData(QuestionId);
    delete QuestionAnswerData[AnswerId];
    QuestionAnswerData.Length--;
    SetAnswerData(QuestionId, QuestionAnswerData);
}
 
/**
 * 添加取消删除按钮
 * @param HolderElement
 * @param AnswerId
 */
function AddCancelRemoveButton(HolderElement, AnswerId) {
    let Button = document.createElement("button");
    Button.classList.add("gcudButton");
    Button.textContent = "取消删除";
    Button.setAttribute("AnswerId", AnswerId)
    Button.onclick = function () {
        RemoveAnswer(QuestionId, this.getAttribute("AnswerId"));
        this.parentNode.textContent = "此回答在刷新页面后恢复";
    };
    HolderElement.appendChild(Button);
}
 
/**
 * 从页面删除指定回答
 * @param HolderBlock
 * @param AnswerId
 */
function PageRemoveAnswer(HolderBlock, AnswerId) {
    HolderBlock.textContent = "此回答已被删除";
    //添加取消删除按钮
    AddCancelRemoveButton(HolderBlock, AnswerId);
}
 
/**
 * 增加被屏蔽回答数量
 */
function IncreaseBanNumber() {
    let Element=document.getElementById("gcudRemoveAnswerNumber");
    Element.textContent=(parseInt(Element.textContent)+1).toString();
}
 
/**
 *初始化界面
 */
function InitUI() {
    let Holder=document.getElementsByClassName("Question-sideColumn")[0];
    let Html=document.createElement("div");
    Html.id="gcudRemoveAnswer";
    let Title=document.createElement("p");
    Title.textContent="知乎删除指定回答";
    Html.append(Title);
    //禁止知乎盐选,抱歉我没查到盐选的英文
    let BanYanxuan=document.createElement("input");
    BanYanxuan.type="checkbox";
    BanYanxuan.value="true";
    BanYanxuan.title="会自动删除盐选的回答";
    BanYanxuan.checked=GetConfig("BanYanxuan",true);
    BanYanxuan.onclick=function(){
        SetConfig("BanYanxuan",BanYanxuan.checked);
    };
    Html.append(BanYanxuan);
    Html.append("屏蔽知乎盐选");
    //显示取消删除
    let DisplayCancelDelete=document.createElement("input");
    DisplayCancelDelete.type="checkbox";
    DisplayCancelDelete.value="true";
    DisplayCancelDelete.title="刷新后直接完全删除";
    DisplayCancelDelete.checked=GetConfig("DisplayCancelDelete",false);
    DisplayCancelDelete.onclick=function(){
        SetConfig("DisplayCancelDelete",DisplayCancelDelete.checked);
    };
    Html.append(DisplayCancelDelete);
    Html.append("不显示取消删除");
    //有效期调整
    let Expire=document.createElement("p");
    Expire.textContent="删除有效期";
    let ExpireValue=document.createElement("input");
    ExpireValue.type="number";
    ExpireValue.min=1;
    ExpireValue.classList.add("gcudInput");
    ExpireValue.value=GetConfig("ExpireDay",7);
    ExpireValue.onchange=function(){
        SetConfig("ExpireDay",parseInt(ExpireValue.value));
    }
    Expire.append(ExpireValue);
    Expire.append("天");
    Html.append(Expire);
    //取消删除按钮持续时间
    let CancelButtonDuration=document.createElement("p");
    CancelButtonDuration.textContent="取消删除按钮持续时间";
    let CancelButtonDurationValue=document.createElement("input");
    CancelButtonDurationValue.type="number";
    CancelButtonDurationValue.classList.add("gcudInput");
    CancelButtonDurationValue.min=1;
    CancelButtonDurationValue.value=GetConfig("CancelButtonDuration",30);
    CancelButtonDurationValue.onchange=function(){
        SetConfig("CancelButtonDuration",parseInt(CancelButtonDurationValue.value));
    }
    CancelButtonDuration.append(CancelButtonDurationValue);
    CancelButtonDuration.append("秒");
    Html.append(CancelButtonDuration);
    //屏蔽个数
    let BanNumberHolder=document.createElement("p");
    BanNumberHolder.textContent="已为你屏蔽";
    let BanNumber=document.createElement("span");
    BanNumber.id="gcudRemoveAnswerNumber";
    BanNumber.textContent="0";
    BanNumberHolder.append(BanNumber);
    BanNumberHolder.append("个回答");
    Html.append(BanNumberHolder);
    Holder.prepend(Html);
}
 
/**
 *初始化样式
 */
function InitCSS() {
    let Style = document.createElement("style");
    Style.textContent = `.gcudButton
    {
        border:1px solid black;
        position:absolute;
        right:10px;
        padding:5px
    }
    #gcudRemoveAnswer
    {
    background-color: white;
    padding: 10px;
    }
    .gcudInput{width:100px}`;
    document.body.appendChild(Style);
}
 
/**
 *运行
 */
function Run() {
    AddQuestionId(QuestionId);
    //启动时清理过期数据
    ClearExpiredAnswer();
    //添加CSS
    InitCSS();
    InitUI();
    setInterval(function () {
        let Items = document.querySelectorAll(".AnswerItem:not(.gcudProcessed)");
        if (Items.length > 0) {
            Items.forEach(function (Item) {
                let Data = JSON.parse(Item.getAttribute("data-zop"));
                let AnswerId = Data.itemId;
                let HolderBlock = Item.parentNode;
                if (AnswerIsRemove(QuestionId, AnswerId)) {
                    PageRemoveAnswer(HolderBlock, AnswerId);
                    //直接删除显示
                    if(GetConfig("DisplayCancelDelete",false)){
                        HolderBlock.remove();
                    }
                    IncreaseBanNumber();
                } else {
                    //屏蔽盐选
                    if(GetConfig("BanYanxuan",true)&&HolderBlock.querySelector(".KfeCollection-AnswerTopCard-Container")!==null){
                        HolderBlock.remove();
                        IncreaseBanNumber();
                    }
                    else{
                        let Button = document.createElement("button");
                        Button.classList.add("gcudButton");
                        Button.textContent = "删除";
                        Button.onclick = function () {
                            AddAnswer(QuestionId, AnswerId);
                            PageRemoveAnswer(HolderBlock, AnswerId);
                            //定时删除按钮
                            setInterval(function () {
                                HolderBlock.remove();
                            },GetConfig("CancelButtonDuration",30)*1000);
                        }
                        Button.setAttribute("AnswerId", AnswerId);
                        HolderBlock.prepend(Button);
                    }
                }
                //为回答添加已处理标记
                Item.classList.add("gcudProcessed");
            });
        }
    }, Interval * 1000);
}
 
let NowTime = GetNowTime();
let QuestionId = GetQuestionId();
Run();
