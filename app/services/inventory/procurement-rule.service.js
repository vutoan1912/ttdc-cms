(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('ProcurementRule', ProcurementRule);

    ProcurementRule.$inject = ['$http'];

    function ProcurementRule ($http) {
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
            return $http.get('/api/procurement-rules').then(function(response) {
                return response.data;
            });
        }
        function getOne(id) {
            return $http.get('/api/procurement-rules/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/procurement-rules/search?' + params+ '&sort=created,desc').then(function (response) {
                return response;
            });
        }

        function create(route) {
            return $http.post('/api/procurement-rules',route).then(function(response) {
                return response.data;
            });
        }
        function update(route) {
            return $http.put('/api/procurement-rules/' + route.id, route).then(function(response) {
                return response.data;
            });
        }

        function deleteByListIDs(listIDs) {
            return $http.post('/api/procurement-rules/batch-delete',listIDs).then(function(response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/procurement-rules/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/procurement-rules/deactivate', ids).then(function(response) {
                return response.data;
            });
        }
    }
})();
