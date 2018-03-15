angular
    .module('erpApp')
    .controller('StockQuantityController', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$compile',
        'StockQuantity',
        '$stateParams',
        '$interval',
        'TableMultiple',
        '$translate',
        '$window',
        'AlertService',
        '$state',
        '$filter',
        'ErrorHandle',
        'apiData',
        '$http',
        function ($scope, $rootScope, $timeout, $compile, StockQuantity, $stateParams, $interval, TableMultiple, $translate,$window,AlertService,$state,$filter,ErrorHandle,apiData,$http) {

            $scope.isProductLink = false
            $scope.isLocationLink = false

            $scope.urlProductName = '/api/products/';
            $scope.attrProductName = 'name';
            $scope.urlProductLink =''

            $scope.urlLocationName = '/api/locations/';
            $scope.attrCompleteName = 'completeName';
            $scope.urlLocationLink = ''

            $scope.urlLot = '/api/lots/'
            $scope.attrLotNumber = 'lotNumber';
            $scope.urLotLink =''

            $scope.urlPackage = '/api/packages/'
            $scope.attrPackageNumber = 'packageNumber';
            $scope.urlPackageLink =''

            $scope.currentItemDetail={}

            StockQuantity.getOne($stateParams.id).then(function (data) {
                $scope.currentItemDetail = data
                $scope.urlLocationLink = '#/locations/details?id='  + $scope.currentItemDetail.locationId
                $scope.urlProductLink = '#/products/'+ $scope.currentItemDetail.productId +'/details'
                $scope.urLotLink = '#/lots/'+ $scope.currentItemDetail.lotId +'/details'
                $scope.urlPackageLink = '#/packages/'+ $scope.currentItemDetail.packageId +'/details'
            })

            if(angular.isDefined($stateParams.product_id) && $stateParams.product_id != null){
                $scope.isProductLink = true
            }

            if(angular.isDefined($stateParams.location_id) && $stateParams.location_id != null){
                $scope.isLocationLink = true
            }

            $scope.pickingMoveTitle = "inventory.common.pickingMove";
            $scope.viewListPickingMove = function () {
                var input = {
                    productId: $scope.currentItemDetail.productId,
                    lotId: $scope.currentItemDetail.lotId,
                    destPackageId: $scope.currentItemDetail.packageId,
                }
                console.log(input)
                $state.go('product-move',{inputPickingMove: input})
            }
        }
    ]);

