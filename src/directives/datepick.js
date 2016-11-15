backman.directive('bmDatepick', function () {

    'use strict';

    return {
        scope: {
            dateBind: '='
        },
        restrict: 'A',
        link: function ($scope, iElm, iAttrs) {
            var format = iAttrs.dateFormat || 'YYYY-MM-DD hh:mm:ss'; //日期格式
            var timePick = /(hh|mm|ss)+/g.test(format); //是否开启时间选择
            var eid = 'datepick' + (Date.now() % 1e7) + parseInt(Math.random() * 1000);
            iElm.attr('id', eid)
                .attr('placeholder', format)
                .addClass('laydate-icon')
                .wrap('<div class="layinput"></div>')
                .on('click', function () {
                    var $this = $(this);
                    if (!$this.attr('readonly')) {
                        $this[0].dispatchEvent(new MouseEvent('dblclick', {bubbles: true, cancelable: true, view: window}))
                    }
                });
            laydate({
                elem: '#' + eid,
                format: format,
                istime: timePick,
                event: 'dblclick',
                choose: function (dates) {
                    $scope.dateBind = dates;
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                }
            });
            //初次数据
            var initW = $scope.$watch('dateBind', function (newVal, oldVal) {
                if (newVal) {
                    initW();
                    iElm.val(newVal);
                }
            });
        }
    }
});