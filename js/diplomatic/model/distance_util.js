define('diplomatic/model/distance_util', [
    'jquery',
    'diplomatic/model/distance',
], function ($, distance) {

    function findNearestCity(cities, cord, max) {
        var rtn=null;
        var myMax=max;
        $.each(cities, function( city, cityCord ) {
            var d=distance.calcFromLatLon(cord.lat,
                                          cord.lon,
                                          cityCord.lat, 
                                          cityCord.lon );
            if (d<myMax) { 
                rtn=city;
                myMax=d;
            }
        });
        return rtn;
    }

    return {
        'nearestCity': findNearestCity,
    };
});
