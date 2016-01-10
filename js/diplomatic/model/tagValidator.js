define('diplomatic/model/tagValidator', [
    'diplomatic/model/legende'
], function (legende) {
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
    return {
        'validate': validateTags,
    };
});