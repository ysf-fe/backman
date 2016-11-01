backman.factory('_validate', function () {

    'use strict';

    return {
        isMobile: function (val) {
            var rgx = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;
            return rgx.test($.trim(val));
        },
        isRequired: function (val) {
            return $.trim(val) ? true : false;
        },
        isMatchLength: function (val, len) {
            return (($.trim(val)).length == len);
        },
        isLengthInRange: function (val, arr) {
            var len = ($.trim(val)).length;
            return (len >= arr[0] && len <= arr[1]);
        },
        isInRange: function (val, arr) {
            return (val >= arr[0] && val <= arr[1]);
        },
        isIdCard: function (val) {
            var rgx = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;
            return rgx.test($.trim(val));
        },
        isTheSame: function (val1, val2) {
            return (val1 == val2);
        },
        // 验证密码
        isCorrectPassword: function (val) {
            // 只包含数字或字母
            var rgx = /^(?!\d+$)(?![a-z]+$).+$/i;
            return rgx.test($.trim(val));
        }
    };
});