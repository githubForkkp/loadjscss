/**
 * Created with JetBrains PhpStorm.
 * User: menglong.hxf
 * Date: 13-9-28
 * Time: 下午8:48
 * To change this template use File | Settings | File Templates.
 */

//检查打印承接页title
function checkTitle(){
    getShopsInfo();
}

function getShopsInfo(){
    var shops = new Array();
    var links = document.querySelectorAll("a");
    var aRegxs = new RegExp("^http:\/\/(?!(login|item|detail)).*\.(tmall|taobao)\.com\/(view_page|p\/).*","g");
    for (var i = 0;i <= links.length-1;i++) {
        var li = $(links[i]).attr("href");
        if (aRegxs.test(li)) {
            getHtmlTitle(links[i],setTitle);
        }
    }
}

function getHtmlTitle(urlObj,callback){
    var aRegx = new RegExp("<title>[\\s\\S]*<\/title>");
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(data) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var data = aRegx.exec(xhr.responseText);
                callback(urlObj,data);
            } else {
                console.info(xhr.status);
                callback(null);
            }
        }
    }

    xhr.open("GET", $(urlObj).attr("href"), true);
    xhr.send();
}

function setTitle(urlObj,data){
    if (data){
        var reg=new RegExp("(<title>|<\/title>|- 天猫Tmall.com)","g");
        $(urlObj).parent().css("position", "relative");
        $(urlObj).parent().css("overflow", "hidden");
        var html = "<div style='position:absolute;top:1;left:0;z-index:999;background:#999;background-color:rgb(144, 233, 226);color:rgb(41, 6, 12);opacity:0.8;width:auto;font-size:12px;line-height:150%;'>"
            + "<p style='padding:0 5px;height:auto;left:auto;'>" + "<b>承接页title：</b>" +data.toString().replace(reg,"")+ "</p></div>";
//        $("[href='"+url+"']").before(html);
        $(urlObj).before(html);
    }else{
        console.log("不是的,data:" + data + "------urlObj:" +urlObj);
    }
}