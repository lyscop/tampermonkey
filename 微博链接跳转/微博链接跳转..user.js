// ==UserScript==
// @name         微博链接跳转
// @namespace    http://tampermonkey.net/
// @version      1.5.3
// @description  try to take over the world!
// @author       zycat
// @match        *://*.weibo.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @run-at document-idle
// @connect      *
// ==/UserScript==

(function() {

    'use strict';
var setting = {
	log: false//是否打印日志
};
log_info('微博外链跳转 v1.0 load');
var _body = document.getElementsByTagName('body')[0];
var has_check = {};
check_url();
observe(_body);

function observe(target) {
	let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	let config = {
		childList: true,
		subtree: true
	};
	let observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.type == 'childList' && mutation.addedNodes !== null) {
				for (let i = 0; i < mutation.addedNodes.length; i++) {
					let n = mutation.addedNodes[i];
					if (n.tagName == 'DIV' && n.querySelectorAll("a[title='网页链接']").length > 0) {
						log_info('我出现啦');
						check_url();
					}else if(location.host=='s.weibo.com'&&n.tagName == 'DIV' && n.querySelectorAll('a[href*="//t.cn/"]').length > 0){
                        check_url();
                    }
				}
			}
		});
	});
	observer.observe(target, config);
}
function check_url() {
	// 遍历网页链接，如果链接是t.cn开头的就set试一下
    let link_list=[]
    if(location.host=='s.weibo.com'){
    link_list = document.querySelectorAll('a[href*="//t.cn/"]')
    }else{
    link_list = document.querySelectorAll("a[title='网页链接']");
    }
	
	for (let i = 0; i < link_list.length; i++) {
		let node = link_list[i];
		let href = node.href;
		if (href.indexOf('//t.cn/') != -1 && (has_check[href] == undefined || has_check[href].startsWith('http'))) {
			log_info('正在检查url是否被设置');
			set_url(href, node, has_check);
		}
	}
}

async function set_url(tcn, t_node, has_check) {
	if (has_check[tcn]) {
		if (has_check[tcn].startsWith('http')) {
			t_node.setAttribute('href', has_check[tcn]);
		}
		return;
	}
	let response;

	try {
		response = await get_url(tcn, t_node);
	} catch (error) {
		log_info('出错拉');
		console.error(error);
		return;
	}
	if (response.status > 299) {
		log_info('这是一个重定向');
		console.error(tcn);
		return;
	}
    var finalUrl=response.finalUrl
    var url='underfiedurl'
	if (finalUrl.indexOf('//t.cn/') != -1) {

         url = response.responseHeaders.split(' ')[10].slice(0, -7);
	 t_node.setAttribute('href', url);
	}
	has_check[tcn] = url;
	return url;
}


function xhr(option){
    return new Promise((resolve, reject) => {
		GM_xmlhttpRequest({
			...option,
			onerror: reject,
			onload: resolve
		});
	});
}
function get_url(tcn, t_node) {
	if (tcn.indexOf('//t.cn/') == -1) return;
	return xhr({
		method: 'GET',
		synchronous: false,
		url: tcn,
		headers: {
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36'
		}
	});
}

function log_info(txt) {
	if (setting.log) {
		GM_log( txt );
	}
}
function checkType(ele) {
	return Object.prototype.toString.call(ele).replace(/[\[\]]/g, '').split(' ')[1].toLowerCase();
}


})();
