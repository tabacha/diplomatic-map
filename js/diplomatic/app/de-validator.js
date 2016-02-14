define('diplomatic/app/de-validator', [
    'jquery',
    'gettext!diplomatic',
    'diplomatic/view/headline', 
    'jquery.tablesorter',
    'css!diplomatic/app/de-validator',
], function ($, gt, headline) {

    'use strict';

    var translateCity= {
        'Brüssel': 'Bruxelles',
        'GB-London SW7 5DN': 'London',
        'GB-London SWIX 8NT': 'London',
        'GB-London W1H 4LP': 'London',
        'GB-London W1H 6AB': 'London',
        'GB-London W1X 8AH': 'London',
        'GB-London W8 5DL': 'London',
        'London SW5 OHW': 'London',
        'Berlin': 'Berlin',
        'Bonn': 'Bonn',
        'Bruxelles': 'Bruxelles',
        'Den Haag': 'Den Haag',
        'Falkensee (Brandenburg)': 'Falkensee (Brandenburg)',
        'Genf': 'Genf',
        'London': 'London',
        'Melekeok, Republic of Palau': 'Melekeok, Republic of Palau',
        'New York': 'New York',
        'Paris': 'Paris',
        'Remagen-Oberwinter': 'Remagen-Oberwinter',
    };
    var placeCord={
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
        'Remagen-Oberwinter': { lat: 50.611185, lon: 7.207434 },
    };

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1); 
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI/180);
    }
    function filterDiplo(def) {
        return def.pipe(function (data) {
            var rtn=[];
            $.each(data.geojson.features, function(index, feature ) {
                var skip=0;
                $.each( placeCord, function( key, value ) {
                    if ((value.dup === undefined) && (skip===0)) {
                        var d=getDistanceFromLatLonInKm(feature.geometry.coordinates[1],
                                                        feature.geometry.coordinates[0], 
                                                        value.lat, 
                                                        value.lon );
                        if (d<60) {
                            feature.city=key;
                            rtn.push(feature);
                            skip=1;
                        }
                    } // else skip
                });
            });
            return rtn;
        });
    }
    function loadData(name) {
        return $.ajax({
            type: 'GET',
            dataType: 'text',
            url: 'data/'+name,
            contentType: 'text/text; charset=utf-8',
        }).pipe( function (txt) {
            return JSON.parse(txt);
        });
    }
    function createThead() {
        var thead=$('<thead>');
        var tr=$('<tr>');
        thead.append(tr);
        tr.append($('<th>').text('Sending Country'));
        tr.append($('<th>').text('Type'));
        tr.append($('<th>').text('Subtype'));
        tr.append($('<th>').text('Place'));
        tr.append($('<th>').text('Postal Code'));
        tr.append($('<th>').text('Street'));
        tr.append($('<th>').text('In OSM'));
        return thead;
    }
    $.when(
        filterDiplo(loadData('diplomatic.json')), 
        loadData('de-inland.json')
    ).done(function (features, dataJson) { 
        var container=$('<div class="container">');
        var table=$('<table class="tablesorter">');
        $('body').append(headline('de-validator.html')).append(container);
        container.append($('<p>').text(gt('The following table was given by "Außenministerium der Bundesrepublik Deutschland".')));
        container.append(table);
        table.append(createThead());     
//            thead.append($('<th>').text('E-Mail'));
//            thead.append($('<th>').text('Website'));
        var tbody=$('<tbody>');
        table.append(tbody);
        $.each(dataJson, function (i) {
//        for (var i=0; i<dataJson.length; i++) {
            var found=false;
            var c = null;
            var city=translateCity[dataJson[i].Ort];
            $.each(features, function (idx, feature) {
                if (found===false) {
                    if (feature.city === city) {
                        if (feature.properties.tags['diplomatic:sendig_country'] !== undefined) {
                            c=feature.properties.tags['diplomatic:sendig_country'];
                        } else if (feature.properties.tags.country !== undefined) {
                            c=feature.properties.tags.country;
                        } else {
                            c=null;
                        }
                        if (c !== null) {
                            c=c.split(';');
                            for (var ic=0; ic<c.length; ic++) {
                                if ((dataJson[i]['iso3166-alpha2'] === c[ic])) {
                                    found= feature;
                                }
                            }
                        }
                    }
                }
            });
            var tr=$('<tr>');
            tbody.append(tr);
            tr.append($('<td>').text(dataJson[i].Staat));
            tr.append($('<td>').text(dataJson[i].Missionsart.substr(0, 4)).attr('title', dataJson[i].Missionsart));
            tr.append($('<td>').text(dataJson[i].Missionstyp.substr(0, 4)).attr('title', dataJson[i].Missionstyp));
            tr.append($('<td>').text(translateCity[dataJson[i].Ort]).attr('title', dataJson[i].Ort));
            tr.append($('<td>').text(dataJson[i].PLZ));
            tr.append($('<td>').text(dataJson[i]['Strasse Nr']));
            if (found === false ) {
                tr.append($('<td>').append($('<a>', {
                    class: 'not-found',
                    target: '_blank',
                    title: 'Koordinate (c) Mapbox',
                    href: 'https://www.openstreetmap.org/?zoom=17&mlat='+
                        dataJson[i].geo.lat+
                        '&mlon='+
                        dataJson[i].geo.lon
                }).text(gt('<not found>'))));
            } else {
                var name=found.properties.tags.name || '<missing name>';
                tr.append($('<td>', {
                    'class': 'vali-'+found.properties.valiCount.color
                }).append(
                    $('<a>', {
                        'href': 'https://www.openstreetmap.org/'+found.id,
                        'target': 'osm-'+found.id
                    }).text(name)));
            }
            //                tr.append($('<td>').text(dataJson[i]['E-Mail']));
            //                tr.append($('<td>').text(dataJson[i]['I-Net']));
            
        });
        
        table.tablesorter({
            theme: 'bootstrap',
            headerTemplate: '{content} {icon}',
                // hidden filter input/selects will resize the columns, so try to minimize the change
                //widthFixed : true,

                // initialize zebra striping and filter widgets
            widgets: ['uitheme', 'zebra', 'filter'],
            widgetOptions: {
                    // using the default zebra striping class name, so it actually isn't included in the theme variable above
                    // this is ONLY needed for bootstrap theming if you are using the filter widget, because rows are hidden
                zebra: ['even', 'odd'],
                    // reset filters button
                filter_reset: '.reset',

                    // extra css class name (string or array) added to the filter element (input or select)
                filter_cssFilter: 'form-control',
            }
        });
    }).fail( function (err) {
        console.error(err);
    }).progress( function () {
        console.log('.');
    });
});