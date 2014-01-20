

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	if (request.greeting == 'Unit') {
		chrome.browserAction.setBadgeText({text:"Unit"})
	}else{
		chrome.browserAction.setBadgeText({text:""})
	}
})