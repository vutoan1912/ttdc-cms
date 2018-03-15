(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('UomCategory', UomCategory);

    UomCategory.$inject = ['$http'];

    function UomCategory ($http) {
        var service = {
            getAll: getAll,
            getTree: getTree,
            getByPage: getByPage,
            create: create,
            update: update,
            deleteById: deleteById,
            getById: getById,
            getAllByQuery: getAllByQuery,
        };

        return service;

        function getAllByQuery(query) {
            return $http.get('/api/uom-category/search?' + query).then(function(response) {
                return response.data;
            });
        }

        function getAll() {
            return $http.get('/api/uom-category').then(function(response) {
                return response.data;
            });
        }

        function getTree() {
            return $http.get('/api/uom-category/tree').then(function(response) {
                return response.data;
            });
        }

        function getByPage(params) {
            return $http.get('/api/uom-category/search?' +params).then(function (response) {
                return response.data;
            });
        }

        function create(category) {
            return $http.post('/api/uom-category',category).then(function(response) {
                return response.data;
            });
        }

        function update(category) {
            return $http.put('/api/uom-category/' + category.id, category).then(function(response) {
                return response.data;
            });
        }

        function deleteById(id) {
            return $http.delete('/api/uom-category/'+id).then(function(response) {
                return response.data;
            });
        }

        function getById(id) {
            return $http.get('/api/uom-category/'+id).then(function(response) {
                return response.data;
            });
        }

    }
})();
