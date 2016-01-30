define('diplomatic/model/wikidata', [
], function () {

    'use strict';

    var wikidata= false;

    function load($, successFunc, errFunc) {
        $.ajax({
           /* xhr: function()
            {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener('progress', function(evt){
                    if (evt.lengthComputable) {
                        //Do something with download progress
                    
                        console.log(Date.now() - readyTime, 'progress ', evt.loaded, ' of ', evt.total);
                    }
                }, false);
                return xhr;
            },*/
            type: 'GET',
            dataType: 'text',
            url: 'data/wikidata.json',
            contentType: 'text/text; charset=utf-8',
            error: errFunc,
            success: function (txt) {
                wikidata=JSON.parse(txt);
                successFunc();
            }
        });
    }
    function testLoad(data) {
        wikidata=data;
    }
    function lookup(country) {
        if (wikidata === false) {
            console.error('wikidata is not loaded yet');
            return null;
        }
        if (wikidata[country] === undefined) {
            return null;
        } // else
        return wikidata[country];
    }
    function isLoaded() {
        return (wikidata !== false);
    }


    return {
        'load': load,
        'lookup': lookup,
        'testLoad': testLoad,
        'isLoaded': isLoaded,
    };
});