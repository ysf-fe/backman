//路由配置模块
angular
    .module('app.router', [])
    .config(function ($stateProvider, $urlRouterProvider, _tools) {

        'use strict';

        $urlRouterProvider.otherwise('/home');

        //var a = _tools.transKeyName('camel',{key_name:1}); console.log(a);

        $stateProvider
            // 首页
            .state('home', {
                url: '/home',
                views: {
                    'content': {
                        templateUrl: './app/views/home.html'
                    }
                }
            })
            .state('demoBaseElm', {
                url: '/demo/baseElm',
                views: {
                    'content': {
                        templateUrl: './app/views/base.html'
                    }
                }
            })
            .state('demoList', {
                url: '/demo/list',
                views: {
                    'content': {
                        templateUrl: './app/views/list.html'
                    }
                }
            })
            .state('demoList.detail', {
                url: '/demo/detail/:id',
                views: {
                    'content': {
                        templateUrl: './app/views/.html'
                    }
                }
            })
            .state('demoSubmit', {
                url: '/demo/submit',
                views: {
                    'content': {
                        templateUrl: './app/views/submit.html',
                        controller: 'demoSubmit'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        './app/controllers/demoSubmit.js'
                    ])
                }
            })
            .state('demoBlank', {
                url: '/demo/blank',
                views: {
                    'content': {
                        templateUrl: './app/views/blank.html'
                    }
                }
            })
            .state('demoBlank1', {
                url: '/demoBlank1',
                views: {
                    'content': {
                        templateUrl: './app/views/blank.html'
                    }
                }
            })
            .state('demoBlank2', {
                url: '/demoBlank2',
                views: {
                    'content': {
                        templateUrl: './app/views/blank.html'
                    }
                }
            })
            .state('demoBlank3', {
                url: '/demoBlank3',
                views: {
                    'content': {
                        templateUrl: './app/views/blank.html'
                    }
                }
            })
            .state('demoBlank4', {
                url: '/demoBlank4',
                views: {
                    'content': {
                        templateUrl: './app/views/blank.html'
                    }
                }
            })
            .state('demoBlank5', {
                url: '/demoBlank5',
                views: {
                    'content': {
                        templateUrl: './app/views/blank.html'
                    }
                }
            })
            .state('demoBlank6', {
                url: '/demoBlank6',
                views: {
                    'content': {
                        templateUrl: './app/views/blank.html'
                    }
                }
            })
        ;
    });