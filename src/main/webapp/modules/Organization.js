
Ext.define('BatteryBusSystem.Organization', {
	extend : 'Ext.ux.desktop.Module',

//	requires : [ 'Ext.data.TreeStore', 'Ext.tree.Panel', 'Ext.form.Panel', 'Ext.ux.form.SearchField' ],
	requires : [ 'Ext.ux.form.SearchField' ], 
	
	id : 'organization',

	init : function() {
		this.launcher = {
			text : '组织机构管理',
			iconCls : 'notepad',
			handler : this.createWindow,
			scope : this
		};
		
		// 初始化store的额外参数
		this.storeparams = {};
		this.storeparams["departmentId"] = null; // 保存树节点点击的departmentId 
		this.storeparams["dropTargetDepartmentId"] = null; // 从用户列表拖动到部门树的目标部门Id
		
		// 初始化model
		Ext.define('UserModel', {
			extend : 'Ext.data.Model',
			fields : [
			    'userId', 
			    'username', 
			    'loginname', 
			    'departmentname',
			    'rolename'
			]
		});
		
		
		// 初始化store
		this.departmenttreestore = Ext.create('Ext.data.TreeStore', {
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/sysDepartmentController/queryDepartmenttree'
			},
			sorters : [ {
				property : 'leaf',
				direction : 'ASC'
			}, {
				property : 'text',
				direction : 'ASC'
			} ]
		});
		
		var storeparams_ = this.storeparams;
		this.userstore = Ext.create('Ext.data.Store', {
			pageSize : 10,
			model : 'UserModel', 
			remoteSort : true, 
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/web/security/SysUserController/queryUserListByDepartment',
				actionMethods : {
//	                create : 'POST',
	                read   : 'POST', // by default GET
//	                update : 'POST',
//	                destroy: 'POST'
				},
				reader : {
					root : 'users', 
					totalProperty : 'totalCount'
				}
			}, 
			listeners : {
				beforeload : function(store, operation, eOpts) {
					var departmentId = storeparams_["departmentId"];
					var newparams = {departmentId : departmentId};
					Ext.apply(this.proxy.extraParams, newparams);
				}
			}
		});
	},
	
	departmenttreestore : null, // 部门store
	userstore : null, // 用户store
	rolestore : null, // 角色store
	storeparams : null, // store的额外参数

	showUserForm : function(title, record, userstore) {
		var departmentId = record.data.id;
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
			}],
			buttons : [{
				text : '重置', 
				handler : function() {
					this.up('form').getForm().reset();
				}
			}, {
				text : '添加',
				handler : function() {
					var f = this.up('form').getForm();
					
					var sysuser = {};
					sysuser["username"] = f.findField('username').getValue();
					sysuser["loginname"] = f.findField('loginname').getValue();
					
					Ext.Ajax.request({
						url : '/busbatterysystem/web/security/SysUserController/adduser/' + departmentId,
						method : 'POST',
						jsonData : Ext.JSON.encode(sysuser),
						success : function(response, options) {
							var result = response.responseText;
							if (result == '"addok"') {
								Ext.Msg.alert('恭喜', '添加用户成功！');
								win.close();
								
								// 当用户右击部门的时候，是否改变userstore对应的departmentId的值
								// user case 如下：
								// 1、当用户先点击部门，然后右击该部门，添加用户，成功后直接 userstore.load()，没问题
								// 2、用户右击一个未被选中的部门，添加用户，成功后直接 userstore.load()，显示的是选中部门的用户
								//    此时可以使用 document.getElementById('departmentId').value = parentid，然后load，显示的是右击部门的用户
								//    但是这个右击的部门视觉上没有被选中，可能引起误会，
								//    所以是让右击的部门被选中（还是其他提示方法），还是只允许选中的部门可以右击菜单（这个似乎比较合理），
								//    讨论中。。。。。。
								
								userstore.load();
							}
						},
						failure : function(response, options) {
							Ext.Msg.alert('抱歉', '服务器错误，请稍后添加！');
						}
					});
				}
			}]
		});
		win = Ext.create('Ext.window.Window', {
			title : title,
			width : 300,
			height : 300,
			layout : 'fit',
			items : [form],
			modal : true
		});
		win.show();
	},
	
	createTreePanel : function() {
		var treestore = this.departmenttreestore;
		var userstore = this.userstore;
		var storeparams = this.storeparams;
		
		var formFun = this.showUserForm;
		
		var treepanel = Ext.create('Ext.tree.Panel', {
			store : treestore,
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
								var departmentId = storeparams["dropTargetDepartmentId"];
								Ext.Ajax.request({
									url : '/busbatterysystem/web/security/SysUserController/updataUsersDepart/' + departmentId, 
									method : 'POST',
									jsonData : Ext.JSON.encode(userids),
									success : function(response, options) {		
										var result = response.responseText;
										if (result == '"updateok"') {
											userstore.load();
										} else {
											Ext.Msg.alert('错误', '抱歉，更新用户所属部门失败！');
										}
									},
									failure : function(response, options) {
										Ext.Msg.alert('抱歉', '服务器错误，请稍后更新！');
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
					storeparams["dropTargetDepartmentId"] = record.data.id;
				},
				itemclick : function(view, record, item, index, e, eOpts) {
					var departmentId = record.data.id;
					storeparams["departmentId"] = departmentId;
					userstore.load();
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
													treestore.load();
												},
												failure : function(response, options) {
													Ext.Msg.alert('抱歉', '服务器错误，请稍后添加！');
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
													treestore.load();
												},
												failure : function(response, options) {
													Ext.Msg.alert('抱歉', '服务器错误，请稍后添加！');
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
													treestore.load();
												} else if (result == '"invalidmore"') {
													Ext.Msg.alert('抱歉', '当前部门有子部门，不能删除！');
												} else {
													Ext.Msg.alert('抱歉', '服务器错误，请稍后添加！');
												}
											},
											failure : function(response, options) {
												Ext.Msg.alert('抱歉', '服务器错误，请稍后添加！');
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
								formFun('添加用户', record, userstore);
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
		var userstore = this.userstore;
		
		var grid = Ext.create('Ext.grid.Panel', {
			width : 540, 
			height : 350, 
			store : userstore, 
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
			}], 
			bbar : Ext.create('Ext.PagingToolbar', {
				store : userstore, 
				displayInfo : true, 
				displayMsg : '当前显示第{0}条 至 {1}条记录，共{2}条记录',
				emptyMsg : '暂无可用数据'
			}), 
       		tbar:[{
	        	width:300,
	        	fieldLabel:'搜素',
	        	xtype:'searchfield',
	        	labelWidth:50, 
	        	store : userstore
	        }, {
	        	text : '删除',
	        	xtype : 'button',
	        	width : 50, 
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
			        				url : '/busbatterysystem/web/security/SysUserController/invalidusers',
			        				method : "POST",
			        				jsonData : Ext.JSON.encode(userids),
			        				success : function(response, options) {
										var result = response.responseText;
										if (result == '"invalidok"') {
											Ext.Msg.alert('成功', '删除用户成功！');
											userstore.load();
										} else {
											Ext.Msg.alert('抱歉', '服务器错误，请稍后删除！');
										}
									},
									failure : function(response, options) {
										Ext.Msg.alert('抱歉', '服务器错误，请稍后删除！');
									}
			        			});
		        			}
	        			});
	        		}
	        	}
	        }]
		});

		userstore.loadPage(1);
		return grid;	
	},
	
	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('organization');
		if (!win) {
			win = desktop.createWindow({
				id : 'organization',
				title : '组织机构管理',
				width : 800,
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
