//var store;

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
		
		var me = this;
		
		// 初始化store的额外参数
		me.storeparams = {};
		me.storeparams["resourcetype"] = -1; // 资源类型 
		
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
			    'type3_desc',
			    'createtime'
			]
		});
		
		// 初始化store
		this.localComboxStoreForResourceType = Ext.create('Ext.data.Store', {
			fields : ['name', 'value'],
			data : [{name : 'URL资源', value : 1}, {name : '脚本资源', value : 2}, {name : '车辆数据资源', value : 3}]
		});
		this.dynamicComboxStoreForPermissionString = Ext.create('Ext.data.Store', {
			fields : ['name', 'value'],
			data : []
		});
		this.localComboxStoreForPermissionType = Ext.create('Ext.data.Store', {
			fields : ['name', 'value'],
			data : [{name : '读权限', value : 1}]
		});
		
		me.permissionstore = Ext.create('Ext.data.Store', {
			pageSize : 10,
			model : 'BatteryBusSystem.SysPermission.PermissionVoModel',
			remoteSort : true,
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/sysPermissionController/queryPermissionList',
				actionMethods : {
//	                create : 'POST',
	                read   : 'POST' // by default GET
//	                update : 'POST',
//	                destroy: 'POST'
				},
				reader : {
					root : 'permissions', 
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
		
		me.resourcestore = Ext.create('Ext.data.Store', {
			pageSize : 10,
			model : 'BatteryBusSystem.SysPermission.ResourceModel', 
			remoteSort : true, 
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/sysResourceController/queryResourceListByType',
				actionMethods : {
//	                create : 'POST',
	                read   : 'POST' // by default GET
//	                update : 'POST',
//	                destroy: 'POST'
				},
				reader : {
					root : 'resources', 
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
			},
			listeners : {
				beforeload : function(store, operation, eOpts) {
					var resourcetype = me.storeparams["resourcetype"];
					var newparams = {resourcetype : resourcetype};
					Ext.apply(this.proxy.extraParams, newparams);
				}
			}
		});
	},
	
	permissionstore : null, // 权限 store 各种类型权限
	resourcestore : null, // 资源 store，各种类型资源
	storeparams : null, // store的额外参数
	localComboxStoreForResourceType : null, // local 资源类型combox store
	dynamicComboxStoreForPermissionString : null, // 动态权限标识combox store
	localComboxStoreForPermissionType : null, // local 权限类型combox store

	showPermissionForm : function(record) { // 创建权限信息表单
		var me = this;
		
		var win;
		var formPanel = Ext.create('Ext.form.Panel', {
//			columnWidth : 0.4,
			width : 300,
			region : 'east',
			margin : '5 5 5 5', 
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
	        		allowBlank: false
	        	}, {
	        		fieldLabel : '资源名称',
	        		name : 'resourcename',
	        		readOnly : true,
	        		allowBlank: false
	        	}, {
	        		fieldLabel : '资源类型',
	        		name : 'resourcetype',
	        		readOnly : true,
	        		allowBlank: false,
					xtype : 'combo',
					mode : 'local',
					queryMode : 'local', 
					displayField : 'name',
					valueField : 'value',
					store : me.localComboxStoreForResourceType
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
	        		allowBlank: false
	        	}, {
	        		fieldLabel : '权限标识',
	        		name : 'permissionstring',
	        		allowBlank: false,
	        		xtype : 'combo',
					mode : 'local',
					queryMode : 'local', 
					displayField : 'name',
					valueField : 'value',
	        		store : me.dynamicComboxStoreForPermissionString
	        	}, {
	        		fieldLabel : '权限类型',
	        		name : 'permissiontype',
	        		allowBlank: false,
	        		xtype : 'combo',
					mode : 'local',
					queryMode : 'local', 
					displayField : 'name',
					valueField : 'value',
					store : me.localComboxStoreForPermissionType
	        	}]
	        }],
	        buttons : [{
        		text : '提交',
                disabled: true,
                formBind: true,
                handler : function() {
					var f = this.up('form').getForm();
					var url = '';
					if (record) 
						url = '/busbatterysystem/web/security/sysPermissionController/updatepermission';
					else 
						url = '/busbatterysystem/web/security/sysPermissionController/addpermission';
					f.submit({
						clientValidation : true,
						url : url,
						method : 'POST',
						success : function(form, action) {
							Ext.Msg.alert('成功', action.result.msg);
							win.close();
							me.permissionstore.load();
						}, 
						failure: function(form, action) {
							var result = Ext.JSON.decode(action.response.responseText, true);
							if (result['filterflag']) {
								Ext.Msg.alert('抱歉', result['message']);
							} else {
								Ext.Msg.alert('抱歉', '服务器异常！');
							}
						},
						waitMsg: record ? '保存中......' : '更新中......'
					});
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
			margin : '5 0 5 5',
//			columnWidth: 0.60,
			region : 'center',
			store: me.resourcestore,
//			height: 300,
            title:'资源列表',
            columns : [{
				text : '资源名称', 
				dataIndex : 'resourcename'
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
						return "车辆数据资源";
					else 
						return "未知资源";
				}
			}, {
				text : '创建时间',
				dataIndex : 'createtime',
				width : 180
			}],
			bbar : Ext.create('Ext.PagingToolbar', {
				store : me.resourcestore, 
				displayInfo : true, 
				displayMsg : '当前显示第{0}条 至 {1}条记录，共{2}条记录',
				emptyMsg : '暂无可用数据'
			}),
			tbar:[{
	        	width:300,
	        	fieldLabel:'搜素',
	        	xtype:'searchfield_fix',
	        	labelWidth:50, 
	        	store : me.resourcestore
	        }], 
	        listeners: {
                selectionchange: function(model, records) {
                    if (records[0]) {
                    	formPanel.getForm().setValues(records[0].data);
                    	
                    	// 默认使用资源标识作为权限表示（供选择，可以改）
                    	var prs = [];
                    	var resourcetype = records[0].get('resourcetype');
                    	if (resourcetype == 1) {
                    		// URL资源使用url标识表示权限字符串
                    		var urlperstr = records[0].get('type1_url');
                    		prs.push({name : urlperstr, value : urlperstr});
                    	} else if (resourcetype == 2) {
                    		// 脚本资源使用模块id表示权限字符串
                    		var scriptperstr = records[0].get('type2_module_id');
                    		prs.push({name : scriptperstr, value : scriptperstr});
                    	} else if (resourcetype == 3) {
                    		// 车辆数据资源使用自编号表示权限字符串
                    		var clinfoperstr = records[0].get('type3_zbh');
                    		prs.push({name : clinfoperstr, value : clinfoperstr});
                    	} else {
                    		
                    	}
                    	me.dynamicComboxStoreForPermissionString.loadData(prs);
                    }
                }
            }
		});
		
		win = Ext.create('Ext.window.Window', {
			title : record ? '权限配置-修改权限' : '权限配置-创建权限',
			width : 850,
			height : 400,
//			layout : 'column',
			layout : 'border',
			items : [resourceGridPanel,formPanel],
			modal : true,
			listeners : {
				beforeclose : function (panel, eOpts ) {
		            var proxy  = me.resourcestore.getProxy();
					proxy.extraParams['query'] = '';
					return true;
				}
			}
		});
		
		me.resourcestore.load();
		win.show();
	},
	
	createPermissionGrid : function() {
		var me = this;
		
		var grid = Ext.create('Ext.grid.Panel', {
			store : me.permissionstore,
			selModel : Ext.create('Ext.selection.CheckboxModel', {mode : 'SIMPLE'}),
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
				text : '创建时间',
				width : 180
			}],
			bbar : Ext.create('Ext.PagingToolbar', {
				store : me.permissionstore, 
				displayInfo : true, 
				displayMsg : '当前显示第{0}条 至 {1}条记录，共{2}条记录',
				emptyMsg : '暂无可用数据'
			}),
			tbar:[{
	        	width:240,
	        	fieldLabel:'搜素',
	        	xtype:'searchfield_fix',
	        	labelWidth:50,
	        	store: me.permissionstore 
	        }, {
	        	xtype : 'button',
	        	width : 80,
	        	text : '创建权限', 
	        	handler : function() {
	        		me.showPermissionForm(null);
	        	}
	        }, {
	        	xtype : 'button',
	        	width : 80,
	        	text : '修改权限',
	        	handler : function() {
	        		var records = grid.getSelectionModel().getSelection();
	        		if (records.length == 0) {
	        			Ext.Msg.alert('警告', '请选择一条需要修改的数据！');
	        			return;
	        		} else if (records.length > 1) {
	        			Ext.Msg.alert('警告', '只能选择一条需要修改的数据！');
	        			return;
	        		}
	        		me.showPermissionForm(records[0]);
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
	        				var permissionids = [];
							for (var i = 0; i < records.length; i++) 
								permissionids.push(records[i].data['permissionId']);
	        				Ext.Ajax.request({
	        					url : '/busbatterysystem/web/security/sysPermissionController/invalidpermissions',
	        					methods : 'POST',
	        					jsonData : Ext.JSON.encode(permissionids),
	        					success : function(response, options) {
        							var result = response.responseText;
        							if (result == '"invalidok"') {
        								Ext.Msg.alert('成功', '删除权限成功！');
        								me.permissionstore.load();
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
	        }]
		});
		
		me.permissionstore.loadPage(1);
		
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
