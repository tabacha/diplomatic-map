define('diplomatic/model/searchbox', [
    'diplomatic/model/legende',
    'jquery',
],
       function (legende, $) {

           function populateTypeAhead(typeAheadStrings) {
               var fs=$('<input type="text" id="filter-string" class="input-medium search-query" autocomplete="off">');
               $('#filter-string').replaceWith(fs);

               fs.typeahead({'source': typeAheadStrings,
                            'updater': function(item) {
                                console.log('updater', item);
                                this.$element[0].value = item;
                                $('.form-search').submit();
                                return item;
                            }});
           }

           function create(typeAhead, addiLegendKeys) {
               var ele=$('#search-id');
               ele.html('');
               ele.append($('<option>', {id: '*'}).text('all'));
               for (var key in legende) {
                   var ignore = false, title = legende[key].title;
                   if (legende[key].ignore !== undefined) {
                       ignore = legende[key].ignore;
                   }
                   if (!ignore) {
                       ele.append($('<option>', {id: key}).text(title));
                   }
               }
               populateTypeAhead(typeAhead['*']);
               ele.change( function () {

                   $('#search-id option:selected').each(function(){
                       var key=this.id;
                       if (key === '*') {
                           $('#search-op').fadeOut();
                           $('#search-value').fadeOut();
                           $('#filter-string').fadeIn();
                           populateTypeAhead(typeAhead[key]);
                       } else {
                           if (legende[key].keys === undefined) {
                               $('#search-op').fadeIn();
                               $('#search-value').fadeOut();
                               $('#filter-string').fadeIn();
                               populateTypeAhead(typeAhead[key]);
                           } else {
                               $('#search-op').fadeIn();
                               $('#search-value').fadeIn();
                               $('#filter-string').fadeOut();
                               var valbox=$('#search-value').html('');
                               for (var value in legende[key].keys) {
                                   valbox.append($('<option>', {id: value}).text(legende[key].keys[value]));
                               }
                               for (var oid in addiLegendKeys[key]) {

                                   var osmkey= addiLegendKeys[key][oid];
                                   if (legende[key].keys[osmkey] === undefined) {
                                       valbox.append($('<option>', {id: osmkey}).text(osmkey+ ' (not documented tag)'));
                                   }
                               }
                           }
                       }
                   });
               });
           }
           return {'create': create};
       });
