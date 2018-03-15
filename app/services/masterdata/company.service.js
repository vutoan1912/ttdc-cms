(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Company', Company);

    Company.$inject = ['$http'];

    function Company ($http) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getOne: getOne,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany,
            activate:activate,
            deactivate:deactivate
        };

        return service;

        function getAll() {
            return $http.get('/api/companies').then(function(response) {
                return response.data;
            });
        }

        function create(company) {
            return $http.post('/api/companies',company).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get('/api/companies/' +id).then(function (response) {
                return response.data;
            });
        }

        function update(id, company) {
            return $http.put('/api/companies/' + id, company).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/warehouses/search?' + params).then(function (response) {
                return response;
            });
        }

        function deleteOne(id) {
            return $http.delete('/api/companies/' + id).then(function (response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post('/api/companies/batch-delete', ids).then(function (response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/companies/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/companies/deactivate', ids).then(function(response) {
                return response.data;
            });
        }
    }
})();
