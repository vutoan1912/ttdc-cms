angular
    .module('erpApp')
    .controller('ProductMoveController', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$compile',
        'TransferDetail',
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
        'Transfer',
        'Product',
        function ($scope, $rootScope, $timeout, $compile, TransferDetail, $stateParams, $interval, TableMultiple, $translate,$window,AlertService,$state,$filter,ErrorHandle,apiData,$http,Transfer,Product) {
            $scope.isLink = false

            $scope.urlProductName = '/api/products/';
            $scope.attrProductName = 'name';
            $scope.urlProductLink =''

            $scope.urlLocationName = '/api/locations/';
            $scope.attrCompleteName = 'displayName';
            $scope.urlSourceLink = ''
            $scope.urlDestLink =''


            $scope.urlProductVersion = '/api/product-version/';
            $scope.attrProductCompleteName = 'completeName';
            $scope.attrProductDes = 'description';

            $scope.attrEmail = 'email';
            $scope.urlOwnerName = '/api/users/';
            $scope.urlOwnerLink = ''

            $scope.currentItemDetail={}
            $scope.transfer={}

            if(angular.isDefined($stateParams.product_id) && $stateParams.product_id != null){
                $scope.isLink = true
                Product.getOne($stateParams.product_id).then(function (data) {
                    $scope.product = data
                })
            }

            TransferDetail.getOne($stateParams.id).then(function (data) {
                $scope.currentItemDetail = data
                Transfer.getOne($scope.currentItemDetail.transferId).then(function (transfer) {
                    $scope.transfer = transfer
                    $scope.urlOwnerLink = '#/users/'+ $scope.transfer.ownerId +'/detail'
                })
                $scope.urlProductLink = '#/products/'+ $scope.currentItemDetail.productId +'/details'
                $scope.urlSourceLink = '#/locations/details?id='  + $scope.currentItemDetail.srcLocationId
                $scope.urlDestLink = '#/locations/details?id='  + $scope.currentItemDetail.destLocationId
            })


        }
    ]);

