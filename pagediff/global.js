var switchStatus = "OFF";
var preHost = "";

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
	if (request.greeting == "hello") {
	  if (window.localStorage) {
		sendResponse({switchStatus: localStorage.switchStatus,preHost: localStorage.preHost});
	  } else {
		sendResponse({switchStatus: switchStatus,preHost: preHost});
	  }
	}
  }
);


