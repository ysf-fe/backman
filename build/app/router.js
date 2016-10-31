//路由配置模块
angular
    .module('app.router', [])
    .config(function ($stateProvider, $urlRouterProvider, _tools) {

        'use strict';

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            // 首页
            .state('ysf', {
                url: '/home',
                views: {
                    'content': {
                        templateUrl: './views/example.html'
                    }
                }
            })
        ;
    });