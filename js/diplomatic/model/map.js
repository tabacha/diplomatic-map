define('diplomatic/model/map', [
    'jquery',
    'diplomatic/model/version',
    'leaflet',
    'diplomatic/view/aboutDialog',
    'gettext!diplomatic',
    'diplomatic/view/downloadButton',
    'diplomatic/view/popup',
    'diplomatic/view/searchBox',
    'diplomatic/view/searchResultBox',
    // not in function:
    'leafletmarker',
    'leaflethash'
], function ($, version, L, aboutDialog, gt, DownloadButton, ufPopup, SearchBox, SearchResultBox) {

    'use strict';

    function createMap (downloadClick, searchResultBoxModel, searchBoxModel) {
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

        var btn = new DownloadButton.Btn({
            position: 'topleft',
            clickFunc: downloadClick,
        });
        map.addControl(btn);

        var searchBox = new SearchBox({
            position: 'topright',
            model: searchBoxModel,
        });
        map.addControl(searchBox);

        var searchResultBox = new SearchResultBox({
            position: 'topright',
            model: searchResultBoxModel,
        });
        map.addControl(searchResultBox);

        $('#aboutMap').click(aboutDialog.show);
        return map;
    }

    var popupOpts = {
        autoPanPadding: new L.Point(5, 50),
        autoPan: true,
        maxWidth: 350,
    };
    
    function newMarker() {
        var clusterOptions = {showCoverageOnHover: false, 
                              maxClusterRadius: 50, 
                             };
        var rtn=new L.MarkerClusterGroup(clusterOptions);
        return rtn;
    }
    var openMarker = 0;
    function getOpenMarker() {
        var tmpOpenMarker = openMarker;
        openMarker = 0;
        return tmpOpenMarker;
    }
    function createGeoJSONLayer(filterFunc, id, type) {
        var popupTxt='<div>'+gt('Loading...')+'</div>';
        var g=L.geoJson (null, {
            onEachFeature: function (feature, layer) {
                // DO Not use jquery Object here
                layer.bindPopup(popupTxt, popupOpts);
                layer.on('click', function (e) {
                    ufPopup.click(e, map.closePopup);
                });
                if ((feature.properties.id == id) && (feature.properties.type == type)) {
                    // hier den Marker merken und dann spaeter oeffnen
                    openMarker = layer;
                    layer.openPopup(); 
                }
            },
            pointToLayer: function(feature /*, latlng*/) {
                return new L.Marker(new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]), {
                    icon: L.divIcon({
                        className: 'mmap-marker '+feature.properties.valiCount.color,
                        // iconSize:L.point(20, 30),
                        iconAnchor: [14, 30],
                        iconSize: [26, 26],
                        html: '<div class="icon fa fa-flag" /><div class="arrow" />'
                    })
                });
            },
            filter: filterFunc,
        });
        return g;
    }
    return {
        'createMap': createMap,
        'popupOpts': popupOpts,
        'LGeoJson': L.geoJson,
        'getOpenMarker': getOpenMarker,
        'createGeoJSONLayer': createGeoJSONLayer,
        'newMarker': newMarker,
    };
});
