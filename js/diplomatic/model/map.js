define('diplomatic/model/map', ['jquery',
    'diplomatic/model/version',
    'leaflet',
    'leafletmarker',
    'leaflethash'], function ($, version, L) {

        'use strict';

        function createMap () {
            var maxZoom = 18,
                baseUrl = '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                baseAttribution= 'Karte &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>. ( <a href="http://opendatacommons.org/licenses/odbl/">ODbL</a>)'+'\n'+ version.revision+' '+version.date,
                subdomains = 'abc',
                center = new L.LatLng(53.5541, 10.0193);
            var basemap = new L.TileLayer(baseUrl, {maxZoom: maxZoom, attribution: baseAttribution, subdomains: subdomains});
            var map = new L.Map('map', {center: center, zoom: 10, maxZoom: maxZoom, layers: [basemap]});
            new L.Hash(map);
            return map;
        }

        var popupOpts = {
            autoPanPadding: new L.Point(5, 50),
            autoPan: true,
            maxWidth: 310,
        };
                      
        function newMarker() {
            var clusterOptions = {showCoverageOnHover: false, maxClusterRadius: 50};
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