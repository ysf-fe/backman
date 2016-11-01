//路由配置模块
angular
    .module('app.router', [])
    .config(function ($stateProvider, $urlRouterProvider) {

        'use strict';

        $urlRouterProvider.otherwise('/home');

        var assest = '/app';
        $stateProvider
            // 首页
            .state('home', {
                url: '/home',
                views: {
                    'content': {
                        templateUrl: assest + '/views/example.html'
                    }
                }
            })
        ;
    });