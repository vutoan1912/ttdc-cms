

(function(){
    'use strict';
    angular.module('erpApp')
        .controller('DetailRouteController',DetailRouteController);

    DetailRouteController.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        'Route',
        'PushRule',
        'ProcurementRule',
        'Warehouse',
        'Location',
        'Product',
        'Category',
        'Supplier',
        'OperationType',
        'AlertService',
        '$translate',
        'variables',
        'TableCommon',
        '$http',
        '$stateParams',
        '$window',
        'TranslateCommonUI',
        'ErrorHandle'
    ];
    function DetailRouteController($rootScope,$scope,$state,Route,PushRule,ProcurementRule,Warehouse,Location,Product,Category,Supplier,OperationType,AlertService,$translate, variables,TableCommon,$http,$stateParams,$window,TranslateCommonUI,ErrorHandle) {
        var vm = this;
        TranslateCommonUI.init($scope);
        $scope.RouteService = Route;
        $scope.PushRuleService = PushRule;
        $scope.ProcurementRuleService = ProcurementRule;

        $scope.routeModel = {};
        Route.getOne($stateParams.routeId).then(function (data) {
            $scope.routeModel = data;

            $scope.routeModel.pushRules.forEach(function (value) {
                Location.getOne(value.srcLocationId).then(function (data) {
                    value.srcLocation = data;
                })
                Location.getOne(value.destLocationId).then(function (data) {
                    value.destLocation = data;
                })
                OperationType.getOne(value.operationTypeId).then(function (data) {
                    value.operationType = data;
                })
            });

            $scope.routeModel.procurementRules.forEach(function (value) {
                Location.getOne(value.procurementLocationId).then(function (data) {
                    value.procurementLocation = data;
                });
                if(value.sourceLocationId){
                    Location.getOne(value.sourceLocationId).then(function (data) {
                        value.sourceLocation = data;
                    });
                }
                OperationType.getOne(value.operationTypeId).then(function (data) {
                    value.operationType = data;
                })
                $scope.listAction.forEach(function (value2) {
                    if(value2.value == value.action){
                        value.action = value2;
                    }
                })
            });

            console.log($scope.routeModel);
        })

        $scope.listOptionsAutomatic = [{id: 0, name: 'Manual Operation'}, {id: 1, name: 'Automatic No Step Added'}];

        $scope.newPushRule = {};

        $scope.viewPushRule = function (index) {
            $scope.newPushRule = $scope.routeModel.pushRules[index];
            if($scope.newPushRule.automatic){
                $scope.newPushRule.automatic = $scope.listOptionsAutomatic[1].name;
            }else{
                $scope.newPushRule.automatic = $scope.listOptionsAutomatic[0].name;
            }
        }

        $scope.listAction = [{id: 0, name: 'Move From Another Location', value: 'move'},
            {id: 1, name: 'Manufacture ', value: 'manufacturer'}, {id: 2, name: 'Buy', value: 'buy'}];
        $scope.listMoveSupplyMethod = [{id: 0, name: 'Take From Stock', value: 'make_to_stock'}, {id: 1, name: 'Create Procurement', value: 'make_to_order'}];

        $scope.newProcurementRule = {};

        $scope.viewProcurementRule = function (index) {
            $scope.newProcurementRule = $scope.routeModel.procurementRules[index];
            if($scope.newProcurementRule.moveSupplyMethod == $scope.listMoveSupplyMethod[0].value){
                $scope.newProcurementRule.moveSupplyMethod = $scope.listMoveSupplyMethod[0];
            }else{
                $scope.newProcurementRule.moveSupplyMethod = $scope.listMoveSupplyMethod[1];
            }
        }

        $scope.deleteRouteById = function () {
            var id = $stateParams.routeId;
            Route.deleteByListIDs([id]).then(function (data) {
                if (data.length > 0){
                    var erMsg = $translate.instant('error.common.deleteError');
                    erMsg += data;
                    //AlertService.error(erMsg);
                    ErrorHandle.handleErrors(erMsg);
                } else {
                    $state.go('routes',{}, {reload : true});
                }
            }).catch(function(data){
                ErrorHandle.handleErrors(data);
            })
        }

        $scope.removePushRuleInTable = function (index) {
            var id = $scope.routeModel.pushRules[index].id;
            PushRule.deleteByListIDs([id]).then(function (data) {
                if (data.length > 0){
                    var erMsg = $translate.instant('error.common.deleteError');
                    erMsg += data
                    AlertService.error(erMsg)
                } else {
                    var rtn = [];
                    $scope.routeModel.pushRules.forEach(function (value, i) {
                        if(i != index){
                            rtn.push(value);
                        }
                    })
                    $scope.routeModel.pushRules = rtn;
                }
            }).catch(function(data){
                ErrorHandle.handleError(data);
            })
        }

        $scope.removeProcurementRuleInTable = function (index) {
            var id = $scope.routeModel.procurementRules[index].id;
            ProcurementRule.deleteByListIDs([id]).then(function (data) {
                if (data.length > 0){
                    var erMsg = $translate.instant('error.common.deleteError');
                    erMsg += data
                    AlertService.error(erMsg)
                } else {
                    var rtn = [];
                    $scope.routeModel.procurementRules.forEach(function (value, i) {
                        if(i != index){
                            rtn.push(value);
                        }
                    })
                    $scope.routeModel.procurementRules = rtn;
                }
            }).catch(function(data){
                ErrorHandle.handleError(data);
            })
        }
    }
})();