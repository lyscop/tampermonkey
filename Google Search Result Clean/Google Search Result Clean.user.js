// ==UserScript==
// @name         Google Search Result Clean
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Remove "People also ask", "Featured Snippets", "Video", "Image", "Searches related to ...", "Twitter", etc. Remove naive websites.
// @home-url     https://greasyfork.org/zh-CN/scripts/393699
// @author       Saisai Lu
// @include      *://*.google.*/search*
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Remove naive and annoying websites.
    let hostsToBlock = ['www.w3schools.com', 'www.asciitable.com', 'www.dba-oracle.com', 'www.geeksforgeeks.org', 'www.tutorialspoint.com'];
    document.querySelectorAll('.g').forEach(result => {
        let a = result.querySelector('a');
        if (a && hostsToBlock.includes(a.host)) {
            result.remove();
        }
    });
 
    // remove 'Featured Snippets'
    let firstLine = document.querySelector('.g')
    firstLine.querySelectorAll('a').forEach(link => {
        if (link.textContent == 'About Featured Snippets') {
            firstLine.remove();
        }
    });
 
    let resultLines = document.querySelectorAll('.g');
 
    document.querySelector('g-section-with-header').remove();
 
    resultLines.forEach(resultLine => {
        let header;
        // remove 'People also ask'
        header = resultLine.querySelector('h2');
        if (header && header.textContent === 'People also ask') {
            resultLine.remove();
        }
 
        // remove 'Videos'
        header = resultLine.querySelector('h3');
        if (header && header.textContent === 'Videos') {
            resultLine.remove();
        }
 
        // remove images
        let a = resultLine.querySelector('a.iu-card-header');
        if (a && a.textContent.startsWith('Images for ')) {
            resultLine.remove();
        }
 
        // remove Twitter
        resultLine.querySelectorAll('span').forEach(span => {
            if (span.textContent == 'View on Twitter') {
                resultLine.remove();
            }
        });
 
    });
 
    // remove "Searches related to ..."
    document.getElementById('brs').remove();
})();
