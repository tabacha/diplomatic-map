GLOBAL.window={};
GLOBAL.requirejs={};
GLOBAL.requirejs.config=function(cfg) {
    var fs = require('fs');
    fs.writeFile('common-generated.js', 
                 'requirejs.config('+JSON.stringify(cfg, null, ' ')+')', 
                 function(err) {
                     if(err) {
                         return console.log(err);
                     }
                     
                     console.log('The file was saved!');
                 }); 
};
a=require('./common');