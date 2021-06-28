// ==UserScript==
// @name         解除网易云仅扫码登录限制
// @namespace    https://github.com/nondanee
// @version      0.1
// @description  开放其他登录模式选择
// @author       nondanee
// @match        *://music.163.com/*
// @icon         https://www.google.com/s2/favicons?domain=music.163.com
// @grant        none
// ==/UserScript==
 
(function () {
	'use strict';
	var _open = XMLHttpRequest.prototype.open;
	window.XMLHttpRequest.prototype.open = function (_, url) {
		var _onreadystatechange = this.onreadystatechange, _this = this;
		_this.onreadystatechange = function () {
			if (
				_this.readyState === 4
				&& _this.status === 200
				&& url.indexOf('/user/login/type/switch') !== -1
			) {
				try {
					var data = JSON.parse(_this.responseText);
					data.data.allow = true;
					var value = JSON.stringify(data);
					Object.defineProperty(_this, 'responseText', { value: value });
				} catch (_) {}
			}
			if (_onreadystatechange) _onreadystatechange.call(_this);
		}
		return _open.apply(_this, arguments);
	}
})();
