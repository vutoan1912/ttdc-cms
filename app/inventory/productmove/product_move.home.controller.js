angular
    .module('erpApp')
    .controller('ProductMoveHomeController', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$compile',
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
        'TransferDetail',
        'Product',
        function ($scope, $rootScope, $timeout, $compile, $stateParams, $interval, TableMultiple, $translate, $window, AlertService, $state, $filter, ErrorHandle, apiData, $http,TransferDetail,Product) {
            $scope.chooseValue = {value: 1, title: "Active"}
            ;

            $scope.isLink = false

            $scope.urlOtName = '/api/operation-types/';
            $scope.urlTransfer = '/api/transfers/';
            $scope.urlProduct = '/api/products/';
            $scope.urlLocationName = '/api/locations/';
            $scope.attrName = 'name';
            $scope.attrTransferNumber = 'transferNumber'
            $scope.attrCompleteName = 'displayName';
            $scope.CbxCreatedBy = {
                url: '/api/users/search?query=',
                key: 'email',
                attr: 'email',
                prefix: '#/users/',
                suffix: '/detail'
            }


            $scope.CbxWarehouseD = {
                Placeholder: 'Select warehouse',
                TextField: 'name',
                ValueField: 'id',
                Size: "10",
                Api: "api/warehouses"

            }

            $scope.CbxSequenceD = {
                Placeholder: 'Select sequence',
                TextField: 'name',
                ValueField: 'id',
                Size: "10",
                Api: "api/sequences"
            }

            $scope.CbxLocationD = {
                Placeholder: 'Select location',
                TextField: 'completeName',
                ValueField: 'id',
                Size: "10",
                Api: "api/locations"
            }


            // list view
            angular.element($window).bind('resize', function(){
                $scope.fullsize = {
                    "height":$( window ).height() - 300
                }
            });

            $scope.fullsize = {
                "height":$( window ).height() - 300
            }

            var loadFunction = TransferDetail.getPage;
            var fields = ["id","created", "reference", "productId", "srcLocationId", "destLocationId", "doneQuantity", "uomName","state", "created", "createdBy","updated","updatedBy"];
            var fieldsType = ["Number","DateTime", "Text","MultiNumber","MultiNumber","MultiNumber","Number","Text" ,"Text", "DateTime", "Text", "DateTime", "Text"]
            var newTableIds = {
                idTable: "table_ot",
                model: "details",
                param_allow_show_tooltip: "true",
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

            if(angular.isDefined($stateParams.product_id) && $stateParams.product_id != null){
                $scope.isLink = true
                newTableIds.customParams += "productId==" + $stateParams.product_id;
                Product.getOne($stateParams.product_id).then(function (data) {
                    $scope.product = data
                })
            }

            $scope.isStockQuant = false
            if(angular.isDefined($stateParams.inputPickingMove) && $stateParams.inputPickingMove != null){
                $scope.isLink = true
                $scope.isStockQuant = true
                Product.getOne($stateParams.inputPickingMove.productId).then(function (data) {
                    $scope.product = data
                })
                newTableIds.customParams += "state=='done';lotId==" + $stateParams.inputPickingMove.lotId + ";destPackageId==" + $stateParams.inputPickingMove.destPackageId;
            }

            TableMultiple.initTableIds($scope, newTableIds);
            TableMultiple.sortDefault(newTableIds.idTable);
            TableMultiple.reloadPage(newTableIds.idTable);
            
            $scope.ScheduleDateFilter = {
                dateStart: null,
                dateEnd: null,
                Table: $scope.TABLES['table_ot'], // ** table filter
                Column: 1, // ** number column filter on table
                Scope: $scope
            }
            $scope.DatetimeRange1 = {
                dateStart: null,
                dateEnd: null,
                Table: $scope.TABLES['table_ot'], // ** table filter
                Column: 9, // ** number column filter on table
                Scope: $scope
            }
            $scope.DatetimeRange2 = {
                dateStart: null,
                dateEnd: null,
                Table: $scope.TABLES['table_ot'], // ** table filter
                Column: 11, // ** number column filter on table
                Scope: $scope
            }

            //Cbx product load more
            $scope.CbxTransferDetailInit = {
                url: '/api/transfers', // ** api load data
                OriginParams: '', // ** init params -- default: null
                valueField: 'id', labelField: 'transferNumber', searchField: 'transferNumber', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0
            }
            $scope.CbxTransferDetail = {
                ngModel: [], // ** value select -- array []
                Options: [], // ** list options cbx, default: []
                Table: $scope.TABLES['table_ot'], // ** table filter
                Column: 2, // ** number column filter on table
                Scope: $scope,
                ValueRelatedAfter: [],
                FieldRelatedAfter: 'id',
                ApiAfter: "",
                ValueFieldAfter: '',
                AttrGetFromAfter: '',
                Config: {
                    placeholder:"Reference...",
                    plugins: ['infinite_scroll'], //enable load more
                    maxItems: null,
                    valueField: $scope.CbxTransferDetailInit.valueField,
                    labelField: $scope.CbxTransferDetailInit.labelField,
                    searchField: $scope.CbxTransferDetailInit.searchField,
                    create: false,
                    render: {
                        option: function (data, escape) {
                            return '<div class="option">' + '<span class="title" title="'+escape(data[$scope.CbxTransferDetailInit.labelField]) + '">' + escape(data[$scope.CbxTransferDetailInit.labelField]) + '</span>' + '</div>';
                        },
                        item: function (data, escape) {
                            return '<div class="item" title="'+escape(data[$scope.CbxTransferDetailInit.labelField]) +'">' + escape(data[$scope.CbxTransferDetailInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function (query, callback) {
                        query = JSON.parse(query)
                        $scope.CbxTransferDetailInit.page = query.page || 0;
                        if (!$scope.CbxTransferDetailInit.totalCount || $scope.CbxTransferDetailInit.totalCount > ( ($scope.CbxTransferDetailInit.page - 1) * $scope.CbxTransferDetailInit.perPage)) {
                            var api = apiData.genApi($scope.CbxTransferDetailInit.url, $scope.CbxTransferDetailInit.searchField, query.search, $scope.CbxTransferDetailInit.perPage, null, $scope.CbxTransferDetailInit.OriginParams, query.page);
                            $http.get(api).then(function (response) {
                                $scope.CbxTransferDetailInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                callback(response.data);
                            });
                        } else {
                            callback();
                        }
                    }
                }
            }

            $scope.CbxProductInit = {
                url: '/api/products', // ** api load data
                OriginParams: null, // ** init params -- default: null
                valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0
            }
            $scope.CbxProduct = { // ** replace name cbx
                ngModel: [], // ** value select -- array []
                Options: [], // ** list options cbx, default: []
                Table: $scope.TABLES['table_ot'], // ** table filter
                Column: 3, // ** number column filter on table
                Scope: $scope,
                ValueRelatedBefore:'',
                FieldRelatedBefore: '',
                Config: {
                    placeholder:"Product...",
                    plugins: ['infinite_scroll'],//able load more
                    maxItems: null,
                    valueField: $scope.CbxProductInit.valueField,
                    labelField: $scope.CbxProductInit.labelField,
                    searchField: $scope.CbxProductInit.searchField,
                    create: false,
                    render: {
                        option: function (data, escape) {
                            return '<div class="option">' +
                                '<span class="title" title="'+escape(data[$scope.CbxProductInit.labelField]) + '">' + escape(data[$scope.CbxProductInit.labelField]) + '</span>' +
                                '</div>';
                        },
                        item: function (data, escape) {
                            // return '<div class="item"><a href="' + escape(data[$scope.CbxProductInit.valueField]) + '" target="_blank">' + escape(data[$scope.CbxProductInit.labelField]) + '</a></div>';
                            return '<div class="item" title="'+escape(data[$scope.CbxProductInit.labelField]) +'">' + escape(data[$scope.CbxProductInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function (query, callback) {
                        query = JSON.parse(query)
                        $scope.CbxProductInit.page = query.page || 0;
                        if (!$scope.CbxProductInit.totalCount || $scope.CbxProductInit.totalCount > ( ($scope.CbxProductInit.page - 1) * $scope.CbxProductInit.perPage)) {
                            var api = apiData.genApi($scope.CbxProductInit.url, $scope.CbxProductInit.searchField, query.search, $scope.CbxProductInit.perPage, null, $scope.CbxProductInit.OriginParams, query.page);
                            $http.get(api).then(function (response) {
                                $scope.CbxProductInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                callback(response.data);
                            });
                        } else {
                            callback();
                        }
                    }
                }
            }

            $scope.CbxLocationInit = {
                url: '/api/locations', // ** api load data
                OriginParams: null, // ** init params -- default: null
                valueField: 'id', labelField: 'completeName', searchField: 'completeName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0
            }
            $scope.CbxFrom = { // ** replace name cbx
                ngModel: [], // ** value select -- array []
                Options: [], // ** list options cbx, default: []
                Table: $scope.TABLES['table_ot'], // ** table filter
                Column: 4, // ** number column filter on table
                Scope: $scope,
                ValueRelatedBefore:'',
                FieldRelatedBefore: '',
                Config: {
                    placeholder:"From...",
                    plugins: ['infinite_scroll'],//able load more
                    maxItems: null,
                    valueField: $scope.CbxLocationInit.valueField,
                    labelField: $scope.CbxLocationInit.labelField,
                    searchField: $scope.CbxLocationInit.searchField,
                    create: false,
                    render: {
                        option: function (data, escape) {
                            return '<div class="option">' +
                                '<span class="title" title="'+escape(data[$scope.CbxLocationInit.labelField]) + '">' + escape(data[$scope.CbxLocationInit.labelField]) + '</span>' +
                                '</div>';
                        },
                        item: function (data, escape) {
                            // return '<div class="item"><a href="' + escape(data[$scope.CbxLocationInit.valueField]) + '" target="_blank">' + escape(data[$scope.CbxLocationInit.labelField]) + '</a></div>';
                            return '<div class="item" title="'+escape(data[$scope.CbxLocationInit.labelField]) +'">' + escape(data[$scope.CbxLocationInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function (query, callback) {
                        query = JSON.parse(query)
                        $scope.CbxLocationInit.page = query.page || 0;
                        if (!$scope.CbxLocationInit.totalCount || $scope.CbxLocationInit.totalCount > ( ($scope.CbxLocationInit.page - 1) * $scope.CbxLocationInit.perPage)) {
                            var api = apiData.genApi($scope.CbxLocationInit.url, $scope.CbxLocationInit.searchField, query.search, $scope.CbxLocationInit.perPage, null, $scope.CbxLocationInit.OriginParams, query.page);
                            $http.get(api).then(function (response) {
                                $scope.CbxLocationInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                callback(response.data);
                            });
                        } else {
                            callback();
                        }
                    }
                }
            }

            $scope.CbxTo = { // ** replace name cbx
                ngModel: [], // ** value select -- array []
                Options: [], // ** list options cbx, default: []
                Table: $scope.TABLES['table_ot'], // ** table filter
                Column: 6, // ** number column filter on table
                Scope: $scope,
                ValueRelatedBefore:'',
                FieldRelatedBefore: '',
                Config: {
                    placeholder:"To...",
                    plugins: ['infinite_scroll'],//able load more
                    maxItems: null,
                    valueField: $scope.CbxLocationInit.valueField,
                    labelField: $scope.CbxLocationInit.labelField,
                    searchField: $scope.CbxLocationInit.searchField,
                    create: false,
                    render: {
                        option: function (data, escape) {
                            return '<div class="option">' +
                                '<span class="title" title="'+escape(data[$scope.CbxLocationInit.labelField]) + '">' + escape(data[$scope.CbxLocationInit.labelField]) + '</span>' +
                                '</div>';
                        },
                        item: function (data, escape) {
                            // return '<div class="item"><a href="' + escape(data[$scope.CbxLocationInit.valueField]) + '" target="_blank">' + escape(data[$scope.CbxLocationInit.labelField]) + '</a></div>';
                            return '<div class="item" title="'+escape(data[$scope.CbxLocationInit.labelField]) +'">' + escape(data[$scope.CbxLocationInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function (query, callback) {
                        query = JSON.parse(query)
                        $scope.CbxLocationInit.page = query.page || 0;
                        if (!$scope.CbxLocationInit.totalCount || $scope.CbxLocationInit.totalCount > ( ($scope.CbxLocationInit.page - 1) * $scope.CbxLocationInit.perPage)) {
                            var api = apiData.genApi($scope.CbxLocationInit.url, $scope.CbxLocationInit.searchField, query.search, $scope.CbxLocationInit.perPage, null, $scope.CbxLocationInit.OriginParams, query.page);
                            $http.get(api).then(function (response) {
                                $scope.CbxLocationInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                callback(response.data);
                            });
                        } else {
                            callback();
                        }
                    }
                }
            }

            $scope.stateConfig = {
                create: false,
                maxItems: 1,
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
            };

            $scope.stateOptions = [
                {value:'new',title:'new'},
                {value:'cancelled',title:'cancelled'},
                {value:'waiting_another_move',title:'waiting_another_move'},
                {value:'waiting_availability',title:'waiting_availability'},
                {value:'partial_available',title:'partial_available'},
                {value:'available',title:'available'},
                {value:'done',title:'done'}
            ]




            //handler hide/show columns
            $scope.checkColumnAll = false
            $scope.checkboxType = "container-checkbox"
            $scope.myColumns = ["Date", "Reference", "Product","From","To","Done Quantity","UoM","Status","Created", "Created By", "Update", "Updated By"]
            $scope.myColumnsShow = []
            $scope.defaultColumn = [0,1,2,3,4,5,6,7]
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

            $scope.CbxState = {
                Placeholder: 'Status...',
                Api: "api/transfer-details",
                Table: $scope.TABLES['table_ot'],
                Column: 8,
                Scope: $scope,
                ngModel: ''
            }

            $scope.showDetail = function (id) {
                var selection = window.getSelection();
                if(selection.type != "Range") {
                    $scope.detailId = id
                    if(angular.isDefined($stateParams.product_id) && $stateParams.product_id != null){
                        $state.go('product-move-detail', {id: $scope.detailId,product_id:$stateParams.product_id});
                    } else {
                        $state.go('product-move-detail', {id: $scope.detailId});
                    }
                }


            }

            $scope.stateValue = {
                new:$translate.instant('transfer.common.new'),
                cancelled:$translate.instant('transfer.common.cancelled'),
                waiting_another_move:$translate.instant('transfer.common.waiting_another_move'),
                waiting_availability:$translate.instant('transfer.common.waiting_availability'),
                partial_available:$translate.instant('transfer.common.partial_available'),
                available:$translate.instant('transfer.common.available'),
                done:$translate.instant('transfer.common.done')

            }

            $scope.showState = function (state) {
                return  $scope.stateValue[state]
            }

        }
    ]);

