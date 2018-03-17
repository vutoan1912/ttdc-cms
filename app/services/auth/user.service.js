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
            getUserById: getUserById,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany,
            activate:activate,
            deactivate:deactivate
        };

        return service;

        function current() {
            // return $http.get(API_URL + '/api/users/current').then(function(response) {
            //     return response.data;
            // });

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
            return $http.get(API_URL + '/api/users').then(function(response) {
                return response.data;
            });
        }

        function create(user) {
            return $http.post(API_URL + '/api/users',user).then(function(response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(API_URL + '/api/users/search?' + params).then(function (response) {
                return response;
            });
        }

        function getUserById(id) {
            return $http.get(API_URL + '/api/users/' + id).then(function(response) {
                return response.data;
            });
        }

        function update(user) {
            return $http.put(API_URL + '/api/users/' + user.id, user).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id) {
            return $http.delete(API_URL + '/api/users/' + id).then(function(response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post(API_URL + '/api/users/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post(API_URL + '/api/users/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post(API_URL + '/api/users/deactivate', ids).then(function(response) {
                return response.data;
            });
        }
    }
})();
