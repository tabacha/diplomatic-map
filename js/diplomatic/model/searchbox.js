define('diplomatic/model/searchbox', [
    'diplomatic/model/legende',
    'jquery',
],
       function (legende, $) {
           function arrayToSet(a) {
               var temp = {};
               for (var i = 0; i < a.length; i++)
                   temp[a[i]] = true;
               var r = [];
               for (var k in temp)
                   r.push(k);
               return r;
           }
           function populateTypeAhead(typeAheadStrings) {
               var fs=$('<input type="text" id="filter-string" class="input-medium search-query" autocomplete="off">');
               $('#filter-string').replaceWith(fs);
               
               var typeAheadSource=[];
               for (var i = typeAheadStrings.length -1; i>=1; i--) {
                   var item = typeAheadStrings[i].strip();
                   typeAheadSource.push(item);
                   var words = item.split(/\W+/);
                   for (var k = words.length - 1; k >= 0; k--) {
                       typeAheadSource.push(words[k]);
                   }
               }
               typeAheadSource = arrayToSet(typeAheadSource);
               fs.typeahead({source: typeAheadSource});
           }
           function create(knownTypeAhead, allTypeAhead) {
               var ele=$('#search-id');
               ele.html('');
               ele.append($('<option>', {id: '*'}).text('all'));
               for (var key in legende) {
                   var ignore=false,
                   title=legende[key].title;
                   if (legende[key].ignore !== undefined) {
                       ignore = legende[key].ignore;
                   }
                   if (!ignore) {
                       ele.append($('<option>', {id: key}).text(title));
                   }
               }
               populateTypeAhead(allTypeAhead);
               ele.change( function () {

                   $('#search-id option:selected').each(function(){
                       var key=this.id;
                       if (key === '*') {
                           $('#search-op').fadeOut();
                           $('#search-value').fadeOut();
                           $('#filter-string').fadeIn();
                           populateTypeAhead(allTypeAhead);
                       } else {
                           if (legende[key].keys === undefined) {
                               $('#search-op').fadeIn();
                               $('#search-value').fadeOut();
                               $('#filter-string').fadeIn();
                               populateTypeAhead(knownTypeAhead[key]);
                           } else {
                               $('#search-op').fadeIn();
                               $('#search-value').fadeIn();
                               $('#filter-string').fadeOut();
                               var valbox=$('#search-value').html('');
                               for (var value in legende[key].keys) {
                                   valbox.append($('<option>', {id: value}).text(legende[key].keys[value]));
                               }
                               for (var oid in knownTypeAhead[key]) {

                                   var osmkey= knownTypeAhead[key][oid];
                                   if (legende[key].keys[osmkey] === undefined) {
                                       valbox.append($('<option>', {id: osmkey}).text(osmkey+ ' (not documented tag)'));
                                   }
                               }
                           }
                       }
                   });
               });
           };
           return {'create': create,};
       });
