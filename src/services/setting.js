backman.factory('_setting', function ($rootScope) {

    'use strict';

    var _data = {
        base: location.protocol + '//' + location.host,
        path: '/' + location.pathname.split('/index.html')[0],
        ajaxParams: null,
        navListUrl: ''
    };
    _data.navListUrl = _data.base + _data.path + '/_data/navList.json';

    return {
        get: function (key) {
            return _data[key];
        },
        set: function (key, val) {
            _data[key] = val;
        }
    };

});