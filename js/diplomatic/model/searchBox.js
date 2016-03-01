define('diplomatic/model/searchBox', [
    'backbone',
    'diplomatic/model/legende',
    'gettext!diplomatic',
], function (Backbone, legende, gt) {

    'use strict';

    var SearchBoxModel = Backbone.Model.extend({
        defaults: {
            showClear: false,
            operators: ['isin'],
            operator: 'isin',
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
                    };
                    if (legende[key].keys !== undefined) {
                        ele.keys=legende[key].keys;
                    }
                    if (legende[key].sameAs !== undefined) {
                        ele.sameAs = legende[key].sameAs;
                    }
                    searchKeys.push(ele);
                }
            }
            this.set('searchKeys', searchKeys);
            this.on('change:searchKey', this.onSearchKeyChange);
            this.on('change:operators', this.onOperatorsChange);
        },
        onOperatorsChange: function () {
            var model = this;
            var operators = model.get('operators');
            var operator = model.get('operator');
            if (operators.indexOf(operator) === -1) {
                model.set('operator', operators[0]);
            }
        },
        onSearchKeyChange: function () {
            var self = this;
            var searchKey=self.get('searchKey');
            $.each(this.get('searchKeys'), function (idx, key) {
                if (key.id === searchKey) {
                    if (key.keys) {
                        self.set({
                            'operators': key.ops,
                            'searchValues': key.keys,
                            'searchValue': _.keys(key.keys)[0],
                            'searchValueText': null,
                            'typeAhead': null,
                        });
                    } else {
                        self.set({
                            'operators': key.ops,
                            'searchValues': null,
                            'searchValue': null,
                            'searchValueText': '',
                            'typeAhead': key.typeAhead,
                        });
                    }
                }
            });
        },
        initAdditionalFeatures: function (features) {
            var tHName={}; // d2=0;
            var tHVals={};
            var realKeys={};
            var self=this;
            $.each(this.get('searchKeys'), function (idx, key) {
                if (key.keys) {
                    realKeys[key.id]={};
                } else {
                    if (key.sameAs!==undefined) {
                        tHVals[key.sameAs]={};
                    }
                    tHVals[key.id]={};
                }
            });
            features.forEach( function (f) {
                Object.keys(f.properties.tags).forEach( function (tag) {
                    var v=f.properties.tags[tag];
                    if (realKeys[tag]) {
                        realKeys[tag][v]=1;
                    }
                    // no telephone in type ahead
                    if (!(v.match(/^[\d\(\)\s\-+]*$/))) {
                        tHName[v]=1;
                        if (tHVals[tag]) {
                            tHVals[tag][v]=1;
                        }
                        v.split(/[\s;]/).forEach (function (n) {
                            if ((n!=='') &&
                                (!(n.match(/^[\d\(\)\-+]*$/)))) {
                                tHName[n]=1;
                                if (tHVals[tag]) {
                                    tHVals[tag][n]=1;
                                }
                            }
                        });
                    }
                });
            });
            var newSearchKeys=[];
            $.each(self.get('searchKeys'), function (idx, key) {
                if (key.keys) {
                    $.each(realKeys[key.id], function (newKey) {
                        if (key.keys[newKey] === undefined) {
                            key.keys[newKey]= gt('%1$s (not documented tag)', newKey);
                        }
                    });
                } else if (key.id==='*') {
                    key.typeAhead=Object.keys(tHName).sort();

                } else {
                    if (key.sameAs === undefined) {
                        key.typeAhead=Object.keys(tHVals[key.id]).sort();
                    } else {
                        key.typeAhead=Object.keys(jQuery.extend({}, tHVals[key.id], tHVals[key.sameAs])).sort();
                    }
                }
                newSearchKeys.push(key);
            });
            self.set({
                'searchKeys': newSearchKeys,
                'searchKey': '*',
                'typeAhead': Object.keys(tHName).sort()
            });
        },

        getOperators: function () {
            return operators;
        },

        getSearchKeys: function () {
            return this.get('searchKeys');
        },
        clear: function() {
            this.set(this.defaults);
        },
    });
    return SearchBoxModel;
});