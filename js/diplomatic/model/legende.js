define('diplomatic/model/legende', [     
    'gettext!diplomatic',
], function (gt) {
    
    'use strict';

   /* var meta= {
        'id': {
            title: 'OpenStreetMap id',
        },
        'otype': {
            title: 'OpenStreetMap typ',
            keys: {
                1: 'node',
                2: 'way',
            }
        },
        'timestamp': {
            title: 'Last changed on',
        },
        'user': {
            title: 'Last changed by',
        },
        'version': {
            title: 'OpenStreetMap version',
        },
    };
*/
    var popupOpt = {
        'name': {
            title: 'Name',
        },
        'diplomatic': {
            title: 'Type',
            validation: ['required', 'keyCheck'],
            keys: {
                'consulate': gt('consulate (led by a consul)'),
                'embassy': gt('embassy (led by an ambassador)'),
                'honorary_consulate': gt('honorary consulate'),
                'high_commission': gt('high commission'),
                'permanent_mission': gt('permanent mission'),
                'consulate_general': gt('consulate general'),
                'delegation': gt('delegation'),
                'non_diplomatic': gt('non diplomatic'),
                'ambassadors_residence': gt('residence of a head of a diplomatic mission')
            }
        },
        'country': {
            validation: ['deprecated=diplomatic:sending_country', 'iso-country'],
            ignoreInSearch: true,
            title: gt('Sending Country'),
            countryCode: true,
        }, 
        'target': {
            validation: ['deprecated=diplomatic:receiving_country', 'iso-country'],
            ignoreInSearch: true,
            title: gt('Receiving Country'),
            countryCode: true,
        }, 
        'diplomatic:receiving_country': {
            sameAs: 'target',
            validation: ['required', 'iso-country'],
            title: gt('Receiving Country'),
            countryCode: true,
        },
        'diplomatic:sending_country': {
            sameAs: 'country',
            validation: ['required', 'iso-country'],
            title: gt('Sending Country'),
            countryCode: true,
        },
        'addr:street': {
            validation: ['recommended'],
            title: gt('Street'),
        }, 
        'addr:country': {
            validation: ['recommended', 'iso-country'],
            title: gt('Country'),
            countryCode: true,
        }, 
        'addr:city': {
            validation: ['recommended'],
            title: gt('City'),
        },
        'addr:housenumber': {
            validation: ['recommended'],
            title: gt('Housenumber'),
        }, 
        'addr:postcode': {
            validation: ['recommended'],
            title: gt('Postcode'),
        },
        'website': {
            validation: ['recommended'],
            title: gt('Website'),
        }, 
        'wheelchair': {
            validation: ['recommended', 'keyCheck'],
            title: gt('Wheelchair'),
            keys: {
                'yes': gt('Wheelchairs have full unrestricted access.'),
                'no': gt('Wheelchairs have no unrestricted access.'),
                'limited': gt('Wheelchairs have partial access.'),
                'designated': gt('The palce is designated or purpose built for wheelchairs.'),
            }
        }, 
        'source': {
            title: gt('Source'),
            descr: gt('Source of the data')
        },
        'amenity': {
            title: 'amenity',
            ignore: true,
            keys: {
                'embassy': 'embassy'
            }
        },
        'phone': {
            validation: ['recommended'],
            title: gt('Phone'),
        },
        'opening_hours': {
            title: gt('Opening hours'),
        },
        'fixme': {
            validation: ['fixme'],
            title: gt('Fimxe note'),
        },
        'note': {
            title: gt('OSM note'),
        },
        'email': {
            validation: ['recommended'],
            title: gt('E-Mail'),
        },
        'fax': {
            validation: ['recommended'],
            title: gt('Fax'),
        }
    };

    return popupOpt;
});
