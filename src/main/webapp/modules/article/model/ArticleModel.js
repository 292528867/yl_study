/**
 * Created by Jeffrey on 15/8/26.
 */

define('Article.ArticleModel', {
    extend: 'Ext.data.Model',
    requires: [
        'Article.ArticleCellModel'
    ],
    fields: [
        //文章
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'title',
            type: 'string'
        },
        {
            name: 'recommendValue',
            type: 'int'
        }
    ],
    hasMany:{
        model: 'Article.ArticleCellModel',
        name: 'cells'
    },
    proxy: {
        type: 'rest',
        url: serverUrl + '/article',
        reader: {
            rootProperty: 'content',
            totalProperty: 'totalElements'
        }
    }
});
