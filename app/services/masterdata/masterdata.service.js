(function () {
    'use strict';

    angular
        .module('erpApp')
        .factory('masterdataService', masterdataService);

    masterdataService.$inject = [];

    function masterdataService($scope) {
        var service = {
            init: init
        };

        return service;

        function init(scopeParam) {
            $scope = scopeParam;

            $scope.column = {
                attach: "masterdata.column.attach",
                eco: "masterdata.column.eco",
                ProductionOrder: "masterdata.column.ProductionOrder"
            }

            $scope.common = {
                Components: "masterdata.common.Components",
                ActivityLogs: "masterdata.common.ActivityLogs",
                NoData: "masterdata.common.nodata",
                Loading: "masterdata.common.loading"
            }
        }
    }
})();
