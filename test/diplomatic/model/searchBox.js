define('test/diplomatic/model/searchBox',[
    'diplomatic/model/searchBox',
], function (searchBox) {

    'use strict';
    
    describe("SearchBoxModel", function() {
        
        it("require js module return a value", function() {
            
            expect(searchBox).toBeDefined();
        });

        it("new SearchBoxModel", function() {
            var searchBoxModel= new searchBox();

            expect(searchBoxModel).toBeDefined();
            expect(searchBoxModel.get('searchKey')).toEqual('*');
            expect(searchBoxModel.get('showClear')).toEqual(false);
            expect(searchBoxModel.get('searchValues')).toBeNull();

        });

        it("searchValues", function() {
            var searchBoxModel= new searchBox();
            searchBoxModel.set({'searchKey':'diplomatic', 
                                });

            expect(searchBoxModel.get('searchValues')).not.toBeNull();
            expect(searchBoxModel.get('searchValueText')).toBeNull();

        });

        it("initAdditionalFeatures", function() {
            var searchBoxModel= new searchBox();
            
            searchBoxModel.initAdditionalFeatures([{
                properties:{
                    tags: {
                        'diplomatic': 'hastNichtGesehen',
                    }
                }
            }]);
//            console.log(searchBoxModel.attributes);
            expect(searchBoxModel.get('typeAhead')[0]).toEqual('hastNichtGesehen');
            expect(searchBoxModel.get('typeAhead').length).toEqual(1);
            searchBoxModel.set({'searchKey':'diplomatic', 
                               });
//            expect(searchBoxModel.get('typeAhead')[0]).toEqual('hastNichtGesehen');
            expect(searchBoxModel.get('searchValues')).not.toBeNull();
            expect(searchBoxModel.get('searchValues')['hastNichtGesehen']).not.toBeNull();
        });


    });
});
