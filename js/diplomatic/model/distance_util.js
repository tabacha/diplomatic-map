define('diplomatic/model/distance_util', [
    'jquery',
    'diplomatic/model/distance',
], function ($, distance) {

    function findNearestCity(cities, cord, max) {
        var skip=0;
        var rtn=null;
        $.each(cities, function( city, cityCord ) {
            if ((skip===0)) {
                var d=distance.calcFromLatLon(cord.lat,
                                              cord.lon,
                                              cityCord.lat, 
                                              cityCord.lon );
                if (d<max) {
                    rtn=city;
                    skip=1;
                }
            } // else skip
        });
        return rtn;
    }

    return {
        'nearestCity': findNearestCity,
    };
});
