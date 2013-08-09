var switchStatus = "OFF";

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
	if (request.greeting == "hello") {
	  if (window.localStorage) {
		sendResponse({switchStatus: localStorage.switchStatus});
	  } else {
		sendResponse({switchStatus: switchStatus});
	  }
	}
  }
);


