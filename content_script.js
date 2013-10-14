function sendRequest(type, url, params, callback) {
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
    };

    if (type == "GET"){
        xhr.open(type, url + params, true);
        xhr.send();
    }else if (type == "POST"){
        xhr.open(type, url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(params);
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

// 气泡
function setTips(node, msg) {
    $(node).qtip({
        prerender: true,
        content: msg,
        show: {
            when:false,
            ready: true
        },
        hide: false,
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
      resultPanel.init();
      resultPanel.addCss("http://campaign.admin.taobao.org/assets/tools/css/jquery.qtip.min.css");

      var hasCheck = false;
      for (var i = 0 ; i < config.checkItems.length; i++) {
          var checkItem = config.checkItems[i];
          if ((checkItem.status == 1) && (response[checkItem.id] == "true")
              && !!getValue(config.checkItemsCallback, checkItem.id)) {
              hasCheck = true;
              getValue(config.checkItemsCallback, checkItem.id)();
          }
      }

      if (hasCheck) {
          resultPanel.addTabResult("tabs-summary", "检查结果汇总", "暂无");
          resultPanel.show();
      }
  }
});