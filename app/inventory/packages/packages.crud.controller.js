angular
    .module('erpApp')
    .controller('PackagesCrudController', [
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
        'Package',
        'Location',
        'Principal',
        'utils',
        'apiData',
        '$http',
        function ($scope, $rootScope, $state, $timeout, $compile, $stateParams, $interval, TableMultiple, Transfer, TransferItem, $translate, TranslateCommonUI, ErrorHandle, AlertService, $window, Package, Location, Principal, utils, apiData, $http) {
            //create new package
            if (angular.element('#package_create').length) {
                $scope.newPackage = {}
                Package.getCurrentReference().then(function (data) {
                    console.log(data)
                    $scope.newPackage.packageNumber = data.generatedSequence
                })

                $scope.submit = function () {
                    if($scope.newPackage.packageNumber != null && $scope.newPackage.packageNumber != ''){
                        console.log($scope.newPackage)
                        Package.create($scope.newPackage).then(function () {
                            $state.go("packages")
                        }).catch(function(data){
                            ErrorHandle.handleError(data);
                        })
                    }
                }
            }
        }

    ]);

