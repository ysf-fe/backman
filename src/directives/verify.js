backman.directive('form', function () {

    'use strict';

    return {
        scope: false,
        restrict: 'E',
        priority: 10,
        link: function ($scope, iElm, iAttrs) {
            var fName = '';
            if (iElm.attr('id')) {
                fName = iElm.attr('id');
            } else {
                fName = 'form' + (Date.now() % 1e7) + parseInt(Math.random() * 1e3);
                iElm.attr('id', fName);
            }
            if (!$scope.$forms) {
                $scope.$forms = {};
            }
            $scope.$forms[fName] = {};
        }
    }
});

backman.directive('bmVerify', function () {

    'use strict';

    return {
        scope: {
            bindVerify: '='
        },
        restrict: 'A',
        link: function ($scope, iElm, iAttrs) {
            if (!iAttrs.bindVerify) {
                return;
            }
            if (!iAttrs.verifyItem || iAttrs.verifyItem == '{}') {
                return;
            }
            var _validations = null;
            if (iAttrs.verifyItem == 'require') {
                _validations = {
                    require: true
                };
            } else {
                _validations = JSON.parse(iAttrs.verifyItem);
            }
            var _messages = JSON.parse(iAttrs.verifyMsg || '{}');
            var _dirtyState = false;
            var $curForm = iElm.closest('form');
            var fName = ($curForm.length > 0) ? $curForm.attr('id') : '';
            //变化
            $scope.$watch('bindVerify', function (newVal, oldVal) {
                //脏检查
                if (!_dirtyState && newVal) {
                    _dirtyState = true;
                }
            });
        }
    }

});

backman.directive('bmVerifyControl', function ($timeout) {

    'use strict';

    return {
        scope: false,
        restrict: 'A',
        link: function ($scope, iElm, iAttrs) {
            //等待其他指令完成
            $timeout(function () {
                var fName = '';
                if (iAttrs.bmVerifyControl != '') {
                    fName = iAttrs.bmVerifyControl;
                } else {
                    fName = iElm.closest('form').attr('id');
                }
                $scope.$watch('$forms.' + fName, function (newVal, oldVal) {
                });
            }, 10);
        }
    }

});