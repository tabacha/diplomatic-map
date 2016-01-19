define('diplomatic/model/osmEditorLinks', [
    'gettext!diplomatic',
    // not in function list
], function (gt) {

    'use strict';

    function getEditorLinks(type, id, lat, lon) {
        var latMin=lat-0.0015,
            latMax=lat+0.0015,
            lonMin=lon-0.003,
            lonMax=lon+0.003;
        
        return [
            {
                id: 'osm',
                url: 'https://www.openstreetmap.org/'+type+'/'+id,
                target: '_blank',
                title: gt('Show in OSM'),
            },
            {
                id: 'osm-history',
                url: 'https://www.openstreetmap.org/'+type+'/'+id+'/history',
                target: '_blank',
                title: gt('OSM History'),
            },
            {
                id: 'osm-edit-id',
                url: 'https://www.openstreetmap.org/edit?editor=id&'+type+'='+id,
                target: '_blank',
                title: gt('OSM iD Editor'),
            },
            {
                id: 'josm-local',
                url: 'http://localhost:8111/load_and_zoom?select='+type+id+
                    '&left='+lonMin+
                    '&right='+lonMax+
                    '&top='+latMax+
                    '&bottom='+latMin+
                    '&changeset_comment=modify+diplomatic+place'+
                    '&changeset_source=with+help+of+diplomaticmap',
                target: 'hiddenJosmIframe',
                title: gt('JOSM Editor'),
            }
        ];
    }

    return {
        'get': getEditorLinks
    };
});