'use strict';
var ysf = angular.module('ysf', ['ui.router', 'ysf.router'])

.config(function ($httpProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
    // 修正angularPost数据payload模式为formData模式
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.headers.get = { 'X-Requested-With' : 'XMLHttpRequest' };
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

    ysf.register = {    //异步controller注册器
        controller: $controllerProvider.register,
        directive: $compileProvider.directive,
        filter: $filterProvider.register,
        factory: $provide.factory,
        service: $provide.service
    };
})
.run(function($rootScope, $state, $stateParams){
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
})
.factory('_responePreHandler',function(_tools){ // 服务： 请求预处理服务
    return {
        //正常通行
        success: function(success, config) {
            if(success.data.state.code == 20001 && config && config.noVerify == true){
                return;
            }else if(success.data.state.code == 20001){
                window.location.href = '/usercenter/login-show';
                return;
            }
            //code级报错
            else if (success.data.state.code != 10200 && success.data.state.code != 10205) {
                success.data.data = null;
                //throw new Error('Server Error!\n\r   success + '\n\r   Message: ' + data.state.msg);
                alert(success.msg || (success.data&&success.data.state&&success.data.state.msg));
                return null;
            }
            //正常code
            else {
                if (success.data.state.code == 10205) {
                    return {};
                } else {
                    var data = success.data.data ? _tools.transKeyName('camel', success.data.data) : {};
                    data.__state = success.data.state;
                    return data;
                }
            }
        },
        //http级报错
        error: function(err) {
            return err;
        }
    };
})
.factory('_httpPost', function ($http, _tools, _responePreHandler, _setting) {
    return function (url, postData, config) {
        if(!config || !config.ajaxParams){
            angular.extend(postData, _setting.ajaxParams);
        }
        postData = _tools.transKeyName('underline', postData);
        return $http({
                method: 'POST',
                url: url,
                data: postData
            })
            .then(function (success) {
                return _responePreHandler.success(success, config);
            }, function (err) {
                return _responePreHandler.error(err);
            }
        );
    };
})
.factory('_httpGet', function ($http, _tools, _responePreHandler, _setting) {
    return function (url, getData, config) {
        if(!config || !config.ajaxParams){
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
})
.factory('_setting', function ($rootScope) {
    var href = location.href,
        hostname = location.hostname,
        idx = href.indexOf(hostname) + hostname.length,
        base = href.substring(0, idx);
    return {
        base: base,
        path: '/usercenter'  
        // ,ajaxParams: {"authClient": "app", "apiVersion": "v1"}
    };
})
.factory('_tools', function () {
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
    return {
        getUrlParam: getUrlParam,
        transKeyName: transKeyName
    };
})
.factory('_validate', function(){
    var vd = {
        isMobile:function(val){
            var rgx = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;
            return rgx.test($.trim(val));
        },
        isRequired:function(val){
                return $.trim(val)?true : false;
        },
        isMatchLength:function(val,len){
            return (($.trim(val)).length == len);
        },
        isLengthInRange:function(val,arr){
            var len = ($.trim(val)).length;
            return (len >= arr[0] && len <= arr[1]);
        },
        isInRange:function(val,arr){
            return (val>= arr[0] && val<=arr[1]);
        },
        isIdCard:function(val){
            var rgx = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;
            return rgx.test($.trim(val));
        },
        isTheSame:function(val1,val2){
            return (val1==val2);
        },
        // 验证密码
        isCorrectPassword:function(val){
            // 只包含数字或字母
            var rgx = /^(?!\d+$)(?![a-z]+$).+$/i;
            return rgx.test($.trim(val));
        }
    };
    return vd;
});

/**
 * overwrite: window.alert
 * 复写window的alert方法
 * 不是一个好的做法囧.....
 */
;(function(window,undefined){
    window.alert = function(title){
        var docfrm = document.createElement('div');
        docfrm.innerHTML = '<div style="position:fixed;z-index:999;width:100%;height:100%;left:0;top:0;background:rgba(0,0,0,.4);">' +
            '<div style="position:absolute;width:300px;left:50%;margin-left:-150px;top:38%;background-color:#fff;border-radius:.4rem;">' +
                '<p style="padding:1.3rem 2rem 1.7rem;font-size:1.03rem;color:#333;text-align:center;">'+ title +'</p>' +
                '<a href="javascript:;" style="display:block;height:3rem;line-height:3rem;text-align:center;font-size:1.03rem;color:#1a8fc5;border-top:1px solid #e5e5e5;">确定</a>' +
            '</div>' +
        '</div>';
        var alertBox = docfrm.firstChild,
            closeBtn = alertBox.getElementsByTagName('a')[0];

        closeBtn.addEventListener('click',function(e){
            document.body.removeChild(alertBox);
        },false);

        document.body.appendChild(alertBox);
    };
})(window);