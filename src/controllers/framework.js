backman.controller('backmanFramework', function ($scope, _setting) {

    'use strict';

    //左上角管理员名称
    $scope.adminName = window.localStorage['adminName@' + window.location.href.split('#')[0]] || 'anonymous';

    //移动端导航栏显示隐藏
    $scope.sidebarOpen = false;

    $scope.act = {
        //导航栏移动端显示隐藏
        toggleSidebar: function () {
            $scope.sidebarOpen = !$scope.sidebarOpen;
        }
    };

});