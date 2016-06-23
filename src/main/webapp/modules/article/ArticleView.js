/**
 * Created by Jeffrey on 15/9/6.
 */

Ext.define('Article.ArticleView', {
    require: [],
    id: 'articleView',

    store: null,

    init: function () {
        this.launcher = {
            text: '文章列表',
            iconCls: 'notepad',
            handler: this.createWindow,
            scope: this
        }
    },
    createWindow: function () {
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('articleView');
        var panel = Ext.create('Ext.Panel', {
            id: 'articleListPanel',
            title: '文章添加',
            html: '<iframe id="frame1" src="/xlab-youle/articleList.html" frameborder="0" width="100%" height="100%"></iframe>'
        });
        if (!win) {
            win = desktop.createWindow({
                id: 'articleView',
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