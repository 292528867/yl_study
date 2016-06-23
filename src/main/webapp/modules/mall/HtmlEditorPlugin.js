Ext.define('Ext.ux.form.plugin.HtmlEditor', {
    mixins: {
        observable: 'Ext.util.Observable'
    },
    alternateClassName: 'Ext.form.plugin.HtmlEditor',
    requires: [
        'Ext.tip.QuickTipManager',
        'Ext.form.field.HtmlEditor'
    ],

    /**
    * @cfg {Boolean} enableAll Enable all available plugins
    */
    enableAll: false,
    /**
    * @cfg {Boolean} enableUndoRedo Enable "undo" and "redo" plugins
    */
    //enableUndoRedo: false,
    /**
    * @cfg {Boolean} enableRemoveHtml Enable the plugin "remove html" which is removing all html entities from the entire text
    */
    enableRemoveHtml: false,
    /**
    * @cfg {Boolean} enableRemoveFormatting Enable "remove format" plugin
    */
    enableRemoveFormatting: false,
    /**
    * @cfg {Boolean} enableIndenting Enable "indent" and "outdent" plugins
    */
    enableIndenting: false,
    /**
    * @cfg {Boolean} enableSmallLetters Enable "superscript" and "subscript" plugins
    */
    enableSmallLetters: false,
    /**
    * @cfg {Boolean} enableHorizontalRule Enable "horizontal rule" plugin
    */
    enableHorizontalRule: false,
    /**
    * @cfg {Boolean} enableSpecialChars Enable "special chars" plugin
    */
    enableSpecialChars: false,
    /**
    * @cfg {Boolean} enableWordPaste Enable "word paste" plugin which is cleaning the pasted text that is coming from MS Word
    */
    enableWordPaste: false,
    /**
    * @cfg {Boolean} enableFormatBlocks Enable "format blocks" plugin which allows to insert formatting tags.
    */
    enableFormatBlocks: false,
    /**
    * @cfg {Boolean} defaultFormatBlock Set the default block format.
    */
    defaultFormatBlock: 'p',
    /**
    * 表情
    */
    enableFaceImages: false,

    enableInsertTable: false,

    wordPasteEnabled: false,

    /**
    * @cfg {Array} specialChars
    * An array of additional characters to display for user selection.  Uses numeric portion of the ASCII HTML Character Code only. For example, to use the Copyright symbol, which is © we would just specify <tt>169</tt> (ie: <tt>specialChars:[169]</tt>).
    */
    specialChars: [],

    /**
    * 表情
    */
    faceImages: [],
    /**
    * @cfg {Array} charRange
    * Two numbers specifying a range of ASCII HTML Characters to display for user selection. Defaults to <tt>[160, 256]</tt>.
    */
    charRange: [160, 256],
    /**
    * @cfg {Array} listFormatBlocks Array of available format blocks.
    */
    listFormatBlocks: ["p", "h1", "h2", "h3", "h4", "h5", "h6", "address", "pre"],

    constructor: function (config) {
        Ext.apply(this, config);
    },

    init: function (editor) {
        var me = this;
        me.editor = editor;
        me.mon(editor, 'initialize', me.onInitialize, me);
    },

    onInitialize: function () {
        var me = this, undef,
            items = [],
            baseCSSPrefix = Ext.baseCSSPrefix,
            tipsEnabled = Ext.tip.QuickTipManager && Ext.tip.QuickTipManager.isEnabled();

        function btn(id, toggle, handler) {
            return {
                itemId: id,
                cls: baseCSSPrefix + 'btn-icon',
                iconCls: baseCSSPrefix + 'edit-' + id,
                enableToggle: toggle !== false,
                scope: me,
                handler: handler || me.relayBtnCmd,
                clickEvent: 'mousedown',
                tooltip: tipsEnabled ? me.buttonTips[id] || undef : undef,
                overflowText: me.buttonTips[id].title || undef,
                tabIndex: -1
            };
        }
        /**
        if(me.enableFormatBlocks || me.enableAll){
        var i, listFormatBlocks = new Array();
        for(i=0; i < me.listFormatBlocks.length; i++){
        listFormatBlocks.push({
        value:      me.listFormatBlocks[i].toLowerCase(),
        caption:    me.buttonTips.listFormatBlocks[me.listFormatBlocks[i]]
        });
        }
        formatBlockSelectItem = Ext.widget('component', {
        renderTpl: [
        '<select class="{cls}">',
        '<tpl for="formats">',
        '<option value="<{value}>" <tpl if="values.toLowerCase()==parent.defaultFormatBlock"> selected</tpl>>{caption}</option>',
        '</tpl>',
        '</select>'
        ],
        renderData: {
        cls:                    baseCSSPrefix + 'font-select',
        formats:                listFormatBlocks,
        defaultFormatBlock:     me.defaultFormatBlock
        },
        renderSelectors: {
        selectEl: 'select'
        },
        onDisable: function() {
        var selectEl = this.selectEl;
        if (selectEl) {
        selectEl.dom.disabled = true;
        }
        Ext.Component.superclass.onDisable.apply(this, arguments);
        },
        onEnable: function() {
        var selectEl = this.selectEl;
        if (selectEl) {
        selectEl.dom.disabled = false;
        }
        Ext.Component.superclass.onEnable.apply(this, arguments);
        }
        });

        items.push(
        '-',
        formatBlockSelectItem
        );
        }
        */
        if (me.enableRemoveHtml || me.enableAll) {
            items.push(btn('removehtml', false, me.doRemoveHtml));
        }
        if (me.enableRemoveFormatting || me.enableAll) {
            items.push(btn('removeformat', false));
        }
        //        if (me.enableUndoRedo || me.enableAll) {
        //            items.push('-');
        //            items.push(btn('undo', false));
        //            items.push(btn('redo', false));
        //        }
        if (me.enableInsertTable || me.enableAll) {
            items.push('-');
            items.push(btn('inserttable', false, me.doInsertTable));
        }
        if (me.enableIndenting || me.enableAll) {
            items.push('-');
            items.push(btn('indent', false));
            items.push(btn('outdent', false));
        }
//        if (me.enableSmallLetters || me.enableAll) {
//            items.push('-');
//            items.push(btn('superscript'));
//            items.push(btn('subscript'));
//        }
        if (me.enableHorizontalRule || me.enableAll) {
            items.push(btn('inserthorizontalrule', false));
        }
        if (me.enableSpecialChars || me.enableAll) {
            items.push(btn('chars', false, me.doSpecialChars));
        }
        /*  if (me.enableFaceImages || me.enableAll) {
        items.push('-');
        var faceImagesBtn = btn('faceImages', false, me.doFaceImages);
        faceImagesBtn.iconCls = 'employee-add';
        items.push(faceImagesBtn);
        }*/

        /**
        if(me.enableWordPaste || me.enableAll){
        items.push('-');
        items.push(btn('wordpaste', true, me.doWordPaste));
        me.wordPasteEnabled = true;
        }else{
        me.wordPasteEnabled = false;
        }
        */

        /*if(me.enableImages){
        items.push(btn('images', false, me.doImages));
        }*/
        if (items.length > 0) {
            me.editor.getToolbar().add(items);
            fn = Ext.Function.bind(me.onEditorEvent, me);
            Ext.EventManager.on(me.editor.getDoc(), {
                mousedown: fn,
                dblclick: fn,
                click: fn,
                keyup: fn,
                buffer: 100
            });

            if (formatBlockSelectItem) {
                me.formatBlockSelect = formatBlockSelectItem.selectEl;

                me.mon(me.formatBlockSelect, 'change', function () {
                    me.relayCmd('formatblock', me.formatBlockSelect.dom.value);
                    me.editor.deferFocus();
                });
            }

        }
    },

    onEditorEvent: function (e) {
        var me = this,
            diffAt = 0;

        me.updateToolbar();

        me.curLength = me.editor.getValue().length;

        if (e.ctrlKey) {
            var c = e.getCharCode();
            if (c > 0) {
                c = String.fromCharCode(c);
                if (c.toLowerCase() == 'v' && me.wordPasteEnabled) {
                    me.cleanWordPaste();
                }
            }
        }

        me.lastLength = me.editor.getValue().length;
        me.lastValue = me.editor.getValue();

    },

    updateToolbar: function () {
        var me = this,
            btns, doc;

        if (me.editor.readOnly) {
            return;
        }

        btns = me.editor.getToolbar().items.map;
        doc = me.editor.getDoc();

        function updateButtons() {
            Ext.Array.forEach(Ext.Array.toArray(arguments), function (name) {
                btns[name].toggle(doc.queryCommandState(name));
            });
        }

//        if (me.enableSmallLetters || me.enableAll) {
//            updateButtons('superscript', 'subscript');
//        }
        /**
        if(me.enableWordPaste || me.enableAll){
        btns['wordpaste'].toggle(me.wordPasteEnabled);
        }
        
        if(me.enableFormatBlocks || me.enableAll){
        this.checkSelectionFormatBlock();
        }
        */
    },

    doRemoveHtml: function () {
        var me = this;
        if (!me.imgWindow) {
            var form = Ext.create("Ext.form.Panel", {
                fileUpload: true,
                border: false,
                plain: true,
                bodyStyle: 'padding: 10px;',
                labelWidth: 60,
                labelAlign: 'right',
                items : [{
                    xtype: 'fileuploadfield',
                    fieldLabel: '选择文件',
                    name: 'file1',
                    anchor: '100%',
                    buttonText: '浏览',
                    allowBlank: false,
                    emptyText: '请选择图片(大小不能超过100KB)'
                }, {

                }],
                buttons : [{
                    text : '重置',
                    handler : function() {
                        this.up('form').getForm().reset();
                    }
                }, {
                    text : '提交',
                    disabled : true,
                    formBind : true,
                    handler : function() {
                        var frm = this.up('form').getForm();
                        if (!frm.isValid()) {
                            return;
                        }
                        if (frm.isValid()) {
                            var file1 = frm.findField('file1').getValue();
                            var point = file1.lastIndexOf(".");
                            var type = file1.substr(point);
                            if (type == ".jpg" || type == ".gif" || type == ".png" || type == ".JPG" || type == ".GIF") {
                                // todo
                            } else {
                                Ext.MessageBox.alert('提示', '只支持上传jpg和gif格式的图片文件');
                                return;
                            }

                            frm.submit({
                                url: me.imageUploadUrl,
                                waitTitle: '提示',
                                method: 'POST',
                                params : me.myDefineParams,
                                waitMsg: '正在上传文件,请稍候...',
                                timeout: 60000, // 60s
                                success: function (form, action) {
//                                    aUrl = action.result.aUrl;
                                    aUrl = action.result.msg;
//                                    imgName = action.result.imgName;
                                    imgName = "todo";
                                    if (action.result.state == 'error') {
                                        Ext.MessageBox.alert('提示', action.result.msg);
                                        return;
                                    }
                                    me.editor.insertAtCursor('<img style="max-width:100%;" src="' + action.result.msg + '" title="' + imgName + '" alt="' + imgName + '">');

                                    me.imgWindow.hide();

                                },
                                failure: function (form, action) {
                                    Ext.Msg.alert('提示', action.result.msg);
                                }
                            });
                        } else {
                            if (!frm.findField('file1').isValid()) {
                                // frm.findField('url').getEl().frame();
                            }
                        }

                    }
                }]
            });

            me.imgWindow = Ext.create("Ext.window.Window", {
                title: '<span class="commoncss">上传图片</span> ',
                closeAction: 'hide',
                buttonAlign: 'center',
                width: 400,
                height: 150,
                layout: 'fit',
                items : [form],
                listeners: {
                    show: {
                        fn: function () {
                            form.getForm().reset();
                        },
                        defer: 350
                    }
                }
            });










//            this.imgWindow = new Ext.Window({
//                id: 'imgWindow',
//                title: '<span class="commoncss">上传图片</span> ',
//                closeAction: 'hide',
//                buttonAlign: 'center',
//                width: 400,
//                height: 150,
//                layout: 'fit',
//                items: [Ext.create('Ext.panel.Panel', {
//                    border: false,
//                    enableTabScroll: true,
//                    activeTab: 0,
//                    // autoWidth : true,
//                    height: 160,
//                    items: [{
//                        items: [{
//                            xtype: 'form',
//                            itemId: 'upload-img',
//                            id: 'upload-img',
//                            fileUpload: true,
//                            border: false,
//                            plain: true,
//                            bodyStyle: 'padding: 10px;',
//                            labelWidth: 60,
//                            labelAlign: 'right',
//                            items: [{
//                                xtype: 'fileuploadfield',
//                                fieldLabel: '选择文件',
//                                name: 'file1',
//                                anchor: '100%',
//                                buttonText: '浏览',
//                                allowBlank: false,
//                                emptyText: '请选择图片(大小不能超过100KB)'
//                            }
////                            ,
////                            {
////                                xtype: 'textfield',
////                                fieldLabel: '图片说明',
////                                name: 'up_name',
////                                maxLength: 100,
////                                anchor: '100%',
////                                emptyText: '简短的图片说明'
////                            }
//
//                            ]
//                        }]
//
//                    }]
//                })],
//                buttons: [{
//                    text: '插入',
//                    id: 'btnUploadInset',
//                    handler: function () {
//                        var frm = Ext.getCmp('upload-img').getForm();
//                        if (!frm.isValid()) {
//                            return;
//                        }
//                        if (frm.isValid()) {
//                            var file1 = frm.findField('file1').getValue();
//                            var point = file1.lastIndexOf(".");
//                            var type = file1.substr(point);
//                            if (type == ".jpg" || type == ".gif" || type == ".png" || type == ".JPG" || type == ".GIF") {
//                                // todo
//                            } else {
//                                Ext.MessageBox.alert('提示', '只支持上传jpg和gif格式的图片文件');
//                                return;
//                            }
//
//                            frm.submit({
//                                url: this.imageUploadUrl,
//                                waitTitle: '提示',
//                                method: 'POST',
//                                params:this.myDefineParams,
//                                waitMsg: '正在上传文件,请稍候...',
//                                timeout: 60000, // 60s
//                                success: function (form, action) {
////                                    aUrl = action.result.aUrl;
//                                	aUrl = action.result.msg;
////                                    imgName = action.result.imgName;
//                                	imgName = "todo";
//                                    if (action.result.state == 'error') {
//                                        Ext.MessageBox.alert('提示', action.result.msg);
//                                        return;
//                                    }
//                                    this.editor.insertAtCursor('<img src="' + action.result.msg + '" title="' + imgName + '" alt="' + imgName + '">');
//
//                                },
//                                failure: function (form, action) {
//                                    Ext.Msg.alert('提示', action.result.msg);
//                                },
//                                scope: this
//                            });
//                            Ext.getCmp('imgWindow').hide();
//                        } else {
//                            if (!frm.findField('file1').isValid()) {
//                                // frm.findField('url').getEl().frame();
//                            }
//                        }
//                    },
//                    scope: this
//                }, {
//                    text: '取消',
//                    id: 'btnUploadCancel',
//                    handler: function () {
//                        Ext.getCmp('imgWindow').hide();
//                    },
//                    scope: this
//                }],
//                listeners: {
//                    show: {
//                        fn: function () {
//
//                            var frm1 = Ext.getCmp('upload-img').getForm();
//                            frm1.reset();
//                        },
//                        scope: this,
//                        defer: 350
//                    }
//                }
//            });
            this.imgWindow.show();
        } else {
            this.imgWindow.show();
            // this.imgWindow.getEl().frame();
        }



        //---------------------------
        //        Ext.defer(function () {
        //            var me = this;
        //            me.editor.focus();
        //            var tmp = document.createElement("DIV");
        //            tmp.innerHTML = me.editor.getValue();
        //            me.editor.setValue(tmp.textContent || tmp.innerText);
        //        }, 10, this);
    },

    doInsertTable: function () {
        //-----------------
        if (!this.tableWindow) {
            this.tableWindow = Ext.create('Ext.window.Window', {
                title: this.langTitle,
                tableBorderOptions: [['1px solid #000', '细边框'], ['2px solid #000', '粗边框'], ['1px dashed #000', '虚线边框'], ['1px dotted #000', '点阵边框']],
                closeAction: 'hide',
                width: 235,
                items: [{
                    itemId: 'insert-table',
                    xtype: 'form',
                    border: false,
                    plain: true,
                    labelAlign: 'right',
                    items: [{
                        xtype: 'numberfield',
                        allowBlank: false,
                        allowDecimals: false,
                        fieldLabel: "行数",
                        name: 'row',
                        width: 150
                    }, {
                        xtype: 'numberfield',
                        allowBlank: false,
                        allowDecimals: false,
                        fieldLabel: '列数',
                        name: 'col',
                        width:150
                    }, {
                        xtype: 'combobox',
                        fieldLabel: "边框",
                        forceSelection: true,
                        mode: 'local',
                        editable: false,
                        name: 'border',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['spec', 'val'],
                            autoDestroy: true,
                            data: [
                            { spec: '1px solid #000', val: '细边框' },
                            { spec: '2px solid #000', val: '粗边框' },
                            { spec: '1px dashed #000', val: '虚线边框' },
                            { spec: '1px dotted #000', val: '点阵边框' }
                        ]
                        }),
                        triggerAction: 'all',
                        value: '1px solid #000',
                        displayField: 'val',
                        valueField: 'spec',
                        anchor: '-15'
                    }, {
                        xtype: 'checkbox',
                        fieldLabel: '测试数据',
                        checked: this.showCellLocationText,
                        listeners: {
                            check: function () {
                                this.showCellLocationText = !this.showCellLocationText;
                            },
                            scope: this
                        }
                    }]
                }],
                buttons: [{
                    text: "确认",
                    handler: function () {
                        var frm = this.tableWindow.getComponent('insert-table').getForm();
                        if (frm.isValid()) {
                            var border = frm.findField('border').getValue();
                            var rowcol = [frm.findField('row').getValue(), frm.findField('col').getValue()];
                            if (rowcol.length == 2 && rowcol[0] > 0 && rowcol[1] > 0) {
                                var colwidth = Math.floor(100 / rowcol[0]);
                                var html = "<table style='border-collapse: collapse'>";
                                var cellText = '&nbsp;';
                                if (this.showCellLocationText) { cellText = this.cellLocationText; }
                                for (var row = 0; row < rowcol[0]; row++) {
                                    html += "<tr>";
                                    for (var col = 0; col < rowcol[1]; col++) {
                                        html += "<td width='" + colwidth + "%' style='border: " + border + ";'>" + /*String.format(cellText, (row + 1), String.fromCharCode(col + 65))*/"      " + "</td>";
                                    }
                                    html += "</tr>";
                                }
                                html += "</table>";
                                this.editor.insertAtCursor(html);
                            }
                            this.tableWindow.hide();
                        } else {
                            if (!frm.findField('row').isValid()) {
                                frm.findField('row').getEl().frame();
                            } else if (!frm.findField('col').isValid()) {
                                frm.findField('col').getEl().frame();
                            }
                        }
                    },
                    scope: this
                }, {
                    text: "取消",
                    handler: function () {
                        this.tableWindow.hide();
                    },
                    scope: this
                }]
            });

        } else {
            this.tableWindow.getEl().frame();
        }
        this.tableWindow.show();
        //------------
    },

    /*  doFaceImages: function () {
    //表情列表    
    var faceImages = [
    ["001"], ["002"], ["003"], ["004"], ["005"]
    ];
    //表情集合
    var faceImagesStore = new Ext.data.ArrayStore({
    fields: ['name'],
    data: faceImages
    });
    //表情窗口
    this.faceImagesWindow = Ext.create('Ext.Window', {
    title: this.buttonTips.faceImages.text,
    width: 500,
    height: 400,
    autoShow: true,
    layout: 'fit',
    items: [{
    itemId: 'idDataView',
    xtype: 'dataview',
    store: faceImagesStore,
    autoHeight: true,
    multiSelect: true,
    tpl: new Ext.XTemplate('<tpl for="."><div class="char-item"><img src="images/face/{name}.gif" title="{name}"></div></tpl>'),
    overItemCls: 'char-over',
    trackOver: true,
    itemSelector: 'div.char-item',
    listeners: {
    itemdblclick: function (t, record, item, index, e, eOpts) {

    var c = '<img src="images/face/' + record.get('name') + '.gif" title="' + record.get('name') + '">';
    if (this.editor.getValue() == null || this.editor.getValue() == "") {
    this.editor.setValue(c);
    this.editor.focus(true, true);
    } else {
    this.editor.focus();
    this.editor.insertAtCursor(c);
    }
    this.faceImagesWindow.close();
    },
    scope: this
    }
    }]
    });
    this.faceImagesWindow.show();
    },*/

    doSpecialChars: function () {
        var specialChars = [];
        if (this.specialChars.length) {
            Ext.each(this.specialChars, function (c, i) {
                specialChars[i] = ['&#' + c + ';'];
            }, this);
        }
        for (i = this.charRange[0]; i < this.charRange[1]; i++) {
            specialChars.push(['&#' + i + ';']);
        }
        var charStore = new Ext.data.ArrayStore({
            fields: ['char'],
            data: specialChars
        });
        this.charWindow = Ext.create('Ext.Window', {
            title: this.buttonTips.chars.text,
            width: 436,
            autoHeight: true,
            layout: 'fit',
            items: [{
                itemId: 'idDataView',
                xtype: 'dataview',
                store: charStore,
                autoHeight: true,
                multiSelect: true,
                tpl: new Ext.XTemplate('<tpl for="."><div class="char-item" style="width: 20px; height: 20px; ">{char}</div></tpl><div class="x-clear"></div>'),
                overItemCls: 'char-over',
                trackOver: true,
                itemSelector: 'div.char-item',
                listeners: {
                    itemdblclick: function (t, i, n, e) {
                        if (this.editor.getValue() == null || this.editor.getValue() == "") {
                            this.editor.setValue(i.get('char'));
                        } else {
                            this.editor.focus();
                            this.editor.insertAtCursor(i.get('char'));
                        }
                        this.charWindow.close();
                    },
                    scope: this
                }
            }]
        });
        this.charWindow.show();
    },

    doWordPaste: function () {
        this.wordPasteEnabled = !this.wordPasteEnabled;
    },

    cleanWordPaste: function () {
        this.editor.suspendEvents();

        diffAt = this.findValueDiffAt(this.editor.getValue());
        var parts = [
            this.editor.getValue().substr(0, diffAt),
            this.fixWordPaste(this.editor.getValue().substr(diffAt, (this.curLength - this.lastLength))),
            this.editor.getValue().substr((this.curLength - this.lastLength) + diffAt, this.curLength)
        ];
        this.editor.setValue(parts.join(''));

        this.editor.resumeEvents();
    },

    findValueDiffAt: function (val) {

        for (i = 0; i < this.curLength; i++) {
            if (this.lastValue[i] != val[i]) {
                return i;
            }
        }

    },

    fixWordPaste: function (wordPaste) {
        var removals = [/&nbsp;/ig, /[\r\n]/g, /<(xml|style)[^>]*>.*?<\/\1>/ig, /<\/?(meta|object|span)[^>]*>/ig,
            /<\/?[A-Z0-9]*:[A-Z]*[^>]*>/ig, /(lang|class|type|href|name|title|id|clear)=\"[^\"]*\"/ig, /style=(\'\'|\"\")/ig, /<![\[-].*?-*>/g,
            /MsoNormal/g, /<\\?\?xml[^>]*>/g, /<\/?o:p[^>]*>/g, /<\/?v:[^>]*>/g, /<\/?o:[^>]*>/g, /<\/?st1:[^>]*>/g, /&nbsp;/g,
            /<\/?SPAN[^>]*>/g, /<\/?FONT[^>]*>/g, /<\/?STRONG[^>]*>/g, /<\/?H1[^>]*>/g, /<\/?H2[^>]*>/g, /<\/?H3[^>]*>/g, /<\/?H4[^>]*>/g,
            /<\/?H5[^>]*>/g, /<\/?H6[^>]*>/g, /<\/?P[^>]*><\/P>/g, /<!--(.*)-->/g, /<!--(.*)>/g, /<!(.*)-->/g, /<\\?\?xml[^>]*>/g,
            /<\/?o:p[^>]*>/g, /<\/?v:[^>]*>/g, /<\/?o:[^>]*>/g, /<\/?st1:[^>]*>/g, /style=\"[^\"]*\"/g, /style=\'[^\"]*\'/g, /lang=\"[^\"]*\"/g,
            /lang=\'[^\"]*\'/g, /class=\"[^\"]*\"/g, /class=\'[^\"]*\'/g, /type=\"[^\"]*\"/g, /type=\'[^\"]*\'/g, /href=\'#[^\"]*\'/g,
            /href=\"#[^\"]*\"/g, /name=\"[^\"]*\"/g, /name=\'[^\"]*\'/g, / clear=\"all\"/g, /id=\"[^\"]*\"/g, /title=\"[^\"]*\"/g,
            /<span[^>]*>/g, /<\/?span[^>]*>/g, /class=/g];

        Ext.each(removals, function (s) {
            wordPaste = wordPaste.replace(s, "");
        });

        // keep the divs in paragraphs
        wordPaste = wordPaste.replace(/<div[^>]*>/g, "<p>");
        wordPaste = wordPaste.replace(/<\/?div[^>]*>/g, "</p>");
        return wordPaste;

    },

    getSelectedNode: function () {
        try {
            if (this.editor.getWin().getSelection) {
                var currNode = this.editor.getWin().getSelection().focusNode;
            } else if (this.editor.getDoc().getSelection) {
                var currNode = this.editor.getDoc().getSelection().focusNode;
            } else if (this.editor.getDoc().selection) {
                var currNode = this.editor.getDoc().selection.createRange().parentElement();
            }
        } catch (err) { }
        if (currNode) {
            if (currNode.nodeName == "#text") currNode = currNode.parentNode;
        }
        return currNode;
    },

    /**
    checkSelectionFormatBlock: function(){
    currNode = this.getSelectedNode();
    var index = -1;
    try{
    var currTag = currNode;
    var prevTagName = currNode.tagName;
    if (prevTagName) prevTagName = prevTagName.toLowerCase();

    while(prevTagName != "html"){
    if (prevTagName == "paragraph"){
    index = this.listFormatBlocks.indexOf('p')
    }else{
    index = this.listFormatBlocks.indexOf(prevTagName);
    }
    if (index >= 0) break;
                
    currTag = currTag.parentNode;
    prevTagName = currTag.tagName;
    if (prevTagName) prevTagName = prevTagName.toLowerCase();
    }
    }catch(err){}

    this.formatBlockSelect.dom.selectedIndex = index;
    return index;
    },
    */

    relayBtnCmd: function (btn) {
        this.relayCmd(btn.getItemId());
    },

    relayCmd: function (cmd, value) {
        Ext.defer(function () {
            var me = this;
            me.editor.focus();
            me.editor.execCmd(cmd, value);
        }, 10, this);
    },

    buttonTips: {
        undo: {
            title: 'Undo',
            text: 'Undo the last action.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        redo: {
            title: 'Redo',
            text: 'Redo the last action.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        //        removehtml: {
        //            title: 'Remove html',
        //            text: 'Remove html from the entire text.',
        //            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        //        },
        removehtml: {
            title: '插入图片',
            text: '从本地插入图片',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        removeformat: {
            title: '移除格式',
            text: '移除选定文字的格式',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        inserttable: {
            title: '插入表格',
            text: '在光标处插入表格',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        indent: {
            title: '增加缩进',
            text: '增加缩进',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        outdent: {
            title: '减少缩进',
            text: '减少缩进',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        superscript: {
            title: 'Superscript',
            text: 'Change font size to superscript.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        subscript: {
            title: 'Subscript',
            text: 'Change font size to subscript.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        inserthorizontalrule: {
            title: '插入水平线',
            text: '在光标处插入水平线',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        chars: {
            title: '特殊符号',
            text: '插入特殊符号',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },

        faceImages: {
            title: 'Face images',
            text: 'Insert Face Images.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },

        wordpaste: {
            title: 'Word paste',
            text: 'Clean the pasted text.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        images: {
            title: 'Images',
            text: 'Insert images.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        listFormatBlocks: {
            p: "Paragraph",
            h1: "Header 1",
            h2: "Header 2",
            h3: "Header 3",
            h4: "Header 4",
            h5: "Header 5",
            h6: "Header 6",
            address: "Address",
            pre: "Formatted"
        }
    }

})

/**
*   This override is required to make the formatBlock plugin to work in IE and WebKit browsers.
*   The default behaviour was to insert <br> tags when Enter was pressed. We have to let the browser insert a new paragraph
*	to be able to change the format.
*/
if (Ext.isIE || Ext.isWebKit) {
    Ext.override(Ext.form.field.HtmlEditor, {
        fixKeys: function () {
            if (Ext.isIE) {
                return function (e) {
                    var me = this,
                        k = e.getKey(),
                        doc = me.getDoc(),
                        range, target;
                    if (k === e.TAB) {
                        e.stopEvent();
                        range = doc.selection.createRange();
                        if (range) {
                            range.collapse(true);
                            range.pasteHTML('&nbsp;&nbsp;&nbsp;&nbsp;');
                            me.deferFocus();
                        }
                    }
                };
            }

            if (Ext.isOpera) {
                return function (e) {
                    var me = this;
                    if (e.getKey() === e.TAB) {
                        e.stopEvent();
                        me.win.focus();
                        me.execCmd('InsertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
                        me.deferFocus();
                    }
                };
            }

            if (Ext.isWebKit) {
                return function (e) {
                    var me = this,
                        k = e.getKey();
                    if (k === e.TAB) {
                        e.stopEvent();
                        me.execCmd('InsertText', '\t');
                        me.deferFocus();
                    }
                };
            }

            return null;
        } ()

    })
}