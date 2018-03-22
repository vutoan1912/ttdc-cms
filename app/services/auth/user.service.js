(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('User', User);

    User.$inject = ['$http','API_URL','$localStorage','$sessionStorage'];

    function User ($http,API_URL, $localStorage, $sessionStorage) {
        var service = {
            current : current,
            getAll: getAll,
            create: create,
            getPage: getPage,
            getPageCustom: getPageCustom,
            getUserById: getUserById,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany,
            activate:activate,
            deactivate:deactivate
        };

        return service;

        function current() {

            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'GET',
                url: API_URL + '/api/users/current',
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

        function getAll() {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'GET',
                url: API_URL + '/api/users',
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

        function create(user) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'POST',
                url: API_URL + '/api/users',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: user
            }

            return $http(req).then(function(response){
                //console.log(response);
                return response.data;
            }, function(error){
                //console.log(error)
                return error;
            });
        }

        function getPageCustom(params) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'GET',
                url: API_URL + '/api/users/searchCMS?' + params,
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

        function getPage(params) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'GET',
                url: API_URL + '/api/users/search?' + params,
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

        function getUserById(id) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'GET',
                url: API_URL + '/api/users/' + id,
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

        function update(user) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'PUT',
                url: API_URL + '/api/users/' + user.id,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: user
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
                url: API_URL + '/api/users/' + id,
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
                url: API_URL + '/api/users/batch-delete',
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

        function activate(ids) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'POST',
                url: API_URL + '/api/users/activate',
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

        function deactivate(ids) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'POST',
                url: API_URL + '/api/users/deactivate',
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
