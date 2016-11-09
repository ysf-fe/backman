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
    backman.register = {
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
backman.factory('_setting', function ($rootScope) {

    'use strict';

    var _data = {
        base: location.protocol + '//' + location.host,
        path: '',
        ajaxParams: null,
        navListUrl: ''
    };
    _data.navListUrl = _data.base + '/_data/navList.json';

    return {
        get: function (key) {
            return _data[key];
        },
        set: function (key, val) {
            _data[key] = val;
        }
    };

});

backman.constant('_tools', (function () {

    'use strict';

    //获取url参数
    var urlData = null;
    var getUrlParam = function (name) {
        if (!urlData) {
            var url = window.location.href;
            urlData = {};
            var arr = url.split("?");
            if (arr.length > 1) {
                arr = arr[1].split("&");
                for (var i = 0, l = arr.length; i < l; i++) {
                    var a = arr[i].split("=");
                    urlData[a[0]] = a[1];
                }
                urlData = transKeyName('camel', urlData);
            }
        }
        return urlData[name];
    };

    //峰驼与下划线命名模式转换
    var transKeyName = function (type, json) {
        //下划线字符串转小峰驼
        var toCamel = function (str) {
            var str2 = '';
            if (str.indexOf('_') < 0) {
                str2 = str;
            } else {
                var words = str.split('_');
                for (var i = 1; i < words.length; i++) {
                    words[i] = words[i].substr(0, 1).toUpperCase() + words[i].substr(1);
                }
                str2 = words.join('');
            }
            return str2;
        };
        //小峰驼字符串转下划线
        var toUnderline = function (str) {
            var str2 = '';
            if ((/[A-Z]/).test(str)) {
                str2 = str.replace(/([A-Z])/g, function ($1) {
                    return '_' + $1.toLowerCase();
                });
            } else {
                str2 = str;
            }
            return str2;
        };
        var transform = function (json, json2) {
            for (var p in json) {
                if (json.hasOwnProperty(p)) {
                    var key;
                    if (typeof p == 'string') {
                        if (type == 'camel') {
                            key = toCamel(p);
                        } else if (type == 'underline') {
                            key = toUnderline(p);
                        }
                    } else {
                        key = p;
                    }
                    if (json[p] instanceof Object) {
                        json2[key] = transform(json[p], typeof json[p].length == 'undefined' ? {} : []);
                    } else {
                        json2[key] = json[p];
                    }
                }
            }
            return json2;
        };
        return transform(json, typeof json.length == 'undefined' ? {} : []);
    };

    var loadJs = function (jsList) {
        return function ($q, $rootScope) {
            var deferred = $q.defer();
            $script(jsList, function () {
                $rootScope.$apply(function () {
                    deferred.resolve();
                });
            });
            return deferred.promise;
        };
    };

    return {
        getUrlParam: getUrlParam,
        transKeyName: transKeyName,
        loadJs: loadJs
    };

})());
backman.factory('_validate', function () {

    'use strict';

    return {
        isMobile: function (val) {
            var rgx = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;
            return rgx.test($.trim(val));
        },
        isRequired: function (val) {
            return $.trim(val) ? true : false;
        },
        isMatchLength: function (val, len) {
            return (($.trim(val)).length == len);
        },
        isLengthInRange: function (val, arr) {
            var len = ($.trim(val)).length;
            return (len >= arr[0] && len <= arr[1]);
        },
        isInRange: function (val, arr) {
            return (val >= arr[0] && val <= arr[1]);
        },
        isIdCard: function (val) {
            var rgx = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;
            return rgx.test($.trim(val));
        },
        isTheSame: function (val1, val2) {
            return (val1 == val2);
        },
        // 验证密码
        isCorrectPassword: function (val) {
            // 只包含数字或字母
            var rgx = /^(?!\d+$)(?![a-z]+$).+$/i;
            return rgx.test($.trim(val));
        }
    };
});
backman.controller('backmanFramework', function ($scope, _setting) {

    'use strict';

    //移动端导航栏显示隐藏
    $scope.sidebarOpen = false;

    $scope.act = {
        //导航栏移动端显示隐藏
        toggleSidebar: function () {
            $scope.sidebarOpen = !$scope.sidebarOpen;
        }
    }

});
backman.controller('backmanNavigation', function ($scope, _setting, _httpPost, _httpGet) {

    'use strict';

    var getNavData = function (cb, cberr) {
            var apiAddress = _setting.get('navListUrl');
            _httpGet(apiAddress, {})
                .then(function (data) {
                    if ($.type(cb) === 'function') {
                        var navList = [];
                        for (var i = 0, item1; item1 = data[i]; i++) {
                            //第一级不允许使用连接
                            if (item1.state || item1.hash) {
                                continue;
                            }
                            //检查children属性
                            if ($.type(item1.children) != 'array') {
                                item1.children = [];
                            } else {
                                for (var j = 0, item2; item2 = item1[j]; j++) {
                                    if ($.type(item2.children) != 'array') {
                                        item2.children = [];
                                    }
                                }
                            }
                            navList.push(item1);
                        }
                        cb(navList);
                    }
                }, function (data) {
                    if ($.type(cberr) === 'function') {
                        cberr(data);
                    }
                });
        },
        renderNavigation = function (data) {
            //第一层排序
            data = data.sort(sortNavigation);
            for (var i = 0, item; item = data[i]; i++) {
                if (item.children && item.children.length) {
                    //第二层排序
                    item.children.sort(sortNavigation);
                }
            }
            $scope.navData = data;
        },
        sortNavigation = function (item1, item2) {
            return item1.order > item2.order;
        };
    getNavData(renderNavigation);

    $scope.act = {
    }

});
backman.directive('bmSidebar', function () {
    return {
        scope: false,
        restrict: 'A',
        link: function ($scope, iElm, iAttrs) {
            iElm.on('click', '.treeview-title', function () {
                var $this = $(this);
                if ($this.parent().hasClass('active')) {
                    $this.parent().removeClass('active').end()
                        .next('ul.treeview-menu').slideUp('fast');
                } else {
                    $this.parent().addClass('active').end()
                        .next('ul.treeview-menu').slideDown('fast');
                }
            });
            var navInitHandler = $scope.$watch('navData', function (newValue, oldValue) {
                if (newValue) {
                    navInitHandler();  //仅运行一次
                    var hash = window.location.hash;
                    setTimeout(function () {
                        iElm.find('.treeview-link').each(function () {
                            var $this = $(this);
                            if ($this.attr('href') == hash) {
                                var $parent1 = $this.parent().parent().show().parent().addClass('active');
                                if ($parent1.hasClass('treeview')) {
                                    var $parent2 = $parent1.parent().show().parent().addClass('active');
                                    if ($parent2.hasClass('treeview')) {
                                        $parent2.addClass('active');
                                    }
                                }
                            }
                        });
                    }, 0);
                }
            });
        }
    }
});