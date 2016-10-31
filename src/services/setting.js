backman.factory('_setting', function ($rootScope) {

    'use strict';

    var data = {
        base: location.protocol + '//' + location.host,
        path: ''
        // ,ajaxParams: {"authClient": "app", "apiVersion": "v1"}
    };

    return {
        get: function (key) {
            return data[key];
        },
        set: function (key, val) {
            data[key] = val
        }
    };

});