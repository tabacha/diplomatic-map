define('test/diplomatic/model/downloadCSV',[
    'diplomatic/model/downloadCsv',
], function (downloadCSV) {
    describe("downloadCSV", function() {
            var features=[
                {"type":"Feature",
                 "id":"way/59411707",
                 "properties": {
                     "type":"way",
                     "id":59411707,
                     "valiCount": {
                         "error":2,
                         "hint":0,
                         "warn":2,
                     },
                     "tags":{
                         "addr:city":"Bonn",
                         "addr:country":"DE",
                         "addr:housenumber":"42",
                         "addr:postcode":"53177",
                         "addr:street":"Waldstraße",
                         "amenity":"embassy",
                         "barrier":"fence",
                         "country":"RU",
                         "name":"Generalkonsulat der Russischen Föderation in Bonn",
                         "name:de":"Generalkonsulat der Russischen Föderation in Bonn","name:en":"Consulate General of Russia in Bonn",
                         "name:ru":"Генеральное консульство Российской Федерации в Бонне (ФРГ)",
                         "url":"http://www.ruskonsulatbonn.de/"},
                     "relations":[],
                     "meta": {
                         "timestamp":"2013-12-24T05:24:50Z",
                         "version":7,"changeset":19611905,
                         "user":"Manu1400",
                         "uid":181135
                     },
                     "geometry":"center"
                 },
                 "geometry":{
                     "type":"Point",
                     "coordinates":[7.133596,50.685129]
                 }
                },{
                    "type":"Feature",
                    "id":"way/103976449",
                    "properties": {
                        "type":"way",
                        "id":103976449,
                        "valiCount": {
                            "error":2,
                            "hint":0,
                            "warn":2,
                        },
                        "tags":{
                            "addr:city":"Bonn",
                            "addr:country":"DE",
                            "addr:housenumber":"6",
                            "addr:postcode":"53113",
                            "addr:street":"Erste Fährgasse",
                            "amenity":"embassy",
                            "building":"yes",
                            "country":"AE",
                            "diplomatic":"embassy",
                            "name":"Botschaft der Vereinigten Arabischen Emirate (Außenstelle)",
                            "target":"DE"
                        },
                        "relations":[],
                        "meta":{
                            "timestamp":"2015-06-04T17:17:03Z",
                            "version":5,
                            "changeset":31725297,
                            "user":"Jotam",
                            "uid":768145
                        },
                        "geometry":"center"
                    },
                    "geometry":{
                        "type":"Point","coordinates":[7.1088546,50.7322072]
                    }
                },
            ]

        it("has an output", function() {
            var out=downloadCSV.convert(features);

            expect(out).toBeDefined();
        });
        it("it has 3 Lines", function() {
            var out=downloadCSV.convert(features);

            var lines=out.split('\n');
            // bei drei Zeilen werden das 4 Arrays
            expect(lines.length).toEqual(4);
        });
        it("it has 29 Columns", function() {
            var out=downloadCSV.convert(features);

            var lines=out.split('\n');
            expect(lines[0].split(",").length).toEqual(29);
            expect(lines[1].split(",").length).toEqual(29);
            expect(lines[2].split(",").length).toEqual(29);
        });
    });
});