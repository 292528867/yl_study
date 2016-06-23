var store;

Ext.define('BatteryBusSystem.FlowRole', {
	extend : 'Ext.ux.desktop.Module',

	requires : [
		
	], 
	
	id : 'flowrole',

	init : function() {
		this.launcher = {
			text : '角色管理',
			iconCls : 'notepad',
			handler : this.createWindow,
			scope : this
		}
	},
	
	addRole : function() {
		var win;
		var form = Ext.create("Ext.form.Panel", {
			defaultType : 'textfield',
			frame : true, // 设置为true时可以为panel添加背景色、圆角边框等
			items : [{
				id : 'flowrolename',
				name : 'flowrolename',
				fieldLabel : '角色名称', 
				anchor : '100%',
				allowBlank : false
			}, {
				id : 'flowroleremark',
				name : 'flowroleremark',
				fieldLabel : '角色描述',
				anchor : '100% 60%',
				xtype : 'textarea'
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
					var flowrolename = f.findField('flowrolename').getValue();
					var flowroleremark = f.findField('flowroleremark').getValue();
					Ext.Ajax.request({
						url : '/busbatterysystem/addrole.do',
						method : 'POST',
						params : {
							flowrolename : flowrolename,
							flowroleremark : flowroleremark
						},
						success : function(response, options) {
							var result = response.responseText;
							if (result == 'addok') {
								Ext.Msg.alert('成功', '添加角色成功！');
								store.load();
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
			}]
		});
		win = Ext.create("Ext.window.Window", {
			width : 400,
			height : 400,
			title : "添加角色",
			layout : 'fit',
			items : [
				form
			]
		});
		win.show();
	},
	
//  //内部暂时无法调用这个方法，只能和grid tbar写在一起，以后解决
//	updateRole : function(g) {
//		var record = g.getSelectionModel().getSelection();
//		if (record.length == 0) {
//			Ext.Msg.alert('警告', '请至少选择一条需要修改的数据！');
//			return;
//		}
//		var flowroleId = record[0].data['flowroleId'];
//		alert(flowroleId);
//	},

	createRoleGrid : function() {
		Ext.define('RoleModel', {
			extend : 'Ext.data.Model', 
			fields : [
				'flowroleId',
				'flowrolename',
				'flowroleremark'
			]
		});
		store = Ext.create('Ext.data.Store', {
			model : 'RoleModel',
			pageSize : 10, 
			proxy : {
				type : 'ajax',
				url : '/busbatterysystem/queryRoleList.do', 
				reader : {
					root : 'roles', 
					totalProperty : 'totalCount'
				}
			}
		});
		
		var grid = Ext.create('Ext.grid.Panel', {
			store : store,
			border : false,
			columnLines : true,
			disableSelection : false,
			columns : [{
				id : 'flowroleId', 
				dataIndex : 'flowroleId',
				hidden : true
			}, {
				name : 'flowrolename',
				dataIndex : 'flowrolename',
				text : '角色名称'
			}, {
				name : 'flowroleremark',
				dataIndex : 'flowroleremark', 
				text : '角色描述'
			}],
			bbar : Ext.create('Ext.PagingToolbar', {
				store : store, 
				displayInfo : true, 
				displayMsg : '当前显示第{0}条 至 {1}条记录，共{2}条记录',
				emptyMsg : '暂无可用数据'
			}),
			tbar:[{
	        	width:240,
	        	fieldLabel:'搜素',
	        	xtype:'searchfield',
	        	labelWidth:50,
	        	store: store 
	        }, {
	        	xtype : 'button',
	        	width : 80,
	        	text : '添加角色', 
	        	handler : this.addRole
	        }, {
	        	xtype : 'button',
	        	width : 80,
	        	text : '修改角色',
	        	handler : function() {
	        		var record = grid.getSelectionModel().getSelection();
	        		if (record.length == 0) {
	        			Ext.Msg.alert('警告', '请至少选择一条需要修改的数据！');
	        			return;
	        		}
	        		var flowroleId = record[0].data['flowroleId'];
	        		var flowrolename = record[0].data['flowrolename'];
	        		var flowroleremark = record[0].data['flowroleremark'];
	        		
	        		var win;
	        		var form = Ext.create('Ext.form.Panel', {
	        			defaultType : 'textfield',
	        			frame : true, // 设置为true时可以为panel添加背景色、圆角边框等
	        			items : [{
	        				id : 'flowrolename',
	        				name : 'flowrolename',
	        				fieldLabel : '角色名称', 
	        				anchor : '100%',
	        				value : flowrolename,
	        				allowBlank : false
	        			}, {
	        				id : 'flowroleremark',
	        				name : 'flowroleremark',
	        				fieldLabel : '角色描述',
	        				anchor : '100% 60%',
	        				value : flowroleremark.replace(/<\/br>/g, "\n"), // /../g全局匹配正则表达式
	        				xtype : 'textarea'
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
	        					var flowrolename = f.findField('flowrolename').getValue();
	        					var flowroleremark = f.findField('flowroleremark').getValue();
	        					Ext.Ajax.request({
	        						url : '/busbatterysystem/updaterole.do',
	        						method : 'POST',
	        						params : {
	        							flowroleId : flowroleId,
	        							flowrolename : flowrolename,
	        							flowroleremark : flowroleremark
	        						},
	        						success : function(response, options) {
	        							var result = response.responseText;
	        							if (result == 'updateok') {
	        								Ext.Msg.alert('成功', '修改角色成功！');
	        								store.load();
	        							} else {
	        								Ext.Msg.alert('失败', '修改角色失败！');
	        							}
	        							win.close();
	        						},
	        						failure : function(response, options) {
	        							Ext.Msg.alert('抱歉', '服务器异常，请稍后添加！');
	        						}
	        					});
	        				}
	        			}]
	        		});
	        		
	        		win = Ext.create("Ext.window.Window", {
	        			width : 400,
	        			height : 400,
	        			title : "修改角色",
	        			layout : 'fit',
	        			items : [
	        				form
	        			]
	        		});
	        		win.show();
	        	}
	        }, {
	        	xtype : 'button',
	        	width : 80,
	        	text : '删除角色',
	        	handler : function() {
	        		var record = grid.getSelectionModel().getSelection();
	        		if (record.length == 0) {
	        			Ext.Msg.alert('警告', '请至少选择一条需要删除的数据！');
	        			return;
	        		}
	        		
	        		Ext.Msg.confirm('确认', '请问您确认删除该角色吗？', function(bt) {
	        			if (bt == 'yes') {
	        				var flowroleId = record[0].data['flowroleId'];
	        				Ext.Ajax.request({
	        					url : '/busbatterysystem/deleteRole.do',
	        					methods : 'POST',
	        					params : {
	        						flowroleId : flowroleId
	        					},
	        					success : function(response, options) {
        							var result = response.responseText;
        							if (result == 'deleteeok') {
        								Ext.Msg.alert('成功', '删除角色成功！');
        								store.load();
        							} else {
        								Ext.Msg.alert('失败', '删除角色失败！');
        							}
        							win.close();
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
	        	handler : function() {
	        		var win;
	        		var record = grid.getSelectionModel().getSelection();
	        		if (record.length == 0) {
	        			Ext.Msg.alert('警告', '请至少选择一个需要分配用户的角色！');
	        			return;
	        		}
	        		var flowroleId = record[0].data['flowroleId'];
	        		var store2 = Ext.create('Ext.data.TreeStore', {
	        			proxy : {
	        				type : 'ajax',
	        				url : '/busbatterysystem/queryDepartmentUser.do'
	        			},
	        			sorters : [ {
	        				property : 'leaf',
	        				direction : 'ASC'
	        			}, {
	        				property : 'text',
	        				direction : 'ASC'
	        			} ]
	        		});
	        		
	        		var tree = Ext.create("Ext.tree.Panel", {
	        			store : store2,
	        			rootVisible : false,
	        			useArrows : true,
	        			frame : true, 
	        			dockedItems: [{
	        	            xtype: 'toolbar',
	        	            items: {
	        	                text: '分配用户',
	        	                handler: function(){
	        	                    var records = tree.getView().getChecked();
	        	                    var ids = [];
	        	                    Ext.Array.each(records, function(rec) {
	        	                    	ids.push("'" + rec.get('id') + "'");
	        	                    });
	        	                    
	        	                    if (ids.length <= 0) {
	        	                    	Ext.Msg.alert('警告', '请至少选择一个用户！');
	        	                    	return;
	        	                    }
	        	                    
	        	                    Ext.Ajax.request({
	        	                    	url : '/busbatterysystem/updateuserRole.do',
	        	                    	method : 'POST',
	        	                    	params : {
	        	                    		ids : ids.join(","),
	        	                    		flowroleId : flowroleId
	        	                    	},
	        	                    	success : function(response, options) {
	        	                    		var result = response.responseText;
	        	                    		if (result == 'updateok') {
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
	        			items : [
	        				tree
	        			]
	        		});
	        		win.show();
	        	}
	        }]
		});
		
		store.loadPage(1);
		
		return grid;
	},
	
	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('flowrole');
		if (!win) {
			win = desktop.createWindow({
				id : 'flowrole',
				title : '角色管理',
				width : 600,
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
