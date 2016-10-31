ysf.directive('xfbExampleDirective',  function($timeout){
    // Runs during compile
    return {
        scope: {lefttime:'='},
        restrict: 'A',
        link: function($scope, iElm, iAttrs, controller) {
        }
    };
});