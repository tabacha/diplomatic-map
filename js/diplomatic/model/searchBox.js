define('diplomatic/model/searchBox', [
    'backbone',
    'diplomatic/model/legende',
    'gettext!diplomatic',
], function (Backbone, legende, gt) {

    'use strict';

    var SearchBoxModel = Backbone.Model.extend({
        defaults: {
            showClear: false,
            operators: null,
            searchKey: '*',
            searchValues: null,
            searchValueText: '',
        },
        constructor: function() {
            Backbone.Model.apply(this, arguments);
            var searchKeys= [{
                id: '*',
                title: gt('all'),
                ops: ['isin'],
            }];
            for (var key in legende) {
                var ignore = false, title = legende[key].title;
                if (legende[key].ignore !== undefined) {
                    ignore = legende[key].ignore;
                }
                if (legende[key].ignoreInSearch !== undefined) {
                    ignore = legende[key].ignoreInSearch;
                }
                if (!ignore) {
                    var ele = {
                        'id': key, 
                        'title': title, 
                        'ops': [ 'eq', 'ne' ]
                    }
                    if (legende[key].keys !== undefined) {
                        ele.keys=legende[key].keys;
                    }
                    searchKeys.push(ele);
                }
            }
            this.set('searchKeys', searchKeys);
            this.on('change:searchKey', this.onSearchKeyChange);
        },
        onSearchKeyChange: function () {
        },
        initFromJsonData: function (data) {

        },

        /* returns operators or null if not there
           [{
                    id: 'eq',
                    title: '=',
                },
                {
                    id: 'ne',
                    html: '&ne;',
                }]
        */
        getOperators: function () {
            return operators;
        },

        /* returns 
           [{
             id: '12',
             title: 'abc',
           },...]
        */
        getSearchKeys: function () {
            return this.get('searchKeys');
        },
        
        /*
          returns
          [{ id: '12',
          title: 'abc',
          }] or null if not present (Textbox)
         */
        getSearchValues: function () {
        },

        getSearchTextTypeAhead: function () {
        },

        // called on click
        searchClick: function() {
        },
        
        clearClick: function() {
        },

        setOperator: function (opId) {
        },

        setSearchKey: function (keyId) {
        },

        setSearchValueId: function (valueId) {
        },

        setSearchValueText: function (txt) {
        },
    });
    return SearchBoxModel;
});