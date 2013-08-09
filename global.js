var switchStatus = "OFF";
var checkUrlStatus = "false";
var checkIdStatus = "false";

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
	if (request.greeting == "hello") {
	  if (window.localStorage) {
		sendResponse({switchStatus: localStorage.switchStatus,checkUrlStatus: localStorage.checkUrlStatus,checkIdStatus: localStorage.checkIdStatus});
	  } else {
		sendResponse({switchStatus: switchStatus,checkUrlStatus: checkUrlStatus,checkIdStatus: checkIdStatus});
	  }
	}
  }
);


