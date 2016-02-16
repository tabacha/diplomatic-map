define('diplomatic/app/de-ausland', [
    'jquery',
    'gettext!diplomatic',
    'diplomatic/view/headline',
    'diplomatic/model/distance',
    'jquery.tablesorter',
    'css!diplomatic/app/de-inland',
], function ($, gt, headline, distance) {

    'use strict';

    function findInFeatures(features, iso, lat, lon) {
        var rtn=[];
        $.each(features, function(index, feature ) {
            var found=false;
            var c=feature.reciving.split(';');
            for (var ic=0; ic<c.length; ic++) {
                if (c[ic]===iso) {
                    found=true;
                }
            }
            if (found) {
                var d=distance.calcFromLatLon(feature.geometry.coordinates[1],
                                              feature.geometry.coordinates[0], 
                                              lat, 
                                              lon );
                if (d<60) {
                    rtn.push(feature);
                }
            }
        });
        if (rtn.length === 0) {
            return false;
        } else {
            return rtn[0];
        }
    }

    function filterDiplo(def) {
        return def.pipe(function (data) {
            var rtn=[];
            $.each(data.geojson.features, function(index, feature ) {
                var c;
                if (feature.properties.tags['diplomatic:sending_country'] !== undefined) {
                    c=feature.properties.tags['diplomatic:sending_country'];
                } else {
                    c=feature.properties.tags.country;
                }
                if (c !== undefined) {
                    c=c.split(';');
                    var found=false;
                    for (var ic=0; ic<c.length; ic++) {
                        if (c[ic]==='DE') {
                            found=true;
                        }
                    }

                    if (found) {
                        if (feature.properties.tags['diplomatic:reciving_country'] !== undefined) {
                            feature.reciving=feature.properties.tags['diplomatic:reciving_country'];
                            rtn.push(feature);
                        } else if (feature.properties.tags.target !== undefined) {
                            feature.reciving=feature.properties.tags.target;
                            rtn.push(feature);
                        }
                    }
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
        tr.append($('<th>').text(gt('Revicing Country')));
        tr.append($('<th>').text(gt('Place')));
        tr.append($('<th>').text(gt('Continent')));
        tr.append($('<th>').text(gt('In OSM')));
        tr.append($('<th>').text(gt('District')));
        tr.append($('<th>').text(gt('Address')));
        tr.append($('<th>').text(gt('Phone')));
        tr.append($('<th>').text(gt('E-Mail')));
        tr.append($('<th>').text(gt('Website')));
        tr.append($('<th>').text(gt('Fax')));
        tr.append($('<th>').text(gt('Name')));
        tr.append($('<th>').text(gt('Operator')));
        tr.append($('<th>').text(gt('Post-Address')));
        return thead;
    }
    $.when(
        filterDiplo(loadData('diplomatic.json')), 
        loadData('de-ausland.json')
    ).done(function (features, dataJson) { 
        var container=$('<div class="container">');
        var table=$('<table class="tablesorter">');
        $('body').append(headline('de-ausland.html')).append(container);
        container.append($('<p>').text(gt('The following table was given by "Außenministerium der Bundesrepublik Deutschland".')));
        container.append(table);
        table.append(createThead());     
//            thead.append($('<th>').text('E-Mail'));
//            thead.append($('<th>').text('Website'));
        var tbody=$('<tbody>');
        table.append(tbody);
        $.each(dataJson, function (i) {
            var found=false;
            if (dataJson[i].lat !== undefined) {
                found=findInFeatures(features, dataJson[i]['iso3166-alpha2'], dataJson[i].lat, dataJson[i].lon);
            } else {
                $.each(dataJson[i].geonames, function (index, geo) {
                    if (found===false) {
                        found=findInFeatures(features, dataJson[i]['iso3166-alpha2'], geo.lat, geo.lon);
                    }
                });
            }
            var tr=$('<tr>');
            tbody.append(tr);
            tr.append($('<td>').text(dataJson[i].Land+' ('+dataJson[i]['iso3166-alpha2']+')'));
            tr.append($('<td>').text(dataJson[i].Ort));
            tr.append($('<td>').text(dataJson[i].Erdteil));
            if (found === false) {
                var td=$('<td>');
                tr.append(td);
                if (dataJson[i].lat) {
                    td.append($('<a>', {
                        class: 'not-found',
                        target: '_blank',
                        title: gt('coordinate search by OpenDiplomaticMap contributor'),
                        href: 'https://www.openstreetmap.org/?zoom=13&mlat='+
                            dataJson[i].lat+
                            '&mlon='+
                            dataJson[i].lon
                    }).text(gt('<not found>')));
                } else {
                    if (dataJson[i].geonames.length===1) {
                        td.append($('<a>', {
                            class: 'not-found',
                            target: '_blank',
                            title: gt('Coordinate (c) Geonames'),
                            href: 'https://www.openstreetmap.org/?zoom=13&mlat='+
                                dataJson[i].geonames[0].lat+
                                '&mlon='+
                                dataJson[i].geonames[0].lon
                        }).text(gt('<not found>')));
                    } else {
                        td.text(gt('<not found>'));
                        $.each(dataJson[i].geonames, function (idx, geoname) {
                            td.append($('<a>', {
                                class: 'not-found',
                                target: '_blank',
                                title: 'Koordinate (c) Geonames',
                                href: 'https://www.openstreetmap.org/?zoom=13&mlat='+
                                    geoname.lat+
                                    '&mlon='+
                                    geoname.lon
                            }).text(gt('<%d: %s>', idx+1, geoname.name)));
                            
                        });
                    }

                }
            } else {
                var name=found.properties.tags['name:de'] || found.properties.tags.name || gt('<missing name>');
                tr.append($('<td>', {
                    'class': 'vali-'+found.properties.valiCount.color
                }).append(
                    $('<a>', {
                        'href': 'https://www.openstreetmap.org/'+found.id,
                        'target': 'osm-'+found.id,
                    }).text(name)
                ));
            }
            tr.append($('<td>').text(dataJson[i].Amtsbezirk));
            tr.append($('<td>').text(dataJson[i].Anschrift));
            tr.append($('<td>').text(dataJson[i].Telefon));
            tr.append($('<td>').text(dataJson[i]['E-Mail']));
            tr.append($('<td>').text(dataJson[i].www));
            tr.append($('<td>').text(dataJson[i].Fax));
            tr.append($('<td>').text(dataJson[i].Bezeichnung));
            tr.append($('<td>').text(dataJson[i].Leiter));
            tr.append($('<td>').text(dataJson[i].PAnschrift));
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