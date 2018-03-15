(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Package', Package);

    Package.$inject = ['$http'];

    function Package ($http) {
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
            return $http.get('/api/packages').then(function(response) {
                return response.data;
            });
        }

        function create(ot) {
            return $http.post('/api/packages',ot).then(function(response) {
                console.log(response)
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get('/api/packages/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/packages/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            return $http.put('/api/packages/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post('/api/packages/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete('/api/packages/'+ id).then(function(response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/packages/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/packages/deactivate', ids).then(function(response) {
                return response.data;
            });
        }

        function getCurrentReference() {
            return $http.get('/api/packages/current').then(function (response) {
                return response.data;
            });
        }
    }
})();
