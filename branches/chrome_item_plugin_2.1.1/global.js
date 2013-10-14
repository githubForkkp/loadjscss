chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
	    if (request.greeting == "hello") {
            var object = new Object();
            object["switchStatus"] = localStorage["switchStatus"] ? localStorage["switchStatus"] : "OFF";

            var checkItems = config.checkItems;
            for (var i = 0; i < checkItems.length; i++) {
                var checkItem = checkItems[i];
                object[checkItem.id] = localStorage[checkItem.id] ? localStorage[checkItem.id] : true;
            }
            sendResponse(object);
	    }
    }
);