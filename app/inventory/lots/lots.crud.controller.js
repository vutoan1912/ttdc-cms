angular
    .module('erpApp')
    .controller('LotCrudController', [
        '$scope',
        '$rootScope',
        '$state',
        '$timeout',
        '$compile',
        '$stateParams',
        '$interval',
        'TableMultiple',
        'Transfer',
        'TransferItem',
        '$translate',
        'TranslateCommonUI',
        'ErrorHandle',
        'AlertService',
        '$window',
        'Lot',
        'Location',
        'Principal',
        'utils',
        'apiData',
        '$http',
        function ($scope, $rootScope, $state, $timeout, $compile, $stateParams, $interval, TableMultiple, Transfer, TransferItem, $translate, TranslateCommonUI, ErrorHandle, AlertService, $window, Lot, Location, Principal, utils, apiData, $http) {
            //create new package
            if (angular.element('#package_create').length) {
                $scope.newLot = {}
                Lot.getCurrentReference().then(function (data) {
                    console.log(data)
                    $scope.newLot.lotNumber = data.generatedSequence
                })

                $scope.submit = function () {
                    if($scope.newLot.lotNumber != null && $scope.newLot.lotNumber != ''){
                        Lot.create($scope.newLot).then(function () {
                            $state.go("lots")
                        }).catch(function(data){
                            ErrorHandle.handleError(data);
                        })
                    }
                }
            }
        }

    ]);

