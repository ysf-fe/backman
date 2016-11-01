

var backman = angular.module('backman', ['ui.router']);

backman.config(function ($httpProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {

    'use strict';

    // 修正angularPost数据payload模式为formData模式
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.headers.get = {'X-Requested-With': 'XMLHttpRequest'};

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;
            for (name in obj) {
                if (obj.hasOwnProperty(name)) {
                    value = obj[name];
                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value instanceof Object) {
                        for (subName in value) {
                            if (value.hasOwnProperty(subName)) {
                                subValue = value[subName];
                                /* fullSubName = name + '[' + subName + ']'; //for node */
                                fullSubName = name + '.' + subName;
                                innerObj = {};
                                innerObj[fullSubName] = subValue;
                                query += param(innerObj) + '&';
                            }
                        }
                    } else if (value !== undefined && value !== null) {
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                    }
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        };
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];

    //增加angular自动过滤特殊url白名单
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|sms|javascript):/);

    //异步controller注册器
    app.register = {
        controller: $controllerProvider.register,
        directive: $compileProvider.directive,
        filter: $filterProvider.register,
        factory: $provide.factory,
        service: $provide.service
    };

});

backman.run(function ($rootScope, $state, $stateParams) {

    'use strict';

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

});



