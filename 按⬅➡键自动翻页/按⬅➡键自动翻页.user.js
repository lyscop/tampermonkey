// ==UserScript==
// @name         按⬅➡键自动翻页
// @namespace    http://www.infosec-wiki.com/
// @version      1.2
// @description  在需要翻页的网页中，使用按⬅➡键向前向后翻页
// @author       www.infosec-wiki.com
// @include      *
// @run-at       document-end
// @grant        none
// ==/UserScript==


var next_page_text = ["下一页", "下页", "next", ">", "»"];
var prev_page_text = ["上一页", "上页", "prev", "<", "«"];
var next_page_class = ["next"];
var prev_page_class = ["prev"];

function find_element_by_text(text){
    var elements = document.getElementsByTagName("a");
    for (var i=0;i<elements.length;i++){
        // if(elements[i].innerText == text){
        if(elements[i].innerText.toLowerCase().indexOf(text) != -1){
            console.log("Find: "+text);
            return elements[i];
        }
    }
    return false;
}

function find_element_by_class(class_name){
    var elements = document.getElementsByTagName("a");
    for (var i=0;i<elements.length;i++){
        if(elements[i].className.toLowerCase().indexOf(class_name) != -1){
            console.log("Find: "+class_name);
            return elements[i];
        }
    }
    return false;
}

function keydown(event){
    // console.log(event.keyCode);
     var ret = null;
     var i = null;
     var j = null;

    if(event.keyCode == 39){
        for(i in next_page_text){
            ret = find_element_by_text(next_page_text[i]);
            if(ret){
                ret.click();
                return true;
            }
        }

        for(i in next_page_class){
            ret = find_element_by_class(next_page_class[i]);
            if(ret){
                ret.click();
                return true;
            }
        }

    }
    if(event.keyCode == 37){
        for(j in prev_page_text){
            ret = find_element_by_text(prev_page_text[j]);
            if(ret){
                ret.click();
                return true;
            }
        }

        for(i in prev_page_class){
            ret = find_element_by_class(prev_page_class[i]);
            if(ret){
                ret.click();
                return true;
            }
        }
    }
}


(function() {
    'use strict';
    document.addEventListener('keydown', keydown, false);

})();
