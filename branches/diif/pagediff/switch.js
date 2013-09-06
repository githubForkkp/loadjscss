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
function setPreHost(){
	if (window.localStorage) {
		localStorage.preHost = $("#prePage").val() != "" ? $("#prePage").val() : "";
		$("#prePage").val(localStorage.preHost)
	} else {
		var background = chrome.extension.getBackgroundPage();
		background.preHost = $("#prePage").val() != "" ? $("#prePage").val() : "";
		$("#prePage").val(localStorage.preHost)
	}
}
function clear(){
	localStorage.preHost = "";
	$("#prePage").val("请输入除参数外的url：如http://detail.tmall.com/item.htm")
}


document.addEventListener('DOMContentLoaded', function () {
  $("#switch").click(function() {
	doSwitch();
  })
  $("#prePage").focus(function(){
  	var word = $("#prePage").val()
  	if(word.length ==0 || word == "请输入除参数外的url：如http://detail.tmall.com/item.htm")
  	{
  	$("#prePage").val("");
  	}
  })
  $("#submitButton").click(function(){
  	var word = $("#prePage").val()
	if(word.length==0 || word == "请输入除参数外的url：如http://detail.tmall.com/item.htm") {
    	localStorage.preHost = "";
    }else{
    	setPreHost();
    }
  })
  $("#resetButton").click(function(){
  	clear()
  })

});

function initStatus() {
	if (window.localStorage) {
		localStorage.switchStatus = localStorage.switchStatus ? localStorage.switchStatus : "OFF";
		localStorage.preHost = localStorage.preHost != undefined && localStorage.preHost != "" ? localStorage.preHost : "请输入除参数外的url：如http://detail.tmall.com/item.htm";
		$("#switch").attr("alt", localStorage.switchStatus);
		$("#switch").attr("src", "./"+localStorage.switchStatus+".jpg");
		$("#prePage").val(localStorage.preHost)
	} else {
		var background = chrome.extension.getBackgroundPage();
		$("#switch").attr("alt", background.switchStatus);
		$("#switch").attr("src", "./"+background.switchStatus+".jpg");
		$("#prePage").val(localStorage.preHost)
	}
}
window.addEventListener('load', initStatus);