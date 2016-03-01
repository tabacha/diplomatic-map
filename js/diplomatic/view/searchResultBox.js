define('diplomatic/view/searchResultBox', [
    'leaflet',
    'gettext!diplomatic',  
    'css!diplomatic/view/searchResultBox',
], function (L, gt) {

    'use strict';

    var SearchResultBox =  L.Control.extend({
        onAdd: function (/*map*/) {
            var self = this;
            this._div = L.DomUtil.create('div', 'leaflet-control leaflet-bar search-result-count-box');
            this._model = self.options.model;
            this._model.on('change', function () { 
                self.onModelChange(); 
            });
            this.onModelChange();
            return this._div;
        }, 
        onModelChange: function () {
            var model = this._model;
            if (model.get('loading')) {
                this._div.innerText=gt('Loading ...');
            } else {
                var hits =  model.get('hits'),
                    total = model.get('total');
                if (hits == total) {
                    this._div.innerText=gt('Showing all %1$d enties.', hits);
                } else {
                    this._div.innerText=gt('Show %1$d of %2$d.', hits, total);
                }
            }
        }
    });

    return SearchResultBox;

});