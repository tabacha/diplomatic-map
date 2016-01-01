fs = require('fs');
request = require('request');
fs.readFile('overpassquery.txt', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    var url='http://overpass-api.de/api/interpreter?data=' + 
        encodeURIComponent(data);
    console.log(url);
    request(url).pipe(fs.createWriteStream('data/diplomatic.csv'));
});