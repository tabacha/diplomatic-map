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
            
            L.DomEvent
                .on(this._div, 'click', stop)
                .on(this._div, 'mousedown', stop)
                .on(this._div, 'dblclick', stop)
                .on(this._div, 'click', L.DomEvent.preventDefault)
                .on(this._div, 'click', this.options.clickFunc, this);
            //  .on(this._div, 'click', this._refocusOnMap, this);

            return this._div;
        }
    });

    return {
        Btn: DownloadButton,
    };

});