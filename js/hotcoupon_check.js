/**
 * Created with JetBrains PhpStorm.
 * User: wb-yanli
 * Date: 13-9-17
 * Time: 下午3:58
 * To change this template use File | Settings | File Templates.
 */

var hotcouponCheck = {};

var dateUtil = new Util.DateUtil();
var hotMap = new Util.Map();
hotMap.put(1,"优惠券正常;");
hotMap.put(2,"精品优惠券后台-优惠券活动已领完;");
hotMap.put(3,"精品优惠券后台-优惠券活动已过期或已结束;");
hotMap.put(4,"精品优惠券后台-优惠券活动已删除;");

var ecrmMap = new Util.Map();
ecrmMap.put(-2,"商城优惠券系统-优惠券冻结中;");
ecrmMap.put(-1,"商城优惠券系统-优惠券已删除;");
ecrmMap.put(0,"未使用;");
ecrmMap.put(1,"使用中;");
ecrmMap.put(2,"商城优惠券系统-优惠券已使用;");
ecrmMap.put(3,"商城优惠券系统-优惠券已注销;");

var rightImg = "http://gtms01.alicdn.com/tps/i1/T1i0C8FopaXXcSmcnf-38-38.png";
var errorImg = "http://gtms01.alicdn.com/tps/i1/T1RAm7FnRaXXcSmcnf-38-38.png";

var hotcoupons;
//var CouponStatus = new Object();
//CouponStatus.status = 1;
//CouponStatus.message = "";


hotcouponCheck.getHotCouponInfo = function(){
    hotcoupons = $(".j_CouponItem");
    var params = new Array();
    var str = "";
    var param = new Array();
//    console.log("第一个优惠券："+$(hotcoupons[1]).html());
    for (var i = 1; i <= hotcoupons.length; i++) {
        var dataId;
        if ($(hotcoupons[i-1]).attr("data-id")){
            dataId = $(hotcoupons[i-1]).attr("data-id");
            str += dataId + ",";
        }
        param.value = str;
        if (i % 20 == 0 || i == hotcoupons.length) {
            param.name = "activitys=";
            params.push(param.name+param.value);
            str = "";
        }
    }
    for (var i = 0; i < params.length ; i++){
        sendRequest("GET","http://campaign.admin.taobao.org/campaign/tools/CouponhotQuery.do?",params[i],hotcouponCheck.setCouponInfo);
    }
};

hotcouponCheck.setCouponInfo = function(data){

    if (data.success){
        for (var i = 0;i<hotcoupons.length;i++){
            var dataId = $(hotcoupons[i]).attr("data-id");
            var indexs;
            var img = "";
            var tips = "";
            if ($("#couponStatusE" + dataId).length == 0){
                img = "<div id ='couponStatusE" + dataId +"' class='couponStatusE' index=" + dataId + " style='position: absolute;z-index: 10000;height: 38px;width: 50%;right: 0;background: url("+ errorImg +")  top right no-repeat;background-color: rgb(10, 6, 2)'></div>";
                $(hotcoupons[i]).before(img);
                hotcouponCheck.ErrorTips("#couponStatusE" + dataId,"精品优惠券id没查到，请检查tms数据配置是否正确");
//                console.log("不存在的优惠券："+"#couponStatus" + dataId);
            }
            for (var s = 0;s<data.value.length;s++){
                var startTime = "null;";
                var endTime = "null;";
                var copies = "null;";
                var residualCopies = "null;";
                var amount = "null;";
                var useCondition = "null;";
                var htmlCopies;
                var couponDate = data.value[s];
                if (dataId == couponDate.hotActivityId){
                    indexs = true;
                    $(hotcoupons[i]).parent().css("position", "relative");
                    $(hotcoupons[i]).parent().css("overflow", "hidden");
                    var CouponStatus = hotcouponCheck.CouponCheck(couponDate);
                    if (CouponStatus.status == 1){
//                        $("#couponStatus" + dataId).css("background","url("+ rightImg +")  top right no-repeat");
                        img = "<div id ='couponStatus" + dataId + "' title = '点击可展示收起信息' class='couponStatus' index=" + dataId + " style='position: absolute;cursor:pointer;z-index: 10000;height: 38px;width: 50%;right: 0;background: url("+ rightImg +")  top right no-repeat'></div>";
                        $(hotcoupons[i]).before(img);
                    }else if (CouponStatus.status == 0){
                        img = "<div id ='couponStatus" + dataId +"' title = '点击可展示收起信息' class='couponStatus' index=" + dataId + " style='position: absolute;cursor:pointer;z-index: 10000;height: 38px;width: 50%;right: 0;background: url("+ errorImg +")  top right no-repeat'></div>";
                        $(hotcoupons[i]).before(img);
                    }
                    if (couponDate.activityType == 2){
                        if (couponDate.couponExtractDO){
                            startTime = dateUtil.getSmpFormatDateByLong(couponDate.couponExtractDO.startTime.time,true);
                            endTime = dateUtil.getSmpFormatDateByLong(couponDate.couponExtractDO.endTime.time,true);
                            residualCopies = couponDate.couponExtractDO.residualCopies + "件";
                            copies = couponDate.couponExtractDO.copies + "件;";
                            amount = couponDate.couponExtractDO.amount + "元";
                            useCondition = couponDate.couponExtractDO.useCondition;
                            if (couponDate.couponExtractDO.useCondition == ""){
                                useCondition = "无门槛;";
                            }else{
                                useCondition = "满" + couponDate.couponExtractDO.useCondition.split(":")[1] + "元;";
                            }
                            htmlCopies ="<strong style='color: black;'>剩余库存/总库存：</strong>" + residualCopies + "/" + copies;
                        }
                    }else if (couponDate.activityType ==3){
                        startTime = dateUtil.getSmpFormatDateByLong(couponDate.startTime.time,true);
                        endTime = dateUtil.getSmpFormatDateByLong(couponDate.endTime.time,true);
                        copies = couponDate.totalCount + "件;";
                        amount = couponDate.discount/100 + "元";
                        useCondition = "满" + couponDate.startFee/100 + "元;";
                        htmlCopies = "<b>总领用量：</b>" + copies;
                    }

                    var html = "<div id = 'couponInfo"+ dataId + "' indexs = '" + dataId + "'  title = '点击右上角可展示收起信息' class='couponInfo' style='position:absolute;top:1;left:0;z-index:999;background:#999;background-color:rgb(235, 221, 206);color:rgb(41, 6, 12);opacity:0.8;width:auto;font-size:12px;line-height:150%;'>"
                        + "<p style='padding:0 5px;height:auto;width:auto;left:auto;color: black;float: none;'>" + "<strong style='color: black;'>优惠券id：</strong>" + couponDate.hotActivityId + "</p>"
                        + "<p style='padding:0 5px;height:auto;width:auto;left:auto;color: black;float: none;'>" + "<strong style='color: black;'>卖家nick：</strong>" + couponDate.sellerNick + "</p>"
                        + "<p style='padding:0 5px;height:auto;width:auto;left:auto;color: black;float: none;'>" + "<strong style='color: black;'>兑换条件：</strong>" + couponDate.buyValue + "</p>"
                        + "<p style='padding:0 5px;height:auto;width:auto;left:auto;color: black;float: none;'>" + "<strong style='color: black;'>有效期：</strong>" + startTime + "-" + endTime + "</p>"
                        + "<p style='padding:0 5px;height:auto;width:auto;left:auto;color: black;float: none;'>" + htmlCopies + "</p>"
                        + "<p style='padding:0 5px;height:auto;width:auto;left:auto;color: black;float: none;'>" + "<strong style='color: black;'>面额/使用条件：</strong>" + amount + "/" + useCondition + "</p></div>";
                    $(hotcoupons[i]).before(html);
                    tips = CouponStatus.message;
                    break;
                }
            }
            if ($("#couponStatus" + dataId).length > 0){
                $("#couponStatusE" + dataId).remove();
            }
            if (tips != ""){
                hotcouponCheck.ErrorTips("#couponStatus" + dataId,tips);
            }
        }
    }
};

$(document).ready(function(){
    $(".couponStatus").click(function(){
        var xx = $(this).attr("index");
        $("div[indexs='"+ xx +"']").toggle(500);
    });
});

hotcouponCheck.ErrorTips = function(info,message){
    $(info).qtip({
        content: message,
        show: {
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
};

hotcouponCheck.CouponCheck = function(couponDate){
    var CouponStatus = new Object();
    CouponStatus.status = 1;
    CouponStatus.message = "";
    if (couponDate.activityType == 2){
        var ecrmCheck = hotcouponCheck.ecrmCheck(couponDate);
        if (ecrmCheck.ecrmDataCheck == 0){
            CouponStatus.status = 0;
            CouponStatus.message = ecrmCheck.errorMessage;
        }else if (ecrmCheck.ecrmDataCheck == -1){
            CouponStatus.status = 0;
            CouponStatus.message = ecrmCheck.errorMessage;
            return CouponStatus;
        }
    }else if (couponDate.activityType == 1){
        CouponStatus.status = 0;
        CouponStatus.message = "亲，类型设置错了吧，现在这张券是一淘的优惠券哦";
    }else if (couponDate.activityType == 3){

    }

    var StatusCheck = hotcouponCheck.StatusCheck(couponDate);
    if (StatusCheck.couponStatus == 0){
        CouponStatus.status = 0;
        CouponStatus.message += StatusCheck.errorMessage;
    }

    var DateCheck = hotcouponCheck.DateCheck(couponDate);
    if (DateCheck.dateStatus == 0){
        CouponStatus.status = 0;
        CouponStatus.message += DateCheck.errorMessage;
    }
    return CouponStatus;
};

hotcouponCheck.ecrmCheck = function(couponDate){
    var ecrmDateCheck = new Object();
    ecrmDateCheck.ecrmDataCheck = 1;
    if (couponDate.couponExtractDO == null){
        ecrmDateCheck.ecrmDataCheck = -1;
        ecrmDateCheck.errorMessage = "商城优惠券数据返回为空";
        return  ecrmDateCheck;
    }

    if (couponDate.couponExtractDO.getCondition.split(";")[0] == "free"){
        ecrmDateCheck.ecrmDataCheck = 0;
        ecrmDateCheck.errorMessage = "在商城优惠券系统里面类型设置错误，一定要设置成积分兑换;";
        return  ecrmDateCheck;
    }

    if (couponDate.couponExtractDO.residualCopies == 0){
        ecrmDateCheck.ecrmDataCheck = 0;
        ecrmDateCheck.errorMessage = "优惠券剩余量为0;";
        return  ecrmDateCheck;
    }

    if (couponDate.couponExtractDO.status== -2){
        ecrmDateCheck.ecrmDataCheck = 0;
        ecrmDateCheck.errorMessage += ecrmMap.get(-2);
    } else if (couponDate.couponExtractDO.status == -1){
        ecrmDateCheck.ecrmDataCheck = 0;
        ecrmDateCheck.errorMessage += ecrmMap.get(-1);
    } else if (couponDate.couponExtractDO.status == 0){
        ecrmDateCheck.ecrmDataCheck = 1;
    } else if (couponDate.couponExtractDO.status == 1){
        ecrmDateCheck.ecrmDataCheck = 1;
    } else if (couponDate.couponExtractDO.status == 2){
        ecrmDateCheck.ecrmDataCheck = 0;
        ecrmDateCheck.errorMessage += ecrmMap.get(2);
    } else if (couponDate.couponExtractDO.status == 3){
        ecrmDateCheck.ecrmDataCheck = 0;
        ecrmDateCheck.errorMessage += ecrmMap.get(3);
    } else{
        ecrmDateCheck.ecrmDataCheck = 0;
        ecrmDateCheck.errorMessage += "状态异常;";
    }
    return  ecrmDateCheck;
};

hotcouponCheck.DateCheck = function(couponDate){
    var DateCheck = new Object();
    DateCheck.dateStatus = 1;
    var startTime ;
    var endTime ;
    if (couponDate.activityType ==2){
        startTime = new Date(couponDate.couponExtractDO.startTime.time);
        endTime = new Date(couponDate.couponExtractDO.endTime.time);
    }else if (couponDate.activityType ==3){

        startTime = new Date(couponDate.startTime.time);
        endTime = new Date(couponDate.endTime.time);
    }
    var now = new Date();
    if (startTime > endTime || endTime < now){
        DateCheck.dateStatus = 0;
        DateCheck.errorMessage = "优惠券已过期;";
    };
    return DateCheck;
};

hotcouponCheck.StatusCheck = function(couponDate){
    var CouponStatus = new Object();
    if (couponDate.hotStatus == 1 ){
        CouponStatus.couponStatus = 1;
    } else if (couponDate.hotStatus == 2){
        CouponStatus.couponStatus = 0;
        CouponStatus.errorMessage = hotMap.get(2);
    } else if (couponDate.hotStatus == 3){
        CouponStatus.couponStatus = 0;
        CouponStatus.errorMessage = hotMap.get(3);
    } else if (couponDate.hotStatus == 4){
        CouponStatus.couponStatus = 0;
        CouponStatus.errorMessage = hotMap.get(4);
    }else{
        CouponStatus.couponStatus = 0;
        CouponStatus.errorMessage = "状态异常;";
    }

    return CouponStatus;
};