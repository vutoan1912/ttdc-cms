(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Lot', Lot);

    Lot.$inject = ['$http'];

    function Lot ($http) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getOne: getOne,
            update:update,
            deleteRecord:deleteRecord,
            deleteOne:deleteOne,
            activate:activate,
            deactivate:deactivate,
            getCurrentReference:getCurrentReference
        };

        return service;

        function getAll() {
            return $http.get('/api/lots').then(function(response) {
                return response.data;
            });
        }

        function create(ot) {
            return $http.post('/api/lots',ot).then(function(response) {
                console.log(response)
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get('/api/lots/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/lots/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            return $http.put('/api/lots/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post('/api/lots/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete('/api/lots/'+ id).then(function(response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/lots/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/lots/deactivate', ids).then(function(response) {
                return response.data;
            });
        }

        function getCurrentReference() {
            return $http.get('/api/lots/current').then(function (response) {
                return response.data;
            });
        }
    }
})();
