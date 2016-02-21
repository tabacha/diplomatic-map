define('diplomatic/app/map', [
    'diplomatic/model/map',
    'diplomatic/model/legende',
    'diplomatic/view/popup', // fixme: remove this
    'jquery',
    'diplomatic/model/version',
    'bootstrap',
    'diplomatic/model/searchbox',
    'bootstrap-dialog',
    'gettext!diplomatic',
    'diplomatic/view/downloadCsvDialog',
    'diplomatic/model/wikidata',
    'diplomatic/view/headline',
    'diplomatic/model/searchResultBox',
    'diplomatic/model/searchBox',
    // not in parameter list:
    'bootstraptypehead',
], function (model, legende, ufPopup, $, version, bootstrap, searchbox, BootstrapDialog, gt, downloadCsvDialog, wikidata, headline, SearchResultBoxModel, SearchBoxModel) {

    'use strict';
    
    var searchBoxModel = new SearchBoxModel();

    var searchResultBoxModel = new SearchResultBoxModel();

    $('body').prepend(headline('index.html'));
    
    if(typeof(String.prototype.strip) === 'undefined') {
        String.prototype.strip = function() {
            return String(this).replace(/^\s+|\s+$/g, '');
        };
    }

    var total = 0, 
        map,
        dataJson,
        hits = 0,
        points,
        filterKey = '*',
        filterOp = '',
        lowerFilterString = '';

    function filterFunc(feature) {
        
        var found = false;
        
        total += 1;
        found = searchbox.filterFunc(feature, filterKey, filterOp, lowerFilterString);
        if (found) {
            hits += 1;
        }
        return found;
    }

    function downloadClick() {
        downloadCsvDialog.open(points, hits, total, map, dataJson);
    }



    var query = window.location.search.substring(1), 
        queryPairs = query.split('&'), 
        queryJSON = {},
        markers = model.newMarker(),
        readyTime= Date.now(),
        dialog = new BootstrapDialog({
            title: gt('Loading Open Diplomatic Map, please wait...'),
            animate: false,
            closeable: false,
        }),
        type,
        id;
                     
    $.each(queryPairs, function() { queryJSON[this.split('=')[0]] = this.split('=')[1]; });

    if (typeof queryJSON.id !== 'undefined') {
        id = queryJSON.id;
    }

    if (typeof queryJSON.type !== 'undefined') {
        type = queryJSON.type;
    }


    points = model.createGeoJSONLayer(filterFunc, id, type);

    console.log('id', id);

    function addMarkers( callback )  {

        searchResultBoxModel.setLoading();

        hits = 0;
        total = 0;
        $('#search-id option:selected').each(function(){
            var key=this.value;
            var filterString = document.getElementById('filter-string').value;
            if (key === '*') {
                lowerFilterString = filterString.toLowerCase().strip();
                filterKey='*';
                filterOp='eq';
                if (filterString) {
                    $('#clear').fadeIn();
                } else {
                    $('#clear').fadeOut();
                }
            }  else {
                filterKey=key;
                if (legende[key].sameAs !== undefined) {
                    filterKey=[filterKey, legende[key].sameAs];
                }
                filterOp=$('#search-op option:selected').prop('id');
                $('#clear').fadeIn();
                if (legende[key].keys === undefined) {
                    lowerFilterString = filterString.toLowerCase().strip();
                } else {
                    $('#search-value option:selected').each(function(){
                        var val=this.id;
                        lowerFilterString = val.toLowerCase().strip();
                    });
                }
            }
            dialog.progress(13, gt('clear maps'));
            setTimeout( function () {
                console.log(Date.now() - readyTime, 'start clear');
                map.removeLayer(markers);
                points.clearLayers();
                console.log(Date.now() - readyTime, 'newMarker');
                markers = model.newMarker();
                
                dialog.progress(14, gt('add data'));
                setTimeout( function () {
                    console.log(Date.now() - readyTime, 'addData');
                    points.addData(dataJson.geojson);
                    
                    dialog.progress(54, gt('add layer'));
                    setTimeout( function () {
                        console.log(Date.now() - readyTime, 'addLayer');
                        markers.addLayer(points);
                        
                        dialog.progress(57, gt('add map markers'));
                        setTimeout( function () {
                            console.log(Date.now() - readyTime, 'map add markers');
                            map.addLayer(markers);
                            
                            dialog.progress(97, gt('open markers'));
                            setTimeout( function () {
                                console.log(Date.now() - readyTime, 'openMarker');
                                var openMarker = model.getOpenMarker();
                                if (openMarker !== 0) {
                                    markers.zoomToShowLayer(openMarker, function () {
                                        openMarker.fire('click');
                                        openMarker=0;
                                    });
                                }
                                if (total > 0) {
                                    searchResultBoxModel.setTotal(total);
                                    searchResultBoxModel.setHits(hits);

                                    $('#search-results').text(gt('Show %1$d of %2$d.', hits, total));
                                }
                                console.log(Date.now() - readyTime, 'add markers end');
                                if (callback !== undefined) {
                                    callback();
                                }
                            }, 0);
                        }, 0);
                    }, 0);
                }, 0);
            }, 0);
        });
    }

    function searchClick () {
        dialog.open();
        dialog.progress(0, gt('start'));
        addMarkers(function() {
            dialog.close();
        });
    }
    map=model.createMap(downloadClick, searchClick, searchResultBoxModel, searchBoxModel);
    map.addLayer(markers);
    
    $(document).ready( function() {

        dialog.progress = function ( percent, msg) {
            var msgdiv=$('<div>'),
                prg=$('<div class="progress">'),
                prgbar=$('<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100">', {
                    'aria-valuenow': percent
                }).css({
                    'width': percent+'%'
                }).text(percent+'%');
            prg.append(prgbar);
            msgdiv.append($('<div>').text(percent+'% '+msg));
            msgdiv.append(prg);
            dialog.setMessage(msgdiv);
        };
        dialog.open();
        dialog.progress(0, gt('Loading data...'));
        wikidata.load($, function() {
            console.debug('wikidata loaded');
        }, function () {
            alert(gt('error laoding wikidata'));
        });
        $.ajax({
            xhr: function()
            {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener('progress', function(evt){
                    if (evt.lengthComputable) {
                        //Do something with download progress
                        dialog.progress(Math.floor(5*evt.loaded/evt.total), gt('Loading data (%1$d of %2$d bytes)', evt.loaded, evt.total));
                        console.log(Date.now() - readyTime, 'progress ', evt.loaded, ' of ', evt.total);
                    }
                }, false);
                return xhr;
            },
            type: 'GET',
            dataType: 'text',
            url: 'data/diplomatic.json',
            contentType: 'text/text; charset=utf-8',
            error: function() {
                alert(gt('Error retrieving data'));
            },
            success: function (txt) {
                dialog.progress(5, gt('Parse JSON'));
                setTimeout( function () {
                    console.log(Date.now() - readyTime, 'parse');
                    dataJson = JSON.parse(txt);
                    var osmdate=dataJson.osm3s.timestamp_osm_base;
                    osmdate=osmdate.replace('T', ' ').replace('Z', gt('GMT'));
                    $('#diplodate').text(osmdate);
                    debugger;
                    var tHName={}, d2=0;
                    var d1=Date.now();
/*                    dataJson.geojson.features.forEach( function (f) {
                        if (f.properties.tags.name !== undefined) {
                            f.properties.tags.name.split(/\s/).forEach (function (n) {
                                
                                if (n!=='') {
                                    tHName[n]=1;
                                    d2=Date.now();
                                }
                            });
                        }
                    });*/
                    dataJson.geojson.features.forEach( function (f) {
                        Object.keys(f.properties.tags).forEach( function (k) {
                            var v=f.properties.tags[k];
//                            console.log(v);
                            if (!(v.match(/^[\d\(\)\s\-+]*$/))) {
                                tHName[v]=1;
                                v.split(/[\s;]/).forEach (function (n) {
                                    
                                    if ((n!=='') &&
                                        (!(n.match(/^[\d\(\)\-+]*$/)))) {
                                        tHName[n]=1;
                                    }
                                });
                            };
                        });
                    });
                                                 
/*                        if (f.properties.tags.name !== undefined) {
                        }
                    });*/

                    var x=Object.keys(tHName).sort();
                    var d3=Date.now();
                    console.log( - readyTime, 'x2');
                    debugger;
                    console.log(d3-d1);
                    console.log('x.length', x.length);
                    dialog.progress(12, gt('Add markers'));
                    setTimeout( function () {
                        console.log(Date.now() - readyTime, 'add markers');
                        addMarkers(function () {
                            dialog.progress(98, gt('searchbox create'));
                            setTimeout( function () {
                                
                                console.log(Date.now() - readyTime, 'searchbox create');
                                searchbox.create(dataJson.typeAhead, dataJson.additionLegendKeys);
                                console.log(Date.now() - readyTime, 'searchbox done');
                                dialog.close();
                            }, 0);
                        });
                    }, 0);
                }, 0);
            }
        });
        $('#clear').click(function(evt){
            evt.preventDefault();
            dialog.open();
            dialog.progress(0, gt('start'));
            $('#search-id option[id=\'*\']').prop('selected', true);
            $('#filter-string').val('').focus();
            $('#search-op').fadeOut();
            $('#search-value').fadeOut();
            $('#filter-string').fadeIn();
            addMarkers(function () {
                dialog.close(); 
            });
        });
        
    });


});