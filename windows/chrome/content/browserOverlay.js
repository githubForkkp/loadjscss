(function(window) {
    //配置文件路径，和项目存放路径
    var config = {
        path: '/Users/heliang.hl/workspace/tmall/combo.config.php',
        root: '/Users/heliang.hl/workspace/tmall/assets/'
    };

    //onload 事件处理
    function onPageLoad() {
        init(); 
    }

    function init() {
        var popup = document.getElementById('showdir_popup');
        popup.addEventListener('popupshowing', showPopup, false);

        var assetsDir = document.getElementById('assetsDir'),
            storage = window.content.localStorage;

        assetsDir.addEventListener('click', function(e) {
            showPopup(popup, storage, e);
        }, false);

        //默认选中分支
        var selected = storage.getItem('selected-dir');
        if(!selected) {
            selected = 'branch';
            storage.setItem('selected-dir', selected);
        }
        //更新Add-on显示信息
        updateStatusText(selected);
    }

    // 显示选择列表
    function showPopup(popup, storage, e) {
        addPopupItems(popup, storage, e);
    }

    var cache = {},
        guid = 1;

    function addPopupItems(popup, storage, e) {
        var menuitem;
        
        if(!popup) {
            return; 
        } 
        
        if(popup.childNodes.length > 1) {
            for(var i = popup.childNodes.length - 1; i >= 0; i--) {
                popup.removeChild(popup.childNodes[i]);
            }
        }

        var path = config.path,
            root = config.root,
            dirs = getDirs(root),
            i = dirs.length - 1,
            dir,
            selected = storage.getItem('selected-dir');

        for(; i >= 0; i--) {
            dir = dirs[i];
            menuitem = document.createElement('menuitem');
            menuitem.setAttribute('type', 'checkbox');
            menuitem.setAttribute('label', dir);
            menuitem.className = 'dir-item';
            menuitem.setAttribute('checked', dir === selected ? true : false);
            menuitem.addEventListener('click', (function(menuitem, dir) {
                return function() {
                    var j = popup.childNodes.length - 1;
                    for(; j >= 0; j--) {
                        popup.childNodes[j].setAttribute('checked', false);
                    }
                    menuitem.setAttribute('checked', true);
                    //更新配置文件
                    updateFile(path, dir);
                    //持久化存储到本地
                    storage.setItem('selected-dir', dir);
                }
            })(menuitem, dir), false);
            popup.appendChild(menuitem);
        }
         
        if(popup.state == 'closed') {
            popup.openPopup(e.target, 'after_start', 0, 0, false, false, e);
        }

        if(popup.state == 'hiding') {
            popup.hidePopup(); 
            popup.openPopup(e.target, 'after_start', 0, 0, false, false, e);
        }
    }

    //
    function getDirs(path) {
        //
        var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
        file.initWithPath(path);
        // file is the given directory (nsIFile)
        var entries = file.directoryEntries;
        var array = [];
        while(entries.hasMoreElements()) {
            var entry = entries.getNext();
            entry.QueryInterface(Components.interfaces.nsIFile);
            if(entry.isDirectory()) {
                if(!/^\./.test(entry.leafName)) {
                    array.push(entry.leafName);
                }
            }
        }
        
        return array;
    }
     
    function updateFile(path, dir) {
        //create component for file writing
        var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
        file.initWithPath(path);
        var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
        // use 0x02 | 0x10 to open file for appending.
        //foStream.init(file, 0x02 | 0x10, 0666, 0);
        foStream.init(file, 0x02 | 0x08 | 0x20, 0666, 0); 

        // if you are sure there will never ever be any non-ascii text in data you can
        // also call foStream.write(data, data.length) directly
        var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
        converter.init(foStream, "UTF-8", 0, 0);
        converter.writeString("<?php return array ('bindRoot' => '" + config.root + dir + "', 'bindHost' => 'agile',);");
        converter.close(); // this closes foStream
        //更新Add-on上显示的assets指向
        updateStatusText(dir);
        //更新完成后刷新页面
        refreshPage();
    }

    //刷新页面
    function refreshPage() {
        var browser = getBrowserWindow(); 

        browser.gBrowser.reload();
    }

    //获取浏览器窗口对象
    function getBrowserWindow() {
        var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
        
        return wm.getMostRecentWindow("navigator:browser");
    }

    function on(elem, type, fn) {
        if(!cache[elem]) {
            cache[elem] = {};
            cache[elem][type] = [];
        }
        cache[elem][type].push(fn);
    }

    function off() {
         
    }

    function updateStatusText(dir) {
        if(dir) {
            document.getElementById('assetsDir').setAttribute('label', 'Assets指向 ' + dir);
        }
    }

    function switchDir() {}

    window.addEventListener('load', onPageLoad, false);
})(window);
