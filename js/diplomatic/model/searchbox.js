define('diplomatic/model/searchbox', [
    'diplomatic/model/legende',
    'gettext!diplomatic',
    'jquery',
], function (legende, gt, $) {

    'use strict';

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
                }
            }
        });
        return found;
    }

    function filterEqTag(feature, filterKey, lowerFilterVal) {
        var value=feature.properties.tags[filterKey];
        if (value === undefined) {
            value='';
        } else {
            value= value.toLowerCase().strip();
        }
        return (value === lowerFilterVal);
    }
    function filterNeTag(feature, filterKey, lowerFilterString) {
        return (!filterEqTag(feature, filterKey, lowerFilterString));
    }

    function filterFunc(feature, filterKey, filterOp, lowerFilterString) {
        if (_.isArray(filterKey)) {
            var found=false;
            $.each(filterKey, function (idx, fk) {
                if (!found) {
                    found=filterFunc(feature, fk, filterOp, lowerFilterString);
                }
            });
            return found;
        } 
        // else 
        if (filterKey === '*')  {
            return filterAll(feature, lowerFilterString);
        } //else {
        if (filterOp === 'ne') {
            return filterNeTag(feature, filterKey, lowerFilterString);
        } // else 
        return filterEqTag(feature, filterKey, lowerFilterString);
            
    }
    
    return {
        'filterFunc': filterFunc,
    };
});
