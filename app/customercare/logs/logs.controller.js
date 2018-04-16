(function(){
    'use strict';
    angular.module('erpApp')
        .controller('LogsController',LogsController);

    LogsController.$inject = ['$rootScope','$scope','$state','CustomerCareService','AlertService','$translate','variables',
        '$http','$stateParams','$window','TableMultipleOrigin','TranslateCommonUI','$localStorage','$sessionStorage','API_URL'];
    function LogsController($rootScope,$scope, $state, CustomerCareService, AlertService,$translate, variables,
                                $http,$stateParams,$window,TableMultipleOrigin,TranslateCommonUI,$localStorage,$sessionStorage,API_URL) {

        //Code
        var fieldsRd =     ["msisdn","action","content" , "answer","trueAnswer","diamonds","cards", "created"];
        var fieldsTypeRd = ["Text",  "Text",  "Text",     "Text",  "Text",      "Number",  "Number","DateTime"];
        var loadFunctionRd = CustomerCareService.getlogs;

        var newTableIdsRd = {
            idTable: "table_rd_bom",
            model: "list_bom_rd",
            param_allow_show_tooltip : "true",
            tree_query: "",
            firstLoad: false,
            param_current_page: 0,
            param_page_size: 0,
            param_total_result: 0,
            param_page_total: 0,
            param_sort_field: "id",
            param_sort_type: "desc",
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
            loadFunction: loadFunctionRd,
            param_fields: fieldsRd,
            param_fields_type: fieldsTypeRd,
            handleAfterReload: null,
            handleAfterReloadParams: null,
            deleteCallback: null,
            customParams: "",
            pager_id: "table_rd_bom_pager",
            selectize_page_id: "rd_selectize_page",
            selectize_pageNum_id: "rd_selectize_pageNum"
        }

        TableMultipleOrigin.initTableIds($scope, newTableIdsRd);
        TableMultipleOrigin.reloadPage(newTableIdsRd.idTable);



        $scope.myColumnsRd = ["msisdn","action","content" , "answer","trueAnswer","diamonds","cards", "created"];
        $scope.myColumnsShowRd=[];
        for (var i=0; i<$scope.myColumnsRd.length;i++){
            $scope.myColumnsShowRd.push(true);
        }

        $scope.DatetimeRange = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_rd_bom'], // ** table filter
            Column: 2, // ** number column filter on table
            Scope: $scope
        }
    }

})();