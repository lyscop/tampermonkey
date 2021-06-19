// ==UserScript==
// @name        bilibili 换一换保留历史
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/
// @grant       none
// @version     1.0
// @author      -
// @description 2021/6/18 下午12:01:36
// @run-at      document-end
// ==/UserScript==
'use script';
 
(function(){
	var $ = function(a){return document.querySelector(a);};
	var has_next_btn = false;
 
	var his_arr = [];
	var his_index = -1;
 
 
	var cn_box = document.createElement('div');
	cn_box.classList = 'rcmd-box';
	cn_box.setAttribute('style', 
		'display : none;'+
		'top: -50%;'+
		'position: relative;'+
		'background: white;'+
		'z-index: 5;'
	);
 
	var cn = document.createElement('div');
	cn.setAttribute('style',
		'font-size: 1em;'+
		'width: 28px;'+
		'display: block;'+
		'background: white;'+
		'position: absolute;'+
		'top: 0;'+
		'right: -70px;'+
		'border-radius: 0.1em;'+
		'border: 1px solid #c0c0c0;'+
		'padding: 0.5em 0;'+
		'text-align: center;'
	);
	cn.innerHTML = '&emsp;<br>上<br>一<br>页';
 
	$('.rcmd-box-wrap .change-btn').addEventListener('click', function(){
		his_index = -1;
		cn_box.style.display = 'none';
 
		his_arr.push( $('.rcmd-box-wrap .rcmd-box').innerHTML );
 
		if( ! has_next_btn ){
			has_next_btn = true;
 
			$('.rcmd-box-wrap').appendChild( cn );
 
			$('.rcmd-box-wrap').appendChild( cn_box );
 
			cn.addEventListener('click', function(){
				if( his_index < 0 ){
					his_index = his_arr.length - 1;
				}
 
				cn_box.innerHTML = his_arr[his_index--];
				cn_box.style.display = '';
			});
		}
	});
}());
