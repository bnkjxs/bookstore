var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器  
var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
var isIE11 = userAgent.indexOf("rv:11.0") > -1; //判断是否是IE11浏览器
var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var is_fireFox = navigator.userAgent.indexOf("Firefox")>-1;//是否是火狐浏览器

if(!isIE && !isEdge && !isIE11) {//兼容chrome和firefox
}
var isOnbeforeunload = false;
window.onunload = function (){
	window.localStorage.setItem('lastestLeaveTime', new Date().getTime());
}
window.onbeforeunload = function (){
//	window.localStorage.setItem('lastestLeaveTime', new Date().getTime());
	console.log(window.localStorage);
};
