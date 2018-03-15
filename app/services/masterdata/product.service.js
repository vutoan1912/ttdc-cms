(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Product', Product);

    Product.$inject = ['$http','TableCommon'];

    function Product ($http,TableCommon) {
        var service = {
            getOne: getOne,
            current : current,
            getAll: getAll,
            getAllMv: getAllMv,
            create: create,
            getPageMv: getPageMv,
            getOneMv: getOneMv,
            countRdBoM:countRdBoM,
            getPage:getPage,
            getOneMan:getOneMan,
            getPageMan:getPageMan,
            getOneManPn:getOneManPn,
            getPageManPn:getPageManPn,
            getOneProductVersion:getOneProductVersion,
            getOnhandQuantity:getOnhandQuantity,
            getAvailableQuantity:getAvailableQuantity
        };

        return service;

        function getOne(id) {
            return $http.get('/api/products/' +id).then(function (response) {
                return response.data;
            });
        }

        function current() {
            return $http.get('/api/products/current').then(function(response) {
                return response.data;
            });
        }

        function getAll() {
            return $http.get('/api/products').then(function(response) {
                return response.data;
            });
        }

        function getAllMv() {
            return $http.get('/api/products/advanced-search').then(function(response) {
                return response.data;
            });
        }

        function create(product) {
            return $http.post('/api/products',product).then(function(response) {
                return response.data;
            });
        }

        function getOneMv(id) {
            return $http.get('/api/products/advanced-search?query=id==' +id).then(function (response) {
                var product = response.data[0]
                product.man = TableCommon.getMans(product)
                return product;
            });
        }

        function getPage(params) {
            return $http.get('/api/products/search?' +params).then(function (response) {
                return response.data;
            });
        }

        function getPageMv(params) {
            return $http.get('/api/products/advanced-search?' +params).then(function (response) {
                for (var i=0; i<response.data.length; i++){
                    var man = TableCommon.getMans(response.data[i])
                    var recordNum = getRecordNumber(man)
                    response.data[i].man = man
                    response.data[i].recordNum = recordNum
                }
                return response;
            });
        }

        function getOneMan(id) {
            return $http.get('/api/product-man/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPageMan(params) {
            return $http.get('/api/product-man/search?' +params).then(function (response) {
                return response.data;
            });
        }

        function getOneManPn(id) {
            return $http.get('/api/product-man-pn/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPageManPn(params) {
            return $http.get('/api/product-man-pn/search?' +params).then(function (response) {
                return response.data;
            });
        }

        function getOneProductVersion(id) {
            return $http.get('/api/product-version/' +id).then(function (response) {
                return response.data;
            });
        }

        function countRdBoM(productId) {
            return $http.get('/api/products/' + productId +'/rd-bom-count').then(function(response) {
                return response.data;
            });
        }

        function getRecordNumber(man) {
            var num =0
            if (man.length == 0) {return 1}
            for (var i=0; i<man.length ; i++){
                num += man[i]["rowspan"]
            }
            return num
        }

        function getOnhandQuantity(productId) {
            return $http.get('/api/products/' + productId +'/on-hand-quantity').then(function(response) {
                return response.data;
            });
        }

        function getAvailableQuantity(productId) {
            return $http.get('/api/products/' + productId +'/available-quantity').then(function(response) {
                return response.data;
            });
        }
    }
})();
