define('diplomatic/view/popup', [
    'diplomatic/model/legende',
    'jquery',
], function (legende) {

    'use strict';


    var keysLowerToUpper={};
    function calcKeysToLower() {
        var keys=Object.keys(legende);
        for (var i = 0; i <keys.length; i++) {
            var upper=keys[i];
            var lower=upper.toLowerCase();
            keysLowerToUpper[lower]=upper;
        }
    }
    calcKeysToLower();

    function click(e) {
        var name=e.target.feature.properties.tags.name,
            id=e.target.feature.properties.id,
            type=e.target.feature.properties.type,
            url=window.location.href,
            shareTitle='diplomatic-map'+name,
            latMin=e.target._latlng.lat-0.0015,
            latMax=e.target._latlng.lat+0.0015,
            lonMin=e.target._latlng.lng-0.003,
            lonMax=e.target._latlng.lng+0.003,
            popupj= $('<div>').addClass('popup-content'),
            share='<div class="share">';

        url=url.split('?')[0];
        url=url.split('#')[0];
        url=url+'?id='+id+'&type='+type;
        share+='<a href="'+url+'" title="Link zu diesem Marker"><i class="fa fa-link"></i></a>';
        url=encodeURIComponent(url);
        share+='<a href="http://www.facebook.com/sharer.php?u='+url+'&t='+ shareTitle+'" target="_blank" title="Bei Facebook teilen"><i class="fa fa-facebook"></i></a>';
        share+='<a href="http://twitter.com/home?status='+shareTitle+' - '+url+'"  target="_blank" title="twittern"><i class="fa fa-twitter"></i></a>';        share+='<a href="mailto:?subject='+shareTitle+'&body='+url+'" title="Per E-Mail weiterleiten"><i class="fa fa-envelope"></i></a>';
        share+='</div>';
        var table=$('<table class="table table-striped table-bordered table-condensed">');
        var td=$('<td>')
            .append($('<a>', {
                href: 'https://www.openstreetmap.org/'+type+'/'+id,
                target: '_blank',
            }).text('Show in OSM'))
            .append($('<br>'))
            .append($('<a>', {
                href: 'https://www.openstreetmap.org/'+type+'/'+id+'/history',
                target: '_blank',
            }).text('OSM History'))
            .append($('<br>'))
            .append($('<a>', {
                href: 'https://www.openstreetmap.org/edit?editor=id&'+type+'='+id,
                target: '_blank',
            }).text('OSM iD Editor'))
            .append($('<br>'))
            .append($('<a>', {
                href: 'http://localhost:8111/load_and_zoom?select='+type+id+
                    '&left='+lonMin+
                    '&right='+lonMax+
                    '&top='+latMax+
                    '&bottom='+latMin+
                    '&changeset_comment=modify+diplomatic+place'+
                    '&changeset_source=with+help+of+diplomaticmap',
                target: 'hiddenJosmIframe',
            }).text('JOSM Editor'))
        ;
        


        table.append($('<tr>').append($('<th>').html(share)).append(td));

        for (var clave in e.target.feature.properties.tags) {
            var title = keysLowerToUpper[clave];
            if (title === undefined) {
                console.log('undef:', clave, '.');
                title=clave;
            }
            var attr = e.target.feature.properties.tags[clave];
            var ignore = false;
            var tooltip = '';
            if (legende[title] !== undefined) {
                if (legende[title].keys !== undefined ) {
                    if (legende[title].keys[attr] !== undefined) {
                        attr=attr+': '+legende[title].keys[attr];
                    }
                }
                if (legende[title].ignore !== undefined) {
                    ignore = legende[title].ignore;
                }
                if (legende[title].descr !== undefined) {
                    tooltip = legende[title].descr;
                }
                    // do this as last operation                                                                                                                                   
                if (legende[title].title !== undefined) {
                    title=legende[title].title+' ('+title+')';
                }
            }
            if (attr.indexOf('http') === 0) {
                attr = '<a target="_blank" href="' + attr + '">'+ attr + '</a>';
            }
            if ((attr) && (! ignore)) {
                table.append($('<tr>').html('<th title="'+tooltip+'">'+title+'</th><td>'+attr+'</td>'));
            }
        }
        popupj.append(table);
        e.target._popup.setContent(popupj[0]);


    }

    return {
        'click': click,
    };
});