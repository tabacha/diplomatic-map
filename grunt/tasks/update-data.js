'use strict';

module.exports = function(grunt) {



    grunt.registerTask('update-data', 'update-data from overpass api', function() {
        var self = this,
            done = this.async(),
            requirejs = require('requirejs');
        console.log('r', requirejs, __dirname);
        var cwd = process.cwd();
        process.chdir(__dirname+'/../..');
        var a=requirejs(['js/common'], function () {
            console.log('js/common loaded');
            requirejs(['diplomatic/app/update-overpass']);
            done();
        }, function (a) {
            console.log('error',a);
            done();
        });
        console.log('x',a);
        process.chdir(cwd);

    });

};