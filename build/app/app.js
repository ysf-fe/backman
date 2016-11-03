var app = angular.module('app', ['backman', 'app.router']);

app.config(function () {

    'use strict';

    //your config here

});

app.run(function (_setting) {

    'use strict';

    //修改左侧导航栏接口地址
    //_setting.set('navListUrl', '/api/nav');

});