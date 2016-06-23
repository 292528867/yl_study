

Ext.define('BatteryBusSystem.SysBatteryBusInfo', {
	extend : 'Ext.ux.desktop.Module',

	requires : [
		
	], 
	
	id : 'sysbatterybusinfo',
	
	store : null, // 电车数据store
	xlstore : null, // 线路信息store
	sccsstore : null, // 生产厂商store
	hjgsstore : null, // 户籍公司store
	gsstore : null, // 公司store 
	gsdm_sel : 'none', // 选定的公司代码，用于确定分公司的
	fgsstore : null, // 分公司store
	fgslocalstore_forfgs : null, // 分公司combox local store
	
	init : function() {
		this.launcher = {
			text : '电池车辆基础信息管理',
			iconCls : 'notepad',
			handler : this.createWindow,
			scope : this
		}
		
		// 定义电车grid数据模型
		Ext.define("BatteryBusSystem.SysBatteryBusInfo.BatteryBusInfoModel", {
			extend : 'Ext.data.Model',
			fields : [    
				'clid',
				'jm',
				'zbh',
				'cph',
				'xl',
				'sydw',
				'hjdw',
				'fgs',
				'sccs',
				'dclx', 
				'sbbh',
				'xlbm',
				'gsdm',
				'fgsdm',
				'sccsid',
				'createtime'
			]
		});
		// 定义线路数据模型
		Ext.define("BatteryBusSystem.SysBatteryBusInfo.SysXlModel", {
			extend : 'Ext.data.Model',
			fields : ['xlbm', 'xlmc']
		});
		// 定义生产厂商数据模型
		Ext.define('BatteryBusSystem.SysBatteryBusInfo.SysSccsModel', {
			extend : 'Ext.data.Model', 
			fields : ['id', 'sccsmc']
		});
		// 定义公司数据模型
		Ext.define('BatteryBusSystem.SysBatteryBusInfo.SysGsModel', {
			extend : 'Ext.data.Model',
			fields : ['gsdm', 'fgsdm', 'gsmc']
		});
		
		var me = this;
		
		/**
		 * store的proxy默认是get请求，某些请求可能需要post请求，
		 * 设置proxy的actionMethods的相关属性就可以了，
		 * TODO：文档中没有说明，不知道为什么
		 */
		me.store = Ext.create('Ext.data.Store', {
			model : 'BatteryBusSystem.SysBatteryBusInfo.BatteryBusInfoModel',
			pageSize : 10, 
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/sysBatteryBusManagerController/queryBatteryBus', 
				actionMethods : {
//	                create : 'POST',
	                read   : 'POST' // by default GET
//	                update : 'POST',
//	                destroy: 'POST'
				},
				reader : {
					root : 'batterybuses', 
					totalProperty : 'totalCount'
				},
				listeners : {
					exception : function(proxy, response, operation, eOpts) {
						var result = Ext.JSON.decode(response.responseText, true);
						if (result['filterflag']) {
							Ext.Msg.alert('抱歉', result['message']);
						} else {
							Ext.Msg.alert('抱歉', '服务器异常！');
						}
					}
				}
			}
		});
		me.xlstore = Ext.create('Ext.data.Store', {
			model : 'BatteryBusSystem.SysBatteryBusInfo.SysXlModel',
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/sysBatteryBusManagerController/queryXl',
				actionMethods : {
					read : 'GET'
				},
				listeners : {
					exception : function(proxy, response, operation, eOpts) {
						var result = Ext.JSON.decode(response.responseText, true);
						if (result['filterflag']) {
							Ext.Msg.alert('抱歉', result['message']);
						} else {
							Ext.Msg.alert('抱歉', '服务器异常！');
						}
					}
				}
			}
		});
		me.sccsstore = Ext.create('Ext.data.Store', {
			model : 'BatteryBusSystem.SysBatteryBusInfo.SysSccsModel',
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/sysBatteryBusManagerController/querySccs',
				actionMethods : {
					read : 'GET'
				},
				listeners : {
					exception : function(proxy, response, operation, eOpts) {
						var result = Ext.JSON.decode(response.responseText, true);
						if (result['filterflag']) {
							Ext.Msg.alert('抱歉', result['message']);
						} else {
							Ext.Msg.alert('抱歉', '服务器异常！');
						}
					}
				}
			}
		});
		me.hjgsstore = Ext.create('Ext.data.Store', {
			model : 'BatteryBusSystem.SysBatteryBusInfo.SysGsModel',
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/sysBatteryBusManagerController/queryGs',
				actionMethods : {
					read : 'GET'
				},
				listeners : {
					exception : function(proxy, response, operation, eOpts) {
						var result = Ext.JSON.decode(response.responseText, true);
						if (result['filterflag']) {
							Ext.Msg.alert('抱歉', result['message']);
						} else {
							Ext.Msg.alert('抱歉', '服务器异常！');
						}
					}
				}
			}
		});
		me.gsstore = Ext.create('Ext.data.Store', {
			model : 'BatteryBusSystem.SysBatteryBusInfo.SysGsModel',
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/sysBatteryBusManagerController/queryGs',
				actionMethods : {
					read : 'GET'
				},
				listeners : {
					exception : function(proxy, response, operation, eOpts) {
						var result = Ext.JSON.decode(response.responseText, true);
						if (result['filterflag']) {
							Ext.Msg.alert('抱歉', result['message']);
						} else {
							Ext.Msg.alert('抱歉', '服务器异常！');
						}
					}
				}
			}
		});
		
		me.fgsstore = Ext.create('Ext.data.Store', {
			model : 'BatteryBusSystem.SysBatteryBusInfo.SysGsModel',
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/sysBatteryBusManagerController/queryFgs',
				actionMethods : {
					read : 'GET'
				},
				listeners : {
					exception : function(proxy, response, operation, eOpts) {
						var result = Ext.JSON.decode(response.responseText, true);
						if (result['filterflag']) {
							Ext.Msg.alert('抱歉', result['message']);
						} else {
							Ext.Msg.alert('抱歉', '服务器异常！');
						}
					}
				}
			},
			listeners : {
				beforeload : function(store, operation, eOpts) {
					var newparams = {gsdm : me.gsdm_sel};
					Ext.apply(this.proxy.extraParams, newparams);
				},
				load : function(store, records,  successful, operation, eOpts) {
					if (successful) 
						me.fgslocalstore_forfgs.loadData(records);
				}
			}
		});
		
		me.fgslocalstore_forfgs = Ext.create('Ext.data.Store', {
			model : 'BatteryBusSystem.SysBatteryBusInfo.SysGsModel',
			data : []
		});
		
	},
	
	showBatteryBusForm : function(record) {
		var me = this;
		
		var win;
		var form = Ext.create("Ext.form.Panel", {
			frame : true,
			defaultType : 'textfield',
			items : [{
				id : 'zbh',
				name : 'zbh',
				fieldLabel : '自编号',
				allowBlank : false
			}, {
				id : 'jm',
				name : 'jm',
				fieldLabel : '简码',
				allowBlank : false
			}, {
				id : 'cph',
				name : 'cph',
				fieldLabel : '车牌号',
				allowBlank : false
			}, {
				id : 'xl',
				name : 'xl',
				fieldLabel : '线路',
				editable: false,
				xtype : 'combo',
				displayField : 'xlmc',
				valueField : 'xlmc',
				store : me.xlstore,
				listeners : {
					select : function(combo, records, eOpts) {
						form.getForm().findField('xlbm').setValue(records[0].get('xlbm'));
					}
				},
				allowBlank : false
			}, {
				id : 'xlbm',
				name : 'xlbm',
				xtype : 'hiddenfield', 
        		allowBlank: false
			}, {
				id : 'hjdw', 
				name : 'hjdw', 
				fieldLabel : '户籍单位', 
				editable: false,
				xtype : 'combo',
				displayField : 'gsmc',
				valueField : 'gsmc',
				mode : 'local',
				store : me.hjgsstore,
				allowBlank : false,
				emptyText : '请选择...'
			}, {
				id : 'sydw',
				name : 'sydw',
				fieldLabel : '使用单位',
				editable: false,
				xtype : 'combo',
				displayField : 'gsmc',
				valueField : 'gsmc',
				mode : 'local', 
				store : me.gsstore,
				emptyText : '请选择...',
				listeners : {
					select : function(combo, records, eOpts) {
						me.gsdm_sel = records[0].get('fgsdm');
						form.getForm().findField('gsdm').setValue(records[0].get('fgsdm'));
						form.getForm().findField('fgs').clearValue();
						me.fgsstore.load();
					}
				},
				allowBlank : false
			}, {
				id : 'gsdm',
				name : 'gsdm',
				xtype : 'hiddenfield', 
        		allowBlank: false
			}, {
				id : 'fgs',
				name : 'fgs',
				fieldLabel : '使用分公司',
				editable: false,
				xtype : 'combo',
				displayField : 'gsmc',
				valueField : 'gsmc',
				mode : 'local',
				queryMode : 'local',
				store : me.fgslocalstore_forfgs,
				emptyText : '请选择...',
				listeners : {
					select : function(combo, records, eOpts) {
						form.getForm().findField('fgsdm').setValue(records[0].get('fgsdm'));
					}
				},
				allowBlank : false
			}, {
				id : 'fgsdm',
				name : 'fgsdm',
				xtype : 'hiddenfield', 
        		allowBlank: false
			}, {
				id : 'sccs', 
				name : 'sccs', 
				fieldLabel : '生产厂商', 
				xtype : 'combo',
				displayField : 'sccsmc',
				valueField : 'sccsmc',
				store : me.sccsstore,
				listeners : {
					select : function(combo, records, eOpts) {
						form.getForm().findField('sccsid').setValue(records[0].get('id'));
					}
				},
				allowBlank : false
			}, {
				id : 'sccsid',
				name : 'sccsid',
				xtype : 'hiddenfield', 
        		allowBlank: false
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
			}, {
				xtype : 'hiddenfield',
				name : 'clid'
			}],
			buttons : [{
				text : '重置',
				handler : function() {
					this.up('form').getForm().reset();
				}
			}, {
				text : '提交', 
				disabled: true,
                formBind: true,
				handler : function() {
					var f = this.up('form').getForm();
					var url = '';
					if (record) 
						url = '/busbatterysystem/web/security/sysBatteryBusManagerController/updateBatteryBus';
					else 
						url = '/busbatterysystem/web/security/sysBatteryBusManagerController/addBatteryBus';
					f.submit({
						clientValidation : true,
						url : url,
						method : 'POST',
						success : function(form, action) {
							Ext.Msg.alert('成功', action.result.msg);
							win.close();
							me.store.load();
						}, 
						failure: function(form, action) {
							if (action && action.result && action.result.msg) 
								Ext.Msg.alert('失败', action.result.msg);
							else {
								var result = Ext.JSON.decode(action.response.responseText, true);
								if (result['filterflag']) {
									Ext.Msg.alert('抱歉', result['message']);
								} else {
									Ext.Msg.alert('抱歉', '服务器异常！');
								}
							}
						},
						waitMsg: '保存中......'
					});
				}
			}]
		});
		
		if (record)
			form.getForm().setValues(record.data);
		
		win = Ext.create("Ext.window.Window", {
			width : 300,
			height : 350,
			title : '电池车辆基础信息',
			layout : 'fit',
			items : [form],
			modal : true
		});
		win.show();
	},
	
	deleteBusInfo : function(records) {
		var me = this;
		
		if (records.length == 0) 
			Ext.Msg.alert('选择', '请选择需要删除的记录！');
		else {
			Ext.Msg.confirm('确认', '请问您确认删除这些车辆数据吗？', function(bt) {
    			if (bt == 'yes') {
    				var clids = [];
					for (var i = 0; i < records.length; i++) 
						clids.push(records[i].data['clid']);
        			Ext.Ajax.request({
        				url : '/busbatterysystem/web/security/sysBatteryBusManagerController/invalidbuses',
        				method : "POST",
        				jsonData : Ext.JSON.encode(clids),
        				success : function(response, options) {
							var result = response.responseText;
							if (result == '"invalidok"') {
								Ext.Msg.alert('成功', '删除车辆成功！');
								me.store.load();
							} else {
								Ext.Msg.alert('抱歉', '服务器错误，请稍后删除！');
							}
						},
						failure : function(response, options) {
							var result = Ext.JSON.decode(response.responseText, true);
							if (result['filterflag']) {
								Ext.Msg.alert('抱歉', result['message']);
							} else {
								Ext.Msg.alert('抱歉', '服务器异常！');
							}
						}
        			});
    			}
			});
		}
	},
	
	createBatteryBusGrid : function() {
		var me = this;

		/**
		 * grid 里columns 里定义列的时候写id属性会报错，
		 * Uncaught TypeError: Object [object Object] has no method 'isOnLeftEdge' 
		 * 注意了：http://www.sencha.com/forum/showthread.php?155646-Uncaught-TypeError-Object-object-Object-has-no-method-isOnLeftEdge-in-Extjs-4.0.
		 */
		var grid = Ext.create("Ext.grid.Panel", {
//			width : 500,
//			height : 500,
			store : me.store,
			selModel : Ext.create('Ext.selection.CheckboxModel', {mode : 'SIMPLE'}),
			frame : true,
			border : false,
			columnLines : true,
			disableSelection : false,
			columns : [{
				dataIndex : 'zbh',
				text : '自编号'
			}, {
				dataIndex : 'sbbh',
				text : '设备编号'
			}, {
				dataIndex : 'xl',
				text : '线路'
			}, {
				dataIndex : 'sydw',
				text : '使用单位'
			}, {
				dataIndex : 'sccs',
				text : '生产厂商'
			}, {
				dataIndex : 'dclx',
				text : '电池类型'
			}, {
				dataIndex : 'createtime', 
				text : '添加时间',
				width : 180
			}], 
			bbar : Ext.create('Ext.PagingToolbar', {
				store : me.store, 
				displayInfo : true, 
				displayMsg : '当前显示第{0}条 至 {1}条记录，共{2}条记录',
				emptyMsg : '暂无可用数据'
			}),
			tbar:[{
	        	width:240,
	        	fieldLabel:'搜素',
	        	xtype:'searchfield_fix',
	        	labelWidth:50,
	        	store: me.store 
	        }, {
	        	text : '新增', 
	        	xtype : 'button',
	        	width : 80,
	        	handler : function() {
	        		me.showBatteryBusForm();
	        	}
	        }, {
	        	text : '修改',
	        	xtype : 'button',
	        	width : 80,
	        	handler : function() {
	        		var records = grid.getSelectionModel().getSelection();
	        		if (records.length == 0) {
	        			Ext.Msg.alert('警告', '请选择一条需要修改的数据！');
	        			return;
	        		} else if (records.length > 1) {
	        			Ext.Msg.alert('警告', '只能选择一条修改的数据！');
	        			return;
	        		}
	        		me.showBatteryBusForm(records[0]);
	        	}
	        }, {
	        	text : '删除',
	        	xtype : 'button',
	        	width : 80, 
	        	handler : function() {
	        		me.deleteBusInfo(grid.getSelectionModel().getSelection());
	        	}
	        }, {
	        	text : '生成资源',
	        	xtype : 'button',
	        	width : 80, 
	        	handler : function() {
	        		Ext.Msg.alert('sorry', '开发中！');
	        	}
	        }]
		});
		this.store.loadPage(1);
		return grid;
	},
	
	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('sysbatterybusinfo');
		if (!win) {
			win = desktop.createWindow({
				id : 'sysbatterybusinfo',
				title : '电池车辆基础信息管理',
				width : 800,
				height : 400,
				iconCls : 'notepad',
				animCollapse : false,
				border : false,
				hideMode : 'offsets',
				layout : 'fit',
				items : [
					this.createBatteryBusGrid()
				]
			});
		}
		win.show();
		return win;
	}
});
