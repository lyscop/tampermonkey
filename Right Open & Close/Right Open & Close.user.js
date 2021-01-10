// ==UserScript==
// @name        Right Open & Close
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       GM_openInTab
// @grant       window.close
// @run-at      document-start
// @version     1.1
// @author      leoshone
// @description RClick open link, Double RClick close tab
// ==/UserScript==
(function() {
  //Hide context menu, Press CTRL + RClick show context menu
  document.addEventListener('contextmenu', function(e) {
    if (!e.ctrlKey)
      e.preventDefault();
  }, false);
  
  //RClick open link in background tab, Double RClick close tab
  var clickNo = 0;
  var resetId;
  document.addEventListener('mousedown', function(e) {
    if (!e.ctrlKey && e.button == 2) {
      clickNo++;
      if (clickNo == 1) {
        resetId = setTimeout(function() {
          clickNo = 0;
          var href = e.target.href || e.target.parentNode.href || e.target.parentNode.parentNode.href;  
          if (href !== "" && !/^javascript:/i.test(href.toString()))
            GM_openInTab(href, {active: false, insert: false});
        }, 300);
      } else if (clickNo == 2) {
        clickNo = 0;
        clearTimeout(resetId);
        window.close();
      } 
    }
    else
      clickNo = 0;
  }, false);
})();
