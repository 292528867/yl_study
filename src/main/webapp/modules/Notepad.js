
Ext.define('BatteryBusSystem.Notepad', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.form.field.HtmlEditor'
        //'Ext.form.field.TextArea'
    ],

    id:'notepad',

    init : function(){
        this.launcher = {
            text: '记事本',
            iconCls:'notepad',
            handler : this.createWindow,
            scope: this
        }
    },

    createWindow : function(){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('notepad');
        if(!win){
            win = desktop.createWindow({
                id: 'notepad',
                title:'记事本',
                width:600,
                height:400,
                iconCls: 'notepad',
                animCollapse:false,
                border: false,
                hideMode: 'offsets',
                layout: 'fit',
                items: [
                    {
                        xtype: 'htmleditor',
                        id: 'notepad-editor',
                        value: [
                            
                        ].join('')
                    }
                ]
            });
        }
        win.show();
        return win;
    }
});

