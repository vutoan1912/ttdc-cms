(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Privilege', Privilege);

    Privilege.$inject = ['$http','API_URL'];

    function Privilege ($http,API_URL) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getOne: getOne,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany
        };

        return service;

        function getAll() {
            return $http.get(API_URL + '/api/privileges/search?query=&size=1000000').then(function(response) {
                return response.data;
            });
        }

        function create(privilege) {
            return $http.post(API_URL + '/api/privileges', privilege).then(function(response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(API_URL + '/api/privileges/search?' + params).then(function (response) {
                return response;
            });
        }

        function getOne(id) {
            return $http.get(API_URL + '/api/privileges/'+id).then(function(response) {
                return response.data;
            });
        }

        function update(privilege) {
            return $http.put(API_URL + '/api/privileges/' + privilege.id, privilege).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id) {
            return $http.delete(API_URL + '/api/privileges/' + id).then(function(response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post(API_URL + '/api/privileges/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }
    }
})();
