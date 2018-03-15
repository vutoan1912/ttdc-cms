angular
    .module('erpApp')
    .controller('TransferScrapController', [
        '$scope',
        '$rootScope',
        '$state',
        '$timeout',
        '$compile',
        '$stateParams',
        '$interval',
        'TableMultiple',
        'Transfer',
        'TransferItem',
        '$translate',
        'TranslateCommonUI',
        'ErrorHandle',
        'AlertService',
        '$window',
        'OperationType',
        'Location',
        'Principal',
        'utils','apiData','$http',
        function ($scope, $rootScope, $state, $timeout, $compile, $stateParams, $interval, TableMultiple, Transfer, TransferItem, $translate, TranslateCommonUI, ErrorHandle, AlertService, $window, OperationType, Location, Principal,utils,apiData,$http) {
           $scope.id_transfer = $stateParams.transferId;
            Transfer.getOne($stateParams.transferId).then(function (data) {
                $scope.transfer = data;

            })
            //page create
            if (angular.element('#form_create_scrap_transfer').length) {

                Transfer.getOne($stateParams.transferId).then(function (data) {
                    $scope.transfer = data;
                    $scope.status =  $scope.transfer.state;
                    $scope.urlSourceLink = '#/operation-types/'+ $scope.transfer.operationTypeId +'/details';
                    $scope.urlSourceLinkProduct = '#/products/'+ $scope.transfer.productVersionId +'/details';
                    $scope.urlLocName = '/api/operation-types/';
                    $scope.urlGetPartner = '/api/companies/';
                    $scope.urlGetLocation = '/api/locations/';
                    $scope.urlGetUser = '/api/users/';
                    $scope.attrName = 'name';
                    $scope.attrUser = 'email';
                    //console.log($scope.bomDetail);
                })
                // if(angular.isDefined($stateParams.transferId) && $stateParams.transferId != null)
                //     newTableIdsRd.customParams += "transferId==" + $stateParams.transferId;
                // TableMultiple.reloadPage(newTableIdsRd.idTable);
                //
                // if(angular.isDefined($stateParams.transferId) && $stateParams.transferId != null)
                //     newTableIdsDetail.customParams += "transferId==" + $stateParams.transferId;
                // TableMultiple.reloadPage(newTableIdsDetail.idTable);
                //end control for transfer detail
            }

            if (angular.element('#page_content_inner_2').length) {
                $scope.myColumnsRd = ["VNPT P/N","Description","Man P/N","Lot","Package","Quantity","Owner","Location","Scrap Location"];
                $scope.myColumnsShowRd=[];
                for (var i=0; i<$scope.myColumnsRd.length;i++){
                    $scope.myColumnsShowRd.push(true);
                }
                $scope.list_op_item = [];

                $scope.urlProductName = '/api/products/';
                $scope.attrProductDes = 'description';
                $scope.createItem = {};
                $scope.validateCreateNewItemSuccess = false;
                $scope.isNewItem = false;

                $scope.$watch('createItem.productId', function(newval) {
                    $scope.validateCreateNewItemSuccess =
                        ($scope.createItem.productId != null)
                });

                $scope.addNewItem = function () {
                    $scope.isNewItem = !$scope.isNewItem
                    $scope.createItem = {}
                    $scope.createItem.productId = null
                }

                $scope.createNewItem = function () {
                    $('#form_create_operation').parsley();

                    if($scope.form_create_operation.$valid && $scope.validateCreateNewItemSuccess){
                        var exist = 0;
                        for(var i = 0; i < $scope.list_op_item.length; i++) {
                            if($scope.list_op_item[i].productId == $scope.createItem.productId) {
                                exist = 1;
                                break;
                            }
                        }

                        if(exist == 0) {
                            $scope.list_op_item.push($scope.createItem)
                            $scope.isNewItem = false
                            $scope.createItem = {}
                            $scope.createItem.productId = null
                        } else {
                            AlertService.error("VNPT P/N is already added")
                        }
                    }
                }

                $scope.removeSub = function (index) {
                    if (index > -1) {
                        $scope.list_op_item.splice(index, 1);
                    }
                }

                $scope.edit = function($event,index){
                    $event.preventDefault();
                    $scope.entity = $scope.list_op_item[index];
                    $scope.entity.index = index;
                    $scope.entity.editable = true;
                    $scope.entity.saveClass = '';
                };

                $scope.delete = function($event,index,userIndex){
                    $event.preventDefault();
                    UIkit.modal.confirm('Remove this row (id:'+userIndex+')?', function(){
                        $scope.list_op_item.splice(index,1);
                    });
                };

                $scope.save = function($event,index){
                    $event.preventDefault();
                    var exist = 0;
                    for(var i = 0; i < $scope.list_op_item.length; i++) {
                        if((i != index) && ($scope.list_op_item[i].productId == $scope.list_op_item[index].productId)) {
                            exist = 1;
                            break;
                        }
                    }

                    if(exist == 0) {
                        $scope.list_op_item[index].editable = false;
                    } else {
                        AlertService.error("VNPT P/N is already used")
                    }

                };

                if (angular.element('#form_create_operation').length) {
                    $scope.required_msg = 'transfer.messages.required';

                    var $formValidate = $('#form_create_operation');
                    $formValidate
                        .parsley({
                            'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
                        })
                        .on('form:validated',function() {
                            $scope.$apply();
                        })
                        .on('field:validated',function(parsleyField) {
                            if($(parsleyField.$element).hasClass('md-input')) {
                                $scope.$apply();
                            }
                        });
                }


                //Cbx product load more
                $scope.cbxProductRdInit = {
                    url: '/api/transfer-details', // ** api load data
                    OriginParams: "transferId=="+ $scope.id_transfer, // ** init params -- default: null
                    queryRelate : null, // ** init query relate cbx -- default: null
                    valueField: 'productId', labelField: 'productName', searchField: 'productName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false
                }
                $scope.cbxProductRd = {
                    ngModel : [], // ** value select -- array []
                    Options: [], // ** list options cbx, default: []
                    Scope : $scope,
                    ValueRelatedAfter : null,
                    FieldRelatedAfter : 'id',
                    ApiAfter : "api/transfer-details/search?query=",
                    KeyFieldAfter : 'productId',
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
                //end Cbx product load more

                //Cbx product load more
                $scope.cbxProductVersionRdInit = {
                    url: '/api/transfer-details', // ** api load data
                    OriginParams: "transferId=="+ $scope.id_transfer, // ** init params -- default: null
                    queryRelate : null, // ** init query relate cbx -- default: null
                    valueField: 'manPn', labelField: 'manPn', searchField: 'manPn', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false
                }
                $scope.cbxProductVersionRd = { // ** replace name cbx
                    ngModel : [], // ** value select -- array []
                    Options: [], // ** list options cbx, default: []
                    Scope : $scope,
                    //before
                    ValueRelatedBefore : $scope.cbxProductRd.ngModel,
                    FieldRelatedBefore : 'productId',
                    //after
                    ValueRelatedAfter : $scope.cbxPackage.ngModel,
                    FieldRelatedAfter : 'manPn',
                    ApiAfter : "api/transfer-details/search?query=",
                    KeyFieldAfter : 'manPn',
                    GetFieldAfter : 'manPn',
                    Config: {
                        plugins: ['infinite_scroll'],//enable load more
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
                            if(!$scope.cbxProductVersionRdInit.totalCount || $scope.cbxProductVersionRdInit.totalCount > ( ($scope.cbxProductVersionRdInit.page - 1) * $scope.cbxProductVersionRdInit.perPage) ){
                                var api = apiData.genApi($scope.cbxProductVersionRdInit.url, $scope.cbxProductVersionRdInit.searchField, query.search, $scope.cbxProductVersionRdInit.perPage, null, $scope.cbxProductVersionRdInit.OriginParams,query.page,$scope.cbxProductVersionRdInit.queryRelate);
                                // console.log(api)
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
                    $scope.cbxPackage.ValueRelatedBefore = newVal;
                }, true);
                //end cbx manpn

                //cbx package
                $scope.cbxPackageInit = {
                    url: '/api/transfer-details', // ** api load data
                    OriginParams: "transferId=="+ $scope.id_transfer, // ** init params -- default: null
                    queryRelate : null, // ** init query relate cbx -- default: null
                    valueField: 'destPackageNumber', labelField: 'destPackageNumber', searchField: 'destPackageNumber', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false
                }
                $scope.cbxPackage = { // ** replace name cbx
                    ngModel : [], // ** value select -- array []
                    Options: [], // ** list options cbx, default: []
                    Scope : $scope,
                    ValueRelatedBefore : $scope.cbxProductVersionRd.ngModel,
                    FieldRelatedBefore : 'srcPackageNumber',
                    Config: {
                        plugins: ['infinite_scroll'],//enable load more
                        maxItems: 1,
                        valueField: $scope.cbxPackageInit.valueField,
                        labelField: $scope.cbxPackageInit.labelField,
                        searchField: $scope.cbxPackageInit.searchField,
                        create: false,
                        render: {
                            option: function(data, escape) {
                                return  '<div class="option">' +
                                    '<span class="title">' + escape(data[$scope.cbxPackageInit.labelField]) + '</span>' +
                                    '</div>';
                            },
                            item: function(data, escape) {
                                return '<div class="item"><a href="' + escape(data[$scope.cbxPackageInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxProductVersionRdInit.labelField]) + '</a></div>';
                            }
                        },
                        //use load event if use load more
                        load: function(query, callback) {
                            //console.log('run load')
                            query = JSON.parse(query)
                            //console.log(query)
                            if($scope.cbxPackageInit.resetScroll){
                                //console.log('init query.page = 0')
                                query.page = 0;
                                callback($scope.cbxPackageInit.resetScroll);
                                $scope.cbxPackageInit.resetScroll = false;
                            }
                            $scope.cbxPackageInit.page = query.page || 0;
                            if(!$scope.cbxPackageInit.totalCount || $scope.cbxPackageInit.totalCount > ( ($scope.cbxPackageInit.page - 1) * $scope.cbxPackageInit.perPage) ){
                                var api = apiData.genApi($scope.cbxPackageInit.url, $scope.cbxPackageInit.searchField, query.search, $scope.cbxPackageInit.perPage, null, $scope.cbxPackageInit.OriginParams,query.page,$scope.cbxPackageInit.queryRelate);
                                // console.log(api)
                                $http.get(api).then(function (response) {
                                    $scope.cbxPackageInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }
                $scope.$watch('cbxPackage.ngModel', function(newVal) {
                    // console.log(newVal);
                   $scope.cbxProductRd.ValueRelatedAfter = newVal;
                }, true);
                //end package
            }
            //end page create

            //page list
            if (angular.element('#transfer_scrap_list').length){
                $scope.myColumnsOpDetail = ["VNPT P/N","Description","Manufacturer P/N","UOM","Source Package","From","To","Des'Package","Serail/Lot","Reserved","Done"];
                $scope.myColumnsShowOpDetail=[];
                for (var i=0; i<$scope.myColumnsOpDetail.length;i++){
                    $scope.myColumnsShowOpDetail.push(true);
                }
                var fieldsDetail = ["id","productId","productId", "manPn","uomName", "srcPackageNumber", "srcLocationId","destLocationId","destPackageNumber","traceNumber","reserved","doneQuantity"];
                var fieldsTypeDetail = ["Number","Number","Number","Text","Text","Text",                  "Number",      "Number",        "Text",            "Text","Number","Number"];
                var loadFunctionDetail = Transfer.getOperationDetailTab;
                // $scope.bomcomponents = [];

                var newTableIdsDetail = {
                    idTable: "table_scrap_list",
                    model: "list_op_detail",
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
                    loadFunction: loadFunctionDetail,
                    param_fields: fieldsDetail,
                    param_fields_type: fieldsTypeDetail,
                    handleAfterReload: null,
                    handleAfterReloadParams: null,
                    deleteCallback: null,
                    customParams: "",
                    pager_id: "table_scrap_list_pager",
                    selectize_page_id: "scrap_selectize_page",
                    selectize_pageNum_id: "scrap_selectize_pageNum"
                };
                TableMultiple.initTableIds($scope, newTableIdsDetail);
                $scope.CbxProductDetail = {
                    Placeholder : 'Select product',
                    TextField : 'name',
                    ValueField : 'id',
                    Size : "10",
                    Api : "api/products",
                    Table : $scope.TABLES['table_scrap_list'],
                    Column : 1,
                    Scope : $scope,
                    ngModel : null,
                    OriginParams: 'type==1'
                };
                // $scope.urlProductName = '/api/products/';
                // $scope.attrProductName = 'name';
                // $scope.attrProductDes = 'description';
                $scope.CbxProductDesDetail = {
                    Placeholder : 'Select product',
                    TextField : 'description',
                    ValueField : 'id',
                    Size : "10",
                    Api : "api/products",
                    Table : $scope.TABLES['table_scrap_list'],
                    Column : 2,
                    Scope : $scope,
                    ngModel : null,
                    OriginParams: 'type==1'
                };
                $scope.CbxFromLocDetail = {
                    Placeholder : 'Select Location',
                    TextField : 'name',
                    ValueField : 'id',
                    Size : "10",
                    Api : "api/locations",
                    Table : $scope.TABLES['table_scrap_list'],
                    Column : 6,
                    Scope : $scope,
                    ngModel : null,
                    OriginParams: ''
                };
                $scope.CbxToLocSelectColumn = 7;
                if(angular.isDefined($stateParams.transferId) && $stateParams.transferId != null)
                    newTableIdsDetail.customParams += "transferId==" + $stateParams.transferId;
                TableMultiple.reloadPage(newTableIdsDetail.idTable);
                //console.log($scope.bomDetail);
            }
            //end page list

            //page detail
            if (angular.element('#transfer_scrap_detail').length){
                Transfer.getOne($stateParams.transferId).then(function (data) {
                    $scope.transfer = data;

                })
                $scope.myColumnsOpDetail = ["VNPT P/N","Description","Manufacturer P/N","UOM","Source Package","From","To","Des'Package","Serail/Lot","Reserved","Done"];
                $scope.myColumnsShowOpDetail=[];
                for (var i=0; i<$scope.myColumnsOpDetail.length;i++){
                    $scope.myColumnsShowOpDetail.push(true);
                }
                var fieldsDetail = ["id","productId","productId", "manPn","uomName", "srcPackageNumber", "srcLocationId","destLocationId","destPackageNumber","traceNumber","reserved","doneQuantity"];
                var fieldsTypeDetail = ["Number","Number","Number","Text","Text","Text",                  "Number",      "Number",        "Text",            "Text","Number","Number"];
                var loadFunctionDetail = Transfer.getOperationDetailTab;
                // $scope.bomcomponents = [];

                var newTableIdsDetail = {
                    idTable: "table_scrap_list",
                    model: "list_op_detail",
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
                    loadFunction: loadFunctionDetail,
                    param_fields: fieldsDetail,
                    param_fields_type: fieldsTypeDetail,
                    handleAfterReload: null,
                    handleAfterReloadParams: null,
                    deleteCallback: null,
                    customParams: "",
                    pager_id: "table_scrap_list_pager",
                    selectize_page_id: "scrap_selectize_page",
                    selectize_pageNum_id: "scrap_selectize_pageNum"
                };
                TableMultiple.initTableIds($scope, newTableIdsDetail);
                $scope.CbxProductDetail = {
                    Placeholder : 'Select product',
                    TextField : 'name',
                    ValueField : 'id',
                    Size : "10",
                    Api : "api/products",
                    Table : $scope.TABLES['table_scrap_list'],
                    Column : 1,
                    Scope : $scope,
                    ngModel : null,
                    OriginParams: 'type==1'
                };
                // $scope.urlProductName = '/api/products/';
                // $scope.attrProductName = 'name';
                // $scope.attrProductDes = 'description';
                $scope.CbxProductDesDetail = {
                    Placeholder : 'Select product',
                    TextField : 'description',
                    ValueField : 'id',
                    Size : "10",
                    Api : "api/products",
                    Table : $scope.TABLES['table_scrap_list'],
                    Column : 2,
                    Scope : $scope,
                    ngModel : null,
                    OriginParams: 'type==1'
                };
                $scope.CbxFromLocDetail = {
                    Placeholder : 'Select Location',
                    TextField : 'name',
                    ValueField : 'id',
                    Size : "10",
                    Api : "api/locations",
                    Table : $scope.TABLES['table_scrap_list'],
                    Column : 6,
                    Scope : $scope,
                    ngModel : null,
                    OriginParams: ''
                };
                $scope.CbxToLocSelectColumn = 7;
                if(angular.isDefined($stateParams.transferId) && $stateParams.transferId != null)
                    newTableIdsDetail.customParams += "transferId==" + $stateParams.transferId;
                TableMultiple.reloadPage(newTableIdsDetail.idTable);
                //console.log($scope.bomDetail);
            }
            //end detail
         }

    ]);

