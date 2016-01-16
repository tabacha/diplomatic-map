var popup_state='about';
define('diplomatic/view/popup', [
    'diplomatic/model/legende',
    'diplomatic/model/tagValidator',
    'gettext!bla',
    // not in function list
    'jquery',
], function (legende, tagValidator, gt) {

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

    function getShareLinks(url, title) {
        var share='<div class="share">';
        share+='<a href="'+url+'" title="'+gt('Link to this marker')+'"><i class="fa fa-link"></i></a>';
        url=encodeURIComponent(url);
        share+='<a href="http://www.facebook.com/sharer.php?u='+url+'&t='+ title+'" target="_blank" title="Bei Facebook teilen"><i class="fa fa-facebook"></i></a>';
        share+='<a href="http://twitter.com/home?status='+title+' - '+url+'"  target="_blank" title="twittern"><i class="fa fa-twitter"></i></a>';
        share+='<a href="mailto:?subject='+title+'&body='+url+'" title="Per E-Mail weiterleiten"><i class="fa fa-envelope"></i></a>';
        share+='</div>';
        return share;
    } 
    function getOSMEditorLinks(type, id, lat, lon) {
        var latMin=lat-0.0015,
            latMax=lat+0.0015,
            lonMin=lon-0.003,
            lonMax=lon+0.003,
            div=$('<div>');
        div.append($('<a>', {
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
        return div;
    }

    function getValidationRow(errors, tag) {
        for (var i=0; i<errors.length; i++) {
            var code=errors[i].code;
            if ((code==='required') ||
                (code==='recommended')) {
                var th=$('<th>').text(tag);
                var td=$('<td>').text('fill in a good value');
                return $('<tr class="osmHint">')
                    .css({'display': 'none'})
                    .addClass('new-tag-'+errors[i].code)
                    .append(th)
                    .append(td);
            } 
           
        }
        return undefined;
    }

    function getTable(target, url) {
        var tags=target.feature.properties.tags,
            name=tags.name,
            id=target.feature.properties.id,
            type=target.feature.properties.type,
            shareTitle='diplomatic-map'+name;
        var share='';
        var tdLink=$('<td>');
        var validation=tagValidator.validateByKey(tags);
        var table=$('<table class="table table-striped table-bordered table-condensed">');
        if (url !== undefined) {
            url=url+'?id='+id+'&type='+type;
            share=getShareLinks(url, shareTitle);
            tdLink.append( getOSMEditorLinks(type, id, target._latlng.lat, target._latlng.lng));
        }
        table.append($('<tr>').append($('<th>').html(share)).append(tdLink));

        for (var clave in tags) {
            var th=$('<th>'), td= $('<td>');
            var combiThDiv=$('<div class="combi">');
            var osmThDiv=$('<div class="osmTag">').css({display: 'none'});
            var osmThHint=$('<div class="osmHint">').css({display: 'none'});
            var combiTdDiv=$('<div class="combi">');
            var osmTdDiv=$('<div class="osmTag">').css({display: 'none'});
            var osmTdHint=$('<div class="osmHint">').css({display: 'none'});
            th.append(combiThDiv);
            th.append(osmThDiv);
            th.append(osmThHint);
            td.append(combiTdDiv);
            td.append(osmTdDiv);
            td.append(osmTdHint);
            var title = keysLowerToUpper[clave];
            if (title === undefined) {
                console.log('undef:', clave, '.');
                title=clave;
            }
            var attr = tags[clave];
            combiTdDiv.text(tags[clave]);
            osmTdDiv.text(tags[clave]);
            osmTdHint.text(tags[clave]);
            var ignore = false;
            combiThDiv.text('<'+title+'>');
            osmThDiv.text(title);
            osmThHint.text(title);
            if (validation[title] !== undefined) {
                for (var i=0; i<validation[title].length; i++) {
                    var baseCode=validation[title][i].baseCode;
                    if (baseCode === 'deprecated') {
                        var newVal=validation[title][i].code.split('=')[1];
                        var oldS=$('<s class="wrongTag">').text(title).attr('title', 'deprecated: remove');
                        var newDiv=$('<div class="newTag">').text(newVal).attr('title', 'add this tag');
                        osmThHint.html('');
                        osmThHint.append(oldS);
                        osmThHint.append(newDiv);
                    } else if (baseCode === 'remove_deprecated') {
                        var oldSval=$('<s class="wrongTag">').text(title).attr('title', 'deprecated: remove');
                        osmThHint.html('');
                        osmThHint.append(oldSval);
                        osmTdHint.addClass('remove-deprecated').text(title).attr('title', 'deprecated: remove');
                    } else if (baseCode === 'unkownKey') {
                        osmTdHint.addClass('unknownKey').attr('title', 'unkown key');
                    } else if (baseCode === 'fixme') {
                        var oldXval=$('<s class="wrongTag">').text(title).attr('title', 'fix and afterwards remove fixme tag');
                        osmThHint.html('');
                        osmThHint.append(oldXval);
                        osmTdHint.addClass('fixme-tag').attr('title', 'fix and afterwards remove fixme tag');
                    } else {
                        console.error('unknown validation error: '+baseCode);
                    }
                }
            }
            if (legende[title] !== undefined) {
                if (legende[title].keys !== undefined ) {
                    if (legende[title].keys[attr] !== undefined) {
                        combiTdDiv.text(legende[title].keys[attr]);
                    }
                }
                if (legende[title].ignore !== undefined) {
                    ignore = legende[title].ignore;
                }
                if (legende[title].descr !== undefined) {
                    th.attr('title', legende[title].descr);
                }
                if (legende[title].title !== undefined) {
                    combiThDiv.text(legende[title].title);
                }
            }
            if (attr.indexOf('http') === 0) {
                combiTdDiv.html('');
                combiTdDiv.append($('<a target="_blank" href="' + attr + '">').text(attr));
            }
            if ((attr) && (! ignore)) {

                table.append($('<tr>').append(th).append(td));
            }
        }
        for(var tag in validation) {
            console.log(tag);
            var errors=validation[tag];
            var row=getValidationRow(errors, tag);
            if (row !== undefined) {
                table.append(row);
            }
        }
        return table;
    }
    function click(e) {
        var popupj= $('<div>').addClass('popup-content');
        var url=window.location.href;
        url=url.split('?')[0];
        url=url.split('#')[0];
        var vc=e.target.feature.properties.valiCount,
            aVali=$('<a>').append(document.createTextNode('Validation')),
            liAbout=$('<li class="active">').append($('<a>').text('About')),
            liOSM=$('<li>').append($('<a tooltip="xyz">').text('OSM-Data')),
            liValidation=$('<li>').append(aVali);
        if (vc.error>0) {
            aVali.append($('<span class="badge err-vali-count">')
                         .attr('title', vc.error+' validation errors')
                         .text(vc.error));
        }
        if (vc.warn>0) {
            aVali.append($('<span class="badge warn-vali-count">')
                         .attr('title', vc.warn+' validation warnings')
                         .text(vc.warn));
        }
        if (vc.hint>0) {
            aVali.append($('<span class="badge hint-vali-count">')
                         .attr('title', vc.hint+' hints for better data')
                         .text(vc.hint));
        }
        if ((vc.error===0) && (vc.warn===0) && (vc.hint===0)) {
            aVali.append($('<span class="badge succ-vali-count">')
                         .attr('title', 'everything looks good')
                         .text('0'));
        }
        popupj.append($('<ul class="nav nav-tabs">')
                      .append(liAbout)
                      .append(liOSM)
                      .append(liValidation)
                     );

        var table=getTable(e.target, url);
        function changeTab(state) {
            if (state === 'about') {
                liAbout.addClass('active');
                table.find('.combi').css({'display': ''});                
            } else {
                liAbout.removeClass('active');
                table.find('.combi').css({'display': 'none'});                
            } 
            if (state === 'validation') {
                liValidation.addClass('active');
                table.find('.osmHint').css({'display': ''});
            } else {
                liValidation.removeClass('active');
                table.find('.osmHint').css({'display': 'none'});
            }
            if (state === 'osm') {
                liOSM.addClass('active');
                table.find('.osmTag').css({'display': ''});

            } else {
                liOSM.removeClass('active');
                table.find('.osmTag').css({'display': 'none'});
            }
            console.log(state);
            popup_state=state;
        }
        liOSM.on('click', function () {
            changeTab('osm');
        });
        liAbout.on('click', function () {
            changeTab('about');
        });
        liValidation.on('click', function () {
            changeTab('validation');
        });
        changeTab(popup_state);
        popupj.append(table);

        e.target._popup.setContent(popupj[0]);
    }

    return {
        'table': getTable,
        'click': click,
    };
});