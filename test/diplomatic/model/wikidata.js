define('test/diplomatic/model/wikidata',[
    'diplomatic/model/wikidata',
], function (wikidata) {
    describe("Wikidata load", function() {
        it("is not loaded", function() {
            wikidata.testLoad(false);
            expect(wikidata.isLoaded()).toEqual(false);
        });
            
        it("is is loaded", function() {
            wikidata.testLoad({'de':{lblen:'Germany', lblde:'Deutschland'}});
            expect(wikidata.isLoaded()).toEqual(true);
        });

        it('has some data for germany', function() {
            wikidata.testLoad({'de':{lblen:'Germany', lblde:'Deutschland'}});
            var de=wikidata.lookup('de')
            expect(de.lblen).toEqual('Germany');
            expect(de.lblde).toEqual('Deutschland');
        });
        
    });
});