function doSwitch() {
	if (window.localStorage) {
		localStorage.switchStatus = ("OFF" == $("#switch").attr("alt")) ? "ON" : "OFF";
		$("#switch").attr("alt", localStorage.switchStatus);
		$("#switch").attr("src", "./"+localStorage.switchStatus+".jpg");
	} else {
		var background = chrome.extension.getBackgroundPage();
		background.switchStatus = ("OFF" == $("#switch").attr("alt")) ? "ON" : "OFF";
		$("#switch").attr("alt", background.switchStatus);
		$("#switch").attr("src", "./"+background.switchStatus+".jpg");
	}
}



document.addEventListener('DOMContentLoaded', function () {
  $("#switch").click(function() {
	doSwitch();
  });
});

function initStatus() {
	if (window.localStorage) {
		localStorage.switchStatus = localStorage.switchStatus ? localStorage.switchStatus : "OFF";
		$("#switch").attr("alt", localStorage.switchStatus);
		$("#switch").attr("src", "./"+localStorage.switchStatus+".jpg");
	} else {
		var background = chrome.extension.getBackgroundPage();
		$("#switch").attr("alt", background.switchStatus);
		$("#switch").attr("src", "./"+background.switchStatus+".jpg");
	}
}

window.addEventListener('load', initStatus);