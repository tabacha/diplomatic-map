define('gettext', function () {

    'use strict';

    function gt(id) {
        return id;
    }
    gt.load = function (name, req, onload, config) {

        console.log(name);
        onload();

    }
    return gt;
});
