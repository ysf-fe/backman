app.register.controller('demoList', function ($scope, _httpPost) {

    'use strict';

    $scope.act = {};

    $scope.type = 'YYYY-MM-DD';

    setTimeout(function () {
        $scope.selectDate = '2016-10-11 12:35:12';
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }, 1000);

});