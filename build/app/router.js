//路由配置模块
angular
    .module('app.router', [])
    .config(function ($stateProvider, $urlRouterProvider, _tools) {

        'use strict';

        $urlRouterProvider.otherwise('/home');

        //var a = _tools.transKeyName('camel',{key_name:1}); console.log(a);

        $stateProvider
            //首页
            .state('home', {
                url: '/home',
                views: {
                    'content': {
                        templateUrl: './app/views/home.html'
                    }
                }
            })
            //普通元素
            .state('elementNormal', {
                url: '/element/normal',
                views: {
                    'content': {
                        templateUrl: './app/views/element-normal.html'
                    }
                }
            })
            //表单元素
            .state('elementForm', {
                url: '/element/form',
                views: {
                    'content': {
                        templateUrl: './app/views/element-form.html'
                    }
                }
            })
            //表单验证
            .state('elementVerify', {
                url: '/element/verify',
                views: {
                    'content': {
                        templateUrl: './app/views/element-verify.html',
                        controller: 'elementVerify'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        './app/controllers/element-verify.js'
                    ])
                }
            })
            //富文本编辑器
            .state('elementEditor', {
                url: '/element/editor',
                views: {
                    'content': {
                        templateUrl: './app/views/element-editor.html',
                        controller: 'elementEditor'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        './app/controllers/element-editor.js'
                    ])
                }
            })
            //时间选择器
            .state('elementDatepick', {
                url: '/element/datepick',
                views: {
                    'content': {
                        templateUrl: './app/views/element-datepick.html',
                        controller: 'elementDatepick'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        './app/controllers/element-datepick.js'
                    ])
                }
            })
            //图片上传
            .state('elementUploadImg', {
                url: '/element/uploadImg',
                views: {
                    'content': {
                        templateUrl: './app/views/element-uploadImg.html',
                        controller: 'elementUploadImg'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        './app/controllers/element-uploadImg.js'
                    ])
                }
            })
            //省市区地址联动
            .state('elementDistpicker', {
                url: '/element/distpicker',
                views: {
                    'content': {
                        templateUrl: './app/views/element-distpicker.html',
                        controller: 'elementDistpicker'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        './app/controllers/element-distpicker.js'
                    ])
                }
            })
            //select2
            .state('elementSelect2', {
                url: '/element/select2',
                views: {
                    'content': {
                        templateUrl: './app/views/element-select2.html',
                        controller: 'elementSelect2'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        './app/controllers/element-select2.js'
                    ])
                }
            })
            .state('demoList', {
                url: '/demo/list',
                views: {
                    'content': {
                        templateUrl: './app/views/demo-list.html',
                        controller: 'demoList'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        './app/controllers/demo-list.js'
                    ])
                }
            })
            .state('demoDetail', {
                url: '/demo/detail/:id',
                views: {
                    'content': {
                        templateUrl: './app/views/demo-detail.html',
                        controller: 'demoDetail'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        './app/controllers/demo-detail.js'
                    ])
                }
            })
            .state('demoAdd', {
                url: '/demo/add',
                views: {
                    'content': {
                        templateUrl: './app/views/demo-detail.html',
                        controller: 'demoAdd'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        './app/controllers/demo-add.js'
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
