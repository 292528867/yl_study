

Ext.define('Mall.ProductManager', {
	extend : 'Ext.ux.desktop.Module',

	requires : [
		
	], 
	
	id : 'productManager',
	
	store : null,
	categoryStore : null,

	init : function() {
		this.launcher = {
			text : '商品管理',
			iconCls : 'notepad',
			handler : this.createWindow,
			scope : this
		}
	},
	
	createProductManagerGrid : function() {
		Ext.define("Mall.ProductManager.ProductInfoModel", {
			extend : 'Ext.data.Model',
			fields : [    
			    'id',
				'name',
				'summary',
				'originalPrice',
				'currentPrice',
				'pictureUrl', 
				'productDesc',
				'productExternalUrl',
				'pictureUrlList', 
				'createdDate',
				'category',
				'orderValue',

				'productActivitiInfo'
			]
		});

		/**
		 * 设置商品分类store
		 */
		Ext.define("Mall.ProductManager.Categoy", {
			extends : 'Ext.data.Model',
			fields : [
				'cname'
			]
		});
		this.categoryStore = Ext.create('Ext.data.Store', {
			model : 'Mall.ProductManager.Categoy',
			pageSize : 10,
			proxy : {
				type : 'ajax',
				url : serverUrl + '/mall/manager/product/queryCategories',
				actionMethods : {
//	                create : 'POST',
					read   : 'GET', // by default GET
//	                update : 'POST',
//	                destroy: 'POST'
				},
				reader : {
					root : 'ret_values',
					totalProperty : 'totalElements'
				}
			},
			fields : ['cname']
		});

		/**
		 * store的proxy默认是get请求，某些请求可能需要post请求，
		 * 设置proxy的actionMethods的相关属性就可以了，
		 * TODO：文档中没有说明，不知道为什么
		 */
		this.store = Ext.create('Ext.data.Store', {
			model : 'Mall.ProductManager.ProductInfoModel',
			pageSize : 10,
			proxy : {
				type : 'ajax',
				url : serverUrl + '/mall/manager/product?sort=orderValue,desc&sort=createdDate,desc',
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
			},
			listeners : {
				datachanged : function(  store, eOpts ) {
					var ids = [];
					var records = [];
					for (var i = 0; i < store.getCount(); i++) {
						var record = store.getAt(i);
						ids.push(record.data['id']);
						records.push(record);
					}

					Ext.Ajax.request({
						url : serverUrl + '/mall/manager/product/queryProductAcitiviInfo',
						async : false,
						method : "GET",
						params : {'pids' : ids.join(',')},
						success : function(response, options) {
							var result = Ext.JSON.decode(response.responseText, true);
							for (var i = 0; i < records.length; i++) {
								var id = records[i].data["id"];
								var infoarray = result.ret_values[id];
								if (infoarray && infoarray.length > 0)
									records[i].data["productActivitiInfo"] = infoarray.join("</br></br>");
								else
									records[i].data["productActivitiInfo"] = "未参与活动";
							}
						},
						failure : function(response, options) {
							Ext.Msg.alert('抱歉', '获取商品活动信息异常！');
						}
					});
				}
			}
		});
		var gridstore = this.store;
		
		/**
		 * grid 里columns 里定义列的时候写id属性会报错，
		 * Uncaught TypeError: Object [object Object] has no method 'isOnLeftEdge' 
		 * 注意了：http://www.sencha.com/forum/showthread.php?155646-Uncaught-TypeError-Object-object-Object-has-no-method-isOnLeftEdge-in-Extjs-4.0.
		 */
		var me = this;
		var grid = Ext.create("Ext.grid.Panel", {
//			width : 500,
//			height : 500,
			store : gridstore,
			frame : true,
			border : false,
			columnLines : true,
			selModel : Ext.create('Ext.selection.CheckboxModel', {mode : 'SIMPLE'}),
			disableSelection : false,
			sortableColumns : false,
			
			columns : [{
				dataIndex : 'id',
				text : '主键id',
				hidden : true
			}, {
				dataIndex : 'pictureUrl',
				text : '商品图片', 
				renderer : function(value, metadata, record) {
					if (value) 
						return "<img style='width: 100px; height: 100px;' src='" + value + "'/>";
					else 
						return "请上传图片";
				}
			}, {
				dataIndex : 'name',
				text : '商品名称', 
				renderer : function(value, metadata, record) {
					if (value)
						return '<div style ="white-space:normal;">' + value + '</div>';
				}
			}, {
				dataIndex : 'category',
				text : '商品分类',
				renderer : function(value, metadata, record) {
					if (value)
						return '<div style ="white-space:normal;">' + value + '</div>';
					else
						return '<div style ="white-space:normal;">未分类</div>';
				}
			}, {
				dataIndex : 'originalPrice',
				text : '商品原价'
			}, {
				dataIndex : 'currentPrice',
				text : '商品现价'
			}, {
				dataIndex : 'productActivitiInfo',
				text : '商品活动信息',
				width : 250,
				renderer : function(value, metadata, record) {
					if (value)
						return '<div style ="white-space:normal;">' + value + '</div>';
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
			}], 
			
			bbar : Ext.create('Ext.PagingToolbar', {
				store : gridstore, 
				displayInfo : true, 
				displayMsg : '当前显示第{0}条 至 {1}条记录，共{2}条记录',
				emptyMsg : '暂无可用数据'
			}),
			tbar:[{
	        	width:240,
	        	fieldLabel:'搜素',
	        	xtype:'searchfield_mall',
	        	labelWidth:50,
	        	store: gridstore,
				vnames : ['name']
	        }, {
	        	text : '新增商品', 
	        	xtype : 'button',
	        	width : 80, 
	        	handler : function() {
	        		me.showProductForm();
	        	}
	        }, {
	        	text : '修改商品',
	        	xtype : 'button',
	        	width : 80,
	        	handler : function() {
	        		var records = grid.getSelectionModel().getSelection();
	        		if (records.length != 1) 
	        			Ext.Msg.alert('选择', '只能选择一条记录！');
	        		else {
	        			me.showProductForm(records[0]);
	        		}
	        	}
	        }, {
				text : '商品分类',
				xtype : 'button',
				width : 80,
				tooltip : '修改所选商品的分类，统一修改成一个',
				handler : function() {
					var records = grid.getSelectionModel().getSelection();
					if (records.length == 0)
						Ext.Msg.alert('选择', '请至少选择一条记录！');
					else {
						me.showCategoryForm(records);
					}
				}
			}, {
				text : '商品试用',
				xtype : 'button',
				width : 80,
				handler : function() {
					var records = grid.getSelectionModel().getSelection();
					if (records.length == 0)
						Ext.Msg.alert('选择', '请至少选择一条记录！');
					else {
						me.showTryActivitiProductForm(records);
					}
				}
			}, {
				text : '外链商品',
				xtype : 'button',
				width : 80,
				handler : function() {
					var records = grid.getSelectionModel().getSelection();
					if (records.length == 0)
						Ext.Msg.alert('选择', '请至少选择一条记录！');
					else {
						me.showOtherActivitiProductForm(records);
					}
				}
			}]
		});
		gridstore.loadPage(1);
		return grid;
	},

	showOtherActivitiProductForm : function(records) {
		var ids = [];
		for (var i = 0; i < records.length; i++)
			ids.push(records[i].data['id']);

		var me = this;
		var form = Ext.create("Ext.form.Panel", {
			url : serverUrl + '/mall/manager/activiti/otheractivitiProduct',
			frame : true,
			items : [{
				xtype : 'hiddenfield',
				name : 'pids',
				value : ids.join(",")
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
					f.submit({
						waitMsg : '更新中......',
						method : 'POST',
						success : function(form, action) {
							Ext.Msg.alert('成功', action.result.msg);;
							win.close();
							me.store.load();
						},
						failure: function(form, action) {
							Ext.Msg.alert('抱歉', '服务器异常！');
						}
					});

				}
			}]
		});

		win = Ext.create("Ext.window.Window", {
			width : 300,
			height : 100,
			maximizable : true,
			title : '外链商品',
			layout : 'fit',
			items : [form],
			modal : true
		});
		win.show();
	},

	showTryActivitiProductForm : function (records) {
		var ids = [];
		for (var i = 0; i < records.length; i++)
			ids.push(records[i].data['id']);

		var me = this;
		var form = Ext.create("Ext.form.Panel", {
			url : serverUrl + '/mall/manager/activiti/tryactivitiProduct',
			frame : true,
			items : [{
				xtype : 'hiddenfield',
				name : 'pids',
				value : ids.join(",")
			}, {
				xtype : 'datefield',
				name : 'fromDateStr',
				fieldLabel : '开始时间',
				format : 'Y-m-d H:i:s',
				allowBlank : false
			}, {
				xtype : 'datefield',
				name : 'toDateStr',
				fieldLabel : '结束时间',
				format : 'Y-m-d H:i:s',
				allowBlank : false
			}, {
				xtype : 'numberfield',
				name : 'score',
				minValue : 1,
				allowDecimals : false,
				fieldLabel : '兑换积分',
				allowBlank : false
			}, {
				xtype : 'numberfield',
				name : 'totalCount',
				minValue : 1,
				allowDecimals : false,
				fieldLabel : '商品数量',
				allowBlank : false
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
					f.submit({
						waitMsg : '更新中......',
						method : 'POST',
						success : function(form, action) {
							Ext.Msg.alert('成功', action.result.msg);;
							win.close();
							me.store.load();
						},
						failure: function(form, action) {
							Ext.Msg.alert('抱歉', '服务器异常！');
						}
					});

				}
			}]
		});

		win = Ext.create("Ext.window.Window", {
			width : 300,
			height : 200,
			maximizable : true,
			title : '试用商品',
			layout : 'fit',
			items : [form],
			modal : true
		});
		win.show();
	},

	showCategoryForm : function(records) {
		var ids = [];
		for (var i = 0; i < records.length; i++)
			ids.push(records[i].data['id']);

		var me = this;
		var form = Ext.create("Ext.form.Panel", {
			url : serverUrl + '/mall/manager/product/categoryProduct',
			frame : true,
			items : [{
				xtype : 'hiddenfield',
				name : 'pids',
				value : ids.join(",")
			}, {
				name : 'cname',
				fieldLabel : '商品类别',
				xtype : 'combo',
				store : me.categoryStore,
				displayField : "cname",
				valueField : "cname",
				queryMode : 'remote',
				allowBlank : false
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
					f.submit({
						waitMsg : '更新中......',
						method : 'POST',
						success : function(form, action) {
							Ext.Msg.alert('成功', action.result.msg);;
							win.close();
							me.store.load();
						},
						failure: function(form, action) {
							Ext.Msg.alert('抱歉', '服务器异常！');
						}
					});

				}
			}]
		});

		win = Ext.create("Ext.window.Window", {
			width : 300,
			height : 100,
			maximizable : true,
			title : '商品分类',
			layout : 'fit',
			items : [form],
			modal : true
		});
		win.show();



	},

	showProductForm : function(record) {
		
		var myHtmlEditor = Ext.create('Ext.ux.form.plugin.HtmlEditor', {
            enableAll: true,
            imageUploadUrl: serverUrl + '/mall/manager/product/uploadPicture'   //处理图片上传的后台
        });
		
		var gridstore = this.store;

		var me = this;

		var win;
		var form = Ext.create("Ext.form.Panel", {
			frame : true,
			defaultType : 'textfield',
			items : [{
				xtype : 'hiddenfield',
				name : 'id'
			}, {
				id : 'name',
				name : 'name',
				fieldLabel : '商品名称',
				anchor : '60%',
				allowBlank : false
			}, {
				id : 'category',
				name : 'category',
				fieldLabel : '商品类别',
				xtype : 'combo',
				store : me.categoryStore,
				displayField : "cname",
				valueField : "cname",
				queryMode : 'remote',
				allowBlank : false
			}, {
				id : 'originalPrice',
				name : 'originalPrice',
				fieldLabel : '商品原价',
				minValue : 0.01, 
				xtype : 'numberfield',
				allowBlank : false
			}, {
				id : 'currentPrice',
				name : 'currentPrice',
				minValue : 0.01,
				xtype : 'numberfield',
				fieldLabel : '商品现价',
				allowBlank : false
			}, {
				id : 'orderValue',
				name : 'orderValue',
				minValue : 0,
				value : 0,
				xtype : 'numberfield',
				allowDecimals : false,
				fieldLabel : '排序数值',
				allowBlank : false
			}, {
				id : 'productPicturePanel',
				pArray : [], 
				xtype : 'panel', 
				frame : true, 
				anchor : '100%',
				height : 140,
				layout: {
			        type: 'hbox',
			        pack: 'start',              //纵向对齐方式 start：从顶部；center：从中部；end：从底部
			        align: 'stretchmax'             //对齐方式 center、left、right：居中、左对齐、右对齐；stretch：延伸；stretchmax：以最大的元素为标准延伸
			    },
			    defaults: {
			        xtype: 'button'
			    },
			    items: [{
			    	xtype : 'form', 
					id : 'uploadPictureForm1',
					url : serverUrl + '/mall/manager/product/uploadPicture',
					frame : true, 
					width : 200, 
					height : 130, 
					layout : {
						type : 'vbox'
					},
					items : [{
						id : 'pictureUrlImg1', 
						xtype : 'image',
						width : 190,
						height : 100
					}, {
	    				xtype : 'filefield', 
	    				buttonText : '商品标签图片上传...', 
	    				buttonOnly : true,
	    				name : 'file1',
	    				listeners : {
	    					change : function(field, value, eOpts) {
	    						var f = this.up("form").getForm();
	    						f.submit({
	    							waitMsg : '图片保存中......',
	    							method : 'POST',
	    							success : function(form, action) {
	    								var img = Ext.getCmp("pictureUrlImg1");
	    								img.setSrc(action.result.msg);
	    								var imgField = Ext.getCmp("pictureUrlField");
	    								imgField.setValue(action.result.msg);
//	    								Ext.Msg.alert('成功', action.result.msg);
	    							}, 
	    							failure: function(form, action) {
	    								Ext.Msg.alert('抱歉', '服务器异常！');
	    							}
	    						});
	    					}
	    				}
					}]
			    }, {
			    	xtype : 'displayfield', 
			    	fieldLabel : '',
			    	width : 10
			    }, 
			    
			    {
			    	xtype : 'form', 
					id : 'uploadPictureForm2',
					url : serverUrl + '/mall/manager/product/uploadPicture',
					frame : true, 
					width : 110, 
					height : 130, 
					layout : {
						type : 'vbox'
					},
					items : [{
						id : 'pictureUrlImg2', 
						xtype : 'image',
						width : 100,
						height : 100
					}, {
	    				xtype : 'filefield', 
	    				buttonText : '详情图片1上传...', 
	    				buttonOnly : true,
	    				name : 'file1',
	    				listeners : {
	    					change : function(field, value, eOpts) {
	    						var f = this.up("form").getForm();
	    						f.submit({
	    							waitMsg : '图片保存中......',
	    							method : 'POST',
	    							success : function(form, action) {
	    								var img = Ext.getCmp("pictureUrlImg2");
	    								img.setSrc(action.result.msg);
//	    								Ext.Msg.alert('成功', action.result.msg);
	    								
	    								// 重新计算图片列表
	    								var pArray = Ext.getCmp("productPicturePanel")["pArray"];
	    								pArray[0] = action.result.msg; 
	    								var plistField = Ext.getCmp("pictureUrlList");
	    								plistField.setValue(pArray.join(","));
	    							}, 
	    							failure: function(form, action) {
	    								Ext.Msg.alert('抱歉', '服务器异常！');
	    							}
	    						});
	    					}
	    				}
					}]
			    }, {
			    	xtype : 'form', 
					id : 'uploadPictureForm3',
					url : serverUrl + '/mall/manager/product/uploadPicture',
					frame : true, 
					width : 110, 
					height : 130, 
					layout : {
						type : 'vbox'
					},
					items : [{
						id : 'pictureUrlImg3', 
						xtype : 'image',
						width : 100,
						height : 100
					}, {
	    				xtype : 'filefield', 
	    				buttonText : '详情图片2上传...', 
	    				buttonOnly : true,
	    				name : 'file1',
	    				listeners : {
	    					change : function(field, value, eOpts) {
	    						var f = this.up("form").getForm();
	    						f.submit({
	    							waitMsg : '图片保存中......',
	    							method : 'POST',
	    							success : function(form, action) {
	    								var img = Ext.getCmp("pictureUrlImg3");
	    								img.setSrc(action.result.msg);
//	    								Ext.Msg.alert('成功', action.result.msg);
	    								// 重新计算图片列表
	    								var pArray = Ext.getCmp("productPicturePanel")["pArray"];
	    								pArray[1] = action.result.msg; 
	    								var plistField = Ext.getCmp("pictureUrlList");
	    								plistField.setValue(pArray.join(","));
	    							}, 
	    							failure: function(form, action) {
	    								Ext.Msg.alert('抱歉', '服务器异常！');
	    							}
	    						});
	    					}
	    				}
					}]
			    }, {
			    	xtype : 'form', 
					id : 'uploadPictureForm4',
					url : serverUrl + '/mall/manager/product/uploadPicture',
					frame : true, 
					width : 110, 
					height : 130, 
					layout : {
						type : 'vbox'
					},
					items : [{
						id : 'pictureUrlImg4', 
						xtype : 'image',
						width : 100,
						height : 100
					}, {
	    				xtype : 'filefield', 
	    				buttonText : '详情图片3上传...', 
	    				buttonOnly : true,
	    				name : 'file1',
	    				listeners : {
	    					change : function(field, value, eOpts) {
	    						var f = this.up("form").getForm();
	    						f.submit({
	    							waitMsg : '图片保存中......',
	    							method : 'POST',
	    							success : function(form, action) {
	    								var img = Ext.getCmp("pictureUrlImg4");
	    								img.setSrc(action.result.msg);
//	    								Ext.Msg.alert('成功', action.result.msg);
	    								// 重新计算图片列表
	    								var pArray = Ext.getCmp("productPicturePanel")["pArray"];
	    								pArray[2] = action.result.msg; 
	    								var plistField = Ext.getCmp("pictureUrlList");
	    								plistField.setValue(pArray.join(","));
	    							}, 
	    							failure: function(form, action) {
	    								Ext.Msg.alert('抱歉', '服务器异常！');
	    							}
	    						});
	    					}
	    				}
					}]
			    }, {
			    	xtype : 'form', 
					id : 'uploadPictureForm5',
					url : serverUrl + '/mall/manager/product/uploadPicture',
					frame : true, 
					width : 110, 
					height : 130, 
					layout : {
						type : 'vbox'
					},
					items : [{
						id : 'pictureUrlImg5', 
						xtype : 'image',
						width : 100,
						height : 100
					}, {
	    				xtype : 'filefield', 
	    				buttonText : '详情图片4上传...', 
	    				buttonOnly : true,
	    				name : 'file1',
	    				listeners : {
	    					change : function(field, value, eOpts) {
	    						var f = this.up("form").getForm();
	    						f.submit({
	    							waitMsg : '图片保存中......',
	    							method : 'POST',
	    							success : function(form, action) {
	    								var img = Ext.getCmp("pictureUrlImg5");
	    								img.setSrc(action.result.msg);
//	    								Ext.Msg.alert('成功', action.result.msg);
	    								// 重新计算图片列表
	    								var pArray = Ext.getCmp("productPicturePanel")["pArray"];
	    								pArray[3] = action.result.msg; 
	    								var plistField = Ext.getCmp("pictureUrlList");
	    								plistField.setValue(pArray.join(","));
	    							}, 
	    							failure: function(form, action) {
	    								Ext.Msg.alert('抱歉', '服务器异常！');
	    							}
	    						});
	    					}
	    				}
					}]
			    }, {
			    	xtype : 'form', 
					id : 'uploadPictureForm6',
					url : serverUrl + '/mall/manager/product/uploadPicture',
					frame : true, 
					width : 110, 
					height : 130, 
					layout : {
						type : 'vbox'
					},
					items : [{
						id : 'pictureUrlImg6', 
						xtype : 'image',
						width : 100,
						height : 100
					}, {
	    				xtype : 'filefield', 
	    				buttonText : '详情图片5上传...', 
	    				buttonOnly : true,
	    				name : 'file1',
	    				listeners : {
	    					change : function(field, value, eOpts) {
	    						var f = this.up("form").getForm();
	    						f.submit({
	    							waitMsg : '图片保存中......',
	    							method : 'POST',
	    							success : function(form, action) {
	    								var img = Ext.getCmp("pictureUrlImg6");
	    								img.setSrc(action.result.msg);
//	    								Ext.Msg.alert('成功', action.result.msg);
	    								// 重新计算图片列表
	    								var pArray = Ext.getCmp("productPicturePanel")["pArray"];
	    								pArray[4] = action.result.msg; 
	    								var plistField = Ext.getCmp("pictureUrlList");
	    								plistField.setValue(pArray.join(","));
	    							}, 
	    							failure: function(form, action) {
	    								Ext.Msg.alert('抱歉', '服务器异常！');
	    							}
	    						});
	    					}
	    				}
					}]
			    }]
			}, {
				id : 'pictureUrlField', 
				name : 'pictureUrl', 
				xtype : 'hiddenfield'
			}, {
				id : 'productExternalUrl', 
				name : 'productExternalUrl', 
				anchor : '100%',
				fieldLabel : '商品外链'
			}, {
				id : 'pictureUrlList', 
				name : 'pictureUrlList',
				xtype : 'hiddenfield'
			}, {
				id : 'summary',
				name : 'summary',
				xtype : 'textareafield',
				anchor : '100%',
				height : '100', 
				fieldLabel : '商品简介',
				allowBlank : false
			}, {
				id : 'productDesc', 
				name : 'productDesc', 
				fieldLabel : '商品详述',
				anchor : '100%', 
				height : 330, 
				xtype : 'htmleditor', 
				submitValue: false,
	            regex: /^[^\\'‘’]+$/,
	            regexText: "不能包含单引号",
	            autoScroll : true, 
	            plugins: [myHtmlEditor]
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
					var busvo = f.getFieldValues();
					Ext.Ajax.request({
						url : serverUrl + '/mall/manager/product',
						method : record ? 'PUT' : 'POST',
						jsonData : Ext.JSON.encode(busvo),
						success : function(response, options) {
							Ext.Msg.alert('成功', '商品添加成功！');
							win.close();
							gridstore.load();
						}
					});
				}
			}]
		});
		
		// 表单赋值
		if (record) {	
			form.getForm().setValues(record.data);
			
			// 标签图片
			var img = Ext.getCmp("pictureUrlImg1");
			img.setSrc(record.data['pictureUrl']);
			
			// 设置详细图片列表
			var pictureUrlList = record.data['pictureUrlList'];
			var pArray = Ext.getCmp("productPicturePanel")["pArray"];
			if (pictureUrlList) {
				var parray = pictureUrlList.split(",");
				for (var i = 0; i < parray.length; i++) {
					img = Ext.getCmp("pictureUrlImg" + (i + 2));
					img.setSrc(parray[i]);
					pArray[i] = parray[i];
				}
			}
		}
		
		win = Ext.create("Ext.window.Window", {
			width : 400,
			height : 500,
			maximizable : true,
			title : '新增商品信息',
			layout : 'fit',
			items : [form],
			modal : true
		});
		win.show();
		
	},
	
	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('productManager');
		if (!win) {
			win = desktop.createWindow({
				id : 'productManager',
				title : '商品信息管理',
				width : 600,
				height : 400,
				iconCls : 'notepad',
				animCollapse : false,
				border : false,
				hideMode : 'offsets',
				layout : 'fit',
				items : [
					this.createProductManagerGrid()
				]
			});
		}
		win.show();
		return win;
	}
});
