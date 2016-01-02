define('diplomatic/app/map', ['diplomatic/model/map',
                  'diplomatic/model/legende',
                  'diplomatic/view/popup',
    'jquery',
    'diplomatic/model/version',
    'bootstrap',
    'diplomatic/model/searchbox',
    'bootstraptypehead',
   ], function (model, legende, ufPopup, $, version, bootstrap, searchbox) {

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
           readyTime,
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
               console.log(Date.now() - readyTime, 'start clear');
               map.removeLayer(markers);
               points.clearLayers();
               console.log(Date.now() - readyTime, 'newMarker');
               markers = model.newMarker();
               console.log(Date.now() - readyTime, 'addData');
               points.addData(dataJson.geojson);
               console.log(Date.now() - readyTime, 'addLayer');
               markers.addLayer(points);
               console.log(Date.now() - readyTime, 'map add markers');
               map.addLayer(markers);
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
           readyTime= Date.now()
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
                   console.log(Date.now() - readyTime, 'parse');
                   dataJson = JSON.parse(txt);
                   console.log(Date.now() - readyTime, 'add markers');
                   addMarkers();
                   console.log(Date.now() - readyTime, 'searchbox create');
                   searchbox.create(dataJson.typeAhead, dataJson.additionLegendKeys);
                   console.log(Date.now() - readyTime, 'searchbox done');
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