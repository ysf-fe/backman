backman.directive('bmEditor', function (_setting) {

    'use strict';

    return {
        scope: {
            bindContent: '='
        },
        restrict: 'A',
        link: function ($scope, iElm, iAttrs) {
            var eid = iAttrs.id || 'editor' + (Date.now() % 1e7) + parseInt(Math.random() * 1e3);
            iElm.attr('id', eid);
            var editor = KindEditor.create('#' + eid, {
                items: [
                    'source', '|',
                    'undo', 'redo', '|',
                    'template', 'code', '|',
                    'cut', 'copy', 'paste', 'plainpaste', 'wordpaste', '|',
                    'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist',
                    'insertunorderedlist', 'indent', 'outdent', 'subscript', 'superscript', 'clearhtml',
                    'quickformat', '|', 'selectall', 'fullscreen', '/',
                    'formatblock', 'fontname', 'fontsize', '|',
                    'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough', 'lineheight',
                    'removeformat', '|',
                    'image', 'multiimage', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak', 'anchor', 'link', 'unlink', '|',
                    'preview', 'print', 'about'
                ],
                width: '100%',
                height: '270px',
                resizeMode: 1,
                allowFileManager: false,
                //imageUploadJson: _setting.get('kindUploadImgUrl') || '',
                uploadJson: _setting.get('kindUploadImgUrl') || '',
                afterChange: function () {
                    if (editor) {
                        $scope.bindContent = editor.html();
                        if (!$scope.$$phase && !$scope.$root.$$phase) {
                            $scope.$apply();
                        }
                    }
                }
            });
            //初次数据
            var initW = $scope.$watch('bindContent', function (newVal, oldVal) {
                if (newVal) {
                    initW();
                    editor.html(newVal + '');
                }
            });
        }
    }
});