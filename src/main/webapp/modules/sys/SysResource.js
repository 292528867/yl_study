
Ext.define('BatteryBusSystem.SysResource', {
	extend : 'Ext.ux.desktop.Module',

//	requires : [ 'Ext.data.TreeStore', 'Ext.tree.Panel', 'Ext.form.Panel', 'Ext.ux.form.searchfield_fix' ],
	
	id : 'sysresource',

	init : function() {
		this.launcher = {
			text : '资源管理',
			iconCls : 'notepad',
			handler : this.createWindow,
			scope : this
		};
		
		var me = this;
		
		// 初始化store的额外参数
		me.storeparams = {};
		me.storeparams["resourcetype"] = -1; // 资源类型 
		
		// 初始化model
		Ext.define('BatteryBusSystem.SysResource.ResourceModel', {
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
		me.resourcetreestore = Ext.create('Ext.data.TreeStore', {
			root: {
			    expanded: true,
			    text: "资源类型树根节点（hidden）",
			    children: [
			        { text : "URL资源", id : 1, leaf : true },
			        { text : "脚本资源", id : 2, leaf : true }, 
			        { text : "车辆数据资源", id : 3, leaf : true }
			    ]
			}
		});
		
		me.resourcestore = Ext.create('Ext.data.Store', {
			pageSize : 10,
			model : 'BatteryBusSystem.SysResource.ResourceModel', 
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
	
	resourcetreestore : null, // 资源树 store，本地数据
	resourcestore : null, // 资源 store，各种类型资源
	storeparams : null, // store的额外参数

	showURLResourceForm : function(record) { // 创建URL资源表单
		var me = this;
		
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
					var f = this.up('form').getForm();
					var url = '';
					if (record) 
						url = '/busbatterysystem/web/security/sysResourceController/updateresource';
					else 
						url = '/busbatterysystem/web/security/sysResourceController/addresource';
					f.submit({
						clientValidation : true,
						url : url,
						method : 'POST',
						success : function(form, action) {
							Ext.Msg.alert('成功', action.result.msg);
							win.close();
							me.resourcestore.load();
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
	
	showScriptResourceForm : function(record) { // 创建脚本资源表单
		var me = this;
		
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
					var f = this.up('form').getForm();
					var url = '';
					if (record) 
						url = '/busbatterysystem/web/security/sysResourceController/updateresource';
					else 
						url = '/busbatterysystem/web/security/sysResourceController/addresource';
					f.submit({
						clientValidation : true,
						url : url,
						method : 'POST',
						success : function(form, action) {
							Ext.Msg.alert('成功', action.result.msg);
							win.close();
							me.resourcestore.load();
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
	
	showDataResourceForm : function(record) { // 创建数据资源表单
		var me = this;
		
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
					var f = this.up('form').getForm();
					var url = '';
					if (record) 
						url = '/busbatterysystem/web/security/sysResourceController/updateresource';
					else 
						url = '/busbatterysystem/web/security/sysResourceController/addresource';
					f.submit({
						clientValidation : true,
						url : url,
						method : 'POST',
						success : function(form, action) {
							Ext.Msg.alert('成功', action.result.msg);
							win.close();
							me.resourcestore.load();
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
		var me = this;
		
		var treepanel = Ext.create('Ext.tree.Panel', {
			store : me.resourcetreestore,
			rootVisible : false, // 隐藏根节点，视觉上相当于有多个根节点，再议
			useArrows : true,
			frame : true,
			title : '资源类型',
			region : 'west',
			width : 250,
			listeners : {
				itemclick : function(view, record, item, index, e, eOpts) {
					var resourcetype = record.data["id"];
					me.storeparams["resourcetype"] = resourcetype;
					me.resourcestore.load();
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
									me.showURLResourceForm(null);
								else if (resourcetype == 2) 
									me.showScriptResourceForm(null);
								else if (resourcetype == 3)
									me.showDataResourceForm(null);
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
		var me = this;
		
		var grid = Ext.create('Ext.grid.Panel', {
			width : 540, 
			height : 350, 
			store : me.resourcestore, 
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
			        				url : '/busbatterysystem/web/security/sysResourceController/invalidresources',
			        				method : "POST",
			        				jsonData : Ext.JSON.encode(resourceids),
			        				success : function(response, options) {
										var result = response.responseText;
										if (result == '"invalidok"') {
											Ext.Msg.alert('成功', '删除资源成功！');
											me.resourcestore.load();
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
							me.showURLResourceForm(records[0]);
						else if (resourcetype == 2) 
							me.showScriptResourceForm(records[0]);
						else if (resourcetype == 3)
							me.showDataResourceForm(records[0]);
	        		}
	        	}
	        }]
		});

		me.resourcestore.loadPage(1);
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
