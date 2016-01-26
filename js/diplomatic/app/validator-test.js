define('diplomatic/app/validator-test', [
    'jquery',
    'diplomatic/model/tagValidator',
    'diplomatic/view/popup',
    'diplomatic/model/wikidata',
], function ($, tagValidator, popup, wikidata) {
    
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
        vButton=$('#validator-button'),
        vTable=$('#validator-table');

    wikidata.load(function () {
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
                var validationResults=tagValidator.validateByKey(newTags);
                vResult.text(JSON.stringify(validationResults, null, 2));
                vTable.html('');
                var data={feature: {properties: {tags: newTags, id: '42', type: 'hurra'}}};
                vTable.append(popup.table(data));
                vTable.find('.combi').css({'display': 'none'});
                vTable.find('.osmHint').css({'display': ''});
            }
            
        });
    }, function () {
        alert(gt('Error retrieving data'));
    });
});