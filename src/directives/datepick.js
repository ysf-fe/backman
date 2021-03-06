backman.directive('bmDatepick', function () {

    'use strict';

    return {
        scope: {
            bindDate: '='
        },
        restrict: 'A',
        link: function ($scope, iElm, iAttrs) {
            var format = iAttrs.dateFormat || 'YYYY-MM-DD hh:mm:ss'; //日期格式
            var timePick = /(hh|mm|ss)+/g.test(format); //是否开启时间选择
            var eid = iAttrs.id || 'datepick' + (Date.now() % 1e7) + parseInt(Math.random() * 1e3);
            iElm.attr('id', eid)
                .attr('placeholder', format)
                .addClass('laydate-icon')
                .on('click', function () {
                    var $this = $(this);
                    if (!$this.attr('readonly')) {
                        $this[0].dispatchEvent(new MouseEvent('dblclick', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        }))
                    }
                });
            $('#' + eid).one('dblclick', function () {
                var $this = $(this);
                setTimeout(function(){
                    $('#laydate_today').on('click', function () {
                        $scope.bindDate = $this.val();
                        if (!$scope.$$phase && !$scope.$root.$$phase) {
                            $scope.$apply();
                        }
                    });
                }, 0);
            });
            laydate({
                elem: '#' + eid,
                format: format,
                istime: timePick,
                event: 'dblclick',
                choose: function (dates) {
                    $scope.bindDate = dates;
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                }
            });
            //初次数据
            var initW = $scope.$watch('bindDate', function (newVal, oldVal) {
                if (newVal) {
                    initW();
                    iElm.val(newVal);
                }
            });
        }
    }
});