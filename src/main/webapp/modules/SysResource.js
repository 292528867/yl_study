
Ext.define('BatteryBusSystem.SysResource', {
	extend : 'Ext.ux.desktop.Module',

//	requires : [ 'Ext.data.TreeStore', 'Ext.tree.Panel', 'Ext.form.Panel', 'Ext.ux.form.SearchField' ],
	requires : [ 'Ext.ux.form.SearchField' ], 
	
	id : 'sysresource',

	init : function() {
		this.launcher = {
			text : '资源管理',
			iconCls : 'notepad',
			handler : this.createWindow,
			scope : this
		};
		
		// 初始化store的额外参数
		this.storeparams = {};
		this.storeparams["resourcetype"] = -1; // 资源类型 
		
		// 初始化model
		Ext.define('ResourceModel', {
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
		
		// 初始化store
		this.resourcetreestore = Ext.create('Ext.data.TreeStore', {
			root: {
			    expanded: true,
			    text: "资源类型树根节点（hidden）",
			    children: [
			        { text : "URL资源", id : 1, leaf : true },
			        { text : "脚本资源", id : 2, leaf : true }, 
			        { text : "数据资源", id : 3, leaf : true }
			    ]
			}
		});
		
		var storeparams_ = this.storeparams;
		this.resourcestore = Ext.create('Ext.data.Store', {
			pageSize : 10,
			model : 'ResourceModel', 
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
	
	resourcetreestore : null, // 资源树 store，本地数据
	resourcestore : null, // 资源 store，各种类型资源
	storeparams : null, // store的额外参数

	showURLResourceForm : function(record, resourcestore) { // 创建URL资源表单
		var win;
		var form = Ext.create('Ext.form.Panel', {
			defaultType : 'textfield',
			items : [{
				id : 'resourcename', 
				name : 'resourcename',
				fieldLabel : '资源名称',
				allowBlank : false
			}, {
				id : 'type1_url', 
				name : 'type1_url',
				fieldLabel : 'URL链接', 
				allowBlank : false
			}, {
				id : 'type1_desc', 
				name : 'type1_desc',
				fieldLabel : '描述', 
				allowBlank : false
			}, {
				xtype : 'hiddenfield', 
        		name : 'resourcetype',
        		value : 1,
        		allowBlank : false
			}, {
				xtype : 'hiddenfield',
				name : 'resourceId'
			}],
			buttons : [{
				text : '提交',
                disabled: true,
                formBind: true,
				handler : function() {
					var sysresource = this.up('form').getForm().getValues();
					if (record) {
						Ext.Ajax.request({
							url : '/busbatterysystem/web/security/SysResourceController/updateresource',
							method : 'POST',
							jsonData : Ext.JSON.encode(sysresource),
							success : function(response, options) {
								var result = response.responseText;
								if (result == '"updateok"') {
									Ext.Msg.alert('恭喜', '更新资源成功！');
									win.close();
									resourcestore.load();
								}
							},
							failure : function(response, options) {
								Ext.Msg.alert('抱歉', '服务器错误，请稍后添加！');
							}
						});
					} else {
						Ext.Ajax.request({
							url : '/busbatterysystem/web/security/SysResourceController/addresource',
							method : 'POST',
							jsonData : Ext.JSON.encode(sysresource),
							success : function(response, options) {
								var result = response.responseText;
								if (result == '"addok"') {
									Ext.Msg.alert('恭喜', '添加资源成功！');
									win.close();
									resourcestore.load();
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
		
		// 表单赋值
		if (record) {	
			form.getForm().setValues(record.data);
		}
		
		win = Ext.create('Ext.window.Window', {
			title : 'URL资源',
			width : 300,
			height : 300,
			layout : 'fit',
			items : [form],
			modal : true
		});
		win.show();
	},
	
	showScriptResourceForm : function(record, resourcestore) { // 创建脚本资源表单
		var win;		
		var form = Ext.create('Ext.form.Panel', {
			defaultType : 'textfield',
			items : [{
				id : 'resourcename', 
				name : 'resourcename',
				fieldLabel : '资源名称',
				allowBlank : false
			}, {
				id : 'type2_url', 
				name : 'type2_url',
				fieldLabel : '脚本URL链接', 
				allowBlank : false
			}, {
				id : 'type2_packagename', 
				name : 'type2_packagename',
				fieldLabel : '脚本模块包名', 
				allowBlank : false
			}, {
				id : 'type2_module_id', 
				name : 'type2_module_id',
				fieldLabel : '脚本模块ID', 
				allowBlank : false
			}, {
				id : 'type2_iconcls', 
				name : 'type2_iconcls',
				fieldLabel : '脚本模块CSS', 
				allowBlank : false
			}, {
				id : 'type2_desc', 
				name : 'type2_desc',
				fieldLabel : '描述', 
				allowBlank : false
			}, {
				xtype : 'hiddenfield', 
        		name : 'resourcetype',
        		value : 2,
        		allowBlank : false
			}, {
				xtype : 'hiddenfield',
				name : 'resourceId'
			}],
			buttons : [{
				text : '提交',
                disabled: true,
                formBind: true,
				handler : function() {
					var sysresource = this.up('form').getForm().getValues();
					if (record) {
						Ext.Ajax.request({
							url : '/busbatterysystem/web/security/SysResourceController/updateresource',
							method : 'POST',
							jsonData : Ext.JSON.encode(sysresource),
							success : function(response, options) {
								var result = response.responseText;
								if (result == '"updateok"') {
									Ext.Msg.alert('恭喜', '更新资源成功！');
									win.close();
									resourcestore.load();
								}
							},
							failure : function(response, options) {
								Ext.Msg.alert('抱歉', '服务器错误，请稍后添加！');
							}
						});
					} else {
						Ext.Ajax.request({
							url : '/busbatterysystem/web/security/SysResourceController/addresource',
							method : 'POST',
							jsonData : Ext.JSON.encode(sysresource),
							success : function(response, options) {
								var result = response.responseText;
								if (result == '"addok"') {
									Ext.Msg.alert('恭喜', '添加资源成功！');
									win.close();
									resourcestore.load();
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
		
		// 表单赋值
		if (record) {	
			form.getForm().setValues(record.data);
		}
		
		win = Ext.create('Ext.window.Window', {
			title : '脚本资源',
			width : 300,
			height : 300,
			layout : 'fit',
			items : [form],
			modal : true
		});
		win.show();
	},
	
	showDataResourceForm : function(record, resourcestore) { // 创建数据资源表单
		var win;
		var form = Ext.create('Ext.form.Panel', {
			defaultType : 'textfield',
			items : [{
				id : 'resourcename', 
				name : 'resourcename',
				fieldLabel : '资源名称',
				allowBlank : false
			}, {
				id : 'type3_zbh', 
				name : 'type3_zbh',
				fieldLabel : '车辆自编号', 
				allowBlank : false
			}, {
				id : 'type3_desc', 
				name : 'type3_desc',
				fieldLabel : '描述', 
				allowBlank : false
			}, {
				xtype : 'hiddenfield', 
        		name : 'resourcetype',
        		value : 3,
        		allowBlank : false
			}, {
				xtype : 'hiddenfield',
				name : 'resourceId'
			}],
			buttons : [{
				text : '提交',
                disabled: true,
                formBind: true,
				handler : function() {
					var sysresource = this.up('form').getForm().getValues();
					if (record) {
						Ext.Ajax.request({
							url : '/busbatterysystem/web/security/SysResourceController/updateresource',
							method : 'POST',
							jsonData : Ext.JSON.encode(sysresource),
							success : function(response, options) {
								var result = response.responseText;
								if (result == '"updateok"') {
									Ext.Msg.alert('恭喜', '更新资源成功！');
									win.close();
									resourcestore.load();
								}
							},
							failure : function(response, options) {
								Ext.Msg.alert('抱歉', '服务器错误，请稍后添加！');
							}
						});
					} else {
						Ext.Ajax.request({
							url : '/busbatterysystem/web/security/SysResourceController/addresource',
							method : 'POST',
							jsonData : Ext.JSON.encode(sysresource),
							success : function(response, options) {
								var result = response.responseText;
								if (result == '"addok"') {
									Ext.Msg.alert('恭喜', '添加资源成功！');
									win.close();
									resourcestore.load();
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
		
		// 表单赋值
		if (record) {
			form.getForm().setValues(record.data);
		}
		
		win = Ext.create('Ext.window.Window', {
			title : '数据资源',
			width : 300,
			height : 300,
			layout : 'fit',
			items : [form],
			modal : true
		});
		win.show();
	},
	
	createTreePanel : function() {
		var resourcetreestore = this.resourcetreestore;
		var resourcestore = this.resourcestore;
		var storeparams = this.storeparams;
		
		var form1function = this.showURLResourceForm;
		var form2function = this.showScriptResourceForm;
		var form3function = this.showDataResourceForm;
		
		var treepanel = Ext.create('Ext.tree.Panel', {
			store : resourcetreestore,
			rootVisible : false, // 隐藏根节点，视觉上相当于有多个根节点，再议
			useArrows : true,
			frame : true,
			title : '资源类型',
			region : 'west',
			width : 250,
			listeners : {
				itemclick : function(view, record, item, index, e, eOpts) {
					var resourcetype = record.data["id"];
					storeparams["resourcetype"] = resourcetype;
					resourcestore.load();
				},
				itemcontextmenu : function(view, record, item, index, e, eOpts) {
					// 让浏览器右键事件失效，方便启用ext 的右键菜单
					e.preventDefault();
					e.stopEvent();
					// 创建菜单
					var node = Ext.create('Ext.menu.Menu', {
						items : [{
							text : '添加资源',
							handler : function() {
								var resourcetype = record.data.id;
								if (resourcetype == 1) 
									form1function(null, resourcestore);
								else if (resourcetype == 2) 
									form2function(null, resourcestore);
								else if (resourcetype == 3)
									form3function(null, resourcestore);
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
	
	createResourcePanel : function() {
		var resourcestore = this.resourcestore;
		var storeparams = this.storeparams;
		
		var form1function = this.showURLResourceForm;
		var form2function = this.showScriptResourceForm;
		var form3function = this.showDataResourceForm;
		
		var grid = Ext.create('Ext.grid.Panel', {
			width : 540, 
			height : 350, 
			store : resourcestore, 
			border : false, 
			columnLines : true, 
			region : 'center',
			selModel : Ext.create('Ext.selection.CheckboxModel', {mode : 'SIMPLE'}),
			disableSelection : false,
			columns : [{
				text : '资源id(hidden)', 
				dataIndex : 'resourceId', 
				hidden : true
			}, {
				text : '资源名称', 
				dataIndex : 'resourcename', 
				sortable : false, 
				anchor : "30%"
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
	        }, {
	        	text : '删除',
	        	xtype : 'button',
	        	width : 50, 
	        	handler : function() {
	        		var records = grid.getSelectionModel().getSelection();
	        		if (records.length == 0) 
	        			Ext.Msg.alert('选择', '请选择需要删除的记录！');
	        		else {
	        			Ext.Msg.confirm('确认', '请问您确认删除资源吗？', function(bt) {
	        				if (bt == 'yes') {
	        					var resourceids = [];
								for (var i = 0; i < records.length; i++) 
									resourceids.push(records[i].data['resourceId']);
			        			Ext.Ajax.request({
			        				url : '/busbatterysystem/web/security/SysResourceController/invalidresources',
			        				method : "POST",
			        				jsonData : Ext.JSON.encode(resourceids),
			        				success : function(response, options) {
										var result = response.responseText;
										if (result == '"invalidok"') {
											Ext.Msg.alert('成功', '删除资源成功！');
											resourcestore.load();
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
	        }, {
	        	text : '修改',
	        	xtype : 'button',
	        	width : 50,
	        	handler : function() {
	        		var records = grid.getSelectionModel().getSelection();
	        		if (records.length > 1) 
	        			Ext.Msg.alert('选择', '只能选择一条记录！');
	        		else {
	        			var resourcetype = records[0].data.resourcetype;
	        			if (resourcetype == 1) 
							form1function(records[0], resourcestore);
						else if (resourcetype == 2) 
							form2function(records[0], resourcestore);
						else if (resourcetype == 3)
							form3function(records[0], resourcestore);
	        		}
	        	}
	        }]
		});

		resourcestore.loadPage(1);
		return grid;	
	},
	
	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('sysresource');
		if (!win) {
			win = desktop.createWindow({
				id : 'sysresource',
				title : '资源管理',
				width : 800,
				height : 400,
				iconCls : 'notepad',
				animCollapse : false,
				border : false,
				hideMode : 'offsets',
			    layout : 'border',
				items : [
					this.createTreePanel(),
					this.createResourcePanel()
				]
			});
		}
		win.show();
		return win;
	}
});
