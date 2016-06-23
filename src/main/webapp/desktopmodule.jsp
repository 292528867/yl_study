<%-- 这个是App.js的jsp版本，里面的模块定义需要走权限 --%>

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

Ext.define('MyDesktop.App', {
    extend: 'Ext.ux.desktop.App',

    requires: [
    
    	<%-- 这个以下要动态的 --%>
    	<shiro:hasPermission name="sysbatterybusinfo:read">
    		'BatteryBusSystem.SysBatteryBusInfo',
    	</shiro:hasPermission>
    	<shiro:hasPermission name="sysorganization:read">
    		'BatteryBusSystem.SysOrganization',
    	</shiro:hasPermission>
    	<shiro:hasPermission name="sysrole:read">
    		'BatteryBusSystem.SysRole',
    	</shiro:hasPermission>
    	<shiro:hasPermission name="sysresource:read">
    		'BatteryBusSystem.SysResource',
    	</shiro:hasPermission>
    	<shiro:hasPermission name="syspermission:read">
    		'BatteryBusSystem.SysPermission',
    	</shiro:hasPermission>
    	<shiro:hasPermission name="sysalterpassword:read">
    		'BatteryBusSystem.SysAlterPassword',
    	</shiro:hasPermission>
    	<shiro:hasPermission name="table-win:read">
    		'BatteryBusSystem.TableMonitor',
    	</shiro:hasPermission>
    	<shiro:hasPermission name="systemmonitor:read">
    		'BatteryBusSystem.SystemMonitor',
    	</shiro:hasPermission>
    	<shiro:hasPermission name="monitormap:read">
    		'BatteryBusSystem.MonitorMap',
    	</shiro:hasPermission>
    	<%-- 这个以上要动态的 --%>
    	
        'Ext.window.MessageBox',
        'Ext.ux.desktop.ShortcutModel',
		'BatteryBusSystem.Notepad',
        'MyDesktop.SystemStatus',
        'MyDesktop.Settings'
    ],

    init: function() {
        // custom logic before getXYZ methods get called...
		
    	<%-- 这个以下要动态的 --%>
    	this.permissionsModules = [];
		this.permissionsModules.push(new BatteryBusSystem.Notepad());
    	<shiro:hasPermission name="sysbatterybusinfo:read">
    		this.permissionsModules.push(new BatteryBusSystem.SysBatteryBusInfo());
    	</shiro:hasPermission>
    	<shiro:hasPermission name="sysorganization:read">
    		this.permissionsModules.push(new BatteryBusSystem.SysOrganization());
    	</shiro:hasPermission>
    	<shiro:hasPermission name="sysrole:read">
    		this.permissionsModules.push(new BatteryBusSystem.SysRole());
    	</shiro:hasPermission>
    	<shiro:hasPermission name="sysresource:read">
    		this.permissionsModules.push(new BatteryBusSystem.SysResource());
    	</shiro:hasPermission>
    	<shiro:hasPermission name="syspermission:read">
    		this.permissionsModules.push(new BatteryBusSystem.SysPermission());
    	</shiro:hasPermission>
    	<shiro:hasPermission name="sysalterpassword:read">
    		this.permissionsModules.push(new BatteryBusSystem.SysAlterPassword());
    	</shiro:hasPermission>
    	<shiro:hasPermission name="table-win:read">
    		this.permissionsModules.push(new BatteryBusSystem.TableMonitor());
    	</shiro:hasPermission>
    	<shiro:hasPermission name="systemmonitor:read">
    		this.permissionsModules.push(new BatteryBusSystem.SystemMonitor());
    	</shiro:hasPermission>
    	<shiro:hasPermission name="monitormap:read">
    		this.permissionsModules.push(new BatteryBusSystem.MonitorMap());
    	</shiro:hasPermission>
    	<%-- 这个以上要动态的 --%>

        <%-- 这个以下要动态的 --%>
        this.permissionsShortcuts = [];
        this.permissionsShortcuts.push({ name: '记事本', iconCls: 'mynotepad-shortcut', module: 'notepad' });
        <shiro:hasPermission name="sysbatterybusinfo:read">
    		this.permissionsShortcuts.push({ name: '电池车辆基础信息管理', iconCls: 'role-shortcut', module: 'sysbatterybusinfo' });
    	</shiro:hasPermission>
    	<shiro:hasPermission name="sysorganization:read">
    		this.permissionsShortcuts.push({ name: '组织机构管理', iconCls: 'department-shortcut', module: 'sysorganization' });
    	</shiro:hasPermission>
    	<shiro:hasPermission name="sysrole:read">
    		this.permissionsShortcuts.push({ name: '角色管理', iconCls: 'role-shortcut', module: 'sysrole' });
    	</shiro:hasPermission>
    	<shiro:hasPermission name="sysresource:read">
    		this.permissionsShortcuts.push({ name: '资源管理', iconCls: 'role-shortcut', module: 'sysresource' });
    	</shiro:hasPermission>
    	<shiro:hasPermission name="syspermission:read">
    		this.permissionsShortcuts.push({ name: '权限管理', iconCls: 'role-shortcut', module: 'syspermission' });
    	</shiro:hasPermission>
    	<shiro:hasPermission name="sysalterpassword:read">
    		this.permissionsShortcuts.push({ name: '用户密码修改', iconCls: 'role-shortcut', module: 'sysalterpassword' });
    	</shiro:hasPermission>
    	<shiro:hasPermission name="table-win:read">
    		this.permissionsShortcuts.push({ name: '预警信息', iconCls: 'mynotepad-shortcut', module: 'table-win' });
    	</shiro:hasPermission>
    	<shiro:hasPermission name="monitormap:read">
    		this.permissionsShortcuts.push({ name: '地图信息', iconCls: 'role-shortcut', module: 'monitormap' });
    	</shiro:hasPermission>
    	<shiro:hasPermission name="systemmonitor:read">
    		this.permissionsShortcuts.push({ name: '监控管理', iconCls: 'role-shortcut', module: 'systemmonitor' });
    	</shiro:hasPermission>
        <%-- 这个以上要动态的 --%>

        this.callParent();
		this.desktop.initShortcut()
        // now ready...
    },
    
    permissionsModules : null,
    permissionsShortcuts : null,

    getModules : function(){
    	return this.permissionsModules;
    },

    getDesktopConfig: function () {
        var me = this, ret = me.callParent();

        return Ext.apply(ret, {
            //cls: 'ux-desktop-black',

            contextMenuItems: [
                { text: '桌面设置', handler: me.onSettings, scope: me }
            ],

            shortcuts: Ext.create('Ext.data.Store', {
                model: 'Ext.ux.desktop.ShortcutModel',
                data: this.permissionsShortcuts
            }),

            wallpaper: './jscomponent/extjs/desktop/resources/Blue-Sencha.jpg',
            wallpaperStretch: false
        });
    },

    // config for the start menu
    getStartConfig : function() {
        var me = this, ret = me.callParent();
		var adminrealname=document.getElementById('adminrealname').value;
        return Ext.apply(ret, {
            title: adminrealname,
            iconCls: 'user',
            height: 300,
            toolConfig: {
                width: 100,
                items: [
                    {
                        text:'设置',
                        iconCls:'settings',
                        handler: me.onSettings,
                        scope: me
                    },
                    '-',
                    {
                        text:'退出',
                        iconCls:'logout',
                        handler: me.onLogout,
                        scope: me
                    }
                ]
            }
        });
    },

    getTaskbarConfig: function () {
        var ret = this.callParent();

        return Ext.apply(ret, {
            quickStart: [
                { name: '记事本', iconCls: 'notepad', module: 'notepad' }
            ],
            trayItems: [
                { xtype: 'trayclock', flex: 1 }
            ]
        });
    },

    onLogout: function () {
    	Ext.Msg.confirm('登出', '您是否确认退出系统？', function(bn) {
    		if (bn == 'yes') {
    			document.getElementById('logoutform').submit();
    		}
    	});
    },

    onSettings: function () {
        var dlg = new MyDesktop.Settings({
            desktop: this.desktop
        });
        dlg.show();
    }
});
