/**
*配置需要对比扫描的页面url
**/
// 对比逻辑
function runDiff(dom2){
  //document.body.innerHTML = diffString(original_source,actual_source);
  //实例化DOMParser并将actual_source转换为dom对象
  //var vParser = new DOMParser();
  //var dom1 = vParser.parseFromString(original_source,"text/html");
  //var dom2 = vParser.parseFromString(actual_source,"text/html");
  //node filterFunction
  function ElementChecker (node) {
            if(node.id || node.className){
            return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
        }

  //当前页面dom的walker
  
  var treeWalker_first = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_ELEMENT,
  ElementChecker,
  false
  );
 
var nodeList_first = [];
 
while(treeWalker_first.nextNode()) nodeList_first.push(treeWalker_first.currentNode);



// 比较页面dom的walker
var treeWalker_second = dom2.createTreeWalker(
  dom2.body,
  NodeFilter.SHOW_ELEMENT,
  ElementChecker,
  false
);
 
var nodeList_second = [];
 
while(treeWalker_second.nextNode()) nodeList_second.push(treeWalker_second.currentNode);

for(var i = 0;i <= nodeList_first.length - 1;i++){
  for (var j in nodeList_second) {
      // 两DOM对象中id相同的进行比较
      if( nodeList_first[i].id !== "" && nodeList_first[i].id == nodeList_second[j].id ){
        // 节点都有子节点
        if(nodeList_first[i].childElementCount>0 && nodeList_second[j].childElementCount>0){
          // 节点下有text文本，要比较
          if (nodeList_first[i].text && nodeList_second[j].text ) {
            if (nodeList_first[i].text !== nodeList_second[j].text) {
              setTips(nodeList_first[i],nodeList_second[j])
              console.info("green",i,nodeList_first[i],j,nodeList_second[j])
              nodeList_first[i].setAttribute('title',"当前："+nodeList_first[i].text)
              delete nodeList_second[j];
              break;
            }
            delete nodeList_second[j];
            break;
          }
          //其中一个没有文本
          else if (nodeList_first[i].text && !nodeList_second[j].text){
            setTips(nodeList_first[i],nodeList_second[j])
            console.info("second没有文本",nodeList_first[i],nodeList_second[j])
            nodeList_first[i].setAttribute('title',"当前："+nodeList_first[i].text)
            delete nodeList_second[j];
            break;
          }
          else if(!nodeList_first[i].text && nodeList_second[j].text){
            setTips(nodeList_first[i],nodeList_second[j])
            console.info("first没有文本",nodeList_first[i],nodeList_second[j])
            nodeList_first[i].setAttribute('title',"当前："+nodeList_first[i].text)
            delete nodeList_second[j];
            break;
          }
          // 节点下只有1个子节点时，还需要对比下outerHtml
          else if (nodeList_first[i].childElementCount ==1 && nodeList_second[j].childElementCount ==1 
            && nodeList_first[i].children.item(0).childElementCount + nodeList_second[j].children.item(0).childElementCount ==0) 
          {
 
          if(nodeList_first[i].outerHTML !== nodeList_second[j].outerHTML){
            setTips(nodeList_first[i],nodeList_second[j])
            console.info("purple",nodeList_first[i],nodeList_second[j]);
            setTitle(nodeList_first[i])
            
            delete nodeList_second[j];
            break;
          }
          delete nodeList_second[j];
          break;
        }
        
        }

        // 该节点都没有子节点
        else if (nodeList_first[i].childElementCount + nodeList_second[j].childElementCount ==0) {
          if(nodeList_first[i].outerHTML !== nodeList_second[j].outerHTML){
            setTips(nodeList_first[i],nodeList_second[j])
            console.info("purple",nodeList_first[i],nodeList_second[j]);
            setTitle(nodeList_first[i])
            
            delete nodeList_second[j];
            break;
          }
          delete nodeList_second[j];
          break;
        }
        // 其中一个节点没有子节点
        else if (nodeList_first[i].childElementCount + nodeList_second[j].childElementCount >0){
            setTips(nodeList_first[i],nodeList_second[j])
            console.info("orange",nodeList_first[i],nodeList_second[j]);
            setTitle(nodeList_first[i])
            
            delete nodeList_second[j];
            break;
        }
        
      }
      //若存在没有的节点如何处理？
      //else{}
        
      // 扩展到class属性相同进行比较
      else if( nodeList_first[i].className !== "" && nodeList_first[i].className == nodeList_second[j].className
        && checkPosition(nodeList_first[i],nodeList_second[j]) 
        && nodeList_first[i].tagName == nodeList_second[j].tagName)
      {

        // 节点都有子节点
        if(nodeList_first[i].childElementCount>0 && nodeList_second[j].childElementCount>0){
          // 节点下有text文本，要比较
          
          if (nodeList_first[i].text && nodeList_second[j].text && nodeList_first[i].childElementCount !==1) {
            if (nodeList_first[i].text !== nodeList_second[j].text) {
              setTips(nodeList_first[i],nodeList_second[j])
              console.info("green",i,nodeList_first[i],j,nodeList_second[j]);
              nodeList_first[i].setAttribute('title',"当前："+nodeList_first[i].text);
              nodeList_first[i].setAttribute('style','background:green');
              
              delete nodeList_second[j];
              break;
            }
            
            delete nodeList_second[j];
            break;
          }
          
          //其中一个没有文本
          else if (nodeList_first[i].text && !nodeList_second[j].text){
            setTips(nodeList_first[i],nodeList_second[j])
            nodeList_first[i].setAttribute('title',"当前："+nodeList_first[i].text);
            console.info("预期页没有文本",nodeList_first[i],nodeList_second[j]);
            
            delete nodeList_second[j];
            break;
          }
          else if(!nodeList_first[i].text && nodeList_second[j].text){
            setTips(nodeList_first[i],nodeList_second[j])
            nodeList_first[i].setAttribute('title',"当前："+nodeList_first[i].text);
            console.info("当前页没有文本",nodeList_first[i],nodeList_second[j]);
            
            delete nodeList_second[j];
            break;
          }
          // 节点下只有1个子节点且没有text属性时，还需要对比下outerHtml
          else if (nodeList_first[i].childElementCount ==1 && nodeList_second[j].childElementCount ==1 
            && nodeList_first[i].children.item(0).childElementCount + nodeList_second[j].children.item(0).childElementCount ==0) 
          {
 
          if(nodeList_first[i].outerHTML !== nodeList_second[j].outerHTML){
            console.info("purple",nodeList_first[i],nodeList_second[j]);
            setTips(nodeList_first[i],nodeList_second[j])
            setTitle(nodeList_first[i])
            delete nodeList_second[j];
            break;
          }
          
          delete nodeList_second[j];
          break;
        }
        }
        // 该节点都没有子节点
        else if (nodeList_first[i].childElementCount + nodeList_second[j].childElementCount ==0 
          ) {
          if(nodeList_first[i].outerHTML !== nodeList_second[j].outerHTML){
            console.info("purple",nodeList_first[i],nodeList_second[j]);
            setTips(nodeList_first[i],nodeList_second[j])
            setTitle(nodeList_first[i])
            delete nodeList_second[j];
            break;
          }
          
          delete nodeList_second[j];
          break;
        }
        // 其中一个节点没有子节点,此逻辑有些问题
        else if (nodeList_first[i].childElementCount + nodeList_second[j].childElementCount >0
             ){
            setTips(nodeList_first[i],nodeList_second[j])
            console.info("orange",nodeList_first[i],nodeList_second[j]);
            setTitle(nodeList_first[i])
            delete nodeList_second[j];
            break;
        }

      }
      //若存在没有的节点如何处理？
      //else{}
        
      // 扩展到class属性相同进行比较
      
      // 如果在同一个位置classname不相等
      // else if( nodeList_first[i].className !== "" && nodeList_first[i].className !== nodeList_second[j].className
      //   && checkPosition(nodeList_first[i],nodeList_second[j]) && nodeList_first[i].tagName == nodeList_second[j].tagName)
      // { 

      // }
      // 没有id相等的情况
      else{
        continue;
      }
  }
  }
  setZindex();
}

      /* 
      *如果直接新开窗口可以解决初始化渲染的问题，但新开窗口体验不好。
      */
      
        //win2 = win.open(actual_host);
    
        
     
function setDom2(host){
  //监听滚动事件
  if(host == "") return;
  var  actual_host = host + window.location.search;
  addIframe(actual_host)
  var swith = true;
  document.onreadystatechange = function(){
  if (document.readyState == "complete") {
    window.document.getElementById('test').contentWindow.scrollTo(0,2000)
    $(window).scroll(function(){
      nWindowHight = $(window).height();
      nScrollTop = $(document).scrollTop();
      if(nWindowHight + nScrollTop > 2800){
        if(swith){
          swith = false;
          var dom = window.document.getElementById('test').contentWindow.document
          $('#test').hide();
          runDiff(dom);
      }
    }
  })
}}
}
function addIframe(url) {
  var subiframe = document.createElement('iframe');
  subiframe.id= "test"; 
  subiframe.name = "test";
  subiframe.src = url;
  subiframe.border = "1";
  subiframe.frameborder = "0";
  subiframe.width = "500px";
  subiframe.height = "500px";
  subiframe.scrolling="auto";

  document.getElementsByTagName('body')[0].appendChild(subiframe);
}            


// 获取节点的坐标
function checkPosition(node1,node2){
  if(node1.offsetLeft == node2.offsetLeft && node1.offsetTop == node2.offsetTop)
  {
    return true;
  }else{
    return false;
  }
}
// 处理结果
function setTitle(node){
  node.setAttribute('title',"当前环境：" + node.outerHTML);

}
// 气泡样式
function setTips(node1,node2){
    $(node1).qtip({
              prerender: true,
               content: "此处有不同，请检查！对比环境为：" + escape(node2.outerHTML), 
                show: {
                 // when: false, 
                  ready: true
               },
               hide: {when: 'dblclick', fixed: true },
               position: {
                adjust: {
                  screen: true // Keep the tooltip on-screen at all times
                }
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

function setZindex(){
  $('.headerNav').css("z-index","1000");
}

//获取节点xpath(性能不好，暂时不用吧)
function getElementTreeXPath(element)
{
    var paths = [];

    // Use nodeName (instead of localName) so namespace prefix is included (if any).
    for (; element && element.nodeType == Node.ELEMENT_NODE; element = element.parentNode)
    {
        var index = 0;
        for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling)
        {
            // Ignore document type declaration.
            if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
                continue;

            if (sibling.nodeName == element.nodeName)
                ++index;
        }

        var tagName = element.nodeName.toLowerCase();
        var pathIndex = (index ? "[" + (index+1) + "]" : "");
        paths.splice(0, 0, tagName + pathIndex);
    }

    return paths.length ? "/" + paths.join("/") : null;
}

function escape(s) {
    var n = s;
    n = n.replace(/&/g, "&amp;");
    n = n.replace(/</g, "&lt;");
    n = n.replace(/>/g, "&gt;");
    n = n.replace(/"/g, "&quot;");

    return n;
}
chrome.extension.sendMessage({greeting: "hello"}, function(response) {
  if (response.switchStatus == "ON") {
    setDom2(response.preHost);
  }
});