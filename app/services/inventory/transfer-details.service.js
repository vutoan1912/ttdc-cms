(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('TransferDetail', TransferDetail);

    TransferDetail.$inject = ['$http'];

    function TransferDetail ($http) {
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
            return $http.get('/api/transfer-details').then(function(response) {
                return response.data;
            });
        }

        function create(tf) {
            return $http.post('/api/transfer-details',tf).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get('/api/transfer-details/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/transfer-details/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(tf) {
            return $http.put('/api/transfer-details/' + tf.id, tf).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post('/api/transfer-details/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete('/api/transfer-details/'+ id).then(function(response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/transfer-details/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/transfer-details/deactivate', ids).then(function(response) {
                return response.data;
            });
        }
    }
})();
