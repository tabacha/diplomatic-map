var requirejs = require('requirejs'),
    navigator = {};
requirejs(['./common'], function () {
    requirejs(['diplomatic/app/update-overpass']);
});
