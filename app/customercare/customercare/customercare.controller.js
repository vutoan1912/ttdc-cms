(function(){
    'use strict';
    angular.module('erpApp')
        .controller('CustomerCareController',CustomerCareController)
        .controller('AnswerController',AnswerController)
        .controller('FlipController',FlipController)
        .controller('SuggestController',SuggestController)
        .controller('ConvertController',ConvertController)
        .controller('ChangeController',ChangeController);

    CustomerCareController.$inject = ['$rootScope','$scope','$state','CustomerCareService','AlertService','$translate','variables','$http','$stateParams','$window','TableMultiple','Product','apiData','TranslateCommonUI','masterdataService'];
    function CustomerCareController($rootScope,$scope, $state, CustomerCareService, AlertService,$translate, variables,$http,$stateParams,$window,TableMultiple, Product, apiData, TranslateCommonUI, masterdataService) {

        //Answer
        var fieldsRd = ["msisdn","content" , "answer", "trueAnswer","diamonds","created_at"];
        var fieldsTypeRd = ["Text","Text","Text","Text","Number","DateTime"];
        var loadFunctionRd = CustomerCareService.getAnswer;

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

        //Flip
        var fields = ["msisdn", "content","diamonds" , "created_at"];
        var fieldsType = ["Text","Text","Number","DateTime"];
        var loadFunctionMan = CustomerCareService.getFlip;

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

        //Suggest
        var fieldsSuggest = ["msisdn", "content","diamonds" , "created_at"];
        var fieldsTypeSuggest = ["Text","Text","Number","DateTime"];
        var loadFunctionSuggest = CustomerCareService.getSuggest;

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
            customParams: "",
            pager_id: "table_suggest_pager",
            selectize_page_id: "suggest_selectize_page",
            selectize_pageNum_id: "suggest_selectize_pageNum"
        }

        TableMultiple.initTableIds($scope, newTableIdsSuggest);
        TableMultiple.reloadPage(newTableIdsSuggest.idTable);


        //Convert
        var fieldsConvert = ["msisdn", "cards","diamonds" , "created_at"];
        var fieldsTypeConvert = ["Text","Number","Number","DateTime"];
        var loadFunctionConvert = CustomerCareService.getConvert;

        var newTableIdsConvert = {
            idTable: "table_convert",
            model: "list_convert",
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
            loadFunction: loadFunctionConvert,
            param_fields: fieldsConvert,
            param_fields_type: fieldsTypeConvert,
            handleAfterReload: null,
            handleAfterReloadParams: null,
            deleteCallback: null,
            customParams: "",
            pager_id: "table_convert_pager",
            selectize_page_id: "convert_selectize_page",
            selectize_pageNum_id: "convert_selectize_pageNum"
        }

        TableMultiple.initTableIds($scope, newTableIdsConvert);
        TableMultiple.reloadPage(newTableIdsConvert.idTable);


        //Change
        var fieldsChange = ["msisdn", "content","diamonds" , "created_at"];
        var fieldsTypeChange = ["Text","Text","Number","DateTime"];
        var loadFunctionChange = CustomerCareService.getChange;

        var newTableIdsChange = {
            idTable: "table_change",
            model: "list_change",
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
            loadFunction: loadFunctionChange,
            param_fields: fieldsChange,
            param_fields_type: fieldsTypeChange,
            handleAfterReload: null,
            handleAfterReloadParams: null,
            deleteCallback: null,
            customParams: "",
            pager_id: "table_change_pager",
            selectize_page_id: "change_selectize_page",
            selectize_pageNum_id: "change_selectize_pageNum"
        }

        TableMultiple.initTableIds($scope, newTableIdsChange);
        TableMultiple.reloadPage(newTableIdsChange.idTable);





        $scope.myColumnsRd = ["msisdn","content" , "answer", "trueAnswer","diamonds","created_at"];
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

        $scope.myColumnsConvert = ["msisdn", "cards","diamonds" , "created_at"];
        $scope.myColumnsShowConvert=[];
        for (var i=0; i<$scope.myColumnsConvert.length;i++){
            $scope.myColumnsShowConvert.push(true);
        }

        $scope.myColumnsChange = ["msisdn", "content","diamonds" , "created_at"];
        $scope.myColumnsShowChange=[];
        for (var i=0; i<$scope.myColumnsChange.length;i++){
            $scope.myColumnsShowChange.push(true);
        }


        $scope.checkShow = 1;
        $scope.clickTab = function (num) {
            //console.log(num);
            if(num==1){
                $scope.checkShow = 1;
            }else if(num==2){
                $scope.checkShow = 2;
            }else if(num==3){
                $scope.checkShow = 3;
            }else if(num==4){
                $scope.checkShow = 4;
            }else if(num==5){
                $scope.checkShow = 5;
            }
        }
    }

    AnswerController.$inject = ['$rootScope','$scope','$state','CustomerCareService','AlertService','$translate','variables', 'TableMultiple','$http','$stateParams','$window','apiData'];
    function AnswerController($rootScope,$scope, $state, CustomerCareService, AlertService,$translate, variables, TableMultiple,$http,$stateParams,$window,apiData) {

        $scope.DatetimeRange = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_rd_bom'], // ** table filter
            Column: 5, // ** number column filter on table
            Scope: $scope
        }


    }

    FlipController.$inject = ['$rootScope','$scope','$state','CustomerCareService','AlertService','$translate','variables', 'TableMultiple','$http','$stateParams','$window','apiData'];
    function FlipController($rootScope,$scope, $state, CustomerCareService, AlertService,$translate, variables, TableMultiple,$http,$stateParams,$window,apiData) {
        $scope.DatetimeRange = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_ot'], // ** table filter
            Column: 3, // ** number column filter on table
            Scope: $scope
        }
    }

    SuggestController.$inject = ['$rootScope','$scope','$state','CustomerCareService','AlertService','$translate','variables', 'TableMultiple','$http','$stateParams','$window','apiData'];
    function SuggestController($rootScope,$scope, $state, CustomerCareService, AlertService,$translate, variables, TableMultiple,$http,$stateParams,$window,apiData) {

        $scope.DatetimeRange = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_suggest'], // ** table filter
            Column: 3, // ** number column filter on table
            Scope: $scope
        }


    }

    ConvertController.$inject = ['$rootScope','$scope','$state','CustomerCareService','AlertService','$translate','variables', 'TableMultiple','$http','$stateParams','$window','apiData'];
    function ConvertController($rootScope,$scope, $state, CustomerCareService, AlertService,$translate, variables, TableMultiple,$http,$stateParams,$window,apiData) {

        $scope.DatetimeRange = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_convert'], // ** table filter
            Column: 3, // ** number column filter on table
            Scope: $scope
        }


    }

    ChangeController.$inject = ['$rootScope','$scope','$state','CustomerCareService','AlertService','$translate','variables', 'TableMultiple','$http','$stateParams','$window','apiData'];
    function ChangeController($rootScope,$scope, $state, CustomerCareService, AlertService,$translate, variables, TableMultiple,$http,$stateParams,$window,apiData) {

        $scope.DatetimeRange = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_change'], // ** table filter
            Column: 3, // ** number column filter on table
            Scope: $scope
        }


    }

})();