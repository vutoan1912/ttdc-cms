(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('OperationType', OperationType);

    OperationType.$inject = ['$http','TableCommon'];

    function OperationType ($http,TableCommon) {
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
            return $http.get('/api/operation-types').then(function(response) {
                return response.data;
            });
        }

        function create(ot) {
            return $http.post('/api/operation-types',ot).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get('/api/operation-types/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/operation-types/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            return $http.put('/api/operation-types/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post('/api/operation-types/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete('/api/operation-types/'+ id).then(function(response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/operation-types/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/operation-types/deactivate', ids).then(function(response) {
                return response.data;
            });
        }
    }
})();
