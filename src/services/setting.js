backman.factory('_setting', function ($rootScope) {

    'use strict';

    var _data = {
        base: location.protocol + '//' + location.host,
        path: '/' + location.pathname.split('/index.html')[0],
        globAjaxParams: {}
    };
    _data.path = _data.path == '/' ? '' : _data.path;

    //左侧导航栏接口地址
    _data.navListUrl = _data.base + _data.path + '/_data/navList.json';

    //登录页地址
    _data.loginUrl = _data.base + _data.path + '/login.html';

    //退出登录接口地址
    _data.logoutUrl = _data.base + _data.path + '';

    //全局图片上传设置
    _data.globUploadImg = {};

    return {
        get: function (key) {
            return _data[key];
        },
        set: function (key, val) {
            if (key == 'globAjaxParams') {
                if ($.type(val) == 'object') {
                    angular.extend(_data.globAjaxParams, val);
                }
            } else if (key == 'globUploadImg') {
                if ($.type(val) == 'object') {
                    angular.extend(_data.globUploadImg, val);
                }
            } else {
                _data[key] = val;
            }
        }
    };

});