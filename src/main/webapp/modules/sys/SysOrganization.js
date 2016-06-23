
Ext.define('BatteryBusSystem.SysOrganization', {
	extend : 'Ext.ux.desktop.Module',

//	requires : [ 'Ext.data.TreeStore', 'Ext.tree.Panel', 'Ext.form.Panel', 'Ext.ux.form.searchfield_fix' ],
	
	id : 'sysorganization',

	init : function() {
		this.launcher = {
			text : '组织机构管理',
			iconCls : 'notepad',
			handler : this.createWindow,
			scope : this
		};
		
		var me = this;
		
		// 初始化store的额外参数
		me.storeparams = {};
		me.storeparams["departmentId"] = null; // 保存树节点点击的departmentId 
		me.storeparams["dropTargetDepartmentId"] = null; // 从用户列表拖动到部门树的目标部门Id
		me.storeparams["userId"] = null; // 选中用户的id
		
		// 初始化model
		Ext.define('BatteryBusSystem.SysOrganization.UserModel', {
			extend : 'Ext.data.Model',
			fields : [
			    'userId', 
			    'username', 
			    'loginname', 
			    'password', 
			    'departmentname',
			    'departmentId',
			    'createtime'
			]
		});
		
		Ext.define('BatteryBusSystem.SysOrganization.RoleModel', {
			extend : 'Ext.data.Model', 
			fields : [
				'roleId',
				'rolename',
				'roleremark',
				'createtime'
			]
		});
		Ext.define('BatteryBusSystem.SysOrganization.PermissionVoModel', {
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
		me.treestore = Ext.create('Ext.data.TreeStore', {
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/sysDepartmentController/queryDepartmenttree',
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
			sorters : [ {
				property : 'leaf',
				direction : 'ASC'
			}, {
				property : 'text',
				direction : 'ASC'
			} ]
		});
		
		me.userstore = Ext.create('Ext.data.Store', {
			pageSize : 10,
			model : 'BatteryBusSystem.SysOrganization.UserModel', 
			remoteSort : true, 
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/sysUserController/queryUserListByDepartment',
				actionMethods : {
//	                create : 'POST',
	                read   : 'POST' // by default GET
//	                update : 'POST',
//	                destroy: 'POST'
				},
				reader : {
					root : 'users', 
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
					var departmentId = me.storeparams["departmentId"];
					var newparams = {departmentId : departmentId};
					Ext.apply(this.proxy.extraParams, newparams);
				}
			}
		});
		
		me.userrolestore = Ext.create('Ext.data.Store', {
			model : 'BatteryBusSystem.SysOrganization.RoleModel',
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/sysRoleController/queryRoleListByUser',
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json'
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
					var userId = me.storeparams["userId"];
					var newparams = {userId : userId};
					Ext.apply(this.proxy.extraParams, newparams);
				}
			}
		});
		
		me.rolestore = Ext.create('Ext.data.Store', {
			model : 'BatteryBusSystem.SysOrganization.RoleModel',
			pageSize : 10, 
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/sysRoleController/queryRoleList', 
				actionMethods : {
	                read   : 'POST'
				},
				reader : {
					root : 'roles', 
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
					me.rolestore['baseGrid'].getSelectionModel().removeListener('selectionchange', me.roleGridSelModSelectionChange, me);
				},
				load : function(store, records, successful, operation, eOpts) {
					// 把选用的用户拥有的角色勾选到role grid上
					var selectioins = new Array();
					store.each(function (record) {
						me.userrolestore.each(function (recordCompare) {
							if (recordCompare.data['roleId'] == record.data['roleId']) {
								selectioins.push(record);
								return false;
							}
						});
					});
					me.rolestore['baseGrid'].getSelectionModel().select(selectioins, true, true);
					me.rolestore['baseGrid'].getSelectionModel().addListener('selectionchange', me.roleGridSelModSelectionChange, me);
				}
			}
		});
		
		me.userpermissionstore = Ext.create('Ext.data.Store', {
			model : 'BatteryBusSystem.SysOrganization.PermissionVoModel',
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/sysPermissionController/queryPermissionListByUser',
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json'
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
					var userId = me.storeparams["userId"];
					var newparams = {userId : userId};
					Ext.apply(this.proxy.extraParams, newparams);
				}
			}
		});
		
		me.permissionstore = Ext.create('Ext.data.Store', {
			pageSize : 10,
			model : 'BatteryBusSystem.SysOrganization.PermissionVoModel',
			remoteSort : true,
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/sysPermissionController/queryPermissionList',
				actionMethods : {
	                read   : 'POST'
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
			},
			listeners : {
				beforeload : function(store, operation, eOpts) {
					me.permissionstore['baseGrid'].getSelectionModel().removeListener('selectionchange', me.permissionGridSelModSelectionChange, me);
				},
				load : function(store, records, successful, operation, eOpts) {
					// 把选用的用户拥有的权限勾选到permission grid上
					var selectioins = new Array();
					store.each(function (record) {
						me.userpermissionstore.each(function (recordCompare) {
							if (recordCompare.data['permissionId'] == record.data['permissionId']) {
								selectioins.push(record);
								return false;
							}
						});
					});
					me.permissionstore['baseGrid'].getSelectionModel().select(selectioins, true, true);
					me.permissionstore['baseGrid'].getSelectionModel().addListener('selectionchange', me.permissionGridSelModSelectionChange, me);
				}
			}
		});
		
	},
	
	treestore : null, // 部门store
	userstore : null, // 用户store
	userrolestore : null, // 当前选中用户角色store
	rolestore : null, // 角色store
	userpermissionstore : null, // 当前选中用户权限store
	permissionstore : null, // 权限 store 各种类型权限
	storeparams : null, // store的额外参数

	roleGridSelModSelectionChange : function(own, selected, eOpts) {
		// selMod的 selectionchange 定义事件
		// scope 是 BatteryBusSystem.SysRole
		// 每次都要计算当前页，哪些被选了，哪些没被选中
		var me = this;

		// 增加
		Ext.Array.each(selected, function (record) {
			var compareRecord = me.userrolestore.findRecord("roleId", record.data['roleId']);
			if (!compareRecord) {
				// 创建一个新增的
				var role = Ext.create('BatteryBusSystem.SysOrganization.RoleModel', {
					roleId : record.data['roleId']
				});
				me.userrolestore.add(role);
			}
		})
		// 删除
		this.rolestore.each(function(record) {
			if (selected.indexOf(record) == -1) {
				// 没有被选中的，删除
				var compareRecord = me.userrolestore.findRecord("roleId", record.data['roleId']);
				if (compareRecord) 
					me.userrolestore.remove(compareRecord);
			}
		});		
	},
	
	permissionGridSelModSelectionChange : function(own, selected, eOpts) {
		// selMod的 selectionchange 定义事件
		// scope 是 BatteryBusSystem.SysRole
		// 每次都要计算当前页，哪些被选了，哪些没被选中
		var me = this;

		// 增加
		Ext.Array.each(selected, function (record) {
			var compareRecord = me.userpermissionstore.findRecord("permissionId", record.data['permissionId']);
			if (!compareRecord) {
				// 创建一个新增的
				var permission = Ext.create('BatteryBusSystem.SysOrganization.PermissionVoModel', {
					permissionId : record.data['permissionId']
				});
				me.userpermissionstore.add(permission);
			}
		})
		// 删除
		this.permissionstore.each(function(record) {
			if (selected.indexOf(record) == -1) {
				// 没有被选中的，删除
				var compareRecord = me.userpermissionstore.findRecord("permissionId", record.data['permissionId']);
				if (compareRecord) 
					me.userpermissionstore.remove(compareRecord);
			}
		});
	},
	
	showPermissionGrid : function(record) {
		var me = this;
		
		var win;
		var permissionGridSelMod = Ext.create('Ext.selection.CheckboxModel', {
			mode : 'SIMPLE',
			listeners : {
				scope : me, 
				selectionchange : me.permissionGridSelModSelectionChange
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
	        	text : '分配权限', 
	        	handler : function() {             
                    if (me.userpermissionstore.getCount() == 0) {
                    	Ext.Msg.alert('选择', '请选择分配的权限！');
                    	return;
                    }
                    var permissionIds = [];
                    me.userpermissionstore.each(function(rec) {
                    	permissionIds.push(rec.get('permissionId'));
                    });
                    var userId = record.data['userId'];
                    Ext.Ajax.request({
                    	url : '/busbatterysystem/web/security/sysUserController/updateuserpermissions/' + userId,
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
                    		var result = Ext.JSON.decode(response.responseText, true);
							if (result['filterflag']) {
								Ext.Msg.alert('抱歉', result['message']);
							} else {
								Ext.Msg.alert('抱歉', '服务器异常！');
							}
                    	}
                    });
	        	}
	        }, {
	        	xtype : 'button',
	        	width : 80,
	        	text : '置空权限', 
	        	handler : function() {      
	        		var result = Ext.Msg.confirm('置空权限', '您是否确认置空该用户的权限？', function(bn) {
						if (bn == 'yes') {
							var userId = record.data['userId'];
		                    Ext.Ajax.request({
		                    	url : '/busbatterysystem/web/security/sysUserController/resetuserpermissions/' + userId,
		                    	method : 'POST',
		                    	success : function(response, options) {
		                    		var result = response.responseText;
		                    		if (result == '"updateok"') {
		                    			Ext.Msg.alert('成功', '置空权限成功！');
		                    			win.close();
		                    		} else {
		                    			Ext.Msg.alert('失败', '置空权限失败！');
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
		
		me.permissionstore['baseGrid'] = grid; // TODO：这样会不会内存泄漏，要再议
		me.permissionstore.loadPage(1);
		
		win = Ext.create("Ext.window.Window", {
			width : 550,
			height : 400,
			title : "权限列表",
			layout : 'fit',
			modal : true,
			items : [
			   grid
			]
		});
		win.show();
	},
	
	showRoleGrid : function(record) {
		var me = this;
		
		var win;
		var roleGridSelMod = Ext.create('Ext.selection.CheckboxModel', {
			mode : 'SIMPLE',
			listeners : {
				scope : me, 
				selectionchange : me.roleGridSelModSelectionChange
			}
		});
		var grid = Ext.create('Ext.grid.Panel', {
			store : me.rolestore,
			border : false,
			columnLines : true,
			selModel : roleGridSelMod,
			columns : [{
				dataIndex : 'rolename',
				text : '角色名称'
			}, {
				dataIndex : 'roleremark', 
				text : '角色描述'
			}, {
				dataIndex : 'createtime',
				text : '创建时间',
				width : 180
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
	        	xtype:'searchfield_fix',
	        	labelWidth:50,
	        	store: me.rolestore 
	        }, {
	        	xtype : 'button',
	        	width : 80,
	        	text : '分配角色', 
	        	handler : function() {             
	        		if (me.userrolestore.getCount() == 0) {
                    	Ext.Msg.alert('选择', '请选择分配的角色！');
                    	return;
                    }
                    var roleIds = [];
                    me.userrolestore.each(function(rec) {
                    	roleIds.push(rec.get('roleId'));
                    });
                    var userId = record.data['userId'];
                    Ext.Ajax.request({
                    	url : '/busbatterysystem/web/security/sysUserController/updateuserroles/' + userId,
                    	method : 'POST',
                    	jsonData : Ext.JSON.encode(roleIds),
                    	success : function(response, options) {
                    		var result = response.responseText;
                    		if (result == '"updateok"') {
                    			Ext.Msg.alert('成功', '分配角色成功！');
                    			win.close();
                    		} else {
                    			Ext.Msg.alert('失败', '分配角色失败！');
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
	        }, {
	        	xtype : 'button',
	        	width : 80,
	        	text : '置空角色', 
	        	handler : function() {      
	        		var result = Ext.Msg.confirm('置空角色', '您是否确认置空该用户的角色？', function(bn) {
						if (bn == 'yes') {
							var userId = record.data['userId'];
		                    Ext.Ajax.request({
		                    	url : '/busbatterysystem/web/security/sysUserController/resetuserroles/' + userId,
		                    	method : 'POST',
		                    	success : function(response, options) {
		                    		var result = response.responseText;
		                    		if (result == '"updateok"') {
		                    			Ext.Msg.alert('成功', '置空角色成功！');
		                    			win.close();
		                    		} else {
		                    			Ext.Msg.alert('失败', '置空角色失败！');
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
		
		me.rolestore['baseGrid'] = grid; // TODO：这样会不会内存泄漏，要再议
		me.rolestore.loadPage(1);
		
		win = Ext.create("Ext.window.Window", {
			width : 550,
			height : 400,
			title : "角色列表",
			layout : 'fit',
			modal : true,
			items : [
			   grid
			]
		});
		win.show();
	},
	
	
	showUserForm : function(departmentId, record) {
		var me = this;
		
		var win;
		var form = Ext.create('Ext.form.Panel', {
			defaultType : 'textfield',
			items : [{
				id : 'username', 
				name : 'username',
				fieldLabel : '用户名',
				allowBlank : false
			}, {
				id : 'loginname', 
				name : 'loginname',
				fieldLabel : '登录名', 
				allowBlank : false
			}, {
				id : 'password',
				name : 'password',
				fieldLabel : '密码',
				inputType : 'password',
				allowBlank : false
			}, {
				id : 'departmentId',
				name : 'departmentId',
				xtype : 'hiddenfield',
				allowBlank : false
			}, {
				id : 'userId',
				name : 'userId', 
				xtype : 'hiddenfield'
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
						url = '/busbatterysystem/web/security/sysUserController/updateuser/' + departmentId;
					else 
						url = '/busbatterysystem/web/security/sysUserController/adduser/' + departmentId;
					f.submit({
						clientValidation : true,
						url : url,
						method : 'POST',
						success : function(form, action) {
							Ext.Msg.alert('成功', action.result.msg);
							win.close();
							// 当用户右击部门的时候，是否改变userstore对应的departmentId的值
							// user case 如下：
							// 1、当用户先点击部门，然后右击该部门，添加用户，成功后直接 userstore.load()，没问题
							// 2、用户右击一个未被选中的部门，添加用户，成功后直接 userstore.load()，显示的是选中部门的用户
							//    此时可以使用 document.getElementById('departmentId').value = parentid，然后load，显示的是右击部门的用户
							//    但是这个右击的部门视觉上没有被选中，可能引起误会，
							//    所以是让右击的部门被选中（还是其他提示方法），还是只允许选中的部门可以右击菜单（这个似乎比较合理），
							//    讨论中。。。。。。
							
							me.userstore.load();
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
		
		if (record)
			form.getForm().setValues(record.data);
		
		win = Ext.create('Ext.window.Window', {
			title : record ? '添加用户' : '更新用户',
			width : 300,
			height : 300,
			layout : 'fit',
			items : [form],
			modal : true
		});
		win.show();
	},
	
	createTreePanel : function() {
		var me = this;
		
		var treepanel = Ext.create('Ext.tree.Panel', {
			store : me.treestore,
			rootVisible : false, // 隐藏根节点，视觉上相当于有多个根节点，再议
			useArrows : true,
			frame : true,
			title : '部门树',
			region : 'west',
			width : 250,
			viewConfig : {
				listeners : {
					render : function(tree) {
						var dropTarget = Ext.create('Ext.dd.DropTarget', tree.el, {
							ddGroup : 'gridtotree', 
							copy : false, 
							notifyDrop : function(dragSource, event, data) {
								var userids = [];
								for (var i = 0; i < data.records.length; i++) 
									userids.push(data.records[i].data['userId']);
								var departmentId = me.storeparams["dropTargetDepartmentId"];
								Ext.Ajax.request({
									url : '/busbatterysystem/web/security/sysUserController/updataUsersDepart/' + departmentId, 
									method : 'POST',
									jsonData : Ext.JSON.encode(userids),
									success : function(response, options) {		
										var result = response.responseText;
										if (result == '"updateok"') {
											me.userstore.load();
										} else {
											Ext.Msg.alert('错误', '抱歉，更新用户所属部门失败！');
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
								
								return true;
							}
						});
					}
				}
			},
			listeners : {
				itemmouseenter : function(view, record, item, index, e, eOpts) {
					// 用户用户拖拽，确认用户拖拽到哪个部门树哪个节点
					me.storeparams["dropTargetDepartmentId"] = record.data.id;
				},
				itemclick : function(view, record, item, index, e, eOpts) {
					var departmentId = record.data.id;
					me.storeparams["departmentId"] = departmentId;
					me.userstore.load();
				},
				itemcontextmenu : function(view, record, item, index, e, eOpts) {
					// 让浏览器右键事件失效，方便启用ext 的右键菜单
					e.preventDefault();
					e.stopEvent();
					// 创建菜单
					var node = Ext.create('Ext.menu.Menu', {
						items : [{
							text : '添加部门',
							handler : function() {
								var parentId = record.data.id;
								Ext.Msg.prompt('添加部门', '请输入部门名称：', function(bn, txt) {
									if (bn == 'ok') {
										if (txt == '') {
											Ext.Msg.alert('错误', '请输入部门名称！');
										} else {
											var sysdepartment = {};
											sysdepartment["departmentname"] = txt;
											sysdepartment["departmentremark"] = txt;
											Ext.Ajax.request({
												url : '/busbatterysystem/web/security/sysDepartmentController/adddepartment/' + parentId,
												method : 'POST',
												jsonData : Ext.JSON.encode(sysdepartment),
												success : function(response, options) {
													Ext.Msg.alert('恭喜', '添加部门成功！');
													me.treestore.getRootNode().removeAll();
													me.treestore.load();
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
									}
								});
							}
						}, {
							text : '修改部门',
							handler : function() {
								var departmentId = record.data.id;
								var text = record.data.text;
								Ext.Msg.prompt('修改部门', '请输入部门名称：', function(bn, txt){
									if (bn == 'ok') {
										if (txt == '') {
											Ext.Msg.alert('错误', '请输入部门名称！');
										} else {
											var sysdepartment = {};
											sysdepartment["departmentId"] = departmentId;
											sysdepartment["departmentname"] = txt;
											Ext.Ajax.request({
												url : '/busbatterysystem/web/security/sysDepartmentController/updatedepartment',
												method : 'POST',
												jsonData : Ext.JSON.encode(sysdepartment),
												success : function(response, options) {
													Ext.Msg.alert('恭喜', '修改部门成功！');
													me.treestore.load();
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
									}
								});
							}
						}, {
							text : '删除部门', 
							handler : function() {
								var departmentId = record.data.id;
								var result = Ext.Msg.confirm('删除部门', '您是否确认要删除部门？', function(bn) {
									if (bn == 'yes') {
										var sysdepartment = {};
										sysdepartment["departmentId"] = departmentId;
										Ext.Ajax.request({
											url : '/busbatterysystem/web/security/sysDepartmentController/invaliddepartment',
											method : 'POST',
											jsonData : Ext.JSON.encode(sysdepartment),
											success : function(response, options) {
												var result = response.responseText;
												if (result == '"invalidok"') {
													me.treestore.load();
												} else if (result == '"invalidmore"') {
													Ext.Msg.alert('抱歉', '当前部门有子部门，不能删除！');
												} else {
													Ext.Msg.alert('抱歉', '服务器错误，请稍后添加！');
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
						}, {
							xtype : 'menuseparator'
						}, {
							text : '添加用户',
							handler : function() {
								var departmentId = record.data.id;
								me.showUserForm(departmentId);
							}
						}]
					});
					// 让菜单展现
					node.showAt(e.getXY());
				}
			}
		});
		return treepanel;
	},
	
	createUserPanel : function() {
		var me = this;
		
		var grid = Ext.create('Ext.grid.Panel', {
			width : 540, 
			height : 350, 
			store : me.userstore, 
			selModel : Ext.create('Ext.selection.CheckboxModel', {mode : 'SIMPLE'}),
			border : false, 
			columnLines : true, 
//			disableSelection : false,
			region : 'center',
			viewConfig : {
				plugins : [
					Ext.create('Ext.grid.plugin.DragDrop', {
						ddGroup : 'gridtotree', 
						enableDrop : true
					})
				]
			},
			columns : [{
				text : '用户id(hidden)', 
				dataIndex : 'userId', 
				hidden : true
			}, {
				text : '用户名', 
				dataIndex : 'username', 
				sortable : false, 
				anchor : "30%", 
				editor : {
					allowBlank : false
				}
			}, {
				text : '登录名',
				dataIndex : 'loginname', 
				sortable : false, 
				anchor : "30%", 
				editor : {
					allowBlank : false
				}
			}, {
				text : '部门',
				dataIndex : 'departmentname', 
				sortable : false, 
				anchor : "30%"
			}, {
				text : '创建时间',
				dataIndex : 'createtime',
				sortable : false,
				width : 180
			}], 
			bbar : Ext.create('Ext.PagingToolbar', {
				store : me.userstore, 
				displayInfo : true, 
				displayMsg : '当前显示第{0}条 至 {1}条记录，共{2}条记录',
				emptyMsg : '暂无可用数据'
			}), 
       		tbar:[{
	        	width:300,
	        	fieldLabel:'搜素',
	        	xtype:'searchfield_fix',
	        	labelWidth:50, 
	        	store : me.userstore
	        }, {
	        	text : '修改用户', 
	        	xtype : 'button',
	        	width : 80,
	        	handler : function() {
	        		var records = grid.getSelectionModel().getSelection();
	        		if (records.length == 0) {
	        			Ext.Msg.alert('警告', '请选择需要修改的用户！');
	        			return;
	        		} else if (records.length > 1) {
	        			Ext.Msg.alert('警告', '只能选择一条修改的数据！');
	        			return;
	        		}
	        		var departmentId = records[0].data.departmentId;
					me.showUserForm(departmentId, records[0]);
	        	}
	        }, {
	        	text : '删除用户',
	        	xtype : 'button',
	        	width : 80, 
	        	handler : function() {
	        		var records = grid.getSelectionModel().getSelection();
	        		if (records.length == 0) 
	        			Ext.Msg.alert('选择', '请选择需要删除的记录！');
	        		else {
	        			Ext.Msg.confirm('确认', '请问您确认删除用户吗？', function(bt) {
		        			if (bt == 'yes') {
		        				var userids = [];
								for (var i = 0; i < records.length; i++) 
									userids.push(records[i].data['userId']);
			        			Ext.Ajax.request({
			        				url : '/busbatterysystem/web/security/sysUserController/invalidusers',
			        				method : "POST",
			        				jsonData : Ext.JSON.encode(userids),
			        				success : function(response, options) {
										var result = response.responseText;
										if (result == '"invalidok"') {
											Ext.Msg.alert('成功', '删除用户成功！');
											me.userstore.load();
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
	        	}
	        }, {
	        	text : '分配角色', 
	        	xtype : 'button',
	        	width : 80,
	        	handler : function() {
	        		var records = grid.getSelectionModel().getSelection();
	        		if (records.length == 0) {
	        			Ext.Msg.alert('警告', '请选择一条用户数据！');
	        			return;
	        		} else if (records.length > 1) {
	        			Ext.Msg.alert('警告', '只能选择一条用户数据！');
	        			return;
	        		}
	        		
	        		// 先要获取选中用户的permission
	        		var userId = records[0].data['userId'];
	        		me.storeparams["userId"] = userId; // 选中用户id
	        		me.userrolestore.load();
	        		
	        		// 打开权限窗口匹配
					me.showRoleGrid(records[0]);
	        	}
	        }, {
	        	text : '分配权限',
	        	xtype : 'button',
	        	width : 80,
	        	handler : function() {
	        		var records = grid.getSelectionModel().getSelection();
	        		if (records.length == 0) {
	        			Ext.Msg.alert('警告', '请选择一条用户数据！');
	        			return;
	        		} else if (records.length > 1) {
	        			Ext.Msg.alert('警告', '只能选择一条用户数据！');
	        			return;
	        		}
	        		
	        		// 先要获取选中用户的permission
	        		var userId = records[0].data['userId'];
	        		me.storeparams["userId"] = userId; // 选中用户id
	        		me.userpermissionstore.load();
	        		
	        		// 打开权限窗口匹配
					me.showPermissionGrid(records[0]);
	        	}
	        }, {
	        	text : '重置身份',
	        	xtype : 'button',
	        	width : 80,
	        	handler : function() {
	        		var records = grid.getSelectionModel().getSelection();
	        		if (records.length == 0) 
	        			Ext.Msg.alert('选择', '请选择需要修改的记录！');
	        		else {
	        			Ext.Msg.confirm('确认', '请问您确认重置用户身份信息吗？', function(bt) {
		        			if (bt == 'yes') {
		        				var userids = [];
								for (var i = 0; i < records.length; i++) 
									userids.push(records[i].data['userId']);
			        			Ext.Ajax.request({
			        				url : '/busbatterysystem/web/security/sysMC/resetAuthenticationInfos',
			        				method : "POST",
			        				jsonData : Ext.JSON.encode(userids),
			        				success : function(response, options) {
										var result = response.responseText;
										if (result == '"updateok"') {
											Ext.Msg.alert('成功', '重置身份成功！');
										} else {
											Ext.Msg.alert('抱歉', '服务器错误，请稍后重置！');
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
	        	}
	        }, {
	        	text : '重置授权',
	        	xtype : 'button',
	        	width : 80,
	        	handler : function() {
	        		var records = grid.getSelectionModel().getSelection();
	        		if (records.length == 0) 
	        			Ext.Msg.alert('选择', '请选择需要修改的记录！');
	        		else {
	        			Ext.Msg.confirm('确认', '请问您确认重置用户授权信息吗？', function(bt) {
		        			if (bt == 'yes') {
		        				var userids = [];
								for (var i = 0; i < records.length; i++) 
									userids.push(records[i].data['userId']);
			        			Ext.Ajax.request({
			        				url : '/busbatterysystem/web/security/sysMC/resetAuthorizationInfos',
			        				method : "POST",
			        				jsonData : Ext.JSON.encode(userids),
			        				success : function(response, options) {
										var result = response.responseText;
										if (result == '"updateok"') {
											Ext.Msg.alert('成功', '重置授权成功！');
										} else {
											Ext.Msg.alert('抱歉', '服务器错误，请稍后重置！');
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
	        	}
	        }]
		});

		me.userstore.loadPage(1);
		return grid;	
	},
	
	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('sysorganization');
		if (!win) {
			win = desktop.createWindow({
				id : 'sysorganization',
				title : '组织机构管理',
				width : 1200,
				height : 400,
				iconCls : 'notepad',
				animCollapse : false,
				border : false,
				hideMode : 'offsets',
			    layout : 'border',
				items : [
					this.createTreePanel(),
					this.createUserPanel()
				]
			});
		}
		win.show();
		return win;
	}
});
