define('test/diplomatic/model/distance_util', [
    'diplomatic/model/distance_util',
], function (distanceUtil) {
    
    'use strict';
    
    describe("find nearest city", function() {
        it("Consulte Ukraine in Remagen", function() {
            var cities={
                'Berlin': { lat: 52.520007, lon: 13.404954  },
                'Bonn': { lat: 50.737430, lon: 7.098207  },
                'Bruxelles': { lat: 50.850340, lon: 4.351710 },
                'Den Haag': { lat: 52.070498, lon: 4.300700 },
                'Falkensee (Brandenburg)': { lat: 52.562044, lon: 13.077000 },
                'Genf': { lat: 46.204391, lon: 6.143158 },
                'London': { lat: 51.507351, lon: 0 },
                'Melekeok, Republic of Palau': { lat: 7.495116, lon: 134.633690 },
                'New York': { lat: 40.712784, lon: -74.005941 },
                'Paris': { lat: 48.856614, lon: 2.352222 },
                'Remagen-Oberwinter': { lat: 50.6150, lon: 7.1991 },
            };
            // consulate of Ukraine in Remagen
            var cord={lat: 50.6139754, lon: 7.1983548};
            var d=distanceUtil.nearestCity(cities, cord, 60);
            expect(d).toEqual("Remagen-Oberwinter");
        });
    });


});
