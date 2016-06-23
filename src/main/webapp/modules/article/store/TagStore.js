/**
 * Created by Jeffrey on 15/8/26.
 */
define('Tags.TagStore', {
    extend: 'Ext.data.Store',

    model: 'Tags.TagModel',
    autoLoad: true,
    pageSize: 10
});