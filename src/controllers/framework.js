backman.controller('backmanFramework', function ($scope, _setting, _httpGet) {

    'use strict';

    //移动端导航栏显示隐藏
    $scope.sidebarOpen = false;

    $scope.act = {
        //导航栏移动端显示隐藏
        toggleSidebar: function () {
            $scope.sidebarOpen = !$scope.sidebarOpen;
        }
    };

    _httpGet(_setting.get('userInforUrl'),{});

});