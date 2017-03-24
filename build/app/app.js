var app = backman.module('app', ['app.router']);


app.config(function () {

    'use strict';

    //your config here
});

//应用配置
app.run(function ($rootScope, _setting) {

    'use strict';

    //右上角管理员名称
    $rootScope.adminName = window.localStorage['adminName@' + window.location.href.split('#')[0]] || 'anonymous';

    //修改左侧导航栏接口地址
    //_setting.set('navListUrl', '/api/nav');

    //修改退出按钮接口地址
    //_setting.set('logoutUrl', '/api/logout');

    //修改登录页地址
    _setting.set('loginUrl', 'login.html');

    //设置全局图片上传相关配置
    _setting.set('globUploadImg', {
        //接口地址
        url: '/api/upload-base64-image',
        //base64键名
        fileKeyName: 'base64File',
        //同时发送的其他参数
        parameters: {
            appid: 1,
            useType: 'project'
        }
    });

    //设置富文本编辑器上传图片地址
    _setting.set('kindUploadImgUrl', '/api/upload-image');

});
