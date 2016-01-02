define('diplomatic/app/update-overpass', [
    'fs', 
    'osmtogeojson', 
    'request', 
    'diplomatic/model/legende'
], function (fs, osmtogeojson, request, legende) {

    'use strict';

    var baseurl='http://overpass-api.de/api/interpreter',
        outfile = 'data/diplomatic.json';
        

    if(typeof(String.prototype.strip) === 'undefined') {
        String.prototype.strip = function() {
            return String(this).replace(/^\s+|\s+$/g, '');
        };
    }

    function calcTypeAhead(dataJson) {
        var allTypeAhead = [],
            additionalLegendeKeys = {},
            knownTypeAhead = {};
        
        
        for (var i = 0; i <dataJson.features.length; i++) {
            var tags=dataJson.features[i].properties.tags;
            for (var property in tags) {
                var val = tags[property];
                if (legende.hasOwnProperty(property)) {
                    if (additionalLegendeKeys[property]=== undefined) {
                        additionalLegendeKeys[property] = [];
                    }

                    if (legende[property].hasOwnProperty('keys')) {
                        if (!legende[property].keys.hasOwnProperty(val)) {
                            if (additionalLegendeKeys[property].indexOf(val) === -1) {
                                additionalLegendeKeys[property].push(val);
                            }
                        }
                    } else {
                        if (knownTypeAhead[property] === undefined) {
                            knownTypeAhead[property] = [];
                        }
                        if (knownTypeAhead[property].indexOf(val)=== -1) {
                            knownTypeAhead[property].push(val);
                        }
                    }
                } 
                if (tags.hasOwnProperty(property)) {
                    if (allTypeAhead.indexOf(val) === -1) {
                        allTypeAhead.push(val);
                    } 
                }
            }
        }
        var rtn = {
            'typeAhead': { 
                '*': calcTypeAheadPart(allTypeAhead)
            },
            'additionLegendKeys': additionalLegendeKeys
        };
        for (var tkey in  knownTypeAhead) {
            rtn.typeAhead[tkey] = calcTypeAheadPart(knownTypeAhead[tkey]);
        }
        return rtn;
    }
    function arrayToSet(a) {
        var temp = {};
        for (var i = 0; i < a.length; i++)
            temp[a[i]] = true;
        var r = [];
        for (var k in temp)
            r.push(k);
        return r;
    }
    function calcTypeAheadPart(typeAheadStrings) {
        var typeAheadSource=[];
        for (var i = typeAheadStrings.length -1; i>=1; i--) {
            var item = typeAheadStrings[i].strip();
            typeAheadSource.push(item);
            var words = item.split(/\W+/);
            for (var k = words.length - 1; k >= 0; k--) {
                typeAheadSource.push(words[k]);
            }
        }
        return arrayToSet(typeAheadSource);
    }

    
    fs.readFile('overpassquery.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var url = baseurl + '?data=' + 
            encodeURIComponent(data);
        console.log(url);
        
        request(url, function (error, response, content) {
            if (!error && response.statusCode == 200) {
                var json = JSON.parse(content);
                var geoJson = osmtogeojson(json);
                var output= calcTypeAhead(geoJson);
                output.geojson=geoJson;
                fs.writeFile(outfile, JSON.stringify(output), function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log('The file was saved!');
                });

            } else {
                console.log('Error fetching data', error, response);
            }
        });
    });
});