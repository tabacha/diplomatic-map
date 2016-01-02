var fs = require('fs'),
    request = require('request'),
    togeojson = require('osmtogeojson'),
    baseurl='http://overpass-api.de/api/interpreter',
    outfile = 'data/diplomatic.geojson';

fs.readFile('overpassquery.txt', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    var url = baseurl + '?data=' + 
        encodeURIComponent(data);
    console.log(url);

    request(url, function (error, response, json) {
        if (!error && response.statusCode == 200) {
            fs.writeFile(outfile, JSON.stringify(togeojson(JSON.parse(json))), function(err) {
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