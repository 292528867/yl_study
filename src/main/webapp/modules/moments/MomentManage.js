/**
 * Created by Jeffrey on 15/8/25.
 */

Ext.define('Moments.MomentManager', {

    extend: 'Ext.ux.desktop.Module',

    requires: [],

    id: 'momentManager',

    store: null,

    init: function () {
        this.launcher = {
            text: '圈子管理',
            iconCls: 'notepad',
            handler: this.createWindow,
            scope: this
        }
    },

    createMomentManagerGrid: function () {
        Ext.define('Moments.MomentManager.MomentInfoModel', {
            extend: 'Ext.data.Model',
            fields: [
                'id',
                'smallIconUrl',
                'coverIconUrl',
                'name',
                'backgroundColor',
                'description',
                'compositor',
                'status'
            ]
        });

        this.store = Ext.create('Ext.data.Store', {
            model: 'Moments.MomentManager.MomentInfoModel',
            pageSize: 10,
            proxy: {
                type: 'ajax',
                url: serverUrl + '/manager/moments',
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

        var momentsWin = function (record, type) {
            var win;
            var form = Ext.create("Ext.form.Panel", {
                frame: true,
                defaultType: 'textfield',
                items: [{
                    id: 'id',
                    name: 'id',
                    hidden: true
                }, {
                    id: 'name',
                    name: 'name',
                    fieldLabel: '朋友圈名称',
                    allowBlank: false
                }, {
                    id: 'smallIconUrl',
                    name: 'smallIconUrl',
                    xtype : 'hiddenfield'
                }, {
                    id: 'coverIconUrl',
                    name: 'coverIconUrl',
                    xtype : 'hiddenfield'
                }, {
                    id: 'backgroundColor',
                    name: 'backgroundColor',
                    fieldLabel: '背景颜色',
                    allowBlank: false
                }, {
                    id: 'description',
                    name: 'description',
                    fieldLabel: '朋友圈描述',
                    allowBlank: false
                }, {
                    id: 'compositor',
                    name: 'compositor',
                    fieldLabel: '排序',
                    allowBlank: false
                }, {
                    id: 'momentPicturePanel',
                    pArray: [],
                    xtype: 'panel',
                    frame: true,
                    anchor: '100%',
                    height: 140,
                    layout: {
                        type: 'hbox',
                        pack: 'center',              //纵向对齐方式 start：从顶部；center：从中部；end：从底部
                        align: 'stretchmax'             //对齐方式 center、left、right：居中、左对齐、右对齐；stretch：延伸；stretchmax：以最大的元素为标准延伸
                    },
                    defaults: {
                        xtype: 'button'
                    },
                    items: [{
                        xtype: 'form',
                        id: 'uploadPictureForm1',
                        url: serverUrl + '/manager/moments/uploadPicture',
                        frame: true,
                        width: 140,
                        height: 130,
                        layout: {
                            type: 'vbox'
                        }, items: [{
                            id: 'smallIconUrlImg',
                            xtype: 'image',
                            width: 120,
                            height: 100
                        }, {
                            xtype: 'filefield',
                            buttonText: '圈子图标上传...',
                            buttonOnly: true,
                            name: 'file',
                            listeners: {
                                change: function (field, value, eOpts) {
                                    var f = this.up("form").getForm();
                                    f.submit({
                                        waitMsg: '图片保存中......',
                                        method: 'POST',
                                        success: function (form, action) {
                                            var img = Ext.getCmp("smallIconUrlImg");
                                            img.setSrc(action.result.msg);
                                            var imgField = Ext.getCmp("smallIconUrl");
                                            imgField.setValue(action.result.msg);
//	    								Ext.Msg.alert('成功', action.result.msg);
                                        },
                                        failure: function (form, action) {
                                            Ext.Msg.alert('抱歉', '服务器异常！');
                                        }
                                    });
                                }

                            }
                        }]
                    },{
                        xtype: 'form',
                        id: 'uploadPictureForm2',
                        url: serverUrl + '/manager/moments/uploadPicture',
                        frame: true,
                        width: 140,
                        height: 130,
                        layout: {
                            type: 'vbox'
                        }, items: [{
                            id: 'coverIconUrlImg',
                            xtype: 'image',
                            width: 120,
                            height: 100
                        }, {
                            xtype: 'filefield',
                            buttonText: '圈子封面上传...',
                            buttonOnly: true,
                            name: 'file',
                            listeners: {
                                change: function (field, value, eOpts) {
                                    var f = this.up("form").getForm();
                                    f.submit({
                                        waitMsg: '图片保存中......',
                                        method: 'POST',
                                        success: function (form, action) {
                                            var img = Ext.getCmp("coverIconUrlImg");
                                            img.setSrc(action.result.msg);
                                            var imgField = Ext.getCmp("coverIconUrl");
                                            imgField.setValue(action.result.msg);
//	    								Ext.Msg.alert('成功', action.result.msg);
                                        },
                                        failure: function (form, action) {
                                            Ext.Msg.alert('抱歉', '服务器异常！');
                                        }
                                    });
                                }

                            }
                        }]
                    }]
                }],
                buttons: [{
                    text: '重置',
                    handler: function () {
                        if (record) {
                            form.getForm().setValues(record.data);
                        }else
                            this.up('form').getForm().reset();
                    }
                }, {
                    text: '提交',
                    handler: function () {
                        var f = this.up('form').getForm();
                        var busvo = f.getFieldValues();
                        Ext.Ajax.request({
                            url: serverUrl + '/manager/moments',
                            method: 'POST',
                            jsonData: Ext.JSON.encode(busvo),
                            success: function (response, options) {
                                Ext.Msg.alert('成功', type + '朋友圈成功！');
                                win.close();
                                gridstore.load();
                            }
                        });
                    }
                }]
            });
            if (record) {
                form.getForm().setValues(record.data);
                // 圈子图标
                var smallImg = Ext.getCmp("smallIconUrlImg");
                smallImg.setSrc(record.data['smallIconUrl']);

                // 圈子封面
                var img = Ext.getCmp("coverIconUrlImg");
                img.setSrc(record.data['coverIconUrl']);

            }
            win = Ext.create("Ext.window.Window", {
                width: 300,
                height: 350,
                title: type + '朋友圈',
                layout: 'fit',
                items: [form],
                modal: true
            });
            win.show();
        };

        var grid = Ext.create('Ext.grid.Panel', {
            store: gridstore,
            frame: true,
            border: false,
            columnLines: true,
            disableSelection: false,
            selModel: {
                selType: 'checkboxmodel',
                mode: 'SINGLE'
            },
            columns: [{
                dataIndex: 'id',
                text: 'id',
                width: 30
            }, {
                dataIndex: 'smallIconUrl',
                text: '圈子图标',
                renderer: function(value, metadata, record) {
                    if (value)
                        return "<img src='" + value + "'/>";
                    else
                        return "请上传图片";
                }
            }, {
                dataIndex: 'coverIconUrl',
                text: '圈子封面图片',
                width: 135,
                renderer: function(value, metadata, record) {
                    if (value)
                        return "<img style='with: 135px; height:80px;' src='" + value + "'/>";
                    else
                        return "请上传图片";
                }
            }, {
                dataIndex: 'name',
                text: '圈子名称'
            }, {
                dataIndex: 'backgroundColor',
                text: '圈子背景颜色'
            }, {
                dataIndex: 'description',
                text: '圈子描述',
                width: 200
            }, {
                dataIndex: 'compositor',
                text: '圈子排序',
                width: 70,
                editor: 'textfield'
            }, {
                dataIndex: 'status',
                text: '是否展示',
                width: 70,
                renderer: function(value){
                    if('effective' == value){
                        return "是";
                    } else {
                        return "否";
                    }
                }
            }, {
               xtype:'actioncolumn', 
               text: '操作',
               width: 110,
               items: [{
                   getClass: function () {
                       return 'moment-action-button';
                   },
                   icon: 'images/65.pic.jpg',
                   tooltip: '上架',
                   handler: function(grid, rowIndex, colIndex){
                       var rec = grid.getStore().getAt(rowIndex);
                       var id = rec.get('id');
                       var status = rec.get('status');
                       if('effective' == status){
                           Ext.Msg.alert('提示', '圈子已是上架状态！');
                       } else {
                            Ext.Ajax.request({
                               url: serverUrl + '/manager/moments/' + id + '/status',
                               method: 'POST',
                               params: {
                                   status: 'effective'
                               },
                               success: function (response, options) {
                                   Ext.Msg.alert('成功', '圈子上架成功！');
                                   gridstore.load();
                               }
                           });
                       }
                   }
                }, {
                   getClass: function () {
                       return 'moment-action-button';
                   },
                   icon: 'images/64.pic.jpg',
                   tooltip: '下架',
                   handler: function(grid, rowIndex, colIndex){
                       var rec = grid.getStore().getAt(rowIndex);
                       var id = rec.get('id');
                       var status = rec.get('status');
                       if('ineffective' == status){
                            Ext.Msg.alert('提示', '圈子已是下架状态！');
                       } else {
                           Ext.Ajax.request({
                               url: serverUrl + '/manager/moments/' + id + '/status',
                               method: 'POST',
                               params: {
                                   status: 'ineffective'
                               },
                               success: function (response, options) {
                                   Ext.Msg.alert('成功', '圈子下架成功！');
                                   gridstore.load();
                               }
                           });
                       }
                   }
                }
               ]
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
                text: '新增朋友圈',
                xtype: 'button',
                width: 80,
                handler: function () {
                    momentsWin(null, '新增');
                }
            }, {
                text: '修改朋友圈',
                xtype: 'button',
                width: 80,
                handler: function () {
                    var records = grid.getSelectionModel().getSelection();
                    if (records.length > 1)
                        Ext.Msg.alert('选择', '只能选择一条记录！');
                    else if (records.length != 1) {
                        Ext.Msg.alert('选择', '请选择一条记录！');
                    } else
                        momentsWin(records[0], '修改');
                }
            }]
        });
        gridstore.loadPage(1);
        return grid;
    },

    createWindow: function () {
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('momentManager');
        if (!win) {
            win = desktop.createWindow({
                id: 'momentManager',
                title: '朋友圈管理',
                width: 950,
                height: 700,
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
