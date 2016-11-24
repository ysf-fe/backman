// 服务：请求预处理
backman.factory('_responePreHandler', function (_tools, _setting) {

    'use strict';

    return {
        //正常通行
        success: function (success, config) {
            //需要重新登录
            if (success.data.state.code == 20001) {
                if (config && config.noVerify == true) {
                    return null;
                }
                layer.alert('您的登录已失效，即将跳转登录页...', {
                        icon: 0,
                        title: false,
                        closeBtn: 0
                    }, function () {
                    }
                );
                setTimeout(function () {
                    window.location.href = _setting.get('loginUrl');
                }, 3000);
                return null;
            }
            //正常code：10200
            if (success.data.state.code == 10200) {
                var data = success.data.data ? _tools.transKeyName('camel', success.data.data) : {};
                data.__state = _tools.transKeyName('camel', success.data.state);
                return data;
            }
            //正常code：10205
            else if (success.data.state.code == 10205) {
                return {
                    __state: _tools.transKeyName('camel', success.data.state)
                };
            }
            //报错code
            else {
                var str = '错误：code ' + success.data.state.code + '<br>' + (success.data.state && success.data.state.msg);
                layer.alert(str, {
                    icon: 2,
                    title: '通讯内容有误！'
                });
                return null;
            }
        },
        //http级报错
        error: function (err) {
            layer.alert('错误：status ' + err.status + ' ' + err.statusText, {
                icon: 2,
                title: '建立通讯失败！'
            });
            return null;
        }
    };

});

backman.factory('_httpPost', function ($http, _tools, _responePreHandler, _setting) {

    'use strict';

    return function (url, postData, config) {
        if (!config || !config.globAjaxParams) {
            angular.extend(postData, _setting.globAjaxParams);
        }
        postData = _tools.transKeyName('underline', postData);
        return $http({
            method: 'POST',
            url: url,
            data: postData
        }).then(function (success) {
                return _responePreHandler.success(success, config);
            }, function (err) {
                return _responePreHandler.error(err);
            }
        );
    };

});

backman.factory('_httpGet', function ($http, _tools, _responePreHandler, _setting) {

    'use strict';

    return function (url, getData, config) {
        if (!config || !config.globAjaxParams) {
            angular.extend(getData, _setting.globAjaxParams);
        }
        getData = _tools.transKeyName('underline', getData);
        return $http({
            method: 'GET',
            url: url,
            params: getData
        }).then(function (success) {
            return _responePreHandler.success(success, config);
        }, function (err) {
            return _responePreHandler.error(err);
        });
    };

});