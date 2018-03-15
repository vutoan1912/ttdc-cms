(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('CustomerCareService', CustomerCareService);

    CustomerCareService.$inject = ['$http', 'API_URL'];

    function CustomerCareService ($http,API_URL) {
        var service = {
            init: init,
            getAnswer: getAnswer,
            getFlip: getFlip,
            getSuggest: getSuggest,
            getConvert: getConvert,
            getChange: getChange
        };

        return service;

        function getAnswer(params) {
            return $http.get(API_URL + '/api/answer/searchCMS?' + params).then(function(response) {
                return response;
            });
        }

        function getFlip(params) {
            return $http.get(API_URL + '/api/user-prize/searchCMS?' + params).then(function(response) {
                return response;
            });
        }

        function getSuggest(params) {
            return $http.get(API_URL + '/api/user-guide/searchCMS?' + params).then(function(response) {
                return response;
            });
        }

        function getConvert(params) {
            return $http.get(API_URL + '/api/convert-card/searchCMS?' + params).then(function(response) {
                return response;
            });
        }

        function getChange(params) {
            return $http.get(API_URL + '/api/change-question/searchCMS?' + params).then(function(response) {
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
