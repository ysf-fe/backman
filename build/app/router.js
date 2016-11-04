//路由配置模块
angular
    .module('app.router', [])
    .config(function ($stateProvider, $urlRouterProvider, _tools) {

        'use strict';

        $urlRouterProvider.otherwise('/home');

        //var a = _tools.transKeyName('camel',{key_name:1}); console.log(a);

        var assest = './app';
        $stateProvider
            // 首页
            .state('home', {
                url: '/home',
                views: {
                    'content': {
                        templateUrl: assest + '/views/blank.html'
                    }
                }
            })
            .state('demoBaseElm', {
                url: '/demoBaseElm',
                views: {
                    'content': {
                        templateUrl: assest + '/views/base.html'
                    }
                }
            })
            .state('demoBlank', {
                url: '/demoBlank',
                views: {
                    'content': {
                        templateUrl: assest + '/views/blank.html'
                    }
                }
            })
        ;
    });