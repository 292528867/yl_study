

Ext.define('Mall.OrderManager', {
	extend : 'Ext.ux.desktop.Module',

	requires : [
		
	], 
	
	id : 'orderManager',
	
	orderInfostore : null,

	init : function() {
		this.launcher = {
			text : '订单管理管理',
			iconCls : 'notepad',
			handler : this.createWindow,
			scope : this
		}
	},
	
	createOrderManagerGrid : function() {
		Ext.define("Mall.OrderManager.OrderInfoModel", {
			extend : 'Ext.data.Model',
			fields : [
			    'id',
				'userId',
				'userName',
				'mallProductIds',
				'mallProductNames',
				'mallProductPictureUrls',
				'cost',
				'score',
				'orderStatus',
				'orderStatusDesc',
				'shippingInfo',
				'shippingNo',
				'receiver',
				'receiverPhone',
				'receiverAddress',
				'orderCompleted',
				'activitiBpmProcessInstanceId',

				'lastModifiedDate'
			]
		});

		// TODO

		/**
		 * store的proxy默认是get请求，某些请求可能需要post请求，
		 * 设置proxy的actionMethods的相关属性就可以了，
		 * TODO：文档中没有说明，不知道为什么
		 */
		this.orderInfostore = Ext.create('Ext.data.Store', {
			model : 'Mall.OrderManager.OrderInfoModel',
			pageSize : 10,
			proxy : {
				type : 'ajax',
				url : serverUrl + '/mall/manager/order?sort=lastModifiedDate,desc',
				actionMethods : {
//	                create : 'POST',
	                read   : 'GET', // by default GET
//	                update : 'POST',
//	                destroy: 'POST'
				},
				reader : {
					root : 'content',
					totalProperty : 'totalElements'
				},
				limitParam : 'size'
			}
		});

		/**
		 * grid 里columns 里定义列的时候写id属性会报错，
		 * Uncaught TypeError: Object [object Object] has no method 'isOnLeftEdge' 
		 * 注意了：http://www.sencha.com/forum/showthread.php?155646-Uncaught-TypeError-Object-object-Object-has-no-method-isOnLeftEdge-in-Extjs-4.0.
		 */
		var me = this;
		var grid = Ext.create("Ext.grid.Panel", {
//			width : 500,
//			height : 500,
			store : me.orderInfostore,
			frame : true,
			border : false,
			columnLines : true,
			selModel : Ext.create('Ext.selection.CheckboxModel', {mode : 'SIMPLE'}),
			disableSelection : false,
			sortableColumns : false,
			
			columns : [{
				dataIndex : 'id',
				text : '主键id',
				hidden : true
			}, {
				dataIndex : 'mallProductPictureUrls',
				text : '商品图片', 
				renderer : function(value, metadata, record) {
					if (value) // 暂时1张
						return "<img style='width: 100px; height: 100px;' src='" + value + "'/>";
					else 
						return "未上传商品图片";
				}
			}, {
				dataIndex : 'mallProductNames',
				text : '商品名称', 
				renderer : function(value, metadata, record) {
					if (value) // 暂时1个
						return '<div style ="white-space:normal;">' + value + '</div>';
				}
			}, {
				text : '用户信息',
				renderer : function(value, metadata, record) {
					if (record) {
						var userInfo = [];
						userInfo.push("用户id：" + record.data["userId"]);
						userInfo.push("用户昵称：" + record.data["userName"]);
						return '<div style ="white-space:normal;">' + userInfo.join("</br>") + '</div>';
					} else
						return '<div style ="white-space:normal;">5无用户信息</div>';
				}
			}, {
				dataIndex : 'orderStatusDesc',
				text : '订单状态'
			}, {
				dataIndex : 'orderCompleted',
				text : '是否完成'
			}, {
				dataIndex : 'lastModifiedDate',
				text : '更新时间',
				width : 180, 
				renderer : function(value, metadata, record) {
					if (value) {
						var dt = new Date(value);
						return Ext.Date.format(dt, 'Y年m月d日 H:i:s');
					}
				}
			}, {
				header : '操作',
				xtype : 'actioncolumn',
				width : 150,
				items : [{
					icon : 'modules/mall/images/table.png',
					tooltip : '发货',
					getClass : function(value, metadata, record) {
						if (record.data["orderStatus"] == 'WAITSHIP')
							return "moment-action-button";
						else
							return "x-hide-display";
					},
					handler : function(grid, rowIndex, colIndex) {
						// 发货处理
						var record = me.orderInfostore.getAt(rowIndex);
						me.showDeliveryOrderForm(record);
					}
				}, {
					icon : 'modules/mall/images/table.png',
					tooltip : '确认',
					getClass : function(value, metadata, record) {
						if (record.data["orderStatus"] == 'SHIPPED')
							return "moment-action-button";
						else
							return "x-hide-display";
					},
					handler : function(grid, rowIndex, colIndex) {
						// 确认处理
						var record = me.orderInfostore.getAt(rowIndex);
						me.showConfirmDeliveryOrderForm(record);
					}
				}, {
					icon : 'modules/mall/images/table.png',
					tooltip : '查看',
					getClass : function() {
						return 'moment-action-button';
					},
					handler : function(grid, rowIndex, colIndex) {
						alert("查看，哈哈哈！");
					}
				}]
			}],
			
			bbar : Ext.create('Ext.PagingToolbar', {
				store : me.orderInfostore,
				displayInfo : true, 
				displayMsg : '当前显示第{0}条 至 {1}条记录，共{2}条记录',
				emptyMsg : '暂无可用数据'
			}),
			tbar:[{
	        	width:240,
	        	fieldLabel:'搜素',
	        	xtype:'searchfield_mall',
	        	labelWidth:50,
	        	store: me.orderInfostore,
				vnames : ['mallProductNames']
	        }, {
				width : 450,
				xtype: 'radiogroup',
				fieldLabel: '订单状态',
				layout : 'column',
				anchor : '95%',
				columns : 3,
				items: [
					{ boxLabel: '全部', name: 'rb', inputValue: '1', checked : true, margin: '0 10 0 0' },
					{ boxLabel: '待处理－》等待发货', name: 'rb', inputValue: '2', margin: '0 10 0 0'},
					{ boxLabel: '已发货－》等待确认', name: 'rb', inputValue: '3', margin: '0 10 0 0'}
				],
				listeners : {
					change : function(cmp, newValue, oldValue, opts) {
						// 直接写死在这里，不好，实在太不好了，没办法
						var store = me.orderInfostore;
						var proxy = store.getProxy();
						var param_obj = Ext.JSON.decode(proxy.extraParams["filters"], true);
						if (!param_obj)
							param_obj = {};

						if (newValue.rb == 1) {
							delete param_obj["orderStatus_equal"];
							proxy.extraParams["filters"] = Ext.JSON.encode(param_obj);
							me.orderInfostore.load();
						} else if (newValue.rb == 2) {
							param_obj["orderStatus_equal"] = 0;
							proxy.extraParams["filters"] = Ext.JSON.encode(param_obj);
							me.orderInfostore.load();
						} else if (newValue.rb == 3) {
							param_obj["orderStatus_equal"] = 1;
							proxy.extraParams["filters"] = Ext.JSON.encode(param_obj);
							me.orderInfostore.load();
						}
					}
				}
			}]
		});
		me.orderInfostore.loadPage(1);
		return grid;
	},

	showDeliveryOrderForm : function(record) {
		var me = this;
		var form = Ext.create("Ext.form.Panel", {
			url : serverUrl + '/mall/manager/order/deliveryOrder',
			frame : true,
			items : [{
				xtype : 'hiddenfield',
				name : 'orderId',
				value : record.data["id"]
			}, {
				xtype : 'hiddenfield',
				name : 'processInstanceId',
				value : record.data["activitiBpmProcessInstanceId"]
			}, {
				xtype : 'textfield',
				name : 'shippingInfo',
				fieldLabel : '快递公司信息',
				allowBlank : false
			}, {
				xtype : 'textfield',
				name : 'shippingNo',
				fieldLabel : '快递单号',
				allowBlank : false
			}],
			buttons : [{
				text : '重置',
				handler : function() {
					this.up('form').getForm().reset();
				}
			}, {
				text : '提交',
				disabled : true,
				formBind : true,
				handler : function() {
					var f = this.up('form').getForm();
					f.submit({
						waitMsg : '更新中......',
						method : 'POST',
						success : function(form, action) {
							Ext.Msg.alert('成功', action.result.msg);;
							win.close();
							me.orderInfostore.load();
						},
						failure: function(form, action) {
							Ext.Msg.alert('抱歉', action.result.msg);
						}
					});

				}
			}]
		});

		win = Ext.create("Ext.window.Window", {
			width : 300,
			height : 150,
			maximizable : true,
			title : '订单发货',
			layout : 'fit',
			items : [form],
			modal : true
		});
		win.show();
	},
	showConfirmDeliveryOrderForm : function(record) {
		var me = this;
		var form = Ext.create("Ext.form.Panel", {
			url : serverUrl + '/mall/manager/order/confirmDeliveryOrder',
			frame : true,
			items : [{
				xtype : 'hiddenfield',
				name : 'orderId',
				value : record.data["id"]
			}, {
				xtype : 'hiddenfield',
				name : 'processInstanceId',
				value : record.data["activitiBpmProcessInstanceId"]
			}],
			buttons : [{
				text : '重置',
				handler : function() {
					this.up('form').getForm().reset();
				}
			}, {
				text : '提交',
				disabled : true,
				formBind : true,
				handler : function() {
					var f = this.up('form').getForm();
					f.submit({
						waitMsg : '更新中......',
						method : 'POST',
						success : function(form, action) {
							Ext.Msg.alert('成功', action.result.msg);;
							win.close();
							me.orderInfostore.load();
						},
						failure: function(form, action) {
							Ext.Msg.alert('抱歉', action.result.msg);
						}
					});

				}
			}]
		});

		win = Ext.create("Ext.window.Window", {
			width : 300,
			height : 150,
			maximizable : true,
			title : '确认订单发货',
			layout : 'fit',
			items : [form],
			modal : true
		});
		win.show();
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('orderManager');
		if (!win) {
			win = desktop.createWindow({
				id : 'orderManager',
				title : '订单管理',
				width : 600,
				height : 400,
				iconCls : 'notepad',
				animCollapse : false,
				border : false,
				hideMode : 'offsets',
				layout : 'fit',
				items : [
					this.createOrderManagerGrid()
				]
			});
		}
		win.show();
		return win;
	}
});
