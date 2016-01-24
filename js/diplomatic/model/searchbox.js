define('diplomatic/model/searchbox', [
    'diplomatic/model/legende',
    'gettext!diplomatic',
    'jquery',
], function (legende, gt, $) {

    function populateTypeAhead(typeAheadStrings) {
        var fs=$('<input type="text" id="filter-string" class="input-medium search-query" autocomplete="off">');
        $('#filter-string').replaceWith(fs);
        
        fs.typeahead({'source': typeAheadStrings,
                      'updater': function(item) {
                          console.log('updater', item);
                          this.$element[0].value = item;
                          $('.form-search').submit();
                          return item;
                      }});
    }

    function create(typeAhead, addiLegendKeys) {
        var ele=$('#search-id');
        ele.html('');
        ele.append($('<option>', {id: '*'}).text('all'));
        for (var key in legende) {
            var ignore = false, title = legende[key].title;
            if (legende[key].ignore !== undefined) {
                ignore = legende[key].ignore;
            }
            if (legende[key].ignoreInSearch !== undefined) {
                ignore = legende[key].ignoreInSearch;
            }
            if (!ignore) {
                ele.append($('<option>', {id: key}).text(title));
            }
        }
        populateTypeAhead(typeAhead['*']);
        ele.change( function () {
            
            $('#search-id option:selected').each(function(){
                var key=this.id;
                if (key === '*') {
                    $('#search-op').fadeOut();
                    $('#search-value').fadeOut();
                    $('#filter-string').fadeIn();
                    populateTypeAhead(typeAhead[key]);
                } else {
                    if (legende[key].keys === undefined) {
                        $('#search-op').fadeIn();
                        $('#search-value').fadeOut();
                        $('#filter-string').fadeIn();
                        populateTypeAhead(typeAhead[key]);
                    } else {
                        $('#search-op').fadeIn();
                        $('#search-value').fadeIn();
                        $('#filter-string').fadeOut();
                        var valbox=$('#search-value').html('');
                        for (var value in legende[key].keys) {
                            valbox.append($('<option>', {id: value}).text(legende[key].keys[value]));
                        }
                        for (var oid in addiLegendKeys[key]) {
                            
                            var osmkey= addiLegendKeys[key][oid];
                            if (legende[key].keys[osmkey] === undefined) {
                                valbox.append($('<option>', {id: osmkey}).text(gt('%1$s (not documented tag)', osmkey)));
                            }
                        }
                    }
                }
            });
        });
    }
    function filterAll(feature, lowerFilterString) {
        
        if (!lowerFilterString) {
                
            return true;
        }
        var found = false;
        $.each(feature.properties.tags, function(k, v) {
            if (!found) {
                var value = v.toLowerCase();
                if (value.indexOf(lowerFilterString) !== -1) {
                    found = true;
                    return;
                }
            }
        });
        return found;
    }

    function filterEqTag(feature, filterKey, lowerFilterVal) {
        var found = false;
        var fKeys;
        if (Array.isArray(filterKey)) {
            fKeys=filterKey;
        } else {
            fKeys=[filterKey];
        }
        for (var i = 0; i <fKeys.length; i++) {
            var key=fKeys[i];
            var value=feature.properties.tags[key];
            if (value === undefined) {
                value='';
            } else {
                value= value.toLowerCase().strip();
            }
            if (value === lowerFilterVal) {
                found=true;
                break;
            }
        }
        return found;
    }
    function filterNeTag(feature, filterKey, lowerFilterString) {
        return (!filterEqTag(feature, filterKey, lowerFilterString));
    }

    function filterFunc(feature, filterKey, filterOp, lowerFilterString) {
        if (filterKey === '*') {
            return filterAll(feature, lowerFilterString);
        } //else {
        if (filterOp === 'ne') {
            return filterNeTag(feature, filterKey, lowerFilterString);
        } // else 
        return filterEqTag(feature, filterKey, lowerFilterString);
            
    }
    
    return {
        'create': create,
        'filterFunc': filterFunc,
    };
});
