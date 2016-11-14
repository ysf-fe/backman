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
                        templateUrl: assest + '/views/home.html'
                    }
                }
            })
            .state('demoBaseElm', {
                url: '/demo/baseElm',
                views: {
                    'content': {
                        templateUrl: assest + '/views/base.html'
                    }
                }
            })
            .state('demoList', {
                url: '/demo/list',
                views: {
                    'content': {
                        templateUrl: assest + '/views/list.html'
                    }
                }
            })
            .state('demoList.detail', {
                url: '/demo/detail/:id',
                views: {
                    'content': {
                        templateUrl: assest + '/views/.html'
                    }
                }
            })
            .state('demoSubmit', {
                url: '/demo/submit',
                views: {
                    'content': {
                        templateUrl: assest + '/views/submit.html'
                    }
                }
            })
            .state('demoBlank', {
                url: '/demo/blank',
                views: {
                    'content': {
                        templateUrl: assest + '/views/blank.html'
                    }
                }
            })
            .state('demoBlank1', {
                url: '/demoBlank1',
                views: {
                    'content': {
                        templateUrl: assest + '/views/blank.html'
                    }
                }
            })
            .state('demoBlank2', {
                url: '/demoBlank2',
                views: {
                    'content': {
                        templateUrl: assest + '/views/blank.html'
                    }
                }
            })
            .state('demoBlank3', {
                url: '/demoBlank3',
                views: {
                    'content': {
                        templateUrl: assest + '/views/blank.html'
                    }
                }
            })
            .state('demoBlank4', {
                url: '/demoBlank4',
                views: {
                    'content': {
                        templateUrl: assest + '/views/blank.html'
                    }
                }
            })
            .state('demoBlank5', {
                url: '/demoBlank5',
                views: {
                    'content': {
                        templateUrl: assest + '/views/blank.html'
                    }
                }
            })
            .state('demoBlank6', {
                url: '/demoBlank6',
                views: {
                    'content': {
                        templateUrl: assest + '/views/blank.html'
                    }
                }
            })
        ;
    });