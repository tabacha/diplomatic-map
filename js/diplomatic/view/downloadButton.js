define('diplomatic/view/downloadButton', [
    'jquery',
    'leaflet',
    'gettext!diplomatic',                       
], function ($, L, gt) {

    var DownloadButton =  L.Control.extend({
        onAdd: function (/*map*/) {
            this._div = L.DomUtil.create('div', 'leaflet-bar download-btn');
            this._div.innerHTML = '<a href="#" title="'+
                gt('Download CSV')+
                '"><i class="fa fa-download"></i></a>';
            var stop = L.DomEvent.stopPropagation;
            
            var fn = function (e) {
                console.log(e);
            };
            L.DomEvent
                .on(this._div, 'click', stop)
                .on(this._div, 'mousedown', stop)
                .on(this._div, 'dblclick', stop)
                .on(this._div, 'click', L.DomEvent.preventDefault)
                .on(this._div, 'click', fn, this);
            //  .on(this._div, 'click', this._refocusOnMap, this);

            return this._div;
        }
    });

    return {
        Btn: DownloadButton,
    };

});