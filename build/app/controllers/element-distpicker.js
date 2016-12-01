app.register.controller('elementDistpicker', function ($scope, $timeout, _chinaAddress) {

    'use strict';
    // 省市区三级联动
    $scope.selectedPlace = {
        selectedprovince:'-1',
        selectedcity:'-1',
        selectedblock:'-1',
        // selectedprovinceName:'',
        // selectedcityName:'',
        // selectedblockName:''
    };
    $scope.region = {
        provinces: [],
        cities: [],
        blocks: []
    };

    /**
     * 获取对应的区域id的数据
     * @param  {String} type     'provinces','cities','blocks'
     * @param  {String} regionId 区域id
     * @return {Object}          区域id对应的对象
     */
    function getRegionIdData(type, regionId) {
        var result = '';
        if ($scope.region && $scope.region[type]) {
            for (var i = 0, len = $scope.region[type].length; i < len; i++) {
                if ($scope.region[type][i].regionId == regionId) {
                    result = $scope.region[type][i].regionName;
                    break;
                }
            }
        }
        return result;
    }

    /**
     * 回填数据
     * @param  {Object} data    eg: {provinceCode: 440000,cityCode:440100,districtCode:440106} 对应是广东省广州市天河区code id
     *
     */
     function setProvindeCityDistrict(data) { // 用于设置省市区
        if (parseInt(data.provinceCode, 10) > 0) {
            $scope.selectedPlace.selectedprovince = data.provinceCode;
            $timeout(function() {
                if (parseInt(data.cityCode, 10) > 0) {
                    $scope.selectedPlace.selectedcity = data.cityCode;
                    $timeout(function() {
                        if (parseInt(data.districtCode, 10) > 0) {
                            $scope.selectedPlace.selectedblock = data.districtCode;
                        }
                    }, 50);
                }

            }, 50);
        }
    }


});
