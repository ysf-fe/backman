ysf.directive('xfbExampleDirective',  function($timeout){
    // Runs during compile
    return {
        scope: {lefttime:'='},
        restrict: 'A',
        link: function($scope, iElm, iAttrs, controller) {
            var countTime = function(time) {
                var result = {
                    day:'',
                    hour:'',
                    minute:'',
                    second:''
                };
                if(time) {
                    result.second = time % 60;
                    result.minute = parseInt(time / 60, 10) % 60;
                    result.hour = parseInt(time / 60 / 60, 10) % 24;
                    result.day = parseInt(time / 60 / 60 / 24, 10);
                }
                return result;
            };

            $scope.$watch('lefttime', function(newVal, oldVal) {
                var judgeLargerThan10 = function(num){
                    if(parseInt(num, 10) < 10) {
                        num = '0' + num;
                    }
                    return num;
                };
                var setText = function(){

                    var time = parseInt(iElm.attr('data-left'), 10);

                    var result = '',
                        timeObj = null;
                    if(time) {
                        timeObj = countTime(time);
                        result += timeObj.day + '天' +
                            judgeLargerThan10(timeObj.hour) + ':' +
                            judgeLargerThan10(timeObj.minute) + ':' +
                            judgeLargerThan10(timeObj.second);
                    }else {
                        result = '0天';
                    }

                    iElm.text(result);

                    if(time > 0) {
                        $timeout(function(){
                            var left = parseInt(iElm.attr('data-left'), 10) - 1;
                            iElm.attr('data-left',left);
                            setText();
                        },1000);
                    }                   
                };

                if(newVal >= 0) {
                    iElm.attr('data-left',newVal);
                    setText();              
                }
            });
        }
    };
});