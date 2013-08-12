
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
  xhr.send("itemIds=" + JSON.stringify(itemIds));
};

function getItemStatus(callback){
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

  var url = "http://campaign.admin.taobao.org/campaign/tools/QueryItems.do?itemIdsString="+itemIds.toString();
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send();
}
//商品状态
arrstatus = new Array();
itemStatus = {
    "0":"正常",
    "1":"正常",
    "-1":"用户删除",
    "-2":"用户下架",
    "-3":"小二下架",
    "-4":"小二删除",
    "-5":"从未上架",
    "-9":"CC",
    "状态查询异常":"查询状态异常"
}
var items = new Array();
function genQueryStr() {
  itemIds = new Array();
  var aRegx = /^http:\/\/(detail|item)\.(tmall|taobao)\.com\/|\/\/item\.htm\?.*$/i;
  var links = document.querySelectorAll("a");
  itemLinks = [];

  for (var i = 0; i < links.length; i++) {
    var aObj = links[i];
    if ($(aObj).attr("href") && aRegx.test($(aObj).attr("href")) && $(aObj).find("img") && $(aObj).find("img").length > 0) {
    itemLinks.push(links[i]);
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
		  + "<p style='padding:0 5px;height:auto;'>状态：" + ((arrstatus[i] == "0" || arrstatus[i] == "1") ?"正常":
      "<b style='color:red;'>"+itemStatus[arrstatus[i]]+"</b>" )+"</p>" + "</div>";
		$(item.obj).before(html);
	  }
	}
  } else {
    console.log("不是的");
  }
}

function getItems(data){
  if(data.totalStatus == "success"){
    Results = data.itemQueryResults;
    for (var i = 0; i < Results.length; i++) {
        if(Results[i].statusMsg == "查询成功"){
          arrstatus.push(Results[i].itemStatus)
        }
        else{
          arrstatus.push("状态查询异常")
        }
    }
  }else{
    console.log("查询接口异常！")
  }
    fetchItemData(genItemHtml);
}


function getValue(object, key) {
	for (var i in object) { 
		if (i == key) {
			return object[i];
		}
	}
	return "";
}

//检查链接
function checkUrl(){
	var msg = "此处链接有问题,请检查！"
	var links = document.querySelectorAll("a");
	//匹配重复
	var regx0 = /(http|http:\/\/){2,}/;
  var regx1 = /(http|http:\/\/){1,}$/
	//匹配缺少
	var regx2 = /(http){1}/;
	for (var i = 0;i <= links.length-1;i++) {
		var li = $(links[i]).attr("href");
		
		if (regx0.test(li)||regx1.test(li)) {
			setTips(links[i],msg);
		}
		else if(!regx2.test(li)){
			if(/^#/.test(li)||/^(javascript)/.test(li)){
				continue;
			}
			setTips(links[i],msg);
		}
	}
}

//检查重复id
function checkId(){
  
 	for(var i in itemIds){
    for(var j in itemIds) {
      if(i == j){
        continue;
      }
 		   if (items[i].id == items[j].id){
  			   setTips(itemLinks[i],"此商品id有重复,请检查！");
 		     }  
  }
	}  
}

//气泡
function setTips(node,msg){
    $(node).qtip({
                content: msg + $(node).attr('href'),
                show: {
                  when: false, 
                  ready: true
               },
               hide: {when: 'dblclick', fixed: true }, 
               style: {
                  border: {
                     width: 5,
                     radius: 10 
                  },
                  padding: 10, 
                  textAlign: 'center',
                  tip: true, 
                  name: 'blue'
               }
            });

}

chrome.extension.sendMessage({greeting: "hello"}, function(response) {
  if (response.switchStatus == "ON") {
    genQueryStr();
    getItemStatus(getItems);
    if(response.checkUrlStatus == "true"){
    	checkUrl();
    }
    if(response.checkIdStatus == "true"){
    	checkId();
    }
   
  }
});