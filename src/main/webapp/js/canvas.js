var map,map2,map3;//地图
var mapXYs = [];// 地图坐标集合	
var fourGDatas = [];// 机车实时信息
var images = [];// 地图元素图片集合
var onlineNums = 0;// 在线机车数
var offlineNums = 0;// 离线机车数
var RealDataWebsocket = null;// 真实数据的webscket

$(function(){
	images[0] = new Image();
	images[0].src = "/OneOperationGAS/images/zhuye/map_online.png";
	images[1] = new Image();
	images[1].src = "/OneOperationGAS/images/zhuye/map_offline.png";
	
	map = new ChtMap({
		container: "map1",
		showCut: true,
		pointOfTrains : [],// 机车解析后坐标
		mapUrl:"/OneOperationGAS/images/zhuye/map.png",
		style :{
			cutTop: 10,
    	    cutLeft: 10,
		},
		initSuccess : function(){//初始化
		},
		loadSucsess : function(){//加载完成事件
			drawSymbols(map);
		},
		onmousemove : function(e){//鼠标移动事件
			mapOnMouseMove(e,map);
		},
		ondblclick : function(e){//鼠标双击事件
			mapOnMouseDblClick(e,map);
		},
	});

	map2 = new ChtMap({
		container: "map2",
		showCut: true,
		pointOfTrains : [],// 机车解析后坐标
		mapUrl:"/OneOperationGAS/images/zhuye/map.png",
		style :{
			cutTop: 10,
			cutLeft: 10,
		},
		initSuccess : function(){//初始化
		},
		loadSucsess : function(){//加载完成事件
			drawSymbols(map2);
		},
		onmousemove : function(e){//鼠标移动事件
			mapOnMouseMove(e,map2);
		},
		ondblclick : function(e){//鼠标双击事件
			mapOnMouseDblClick(e,map2);
		},
	});
	
	map3 = new ChtMap({
		container: "map3",
		showCut: true,
		pointOfTrains : [],// 机车解析后坐标
		mapUrl:"/OneOperationGAS/images/zhuye/map.png",
		style :{
			cutTop: 10,
			cutLeft: 10,
		},
		initSuccess : function(){//初始化
		},
		loadSucsess : function(){//加载完成事件
			drawSymbols(map3);
		},
		onmousemove : function(e){//鼠标移动事件
			mapOnMouseMove(e,map3);
		},
		ondblclick : function(e){//鼠标双击事件
			mapOnMouseDblClick(e,map3);
		},
	});
	
	//加载地图坐标
	loadMapXY();
//	//加载4G机车信息
//	loadFourGData();
//	//定时刷新数据
//	setInterval(function(){
//		//加载4G机车信息
//		loadFourGData();
//	}, 5000);
	
	addLayer();
	
	RealDataWebsocket = new WebSocket("ws://"+location.host+"/OneOperationGAS/websocket/realdata");
	RealDataWebsocket.onmessage = loadFourGData;
	
	window.onbeforeunload = function () {
		RealDataWebsocket.close();
	 }
	window.onresize = function(){
		map.reload();
	};
});

//TODO REQUEST
/*************************************REQUEST********************************************/
/**
 * 获取XY坐标的所有数据
 * 
 */
function loadMapXY() {	 
	$.ajax({
		type: 'POST',
		async : false,
		url: '/OneOperationGAS/analysisPage/getAllXYEntity',
		dataType: 'json',
//			data :{
//				"ID" : ID,
//			},
		success: function(data){	
			mapXYs=data;
			//console.log(mapXYs);
		},
		error:function(data) {
//			layer.msg('网络异常请联系管理人员！',function(){});
		},
	});
};

/**
 * 获取4G数据
 */
var firstFlag = true;
function loadFourGData(event){
	if(event.data){
		var data = {};
		try {
			data = eval("(" + event.data + ")");
		} catch (e) {
			console.log(event.data);
		}
		fourGDatas = data;
		if(firstFlag && map.success && map2.success && map3.success){
			//绘制标绘
			map.redraw();
			//绘制标绘
			map2.redraw();
			//绘制标绘
			map3.redraw();
			firstFlag = false;
		}
		
		//更新机车信息
		updateTrains(data);
	}
//	$.ajax({
//		url : '/OneOperationGAS/fullDisplay/getAllRealData',
//		type : "POST",
//		dataType : "json",
//		traditional : true,
//		success : function(data) {
//			fourGDatas = data;
//			if(firstFlag && map.success && map2.success && map3.success){
//				//绘制标绘
//				map.redraw();
//				//绘制标绘
//				map2.redraw();
//				//绘制标绘
//				map3.redraw();
//				firstFlag = false;
//			}
//			
//			//更新机车信息
//			updateTrains(data);
//		},
//		error : function(data) {
////			 layer.msg("获取线路关联交路信息出现异常,请联系管理人员！", function() {
////			 });
//		}
//	});
}

//TODO PAINT
/*************************************PAINT********************************************/
var layer = null;
function addLayer(){
	layer = map.addLayer();
	
	//图
	var image = new map.Image({
		x: 600,
		y: 600,
		width: 25,
		height: 25,
		url: "/OneOperationGAS/images/zhuye/map_online.png",
	});
	layer.addFeature(image);

	//图
	var pic = new map.Picture({
		x: 600,
		y: 800,
		width: 25,
		height: 25,
		url: "/OneOperationGAS/images/zhuye/map_online.png",
	});
	layer.addFeature(pic);
	
	//点
	var point = new map.Point({
		x:500,
		y:600,
		fillStyle:"#f00",
		strokeStyle:"#fff",
		lineWidth:1,
		radius:5,
	});
	layer.addFeature(point);
	
	//线
	var line = new map.Line({
		fillStyle:"#f00",
		strokeStyle:"#fff",
		path: [
		       {x:500,y:600},
		       {x:900,y:600},
		       {x:600,y:700},
		       {x:400,y:800},
		       {x:800,y:900},
		       {x:800,y:900},
		       ]
	});
	layer.addFeature(line);
	
	//面
	var polygon = new map.Polygon({
		fillStyle:"#f00",
		strokeStyle:"#fff",
		path: [
		       {x:1100,y:1100},
		       {x:1400,y:1100},
		       {x:1200,y:1200},
		       {x:1100,y:1300},
		       {x:1300,y:1400},
		       {x:1300,y:1400},
		       ]
	});
	layer.addFeature(polygon);
	
	//文字
	var text = new map.Text({
		x: 600,
		y: 700,
		text: "Hello world!"
	});
	layer.addFeature(text);
}

/**
 * 绘制标绘
 */
function drawSymbols(map){
	var canvas = map.canvas;
	var context = map.context;

	//清除渲染画布
//	context.clearRect(0,0,canvas.width,canvas.height);
	
	var mapPoints = [];
	for (var i = 0; i < mapXYs.length; i++) {
		var point = map.calculateXY(mapXYs[i].xyX, mapXYs[i].xyY, "old", "render");
		mapPoints[i] = {};
		mapPoints[i].xyX = point.x;
		mapPoints[i].xyY = point.y;
		mapPoints[i].state = mapXYs[i].state;
		mapPoints[i].xyGlb = mapXYs[i].xyGlb;
	}
	map.pointOfTrains = calculateXY(fourGDatas, mapPoints);
	
	// 开始绘制
	context.beginPath();
	context.strokeStyle = "rgb(255,255,255)";
	context.fillStyle = "rgb(255,255,255)";

	// 遍历绘制运动坐标
	for ( var i in map.pointOfTrains) {
		if(map.pointOfTrains[i]==null){
			continue;
		}
		var image = images[map.pointOfTrains[i].state];
		var width = image.width + map.zoom*3;
		var height = image.height + map.zoom*3;
		context.drawImage(image, map.pointOfTrains[i].x - width / 2, map.pointOfTrains[i].y
				- height / 2, width, height);
	}

	context.stroke();
	context.closePath();
	
	/*鹰眼绘制*/
	var mapPoints2 = [];
	for (var i = 0; i < mapXYs.length; i++) {
		var point = map.calculateXY(mapXYs[i].xyX, mapXYs[i].xyY, "old", "cut");
		mapPoints2[i] = {};
		mapPoints2[i].xyX = point.x;
		mapPoints2[i].xyY = point.y;
		mapPoints2[i].state = mapXYs[i].state;
		mapPoints2[i].xyGlb = mapXYs[i].xyGlb;
	}
	var points = calculateXY(fourGDatas, mapPoints2);
	var cutContext = map.cutContext;
	for (i in points) {
		if(points[i].state==0){
			cutContext.fillStyle="#34dbae";
		} else{
			cutContext.fillStyle="#FF0000";
		}
    	cutContext.beginPath();
    	cutContext.arc(points[i].x,points[i].y,1,0,2*Math.PI);
    	cutContext.fill();
    	cutContext.closePath();
	}
}

/**
 * 更新机车信息
 */
function updateTrains(data) {
	countTrains(data);
//	document.getElementById("mapOnline").innerHTML = "" + onlineNums;
//	document.getElementById("mapOffline").innerHTML = "" + offlineNums;
}

///**
// * 绘制所有机车信息
// * @param list 点击范围内的数据
// */
//function paintTrianMsg(list,x,y){
//	var canvas = map.actionCanvas;
//	var context = map.actionContext;
//	context.clearRect(0,0,canvas.width,canvas.height);
//	
//	//如果没有数据不进行绘制
//	if(list==null||list.length<1){
//		return "";
//	}
//	
//	x = list[0].x;
//	y = list[0].y;
//	
//	var cw = canvas.offsetWidth;// 画布高度
//	var ch = canvas.offsetHeight;// 画布宽度
//	canvas.width = cw;
//	canvas.height = ch;
//	context.width = canvas.width;
//	context.height = canvas.height;
//	
//	//绘制三角形
//	context.beginPath();
//	context.moveTo(x, y);
//	context.lineTo(x-10, y+20);
//	context.lineTo(x+10, y+20);
//	context.fillStyle = "rgb(11,38,66)";
//	context.closePath();
//	context.fill();
//	context.beginPath();
//	context.moveTo(x-11, y+21);
//	context.lineTo(x, y+1);
//	context.lineTo(x+11, y+21);
//	context.strokeStyle = "rgb(84,121,168)";
//	context.closePath();
//	context.stroke();
//	y+=20;
//	
//	//定义绘制参数
//	var h=20;
//	var w=400;
//	var columns=[0,1,2,3,4];
//	var column=5;
//	var margn=6;
//	//绘制边框
//	context.beginPath();
//	context.fillStyle = "rgb(84,121,168)";
//	context.fillRect(x-w/2-1, y-1,w+2, h*list.length+2);
//	context.stroke();
//	context.closePath();
//	context.beginPath();
//	context.fillStyle = "rgb(11,38,66)";
//	context.fillRect(x-w/2, y,w, h*list.length);
//	context.stroke();
//	context.closePath();
//	drawLine(x - 10, y,x + 10, y, "rgb(11,38,66)", "stroke", context);
//	
//	//绘制数据
//	context.beginPath();
//	context.strokeStyle = "rgb(255,255,255)";
//	context.fillStyle = "rgb(255,255,255)";
//	var i=0,left=5;
//	for(;i<list.length;i++){
//		var trainInfo=list[i].data;
//		context.fillText("车型：" + trainInfo.trainName, x+left-w/2+w*columns[0]/column, y +h*(i+1)-margn);
//		context.fillText("车号：" + trainInfo.locoNum, x+left-w/2+w*columns[1]/column, y +h*(i+1)-margn);
//		context.fillText("车次：" + trainInfo.trips, x+left-w/2+w*columns[2]/column, y +h*(i+1)-margn);
//		context.fillText("司机号：" + trainInfo.driverNumber, x+left-w/2+w*columns[3]/column, y +h*(i+1)-margn);
//		context.fillText("本/补：" + trainInfo.strKH + trainInfo.strBB, x+left-w/2+w*columns[4]/column, y +h*(i+1)-margn);
//	}
//	context.stroke();
//	context.closePath();
//}

/**
 * 绘制所有机车信息
 * @param list 点击范围内的数据
 */
function paintTrianMsg(list,x,y,map){
	//如果没有数据不进行绘制
	if(list==null||list.length<1){
		map.basePopup.hide();
		return "";
	}
	
	
	x = list[0].x;
	y = list[0].y;
	
	var contentHtml = "<div style='padding:5px;'>";
	contentHtml += "<ul>";
	for(var i=0;i<list.length;i++){
		var trainInfo=list[i].data;
		//车型+车号
		var keyI = trainInfo.locoType + "-" + trainInfo.locoNum;
		var url = "/OneOperationGAS/fullDisplay/jump2singleDisplay?key=" + keyI
				+ '&trainType=' + trainInfo.locoType + '&totalWeight='
				+ trainInfo.totalWeight+'&jlId=' +  trainInfo.jlId;
		// trainInfo.jlId;  交路ID 替代的线路ID（暂时性）；
		if (trainInfo.buRealBean != null) {
			url = url + "&buTrainType=" + trainInfo.buRealBean.locoType
					+ "&buTrain=" + trainInfo.buRealBean.locoNum;
		}
		
		contentHtml += "<li class='map_popup_li' style=\"cursor:pointer;border-bottom: 1px solid #d4cece;\" onclick=\"singleJumpOf4G('"+url+"');\">";
		contentHtml += "车型：<span style='margin-right:5px;'>" + trainInfo.trainName + "</span>";
		contentHtml += "车号：<span style='margin-right:5px;'>" + trainInfo.locoNum + "</span>";
		contentHtml += "车次：<span style='margin-right:5px;'>" + trainInfo.trips + "</span>";
		contentHtml += "司机号：<span style='margin-right:5px;'>" + trainInfo.driverNumber + "</span>";
		contentHtml += "本/补：<span style='margin-right:5px;'>" + trainInfo.strKH + trainInfo.strBB + "</span>";
		contentHtml += "</li>";
	}
	contentHtml += "</ul>";
	contentHtml += "</div>";
	map.basePopup.setBasePopup(contentHtml,x,y,true);
	$(map.basePopup.contentDOM)
	.find('.map_popup_li')
	.mouseover(function(){
		$(this).css("background","#c1c1c1");
	})
	.mouseout(function(){
		$(this).css("background","transparent");
	});
}

function drawLine(x1, y1, x2, y2,color, type,ctx) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx[type + 'Style'] = color;
    ctx.closePath();
    ctx[type]();
}

//TODO ACTION
/*************************************ACTION********************************************/
/**
 * 地图鼠标滑过事件
 */
function mapOnMouseMove(event,map){
	var range = 10;
	var x = event.clientX - $(map.canvas).offset().left;
    var y = event.clientY - $(map.canvas).offset().top;
	var list=[];
	var j=0;
	for(var i in map.pointOfTrains){
		if(map.pointOfTrains[i].x-range>x||x>map.pointOfTrains[i].x+range){
			continue;
		}
		if(map.pointOfTrains[i].y-range>y||y>map.pointOfTrains[i].y+range){
			continue;
		}
		list[j]=map.pointOfTrains[i];
		j++;
	}
	
	paintTrianMsg(list, x, y,map);
}

/**
 * 地图，鼠标双击事件
 * @param event
 */
function mapOnMouseDblClick(event,map){
	var range = 10;
	var x=event.layerX;
	var y=event.layerY;	
	for(var i in map.pointOfTrains){
		if(map.pointOfTrains[i].x-range>x||x>map.pointOfTrains[i].x+range){
			continue;
		}
		if(map.pointOfTrains[i].y-range>y||y>map.pointOfTrains[i].y+range){
			continue;
		}
		//车型+车号
		var keyI = map.pointOfTrains[i].data.locoType + "-" + map.pointOfTrains[i].data.locoNum;
		console.log("点击X坐标："+event.layerX+"，点击Y坐标："+event.layerY);
		var url = "/OneOperationGAS/fullDisplay/jump2singleDisplay?key=" + keyI
				+ '&trainType=' + map.pointOfTrains[i].data.locoType + '&totalWeight='
				+ map.pointOfTrains[i].data.totalWeight+'&jlId=' +  map.pointOfTrains[i].data.jlId;
		// pointOfTrains[i].data.jlId;  交路ID 替代的线路ID（暂时性）；
		if (map.pointOfTrains[i].data.buRealBean != null) {
			url = url + "&buTrainType=" + map.pointOfTrains[i].data.buRealBean.locoType
					+ "&buTrain=" + map.pointOfTrains[i].data.buRealBean.locoNum;
		}
		
		singleJumpOf4G(url);
		
		break;
	}
}

/**
 * 单机展示跳转
 * @param url
 */
function singleJumpOf4G(url){
	window.open(url);//跳转打开新窗口页面
//	window.location.href = url;//跳转打开窗口页面 覆盖原来的窗口
}

//TODO CALCULATE
/*************************************CALCULATE********************************************/

/**
 * 计算所有机车的坐标信息
 * 
 * @param realDatas
 *            所有机车信息
 * @param mapXYs
 *            地图描点信息集合
 * @returns {Array} 所有机车的坐标信息
 */
function calculateXY(realDatas, mapXYs) {
	//console.log("开始计算坐标");
	var i;
	var points = [];
	for (i in realDatas) {
		var point = calculateOnePoint(realDatas[i], mapXYs);
		if(point!=null){
			points.push(point);
		}
	}
	return points;
}

/**
 * 计算单个机车的坐标信息
 * 
 * @param realData
 *            单个机车数据信息
 * @param mapXYs
 *            地图描点信息集合
 * @returns 单个机车的坐标对象
 */
function calculateOnePoint(realData, mapXYs) {
	var i = 1;
	var len = mapXYs.length;
	var glb = realData.glb / 1000;
	for (; i < len; i++) {
		if (glb <= mapXYs[i].xyGlb && glb >= mapXYs[i - 1].xyGlb) {
			var point = calculatePoint(mapXYs[i - 1], mapXYs[i], glb);
			if(point==null){
				return null;
			}
			if (realData.state == "在线") {
				point.state = 0;
			} else {
				point.state = 1;
			}
			point.data=realData;
			return point;
		}
	}
	return null;
}

/**
 * 根据公里标及所处区段计算对应坐标
 * 
 * @param start
 *            所属描点区段起始坐标
 * @param end
 *            所属描点区段结束坐标
 * @param glb
 *            公里标
 * @returns 计算后坐标对象
 */
function calculatePoint(start, end, glb) {
	var point = new Object();
	point.x = start.xyX + (end.xyX - start.xyX) * (glb - start.xyGlb)
			/ (end.xyGlb - start.xyGlb);
	point.y = start.xyY + (end.xyY - start.xyY) * (glb - start.xyGlb)
			/ (end.xyGlb - start.xyGlb);
	return point;
}

/**
 * 计算在线离线机车总数
 * 
 * @param realData
 *            所有机车信息
 * @param onlineNums
 *            在线机车数
 * @param offlineNums
 *            离线机车数
 */
function countTrains(realDatas) {
	var j = 0, k = 0;
	for ( var i in realDatas) {
		if (realDatas[i].state == "在线") {
			j++;
		} else {
			k++;
		}
	}
	onlineNums = j;
	offlineNums = k;
}

function download(){

	// 图片导出为 png 格式
	var type = 'png';
	var imgData = map.canvas.toDataURL(type);
	
	/**
	 * 获取mimeType
	 * @param  {String} type the old mime-type
	 * @return the new mime-type
	 */
	var _fixType = function(type) {
	    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
	    var r = type.match(/png|jpeg|bmp|gif/)[0];
	    return 'image/' + r;
	};
	   
	// 加工image data，替换mime type
	imgData = imgData.replace(_fixType(type),'image/octet-stream');
	
	/**
	 * 在本地进行文件保存
	 * @param  {String} data     要保存到本地的图片数据
	 * @param  {String} filename 文件名
	 */
	var saveFile = function(data, filename){
	    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
	    save_link.href = data;
	    save_link.download = filename;
	   
	    var event = document.createEvent('MouseEvents');
	    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	    save_link.dispatchEvent(event);
	};
	   
	// 下载后的问题名
	var filename = 'baidufe_' + (new Date()).getTime() + '.' + type;
	// download
	saveFile(imgData,filename);
}