(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('PushRule', PushRule);

    PushRule.$inject = ['$http'];

    function PushRule ($http) {
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
            return $http.get('/api/push-rules').then(function(response) {
                return response.data;
            });
        }
        function getOne(id) {
            return $http.get('/api/push-rules/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/push-rules/search?' + params+ '&sort=created,desc').then(function (response) {
                return response;
            });
        }

        function create(route) {
            return $http.post('/api/push-rules',route).then(function(response) {
                return response.data;
            });
        }
        function update(route) {
            return $http.put('/api/push-rules/' + route.id, route).then(function(response) {
                return response.data;
            });
        }

        function deleteByListIDs(listIDs) {
            return $http.post('/api/push-rules/batch-delete',listIDs).then(function(response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/push-rules/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/push-rules/deactivate', ids).then(function(response) {
                return response.data;
            });
        }
    }
})();
