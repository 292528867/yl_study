var store;

Ext.define('BatteryBusSystem.SysPermission', {
	extend : 'Ext.ux.desktop.Module',

	requires : [
		
	], 
	
	id : 'syspermission',

	init : function() {
		this.launcher = {
			text : '权限管理',
			iconCls : 'notepad',
			handler : this.createWindow,
			scope : this
		}
		
		// 初始化store的额外参数
		this.storeparams = {};
		this.storeparams["resourcetype"] = -1; // 资源类型 
		
		// 初始化model
		Ext.define('BatteryBusSystem.SysPermission.PermissionVoModel', {
			extend : 'Ext.data.Model', 
			fields : [
			    'permissionId',
			    'permissionname',
			    'permissiontype',
			    'permissionstring',
			    'createtime',
			    'resourceId',
			    'resourcename',
			    'resourcetype'
			]
		});
		Ext.define('BatteryBusSystem.SysPermission.ResourceModel', {
			extend : 'Ext.data.Model',
			fields : [
			    'resourceId', 
			    'resourcename', 
			    'resourcetype', 
			    'type1_url',
			    'type1_desc',
			    'type2_url',
			    'type2_packagename',
			    'type2_module_id',
			    'type2_iconcls',
			    'type2_desc',
			    'type3_zbh',
			    'type3_desc'
			]
		});
		
		var storeparams_ = this.storeparams;
		// 初始化store
		this.permissionstore = Ext.create('Ext.data.Store', {
			pageSize : 10,
			model : 'BatteryBusSystem.SysPermission.PermissionVoModel',
			remoteSort : true,
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/SysPermissionController/queryPermissionList',
				actionMethods : {
//	                create : 'POST',
	                read   : 'POST', // by default GET
//	                update : 'POST',
//	                destroy: 'POST'
				},
				reader : {
					root : 'permissions', 
					totalProperty : 'totalCount'
				}
			}
		});
		
		this.resourcestore = Ext.create('Ext.data.Store', {
			pageSize : 10,
			model : 'BatteryBusSystem.SysPermission.ResourceModel', 
			remoteSort : true, 
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/SysResourceController/queryResourceListByType',
				actionMethods : {
//	                create : 'POST',
	                read   : 'POST', // by default GET
//	                update : 'POST',
//	                destroy: 'POST'
				},
				reader : {
					root : 'resources', 
					totalProperty : 'totalCount'
				}
			},
			listeners : {
				beforeload : function(store, operation, eOpts) {
					var resourcetype = storeparams_["resourcetype"];
					var newparams = {resourcetype : resourcetype};
					Ext.apply(this.proxy.extraParams, newparams);
				}
			}
		});
	},
	
	permissionstore : null, // 权限 store 各种类型权限
	resourcestore : null, // 资源 store，各种类型资源
	storeparams : null, // store的额外参数

	showPermissionForm : function(record, resourcestore, permissionstore) { // 创建权限信息表单
		var win;
		var formPanel = Ext.create('Ext.form.Panel', {
			columnWidth : 0.4,
			margin : '10 10 10 10', 
			frame : true,
			bodyPadding : 5,
			fieldDefaults: {
	            labelAlign: 'left',
	            msgTarget: 'side'
	        }, 
	        items : [{
	        	xtype : 'fieldset',
	        	title : '当前资源',
	        	defaults : {
	        		width : 240,
	        		labelWidth : 90
	        	},
	        	defaultType : 'textfield', 
	        	items : [{
	        		xtype : 'hiddenfield', 
	        		name : 'resourceId',
	        		readOnly : true,
	        		allowBlank: false,
	        	}, {
	        		fieldLabel : '资源名称',
	        		name : 'resourcename',
	        		readOnly : true,
	        		allowBlank: false,
	        	}, {
	        		fieldLabel : '资源类型',
	        		name : 'resourcetype',
	        		readOnly : true,
	        		allowBlank: false,
	        	}]
	        }, {
	        	xtype : 'fieldset',
	        	title : '权限信息',
	        	defaults : {
	        		width : 240,
	        		labelWidth : 90
	        	},
	        	defaultType : 'textfield', 
	        	items : [{
	        		xtype : 'hiddenfield', 
	        		name : 'permissionId'
	        	}, {
	        		fieldLabel : '权限名称',
	        		name : 'permissionname',
	        		allowBlank: false,
	        	}, {
	        		fieldLabel : '权限标识',
	        		name : 'permissionstring',
	        		allowBlank: false,
	        	}, {
	        		fieldLabel : '权限类型',
	        		name : 'permissiontype',
	        		allowBlank: false
	        	}]
	        }],
	        buttons : [{
        		text : '提交',
                disabled: true,
                formBind: true,
                handler: function() {
                	var syspermissionvo = formPanel.getForm().getValues();
                    if (record) {
                    	// 更新
                    	Ext.Ajax.request({
							url : '/busbatterysystem/web/security/SysPermissionController/updatepermission',
							method : 'POST',
							jsonData : Ext.JSON.encode(syspermissionvo),
							success : function(response, options) {
								var result = response.responseText;
								if (result == '"updateok"') {
									Ext.Msg.alert('恭喜', '更新权限成功！');
									win.close();
									permissionstore.load();
								}
							},
							failure : function(response, options) {
								Ext.Msg.alert('抱歉', '服务器错误，请稍后添加！');
							}
						});
                    } else {
                    	// 新增
                    	Ext.Ajax.request({
							url : '/busbatterysystem/web/security/SysPermissionController/addpermission',
							method : 'POST',
							jsonData : Ext.JSON.encode(syspermissionvo),
							success : function(response, options) {
								var result = response.responseText;
								if (result == '"addok"') {
									Ext.Msg.alert('恭喜', '创建权限成功！');
									win.close();
									permissionstore.load();
								}
							},
							failure : function(response, options) {
								Ext.Msg.alert('抱歉', '服务器错误，请稍后添加！');
							}
						});
                    }
                }
        	}]
	     
		});
		
		// 定义一个form的模型，本例中form的值是分开传进去的，不是一次性的
		// 所以要在定义的时候，确定一个完整的模型
		var formRecordModle = Ext.create('BatteryBusSystem.SysPermission.PermissionVoModel');
		formPanel.getForm().loadRecord(formRecordModle);
		
		if (record) {
			// 修改数据
			formPanel.getForm().setValues(record.data);
		}
		
		var resourceGridPanel = Ext.create('Ext.grid.Panel', {
			margin : '10 0 10 10',
			columnWidth: 0.60,
			store: resourcestore,
			height: 300,
            title:'资源列表',
            columns : [{
				text : '资源名称', 
				dataIndex : 'resourcename', 
			}, {
				text : '资源类型', 
				dataIndex : 'resourcetype', 
				sortable : false, 
				anchor : "30%",
				renderer : function(value, metadata, record) {
					if (value == 1) 
						return "URL资源";
					else if (value == 2) 
						return "脚本资源";
					else if (value == 3) 
						return "数据资源";
					else 
						return "未知资源";
				}
			}],
			bbar : Ext.create('Ext.PagingToolbar', {
				store : resourcestore, 
				displayInfo : true, 
				displayMsg : '当前显示第{0}条 至 {1}条记录，共{2}条记录',
				emptyMsg : '暂无可用数据'
			}),
			tbar:[{
	        	width:300,
	        	fieldLabel:'搜素',
	        	xtype:'searchfield',
	        	labelWidth:50, 
	        	store : resourcestore
	        }], 
	        listeners: {
                selectionchange: function(model, records) {
                    if (records[0]) {
                    	formPanel.getForm().setValues(records[0].data);
                    }
                }
            }
		});
		
		win = Ext.create('Ext.window.Window', {
			title : '权限配置',
			width : 850,
			height : 360,
			layout : 'column',
			items : [resourceGridPanel,formPanel],
			modal : true
		});
		
		resourcestore.load();
		win.show();
	},
	
	createPermissionGrid : function() {
		var resourcestore = this.resourcestore;
		var permissionstore = this.permissionstore;
		var storeparams = this.storeparams;
		
		var showPermissionFormFun = this.showPermissionForm;
		
		var grid = Ext.create('Ext.grid.Panel', {
			store : permissionstore,
			border : false,
			columnLines : true,
			disableSelection : false,
			columns : [{
				dataIndex : 'permissionname',
				text : '权限名称'
			}, {
				dataIndex : 'permissionstring', 
				text : '权限标识'
			}, {
				dataIndex : 'permissiontype',
				text : '权限类型', 
				renderer : function(value, metadata, record) {
					if (value == 1)
						return "读权限";
					else 
						return "未知类型权限";
				}
			}, {
				dataIndex : 'createtime', 
				text : '创建时间'
			}],
			bbar : Ext.create('Ext.PagingToolbar', {
				store : permissionstore, 
				displayInfo : true, 
				displayMsg : '当前显示第{0}条 至 {1}条记录，共{2}条记录',
				emptyMsg : '暂无可用数据'
			}),
			tbar:[{
	        	width:240,
	        	fieldLabel:'搜素',
	        	xtype:'searchfield',
	        	labelWidth:50,
	        	store: permissionstore 
	        }, {
	        	xtype : 'button',
	        	width : 80,
	        	text : '创建权限', 
	        	handler : function() {
	        		showPermissionFormFun(null, resourcestore, permissionstore);
	        	}
	        }, {
	        	xtype : 'button',
	        	width : 80,
	        	text : '修改权限',
	        	handler : function() {
	        		var records = grid.getSelectionModel().getSelection();
	        		if (records.length == 0) {
	        			Ext.Msg.alert('警告', '请至少选择一条需要修改的数据！');
	        			return;
	        		}
	        		showPermissionFormFun(records[0], resourcestore, permissionstore);
	        	}
	        }, {
	        	xtype : 'button',
	        	width : 80,
	        	text : '删除权限',
	        	handler : function() {
	        		var records = grid.getSelectionModel().getSelection();
	        		if (records.length == 0) {
	        			Ext.Msg.alert('警告', '请至少选择一条需要删除的数据！');
	        			return;
	        		}
	        		
	        		Ext.Msg.confirm('确认', '请问您确认删除该角色吗？', function(bt) {
	        			if (bt == 'yes') {
	        				Ext.Ajax.request({
	        					url : '/busbatterysystem/web/security/SysPermissionController/invalidPermission',
	        					methods : 'POST',
	        					jsonData : Ext.JSON.encode(records[0].data),
	        					success : function(response, options) {
        							var result = response.responseText;
        							if (result == '"invalidok"') {
        								Ext.Msg.alert('成功', '删除角色成功！');
        								permissionstore.load();
        							} else {
        								Ext.Msg.alert('失败', '删除角色失败！');
        							}
        						},
        						failure : function(response, options) {
        							Ext.Msg.alert('抱歉', '服务器异常，请稍后添加！');
        						}
	        				});
	        			}
	        		});
	        	}
	        }]
		});
		
		permissionstore.loadPage(1);
		
		return grid;
	},
	
	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('syspermission');
		if (!win) {
			win = desktop.createWindow({
				id : 'syspermission',
				title : '权限管理',
				width : 700,
				height : 400,
				iconCls : 'notepad',
				animCollapse : false,
				border : false,
				hideMode : 'offsets',
				layout : 'fit',
				items : [
					this.createPermissionGrid()
				]
			});
		}
		win.show();
		return win;
	}
});
