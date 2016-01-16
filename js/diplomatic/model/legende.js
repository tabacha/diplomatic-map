define('diplomatic/model/legende', [], function () {

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
                'consulate': 'consulate (led by a consul)',
                'embassy': 'embassy (led by an ambassador)',
                'honorary_consulate': 'honorary consulate',
                'high_commission': 'high commission',
                'permanent_mission': 'permanent mission',
                'consulate_general': 'consulate general',
                'delegation': 'delegation',
                'non_diplomatic': 'non diplomatic',
                'ambassadors_residence': 'residence of a head of a diplomatic mission'
            }
        },
        'country': {
            validation: ['deprecated=diplomatic:sending_country'],
            ignoreInSearch: true,
            title: 'Sending Country',
        }, 
        'target': {
            validation: ['deprecated=diplomatic:receiving_country'],
            ignoreInSearch: true,
            title: 'Receiving Country',
        }, 
        'diplomatic:receiving_country': {
            sameAs: 'target',
            validation: ['required'],
            title: 'Receiving Country',
        },
        'diplomatic:sending_country': {
            sameAs: 'country',
            validation: ['required'],
            title: 'Sending Country',
        },
        'addr:street': {
            validation: ['recommended'],
            title: 'Street',
        }, 
        'addr:country': {
            validation: ['recommended'],
            title: 'Country',
        }, 
        'addr:city': {
            validation: ['recommended'],
            title: 'City',
        },
        'addr:housenumber': {
            validation: ['recommended'],
            title: 'Housnumber',
        }, 
        'addr:postcode': {
            validation: ['recommended'],
            title: 'Postcode',
        },
        'website': {
            validation: ['recommended'],
            title: 'Website',
        }, 
        'wheelchair': {
            validation: ['recommended', 'keyCheck'],
            title: 'Wheelchair',
            keys: {
                'yes': 'Wheelchairs have full unrestricted access.',
                'no': 'Wheelchairs have no unrestricted access.',
                'limited': 'Wheelchairs have partial access.',
                'designated': 'The palce is designated or purpose built for wheelchairs.',
            }
        }, 
        'source': {
            title: 'Source',
            descr: 'Soruce of the data'
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
            title: 'Phone',
        },
        'opening_hours': {
            title: 'Opening hours',
        },
        'fixme': {
            validation: ['fixme'],
            title: 'Fimxe note',
        },
        'note': {
            title: 'OSM note',
        },
        'email': {
            validation: ['recommended'],
            title: 'E-Mail',
        },
        'fax': {
            validation: ['recommended'],
            title: 'Fax',
        }
    };

    return popupOpt;
});
