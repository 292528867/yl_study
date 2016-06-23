/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/*!
* Ext JS Library 4.0
* Copyright(c) 2006-2011 Sencha Inc.
* licensing@sencha.com
* http://www.sencha.com/license
*/

Ext.define('BatteryBusSystem.TableMonitor', {
    extend: 'Ext.ux.desktop.Module',
    requires: [
        'Ext.chart.*',
        'Ext.grid.*',
	    'Ext.util.*',
	    'Ext.ux.data.PagingMemoryProxy',
	    'widget.uxNotification',
	    'Ext.ux.ProgressBarPager'
    ],

    id: 'table-win',

    refreshRate: 500,

    init : function() {
        // No launcher means we don't appear on the Start Menu...

    },
	//一个新的整体的Panel
    createNewWindow: function (ad) {
        var me = this;
        var sitv=null;
        var zbh=null;
        var alarmCode2=null;
        var version2=null;
        var bjbm=0;
        if(ad==undefined){
    		ad = this.app.getDesktop();
    	}
            desktop = ad;
            //运营公司
		var syygs = Ext.create('Ext.data.Store', {
    		model: 'Plates',
		    fields: ['gscode', 'name'],
		    data : {'items':[
		        {"gscode":"JG", "name":"金高"},
		        {"gscode":"YG", "name":"杨高"},
		        {"gscode":"SN", "name":"上南"},
		        {"gscode":"NH", "name":"南汇"}
		        //...
		    ]},
		    proxy:{
		    	type:'memory',
		    	reader:{
		    		type:'json',
		    		root:'items'
		    	}
		    }
		});
		//生产厂商
		var sccs = Ext.create('Ext.data.Store', {
    		model: 'Title',
		    fields: ['cscode', 'name'],
		    data : {'itemst':[
		        {"cscode":"WX", "name":"万象"},
		        {"cscode":"SL", "name":"申龙"},
		        {"cscode":"SW", "name":"申沃"}
		        //...
		    ]},
		    proxy:{
		    	type:'memory',
		    	reader:{
		    		type:'json',
		    		root:'itemst'
		    	}
		    }
		});
		Ext.define('TabStc', {
		     extend: 'Ext.data.Model',
		     fields: [
		            'clzbh2',
		            'dateq2',
		            'alarmDesc2',
		            'alarmLevel2'
				     ]
				 });
		 var stc = Ext.create('Ext.data.Store', {
		     model: 'TabStc',
		     remoteSort: true,
		     pageSize: 5,
		     proxy: {
		         type: 'ajax',
		         url: '/busbatterysystem/Battery_MinJK.do',
		         reader:{
					type:'json',
					totalProperty:'totalCount',
					root : 'DataPlates'
				 }
		     }
		 });
		// 右下角弹出框
		var reusable = Ext.create('widget.uxNotification', {
							title: '警告',
							manager: 'demo1',
							closeAction: 'hide',
							width: '300px',
							position: 'br',
            				height: '200px',
            				items: {  
						        xtype: 'grid',
						        border: false,
						        height: '90%',
						        columns: [
						        new Ext.grid.RowNumberer(),
						        {
	                                text: "车辆编号",
	                                sortable: true,
	                                align:'center',
	                                dataIndex: 'clzbh2'
	                            },{
	                                text: "错误代码",
	                                sortable: true,
	                                align:'center',
	                                dataIndex: 'alarmDesc2'
	                            },{
	                                text: "报警时间",
	                                sortable: true,
	                                align:'center',
	                                dataIndex: 'dateq2'
	                            }],                 // 仅仅用来显示一个头部。没有数据，
						        store: stc,
						        listeners: {
						        	itemdblclick:function(dataview, record, item, index, e){
						        		//systemm(record.data.clzbh2);   //显示
						        		var d=new BatteryBusSystem.TableMonitor();
						        		d.createWindow();
						        	}
						        },
						        bbar: Ext.create('Ext.PagingToolbar', {
						             store: stc,
						             pageSize: 5,
						             displayInfo: true
						        })
						    }
		});
		
		var flagStroe= Ext.create('Ext.data.Store', {   
					    fields: ['id', 'name'],
		     data : [
		     {'id':'1','name':'已查看'},
		     {'id':'2','name':'已通知司机'},
		     {'id':'3','name':'已通知厂商'}
		     ]   
		});
		
		  Ext.define('TabPlateModel', {
		     extend: 'Ext.data.Model',
		     fields: [
		            'clzbh2',
		            'date2',
		            'sccs2',
		            'ssgs2',
		            'ssfgs2',
		            'xlmc2',
		            'dateq2',
		            'fid2',
		            'tid2',
		            'version2',
		            'alarmCode2',
		            'alarmcount2',
		            'alarmLevel2',
		            'alarmType2',
		            'alarmDesc2',
		            'zb'
				     ]
				 });
		 var storeb = Ext.create('Ext.data.Store', {
		     model: 'TabPlateModel',
		     remoteSort: true,
		     pageSize: 15,
		     proxy: {
		         type: 'ajax',
		         url: '/busbatterysystem/Battery_JK.do',
		         reader:{
					type:'json',
					totalProperty:'totalCount',
					root : 'DataPlates'
				 }
		     }
		 });
		  Ext.define('TabModel', {
		     extend: 'Ext.data.Model',
		     fields: [
		            'clzbh',
		            'clzbh',
		            'sccs',
		            'ssgs',
		            'xlmc',
		            'first_alarm_date',
		            'last_alarm_date',
		            'alarmcounts1',
		            'alarmlevel1',
		            'alarmtype1',
		            'alarmdesc1',
		            'status1',
		            'version1',
		            'first_deal_user',
		            'first_deal_date',
		            'last_deal_user',
		            'last_deal_date'
				     ]
				 });
		 var storeA = Ext.create('Ext.data.Store', {
		     model: 'TabModel',
		     remoteSort: true,
		     pageSize:5,
		     proxy: {
		         type: 'ajax',
		         url: '/busbatterysystem/Battery_TabJK.do',
		         reader:{
					type:'json',
					totalProperty:'totalCount',
					root : 'DataPlates'
				 }
		     }
		 });
		storeA.load();
		storeb.load();
		sitv=setInterval(
			function(){
				stc.load();
				if(!reusable){
					reusable.update();
					reusable.show();
				}else{
					reusable.show();
				}
				storeA.load();
				storeb.load();
			}, 12000
		);  
        var bok= desktop.createWindow({
	            id: 'table-win',
	            title:'预警信息',
	            height: 500,
	            width: 700,
	             layout: {
	            type: 'border',
	            padding: 5
	        },
	        defaults: {
	            split: true
	        },
	        items: [{
	            region: 'north',
	            collapsible: true,
	            title: '查询',
	            height: 60,
	            minHeight: 40,
	            items: [ {                    // Details 面板作为一个配置进来的Panel (没有用xtype指定，默认是 'panel').
			        bodyPadding: 5,
			        layout: {
				        type: 'hbox'       
				    },
				    defaults:{margins:'0 10 0 0'}, 
			        items: [{
			        	border:false,
				            fieldLabel: '车编号',
				           xtype: 'textfield',
				            id: 'clcode',
						    valueField : 'clcode'
				        },{
				            fieldLabel: '线路',
				            xtype: 'textfield',
				            id: 'xlcode',
						    valueField : 'xlcode'
			        },{
			        	border:false,
				            fieldLabel: '运营公司',
				            xtype: 'combobox',
				            id: 'gscode',
				            store: syygs,
				            queryMode: 'local',
						    displayField: 'name',
						    valueField : 'gscode'
				        },{
			        	fieldLabel: '生产厂商',
			            xtype: 'combobox',
			            id: 'cscode',
			            store: sccs,
			            queryMode: 'local',
					    displayField: 'name',
					    valueField : 'cscode'
			        },{
			        	border:false,
					        	xtype:'button',
		                        scale: 'medium',
		                        text: '查询',
		                        height:22,
		                         listeners: {
									click:function(me,e,eOpts ){
										 var data=[];
										 var alarmDesc="";
										 var i=0;
										 //编号查询
										 if(Ext.getCmp('clcode').getValue()!=""){
											 storeb.each(function(record) {   
										        if(record.get('clzbh2')==Ext.getCmp('clcode').getValue()&&alarmDesc!=record.get('alarmDesc2')){
										        	var index = storeb.find('clzbh2',Ext.getCmp('clcode').getValue(),i,false,false);
										        	alarmDesc=record.get('alarmDesc2');
										        	i=index+1;
										        	data.push(record.data);
										        }
										     });
									     }
									     //线路查询
									     if(Ext.getCmp('xlcode').getValue()!=""){
										     storeb.each(function(record) {   
										        if(record.get('xlmc2')==Ext.getCmp('xlcode').getValue()){
										        	var index = storeb.find('xlmc2',Ext.getCmp('xlcode').getValue(),i,false,false);
										        	i=index+1;
										        	data.push(record.data);
										        }
										     });
									     }
									     if(Ext.getCmp('gscode').getValue()!=null){
									     	storeb.each(function(record) {  
									     	var gscode=Ext.getCmp('gscode').getValue() 
									     		if(gscode=='JG'){
									     			gscode='金高公司';
									     		}
									     		if(gscode=='YG'){
									     			gscode='杨高公司';
									     		}
									     		if(gscode=='SN'){
									     			gscode='上南公司';
									     		}
									     		if(gscode=='NH'){
									     			gscode='南汇公司';
									     		}
										        if(record.get('ssgs2')==gscode){
										        	var index = storeb.find('ssgs2',Ext.getCmp('gscode').getValue(),i,false,false);
										        	i=index+1;
										        	data.push(record.data);
										        }
										     });
									     }
									     if(Ext.getCmp('cscode').getValue()!=null){
									     	storeb.each(function(record) {  
									     	var cscode=Ext.getCmp('cscode').getValue() 
									     		if(cscode=='WX'){
									     			cscode='万象客车';
									     		}
									     		if(cscode=='SL'){
									     			cscode='申龙客车';
									     		}
									     		if(cscode=='SW'){
									     			cscode='申沃客车';
									     		}
										        if(record.get('sccs2')==cscode){
										        	var index = storeb.find('sccs2',Ext.getCmp('cscode').getValue(),i,false,false);
										        	i=index+1;
										        	data.push(record.data);
										        }
										     });
									     }
									     if(Ext.getCmp('clcode').getValue()!=""||Ext.getCmp('xlcode').getValue()!=""||Ext.getCmp('gscode').getValue()!=null||Ext.getCmp('cscode').getValue()!=null){
										     var clzbh=Ext.getCmp('clcode').getValue();
										     var xlmc=Ext.getCmp('xlcode').getValue();
										     var ssgs=Ext.getCmp('gscode').getValue();
										     var sccs=Ext.getCmp('cscode').getValue();
										     if(clzbh=="")
										     if(xlmc=="")
										     if(ssgs==null){
										     	ssgs="";
										     }
										     if(clzbh==null){
										     	clzbh="";
										     }
										     	Ext.Ajax.request({
													method : 'GET',
												    url: '/busbatterysystem/Battery_queryJK.do',
												    params: {
												        clzbh:clzbh,
												        xlmc:xlmc,
												        ssgs:ssgs,
												        sccs:sccs,
												        page:Ext.getCmp('mygrid2').getStore().currentPage,
												        limit:Ext.getCmp('mygrid2').getStore().pageSize
												    },
												    success: function(result, request){
														//storeA.loadData();
														var responseTexts = Ext.decode(result.responseText);  
														console.log(responseTexts);
														storeA.loadData(responseTexts.DataPlates,false);
														storeb.loadData(data,false);
														
												    }
												 });
												/* console.log(Ext.getCmp('mygrid2').getStore());
												 alert(Ext.getCmp('mygrid2').getStore().currentPage+"-----"+Ext.getCmp('mygrid2').getStore().pageSize);*/
									     }
									     //alert("clcode:"+Ext.getCmp('clcode').getValue()+"  xlcode:"+Ext.getCmp('xlcode').getValue()+"  gscode:"+Ext.getCmp('gscode').getValue()+"  cscode:"+Ext.getCmp('cscode').getValue());
									}
		                         }
			        }
			        ] // 表单元素(文本域)
			        
			    }]
        },{
            region: 'center',
            layout: 'border',
            border: false,
            items: [{
                region: 'center',
                minHeight: 40,
                title: '实时信息',
			        xtype: 'grid',		// 指定一个grid子元素
			        height:'65%  80%',
			        id:'mygrid',
			        store:storeb,
			        autoScroll:true,
			        plugins:[
			        	Ext.create('Ext.grid.plugin.CellEditing',{
			        		clicksToEdit: 1
			    		})
			        ],
			        columns: [
			         new Ext.grid.RowNumberer(),
                            {
                            	flex: 0.5,
                                text: "车辆编号",
                                sortable: true,
                                align:'center',
                                id: 'clzbh2',
                                hideable:false,
                                dataIndex: 'clzbh2'
                            },
                            {
                                text: "生产厂商",
                                flex: 0.5,
                                sortable: true,
                                align:'center',
                                id: 'sccs2',
                                dataIndex: 'sccs2'
                            },
                            {
                                text: "所属公司",
                                flex: 0.5,
                                sortable: true,
                                align:'center',
                                id: 'ssgs2',
                                dataIndex: 'ssgs2'
                            },
                            {
                            	flex: 0.6,
                                text: "分公司",
                                sortable: true,
                                align:'center',
                                id: 'ssfgs2',
                                dataIndex: 'ssfgs2'
                            },
                            {
                            	flex: 0.5,
                                text: "线路",
                                sortable: true,
                                align:'center',
                                id: 'xlmc2',
                                dataIndex: 'xlmc2'
                            },
                            {
                                text: "首次报警时间",
                                flex: 1,
                                sortable: true,
                                align:'center',
                                id: 'date2',
                                dataIndex: 'date2'
                            },
                            {
                            	flex: 1,
                                text: "最近报警时间",
                                sortable: true,
                                align:'center',
                                id: 'dateq2',
                                dataIndex: 'dateq2'
                            },
                            {
                            	flex: 0.5,
                                text: "报警次数",
                                sortable: true,
                                align:'center',
                                id: 'alarmcount2',
                                dataIndex: 'alarmcount2'
                            },
                            {
                            	flex: 0.5,
                                text: "报警级别",
                                sortable: true,
                                align:'center',
                                id: 'alarmLevel2',
                                dataIndex: 'alarmLevel2'
                            },
                             {
                                text: "故障类别",
                                flex: 1,
                                sortable: true,
                                align:'center',
                                id: 'alarmType2',
                                dataIndex: 'alarmType2'
                            },
                             {
                                text: "故障详细",
                                flex: 1,
                                sortable: true,
                                align:'center',
                                id: 'alarmDesc2',
                                dataIndex: 'alarmDesc2'
                            },
                            {
                                id: 'alarmCode2',
                                hidden:true,
                                hideable:false,
                                dataIndex: 'alarmCode2'
                            },
                            {
                                id: 'version2',
                                hidden:true,
                                hideable:false,
                                dataIndex: 'version2'
                            },
                            {
								header: '操作动作',
					            dataIndex: 'light',
					            flex: 0.8,
					            align:'center',
					            editor: {
					                xtype: 'combobox',
					                typeAhead: true,	
					                triggerAction: 'all',
					                selectOnTab: true,
					                store: flagStroe,
					                hiddenName : 'id',
					                displayField:'name', //值
									valueField:'id', //代码
									forceSelection : true,   
					                lazyRender: true,
					                Editable:false,
						            listeners: {
		                            	select:function(combo, records, eOpts ){
		                            	var status2=combo.getValue();
											Ext.Ajax.request({
												method : 'GET',
											    url: '/busbatterysystem/Battery_click.do',
											    params: {
											        zbh: zbh,
											        alarmCode:alarmCode2,
											        status:status2,
											        version:version2
											    },
											    success: function(response){
													storeA.load();
													storeb.load();
											    }
											 });
											 Ext.getCmp('mygrid').focus();;
		                            	}
		                            	/*,	//内容修改后取消编辑
		                            	change:function(combo,newValue,oldValue,eOpts){
		                            		Ext.getCmp('mygrid').getPlugin().cancelEdit();
		                            	}*/
		                            }
					            }
							},
							{
								id:'ckzt2',
								text: "查看状态",
                                flex: 0.5,
                                align:'center',
								renderer: function(){
									var se='<div name="imgs"><img  src="js/images/l_new.png" /></div>'
									return se;	
								}
							},
                            {
                                text: "查看地图",
                                flex: 0.5,
                                sortable: true,
                                align:'center',
                                id:'zb',
                                dataIndex: 'zb',
                                listeners: {
									itemdbclick:function(mygrid, record, item, index, e, eOpts ){
										var zb="clzbh="+record.get('clzbh2')+"|clcjl="+record.get('sa_spn_fmi_fault_Desc22')+"|zb="+record.get('zb')+"";
										dd(zb);
									}
								}
                            },
                            {
                                id: 'fid2',
                                hidden:true,
                                hideable:false,
                                dataIndex: 'fid2'
                            },
                            {
                                id: 'tid2',
                                hidden:true,
                                hideable:false,
                                dataIndex: 'tid2'
                            },
                            {hidden:true,
                             hideable:false,
                            html:'<div id="Sound"></div>'}
                            
					],          
					listeners: {
						load:function(dataview, record, item, index, e){
							/*  加载声音方法 Stat  */
							var div = document.getElementById('Sound'); 
							var url ='';
							if(record.get("gzdj")==1){
								url ="js/mp3/msg.mp3";
							div.innerHTML='<embed  type="application/x-mplayer2"  src="'+url+'" loop="0" autostart="true" hidden="true"></embed>';
							}
							if(record.get("gzdj")==2){
								url ="js/mp3/join.mp3";
							div.innerHTML='<embed  type="application/x-mplayer2"  src="'+url+'" loop="0" autostart="true" hidden="true"></embed>';
							}
							if(record.get("gzdj")==3){
								url ="js/mp3/system.mp3";
							div.innerHTML='<embed  type="application/x-mplayer2"  src="'+url+'" loop="0" autostart="true" hidden="true"></embed>';
							}
							
							/*  加载声音方法 	End   */
							/*  加载右下角弹出框 Stat */
								reusable.update("数据存放位置</br>sss");
								reusable.show();
							/*  加载右下角弹出框 End */
						},
						itemdblclick:function(dataview, record, item, index, e){
								    zbh=record.data.clzbh2;
									alarmCode2=record.data.alarmCode2;
									status2=record.data.status2;
									version2=record.data.version2;
									Ext.Ajax.request({
										method : 'GET',
									    url: '/busbatterysystem/Battery_click.do',
									    params: {
									        zbh: zbh,
									        alarmCode:alarmCode2,
									        status:status2,
									        version:version2
									    },
									    success: function(response){
									    	storeb.load();
									    }
									});
							systemm(record.data.clzbh2);
						},
						beforeitemmouseenter:function(dataview, record, item, index, e){
							  		zbh=record.data.clzbh2;
									alarmCode2=record.data.alarmCode2;
									version2=record.data.version2;
						}
					},	
			        viewConfig:{
						getRowClass: function(r, rowIndex, rowParams, store){
								return "row-error1";
					    }
					},
					bbar: Ext.create('Ext.PagingToolbar', {
			             store: storeb,
			             pageSize: 15,
			             displayInfo: true
			        })
            },{
	                region: 'south',
	                title: '历史数据',
	                split: true,
	                minHeight: 0,
	                collapsible: true,
                	xtype: 'grid',		// 指定一个grid子元素
			        height:'35% 30%',
			        id:'mygrid2',
			        store:storeA,
			        plugins:[
			        	Ext.create('Ext.grid.plugin.CellEditing',{
			        		clicksToEdit: 1
			    		})
			        ],
			        bbar: Ext.create('Ext.PagingToolbar', {
			        	 id:'bbar2',
			             store: storeA,
			             displayInfo: true
			        }),
			        columns: [
			         new Ext.grid.RowNumberer(),
                            {
                                text: "车辆编号",
                                flex: 0.5,
                                sortable: true,
                                align:'center',
                                id: 'clzbh',
                                dataIndex: 'clzbh'
                            },
                            {
                                text: "所属厂商",
                                flex: 0.5,
                                sortable: true,
                                align:'center',
                                id: 'sccs',
                                dataIndex: 'sccs'
                            },
                            {
                            	flex: 0.6,
                                text: "所属公司",
                                sortable: true,
                                align:'center',
                                id: 'ssgs',
                                dataIndex: 'ssgs'
                            },
                            {
                            	flex: 0.5,
                                text: "线路名称",
                                sortable: true,
                                align:'center',
                                id: 'xlmc',
                                dataIndex: 'xlmc'
                            },
                            {
                                text: "首次报警时间",
                                flex: 1,
                                sortable: true,
                                align:'center',
                                id: 'first_alarm_date',
                                dataIndex: 'first_alarm_date'
                            },
                            {
                            	flex: 1,
                                text: "最近报警时间",
                                sortable: true,
                                align:'center',
                                id: 'last_alarm_date',
                                dataIndex: 'last_alarm_date'
                            },
                            {
                            	flex: 0.5,
                                text: "报警次数",
                                sortable: true,
                                align:'center',
                                id: 'alarmcounts1',
                                dataIndex: 'alarmcounts1'
                            },
                            {
                            	flex: 0.5,
                                text: "报警级别",
                                sortable: true,
                                align:'center',
                                id: 'alarmlevel1',
                                dataIndex: 'alarmlevel1'
                            },
                             {
                                text: "故障类别",
                                flex: 1,
                                sortable: true,
                                align:'center',
                                id: 'alarmtype1',
                                dataIndex: 'alarmtype1'
                            },
                             {
                                text: "故障描述",
                                flex: 1,
                                sortable: true,
                                align:'center',
                                id: 'alarmdesc1',
                                dataIndex: 'alarmdesc1'
                            },
                            {
								text: "处理状态",
                                flex: 0.8,
                                sortable: true,
                                align:'center',
                                id: 'status1',
                                dataIndex: 'status1'
							},
							{
                                id: 'version1',
                                hidden:true,
                                hideable:false,
                                dataIndex: 'version1'
                            },
							{
								text: "首次处理用户",
                                flex: 0.5,
                                sortable: true,
                                align:'center',
                                id: 'first_deal_user',
                                dataIndex: 'first_deal_user'
							},
							{
								text: "首次处理时间",
                                flex: 1,
                                sortable: true,
                                align:'center',
                                id: 'first_deal_date',
                                dataIndex: 'first_deal_date'
							}
					],
					listeners: {
						itemdblclick:function(dataview, record, item, index, e){
								    zbh=record.data.clzbh;
									alarmCode=record.data.alarmCode;
									status=record.data.status;
									version=record.data.version;
									Ext.Ajax.request({
										method : 'GET',
									    url: '/busbatterysystem/Battery_click.do',
									    params: {
									        zbh: zbh,
									        alarmCode:alarmCode,
									        status:status,
									        version:version
									    },
									    success: function(response){
									    	storeA.load();
									    }
									});
							systemm(record.data.clzbh2);
						},
						beforeitemmouseenter:function(dataview, record, item, index, e){
							  		zbh=record.data.clzbh;
									alarmCode=record.data.alarmCode;
									version=record.data.version;
						}
					}
            }]
        }]
        });
        return  bok;
    },
    //创建整体面板
    createWindow : function(B) {
    	if(B==undefined){
    		B = this.app.getDesktop();
    	}
    	 desktop = B;
        var win = desktop.getWindow(this.id);
        if (!win) {
            win = this.createNewWindow(desktop);
        }
        win.show();
        return win;
    }
});
function dd(zb){
    	var aa=new BatteryBusSystem.MonitorMap();
		aa.createWindow(desktop,zb); 
}
function systemm(value){
    	var aa=new BatteryBusSystem.SystemMonitor();
		aa.createWindow(desktop,value); 
}

