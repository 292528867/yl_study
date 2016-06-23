/**
 * Created by Jeffrey on 15/9/6.
 */

Ext.define('User.UserInfoManager', {
    extend : 'Ext.ux.desktop.Module',
    require: [],
    id: 'userManager',

    store: null,

    init: function () {
        this.launcher = {
            text: '用户管理',
            iconCls: 'notepad',
            handler: this.createWindow,
            scope: this
        }
    },
    createWindow: function () {
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('userView');
        var panel = Ext.create('Ext.Panel', {
            id: 'userListPanel',
            title: '用户管理',
            html: '<iframe id="frame1" src="/xlab-youle/userInfoList.html" frameborder="0" width="100%" height="100%"></iframe>'
        });
        if (!win) {
            win = desktop.createWindow({
                id: 'userManager',
                title: '用户管理',
                width: 600,
                height: 800,
                iconCls: 'notepad',
                animCollapse: false,
                border: false,
                hideMode: 'offsets',
                layout: 'fit',
                items: [
                    panel
                ]
            });
        }
        win.show();
        return win;
    }
});