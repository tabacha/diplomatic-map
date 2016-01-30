define('diplomatic/view/searchBox', [
    'jquery',
    'leaflet',
    'gettext!diplomatic',  
    'css!diplomatic/view/searchBox',
], function ($, L, gt) {

    var SearchBox =  L.Control.extend({
        onAdd: function (/*map*/) {
            var self=this;
            this._div = L.DomUtil.create('div', 'filter-container leaflet-control leaflet-bar');
            this._form=$('<form lass="form-search" class="noSelect">');
            this._form.submit(function (e) {
                e.preventDefault();
                self.options.clickFunc();
            });
            this._box=$('<div class="search-box">');
            this._form.append(this._box);
            this._box.append($('<a href="#" id="clear" class="leaflet-popup-close-button">').html('&#215'));
            this._box.append($('<select name="search-id" id="search-id" class="search-what" size="1">')
                             .append($('<option id="*">').text(gt('all'))));
            this._box.append($('<select name="search-op" id="search-op" size="1">')
                             .append($('<option id="eq">').text('='))
                             .append($('<option id="ne">').html('&ne;'))
                            );
            this._box.append($('<select name="search-value" id="search-value" class="search-value" size="1">'));
            this._box.append($('<input type="text" id="filter-string" class="input-medium search-query" autocomplete="off">'));
            var a=$('<a href="#" class="btn-search">')
                .append($('<i class="fa fa-search">'));
            a.click(function (e) {
                e.preventDefault();
                self.options.clickFunc();
            });
            this._box.append(a);

            this._div.appendChild(this._form[0]);
            return this._div;
        }
    });

    return SearchBox;

});