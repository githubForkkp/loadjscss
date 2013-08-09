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

function checkurl() {
	if (window.localStorage) {
		localStorage.checkUrlStatus = $("#checkurl").attr("checked")? "true" : "false";
		if(localStorage.checkUrlStatus == "true"){
			$("#checkurl").attr("checked", true);
		}else{
			$("#checkurl").attr("checked", false)
		}

	} else {
		var background = chrome.extension.getBackgroundPage();
		background.checkUrlStatus = ($("#checkurl").attr("checked")) ? "true" : "false";
		if(background.checkUrlStatus == "true"){
			$("#checkurl").attr("checked", true);
		}else{
			$("#checkurl").attr("checked", false)
		}
		
	}
}
function checkids() {
	if (window.localStorage) {
		localStorage.checkIdStatus = ($("#checkid").attr("checked"))? "true" : "false";
		if(localStorage.checkIdStatus == "true"){
			$("#checkid").attr("checked", true);
		}else{
			$("#checkid").attr("checked", false)
		}

	} else {
		var background = chrome.extension.getBackgroundPage();
		background.checkIdStatus = ($("#checkid").attr("checked")) ? "true" : "false";
		if(background.checkIdStatus == "true"){
			$("#checkid").attr("checked", true);
		}else{
			$("#checkid").attr("checked", false)
		}
		
	}
}


document.addEventListener('DOMContentLoaded', function () {
  $("#switch").click(function() {
	doSwitch();
  });
  $("#checkurl").click(function() {
	checkurl();
  });
  $("#checkid").click(function() {
	checkids();
  });
});

function initStatus() {
	if (window.localStorage) {
		localStorage.switchStatus = localStorage.switchStatus ? localStorage.switchStatus : "OFF";
		if(localStorage.checkUrlStatus == "true"){
			$("#checkurl").attr("checked", true)
		}else{
			$("#checkurl").attr("checked", false)
		}
		if(localStorage.checkIdStatus == "true"){
			$("#checkid").attr("checked", true)
		}else{
			$("#checkid").attr("checked", false)
		}
		$("#switch").attr("alt", localStorage.switchStatus);
		$("#switch").attr("src", "./"+localStorage.switchStatus+".jpg");
	} else {
		var background = chrome.extension.getBackgroundPage();
		$("#switch").attr("alt", background.switchStatus);
		$("#switch").attr("src", "./"+background.switchStatus+".jpg");
		if(background.checkUrlStatus == "true"){
			$("#checkurl").attr("checked", true)
		}else{
			$("#checkurl").attr("checked", false)
		}
		if(background.checkIdStatus == "true"){
			$("#checkid").attr("checked", true)
		}else{
			$("#checkid").attr("checked", false)
		}
	}
}

window.addEventListener('load', initStatus);