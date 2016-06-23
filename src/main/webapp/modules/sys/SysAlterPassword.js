
Ext.define('BatteryBusSystem.SysAlterPassword', {
	extend : 'Ext.ux.desktop.Module',

	requires : [
		
	], 
	
	id : 'sysalterpassword',
	
	init : function() {
		
	},
	
	createAlterForm : function () {
		var me = this;
		
		var form = Ext.create("Ext.form.Panel", {
			frame : true,
			defaultType : 'textfield',
			items : [{
				id : 'sourcepassword',
				name : 'sourcepassword',
				fieldLabel : '原始密码',
				allowBlank : false
			}, {
				id : 'newpassword',
				name : 'newpassword',
				fieldLabel : '修改密码',
				allowBlank : false
			}, {
				id : 'confirmnewpassword',
				name : 'confirmnewpassword',
				fieldLabel : '确认密码',
				validator : function (value) {
					var nv = form.getForm().findField('newpassword').getValue();
					if (value != nv) 
						return "确认密码不一致！";
					else
						return true;
				}
			}],
			buttons : [{
				text : '重置',
				handler : function() {
					this.up('form').getForm().reset();
				}
			}, {
				text : '提交', 
				disabled: true,
                formBind: true,
				handler : function() {
					var f = this.up('form').getForm();
					var url = '/busbatterysystem/web/security/sysUserController/updatepassword';
					f.submit({
						clientValidation : true,
						url : url,
						method : 'POST',
						success : function(form, action) {
							Ext.Msg.alert('成功', action.result.msg);
						}, 
						failure: function(form, action) {
							if (action && action.result && action.result.msg) 
								Ext.Msg.alert('失败', action.result.msg);
							else {
								var result = Ext.JSON.decode(action.response.responseText, true);
								if (result['filterflag']) {
									Ext.Msg.alert('抱歉', result['message']);
								} else {
									Ext.Msg.alert('抱歉', '服务器异常！');
								}
							}
						},
						waitMsg: '保存中......'
					});
				}
			}]
		});
		return form;
	},
	
	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('sysalterpassword');
		if (!win) {
			win = desktop.createWindow({
				id : 'sysalterpassword',
				title : '用户密码修改',
				width : 300,
				height : 200,
				iconCls : 'notepad',
				animCollapse : false,
				border : false,
				hideMode : 'offsets',
				layout : 'fit',
				items : [
					this.createAlterForm()
				]
			});
		}
		win.show();
		return win;
	}
});