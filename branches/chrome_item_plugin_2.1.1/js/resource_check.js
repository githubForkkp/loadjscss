/**
 * Created with JetBrains PhpStorm.
 * User: menglong.hxf
 * Date: 13-9-28
 * Time: 下午8:45
 * To change this template use File | Settings | File Templates.
 */

function checkResource() {
    var resource = $(".list-link");
    var resourceCount = resource.length;
    var rightCount = 0;
    for (var i = 0 ; i < resourceCount; i++) {
        if ($(resource[i]).attr("href").indexOf("http://subject.tmall.com/subject/subject.htm") != -1) {
            rightCount++;
        } else {
            setTips(resource[i], "链接非subject.tmall.com。");
        }
    }

    resultPanel.addTabResult("tabs-resource", "检查品牌坑位", "总坑位有：" + resourceCount + "个，链接：" + rightCount + "个。");
}