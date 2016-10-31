
angular.module('ysf.router', [])
.config(function($stateProvider, $urlRouterProvider){       //路由配置
    
    var loadjs = function (js) {
        return function ($q, $rootScope) {
            var deferred = $q.defer();
            $script(js, function () {
                $rootScope.$apply(function () {
                    deferred.resolve();
                });
            });
            return deferred.promise;
        };
    };
    var _setting = {
        base:location.origin,
        assets:''
    };

    $urlRouterProvider.otherwise('/home');

    $stateProvider
    // 首页
    .state('ysf',{
        url: '/home',
        views: {            
            'content': {
                templateUrl:'/views/example.html'
            }
        }
    })
    ;
});