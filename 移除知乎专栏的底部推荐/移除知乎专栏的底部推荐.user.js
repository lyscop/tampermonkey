// ==UserScript==
// @name     	移除知乎专栏的底部推荐
// @version  	1.2
// @match    	*//zhuanlan.zhihu.com/p/*
// @author   	GCNY
// @grant    	none
// @description	专栏的底部推荐真是又丑又大
// @namespace 	https://greasyfork.org/en/users/174988-tdkihrr
// ==/UserScript==
 
 
var clearRecommendation = function() {
	var recommendation = document.getElementsByClassName("Recommendations-Main")[0];
	if (typeof(recommendation) !== "undefined") {
		recommendation.style.display="none";
	}
};
 
var nIntervId = setInterval(clearRecommendation, 100);
