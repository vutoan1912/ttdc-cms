(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('SubService', SubService);

    SubService.$inject = ['$http', 'API_URL','$localStorage','$sessionStorage'];

    function SubService ($http,API_URL,$localStorage,$sessionStorage) {
        var service = {
            getRegister: getRegister,
            getMOMT: getMOMT,
            getCharge: getCharge
        };

        return service;

        function getRegister(params) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'GET',
                url: API_URL + '/api/sms/searchDkHuy?' + params,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {}
            };

            return $http(req).then(function(response){
                //console.log(response);
                if(angular.isUndefined(response.data.data)){
                    //console.log('init blank');
                    response.data = {"total":0,"data":[]};
                }
                return response;
            }, function(error){
                //console.log(error)
                return error;
            });
        }

        function getMOMT(params) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'GET',
                url: API_URL + '/api/sms/searchMoMt?' + params,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {}
            };

            return $http(req).then(function(response){
                //console.log(response);
                if(angular.isUndefined(response.data.data)){
                    //console.log('init blank');
                    response.data = {"total":0,"data":[]};
                }
                return response;
            }, function(error){
                //console.log(error)
                return error;
            });
        }

        function getCharge(params) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'GET',
                url: API_URL + '/api/sms/searchCharge?' + params,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {}
            };

            return $http(req).then(function(response){
                return response;
            }, function(error){
                //console.log(error)
                return error;
            });
        }
    }
})();
