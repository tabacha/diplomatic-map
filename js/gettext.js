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
        var lang;

        if (config.isBuild) {
            onload(); 
        } else {
            try {
                if (navigator === undefined) {
                    navigator= {
                        language: 'en',
                    };
                }
                if (navigator.languages === undefined) {
                    var userLang = navigator.language || navigator.userLanguage; 
                    lang=supportedLanguages[userLang];
                } else {
                    for (var i=0; i<navigator.languages.length; i++) {
                        if (lang === undefined) {
                            lang = supportedLanguages[navigator.languages[i]];
                        }
                    }
                }
            } catch (e) {
                //console.error(e);
                lang = 'en_US';
            }
            if (lang === undefined) {
                lang = 'en_US';
            }
            require(['i18n/'+name+'.'+lang], 
                function (msg) {
                    var i18n = new Jed({
                        // This callback is called when a key is missing
                        'missing_key_callback': function(key) {
                            // Do something with the missing key
                            // e.g. send key to web service or
                            if (lang!=='en_US') {
                                console.error('missing_i18n', lang, ':', key);
                            }
                        },
                        'locale_data': msg
                    });
                    
                    function gt(id) {
                        var out;
                        if (arguments.length<2) {
                            out=i18n.translate(id).fetch();
                        } else {
                            var arg=[];
                            for (var i=1;i<arguments.length;i++) {
                                arg.push(arguments[i]);
                            }
                            console.log(arg);
                            out=i18n.translate(id).fetch(arg);
                        }
                        return out;
                    }
                    gt.ngettext = function (singular, plural, num) {
                        var out= i18n.translate(singular)
                            .ifPlural( num, plural )
                            .fetch( num );
                        return out;
                    };
                    gt.lang=lang;
                    onload(gt);
                });        
            
        }
    };

    return gettext;
});
