backman.controller('backmanParent', function ($scope, _setting, _httpPost, _httpGet) {

    'use strict';

    var getNavData = function (cb, cberr) {
            var apiAddress = _setting.get('navListUrl');
            _httpGet(apiAddress, {})
                .then(function (data) {
                    if ($.type(cb)  === 'function') {
                        for (var i = 0,item; item = data[i]; i++) {
                            if ($.type(item.children) != 'array') {
                                item.children = [];
                            }
                        }
                        cb(data);
                    }
                }, function (data) {
                    if ($.type(cberr) === 'function') {
                        cberr(data);
                    }
                });
        },
        renderNavigation = function (data) {
            data = data.sort(sortHandler);
            $.each(data, function (idx, obj) {
                if (obj.children && obj.children.length) {
                    obj.children.sort(sortHandler);
                }
            });
            $scope.navData = data;
        },
        sortHandler = function (item1, item2) {
            return item1.order > item2.order;
        };
    getNavData(renderNavigation);

});