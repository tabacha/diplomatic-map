define('test/diplomatic/model/distance',[
    'diplomatic/model/distance',
], function (distance) {

    'use strict';
    
    describe("distnace calulation", function() {
        it("Hamburg - Berlin 230km +/- 10km", function() {
            var d=distance.calcFromLatLon(53,10,52.52,13.40);
            expect(d).toBeCloseTo(230,-1);
        });
    });
});

    
