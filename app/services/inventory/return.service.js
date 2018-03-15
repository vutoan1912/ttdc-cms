(function () {
    'use strict';
    angular
        .module('erpApp')
        .factory('ReturnService', ReturnService);

    ReturnService.$inject = ['$translate', 'apiData', '$http', '$timeout', 'CbxService', 'Transfer', 'Location', 'Product','OperationType','Package','AlertService', 'ErrorHandle'];

    function ReturnService($translate, apiData, $http, $timeout, CbxService, Transfer, Location, Product,OperationType,Package,AlertService, ErrorHandle, $scope) {

        var service = {
            initReturnService: initReturnService
        };

        return service;

        function initReturnService(scope) {
            $scope = scope;

            $scope.handleReturn = function () {
                $scope.currentLocation = $scope.transfer.destLocationId;
                $scope.returnLocation = $scope.transfer.srcLocationId;

                $scope.urlReturnLocationLink = '#/locations/details?id='  + $scope.returnLocation
                $scope.urlCurrentLocationLink = '#/locations/details?id='  + $scope.currentLocation
                $scope.list_op_item_return = angular.copy($scope.list_op_item)
                $scope.list_op_detail_return = angular.copy($scope.list_op_detail)
                $timeout(function () {
                    angular.element("#returnPackageBtn").trigger("click");
                })
            }

            $scope.selectReturnItem = function (index) {
                for (var i=0; i< $scope.list_op_detail_return.length; i++){
                    if($scope.list_op_item_return[index].id == $scope.list_op_detail_return[i].transferItemId){
                        $scope.list_op_detail_return[i].isSelected = $scope.list_op_item_return[index].isSelected
                        if($scope.list_op_item_return[index].isSelected){
                            $scope.list_op_detail_return[i].returnQuantity = $scope.list_op_detail_return[i].doneQuantity
                        } else {
                            $scope.list_op_detail_return[i].returnQuantity = 0
                        }
                    }
                }

            }
            
            $scope.selectReturnDetail = function () {

            }
            
            $scope.checkReturnQuantity = function (index) {
                if($scope.list_op_detail_return[index].returnQuantity > $scope.list_op_detail_return[index].doneQuantity){
                    $scope.list_op_detail_return[index].invalid = true;
                } else {
                    $scope.list_op_detail_return[index].invalid = false;
                }
            }

            $scope.handleReturnItem = function () {
                $scope.return_list =[]
                for (var i=0; i < $scope.list_op_detail_return.length ; i++){
                    if($scope.list_op_detail_return[i].isSelected){
                        $scope.list_op_detail_return[i].reserved = $scope.list_op_detail_return[i].returnQuantity
                        $scope.list_op_detail_return[i].doneQuantity = 0
                        $scope.list_op_detail_return[i].id = null
                        $scope.list_op_detail_return[i].transferItemId = null
                        $scope.list_op_detail_return[i].trasnferId = null
                        $scope.list_op_detail_return[i].srcLocationId = $scope.currentLocation
                        $scope.list_op_detail_return[i].destLocationId = $scope.returnLocation
                        $scope.return_list.push($scope.list_op_detail_return[i])
                    }
                }

                if($scope.return_list.length == 0){
                    AlertService.error("transfer.messages.emptyItemList")
                    return
                }

                Transfer.getOne($scope.list_op_detail[0].transferId).then(function (transfer) {
                    OperationType.getOne(transfer.operationTypeId).then(function (operation) {
                        $scope.returnTransfer ={}
                        $scope.returnTransfer.originTransferNumber = transfer.originTransferNumber
                        $scope.returnTransfer.operationTypeId = operation.returnOperationId
                        $scope.returnTransfer.srcLocationId = transfer.destLocationId
                        $scope.returnTransfer.destLocationId = transfer.srcLocationId
                        $scope.returnTransfer.projectVersionId = transfer.projectVersionId
                        $scope.returnTransfer.sourceDocument = 'Return of '+transfer.transferNumber
                        $scope.returnTransfer.state = 'ready'
                        $scope.returnTransfer.transferDetails = $scope.return_list
                        Transfer.returnTransfer($scope.transfer.id,$scope.returnTransfer).then(function (response) {
                                $scope.result = response.data
                                if($scope.result.quantInfo.length == 0){
                                    $scope.list_op_detail_return
                                    AlertService.success("transfer.messages.createReturnSuccess")
                                } else {
                                    $scope.quantInfo = $scope.result.quantInfo
                                    $timeout(function () {
                                        angular.element("#returnResult").trigger("click");
                                    })

                                }

                            }).catch(function (e) {
                                ErrorHandle.handleError(e);
                            })
                    }).catch(function (e) {
                        ErrorHandle.handleError(e);
                    })
                }).catch(function (e) {
                    ErrorHandle.handleError(e);
                })
                $timeout(function () {
                    angular.element("#closeReturnForm").trigger("click");
                })

            }
        }

    }
})();
