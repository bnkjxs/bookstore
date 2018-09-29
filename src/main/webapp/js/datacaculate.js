/**
 * 功能描述：
 * 1、解析数据为分段数据(按状态、上下行划分)
 * 2、计算所有刻度值数组
 * 3、传入初始参数计算当前可显示刻度
 * 4、左右移动固定公里标计算显示刻度
 * 5、传入位置数据返回对应实际数据内容
 * 6、计算可实现数据
 */

var realDataArr = [];//数据
var realDataParseArr = [];//解析后数据
var realTickMarkAll = [];//所有刻度数据
var tickMarkLen = 1;//刻度距离，公里计
var unitBili = 100;//单位比例，像素每公里
var disPlayOffsetX = 0;//偏移量
var displayTickMarkArr = [];//当前显示刻度
var displayData = [];//当前显示数据
var startX = 100;//起点坐标
var canvasW = 1000;//画布宽度
var startZtfdIndex = 0;//起点状态分段下标
var startPxqdIndex = 0;//起点排序分段下标
var startGlb = 219;//起点公里标

(function( window, undefined ) {
	realDataArr = data;
	realDataParseArr = parseRealData(realDataArr);
	realTickMarkAll = caculateAllTickMark(realDataParseArr, tickMarkLen, unitBili);
	displayTickMarkArr = caculateDisplayTickMark(startX,canvasW, realTickMarkAll, startZtfdIndex, startPxqdIndex, realDataParseArr[startZtfdIndex][startPxqdIndex][0].glb);
	displayData = caculateDisplayRealDatas();
})( window );

/**
 * 解析数据为分段数据
 */
function parseRealData(data){
	var ztqdIndex = 0;//遍历时当前区段下标
	var realdataQuduan = [];//遍历时当前区段实际数据
	var realdataQuduanArr = [];
	var resultQuduanArr = [];
	for(var i=0;i<data.length;i++){
		if(data[i].code=="开车对标"){//突变状况1，保留突变前区段数据，还原当前区段数据为空，当前区段索引加一
			realdataQuduanArr[ztqdIndex] = realdataQuduan;
			realdataQuduan = [];
			ztqdIndex++;
		} else if(data[i].code=="公里标突变"){//突变状况2，保留突变前区段数据，还原当前区段数据为空，当前区段索引加一
			realdataQuduanArr[ztqdIndex] = realdataQuduan;
			realdataQuduan = [];
			ztqdIndex++;
		} else {
			//当前区段数据添加
			realdataQuduan.push(data[i]);
		}
		
		//最终区段数据添加
		if(i == data.length - 1){
			realdataQuduanArr[ztqdIndex] = realdataQuduan;
		}
	}
	
	//将数据分段
	 realdataQuduanArr.forEach(function (v) {
	        // 创建新数组,第二维
       var temp = [];
       resultQuduanArr.push(temp);
       // 循环排序
       v.forEach(function (val) {
           // 初始化新增数组，第三维
           if (!temp.length) {
               temp.push([val]);
           } else {
               var sortArr = temp[temp.length - 1];
               // 判断是否确认排序规则
               if (!sortArr.sortType) {
                   if (sortArr[sortArr.length - 1].glb > val.glb) {
                       sortArr.sortType = 'desc';
                   } else if (sortArr[sortArr.length - 1].glb< val.glb) {
                       sortArr.sortType = 'undesc';
                   }
                   sortArr.push(val);
               } else {
                   if ((sortArr[sortArr.length - 1].glb >= val.glb && sortArr.sortType == 'desc')
                           || (sortArr[sortArr.length - 1].glb <= val.glb && sortArr.sortType == 'undesc')) {
                       sortArr.push(val);
                   } else {
                       temp.push([val]);
                   }
               }
           }
       })
   })
	
	return resultQuduanArr;
}

/**
 * 计算所有刻度值
 * @param realDataParseArr
 * 			分段后的实际数据
 * @param vx 
 * 			刻度变化值				
 * @param bili 
 * 			单位比例，像素每公里				
 */
function caculateAllTickMark(realDataParseArr, vx, bili){
	var resultArr = [];//结果数组
	var x = 0;
	for (var i = 0; i < realDataParseArr.length; i++) {
		for (var j = 0; j < realDataParseArr[i].length; j++) {
			var sortType = realDataParseArr[i][j].sortType;//排序类型
			var lastGlb = realDataParseArr[i][j][realDataParseArr[i][j].length-1].glb;//这段最末公里标
			var tickMark;//当前刻度
			var tickMarkArr = [];
			var startData = realDataParseArr[i][j][0];
			var isStart = true;
			resultArr.push(tickMarkArr);
			tickMarkArr.sortType = sortType;
			tickMarkArr.ztqdIndex = i;
			tickMarkArr.pxqdIndex = j;
			
			tickMark = startData.glb;
			tickMarkArr.push({value : tickMark, x : x});
			
			for (var k = 0; k < realDataParseArr[i][j].length; k++) {
				if(sortType == "undesc"){//正序
					var newTickMark,newX;
					if(isStart){
						newTickMark = Math.ceil(startData.glb + 0.001);
						newX = x + bili*(newTickMark - startData.glb);
						isStart = false;
					} else {
						newTickMark = tickMark + vx; 
						newX = x + vx*bili;
					}

					if(newTickMark  > lastGlb){
						x += (lastGlb - tickMark)*bili;
						tickMark = lastGlb;
						tickMarkArr.push({value : tickMark, x : x});
						break;
					} else {
						x = newX;
						tickMark = newTickMark;
						tickMarkArr.push({value : tickMark, x : x});
					}
					
				} else {//降序
					var newTickMark,newX;
					if(isStart){
						newTickMark = Math.floor(startData.glb - 0.001);
						newX = x + bili*(startData.glb - newTickMark);
						isStart = false;
					} else {
						newTickMark = tickMark - vx; 
						newX = x + vx*bili;
					}
					if(newTickMark  < lastGlb){
						x += (tickMark - lastGlb)*bili;
						tickMark = lastGlb;
						tickMarkArr.push({value : tickMark, x : x});
						break;
					} else {
						x = newX;
						tickMark = newTickMark;
						tickMarkArr.push({value : tickMark, x : x});
					}
				}
			}
		}
	}
	
	console.log(resultArr);
	return resultArr;
}

/**
 * 计算当前界面可显示刻度值
 * @param sx
 * 		起点坐标
 * @param cw
 * 		画布宽度
 * @param tickMarkAll
 * 		所有刻度数据
 * @param ztqdIndex
 * 		状态区段下标,一级数组
 * @param pxqdIndex
 * 		排序区段下标,二级数组
 * @param startGlb
 * 		起始公里标
 */
function caculateDisplayTickMark(sx, cw, tickMarkAll, ztqdIndex, pxqdIndex, startglb){
	var  resultArr = [];
	var isStart = false;//开始条件
	var isEnd = false;//结束条件
	
	if(ztqdIndex == 0 && pxqdIndex == 0 && tickMarkAll.length > 0){
		if(tickMarkAll.length > 0 && tickMarkAll[0].sortType == "undesc" && startglb < tickMarkAll[0][0].value){
			startglb = tickMarkAll[0][0].value;
		} else if(tickMarkAll.length > 0 && tickMarkAll[0].sortType == "desc" && startglb > tickMarkAll[0][0].value){
			startglb = tickMarkAll[0][0].value;
		}
	}
	
	startX = sx;//起点坐标
	canvasW = cw;//画布宽度
	startZtfdIndex = ztqdIndex;//起点状态分段下标
	startPxqdIndex = pxqdIndex;//起点排序分段下标
	startGlb = startglb;//起点公里标
	
	for (var i = 0; i < tickMarkAll.length; i++) {
		if(isEnd){
			break;
		}
		
		if(ztqdIndex == tickMarkAll[i].ztqdIndex && pxqdIndex == tickMarkAll[i].pxqdIndex){
			isStart = true;
		}
		
		if(isStart){
			for (var j = 1; j < tickMarkAll[i].length; j++) {
				//起点存在的情况下，添加新刻度
				if(resultArr.length > 0){
					var tickMark = {};
					tickMark.x = sx + tickMarkAll[i][j].x - disPlayOffsetX;
					tickMark.offsetX = disPlayOffsetX;
					tickMark.ztqdIndex = tickMarkAll[i].ztqdIndex;
					tickMark.pxqdIndex = tickMarkAll[i].pxqdIndex;
					tickMark.sortType = tickMarkAll[i].sortType;
					tickMark.value = tickMarkAll[i][j].value;
					resultArr.push(tickMark);
					
					if(tickMark.x - resultArr[0].x  > cw){
						isEnd = true;
						break;
					}
				} else {
					var isAdd = false;
					if(tickMarkAll[i].sortType == "desc" 
						&& tickMarkAll[i][j-1].value >= startglb 
						&& tickMarkAll[i][j].value <= startglb){
						isAdd = true;
					} else if(tickMarkAll[i].sortType == "undesc" 
						&& tickMarkAll[i][j-1].value <= startglb 
						&& tickMarkAll[i][j].value >= startglb){
						isAdd = true;
					}
					
					//添加起点
					if(isAdd){
						var tickMark = {};
						disPlayOffsetX = tickMarkAll[i][j-1].x + Math.abs(startglb - tickMarkAll[i][j-1].value)*unitBili;
						tickMark.x = sx;
						tickMark.offsetX = disPlayOffsetX;
						tickMark.ztqdIndex = tickMarkAll[i].ztqdIndex;
						tickMark.pxqdIndex = tickMarkAll[i].pxqdIndex;
						tickMark.sortType = tickMarkAll[i].sortType;
						tickMark.value = startglb;
						
						resultArr.push(tickMark);
						
						var tickMark2 = {};
						tickMark2.x = sx + tickMarkAll[i][j].x - disPlayOffsetX;
						tickMark2.offsetX = disPlayOffsetX;
						tickMark2.ztqdIndex = tickMarkAll[i].ztqdIndex;
						tickMark2.pxqdIndex = tickMarkAll[i].pxqdIndex;
						tickMark2.sortType = tickMarkAll[i].sortType;
						tickMark2.value = tickMarkAll[i][j].value;
						
						resultArr.push(tickMark2);
					}
				}
			}
		}
	}
	
	displayTickMarkArr = resultArr;
	
	console.log(resultArr);
	return resultArr;
}

/**
 * 计算左右移动时，地图上可显示的公里标
 * @param v
 * 			偏移量：正数，左移；负数，右移
 */
function caculateDisplayTickMarkChange(v){
	var resultArr = [];
	var isStart = false;
	var isEnd = false;
	var offsetX = disPlayOffsetX + v;
	
	if(v >= 0){//向前遍历
		for (var i = 0; i < realTickMarkAll.length; i++) {
			if(isEnd){
				break;
			}
			for (var j = 0; j < realTickMarkAll[i].length; j++) {
				if(!isStart){
					if(realTickMarkAll[i].ztqdIndex == startZtfdIndex && realTickMarkAll[i].pxqdIndex == startPxqdIndex){
						isStart = true;
					}
				}
				
				if(isStart && realTickMarkAll[i][j].x >= offsetX){
					isEnd = true;
					startZtfdIndex = realTickMarkAll[i].ztqdIndex;
					startPxqdIndex = realTickMarkAll[i].pxqdIndex;
					if(realTickMarkAll[i].sortType == "undesc"){
						startGlb = realTickMarkAll[i][j-1].value 
						+ Number(((offsetX - realTickMarkAll[i][j-1].x)/unitBili).toFixed(2));
					} else {
						startGlb = realTickMarkAll[i][j-1].value 
						- Number(((offsetX - realTickMarkAll[i][j-1].x)/unitBili).toFixed(2));
					}
					break;
				}
				
				if(isStart && i == realTickMarkAll.length-1 && j == realTickMarkAll[i].length -1 && realTickMarkAll[i][j].x < offsetX){
					startZtfdIndex = realTickMarkAll[i].ztqdIndex;
					startPxqdIndex = realTickMarkAll[i].pxqdIndex;
					startGlb = realTickMarkAll[i][j].value;
				}
			}
		}
	} else {//向后遍历
		for (var i = realTickMarkAll.length-1; i >= 0; i--) {
			if(isEnd){
				break;
			}
			
			for (var j = realTickMarkAll[i].length-1; j > 0; j--) {
				if(!isStart){
					if(realTickMarkAll[i].ztqdIndex == startZtfdIndex && realTickMarkAll[i].pxqdIndex == startPxqdIndex){
						isStart = true;
					}
				} 
				if(isStart && realTickMarkAll[i][j-1].x <= offsetX){
					isEnd = true;
					startZtfdIndex = realTickMarkAll[i].ztqdIndex;
					startPxqdIndex = realTickMarkAll[i].pxqdIndex;
					if(realTickMarkAll[i].sortType == "undesc"){
						startGlb = realTickMarkAll[i][j-1].value 
						+ Number(((offsetX - realTickMarkAll[i][j-1].x)/unitBili).toFixed(2));
					} else {
						startGlb = realTickMarkAll[i][j-1].value 
						- Number(((offsetX - realTickMarkAll[i][j-1].x)/unitBili).toFixed(2));
					}
					break;
				}
				
				if(isStart && i ==0 && j == 1 && realTickMarkAll[i][j-1].x > offsetX){
					startZtfdIndex = realTickMarkAll[i].ztqdIndex;
					startPxqdIndex = realTickMarkAll[i].pxqdIndex;
					startGlb = realTickMarkAll[i][j-1].value;
				}
			}
		}
	}
	console.log(startGlb);
	//重新计算显示刻度
	resultArr = caculateDisplayTickMark(startX,canvasW, realTickMarkAll, startZtfdIndex, startPxqdIndex, startGlb);

	return resultArr;
}

/**
 * 根据X坐标计算对应实际数据
 * @param x
 * 			x轴坐标
 */
function caculateRealDataByX(x){
	var result,glb,ztqdIndex,pxqdIndex;
	for (var i = 1; i < displayTickMarkArr.length; i++) {
		if(displayTickMarkArr[i-1].x <= x && x <= displayTickMarkArr[i].x){
			ztqdIndex = displayTickMarkArr[i].ztqdIndex;
			pxqdIndex = displayTickMarkArr[i].pxqdIndex;
			if(displayTickMarkArr[i].sortType == "undesc"){
				glb = displayTickMarkArr[i].value - (displayTickMarkArr[i].x - x)/unitBili;
			} else {
				glb = displayTickMarkArr[i].value + (displayTickMarkArr[i].x - x)/unitBili;
			}
			break;
		}
		
		//超出范围取最大
		if(i == displayTickMarkArr.length - 1 &&  x > displayTickMarkArr[i].x){
			ztqdIndex = displayTickMarkArr[i].ztqdIndex;
			pxqdIndex = displayTickMarkArr[i].pxqdIndex;
			glb = displayTickMarkArr[i].value;
		}
	}
	
	if(glb != undefined){
		var arr = realDataParseArr[ztqdIndex][pxqdIndex];
		for (var i = 1; i < arr.length; i++) {
			if(arr.sortType == "undesc"){
				if(arr[i].glb >= glb){
					if(Math.abs(arr[i-1].glb - glb) > Math.abs(arr[i].glb - glb)){
						result = arr[i];
					} else{
						result = arr[i-1];
					}
					
					break;
				}
			} else{
				if(arr[i].glb <= glb){
					if(Math.abs(arr[i-1].glb - glb) > Math.abs(arr[i].glb - glb)){
						result = arr[i];
					} else{
						result = arr[i-1];
					}
					
					break;
				}
			}
		}
	}
	
	return result;
}

/**
 * 计算显示数据
 */
function caculateDisplayRealDatas(){
	var resultArr = [];
	
	var isStart = false;//开始标志
	var isEnd = false;//结束标志

	for (var i = startZtfdIndex; i < realDataParseArr.length; i++) {
		
		//结束
		if(isEnd){
			break;
		}
		
		for (var j = 0; j < realDataParseArr[i].length; j++) {
			var sortType  = "";//排序号
			var tickMark = [];
			//遍历所有刻度查询当前排序
			for (var z = 0; z < displayTickMarkArr.length; z++) {
				//状态号和排序号一致时
				if(displayTickMarkArr[z].ztqdIndex == i && displayTickMarkArr[z].pxqdIndex == j){
					sortType = displayTickMarkArr[z].sortType;
					tickMark = displayTickMarkArr[z];
					break;
				}
			}
			
			//结束
			if(isEnd){
				break;
			}
			
			//处理每条数据 
			for (var k = 0; k < realDataParseArr[i][j].length; k++) {
				var data = realDataParseArr[i][j][k];
				if(!isStart && i == startZtfdIndex && j == startPxqdIndex){ 
					if(sortType == "undesc"){//正序
						if(data.glb+tickMarkLen >= startGlb){
							isStart = true;
						}
					} else {//倒叙
						if(data.glb-tickMarkLen <= startGlb){
							isStart = true;
						}
					}
				}
				//开始添加
				if(isStart){
					if(sortType == "undesc"){//正序
						data.x = tickMark.x + (data.glb - tickMark.value)*unitBili;
					} else {//倒叙
						data.x = tickMark.x - (data.glb - tickMark.value)*unitBili;
					}
					
					resultArr.push(data);
					
					if(data.x > startX + canvasW){
						isEnd = true;
						break;
					}
				}
			}
		}
	}
	
	displayData = resultArr;
	console.log(resultArr);
	return resultArr;
}