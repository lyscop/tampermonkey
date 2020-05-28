// ==UserScript==
// @name         网盘助手
// @namespace    http://go.newday.me/s/pan-home
// @version      0.4.1
// @icon         http://cdn.newday.me/addon/pan/favicon.ico
// @author       哩呵
// @description  大概是最优雅好用的网盘助手了；插件主要功能有：[1]百度网盘、腾讯微云、蓝奏云、天翼云盘万能钥匙 [2]百度网盘生成并展示下载链接 [3]百度网盘分享时自定义提取码
// @match        *://pan.baidu.com/*
// @match        *://yun.baidu.com/*
// @match        *://share.weiyun.com/*
// @match        *://*.lanzous.com/*
// @match        *://cloud.189.cn/*
// @match        *://*.newday.me/*
// @match        *://*.likestyle.cn/*
// @connect      newday.me
// @connect      likestyle.cn
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.0.10/purify.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/snap.svg/0.5.1/snap.svg-min.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    var manifest = {
        "name": "wpzs",
        "urls": {},
        "apis": {
            "version": "https://api.newday.me/share/disk/version",
            "origin": "https://api.newday.me/share/disk/origin",
            "query": "https://api.newday.me/share/disk/query",
            "store": "https://api.newday.me/share/disk/store",
            "lists": "https://api.newday.me/share/disk/lists",
            "delete": "https://api.newday.me/share/disk/delete"
        },
        "logger_level": 3,
        "options_page": "http://go.newday.me/s/pan-option"
    };

    var container = (function () {
        var obj = {
            defines: {},
            modules: {}
        };

        obj.define = function (name, requires, callback) {
            name = obj.processName(name);
            obj.defines[name] = {
                requires: requires,
                callback: callback
            };
        };

        obj.require = function (name, cache) {
            if (typeof cache == "undefined") {
                cache = true;
            }

            name = obj.processName(name);
            if (cache && obj.modules.hasOwnProperty(name)) {
                return obj.modules[name];
            } else if (obj.defines.hasOwnProperty(name)) {
                var requires = obj.defines[name].requires;
                var callback = obj.defines[name].callback;

                var module = obj.use(requires, callback);
                cache && obj.register(name, module);
                return module;
            }
        };

        obj.use = function (requires, callback) {
            var module = {
                exports: undefined
            };
            var params = obj.buildParams(requires, module);
            var result = callback.apply(this, params);
            if (typeof result != "undefined") {
                return result;
            } else {
                return module.exports;
            }
        };

        obj.register = function (name, module) {
            name = obj.processName(name);
            obj.modules[name] = module;
        };

        obj.buildParams = function (requires, module) {
            var params = [];
            requires.forEach(function (name) {
                params.push(obj.require(name));
            });
            params.push(obj.require);
            params.push(module.exports);
            params.push(module);
            return params;
        };

        obj.processName = function (name) {
            return name.toLowerCase();
        };

        return {
            define: obj.define,
            use: obj.use,
            register: obj.register,
            modules: obj.modules
        };
    })();

    container.define("gm", [], function () {
        var obj = {};

        obj.ready = function (callback) {
            if (typeof GM_getValue != "undefined") {
                callback && callback();
            }
            else {
                setTimeout(function () {
                    obj.ready(callback);
                }, 100);
            }
        };

        return obj;
    });

    /** common **/
    container.define("gmDao", [], function () {
        var obj = {
            items: {}
        };

        obj.get = function (name) {
            return GM_getValue(name);
        };

        obj.getBatch = function (names) {
            var items = {};
            names.forEach(function (name) {
                items[name] = obj.get(name);
            });
            return items;
        };

        obj.getAll = function () {
            return obj.getBatch(GM_listValues());
        };

        obj.set = function (name, item) {
            GM_setValue(name, item);
        };

        obj.setBatch = function (items) {
            for (var name in items) {
                obj.set(name, items[name]);
            }
        };

        obj.setAll = function (items) {
            var names = GM_listValues();
            names.forEach(function (name) {
                if (!items.hasOwnProperty(name)) {
                    obj.remove(name);
                }
            });
            obj.setBatch(items);
        };

        obj.remove = function (name) {
            GM_deleteValue(name);
        };

        obj.removeBatch = function (names) {
            names.forEach(function (name) {
                obj.remove(name);
            });
        };

        obj.removeAll = function () {
            obj.removeBatch(GM_listValues());
        };

        return obj;
    });

    container.define("ScopeDao", [], function () {
        return function (dao, scope) {
            var obj = {
                items: {}
            };

            obj.get = function (name) {
                return obj.items[name];
            };

            obj.getBatch = function (names) {
                var items = {};
                names.forEach(function (name) {
                    if (obj.items.hasOwnProperty(name)) {
                        items[name] = obj.items[name];
                    }
                });
                return items;
            };

            obj.getAll = function () {
                return obj.items;
            };

            obj.set = function (name, item) {
                obj.items[name] = item;

                obj.sync();
            };

            obj.setBatch = function (items) {
                obj.items = Object.assign(obj.items, items);

                obj.sync();
            };

            obj.setAll = function (items) {
                obj.items = Object.assign({}, items);

                obj.sync();
            };

            obj.remove = function (name) {
                delete obj.items[name];

                obj.sync();
            };

            obj.removeBatch = function (names) {
                names.forEach(function (name) {
                    delete obj.items[name];
                });

                obj.sync();
            };

            obj.removeAll = function () {
                obj.items = {};

                obj.getDao().remove(obj.getScope());
            };

            obj.init = function () {
                var items = obj.getDao().get(obj.getScope());
                if (items instanceof Object) {
                    obj.items = items;
                }
            };

            obj.sync = function () {
                obj.getDao().set(obj.getScope(), obj.items);
            };

            obj.getDao = function () {
                return dao;
            };

            obj.getScope = function () {
                return scope;
            };

            return obj.init(), obj;
        };
    });

    container.define("config", ["factory"], function (factory) {
        var obj = {};

        obj.getConfig = function (name) {
            return obj.getDao().get(name);
        };

        obj.setConfig = function (name, value) {
            obj.getDao().set(name, value);
        };

        obj.getAll = function () {
            return obj.getDao().getAll();
        };

        obj.getDao = function () {
            return factory.getConfigDao();
        };

        return obj;
    });

    container.define("storage", ["factory"], function (factory) {
        var obj = {};

        obj.getValue = function (name) {
            return obj.getDao().get(name);
        };

        obj.setValue = function (name, value) {
            obj.getDao().set(name, value);
        };

        obj.getAll = function () {
            return obj.getDao().getAll();
        };

        obj.getDao = function () {
            return factory.getStorageDao();
        };

        return obj;
    });

    container.define("option", ["config", "constant"], function (config, constant) {
        var obj = {
            name: "option",
            constant: constant.option
        };

        obj.isOptionActive = function (item) {
            var name = item.name;
            var option = obj.getOption();
            return option.indexOf(name) >= 0 ? true : false;
        };

        obj.setOptionActive = function (item) {
            var name = item.name;
            var option = obj.getOption();
            if (option.indexOf(name) < 0) {
                option.push(name);
                obj.setOption(option);
            }
        };

        obj.setOptionUnActive = function (item) {
            var name = item.name;
            var option = obj.getOption();
            var index = option.indexOf(name);
            if (index >= 0) {
                delete option[index];
                obj.setOption(option);
            }
        };

        obj.getOption = function () {
            var option = [];
            var optionList = obj.getOptionList();
            Object.values(obj.constant).forEach(function (item) {
                var name = item.name;
                if (optionList.hasOwnProperty(name)) {
                    if (optionList[name] != "no") {
                        option.push(name);
                    }
                }
                else if (item.value != "no") {
                    option.push(name);
                }
            });
            return option;
        };

        obj.setOption = function (option) {
            var optionList = {};
            Object.values(obj.constant).forEach(function (item) {
                var name = item.name;
                if (option.indexOf(name) >= 0) {
                    optionList[name] = "yes";
                } else {
                    optionList[name] = "no";
                }
            });
            obj.setOptionList(optionList);
        };

        obj.getOptionList = function () {
            var optionList = config.getConfig(obj.name);
            return optionList ? optionList : {};
        };

        obj.setOptionList = function (optionList) {
            config.setConfig(obj.name, optionList);
        };

        return obj;
    });

    container.define("manifest", [], function () {
        var obj = {
            manifest: manifest
        };

        obj.getItem = function (name) {
            return obj.manifest[name];
        };

        obj.getManifest = function () {
            return obj.manifest;
        };

        obj.getName = function () {
            return obj.getItem("name");
        };

        obj.getAppName = function () {
            return obj.getItem("app_name");
        };

        obj.getUrl = function (name) {
            var urls = obj.getItem("urls");
            (urls instanceof Object) || (urls = {});
            return urls[name];
        };

        obj.getApi = function (name) {
            var apis = obj.getItem("apis");
            (apis instanceof Object) || (apis = {});
            return apis[name];
        };

        obj.getOptionsPage = function () {
            if (GM_info.script.optionUrl) {
                return GM_info.script.optionUrl;
            }
            else {
                return obj.getItem("options_page");
            }
        };

        return obj;
    });

    container.define("env", ["config", "manifest"], function (config, manifest) {
        var obj = {
            modes: {
                ADDON: "addon",
                SCRIPT: "script"
            },
            browsers: {
                FIREFOX: "firefox",
                EDG: "edg",
                EDGE: "edge",
                BAIDU: "baidu",
                LIEBAO: "liebao",
                UC: "uc",
                QQ: "qq",
                SOGOU: "sogou",
                OPERA: "opera",
                MAXTHON: "maxthon",
                IE2345: "2345",
                SE360: "360",
                CHROME: "chrome",
                SAFIRI: "safari",
                OTHER: "other"
            }
        };

        obj.getName = function () {
            return manifest.getName();
        };

        obj.getMode = function () {
            if (GM_info.mode) {
                return GM_info.mode;
            }
            else {
                return obj.modes.SCRIPT;
            }
        };

        obj.getAid = function () {
            if (GM_info.scriptHandler) {
                return GM_info.scriptHandler.toLowerCase();
            }
            else {
                return "unknown";
            }
        };

        obj.getUid = function () {
            var uid = config.getConfig("uid");
            if (!uid) {
                uid = obj.randString(32);
                config.setConfig("uid", uid);
            }
            return uid;
        };

        obj.getBrowser = function () {
            if (!obj._browser) {
                obj._browser = obj.matchBrowserType(navigator.userAgent);
            }
            return obj._browser;
        };

        obj.getVersion = function () {
            return GM_info.script.version;
        };

        obj.getEdition = function () {
            return GM_info.version;
        };

        obj.getInfo = function () {
            return {
                mode: obj.getMode(),
                aid: obj.getAid(),
                uid: obj.getUid(),
                browser: obj.getBrowser(),
                version: obj.getVersion(),
                edition: obj.getEdition()
            };
        };

        obj.matchBrowserType = function (userAgent) {
            var browser = obj.browsers.OTHER;
            userAgent = userAgent.toLowerCase();
            if (userAgent.match(/firefox/) != null) {
                browser = obj.browsers.FIREFOX;
            } else if (userAgent.match(/edge/) != null) {
                browser = obj.browsers.EDGE;
            } else if (userAgent.match(/edg/) != null) {
                browser = obj.browsers.EDG;
            } else if (userAgent.match(/bidubrowser/) != null) {
                browser = obj.browsers.BAIDU;
            } else if (userAgent.match(/lbbrowser/) != null) {
                browser = obj.browsers.LIEBAO;
            } else if (userAgent.match(/ubrowser/) != null) {
                browser = obj.browsers.UC;
            } else if (userAgent.match(/qqbrowse/) != null) {
                browser = obj.browsers.QQ;
            } else if (userAgent.match(/metasr/) != null) {
                browser = obj.browsers.SOGOU;
            } else if (userAgent.match(/opr/) != null) {
                browser = obj.browsers.OPERA;
            } else if (userAgent.match(/maxthon/) != null) {
                browser = obj.browsers.MAXTHON;
            } else if (userAgent.match(/2345explorer/) != null) {
                browser = obj.browsers.IE2345;
            } else if (userAgent.match(/chrome/) != null) {
                if (navigator.mimeTypes.length > 10) {
                    browser = obj.browsers.SE360;
                } else {
                    browser = obj.browsers.CHROME;
                }
            } else if (userAgent.match(/safari/) != null) {
                browser = obj.browsers.SAFIRI;
            }
            return browser;
        };

        obj.randString = function (length) {
            var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
            var text = "";
            for (var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };

        return obj;
    });

    container.define("http", [], function () {
        var obj = {};

        obj.ajax = function (option) {
            var details = {
                method: option.type,
                url: option.url,
                responseType: option.dataType,
                onload: function (result) {
                    option.success && option.success(result.response);
                },
                onerror: function (result) {
                    option.error && option.error(result.error);
                }
            };

            // 提交数据
            if (option.data instanceof Object) {
                if (option.data instanceof FormData) {
                    details.data = option.data;
                }
                else {
                    var formData = new FormData();
                    for (var i in option.data) {
                        formData.append(i, option.data[i]);
                    }
                    details.data = formData;
                }
            }

            // 自定义头
            if (option.headers) {
                details.headers = option.headers;
            }

            // 超时
            if (option.timeout) {
                details.timeout = option.timeout;
            }

            GM_xmlhttpRequest(details);
        };

        return obj;
    });

    container.define("router", [], function () {
        var obj = {};

        obj.getUrl = function () {
            return location.href;
        };

        obj.goUrl = function (url) {
            location.href = url;
        };

        obj.openUrl = function (url) {
            window.open(url);
        };

        obj.openTab = function (url, active) {
            GM_openInTab(url, !active);
        };

        obj.jumpLink = function (jumpUrl, jumpMode) {
            switch (jumpMode) {
                case 9:
                    // self
                    obj.goUrl(jumpUrl);
                    break;
                case 6:
                    // new
                    obj.openUrl(jumpUrl);
                    break;
                case 3:
                    // new & not active
                    obj.openTab(jumpUrl, false);
                    break;
                case 1:
                    // new & active
                    obj.openTab(jumpUrl, true);
                    break;
            }
        };

        obj.getUrlParam = function (name) {
            var param = obj.parseUrlParam(obj.getUrl());
            if (name) {
                return param.hasOwnProperty(name) ? param[name] : null;
            }
            else {
                return param;
            }
        };

        obj.parseUrlParam = function (url) {
            if (url.indexOf("?")) {
                url = url.split("?")[1];
            }
            var reg = /([^=&\s]+)[=\s]*([^=&\s]*)/g;
            var obj = {};
            while (reg.exec(url)) {
                obj[RegExp.$1] = RegExp.$2;
            }
            return obj;
        };

        return obj;
    });

    container.define("logger", ["env", "manifest"], function (env, manifest) {
        var obj = {
            constant: {
                DEBUG: 0,
                INFO: 1,
                WARN: 2,
                ERROR: 3,
                NONE: 4
            }
        };

        obj.debug = function (message) {
            obj.log(message, obj.constant.DEBUG);
        };

        obj.info = function (message) {
            obj.log(message, obj.constant.INFO);
        };

        obj.warn = function (message) {
            obj.log(message, obj.constant.WARN);
        };

        obj.error = function (message) {
            obj.log(message, obj.constant.ERROR);
        };

        obj.log = function (message, level) {
            if (level < manifest.getItem("logger_level")) {
                return false;
            }

            console.group("[" + env.getName() + "]" + env.getMode());
            console.log(message);
            console.groupEnd();
        };

        return obj;
    });

    container.define("meta", ["env", "$"], function (env, $) {
        var obj = {};

        obj.existMeta = function (name) {
            name = obj.processName(name);
            if ($("meta[name='" + name + "']").length) {
                return true;
            }
            else {
                return false;
            }
        };

        obj.appendMeta = function (name, content) {
            name = obj.processName(name);
            content || (content = "on");
            $('<meta name="' + name + '" content="on">').appendTo($("head"));
        };

        obj.processName = function (name) {
            return env.getName() + "::" + name;
        };

        return obj;
    });

    container.define("unsafeWindow", [], function () {
        if (typeof unsafeWindow == "undefined") {
            return window;
        }
        else {
            return unsafeWindow;
        }
    });

    container.define("svgCrypt", ["Snap"], function (Snap) {
        var obj = {};

        obj.getReqData = function () {
            var reqTime = Math.round(new Date().getTime() / 1000);
            var reqPoint = obj.getStrPoint("timestamp:" + reqTime);
            return {
                req_time: reqTime,
                req_point: reqPoint
            };
        };

        obj.getStrPoint = function (str) {
            if (str.length < 2) {
                return "0:0";
            }

            var path = "";
            var current, last = str[0].charCodeAt();
            var sum = last;
            for (var i = 1; i < str.length; i++) {
                current = str[i].charCodeAt();
                if (i == 1) {
                    path = path + "M";
                } else {
                    path = path + " L";
                }
                path = path + current + " " + last;
                last = current;
                sum = sum + current;
            }
            path = path + " Z";
            var index = sum % str.length;
            var data = Snap.path.getPointAtLength(path, str[index].charCodeAt());
            return data.m.x + ":" + data.n.y;
        };

        return obj;
    });

    container.define("calendar", [], function () {
        var obj = {};

        obj.getTime = function () {
            return (new Date()).getTime();
        };

        obj.formatTime = function (format, timestamp) {
            format || (format = "Y-m-d H:i:s");
            timestamp || (timestamp = obj.getTime());
            var date = new Date(timestamp);
            var year = 1900 + date.getYear();
            var month = "0" + (date.getMonth() + 1);
            var day = "0" + date.getDate();
            var hour = "0" + date.getHours();
            var minute = "0" + date.getMinutes();
            var second = "0" + date.getSeconds();
            var vars = {
                "Y": year,
                "m": month.substring(month.length - 2, month.length),
                "d": day.substring(day.length - 2, day.length),
                "H": hour.substring(hour.length - 2, hour.length),
                "i": minute.substring(minute.length - 2, minute.length),
                "s": second.substring(second.length - 2, second.length)
            };
            return obj.replaceVars(vars, format);
        };

        obj.replaceVars = function (vars, value) {
            Object.keys(vars).forEach(function (key) {
                value = value.replace(key, vars[key]);
            });
            return value;
        };

        return obj;
    });

    container.define("oneData", ["env", "http"], function (env, http) {
        var obj = {};

        obj.requestOneApi = function (url, data, callback) {
            http.ajax({
                type: "post",
                url: url,
                dataType: "json",
                data: Object.assign(env.getInfo(), data),
                success: function (response) {
                    callback && callback(response);
                },
                error: function () {
                    callback && callback("");
                }
            });
        };

        return obj;
    });

    container.define("$extend", ["$", "DOMPurify", "logger"], function ($, DOMPurify, logger) {
        var obj = {};

        obj.init = function () {
            if (DOMPurify && DOMPurify instanceof Function) {
                var domPurify = DOMPurify(window);
                $.fn.safeHtml = function (html) {
                    try {
                        this.html(domPurify.sanitize(html));
                    }
                    catch (err) {
                        logger.error(err);
                    }
                };
            }
            else {
                $.fn.safeHtml = function (html) {
                    this.html(html);
                };
            }
        };

        return obj.init(), obj;
    });

    container.define("appRunner", ["router", "logger", "meta", "$"], function (router, logger, meta, $, require) {
        var obj = {};

        obj.run = function (appList) {
            var metaName = "status";
            if (meta.existMeta(metaName)) {
                logger.info("setup already");
            }
            else {
                // 添加meta
                meta.appendMeta(metaName);

                // 运行应用
                $(function () {
                    obj.runAppList(appList);
                });
            }
        };

        obj.runAppList = function (appList) {
            var url = router.getUrl();
            for (var i in appList) {
                var app = appList[i];

                var match = obj.matchApp(url, app);
                if (match == false) {
                    continue;
                }

                if (require(app.name).run() == true) {
                    break;
                }
            }
        };

        obj.matchApp = function (url, app) {
            var match = false;
            app.matchs.forEach(function (item) {
                if (url.indexOf(item) > 0 || item == "*") {
                    match = true;
                }
            });
            return match;
        };

        return obj;
    });

    /** custom **/
    container.define("factory", ["gmDao", "ScopeDao"], function (gmDao, ScopeDao) {
        var obj = {
            daos: {}
        };

        obj.getConfigDao = function () {
            return obj.getDao("config", function () {
                return ScopeDao(gmDao, "$config");
            });
        };

        obj.getStorageDao = function () {
            return obj.getDao("storage", function () {
                return ScopeDao(gmDao, "$storage");
            });
        };

        obj.getDao = function (key, createFunc) {
            if (!obj.daos.hasOwnProperty(key)) {
                obj.daos[key] = createFunc();
            }
            return obj.daos[key];
        };

        return obj;
    });

    container.define("constant", [], function () {
        return {
            source: {
                baidu: "baidu",
                weiyun: "weiyun",
                lanzous: "lanzous",
                ty189: "189"
            },
            option: {
                send_usage: {
                    name: "send_usage",
                    value: "yes"
                },
                baidu_page_home: {
                    name: "baidu_page_home",
                    value: "yes"
                },
                baidu_page_share: {
                    name: "baidu_page_share",
                    value: "yes"
                },
                baidu_page_verify: {
                    name: "baidu_page_verify",
                    value: "yes"
                },
                baidu_share_status: {
                    name: "baidu_share_status",
                    value: "yes"
                },
                baidu_custom_password: {
                    name: "baidu_custom_password",
                    value: "yes"
                },
                baidu_show_origin: {
                    name: "baidu_show_origin",
                    value: "yes"
                },
                baidu_auto_jump: {
                    name: "baidu_auto_jump",
                    value: "no"
                },
                weiyun_page_verify: {
                    name: "weiyun_page_verify",
                    value: "yes"
                },
                weiyun_share_status: {
                    name: "weiyun_share_status",
                    value: "yes"
                },
                weiyun_auto_jump: {
                    name: "weiyun_auto_jump",
                    value: "no"
                },
                lanzous_page_verify: {
                    name: "lanzous_page_verify",
                    value: "yes"
                },
                lanzous_share_status: {
                    name: "lanzous_share_status",
                    value: "yes"
                },
                lanzous_auto_jump: {
                    name: "lanzous_auto_jump",
                    value: "no"
                },
                ty189_page_verify: {
                    name: "189_page_verify",
                    value: "yes"
                },
                ty189_share_status: {
                    name: "189_share_status",
                    value: "yes"
                },
                ty189_auto_jump: {
                    name: "189_auto_jump",
                    value: "no"
                }
            }
        };
    });

    container.define("api", ["manifest", "oneData", "svgCrypt"], function (manifest, oneData, svgCrypt) {
        var obj = {};

        obj.versionQuery = function (callback) {
            oneData.requestOneApi(manifest.getApi("version"), {}, callback);
        };

        obj.queryShareOrigin = function (shareSource, shareId, shareLink, callback) {
            var data = {
                share_id: shareId,
                share_source: shareSource,
                share_point: svgCrypt.getStrPoint(shareId),
                share_link: shareLink
            };
            oneData.requestOneApi(manifest.getApi("origin"), data, callback);
        };

        obj.querySharePwd = function (shareSource, shareId, shareLink, callback) {
            var data = {
                share_id: shareId,
                share_source: shareSource,
                share_point: svgCrypt.getStrPoint(shareId),
                share_link: shareLink
            };
            oneData.requestOneApi(manifest.getApi("query"), data, callback);
        };

        obj.storeSharePwd = function (shareId, sharePwd, shareLink, shareSource, callback) {
            var data = {
                share_id: shareId,
                share_pwd: sharePwd,
                share_source: shareSource,
                share_point: svgCrypt.getStrPoint(shareId),
                share_link: shareLink
            };
            oneData.requestOneApi(manifest.getApi("store"), data, callback);
        };

        obj.queryShareList = function (shareSource, callback) {
            var data = {
                share_source: shareSource
            };
            oneData.requestOneApi(manifest.getApi("lists"), data, callback);
        };

        obj.deleteShare = function (shareId, callback) {
            var data = {
                share_id: shareId,
                share_point: svgCrypt.getStrPoint(shareId)
            };
            oneData.requestOneApi(manifest.getApi("delete"), data, callback);
        };

        return obj;
    });

    container.define("shareLog", ["config", "calendar", "constant", "api"], function (config, calendar, constant, api) {
        var obj = {
            name: "share_list",
            modes: {
                LOCAL: "local",
                ONLINE: "online"
            }
        };

        obj.getShareMode = function () {
            var shareMode = config.getConfig("share_mode");
            return shareMode == obj.modes.LOCAL ? obj.modes.LOCAL : obj.modes.ONLINE;
        };

        obj.setShareMode = function (shareMode) {
            config.setConfig("share_mode", shareMode == obj.modes.LOCAL ? obj.modes.LOCAL : obj.modes.ONLINE);
        };

        obj.getShareLogList = function (shareSource, callback) {
            if (obj.getShareMode() == obj.modes.LOCAL) {
                callback(obj.getLocalShareLogList());
            }
            else {
                obj.getOnlineShareLogList(shareSource, callback);
            }
        };

        obj.getOnlineShareLogList = function (shareSource, callback) {
            api.queryShareList(shareSource, function (response) {
                console.log(response);
                if (response instanceof Object && response.code == 1) {
                    callback(response.data.list);
                }
                else {
                    callback([]);
                }
            });
        };

        obj.getLocalShareLogList = function () {
            var shareList = config.getConfig(obj.name);
            return shareList ? shareList : {};
        };

        obj.addShareLog = function (shareId, sharePwd, shareLink, shareSource) {
            api.storeSharePwd(shareId, sharePwd, shareLink, shareSource);

            var shareList = obj.getLocalShareLogList();
            shareList[shareId] = {
                share_id: shareId,
                share_pwd: sharePwd,
                share_link: shareLink,
                share_source: shareSource,
                share_time: (new Date()).getTime()
            };
            config.setConfig(obj.name, shareList);
        };

        obj.removeShareLog = function (shareId, callback) {
            var shareList = obj.getLocalShareLogList();
            delete shareList[shareId];
            config.setConfig(obj.name, shareList);

            api.deleteShare(shareId, callback);
        };

        obj.buildShareLink = function (shareId, shareSource, shareLink) {
            if (shareSource == constant.source.baidu) {
                shareLink = "https://pan.baidu.com/s/1" + shareId;
            }
            else if (shareSource == constant.source.baidu) {
                shareLink = "https://share.weiyun.com/" + shareId;
            } else if (shareSource == constant.source.baidu) {
                shareLink = "https://www.lanzous.com/" + shareId;
            } else if (shareSource == constant.source.ty189) {
                shareLink = "https://cloud.189.cn/t/" + shareId;
            }
            return shareLink;
        };

        obj.buildShareTime = function (shareTime) {
            return calendar.formatTime("Y-m-d H:i:s", shareTime);
        };

        return obj;
    });

    container.define("runtime", ["router", "manifest", "calendar", "storage", "api"], function (router, manifest, calendar, storage, api) {
        var obj = {};

        obj.openOptionsPage = function () {
            router.openTab(manifest.getOptionsPage(), true);
        };

        obj.initVersion = function () {
            var versionDate = parseInt(storage.getValue("version_date"));
            var currentDate = calendar.formatTime("Ymd");
            if (!versionDate || versionDate < currentDate) {
                api.versionQuery(function (response) {
                    storage.setValue("version_date", currentDate);

                    if (response && response.code == 1 && response.data instanceof Object) {
                        var versionPayload = response.data;
                        storage.setValue("version_payload", versionPayload);
                        storage.setValue("version_latest", versionPayload.version);
                    }
                });
            }
        };

        obj.initRuntime = function () {
            obj.initVersion();
        };

        return obj;
    });

    container.define("core", ["runtime", "$extend"], function (runtime) {
        var obj = {};

        obj.ready = function (callback) {
            runtime.initRuntime();

            callback && callback();
        };

        return obj;
    });

    /** app **/
    container.define("app_baidu", ["config", "option", "router", "logger", "unsafeWindow", "constant", "runtime", "api", "shareLog", "$"], function (config, option, router, logger, unsafeWindow, constant, runtime, api, shareLog, $) {
        var obj = {
            app_id: 250528,
            temp_path: "/onetmp",
            yun_data: null,
            verify_page: {
                share_pwd: null,
                setPwd: null,
                backupPwd: null,
                restorePwd: null,
                submit_pwd: null
            }
        };

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf(".baidu.com/s/") > 0) {
                option.isOptionActive(option.constant.baidu_page_share) && obj.initSharePage();
                return true;
            }
            else if (url.indexOf(".baidu.com/disk/home") > 0) {
                option.isOptionActive(option.constant.baidu_page_home) && obj.initHomePage();
                return true;
            } else if (url.indexOf(".baidu.com/disk/timeline") > 0) {
                option.isOptionActive(option.constant.baidu_page_home) && obj.initTimeLinePage();
                return true;
            } else if (url.indexOf(".baidu.com/share/init") > 0) {
                option.isOptionActive(option.constant.baidu_page_verify) && obj.initVerifyPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initSharePage = function () {
            obj.registerCustomAppId();

            obj.removeVideoLimit();

            obj.prettySingleSharePage();

            obj.initButtonShare();

            obj.initButtonEvent();

            if (option.isOptionActive(option.constant.baidu_show_origin)) {
                obj.showShareOrigin();
            }
        };

        obj.initHomePage = function () {
            obj.registerCustomAppId();

            obj.registerCustomSharePwd();

            obj.initButtonHome();

            obj.initButtonEvent();
        };

        obj.initTimeLinePage = function () {
            obj.registerCustomAppId();

            obj.registerCustomSharePwd();

            obj.initButtonTimeLine();

            obj.initButtonEvent();
        };

        obj.initVerifyPage = function () {
            obj.registerStoreSharePwd();

            if (obj.initVerifyPageElement()) {
                obj.autoPaddingSharePwd();

                obj.registerPwdShareSwitch();
            }
        };

        obj.initVerifyPageElement = function () {
            var shareId = obj.getShareId();
            var $pwd = $(".input-area input");
            if (shareId && $pwd.length) {
                // 设置提取码
                obj.verify_page.setPwd = function (pwd) {
                    $pwd.val(pwd);
                };

                // 备份提取码
                obj.verify_page.backupPwd = function (pwd) {
                    $pwd.attr("data-pwd", pwd);
                };

                // 还原提取码
                obj.verify_page.restorePwd = function () {
                    $pwd.val($pwd.attr("data-pwd"));
                };

                // 提交提取码
                var $button = $(".input-area .g-button");
                if ($button.length) {
                    obj.verify_page.submit_pwd = function () {
                        $button.click();
                    };
                }

                return true;
            }
            else {
                return false;
            }
        };

        obj.autoPaddingSharePwd = function () {
            var shareId = obj.getShareId();
            var shareLink = router.getUrl();
            api.querySharePwd(constant.source.baidu, shareId, shareLink, function (response) {
                if (response && response.code == 1) {
                    var sharePwd = response.data.share_pwd;
                    obj.verify_page.share_pwd = sharePwd;
                    obj.verify_page.setPwd(sharePwd);
                    obj.showTipSuccess("填充提取码成功");

                    if (option.isOptionActive(option.constant.baidu_auto_jump)) {
                        obj.verify_page.submit_pwd && obj.verify_page.submit_pwd();
                    }
                }
                else {
                    obj.showTipError("暂无人分享提取码");
                }
            });
        };

        obj.registerPwdShareSwitch = function () {
            // 添加开关
            $(".pickpw").after('<dl class="clearfix"><dt>提取码分享设置<span style="float:right"><input type="checkbox" checked id="nd-share-check" style="vertical-align: middle;"> <a class="nd-open-page-option" href="javascript:;" title="点击查看更多脚本配置">共享提取码</a></span></dt></dl>');
            obj.isPwdShareOpen() || $("#nd-share-check").removeAttr("checked");

            // 开关-事件
            $("#nd-share-check").on("change", function () {
                if ($(this).is(':checked')) {
                    option.setOptionActive(option.constant.baidu_share_status);
                }
                else {
                    option.setOptionUnActive(option.constant.baidu_share_status);
                }
            });

            // 打开配置页
            $(".nd-open-page-option").click(function () {
                runtime.openOptionsPage();
            });
        };

        obj.registerStoreSharePwd = function () {
            obj.getJquery()(document).ajaxComplete(function (event, xhr, options) {
                var requestUrl = options.url;
                if (requestUrl.indexOf("/share/verify") >= 0) {
                    var match = options.data.match(/pwd=([a-z0-9]+)/i);
                    if (!match) {
                        return logger.warn("pwd share not match");
                    }

                    // 拒绝*号
                    if (obj.verify_page.backupPwd) {
                        obj.verify_page.backupPwd(match[1]);
                        setTimeout(obj.verify_page.restorePwd, 500);
                    }

                    var response = xhr.responseJSON;
                    if (!(response && response.errno == 0)) {
                        return logger.warn("pwd share error");
                    }

                    var sharePwd = match[1];
                    if (sharePwd == obj.verify_page.share_pwd) {
                        return logger.warn("pwd share not change");
                    }

                    if (!obj.isPwdShareOpen()) {
                        return logger.warn("pwd share closed");
                    }

                    var shareId = obj.getShareId();
                    var shareLink = router.getUrl();
                    shareLog.addShareLog(shareId, sharePwd, shareLink, constant.source.baidu);
                }
            });
        };

        obj.registerCustomAppId = function () {
            obj.getJquery()(document).ajaxSend(function (event, xhr, options) {
                var requestUrl = options.url;
                if (requestUrl.indexOf("/api/download") >= 0 || requestUrl.indexOf("/api/sharedownload") >= 0) {
                    var match = requestUrl.match(/app_id=(\d+)/);
                    if (match) {
                        options.url = requestUrl.replace(match[0], "app_id=" + obj.getAppId());
                    }
                }
            });
        };

        obj.registerCustomSharePwd = function () {
            // 功能开关
            if (!option.isOptionActive(option.constant.baidu_custom_password)) {
                return;
            }

            // 生成提取码
            obj.async("function-widget-1:share/util/shareFriend/createLinkShare.js", function (shareLink) {
                shareLink.prototype.makePrivatePasswordOrigin = shareLink.prototype.makePrivatePassword;
                shareLink.prototype.makePrivatePassword = function () {
                    var sharePwd = config.getConfig("share_pwd");
                    return sharePwd ? sharePwd : this.makePrivatePasswordOrigin();
                };
            });

            // 分享事件
            obj.async("function-widget-1:share/util/shareDialog.js", function (shareDialog) {
                shareDialog.prototype.onVisibilityChangeOrigin = shareDialog.prototype.onVisibilityChange;
                shareDialog.prototype.onVisibilityChange = function (status) {
                    if ($(".nd-input-share-pwd").length == 0) {
                        var sharePwd = config.getConfig("share_pwd");
                        var html = '<tr><td class="first-child"><label>提取码</label></td><td><input type="text" class="nd-input-share-pwd" value="' + (sharePwd ? sharePwd : "") + '" placeholder="为空则随机四位" style="padding: 6px; width: 100px;border: 1px solid #e9e9e9;"></td></tr>';
                        $("#share .dialog-body table").append(html);
                    }
                    this.onVisibilityChangeOrigin(status);
                };
            });

            // 提取码更改事件
            $(document).on("change", ".nd-input-share-pwd", function () {
                var value = this.value;
                if (value && !value.match(/^[0-9a-z]{4}$/i)) {
                    obj.showTipError("提取码只能是四位数字或字母");
                }
                config.setConfig("share_pwd", value);
            });
        };

        obj.removeVideoLimit = function () {
            var message = obj.getSystemContext().message;
            if (message) {
                message.trigger("share-video-after-transfer");
            }
            else {
                logger.warn("wait removeVideoLimit...");
                obj.setTimeout(obj.removeVideoLimit, 500);
            }
        };

        obj.prettySingleSharePage = function () {
            if (!obj.isSharePageMulti()) {
                $("#layoutMain").css({
                    "width": "auto",
                    "min-width": "1180px",
                    "margin": "88px 30px"
                });
            }
        };

        obj.showShareOrigin = function () {
            var shareId = obj.getShareId();
            api.queryShareOrigin(constant.source.baidu, shareId, function (response) {
                if (response && response.code == 1) {
                    var data = response.data;
                    if (data.list && data.list.length) {
                        var html = '<div style="padding: 10px 5px; border-bottom: 1px solid #f6f6f6; line-height: 30px;">';
                        var item = data.list[0];
                        if (data.list.length > 1) {
                            html += '<p>分享来源：<a target="_blank" href="' + item.url + '">' + item.title + '</a> [<a class="show-origin-dialog" href="javascript:;" style="color:#ff0000;"> 查看更多 </a>]</p>';
                        }
                        else {
                            html += '<p>分享来源：<a target="_blank" href="' + item.url + '">' + item.title + '</a></p>';
                        }
                        html += '</div>';
                        $(".module-share-header").after(html);

                        $(document).on("click", ".show-origin-dialog", function () {
                            var title = "分享来源";
                            var body = '<div style="padding: 20px 20px;min-height: 120px; max-height: 300px; overflow-y: auto;">';

                            data.list.forEach(function (item, index) {
                                body += '<p>' + (++index) + '：<a target="_blank" href="' + item.url + '">' + item.title + '</a></p>';
                            });

                            body += '</div>';
                            var footer = obj.renderFooterAppId();
                            obj.showDialog(title, body, footer);
                        });
                    }
                    else {
                        obj.showTipError("暂未查询到分享的来源");
                    }
                }
            });
        };

        obj.initButtonShare = function () {
            if ($(".x-button-box").length) {
                var html = '<a class="g-button nd-button-build"><span class="g-button-right"><em class="icon icon-disk" title="下载"></em><span class="text">生成链接</span></span></a>';
                $(".x-button-box").append(html);
            }
            else {
                logger.warn("wait initButtonShare...");
                setTimeout(obj.initButtonShare, 500);
            }
        };

        obj.initButtonHome = function () {
            var listTools = obj.getSystemContext().Broker.getButtonBroker("listTools");
            if (listTools && listTools.$box) {
                var html = '<a class="g-button nd-button-build"><span class="g-button-right"><em class="icon icon-disk" title="下载"></em><span class="text">生成链接</span></span></a>';
                $(listTools.$box).prepend(html);
            }
            else {
                logger.warn("wait initButtonHome...");
                setTimeout(obj.initButtonHome, 500);
            }
        };

        obj.initButtonTimeLine = function () {
            if ($(".module-operateBtn .group-button").length) {
                var html = '<span class="button"><a class="g-v-button g-v-button-middle nd-button-build"><span class="g-v-button-right"><em class="icon icon-disk"></em><span class="text">生成链接</span></span></a></span>';
                $(".module-operateBtn .group-button").prepend(html);
            }
            else {
                logger.warn("wait initButtonTimeLine...");
                setTimeout(obj.initButtonTimeLine, 500);
            }
        };

        obj.initButtonEvent = function () {
            // 生成链接
            $(document).on("click", ".nd-button-build", function () {
                var yunData = obj.getYunData();
                if (yunData.MYUK) {
                    var fileList = obj.getSelectedFileList();
                    var fileStat = obj.getFileListStat(fileList);
                    if (fileList.length) {
                        if (fileList.length > 1 && fileStat.file_num) {
                            obj.showDownloadSelect(fileList, fileStat);
                        }
                        else if (fileStat.file_num == 1 && !obj.isHomePage()) {
                            obj.showDownloadSingle(fileList, fileStat);
                        }
                        else {
                            var pack = fileStat.file_num ? false : true;
                            if (obj.isHomePage()) {
                                obj.showDownloadInfoHome(fileList, pack);
                            }
                            else {
                                obj.showDownloadInfoShare(fileList, pack);
                            }
                        }
                    }
                    else {
                        obj.showTipError("请至少选择一个文件或文件夹");
                    }
                }
                else {
                    obj.showLogin();
                }
            });

            // 压缩包
            $(document).on("click", ".nd-button-pack", function () {
                var fileList = obj.getSelectedFileList();
                if (obj.isHomePage()) {
                    obj.showDownloadInfoHome(fileList, true);
                }
                else {
                    obj.showDownloadInfoShare(fileList, true);
                }
            });

            // 多文件
            $(document).on("click", ".nd-button-multi", function () {
                var fileList = obj.getSelectedFileList();

                // 过滤文件夹
                fileList = obj.filterFileListDir(fileList);

                if (obj.isHomePage()) {
                    obj.showDownloadInfoHomeOffical(fileList, false);
                }
                else {
                    obj.showDownloadInfoShareOffical(fileList, false);
                }
            });

            // 多文件
            $(document).on("click", ".nd-button-api", function () {
                var fileList = obj.getSelectedFileList();

                // 过滤文件夹
                fileList = obj.filterFileListDir(fileList);

                if (obj.isHomePage()) {
                    obj.showDownloadInfoHome(fileList, false);
                }
                else {
                    obj.showDownloadInfoShare(fileList, false);
                }
            });

            // 应用ID
            $(document).on("click", ".nd-change-app-id", function () {
                obj.showAppIdChange();
            });
            $(document).on("change", ".nd-input-app-id", function () {
                obj.setAppId(this.value);
            });

            // 打开配置页
            $(document).on("click", ".nd-open-page-option", function () {
                runtime.openOptionsPage();
            });

            // 打开临时页面
            $(document).on("click", ".nd-open-page-temp", function () {
                router.openTab("https://pan.baidu.com/disk/home#/all?vmode=list&path=" + encodeURIComponent(obj.getTempPath()), true);
            });
        };

        obj.showLogin = function () {
            obj.getJquery()("[node-type='header-login-btn']").click();
        };

        obj.showDownloadInfoShare = function (fileList, pack) {
            logger.info(fileList);
            if (pack) {
                obj.showDownloadInfoShareOffical(fileList, pack);
            }
            else {
                obj.applyTransferFile(fileList, obj.getTempPath(), function (response) {
                    if (response && response.extra && response.extra.list) {
                        var listMap = {};
                        response.extra.list.forEach(function (item) {
                            listMap[item.from_fs_id] = item;
                        });

                        var downList = [];
                        fileList.forEach(function (item) {
                            if (listMap.hasOwnProperty(item.fs_id)) {
                                var fileName = listMap[item.fs_id].from.split("/").pop();
                                if (item.server_filename.indexOf(".") == 0) {
                                    item.server_filename = fileName;
                                }
                                item.dlink = obj.buildDownloadUrl(listMap[item.fs_id].to, fileName);
                                downList.push(item);
                            }
                        });
                        obj.showDownloadLinkFile(downList);
                    }
                });
            }
        };

        obj.showDownloadInfoShareOffical = function (fileList, pack) {
            obj.getDownloadShare(fileList, pack, function (response) {
                obj.hideTip();
                logger.info(response);

                if (response.list && response.list.length) {
                    // 文件
                    obj.showDownloadLinkFile(response.list);
                }
                else if (response.dlink) {
                    // 压缩包
                    obj.showDownloadLinkPack(fileList, {
                        dlink: response.dlink
                    });
                }
                else {
                    // 其他
                    obj.showDialogUnKnownResponse(response);
                }
            });
        };

        obj.showDownloadInfoHome = function (fileList, pack) {
            logger.info(fileList);
            if (pack) {
                obj.getDownloadHome(fileList, pack, function (response) {
                    obj.hideTip();
                    logger.info(response);

                    if (response.dlink && typeof response.dlink == "string") {
                        // 压缩包
                        obj.showDownloadLinkPack(fileList, {
                            dlink: response.dlink
                        });
                    }
                    else {
                        // 其他
                        obj.showDialogUnKnownResponse(response);
                    }
                });
            }
            else {
                fileList.forEach(function (item) {
                    item.dlink = obj.buildDownloadUrl(item.path, item.server_filename);
                });
                obj.showDownloadLinkFile(fileList);
            }
        };

        obj.showDownloadInfoHomeOffical = function (fileList, pack) {
            logger.info(fileList);
            obj.getDownloadHome(fileList, pack, function (response) {
                obj.hideTip();
                logger.info(response);

                if (response.dlink && typeof response.dlink == "object" && response.dlink.length) {
                    // 文件
                    var dlinkMapping = {};
                    response.dlink.forEach(function (item) {
                        dlinkMapping[item.fs_id] = item.dlink;
                    });

                    fileList.forEach(function (item) {
                        item.dlink = dlinkMapping[item.fs_id];
                    });
                    obj.showDownloadLinkFile(fileList);
                }
                else if (response.dlink && typeof response.dlink == "string") {
                    // 压缩包
                    obj.showDownloadLinkPack(fileList, {
                        dlink: response.dlink
                    });
                }
                else {
                    // 其他
                    obj.showDialogUnKnownResponse(response);
                }
            });
        };

        obj.showDownloadLinkFile = function (fileList) {
            var title = "文件下载";
            var body = '<div style="padding: 20px 20px;min-height: 120px; max-height: 300px; overflow-y: auto; ">';

            fileList.forEach(function (item, index) {
                body += '<div style="margin-bottom: 10px;">';

                body += '<div>' + (index + 1) + '：' + item.server_filename + '</div>';

                body += '<div><a href="' + item.dlink + '&filename=' + encodeURIComponent(item.server_filename) + '" title="' + item.dlink + '" style="display:block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">' + item.dlink + '</a></div>';

                body += '</div>';
            });
            body += '</div>';
            var footer = obj.renderFooterAppId();
            obj.showDialog(title, body, footer);
        };

        obj.showDownloadLinkPack = function (fileList, data) {
            var title = "文件下载";
            var body = '<div style="padding: 20px 20px;min-height: 120px; max-height: 300px; overflow-y: auto; ">';

            var packName = obj.getDownloadPackName(fileList);
            body += '<div>' + packName + '</div><div><a href="' + data.dlink + '&zipname=' + encodeURIComponent(packName) + '" title="' + data.dlink + '" style="display:block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">' + data.dlink + '</a></div>';

            body += '<div style="margin-top: 15px;">打包的文件/文件夹列表</div>';
            fileList.forEach(function (item, index) {
                body += '<div title="' + item.path + '" style="color: ' + (item.isdir ? "blue" : "inherit") + ';">[' + (index + 1) + '] ' + item.server_filename + '</div>';
            });

            body += '</div>';
            var footer = obj.renderFooterAppId();
            obj.showDialog(title, body, footer);
        };

        obj.getDownloadPackName = function (fileList) {
            return fileList[0].server_filename + " 等" + fileList.length + "个文件.zip";
        };

        obj.buildDownloadUrl = function (path, name) {
            return "https://pcs.baidu.com/rest/2.0/pcs/file?method=download&app_id=" + obj.getAppId() + "&filename=" + encodeURIComponent(name) + "&path=" + encodeURIComponent(path);
        };

        obj.showDownloadSingle = function (fileList, fileStat) {
            var title = "链接类型";
            var body = '<div style="padding: 40px 20px; max-height: 300px; overflow-y: auto;">';

            body += '<div class="normalBtnBox g-center">';
            body += '<a class="g-button g-button-large g-button-gray-large nd-button-multi" title="调用官方接口生成链接"><span class="g-button-right"><em class="icon icon-download"></em> 官方链接</span></a>';
            body += '<a class="g-button g-button-large g-button-gray-large nd-button-api" style="margin-left:50px;" title="以转存文件的方式间接生成文件链接"><span class="g-button-right"><em class="icon icon-save-disk"></em> 转存链接</span></a>';
            body += '</div>';

            if (fileStat.dir_num) {
                body += '<div style="margin-top: 40px; padding-top: 10px; margin-bottom: -20px; border-top: 1px solid #D0DFE7;"><p class="g-center">选择 [多文件] 会过滤当前选中的 <span style="color: red">' + fileStat.dir_num + '</span> 个文件夹</p>';

                var index = 1;
                fileList.forEach(function (item) {
                    if (item.isdir) {
                        body += '<p title="' + item.path + '" style="color: blue;">[' + index + '] ' + item.server_filename + '</p>';
                        index++;
                    }
                });
                body += '</div>';
            }

            body += '</div>';
            var footer = obj.renderFooterAppId();
            obj.showDialog(title, body, footer);
        };

        obj.showDownloadSelect = function (fileList, fileStat) {
            var title = "链接类型";
            var body = '<div style="padding: 40px 20px; max-height: 300px; overflow-y: auto;">';

            body += '<div class="normalBtnBox g-center">';
            body += '<a class="g-button g-button-large g-button-gray-large nd-button-multi"><span class="g-button-right" title="调用官方接口生成文件链接"><em class="icon icon-download"></em> 官方多文件</span></a>';
            if (obj.isHomePage()) {
                body += '<a class="g-button g-button-large g-button-gray-large nd-button-api" style="margin-left:50px;" title="以构造链接的形式生成文件链接"><span class="g-button-right"><em class="icon icon-save-disk"></em> 接口多文件</span></a>';
            }
            else {
                body += '<a class="g-button g-button-large g-button-gray-large nd-button-api" style="margin-left:50px;" title="以转存文件的方式间接生成文件链接"><span class="g-button-right"><em class="icon icon-save-disk"></em> 转存多文件</span></a>';
            }
            body += '<a class="g-button g-button-large g-button-gray-large nd-button-pack" style="margin-left:50px;" title="调用官方接口生成压缩包链接"><span class="g-button-right"><em class="icon icon-poly"></em> 压缩包</span></a>';
            body += '</div>';

            if (fileStat.dir_num) {
                body += '<div style="margin-top: 40px; padding-top: 10px; margin-bottom: -20px; border-top: 1px solid #D0DFE7;"><p class="g-center">选择 [多文件] 会过滤当前选中的 <span style="color: red">' + fileStat.dir_num + '</span> 个文件夹</p>';
                var index = 1;
                fileList.forEach(function (item) {
                    if (item.isdir) {
                        body += '<p title="' + item.path + '" style="color: blue;">[' + index + '] ' + item.server_filename + '</p>';
                        index++;
                    }
                });
                body += '</div>';
            }

            body += '</div>';
            var footer = obj.renderFooterAppId();
            obj.showDialog(title, body, footer);
        };

        obj.showAppIdChange = function () {
            var title = "应用ID";
            var body = '<div style="padding: 60px 20px; max-height: 300px; overflow-y: auto;"><div class="g-center" style="margin-bottom: 10px;">当前应用ID：<input type="text" class="nd-input-app-id" style="border: 1px solid #f2f2f2; padding: 4px 5px;" value="' + obj.getAppId() + '"></div><div class="g-center"><p>如生成链接或者下载文件异常，请尝试修改为官方应用ID【' + obj.app_id + '】
修改应用ID可能存在未知的风险，请慎重使用，更多应用ID请查看https://greasyfork.org/zh-CN/scripts/378301"> 脚本主页 

';
            var footer = '';
            obj.showDialog(title, body, footer);
        };

        obj.showDialogUnKnownResponse = function (response) {
            var title = "未知结果";
            var body = '<div style="padding: 20px 20px; max-height: 300px; overflow-y: auto;"><pre style="white-space: pre-wrap; word-wrap: break-word; word-break: break-all;">' + JSON.stringify(response, null, 4) + '</pre></div>';
            var footer = obj.renderFooterAppId();
            obj.showDialog(title, body, footer);
        };

        obj.renderFooterAppId = function () {
            return '<p style="padding-top: 10px; border-top: 1px solid #D0DFE7;">应用ID：' + obj.getAppId() + ' <a href="javascript:;" class="nd-change-app-id">修改</a>，其他页面： <a class="nd-open-page-option" href="javascript:;">配置页面</a> 、<a class="nd-open-page-temp" href="javascript:;">临时文件</a></p>';
        };

        obj.showDialog = function (title, body, footer) {
            var dialog = obj.require("system-core:system/uiService/dialog/dialog.js").verify({
                title: title,
                img: "img",
                vcode: "vcode"
            });

            // 内容
            $(dialog.$dialog).find(".dialog-body").safeHtml(body);

            // 底部
            $(dialog.$dialog).find(".dialog-footer").safeHtml(footer);

            dialog.show();
        };

        obj.showTipSuccess = function (msg, hasClose, autoClose) {
            obj.showTip("success", msg, hasClose, autoClose);
        };

        obj.showTipError = function (msg, hasClose, autoClose) {
            obj.showTip("failure", msg, hasClose, autoClose);
        };

        obj.showTipLoading = function (msg, hasClose, autoClose) {
            obj.showTip("loading", msg, hasClose, autoClose);
        };

        obj.showTip = function (mode, msg, hasClose, autoClose) {
            var option = {
                mode: mode,
                msg: msg
            };

            // 关闭按钮
            if (typeof hasClose != "undefined") {
                option.hasClose = hasClose;
            }

            // 自动关闭
            if (typeof autoClose != "undefined") {
                option.autoClose = autoClose;
            }

            obj.require("system-core:system/uiService/tip/tip.js").show(option);
        };

        obj.hideTip = function () {
            obj.require("system-core:system/uiService/tip/tip.js").hide({
                hideTipsAnimationFlag: 1
            });
        };

        obj.isHomePage = function () {
            var url = router.getUrl();
            if (url.indexOf(".baidu.com/disk") > 0) {
                return true;
            }
            else {
                return false;
            }
        };

        obj.isTimelinePage = function () {
            var url = router.getUrl();
            if (url.indexOf(".baidu.com/disk/timeline") > 0) {
                return true;
            }
            else {
                return false;
            }
        };

        obj.isSharePageMulti = function () {
            var yunData = obj.getYunData();
            if (yunData.SHAREPAGETYPE == "single_file_page") {
                return false;
            }
            else {
                return true;
            }
        };

        obj.getSelectedFileList = function () {
            if (obj.isHomePage()) {
                return obj.getSelectedFileListHome();
            }
            else {
                return obj.getSelectedFileListShare();
            }
        };

        obj.getSelectedFileListHome = function () {
            if (obj.isTimelinePage()) {
                return obj.require("pan-timeline:widget/store/index.js").getters.getChoosedItemArr;
            }
            else {
                return obj.require('system-core:context/context.js').instanceForSystem.list.getSelected();
            }
        };

        obj.getSelectedFileListShare = function () {
            return obj.require('system-core:context/context.js').instanceForSystem.list.getSelected();
        };

        obj.getFileListStat = function (fileList) {
            var fileStat = {
                file_num: 0,
                dir_num: 0
            };
            fileList.forEach(function (item) {
                if (item.isdir == 0) {
                    fileStat.file_num++;
                }
                else {
                    fileStat.dir_num++;
                }
            });
            return fileStat;
        };

        obj.filterFileListDir = function (fileList) {
            var fileListFilter = [];
            fileList.forEach(function (item) {
                if (item.isdir == 0) {
                    fileListFilter.push(item);
                }
            });
            return fileListFilter;
        };

        obj.parseFidList = function (fileList) {
            var fidList = [];
            fileList.forEach(function (item) {
                fidList.push(item.fs_id);
            });
            return fidList;
        };

        obj.getDownloadShare = function (fileList, pack, callback) {
            obj.showTipLoading("生成链接中，请稍等...");
            obj.initWidgetContext("function-widget-1:download/util/context.js");
            obj.async("function-widget-1:download/service/dlinkService.js", function (dl) {
                var yunData = obj.getYunData();
                var data = {
                    list: fileList,
                    share_uk: yunData.SHARE_UK,
                    share_id: yunData.SHARE_ID,
                    sign: yunData.SIGN,
                    timestamp: yunData.TIMESTAMP,
                    type: pack ? "batch" : "nolimit"
                };
                dl.getDlinkShare(data, callback);
            });
        };

        obj.getDownloadHome = function (fileList, pack, callback) {
            obj.showTipLoading("生成链接中，请稍等...");
            obj.initWidgetContext("function-widget-1:download/util/context.js");
            obj.async("function-widget-1:download/service/dlinkService.js", function (dl) {
                var fidList = obj.parseFidList(fileList);
                var type = pack ? "batch" : "nolimit";
                dl.getDlinkPan(JSON.stringify(fidList), type, callback);
            });
        };

        obj.applyTransferFile = function (fileList, path, callback) {
            obj.listDir(path, function (response) {
                if (response && response.errno == 0) {
                    obj.transferFile(fileList, path, callback);
                }
                else if (response) {
                    obj.createDir(path, function (response) {
                        if (response && response.errno == 0) {
                            obj.transferFile(fileList, response.path, callback);
                        }
                        else {
                            callback && callback("");
                        }
                    });
                }
                else {
                    callback && callback("");
                }
            });
        };

        obj.transferFile = function (fileList, path, callback) {
            var yunData = obj.getYunData();
            var fidList = obj.parseFidList(fileList);
            var url = "/share/transfer?ondup=newcopy&async=1&shareid=" + yunData.SHARE_ID + "&from=" + yunData.SHARE_UK;
            var data = {
                fsidlist: "[" + fidList.join(",") + "]",
                path: path
            };
            obj.ajax({
                type: "post",
                url: url,
                data: data,
                dataType: "json",
                timeout: 1e5,
                error: function () {
                    callback && callback("");
                },
                success: function (response) {
                    callback && callback(response);
                }
            });
        };

        obj.listDir = function (path, callback) {
            var url = "/api/list";
            obj.ajax({
                type: "get",
                url: url,
                data: {
                    order: "name",
                    desc: 0,
                    showempty: 0,
                    web: 1,
                    page: 1,
                    num: 10,
                    dir: path
                },
                dataType: "json",
                timeout: 1e5,
                error: function () {
                    callback && callback("");
                },
                success: function (response) {
                    callback && callback(response);
                }
            });
        };

        obj.createDir = function (path, callback) {
            var url = "/api/create?a=commit";
            obj.ajax({
                type: "post",
                url: url,
                data: {
                    path: path,
                    isdir: 1,
                    block_list: "[]"
                },
                dataType: "json",
                timeout: 1e5,
                error: function () {
                    callback && callback("");
                },
                success: function (response) {
                    callback && callback(response);
                }
            });
        };

        obj.getShareId = function () {
            var match;

            match = location.href.match(/share\/init\?surl=([a-z0-9-_]+)/i);
            if (match) {
                return match[1];
            }

            match = location.pathname.match(/\/s\/1([a-z0-9-_]+)/i);
            if (match) {
                return match[1];
            }

            return null;
        };

        obj.isPwdShareOpen = function () {
            return option.isOptionActive(option.constant.baidu_share_status);
        };

        obj.getYunData = function () {
            if (!obj.yun_data) {
                obj.yun_data = unsafeWindow.yunData;
            }
            return obj.yun_data;
        };

        obj.getTempPath = function () {
            var tempPath = config.getConfig("temp_path");
            if (tempPath) {
                return tempPath;
            }
            else {
                return obj.temp_path;
            }
        };

        obj.setTempPath = function (tempPath) {
            config.setConfig("temp_path", tempPath);
        };

        obj.getAppId = function () {
            var appId = config.getConfig("app_id");
            if (appId) {
                return appId;
            }
            else {
                return obj.app_id;
            }
        };

        obj.setAppId = function (appId) {
            config.setConfig("app_id", appId);
        };

        obj.initWidgetContext = function (name, callback) {
            var initFunc = function (widget) {
                if (!widget.getContext()) {
                    widget.setContext(obj.getSystemContext());
                }
                callback && callback();
            };
            if (callback) {
                obj.async(name, initFunc);
            }
            else {
                initFunc(obj.require(name));
            }
        };

        obj.ajax = function (option) {
            obj.getJquery().ajax(option);
        };

        obj.getSystemContext = function () {
            return obj.require("system-core:context/context.js").instanceForSystem;
        };

        obj.getJquery = function () {
            return obj.require("base:widget/libs/jquerypacket.js");
        };

        obj.require = function (name) {
            return unsafeWindow.require(name);
        };

        obj.async = function (name, callback) {
            unsafeWindow.require.async(name, callback);
        };

        return obj;
    });

    container.define("app_weiyun", ["router", "option", "logger", "unsafeWindow", "constant", "runtime", "api", "shareLog", "$"], function (router, option, logger, unsafeWindow, constant, runtime, api, shareLog, $) {
        var obj = {
            axios: null,
            modal: null,
            store: null,
            inject_name: "_nd_inject_",
            webpack_require: null,
            verify_page: {
                setPwd: null,
                share_pwd: null,
                submit_pwd: null
            }
        };

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("share.weiyun.com") > 0) {
                option.isOptionActive(option.constant.weiyun_page_verify) && obj.initVerifyPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initVerifyPage = function () {
            obj.initWebpackRequire(function () {
                obj.registerStoreSharePwd();
            });


            obj.initVerifyPageElement(function () {
                obj.autoPaddingSharePwd();
                obj.registerPwdShareSwitch();
            });
        };

        obj.initVerifyPageElement = function (callback) {
            var shareId = obj.getShareId();
            var $pwd = $(".card-inner .input-txt[type='password']");
            var $button = $(".card-inner .btn-main");
            if (shareId && $pwd.length && $button.length) {

                // 显示分享密码
                $pwd.attr("type", "text");

                // 设置分享密码
                obj.verify_page.setPwd = function (pwd) {
                    $pwd.val(pwd);
                };

                // 重造按钮
                var $itemButton = $button.parent();
                $itemButton.safeHtml($button.prop("outerHTML"));
                $button = $itemButton.find(".btn-main");

                // 按钮事件
                $button.on("click", function () {
                    obj.getStore() && obj.getStore().default.dispatch("shareInfo/loadShareInfoWithoutLogin", $pwd.val());
                });

                // 提交密码
                obj.verify_page.submit_pwd = function () {
                    $button.click();
                };

                callback && callback();
            }
            else {
                setTimeout(function () {
                    obj.initVerifyPageElement(callback);
                }, 500);
            }
        };

        obj.initWebpackRequire = function (callback) {
            var moreModules = {};
            moreModules[obj.inject_name] = function (module, exports, __webpack_require__) {
                obj.webpack_require = __webpack_require__;
                callback && callback();
            };
            unsafeWindow.webpackJsonp([obj.inject_name], moreModules, [obj.inject_name]);
        };

        obj.autoPaddingSharePwd = function () {
            var shareId = obj.getShareId();
            var shareLink = obj.getShareLink();
            api.querySharePwd(constant.source.weiyun, shareId, shareLink, function (response) {
                if (response && response.code == 1) {
                    var sharePwd = response.data.share_pwd;
                    obj.verify_page.share_pwd = sharePwd;
                    obj.verify_page.setPwd(sharePwd);
                    obj.showTipSuccess("填充密码成功");

                    if (option.isOptionActive(option.constant.weiyun_auto_jump)) {
                        obj.verify_page.submit_pwd && obj.verify_page.submit_pwd();
                    }
                }
                else {
                    obj.showTipError("暂无人分享密码");
                }
            });
        };

        obj.registerPwdShareSwitch = function () {
            // 添加开关
            $(".card-inner .form-item-label .form-item-tit").safeHtml('<span class="form-item-tit">请输入分享密码<span style="margin-left: 45px;"><input type="checkbox" checked id="nd-share-check" style="vertical-align: middle;"> <a class="nd-open-page-option" href="javascript:;" title="点击查看更多脚本配置">共享密码</a></span></span>');
            obj.isPwdShareOpen() || $("#nd-share-check").removeAttr("checked");

            // 开关-事件
            $("#nd-share-check").on("change", function () {
                if ($(this).is(':checked')) {
                    option.setOptionActive(option.constant.weiyun_share_status);
                }
                else {
                    option.setOptionUnActive(option.constant.weiyun_share_status);
                }
            });

            // 打开配置页
            $(".nd-open-page-option").click(function () {
                runtime.openOptionsPage();
            });
        };

        obj.registerStoreSharePwd = function () {
            obj.addResponseInterceptor(function (request, response) {
                var requestUrl = request.responseURL;
                if (requestUrl.indexOf("weiyunShareNoLogin/WeiyunShareView") > 0) {
                    if (response.data.data.rsp_header.retcode == 0) {
                        var match = response.config.data.match(/\\"share_pwd\\":\\"([\w]+)\\"/);
                        if (!match) {
                            return logger.warn("pwd share not match");
                        }

                        var sharePwd = match[1];
                        if (sharePwd == obj.verify_page.share_pwd) {
                            return logger.warn("pwd share not change");
                        }

                        if (!obj.isPwdShareOpen()) {
                            return logger.warn("pwd share closed");
                        }

                        var shareId = obj.getShareId();
                        var shareLink = obj.getShareLink();
                        shareLog.addShareLog(shareId, sharePwd, shareLink, constant.source.weiyun);
                    }
                    else {
                        return logger.warn("pwd share error");
                    }
                }
            });
        };

        obj.addResponseInterceptor = function (callback) {
            var success = function (response) {
                try {
                    callback && callback(response.request, response);
                }
                catch (e) {
                    logger.warn(e);
                }
                return response;
            };
            var error = function () {
                return Promise.reject(error);
            };
            obj.getAxios() && obj.getAxios().interceptors.response.use(success, error);
        };

        obj.showTipSuccess = function (msg) {
            obj.getModal() && obj.getModal().success(msg);
        };

        obj.showTipError = function (msg) {
            obj.getModal() && obj.getModal().error(msg);
        };

        obj.getShareId = function () {
            var url = router.getUrl();
            var match = url.match(/share.weiyun.com\/([0-9a-z]+)/i);
            return match ? match[1] : null;
        };

        obj.getShareLink = function () {
            return router.getUrl();
        };

        obj.isPwdShareOpen = function () {
            return option.isOptionActive(option.constant.weiyun_share_status);
        };

        obj.getAxios = function () {
            if (!obj.axios) {
                obj.axios = obj.matchWebpackModule(function (module, name) {
                    if (module && module.Axios) {
                        return module;
                    }
                });
            }
            return obj.axios;
        };

        obj.getModal = function () {
            if (!obj.modal) {
                obj.modal = obj.matchWebpackModule(function (module, name) {
                    if (module && module.confirm && module.success) {
                        return module;
                    }
                });
            }
            return obj.modal;
        };

        obj.getStore = function () {
            if (!obj.store) {
                obj.store = obj.matchWebpackModule(function (module, name) {
                    if (module && module.default && module.default._modulesNamespaceMap) {
                        return module;
                    }
                });
            }
            return obj.store;
        };

        obj.matchWebpackModule = function (matchFunc) {
            var names = Object.keys(obj.webpack_require.c);
            for (var i in names) {
                var name = names[i];
                var match = matchFunc(obj.webpack_require(name), name);
                if (match) {
                    return match;
                }
            }
        };

        return obj;
    });

    container.define("app_lanzous", ["router", "option", "logger", "unsafeWindow", "constant", "runtime", "api", "shareLog", "$"], function (router, option, logger, unsafeWindow, constant, runtime, api, shareLog, $) {
        var obj = {
            verify_page: {
                setPwd: null,
                share_pwd: null,
                submit_pwd: null
            }
        };

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("lanzous.com") > 0) {
                option.isOptionActive(option.constant.lanzous_page_verify) && obj.initVerifyPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initVerifyPage = function () {
            obj.registerStoreSharePwd();

            obj.initVerifyPageElement(function () {
                obj.autoPaddingSharePwd();

                obj.registerPwdShareSwitch();
            });
        };

        obj.initVerifyPageElement = function (callback) {
            var shareId = obj.getShareId();
            var $pwd = $("#pwd");
            if (shareId && $pwd.length) {

                // 设置分享密码
                obj.verify_page.setPwd = function (pwd) {
                    $pwd.val(pwd);
                };

                // 提交密码
                obj.verify_page.submit_pwd = function () {
                    $("#sub").click();
                };

                callback && callback();
            }
            else {
                setTimeout(function () {
                    obj.initVerifyPageElement(callback);
                }, 500);
            }
        };

        obj.autoPaddingSharePwd = function () {
            var shareId = obj.getShareId();
            var shareLink = obj.getShareLink();
            api.querySharePwd(constant.source.lanzous, shareId, shareLink, function (response) {
                if (response && response.code == 1) {
                    var sharePwd = response.data.share_pwd;
                    obj.verify_page.share_pwd = sharePwd;
                    obj.verify_page.setPwd(sharePwd);
                    obj.showTip(1, "填充密码成功", 2000);

                    if (option.isOptionActive(option.constant.lanzous_auto_jump)) {
                        obj.verify_page.submit_pwd && obj.verify_page.submit_pwd();
                    }
                }
                else {
                    obj.showTip(0, "暂无人分享密码", 2000);
                }
            });
        };

        obj.registerPwdShareSwitch = function () {
            var html = '<div style="text-align: center; margin-top: 10px;">分享设置 <input type="checkbox" checked id="nd-share-check" style="vertical-align: middle;" > <a style="cursor: pointer;" class="nd-open-page-option" href="javascript:;" title="点击查看更多脚本配置">共享密码</a></div>';
            if ($(".off").length) {
                $(".off").after(html);
            }
            else {
                $(".passwddiv-user").after(html);
            }
            obj.isPwdShareOpen() || $("#nd-share-check").removeAttr("checked");

            // 开关-事件
            $("#nd-share-check").on("change", function () {
                if ($(this).is(':checked')) {
                    option.setOptionActive(option.constant.lanzous_share_status);
                }
                else {
                    option.setOptionUnActive(option.constant.lanzous_share_status);
                }
            });

            // 打开配置页
            $(".nd-open-page-option").click(function () {
                runtime.openOptionsPage();
            });
        };

        obj.registerStoreSharePwd = function () {
            unsafeWindow.$(document).ajaxComplete(function (event, xhr, options) {
                var match = options.data.match(/pwd=(\w+)/);
                if (!match) {
                    match = options.data.match(/p=(\w+)/);
                    if (!match) {
                        return logger.warn("pwd share not match");
                    }
                }

                var sharePwd = match[1];

                if (sharePwd == obj.verify_page.share_pwd) {
                    return logger.warn("pwd share not change");
                }

                if (!obj.isPwdShareOpen()) {
                    return logger.warn("pwd share closed");
                }

                var shareId = obj.getShareId();
                var shareLink = obj.getShareLink();
                var response = obj.parseJson(xhr.response);
                if (response && response.zt == 1 && sharePwd) {
                    shareLog.addShareLog(shareId, sharePwd, shareLink, constant.source.lanzous);
                }
                else {
                    logger.warn("pwd share error");
                }
            });
        };

        obj.showTip = function (code, msg, timeout) {
            if (unsafeWindow.sms) {
                unsafeWindow.sms(msg);
            }
            else {
                var selector;
                if ($(".off").length) {
                    selector = "#pwderr";
                }
                else {
                    selector = "#info";
                }
                if (code) {
                    $(selector).safeHtml('<span style="color: green;">' + msg + '</span>');
                }
                else {
                    $(selector).safeHtml('<span style="color: red;">' + msg + '</span>');
                }
                setTimeout(function () {
                    $(selector).text("");
                }, timeout);
            }
        };

        obj.getShareId = function () {
            var match;

            match = /lanzous.com\/([\w]+)\/([a-z0-9-_%]{4,})/gi.exec(location.href);
            if (match) {
                return match[1] + "/" + match[2];
            }

            match = /lanzous.com\/([a-z0-9-_]{4,})/gi.exec(location.href);
            if (match) {
                return match[1];
            }

            return location.pathname.substr(1);
        };

        obj.getShareLink = function () {
            return top.location.href;
        };

        obj.isPwdShareOpen = function () {
            return option.isOptionActive(option.constant.lanzous_share_status);
        };

        obj.parseJson = function (jsonStr) {
            var jsonObject = {};
            try {
                if (jsonStr) {
                    jsonObject = JSON.parse(jsonStr);
                }
            }
            catch (e) { }
            return jsonObject;
        };

        return obj;
    });

    container.define("app_189", ["router", "option", "logger", "constant", "api", "shareLog", "runtime", "unsafeWindow", "$"], function (router, option, logger, constant, api, shareLog, runtime, unsafeWindow, $) {
        var obj = {
            verify_page: {
                share_pwd: null
            }
        };

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("cloud.189.cn") > 0) {
                option.isOptionActive(option.constant.ty189_page_verify) && obj.initVerifyPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initVerifyPage = function () {
            obj.registerPwdShareSwitch();

            obj.registerStoreSharePwd();

            obj.autoPaddingSharePwd();
        };

        obj.registerPwdShareSwitch = function () {
            var html = '<span style="float:right"><input type="checkbox" checked id="nd-share-check" style="vertical-align: middle;"> <a class="nd-open-page-option one-pan-link-mark" title="点击查看更多脚本配置" style="cursor: pointer; text-decoration: underline;">共享提取码</a></span>';
            $(".code-panel .title").append(html);
            obj.isPwdShareOpen() || $("#nd-share-check").removeAttr("checked");

            // 开关-事件
            $("#nd-share-check").on("change", function () {
                if ($(this).is(':checked')) {
                    option.setOptionActive(option.constant.ty189_share_status);
                }
                else {
                    option.setOptionUnActive(option.constant.ty189_share_status);
                }
            });

            // 打开配置页
            $(".nd-open-page-option").click(function () {
                runtime.openOptionsPage();
            });
        };

        obj.registerStoreSharePwd = function () {
            unsafeWindow.$(document).ajaxComplete(function (event, xhr, options) {
                var response = xhr.responseJSON;
                var match = options.url.match(/accessCode=(\w+)/);
                if (response instanceof Object && response.digest && match) {
                    var sharePwd = match[1];

                    if (sharePwd == obj.verify_page.share_pwd) {
                        return logger.warn("pwd share not change");
                    }

                    if (!obj.isPwdShareOpen()) {
                        return logger.warn("pwd share closed");
                    }

                    var shareId = obj.getShareId();
                    var shareLink = obj.getShareLink();
                    shareLog.addShareLog(shareId, sharePwd, shareLink, constant.source.ty189);
                }
                else {
                    logger.warn("pwd share not match");
                }
            });
        };

        obj.autoPaddingSharePwd = function () {
            var shareId = obj.getShareId();
            var shareLink = obj.getShareLink();
            api.querySharePwd(constant.source.ty189, shareId, shareLink, function (response) {
                if (response && response.code == 1) {
                    var sharePwd = response.data.share_pwd;
                    obj.verify_page.share_pwd = sharePwd;

                    $("#code_txt").val(sharePwd);
                    obj.showTip(1, "填充访问码成功", 2000);

                    if (option.isOptionActive(option.constant.ty189_auto_jump)) {
                        setTimeout(function () {
                            unsafeWindow.$(".btn.visit").click();
                        }, 2000);
                    }
                }
                else {
                    obj.showTip(0, "暂无人分享访问码", 2000);
                }
            });
        };

        obj.showTip = function (code, msg, timeout) {
            var $element = $(".visit_error");
            if (code) {
                $element.safeHtml('<span style="color: green;">' + msg + '</span>');
            }
            else {
                $element.safeHtml('<span style="color: red;">' + msg + '</span>');
            }
            $element.show();
            setTimeout(function () {
                $element.hide();
            }, timeout);
        };

        obj.getShareId = function () {
            var url = router.getUrl();
            var match = url.match(/cloud\.189\.cn\/t\/([0-9a-z]+)/i);
            return match ? match[1] : null;
        };

        obj.getShareLink = function () {
            return location.href;
        };

        obj.isPwdShareOpen = function () {
            return option.isOptionActive(option.constant.ty189_share_status);
        };

        return obj;
    });

    container.define("app_manage", ["meta", "unsafeWindow"], function (meta, unsafeWindow) {
        var obj = {};

        obj.run = function () {
            if (meta.existMeta("manage")) {
                unsafeWindow.OnePan = container;
                return true;
            }
        };

        return obj;
    });

    container.define("app", ["appRunner"], function (appRunner) {
        var obj = {};

        obj.run = function () {
            appRunner.run([
                {
                    name: "app_baidu",
                    matchs: [
                        "baidu.com"
                    ]
                },
                {
                    name: "app_weiyun",
                    matchs: [
                        "weiyun.com"
                    ]
                },
                {
                    name: "app_lanzous",
                    matchs: [
                        "lanzous.com"
                    ]
                },
                {
                    name: "app_189",
                    matchs: [
                        "cloud.189.cn"
                    ]
                },
                {
                    name: "app_manage",
                    matchs: [
                        "*"
                    ]
                }
            ]);
        };

        return obj;
    });

    // lib
    container.define("$", [], function () {
        return window.$;
    });
    container.define("Snap", [], function () {
        if (typeof Snap != "undefined") {
            return Snap;
        }
        else {
            return window.Snap;
        }
    });
    container.define("DOMPurify", [], function () {
        if (typeof DOMPurify != "undefined") {
            return DOMPurify;
        }
        else {
            return window.DOMPurify;
        }
    });

    container.use(["gm", "core", "app"], function (gm, core, app) {
        gm.ready(function () {
            core.ready(app.run);
        });
    });
})();
