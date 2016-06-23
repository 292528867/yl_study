/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
Ext.define('Ext.ux.form.SearchFieldFix', {
    extend: 'Ext.form.field.Trigger',
    
    alias: 'widget.searchfield_mall',
    
    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    
    trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
    
    hasSearch : false,
    paramName : 'filters',
    vnames : [],
    
    initComponent: function(){
        this.callParent(arguments);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },
    
    afterRender: function(){
        this.callParent();
        this.triggerEl.item(0).setDisplayed('none');  
    },
    
    onTrigger1Click : function(){
        var me = this,
            store = me.store,
            proxy = store.getProxy(),
            vnames = me.vnames,
            val;
            
        if (me.hasSearch) {
            // 清空附加参数值
            me.setValue('');
            var param_obj = Ext.JSON.decode(proxy.extraParams[me.paramName], true);
            if (param_obj) {
                for (var i = 0; i < vnames.length; i++)
                    delete param_obj[vnames[i] + "_like"];
                proxy.extraParams[me.paramName] = Ext.JSON.encode(param_obj);
            }

//            proxy.extraParams.start = 0; // bug
            store.load();
            me.hasSearch = false;
            me.triggerEl.item(0).setDisplayed('none');
            me.doComponentLayout();
        }
    },

    onTrigger2Click : function(){
        var me = this,
            store = me.store,
            proxy = store.getProxy(),
            value = me.getValue(),
            vnames = me.vnames;
            
        if (value.length < 1 || vnames.length == 0) {
            me.onTrigger1Click();
            return;
        }

        var param_obj = Ext.JSON.decode(proxy.extraParams[me.paramName], true);
        if (!param_obj)
            param_obj = {};
        for (var i = 0; i < vnames.length; i++)
            param_obj[vnames[i] + "_like"] = value;
        proxy.extraParams[me.paramName] = Ext.JSON.encode(param_obj);

        store.load();
        me.hasSearch = true;
        me.triggerEl.item(0).setDisplayed('block');
        me.doComponentLayout();
    }
});
