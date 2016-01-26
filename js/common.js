var allTestFiles = null;
var callback = null;
var baseUrl= 'js';
var require_paths={
        'jquery': '../lib/jquery/jquery',
        'jed': '../node_modules/jed/jed',
        'css': '../lib/require-css/css',
        'css-builder': '../lib/require-css/css-builder',
        'normalize': '../lib/require-css/normalize',
        'js.cookie': '../lib/js-cookie/js.cookie',
        'bootstrap': '../lib/bootstrap/bootstrap',
        'bootstraptypehead': '../lib/bootstrap3-typeahead/bootstrap3-typeahead',
        'bootstrap-dialog': '../lib/bootstrap3-dialog/bootstrap-dialog.min',
        'leaflet': '../lib/leaflet/leaflet',
        'leafletmarker': '../lib/leaflet.markercluster/dist/leaflet.markercluster',
        'leaflethash': '../lib/leaflet-hash/leaflet-hash',
};
if ((window !== undefined) && (window.__karma__ !== undefined)) {
    var TEST_REGEXP = /\/base\/test\/.*\.js$/i;
    allTestFiles =[];
    baseUrl= '/base/js';
    callback= window.__karma__.start;
    require_paths.test='../test';
//    console.log(window.__karma__.files);
    // Get a list of all the test files to include
    Object.keys(window.__karma__.files).forEach(function(file) {
        if (TEST_REGEXP.test(file)) {
            // Normalize paths to RequireJS module names.
            // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
            // then do not normalize the paths
            var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
            allTestFiles.push(normalizedTestModule);
        }
    });
    
//    console.log(allTestFiles);
}
requirejs.config({
    'baseUrl': baseUrl,
    'paths': require_paths,
    'deps': allTestFiles,
    'callback': callback,
    'shim': {
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
        bootstraptypehead: {
            deps: ['bootstrap'],
        },
        'bootstrap-dialog': {
            deps: ['jquery', 'bootstrap'],
        }

    }
});