(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Route', Route);

    Route.$inject = ['$http'];

    function Route ($http) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getOne: getOne,
            update: update,
            deleteByListIDs: deleteByListIDs,
            activate: activate,
            deactivate: deactivate
        };

        return service;

        function getAll() {
            return $http.get('/api/routes').then(function(response) {
                return response.data;
            });
        }
        function getOne(id) {
            return $http.get('/api/routes/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/routes/search?' + params+ '&sort=created,desc').then(function (response) {
                return response;
            });
        }

        function create(route) {
            return $http.post('/api/routes',route).then(function(response) {
                return response.data;
            });
        }
        function update(route) {
            return $http.put('/api/routes/' + route.id, route).then(function(response) {
                return response.data;
            });
        }

        function deleteByListIDs(listIDs) {
            return $http.post('/api/routes/batch-delete',listIDs).then(function(response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/routes/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/routes/deactivate', ids).then(function(response) {
                return response.data;
            });
        }
    }
})();
