(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('TransferItem', TransferItem);

    TransferItem.$inject = ['$http'];

    function TransferItem ($http) {
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
            return $http.get('/api/transfer-items').then(function(response) {
                return response.data;
            });
        }

        function create(tf) {
            return $http.post('/api/transfer-items',tf).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get('/api/transfer-items/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/transfer-items/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(tf) {
            return $http.put('/api/transfer-items/' + tf.id, tf).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post('/api/transfer-items/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete('/api/transfer-items/'+ id).then(function(response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/transfer-items/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/transfer-items/deactivate', ids).then(function(response) {
                return response.data;
            });
        }
    }
})();
