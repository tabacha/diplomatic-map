define('diplomatic/model/searchbox', [
    'diplomatic/model/legende',
    'jquery',
],
       function (legende, $) {
           var ele=$('#search-id');
           ele.html('');
           ele.append($('<option>', {id: '*'}).text('Alles'));
           var searchGroups={};
           for (var key in legende) {
               var ignore=false,
                   title=legende[key].title;
               if (legende[key].ignore !== undefined) {
                   ignore = legende[key].ignore;
               }
               if (!ignore) {
                   if (legende[key].searchGroup !== undefined) {
                       var searchGrp=legende[key].searchGroup;
                       if (searchGroups[searchGrp] === undefined) {
                           ele.append($('<option>', {id: searchGrp}).text(searchGrp));
                           searchGroups[searchGrp]= [ ];
                       }
                       searchGroups[searchGrp].push(key);
                   } else {
                       ele.append($('<option>', {id: key}).text(title));
                   }
               }
           }
           ele.change( function () {
               $('#search-id option:selected').each(function(){
                   var key=this.id;
                   if (key === '*') {
                       $('#search-op').fadeOut();
                       $('#search-value').fadeOut();
                       $('#filter-string').fadeIn();
                   } else {
                       var sKey=key;
                       if (searchGroups[key] !== undefined) {
                           sKey=searchGroups[key][0];
                       }
                       if (legende[sKey].keys === undefined) {
                           $('#search-op').fadeIn();
                           $('#search-value').fadeOut();
                           $('#filter-string').fadeIn();
                       } else {
                           $('#search-op').fadeIn();
                           $('#search-value').fadeIn();
                           $('#filter-string').fadeOut();
                           var valbox=$('#search-value').html('');
                           for (var value in legende[sKey].keys) {
                               valbox.append($('<option>', {id: value}).text(legende[sKey].keys[value]));
                           }
                       }
                   }
               });
           });
           return {'searchGroups': searchGroups};
       });
