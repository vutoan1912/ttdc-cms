(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('ProductMan', ProductMan);

    ProductMan.$inject = ['$http'];

    function ProductMan ($http) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getOne: getOne,
            getOneByManAndProduct: getOneByManAndProduct,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany,
            activate:activate,
            deactivate:deactivate
        };

        return service;

        function getAll() {
            return $http.get('/api/product-man').then(function(response) {
                return response.data;
            });
        }

        function create(warehouse) {
            return $http.post('/api/product-man',warehouse).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get('/api/product-man/' +id).then(function (response) {
                return response.data;
            });
        }

        function getOneByManAndProduct(manId, productId) {
            return $http.get('/api/product-man/search?query=manufacturerId==' + manId + ';productId==' + productId).then(function (response) {
                return response.data[0];
            });
        }

        function update(id, warehouse) {
            return $http.put('/api/product-man/' + id, warehouse).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/product-man/search?' + params).then(function (response) {
                return response;
            });
        }

        function deleteOne(id) {
            return $http.delete('/api/product-man/' + id).then(function (response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post('/api/product-man/batch-delete', ids).then(function (response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/product-man/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/product-man/deactivate', ids).then(function(response) {
                return response.data;
            });
        }
    }
})();
