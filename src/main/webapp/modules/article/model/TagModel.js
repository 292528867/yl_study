/**
 * Created by Jeffrey on 15/8/26.
 */
define('Tags.TagManager', {
    extend: 'Ext.data.Model',
    requires:[
        'Article.ArticleCellModel'
    ],
    fields: [
        { name: 'id', type: 'int'},
        { name: 'name', type: 'string'},
        { name: 'description', type: 'string'},
        { name: 'linkUrl', type: 'string'},
        { name: 'tagX', type: 'double'},
        { name: 'tagY', type: 'double'}
    ],
    belongsTo:{
        model: 'Article.ArticleCellModel',
        name:'tags'
    },
    proxy: {
        type: 'rest',
        url: serverUrl + '/tags',
        reader: {
            rootProperty: 'content',
            totalProperty: 'totalElements'
        }
    }
});