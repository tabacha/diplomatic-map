define('diplomatic/app/update-wikidata', [
    'fs', 
    'request', 
], function (fs, request ) {

    'use strict';


    if(typeof(String.prototype.strip) === 'undefined') {
        String.prototype.strip = function() {
            return String(this).replace(/^\s+|\s+$/g, '');
        };
    }
    function simplify(indata) {
        var keys= indata.head.vars;
        var data=indata.results.bindings;
        var outdata={};

        for (var itemIdx=0; itemIdx<data.length; itemIdx++) {
            var values={};
            var code='';
            for (var keyIdx=0; keyIdx<keys.length; keyIdx++) {
                var value=data[itemIdx][keys[keyIdx]].value;
                if (keys[keyIdx] === 'wikidataId') {
                    value=value.replace('http://www.wikidata.org/entity/', '');
                }
                if (keys[keyIdx] === 'code') {
                    code=value;
                } else {
                    values[keys[keyIdx]]=value;
                }
            }
            outdata[code]=values;
        }
        return outdata;
    }

    function updateWikidata(testmode, done, errFunc) {
        var baseurl='https://query.wikidata.org/sparql',
            outfile = 'data/wikidata.json',
            infile = 'country-code.sparql';

        if (testmode) {
            infile = 'country-code-test.sparql';
        }

        fs.readFile(infile, 'utf8', function (err, data) {
            if (err) {
                console.log(err);
                errFunc();
                return ;
            }
            var url = baseurl + '?format=json&query=' + 
                encodeURIComponent(data);
            console.log(url);
        
            request(url, function (error, response, content) {
                if (!error && response.statusCode == 200) {
                    var json = JSON.parse(content);
                    var output = simplify(json);
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
    }
    return updateWikidata;
});