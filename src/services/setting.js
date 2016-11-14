backman.factory('_setting', function ($rootScope) {

    'use strict';

    var _data = {
        base: location.protocol + '//' + location.host,
        path: '',
        ajaxParams: null,
        navListUrl: ''
    };
    _data.navListUrl = '_data/navList.json';

    return {
        get: function (key) {
            return _data[key];
        },
        set: function (key, val) {
            _data[key] = val;
        }
    };

});