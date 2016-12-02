// 指令: 处理多级联动下拉菜单
// disabled-select="1" 设置该属性将不能设置区域
backman.directive('bmDistpicker', function() {

    'use strict';

    return {
        restrict: 'A',
        scope: {
            region: '=region', // 与控制器的$scope.region绑定
            selectedPlace: '=selectedplace' // 与控制器的$scope.selectedPlace (双向)绑定
        },
        replace: true,
        transclude: false,
        template: '<div class="distpicker">' +
                        '<div class="distpicker-content" >' +
                            '<select class="" ng-options="province.regionId as province.regionName for province in region.provinces" ng-model="selectedPlace.provinceCode">' +
                                '<option value="" disabled>请选择省份</option>' +
                            '</select>' +
                            '<select class="" ng-options="city.regionId as city.regionName for city in region.cities" ng-model="selectedPlace.cityCode">' +
                                '<option value="" disabled>请选择市</option>' +
                            '</select>' +
                            '<select class="" ng-options="block.regionId as block.regionName for block in region.blocks" ng-model="selectedPlace.blockCode">' +
                                '<option value="" disabled>请选择区/县</option>' +
                            '</select>' +
                        '</div>' +
                   '</div>',
        link: function(scope, iElement, iAttrs) {
            if (parseInt(iAttrs.disabledSelect, 10) == 1) {
                iElement.find('.distpicker-content>select').attr('disabled', 'disabled');
            }
        },
        controller: function($scope, _chinaAddress) {
            // 获取一次菜单
            _chinaAddress.getTree().then(function(data) {
                $scope.region.provinces = data;
            });

            // 省的变化
            $scope.$watch('selectedPlace.provinceCode', function(newVal, oldVal, scope) {

                // 如果值改变
                if (!!newVal) {

                    // 设置显示的值 城市与区域
                    _chinaAddress.getCities($scope.selectedPlace.provinceCode).then(function(data) {
                        $scope.region.cities = data;
                        $scope.region.blocks = [];
                    });

                    $scope.selectedPlace = {
                        provinceCode: newVal, //省编号
                        cityCode: '', //市编号
                        blockCode: '', //区/县编号
                        provinceName: _chinaAddress.getRegionIdData($scope.region.provinces,newVal), //省名
                        cityName: '', //市名
                        blockName: '', //区/县名
                    };

                }else{
                    $scope.region.cities = [];
                    $scope.region.blocks = [];
                }
            });

            // 市的变化
            $scope.$watch('selectedPlace.cityCode', function(newVal, oldVal, scope) {

                // 如果值改变
                if (!!newVal) {

                    // 设置显示的值 区域
                    _chinaAddress.getDistricts(
                        $scope.selectedPlace.provinceCode,
                        $scope.selectedPlace.cityCode
                    ).then(function(data) {
                        $scope.selectedPlace.cityCode = newVal;
                        $scope.region.blocks = data;
                    });
                    // $scope.selectedPlace.blockCode = '';
                    scope.selectedPlace = {
                        provinceCode: $scope.selectedPlace.provinceCode, //省编号
                        cityCode: newVal, //市编号
                        blockCode: '', //区/县编号
                        provinceName: $scope.selectedPlace.provinceName, //省名
                        cityName:  _chinaAddress.getRegionIdData($scope.region.cities,newVal), //市名
                        blockName: '', //区/县名
                    };
                }else{
                    $scope.region.blocks = [];
                }
            });

            // 区的变化
            $scope.$watch('selectedPlace.blockCode', function(newVal, oldVal, scope) {
                if (newVal !== oldVal) {
                    $scope.selectedPlace.blockCode = newVal;
                    $scope.selectedPlace = {
                        provinceCode: $scope.selectedPlace.provinceCode, //省编号
                        cityCode: $scope.selectedPlace.cityCode, //市编号
                        blockCode: newVal, //区/县编号
                        provinceName: $scope.selectedPlace.provinceName, //省名
                        cityName:  $scope.selectedPlace.cityName, //市名
                        blockName: _chinaAddress.getRegionIdData($scope.region.blocks,newVal), //区/县名
                    };
                }
            });

        }

    };
});
