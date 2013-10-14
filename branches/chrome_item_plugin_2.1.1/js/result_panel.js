/**
 * Created with JetBrains PhpStorm.
 * User: menglong.hxf
 * Date: 13-8-20
 * Time: 下午12:40
 * To change this template use File | Settings | File Templates.
 */
var resultPanel = {};

var $tabs;
resultPanel.init = function() {
    resultPanel.addCss("result_panel.css");
    resultPanel.addCss("jquery-ui.css");
    $(document.body).append("<div id='resultPanel'>"
        + "<div class='tabs'><ul></ul></div>"
        + "</div>");
    $tabs = $("#resultPanel .tabs").tabs({collapsible: true});
    $("#resultPanel .tabs").draggable();
    resultPanel.hide();
};

resultPanel.addTabResult = function(id, title, content) {
    $tabs.find(".ui-tabs-nav").append("<li><a href='#"+id+"'>"+title+"</a></li>");
    $tabs.append("<div id='"+id+"'>"+content+"</div>");
    $tabs.tabs("refresh");
    $tabs.tabs("option", "active", -1);
};

resultPanel.addCss = function(css) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = (css.substr(0, 7) == "http://") ? css : 'http://bigblue.tmall.net:8088/css/' + css;
    document.getElementsByTagName("head")[0].appendChild(link);
};

resultPanel.addJs = function(js) {
    var link = document.createElement("script");
    link.type = "text/javascript";
    link.src = (js.substr(0, 7) == "http://") ? js : 'http://bigblue.tmall.net:8088/js/' + js;
    document.getElementsByTagName("head")[0].appendChild(link);
};

resultPanel.hide = function() {
    $("#resultPanel").hide();
};

resultPanel.show = function() {
    $("#resultPanel").show();
};