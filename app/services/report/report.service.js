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
            getRevenueBuyQuestion: getRevenueBuyQuestion,
            getRevenueRenewal: getRevenueRenewal,
            getOutputDay:getOutputDay,
            getOutputMonth:getOutputMonth,
            getOutputSub:getOutputSub,
            getRevenueDayCP:getRevenueDayCP,
            getOutputDayCP:getOutputDayCP,
            getRevenueRegisterCP: getRevenueRegisterCP,
            getRevenueRenewalCP:getRevenueRenewalCP,
            getRevenueWeekCP: getRevenueWeekCP,
            getRevenueQuarterCP: getRevenueQuarterCP,
            getRevenueYearCP: getRevenueYearCP,
            getRevenueMonthCP: getRevenueMonthCP,
            getRevenueBuyQuestionCp: getRevenueBuyQuestionCP,
            getOutputAVB: getOutputAVB,
            getOutputCode: getOutputCode,
            getControlInformation:getControlInformation
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
        function getRevenueRenewalCP(params) {
            return 1;
        }

        function getOutputDay(params) {
            return 1;
        }
        function getOutputMonth(params) {
            return 1;
        }
        function getOutputSub(params) {
            return 1;
        }

        function getRevenueDayCP(params) {
            return 1;
        }
        function getOutputDayCP(params) {
            return 1;
        }
        function getRevenueRegisterCP(params) {
            return 1;
        }
        function getRevenueWeekCP(params) {
            return 1;
        }
        function getRevenueQuarterCP(params) {
            return 1;
        }
        function getRevenueYearCP(params) {
            return 1;
        }
        function getRevenueMonthCP(params) {
            return 1;
        }
        function getRevenueBuyQuestion(params) {
            return 1;
        }
        function getRevenueBuyQuestionCP(params) {
            return 1;
        }

        function getOutputAVB(params) {
            return 1;
        }
        function getOutputCode(params) {
            return 1;
        }
        function getControlInformation(params) {
            return 1;
        }
    }
})();
