define('diplomatic/model/tagValidator', [
    'diplomatic/model/legende',
    'diplomatic/model/wikidata',
], function (legende, wikidata) {
    'use strict';
    
    var tagValidator= {
        'keyCheck': function (obj) {
            if (obj.value !== undefined) {
                if (!legende[obj.key].keys.hasOwnProperty(obj.value)) {
                    return {'error': {'unkownKey': obj}};
                } // else
            } // else
            return true;
        },
        'required': function (obj) {
            if (obj.value === undefined) {
                return {'error': {'required': obj}};
            } // else
            return true;
        },
        'recommended': function (obj) {
            if (obj.value === undefined) {
                return {'hint': {'recommended': obj}};
            } // else
            return true;
        },
        'fixme': function (obj) {
            if (obj.value !== undefined) {
                return {'warn': {'fixme': obj}};
            } // else
            return true;
        },
        'iso-country': function (obj) {
            if (obj.value !== undefined) {
                var countries = obj.value.split(';');
                for (var i=0; i<countries.length; i++) {
                    var country=countries[i];
                    var c=wikidata.lookup(country);
                    if (c === null) {
                        var rtn={};
                        rtn.warn={};
                        rtn.warn['unkownCountry='+country]=obj;
                        return rtn;
                    }
                }
            } // else
            return true;
        },
        'deprecated': function (obj, valiKey) {
            var newTag = valiKey.split('=')[1];
            if (obj.value !== undefined) {
                var rtn;
                if  (obj.tags[newTag] === undefined) {
                    rtn={error: {}};
                    rtn.error[valiKey]=obj;
                } else {
                    rtn={hint: {}};
                    rtn.hint['remove_'+valiKey]=obj;
                }
                return rtn;
            } // else
            return true;
        }
    };

    function validateTags(tags) {
        var rtn={errorArr: [], warnArr: [], hintArr: [] };

        for (var key in legende) {
            if (legende.hasOwnProperty(key)) {
                var validation=legende[key].validation;
                if (validation !== undefined) {
                    var val = tags[key];

                    var checkObj= {
                        'key': key,
                        'value': val,
                        'tags': tags,
                    };
                    if (val !== undefined) {
                        checkObj.combi = key+'='+val;
                    }

                    for (var validatorIdx in validation) {
                        var validatorKey = validation[validatorIdx].split('=')[0];
                        if (tagValidator[validatorKey] !== undefined) {
                            var tagRtn=tagValidator[validatorKey](checkObj, validation[validatorIdx]);
                            if (tagRtn !== true) {
                                if (tagRtn.error) {
                                    rtn.errorArr.push(tagRtn.error);
                                }
                                if (tagRtn.hint) {
                                    rtn.hintArr.push(tagRtn.hint);
                                }
                                if (tagRtn.warn) {
                                    rtn.warnArr.push(tagRtn.warn);
                                }
                            }
                        } else {
                            console.error('Validator with name: '+validatorKey+' undefined', checkObj);
                        }
                    }
                }
            }
        }
        return rtn;
    }
    function countValidationErrors (tags) {
        var validResults=validateTags(tags);
        var rtn={
            'error': validResults.errorArr.length,
            'warn': validResults.warnArr.length,
            'hint': validResults.hintArr.length,
        };
        if (rtn.error>0) {
            rtn.color='red';
        } else if (rtn.warn>0) {
            rtn.color='orange';
        } else if (rtn.hint>0) {
            rtn.color='yellow';
        } else {
            rtn.color='green';
        }
        return rtn;
    }
    
    function byKey(tags) {
        var byErrClass=validateTags(tags);
        var byKeyRes={};
        function toKey(arr, type) {
            for (var i=0; i<arr.length; i++) {
                var error=arr[i];
                var errCode=Object.keys(error)[0];
                var k=error[errCode].key;
                var rtn=error[errCode];
                if (byKeyRes[k] === undefined) {
                    byKeyRes[k]=[];
                }
                rtn.type=type;
                rtn.code=errCode;
                rtn.baseCode=errCode.split('=')[0];
                byKeyRes[k].push(rtn);
            }
        }
        toKey(byErrClass.errorArr, 'error');
        toKey(byErrClass.warnArr, 'warn');
        toKey(byErrClass.hintArr, 'hint');
        return byKeyRes;
    }
    return {
        'validate': validateTags,
        'validateByKey': byKey,
        'count': countValidationErrors,
    };
});