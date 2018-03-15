(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('AuthServerProvider', AuthServerProvider);

    AuthServerProvider.$inject = ['$http', '$localStorage', '$sessionStorage', '$q', 'API_URL'];

    function AuthServerProvider ($http, $localStorage, $sessionStorage, $q, API_URL) {
        var service = {
            getToken: getToken,
            login: login,
            loginWithToken: loginWithToken,
            storeAuthenticationToken: storeAuthenticationToken,
            logout: logout
        };

        return service;

        function getToken () {
            return $localStorage.authenticationToken || $sessionStorage.authenticationToken;
        }

        function login (credentials) {

            var data = {
                'email': credentials.email,
                'password': credentials.password,
                'rememberMe': credentials.rememberMe
            };
            return $http.post(API_URL + '/api/auth/token',data).then(authenticateSuccess);

            function authenticateSuccess (response) {
                console.log(response.data.id_token)
                var jwt = response.data.id_token;
                service.storeAuthenticationToken(jwt, credentials.rememberMe);
                return jwt;
            }
        }

        function loginWithToken(jwt, rememberMe) {
            var deferred = $q.defer();

            if (angular.isDefined(jwt)) {
                this.storeAuthenticationToken(jwt, rememberMe);
                deferred.resolve(jwt);
            } else {
                deferred.reject();
            }

            return deferred.promise;
        }

        function storeAuthenticationToken(jwt, rememberMe) {
            if(rememberMe){
                $localStorage.authenticationToken = jwt;
            } else {
                $sessionStorage.authenticationToken = jwt;
            }
        }

        function logout () {

            delete $localStorage.authenticationToken;
            delete $sessionStorage.authenticationToken;
        }
    }
})();
