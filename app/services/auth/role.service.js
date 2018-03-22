(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Role', Role);

    Role.$inject = ['$http','API_URL','$localStorage','$sessionStorage'];

    function Role ($http, API_URL,$localStorage,$sessionStorage) {
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
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'GET',
                url: API_URL + '/api/roles/search?query=&size=1000',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {}
            }

            return $http(req).then(function(response){
                //console.log(response);
                return response.data;
            }, function(error){
                //console.log(error)
                return error;
            });

        }

        function create(role) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'POST',
                url: '/api/roles',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: role
            }

            return $http(req).then(function(response){
                //console.log(response);
                return response.data;
            }, function(error){
                //console.log(error)
                return error;
            });
        }

        function getPage(params) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'GET',
                url: API_URL + '/api/roles/search?' + params,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {}
            }

            return $http(req).then(function(response){
                //console.log(response);
                return response;
            }, function(error){
                //console.log(error)
                return error;
            });

        }

        function getOne(id) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'GET',
                url: API_URL + '/api/roles/'+id,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {}
            }

            return $http(req).then(function(response){
                //console.log(response);
                return response.data;
            }, function(error){
                //console.log(error)
                return error;
            });

        }

        function update(role) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'PUT',
                url: '/api/roles/' + role.id,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: role
            }

            return $http(req).then(function(response){
                //console.log(response);
                return response.data;
            }, function(error){
                //console.log(error)
                return error;
            });
        }

        function deleteOne(id) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'DELETE',
                url: '/api/roles/' + id,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }

            return $http(req).then(function(response){
                //console.log(response);
                return response.data;
            }, function(error){
                //console.log(error)
                return error;
            });
        }

        function deleteMany(ids) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'POST',
                url: '/api/roles/batch-delete',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: ids
            }

            return $http(req).then(function(response){
                //console.log(response);
                return response.data;
            }, function(error){
                //console.log(error)
                return error;
            });
        }
    }
})();
