// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the user clicks on the browser action.
//
//
//
var allowedregexp = [
                  "^/@.+",
                  "^/new",
                  "^/hot",
                  "^/trending",
                  "^/trending30",
                  "^/promoted",
                  "^/active",
                  "^/market",
                  "^/tags.html",
                  "^/recover_account_step_1",
                  "^/change_password",
                  "^/~witnesses",
                  "^/static/search.html",
                  "^/submit.html"
                  ];

var url;
var parser = document.createElement('a');

chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
    var url = info.url || tab.url;

    //parser = document.createElement('a');
    parser.href = url;

  if(parser.hostname == "steemit.com" || parser.hostname == "golos.io") {

    var hit = false;
    for(reg in allowedregexp) {

      patt=new RegExp(allowedregexp[reg]);

      if(patt.test(parser.pathname)) {

          hit = true;

          if(url && url.indexOf('https://steemit.com') > -1) {
            //update icon to golos
            chrome.browserAction.setIcon({path:"icon-golos.svg"});
            chrome.browserAction.setTitle({title: "View this page on Golos"});
          }
          else if(url && url.indexOf('https://golos.io') > -1) {
              //update icon to steemit
            chrome.browserAction.setIcon({path:"icon-steemit.svg"});
            chrome.browserAction.setTitle({title: "View this page on Steemit"});
          } else  {
            // update icon to default
            chrome.browserAction.setIcon({path:"default.svg"});
            chrome.browserAction.setTitle({title: "Steemit - Golos switcher [disabled]"});
          }

          break;
      }

    }

    if(!hit) {
      chrome.browserAction.setIcon({path:"default.svg"});
      chrome.browserAction.setTitle({title: "Steemit - Golos switcher [disabled]"});
    }


  } else {

      chrome.browserAction.setIcon({path:"default.svg"});
      chrome.browserAction.setTitle({title: "Steemit - Golos switcher [disabled]"});
  }

});



chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
//  alert(tab.url);
  url = tab.url;

  parser.href = url;
  var newdestination =  (parser.hostname == "steemit.com" ? "golos.io" :"steemit.com");

  if(parser.hostname == "steemit.com" || parser.hostname == "golos.io") {
    //var regexp username = /^/@[^/]+$/
    parser.hostname = newdestination = (parser.hostname == "steemit.com" ? "golos.io" :"steemit.com");


    var hit = false;
    for(reg in allowedregexp) {

      patt=new RegExp(allowedregexp[reg]);

      if(patt.test(parser.pathname)) {

          //console.log('YES GOT HIT ON '+allowedregexp[reg]);
          chrome.tabs.update({url: parser.protocol + parser.hostname + parser.pathname});
          hit = true;
          break;
      }

    }

    if(!hit) {
      if (window.Notification) {

      new Notification("Not Available", {
        icon: "default.png",
        title: "Not available",
        body: "The equivalent of this page is most probably not available on "+newdestination,
      });


      }
    }
    //

  }

});
