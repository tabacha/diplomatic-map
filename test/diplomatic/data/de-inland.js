define('test/diplomatic/data/de-inland',[
    'text!data/de-inland.json',
], function (dataTxt) {
    function check(name, entry) {
            it('data '+name+' has Ort', function() {
                expect(entry.Ort).toBeDefined();
            });

            it('data '+name+" has iso", function() {
                expect(entry['iso3166-alpha2']).toBeDefined();
            });
            it('data '+name+" has geo", function() {
                expect(entry).toBeDefined();
            });
               
            it('data '+name+" has lat/lon", function() {
                expect(entry['geo'].lat).toBeDefined();
                expect(entry['geo'].lat).not.toBeNull();
                expect(entry['geo'].lon).toBeDefined();
                expect(entry['geo'].lon).not.toBeNull();
            });
    }
    describe("data check de-inland", function() {
        var data=JSON.parse(dataTxt);
        for(var i=0; i<data.length; i++) {
            
            check(data[i].Staat, data[i]);
        };
    });
});