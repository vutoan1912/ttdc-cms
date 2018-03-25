(function(){
    'use strict';
    angular.module('erpApp')
        .controller('WinningsController',WinningsController)
        .controller('CodeController',CodeController)
        .controller('PrizeController',PrizeController)
        .controller('TopupController',TopupController);

    WinningsController.$inject = ['$rootScope','$scope','$state','WinningsService','AlertService','$translate','variables','$http','$stateParams','$window','TableMultiple','Product','apiData','TranslateCommonUI','masterdataService'];
    function WinningsController($rootScope,$scope, $state, WinningsService, AlertService,$translate, variables,$http,$stateParams,$window,TableMultiple, Product, apiData, TranslateCommonUI, masterdataService) {

        //Code
        var fieldsRd = ["msisdn","code" , "created_at"];
        var fieldsTypeRd = ["Text","Text","DateTime"];
        var loadFunctionRd = WinningsService.getCode;

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

        TableMultiple.initTableIds($scope, newTableIdsRd);
        TableMultiple.reloadPage(newTableIdsRd.idTable);

        //Prize
        var fields = ["msisdn", "content","diamonds" , "created_at"];
        var fieldsType = ["Text","Text","Number","DateTime"];
        var loadFunctionMan = WinningsService.getPrize;

        var newTableIdsMan = {
            idTable: "table_man_bom",
            model: "list_bom_man",
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
            loadFunction: loadFunctionMan,
            param_fields: fields,
            param_fields_type: fieldsType,
            handleAfterReload: null,
            handleAfterReloadParams: null,
            deleteCallback: null,
            customParams: "",
            pager_id: "table_man_bom_pager",
            selectize_page_id: "man_selectize_page",
            selectize_pageNum_id: "man_selectize_pageNum"
        }

        TableMultiple.initTableIds($scope, newTableIdsMan);
        TableMultiple.reloadPage(newTableIdsMan.idTable);

        //Topup
        var fieldsSuggest = ["msisdn", "content","diamonds" , "created_at"];
        var fieldsTypeSuggest = ["Text","Text","Number","DateTime"];
        var loadFunctionSuggest = WinningsService.getTopup;

        var newTableIdsSuggest = {
            idTable: "table_suggest",
            model: "list_suggest",
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
            loadFunction: loadFunctionSuggest,
            param_fields: fieldsSuggest,
            param_fields_type: fieldsTypeSuggest,
            handleAfterReload: null,
            handleAfterReloadParams: null,
            deleteCallback: null,
            customParams: "prizeId=in=(3,4,5,6)",
            pager_id: "table_suggest_pager",
            selectize_page_id: "suggest_selectize_page",
            selectize_pageNum_id: "suggest_selectize_pageNum"
        }

        TableMultiple.initTableIds($scope, newTableIdsSuggest);
        TableMultiple.reloadPage(newTableIdsSuggest.idTable);




        $scope.myColumnsRd = ["msisdn","code" , "created_at"];
        $scope.myColumnsShowRd=[];
        for (var i=0; i<$scope.myColumnsRd.length;i++){
            $scope.myColumnsShowRd.push(true);
        }

        $scope.myColumnsMan = ["msisdn", "content","diamonds" , "created_at"];
        $scope.myColumnsShowMan=[];
        for (var i=0; i<$scope.myColumnsMan.length;i++){
            $scope.myColumnsShowMan.push(true);
        }

        $scope.myColumnsSuggest = ["msisdn", "content","diamonds" , "created_at"];
        $scope.myColumnsShowSuggest=[];
        for (var i=0; i<$scope.myColumnsSuggest.length;i++){
            $scope.myColumnsShowSuggest.push(true);
        }


        $scope.checkShow = 1;
        $scope.clickTab = function (num) {
            console.log(num);
            if(num==1){
                $scope.checkShow = 1;
            }else if(num==2){
                $scope.checkShow = 2;
            }else if(num==3){
                $scope.checkShow = 3;
            }
        }
    }

    CodeController.$inject = ['$rootScope','$scope','$state','WinningsService','AlertService','$translate','variables', 'TableMultiple','$http','$stateParams','$window','apiData'];
    function CodeController($rootScope,$scope, $state, WinningsService, AlertService,$translate, variables, TableMultiple,$http,$stateParams,$window,apiData) {

        $scope.DatetimeRange = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_rd_bom'], // ** table filter
            Column: 2, // ** number column filter on table
            Scope: $scope
        }


    }

    PrizeController.$inject = ['$rootScope','$scope','$state','WinningsService','AlertService','$translate','variables', 'TableMultiple','$http','$stateParams','$window','apiData'];
    function PrizeController($rootScope,$scope, $state, WinningsService, AlertService,$translate, variables, TableMultiple,$http,$stateParams,$window,apiData) {
        $scope.DatetimeRange = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_ot'], // ** table filter
            Column: 3, // ** number column filter on table
            Scope: $scope
        }
    }

    TopupController.$inject = ['$rootScope','$scope','$state','WinningsService','AlertService','$translate','variables', 'TableMultiple','$http','$stateParams','$window','apiData'];
    function TopupController($rootScope,$scope, $state, WinningsService, AlertService,$translate, variables, TableMultiple,$http,$stateParams,$window,apiData) {

        $scope.DatetimeRange = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_suggest'], // ** table filter
            Column: 3, // ** number column filter on table
            Scope: $scope
        }


    }

})();