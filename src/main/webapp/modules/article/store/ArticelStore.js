/**
 * Created by Jeffrey on 15/8/26.
 */

define('Article.ArticleStore', {
    extend: 'Ext.data.Store',
    model: 'Article.ArticleModel',
    pageSize: 10,
    autoLoad: true
});