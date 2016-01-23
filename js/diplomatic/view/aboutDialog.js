define('diplomatic/view/aboutDialog', [ 
    'bootstrap-dialog',
    'diplomatic/model/version',
    'gettext!diplomatic',
], function (BootstrapDialog, version, gt) {

    'use strict';

    function show() {
        var githuburl='https://github.com/tabacha/diplomatic-map';
        var msg = $('<div>');
        msg.append(gt('Author: ')).append($('<a href="https://anders.hamburg/" target="_blank">').text('Sven Anders')); 
  
        msg.append($('<br>'));
        msg.append(gt('Source Code: '));
        msg.append($('<a href="'+githuburl+'" target="_blank">').text(githuburl));
        msg.append($('<br>'));
        msg.append(gt('Git Version: %1$s', version.revision));
        msg.append($('<br>'));
        msg.append(gt('Software of: %1$s', version.date));
        msg.append($('<br>'));
        msg.append(gt('Map data: Copyright <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap and contributiors</a> under <a href="http://www.opendatacommons.org/licenses/odbl" target="_blank">Open Database Licence</a>'));
        msg.append($('<br>'));
        msg.append(gt('With help of: %1$s.', 'OpenStreetMap, Overpass, Overpass-Turbo, NodeJs, Grunt, jQuery, Leaflet, Leaflet Marker Cluser, BootstrapDialog, RequireJS, ESlint, OSMToGeoJSON'));
        msg.append($('<br>'));
        msg.append(gt('Thank you!'));
        var dialog = new BootstrapDialog({
            type: BootstrapDialog.TYPE_INFO,
            title: gt('About Open Diplomatic Map'),
            message: msg,
            animate: true,
            closeable: true,
            buttons: [{
                label: gt('Close'),
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