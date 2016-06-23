/**
 * Created by Jeffrey on 15/8/25.
 */

Ext.define('Tags.TagManager', {

    extend: 'Ext.ux.desktop.Module',

    requires: [],

    id: 'tagManager',

    store: null,

    init: function () {
        this.launcher = {
            text: '标签管理',
            iconCls: 'notepad',
            handler: this.createWindow,
            scope: this
        }
    },

    createMomentManagerGrid: function () {
        Ext.define('Tags.TagManager.TagInfoModel', {
            extend: 'Ext.data.Model',
            fields: [
                'id',
                'name',
                'description',
                'linkUrl',
                'remark'
            ]
        });

        this.store = Ext.create('Ext.data.Store', {
            model: 'Tags.TagManager.TagInfoModel',
            pageSize: 10,
            proxy: {
                type: 'ajax',
                url: serverUrl + '/manager/tags',
                actionMethods: {
                    read: 'GET'
                },

                reader: {
                    root: 'content',
                    totalProperty: 'totalElements'
                },
                limitParam: 'size'
            }
        });

        var gridstore = this.store;

        var grid = Ext.create('Ext.grid.Panel', {

            store: gridstore,
            frame: true,
            border: false,
            columnLines: true,
            disableSelection: false,
            columns: [{
                dataIndex: 'id',
                text: 'id'
                //hidden: true
            }, {
                dataIndex: 'name',
                text: '标签名称'
            }, {
                dataIndex: 'description',
                text: '标签描述'
            }, {
                dataIndex: 'linkUrl',
                text: '标签跳转地址'
            }, {
                dataIndex: 'remark',
                text: '备注'
            }],

            bbar: Ext.create('Ext.PagingToolbar', {
                store: gridstore,
                displayInfo: true,
                displayMsg: '当前显示第{0}条 至 {1}条记录，共{2}条记录',
                emptyMsg: '暂无可用数据'
            }),
            tbar: [{
                width: 240,
                fieldLabel: '搜素',
                xtype: 'searchfield',
                labelWidth: 50,
                store: gridstore
            }, {
                text: '新增标签',
                xtype: 'button',
                width: 80,
                handler: function () {
                    var win;
                    var form = Ext.create("Ext.form.Panel", {
                        frame: true,
                        defaultType: 'textfield',
                        items: [{
                            id: 'name',
                            name: 'name',
                            fieldLabel: '标签名称',
                            allowBlank: false
                        }, {
                            id: 'description',
                            name: 'description',
                            fieldLabel: '标签描述',
                            allowBlank: false
                        }, {
                            id: 'linkUrl',
                            name: 'linkUrl',
                            fieldLabel: '标签跳转地址',
                            allowBlank: false
                        }],
                        buttons: [{
                            text: '重置',
                            handler: function () {
                                this.up('form').getForm().reset();
                            }
                        }, {
                            text: '提交',
                            handler: function () {
                                var f = this.up('form').getForm();
                                var busvo = f.getFieldValues();
                                Ext.Ajax.request({
                                    url: serverUrl + '/manager/tags',
                                    method: 'POST',
                                    jsonData: Ext.JSON.encode(busvo),
                                    success: function (response, options) {
                                        Ext.Msg.alert('成功', '新增标签成功！');
                                        win.close();
                                        gridstore.load();
                                    }
                                });
                            }
                        }]
                    });
                    win = Ext.create("Ext.window.Window", {
                        width: 300,
                        height: 300,
                        title: '新增标签',
                        layout: 'fit',
                        items: [form],
                        modal: true
                    });
                    win.show();
                }
            }]
        });
        gridstore.loadPage(1);
        return grid;
    },

    createWindow: function () {
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('tagManager');
        if (!win) {
            win = desktop.createWindow({
                id: 'tagManager',
                title: '文章添加',
                width: 600,
                height: 400,
                iconCls: 'notepad',
                animCollapse: false,
                border: false,
                hideMode: 'offsets',
                layout: 'fit',
                items: [
                    this.createMomentManagerGrid()
                ]
            });
        }
        win.show();
        return win;
    }
})
