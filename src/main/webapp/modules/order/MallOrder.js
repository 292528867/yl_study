/**
 * Created by lixuanwu on 15/9/6.
 */

Ext.define('Order.NewOrderManager', {
    extend : 'Ext.ux.desktop.Module',
    require: [],
    id: 'newOrderManager',

    store: null,

    init: function () {
        this.launcher = {
            text: '订单管理',
            iconCls: 'notepad',
            handler: this.createWindow,
            scope: this
        }
    },
    createWindow: function () {
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('newOrderManager');
        var panel = Ext.create('Ext.Panel', {
            id: 'orderListPanel',
            title: '订单管理',
            html: '<iframe id="frame1" src="/xlab-youle/orderList.html" frameborder="0" width="100%" height="100%"></iframe>'
        });
        if (!win) {
            win = desktop.createWindow({
                id: 'orderManager',
                title: '订单管理',
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