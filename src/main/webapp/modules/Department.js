var store;
var userstore;
var droptarget;

Ext.define('BatteryBusSystem.Department', {
	extend : 'Ext.ux.desktop.Module',

//	requires : [ 'Ext.data.TreeStore', 'Ext.tree.Panel', 'Ext.form.Panel', 'Ext.ux.form.SearchField' ],
	requires : [ 'Ext.ux.form.SearchField' ], 
	
	id : 'department',

	init : function() {
		this.launcher = {
			text : '组织机构管理管理bak',
			iconCls : 'notepad',
			handler : this.createWindow,
			scope : this
		}
	},

	createTreePanel : function() {
		store = Ext.create('Ext.data.TreeStore', {
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/queryDeparttree.do'
			},
			sorters : [ {
				property : 'leaf',
				direction : 'ASC'
			}, {
				property : 'text',
				direction : 'ASC'
			} ]
		});

		var treepanel = Ext.create('Ext.tree.Panel', {
			store : store,
			rootVisible : false,
			useArrows : true,
			frame : true,
			title : '部门树',
			width : 250,
			height : 350,
			viewConfig : {
				listeners : {
					render : function(tree) {
						var dropTarget = Ext.create('Ext.dd.DropTarget', tree.el, {
							ddGroup : 'gridtotree', 
							copy : false, 
							notifyDrop : function(dragSource, event, data) {
								var ids = [];
								for (var i = 0; i < data.records.length; i++) 
									ids.push("'" + data.records[i].data['flowuserId'] + "'");
								Ext.Ajax.request({
									url : '/busbatterysystem/updataUsersDepart.do', 
									method : 'POST',
									params : {
										ids : ids.join(","),
										droptarget : droptarget
									}, 
									success : function(response, options) {		
										var result = response.responseText;
										if (result == 'updateok') {
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
					droptarget = record.data.id;
				},
				
				itemclick : function(view, record, item, index, e, eOpts) {
					var parentid = record.data.id;
					document.getElementById("departmentId").value = parentid;
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
								var parentid = record.data.id;
								Ext.Msg.prompt('添加部门', '请输入部门名称：', function(bn, txt) {
									if (bn == 'ok') {
										if (txt == '') {
											Ext.Msg.alert('错误', '请输入部门名称！');
										} else {
											Ext.Ajax.request({
												url : '/busbatterysystem/adddepartment.do',
												method : 'POST',
												params : {
													departmentname : txt,
													parentId : parentid
												}, 
												success : function(response, options) {
													var result = response.responseText;
													if (result == 'addok') {
														Ext.Msg.alert('恭喜', '添加部门成功！');
														store.load();
													} else {
														Ext.Msg.alert('抱歉', '添加失败，请稍后再试！');
													}
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
								var parentid = record.data.id;
								var text = record.data.text;
								Ext.Msg.prompt('修改部门', '请输入部门名称：', function(bn, txt){
									if (bn == 'ok') {
										if (txt == '') {
											Ext.Msg.alert('错误', '请输入部门名称！');
										} else {
											if (txt != text) {
												Ext.Ajax.request({
													url : '/busbatterysystem/updatedepartment.do',
													method : 'POST',
													params : {
														departmentname : txt,
														parentId : parentid
													}, 
													success : function(response, options) {
														var result = response.responseText;
														if (result == 'updateok') {
															Ext.Msg.alert('恭喜', '修改部门成功！');
															store.load();
														} else {
															Ext.Msg.alert('抱歉', '修改失败，请稍后再试！');
														}
													},
													failure : function(response, options) {
														Ext.Msg.alert('抱歉', '服务器错误，请稍后添加！');
													}
												});
											}
										}
									}
								});
							}
						}, {
							text : '删除部门', 
							handler : function() {
								var parentid = record.data.id;
								var result = Ext.Msg.confirm('删除部门', '您是否确认要删除部门？', function(bn) {
									if (bn == 'yes') {
										Ext.Ajax.request({
											url : '/busbatterysystem/deleteDepartment.do',
											method : 'POST',
											params : {
												id : parentid
											}, 
											success : function(response, options) {
												var result = response.responseText;
												if (result == 'deleteok') {
													store.load();
												} else if (result == 'deletemore') {
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
								var parentid = record.data.id;
								var win;
								var form = Ext.create('Ext.form.Panel', {
									defaultType : 'textfield',
									items : [{
										id : 'flowusername', 
										name : 'flowusername',
										fieldLabel : '用户名',
										allowBlank : false
									}, {
										id : 'flowloginname', 
										name : 'flowloginname',
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
											var flowusername = f.findField('flowusername').getValue();
											var flowloginname = f.findField('flowloginname').getValue();
											Ext.Ajax.request({
												url : '/busbatterysystem/addflowuser.do',
												method : 'POST',
												params : {
													departmentId : parentid, 
													flowusername : flowusername,
													flowloginname : flowloginname
												}, 
												success : function(response, options) {
													var result = response.responseText;
													if (result == "addok") {
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
									title : '添加用户',
									width : 300,
									height : 300,
									layout : 'fit',
									items : [form],
									modal : true
								});
								win.show();
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
		Ext.define('UserModel', {
			extend : 'Ext.data.Model',
			fields : [
			    'flowuserId', 
			    'flowusername', 
			    'flowloginname', 
			    'departmentname',
			    'flowrolename',
			    {name : 'flowroleIdCombox', mapping : 'flowrolename'},
			    'flowroleId'

			]
		});
		userstore = Ext.create('Ext.data.Store', {
			pageSize : 10,
			model : 'UserModel', 
			remoteSort : true, 
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/queryUserListByDepartment.do',
				reader : {
					root : 'users', 
					totalProperty : 'totalCount'
				}
			}, 
			listeners : {
				beforeload : function(store, operation, eOpts) {
					var departmentId = document.getElementById('departmentId').value;
					var newparams = {departmentId : departmentId};
					Ext.apply(userstore.proxy.extraParams, newparams);
				}
			}
		});
		
		// 定义修改组件
		var rowEditing = Ext.create("Ext.grid.plugin.RowEditing", {
			clicksToMoveEditor : 1,
			autoCancel : false, 
			listeners : {
				edit : function(editor , e, eOpts) {
					var record = editor.record;
					var flowroleId_update = "";
					if (record.isModified('flowroleIdCombox')) {
						flowroleId_update = record.get('flowroleIdCombox');
					} else {
						flowroleId_update = record.get('flowroleId');
					}
					
					var newValues = editor.newValues;
					var originalValues = editor.originalValues;
					
					// edit应该有api支持确认新值与旧值差异比较，重构的时候再改
					if (newValues['flowusername'] != originalValues['flowusername'] || 
						newValues['flowloginname'] != originalValues['flowloginname'] || 
						record.isModified('flowroleIdCombox'))
						Ext.Ajax.request({
							url : '/busbatterysystem/updateuser.do', 
							method : 'POST',
							params : {
								flowuserId : newValues['flowuserId'],
								flowusername : newValues['flowusername'],
								flowloginname : newValues['flowloginname'],
								flowroleId : flowroleId_update
							},
							success : function(response, options) {
								var result = response.responseText;
								if (result == 'updateok') {
									Ext.Msg.alert('成功', '修改用户成功！');
									userstore.load();
								} else {
									Ext.Msg.alert('抱歉', '服务器错误，请稍后添加！');
								}
							},
							failure : function(response, options) {
								Ext.Msg.alert('抱歉', '服务器错误，请稍后添加！');
							}
						});
				}, 
				validateedit : function(editor, e) {
					// 在单元格被修改之后触发，但是值还未插入record对象
//					  var myTargetRow = 6;
//
//					  if (e.rowIdx == myTargetRow) {
//					    e.cancel = true;
//					    e.record.data[e.field] = e.value;
//					  }
				}
			}
		});
		
		
		var selModel = Ext.create('Ext.selection.CheckboxModel', {
			
		});
		
		comstore = Ext.create("Ext.data.Store", {
			singleton : true,
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/queryAllRole.do',
				actionMethods : 'post',
				reader : {
					root : 'roles',
					totalProperty : 'totalCount'
				}
			},
			fields : ['flowroleId', 'flowrolename'],
			autoLoad : true
		});
		
		var grid = Ext.create('Ext.grid.Panel', {
			width : 540, 
			height : 350, 
			store : userstore, 
			selModel : selModel,
			border : false, 
			columnLines : true, 
			disableSelection : false,
			plugins : [rowEditing],
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
				dataIndex : 'flowuserId', 
				flex : 1,
				hidden : true
			}, {
				text : '用户名', 
				dataIndex : 'flowusername', 
				sortable : false, 
				anchor : "30%", 
				editor : {
					allowBlank : false
				}
			}, {
				text : '登录名',
				dataIndex : 'flowloginname', 
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
				text : "角色id(hidden)",
				dataIndex : 'flowroleId',
				hidden : true
			}, {
				text : '角色',
				dataIndex : 'flowroleIdCombox', 
				sortable : false, 
				anchor : "30%",
				editor : {
					xtype : 'combobox',
					queryMode : 'local',
					empty : '请选择',
					displayField : 'flowrolename',
//					pageSize : 10, // 分页暂时不用
					valueField : 'flowroleId',
					store : comstore
				},
				renderer : function(value, metadata, record) {
					var index = comstore.findExact('flowroleId', value);
					if (index != -1) {
//						record.set('flowroleId', value); // 这里如果这样，会引起无限循环，以后解决
						return comstore.getAt(index).data['flowrolename'];
					}
					return value;
				}
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
	        	store: userstore 
	        }, {
	        	text : '删除',
	        	xtype : 'button',
	        	width : 50, 
	        	handler : function() {
	        		var record = grid.getSelectionModel().getSelection();
	        		if (record.length == 0) 
	        			Ext.Msg.alert('选择', '请选择需要删除的记录！');
	        		else {
	        			var ids = [];
	        			for (var i = 0; i < record.length; i++) 
	        				ids.push("'" + record[i].get("flowuserId") + "'");
	        			Ext.Ajax.request({
	        				url : '/busbatterysystem/deleteusers.do',
	        				method : "POST",
	        				params : {
	        					ids : ids.join(',')
	        				},
	        				success : function(response, options) {
								var result = response.responseText;
								if (result == 'deleteok') {
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
	        	}
	        }, {
	        	text : '角色置空',
	        	xtype : 'button',
	        	width : 80, 
	        	handler : function() {
	        		var records = grid.getSelectionModel().getSelection();
	        		if (records.length == 0) 
	        			Ext.Msg.alert('选择', '请选择需要角色置空的用户！');
	        		else {
	        			var ids = [];
	        			Ext.Array.each(records, function(rec) {
	        				ids.push("'" + rec.get('flowuserId') + "'");
	        			});
	        			
	        			Ext.Ajax.request({
	        				url : '/busbatterysystem/resetRole.do',
	        				method : "POST",
	        				params : {
	        					ids : ids.join(',')
	        				},
	        				success : function(response, options) {
								var result = response.responseText;
								if (result == 'updateok') {
									userstore.load();
								} else {
									Ext.Msg.alert('抱歉', '重置失败，请稍后再试！');
								}
							},
							failure : function(response, options) {
								Ext.Msg.alert('抱歉', '服务器错误，请稍后再试！');
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
	        		if (records.length == 0) 
	        			Ext.Msg.alert('选择', '请选择需要分配角色的用户！');
	        		else {
	        			var ids = [];
	        			Ext.Array.each(records, function(rec) {
	        				ids.push("'" + rec.get("flowuserId") + "'");
	        			});
	        			
	        			Ext.define('RoleModel',{
							extend:'Ext.data.Model',
							fields:[
								'flowroleId',
								'flowrolename',
								'flowroleremark'
							]
						});
						var rolestore=Ext.create('Ext.data.Store',{
							model:'RoleModel',
							pageSize:10,
							proxy:{
								type:'ajax',
								url:'/busbatterysystem/queryRoleList.do',
								reader:{
									root:'roles',
									totalProperty:'totalCount'
								}
							}
						});
						var rolegrid=Ext.create('Ext.grid.Panel',{
							store:rolestore,
							border: false,
							columnLines: true, 
							disableSelection: false,
							columns:[{
								id:'flowroleId',
								dataIndex:'flowroleId',
								hidden:true
							},{
								name:'flowrolename',
								dataIndex:'flowrolename',
								text:'角色名称'
							},{
								name:'flowroleremark',
								dataIndex:'flowroleremark',
								text:'角色描述'
							}],
							bbar: Ext.create('Ext.PagingToolbar', {
					            store: rolestore,
					            displayInfo: true,
					            displayMsg: '当前显示第 {0}条 至 {1}条记录 ，共 {2}条记录',
					            emptyMsg: "暂无可用数据"
				       		}),
				       		tbar:[{
					        	width:240,
					        	fieldLabel:'搜素',
					        	xtype:'searchfield',
					        	labelWidth:50,
					        	store: rolestore 
					        },{
					        	xtype:'button',
					        	text:'确定分配',
					        	width:80,
					        	handler:function(){
					        		var records=rolegrid.getSelectionModel().getSelection();
					        		if(records.length==0){
					        			Ext.Msg.alert('警告','请选择一个需要分配用户的角色！');
					        			return;
					        		}
					        		var flowroleId=records[0].get('flowroleId');
					        		Ext.Ajax.request({
					        			url:'/busbatterysystem/updateuserRole.do',
					        			method:'POST',
				                    	params:{
				                    		ids:ids.join(","),
				                    		flowroleId:flowroleId
				                    	},
				                    	success:function(response,options){
				                    		if(response.responseText=='updateok'){
				                    			Ext.Msg.alert('成功','分配角色成功！');
				                    			userstore.load();
				                    			rolewin.close();
				                    		}else{
				                    			Ext.Msg.alert('失败','分配角色失败！');
				                    		}
				                    	},
				                    	failure:function(response,options){
				                    		Ext.Msg.alert('错误','服务器异常，请稍后分配！');
				                    	}
					        		});
					        	}
					        }]
					    });
					    rolestore.loadPage(1);
					    rolewin=Ext.create('Ext.window.Window',{
							width:400,
							height:400,
							title:'选择角色',
							layout:'fit',
							items:[rolegrid]
						});
						rolewin.show();
	        		}
	        	}
	        }]
		});

		userstore.loadPage(1);
		
		return grid;	
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('department');
		if (!win) {
			document.getElementById('departmentId').value = "";
			
			win = desktop.createWindow({
				id : 'department',
				title : '部门管理',
				width : 800,
				height : 400,
				iconCls : 'notepad',
				animCollapse : false,
				border : false,
				hideMode : 'offsets',
				layout : {
					type : 'table',
					columns : 2
				},
				items : [ {
					items : [ this.createTreePanel() ]
				}, {
					items : [ this.createUserPanel() ]
				} ]
			});
		}
		win.show();
		return win;
	}
});
