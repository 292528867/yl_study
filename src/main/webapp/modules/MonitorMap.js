/*!
 * DeskTop + 百度地图 动态地标刷新
 */

Ext.define('BatteryBusSystem.MonitorMap', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        //'Ext.form.field.HtmlEditor'
    ],

    id:'monitormap',

    init : function(){
        this.launcher = {
            iconCls:'notepad',
            handler : this.createWindow,
            scope: this
        }
    },
    createWindow:function (B,zb){		//zb为传来的地标位置
    	var sitv=0;
    	var clzbh="";
    	var cljl="";
    	var mapzb="121.52402,31.257705";
    	var markerArr =[];
    	if(B==undefined){
    		B = this.app.getDesktop();
    	}
    	
			
		    	if(zb==null){
				    		Ext.Ajax.request({
							    url: '/busbatterysystem/Battery_Map.do',
							    method: 'post',
							    datatype:'text',
							    success: function(result, request) { 
							        var responseTexts = Ext.decode(result.responseText);      
							       	markerArr =responseTexts;
							       	initMap();
							    },
							    failure: function(result, request) {
							    	alert("没有获取数据！！");
							    }
							
							});
		    	}else{
		    		/**
		    		 * 获取传递来的值进行截取
		    		 * clzbh 为车辆自编号
		    		 * cljl  为车辆记录
		    		 * mapzb 为车辆位置
		    		 */
		    		 sitv=setInterval(
		    		 	function(){
				    		clzbh=zb.split("|")[0].substring(6);
				    		cljl=zb.split("|")[1].substring(5);
				    		mapzb=zb.split("|")[2].substring(3);
				    		markerArr=[
				    			{title:clzbh,content:cljl,point:mapzb,isOpen:0,icon:{w:23,h:25,l:23,t:21,x:9,lb:12}}
				    		];
		    			}, 10000
					); 
		    	}
			
    	
		var desktop = B;
        var wiew = desktop.getWindow('monitormap');
    	var strHtml = "<div style='width:100%;height:100%;border:1px' id='mapDiv'>12</div>";
    	if(!wiew){
	    	wiew=desktop.createWindow({  
	    		id:'monitormap',
	    		title: '地图定位',
	    		width:'100%',
	            height:'600',
	            layout:'fit',
	            iconCls:'.anchorBL{display:none; } ',
	    		items:[{
	    			id:'myMap',
	    			html:strHtml,
	    			region: 'center'
	    		}],
	    		listeners: {
					beforeclose:function(me, e){
						clearInterval(sitv);
					}
				}
	    	});
    	}
    	wiew.show();
    	function initMap(){
    		map = new BMap.Map('mapDiv');
    		var poi= new BMap.Point(mapzb.split(",")[0],mapzb.split(",")[1]);
    		map.centerAndZoom(poi,14);
    		map.enableScrollWheelZoom();
	        addMapControl();//向地图添加控件
    		addMarker();//向地图中添加marker
    	}
    	//地图控件添加函数：
		    function addMapControl(){
		        //向地图中添加缩放控件
			var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
			map.addControl(ctrl_nav);
		                //向地图中添加比例尺控件
			var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
			map.addControl(ctrl_sca);
		    }
	    //创建地标
	    function addMarker(){
	        for(var i=0;i<markerArr.length;i++){
	            var json = markerArr[i];
	            var p0 = json.point.split(",")[0];
	            var p1 = json.point.split(",")[1];
	            var point = new BMap.Point(p0,p1);
				var iconImg = createIcon(json.icon);
	            var marker = new BMap.Marker(point,{icon:iconImg});
				var iw = createInfoWindow(i);
				var label = new BMap.Label(json.title,{"offset":new BMap.Size(json.icon.lb-json.icon.x+10,-20)});
				marker.setLabel(label);
	            map.addOverlay(marker);
	            label.setStyle({
	                        borderColor:"#808080",
	                        color:"#333",
	                        cursor:"pointer"
	            });
				//地标事件
				(function(){
					var index = i;
					var _iw = createInfoWindow(i);
					var _marker = marker;
					_marker.addEventListener("click",function(){
					    this.openInfoWindow(_iw);
				    });
				    _iw.addEventListener("open",function(){
					    _marker.getLabel().hide();
				    })
				    _iw.addEventListener("close",function(){
					    _marker.getLabel().show();
				    })
					label.addEventListener("click",function(){
					    _marker.openInfoWindow(_iw);
				    })
					if(!!json.isOpen){
						label.hide();
						_marker.openInfoWindow(_iw);
					}
				})()
	        }
	    }
	     //创建备注窗口
		    function createInfoWindow(i){
		        var json = markerArr[i];
		        var iw = new BMap.InfoWindow("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>"+json.content+"</div>");
		        return iw;
		    }
		    //创建一个地标图标
		    function createIcon(json){
		        var icon = new BMap.Icon("images/us_mk_icon_1.png", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+0,0),offset:new BMap.Size(json.x,json.h)})
		        //"http://app.baidu.com/map/images/us_mk_icon.png", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)}
		        return icon;
		    }
    	initMap();
    }
});

