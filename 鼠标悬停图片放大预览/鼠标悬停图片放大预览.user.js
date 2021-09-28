// ==UserScript==
// @name        鼠标悬停图片放大预览-大师兄
// @namespace   大师兄Scripts
// @match       *://*/*
// @grant       none
// @version     1.8
// @author      大师兄
// @description 2021/5/16上午12:56:31
// @require     https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// ==/UserScript==
window.onload = function() {
	console.log("图片放大");
 
	fangdatupian();
	function fangdatupian() {
		//添加图片盒子
		$("body:eq(0)").append("<div id='dashixiong_preview' style='padding:0px;margin:0px;width:10px;height:10px;left:0px;top:0px;background-color:#ff0000;position:fixed;z-index:999999;'><img src='#'  /></div>"); //弹出一个div里面放着图片
		$("#dashixiong_preview").stop(true, false).hide();
 
		$("body").on("mouseenter", "img",
		function(e) {
			let imgsrc = $(this).attr("src");
			$("#dashixiong_preview img").attr("src", imgsrc);
			getImageWidth(imgsrc,
			function(w, h) {
				$("#dashixiong_preview img").css({"height":h,"width":w});
			});
 
			//鼠标进到图片里就先执行图片位置
			tupianweizhi(e);
			$("#dashixiong_preview").stop(true, false).fadeIn();
 
			// 鼠标移动时给div挂事件
			$(this).mousemove(function(e) {
				tupianweizhi(e);
			});
 
			$(this).mouseleave(function(e) {
				$("#dashixiong_preview").stop(true, false).hide();
			});
		});
	}
	function getImageWidth(url, callback) {
		let img = new Image();
		img.src = url;
 
 
			img.onload = function() {
				callback(img.width, img.height);
		}
 
	}
 
	function tupianweizhi(e) {
 
		let jianxi = 20;
		let img_height = $("#dashixiong_preview img").height();
		let img_width = $("#dashixiong_preview img").width();
		let window_height = $(window).height();
		let window_width = $(document).width();
 
		if (img_height > window_height) {
			console.log("图片高度大于屏幕高度");
			$("#dashixiong_preview img").height(window_height);
		};
 
		if (img_width > window_width) {
			console.log("图片宽度大于屏幕宽度");
			$("#dashixiong_preview img").width(window_width);
		};
 
		if (img_height + e.clientY > window_height && img_width + e.clientX < window_width) {
			console.log("高度超过屏幕");
			if (img_height + e.clientY + jianxi > window_height) {
				$("#dashixiong_preview").css({
					top: (e.clientY - img_height - jianxi) < 0 ? 0 : e.clientY - img_height - jianxi,
					left: e.clientX + jianxi,
				});
			}
		} else if (img_width + e.clientX + jianxi > window_width && img_height + e.clientY < window_height) {
			console.log("宽度超过屏幕");
			$("#dashixiong_preview").css({
				top: e.clientY + jianxi,
				left: (e.clientX - img_width - jianxi) < 0 ? 0 : e.clientX - img_width - jianxi,
			});
		} else if (img_width + e.clientX > window_width && img_height + e.clientY > window_height) {
			console.log("高度和宽度超过屏幕");
			$("#dashixiong_preview").css({
				top: (e.clientY - img_height - jianxi) < 0 ? 0 : e.clientY - img_height - jianxi,
				left: (e.clientX - img_width - jianxi) < 0 ? 0 : e.clientX - img_width - jianxi,
			});
		} else {
			console.log("显示在鼠标右下");
			$("#dashixiong_preview").css({
				top: e.clientY + jianxi,
				left: e.clientX + jianxi,
			});
		}
 
	}
};
