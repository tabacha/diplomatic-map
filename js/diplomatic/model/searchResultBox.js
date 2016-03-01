define('diplomatic/model/searchResultBox', [
    'backbone',
], function (Backbone) {

    'use strict';

    var SearchResultBoxModel = Backbone.Model.extend({
        defaults: {
            loading: true
        },
        setLoading: function () {
            this.set('loading', true);
            this.unset('hits');
        },
        setTotal: function (total) {
            this.set('total', total);
            if (this.has('hits')) {
                this.set('loading', false);
            }
        },
        setHits: function (hits) {
            this.set('hits', hits);
            if (this.has('total')) {
                this.set('loading', false);
            }
        }
    });

    return SearchResultBoxModel;
    
});