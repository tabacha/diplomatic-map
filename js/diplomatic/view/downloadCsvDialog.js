define('diplomatic/view/downloadCsvDialog', [
    'jquery',
    'bootstrap',
    'bootstrap-dialog',
    'gettext!diplomatic', 
    'diplomatic/model/downloadCsv'
], function ($, bootstrap, BootstrapDialog, gt, downloadCsv) {

    'use strict';

    function downloadCSVAction(data) {
        var csvString = downloadCsv.convert(data),
            a = document.createElement('a');
        console.log(csvString);
        a.href='data:attachment/csv;charset=utf-8,' + encodeURI(csvString);
        a.target='_blank';
        a.download='myFile.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function openDialog(points, hits, total, map, dataJson) {
        
        var buttons=[{
            id: 'overpass-btn',
            label: gt('Overpass-Turbo'),
            title: gt('Show example overpass query in diffrent browser window.'),
            action: function () {
                window.open('http://overpass-turbo.eu/s/dWT', '_blank');
            }
        }, {
            id: 'all-btn',
            label: gt('All items'),
            title: gt('All %1$d itmes as csv', total),
            action: function () {
                downloadCSVAction(dataJson.geojson.features);
                this.dialog.close();
            }
        }];
        
        if ((hits>0) && (hits<total)) {
            buttons.push({
                id: 'sel-btn',
                label: gt('Current selection (%1$d)', hits),
                title: gt('Get current selection (%1$d items) as csv.', hits),
                action: function () {
                    var data=[],
                        curPoints=points.getLayers();
                    for (var i=0; i<hits; i++) {
                        data.push(curPoints[i].feature);
                    }
                    downloadCSVAction(data);
                    this.dialog.close();
                }

            });
        }
        if (hits>0) {
            var curPoints=points.getLayers();
            var curBounds=map.getBounds();
            var data=[];
            for (var ii=0; ii<hits; ii++) {
                if (curBounds.contains(curPoints[ii].getLatLng())) {
                    data.push(curPoints[ii].feature);
                }
            }
            var sum=data.length;
            if ((sum>0) && (sum<hits)) {
                buttons.push({
                    id: 'map-btn',
                    label: gt('Current map view (%1$d)', sum),
                    title: gt('Get current map view (%1$d items) as csv.', sum),
                    action: function () {
                        downloadCSVAction(data);
                        this.dialog.close();
                    }
                });
            }
        }
        var osmdate=dataJson.osm3s.timestamp_osm_base;
        osmdate=osmdate.replace('T', ' ').replace('Z', gt('GMT'));
        var dialog = new BootstrapDialog({
            'title': gt('Download CSV'),
            'message': gt('You can download the displayed data as CSV (Comma Seperate Value). You can load it for example in LibreOffice Calc or in Microsoft-Excel.')+
                '\n\n'+
                gt('Data from OpenStreetMap: %1$s.',osmdate)+
                '\n'+
                gt('If you like actual data, please go to overpass-turbo.eu.')+
                '\n'+
                gt('Please choose what data to download.'),
            'buttons': buttons,
        });
        dialog.open();
        for (var i=0; i<buttons.length; i++) {
            var id=buttons[i].id,
                title= buttons[i].title,
                btn=dialog.$modalDialog.find('#'+id);
            if (btn !== undefined) {
                btn.attr('title', title);
            }
        }
    }
    
    return {
        open: openDialog
    };

});
