// Copyright 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use strict";

window.__firefox__.includeOnce("DownloadManager", function() {
  Object.defineProperty(window, "$<downloadManager>", {
    value: {}
  })

  Object.defineProperty($<downloadManager>, "postMessage", {
    value: function (msg) {
        if (msg) {
            webkit.messageHandlers.$<handler>.postMessage(msg);
        }
    }
  })

  Object.defineProperty($<downloadManager>, "download", {
    value: function (link) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "arraybuffer";
        xhr.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE) {
                if (this.status == 200) {
                    var byteArray = new Uint8Array(this.response);
                    var binaryString = new Array(byteArray.length);

                    for (var i = 0; i < byteArray.length; ++i) {
                        binaryString[i] = String.fromCharCode(byteArray[i]);
                    }

                    var data = binaryString.join('');
                    var base64 = window.btoa(data);

                    $<downloadManager>.postMessage({ "statusCode": this.status, "base64Data": base64 });
                }
                else {
                    $<downloadManager>.postMessage({ "statusCode": this.status, "base64Data": "" });
                }
            }
        };
        xhr.open("GET", link, true);
        xhr.send(null);
    }
  })
});
