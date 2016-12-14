// 服务：地址tree全局缓存服务
backman.factory('_chinaAddress', function ($http, $q, _tools, _setting) {

    'use strict';

    var tree = null;
    var deferred2 = $q.defer();

    var StorageKey = 'AREA_TREE';

    var tempTree = localStorage.getItem(StorageKey);
    tempTree = tempTree?JSON.parse(tempTree) : [];

    if(tempTree && tempTree.length) {
        tree = tempTree;
        deferred2.resolve(tree);
    }else {
        // 当前修改为请求远程文件的方式来获取区域信息
        $http.get('../_data/region.json').then(function (data) {
            if (data.data.state.code == 10200) {
                tree = [];
                var list = _tools.transKeyName('camel', data.data.data);
                //匹配依赖依据：
                //所有地址regionId存在从小到大排列的规律，且parentId必定比自身regionId小，所以parent元素必定先于自身已经被创建
                for (var i = 0; i < list.length; i++) {
                    //省级
                    if (list[i].parentId == '') {
                        list[i].children = [];
                        tree.push(list[i]);
                    } else {
                        //市级
                        for (var j = 0; j < tree.length; j++) {
                            if (tree[j].regionId == list[i].parentId) {
                                list[i].children = [];
                                tree[j].children.push(list[i]);
                                break;
                            } else {
                                //区级
                                for (var k = 0; k < tree[j].children.length; k++) {
                                    if (tree[j].children[k].regionId == list[i].parentId) {
                                        tree[j].children[k].children.push(list[i]);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                tree = [];
            }
            localStorage.setItem(StorageKey, JSON.stringify(tree));
            deferred2.resolve(tree);
        }, function (err) {
            tree = [];
            deferred2.resolve(tree);
        });
    }


    return {
        getTree: function () {
            if (tree) {
                var deferred = $q.defer();
                deferred.resolve(tree);
                return deferred.promise;
            } else {
                return deferred2.promise;
            }
        },
        getProvinces: function(){
            return this.getTree();
        },
        getCities: function(provinceId){
            return this.getProvinces().then(function(data){
                for (var i = 0; i < data.length; i++) {
                    if (data[i].regionId == provinceId) {
                        return data[i].children;
                    }
                }
            });
        },
        getDistricts: function(provinceId, cityId){
            return this.getCities(provinceId).then(function(data){
                for (var i = 0; i < data.length; i++) {
                    if (data[i].regionId == cityId) {
                        return data[i].children;
                    }
                }
            });
        },
        /**
         * 获取对应的区域id的数据
         * @param  {String} type     'provinces','cities','blocks'
         * @param  {String} regionId 区域id
         * @return {Object}          区域id对应的对象
         */
        getRegionIdData: function(arr, regionId){
            var result = '';
            if (arr) {
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr[i].regionId == regionId) {
                        result = arr[i].regionName;
                        break;
                    }
                }
            }
            return result;
        }
    };
});
