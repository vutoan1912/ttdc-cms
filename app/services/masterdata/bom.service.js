(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('BomService', BomService);

    BomService.$inject = ['$http','TableCommon'];

    function BomService ($http,$scope,TableCommon) {
        var service = {
            init: init,
            current : current,
            getAll: getAll,
            getPage: getPage,
            getOneMv: getOneMv,
            getDetail: getDetail,
            getBomComponents:getBomComponents,
            activate:activate,
            deactivate:deactivate
        };

        return service;

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

        function current() {
            return $http.get('/api/users/current').then(function(response) {
                return response.data;
            });
        }

        function getAll() {
            return $http.get('/api/boms').then(function(response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/boms/search?' + params).then(function (response) {
                //console.log(response);
                return response;
            });
        }

        function getOneMv(id) {
            return $http.get('/api/products/advanced-search/?query=id==' +id).then(function (response) {
                return response.data[0];
            });
        }

        function getDetail(id) {
            return $http.get('/api/boms/' + id).then(function (response) {
                //console.log(response.data);
                return response.data;
            });
        }

        function getBomComponents(param) {
            return $http.get('/api/boms/'+param).then(function (response) {
                //console.log(response.data);
                return response;
            });
        }

        function activate(ids) {
            return $http.post('/api/boms/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/boms/deactivate', ids).then(function(response) {
                return response.data;
            });
        }

    }
})();
