define('diplomatic/model/map', [
    'jquery',
    'diplomatic/model/version',
    'leaflet',
    'diplomatic/view/aboutDialog',
    'gettext!diplomatic',                       
    'leafletmarker',
    'leaflethash'
], function ($, version, L, aboutDialog, gt) {

    'use strict';

    function createMap () {
        var maxZoom = 18,
            baseUrl = '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            baseAttribution = gt('Map &copy; %1$s. (%2$s)', '<a href="http://openstreetmap.org">OpenStreetMap</a>', '<a href="http://opendatacommons.org/licenses/odbl/">ODbL</a>')+
                ' | <a href="#" id="aboutMap">'+
                gt('about this map')+
                '</a> | '+
                gt('Diplomatic data of: %1$s', '<span id="diplodate">'),
            subdomains = 'abc',
            center = new L.LatLng(0, 0);
        var basemap = new L.TileLayer(baseUrl, {maxZoom: maxZoom, attribution: baseAttribution, subdomains: subdomains});
        var map = new L.Map('map', {center: center, 
                                    zoom: 2, 
                                    maxZoom: maxZoom, 
                                    zoomControl: false,
                                    layers: [basemap], 
                                    attributionControl: true});
        new L.Hash(map);
        map.zoomControl = new L.Control.Zoom({
            zoomInTitle: gt('Zoom in'),
            zoomOutTitle: gt('Zoom out'),
        });
        map.addControl(map.zoomControl);

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