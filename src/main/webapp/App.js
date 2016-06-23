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

var serverUrl = 'http://101.231.124.8:45698/xlab-youle';
//var serverUrl = 'http://172.16.74.14:8080/xlab-youle';

Ext.define('MyDesktop.App', {
    extend: 'Ext.ux.desktop.App',

    requires: [
        'Ext.window.MessageBox',
        'Ext.ux.desktop.ShortcutModel',
        'MyDesktop.SystemStatus',
        'MyDesktop.Settings',
        
        // 自定义模块
        'Mall.ProductManager',
        'Moments.MomentManager',
        'Tags.TagManager',
        'Mall.ActivitiManager',
        //'Mall.OrderManager',
        'Order.NewOrderManager',
        'Article.ArticleManager',
        'Article.ArticleView',
        'User.UserInfoManager'
    ],

    init: function() {
        // custom logic before getXYZ methods get called...

        this.callParent();
		this.desktop.initShortcut();
        // now ready...
    },

    getModules : function(){
        return [
            new Mall.ProductManager(),
            new Order.NewOrderManager(),
            new Moments.MomentManager(),
            new Tags.TagManager(),
            new Article.ArticleManager(),
            new Article.ArticleView(),
            new Mall.ActivitiManager(),
            new User.UserInfoManager()

        ];
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
                data: [
                       { name: '商品信息管理', iconCls: 'mynotepad-shortcut', module: 'productManager' },
                       { name: '订单管理', iconCls: 'mynotepad-shortcut', module: 'newOrderManager' },
                       { name: '朋友圈管理', iconCls: 'mynotepad-shortcut', module: 'momentManager'},
                       { name: '标签管理', iconCls: 'mynotepad-shortcut', module: 'tagManager'},
                       { name: '文章添加', iconCls: 'mynotepad-shortcut', module: 'articleManager'},
                       { name: '文章列表信息', iconCls: 'mynotepad-shortcut', module: 'articleView'},
                       { name: '活动信息管理', iconCls: 'mynotepad-shortcut', module: 'activitiManager' },
                       { name: '用户信息管理', iconCls: 'mynotepad-shortcut', module: 'userManager' }
                ]
            }),

            wallpaper: './jscomponent/extjs/desktop/resources/Blue-Sencha.jpg',
            wallpaperStretch: false
        });
    },

    // config for the start menu
    getStartConfig : function() {
        var me = this, ret = me.callParent();
        return Ext.apply(ret, {
            title: "某用户",
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
                
            ],
            trayItems: [
                { xtype: 'trayclock', flex: 1 }
            ]
        });
    },

    onLogout: function () {
        Ext.Msg.confirm('退出', '您确定要注销并退出?');
    },

    onSettings: function () {
        var dlg = new MyDesktop.Settings({
            desktop: this.desktop
        });
        dlg.show();
    }
});

