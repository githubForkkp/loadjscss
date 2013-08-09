
function fetchItemData(callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(data) {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var data = JSON.parse(xhr.responseText);
        callback(data);
      } else {
        callback(null);
      }
    }
  }

  var url = "http://bigblue.tmall.net:8088/client/getItems.htm";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("itemIds=" + genQueryStr());
};

var items = new Array();
function genQueryStr() {
  itemIds = new Array();
  var aRegx = /^http:\/\/(detail|item)\.(tmall|taobao)\.com\/item\.htm\?.*$/i;
  var links = document.querySelectorAll("a");

  for (var i = 0; i < links.length; i++) {
    var aObj = links[i];
    if ($(aObj).attr("href") && aRegx.test($(aObj).attr("href")) && $(aObj).find("img") && $(aObj).find("img").length > 0) {
	  var paramStr = $(aObj).attr("href").split("?");
	  if (paramStr.length == 2) {
	    var item = new Object();
	    item.obj = aObj;
		var params = paramStr[1].split("&");
		for (var j = 0; j < params.length; j++) {
		  var param = params[j].split("=");
	      if (param.length == 2 && param[0] == "id") {
			item.id = param[1];
	        break ;
	      }
	    }
		
		if (item.id) {
		  itemIds.push(item.id);
		  items.push(item);
		}
	  }
    }
  }


  console.log(JSON.stringify(itemIds));
  return JSON.stringify(itemIds);
}

function genItemHtml(data) {
  if (data.success) {
    var result = data.value;
    for (var i = 0; i < items.length; i++) {
	  var item = items[i];
	  var info = getValue(result, item.id);
	  if (info != "") {
	    $(item.obj).parent().css("position", "relative");
		$(item.obj).parent().css("overflow", "hidden");
		var html = "<div style='position:absolute;top:0;left:0;z-index:999;background:#999;opacity:0.8;width:100%;font-size:12px;line-height:150%;'>"
		  + "<p style='padding:0 5px;height:auto;' title='" + getValue(info, "title") + "'>名称：" + getValue(info, "title") + "</p>"
		  + "<p style='padding:0 5px;height:auto;'>原价：" + getValue(info, "defaultItemPrice") + "元</p>"
		  + "<p style='padding:0 5px;height:auto;'>专柜价：" + ((getValue(info, "tagPrice") != "")? getValue(info, "tagPrice") + "元" : "无") + "</p>"
		  + "<p style='padding:0 5px;height:auto;'>状态：" + (!getValue(info, "isDownShelf") ? ("出售(库存" + parseInt(getValue(info, "icTotalQuantity")) + "件)") :
			"<b style='color:red;'>下架</b>") +"</p>" + "</div>";
		$(item.obj).before(html);
	  }
	}
  } else {
    console.log("不是的");
  }
}

function getValue(object, key) {
	for (var i in object) { 
		if (i == key) {
			return object[i];
		}
	}
	return "";
}

function checkUrl(){
	var links = document.querySelectorAll("a");
	var aReg = /^http:\/\/(detail|item)\.(tmall|taobao)\.com\/item\.htm\?.*$/i;
	//匹配重复
	var regx0 = /^(http){2,}/;
	//匹配缺少
	var regx1 = /(http)[:\/\/]{1}/;
	for (var i = 0;i <= links.length;i++) {
		var li = $(links[i]).attr("href");
		if (regx0.test(li)) {
			setTips(links[i]);
		}
		else if(!regx1.test(li)){
			setTips(links[i]);
		}
	}
}

//气泡
function setTips(node){
    $(node).qtip({
               content:"此处链接有问题：" + $(node).attr("href"), // Set the tooltip content to the current corner
                show: {
                  when: false, // Don't specify a show event
                  ready: true
               },
               hide: {when: 'dblclick', fixed: true }, // Don't specify a hide event
               style: {
                  border: {
                     width: 5,
                     radius: 10 
                  },
                  padding: 10, 
                  textAlign: 'center',
                  tip: true, // Give it a speech bubble tip with automatic corner detection
                  name: 'blue'// Style it according to the preset 'cream' style
               }
            });

}

chrome.extension.sendMessage({greeting: "hello"}, function(response) {
  if (response.switchStatus == "ON") {
    fetchItemData(genItemHtml);
    //checkUrl();
  }
});