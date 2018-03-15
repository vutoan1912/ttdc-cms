

(function(){
    'use strict';
    angular.module('erpApp')
        .controller('RouteWarehouseController',RouteWarehouseController);

    RouteWarehouseController.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        'Route',
        'TableMultiple',
        'AlertService',
        'ErrorHandle',
        '$translate',
        'variables',
        'TableCommon',
        '$http',
        '$stateParams',
        '$window',
        'TranslateCommonUI',
        'masterdataService'];
    function RouteWarehouseController($rootScope,$scope, $state,Route,TableMultiple,AlertService,ErrorHandle,$translate,variables,TableCommon,$http,$stateParams,$window,TranslateCommonUI,masterdataService) {
        var vm = this;
        TranslateCommonUI.init($scope);
        $scope.RouteService = Route;

        $scope.CbxCreatedBy ={
            url:'/api/users/search?query=',
            key:'email',
            attr:'email',
            prefix:'#/users/',
            suffix:'/detail'
        }

        var listRouteId = "";
        $scope.operationTypes = [];
        $scope.operationTypesSort = [];
        if($stateParams.list_id){
            $scope.routeWithWarehouse = true;
            listRouteId = "id=in=("
            $stateParams.list_id.forEach(function (value) {
               listRouteId = listRouteId + value + ',';
            });
            listRouteId = listRouteId.slice(0,-1) + ')';
            listRouteId = listRouteId + '&sort=priority,desc&size=1000';
        }

        if (angular.element('#ot_list').length) {
            var loadFunction = Route.getPage;
            var fields =    ["id","name","active","created","createdBy","updated","updatedBy"];
            var fieldsType =["Number","Text","Number","Number","Text","Number","Text"]
            var newTableIds = {
                idTable: "table_ot",
                model: "operationTypes",
                param_allow_show_tooltip : "true",
                tree_query: "",
                firstLoad: false,
                param_current_page: 0,
                param_page_size: 0,
                param_total_result: 0,
                param_page_total: 0,
                param_sort_field: "",
                param_sort_type: "asc",
                param_sort_list: [],
                param_filter_list: [],
                param_check_list: [],
                selectize_page_options: [],
                selectize_page_config: {
                    plugins: {
                        'tooltip': ''
                    },
                    create: false,
                    maxItems: 1
                },
                selectize_pageNum_options: ["5", "10", "25", "50"],
                selectize_pageNum_config: {
                    plugins: {
                        'tooltip': ''
                    },
                    create: false,
                    maxItems: 1
                },
                loadFunction: loadFunction,
                param_fields: fields,
                param_fields_type: fieldsType,
                handleAfterReload: null,
                handleAfterReloadParams: null,
                deleteCallback: null,
                customParams: listRouteId,
                pager_id: "table_ot_pager",
                selectize_page_id: "rd_selectize_page",
                selectize_pageNum_id: "rd_selectize_pageNum"
            }


            TableMultiple.initTableIds($scope, newTableIds);
            TableMultiple.reloadPage(newTableIds.idTable);

            $scope.CbxActive = {
                Placeholder : 'Select status',
                Api : "api/routes",
                Table : $scope.TABLES['table_ot'],
                Column : 2,
                Scope : $scope,
                ngModel: null
            }
        }

        //DELETE LIST
        $scope.deleteList = function (table_id) {
            console.log($scope.TABLES[table_id].param_check_list)
            UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                Route.deleteByListIDs($scope.TABLES[table_id].param_check_list).then(function (data) {
                    if (data.length > 0){
                        console.log(data)
                        var erMsg = $translate.instant('error.common.deleteError');
                        erMsg += data
                        AlertService.error(erMsg)
                    } else {
                        AlertService.success('success.msg.delete')
                    }
                    TableMultiple.reloadPage(newTableIds.idTable);
                }).catch(function(data){
                    ErrorHandle.handleError(data);
                })


            }, {
                labels: {
                    'Ok': $translate.instant("common-ui-element.button.Delete"),
                    'Cancel': $translate.instant("common-ui-element.button.Cancel")
                }
            });
        }

        //ACTIVATE, DEACTIVATE LIST
        $scope.activate = function () {
            console.log(newTableIds.idTable)
            console.log($scope.TABLES[newTableIds.idTable].param_check_list);
            if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0){
                Route.activate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                    AlertService.success('success.msg.active')
                    TableMultiple.reloadPage(newTableIds.idTable);
                }).catch(function(data){
                    ErrorHandle.handleError(data);
                })
            }

        }
        $scope.deactivate = function () {
            if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0){
                Route.deactivate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                    AlertService.success('success.msg.inactive')
                    TableMultiple.reloadPage(newTableIds.idTable);
                }).catch(function(data){
                    ErrorHandle.handleError(data);
                })
            }
        }

        //CUSTOM VIEW COLUMNS
        $scope.checkColumnAll = false;
        $scope.checkboxType = "container-checkbox-dis";
        $scope.myColumns = ["Route Name","Active","Created","Created By","Updated","Updated By"];
        $scope.myColumnsShow=[true, false, true, false, false, false];
        for (var i=0; i<$scope.myColumns.length;i++){
            $scope.myColumnsShow.push(true)
        }
        $scope.handleColumn = function handleColumn() {
            if ($scope.checkColumnAll){
                for (var i=0; i < $scope.myColumnsShow.length;i++){
                    $scope.myColumnsShow[i] = true
                    $scope.checkboxType = "container-checkbox-dis"
                }
            } else {
                $scope.checkboxType = "container-checkbox"
            }
        }

        //TABLE MOVE
        $scope.sortableOptions = {
            stop: function(e, ui) {
                var list_priority = [];
                var list_update = [];
                $scope.operationTypes.forEach(function (item, index) {
                    list_priority.push(item.priority);
                })
                list_priority.sort(function(a, b){return b-a});

                $scope.operationTypes.forEach(function (item, index) {
                    if(item.priority != list_priority[index]){
                        item.priority = list_priority[index];
                        list_update.push(index);
                    }
                })

                $scope.operationTypes.forEach(function (item) {
                    swapPriority(item);
                })
            }
        };

        function swapPriority(route) {
            Route.update(route).then(function () {
            }).catch(function(data){
                AlertService.error('route.messages.errorUpdatePriority')
                ErrorHandle.handleError(data);
            })
        }
    }
})();