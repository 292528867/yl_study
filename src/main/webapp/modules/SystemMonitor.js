/*!
* Ext JS Library 4.0
*/
var sitv = 0;
var sitv2 = 0;
Ext.define('BatteryBusSystem.SystemMonitor', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.chart.*'
    ],

    id: 'systemmonitor',

    refreshRate: 500,

    init : function() {
        // No launcher means we don't appear on the Start Menu...

    },
	//一个新的整体的Panel
    createNewWindow: function (b,V) {
        var me = this;
            desktop = b;
        me.storeparams = {};      
		me.storeparams['battery_single_max_voltage'] = ''; 
		me.storeparams['myframes'] = ''; 
		me.storeparams['clzbh'] = ''; 

        return desktop.createWindow({
            id: 'systemmonitor',
            title: '系统监控',
            width: 1200,
            height: 700,
            animCollapse:false,
            constrainHeader:true,
            border: false,
            layout: 'fit',
            listeners: {
                destroy: function () {
                    clearTimeout(me.updateTimer);
                    me.updateTimer = null;
                },
                scope: me
            },
            items: [{
                xtype: 'panel',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    flex: 0.12,
                    height: 470,
                    width: 350,
                    xtype: 'container',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                    	{
							xtype: 'tabpanel',
							layout: {
								type: 'vbox',
								align: 'stretch'
							},
							flex: 1,
							items: [
								me.createCTree(),
								me.createTree()
							]
						}
                    ]
                }, {
                    flex: 0.8,
                    width: 400,
                    height: 600,
                    xtype: 'container',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        me.createPlateTable(),
                        me.createTab(V)
                    ]
                }]
            }],
             listeners: {
				beforeclose:function(me, e){
					clearInterval(sitv);
					clearInterval(sitv2);
				}
			}
            
        });
    },
	//创建整体面板
    createWindow : function(B,V) {
    	if(B==undefined){
    		B = this.app.getDesktop();
    	}
    	desktop = B;
        var win = desktop.getWindow(this.id);
        if (!win) {
            win = this.createNewWindow(B,V);
        }
        win.show();
        if(V!=undefined||V!=null){
    			document.getElementById("frame").src=document.getElementById("frame").src.split("&&")[0]+"&&zbh="+V
    			document.getElementById("myframes").src=document.getElementById("myframes").src.split("?")[0]+"?zbh="+V
    	}
        return win;
    },
	//根据需要添加TAB数量
	createTab:function(V){
    	 me=this;
	    tabs = Ext.create('Ext.tab.Panel',{
	    	id:'BeifengBPM.Column.tab',
	    	flex: 0.5,
	    	activeItem: 0,
	    	 listeners: {
				activate:function(me, e){
					alert("show");
				}
			},
			items: [
			{
	        	xtype: 'container',
	        	id:"tab0",
	            title: "电池电压（单位：伏特）",
	            closable: false,		//不能被关闭  如果需要关闭则可以为 true
				height: 300,
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				items: [
					me.createNewline(1,V)
				]
				
	        }
			]
	    });
	    var value = 3;
	    var index = 1;
	    var dname = "";
	    while(index < value){
	    	if(index==1){
	    		dname="电池温度（单位：摄氏度）";
	    	}else if(index==2){
	    		dname="电池电流（单位：安培）";
	    	}
	        addTable(dname);
	    }
	    function addTable(dname){
	        ++index;
	        tabs.add(
	        {
	        	xtype: 'container',
	        	id:"tab"+index,
	            title: dname,
	            closable: false,		//不能被关闭  如果需要关闭则可以为 true
				height: 300,
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				items: [
					me.createNewline(index,V)
				]
				
	        });
	    };
	    return tabs;
	},
    //动态折线图
    createNewline: function (index,V) {
        var jd = 0;
        var val = 0;
		var win = Ext.create('widget.panel',{
				//  id:'lines',
			      width : 600,
			      height : 300,
			      html:"<iframe id='frame' name='frame' src='highi.jsp?indexs="+index+"&&zbh="+V+"' width=100% height=100%/>"
		});
    	return win;
	},
    //浦交树结构
	createTree : function(){		
		var me=this;
    	var storeparams_ = me.storeparams;
    	var sitvl = null;
    	Ext.define('knowlTreeModel',{
	        extend: 'Ext.data.Model',
	        fields: [{
	            name: 'id', type: 'string'
	        },{
	            name: 'text', type: 'string'
	        }]
	    });
	    
	    var knowlTreeStore = Ext.create('Ext.data.TreeStore',{
	        proxy: {
	            type: 'ajax',
	            url: '/busbatterysystem/Battery_Tree2.do'
	        },
	        reader: {
	            type: 'json'
	        },
	        root: {
	            text: '根',
	            expanded: false
	        },
	        listeners: {    
	        	'beforeload' : function(_store){
	        		//在数据加载之前设置向后台发送的参数
	        		var new_params = {//参数                           
	        			'clzbh' : 'clzbh'                    
	        			};                   
	        		Ext.apply(_store.proxy.extraParams, new_params);     
	        	}
	        }
	    });
        var tree = Ext.create('Ext.tree.Panel', {
            id:'im-tree',
            title: '浦东公交',
            flex: 1,
            rootVisible:false,
            lines:false,
            autoScroll:true,
            singleExpand :false,
            layout: 'fit',
            listeners: {
            	itemdblclick:function(dataview, record, item, index, e){
        			 var clzbh=record.data.id;
        			 	clzbh=clzbh.substr(0,(clzbh.length-1));
					storeparams_['clzbh'] = clzbh.substr(0,(clzbh.length-1));
					var fms=document.getElementById("myframes").src;
					var ups,urls;
					if(fms.indexOf(clzbh)==-1){
						if(sitvl!=index){
							urls=fms.split("?")[0]+"?zbh="+clzbh;
						}else{
							urls=fms+"?zbh="+clzbh;
						}
						document.getElementById("myframes").src=urls;
        			}
        			sitvl=index;
        			document.getElementById("frame").src=document.getElementById("frame").src.split("&&")[0]+"&&zbh="+clzbh;
				}
            },
            store: knowlTreeStore
        });
        return tree;
    },
    //厂商树结构
	createCTree : function(){		
		var me=this;
    	var storeparams_ = me.storeparams;
    	var sitvl = null;
    	Ext.define('knowlTreeModel',{
	        extend: 'Ext.data.Model',
	        fields: [{
	            name: 'id', type: 'string'
	        },{
	            name: 'text', type: 'string'
	        }]
	    });
	    
	    var knowlTreeStore = Ext.create('Ext.data.TreeStore',{
	        proxy: {
	            type: 'ajax',
	            url: '/busbatterysystem/Battery_Tree.do'
	        },
	        reader: {
	            type: 'json'
	        },
	        root: {
	            text: '根',
	            expanded: false
	        },
	        listeners: {    
	        	'beforeload' : function(_store){
	        		//在数据加载之前设置向后台发送的参数
	        		var new_params = {//参数                           
	        			'clzbh' : 'clzbh'                    
	        			};                   
	        		Ext.apply(_store.proxy.extraParams, new_params);     
	        	}
	        }
	    });
        var tree = Ext.create('Ext.tree.Panel', {
            id:'cs-tree',
            title: '生产厂商',
            flex: 1,
            rootVisible:false,
            lines:false,
            autoScroll:true,
            singleExpand :false,
            layout: 'fit',
            listeners: {
				itemdblclick:function(dataview, record, item, index, e){
        			 var clzbh=record.data.id;
					storeparams_['clzbh'] = clzbh;
					var fms=document.getElementById("myframes").src;
					var ups,urls;
					if(fms.indexOf(clzbh)==-1){
						if(sitvl!=index){
							urls=fms.split("?")[0]+"?zbh="+clzbh;
						}else{
							urls=fms+"?zbh="+clzbh;
						}
						document.getElementById("myframes").src=urls;
        			}
        			sitvl=index;
        			document.getElementById("frame").src=document.getElementById("frame").src.split("&&")[0]+"&&zbh="+clzbh;
				}
			},
            store: knowlTreeStore
        });
       
        return tree;
    },
    //详细显示
    createPlateTable : function() {
		var table =Ext.create('Ext.form.Panel', {
					id : 'BatteryBusSystem.Column.table',
				    title: '监控信息',
				    flex: 0.51,
					html:"<iframe id='myframes' name='myframes' src='dcxx.jsp' width=100% height=100%/>"
		});
		return table;
	}
});
function B_window(){
	
		var aa=new BatteryBusSystem.TableMonitor();
		var c=aa.createWindow(desktop); 
		c.show();
};
