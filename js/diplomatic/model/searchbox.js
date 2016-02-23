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
        'filterFunc': filterFunc,
    };
});
