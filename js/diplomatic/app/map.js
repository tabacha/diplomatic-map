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

       var dataUrl = 'data/diplomatic.csv',
           fieldSeparator = '\t',
           map=model.createMap(),
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
           dataCsv,
           dataJson,
           id, 
           allTypeAhead = [],
           knownTypeAhead = {};

                     
       $.each(queryPairs, function() { queryJSON[this.split('=')[0]] = this.split('=')[1]; });

       function openComment(id) {
           map.closePopup();
       }

       var openMarker = 0;
       var points = model.LGeoJson (null, {
           firstLineTitles: true,
           longitudeTitle: '@lon',
           latitudeTitle: '@lat',
           fieldSeparator: fieldSeparator,
           onEachFeature: function (feature, layer) {
               var popup='<div>Loading...</div>';
               layer.bindPopup(popup, model.popupOpts);
               layer.on('click', function (e) {
                   ufPopup.click(e, openComment);
               });
               if ( feature.properties.id == id) {
     // hier den Marker merken und dann spaeter oeffnen
                   openMarker = layer;
                   layer.openPopup(); 
               }
           },
           pointToLayer: function(feature /*, latlng*/) {
               var c='green';
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
                           return true;
                       }
                   });
               } else {
                   var fKeys;
                   if (Array.isArray(filterKey)) {
                       fKeys=filterKey;
                   } else {
                       fKeys=[filterKey];
                   }
                   var found=false;
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
           id=queryJSON.id;
           console.log('id', queryJSON.id);
       }



       var addCsvMarkers = function() {
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
               map.removeLayer(markers);
               points.clearLayers();
               markers = model.newMarker();
               
               points.addData(dataJson);
               markers.addLayer(points);
        
               map.addLayer(markers);
        
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
           return false;
       };

       $('.form-search').submit(addCsvMarkers);


       var typeAheadSource = [];

       function arrayToSet(a) {
           var temp = {};
           for (var i = 0; i < a.length; i++)
               temp[a[i]] = true;
           var r = [];
           for (var k in temp)
               r.push(k);
           return r;
       }

       function populateTypeAhead(csv, delimiter) {
           var lines = csv.split('\n');
           for (var i = lines.length - 1; i >= 1; i--) {
               var items = lines[i].split(delimiter);
               for (var j = items.length - 1; j >= 0; j--) {
                   var item = items[j].strip();
                   item = item.replace(/"/g, '');
                   if (item.indexOf('http') !== 0 && isNaN(parseFloat(item))) {
                       typeAheadSource.push(item);
                       var words = item.split(/\W+/);
                       for (var k = words.length - 1; k >= 0; k--) {
                           typeAheadSource.push(words[k]);
                       }
                   }
               }
           }
       }


       map.addLayer(markers);


       $(document).ready( function() {
           $.ajax ({
               type: 'GET',
               dataType: 'text',
               url: 'data/diplomatic.geojson',
               contentType: 'text/text; charset=utf-8',
               error: function() {
                   alert('Error retrieving data');
               },
               success: function (txt) {
                   dataJson = JSON.parse(txt);

                   for (var i = 0; i <dataJson.features.length; i++) {
                       var tags=dataJson.features[i].properties.tags;
                       for (var property in tags) {
                           var val=tags[property];
                           if (legende.hasOwnProperty(property)) {
                               if (knownTypeAhead[property] === undefined) {
                                   knownTypeAhead[property] = [];
                               };
                               if (knownTypeAhead[property].indexOf(val)=== -1) {
                                   knownTypeAhead[property].push(val);
                               };
                           } 
                           if (tags.hasOwnProperty(property)) {
                               if (allTypeAhead.indexOf(val) === -1) {
                                   allTypeAhead.push(val);
                               } 
                           };
                       };
                   };
                   searchbox.create(knownTypeAhead, allTypeAhead);
                   debugger;
                   addCsvMarkers();
               }
           });
           $('#clear').click(function(evt){
               evt.preventDefault();
               $('#search-id option[id=\'*\']').prop('selected', true);
               $('#filter-string').val('').focus();
               $('#search-op').fadeOut();
               $('#search-value').fadeOut();
               $('#filter-string').fadeIn();
               addCsvMarkers();
           });

       });


   });