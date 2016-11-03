backman.controller('backmanParent', function ($scope, _setting, _httpPost, _httpGet) {

    'use strict';

    var getNavData = function(cb, cberr) {
        var apiAddress = _setting.get('navListUrl');
        _httpGet(apiAddress, {})
            .then(function(data) {
                if(typeof cb === 'function')cb(data);
            },function(data) {
                if(typeof cberr === 'function')cberr(data);
            });
    },
    getNavDataHandler = function(data) {
        data = data.sort(sortHandler);
        $.each(data, function(idx, obj) {
            if(obj.children && obj.children.length) {
                obj.children.sort(sortHandler);
            }
        });
        $scope.navData = data;
    },
    sortHandler = function(item1, item2){
        return item1.order > item2.order;
    };
    getNavData(getNavDataHandler);

});