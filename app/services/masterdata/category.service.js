(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Category', Category);

    Category.$inject = ['$http'];

    function Category ($http) {
        var service = {
            getAll: getAll,
            getTree: getTree,
            create:create,
            update:update,
            deleteOne:deleteOne,
            getOne:getOne
        };

        return service;

        function getOne(id) {
            return $http.get('/api/product-categories/'+id).then(function(response) {
                return response.data;
            });
        }

        function getAll() {
            return $http.get('/api/product-categories').then(function(response) {
                return response.data;
            });
        }

        function getTree() {
            return $http.get('/api/product-categories/category-tree').then(function(response) {
                return response.data;
            });
        }

        function create(category) {
            return $http.post('/api/product-categories',category).then(function(response) {
                return response.data;
            });
        }

        function update(category) {
            return $http.put('/api/product-categories/' + category.id, category).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete('/api/product-categories/'+ id).then(function(response) {
                return response.data;
            });
        }
    }
})();
