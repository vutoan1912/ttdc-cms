

(function(){
    'use strict';
    angular.module('erpApp')
        .controller('RouteController',RouteController);

    RouteController.$inject = [
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
    function RouteController($rootScope,$scope, $state,Route,TableMultiple,AlertService,ErrorHandle,$translate,variables,TableCommon,$http,$stateParams,$window,TranslateCommonUI,masterdataService) {
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

        $scope.operationTypes = [];
        $scope.operationTypesSort = [];

        var loadFunction = Route.getPage;
        var fields =    ["id","name","created","createdBy","updated","updatedBy","active"];
        var fieldsType =["Number","Text","DateTime","Text","DateTime","Text","Number"];
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
            customParams: "",
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
            Column : 6,
            Scope : $scope,
            ngModel:  {value:1, title:"Active"}
        }

        //DELETE LIST
        $scope.deleteList = function (table_id) {
            // console.log($scope.TABLES[table_id].param_check_list)
            UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                Route.deleteByListIDs($scope.TABLES[table_id].param_check_list).then(function (data) {
                    if (data.length > 0){
                        console.log(data)
                        var erMsg = $translate.instant('error.common.deleteError');
                        erMsg += data
                        ErrorHandle.handleErrors(erMsg);
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
            if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0){
                Route.activate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                    AlertService.success('success.msg.active')
                    TableMultiple.reloadPage(newTableIds.idTable);
                }).catch(function(data){
                    ErrorHandle.handleErrors(data);
                })
            }

        }
        $scope.deactivate = function () {
            if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0){
                Route.deactivate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                    AlertService.success('success.msg.inactive')
                    TableMultiple.reloadPage(newTableIds.idTable);
                }).catch(function(data){
                    ErrorHandle.handleErrors(data);
                })
            }
        }

        //CUSTOM VIEW COLUMNS
        $scope.checkColumnAll = false;
        $scope.checkboxType = "container-checkbox";
        $scope.myColumns = ["Route Name","Created","Created By","Updated","Updated By","Active"];
        $scope.myColumnsShow = []
        $scope.defaultColumn = [0,1]
        for (var i = 0; i < $scope.myColumns.length; i++) {
            $scope.myColumnsShow.push(false)
        }
        for (var i = 0; i < $scope.defaultColumn.length; i++) {
            $scope.myColumnsShow[$scope.defaultColumn[i]] = true
        }
        $scope.handleColumn = function handleColumn() {
            $scope.checkColumnAll = !$scope.checkColumnAll
            if ($scope.checkColumnAll) {
                for (var i = 0; i < $scope.myColumnsShow.length; i++) {
                    $scope.myColumnsShow[i] = true
                    $scope.checkboxType = "container-checkbox-dis"
                }
            } else {
                $scope.checkboxType = "container-checkbox"
            }
        }

        $scope.checkColumn = function () {
            if ($scope.checkColumnAll) {
                for (var i = 0; i < $scope.myColumnsShow.length; i++) {
                    $scope.myColumnsShow[i] = true
                    $scope.checkboxType = "container-checkbox-dis"
                }
            } else {
                $scope.checkboxType = "container-checkbox"
            }
        }

        //SEARCH DATETIME
        //FOR DATETIME FILTER
        $scope.DatetimeRange1 = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_ot'], // ** table filter
            Column: 2, // ** number column filter on table
            Scope: $scope
        }

        $scope.DatetimeRange2 = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_ot'], // ** table filter
            Column: 4, // ** number column filter on table
            Scope: $scope
        }
    }
})();