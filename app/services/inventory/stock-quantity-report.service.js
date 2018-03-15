(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('StockQuantityReport', StockQuantityReport);

    StockQuantityReport.$inject = ['$http'];

    function StockQuantityReport ($http) {
        var service = {
            getAll: getAll,
            getPage: getPage,
            getOne: getOne,
            groupByCategory:groupByCategory,
            groupByLocation:groupByLocation
        };

        return service;

        function getAll() {
            return $http.get('/api/quants-report').then(function(response) {
                return response.data;
            });
        }


        function getOne(id) {
            return $http.get('/api/quants-report/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/quants-report/search?' + params).then(function (response) {
                return response;
            });
        }

        function groupByLocation(params) {
            var url = '/api/quants-report/search?query=expression=="groupBy==locationId;orderBy==id,desc"'
            if(params !=''){
                url += ";" +params
            }
            url +="&size=1000"
            return $http.get(url).then(function(response) {
                return response;
            });
        }

        function groupByCategory(params) {
            var url = '/api/quants-report/search?query=expression=="groupBy==productCategoryId;orderBy==id,desc"'
            if(params !=''){
                url += ";" +params
            }
            url +="&size=1000"
            return $http.get(url).then(function(response) {
                return response;
            });
        }

    }
})();
