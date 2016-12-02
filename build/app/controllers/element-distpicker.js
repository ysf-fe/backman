app.register.controller('elementDistpicker', function ($scope, $timeout, _chinaAddress) {

    'use strict';
    // 省市区三级联动
    $scope.selectedPlace = {
        provinceCode: '', //省编号
        cityCode: '', //市编号
        blockCode: '', //区/县编号
        provinceName: '', //省名
        cityName: '', //市名
        blockName: '', //区/县名
    };
    $scope.region = {
        provinces: [],
        cities: [],
        blocks: []
    };

    // 省市区三级联动
    $scope.distSelect = {
        provinceCode: '', //省编号
        cityCode: '', //市编号
        blockCode: '', //区/县编号
        provinceName: '', //省名
        cityName: '', //市名
        blockName: '', //区/县名
    };
    $scope.distRegion = {
        provinces: [],
        cities: [],
        blocks: []
    };


    /**
     * 回填数据
     * @param  {Object} data    eg: {provinceCode: '440000',cityCode:'440100',districtCode:'440106'} 对应是广东省广州市天河区code id
     *
     */
     function setProvindeCityDistrict(data) { // 用于设置省市区
        if (parseInt(data.provinceCode, 10) > 0) {
            $scope.selectedPlace.provinceCode = data.provinceCode;
            $timeout(function() {
                if (parseInt(data.cityCode, 10) > 0) {
                    $scope.selectedPlace.cityCode = data.cityCode;
                    $timeout(function() {
                        if (parseInt(data.districtCode, 10) > 0) {
                            $scope.selectedPlace.blockCode = data.districtCode;
                        }
                    }, 50);
                }

            }, 50);
        }
    }

    //回填demo
    $timeout(function() {
        setProvindeCityDistrict ({provinceCode: '440000',cityCode:'440100',districtCode:'440105'} );
    }, 500);


});
