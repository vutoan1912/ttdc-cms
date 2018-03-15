(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Location', Location);

    Location.$inject = ['$http'];

    function Location ($http) {
        var service = {
            getAll: getAll,
            getOne: getOne,
            create: create,
            getPage: getPage,
            getOneModel: getOneModel,
            update: update,
            deleteByListIDs: deleteByListIDs,
            deleteOne:deleteOne,
            activate:activate,
            deactivate:deactivate
        };

        return service;

        function getAll() {
            return $http.get('/api/locations').then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get('/api/locations/' +id).then(function(response) {
                return response.data;
            });
        }

        function getOneModel(id) {
            return $http.get('/api/locations/search?query=id==' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/locations/search?' + params).then(function (response) {
                return response;
            });
        }

        function create(location) {
            return $http.post('/api/locations',location).then(function(response) {
                return response.data;
            });
        }
        function update(location) {
            return $http.put('/api/locations/' + location.id, location).then(function(response) {
                return response.data;
            });
        }

        function deleteByListIDs(listIDs) {
            return $http.post('/api/locations/batch-delete',listIDs).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete('/api/locations/'+ id).then(function(response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/locations/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/locations/deactivate', ids).then(function(response) {
                return response.data;
            });
        }
    }
})();
