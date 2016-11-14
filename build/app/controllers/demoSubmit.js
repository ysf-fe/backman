app.register.controller('demoSubmit', function ($scope, _httpPost) {

    'use strict';

    $scope.act = {};

    setTimeout(function () {
        $scope.richContent = 123456;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }, 1000)

});