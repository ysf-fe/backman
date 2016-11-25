backman.directive('bmUploadImg', function (_setting, _httpPost) {

    'use strict';

    return {
        scope: {
            bindId: '=',
            bindUrl: '='
        },
        restrict: 'A',
        template: '<div class="bm-upload-img-bg img-thumbnail">' +
        '  <i class="fa fa-image"></i><i class="fa fa-plus"></i></div>' +
        '<div class="bm-upload-img-input"><input type="file" /></div>' +
        '<div class="bm-upload-img-uping" ng-if="state.upAjaxing" title="上传中，请稍后...">' +
        '  <i class="fa fa-spinner"></i></div>' +
        '<div class="bm-upload-img-view img-thumbnail" ng-if="bindUrl" tabindex="-1">' +
        '  <span><img ng-src="{{bindUrl}}" data-img-id="{{bindId}}"/></span>' +
        '  <i class="fa fa-times" ng-click="act.delImg()"></i>' +
        '</div>',
        link: function ($scope, iElm, iAttrs) {
            var eid = iAttrs.id || 'uploadImg' + (Date.now() % 1e7) + parseInt(Math.random() * 1e3);
            iElm.addClass('bm-upload-img').attr('id', eid);
            $scope.state = {
                upAjaxing: false  //显示上传中状态
            };
            //交互
            $scope.act = {
                delImg: function () {
                    layer.confirm('<img class="bm-upload-img-del" src="' + $scope.bindUrl + '"/>',
                        {title: '确认删除此图片？'}, function (index) {
                            layer.close(index);
                            $scope.bindId = $scope.bindUrl = '';
                            if (!$scope.$$phase && !$scope.$root.$$phase) {
                                $scope.$apply();
                            }
                        }
                    );
                }
            };
            //上传图片
            var upload = function (img) {
                var opt = _setting.get('globUploadImg');
                var sendDate = opt.parameters;
                sendDate[opt.fileKeyName] = img.src;
                _httpPost(opt.url, sendDate)
                    .then(function (data) {
                        $scope.state.upAjaxing = false;
                        if (data) {
                            $scope.bindUrl = data.url;
                            $scope.bindId = data.imgId;
                        }
                    });
            };
            //操作
            iElm
                .find('input').on('change', function () {
                    var files = this.files;
                    if (!files[0]) {
                        $scope.state.upAjaxing = false;
                        return;
                    }
                    //状态检测
                    if (!_setting.get('globUploadImg').url) {
                        layer.alert('未检测到上传接口地址！<br>请配置 “全局上传接口” ');
                        return;
                    }
                    if (iAttrs.imgSize) {
                        if (!/^\d{1,4}[,-_\|xX×]\d{1,4}$/.test(iAttrs.imgSize)) {
                            layer.alert('图片尺寸限制配置不合法！<br>格式例如：300-200');
                            return
                        }
                    }
                    //显示加载中图标
                    $scope.state.upAjaxing = true;
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                    //读取文件
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var img = new Image();
                        img.onload = function () {
                            img.onload = null;
                            if (iAttrs.imgSize) {
                                var matchs = iAttrs.imgSize.match(/^(\d{1,4})[,-_\|xX×](\d{1,4})$/);
                                if (img.width != matchs[1] || img.height != matchs[2]) {
                                    var msg = '您选择的图片尺寸为 ' + img.width + ' × ' + img.height +
                                        '，与此处上传要求的尺寸 <b class="text-danger">' +
                                        matchs[1] + ' × ' + matchs[2] + '</b> 不匹配！' +
                                        '是否仍然要坚持继续上传？';
                                    layer.confirm(msg, {icon: 0, title: '尺寸不匹配!'}, function (index) {
                                        layer.close(index);
                                        upload(img);
                                    }, function(){
                                        $scope.state.upAjaxing = false;
                                        if (!$scope.$$phase && !$scope.$root.$$phase) {
                                            $scope.$apply();
                                        }
                                    });
                                } else {
                                    upload(img);
                                }
                            } else {
                                upload(img);
                            }
                        };
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(files[0]);
                })
                .end()
                //点击图片放大显示
                .on('click', 'img', function () {
                    var $this = $(this);
                    var $win = $(window);
                    var widthW = parseInt($win.width() * 0.8);
                    widthW = (widthW % 2 == 0) ? widthW : widthW + 1;
                    var heightW = parseInt($win.height() * 0.8);
                    heightW = (heightW % 2 == 0) ? heightW : heightW + 1;
                    var width = this.naturalWidth;
                    var height = this.naturalHeight;
                    var size = [width, height];
                    //图片宽高比比窗口宽，按宽度计算
                    if (width / height >= widthW / heightW) {
                        if (width > widthW) {
                            size[0] = parseInt(widthW);
                            size[1] = parseInt(height / width * widthW);
                        }
                    }
                    //图片宽高比比窗口高，按高度计算
                    else {
                        if (height > heightW) {
                            size[0] = parseInt(width / height * heightW);
                            size[1] = parseInt(heightW);
                        }
                    }
                    //打开弹窗
                    layer.open({
                        type: 1,
                        shade: 0.3,
                        shadeClose: true,
                        title: false,
                        closeBtn: 2,
                        move: '.layui-layer-content',
                        skin: 'bm-upload-img-super',
                        content: '<span>' + $this[0].src + '</span><img src="' + $this.attr('src') + '"/>',
                        area: [size[0] + 'px', size[1] + 'px'],
                        end: function() {
                            $this.parent().parent().focus();
                        }
                    });
                });
        }
    }
});