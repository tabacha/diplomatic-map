define('diplomatic/app/map', [
    'diplomatic/model/map',
    'diplomatic/model/legende',
    'diplomatic/view/popup',
    'jquery',
    'diplomatic/model/version',
    'bootstrap',
    'diplomatic/model/searchbox',
    'bootstrap-dialog',
    'bootstraptypehead',
], function (model, legende, ufPopup, $, version, bootstrap, searchbox, BootstrapDialog) {

       'use strict';


       if(typeof(String.prototype.strip) === 'undefined') {
           String.prototype.strip = function() {
               return String(this).replace(/^\s+|\s+$/g, '');
           };
       }

/*eslint no-unused-vars: [0]*/
       var map=model.createMap(),
           query = window.location.search.substring(1), 
           queryPairs = query.split('&'), 
           queryJSON = {},
           hits = 0,
           total = 0,
           lowerFilterString,
           filterKey,
           filterOp,
           lowerFilterVal,
           markers = model.newMarker(),
           dataJson,
           readyTime= Date.now(),
           dialog= new BootstrapDialog({
               title: 'Loading Open Diplomatic Map, please wait...',
               animate: false,
               closeable: false,
           }),
           id;


                     
       $.each(queryPairs, function() { queryJSON[this.split('=')[0]] = this.split('=')[1]; });

       var openMarker = 0;
       var points = model.LGeoJson (null, {
           onEachFeature: function (feature, layer) {
               var popup='<div>Loading...</div>';
               layer.bindPopup(popup, model.popupOpts);
               layer.on('click', function (e) {
                   ufPopup.click(e, map.closePopup);
               });
               if ( feature.properties.id == id) {
     // hier den Marker merken und dann spaeter oeffnen
                   openMarker = layer;
                   layer.openPopup(); 
               }
           },
           pointToLayer: function(feature /*, latlng*/) {
               return new L.Marker(new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]), {
                   icon: L.divIcon({
                       className: 'mmap-marker green ',
//                       iconSize:L.point(20, 30),
                       iconAnchor: [14, 30],
                       iconSize: [26, 26],
                       html: '<div class="icon fa fa-flag" /><div class="arrow" />'
                   })
               });
           },
           filter: function(feature) {
               var found = false;
               total += 1;
               if (filterKey === '*') {
                   if (!lowerFilterString) {
                       hits += 1;
                       return true;
                   }
                   $.each(feature.properties.tags, function(k, v) {
                       var value = v.toLowerCase();
                       if (value.indexOf(lowerFilterString) !== -1) {
                           hits += 1;
                           found=true;
                           return true;
                       }
                   });
                   return found;
               } else {
                   var fKeys;
                   if (Array.isArray(filterKey)) {
                       fKeys=filterKey;
                   } else {
                       fKeys=[filterKey];
                   }
                   for (var i = 0; i <fKeys.length; i++) {
                       var key=fKeys[i];
                       var value=feature.properties.tags[key];
                       if (value === undefined) {
                           value='';
                       } else {
                           value= value.toLowerCase().strip();
                       }
                       if (value === lowerFilterVal) {
                           found=true;
                           break;
                       }
                   }
                   if (filterOp === 'ne') {
                       found=!found;
                   }
                   if (found) {
                       hits += 1;
                       return true;
                   }
               }
               return false;
           }
       });

       if (typeof queryJSON.id !== 'undefined') {
           id = queryJSON.id;
           console.log('id', queryJSON.id);
       }



       function addMarkers()  {
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
               }  else if (legende[key].keys === undefined) {
                   filterKey=key.toLowerCase();
                   filterOp=$('#search-op option:selected').prop('id');
                   lowerFilterVal= filterString.toLowerCase().strip();
                   if (filterString) {
                       $('#clear').fadeIn();
                   } else {
                       $('#clear').fadeOut();
                   }
               } else {
                   filterKey=key.toLowerCase();
                   filterOp=$('#search-op option:selected').prop('id');
                   $('#search-value option:selected').each(function(){
                       var val=this.id;
                       lowerFilterVal= val.toLowerCase().strip();
                       $('#clear').fadeIn();
                   });
               }
               dialog.progress(13,'clear maps');
               console.log(Date.now() - readyTime, 'start clear');
               map.removeLayer(markers);
               points.clearLayers();
               console.log(Date.now() - readyTime, 'newMarker');
               markers = model.newMarker();

               dialog.progress(14,'add data');
               console.log(Date.now() - readyTime, 'addData');
               points.addData(dataJson.geojson);

               dialog.progress(54,'add layer');
               console.log(Date.now() - readyTime, 'addLayer');
               markers.addLayer(points);

               dialog.progress(57,'add map markers');
               console.log(Date.now() - readyTime, 'map add markers');
               map.addLayer(markers);

               dialog.progress(97,'open markers');
               console.log(Date.now() - readyTime, 'openMarker');
               if (openMarker !== 0) {
                   markers.zoomToShowLayer(openMarker, function () {
                       openMarker.fire('click');
                       openMarker=0;
                   });
               }
               if (total > 0) {
                   $('#search-results').text('Show ' + hits + ' of ' + total + '.');
               }
           });
           console.log(Date.now() - readyTime, 'add markers end');
           return false;
       }

       $('.form-search').submit(addMarkers);

       map.addLayer(markers);

       $(document).ready( function() {

    
           dialog.progress = function ( percent, msg) {
               var prg=$('<div class="progress">')
               var prgbar=$('<div class="progress-bar" role="progressbar" aria-valuenow="'+percent+'" aria-valuemin="0" aria-valuemax="100" style="width:'+percent+'%">').text(percent+'% '+msg);
               prg.append(prgbar);
               dialog.setMessage(prg);
           };
           dialog.open();
           dialog.progress(0,'Loading data');

           $.ajax({
               xhr: function()
               {
                   var xhr = new window.XMLHttpRequest();
                   xhr.addEventListener('progress', function(evt){
                       if (evt.lengthComputable) {
                           //Do something with download progress
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
                   alert('Error retrieving data');
               },
               success: function (txt) {
                   dialog.progress(5,'Parse JSON');
                   console.log(Date.now() - readyTime, 'parse');
                   dataJson = JSON.parse(txt);
                   dialog.progress(12,'Add markers');
                   console.log(Date.now() - readyTime, 'add markers');
                   addMarkers();
                   dialog.progress(98,'searchbox create');
                   console.log(Date.now() - readyTime, 'searchbox create');
                   searchbox.create(dataJson.typeAhead, dataJson.additionLegendKeys);
                   console.log(Date.now() - readyTime, 'searchbox done');
                   dialog.close();
               }
           });
           $('#clear').click(function(evt){
               evt.preventDefault();
               $('#search-id option[id=\'*\']').prop('selected', true);
               $('#filter-string').val('').focus();
               $('#search-op').fadeOut();
               $('#search-value').fadeOut();
               $('#filter-string').fadeIn();
               addMarkers();
           });

       });


   });