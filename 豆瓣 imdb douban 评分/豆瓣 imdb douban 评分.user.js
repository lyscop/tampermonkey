// ==UserScript==
// @name         豆瓣 imdb douban 评分
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  豆瓣页面显示imdb评分，功能仅此一项
// @author       批小将
// @match        https://movie.douban.com/subject/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let ratingTemplate = `<div class="rating_wrap clearbox">
<div class="clearfix">
<div class="rating_logo ll">IMDB评分</div>
</div>

<div class="rating_self clearfix">
<strong class="ll rating_num" >%score%<small>/10</small></strong>
</div>
</div>`;

    let titleTags = document.querySelectorAll('div#info > a');
    if (titleTags.length !== 0) {
        let title = 0;
        let titleText;
        for(let i = 0; i < titleTags.length; i++){
            titleText = titleTags[i].innerText;
            if(titleText.startsWith('tt')){
                title = titleText;
                break;
            }
        }
        let postData = 'title=' + title;

        let xhttp = new XMLHttpRequest();
        xhttp.responseType = 'text';
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                let ratingHtml = ratingTemplate.replace('%score%', this.responseText);
                let rating = document.getElementById('interest_sectl');
                rating.insertAdjacentHTML('beforeend', ratingHtml);
            }
        };
        xhttp.open("POST", "https://ptqtian.xyz/imdbapi", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(postData);
    }



})();
