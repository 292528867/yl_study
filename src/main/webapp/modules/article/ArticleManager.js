/**
 * Created by Jeffrey on 15/8/26.
 */

Ext.define('Article.ArticleManager', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
    ],

    id: 'articleManager',

    store: null,

    init: function () {
        this.launcher = {
            text: '文章添加',
            iconCls: 'notepad',
            handler: this.createWindow,
            scope: this
        }
    },
    createWindow: function () {
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('articleManager');
        var panel = Ext.create('Ext.Panel', {
            id: 'articleManagerPanel',
            title: '文章添加',
            html: '<iframe id="frame1" src="/xlab-youle/articleManager.html" frameborder="0" width="100%" height="100%"></iframe>'
        });
        if (!win) {
            win = desktop.createWindow({
                id: 'articleManager',
                title: '文章添加',
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