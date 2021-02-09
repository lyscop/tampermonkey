// ==UserScript==
// @name          Open links in current tab
// @author        wOxxOm
// @description   Open links in current tab regardless of _target or site's preferences. Ctrl-click: background tab, Ctrl-Shift-click: foreground tab, Shift-click: new window, Alt-click: force open in current tab
// @namespace     http://target._blank.is.retarded
// @version       2.2.8
// @include       *
// @run-at        document-start
// @grant         GM_openInTab
// ==/UserScript==
 
if (window == top) {
	window.addEventListener('message', function(e) {
		// some stupid sites choke on object data
		if (!/^\{/.test(e.data))
			return;
		var data = tryParse(e.data);
		if (data.name == GM_info.script.name)
			navigate(data.url);
	});
}
 
var suppressing, clickedElement;
window.addEventListener('mousedown', function(e) {
	clickedElement = e.target;
}, true);
 
window.addEventListener('mouseup', function(e) {
	if (e.button > 1 || e.target != clickedElement)
		return;
	var link = pierceShadow(e);
	if (!link
	|| (link.getAttribute('href') || '').match(/^(javascript|#|$)/)
	|| !document.contains(link))
		return;
	var b = e.button, c = e.ctrlKey, a = e.altKey, s = e.shiftKey, m = e.metaKey;
	if (b == 1 || c && !a && !m)
		GM_openInTab(link.href, !s || b == 1);
	else if (window.chrome && b === 0 && s && !c && !a && !m)
		link.cloneNode().dispatchEvent(new MouseEvent('click', {shiftKey: true}));
	else if (!c && !s && !m && !a) {
		if (link.target == '_blank')
			link.target = '';
		blockWindowOpenAndMutations(link);
		return;
	}
	else
		return;
	suppressing = true;
	prevent(e);
}, true);
 
window.addEventListener('click', prevent, true);
window.addEventListener('auxclick', prevent, true);
 
function prevent(e) {
	if (!suppressing)
		return;
	e.preventDefault();
	e.stopPropagation();
	e.stopImmediatePropagation();
	setTimeout(function() {
		suppressing = false;
	}, 50);
}
 
function blockWindowOpenAndMutations(link) {
	var observer = new MutationObserver(function() {
		if (link.target == '_blank') {
			link.removeAttribute('target');
			console.log('[Open links in current tab] prevented dynamic target=_blank for', link.href);
			navigate(link.href);
		}
	});
	observer.observe(link, {attributes:true, attributeFilter:['target'], characterData:true});
 
	var _open = unsafeWindow.open;
	var timeout = setTimeout(function() {
		unsafeWindow.open = _open;
		observer.disconnect();
	}, 50);
	unsafeWindow.open = exportFunction(function(url, name, features) {
		if (!features) {
			console.log('[Open links in current tab] prevented window.open for', url);
			navigate(link.href);
		} else
			_open(url, name, features);
		unsafeWindow.open = _open;
		clearTimeout(timeout);
	}, unsafeWindow);
}
 
function pierceShadow(e) {
	var el = e.target;
	while (el.shadowRoot) {
        var inner = el.shadowRoot.elementFromPoint(e.clientX, e.clientY);
        if (inner === el) break;
        el = inner;
    }
	return el.closest('a');
}
 
function navigate(url) {
	if (window == top) {
		var link = document.createElement('a');
		link.href = url;
		link.dispatchEvent(new MouseEvent('click'));
	} else
		top.postMessage(JSON.stringify({name: GM_info.script.name, url: url}), '*');
}
 
function tryParse(str) {
	try { return JSON.parse(str); }
	catch(e) {}
}
