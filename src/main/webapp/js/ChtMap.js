var ChtMap = function(options){
	var MAP = {};
	
	$this = $("#"+options.container);
	
	//清空重复DOM对象
	$this.find("#oldCanvas").remove();
	$this.find("#renderCanvas").remove();
	$this.find("#actionCanvas").remove();
	$this.find("#cutCanvas").remove();
	
	
	//TODO 默认参数
	var defaults = {};
	defaults.width = $this.width();
    defaults.height = $this.height();
    defaults.background = $this.css("background");
    defaults.scale = [1,0.7,0.5,0.2];//比例尺
    defaults.zoom = 0;//放大级别
    defaults.showCut = true;//默认显示鹰眼
    defaults.sensitivity = 0.05;//灵敏度
    
    //初始化参数
    MAP = $.extend(true, {}, defaults, options);
    MAP.params = options;
    
    $this.css("background",MAP.background);
    //设置容器宽、高
    $this.width(MAP.width);
    $this.height(MAP.height);
    MAP.width =  $this.width();
    MAP.height =  $this.height();

    /**
     * 初始化地图
     */
    //原始画布，100%显示原始地图图片文件
    var canvasHtml = '<canvas id="oldCanvas" style="display: none;"></canvas>';
    //效果画布，按比例获取原始画布中的截屏文件
    canvasHtml += '<canvas id="renderCanvas"></canvas>';
    //动作图层，监听鼠标事件显示车辆信息
    canvasHtml += '<canvas id="actionCanvas" style="position: absolute;"></canvas>';
    //截屏画布，缩放显示以及截屏控件
    canvasHtml += '<canvas id="cutCanvas" style="position: absolute;top: 10px;left: 10px;"></canvas>';
    $this.append(canvasHtml);
    
    //获取div元素
    var oldCanvas = $this.find("#oldCanvas").get(0);
    var cutCanvas = $this.find("#cutCanvas").get(0);
    var renderCanvas = $this.find("#renderCanvas").get(0);
    var actionCanvas = $this.find("#actionCanvas").get(0);

    //获取绘画环境
    var oldContext = oldCanvas.getContext('2d');
    var cutContext = cutCanvas.getContext('2d');
    var renderContext = renderCanvas.getContext('2d');
    var actionContext = actionCanvas.getContext('2d');
    
    //地图
    MAP.success = false;
    MAP.canvas = renderCanvas;
    MAP.context = renderContext;
    MAP.actionCanvas = actionCanvas;
    MAP.actionContext = actionContext;
    MAP.cutCanvas = cutCanvas;
    MAP.cutContext = cutContext;
    var mapImage = new Image();
    mapImage.src = MAP.mapUrl;
    
    //定时处理地图初始化，图片源异步加载
    var timer = setInterval(function(){
    	if(mapImage.complete){
    		window.clearInterval(timer);
    		init();
    	}
    }, 200);
    
    //TODO 公共方法
    /*===================定义公共方法开始===================*/
    
    /**
     * 地图重载
     */
    MAP.reload = function(){
    	init();
    }

    /**
	 * 地图重绘
	 */
	MAP.redraw = function(){
    	drawCutMap(cutBoxX,cutBoxY);
    }
    
    /**
     * 设置放大级别
     * @param v number
     */
    MAP.setZoom = function(v){
    	if(v >= MAP.scale.length){
    		v = MAP.scale.length-1;
    	} else if(v < 0){
    		v = 0;
    	}
    	
    	MAP.zoom = v;
    	drawCutMap(cutBoxX,cutBoxY);
    }
    
    /**
     * 设置中心位置(渲染地图坐标)
     * @param x number
     * @param y number
     */
    MAP.setCenter = function(x,y){
    	var p =  MAP.calculateXY(x, y, "render", "cut");
    	drawCutMap(p.x,p.y);
    }
    
    /**
     * 设置灵敏度
     * @param v number
     */
    MAP.setSensitivity = function(v){
    	MAP.sensitivity = v;
    }
    
    /**
     * 设置显示截屏界面
     * @param v boolean
     */
    MAP.setShowCut = function (v){
    	if(v){
    		$(cutCanvas).show();
    		$this.find('.mb').show();
    	} else{
    		$(cutCanvas).hide();
    		$this.find('.mb').hide();
    	}
    };
    
    /**
     * 渲染图层坐标转截屏坐标
     * @x x坐标
     * @y y坐标
     * @input MapType 输入坐标地图类型
     * @output MapType 输出坐标地图类型
     * MapType "old" 为原始地图，"cut"为截屏地图，"render"为渲染地图
     */
    MAP.calculateXY = function(x,y,input,output){
    	var result = {x:null,y:null};
    	
    	//原图转截屏(比例计算)
    	if(input == "old" && output == "cut"){
    		result.x = x*(cutCanvasW/oldCanvasW);
    		result.y = y*(cutCanvasH/oldCanvasH);
    	}
    	
    	//截屏转原图(比例计算)
    	if(input == "cut" && output == "old"){
    		result.x = x*(oldCanvasW/cutCanvasW);
    		result.y = y*(oldCanvasH/cutCanvasH);
    	}
    	
    	//渲染转截屏(比例计算,加上起点坐标)
    	if(input == "render" && output == "cut"){
    		result.x = cutBoxX - cutBoxW/2 + x*(cutBoxW/renderCanvasW); 
    		result.y = cutBoxY - cutBoxH/2 + y*(cutBoxH/renderCanvasH); 
    	}

    	//截屏转渲染(减去起点坐标，比例计算)
    	if(input == "cut" && output == "render"){
    		result.x = (x - cutBoxX + cutBoxW/2)*renderCanvasW/cutBoxW;
    		result.y = (y - cutBoxY + cutBoxH/2)*renderCanvasH/cutBoxH;
    	}
    	
    	//原图转渲染(转截屏坐标，转渲染坐标)
    	if(input == "old" && output == "render"){
    		var point = MAP.calculateXY(x, y, "old", "cut");
    		point = MAP.calculateXY(point.x, point.y, "cut", "render");
    		result.x = point.x;
    		result.y = point.y;
    	}

    	//原图转渲染(转截屏坐标，转原图坐标)
    	if(input == "render" && output == "old"){
    		var point = MAP.calculateXY(x, y, "render", "cut");
    		point = MAP.calculateXY(point.x, point.y, "cut", "old");
    		result.x = point.x;
    		result.y = point.y;
    	}
    	
    	return result;
    }
    
    /*===================定义公共方法结束===================*/
    
    //TODO 内部方法
    /*===================定义内部方法开始===================*/
    var oldCanvasW,oldCanvasH,
    cutCanvasW,cutCanvasH,
    cutBoxW,cutBoxH,
    cutBoxX,cutBoxY,
    renderCanvasW,renderCanvasH;
    
    /**
     * 绘制初始化界面和参数
     */
    function init(){
    	MAP.success = false;
    	//截屏画布宽度
        cutCanvasW = 300;
        //截屏画布高度
        cutCanvasH = cutCanvasW*(mapImage.height/mapImage.width);
        //渲染画布宽度
        renderCanvasW = $this.width();
        //渲染画布高度
        renderCanvasH = $this.height();
        //初始渲染画布大小
        renderCanvas.width = renderCanvasW;
        renderCanvas.height = renderCanvasH;
//        $(renderCanvas).css('cursor', "pointer");
       
        //初始事件画布大小
        actionCanvas.width = renderCanvasW;
        actionCanvas.height = renderCanvasH;
        $(actionCanvas).css('top',  renderCanvas.offsetTop);
        $(actionCanvas).css('left', renderCanvas.offsetLeft);
        $(actionCanvas).css('cursor', "pointer");
        
        //清空原始画布
        oldCanvasW = oldCanvas.width;
        oldCanvasH = oldCanvas.height;
        oldContext.clearRect(0,0,oldCanvasW,oldCanvasH);
        
        //初始化原始图片
        oldCanvasW = mapImage.width;
        oldCanvasH = mapImage.height;
        oldCanvas.width = oldCanvasW;
        oldCanvas.height = oldCanvasH;
        oldContext.drawImage(mapImage,0,0,mapImage.width,mapImage.height); 
        
        //截屏界面比例显示内容
        cutCanvas.width = cutCanvasW;
        cutCanvas.height = cutCanvasH;
        $(cutCanvas).css('top',  renderCanvas.offsetTop+10);
        $(cutCanvas).css('left', renderCanvas.offsetLeft+10);
        $(cutCanvas).css('cursor', "pointer");
        
        //计算比例尺
        calculateScale();
        
        //截屏盒子宽度
        cutBoxW = oldCanvasW * (cutCanvasW/oldCanvasH) * MAP.scale[MAP.zoom];
        //截屏盒子高度
        cutBoxH = cutBoxW/(renderCanvasW/renderCanvasH);
        //截屏盒子X坐标
        cutBoxX = cutCanvasW/2; 
        //截屏盒子Y坐标
    	cutBoxY = cutCanvasH/2;
    	
    	//根据中心位置绘制鹰眼地图
        drawCutMap(cutBoxX,cutBoxY);
        
        //初始化方法
        if(MAP.initSuccess){
        	MAP.initSuccess();
        }
        
        //定义动作
        buildAction();
        
        MAP.success = true;
    }
    
    /**
     * 根据截屏地图中心位置绘制鹰眼地图
     */
    function drawCutMap(x,y){
    	var domTop = cutCanvas.offsetTop;
    	var domLeft = cutCanvas.offsetLeft;
    	
    	/**
         * 绘制截屏
         */
    	var minX,maxX,minY,maxY;
    	
    	//截屏盒子宽度
        cutBoxW = oldCanvasW * (cutCanvasW/oldCanvasH) * MAP.scale[MAP.zoom];
      
        //截屏盒子高度
        cutBoxH = cutBoxW/(renderCanvasW/renderCanvasH);
    	
    	//长宽不够的特殊处理
    	if(cutBoxW > cutCanvasW){
    		cutBoxW = cutCanvasW;
    		cutBoxH = cutBoxW/(renderCanvasW/renderCanvasH);
    	}
    	if(cutBoxH > cutCanvasH){
    		cutBoxH = cutCanvasH;
    		cutBoxW = cutBoxH*(renderCanvasW/renderCanvasH);
    	}
    	
        //坐标为中心坐标时的处理调整
        x = x - cutBoxW/2;
        y = y - cutBoxH/2;
        
        //可视范围
        minX = 0;
        maxX = cutCanvasW;
        minY = 0;
        maxY = cutCanvasH;
        
        //坐标处于范围外的特殊处理
        if(x < minX){
        	x = minX;
        } else if((x + cutBoxW) > maxX){
        	x = maxX-cutBoxW;
        }

        if(y < minY){
        	y = minY;
        } else if((y + cutBoxH) > maxY){
        	y = maxY-cutBoxH;
        }
        
        //设置公共变量截图盒子坐标
        cutBoxX = x + cutBoxW/2;
        cutBoxY = y + cutBoxH/2;
        
        //绘制截屏平面
        cutContext.clearRect(0,0,cutCanvasW,cutCanvasH);
        cutContext.drawImage(mapImage,0,0,cutCanvasW,cutCanvasH);
        
        //TODO 蒙版
        /*===================绘制蒙版开始===================*/
        
        /**
         * 绘制蒙版(非零环绕原则)
         */
    	cutContext.beginPath();
    	cutContext.moveTo(0,0);
    	cutContext.lineTo(cutCanvasW,0);
    	cutContext.lineTo(cutCanvasW,cutCanvasH);
    	cutContext.lineTo(0,cutCanvasH);
    	cutContext.closePath();
    	cutContext.fillStyle = 'rgba(202, 189, 189,0.5)';
    	cutContext.moveTo(x,y);
    	cutContext.lineTo(x,y+cutBoxH);
    	cutContext.lineTo(x+cutBoxW,y+cutBoxH);
    	cutContext.lineTo(x+cutBoxW,y);
    	cutContext.closePath();
    	cutContext.fill();
    	/*===================绘制蒙版结束===================*/
    	
    	//绘制渲染地图
    	drawRenderMap();
    }
    
    /**
     * 绘制渲染地图
     */
    function drawRenderMap(){
    	//清除渲染画布
    	renderContext.clearRect(0,0,renderCanvasW,renderCanvasH);
    	
    	var x = cutBoxX - cutBoxW/2 + cutCanvas.offsetLeft;
        var y = cutBoxY - cutBoxH/2 + cutCanvas.offsetTop;
    	var cutImageX = oldCanvas.width*((x - cutCanvas.offsetLeft)/cutCanvasW);
    	var cutImageY = oldCanvas.height*((y - cutCanvas.offsetTop)/cutCanvasH);
    	var cutImageW = oldCanvas.width*(cutBoxW/cutCanvasW);
    	var cutImageH = oldCanvas.height*(cutBoxH/cutCanvasH);
    	var renderX = 0;
		var renderY = 0;
    	/**
    	 * drawImage(图像对象,原图像截取的起始X坐标,原图像截取的起始Y坐标,原图像截取的宽度,原图像截取的高度， 
    	 * 绘制图像的起始X坐标,绘制图像的起始Y坐标,绘制图像所需要的宽度,绘制图像所需要的高度); 
    	 */
    	renderContext.drawImage(mapImage,cutImageX,cutImageY,cutImageW,cutImageH,
    			renderX,renderY,renderCanvasW,renderCanvasH);
    	
    	if(MAP.loadSucsess){
    		MAP.loadSucsess();
    	}
    }
    
    /**
     * 计算比例尺
     */
    function calculateScale(){
    	var v = 4;
    	var bili1 = renderCanvasW/renderCanvasH;
    	var bili2 = oldCanvasW/oldCanvasH;
    	var w = renderCanvasW;
    	var h = renderCanvasH;
    	
    	if(bili1 > bili2){
    		w = h*bili2;
    	} else {
    		h = w/bili1;
    	}
    	
    	for (var i = 0; i < v; i++) {
    		MAP.scale[i] = h/w * Math.pow(0.5,i);;
		}
    }
    /*===================定义内部方法结束===================*/

    //TODO 事件定义
    /*===================定义内部事件开始===================*/
    /**
     * 创建动作
     */
    function buildAction(){
    	//截屏处理事件
    	buildCutAction();
    	
    	//地图监听事件
    	buildMapAction();
    	
    	/**
    	 * 截屏窗动作处理
    	 */
    	function buildCutAction(){
            var moveFlag = false; //用于判断移动事件事物控制 
            var domObj = cutCanvas;
            
            //单击事件
            domObj.onclick = function(e){
            }

            //双击事件
            domObj.ondblclick = function(e){
            }
            
            //鼠标按下事件 
            domObj.onmousedown = function (e){ 
            	moveFlag = true; 
              
              if(moveFlag && MAP.success){ 
            	  var x = e.clientX - domObj.offsetTop;
            	  var y = e.clientY - domObj.offsetLeft;
                  drawCutMap(x, y);
                }
            } 
            
            //鼠标停按事件 
            domObj.onmouseup = function (e){
            	moveFlag = false;
            }
            
            //鼠标移动事件 
            domObj.onmousemove = function (e){ 
              if(moveFlag && MAP.success){ 
            	  var x = e.clientX - domObj.offsetTop;
            	  var y = e.clientY - domObj.offsetLeft;
                  drawCutMap(x, y);
              } 
            } 
            
            //鼠标移出事件
            domObj.onmouseout = function(e){
            	moveFlag = false;
            }
    	}
    	
    	/**
    	 * 地图窗动作处理
    	 */
    	function buildMapAction(){
    		var moveFlag = false; //用于判断移动事件事物控制 
            var domObj = actionCanvas;
            var moveX,moveY;
            
            //单击事件
            domObj.onclick = function(e){
            	if(MAP.onclick){
            		MAP.onclick(e);
            	}
            }

            //双击事件
            domObj.ondblclick = function(e){
            	if(MAP.ondblclick){
            		MAP.ondblclick(e);
            	}
            }
            
            //鼠标按下事件 
            domObj.onmousedown = function (e){ 
            	moveFlag = true; 
            	moveX = e.clientX;
            	moveY = e.clientY;
            } 
            
            //鼠标停按事件 
            domObj.onmouseup = function (e){
            	moveFlag = false;
            }
            
            //鼠标悬停事件
            domObj.onmouseover = function (e){
            	if(MAP.onmouseover){
            		MAP.onmouseover(e);
            	}
            }
            
            //鼠标移动事件 
            domObj.onmousemove = function (e){ 
            	if(moveFlag && MAP.success){
            		//屏幕坐标转截屏盒子移动坐标
                	var x = cutBoxX + (e.clientX - moveX)*(cutBoxW/renderCanvasW)*MAP.sensitivity;
                	var y = cutBoxY + (e.clientY - moveY)*(cutBoxH/renderCanvasH)*MAP.sensitivity;
                	
                	//重绘地图
                    drawCutMap(x, y);
            	} 
            	
            	if(MAP.onmousemove){
            		MAP.onmousemove(e);
            	}
            }
            
            //鼠标移出事件
            domObj.onmouseout = function(e){
            	moveFlag = false;
            }

            //鼠标滚轮事件
            function scrollFunc(e){
            	if(MAP.success){
            		var v = 1;
            		if(e.wheelDelta){//IE/Opera/Chrome 
            	        v=e.wheelDelta; 
            	    }else if(e.detail){//Firefox 
            	        v=-e.detail; 
            	    } 
            		
            		if(v > 0){
            			MAP.zoom++;
            			MAP.setZoom(MAP.zoom);
            		} else {
            			MAP.zoom--;
            			MAP.setZoom(MAP.zoom);
            		}
            	}
            }
            //注册轮滚事件(兼容IE、FIREFOX)
            if(domObj.addEventListener){ 
            	domObj.addEventListener('DOMMouseScroll',scrollFunc,false); 
            }
            domObj.onmousewheel = scrollFunc;
    	}
    }
    /*===================定义内部事件结束===================*/
    return MAP;
}