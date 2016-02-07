define('diplomatic/view/searchBox', [
    'jquery',
    'leaflet',
    'gettext!diplomatic',
    'diplomatic/model/legende',
    'css!diplomatic/view/searchBox',
], function ($, L, gt, legende) {

    var SearchBox =  L.Control.extend({
        onAdd: function (/*map*/) {
            var self=this,
                model=this.options.model;

            this.model=model;
            this._div = L.DomUtil.create('div', 'filter-container leaflet-control leaflet-bar');
            this._form=$('<form lass="form-search" class="noSelect">');
            this._form.submit(function (e) {
                e.preventDefault();
                self.options.clickFunc();
            });

            this._box=$('<div class="search-box">');
            this._form.append(this._box);
            this._box.append($('<a href="#" id="clear" class="leaflet-popup-close-button">').html('&#215'));
            self._searchId=$('<select name="search-id" id="search-id" class="search-what" size="1">');
            self._box.append(self._searchId);

            self.onSearchKeysChange();
            model.on('change:searchKeys', self.onSearchKeysChange);

            self._searchId.change( function () {
                model.set('searchKey',this.value);
            });
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
        },
        onSearchKeysChange: function () {                              
            var self=this;
            self._searchId.html('');
            self.model.getSearchKeys().forEach(function (val) {
                self._searchId.append($('<option>', {value: val.id}).text(val.title));
            });
        }
    });

    return SearchBox;

});