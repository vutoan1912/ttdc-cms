(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('ProductManPn', ProductManPn);

    ProductManPn.$inject = ['$http'];

    function ProductManPn ($http) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getOne: getOne,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany,
            activate:activate,
            deactivate:deactivate,
            getOneByManProductManPn: getOneByManProductManPn
        };

        return service;

        function getAll() {
            return $http.get('/api/product-man-pn').then(function(response) {
                return response.data;
            });
        }

        function create(warehouse) {
            return $http.post('/api/product-man-pn',warehouse).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get('/api/product-man-pn/' +id).then(function (response) {
                return response.data;
            });
        }

        function update(id, warehouse) {
            return $http.put('/api/product-man-pn/' + id, warehouse).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/product-man-pn/search?' + params).then(function (response) {
                return response;
            });
        }

        function deleteOne(id) {
            return $http.delete('/api/product-man-pn/' + id).then(function (response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post('/api/product-man-pn/batch-delete', ids).then(function (response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/product-man-pn/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/product-man-pn/deactivate', ids).then(function(response) {
                return response.data;
            });
        }

        function getOneByManProductManPn(manId, productId, manPn) {
            return $http.get('/api/product-man-pn/search?query=manufacturerId==' + manId + ';productId==' + productId + ';manufacturerPn==' + manPn).then(function (response) {
                return response.data[0];
            });
        }
    }
})();
