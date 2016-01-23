define('diplomatic/app/update-overpass', [
    'fs', 
    'osmtogeojson', 
    'request', 
    'diplomatic/model/legende',
    'diplomatic/model/tagValidator'
], function (fs, osmtogeojson, request, legende, tagValidator) {

    'use strict';


    if(typeof(String.prototype.strip) === 'undefined') {
        String.prototype.strip = function() {
            return String(this).replace(/^\s+|\s+$/g, '');
        };
    }

    function calcTypeAhead(dataJson) {
        var allTypeAhead = [],
            additionalLegendeKeys = {},
            knownTypeAhead = {};

        for (var prop in  legende) {
            if (!legende[prop].hasOwnProperty('keys')) {
                knownTypeAhead[prop] = [];
            }
        }
        
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
            var ignore=false;
            if (legende[tkey].ignoreInSearch !== undefined) {
                ignore = legende[tkey].ignoreInSearch;
            }
            if (!ignore) {
                if (legende[tkey].sameAs === undefined) {
                    rtn.typeAhead[tkey] = calcTypeAheadPart(knownTypeAhead[tkey]);
                } else {
                    rtn.typeAhead[tkey] = calcTypeAheadPart(knownTypeAhead[tkey].concat((knownTypeAhead[legende[tkey].sameAs])));
                }
            }
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

    function updateOverpass(testmode, done, err) {
        var baseurl='http://overpass-api.de/api/interpreter',
            outfile = 'data/diplomatic.json',
            infile = 'overpassquery.txt';

        if (testmode) {
            infile = 'overpassquery-test.txt';
        }

        fs.readFile(infile, 'utf8', function (err, data) {
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
                    for (var f=0; f<output.geojson.features.length; f++) {
                        output.geojson.features[f].properties.valiCount=tagValidator.count(output.geojson.features[f].properties.tags);
                    }
                    output.osm3s = json.osm3s;
                    var outStr;
                    if (testmode) {
                        outStr=JSON.stringify(output, null, 2);
                    } else {
                        outStr=JSON.stringify(output);
                    }
                    fs.writeFile(outfile, outStr, function(err) {
                        if(err) {
                            console.log(err);
                            err();
                            return;
                        }
                        console.log('The file was saved!');
                        done();
                    });
                    
                } else {
                    console.log('Error fetching data', error, response);
                    err();
                }
            });
        });
    }
    return updateOverpass;
});