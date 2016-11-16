var app = backman.module('app', ['app.router']);


app.config(function () {

    'use strict';

    //your config here
});

//应用配置
app.run(function ($rootScope, _setting) {

    'use strict';

    //修改左侧导航栏接口地址
    //_setting.set('navListUrl', '/api/nav');

    //修改退出按钮接口地址
    //_setting.set('logoutUrl', '/api/logout');

    //修改登录页地址
    //_setting.set('loginUrl', 'login.html');

    //右上角管理员名称
    $rootScope.adminName = window.localStorage['adminName@' + window.location.href.split('#')[0]] || 'anonymous';

});
