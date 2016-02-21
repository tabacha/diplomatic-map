define('diplomatic/app/de-inland', [
    'jquery',
    'gettext!diplomatic',
    'diplomatic/view/headline', 
    'diplomatic/model/distance',
    'diplomatic/model/distance_util',
    'jquery.tablesorter',
    'css!diplomatic/app/de-inland',
], function ($, gt, headline, distance, distanceUtil) {

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
        'Remagen-Oberwinter': { lat: 50.6150, lon: 7.1991 },
    };

    function filterDiplo(def) {
        return def.pipe(function (data) {
            var rtn=[];
            $.each(data.geojson.features, function(index, feature ) {
                var c=distanceUtil.nearestCity(placeCord, {
                    lat: feature.geometry.coordinates[1],
                    lon: feature.geometry.coordinates[0]
                }, 60 );
                if (c !== null) {
                    feature.city=c;
                    rtn.push(feature);
                }
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
        tr.append($('<th>').text(gt('Sending Country')));
        tr.append($('<th>').text(gt('Type')));
        tr.append($('<th>').text(gt('Subtype')));
        tr.append($('<th>').text(gt('Place')));
        tr.append($('<th>').text(gt('In OSM')));
        tr.append($('<th>').text(gt('Postal Code')));
        tr.append($('<th>').text(gt('Street')));
        tr.append($('<th>').text(gt('E-Mail')));
        tr.append($('<th>').text(gt('Website')));
        return thead;
    }
    $.when(
        filterDiplo(loadData('diplomatic.json')), 
        loadData('de-inland.json')
    ).done(function (features, dataJson) { 
        var container=$('<div class="container">');
        var table=$('<table class="tablesorter">');
        $('body').append(headline('de-inland.html')).append(container);
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
                        if (feature.properties.tags['diplomatic:sending_country'] !== undefined) {
                            c=feature.properties.tags['diplomatic:sending_country'];
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
            tr.append($('<td>').text(dataJson[i].Staat+' ('+dataJson[i]['iso3166-alpha2']+')'));
            tr.append($('<td>').text(dataJson[i].Missionsart.substr(0, 4)).attr('title', dataJson[i].Missionsart));
            tr.append($('<td>').text(dataJson[i].Missionstyp.substr(0, 4)).attr('title', dataJson[i].Missionstyp));
            tr.append($('<td>').text(translateCity[dataJson[i].Ort]).attr('title', dataJson[i].Ort));
            if (found === false ) {
                var source = gt('Coordinate (c) Mapbox');
                if (dataJson[i].geo.source === 'osm') {
                    source = gt('Coordinate (c) OpenStreetMap');
                }
                tr.append($('<td>').append($('<a>', {
                    class: 'not-found',
                    target: '_blank',
                    title: source,
                    href: 'https://www.openstreetmap.org/?zoom=17&mlat='+
                        dataJson[i].geo.lat+
                        '&mlon='+
                        dataJson[i].geo.lon
                }).text(gt('<not found>'))));
            } else {
                var name=found.properties.tags.name || gt('<missing name>');
                tr.append($('<td>', {
                    'class': 'vali-'+found.properties.valiCount.color
                }).append(
                    $('<a>', {
                        'href': 'https://www.openstreetmap.org/'+found.id,
                        'target': 'osm-'+found.id
                    }).text(name)));
            }
            tr.append($('<td>').text(dataJson[i].PLZ));
            tr.append($('<td>').text(dataJson[i]['Strasse Nr']));
            tr.append($('<td>').text(dataJson[i]['E-Mail']));
            tr.append($('<td>').text(dataJson[i]['I-Net']));
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