(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('ReportService', ReportService);

    ReportService.$inject = ['$http', 'API_URL','$localStorage','$sessionStorage'];

    function ReportService ($http,API_URL,$localStorage,$sessionStorage) {
        var service = {
            getRevenueDay: getRevenueDay,
            getRevenueWeek: getRevenueWeek,
            getRevenueMonth: getRevenueMonth,
            getRevenueYear: getRevenueYear,
            getRevenueQuarter: getRevenueQuarter,
            getRevenueRegister: getRevenueRegister,
            getRevenueRenewal: getRevenueRenewal
        };

        return service;

        function getRevenueDay(params) {
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

        function getRevenueWeek(params) {
            return 1;
        }

        function getRevenueMonth(params) {
            return 1;
        }
        function getRevenueYear(params) {
            return 1;
        }
        function getRevenueQuarter(params) {
            return 1;
        }
        function getRevenueRegister(params) {
            return 1;
        }
        function getRevenueRenewal(params) {
            return 1;
        }
    }
})();
