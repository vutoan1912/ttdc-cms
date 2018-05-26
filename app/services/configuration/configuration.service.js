(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('ConfigurationService', ConfigurationService);

    ConfigurationService.$inject = ['$http', 'API_URL','$localStorage','$sessionStorage'];

    function ConfigurationService ($http,API_URL,$localStorage,$sessionStorage) {
        var service = {
            init: init,
            getMT: getMT,
            getBlacklist: getBlacklist,
            updateMT: updateMT,
            addBlacklist:addBlacklist,
            deleteBlacklist:deleteBlacklist
        };

        return service;

        function getMT(params) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'GET',
                url: API_URL + '/api/sms/getListFOnOff?' + params,
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

        function updateMT(code, description) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'POST',
                url: API_URL + '/api/sms/updateOnOff?code='+code+'&description='+description,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }

            return $http(req).then(function(response){
                //console.log(response);
                return response;
            }, function(error){
                //console.log(error)
                //return error;
                return 0;
            });
        }

        function getBlacklist(params) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'GET',
                url: API_URL + '/api/sms/getListBlacklist?' + params,
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

        function addBlacklist(msisdn) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'POST',
                url: API_URL + '/api/sms/insertBlacklist?msisdn=' + msisdn,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }

            return $http(req).then(function(response){
                //console.log(response);
                return response;
            }, function(error){
                //console.log(error)
                //return error;
                return 0;
            });
        }

        function deleteBlacklist(msisdn) {
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'POST',
                url: API_URL + '/api/sms/deleteBlacklist?msisdn='+msisdn,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }

            return $http(req).then(function(response){
                //console.log(response);
                return response;
            }, function(error){
                //console.log(error)
                //return error;
                return 0;
            });
        }

        // ------------------------------------

        function init(scopeParam) {
            $scope = scopeParam;

            $scope.field = {
                Product: "bom.field.Product",
                ProductVersion: "bom.field.ProductVersion",
                Quantity: "bom.field.Quantity",
                Reference: "bom.field.Reference",
                BomRdVersion: "bom.field.BomRdVersion",
                BomType: "bom.field.BomType",
                No: "bom.field.No",
                UoM: "bom.field.UoM",
                ManName: "bom.field.ManName",
                ManPN: "bom.field.ManPN",
                ManBomName: "bom.field.ManBomName",
                Routing: "bom.field.Routing",
                RoutingOperation: "bom.field.RoutingOperation",
                MaterialType: "bom.field.MaterialType",
                OldPN: "bom.field.OldPN",
                Note: "bom.field.Note"
            }
        }

    }
})();
