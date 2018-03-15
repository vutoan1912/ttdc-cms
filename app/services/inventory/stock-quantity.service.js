(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('StockQuantity', StockQuantity);

    StockQuantity.$inject = ['$http'];

    function StockQuantity ($http) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getOne: getOne,
            update:update,
            deleteRecord:deleteRecord,
            deleteOne:deleteOne,
            activate:activate,
            deactivate:deactivate
        };

        return service;

        function getAll() {
            return $http.get('/api/quants').then(function(response) {
                return response.data;
            });
        }

        function create(product) {
            return $http.post('/api/quants',product).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get('/api/quants/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/quants/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(sequence) {
            return $http.put('/api/quants/' + sequence.id, sequence).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post('/api/quants/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete('/api/quants/'+ id).then(function(response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/quants/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/quants/deactivate', ids).then(function(response) {
                return response.data;
            });
        }
    }
})();
