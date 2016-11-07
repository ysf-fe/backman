backman.controller('backmanParent', function ($scope, _setting, _httpPost, _httpGet) {

    'use strict';

    //移动端导航栏显示隐藏
    $scope.sidebarOpen = false;

    var getNavData = function (cb, cberr) {
            var apiAddress = _setting.get('navListUrl');
            _httpGet(apiAddress, {})
                .then(function (data) {
                    if ($.type(cb) === 'function') {
                        for (var i = 0, item; item = data[i]; i++) {
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
            //第一层排序
            data = data.sort(sortNavigation);
            for (var i = 0, item; item = data[i]; i++) {
                if (item.children && item.children.length) {
                    //第二层排序
                    item.children.sort(sortNavigation);
                    //打开页面时高亮
                    for (var j = 0, child; child = item.children[j]; j++) {
                        if (child.hash == window.location.hash.split('#')[1]) {
                            item.actived = true;
                        }
                    }
                }
            }
            $scope.navData = data;
        },
        sortNavigation = function (item1, item2) {
            return item1.order > item2.order;
        };
    getNavData(renderNavigation);

    $scope.act = {
        //导航展栏位开折叠
        toggleItem: function (index) {
            for (var i = 0, item; item = $scope.navData[i]; i++) {
                if (index == -1) {
                    $scope.navData[i].actived = false;
                } else {
                    if (i == index) {
                        $scope.navData[i].actived = !$scope.navData[i].actived;
                    } else {
                        $scope.navData[i].actived = false;
                    }
                }
            }
        },
        //导航栏移动端显示隐藏
        toggleSidebar: function () {
            $scope.sidebarOpen = !$scope.sidebarOpen;
        }
    }

});