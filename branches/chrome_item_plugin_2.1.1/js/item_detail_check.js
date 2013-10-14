/**
 * Created with JetBrains PhpStorm.
 * User: menglong.hxf
 * Date: 13-9-28
 * Time: 下午8:53
 * To change this template use File | Settings | File Templates.
 */

function getItems(data){
    if(data && data.totalStatus == "success"){
        Results = data.itemQueryResults;
        for (var i = 0; i < Results.length; i++) {
            if(Results[i].statusMsg == "查询成功"){
                arrstatus.push(Results[i].itemStatus);
            }
            else{
                arrstatus.push("状态查询异常");
            }
        }
    }else{
        console.log("查询接口异常！");
    }
    fetchItemData(genItemHtml);
}

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
    };

    var url = "http://campaign.admin.taobao.org/campaign/tools/getItems.do";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("itemIds=" + JSON.stringify(itemIds));
}

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
    };

    var url = "http://campaign.admin.taobao.org/campaign/tools/QueryItems.do";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("itemIdsString=" + itemIds.toString());
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
};

var items = new Array();
function genQueryStr() {
    itemIds = new Array();
    var aRegx = /^http:\/\/(detail|item)\.(tmall|taobao)\.com\/|\/\/item\.htm\?.*$/i;
    var mRegx = /^http:\/\/a\.m\.tmall\.com\/i[0-9]+\.htm.*$/i;
    var links = document.querySelectorAll("a");
    itemLinks = [];
    // var regx = /(\.jpg)$/;
    for (var i = 0; i < links.length; i++) {
        var aObj = links[i];

        if ($(aObj).attr("href") && (aRegx.test($(aObj).attr("href")) || mRegx.test($(aObj).attr("href")))
            && $(aObj).find("img") && $(aObj).find("img").length > 0) {
            itemLinks.push(links[i]);
            if (aRegx.test($(aObj).attr("href"))) {
                var bRegx = new RegExp("[&?]id=[0-9]+", "g");
                var idTmp = bRegx.exec($(aObj).attr("href"));
                if (idTmp && idTmp.length > 0) {
                    var item = new Object();
                    item.type = "pc";
                    item.obj = aObj;
                    item.id = idTmp[0].replace(/[&?]id=/g, "");
                    itemIds.push(item.id);
                    items.push(item);
                }
            } else if (mRegx.test($(aObj).attr("href"))) {
                var paramHref = $(aObj).attr("href");
                var paramStr = paramHref.substring("http://a.m.tmall.com/i".length, paramHref.indexOf(".htm"));
                var item = new Object();
                item.type = "html5";
                item.obj = aObj;
                item.id = paramStr;
                if (item.id) {
                    itemIds.push(item.id);
                    items.push(item);
                }
            }

        }
    }

    console.log(JSON.stringify(itemIds));
    if (itemIds.length > 0) {
        getItemStatus(getItems);
    }
    return JSON.stringify(itemIds);
}

function genItemHtml(data) {
    if (data.success) {
        var result = data.value;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var info = getValue(result, item.id);
            if (info != "") {
                if (item.type == "pc") {
                    var html = "<div style='position:absolute;top:0;left:0;z-index:999;background:#999;opacity:0.8;width:100%;color:blue;font-size:12px;line-height:120%;'>"
                        + "<p style='padding:0 5px;height:auto;margin:4px 0;' title='" + getValue(info, "title")
                        + "'><b>名称</b>：" + (getValue(info, "title").length>18 ?
                        getValue(info, "title").substr(0,18) + "..." : getValue(info, "title")) + "</p>"
                        + "<p style='padding:0 5px;height:auto;margin:4px 0;'><b>原价</b>：" + getValue(info, "defaultItemPrice") + "元</p>";
                    if (getValue(info, "wanrentuanInfo")) {
                        html += "<p style='padding:0 5px;height:auto;margin:4px 0;'><b>定金</b>：" + getValue(info, "wrtFirstPrice") + "元</p>";

                        var wrtLevelNeedCounts = getValue(info, "wrtLevelNeedCounts");
                        if (wrtLevelNeedCounts.length > 0) {
                            var wrtLevelFinalPrices = getValue(info, "wrtLevelFinalPrices");
                            html += "<p style='padding:0 5px;height:auto;margin:4px 0;'><b>预售价</b>：";
                            for (var j = 0; j < wrtLevelNeedCounts.length; j++) {
                                html += "<div>" + wrtLevelNeedCounts[j] + "人：" + wrtLevelFinalPrices[j] + "元</div></p>";
                            }
                        } else {
                            html += "<p style='padding:0 5px;height:auto;margin:4px 0;'><b>预售价</b>：" + (getValue(info, "wrtFirstPrice") + getValue(info, "finalPayment")) + "元</p>";
                        }

                        html += "<p style='padding:0 5px;height:auto;margin:4px 0;'><b>预定人数</b>：" + getValue(info, "groupUC") + "人</p>"
                            + "<p style='padding:0 5px;height:auto;margin:4px 0;'><b>开始时间</b>：" + getValue(info, "startTime") + "</p>";
                    } else {
                        var promInfo = getValue(info, "promInfo");
                        if (promInfo && getValue(promInfo, "priceAfterProm")) {
                            html += "<p style='padding:0 5px;height:auto;margin:4px 0;'><b>优惠价</b>：" + (getValue(promInfo, "priceAfterProm")/100).toFixed(2) + "元</p>";
                        }
                    }

                    html += "<p style='padding:0 5px;height:auto;margin:4px 0;'><b>状态</b>：" + ((arrstatus[i] == "0" || arrstatus[i] == "1") ?("正常(库存" + parseInt(getValue(info, "quantity")) + "件)"):
                        "<b style='color:red;'>"+itemStatus[arrstatus[i]]+"</b>" )+"</p>" + "</div>";

                    $(item.obj).parent().css("position", "relative");
                    $(item.obj).parent().css("overflow", "hidden");
                    $(item.obj).before(html);
                } else if (item.type == "html5") {
                    var html5 = "<div style='opacity:0.8;font-size:12px;line-height:120%;'>"
                        + "<p style='padding:0 5px;height:auto;margin:4px 0;' title='" + getValue(info, "title")
                        + "'><b>名称</b>：" + (getValue(info, "title").length>18 ?
                        getValue(info, "title").substr(0,18) + "..." : getValue(info, "title")) + "</p>"
                        + "<p style='padding:0 5px;height:auto;margin:4px 0;'><b>原价</b>：" + getValue(info, "defaultItemPrice") + "元</p>";
                    if (getValue(info, "wanrentuanInfo")) {
                        html5 += "<p style='padding:0 5px;height:auto;margin:4px 0;'><b>定金</b>：" + getValue(info, "wrtFirstPrice") + "元</p>";

                        var wrtLevelNeedCounts = getValue(info, "wrtLevelNeedCounts");
                        if (wrtLevelNeedCounts.length > 0) {
                            var wrtLevelFinalPrices = getValue(info, "wrtLevelFinalPrices");
                            html5 += "<p style='padding:0 5px;height:auto;margin:4px 0;'><b>预售价</b>：";
                            for (var j = 0; j < wrtLevelNeedCounts.length; j++) {
                                html5 += "<div>" + wrtLevelNeedCounts[j] + "人：" + wrtLevelFinalPrices[j] + "元</div></p>";
                            }
                        } else {
                            html5 += "<p style='padding:0 5px;height:auto;margin:4px 0;'><b>预售价</b>：" + (getValue(info, "wrtFirstPrice") + getValue(info, "finalPayment")) + "元</p>";
                        }

                        html5 += "<p style='padding:0 5px;height:auto;margin:4px 0;'><b>预定人数</b>：" + getValue(info, "groupUC") + "人</p>"
                            + "<p style='padding:0 5px;height:auto;margin:4px 0;'><b>开始时间</b>：" + getValue(info, "startTime") + "</p>";
                    }

                    html5 += "<p style='padding:0 5px;height:auto;margin:4px 0;'><b>状态</b>：" + ((arrstatus[i] == "0" || arrstatus[i] == "1") ?("正常(库存" + parseInt(getValue(info, "quantity")) + "件)"):
                        "<b style='color:red;'>"+itemStatus[arrstatus[i]]+"</b>" )+"</p>" + "</div>";

                    $(item.obj).parent().qtip({
                        prerender: true,
                        content: html5,
                        show: {
                            when:false,
                            ready: true,
                            event: 'mouseenter'
                        },
                        hide: {
                            event: 'mouseleave'
                        },
                        position: {
                            at: 'top right'
                        },
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
            }


        }
    } else {
        console.log(data.value);
    }
}