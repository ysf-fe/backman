
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