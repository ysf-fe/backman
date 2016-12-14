/*
 * author:tank
 * date:2016-12-12
 * desc:component select2
 */
backman.directive('bmSelect2', function($timeout){
    'use strict';
    
    return {
        scope: {
            bindList:'=', // 列表中的数据集
            bindSearch:'@', // 搜索哪个字段
            bindData:'=' // 统一返回数组
        },
        restrict: 'A',
        template: '<div class="bm-select2-box" ng-click="$event.stopPropagation();">' +                       
                        '<input type="text" class="bm-select2-input" ng-model="name">' +
                        '<ul class="bm-select2-list list-unstyled">' +
                            '<li ng-if="isShowCheckbox">' +
                                '<label style="margin: 0;">'+
                                    '<input type="checkbox" ng-checked="checkedAll" ng-click="act.doCheckAll(filtoutData);"/>' +
                                    '<span>全选</span>' +
                                '</label>' +
                            '</li>' +
                            '<li ng-repeat="item in filtoutData">' +
                                '<label style="margin: 0;" ng-if="!isShowCheckbox" ng-click="act.doClick(item);" ng-bind="item[bindSearch]"></label>' +
                                '<label style="margin: 0;" ng-if="isShowCheckbox">'+
                                    '<input type="checkbox" ng-checked="item.checked" ng-click="act.doClick(item);"/>' +
                                    '<span ng-bind="item[bindSearch]"></span>' +
                                '</label>' +
                            '</li>' +
                        '</ul> ' +               
                    '</div>',
        replace: true,
        link: function($scope, iElm, iAttrs, ctrl) {
            var doc = $(document),
                input = iElm.children('input'),
                ul = iElm.children('ul');

            // 控件行为
            input.click(function(e) {
                var hideUl = function() {
                    ul.hide();
                    doc.off('click', hideUl);
                };
                var isUlShow = ul.css('display') != 'none';
                if(isUlShow) {
                    ul.hide();
                    doc.off('click', hideUl);
                }else {
                    ul.show();
                    doc.on('click', hideUl);
                }
            });

            // 筛选用函数
            var filterFn = function(key, data) {
                var searchin = $scope.bindSearch;
                var result = [];
                if(key && data && data.length) {
                    angular.forEach(data, function(v, k, obj) {
                        if(v[searchin].indexOf(key) >= 0) {
                            result.push(v);
                        }
                    });
                }
                return result;
            };

            // 模板中用到的模型
            $scope.bindListCopy = []; // 拷贝出来的数据源
            $scope.filtoutData = []; // 过滤出来的数据(展示用)
            $scope.name = ''; // input输入框的模型
            $scope.isShowCheckbox = parseInt(iAttrs.isShowCheckbox, 10) === 1 ? true : false  ; // 是否显示复选框
            $scope.checkedAll = false; // 是否全选
            $scope.bindData = []; // 返回控制器的结果集

            // arr就是结果集合$scope.bindData
            var toggleSelectedItem = function(arr, it) {
                var idx = arr.indexOf(it);
                if(it.checked) {
                    if(idx < 0) {
                        arr.push(it);
                    }
                } else {
                    if(idx >= 0) {
                        arr.splice(idx, 1);
                    }
                }
                return arr;
            };

            $scope.act = {
                doClick:function(item) {
                    if($scope.isShowCheckbox) { // 多选的情况
                        item.checked = !item.checked;
                        $scope.bindData = toggleSelectedItem($scope.bindData, item);
                    } else { // 单选的情况
                        $scope.name = item[$scope.bindSearch];
                        $scope.bindData = [item];

                        // 写这里貌似不太好
                        ul.hide();
                    }
                },
                doCheckAll:function(allItems) {
                    if($scope.isShowCheckbox) { // 多选的情况
                        $scope.checkedAll = !$scope.checkedAll;
                        angular.forEach(allItems, function(v, k) {
                            v.checked = $scope.checkedAll;
                            toggleSelectedItem($scope.bindData, v);        
                        });
                    }
                }
            };

            // 如果绑定的数据源改变了，则重新初始化一些值
            $scope.$watch('bindList', function(newVal, oldVal) {
                var dataPreHandler = function(dt) {
                    if(dt && dt.length) {
                        angular.forEach(dt, function(v, k) {
                            v.checked = false;
                        });
                    }
                    return dt;
                };
                if(newVal) {
                    $scope.bindListCopy = dataPreHandler(angular.copy($scope.bindList));
                    $scope.filtoutData = [].concat($scope.bindListCopy);
                    $scope.name = '';
                    $scope.bindData = [];
                    if ($scope.isShowCheckbox) {
                        $scope.checkedAll = false;
                    }
                }
            });

            // 函数节流，减少筛选的次数
            var timeObj = null;
            $scope.$watch('name', function(newVal, oldVal) {
                if(timeObj){
                    $timeout.cancel(timeObj);
                }
                timeObj = $timeout(function(){
                    var search = $.trim(newVal)?$.trim(newVal):'';
                    if(search) {
                        $scope.filtoutData = filterFn(search ,$scope.bindListCopy);                    
                    }else {
                        $scope.filtoutData = [].concat($scope.bindListCopy);
                    }
                    $scope.checkedAll = false;

                    timeObj = null;
                }, 500);
            });
        }
    };
});