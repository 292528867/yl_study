/*!
* @author caizhiping
* 下拉树
*/
Ext.define('keel.TreeComboBox',{
	extend : 'Ext.form.field.ComboBox',
	//alias: 'widget.keeltreecombo',
	store : new Ext.data.ArrayStore({fields:[],data:[[]]}),
	editable : false,
	allowBlank:false,
	listConfig : {resizable:true,minWidth:250,maxWidth:450},
	_idValue : null,
	_txtValue : null,
	callback : Ext.emptyFn,
	treeObj : new Ext.tree.Panel({
				border : false,
				height : 250,
				//width : 350,
				autoScroll : true,
				rootVisible: false,
				store:  new Ext.data.TreeStore({
					proxy:{
						type:'ajax',
						url:'../../../checktree?id=aaa'
					}
				})
	}),
	initComponent : function(){
		this.treeRenderId = Ext.id();
		this.tpl = "<tpl><div id='"+this.treeRenderId+"'></div></tpl>";		
		this.callParent(arguments);
		this.on({
			'expand' : function(){
			    if(!this.treeObj.rendered&&this.treeObj&&!this.readOnly){
			        Ext.defer(function(){
		        		this.treeObj.render(this.treeRenderId);
		        	},300,this);
			    }
			}
		});
		this.treeObj.on('itemclick',function(view,rec){
			if(rec){
				this.setValue(this._txtValue = rec.get('text'));
				this._idValue = rec.get('id');
				//设置回调
                this.callback.call(this,rec.get('id'), rec.get('text'));
                //关闭tree
				this.collapse();
			}
		},this);
	},
	getValue : function(){//获取id值
		return this._idValue;
	},
	getTextValue : function(){//获取text值
		return this._txtValue;
	},
	setLocalValue : function(txt,id){//设值
		this._idValue = id;
		this.setValue(this._txtValue = txt);
	}
});