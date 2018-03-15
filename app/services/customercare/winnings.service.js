(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('WinningsService', WinningsService);

    WinningsService.$inject = ['$http', 'API_URL'];

    function WinningsService ($http, API_URL) {
        var service = {
            init: init,
            getCode: getCode,
            getPrize: getPrize,
            getTopup: getTopup
        };

        return service;

        function getCode(params) {
            return $http.get(API_URL + '/api/code-prizes/searchCMS?' + params).then(function(response) {
                return response;
            });
        }

        function getPrize(params) {
            return $http.get(API_URL + '/api/user-prize/searchCMS?' + params).then(function(response) {
                return response;
            });
        }

        function getTopup(params) {
            return $http.get(API_URL + '/api/user-prize/searchCMS?' + params).then(function(response) {
                //console.log(response)
                return response;
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
