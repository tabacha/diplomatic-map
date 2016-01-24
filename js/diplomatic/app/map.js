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
    // not in parameter list:
    'bootstraptypehead',
], function (model, legende, ufPopup, $, version, bootstrap, searchbox, BootstrapDialog, gt, downloadCsvDialog) {

    'use strict';

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

    map=model.createMap(downloadClick);

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
        console.log(Date.now() - readyTime, 'add markers start');
        hits = 0;
        total = 0;
        $('#search-id option:selected').each(function(){
            var key=this.id;
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

    $('.form-search').submit(function (e) {
        e.preventDefault();
        dialog.open();
        dialog.progress(0, gt('start'));
        addMarkers(function() {
            dialog.close();
        });
    });

    map.addLayer(markers);
    
    $(document).ready( function() {
        $('#search-id option[id=\'*\']').text(gt('all'));    
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