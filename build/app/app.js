var app = backman.module('app', ['app.router']);


app.config(function () {

    'use strict';

    //your config here
});

app.run(function (_setting, _httpGet) {
    'use strict';

    //修改左侧导航栏接口地址
    //_setting.set('navListUrl', '/api/nav');

});
