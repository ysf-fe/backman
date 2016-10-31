// 服务：请求预处理
backman.factory('_responePreHandler', function (_tools) {

    'use strict';

    return {
        //正常通行
        success: function (success, config) {
            if (success.data.state.code == 20001 && config && config.noVerify == true) {
                return;
            }
            if (success.data.state.code == 20001) {
                window.location.href = '/usercenter/login-show';
                return;
            }
            //code级报错
            if (success.data.state.code != 10200 && success.data.state.code != 10205) {
                success.data.data = null;
                //throw new Error('Server Error!\n\r   success + '\n\r   Message: ' + data.state.msg);
                alert(success.msg || (success.data && success.data.state && success.data.state.msg));
                return null;
            }
            //正常code
            if (success.data.state.code == 10205) {
                return {};
            } else {
                var data = success.data.data ? _tools.transKeyName('camel', success.data.data) : {};
                data.__state = success.data.state;
                return data;
            }
        },
        //http级报错
        error: function (err) {
            return err;
        }
    };

});

backman.factory('_httpPost', function ($http, _tools, _responePreHandler, _setting) {

    'use strict';

    return function (url, postData, config) {
        if (!config || !config.ajaxParams) {
            angular.extend(postData, _setting.ajaxParams);
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
        if (!config || !config.ajaxParams) {
            angular.extend(getData, _setting.ajaxParams);
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