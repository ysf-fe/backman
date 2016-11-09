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