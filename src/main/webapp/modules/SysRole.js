
Ext.define('BatteryBusSystem.SysRole', {
	extend : 'Ext.ux.desktop.Module',

	requires : [
		
	], 
	
	id : 'sysrole',

	init : function() {
		this.launcher = {
			text : '角色管理',
			iconCls : 'notepad',
			handler : this.createWindow,
			scope : this
		}
		
		
		var me = this;
		
		// 初始化store的额外参数
		me.storeparams = {};
		me.storeparams["treeroleId"] = null; // 选中角色id
		
		// 初始化model
		Ext.define('BatteryBusSystem.SysRole.RoleModel', {
			extend : 'Ext.data.Model', 
			fields : [
				'roleId',
				'rolename',
				'roleremark'
			]
		});
		Ext.define('BatteryBusSystem.SysRole.PermissionVoModel', {
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
		
		// 初始化store
		var storeparams_ = me.storeparams;
		me.rolestore = Ext.create('Ext.data.Store', {
			model : 'BatteryBusSystem.SysRole.RoleModel',
			pageSize : 10, 
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/SysRoleController/queryRoleList', 
				actionMethods : {
//	                create : 'POST',
	                read   : 'POST', // by default GET
//	                update : 'POST',
//	                destroy: 'POST'
				},
				reader : {
					root : 'roles', 
					totalProperty : 'totalCount'
				}
			}
		});
		me.permissionstore = Ext.create('Ext.data.Store', {
			pageSize : 10,
			model : 'BatteryBusSystem.SysRole.PermissionVoModel',
			remoteSort : true,
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/SysPermissionController/queryPermissionList',
				actionMethods : {
	                read   : 'POST'
				},
				reader : {
					root : 'permissions', 
					totalProperty : 'totalCount'
				}
			},
			listeners : {
				beforeload : function(store, operation, eOpts) {
					me.permissionstore['baseGrid'].getSelectionModel().removeListener('selectionchange', me.selModSelectionChange, me);
				},
				load : function(store, records, successful, operation, eOpts) {
					// 把选用的角色拥有的权限勾选到permission grid上
					var selectioins = new Array();
					store.each(function (record) {
						me.rolepermissionstore.each(function (recordCompare) {
							if (recordCompare.data['permissionId'] == record.data['permissionId']) {
								selectioins.push(record);
								return false;
							}
						});
					});
					me.permissionstore['baseGrid'].getSelectionModel().select(selectioins, true, true);
					me.permissionstore['baseGrid'].getSelectionModel().addListener('selectionchange', me.selModSelectionChange, me);
				}
			}
		});
		me.rolepermissionstore = Ext.create('Ext.data.Store', {
			model : 'BatteryBusSystem.SysRole.PermissionVoModel',
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/SysPermissionController/queryPermissionListByRole',
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json'
				},
				listeners : {
					exception : function() {
						Ext.Msg.alert('抱歉', '服务器异常，请稍后分配权限！');
					}
				}
			},
			listeners : {
				beforeload : function(store, operation, eOpts) {
					var roleId = storeparams_["treeroleId"];
					var newparams = {roleId : roleId};
					Ext.apply(this.proxy.extraParams, newparams);
				}
			}
		});
		me.departmentusertreestore = Ext.create('Ext.data.TreeStore', {
			proxy : {
				actionMethods : {
	                read   : 'POST'
				},
				type : 'ajax',
				url : '/busbatterysystem/web/security/sysDepartmentController/queryDepartmentUsertree'
			}, 
			listeners : {
				beforeload : function(store, operation, eOpts) {
					var roleId = storeparams_["treeroleId"];
					var newparams = {roleId : roleId};
					Ext.apply(this.proxy.extraParams, newparams);
				}
			},
			sorters : [{
				property : 'leaf',
				direction : 'ASC'
			}, {
				property : 'text',
				direction : 'ASC'
			}]
		});
		me.departmentusertreestore.load();
	},
	
	rolestore : null, // 角色store
	departmentusertreestore : null, // 用户树store
	permissionstore : null, // 权限 store 各种类型权限
	rolepermissionstore : null, // 当前选中的用户的权限列表（PermissionVo）
	storeparams : null, // store的额外参数
	
	selModSelectionChange : function(own, selected, eOpts) {
		// selMod的 selectionchange 定义事件
		// scope 是 BatteryBusSystem.SysRole
		// 每次都要计算当前页，哪些被选了，哪些没被选中
		var me = this;

		// 增加
		Ext.Array.each(selected, function (record) {
			var compareRecord = me.rolepermissionstore.findRecord("permissionId", record.data['permissionId']);
			if (!compareRecord) {
				// 创建一个新增的
				var permission = Ext.create('BatteryBusSystem.SysRole.PermissionVoModel', {
					permissionId : record.data['permissionId']
				});
				me.rolepermissionstore.add(permission);
			}
		})
		// 删除
		this.permissionstore.each(function(record) {
			if (selected.indexOf(record) == -1) {
				// 没有被选中的，删除
				var compareRecord = me.rolepermissionstore.findRecord("permissionId", record.data['permissionId']);
				if (compareRecord) 
					me.rolepermissionstore.remove(compareRecord);
			}
		});
	},
	
	showPermissionForm : function(record) {
		var me = this;
		
		var win;
		var permissionGridSelMod = Ext.create('Ext.selection.CheckboxModel', {
			mode : 'SIMPLE',
			listeners : {
				scope : me, 
				selectionchange : me.selModSelectionChange
			}
		});
		var grid = Ext.create('Ext.grid.Panel', {
			store : me.permissionstore,
			border : false,
			columnLines : true,
			selModel : permissionGridSelMod,
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
				store : me.permissionstore, 
				displayInfo : true, 
				displayMsg : '当前显示第{0}条 至 {1}条记录，共{2}条记录',
				emptyMsg : '暂无可用数据'
			}),
			tbar:[{
	        	width:240,
	        	fieldLabel:'搜素',
	        	xtype:'searchfield',
	        	labelWidth:50,
	        	store: me.permissionstore 
	        }, {
	        	xtype : 'button',
	        	width : 80,
	        	text : '分配权限', 
	        	handler : function() {             
                    if (me.rolepermissionstore.getCount() == 0) {
                    	Ext.Msg.alert('选择', '请选择分配的权限！');
                    	return;
                    }
                    var permissionIds = [];
                    me.rolepermissionstore.each(function(rec) {
                    	permissionIds.push(rec.get('permissionId'));
                    });
                    var roleId = record.data['roleId'];
                    Ext.Ajax.request({
                    	url : '/busbatterysystem/web/security/SysRoleController/updaterolepermissions/' + roleId,
                    	method : 'POST',
                    	jsonData : Ext.JSON.encode(permissionIds),
                    	success : function(response, options) {
                    		var result = response.responseText;
                    		if (result == '"updateok"') {
                    			Ext.Msg.alert('成功', '分配权限成功！');
                    			win.close();
                    		} else {
                    			Ext.Msg.alert('失败', '分配权限失败！');
                    		}
                    	},
                    	failure : function(response, options) {
                    		Ext.Msg.alert('错误', '服务器异常，请稍后分配！');
                    	}
                    });
	        		
	        	}
	        }]
		});
		
		me.permissionstore['baseGrid'] = grid; // TODO：这样会不会内存泄漏，要再议
		me.permissionstore.loadPage(1);
		
		win = Ext.create("Ext.window.Window", {
			width : 550,
			height : 400,
			title : "权限资源",
			layout : 'fit',
			modal : true,
			items : [
			   grid
			]
		});
		win.show();
	},
	
	showRoleForm : function(title, record) {
		var me = this;
		
		var win;
		var form = Ext.create("Ext.form.Panel", {
			defaultType : 'textfield',
			frame : true, // 设置为true时可以为panel添加背景色、圆角边框等
			items : [{
				name : 'rolename',
				fieldLabel : '角色名称', 
				anchor : '100%',
				allowBlank : false
			}, {
				name : 'roleremark',
				fieldLabel : '角色描述',
				anchor : '100% 60%',
				xtype : 'textarea',
				allowBlank : false
			}, {
				xtype : 'hiddenfield',
				name : 'roleId'
			}],
			buttons : [{
				text : '提交',
                disabled: true,
                formBind: true,
				handler : function() {
					var sysrole = form.getForm().getValues();
					if (record) {
						Ext.Ajax.request({
    						url : '/busbatterysystem/web/security/SysRoleController/updaterole',
    						method : 'POST',
    						jsonData : Ext.JSON.encode(sysrole),
    						success : function(response, options) {
    							var result = response.responseText;
    							if (result == '"updateok"') {
    								Ext.Msg.alert('成功', '修改角色成功！');
    								me.rolestore.load();
    							} else {
    								Ext.Msg.alert('失败', '修改角色失败！');
    							}
    							win.close();
    						},
    						failure : function(response, options) {
    							Ext.Msg.alert('抱歉', '服务器异常，请稍后添加！');
    						}
    					});
					} else {
						Ext.Ajax.request({
							url : '/busbatterysystem/web/security/SysRoleController/addrole',
							method : 'POST',
							jsonData : Ext.JSON.encode(sysrole),
							success : function(response, options) {
								var result = response.responseText;
								if (result == '"addok"') {
									Ext.Msg.alert('成功', '添加角色成功！');
									me.rolestore.load();
								} else {
									Ext.Msg.alert('失败', '添加角色失败！');
								}
								win.close();
							},
							failure : function(response, options) {
								Ext.Msg.alert('抱歉', '服务器异常，请稍后添加！');
							}
						});
					}
				}
			}]
		});
		
		if (record) {
			form.getForm().setValues(record.data);
			// value : flowroleremark.replace(/<\/br>/g, "\n"), // /../g全局匹配正则表达式
		}
		
		win = Ext.create("Ext.window.Window", {
			width : 400,
			height : 400,
			title : title,
			layout : 'fit',
			modal : true,
			items : [
				form
			]
		});
		win.show();
	},
	
	createRoleGrid : function() {
		var me = this;
		
		var grid = Ext.create('Ext.grid.Panel', {
			store : me.rolestore,
			border : false,
			columnLines : true,
			disableSelection : false,
			columns : [{
				dataIndex : 'roleId',
				hidden : true
			}, {
				dataIndex : 'rolename',
				text : '角色名称'
			}, {
				dataIndex : 'roleremark', 
				text : '角色描述'
			}],
			bbar : Ext.create('Ext.PagingToolbar', {
				store : me.rolestore, 
				displayInfo : true, 
				displayMsg : '当前显示第{0}条 至 {1}条记录，共{2}条记录',
				emptyMsg : '暂无可用数据'
			}),
			tbar:[{
	        	width:240,
	        	fieldLabel:'搜素',
	        	xtype:'searchfield',
	        	labelWidth:50,
	        	store: me.rolestore 
	        }, {
	        	xtype : 'button',
	        	width : 80,
	        	text : '添加角色', 
	        	scope : me, 
	        	handler : function() {
	        		this.showRoleForm("添加角色", null);
	        	}
	        }, {
	        	xtype : 'button',
	        	width : 80,
	        	text : '修改角色',
	        	scope : me,
	        	handler : function() {
	        		var records = grid.getSelectionModel().getSelection();
	        		if (records.length == 0) {
	        			Ext.Msg.alert('警告', '请至少选择一条需要修改的数据！');
	        			return;
	        		}
	        		this.showRoleForm("修改角色", records[0]);
	        	}
	        }, {
	        	xtype : 'button',
	        	width : 80,
	        	text : '删除角色',
	        	scope : me, 
	        	handler : function() {
	        		var records = grid.getSelectionModel().getSelection();
	        		if (records.length == 0) {
	        			Ext.Msg.alert('警告', '请至少选择一条需要删除的数据！');
	        			return;
	        		}
	        		
	        		Ext.Msg.confirm('确认', '请问您确认删除该角色吗？', function(bt) {
	        			if (bt == 'yes') {
	        				var sysrole = {};
	        				sysrole["roleId"] = records[0].data['roleId'];
	        				Ext.Ajax.request({
	        					url : '/busbatterysystem/web/security/SysRoleController/invalidRole',
	        					methods : 'POST',
	        					jsonData : Ext.JSON.encode(sysrole),
	        					success : function(response, options) {
        							var result = response.responseText;
        							if (result == '"invalidok"') {
        								Ext.Msg.alert('成功', '删除角色成功！');
        								me.rolestore.load();
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
	        }, {
	        	xtype : 'button',
	        	text : '分配用户',
	        	width : 80,
	        	scope : me,
	        	handler : function() {
	        		var win;
	        		var records = grid.getSelectionModel().getSelection();
	        		if (records.length == 0) {
	        			Ext.Msg.alert('警告', '请至少选择一个需要分配用户的角色！');
	        			return;
	        		}
	        		var roleId = records[0].data['roleId'];
	        		this.storeparams["treeroleId"] = roleId; // 选中角色id
	        		var tree = Ext.create("Ext.tree.Panel", {
	        			store : this.departmentusertreestore,
	        			rootVisible : false,
	        			useArrows : true,
	        			frame : true, 
	        			dockedItems: [{
	        	            xtype: 'toolbar',
	        	            items: {
	        	                text: '分配用户',
	        	                handler: function(){
	        	                    var checkedtreenodes = tree.getView().getChecked();
	        	                    var userIds = [];
	        	                    Ext.Array.each(checkedtreenodes, function(rec) {
	        	                    	userIds.push(rec.get('id'));
	        	                    });
	        	                    
	        	                    if (userIds.length <= 0) {
	        	                    	Ext.Msg.alert('警告', '请至少选择一个用户！');
	        	                    	return;
	        	                    }
	        	                    
	        	                    Ext.Ajax.request({
	        	                    	url : '/busbatterysystem/web/security/SysRoleController/updateroleusers/' + roleId,
	        	                    	method : 'POST',
	        	                    	jsonData : Ext.JSON.encode(userIds),
	        	                    	success : function(response, options) {
	        	                    		var result = response.responseText;
	        	                    		if (result == '"updateok"') {
	        	                    			Ext.Msg.alert('成功', '分配用户成功！');
	        	                    			win.close();
	        	                    		} else {
	        	                    			Ext.Msg.alert('失败', '分配用户失败！');
	        	                    		}
	        	                    	},
	        	                    	failure : function(response, options) {
	        	                    		Ext.Msg.alert('错误', '服务器异常，请稍后分配！');
	        	                    	}
	        	                    });
	        	                }
	        	            }
	        	        }]
	        		});
	        		win = Ext.create('Ext.window.Window', {
	        			width : 400,
	        			height : 500,
	        			title : '选择用户',
	        			layout : 'fit',
	        			modal : true,
	        			items : [
	        				tree
	        			]
	        		});
	        		win.show();
	        		this.departmentusertreestore.getRootNode().removeAll();
	        		this.departmentusertreestore.load();
	        	}
	        }, {
	        	xtype : 'button',
	        	text : '分配权限',
	        	width : 80,
	        	scope : me,
	        	handler : function() {
	        		var records = grid.getSelectionModel().getSelection();
	        		if (records.length == 0) {
	        			Ext.Msg.alert('警告', '请选择一条角色数据！');
	        			return;
	        		}
	        		
	        		// 先要获取选中角色的permission
	        		var roleId = records[0].data['roleId'];
	        		me.storeparams["treeroleId"] = roleId; // 选中角色id
	        		me.rolepermissionstore.load();
	        		
	        		// 打开权限窗口匹配
					this.showPermissionForm(records[0]);
	        	}
	        }]
		});
		
		me.rolestore.loadPage(1);
		
		return grid;
	},
	
	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('sysrole');
		if (!win) {
			win = desktop.createWindow({
				id : 'sysrole',
				title : '角色管理',
				width : 700,
				height : 400,
				iconCls : 'notepad',
				animCollapse : false,
				border : false,
				hideMode : 'offsets',
				layout : 'fit',
				items : [
					this.createRoleGrid()
				]
			});
		}
		win.show();
		return win;
	}
});
