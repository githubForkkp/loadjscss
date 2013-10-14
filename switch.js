function doSwitch(status) {
    $("#btn_" + status).hide();
	localStorage.switchStatus = ("OFF" == status) ? "ON" : "OFF";
    $("#btn_" + localStorage.switchStatus).show();
}

document.addEventListener('DOMContentLoaded', function () {
    $("#btn_ON").click(function() {
	    doSwitch("ON");
    });
    $("#btn_OFF").click(function() {
        doSwitch("OFF");
    });
    for (var i = 0 ; i < config.checkItems.length; i++) {
        document.getElementById(config.checkItems[i].id).addEventListener("click", check);
    }
});

function initStatus() {
    $("#popup .check-items").html("");

    for (var i = 0 ; i < config.checkItems.length; i++) {
        var checkItem = config.checkItems[i];
        if (checkItem.status == 1) {
            $("#popup .check-items").append("<li><input type='checkbox' class='check-item' " +
            ((!localStorage[checkItem.id] || localStorage[checkItem.id] == "true") ? "checked='checked'" : "") + " id='" + checkItem.id +
            "' value='" + checkItem.id + "' /><label for='" + checkItem.id + "'>" + checkItem.name + "</label></li>");
    }
    localStorage[checkItem.id] = localStorage[checkItem.id] ? localStorage[checkItem.id] : true;
    }

    localStorage["switchStatus"] = localStorage["switchStatus"] ? localStorage["switchStatus"] : "OFF";
    $("#btn_" + localStorage["switchStatus"]).show();
}

function check(event) {
    var checkId = $(event.srcElement).attr("id");
    if (checkId == "allCheck") {
        var others = $(".check-item");
        var currentStatus = localStorage[checkId];

        for (var i = 0; i < others.length; i++) {
            localStorage[$(others[i]).attr("id")] = currentStatus;
            changeStatus($(others[i]).attr("id"));
        }
    } else {
        changeStatus(checkId);
    }
}

function changeStatus(checkId) {
    localStorage[checkId] = (localStorage[checkId] == "true") ? "false" : "true";

    if (localStorage[checkId] == "true") {
        $("#"+checkId).prop("checked", true);
    } else {
        $("#"+checkId).prop("checked", false);
    }
}

$(function() {
    initStatus();
});