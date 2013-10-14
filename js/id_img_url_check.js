//检查重复id
function checkId() {
    for (var i in itemIds) {
        for (var j in itemIds) {
            if (i >= j) {
                continue;
            }
            if (items[i].id == items[j].id) {
                setTips(itemLinks[i], "此商品id有重复,请检查！" + $(itemLinks[i]).attr("href"));
            }
        }
    }
}

//检查链接
function checkUrl() {
    var msg = "此处链接有问题,请检查！";
    var links = document.querySelectorAll("a");
    //匹配重复
    var regx0 = /(http|http:\/\/){2,}/;
    var regx1 = /(http|http:\/\/){1,}$/;
    //匹配缺少
    var regx2 = /(http){1}/;
    for (var i = 0; i <= links.length - 1; i++) {
        var li = $(links[i]).attr("href");

        if (regx0.test(li) || regx1.test(li)) {
            setTips(links[i], msg + ((li || li.length <= 0) ? "链接为空" : li));
        } else if (!regx2.test(li)) {
            if (/^#.*/.test(li) || /^(javascript)/.test(li) || !!$(links[i]).attr("name")) {
                continue;
            }
            setTips(links[i], msg + ((li || li.length <= 0) ? "链接为空" : li));
        }
    }
}

// 商品图片链接判空
function checkImg(aObj) {
    var img = $(aObj).find("img");
    var lazyload = img.attr("data-ks-lazyload");
    if (undefined != lazyload || !lazyload ) {
        if (lazyload == "" || lazyload == "#") {
            setTips(img, "此处图片链接存在问题，请检查！"  + lazyload);
        }
    } else if (lazyload == undefined || !!lazyload ) {
        var src = img.attr("src");
        if (src == "" || src == "#"||src == null) {
            setTips(img, "此处图片链接存在问题，请检查！"  + src);
        }
    }
}