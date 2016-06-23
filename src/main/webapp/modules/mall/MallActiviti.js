// 活动管理模块

Ext.define('Mall.ActivitiManager', {
	extend : 'Ext.ux.desktop.Module',

	requires : [
//	'Ext.ux.CheckColumn'
	], 
	
	id : 'activitiManager',
	
	/** 活动信息store */
	activitiStore : null,
	/** 商品信息store */
	productStore : null,
	/** 活动商品信息store */
	activitiProductStore : null,
	/** 选中的活动id */
	activitiId : null,
	
	init : function() {
		var me = this;
		
		me.launcher = {
			text : '活动信息管理',
			iconCls : 'notepad',
			handler : this.createWindow,
			scope : this
		}
		
		// 初始化活动信息model、活动信息store
		Ext.define("Mall.ActivitiManager.ActivitiInfoModel", {
			extend : 'Ext.data.Model',
			fields : [    
			    'id',
				'activitiName',
				'activitiDesc',
				'activitiProcessDefinitionKey', 
				'createdDate', 
				'enabled', 
				'type'
			]
		});
		me.activitiStore = Ext.create('Ext.data.Store', {
			model : 'Mall.ActivitiManager.ActivitiInfoModel',
			pageSize : 10, 
			proxy : {
				type : 'ajax',
				url : serverUrl + '/mall/manager/activiti?sort=createdDate,desc',
				actionMethods : {
//	                create : 'POST',
	                read   : 'GET', // by default GET
//	                update : 'POST',
//	                destroy: 'POST'
				},
				reader : {
					root : 'content', 
					totalProperty : 'totalElements'
				},
				limitParam : 'size'
//				extraParams: { key: 'key' } //附加参数，搜索组件就就加了一个query的参数
			}
		});
		
		// 初始化商品信息model、商品信息store
		Ext.define("Mall.ActivitiManager.ProductInfoModel", {
			extend : 'Ext.data.Model',
			fields : [    
			    'id',
				'name',
				'summary',
				'originalPrice',
				'currentPrice',
				'pictureUrl'
			]
		});
		/**
		 * store的proxy默认是get请求，某些请求可能需要post请求，
		 * 设置proxy的actionMethods的相关属性就可以了，
		 * TODO：文档中没有说明，不知道为什么
		 */
		me.productStore = Ext.create('Ext.data.Store', {
			model : 'Mall.ActivitiManager.ProductInfoModel',
			pageSize : 10, 
			proxy : {
				type : 'ajax',
				url : serverUrl + '/mall/manager/product',
				actionMethods : {
//	                create : 'POST',
	                read   : 'GET', // by default GET
//	                update : 'POST',
//	                destroy: 'POST'
				},
				reader : {
					root : 'content', 
					totalProperty : 'totalElements'
				},
				limitParam : 'size'
//				extraParams: { key: 'key' } //附加参数，搜索组件就就加了一个query的参数
			}
		});
		
		// 初始化活动商品信息model，活动商品信息store
		Ext.define("Mall.ActivitiManager.ActivitiProductInfoModel", {
			extend : 'Ext.data.Model',
			fields : [ 
			    'id',
			    'activitiId',
				'productId',
				'productName',
				'count',
				'score',
				'enabled',
				'validStartTime',
				'validEndTime'
			],
			proxy : {
				type : "rest", 
				url : serverUrl + '/mall/manager/activiti/product',
			}
		});
		me.activitiProductStore = Ext.create("Ext.data.Store", {
			model : "Mall.ActivitiManager.ActivitiProductInfoModel",
			proxy : {
				type : "ajax", 
				url : serverUrl + '/mall/manager/activiti/product',
				actionMethods : {
//	                create : 'POST',
	                read   : 'GET', // by default GET
//	                update : 'POST',
//	                destroy: 'POST'
				}
			},
			listeners : {
				beforeload : function(store, operation, eOpts) {
					var newparams = {activitiId : me.activitiId};
					Ext.apply(this.proxy.extraParams, newparams);
				}
			}
		});
		
	},
	
	showActivitiForm : function (record) {
		var me = this;
		
		var win;
		var form = Ext.create("Ext.form.Panel", {
			frame : true,
			defaultType : 'textfield',
			items : [{
				xtype : 'hiddenfield',
				name : 'id'
			}, {
				anchor : '-5',
				name : 'activitiName',
				fieldLabel : '活动名字',
				allowBlank : false
			}, {
				name : 'activitiProcessDefinitionKey',
				fieldLabel : '活动流程key',
				allowBlank : false,
				xtype : 'hiddenfield', 
				value : 'tryActiviti'
			}, {
				anchor : '-5',
                xtype:          'combo',
                mode:           'local',
                value:          '0',
                triggerAction:  'all',
                forceSelection: true,
                editable:       false,
                fieldLabel:     '活动类型',
                name:           'type',
                displayField:   'name',
                valueField:     'value',
                queryMode: 'local',
                store:          Ext.create('Ext.data.Store', {
                    fields : ['name', 'value'],
                    data   : [
                        {name : '外链商品',   value: 'NORMAL'},
                        {name : '试用商品',  value: 'TRY'}
                    ]
                })
			}, {
				xtype: 'radiogroup',
	            fieldLabel: '是否启用',
	            items: [
	                {boxLabel: '启用', name: 'enabled', inputValue : "true"},
	                {boxLabel: '未启用', name: 'enabled', inputValue : "false", checked: true}
	            ]
			}, {
				anchor : '-5 -5',
				name : 'activitiDesc',
				xtype : 'textareafield',
				fieldLabel : '活动说明',
				allowBlank : false,
			}],
			buttons : [{
				text : '重置',
				handler : function() {
					this.up('form').getForm().reset();
				}
			}, {
				text : '提交', 
				disabled : true, 
				formBind : true, 
				handler : function() {
					var f = this.up('form').getForm();
					var vo = f.getFieldValues();
					Ext.Ajax.request({
						url : serverUrl + '/mall/manager/activiti',
						method : record ? 'PUT' : 'POST',
						jsonData : Ext.JSON.encode(vo),
						success : function(response, options) {
							win.close();
							me.activitiStore.load();
						}
					});
				}
			}]
		});
		
		// 表单赋值
		if (record) {	
			form.getForm().setValues(record.data);
		}
		
		win = Ext.create("Ext.window.Window", {
			width : 300,
			height : 300,
			title : '新增商品活动信息',
			layout : 'fit',
			items : [form],
			modal : true
		});
		win.show();
	},
	
	showActivitiProductPanel : function () {
		var me = this;
		
		var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
	        clicksToMoveEditor: 1,
	        autoCancel: false,
	        listeners : {
	        	// TODO：
	        }
	    });
		var grid = Ext.create("Ext.grid.Panel", {
			plugins: [rowEditing],
	        width: 400,
	        height: 300,
	        frame: true,
	        store: me.activitiProductStore,
	        columns: [{
	            text: '商品',
	            flex: 1,
	            sortable: true,
	            dataIndex: 'productId',
	            editor : {
	            	//id : "productCombo",
	            	allowBlank : false,
	                xtype : 'combo', 
	                store : me.productStore, 
	                displayField : "name", 
	                valueField : "id",
	                matchFieldWidth : false,
	                minChars : "2",
	                forceSelection : true, 
	                queryParam : 'filters',
	                listConfig : {
	                	loadingText : '搜索中...',
	                	emptyText : '没有匹配的商品',
	                	trackOver : true,
	                	width : 500,
	                	height : 400,
	                	tpl : new Ext.XTemplate(
	                			'<tpl for=".">',
	                			'<div class="activitiProductComboList">',
	                			'<img width="66" height="66" src="{pictureUrl}"/>',
	                			'<center>{name}</center>',
	                			'<center style="color:red">价格：{originalPrice}</center>',
	                			'</div>',
	                			'</tpl>'
	                	),
	                	listeners : {
	                		beforerender : function () {
	                			this.selectedItemCls = "activitiProductComboListSelected";
	                			this.itemSelector = "div.activitiProductComboList";
	                			this.overItemCls = "activitiProductComboListOverItem";
	                		}, 
	                		select : function(cb, record, obj) {
	                			var c_v = record.data["id"] + "_" + record.data["name"];
	                			record.data["id"] = c_v;
	                		}
	                	}
	                }, 
	                listeners : {
	                	"beforequery" : function(queryEvent, eOpts) {
	                		if (queryEvent.query)
	                			queryEvent.query = "{\"name_like\" : \"" + queryEvent.query + "\"}";
	                	}
	                }
	            }, 
	            renderer : function(value, metadata, record) {
	            	if ((value + "").indexOf("_") == -1)
	            		return record.data['productName'];
	            	else {
	            		record.data['productId'] = value.split("_")[0];
	            		record.data['productName'] = value.split("_")[1];
	            		return record.data['productName'];
	            	}
				}
	        }, {
	            text: '数量',
	            width: 80,
	            sortable: true,
	            dataIndex: 'count',
	            editor : {
	            	allowBlank : false,
	                xtype: 'numberfield', 
	                minValue : 1
	            }
	        }, {
	            text: '积分',
	            width: 80,
	            sortable: true,
	            dataIndex: 'score',
	            field: {
	            	allowBlank : false, 
	                xtype: 'numberfield', 
	                minValue : 1
	            }
	        }, {
				text : '开始时间',
				width : 180,
				dataIndex : 'validStartTime',
				field : {
					allowBlank : false,
					xtype : 'datefield',
					format : 'Y-m-d H:i:s'
				},
				renderer : function(value, metadata, record) {
					if (value) {
						var dt = new Date(value);
						return Ext.Date.format(dt, 'Y年m月d日 H:i:s');
					}
				}
			}, {
				text : '结束时间',
				width : 180,
				dataIndex : 'validEndTime',
				field : {
					allowBlank : false,
					xtype : 'datefield',
					format : 'Y-m-d H:i:s'
				},
				renderer : function(value, metadata, record) {
					if (value) {
						var dt = new Date(value);
						return Ext.Date.format(dt, 'Y年m月d日 H:i:s');
					}
				}
			}],
	        dockedItems: [{
	            xtype: 'toolbar',
	            items: [{
	                text: '添加商品',
	                iconCls: 'icon-add',
	                handler: function(){
	                    // empty record
	                    me.activitiProductStore.insert(0, new Mall.ActivitiManager.ActivitiProductInfoModel());
	                    rowEditing.startEdit(0, 0);
	                }
	            }, '-', {
	                itemId: 'delete',
	                text: '删除商品',
	                iconCls: 'icon-delete',
	                disabled: true,
	                handler: function(){
	                    var selection = grid.getView().getSelectionModel().getSelection()[0];
	                    if (selection) {
	                    	var record = selection;
	                    	if (record.data.id) {
	                    		record.destroy({
	                    			success : function () {
	                    				me.activitiProductStore.remove(selection);
	                    			}
	                    		});
	                    	} else {
	                    		me.activitiProductStore.remove(selection);
	                    	}
	                    }
	                }
	            }]
	        }], 
	        listeners : {
	        	"edit" : function (e) {
	        		e.record.data["activitiId"] = me.activitiId;
	        		e.record.save({
	        			"success" : function () {
	        				console.log(e);
	        				e.record.commit();
	        			}
	        		});
	        	}
	        }
		});
				
		grid.getSelectionModel().on('selectionchange', function(selModel, selections){
	        grid.down('#delete').setDisabled(selections.length === 0);
	    });
		
		var win;
		win = Ext.create("Ext.window.Window", {
			width : 600,
			height : 300,
			title : '试用商品',
			layout : 'fit',
			items : [grid],
			modal : true
		});
		win.show();
	},
	
	showActivitiProductPanel2 : function () {
		var me = this;
		
		var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
	        clicksToMoveEditor: 1,
	        autoCancel: false,
	        listeners : {
	        	// TODO：
	        }
	    });
		var grid = Ext.create("Ext.grid.Panel", {
			plugins: [rowEditing],
	        width: 400,
	        height: 300,
	        frame: true,
	        store: me.activitiProductStore,
	        columns: [{
	            text: '商品',
	            flex: 1,
	            sortable: true,
	            dataIndex: 'productId',
	            editor : {
					allowBlank : false,
					xtype : 'combo',
					store : me.productStore,
					displayField : "name",
					valueField : "id",
					matchFieldWidth : false,
					minChars : "2",
					forceSelection : true,
					queryParam : 'filters',
	                listConfig : {
	                	trackOver : true, 
	                	width : 500,
	                	height : 400,
	                	tpl : new Ext.XTemplate(
	                			'<tpl for=".">',
	                			'<div class="activitiProductComboList">',
	                			'<img width="66" height="66" src="{pictureUrl}"/>',
	                			'<center>{name}</center>',
	                			'<center style="color:red">价格：{originalPrice}</center>',
	                			'</div>',
	                			'</tpl>'
	                	),
	                	listeners : {
	                		beforerender : function () {
	                			this.selectedItemCls = "activitiProductComboListSelected";
	                			this.itemSelector = "div.activitiProductComboList";
	                			this.overItemCls = "activitiProductComboListOverItem";
	                		}, 
	                		select : function(cb, record, obj) {
	                			var c_v = record.data["id"] + "_" + record.data["name"];
	                			record.data["id"] = c_v;
	                		}
	                	}
	                },
					listeners : {
						"beforequery" : function(queryEvent, eOpts) {
							if (queryEvent.query)
								queryEvent.query = "{\"name_like\" : \"" + queryEvent.query + "\"}";
						}
					}
	            }, 
	            renderer : function(value, metadata, record) {
	            	if ((value + "").indexOf("_") == -1)
	            		return record.data['productName'];
	            	else {
	            		record.data['productId'] = value.split("_")[0];
	            		record.data['productName'] = value.split("_")[1];
	            		return record.data['productName'];
	            	}
				}
	        }, {
	        	text : '是否上架',
	        	width : 80,
	        	dataIndex: 'enabled',
	        	field : {
	        		xtype : "combo",
	        		mode:           'local',
	                value:          '0',
	                triggerAction:  'all',
	                forceSelection: true,
	                editable:       false,
	                name:           'type',
	                displayField:   'name',
	                valueField:     'value',
	                queryMode: 'local',
	                store:          Ext.create('Ext.data.Store', {
	                    fields : ['name', 'value'],
	                    data   : [
	                        {name : '上架',   value: true},
	                        {name : '下架',  value: false}
	                    ]
	                })
	        	},
	        	renderer : function(value, metadata, record) {
	        		if (value) 
	        			return "上架";
	        		else 
	        			return "下架";
				}
	        }],
	        dockedItems: [{
	            xtype: 'toolbar',
	            items: [{
	                text: '添加商品',
	                iconCls: 'icon-add',
	                handler: function(){
	                    // empty record
	                    me.activitiProductStore.insert(0, new Mall.ActivitiManager.ActivitiProductInfoModel());
	                    rowEditing.startEdit(0, 0);
	                }
	            }, '-', {
	                itemId: 'delete',
	                text: '删除商品',
	                iconCls: 'icon-delete',
	                disabled: true,
	                handler: function(){
	                    var selection = grid.getView().getSelectionModel().getSelection()[0];
	                    if (selection) {
	                    	var record = selection;
	                    	if (record.data.id) {
	                    		record.destroy({
	                    			success : function () {
	                    				me.activitiProductStore.remove(selection);
	                    			}
	                    		});
	                    	} else {
	                    		me.activitiProductStore.remove(selection);
	                    	}
	                    }
	                }
	            }]
	        }], 
	        listeners : {
	        	"edit" : function (e) {
	        		e.record.data["activitiId"] = me.activitiId;
	        		e.record.save({
	        			"success" : function () {
	        				console.log(e);
	        				e.record.commit();
	        			}
	        		});
	        	}
	        }
		});
				
		grid.getSelectionModel().on('selectionchange', function(selModel, selections){
	        grid.down('#delete').setDisabled(selections.length === 0);
	    });
		
		var win;
		win = Ext.create("Ext.window.Window", {
			width : 400,
			height : 300,
			title : '外链商品',
			layout : 'fit',
			items : [grid],
			modal : true
		});
		win.show();
	},
	
	mainPanel : function() {
		var me = this;
		var grid = Ext.create("Ext.grid.Panel", {
//			width : 500,
//			height : 500,
			store : me.activitiStore,
			frame : true,
			border : false,
			columnLines : true,
			selModel : Ext.create('Ext.selection.CheckboxModel', {mode : 'SIMPLE'}),
			disableSelection : false,
			
			columns : [{
				dataIndex : 'id',
				text : '主键id',
				hidden : true
			}, {
				dataIndex : 'activitiName',
				text : '活动名字'
			}, {
				dataIndex : 'activitiDesc',
				text : '活动说明'
			}, {
				dataIndex : 'type',
				text : '活动类型', 
				renderer : function(value, metadata, record) {
					if (value == 'NORMAL') 
						return "外链商品";
					else if (value == 'TRY')
						return "试用商品";
					else 
						return "";
				}
			}, {
				dataIndex : 'createdDate', 
				text : '创建时间', 
				width : 180, 
				renderer : function(value, metadata, record) {
					if (value) {
						var dt = new Date(value);
						return Ext.Date.format(dt, 'Y年m月d日 H:i:s');
					}
				}
			}, {
				dataIndex : 'enabled', 
				text : '是否启用', 
				width : 100, 
				renderer : function(value, metadata, record) {
					return value ? '启用' : '未启用';
				}
			}], 
			
			bbar : Ext.create('Ext.PagingToolbar', {
				store : me.activitiStore, 
				displayInfo : true, 
				displayMsg : '当前显示第{0}条 至 {1}条记录，共{2}条记录',
				emptyMsg : '暂无可用数据'
			}),
			tbar:[{
	        	width:240,
	        	fieldLabel:'搜素',
	        	xtype:'searchfield',
	        	labelWidth:50,
	        	store: me.activitiStore 
	        }, {
	        	text : '新增活动', 
	        	xtype : 'button',
	        	width : 80, 
	        	handler : function() {
	        		me.showActivitiForm();
	        	}
	        }, {
	        	text : '修改活动',
	        	xtype : 'button',
	        	width : 80,
	        	handler : function() {
	        		var records = grid.getSelectionModel().getSelection();
	        		if (records.length != 1) 
	        			Ext.Msg.alert('选择', '只能选择一条记录！');
	        		else {
	        			me.showActivitiForm(records[0]);
	        		}
	        	}
	        }, {
	        	text : '活动商品明晰', 
	        	xtype : 'button', 
	        	width : 80, 
	        	handler : function () {
	        		// 判定
	        		var records = grid.getSelectionModel().getSelection();
	        		if (records.length != 1) 
	        			Ext.Msg.alert('选择', '只能选择一条记录！');
	        		else {
	        			// 判定打开那种类型的商品editgrid
	        			if (records[0].data['type'] == 'NORMAL') {
	        				me.activitiId = records[0].data["id"];
	        				me.showActivitiProductPanel2();
		        			me.activitiProductStore.load();
	        			} else if (records[0].data['type'] == 'TRY') {
	        				me.activitiId = records[0].data["id"];
	        				me.showActivitiProductPanel();
		        			me.activitiProductStore.load();
	        			} else {
	        				alert("bye bye");
	        			}
	        		}
	        	}
	        }]
		});
		me.activitiStore.loadPage(1);
		return grid;
	},
	
	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('activitiManager');
		if (!win) {
			win = desktop.createWindow({
				id : 'activitiManager',
				title : '活动信息管理',
				width : 600,
				height : 400,
				iconCls : 'notepad',
				animCollapse : false,
				border : false,
				hideMode : 'offsets',
				layout : 'fit',
				items : [
					this.mainPanel()
				]
			});
		}
		win.show();
		return win;
	}
});
