/**
 * Created by Jeffrey on 15/8/26.
 */

define('Article.ArticleCellStore', {
    extend: 'Ext.data.Store',

    model: 'Article.ArticleCellModel',
    pageSize: 10,
    autoLoad: true
});