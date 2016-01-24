define('diplomatic/model/downloadCsv', [
    'diplomatic/model/legende',
], function (legende) {

    'use strict';

    function convertRow(data, keys) {
        var row=[data.properties.id, 
                 data.properties.type, 
                 data.geometry.coordinates[1], 
                 data.geometry.coordinates[0],
                 data.properties.meta.timestamp,
                 data.properties.valiCount.error,
                 data.properties.valiCount.warn,
                 data.properties.valiCount.hint,
                ],
            tags=data.properties.tags;
        for (var i=0; i<keys.length; i++) {
            var key=keys[i];
            var result='';
            if (tags[key] !== undefined) {
                result=tags[key];
            }
            row.push(result);
        }
        return row;
    }

    function convertToRows(features) {
        var rows=[];
        var keys=[];
        var headers=[':id', ':type', ':lat', ':lon', ':last-changed', ':valiErr', ':valiWarn', ':valiHint'];
        for (var key in legende) {
            keys.push(key);
            headers.push(key);
        }
        rows.push(headers);
        for (var i=0; i<features.length; i++) {
            rows.push(convertRow(features[i], keys));
        }
        return rows;
    }

    function convertToCsv(features) {
        var rows= convertToRows(features),
            out='';
        for (var i=0; i<rows.length; i++) {
            var row = rows[i];
            var json=JSON.stringify(row);
            json=json.substring(1, json.length-1);
            out=out+json+'\n';
        }
        return out;
    }

    return {
        'convert': convertToCsv,
    };
});