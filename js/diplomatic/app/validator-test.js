define('diplomatic/app/validator-test', [
    'jquery',
    'diplomatic/model/tagValidator',
], function ($, tagValidator) {
    
    'use strict';

    var tags={ 
            'amenity': 'embassy',
            'diplomatic': 'permanent_mission',
            'name:de': 'Deutsche Botschaft',
            'country': 'DE',
            'addr:city': 'London',
            'addr:country': 'GB',
            'addr:street': 'Station Street',
            'addr:housenumber': '22',
            'addr:postcode': '234W'
        },
        vInput=$('#validator-input'),
        vResult=$('#validator-result'),
        vButton=$('#validator-button');

    vInput.text(JSON.stringify(tags, null, 2));
    vButton.removeClass('disabled');
    vButton.click( function (event) {
        event.preventDefault();
        var txt=vInput.prop('value');
        var newTags;
        try {
            newTags=JSON.parse(txt);
        } catch (e) {
            vResult.text('JSON-Parse-Error: '+e.toString());
        }
        if (newTags !== undefined) {
            var validationResults=tagValidator.validate(newTags);
            vResult.text(JSON.stringify(validationResults, null, 2));
        }
    });
});