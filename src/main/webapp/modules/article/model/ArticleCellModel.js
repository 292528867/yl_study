/**
 * Created by Jeffrey on 15/8/26.
 */

define('Article.ArticleCellModel', {
    extend: 'Ext.data.Model',
    requires: [
        'Article.ArticleModel',
        'Tags.TagManager'
    ],
    fields: [
        { name: 'id', type: 'int'},
        { name: 'description', type: 'string'},
        { name: 'picUrl', type: 'string'},
        { name: 'cellSort', type: 'int'},
        { name: 'type', type: 'string'},
        { name: 'picWidth', type: 'double'},
        { name: 'picHeight', type: 'double'}
    ],
    belongsTo: {
        model: 'Article.ArticleModel',
        name: 'articleCells'
    },
    hasMany:{
        model:'Tags.TagManager',
        name:'tags'
    },
    proxy: {
        type: 'rest',
        url: serverUrl + '/articleCells',
        reader: {
            rootProperty: 'content',
            totalProperty: 'totalElements'
        }
    }
});