define('test/diplomatic/model/version',[
    'diplomatic/model/version',
], function (version) {
    describe("version", function() {
        it("has revision and date", function() {
            expect(version.revision).toBeDefined();
            expect(version.date).toBeDefined();
        });
    });
});