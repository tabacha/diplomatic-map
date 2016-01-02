requirejs.config({
    baseUrl: 'js',
    paths: {
        'jquery': '../lib/jquery/jquery',
        'js.cookie': '../lib/js-cookie/js.cookie',
        'bootstrap': '../lib/bootstrap/bootstrap',
        'bootstraptypehead': '../lib/bootstrap3-typeahead/bootstrap3-typeahead',
        'leaflet': '../lib/leaflet/leaflet',
        'leafletmarker': '../lib/leaflet.markercluster/dist/leaflet.markercluster',
        'leaflethash': '../lib/leaflet-hash/leaflet-hash',
    },
    shim: {
        jquerycookie: {
            deps: ['jquery'],
            exports: '$.cookie',
        },
        leafletmarker: {
            deps: ['leaflet'],
        },
        leaflethash: {
            deps: ['leaflet'],
        },
        bootstrap: {
            deps: ['jquery'],
        },
        bootsrtaptypehead: {
            deps: ['bootstrap'],
        }
    }
});