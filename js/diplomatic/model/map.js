define('diplomatic/model/map', ['jquery',
    'diplomatic/model/version',
    'leaflet',
     'diplomatic/view/aboutDialog',
    'leafletmarker',
    'leaflethash'], function ($, version, L, aboutDialog) {

        'use strict';

        function createMap () {
            var maxZoom = 18,
                baseUrl = '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                baseAttribution= 'Map &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>. ( <a href="http://opendatacommons.org/licenses/odbl/">ODbL</a>)'+' | <a href="#" id="aboutMap">about this map</a> | Diplomatic data of: <span id="diplodate">',
                subdomains = 'abc',
                center = new L.LatLng(0, 0);
            var basemap = new L.TileLayer(baseUrl, {maxZoom: maxZoom, attribution: baseAttribution, subdomains: subdomains});
            var map = new L.Map('map', {center: center, zoom: 2, maxZoom: maxZoom, layers: [basemap], attributionControl: true});
            new L.Hash(map);
            $('#aboutMap').click( aboutDialog.show);
            return map;
        }

        var popupOpts = {
            autoPanPadding: new L.Point(5, 50),
            autoPan: true,
            maxWidth: 310,
        };
                      
        function newMarker() {
            var clusterOptions = {showCoverageOnHover: false, 
                                  maxClusterRadius: 50, 
                                 };
            var rtn=new L.MarkerClusterGroup(clusterOptions);
            return rtn;
        }

        return {
            'createMap': createMap,
            'popupOpts': popupOpts,
            'LGeoJson': L.geoJson,
            'newMarker': newMarker,
        };
    });