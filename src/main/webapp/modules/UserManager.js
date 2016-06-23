//Ext.Loader.setConfig({enabled: true});

Ext.Loader.setPath('Ext.ux', '/jscomponent/extjs/ux/');
var seleceadminuserId;
var roleids;
function cretaeRoleWin(){
    	//创建model
		Ext.define('RoleModel',{
			extend: 'Ext.data.Model',
			fields:[
			    'roleId',
			    'role'
			]
		});
		
		//创建store
		var store=Ext.create('Ext.data.Store',{
			model:'RoleModel',
			pageSize:5,
			//是否在服务端排序
			remoteSort: true,
			proxy:{
				type:'ajax',
				url:'/cosmetics/findrolelist.do',
				reader:{
					root:'roles',
					totalProperty:'totalCount'
				}
			}
		});
		//定义复选框
		var smrow=Ext.create('Ext.selection.CheckboxModel');
		var rolegrid=Ext.create('Ext.grid.Panel',{
			store:store,
			border: false,
			columnLines: true, 
			disableSelection: false,
			selModel :smrow,
			columns:[{
				dataIndex:'roleId',
				name:'roleId',
				flex: 1,
				hidden:true
			},{
				text:'角色',
				anchor:'30%',
				sortable:false,
				dataIndex:'role'
			}],
			bbar: Ext.create('Ext.PagingToolbar', { 
	            store: store, 
	            displayInfo: true, 
	            displayMsg: '显示 {0} - {1} 条，共计 {2} 条', 
	            emptyMsg: "没有数据" 
	        }),
	        tbar:[{
	        	width:300,
	        	fieldLabel:'搜素',
	        	xtype:'searchfield',
	        	labelWidth:50,
	        	store: store 
	        }]
		});
		store.loadPage(1);
		var win=Ext.create('Ext.window.Window',{
			title:'角色',
            width:400,
            height:300,
            border: false,
			resizable:false,
			closable :true,
            animCollapse:false,
            hideMode: 'offsets',
            layout: 'fit',
            modal: true,
            items: [rolegrid],
            close:function(){
            	var record=rolegrid.getSelectionModel().getSelection();
            	if(record.length==0){
            		Ext.Msg.alert('错误','请选择一个角色！');
        			return;
            	}else{
            		roleids="(";
            		for(var i=0;i<record.length;i++){
            			roleids+="'"+record[i].get('roleId')+"',";
            		}
            		roleids=roleids.substring(0,roleids.length-1)+")";
            		Ext.Ajax.request({
            			url:'/cosmetics/addroletoUser.do',
            			method:'POST',
            			params:{
            				adminuserId:seleceadminuserId,
            				roleId:roleids
            			},
            			success:function(response,options){
            				if(response.responseText=='addok\r\n'){
            					Ext.Msg.alert('成功','角色分配成功，请重新打开用户管理界面查看！');
            				}
            			}
            		});
            		win.hide();            		
            	}
            }
		});
		win.show();
		return true;
}

Ext.define('Cosmetics.UserManager', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
	 	 'Ext.ux.form.SearchField'
    ],

    id:'adminusermanager',

    init : function(){
        this.launcher = {
            text: '用户管理',
            iconCls:'notepad',
            handler : this.createWindow,
            scope: this
        };
    },
    
    //用户信息查看与维护的grid
    createuserinfoGrid:function(){
    	//创建model
		Ext.define('AdminUserModel',{
			extend: 'Ext.data.Model',
			fields:[
			    'adminuserId',
			    'adminusername',
			    'adminrealname',
			    'role'
			]
		});
		
		//创建store
		var store=Ext.create('Ext.data.Store',{
			model:'AdminUserModel',
			pageSize:10,
			//是否在服务端排序
			remoteSort: true,
			proxy:{
				type:'ajax',
				url:'/cosmetics/queryuserList.do',
				reader:{
					root:'users',
					totalProperty:'totalCount'
				}
			}
		});
		var usergrid=Ext.create('Ext.grid.Panel',{
			width:500,
			height:300,
			store:store,
			border: false,
			columnLines: true, 
			disableSelection: false,
			columns:[
			new Ext.grid.RowNumberer(),
			{
				dataIndex:'adminuserId',
				name:'adminuserId',
				flex: 1,
				hidden:true
			},{
				text:'登录名',
				anchor:'30%',
				sortable:false,
				dataIndex:'adminusername'
			},{
				text:'姓名',
				sortable:false,
				dataIndex:'adminrealname'
			},{
				text:'角色',
				anchor:'30%',
				sortable:false,
				dataIndex:'role'
			}],
			bbar: Ext.create('Ext.PagingToolbar', { 
	            store: store, 
	            displayInfo: true, 
	            displayMsg: '显示 {0} - {1} 条，共计 {2} 条', 
	            emptyMsg: "没有数据" 
	        }),
	        tbar:[{
	        	width:300,
	        	fieldLabel:'搜素',
	        	xtype:'searchfield',
	        	labelWidth:50,
	        	store: store 
	        },{
	        	xtype:'button',
	        	text:'角色分配',
	        	width:80,
	        	handler:function(){
	        		var record=usergrid.getSelectionModel().getSelection();
	        		if(record.length==0){
	        			Ext.Msg.alert('错误','请选择一个用户！');
        				return;
	        		}else{
	        			seleceadminuserId=record[0].get('adminuserId');
	        			cretaeRoleWin()
	        		}
	        	}
	        }]
		});
		store.loadPage(1);
		return usergrid;
    },
    
    
    
    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow('notepad1');
        if(!win){
            win = desktop.createWindow({
                id: 'adminusermanager',
                title:'用户管理',
                width:400,
                height:300,
                iconCls: 'notepad',
                animCollapse:false,
                border: false,
                hideMode: 'offsets',
                layout: 'fit',
                items: [this.createuserinfoGrid()]
            });
        }
        win.show();
        return win;
    }
});

