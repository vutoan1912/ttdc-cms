(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Sequence', Sequence);

    Sequence.$inject = ['$http','TableCommon'];

    function Sequence ($http,TableCommon) {
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
            return $http.get('/api/sequences').then(function(response) {
                return response.data;
            });
        }

        function create(product) {
            return $http.post('/api/sequences',product).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get('/api/sequences/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/sequences/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(sequence) {
            return $http.put('/api/sequences/' + sequence.id, sequence).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post('/api/sequences/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete('/api/sequences/'+ id).then(function(response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/sequences/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/sequences/deactivate', ids).then(function(response) {
                return response.data;
            });
        }
    }
})();
