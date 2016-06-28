// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the user clicks on the browser action.

renderSites();
function renderSites() {
  var sitesList = document.getElementById('sites-list');
  chrome.storage.local.get('sites', function(data) {
    var sites = data.sites;
    if(sites instanceof Array) {
      sites.forEach(function(item) {
        var listItem = document.createElement('li');
        var time = document.createElement('strong');
        var urlText = document.createTextNode(item.url);
        var timeText = document.createTextNode(item.time);
        
        listItem.appendChild(urlText);      
        time.appendChild(timeText);   
        listItem.appendChild(time); 
        sitesList.appendChild(listItem);  
      })
    }
  });
}