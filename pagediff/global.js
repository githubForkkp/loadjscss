var switchStatus = "OFF";
var preHost = "请输入除参数外的url：如http://detail.tmall.com/item.htm";

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


