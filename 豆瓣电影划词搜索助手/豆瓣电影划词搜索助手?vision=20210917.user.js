// ==UserScript==
// @name         豆瓣电影划词搜索助手
// @version      0.0.7
// @description  通过滑动选中视频名词搜索豆瓣信息。脚本根据@Johnny Li[网页搜索助手]修改
// @icon         https://img3.doubanio.com/f/movie/d59b2715fdea4968a450ee5f6c95c7d7a2030065/pics/movie/apple-touch-icon.png
// @author       lenrene
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      cdn.jsdelivr.net
// @connect      cdnjs.cloudflare.com
// @connect      movie.querydata.org
// @connect      douban.com
// @require      https://cdn.jsdelivr.net/npm/jquery@2.2.3/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery.md5@1.0.2/index.min.js
// @require      https://cdn.jsdelivr.net/gh/zyufstudio/jQuery@3a09ff54b33fc2ae489b5083174698b3fa83f4a7/jPopBox/dist/jPopBox.min.js
// @namespace https://github.com/zyufstudio/TM/tree/master/webSearchlate
// ==/UserScript==
 
(function () {
    'use strict';
 
    /**
    * 配置参数
    */
    const options = {
        defaultsearchengine: "db",   //默认搜索引擎
        searchPattern: "automatic", // 搜索模式
        selectPattern: "select", // 划词模式
    };
 
 
    const logger = {
        debug: console.debug,
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error
    }
 
 
    /**
     * 字符串模板格式化
     * @param {string} formatStr - 字符串模板
     * @returns {string} 格式化后的字符串
     * @example
     * StringFormat("ab{0}c{1}ed",1,"q")  output "ab1cqed"
     */
    function StringFormat(formatStr) {
        let args = arguments;
        return formatStr.replace(/\{(\d+)\}/g, function (m, i) {
            i = parseInt(i);
            return args[i + 1];
        });
    }
 
    /**
     * 日期格式化
     * @param {Date} date - 日期
     * @param {string} formatStr - 格式化模板
     * @returns {string} 格式化日期后的字符串
     * @example
     * DateFormat(new Date(),"yyyy-MM-dd")  output "2020-03-23"
     * @example
     * DateFormat(new Date(),"yyyy/MM/dd hh:mm:ss")  output "2020/03/23 10:30:05"
     */
    function DateFormat(date, formatStr) {
        let o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(formatStr)) {
            formatStr = formatStr.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(formatStr)) {
                formatStr = formatStr.replace(
                    RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return formatStr;
    }
 
    /**
     * 清除dom元素默认事件
     * @param {object} e - dom元素
     */
    function ClearBubble(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }
 
    /**
     * 获取配置参数
     */
    function GetSettingOptions() {
        let optionsJson = GM_getValue("db-search-options") || "";
        if (optionsJson != "") {
            let optionsData = JSON.parse(optionsJson);
            for (let key in options) {
                if (options.hasOwnProperty(key) && optionsData.hasOwnProperty(key)) {
                    options[key] = optionsData[key];
                }
            }
        }
        return options;
    }
 
    /**
     * 设置配置参数
     */
    function SetSettingOptions() {
        let optionsJson = JSON.stringify(options);
        GM_setValue("db-search-options", optionsJson);
    }
 
    /**
     * 人员格式化
     * @param {Array} personList - 人员数组
     * @param {Number} len - 需要的数量
     * @returns {String} 格式化后的字符串
     * @example
     * fmtDbPerson([{},{},{}],2) output "a/b"
     */
    function fmtDbPerson(personList, len) {
        if (personList && personList.length > 0) {
            if (len && personList.length > len) {
                personList = personList.slice(0, len);
            }
            let nameArr = [];
            personList.forEach((item) => {
                if (item.hasOwnProperty('data')) { // db2使用
                    nameArr.push(item.data[0].name);
                } else {
                    nameArr.push(item.name.split(' ')[0]); // db使用
                }
            })
            return nameArr.join('/');
        }
        return '';
    }
 
    /**
     * 解析视频列表 dom 元素
     * @param {Document} htmlDoc - 视频列表dom
     * @param {String} selector - 选择器
     * @returns {[VideoInfo]} 视频列表数组
     * @example
     * fmtDbPerson(document.getElementById('a'),'li') output [{},{},...]
     */
    function parseVideoListDom(htmlDoc, selector) {
        let videoList = [];
        if (htmlDoc) {
            let liDoc = $(htmlDoc).find(selector);
            liDoc.each((index, item) => {
                let titleADom = $(item).find('.title a');
                let title = titleADom.html() || '';
                let onclickStr = titleADom.attr("onclick");
                let id = 0;
                if (onclickStr) {
                    id = onclickStr.split(',')[4].replace(/[^0-9]/ig, '');
                }
                let image = $(item).find('img').attr("src");
                let cast = $(item).find('.subject-cast').html() || '';
                let videoInfo = {
                    subjectId: id,
                    image: 'https://images.weserv.nl/?url=' + encodeURIComponent(image),
                    score: $(item).find('.rating_nums').html() || '',
                    url: 'https://movie.douban.com/subject/' + id,
                    title,
                    description: $(item).find('p').html() || '',
                    cast: cast.replace(/原名:(.*?)\//g, ''),
                    genre: $(item).find('.title span').html() || '',
                }
                videoList.push(videoInfo);
            });
        }
        return videoList;
    }
 
    // 豆瓣搜索引擎1 爬虫模式
    const doubanSearch = {
        code: "db",
        codeText: "豆瓣",
        SearchVideoList: function (title) {
            return new Promise((resolve, reject) => {
                if (!title) {
                    resolve([]);
                }
 
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://www.douban.com/search?cat=1002&q=${encodeURIComponent(title)}`,
                    onload: function (response) {
                        let videoList = [];
                        if (response.status == 200) {
                            let responseText = response.responseText;
                            let parser = new DOMParser();
                            let htmlDoc = parser.parseFromString(responseText, "text/html");
                            videoList = parseVideoListDom(htmlDoc, '.result-list .result');
                        } else {
                            logger.warn(response.statusText);
                        }
 
                        resolve(videoList);
                    }
                });
            })
        },
        SearchVideoInfo: function (subjectId) {
            return new Promise((resolve, reject) => {
                if (!subjectId) {
                    resolve(null);
                }
 
                let url = "https://movie.douban.com/subject/" + subjectId;
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: function (response) {
                        if (response.status == 200) {
                            let responseText = response.responseText;
                            let doubanInfo = {};
                            let parser = new DOMParser();
                            let htmlDoc = parser.parseFromString(responseText, "text/html");
 
                            if (htmlDoc) {
                                let scriptDocs = htmlDoc.getElementsByTagName('script');
                                if (scriptDocs) {
                                    let scriptList = Array.prototype.slice.call(scriptDocs);
                                    scriptList.forEach((item) => {
                                        if (item.type == 'application/ld+json' && item.innerText) {
                                            try {
                                                doubanInfo = JSON.parse(item.innerText.replace(/\r\n/g, '').replace(/\n/g, ''));
 
                                                let videoInfo = {
                                                    title: doubanInfo.name,
                                                    image: 'https://images.weserv.nl/?url=' + encodeURIComponent(doubanInfo.image),// 解决图片跨域  感谢这个接口
                                                    url: 'https://movie.douban.com' + doubanInfo.url,
                                                    description: doubanInfo.description,
                                                    director: fmtDbPerson(doubanInfo.director, 2),
                                                    actor: fmtDbPerson(doubanInfo.actor, 6),
                                                    score: doubanInfo.aggregateRating.ratingValue,
                                                    genre: doubanInfo.genre.join('/'),
                                                    time: doubanInfo.datePublished,
                                                }
                                                resolve(videoInfo);
                                            } catch (e) {
                                                console.log('解析失败', item.innerText, e)
                                            }
                                        }
                                    })
                                }
                            }
                        } else {
                            logger.warn(response.statusText);
                        }
 
                        resolve(null);
                    }
                });
            });
        },
    };
 
    //豆瓣搜索引擎2 使用api
    const doubanSearchByApi = {
        code: "db2",
        codeText: "豆瓣2",
        SearchVideoList: function (title) {
            return new Promise((resolve, reject) => {
                if (!title) {
                    return resolve([]);
                }
 
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://www.douban.com/j/search?q=${encodeURIComponent(title)}&cat=1002`,// 官网的搜索接口
                    "headers": {
                        "user-agent": 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
                    },
                    onload: function (response) {
                        let videoList = [];
                        if (response.status == 200) {
                            let responseText = response.responseText;
                            let fmtText = responseText.replace(/\r\n/g, '').replace(/\n/g, '').replace(/\\/g, '');
                            let match = fmtText.match(/{"items":(.*?),"total":(\d+),"limit":(\d+),"more":(.*?)}/);
                            if (match && match[1]) {
                                let parser = new DOMParser();
                                let htmlDoc = parser.parseFromString(match[1], "text/html");
                                videoList = parseVideoListDom(htmlDoc, '.result');
                            }
                        } else {
                            logger.warn(response.statusText);
                        }
                        resolve(videoList);
                    }
                });
            })
        },
        SearchVideoInfo: function (subjectId) {
            return new Promise((resolve, reject) => {
                if (!subjectId) {
                    resolve(null);
                }
 
                let url = "https://movie.querydata.org/api?id=" + subjectId; // api 来自 https://github.com/iiiiiii1/douban-imdb-api
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: function (response) {
                        if (response.status == 200) {
                            let doubanInfo = JSON.parse(response.responseText);
                            if (doubanInfo) {
                                let data = doubanInfo.data[0]
                                let videoInfo = {
                                    title: data.name,
                                    image: data.poster,
                                    url: 'https://movie.douban.com/subject/' + doubanInfo.doubanId,
                                    description: data.description,
                                    director: fmtDbPerson(doubanInfo.director, 2),
                                    actor: fmtDbPerson(doubanInfo.actor, 6),
                                    score: doubanInfo.doubanRating,
                                    ibmScore: doubanInfo.imdbRating,
                                    genre: data.genre,
                                    time: DateFormat(new Date(doubanInfo.dateReleased), "yyyy-MM-dd"),
                                }
                                resolve(videoInfo);
                            }
                        } else {
                            logger.warn(response.statusText);
                        }
                        resolve(null);
                    }
                });
            });
        },
    };
 
    const Search = {
        searchEngineList: {},         //搜索引擎实例列表
        searchEngine: "",            //当前搜索引擎。 db:豆瓣
        searchEngineObj: {},          //当前搜索引擎实例
        searchType: "word",           //搜索类型。word(划词搜索)/text(输入文本搜索)
        searchText: "",               //被搜索内容
        searchVideoList: [],            //当前搜索视频列表
        searchVideoInfo: null,          //当前搜索视频内容
        Execute: function (h_onloadfn) {
            this.ResetSearchResult();
            let title = this.searchText;
            this.searchEngineObj.SearchVideoList(title).then((videoList) => {
                this.searchVideoList = videoList;
                if (options.searchPattern == 'automatic') {
                    if (videoList && videoList.length > 0) {
                        this.searchEngineObj.SearchVideoInfo(videoList[0].subjectId).then((result) => {
                            this.searchVideoInfo = result;
                            h_onloadfn();
                        });
                    } else {
                        h_onloadfn();
                    }
                } else if (options.searchPattern == 'manual') {
                    h_onloadfn();
                }
            });
        },
        UpdateVideoInfo: function (subjectId, h_onloadfn) {
            this.searchVideoInfo = null;
 
            this.searchEngineObj.SearchVideoInfo(subjectId).then((result) => {
                this.searchVideoInfo = result;
                h_onloadfn();
            })
        },
        Update: function () {
            this.ResetSearchResult();
            this.searchEngineObj = this.searchEngineList[this.searchEngine];
        },
        Clear: function () {
            this.searchEngine = "";
            this.searchText = "";
            this.searchVideoList = [];
            this.searchVideoInfo = null;
        },
        ResetSearchResult: function () {
            this.searchVideoInfo = null;
            this.searchVideoList = [];
        },
        //注册搜索引擎接口并执行搜索引擎的初始化接口
        RegisterEngine: function () {
            /**
             * 搜索引擎必须提供以下接口
                code:"",                    //代号
                codeText:"",                //代号描述
                SearchVideoList: function (title) {},     //返回视频列表
                SearchVideoInfo: function (subjectId) {},     //返回视频信息
                init:function(){},          //可选，初始化接口，在脚本创建时立即执行
             */
            const searchEngineListObj = {};
            searchEngineListObj[doubanSearch.code] = doubanSearch;
            searchEngineListObj[doubanSearchByApi.code] = doubanSearchByApi;
 
            this.searchEngineList = searchEngineListObj;
            for (let key in this.searchEngineList) {
                if (this.searchEngineList.hasOwnProperty(key) && this.searchEngineList[key].hasOwnProperty("init")) {
                    this.searchEngineList[key].init();
                }
            }
        }
    };
 
    //面板
    let Panel = {
        popBoxEl: {},
        randomCode: "",
        Create: function (title, placement, isShowArrow, content, shownFn) {
            let self = this;
            $(self.popBoxEl).jPopBox({
                title: title,
                className: 'JPopBox-tip-white',
                placement: placement,
                trigger: 'none',
                isTipHover: true,
                isShowArrow: isShowArrow,
                content: function () {
                    return StringFormat('<div id="panelBody{0}">{1}</div>', self.randomCode, content);
                }
            });
            $(self.popBoxEl).on("shown.jPopBox", function () {
                let $panel = $("div.JPopBox-tip-white");
                typeof shownFn === 'function' && shownFn($panel);
            });
            $(self.popBoxEl).jPopBox('show');
        },
        Update: function (Fn) {
            let $panel = $("div.JPopBox-tip-white");
            Fn($panel);
        },
        Destroy: function () {
            $(this.popBoxEl).jPopBox("destroy");
        },
        CreateStyle: function () {
            let s = "";
            s += StringFormat("#panelBody{0}>div input,#panelBody{0}>div select{padding: 3px; margin: 0; background: #fff; font-size: 14px; border: 1px solid #a9a9a9; color:black;width: auto;min-height: auto; }", this.randomCode);
            s += StringFormat("#panelBody{0}>div:first-child{padding-bottom: 5px;height:30px}", this.randomCode);
            s += StringFormat("#panelBody{0}>div:last-child hr{border: 1px inset #eeeeee;background: none;height: 0px;margin: 0px;}", this.randomCode);
            return s;
        }
    };
 
    //划词搜索面板
    const WordSearchPanel = {
        Create: function (popBoxEl, randomCode) {
            let self = this;
            let searchEngineOptionsHtml = "";
            for (let k in Search.searchEngineList) {
                if (Search.searchEngineList.hasOwnProperty(k)) {
                    let v = Search.searchEngineList[k].codeText;
                    let selectOption = "";
                    if (Search.searchEngine == k) {
                        selectOption = 'selected="selected"';
                    }
                    searchEngineOptionsHtml += StringFormat('<option value="{0}" {2}>{1}</option>', k, v, selectOption);
                }
            }
            let wordSearchPanelHtml = '';
            let headHtml = StringFormat('<div style="display: inline;">引擎：<select>{1}</select></div><div id="show_search_list_btn" style="margin-left: 10px; display: inline; color: #999; font-size: 10px;">展示搜索列表</div>', randomCode, searchEngineOptionsHtml);
            wordSearchPanelHtml += headHtml;
            wordSearchPanelHtml += '<div class="db_search_content">';
            if (options.searchPattern == 'automatic') {
                wordSearchPanelHtml += self.GetVideoInfoHtml(randomCode);
            } else if (options.searchPattern == 'manual') {
                wordSearchPanelHtml += self.GetVideoListHtml(randomCode);
            }
            wordSearchPanelHtml += '</div>';
 
            Panel.popBoxEl = popBoxEl;
            Panel.randomCode = randomCode;
            Panel.Create("", "auto bottom", false, wordSearchPanelHtml, function ($panel) {
                //搜索引擎
                $panel.find(StringFormat("#panelBody{0} div:eq(0) select:eq(0)", randomCode)).change(function (e) {
                    Search.searchEngine = $(this).find("option:selected").val();
                    self.Loading($panel, randomCode);
                    Search.Update();
                    Search.Execute(function () {
                        if (options.searchPattern == 'automatic') {
                            self.Update(randomCode);
                        } else if (options.searchPattern == 'manual') {
                            self.ShowSearchList(randomCode);
                        }
                    });
                });
 
                // 搜索列表
                $panel.find(StringFormat("#panelBody{0} #show_search_list_btn", randomCode)).click(function (e) {
                    self.ShowSearchList(randomCode);
                });
 
                if (options.searchPattern == 'manual') {
                    // 列表点击事件
                    $panel.find(StringFormat("#panelBody{0} li", randomCode)).click(function () {
                        let subjectId = $(this).attr('data-id');
                        self.Loading($panel, randomCode);
                        Search.UpdateVideoInfo(subjectId, function () {
                            self.Update(randomCode);
                        });
                    });
                }
 
                if (options.searchPattern == 'manual' || !Search.searchVideoList || Search.searchVideoList.length == 0) {
                    $(StringFormat("#panelBody{0} #show_search_list_btn", randomCode)).hide();
                }
 
            });
        },
        Update: function (randomCode) {
            let self = this;
            Panel.Update(function ($panel) {
                let html = self.GetVideoInfoHtml(randomCode);
                $panel.find(StringFormat("#panelBody{0} .db_search_content", randomCode)).html("").html(html);
            });
            if (Search.searchVideoList && Search.searchVideoList.length > 0) {
                $(StringFormat("#panelBody{0} #show_search_list_btn", randomCode)).css("display", "inline");
            }
        },
        ShowSearchList: function (randomCode) {
            let self = this;
 
            let html = self.GetVideoListHtml();
            let $panel = $("div.JPopBox-tip-white");
            $panel.find(StringFormat("#panelBody{0} .db_search_content", randomCode)).html("").html(html);
 
            $panel.find(StringFormat("#panelBody{0} li", randomCode)).click(function () {
                let subjectId = $(this).attr('data-id');
                self.Loading($panel, randomCode);
                Search.UpdateVideoInfo(subjectId, function () {
                    self.Update(randomCode);
                });
            });
            $(StringFormat("#panelBody{0} #show_search_list_btn", randomCode)).hide();
        },
        GetVideoListHtml: function (randomCode) {
            let htmlArr = [];
            let videoList = Search.searchVideoList;
            if (videoList && videoList.length > 0) {
                let itemTemplate = `
                    <li class="db_search_video_list" style="margin-top: 5px;height: 70px;position: relative;" data-id="{4}">
                        <div style="float: left;margin-right:5px"><img style="width: 48px;height: 68px;" src="{1}" onerror="javascript:this.src='https://img3.doubanio.com/f/movie/b6dc761f5e4cf04032faa969826986efbecd54bb/pics/movie/movie_default_small.png'" ></div>
                        <div>
                            <div style="font-size: 18px;font-weight: bold;">{7} {2}</div>
                            <div style="position: absolute; right: 5px; top: 0;font-size: 25px">{3}</div>
                            <div>{6}</div>
                            <div style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; word-break: break-all;">{5}</div>
                        </div>
                    </li>`;
 
                htmlArr.push('<ul style="overflow: auto; height: 200px;">');
                videoList.forEach((item) => {
                    let videoItem = StringFormat(itemTemplate, randomCode, item.image, item.title, item.score, item.subjectId, item.description, item.cast, item.genre);
                    htmlArr.push(videoItem);
                })
                htmlArr.push('</ul>');
            } else {
                htmlArr.push('<div style="margin-top: 5px;">未搜索到内容</div>');
            }
 
            return htmlArr.join('');
        },
        GetVideoInfoHtml: function (randomCode) {
            let htmlArr = [];
            let videoInfo = Search.searchVideoInfo;
            if (videoInfo) {
                let templateArr = [];
                templateArr.push(`
                            <div class='video_info'>
                                <div style="position: absolute;top: 5px;right: 5px;"><span style="font-size: 30px">{5}</span></div>
                                <div style='font-size: 18px;font-weight: bold;margin-top: 5px;'><a href='{3}' target='_blank' style='color: #494949;'>{1}</a></div>
                                <div>
                                    <div style="float: left;margin-right: 5px;">
                                        <img style="width: 120px;height: 168px;" src="{2}" onerror="javascript:this.src='https://img3.doubanio.com/f/movie/b6dc761f5e4cf04032faa969826986efbecd54bb/pics/movie/movie_default_small.png'"/>
                                    </div>`);
                if (videoInfo.director) {
                    templateArr.push('<div><span style="color: #666666;">导演</span>：{9}</div>');
                }
                if (videoInfo.actor) {
                    templateArr.push('<div><span style="color: #666666;">主演</span>：{8}</div>');
                }
                if (videoInfo.genre) {
                    templateArr.push('<div><span style="color: #666666;">类型</span>：{7}</div>');
                }
                if (videoInfo.time) {
                    templateArr.push('<div><span style="color: #666666;">时间</span>：{6}</div>');
                }
                if (videoInfo.description) {
                    templateArr.push('<div><span style="color: #666666;">简介</span>：{4}</div>');
                }
                templateArr.push(`</div>
                            </div>`)
 
                htmlArr.push(StringFormat(templateArr.join(''), randomCode,
                    videoInfo.title, videoInfo.image, videoInfo.url, videoInfo.description,
                    videoInfo.score, videoInfo.time, videoInfo.genre, videoInfo.actor, videoInfo.director));
            } else {
                htmlArr.push(`<div style="margin-top: 5px;">未搜索到内容</div></div>`);
            }
 
            return htmlArr.join('');
        },
        Loading: function (panel, randomCode) {
            panel.find(StringFormat("#panelBody{0} .db_search_content", randomCode)).html("").html('<div style="border: 5px solid #f3f3f3; border-radius: 50%; border-top: 5px solid #3498db; width: 30px; height: 30px; animation: db_search_turn 2s linear infinite; margin: 20px; margin-left: 45%;"></div>');
        }
    };
 
    //设置面板
    let SettingPanel = {
        config: [{ title: "", name: "", item: [{ code: "", text: "" }] }],
        Create: function (popBoxEl, randomCode) {
            let self = this;
            let settingHtml = [];
            this.InitConfig();
            settingHtml.push('<div style="padding-left: 15px;display: inline-block;">');
            for (let index = 0; index < this.config.length; index++) {
                let configItem = this.config[index];
                settingHtml.push('<div style="padding-bottom: 30px; max-width: 600px;">');
                settingHtml.push(StringFormat('<div style="font-size: 14px; padding-bottom: 3px;">{0}</div>', configItem.title));
                for (let itemIndex = 0; itemIndex < configItem.item.length; itemIndex++) {
                    let itemObj = configItem.item[itemIndex];
                    settingHtml.push(StringFormat('<div style="padding-bottom: 0px; margin-left: 10px;"><label style="font-size: 14px; cursor: pointer;"><input type="radio" name="search{3}{0}" style="cursor: pointer;" value="{1}">{2}</label></div>', randomCode, itemObj.code, itemObj.text, configItem.name));
                }
                settingHtml.push('</div>');
            }
 
            settingHtml.push('<div>');
            settingHtml.push(StringFormat('<button id="saveBtn{0}">保存</button>', randomCode));
            settingHtml.push(StringFormat('<span id="saveStatus{0}" style="display:none;margin-left:10px;background-color: #fff1a8;padding: 3px;">设置已保存。</span>', randomCode));
            settingHtml.push('</div>');
            settingHtml.push('</div>');
 
            let settingHtmlStr = settingHtml.join("");
            Panel.popBoxEl = popBoxEl;
            Panel.randomCode = randomCode;
            Panel.Create("豆瓣电影划词搜索助手设置", "auto bottom", false, settingHtmlStr, function ($panel) {
                $panel.css({
                    position: "fixed",
                    top: "20px"
                });
                self.Update(randomCode);
                //保存设置
                $panel.find(StringFormat("#panelBody{0} #saveBtn{0}", randomCode)).click(function (e) {
                    let defaultSearchEngine = $panel.find(StringFormat("#panelBody{0} input[name='searchEngine{0}']:checked", randomCode)).val();
                    options.defaultsearchengine = defaultSearchEngine;
                    let searchPattern = $panel.find(StringFormat("#panelBody{0} input[name='searchPattern{0}']:checked", randomCode)).val();
                    options.searchPattern = searchPattern;
                    let selectPattern = $panel.find(StringFormat("#panelBody{0} input[name='searchSelect{0}']:checked", randomCode)).val();
                    options.selectPattern = selectPattern;
                    SetSettingOptions();
                    $panel.find(StringFormat("#panelBody{0} #saveStatus{0}", randomCode)).fadeIn(function () {
                        setTimeout(function () {
                            $panel.find(StringFormat("#panelBody{0} #saveStatus{0}", randomCode)).fadeOut();
                        }, 1500);
                    });
                });
            });
        },
        Update: function (randomCode) {
            GetSettingOptions();
            Panel.Update(function ($panel) {
                $panel.find(StringFormat("#panelBody{0} input[name='searchEngine{0}'][value='{1}']", randomCode, options.defaultsearchengine)).prop("checked", true);
                $panel.find(StringFormat("#panelBody{0} input[name='searchPattern{0}'][value='{1}']", randomCode, options.searchPattern)).prop("checked", true);
                $panel.find(StringFormat("#panelBody{0} input[name='searchSelect{0}'][value='{1}']", randomCode, options.selectPattern)).prop("checked", true);
            });
        },
        InitConfig: function () {
            this.config = [];
            let configObj = { title: "", name: "", item: [{ code: "", text: "" }] };
            configObj.title = "默认搜索引擎：";
            configObj.name = "Engine";
            configObj.item = [];
            for (let k in Search.searchEngineList) {
                if (Search.searchEngineList.hasOwnProperty(k)) {
                    let v = Search.searchEngineList[k].codeText;
                    configObj.item.push({ code: k, text: v });
                }
            }
            this.config.push(configObj);
 
            let configObj2 = { title: "搜索模式：", name: "Pattern", item: [{ code: "automatic", text: "自动" }, { code: "manual", text: "手动" }] };
            this.config.push(configObj2);
            let configObj3 = { title: "划词模式：", name: "Select", item: [{ code: "select", text: "划词" }, { code: "hold", text: "Ctrl + 划词" }] };
            this.config.push(configObj3);
        }
    };
 
    //主程序
    let WebSearchlate = function () {
        const searchIconBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQCAIAAABoJHXvAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyQjkwRDlGOTgyM0YxMUUyOTYyNEE4NkVDQjBDRTBENSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyQjkwRDlGQTgyM0YxMUUyOTYyNEE4NkVDQjBDRTBENSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjJCOTBEOUY3ODIzRjExRTI5NjI0QTg2RUNCMENFMEQ1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjJCOTBEOUY4ODIzRjExRTI5NjI0QTg2RUNCMENFMEQ1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+EQTxdwAAEetJREFUeNrsXQt4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";
        const $doc = $(document);
        const $body = $("html body");
        const $head = $("html head");
        let randomCode = "yyMM000000";    //属性随机码，年月加六位随机码。用于元素属性后缀，以防止属性名称重复。
        const createHtml = function () {
            const wordSearchIconHtml = StringFormat('<div id="wordSearch{0}" class="wordSearch{0}"><div class="wordSearchIcon{0}"></div></div>', randomCode, searchIconBase64);
            $body.append(StringFormat('<div id="webSearch{0}">', randomCode) + wordSearchIconHtml + '</div>');
        };
        const createStyle = function () {
            //尽可能避开csp认证
            GM_xmlhttpRequest({
                method: "get",
                url: "https://cdn.jsdelivr.net/gh/zyufstudio/jQuery@master/jPopBox/dist/jPopBox.min.css",
                onload: function (r) {
                    GM_addStyle(r.responseText + ".JPopBox-tip-white{width: 482px;max-width: 550px;min-width: 450px;}");
                }
            });
            let s = "@keyframes db_search_turn{0%{transform:rotate(0deg)}25%{transform:rotate(90deg)}50%{transform:rotate(180deg)}75%{transform:rotate(270deg)}100%{transform:rotate(360deg)}}";
            s += StringFormat(".wordSearch{0}{background-color: rgb(245, 245, 245);box-sizing: content-box;cursor: pointer;z-index: 2147483647;border-width: 1px;border-style: solid;border-color: rgb(220, 220, 220);border-image: initial;border-radius: 5px;padding: 0.5px;position: absolute;display: none} .wordSearch{0}.animate{animation: db_search_turn 5s linear infinite;}", randomCode);
            s += StringFormat(".wordSearchIcon{0}{background-image: url({1});background-size: 25px;height: 25px;width: 25px;}", randomCode, searchIconBase64);
            s += Panel.CreateStyle();
            GM_addStyle(s);
        };
        const ShowWordSearchIcon = function () {
            let $wordSearchIcon = $("div#wordSearch" + randomCode);
            let isSelect = false;
            let isPanel = false;
            let isWordSearchIcon = false;
            let isHoldCtrlKey = false;
            $doc.on({
                "selectionchange": function (e) {
                    isSelect = true;
                },
                "keydown": function (e) {
                    if (e.ctrlKey || e.metaKey) {
                        isHoldCtrlKey = true;
                    }
                },
                "keyup": function (e) {
                    isHoldCtrlKey = false;
                },
                "mousedown": function (e) {
                    let $targetEl = $(e.target);
                    isPanel = $targetEl.parents().is("div.JPopBox-tip-white");
                    isWordSearchIcon = $targetEl.parents().is(StringFormat("div#wordSearch{0}", randomCode));
                    //点击搜索图标外域和搜索面板外域时，隐藏图标和搜索面板
                    if (!isWordSearchIcon && !isPanel) {
                        $wordSearchIcon.removeClass('animate');
                        $wordSearchIcon.hide();
                        Search.Clear();
                        Panel.Destroy();
                    }
                    else {
                        //点击搜索图标，取消鼠标默认事件，防止选中的文本消失
                        if (isWordSearchIcon) {
                            ClearBubble(e);
                        }
                    }
                },
                "mouseup": function (e) {
                    let selectText = window.getSelection().toString().trim();
                    let holdKey = options.selectPattern == 'select' || (options.selectPattern == 'hold' && isHoldCtrlKey);
                    if (!isPanel && isSelect && holdKey && selectText) {
                        $wordSearchIcon.show().css({
                            left: e.pageX + 'px',
                            top: e.pageY + 12 + 'px'
                        });
                        isSelect = false;
                    }
                }
            });
            $wordSearchIcon.click(function (e) {
                $wordSearchIcon.addClass('animate');
                Search.Clear();
                Panel.Destroy();
                let selecter = window.getSelection();
                let selectText = selecter.toString().trim();
                GetSettingOptions();
                Search.searchText = selectText;
                Search.searchType = "word";
                Search.searchEngine = options.defaultsearchengine;//defaultSearchEngine;
                Search.Update();
                Search.Execute(function () {
                    WordSearchPanel.Create($wordSearchIcon, randomCode);
                    $wordSearchIcon.removeClass('animate');
                    $wordSearchIcon.hide();
                });
            });
        };
        const RegMenu = function () {
            GM_registerMenuCommand("设置", function () {
                $("div#wordSearch" + randomCode).hide();
                Search.Clear();
                Panel.Destroy();
                SettingPanel.Create($body, randomCode);
            });
        };
        this.init = function () {
            randomCode = DateFormat(new Date(), "yyMM").toString() + (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000).toString();
            Search.RegisterEngine();
            createStyle();
            createHtml();
            ShowWordSearchIcon();
            RegMenu();
            GetSettingOptions();
        };
    };
 
    const webSearch = new WebSearchlate();
    webSearch.init();
 
}());
