Ext.require(['*']);
Ext.onReady(function(){
	createloginForm();
});

function createloginForm(){
	//定义登录的Form表单
	var loginform=Ext.create('Ext.form.Panel',{
		width:'100%',
		height:500,
		//frame:true,
		title:'用户登录',
		bodyPadding: 10,
        bodyBorder: true,
		fieldDefaults: {
            labelWidth:100,
			labelStyle:'font-weight:bold;font-size:14px'
        },
        items:[{
        	id:'buyeremail',
        	xtype:'textfield',
        	name:'buyeremail',
        	fieldLabel:'用户名',
        	width:350,
        	allowBlank:false
        },{
        	id:'buyerpassword',
        	xtype:'textfield',
        	name:'buyerpassword',
        	fieldLabel:'密码',
        	width:350,
        	inputType:'password',
        	allowBlank:false
        },{
        	xtype:'button',
        	text:'重置',
        	width:120,
        	handler:function(){
        		this.up('form').getForm().reset();
        	}
        },{
        	xtype:'button',
        	text:'登录',
        	width:120,
        	handler:function(){
        		var form=this.up('form').getForm();
        		if(form.isValid()){
        			Ext.Ajax.request({
        				url:'/cosmetics/adminlogin.do',
        				method:'POST',
        				params:{
        					adminusername:form.findField('buyeremail').getValue(),
        					adminpassword:form.findField('buyerpassword').getValue()
        				},
        				success:function(response,options){
        					var result=response.responseText;
        					if(result=='true\r\n'){
                         		window.location.href="isadminlogin.do";
                         	}else if(result=='false\r\n'){
                         		Ext.Msg.alert('错误','您所输入的登录信息不正确，请重新输入!');
                            	f.reset();
                         	}
        				},
        				failure:function(response,options){
        					Ext.Msg.alert('错误','当前网络不正常，请稍后访问!');
        					form.reset();
        				}
        			});
        		}
        	}
        }]
	});
	
	Ext.create('Ext.Viewport',{
		width:'80%',
		layout:{
			type:'border',
			padding:5
		},
		items: [{
			id:'indexhead',
            region: 'north',
            height: 120,
            html:"<img src='/framework/images/logo.gif'>"
        },{
        	id:'indexcenter',
            region: 'center',
            width:'50%',
            html:"<img src='/framework/images/center.jpg'>"
        },{
        	id:'indexeast',
        	region:'east',
        	width:'50%',
        	items:[loginform]
        },{
        	id:'indexfooter',
            region: 'south',
            height: 120
		}]
	});
}
