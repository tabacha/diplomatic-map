define('gettext', ['jed'], function () {

    'use strict';

    var gettext={},
        supportedLanguages={
            'de': 'de_DE',
            'de-DE': 'de_DE',
            'de-CH': 'de_DE',
            'en-US': 'en_US',
            'en': 'en_US',
            'en-GB': 'en_US',
        };

    gettext.load = function (name, req, onload, config) {
        var lang='de_DE';

        if (config.isBuild) {
            onload(); 
        } else {
            if (navigator.languages === undefined) {

                var userLang = navigator.language || navigator.userLanguage; 

                lang=supportedLanguages[userLang];
            } else {
                for (var i=0; i<navigator.languages.length; i++) {
                    if (lang=== undefined) {
                        lang = supportedLanguages[navivgator.languages[i]];
                    }
                }
            }
            if (lang === undefined) {
                lang = 'en_US';
            }
            if (lang === 'en_US') {
                onload(function (id) {
                    return id;
                });
            } else {
                require(['i18n/'+name+'.'+lang], 
                    function (msg) {
                        console.log(msg);
                        var i18n = new Jed({
                            // This callback is called when a key is missing
                            'missing_key_callback': function(key) {
                                // Do something with the missing key
                                // e.g. send key to web service or
                                console.error('missing_i18n_key', key);
                            },
                            'locale_data': msg
                        });
                        
                        function gt(id) {
                            var out=i18n.translate(id).fetch();
                            return out;
                        }
                        onload(gt);
                    });        
            }
        }
    };

    return gettext;
});
