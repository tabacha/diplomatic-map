define('diplomatic/app/update-overpass', [
    'fs', 
    'osmtogeojson', 
    'request', 
    'diplomatic/model/legende',
    'diplomatic/model/tagValidator',
    'diplomatic/model/wikidata'
], function (fs, osmtogeojson, request, legende, tagValidator, wikidata) {

    'use strict';

    function updateOverpass(testmode, done, errFunc) {
        var baseurl='http://overpass-api.de/api/interpreter',
            outfile = 'data/diplomatic.json',
            wikidatafile = 'data/wikidata.json',
            infile = 'overpassquery.txt';

        if (testmode) {
            infile = 'overpassquery-test.txt';
        }
        fs.readFile(wikidatafile, 'utf8', function (wikiErr, txt) {
            if (wikiErr) {
                console.log(wikiErr);
                errFunc();
                return ;
            }
            wikidata.testLoad(JSON.parse(txt));

            fs.readFile(infile, 'utf8', function (err, data) {
                if (err) {
                    console.log(err);
                    errFunc();
                    return ;
                }
                var url = baseurl + '?data=' + 
                    encodeURIComponent(data);
                console.log(url);
        
                request(url, function (error, response, content) {
                    if (!error && response.statusCode == 200) {
                        var json = JSON.parse(content);
                        var geoJson = osmtogeojson(json);
                        var output= {};
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
                                errFunc();
                                return;
                            }
                            console.log('The file was saved!');
                            done();
                        });
                        
                    } else {
                        console.log('Error fetching data', error, response);
                        errFunc();
                    }
                });
            });
        });
    }
                   
    return updateOverpass;
});