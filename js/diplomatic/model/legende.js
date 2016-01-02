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
            title: 'Sending Country',
        }, 
        'addr:street': {
            title: 'Street',
        }, 
        'addr:country': {
            title: 'Country',
        }, 
        'addr:city': {
            title: 'City',
        },
        'addr:housenumber': {
            title: 'Housnumber',
        }, 
        'addr:postcode': {
            title: 'Postcode',
        },
        'website': {
            title: 'Website',
        }, 
        'wheelchair': {
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
            keys: {
                'embassy': 'embassy'
            }
        },
        'phone': {
            title: 'Phone',
        },
        'opening_hours': {
            title: 'Opening hours',
        },
        'fixme': {
            title: 'Fimxe note',
        },
        'note': {
            title: 'OSM note',
        },
        'email': {
            title: 'E-Mail',
        },
        'fax': {
            title: 'Fax',
        }
    };

    return popupOpt;
});
