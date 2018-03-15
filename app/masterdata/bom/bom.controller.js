(function(){
    'use strict';
    angular.module('erpApp')
        .controller('BomController',BomController)
        .controller('BomRdController',BomRdController)
        .controller('BomManController',BomManController);

    BomController.$inject = ['$rootScope','$scope','$state','BomService','AlertService','$translate','variables','$http','$stateParams','$window','TableMultiple','Product','apiData','TranslateCommonUI','masterdataService'];
    function BomController($rootScope,$scope, $state, BomService, AlertService,$translate, variables,$http,$stateParams,$window,TableMultiple, Product, apiData, TranslateCommonUI, masterdataService) {

        TranslateCommonUI.init($scope);
        BomService.init($scope);
        masterdataService.init($scope);
        //$scope.disableBtn = true;

        var fieldsRd = ["id", "productId","productVersion" , "name", "status","created"];
        var fieldsTypeRd = ["Number","MultiNumber","MultiNumber","Text","Number","DateTime"];
        var loadFunctionRd = BomService.getPage;
        // $scope.bomcomponents = [];

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
            loadFunction: loadFunctionRd,
            param_fields: fieldsRd,
            param_fields_type: fieldsTypeRd,
            handleAfterReload: null,
            handleAfterReloadParams: null,
            deleteCallback: null,
            customParams: "type==1",
            pager_id: "table_rd_bom_pager",
            selectize_page_id: "rd_selectize_page",
            selectize_pageNum_id: "rd_selectize_pageNum"
        }

        //console.log($stateParams.product_id)
        if(angular.isDefined($stateParams.product_id) && $stateParams.product_id != null)
            newTableIdsRd.customParams += ";productId==" + $stateParams.product_id;

        TableMultiple.initTableIds($scope, newTableIdsRd);
        TableMultiple.reloadPage(newTableIdsRd.idTable);

        var fields = ["id", "productId","productVersion" , "name", "version", "refBomId"];
        var fieldsType = ["Number","Number","Number","Text","Text","Number"];
        var loadFunction = BomService.getPage;

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
            customParams: "type==2",
            pager_id: "table_man_bom_pager",
            selectize_page_id: "man_selectize_page",
            selectize_pageNum_id: "man_selectize_pageNum"
        }

        if(angular.isDefined($stateParams.product_id) && $stateParams.product_id != null)
            newTableIdsMan.customParams += ";productId==" + $stateParams.product_id;

        TableMultiple.initTableIds($scope, newTableIdsMan);
        TableMultiple.reloadPage(newTableIdsMan.idTable);

        $scope.urlProductName = '/api/products/';
        $scope.attrProductName = 'name';

        $scope.urlProductVersionName = '/api/product-version/search?query=';
        $scope.keyProductVersionName = 'id';
        $scope.attrProductVersionName = 'name';

        $scope.urlRdBomName = '/api/boms/search?query=';
        $scope.keyRdBomName = 'id';
        $scope.attrRdBomName = 'name';

        /*$scope.CbxRdProduct = {
            keySearch : "name",
            size : "10",
            api : "api/products",
            chooseProduct : null
        };
        $scope.productDataSource = {
            serverFiltering: true,
            transport: {
                read: function (options) {
                    //console.log(options);
                    apiData.getSearch(options, $scope.CbxRdProduct.api, $scope.CbxRdProduct.keySearch, $scope.CbxRdProduct.size).then(function (data) {
                        options.success(data);
                    })
                }
            }
        };
        $scope.selectProduct = function () {
            // console.log($scope.CbxRdProduct.chooseProduct);
            if(angular.isDefined($scope.CbxRdProduct.chooseProduct) && $scope.CbxRdProduct.chooseProduct != null){
                $scope.TABLES['table_rd_bom'].param_filter_list[1] = $scope.CbxRdProduct.chooseProduct.id;
                $scope.handleFilter('table_rd_bom');
            } else {
                $scope.TABLES['table_rd_bom'].param_filter_list[1] = "";
                TableMultiple.reloadPage(newTableIdsRd.idTable);
            }
        }*/

        /*$scope.myColumnsRd = ["Product","Product version","R&D Bom version","Status"];
        $scope.myColumnsShowRd=[];
        for (var i=0; i<$scope.myColumnsRd.length;i++){
            $scope.myColumnsShowRd.push(true);
        }

        $scope.myColumnsMan = ["Product","Product version","Man Bom","Man Bom Version","R&D Bom Version"];
        $scope.myColumnsShowMan=[];
        for (var i=0; i<$scope.myColumnsMan.length;i++){
            $scope.myColumnsShowMan.push(true);
        }*/

        $scope.myColumnsRd = ["Product","Product version","R&D Bom version","Status"];
        $scope.myColumnsShowRd=[];
        for (var i=0; i<$scope.myColumnsRd.length-1;i++){
            $scope.myColumnsShowRd.push(true);
        }
        for (var i=$scope.myColumnsRd.length - 1; i<$scope.myColumnsRd.length;i++){
            $scope.myColumnsShowRd.push(false);
        }
        $scope.checkColumnAllRd = false;
        $scope.handleColumnRd = function handleColumn() {
            $scope.checkColumnAllRd = !$scope.checkColumnAllRd;
            if ($scope.checkColumnAllRd){
                for (var i=0; i < $scope.myColumnsShowRd.length;i++){
                    $scope.myColumnsShowRd[i] = true;
                    //  $scope.checkboxType = "container-checkbox-dis"
                }
            } else {
                for (var i=0; i < $scope.myColumnsShowRd.length;i++){
                    $scope.myColumnsShowRd[i] = false;
                    //  $scope.checkboxType = "container-checkbox-dis"
                }
                // $scope.checkboxType = "container-checkbox"
            }
        }

        $scope.myColumnsMan = ["Product","Product version","Man Bom","Man Bom Version","R&D Bom Version"];
        $scope.myColumnsShowMan=[];
        for (var i=0; i<$scope.myColumnsMan.length-1;i++){
            $scope.myColumnsShowMan.push(true);
        }
        for (var i=$scope.myColumnsMan.length - 1; i<$scope.myColumnsMan.length;i++){
            $scope.myColumnsShowMan.push(false);
        }
        $scope.checkColumnAllMan = false;
        $scope.handleColumnMan = function handleColumn() {
            $scope.checkColumnAllMan = !$scope.checkColumnAllMan;
            if ($scope.checkColumnAllMan){
                for (var i=0; i < $scope.myColumnsShowMan.length;i++){
                    $scope.myColumnsShowMan[i] = true;
                    //  $scope.checkboxType = "container-checkbox-dis"
                }
            } else {
                for (var i=0; i < $scope.myColumnsShowMan.length;i++){
                    $scope.myColumnsShowMan[i] = false;
                    //  $scope.checkboxType = "container-checkbox-dis"
                }
                // $scope.checkboxType = "container-checkbox"
            }
        }

        $scope.checkShow = 1;
        $scope.clickTab = function (num) {
            //console.log(num);
            if(num==1){
                $scope.checkShow = 1;
            }else{
                $scope.checkShow = 2;
            }
        }

        /*$("#table_rd_bom").css('min-height', $( window ).height() - 264);
        $("#table_rd_bom").css('max-height', $( window ).height() - 264);
        angular.element($window).bind('resize', function(){
            $("#table_rd_bom").css('min-height', $( window ).height() - 264);
            $("#table_rd_bom").css('max-height', $( window ).height() - 264);
        });

        $("#table_man_bom").css('min-height', $( window ).height() - 264);
        $("#table_man_bom").css('max-height', $( window ).height() - 264);
        angular.element($window).bind('resize', function(){
            $("#table_man_bom").css('min-height', $( window ).height() - 264);
            $("#table_man_bom").css('max-height', $( window ).height() - 264);
        });*/
    }

    BomRdController.$inject = ['$rootScope','$scope','$state','BomService','AlertService','$translate','variables', 'TableMultiple','$http','$stateParams','$window','apiData'];
    function BomRdController($rootScope,$scope, $state, BomService, AlertService,$translate, variables, TableMultiple,$http,$stateParams,$window,apiData) {

        //select search old
        /*$scope.CbxProductRd = {
            Placeholder : 'Select product',
            TextField : 'name',
            ValueField : 'id',
            Size : "10",
            Api : "api/products",
            Table : $scope.TABLES['table_rd_bom'],
            Column : 1,
            Scope : $scope,
            ValueRelatedAfter : null,
            FieldRelatedAfter : 'id',
            ngModel : null,
            ApiAfter : "api/product-version/search?query=",
            ValueFieldAfter : 'id',
            AttrGetFromAfter : 'productId',
            OriginParams: 'type==3'
        }

        $scope.$watch('CbxProductRd.ngModel', function(newVal) {
            // console.log(newVal);
            $scope.CbxProductVersionRd.ValueRelatedBefore = newVal;
        }, true);

        $scope.CbxProductVersionRd = {
            Placeholder : 'Select product version',
            TextField : 'name',
            ValueField : 'id',
            Size : "10",
            Api : "api/product-version",
            Table : $scope.TABLES['table_rd_bom'],
            Column : 2,
            Scope : $scope,
            ValueRelatedBefore : $scope.CbxProductRd.ngModel,
            FieldRelatedBefore : 'productId',
            ngModel : null
        }

        $scope.$watch('CbxProductVersionRd.ngModel', function(newVal) {
            // console.log(newVal);
            $scope.CbxProductRd.ValueRelatedAfter = newVal;
        }, true);*/

        $scope.cutString = function(string){
            if(!string){
                return '';
            }
            var rtn = '';
            var new_string = string;
            while(new_string.length > 22){
                var tmp = new_string.substring(0, 22);
                new_string = new_string.substring(22, new_string.length);
                rtn = rtn + tmp + ' ';
            }
            rtn = rtn + new_string;

            return rtn;
        }

        //fix header
        /*function moveScroll(){
            var scroll = $(window).scrollTop();
            var anchor_top_rd = $("#table_rd_bom").offset().top;
            var anchor_bottom_rd = $("#bottom_anchor_rd").offset().top;
            if (scroll>anchor_top_rd && scroll<anchor_bottom_rd) {
                var clone_table_rd = $("#clone_rd");
                if(clone_table_rd.length == 0){
                    clone_table_rd = $("#table_rd_bom").clone();
                    clone_table_rd.attr('id', 'clone_rd');
                    clone_table_rd.css({position:'fixed' ,
                        'pointer-events': 'none',
                        top: '120px'});
                    clone_table_rd.width($("#table_rd_bom").width());
                    $("#table-container").append(clone_table_rd);
                    $("#clone_rd").css({visibility:'hidden'});
                    $("#clone_rd thead").css({visibility:'visible'
                    });
                }
            } else {
                $("#clone_rd").remove();
            }
        }
        $(window).scroll(moveScroll);*/

        //example datetime range
        /*$scope.DatetimeRange = {
            startDate: null,
            endDate: null,
            table: $scope.TABLES['table_rd_bom'],
            column: 5,
            scopecontroller: $scope
        }*/

        //date time range new
        /*$scope.DatetimeRange = {
            dateStart: null,
            dateEnd: null,
            Table : $scope.TABLES['table_rd_bom'], // ** table filter
            Column : 5, // ** number column filter on table
            Scope : $scope
        }*/

        //date range new
        /*$scope.DateRange = {
            dateStart: null,
            dateEnd: null,
            Table : $scope.TABLES['table_rd_bom'], // ** table filter
            Column : 5, // ** number column filter on table
            Scope : $scope
        }*/

        //Filter status
        $scope.CbxStatus = {
            Placeholder : 'Select status',
            TextField : 'name',
            ValueField : 'id',
            Table : $scope.TABLES['table_rd_bom'],
            Column : 4,
            Scope : $scope,
            ngModel : null,
            DataSource : [
                {id:0, name: 'DRAFT'},
                {id:1, name: 'APPROVE'},
                {id:2, name: 'WAIT FOR APPROVE'},
                {id:3, name: 'REJECT'}
            ]
        }

        $scope.mappingStatus = function (status) {
            switch(status) {
                case 0:
                    return 'DRAFT';
                    break;
                case 2:
                    return 'WAIT FOR APPROVE';
                    break;
                case 3:
                    return 'REJECT';
                    break;
                default:
                    return 'APPROVE';
            }
        }

        //Cbx product load more
        $scope.cbxProductRdInit = {
            url: '/api/products', // ** api load data
            OriginParams: "type==3", // ** init params -- default: null
            MoreParams: null, // ** filter params => reload cbx options -- default: null
            queryRelate : null, // ** init query relate cbx -- default: null
            valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
            perPage: 10, totalCount: null, page: 0, resetScroll: false
        }
        $scope.cbxProductRd = {
            ngModel : [], // ** value select -- array []
            ngModelObject : [],
            Options: [], // ** list options cbx, default: []
            Table : $scope.TABLES['table_rd_bom'], // ** table filter
            Column : 1, // ** number column filter on table
            Scope : $scope,
            ValueRelatedAfter : null,
            FieldRelatedAfter : 'id',
            ApiAfter : "api/product-version/search?query=",
            KeyFieldAfter : 'id',
            GetFieldAfter : 'productId',
            Config: {
                plugins: ['infinite_scroll'], //enable load more
                maxItems: 1,
                valueField: $scope.cbxProductRdInit.valueField,
                labelField: $scope.cbxProductRdInit.labelField,
                searchField: $scope.cbxProductRdInit.searchField,
                create: false,
                render: {
                    option: function(data, escape) {
                        return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxProductRdInit.labelField]) + '</span>' + '</div>';
                    },
                    item: function(data, escape) {
                        return '<div class="item"><a href="' + escape(data[$scope.cbxProductRdInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxProductRdInit.labelField]) + '</a></div>';
                    }
                },
                //use load event if use load more
                load: function(query, callback) {
                    //$scope.cbxProductRd.ngModel = -1;
                    query = JSON.parse(query)
                    //console.log(query)
                    if($scope.cbxProductRdInit.resetScroll){
                        //console.log('init query.page = 0')
                        query.page = 0;
                        callback($scope.cbxProductRdInit.resetScroll);
                        $scope.cbxProductRdInit.resetScroll = false;
                    }
                    $scope.cbxProductRdInit.page = query.page || 0;
                    if(!$scope.cbxProductRdInit.totalCount || $scope.cbxProductRdInit.totalCount > ( ($scope.cbxProductRdInit.page - 1) * $scope.cbxProductRdInit.perPage) ){
                        var api = apiData.genApi($scope.cbxProductRdInit.url, $scope.cbxProductRdInit.searchField, query.search, $scope.cbxProductRdInit.perPage, null, $scope.cbxProductRdInit.OriginParams,query.page,$scope.cbxProductRdInit.queryRelate);
                        $http.get(api).then(function (response) {
                            $scope.cbxProductRdInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                            callback(response.data);
                        });
                    }
                }
            }
        }
        $scope.$watch('cbxProductRd.ngModel', function(newVal) {
            // console.log(newVal);
            $scope.cbxProductVersionRd.ValueRelatedBefore = newVal;
        }, true);
        /*$scope.$watch('cbxProductRd.ngModelObject', function(newVal) {
            console.log(newVal);
        }, true);*/
        //end Cbx product load more

        //Cbx product version load more
        $scope.cbxProductVersionRdInit = {
            url: '/api/product-version', // ** api load data
            OriginParams: null, // ** init params -- default: null
            queryRelate : null, // ** init query relate cbx -- default: null
            valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
            perPage: 10, totalCount: null, page: 0, resetScroll: false
        }
        $scope.cbxProductVersionRd = { // ** replace name cbx
            ngModel : [], // ** value select -- array []
            ngModelObject : [],
            Options: [], // ** list options cbx, default: []
            Table : $scope.TABLES['table_rd_bom'], // ** table filter
            Column : 2, // ** number column filter on table
            Scope : $scope,
            ValueRelatedBefore : $scope.cbxProductRd.ngModel,
            FieldRelatedBefore : 'productId',
            Config: {
                plugins: ['infinite_scroll'],//enable load more
                //closeAfterSelect: true,
                //openOnFocus: false,
                maxItems: 1,
                valueField: $scope.cbxProductVersionRdInit.valueField,
                labelField: $scope.cbxProductVersionRdInit.labelField,
                searchField: $scope.cbxProductVersionRdInit.searchField,
                create: false,
                render: {
                    option: function(data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(data[$scope.cbxProductVersionRdInit.labelField]) + '</span>' +
                            '</div>';
                    },
                    item: function(data, escape) {
                        return '<div class="item"><a href="' + escape(data[$scope.cbxProductVersionRdInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxProductVersionRdInit.labelField]) + '</a></div>';
                    }
                },
                //use load event if use load more
                load: function(query, callback) {
                    //$scope.cbxProductVersionRd.ngModel = -1;
                    //console.log('run load')
                    query = JSON.parse(query)
                    //console.log(query)
                    if($scope.cbxProductVersionRdInit.resetScroll){
                        //console.log('init query.page = 0')
                        query.page = 0;
                        callback($scope.cbxProductVersionRdInit.resetScroll);
                        $scope.cbxProductVersionRdInit.resetScroll = false;
                    }
                    $scope.cbxProductVersionRdInit.page = query.page || 0;

                    if(!$scope.cbxProductVersionRdInit.totalCount || $scope.cbxProductVersionRdInit.totalCount > ( ($scope.cbxProductVersionRdInit.page-1) * $scope.cbxProductVersionRdInit.perPage) ){
                        //console.log('callback')
                        var api = apiData.genApi($scope.cbxProductVersionRdInit.url, $scope.cbxProductVersionRdInit.searchField, query.search, $scope.cbxProductVersionRdInit.perPage, null, $scope.cbxProductVersionRdInit.OriginParams,query.page,$scope.cbxProductVersionRdInit.queryRelate);
                        //console.log(api)
                        $http.get(api).then(function (response) {
                            $scope.cbxProductVersionRdInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                            callback(response.data);
                        });
                    }
                }
            }
        }
        $scope.$watch('cbxProductVersionRd.ngModel', function(newVal) {
            // console.log(newVal);
            $scope.cbxProductRd.ValueRelatedAfter = newVal;
        }, true);
        /*$scope.$watch('cbxProductVersionRd.ngModelObject', function(newVal) {
            console.log(newVal);
        }, true);*/

    }

    BomManController.$inject = ['$rootScope','$scope','$state','BomService','AlertService','$translate','variables', 'TableMultiple','$http','$stateParams','$window','apiData'];
    function BomManController($rootScope,$scope, $state, BomService, AlertService,$translate, variables, TableMultiple,$http,$stateParams,$window,apiData) {

        //select search old
        /*$scope.CbxProductMan = {
            Placeholder : 'Select product',
            TextField : 'name',
            ValueField : 'id',
            Size : "10",
            Api : "api/products",
            Table : $scope.TABLES['table_man_bom'],
            Column : 1,
            Scope : $scope,
            ValueRelatedAfter : null,
            FieldRelatedAfter : 'id',
            ngModel : null,
            ApiAfter : "api/product-version/search?query=",
            ValueFieldAfter : 'id',
            AttrGetFromAfter : 'productId',
            OriginParams: 'type==3'
        }

        $scope.$watch('CbxProductMan.ngModel', function(newVal) {
            // console.log(newVal);
            $scope.CbxProductVersionMan.ValueRelatedBefore = newVal;
        }, true);

        $scope.CbxProductVersionMan = {
            Placeholder : 'Select product version',
            TextField : 'name',
            ValueField : 'id',
            Size : "10",
            Api : "api/product-version",
            Table : $scope.TABLES['table_man_bom'],
            Column : 2,
            Scope : $scope,
            ValueRelatedBefore : $scope.CbxProductMan.ngModel,
            FieldRelatedBefore : 'productId',
            ngModel : null
        }

        $scope.$watch('CbxProductVersionMan.ngModel', function(newVal) {
            // console.log(newVal);
            $scope.CbxProductMan.ValueRelatedAfter = newVal;
        }, true);*/


        //Cbx product load more
        $scope.cbxProductManInit = {
            url: '/api/products', // ** api load data
            OriginParams: "type==3", // ** init params -- default: null
            queryRelate : null, // ** init query relate cbx -- default: null
            valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
            perPage: 10, totalCount: null, page: 0, resetScroll: false
        }
        $scope.cbxProductMan = {
            ngModel : [], // ** value select -- array []
            Options: [], // ** list options cbx, default: []
            Table : $scope.TABLES['table_man_bom'], // ** table filter
            Column : 1, // ** number column filter on table
            Scope : $scope,
            ValueRelatedAfter : null,
            FieldRelatedAfter : 'id',
            ApiAfter : "api/product-version/search?query=",
            KeyFieldAfter : 'id',
            GetFieldAfter : 'productId',
            Config: {
                plugins: ['infinite_scroll'], //enable load more
                maxItems: 1,
                valueField: $scope.cbxProductManInit.valueField,
                labelField: $scope.cbxProductManInit.labelField,
                searchField: $scope.cbxProductManInit.searchField,
                create: false,
                render: {
                    option: function(data, escape) {
                        return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxProductManInit.labelField]) + '</span>' + '</div>';
                    },
                    item: function(data, escape) {
                        return '<div class="item"><a href="' + escape(data[$scope.cbxProductManInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxProductManInit.labelField]) + '</a></div>';
                    }
                },
                //use load event if use load more
                load: function(query, callback) {
                    $scope.cbxProductMan.ngModel = -1;
                    query = JSON.parse(query)
                    //console.log(query)
                    if($scope.cbxProductManInit.resetScroll){
                        //console.log('init query.page = 0')
                        query.page = 0;
                        callback($scope.cbxProductManInit.resetScroll);
                        $scope.cbxProductManInit.resetScroll = false;
                    }
                    $scope.cbxProductManInit.page = query.page || 0;
                    if(!$scope.cbxProductManInit.totalCount || $scope.cbxProductManInit.totalCount > ( ($scope.cbxProductManInit.page - 1) * $scope.cbxProductManInit.perPage) ){
                        var api = apiData.genApi($scope.cbxProductManInit.url, $scope.cbxProductManInit.searchField, query.search, $scope.cbxProductManInit.perPage, null, $scope.cbxProductManInit.OriginParams,query.page,$scope.cbxProductManInit.queryRelate);
                        $http.get(api).then(function (response) {
                            $scope.cbxProductManInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                            callback(response.data);
                        });
                    }
                }
            }
        }
        $scope.$watch('cbxProductMan.ngModel', function(newVal) {
            // console.log(newVal);
            $scope.cbxProductVersionMan.ValueRelatedBefore = newVal;
        }, true);
        //end Cbx product load more

        //Cbx product version load more
        $scope.cbxProductVersionManInit = {
            url: '/api/product-version', // ** api load data
            OriginParams: null, // ** init params -- default: null
            queryRelate : null, // ** init query relate cbx -- default: null
            valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
            perPage: 10, totalCount: null, page: 0, resetScroll: false
        }
        $scope.cbxProductVersionMan = { // ** replace name cbx
            ngModel : [], // ** value select -- array []
            Options: [], // ** list options cbx, default: []
            Table : $scope.TABLES['table_man_bom'], // ** table filter
            Column : 2, // ** number column filter on table
            Scope : $scope,
            ValueRelatedBefore : $scope.cbxProductMan.ngModel,
            FieldRelatedBefore : 'productId',
            Config: {
                plugins: ['infinite_scroll'],//enable load more
                maxItems: 1,
                valueField: $scope.cbxProductVersionManInit.valueField,
                labelField: $scope.cbxProductVersionManInit.labelField,
                searchField: $scope.cbxProductVersionManInit.searchField,
                create: false,
                render: {
                    option: function(data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(data[$scope.cbxProductVersionManInit.labelField]) + '</span>' +
                            '</div>';
                    },
                    item: function(data, escape) {
                        return '<div class="item"><a href="' + escape(data[$scope.cbxProductVersionManInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxProductVersionManInit.labelField]) + '</a></div>';
                    }
                },
                //use load event if use load more
                load: function(query, callback) {
                    //console.log('run load')
                    $scope.cbxProductVersionMan.ngModel = -1;
                    query = JSON.parse(query)
                    //console.log(query)
                    if($scope.cbxProductVersionManInit.resetScroll){
                        //console.log('init query.page = 0')
                        query.page = 0;
                        callback($scope.cbxProductVersionManInit.resetScroll);
                        $scope.cbxProductVersionManInit.resetScroll = false;
                    }
                    $scope.cbxProductVersionManInit.page = query.page || 0;
                    if(!$scope.cbxProductVersionManInit.totalCount || $scope.cbxProductVersionManInit.totalCount > ( ($scope.cbxProductVersionManInit.page - 1) * $scope.cbxProductVersionManInit.perPage) ){
                        var api = apiData.genApi($scope.cbxProductVersionManInit.url, $scope.cbxProductVersionManInit.searchField, query.search, $scope.cbxProductVersionManInit.perPage, null, $scope.cbxProductVersionManInit.OriginParams,query.page,$scope.cbxProductVersionManInit.queryRelate);
                        // console.log(api)
                        $http.get(api).then(function (response) {
                            $scope.cbxProductVersionManInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                            callback(response.data);
                        });
                    }
                }
            }
        }
        $scope.$watch('cbxProductVersionMan.ngModel', function(newVal) {
            // console.log(newVal);
            $scope.cbxProductMan.ValueRelatedAfter = newVal;
        }, true);


        $scope.CbxRdBom = {
            Placeholder : 'Select R&D BOM',
            TextField : 'name',
            ValueField : 'id',
            Size : "10",
            Api : "api/boms",
            Table : $scope.TABLES['table_man_bom'],
            Column : 5,
            Scope : $scope,
            ngModel : null
        }

        $scope.cutString = function(string){
            if(!string){
                return '';
            }
            var rtn = '';
            var new_string = string;
            while(new_string.length > 22){
                var tmp = new_string.substring(0, 22);
                new_string = new_string.substring(22, new_string.length);
                rtn = rtn + tmp + ' ';
            }
            rtn = rtn + new_string;

            return rtn;
        }

        /*function moveScroll(){
            var scroll = $(window).scrollTop();
            var anchor_top_man = $("#table_man_bom").offset().top;
            var anchor_bottom_man = $("#bottom_anchor_man").offset().top;
            if (scroll>anchor_top_man && scroll<anchor_bottom_man) {
                var clone_table_man = $("#clone_man");
                if(clone_table_man.length == 0){
                    clone_table_man = $("#table_man_bom").clone();
                    clone_table_man.attr('id', 'clone_man');
                    clone_table_man.css({position:'fixed' ,
                        'pointer-events': 'none',
                        top: '120px'});
                    clone_table_man.width($("#table_man_bom").width());
                    $("#table-container").append(clone_table_man);
                    $("#clone_man").css({visibility:'hidden'});
                    $("#clone_man thead").css({visibility:'visible'
                    });
                }
            } else {
                $("#clone_man").remove();
            }
        }
        $(window).scroll(moveScroll);*/

    }

})();