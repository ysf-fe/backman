backman.directive('bmEditor', function () {

    'use strict';

    return {
        scope: {
            contentBind: '='
        },
        restrict: 'A',
        link: function ($scope, iElm, iAttrs) {
            var eid = 'editor' + (Date.now() % 1e7) + parseInt(Math.random() * 1000);
            iElm.attr('id', eid);
            var editor = KindEditor.create('#' + eid, {
                items: [
                    "source", "|",
                    "undo", "redo", "|",
                    "template", "code", "|",
                    "cut", "copy", "paste", "plainpaste", "wordpaste", "|",
                    "justifyleft", "justifycenter", "justifyright", "justifyfull", "insertorderedlist",
                    "insertunorderedlist", "indent", "outdent", "subscript", "superscript", "clearhtml",
                    "quickformat", "|", "selectall", "fullscreen", "/",
                    "formatblock", "fontname", "fontsize", "|",
                    "forecolor", "hilitecolor", "bold", "italic", "underline", "strikethrough", "lineheight",
                    "removeformat", "|",
                    "image", "table", "hr", "emoticons", "baidumap", "pagebreak", "anchor", "link", "unlink", "|",
                    "preview", "print", "about"
                ],
                width: '100%',
                height: '270px',
                resizeMode: 1,
                allowFileManager: false,
                imageUploadJson: iAttrs.imageUploadUrl || '',
                afterChange: function () {
                    if (editor && editor.html()) {
                        $scope.contentBind = editor.html();
                        if (!$scope.$$phase && !$scope.$root.$$phase) {
                            $scope.$apply();
                        }
                    }
                }
            });
            //初次数据
            var initW = $scope.$watch('contentBind', function (newVal, oldVal) {
                if (newVal) {
                    initW();
                    editor.html(newVal + '');
                }
            });
        }
    }
});