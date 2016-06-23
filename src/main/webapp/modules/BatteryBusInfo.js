

Ext.define('BatteryBusSystem.BatteryBusInfo', {
	extend : 'Ext.ux.desktop.Module',

	requires : [
		
	], 
	
	id : 'batterybusinfo',
	
	store : null,

	init : function() {
		this.launcher = {
			text : '电池车辆基础信息管理',
			iconCls : 'notepad',
			handler : this.createWindow,
			scope : this
		}
	},
	
	createLeaveGrid : function() {
		Ext.define("BatteryBusInfoModel", {
			extend : 'Ext.data.Model',
			fields : [    
				'id',
				'jm',
				'zbh',
				'cph',
				'sydw',
				'hjdw',
				'sccs',
				'dclx', 
				'sbbh'
			]
		});
		
		/**
		 * store的proxy默认是get请求，某些请求可能需要post请求，
		 * 设置proxy的actionMethods的相关属性就可以了，
		 * TODO：文档中没有说明，不知道为什么
		 */
		this.store = Ext.create('Ext.data.Store', {
			model : 'BatteryBusInfoModel',
			pageSize : 10, 
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/batteryBusManagerController/queryBatteryBus', 
				actionMethods : {
//	                create : 'POST',
	                read   : 'POST', // by default GET
//	                update : 'POST',
//	                destroy: 'POST'
				},
				reader : {
					root : 'batterybuses', 
					totalProperty : 'totalCount'
				}
//				extraParams: { key: 'key' } //附加参数，搜索组件就就加了一个query的参数
			}
		});
		var gridstore = this.store;
		
		/**
		 * grid 里columns 里定义列的时候写id属性会报错，
		 * Uncaught TypeError: Object [object Object] has no method 'isOnLeftEdge' 
		 * 注意了：http://www.sencha.com/forum/showthread.php?155646-Uncaught-TypeError-Object-object-Object-has-no-method-isOnLeftEdge-in-Extjs-4.0.
		 */
		var grid = Ext.create("Ext.grid.Panel", {
//			width : 500,
//			height : 500,
			store : gridstore,
			frame : true,
			border : false,
			columnLines : true,
			disableSelection : false,
			columns : [{
				dataIndex : 'id',
				text : '主键id',
				hidden : true
			}, {
				dataIndex : 'jm',
				text : '简码'
			}, {
				dataIndex : 'zbh',
				text : '自编号'
			}, {
				dataIndex : 'cph',
				text : '车牌号'
			}, {
				dataIndex : 'sydw',
				text : '使用单位'
			}, {
				dataIndex : 'hjdw',
				text : '户籍单位'
			}, {
				dataIndex : 'sccs',
				text : '生产厂商'
			}, {
				dataIndex : 'dclx',
				text : '电池类型'
			}, {
				dataIndex : 'sbbh',
				text : '一体机设备编号',
				hidden : true
			}], 
			bbar : Ext.create('Ext.PagingToolbar', {
				store : gridstore, 
				displayInfo : true, 
				displayMsg : '当前显示第{0}条 至 {1}条记录，共{2}条记录',
				emptyMsg : '暂无可用数据'
			}),
			tbar:[{
	        	width:240,
	        	fieldLabel:'搜素',
	        	xtype:'searchfield',
	        	labelWidth:50,
	        	store: gridstore 
	        }, {
	        	text : '新增车辆', 
	        	xtype : 'button',
	        	width : 80, 
	        	handler : function() {
	        		var win;
	        		var form = Ext.create("Ext.form.Panel", {
	        			frame : true,
	        			defaultType : 'textfield',
	        			items : [{
	        				id : 'jm',
	        				name : 'jm',
	        				fieldLabel : '简码',
	        				allowBlank : false
	        			}, {
	        				id : 'zbh',
	        				name : 'zbh',
	        				fieldLabel : '自编号',
	        				allowBlank : false
	        			}, {
	        				id : 'cph',
	        				name : 'cph',
	        				fieldLabel : '车牌号',
	        				allowBlank : false
	        			}, {
	        				id : 'sydw',
	        				name : 'sydw',
	        				fieldLabel : '使用单位',
	        				allowBlank : false
	        			}, {
	        				id : 'hjdw', 
	        				name : 'hjdw', 
	        				fieldLabel : '户籍单位', 
	        				allowBlank : false
	        			}, {
	        				id : 'sccs', 
	        				name : 'sccs', 
	        				fieldLabel : '生产厂商', 
	        				allowBlank : false
	        			}, {
	        				id : 'dclx', 
	        				name : 'dclx', 
	        				fieldLabel : '电池类型', 
	        				allowBlank : false
	        			}, {
	        				id : 'sbbh',
	        				name : 'sbbh', 
	        				fieldLabel : '一体机设备编号',
	        				allowBlank : false
	        			}],
	        			buttons : [{
	        				text : '重置',
	        				handler : function() {
	        					this.up('form').getForm().reset();
	        				}
	        			}, {
	        				text : '提交', 
	        				handler : function() {
	        					var f = this.up('form').getForm();
	        					var busvo = f.getFieldValues();
	        					Ext.Ajax.request({
	        						url : '/busbatterysystem/web/security/batteryBusManagerController/addBatteryBus',
	        						method : 'POST',
	        						jsonData : Ext.JSON.encode(busvo),
	        						success : function(response, options) {
	        							Ext.Msg.alert('成功', '请假申请单已经成功提交，请等待审核！');
	        							win.close();
	        							gridstore.load();
	        						}
	        					});
	        				}
	        			}]
	        		});
	        		win = Ext.create("Ext.window.Window", {
	        			width : 300,
	        			height : 300,
	        			title : '新增电池车辆基础信息',
	        			layout : 'fit',
	        			items : [form],
	        			modal : true
	        		});
	        		win.show();
	        	}
	        }]
		});
		gridstore.loadPage(1);
		return grid;
	},
	
	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('batterybusinfo');
		if (!win) {
			win = desktop.createWindow({
				id : 'batterybusinfo',
				title : '电池车辆基础信息管理',
				width : 600,
				height : 400,
				iconCls : 'notepad',
				animCollapse : false,
				border : false,
				hideMode : 'offsets',
				layout : 'fit',
				items : [
					this.createLeaveGrid()
				]
			});
		}
		win.show();
		return win;
	}
});
