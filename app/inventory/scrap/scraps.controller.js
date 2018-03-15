

(function(){
    'use strict';
    angular.module('erpApp')
        .controller('ScrapController',ScrapController);

    ScrapController.$inject = [
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
        'masterdataService',
        'Transfer',
        'Scrap'
    ];
    function ScrapController($rootScope,$scope, $state,Route,TableMultiple,AlertService,ErrorHandle,$translate,variables,TableCommon,$http,$stateParams,$window,TranslateCommonUI,masterdataService,Transfer,Scrap) {
        var vm = this;
        TranslateCommonUI.init($scope);

        $scope.transfer = {};
        $scope.init = function () {
            Transfer.getOne($stateParams.transferId).then(function (data) {
                $scope.transfer = data;
            });
        }

        $scope.CbxCreatedBy ={
            url:'/api/users/search?query=',
            key:'email',
            attr:'email',
            prefix:'#/users/',
            suffix:'/detail'
        }

        $scope.CbxLocation ={
            url:'/api/locations/search?query=',
            key:'id',
            attr:'completeName',
            prefix:'#/locations/details?id=',
            suffix:''
        }

        $scope.operationTypes = [];
        $scope.operationTypesSort = [];

        if (angular.element('#ot_list').length) {
            var loadFunction = Scrap.getPage;
            var fields =    ["id",      "scrapNumber",  "created",  "srcLocationId",    "destLocationId",   "state",    "active",   "createdBy",    "updated",  "updatedBy"];
            var fieldsType =["Number",  "Text",         "DateTime",   "Number",           "Text",             "Text",     "Number",     "Text",         "DateTime",   "Text"];
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
                customParams: "transferId==" + $stateParams.transferId,
                pager_id: "table_ot_pager",
                selectize_page_id: "rd_selectize_page",
                selectize_pageNum_id: "rd_selectize_pageNum"
            }


            TableMultiple.initTableIds($scope, newTableIds);
            TableMultiple.reloadPage(newTableIds.idTable);

            $scope.CbxActive = {
                Placeholder : 'Select status',
                Api : "api/scraps/search?query=transferId==" + $stateParams.transferId,
                Table : $scope.TABLES['table_ot'],
                Column : 6,
                Scope : $scope,
                ngModel:  {value:1, title:"Active"}
            }

            //CUSTOM VIEW COLUMNS
            $scope.checkColumnAll = false;
            $scope.checkboxType = "container-checkbox-dis";
            $scope.myColumns = [
                $translate.instant("scrap.listScraps.reference"),
                $translate.instant("scrap.listScraps.createDate"),
                $translate.instant("scrap.listScraps.location"),
                $translate.instant("scrap.listScraps.scrapLocation"),
                $translate.instant("scrap.listScraps.status"),
                $translate.instant("scrap.listScraps.active"),
                $translate.instant("scrap.listScraps.createdBy"),
                $translate.instant("scrap.listScraps.updated"),
                $translate.instant("scrap.listScraps.updatedBy"),
            ];
            $scope.myColumnsShow=[true, true, true, true, true, false, false, false, false];
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
        }

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
            Column: 8, // ** number column filter on table
            Scope: $scope
        }

        //ACTIVATE, DEACTIVATE LIST
        $scope.activate = function () {
            if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0){
                Scrap.activate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                    AlertService.success('success.msg.active')
                    TableMultiple.reloadPage(newTableIds.idTable);
                }).catch(function(data){
                    ErrorHandle.handleErrors(data);
                })
            }

        }
        $scope.deactivate = function () {
            if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0){
                Scrap.deactivate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                    AlertService.success('success.msg.inactive')
                    TableMultiple.reloadPage(newTableIds.idTable);
                }).catch(function(data){
                    ErrorHandle.handleErrors(data);
                })
            }
        }

        //DELETE LIST
        $scope.deleteList = function (table_id) {
            // console.log($scope.TABLES[table_id].param_check_list)
            UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                Scrap.deleteByListIDs($scope.TABLES[table_id].param_check_list).then(function (data) {
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
    }
})();