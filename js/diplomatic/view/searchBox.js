define('diplomatic/view/searchBox', [
    'jquery',
    'leaflet',
    'gettext!diplomatic',
    'css!diplomatic/view/searchBox',
], function ($, L, gt) {

    var operatorTitle = {
        'eq': '=',
        'ne': '&ne;',
        'isin': gt('contains'),
    };
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
            self._clear=$('<a href="#" id="clear" class="leaflet-popup-close-button">').html('&#215');
            this._box.append(self._clear);
            model.on('change:showClear', function () {
                if (model.get('showClear')) {
                    console.log('show clear');
                    self._clear.fadeIn();
                } else {
                    console.log('hide clear');
                    self._clear.fadeOut();
                }
            });
            self._searchId=$('<select name="search-id" id="search-id" class="search-what" size="1">');
            self._box.append(self._searchId);
            self.onSearchKeysChange();
            model.on('change:searchKeys', function () {
                self.onSearchKeysChange();
            });
            model.on('change:searchKey', function () {
                self._searchId.val(model.get('searchKey'));
            });
            self._searchId.change( function () {
                model.set('searchKey', this.value);
            });
            this._searchOp=$('<select name="search-op" id="search-op" size="1">');
            self.onOperatorsChange();

            self._searchOp.change( function () {
                model.set('operator', this.value);
            });

            model.on('change:operators', function () {
                self.onOperatorsChange();
            });
            model.on('change:operator', function () {
                self.onOperatorChange();
            });

            this._box.append(this._searchOp);
            this._searchValue=$('<select name="search-value" id="search-value" class="search-value" size="1">');
            this._box.append(this._searchValue);
            this._searchValue.change( function () {
                model.set('searchValue', this.value);
            });
            model.on('change:searchValues', function (){
                self.onSearchValuesChange();
            });
            model.on('change:searchValue', function (model, value){
                self._searchValue.val(value);
            });
            this._searchValueText=$('<input type="text" id="filter-string" class="input-medium search-query" autocomplete="off">');
            this._box.append(this._searchValueText);
            model.on('change:searchValueText', function () {
                self.onSearchValueTextChange();
            });
            this._searchValueText.change( function () {
                model.set('searchValueText', this.value);
            });

            model.on('change:typeAhead', function () {
                self.populateTypeAhead();
            });
            var a=$('<a href="#" class="btn-search">')
                .append($('<i class="fa fa-search">'));
            a.click(function (e) {
                e.preventDefault();
                self.options.clickFunc();
            });
            this._box.append(a);

            this._div.appendChild(this._form[0]);
            if (!model.get('showClear')) {
                console.log('fadeOut Clear');
                self._clear.hide();
            }

            return this._div;
        },
        populateTypeAhead: function () {
            var model= this.model;
            var typeAhead= this.model.get('typeAhead');
            if (typeAhead !== null) {
                var fs=$('<input type="text" id="filter-string" class="input-medium search-query" autocomplete="off">');
                this._searchValueText.replaceWith(fs);
                this._searchValueText=fs;
                this._searchValueText.fadeIn();
                this._searchValueText.typeahead({
                    'source': typeAhead,
                    'updater': function(item) {
                        console.log('updater', item);
                        model.set('searchValueText', item);
                        return item;
                    }
                });
            }
        },
        onSearchKeysChange: function () { 
            var self=this;
            self._searchId.html('');
            self.model.getSearchKeys().forEach(function (val) {
                self._searchId.append($('<option>', {value: val.id}).text(val.title));
            });
        },
        onOperatorChange: function () {
            var self = this;
            var operator = this.model.get('operator');
            self._searchOp.val(operator);
        },
        onOperatorsChange: function () {
            var self = this;
            var operators = this.model.get('operators');
            var operator = this.model.get('operator');
            if (operators.length ==1) {
                this._searchOp.fadeOut();
            } else {
                this._searchOp.html('');
                $.each(operators, function (index, op) {
                    var el=$('<option>').attr('value', op).html(operatorTitle[op]);
                    self._searchOp.append(el);
                });
                self._searchOp.val(operator);
                this._searchOp.fadeIn();
            }
        },
        onSearchValuesChange: function () {
            var self=this;
            var values=self.model.get('searchValues');
            if (values === null) {
                self._searchValue.fadeOut();
            } else {
                self._searchValue.html('');
                self._searchValue.fadeIn();
                $.each(values, function (key, val) {
                    self._searchValue.append($('<option>', {value: key}).text(val));
                });
            }
        },
        onSearchValueTextChange: function () {
            var self=this;
            var value=self.model.get('searchValueText');
            if (value === null) {
                self._searchValueText.fadeOut();
            } else {
                self._searchValueText.fadeIn();
                self._searchValueText.attr('value', value);
            }
        }

    });

    return SearchBox;

});