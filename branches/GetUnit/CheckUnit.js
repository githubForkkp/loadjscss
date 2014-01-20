
function doCheck(){
$(document).ready(function(){
  var links = document.querySelectorAll('link')
  var i = links[1].href.indexOf('detail-b') > 0 ? links[1].href.indexOf('detail-b'):links[1].href.indexOf('detail')
  var k = links[1].href.substring(i+9)
  var ver = k.match(/\d+\.\d+\.\d+/)
  console.warn("assets版本号：",ver?ver.toString():"未取到。")
	var dd = $.ajax({
            url: document.location.href,
            type: "GET",
            success: function(data, textStatus) {
                  var cache = dd.getResponseHeader("X-Cache");
                  var via = dd.getResponseHeader("Via");
                  var hasHit = cache != null && cache.indexOf("HIT")>=0;
                  var hasCdn = via != null && via.indexOf("cn")>0;
                  if(hasHit && hasCdn){
                        console.warn("缓存命中(CDN)。")

                  }else if(hasHit && !hasCdn){
                        console.warn("缓存命中(WebCache)。")
                  }else{
                        console.warn("缓存未命中。")
                  }
                  isUnit(data)
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if (textStatus == "error") {
                    alert(textStatus + " : " +errorThrown);
                } else {
                    alert(textStatus);
                }
            }
        })
    
})
}


//判断是否在unit
function isUnit(data){
      var message = "";
      var text = "Unit";
      var start = data.indexOf('initApi\" : \"');
      var end = data.indexOf('\"changeLocationApi');
      var mdskipUrl = data.substring(start+12, end)
      var bb = $.ajax({
            url: mdskipUrl.trim(),
            type: "GET",
            headers : {
                        "Referer" : "http://detail.tmall.com/item.htm?id=19991914959"
                    },
            success: function(da, textStatus) {
                  var location = bb.getResponseHeader("TM-finalURL");
                        if(location != null && location.indexOf('unit')>0){
                            message = text;
                            chrome.extension.sendMessage({greeting: message}, function(response) {})
                        }
                        //这里写个else消息
                        else{
                            chrome.extension.sendMessage({greeting: message}, function(response) {})
                        }
                  
            }
        })
      
}

window.setTimeout(doCheck(), 0);




