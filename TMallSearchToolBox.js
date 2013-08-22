// --------------------------------------------------------------------
// ==UserScript==
// @name          TMallSearch Toolbox
// @namespace     http://www.tmall.com/
// @description   天猫搜索工具箱
// @include       http://list.tmall.com/*
// ==/UserScript==
		
// 将html部分的字符串以div的方式注入到link中去
function injectHtml(link, html) {
	var div = document.createElement('div');
	div.innerHTML = html;
	link.appendChild(div);
}

// 牛皮癣图片举报链接
function reportBadPics(link, currentItemId) {
	var badPic = '<a href = http://rings.taobao.com:9999/edit_punish.php?n' + currentItemId.toString() + ' target=_blank style="position: absolute; visibility: show; top: 200px; left: 5px;">违规降权</a> ';
	injectHtml(link, badPic);
}
// 商品360分析工具链接
function diagonizeItem(link, currentItemId) {
	var itemInfo = '<a href = http://auction-dev.taobao.org:9999/?' + currentItemId.toString() + ' target=_blank style="position: absolute; visibility: show; top: 200px; left: 65px;">商品诊断</a>';
	injectHtml(link, itemInfo);
}
// 排序分析工具页面链接
function debugRankingPage(link) {
	var debugParam = "";
	if( document.URL.match(/debug=true\&debuglevel=3/ig) == null){
		debugParam = '&debug=true&debuglevel=3';
	}

	var itemInfo = '<a href = ' + (document.URL).replace(/\#[A-Z_a-z]+/im,"") + debugParam + ' target=_blank style="position: absolute; visibility: show; top: 200px; left: 125px;">排序分析</a>';
	injectHtml(link, itemInfo);
}

function formatNumber(n){
   var b=parseInt(n).toString();
   var len=b.length;
   if(len<=3){return b;}
   var r=len%3;
   return r>0?b.slice(0,r)+","+b.slice(r,len).match(/\d{3}/g).join(","):b.slice(r,len).match(/\d{3}/g).join(",");
}

function printQP(link, qp){
	var div = document.createElement('div');
	div.innerHTML = '<p style="position: absolute; visibility: show; background-color: white; text-align: left; top: -5px; left: 0px;">'+qp.mlrscore+'</p>';
	link.appendChild(div);
}

function printItem(link, item){
	var str = "";
	var sum = 0;
	for(var prop in item.ranker){
		str += prop + ' : '+ formatNumber(item.ranker[prop]) +'<br>';
		if(prop != 'finalScore' && item.ranker[prop] != 'NaN'){
			sum += Number(item.ranker[prop]);
		}
	}

	if(sum != 0){
		str += '-----------------sum='+formatNumber(sum)+'-----------------';
	}
	str += item.auctionTag+'<br>';
	
	var div = document.createElement('div');
	div.innerHTML = '<p style="position: absolute; visibility: show; background-color: grey; text-align: left; top: 280px; left: 5px;">'+str+'</p>';
	link.appendChild(div);
	
	str = "";
	for(var prop in item.price){
		str += prop + ' : '+ item.price[prop] +'<br>';
	}

	var div = document.createElement('div');
	div.innerHTML = '<p style="position: absolute; visibility: show; background-color: yellow;text-align: left; top: 100px; right: 5px;">'+str+'</p>';
	link.appendChild(div);
}

function parseItems(){
	var body = document.body.innerHTML;
	var regex2 = /\[\d+\]=&gt;/gim;
	var traces = body.split(regex2);
	traces.shift(0);

	var itemList = new Array();
	for(var i = 0; i < traces.length; i++){
		var item = new Object();
		var rankInfo = new Object();
		var itemInfo = new Object();
		var itemTrace = traces[i];
		var finalScore = itemTrace.match(/final score:\[.+\]/);
		
		itemInfo.zkmoney = String(itemTrace.match(/\[zkmoney\]=&gt;[\-0-9\.]+/im)).substring(14);
		itemInfo.skumaxpromotions = String(itemTrace.match(/\[skumaxpromotions\]=&gt;[\-0-9\.]+/im)).substring(23);
		itemInfo.skuminpromotions = String(itemTrace.match(/\[skuminpromotions\]=&gt;[\-0-9\.]+/im)).substring(23);
		itemInfo.maxprice = String(itemTrace.match(/\[maxprice\]=&gt;[\-0-9\.]+/im)).substring(15);
		itemInfo.minprice = String(itemTrace.match(/\[minprice\]=&gt;[\-0-9\.]+/im)).substring(15);
		item.price = itemInfo;
		
		var scores = itemTrace.match(/Qi Feature Score\[[ A-Za-z0-9:\(\)\*\.\[\]\-]+\]/)+"";		
		if(scores != "null"){
			rankInfo.CategoryRatioRefine = (eval(String(scores.match(/CategoryRatioRefine: [\de\.\*\-]+/)).substring(21))*1000000).toFixed(0);	
			rankInfo.TaobaoCoefpRenqiScore = (eval(String(scores.match(/TaobaoCoefpRenqiScore\d: [\de\.\*\-]+/)).substring(24))*1000000).toFixed(0);
			rankInfo.RealPriceFeature1 = (eval(String(scores.match(/RealPriceFeature1: [\de\.\*\-]+/)).substring(19))*1000000).toFixed(0);
			rankInfo.TaobaoSellerScore2 = (eval(String(scores.match(/TaobaoSellerScore2: [\de\.\*\-]+/)).substring(20))*1000000).toFixed(0);
			rankInfo.MlrBrandLevelScore = (eval(String(scores.match(/MlrBrandLevelScore: [0-9e\.\*\-]+/)).substring(20))*1000000).toFixed(0);
			rankInfo.finalScore = eval(String(finalScore).substring(14, String(finalScore).length-1)).toFixed(0);
			rankInfo.AdditionalBusinessFeature = (eval(String(scores.match(/AdditionalBusinessFeatureExtractor: [\de\.\*\-]+/)).substring(36))*1000000).toFixed(0);
			rankInfo.CtrPredictStaticsList = (eval(String(scores.match(/CtrPredictStaticsList: [\de\.\*\-]+/)).substring(23))*1000000).toFixed(0);
			rankInfo.TmallShopTypeFeatureItem = (eval(String(scores.match(/TmallShopTypeFeatureItem: [\de\.\*\-]+/)).substring(26))*1000000).toFixed(0);
			rankInfo.TmallRelevance = (eval(String(scores.match(/TmallRelevance: [0-9e\.\*\-]+/)).substring(16))*1000000).toFixed(0);
			rankInfo.TaobaoTextRelevanceFeature = (eval(String(scores.match(/TaobaoTextRelevanceFeatureExtractor: [\de\.\*\-]+/)).substring(37))*1000000).toFixed(0);	
			rankInfo.SingleTokenMatchFeature = (eval(String(scores.match(/SingleTokenMatchFeatureExtractor: [\de\.\*\-]+/)).substring(34))*1000000).toFixed(0);
			rankInfo.MlrNiuPiXian = (eval(String(scores.match(/MlrNiuPiXian: [0-9e\.\*\-]+/)).substring(14))*1000000).toFixed(0);
			rankInfo.PersonalSexFeature = (eval(String(scores.match(/PersonalSexFeatureExtractor: [0-9e\.\*\-]+/)).substring(29))*1000000).toFixed(0);
			rankInfo.MlrMainBrand = (eval(String(scores.match(/MlrMainBrand: [0-9e\.\*\-]+/)).substring(14))*1000000).toFixed(0);
			rankInfo.UserCtrPredFeatureExtractor = (eval(String(scores.match(/UserCtrPredFeatureExtractor: [0-9e\.\*\-]+/)).substring(29))*1000000).toFixed(0);
		}	
		item.ranker = rankInfo;

		item.auctionTag = String(itemTrace.match(/\[auctionTag\]=&gt;[0-9\s]+/gim))
		
		itemList.push(item);
	}
	return itemList;
}

function parseQP(){
	var body = document.body.innerHTML;
	var qp = new Object();
	
	qp.mlrscore = String(body.match(/\[mlrscore\]=&gt;[0-9\;\:]+/im));
	
	return qp;
}

function scanLinks() {
	var mallLinks = document.getElementsByTagName("a");
	var mallDetailRegex = /detail\.tmall\.com/i;
	var itemIdRegex = /id=[0-9]+/i;
	var debugPageRegex = /debug=true\&debuglevel=3/i;
	var detailLinks = new Array();
	var prevItemId = "";
	for (var i = 0; i < mallLinks.length; i++) {
		var link = mallLinks[i];
		
		//只对detail页面链接做处理，跳过非detail的页面
		if (mallDetailRegex.exec(link.href) == null) {
			continue;
		}
		var currentItemId = itemIdRegex.exec(link.href);
		
		//只对第一次出现的detail页面链接做处理，跳过重复的detail
		if (prevItemId.toString() == currentItemId.toString()) {
			continue;
		}
		detailLinks.push(link);
		//牛皮癣汇报 -- 需要CRM权限
		reportBadPics(link, currentItemId);
		//商品360分析
		diagonizeItem(link, currentItemId);
		//排序分析链接
		debugRankingPage(link);
		prevItemId = currentItemId;
	}
	//排序分析
	if (debugPageRegex.exec(document.URL) != null) {
		var qpInfo = parseQP();
		printQP(detailLinks[0], qpInfo);
		
		var itemList = parseItems();
		for(var i = 0; i < detailLinks.length; i++){
			var link = detailLinks[i];
			var item = itemList[i];
			printItem(link, item);
		}
	}
}

window.setTimeout(scanLinks(), 0);
