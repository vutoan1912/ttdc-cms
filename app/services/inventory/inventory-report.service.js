(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('InventoryReport', InventoryReport);

    InventoryReport.$inject = ['$http'];

    function InventoryReport ($http) {
        var service = {
            sendReport: sendReport
        };

        return service;

        function sendReport(report) {
            return $http.post('/api/inventory-report/summary', report).then(function (response) {
                return response.data;
            });
        }
    }
})();
