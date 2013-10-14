/**
 * Created with JetBrains PhpStorm.
 * User: menglong.hxf
 * Date: 13-8-20
 * Time: 下午12:40
 * To change this template use File | Settings | File Templates.
 */
var config = {};

config.checkItems = [ {"id" : "allCheck", "name" : "全选", "status" : "1"},
    {"id" : "checkItemDetail", "name" : "获取商品详情", "status" : "1"},
    {"id" : "checkItemPromotion", "name" : "获取商品优惠价", "status" : "1"},
    {"id" : "checkurl", "name" : "检查链接正确性", "status" : "1"},
    {"id" : "checkid", "name" : "检查重复商品", "status" : "1"},
    {"id" : "checktitle", "name" : "获取承接页名称", "status" : "1"},
    {"id" : "checkResource", "name" : "检查坑位数", "status" : "1"},
    {"id" : "checkHotCoupon", "name" : "检查积分兑优惠券", "status" : "1"}];

config.checkItemsCallback = {"checkItemDetail": genQueryStr,
    "checkurl": checkUrl,
    "checkid": checkId,
    "checktitle": checkTitle,
    "checkResource": checkResource,
    "checkHotCoupon": hotcouponCheck.getHotCouponInfo};