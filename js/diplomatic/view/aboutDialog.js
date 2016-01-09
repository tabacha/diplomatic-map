define('diplomatic/view/aboutDialog', [ 
    'bootstrap-dialog',
    'diplomatic/model/version'
], function (BootstrapDialog, version) {

    'use strict';

    function show() {
        var githuburl='https://github.com/tabacha/diplomatic-map';
        var msg = $('<div>');
        msg.append('Author: ').append($('<a href="https://anders.hamburg/" target="_blank">').text('Sven Anders')); 
  
        msg.append($('<br>'));
        msg.append('Source Code: ');
        msg.append($('<a href="'+githuburl+'" target="_blank">').text(githuburl));
        msg.append($('<br>'));
        msg.append('Git Version: '+version.revision);
        msg.append($('<br>'));
        msg.append('Software of: '+version.date);
        msg.append($('<br>'));
        msg.append('Map data: Copyright <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap and contributiors</a> under <a href="http://www.opendatacommons.org/licenses/odbl" target="_blank">Open Database Licence</a>');
        msg.append($('<br>'));
        msg.append('With help of: OpenStreetMap, Overpass, Overpass-Turbo, NodeJs, Grunt, jQuery, Leaflet, Leaflet Marker Cluser, BootstrapDialog, RequireJS, ESlint, OSMToGeoJSON.');
        msg.append($('<br>'));
        msg.append('Thank you!');
        var dialog = new BootstrapDialog({
            type: BootstrapDialog.TYPE_INFO,
            title: 'About Open Diplomatic Map',
            message: msg,
            animate: true,
            closeable: true,
            buttons: [{
                label: 'Close',
                cssClass: 'btn-primary',
                action: function(dialogItself){
                    dialogItself.close();
                }
            }]
        });
        dialog.open();
    }
    
    return {
        'show': show,
    };
});