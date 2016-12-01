// 指令: 处理多级联动下啦菜单
// disabled-select="1" 设置该属性将不能设置区域
backman.directive('bmDistpicker', function() {

    'use strict';

    return {
        restrict: 'A',
        scope: {
            region: '=region',// 与控制器的$scope.region绑定
            selectedPlace: '=selectedplace' // 与控制器的$scope.selectedPlace (双向)绑定
        },
        replace: true,
        transclude: false,
        template:   '<div class="distpicker">' +
                        '<div class="distpicker-content" >' +
                            '<select class="" ng-options="province.regionId as province.regionName for province in region.provinces" ng-model="selectedPlace.selectedprovince" placeholder="省份">' +
                                //'<option value="-1" >省份</option>' +
                                // '<option ng-repeat="province in region.provinces" value="{{province.regionId}}">{{province.regionName}}</option>' +
                            '</select>' +
                            '<select class="" ng-options="city.regionId as city.regionName for city in region.cities" ng-model="selectedPlace.selectedcity" placeholder="市">' +
                                //'<option value="-1">城市</option>' +
                                // '<option ng-repeat="city in region.cities" value="{{city.regionId}}">{{city.regionName}}</option>' +
                           '</select>' +
                            '<select class="" ng-options="block.regionId as block.regionName for block in region.blocks" ng-model="selectedPlace.selectedblock" placeholder="区">' +
                                // '<option value="-1">区</option>' +
                                // '<option ng-repeat="block in region.blocks" value="{{block.regionId}}">{{block.regionName}}</option>' +
                            '</select>' +
                        '</div>' +
                    '</div>',
        link: function(scope, iElement, iAttrs) {
            if(parseInt(iAttrs.disabledSelect,10) == 1){
                iElement.find('.form_select_div>select').attr('disabled','disabled');
            }
        },
        controller: function($scope, _chinaAddress){
            // 获取一次菜单
            _chinaAddress.getTree().then(function (data) {
                var noselected = {
                    id: -1,
                    parentId: '-1',
                    regionId: '-1',
                    regionName: '省份',
                    children: []
                };
                data.unshift(noselected);
                $scope.region.provinces = data;
                //$scope.selectedPlace.selectedprovince = '-1';
            });

            $scope.$watch('selectedPlace.selectedprovince', function(newVal, oldVal, scope) {

                // 如果值改变
                if(!!newVal) {

                    // 设置显示的值 城市与区域

                    _chinaAddress.getCities($scope.selectedPlace.selectedprovince).then(function(data){
                        var noselected = {
                            id: -1,
                            parentId: '-1',
                            regionId: '-1',
                            regionName: '市',
                            children: []
                        };
                        data.unshift(noselected);
                        $scope.region.cities = data;
                    });
                    $scope.selectedPlace.selectedprovince = newVal;
                    $scope.selectedPlace.selectedcity = '-1';
                }
            });

            // 市一级的变化
            $scope.$watch('selectedPlace.selectedcity', function(newVal, oldVal, scope){

                // 如果值改变
                if(!!newVal) {

                    // 设置显示的值 区域
                    _chinaAddress.getDistricts(
                        $scope.selectedPlace.selectedprovince,
                        $scope.selectedPlace.selectedcity
                    ).then(function(data){
                        var noselected = {
                            id: -1,
                            parentId: '-1',
                            regionId: '-1',
                            regionName: '区',
                            children: []
                        };
                        data.unshift(noselected);
                        $scope.selectedPlace.selectedcity = newVal;
                        $scope.region.blocks = data;
                    });
                    $scope.selectedPlace.selectedblock = '-1';
                }
            });

            // 市一级的变化
            $scope.$watch('selectedPlace.selectedblock', function(newVal, oldVal, scope){
                if(newVal !== oldVal) {
                    $scope.selectedPlace.selectedblock = newVal;
                }
            });

        }

    };
});
