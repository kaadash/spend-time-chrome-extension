// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the user clicks on the browser action.
var currentSite = {
	url: '',
	time: 0,
	start: 0,
	end: 0
}


function addSite(site) {
	console.log(site);
	chrome.storage.local.get('sites', function(data) {
		var sites = data.sites;
    	if(sites instanceof Array) {
			var newSites = [];
			var found = false;
    		sites.forEach(function(item) {
				if(item.url === site.url) {
					item.time = site.time;
					found = true;
					console.log('addd found',site);
				}
				newSites.push(item);
			});

			if(!found) {
				newSites.push(site);
			}

			chrome.storage.local.set({'sites': newSites}, function() {
	          console.log(newSites);
	        });
    	}
    	else {
    		var newSites = [
    			{
	    			url: site.url, 
	    			time: site.time, 
	    			start: site.start, 
	    			end: site.end
	    		}];
    		chrome.storage.local.set({'sites': newSites}, function() {
		          console.log('Settings saved');
		        });
    	}
	});
}

function normalizeUrl(url) {
	return url.match(/^[\w-]+:\/{2,}\[?([\w\.:-]+)\]?(?::[0-9]*)?/)[1];
}

function getSiteTime(siteUrl) {
	var time = 0;
	chrome.storage.local.get('sites', function(data) {
	    var sites = data.sites;
	    if(sites instanceof Array) {
	      sites.forEach(function(item) {
	      	if(item.url === siteUrl) {
				time = item.time;	 
	      		console.log('found', time);
	      	}
	      })
	    }
  	});
  return time;
}

chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        var url = normalizeUrl(tab.url);
        if(url !== currentSite.url) {
        	currentSite.end = new Date();
    		currentSite.time = getSiteTime(currentSite.url) + (currentSite.end - currentSite.start)/1000;
        	var currentSiteCopy = Object.assign({}, currentSite); 
    		// console.log(currentSite);
	    	addSite(currentSiteCopy);
    		currentSite.url = url;
    		currentSite.start = new Date();
        	currentSite.end = 0;
        	currentSite.time = 0;
        }
    });
});

// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
// 	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
// 	    var url = normalizeUrl(tabs[0].url);	    
//     	// console.log(currentSite, url, changeInfo);
//     	if(!currentSite.url) {
//     		currentSite.url = url;
//     		currentSite.start = new Date();
//     	}
//     	else {
// 		    if(changeInfo.url && normalizeUrl(changeInfo.url) !== url) {
// 		    	currentSite.end = new Date();
// 		    	currentSite.time = (currentSite.end - currentSite.start)/1000;
// 		    	addSite(currentSite);
// 		    	currentSite.url = normalizeUrl(changeInfo.url);
// 	    		currentSite.start = new Date();
// 	        	currentSite.end = 0;
// 	        	currentSite.time = 0;
// 		    }
//     	}
// 	});
// });
