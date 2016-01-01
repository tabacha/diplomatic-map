define('diplomatic/model/legende', [], function () {

    'use strict';

    var popupOpt = {
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
        'name': {
            title: 'Name',
        },
        'version': {
            title: 'OpenStreetMap version',
        },
        'diplomatic': {
            title: 'Type',
        },
        'country': {
            title: 'Country',
        }, 
        'addr:street': {
            title: 'Street',
        }, 
        'addr:country':{
            title: 'Country',
        }, 
        'addr:city': {
            title: 'City',
        },
        'addr:housenumber': {
            title: 'Housnumber',
        }, 
        'website': {
            title: 'Website',
        }, 
        'wheelchair': {
            title: 'Wheelchair',
        }, 
        'source': {
            title: 'Source',
            descr: 'Soruce of the data'
        },
        'amenity': {
            title: 'amenity',
            ignore: true,
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
        }
    };

    return popupOpt;
});
