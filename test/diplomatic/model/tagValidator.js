define('test/diplomatic/model/tagValidator', [
    'diplomatic/model/tagValidator'
], function (tagValidator) {

    'use strict';
    
    describe('Validate Tag', function () {
        it("check of paris embassy", function() {
            var tags={
                'diplomatic:sending_country':'DE',
                'diplomatic:receiving_country':'FR',
                'name': 'Deutsche Botschaft',
                'addr:street': 'Rue de Charlie 12',
                'amenity': 'embassy',
                'diplomatic': 'embassy',
            }
            var v=tagValidator.validate(tags);
            console.log(v);

            expect(v.errorArr.length).toEqual(0);
            expect(v.warnArr.length).toEqual(2);
            expect(v.hintArr.length).toEqual(9);
        });
    });
});