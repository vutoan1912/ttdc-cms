angular
    .module('erpApp')
    .controller('StockQuantityHomeController', [
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
        'StockQuantity',
        'Product',
        'Location',
        function ($scope, $rootScope, $timeout, $compile, $stateParams, $interval, TableMultiple, $translate, $window, AlertService, $state, $filter, ErrorHandle, apiData, $http,StockQuantity,Product,Location) {
            $scope.chooseValue = {value: 1, title: "Active"}
            ;

            $scope.isLink = false
            $scope.isProductLink = false
            $scope.isLocationLink = false

            $scope.urlOtName = '/api/operation-types/';
            $scope.urlTransfer = '/api/transfers/';
            $scope.urlProduct = '/api/products/';
            $scope.urlLocationName = '/api/locations/';
            $scope.attrName = 'name';
            $scope.attrTransferNumber = 'transferNumber'
            $scope.attrCompleteName = 'displayName';

            $scope.urlLot = '/api/lots/';
            $scope.attrLotNumber = "lotNumber"

            $scope.urlPackage = '/api/packages/';
            $scope.attrPackageNumber = "packageNumber"

            $scope.urlProductManufacturerName = '/api/companies/';
            $scope.attrProductManufacturerCode = 'companyCode';

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

            var loadFunction = StockQuantity.getPage;
            var fields = ["id","productId","manId","manPn", "locationId", "lotId", "packageId", "reserved", "onhand", "uomName", "created", "createdBy","updated","updatedBy"];
            var fieldsType = ["Number","MultiNumber","MultiNumber","Text", "MultiNumber","MultiNumber","MultiNumber","Number","Number","Text" , "DateTime", "Text", "DateTime", "Text"]
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
                $scope.isProductLink = true
                if(newTableIds.customParams ==""){
                    newTableIds.customParams += "productId==" + $stateParams.product_id;
                } else {
                    newTableIds.customParams += ";productId==" + $stateParams.product_id;
                }

                Product.getOne($stateParams.product_id).then(function (data) {
                    $scope.product = data
                })
            }

            if(angular.isDefined($stateParams.location_id) && $stateParams.location_id != null){
                $scope.isLink = true
                $scope.isLocationLink = true
                if(newTableIds.customParams ==""){
                    newTableIds.customParams += "locationId==" + $stateParams.location_id;
                } else {
                    newTableIds.customParams += ";locationId==" + $stateParams.location_id;
                }
                Location.getOne($stateParams.location_id).then(function (data) {
                    $scope.location = data
                })
            }

            TableMultiple.initTableIds($scope, newTableIds);
            TableMultiple.sortDefault(newTableIds.idTable);
            TableMultiple.reloadPage(newTableIds.idTable);

            $scope.DatetimeRange1 = {
                dateStart: null,
                dateEnd: null,
                Table: $scope.TABLES['table_ot'], // ** table filter
                Column: 10, // ** number column filter on table
                Scope: $scope
            }
            $scope.DatetimeRange2 = {
                dateStart: null,
                dateEnd: null,
                Table: $scope.TABLES['table_ot'], // ** table filter
                Column: 12, // ** number column filter on table
                Scope: $scope
            }

            //Cbx product load more
            $scope.CbxLotInit = {
                url: '/api/lots', // ** api load data
                OriginParams: '', // ** init params -- default: null
                valueField: 'id', labelField: 'lotNumber', searchField: 'lotNumber', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0
            }
            $scope.CbxLot = {
                ngModel: [], // ** value select -- array []
                Options: [], // ** list options cbx, default: []
                Table: $scope.TABLES['table_ot'], // ** table filter
                Column: 5, // ** number column filter on table
                Scope: $scope,
                ValueRelatedAfter: [],
                FieldRelatedAfter: 'id',
                ApiAfter: "",
                ValueFieldAfter: '',
                AttrGetFromAfter: '',
                Config: {
                    placeholder:"Lot/Serial number...",
                    plugins: ['infinite_scroll'], //enable load more
                    maxItems: null,
                    valueField: $scope.CbxLotInit.valueField,
                    labelField: $scope.CbxLotInit.labelField,
                    searchField: $scope.CbxLotInit.searchField,
                    create: false,
                    render: {
                        option: function (data, escape) {
                            return '<div class="option">' + '<span class="title" title="'+escape(data[$scope.CbxLotInit.labelField]) + '">' + escape(data[$scope.CbxLotInit.labelField]) + '</span>' + '</div>';
                        },
                        item: function (data, escape) {
                            return '<div class="item" title="'+escape(data[$scope.CbxLotInit.labelField]) +'">' + escape(data[$scope.CbxLotInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function (query, callback) {
                        query = JSON.parse(query)
                        $scope.CbxLotInit.page = query.page || 0;
                        if (!$scope.CbxLotInit.totalCount || $scope.CbxLotInit.totalCount > ( ($scope.CbxLotInit.page - 1) * $scope.CbxLotInit.perPage)) {
                            var api = apiData.genApi($scope.CbxLotInit.url, $scope.CbxLotInit.searchField, query.search, $scope.CbxLotInit.perPage, null, $scope.CbxLotInit.OriginParams, query.page);
                            $http.get(api).then(function (response) {
                                $scope.CbxLotInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                callback(response.data);
                            });
                        } else {
                            callback();
                        }
                    }
                }
            }


            $scope.CbxPackageInit = {
                url: '/api/packages', // ** api load data
                OriginParams: '', // ** init params -- default: null
                valueField: 'id', labelField: 'packageNumber', searchField: 'packageNumber', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0
            }
            $scope.CbxPackage = {
                ngModel: [], // ** value select -- array []
                Options: [], // ** list options cbx, default: []
                Table: $scope.TABLES['table_ot'], // ** table filter
                Column: 6, // ** number column filter on table
                Scope: $scope,
                ValueRelatedAfter: [],
                FieldRelatedAfter: 'id',
                ApiAfter: "",
                ValueFieldAfter: '',
                AttrGetFromAfter: '',
                Config: {
                    placeholder:"Package...",
                    plugins: ['infinite_scroll'], //enable load more
                    maxItems: null,
                    valueField: $scope.CbxPackageInit.valueField,
                    labelField: $scope.CbxPackageInit.labelField,
                    searchField: $scope.CbxPackageInit.searchField,
                    create: false,
                    render: {
                        option: function (data, escape) {
                            return '<div class="option">' + '<span class="title" title="'+escape(data[$scope.CbxPackageInit.labelField]) + '">' + escape(data[$scope.CbxPackageInit.labelField]) + '</span>' + '</div>';
                        },
                        item: function (data, escape) {
                            return '<div class="item" title="'+escape(data[$scope.CbxPackageInit.labelField]) +'">' + escape(data[$scope.CbxPackageInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function (query, callback) {
                        query = JSON.parse(query)
                        $scope.CbxPackageInit.page = query.page || 0;
                        if (!$scope.CbxPackageInit.totalCount || $scope.CbxPackageInit.totalCount > ( ($scope.CbxPackageInit.page - 1) * $scope.CbxPackageInit.perPage)) {
                            var api = apiData.genApi($scope.CbxPackageInit.url, $scope.CbxPackageInit.searchField, query.search, $scope.CbxPackageInit.perPage, null, $scope.CbxPackageInit.OriginParams, query.page);
                            $http.get(api).then(function (response) {
                                $scope.CbxPackageInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
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
                Column: 1, // ** number column filter on table
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

            $scope.CbxVNPTInit = {
                url: '/api/product-man', // ** api load data
                OriginParams: null, // ** init params -- default: null
                valueField: 'manufacturerId', labelField: 'internalReference', searchField: 'internalReference', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0
            }

            $scope.CbxVNPT = { // ** replace name cbx
                ngModel: [], // ** value select -- array []
                Options: [], // ** list options cbx, default: []
                Table: $scope.TABLES['table_ot'], // ** table filter
                Column: 2, // ** number column filter on table
                Scope: $scope,
                ValueRelatedBefore:'',
                FieldRelatedBefore: '',
                Config: {
                    placeholder:"VNPT ManPN...",
                    plugins: ['infinite_scroll'],//able load more
                    maxItems: null,
                    valueField: $scope.CbxVNPTInit.valueField,
                    labelField: $scope.CbxVNPTInit.labelField,
                    searchField: $scope.CbxVNPTInit.searchField,
                    create: false,
                    render: {
                        option: function (data, escape) {
                            return '<div class="option">' +
                                '<span class="title" title="'+escape(data[$scope.CbxVNPTInit.labelField]) + '">' + escape(data[$scope.CbxVNPTInit.labelField]) + '</span>' +
                                '</div>';
                        },
                        item: function (data, escape) {
                            // return '<div class="item"><a href="' + escape(data[$scope.CbxVNPTInit.valueField]) + '" target="_blank">' + escape(data[$scope.CbxVNPTInit.labelField]) + '</a></div>';
                            return '<div class="item" title="'+escape(data[$scope.CbxVNPTInit.labelField]) +'">' + escape(data[$scope.CbxVNPTInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function (query, callback) {
                        query = JSON.parse(query)
                        $scope.CbxVNPTInit.page = query.page || 0;
                        if (!$scope.CbxVNPTInit.totalCount || $scope.CbxVNPTInit.totalCount > ( ($scope.CbxVNPTInit.page - 1) * $scope.CbxVNPTInit.perPage)) {
                            var api = apiData.genApi($scope.CbxVNPTInit.url, $scope.CbxVNPTInit.searchField, query.search, $scope.CbxVNPTInit.perPage, null, $scope.CbxVNPTInit.OriginParams, query.page);
                            $http.get(api).then(function (response) {
                                $scope.CbxVNPTInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
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
                    placeholder:"Location...",
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


            //handler hide/show columns
            $scope.checkColumnAll = false
            $scope.checkboxType = "container-checkbox"
            $scope.myColumns = ["Product","VNPT ManPN","Man P/N", "Location", "Lot/Serial Number","Package","Reserved","On Hand","UoM","Created", "Created By", "Update", "Updated By"]
            $scope.myColumnsShow = []
            $scope.defaultColumn = [0,1,2,3,4,5,6,7,8]
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
                    $timeout(function(){
                        angular.element("#linkToDetail").trigger("click");
                    })
                }


            }


        }
    ]);

