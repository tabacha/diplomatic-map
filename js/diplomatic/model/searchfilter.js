define('diplomatic/model/searchfilter', [
    'jquery',
], function ($) {

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

    function filterFunc(feature, filterKey, filterOp, lowerFilterString) {
        if (filterOp === 'ne') {
            return (!(filterFunc(feature, filterKey, 'eq', lowerFilterString)));
        } // else
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
        } // else 
        return filterEqTag(feature, filterKey, lowerFilterString);
    }
    
    return {
        'filterFunc': filterFunc,
    };
});
