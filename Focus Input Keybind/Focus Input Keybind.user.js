// ==UserScript==
// @name         Focus Input Keybind
// @namespace    https://github.com/kittenparry/
// @version      1.4.1
// @description  Focus to search or a certain text input with forward slash (/) key similar to YouTube.
// @author       kittenparry
// @match        *://*/*
// @grant        none
// @license      GPL-3.0-or-later
// ==/UserScript==
 
/* LIST:
 * *.booru.org
 * instagram.com/direct/
 * metal-tracker.com
 * nyaa.si
 * rarbg.to || rarbg2020.org
 * reddit.com
 * twitch.tv
 * wiktionary.org
 */
 
/* CHANGELOG:
 * 1.4.1: +rarbg2020.org (rarbg.to alternative)
 * 1.4: +nyaa.si +instagram.com/direct/
 * 1.3: +metal-tracker.com
 * 1.2: +*.booru.org
 * 1.1: +wiktionary.org
 * 1.0: initial
 */
 
check_focus_input_keybind = (e, val, special) => {
	var type = e.target.getAttribute('type');
	var tag = e.target.tagName.toLowerCase();
	if (type != 'text' && tag != 'textarea') {
		if (e.keyCode == 191) { // /
			if (special == 'reddit') {
				document.getElementById(val).firstChild.focus();
			} else if (special == 'instagram') {
				document.querySelector(val).firstChild.focus()
			} else if (special == 'selector') {
				document.querySelector(val).focus();
			} else {
				document.getElementById(val).focus();
			}
		}
	}
};
 
/* probably need a better way than simply .includes()
 * inid: id or other value of the input element
 * inspcl: when inid isn't an id (eg. a class) to specify it
 */
 
var current_url = window.location.href;
 
if (current_url.includes('.booru.org')) {
	var inid = 'tags';
} else if (current_url.includes('instagram.com/direct/')) {
	var inid = 'div[class="                    Igw0E     IwRSH      eGOV_        vwCYk                                        ItkAi                                                                       "]';
	var inspcl = 'instagram';
} else if (current_url.includes('metal-tracker.com')) {
	var inid = 'searchBox';
} else if (current_url.includes('nyaa.si')) {
	var inid = 'input[class="form-control search-bar"]';
	var inspcl = 'selector';
} else if (current_url.includes('rarbg.to') || current_url.includes('rarbg2020.org')) {
	var inid = 'searchinput';
} else if (current_url.includes('reddit.com')) {
	var inid = 'search';
	var inspcl = 'reddit';
} else if (current_url.includes('twitch.tv')) {
	var inid = 'textarea[class="tw-block tw-border-radius-medium tw-font-size-6 tw-full-width tw-textarea tw-textarea--no-resize"]';
	var inspcl = 'selector';
} else if (current_url.includes('wiktionary.org')) {
	var inid = 'searchInput';
}
 
if (inid != undefined) {
	try {
		// pass an empty string for input special so to not repeat the event listener code similar to other script
		if (!inspcl) {
			var inspcl = '';
		}
		// keyup instead of keydown to prevent the initial entry of a forward slash to input
		window.addEventListener('keyup', (e) => check_focus_input_keybind(e, inid, inspcl), false);
	} catch (e) {}
}
