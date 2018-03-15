(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Warehouse', Warehouse);

    Warehouse.$inject = ['$http'];

    function Warehouse ($http) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getOne: getOne,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany,
            activate:activate,
            deactivate:deactivate
        };

        return service;

        function getAll() {
            return $http.get('/api/warehouses').then(function(response) {
                return response.data;
            });
        }

        function create(warehouse) {
            return $http.post('/api/warehouses',warehouse).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get('/api/warehouses/' +id).then(function (response) {
                return response.data;
            });
        }

        function update(id, warehouse) {
            return $http.put('/api/warehouses/' + id, warehouse).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/warehouses/search?' + params).then(function (response) {
                return response;
            });
        }

        function deleteOne(id) {
            return $http.delete('/api/warehouses/' + id).then(function (response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post('/api/warehouses/batch-delete', ids).then(function (response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/warehouses/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/warehouses/deactivate', ids).then(function(response) {
                return response.data;
            });
        }
    }
})();
