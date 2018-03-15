angular
    .module('erpApp')
    .controller('TransferCrudController', [
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
        'TransferDetail',
        '$translate',
        'TranslateCommonUI',
        'ErrorHandle',
        'AlertService',
        '$window',
        'OperationType',
        'Location',
        'Principal',
        'Product',
        'ProductMan',
        'ProductManPn',
        'Package',
        'Lot',
        'Company',
        'OperationType',
        'Location',
        'utils',
        'apiData',
        '$http',
        'Manufacturer',
        'Scrap',
        'User',
        'ReturnService',
        '$q',
        '$filter',
        function ($scope, $rootScope, $state, $timeout, $compile, $stateParams, $interval, TableMultiple, Transfer, TransferItem,TransferDetail, $translate, TranslateCommonUI, ErrorHandle, AlertService, $window, OperationType, Location, Principal, Product, ProductMan, ProductManPn, Package, Lot, Company, OperationType, Location, utils, apiData, $http, Manufacturer, Scrap, User,ReturnService, $q,$filter) {
            TranslateCommonUI.init($scope);
            $scope.inventoryTitle = "transfer.common.Inventory";
            $scope.operationTitle = "transfer.common.Operation";
            $scope.operationDetailTitle = "transfer.common.OperationDetail";
            $scope.transferTitle = "transfer.common.Transfer";

            $scope.field_operationType = "transfer.column.OperationType";
            $scope.field_partner = "transfer.column.Partner";
            $scope.field_sourceLocation = "transfer.column.SourceLocation";
            $scope.field_destinationLocation = "transfer.column.DestinationLocation";
            $scope.field_priority = "transfer.column.Priority";
            $scope.field_scheduleDate = "transfer.column.ScheduleDate";
            $scope.field_sourceDocument = "transfer.column.SourceDocument";
            $scope.field_owner = "transfer.column.Owner";
            $scope.field_assignee = "transfer.column.Assignee";
            $scope.field_project = "transfer.column.Project";

            $scope.button_validate = "transfer.button.Validate";
            $scope.required_msg = "transfer.messages.required";

            $scope.detail_operation = {
                VNPTPN: "VNPT P/N",
                Description: "Description",
                ManufacturerPN: "Manufacture P/N",
                UOM: "UoM",
                SourcePackage: "Source Package",
                From: "From",
                To: "To",
                DestinationPackage: "Destination Package",
                LotSerial: "Lot/Serial Number",
                Reserved: "Reserved",
                Done: "Done"
            };

            $scope.list_op_item = [];
            $scope.list_op_detail = [];
            $scope.removeList = [];
            $scope.removeListItem = [];

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////init table
            $scope.checkShow = 1;
            $scope.clickTab = function (num) {
                //console.log(num);
                if(num==1){
                    $scope.checkShow = 1;
                }else{
                    $scope.checkShow = 2;
                }
            };


            /************************************** TAB OPERATION *****************************************************/
            $scope.myColumnsRd =    [           "VNPT P/N",   "Description", "Manufacturer", "VNPT ManPN",      "Man P/N",  "Initial Demand",   "Done"        ];
            var fieldsRd =          ["id",      "productId",  "productId",   "manCode",      "internalReference", "manPn",    "initialQuantity",  "doneQuantity"];
            var fieldsTypeRd =      ["Number",  "Number",     "Number",      "Text",         "Text",            "Text",     "Number",           "Number"      ];
            var loadFunctionRd = Transfer.getOperationTab;
            // $scope.bomcomponents = [];

            $scope.myColumnsShowRd=[];
            for (var i=0; i<$scope.myColumnsRd.length;i++){
                $scope.myColumnsShowRd.push(true);
            }

            var newTableIdsRd = {
                idTable: "table_op_tab",
                model: "list_op_item",
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
                customParams: "",
                pager_id: "table_op_tab_pager",
                selectize_page_id: "rd_selectize_page",
                selectize_pageNum_id: "rd_selectize_pageNum"
            };
            $scope.locationName = "completeName"

            angular.element($window).bind('resize', function(){
                $scope.fullsizeDetail = {
                    "min-height":$( window ).height() - 500
                }
            });

            $scope.fullsizeDetail = {
                "min-height":$( window ).height() - 500
            }

            angular.element($window).bind('resize', function(){
                $scope.fullsizeCreate = {
                    "min-height":$( window ).height() - 500
                }
            });

            $scope.fullsizeCreate = {
                "min-height":$( window ).height() - 500
            }

            $scope.priorityValue = {
                normal:$translate.instant('transfer.common.normal'),
                not_urgent:$translate.instant('transfer.common.not_urgent'),
                urgent:$translate.instant('transfer.common.urgent'),
                very_urgent:$translate.instant('transfer.common.very_urgent')

            }


            $scope.showPriority = function (state) {
                return  $scope.priorityValue[state]
            }

            function genDateTime(time) {
                var date = $filter('date')(time, 'dd/MM/yyyy HH:mm:ss');
                return date
            }

            $scope.selectize_priority = 'Normal'

            //======================================================VALIDATE==================================================//
            $scope.isValidate = false
            $scope.isFitQuantity = true
            $scope.validateTransfer = function () {
                //Validate MO Transfer
                if($scope.operationTypeTransfer.type == 'manufacturing'){
                    Transfer.validate($stateParams.transferId, false,false).then(function (data) {
                        location.reload();
                    }).catch(function(data){
                        ErrorHandle.handleError(data);
                    });
                }else{
                    if($scope.list_op_item.length == 0){
                        AlertService.error("transfer.messages.emptyItemList")
                        return
                    }

                    if($scope.list_op_detail.length == 0){
                        AlertService.error("transfer.messages.emptyDetailList")
                        return
                    }
                    if($scope.status !='done'){
                        $scope.isFitQuantity = true
                        $scope.biggerList =[]
                        $scope.smallerList=[]
                        $scope.isEdited = false

                        for(var j=0; j <$scope.list_op_item.length; j++){
                            if($scope.list_op_item[j].doneQuantity !=0){
                                $scope.isEdited = true
                            }

                            if($scope.list_op_item[j].initialQuantity < $scope.list_op_item[j].doneQuantity){
                                $scope.biggerList.push($scope.list_op_item[j].productName)
                            }
                            if ($scope.list_op_item[j].initialQuantity > $scope.list_op_item[j].doneQuantity){
                                $scope.smallerList.push($scope.list_op_item[j].productName)
                            }

                            if($scope.list_op_item[j].initialQuantity != $scope.list_op_item[j].doneQuantity){
                                $scope.isFitQuantity = false
                            }
                        }

                        //Case 1: exist done quantity bigger than init quantity
                        if($scope.biggerList.length > 0) {
                            $timeout(function(){
                                angular.element("#biggerBtn").trigger("click");
                            })
                            return
                        }

                        //Case 2: Exist done quantity smaller than initQuantity => create back order
                        if($scope.smallerList.length > 0 && $scope.isEdited) {
                            $timeout(function(){
                                angular.element("#backorderBtn").trigger("click");
                            })
                            return
                        }

                        //Case 3: done quantity = initQuantity => validate directly
                        if($scope.isFitQuantity){
                            $scope.validate(false,false)
                            return
                        }

                        //Cas4: Auto set done quantity
                        if(!$scope.isEdited){
                            $timeout(function(){
                                angular.element("#confirmBtn").trigger("click");
                            })
                        }
                    }
                }
            }

            $scope.validate = function (backorder,autoSetQuantity) {
                Transfer.validate($stateParams.transferId,backorder,autoSetQuantity).then(function (data) {
                    location.reload();
                }).catch(function(data){
                    ErrorHandle.handleError(data);
                })
            }

            $scope.validateBiggerCase = function () {
                if($scope.smallerList.length > 0){
                    $timeout(function(){
                        angular.element("#backorderBtn").trigger("click");
                    })
                    return
                } else {
                    $scope.validate(false,false)
                }
            }
            //================================================================================================================//

            //======================================================RETURN====================================================//
            if (angular.element('#transfer_detail').length) {
                ReturnService.initReturnService($scope)
            }

            //================================================================================================================//

            //=======================================================INFO MODAL===============================================//
            $scope.urlProductLink = ''
            if (angular.element('#transfer_detail').length) {
                $scope.showOperationInfo = function($event,index){
                    var selection = window.getSelection();
                    if(selection.type != "Range") {
                        $scope.currentItem = $scope.list_op_item[index]
                        $scope.urlProductLink = '#/products/'+ $scope.currentItem.productId +'/details'
                        $timeout(function(){
                            angular.element("#showOperationModal").trigger("click");
                        })
                    }
                }

                $scope.showOperationDetailInfo = function($event,index){
                    var selection = window.getSelection();
                    if(selection.type != "Range") {
                        $scope.currentItemDetail = $scope.list_op_detail[index]
                        $scope.urlProductLink = '#/products/'+ $scope.currentItemDetail.productId +'/details'
                        $timeout(function(){
                            angular.element("#showOperationDetailModal").trigger("click");
                        })
                    }

                }
            }

            //================================================================================================================//

            //========================================CHECK AVAILABILITY & UN RESERVE==========================================//
            $scope.isReserved = false
            $scope.checkAvailability = function () {
                $scope.blockUI();
                Transfer.checkAvailability($stateParams.transferId).then(function (transfer) {
                    if ($scope.blockModal != null)
                        $scope.blockModal.hide();
                    $state.go('transfers-detail', {transferId:$stateParams.transferId}, {reload: true});
                }).catch(function(data){
                    ErrorHandle.handleError(data);
                })
            }

            $scope.unReserve = function () {
                $scope.blockUI();
                Transfer.unReserve($stateParams.transferId).then(function (transfer) {
                    if ($scope.blockModal != null)
                        $scope.blockModal.hide();
                    $state.go('transfers-detail', {transferId:$stateParams.transferId}, {reload: true});
                }).catch(function(data){
                    ErrorHandle.handleError(data);
                })
            }

            //================================================================================================================//

            TableMultiple.initTableIds($scope, newTableIdsRd);

            $scope.CbxProductRd = {
                Placeholder : 'Select product',
                TextField : 'name',
                ValueField : 'id',
                Size : "10",
                Api : "api/products",
                Table : $scope.TABLES['table_op_tab'],
                Column : 1,
                Scope : $scope,
                ngModel : null,
                OriginParams: 'type==1',
                indexCbx: 0
            };
            $scope.CbxProductDescriptionRd = {
                Placeholder : 'Select description',
                TextField : 'description',
                ValueField : 'id',
                Size : "10",
                Api : "api/products",
                Table : $scope.TABLES['table_op_tab'],
                Column : 2,
                Scope : $scope,
                ngModel : null,
                OriginParams: 'type==1',
                indexCbx: 0
            };
            $scope.CbxProductManufactureRd = {
                Placeholder : 'Select Manufacturer',
                TextField : 'companyCode',
                ValueField : 'id',
                Size : "10",
                Api : "api/companies",
                Table : $scope.TABLES['table_op_tab'],
                Column : 3,
                Scope : $scope,
                ngModel : null,
                OriginParams: 'type==man'
            };
            $scope.attrProductManufacturerCode = 'companyCode';
            $scope.urlProductManufacturerName = '/api/companies/';
            $scope.urlProductName = '/api/products/';
            $scope.urlProductVersion = '/api/product-version/';
            $scope.urlLocationName = '/api/locations/';
            $scope.attrProductName = 'name';
            $scope.attrProductCompleteName = 'completeName';
            $scope.attrProductDes = 'description';
            $scope.attrDisplayName = 'displayName'
            $scope.CbxProductDes = {
                Placeholder : 'Select product',
                TextField : 'description',
                ValueField : 'id',
                Size : "10",
                Api : "api/products",
                Table : $scope.TABLES['table_op_tab'],
                Column : 1,
                Scope : $scope,
                ngModel : null,
                OriginParams: 'type==1'
            };
            /**********************************************************************************************************/

            /************************************** TAB DETAIL ********************************************************/
            $scope.myColumnsOpDetail =  [           "VNPT P/N",  "Description", "Manufacturer", "VNPT ManPN",      "Man P/N", "UOM",     "Source Package",   "From",          "To",             "Des'Package",       "Serial/Lot",  "Reserved", "Done"        ];
            var fieldsDetail =          ["id",      "productId", "productId",   "manCode",      "internalReference", "manPn",   "uomName", "srcPackageNumber", "srcLocationId", "destLocationId", "destPackageNumber", "traceNumber", "reserved", "doneQuantity"];
            var fieldsTypeDetail =      ["Number",  "Number",    "Number",      "Text",         "Text",            "Text",    "Text",    "Text",             "Number",        "Number",         "Text",              "Text",        "Number",   "Number"      ];
            var loadFunctionDetail = Transfer.getOperationDetailTab;
            // $scope.bomcomponents = [];

            $scope.myColumnsShowOpDetail=[];
            for (var i=0; i<$scope.myColumnsOpDetail.length;i++){
                $scope.myColumnsShowOpDetail.push(true);
            }

            var newTableIdsDetail = {
                idTable: "table_op_detail_tab",
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
                pager_id: "table_op_detail_tab_pager",
                selectize_page_id: "detail_selectize_page",
                selectize_pageNum_id: "detail_selectize_pageNum"
            };

            TableMultiple.initTableIds($scope, newTableIdsDetail);

            $scope.CbxProductDetail = {
                Placeholder : 'Select product',
                TextField : 'name',
                ValueField : 'id',
                Size : "10",
                Api : "api/products",
                Table : $scope.TABLES['table_op_detail_tab'],
                Column : 1,
                Scope : $scope,
                ngModel : null,
                OriginParams: 'type==1',
                indexCbx: 0
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
                Table : $scope.TABLES['table_op_detail_tab'],
                Column : 2,
                Scope : $scope,
                ngModel : null,
                OriginParams: 'type==1',
                indexCbx: 0
            };
            $scope.CbxFromLocDetail = {
                Placeholder : 'Select Location',
                TextField : 'name',
                ValueField : 'id',
                Size : "10",
                Api : "api/locations",
                Table : $scope.TABLES['table_op_detail_tab'],
                Column : 8,
                Scope : $scope,
                ngModel : null,
                OriginParams: ''
            };
            $scope.CbxToLocSelectColumn = 9;
            /**********************************************************************************************************/
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////


            $scope.transfer = {}

            $scope.OPERATION_TYPE = [
                {name: 'Vendors', id: 'incoming'},
                {name: 'Customer', id: 'outcoming'},
                {name: 'Manufacturing Operation', id: 'manufacturing'},
                {name: 'Internal', id: 'internal'}
            ];

            function getVendorType(type){
                for (var i=0; i<$scope.OPERATION_TYPE.length;i++ ){
                    if ($scope.OPERATION_TYPE[i].id == type){
                        return $scope.OPERATION_TYPE[i].name
                    }
                }
            }

            $scope.PartnerDisabled = true;
            $scope.SourceLocationDisabled = true;
            $scope.DestinationLocationDisabled = true;
            $scope.validateLocationSuccess = false;

            $scope.setLocationValue = function (locationSet, idLocation) {
                if(idLocation != null) {
                    Location.getOne(idLocation)
                        .then(function(data){
                            if(locationSet == "source")
                                $scope.transfer.srcLocationId = data.id;
                            else
                                $scope.transfer.destLocationId = data.id;
                            $scope.validateLocation();
                        })
                        .catch(function(data){
                            ErrorHandle.handleError(data);
                        })
                }
            }

            $scope.handleLocation = function () {
                $scope.transfer.srcLocationId = null;
                $scope.transfer.destLocationId = null;
                $scope.transfer.partnerId = null;

                if($scope.transfer.operationTypeId != null) {
                    OperationType.getOne($scope.transfer.operationTypeId)
                        .then(function(data){
                            /*if(getVendorType(data.type) == $scope.OPERATION_TYPE[0].name) {
                                // Vendor
                                $scope.PartnerDisabled = false;
                                $scope.SourceLocationDisabled = false;
                                $scope.DestinationLocationDisabled = true;

                                // Show destination location from operation type (but can not selected)
                                $scope.setLocationValue("destination", data.defaultDestLocationId);
                                $scope.transfer.srcLocationId = null;
                                $scope.transfer.partnerId = null;
                            } else if(getVendorType(data.type) == $scope.OPERATION_TYPE[1].name) {
                                // Customer
                                $scope.PartnerDisabled = false;
                                $scope.SourceLocationDisabled = true;
                                $scope.DestinationLocationDisabled = false;

                                // Show source location from operation type (but can not selected)
                                $scope.setLocationValue("source", data.defaultSrcLocationId);
                                $scope.transfer.destLocationId = null;
                                $scope.transfer.partnerId = null;
                            } else if(getVendorType(data.type) == $scope.OPERATION_TYPE[2].name) {
                                // Manufacturing
                                $scope.PartnerDisabled = false;
                                $scope.SourceLocationDisabled = false;
                                $scope.DestinationLocationDisabled = false;

                                // Show source and destination location from operation type
                                $scope.setLocationValue("source", data.defaultSrcLocationId);
                                $scope.setLocationValue("destination", data.defaultDestLocationId);
                                $scope.transfer.partnerId = null;
                            } else if(getVendorType(data.type) == $scope.OPERATION_TYPE[3].name) {
                                // Internal
                                $scope.PartnerDisabled = true;
                                $scope.SourceLocationDisabled = false;
                                $scope.DestinationLocationDisabled = false;

                                // Show source and destination location from operation type
                                $scope.setLocationValue("source", data.defaultSrcLocationId);
                                $scope.setLocationValue("destination", data.defaultDestLocationId);
                                $scope.transfer.partnerId = null;
                            }*/

                            if(data.defaultSrcLocationId != null) {
                                $scope.transfer.srcLocationId = data.defaultSrcLocationId;
                            } else {
                                $scope.transfer.srcLocationId = null;
                            }

                            if(data.defaultDestLocationId != null) {
                                $scope.transfer.destLocationId = data.defaultDestLocationId;
                            } else {
                                $scope.transfer.destLocationId = null;
                            }
                            $scope.transfer.partnerId = null;
                        })
                        .catch(function(data){
                            ErrorHandle.handleError(data);
                        })
                }
            }

            $scope.$watch('transfer.operationTypeId', function(newval) {
                if(!$scope.ALLOW_EDIT)
                    return;
                $scope.cbxSelectizeSourceLocationInit.resetScroll = true;
                $scope.cbxSelectizePartnerInit.resetScroll = true;
                $scope.cbxSelectizeDestinationLocationInit.resetScroll = true;
                $scope.cbxSelectizeSourceLocationInit.MoreParams = "";
                $scope.cbxSelectizePartnerInit.MoreParams = "";
                $scope.cbxSelectizeDestinationLocationInit.MoreParams = "";
                $scope.handleLocation();
            });

            $scope.$watch('transfer.srcLocationId', function(newval) {
                if(!$scope.ALLOW_EDIT)
                    return;
                $scope.validateLocation();
                $scope.watchAndUpdateFromLocation();
            });

            $scope.watchAndUpdateFromLocation = function(){
                if($scope.cbxSelectizeFromOperationInitDetail != undefined) {
                    if($scope.transfer.srcLocationId != null && $scope.transfer.srcLocationId != undefined){
                        $scope.allowDetailAddFromField = true;

                        Location.getOne($scope.transfer.srcLocationId).then(function (data) {
                            $scope.cbxSelectizeFromOperationDetail.Options = [];
                            $scope.cbxSelectizeFromOperationInitDetail.resetScroll = true;
                            $scope.cbxSelectizeFromOperationInitDetail.MoreParams = "completeName=='" + data.completeName +  "*'";
                            $scope.cbxSelectizeFromOperationDetail.Options.push(data);
                            $scope.cbxSelectizeFromOperationDetail.ngModel = $scope.transfer.srcLocationId;

                            if($scope.cbxSelectizeSourceLocationInit != undefined) {
                                $scope.cbxSelectizeSourceLocation.Options = [];
                                $scope.cbxSelectizeSourceLocation.Options.push(data);
                                $scope.cbxSelectizeSourceLocation.ngModel = data.id;
                            }
                        }).catch(function(data){
                            AlertService.error("transfer.messages.canNotGetData");
                        })
                    } else {
                        $scope.cbxSelectizeFromOperationDetail.Options = [];
                        $scope.cbxSelectizeFromOperationInitDetail.resetScroll = true;
                        $scope.cbxSelectizeFromOperationInitDetail.MoreParams = "";
                        $scope.allowDetailAddFromField = false;

                        if($scope.cbxSelectizeSourceLocationInit != undefined) {
                            $scope.cbxSelectizeSourceLocation.ngModel = -1;
                        }
                    }
                }
            }

            $scope.$watch('transfer.partnerId', function(newval) {
                if(!$scope.ALLOW_EDIT)
                    return;
                if($scope.cbxSelectizePartnerInit != undefined) {
                    if($scope.transfer.partnerId != null && $scope.transfer.partnerId != undefined){
                        Company.getOne($scope.transfer.partnerId).then(function (data) {
                            $scope.cbxSelectizePartner.Options = [];
                            $scope.cbxSelectizePartner.Options.push(data);
                            $scope.cbxSelectizePartner.ngModel = data.id;
                        })
                    } else {
                        $scope.cbxSelectizePartner.ngModel = -1;
                    }
                }
            });

            $scope.$watch('transfer.destLocationId', function(newval) {
                if(!$scope.ALLOW_EDIT)
                    return;
                $scope.validateLocation();
                $scope.watchAndUpdateToLocation();
            });

            $scope.watchAndUpdateToLocation = function() {
                if($scope.cbxSelectizeToOperationInitDetail != undefined) {
                    if ($scope.transfer.destLocationId != null && $scope.transfer.destLocationId != undefined) {
                        $scope.allowDetailAddToField = true;

                        Location.getOne($scope.transfer.destLocationId).then(function (data) {
                            $scope.cbxSelectizeToOperationDetail.Options = [];
                            $scope.cbxSelectizeToOperationInitDetail.resetScroll = true;
                            $scope.cbxSelectizeToOperationInitDetail.MoreParams = "completeName=='" + data.completeName + "*'";
                            $scope.cbxSelectizeToOperationDetail.Options.push(data);
                            $scope.cbxSelectizeToOperationDetail.ngModel = $scope.transfer.destLocationId;

                            if($scope.cbxSelectizeDestinationLocationInit != undefined) {
                                $scope.cbxSelectizeDestinationLocation.Options = [];
                                $scope.cbxSelectizeDestinationLocation.Options.push(data);
                                $scope.cbxSelectizeDestinationLocation.ngModel = data.id;
                            }
                        }).catch(function (data) {
                            AlertService.error("transfer.messages.canNotGetData");
                        })
                    } else {
                        $scope.cbxSelectizeToOperationDetail.Options = [];
                        $scope.cbxSelectizeToOperationInitDetail.resetScroll = true;
                        $scope.cbxSelectizeToOperationInitDetail.MoreParams = "";
                        $scope.allowDetailAddToField = false;

                        if($scope.cbxSelectizeDestinationLocationInit != undefined) {
                            $scope.cbxSelectizeDestinationLocation.ngModel = -1;
                        }
                    }
                }
            }

            $scope.validateLocation = function () {
                $scope.validateLocationSuccess =
                    ($scope.transfer.operationTypeId != null) &&
                    ($scope.transfer.srcLocationId != null) &&
                    ($scope.transfer.destLocationId != null)
            }

            // Date picker
            $scope.convertDate = function(dateString) {
                // format DD/MM/YYYY
                var date = dateString.split("/");
                var newDate = date[1] + "/" + date[0] + "/" + date[2];
                return (new Date(newDate).getTime());
            }
            $scope.convertToDateTime = function (timestamp) {
                var date = new Date(timestamp);
                var newDate =date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
                return newDate;
            }

            // Priority
            $scope.PRIORITY_TYPE = [
                {name: 'normal', id: 'Normal'},
                {name: 'not_urgent', id: 'Not urgent'},
                {name: 'urgent', id: 'Urgent'},
                {name: 'very_urgent', id: 'Very urgent'}
            ];

            function getPriorityType(type){
                for (var i=0; i<$scope.PRIORITY_TYPE.length;i++ ){
                    if ($scope.PRIORITY_TYPE[i].id == type){
                        return $scope.PRIORITY_TYPE[i].name
                    }
                }
            }
            $scope.selectize_priority_options = ["Normal", "Not urgent", "Urgent", "Very urgent"];


            $scope.selectize_priority_config = {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1,
                placeholder: 'Select priority...'
            };

            // Owner
            var authReturn = Principal.identity(true).then(function(data){
                var isAuthenticated = Principal.isAuthenticated();
                if(isAuthenticated) {
                    $scope.transfer.ownerId = data.id;
                    $scope.attrName = 'email';
                    $scope.urlOwnerName = '/api/users/';
                    $scope.urlOwnerLink = '#/users/'+ $scope.transfer.ownerId +'/detail'
                }
            });

            // Combobox field
            $scope.cbxSelectizeOperationTypeInit = {
                url: '/api/operation-types', // ** api load data
                OriginParams: null, // ** init params -- default: null
                MoreParams: null, // ** filter params => reload cbx options -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'displayName', searchField: 'displayName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.cbxSelectizeOperationType = {
                ngModel : [], // ** value select -- array []
                ngModelObject : [],
                Options: [], // ** list options cbx, default: []
                Scope : $scope,
                Config: {
                    index: null,
                    placeholder : 'Select operation type...',
                    plugins: ['infinite_scroll'], //enable load more
                    maxItems: 1,
                    valueField: $scope.cbxSelectizeOperationTypeInit.valueField,
                    labelField: $scope.cbxSelectizeOperationTypeInit.labelField,
                    searchField: $scope.cbxSelectizeOperationTypeInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeOperationTypeInit.labelField]) + '</span>' + '</div>';
                        },
                        item: function(data, escape) {
                            return '<div class="item">' + escape(data[$scope.cbxSelectizeOperationTypeInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        query = JSON.parse(query)
                        //console.log(query)
                        if($scope.cbxSelectizeOperationTypeInit.resetScroll){
                            //console.log('init query.page = 0')
                            query.page = 0;
                            callback($scope.cbxSelectizeOperationTypeInit.resetScroll);
                            $scope.cbxSelectizeOperationTypeInit.resetScroll = false;
                        }
                        $scope.cbxSelectizeOperationTypeInit.page = query.page || 0;
                        if(!$scope.cbxSelectizeOperationTypeInit.totalCount || $scope.cbxSelectizeOperationTypeInit.totalCount > ( ($scope.cbxSelectizeOperationTypeInit.page - 1) * $scope.cbxSelectizeOperationTypeInit.perPage) ){
                            var api = apiData.genApi($scope.cbxSelectizeOperationTypeInit.url, $scope.cbxSelectizeOperationTypeInit.searchField, query.search, $scope.cbxSelectizeOperationTypeInit.perPage, null, $scope.cbxSelectizeOperationTypeInit.OriginParams,query.page,$scope.cbxSelectizeOperationTypeInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.cbxSelectizeOperationTypeInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

            $scope.cbxSelectizePartnerInit = {
                url: '/api/companies', // ** api load data
                OriginParams: null, // ** init params -- default: null
                MoreParams: null, // ** filter params => reload cbx options -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.cbxSelectizePartner = {
                ngModel : [], // ** value select -- array []
                ngModelObject : [],
                Options: [], // ** list options cbx, default: []
                Scope : $scope,
                Config: {
                    index: null,
                    placeholder : 'Select partner...',
                    plugins: ['infinite_scroll'], //enable load more
                    maxItems: 1,
                    valueField: $scope.cbxSelectizePartnerInit.valueField,
                    labelField: $scope.cbxSelectizePartnerInit.labelField,
                    searchField: $scope.cbxSelectizePartnerInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizePartnerInit.labelField]) + '</span>' + '</div>';
                        },
                        item: function(data, escape) {
                            return '<div class="item">' + escape(data[$scope.cbxSelectizePartnerInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        query = JSON.parse(query)
                        //console.log(query)
                        if($scope.cbxSelectizePartnerInit.resetScroll){
                            //console.log('init query.page = 0')
                            query.page = 0;
                            callback($scope.cbxSelectizePartnerInit.resetScroll);
                            $scope.cbxSelectizePartnerInit.resetScroll = false;
                        }
                        $scope.cbxSelectizePartnerInit.page = query.page || 0;
                        if(!$scope.cbxSelectizePartnerInit.totalCount || $scope.cbxSelectizePartnerInit.totalCount > ( ($scope.cbxSelectizePartnerInit.page - 1) * $scope.cbxSelectizePartnerInit.perPage) ){
                            var api = apiData.genApi($scope.cbxSelectizePartnerInit.url, $scope.cbxSelectizePartnerInit.searchField, query.search, $scope.cbxSelectizePartnerInit.perPage, null, $scope.cbxSelectizePartnerInit.OriginParams,query.page,$scope.cbxSelectizePartnerInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.cbxSelectizePartnerInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

            $scope.cbxSelectizeSourceLocationInit = {
                url: '/api/locations', // ** api load data
                OriginParams: null, // ** init params -- default: null
                MoreParams: null, // ** filter params => reload cbx options -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'displayName', searchField: 'completeName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.cbxSelectizeSourceLocation = {
                ngModel : [], // ** value select -- array []
                ngModelObject : [],
                Options: [], // ** list options cbx, default: []
                Scope : $scope,
                Config: {
                    index: null,
                    placeholder : 'Select location...',
                    plugins: ['infinite_scroll'], //enable load more
                    maxItems: 1,
                    valueField: $scope.cbxSelectizeSourceLocationInit.valueField,
                    labelField: $scope.cbxSelectizeSourceLocationInit.labelField,
                    searchField: $scope.cbxSelectizeSourceLocationInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeSourceLocationInit.labelField]) + '</span>' + '</div>';
                        },
                        item: function(data, escape) {
                            return '<div class="item">' + escape(data[$scope.cbxSelectizeSourceLocationInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        query = JSON.parse(query)
                        //console.log(query)
                        if($scope.cbxSelectizeSourceLocationInit.resetScroll){
                            //console.log('init query.page = 0')
                            query.page = 0;
                            callback($scope.cbxSelectizeSourceLocationInit.resetScroll);
                            $scope.cbxSelectizeSourceLocationInit.resetScroll = false;
                        }
                        $scope.cbxSelectizeSourceLocationInit.page = query.page || 0;
                        if(!$scope.cbxSelectizeSourceLocationInit.totalCount || $scope.cbxSelectizeSourceLocationInit.totalCount > ( ($scope.cbxSelectizeSourceLocationInit.page - 1) * $scope.cbxSelectizeSourceLocationInit.perPage) ){
                            var api = apiData.genApi($scope.cbxSelectizeSourceLocationInit.url, $scope.cbxSelectizeSourceLocationInit.searchField, query.search, $scope.cbxSelectizeSourceLocationInit.perPage, null, $scope.cbxSelectizeSourceLocationInit.OriginParams,query.page,$scope.cbxSelectizeSourceLocationInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.cbxSelectizeSourceLocationInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

            $scope.cbxSelectizeDestinationLocationInit = {
                url: '/api/locations', // ** api load data
                OriginParams: null, // ** init params -- default: null
                MoreParams: null, // ** filter params => reload cbx options -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'displayName', searchField: 'completeName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.cbxSelectizeDestinationLocation = {
                ngModel : [], // ** value select -- array []
                ngModelObject : [],
                Options: [], // ** list options cbx, default: []
                Scope : $scope,
                Config: {
                    index: null,
                    placeholder : 'Select location...',
                    plugins: ['infinite_scroll'], //enable load more
                    maxItems: 1,
                    valueField: $scope.cbxSelectizeDestinationLocationInit.valueField,
                    labelField: $scope.cbxSelectizeDestinationLocationInit.labelField,
                    searchField: $scope.cbxSelectizeDestinationLocationInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeDestinationLocationInit.labelField]) + '</span>' + '</div>';
                        },
                        item: function(data, escape) {
                            return '<div class="item">' + escape(data[$scope.cbxSelectizeDestinationLocationInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        query = JSON.parse(query)
                        //console.log(query)
                        if($scope.cbxSelectizeDestinationLocationInit.resetScroll){
                            //console.log('init query.page = 0')
                            query.page = 0;
                            callback($scope.cbxSelectizeDestinationLocationInit.resetScroll);
                            $scope.cbxSelectizeDestinationLocationInit.resetScroll = false;
                        }
                        $scope.cbxSelectizeDestinationLocationInit.page = query.page || 0;
                        if(!$scope.cbxSelectizeDestinationLocationInit.totalCount || $scope.cbxSelectizeDestinationLocationInit.totalCount > ( ($scope.cbxSelectizeDestinationLocationInit.page - 1) * $scope.cbxSelectizeDestinationLocationInit.perPage) ){
                            var api = apiData.genApi($scope.cbxSelectizeDestinationLocationInit.url, $scope.cbxSelectizeDestinationLocationInit.searchField, query.search, $scope.cbxSelectizeDestinationLocationInit.perPage, null, $scope.cbxSelectizeDestinationLocationInit.OriginParams,query.page,$scope.cbxSelectizeDestinationLocationInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.cbxSelectizeDestinationLocationInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

            $scope.cbxSelectizeAssigneeInit = {
                url: '/api/users', // ** api load data
                OriginParams: null, // ** init params -- default: null
                MoreParams: null, // ** filter params => reload cbx options -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'email', searchField: 'email', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.cbxSelectizeAssignee = {
                ngModel : [], // ** value select -- array []
                ngModelObject : [],
                Options: [], // ** list options cbx, default: []
                Scope : $scope,
                Config: {
                    index: null,
                    placeholder : 'Select users...',
                    plugins: ['infinite_scroll'], //enable load more
                    maxItems: 1,
                    valueField: $scope.cbxSelectizeAssigneeInit.valueField,
                    labelField: $scope.cbxSelectizeAssigneeInit.labelField,
                    searchField: $scope.cbxSelectizeAssigneeInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeAssigneeInit.labelField]) + '</span>' + '</div>';
                        },
                        item: function(data, escape) {
                            return '<div class="item">' + escape(data[$scope.cbxSelectizeAssigneeInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        query = JSON.parse(query)
                        //console.log(query)
                        if($scope.cbxSelectizeAssigneeInit.resetScroll){
                            //console.log('init query.page = 0')
                            query.page = 0;
                            callback($scope.cbxSelectizeAssigneeInit.resetScroll);
                            $scope.cbxSelectizeAssigneeInit.resetScroll = false;
                        }
                        $scope.cbxSelectizeAssigneeInit.page = query.page || 0;
                        if(!$scope.cbxSelectizeAssigneeInit.totalCount || $scope.cbxSelectizeAssigneeInit.totalCount > ( ($scope.cbxSelectizeAssigneeInit.page - 1) * $scope.cbxSelectizeAssigneeInit.perPage) ){
                            var api = apiData.genApi($scope.cbxSelectizeAssigneeInit.url, $scope.cbxSelectizeAssigneeInit.searchField, query.search, $scope.cbxSelectizeAssigneeInit.perPage, null, $scope.cbxSelectizeAssigneeInit.OriginParams,query.page,$scope.cbxSelectizeAssigneeInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.cbxSelectizeAssigneeInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

            $scope.cbxSelectizeProjectInit = {
                url: '/api/product-version', // ** api load data
                OriginParams: null, // ** init params -- default: null
                MoreParams: null, // ** filter params => reload cbx options -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.cbxSelectizeProject = {
                ngModel : [], // ** value select -- array []
                ngModelObject : [],
                Options: [], // ** list options cbx, default: []
                Scope : $scope,
                Config: {
                    index: null,
                    placeholder : 'Select project...',
                    plugins: ['infinite_scroll'], //enable load more
                    maxItems: 1,
                    valueField: $scope.cbxSelectizeProjectInit.valueField,
                    labelField: $scope.cbxSelectizeProjectInit.labelField,
                    searchField: $scope.cbxSelectizeProjectInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeProjectInit.labelField]) + '</span>' + '</div>';
                        },
                        item: function(data, escape) {
                            return '<div class="item">' + escape(data[$scope.cbxSelectizeProjectInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        query = JSON.parse(query)
                        //console.log(query)
                        if($scope.cbxSelectizeProjectInit.resetScroll){
                            //console.log('init query.page = 0')
                            query.page = 0;
                            callback($scope.cbxSelectizeProjectInit.resetScroll);
                            $scope.cbxSelectizeProjectInit.resetScroll = false;
                        }
                        $scope.cbxSelectizeProjectInit.page = query.page || 0;
                        if(!$scope.cbxSelectizeProjectInit.totalCount || $scope.cbxSelectizeProjectInit.totalCount > ( ($scope.cbxSelectizeProjectInit.page - 1) * $scope.cbxSelectizeProjectInit.perPage) ){
                            var api = apiData.genApi($scope.cbxSelectizeProjectInit.url, $scope.cbxSelectizeProjectInit.searchField, query.search, $scope.cbxSelectizeProjectInit.perPage, null, $scope.cbxSelectizeProjectInit.OriginParams,query.page,$scope.cbxSelectizeProjectInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.cbxSelectizeProjectInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

            $scope.MAX_NUMBER_ITEMS = 10000;

            $scope.cbxSelectizeOtherProjectInit = {
                url: '/api/product-version', // ** api load data
                OriginParams: null, // ** init params -- default: null
                MoreParams: null, // ** filter params => reload cbx options -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }

            $scope.cbxSelectizeOtherProject = {
                ngModel : [], // ** value select -- array []
                ngModelObject : [],
                Options: [], // ** list options cbx, default: []
                Scope : $scope,
                Config: {
                    index: null,
                    placeholder : 'Select project...',
                    plugins: ['infinite_scroll'], //enable load more
                    maxItems: null,
                    valueField: $scope.cbxSelectizeOtherProjectInit.valueField,
                    labelField: $scope.cbxSelectizeOtherProjectInit.labelField,
                    searchField: $scope.cbxSelectizeOtherProjectInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeOtherProjectInit.labelField]) + '</span>' + '</div>';
                        },
                        item: function(data, escape) {
                            return '<div class="item">' + escape(data[$scope.cbxSelectizeOtherProjectInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        query = JSON.parse(query)
                        //console.log(query)
                        if($scope.cbxSelectizeOtherProjectInit.resetScroll){
                            //console.log('init query.page = 0')
                            query.page = 0;
                            callback($scope.cbxSelectizeOtherProjectInit.resetScroll);
                            $scope.cbxSelectizeOtherProjectInit.resetScroll = false;
                        }
                        $scope.cbxSelectizeOtherProjectInit.page = query.page || 0;
                        if(!$scope.cbxSelectizeOtherProjectInit.totalCount || $scope.cbxSelectizeOtherProjectInit.totalCount > ( ($scope.cbxSelectizeOtherProjectInit.page - 1) * $scope.cbxSelectizeOtherProjectInit.perPage) ){
                            var api = apiData.genApi($scope.cbxSelectizeOtherProjectInit.url, $scope.cbxSelectizeOtherProjectInit.searchField, query.search, $scope.cbxSelectizeOtherProjectInit.perPage, null, $scope.cbxSelectizeOtherProjectInit.OriginParams,query.page,$scope.cbxSelectizeOtherProjectInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.cbxSelectizeOtherProjectInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

            $scope.setDataComboboxField = function () {
                if($scope.transfer.operationTypeId != null)
                    OperationType.getOne($scope.transfer.operationTypeId).then(function (data) {
                        $scope.cbxSelectizeOperationType.Options = [];
                        $scope.cbxSelectizeOperationType.Options.push(data);
                        $scope.cbxSelectizeOperationType.ngModel = data.id;
                        $scope.ALLOW_EDIT = true;
                    })

                if($scope.transfer.partnerId != null)
                    Company.getOne($scope.transfer.partnerId).then(function (data) {
                        $scope.cbxSelectizePartner.Options = [];
                        $scope.cbxSelectizePartner.Options.push(data);
                        $scope.cbxSelectizePartner.ngModel = data.id;
                    })

                if($scope.transfer.srcLocationId != null)
                    Location.getOne($scope.transfer.srcLocationId).then(function (data) {
                        $scope.cbxSelectizeSourceLocation.Options = [];
                        $scope.cbxSelectizeSourceLocation.Options.push(data);
                        $scope.cbxSelectizeSourceLocation.ngModel = data.id;
                    })

                if($scope.transfer.destLocationId != null)
                    Location.getOne($scope.transfer.destLocationId).then(function (data) {
                        $scope.cbxSelectizeDestinationLocation.Options = [];
                        $scope.cbxSelectizeDestinationLocation.Options.push(data);
                        $scope.cbxSelectizeDestinationLocation.ngModel = data.id;
                    })

                if($scope.transfer.assigneeId != null)
                    User.getUserById($scope.transfer.assigneeId).then(function (data) {
                        $scope.cbxSelectizeAssignee.Options = [];
                        $scope.cbxSelectizeAssignee.Options.push(data);
                        $scope.cbxSelectizeAssignee.ngModel = data.id;
                    })

                if($scope.transfer.productVersionId != null)
                    Product.getOneProductVersion($scope.transfer.productVersionId).then(function (data) {
                        $scope.cbxSelectizeProject.Options = [];
                        $scope.cbxSelectizeProject.Options.push(data);
                        $scope.cbxSelectizeProject.ngModel = data.id;
                    })
            }

            $scope.FIRST_TIME_EDIT = true;
            $scope.ALLOW_EDIT = false;
            $scope.handleOperationTypeChange = function () {
                if(!$scope.ALLOW_EDIT)
                    return;

                if($scope.FIRST_TIME_EDIT) {
                    $scope.FIRST_TIME_EDIT = false;
                    return;
                }

                if($scope.cbxSelectizeOperationType.ngModel != null)
                    $scope.transfer.operationTypeId = $scope.cbxSelectizeOperationType.ngModel;
            }

            // Create / Update
            if (angular.element('#form_create_transfer').length) {

                //================schedule Date===========//
                $("#datetimepicker").kendoDateTimePicker({
                    format: "dd/MM/yyyy HH:mm:ss",
                    change: function() {
                        var value = this.value();
                        if(value !=null){
                            $scope.scheduledDateModel = genDateTime(value.getTime())
                        }

                    }
                });

                var today = new Date();
                $scope.scheduledDateModel = genDateTime(today.getTime())
                var datepicker = $("#datetimepicker").data("kendoDateTimePicker");
                datepicker.value($scope.scheduledDateModel);
                datepicker.trigger("change");
                //=======================================//

                $scope.ALLOW_EDIT = true;
                $scope.submit = function() {
                    //for waiting update
                    $scope.blockModal;
                    $scope.blockUI = function () {
                        $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please Wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner.gif\' alt=\'\'>');
                    }

                    if($scope.isTargetItemEdit || $scope.isTargetItemEditDetail) {
                        return;
                    }

                    if($scope.isTargetItem && $scope.createItemOperation.productId != null) {
                        return;
                    }

                    if($scope.isTargetItemDetail && $scope.createItem.productId != null) {
                        return;
                    }

                    $('#form_create_transfer').parsley();
                    if($scope.form_create_transfer.$valid && $scope.validateLocationSuccess){
                        if (angular.element('#edit_form').length) {
                            $scope.blockUI();

                            // Edit
                            /*Warehouse.update($scope.warehouse.id, $scope.warehouse)
                                .then(function(data){
                                    $state.go('warehouses-detail',{warehouseId: $scope.warehouse.id });
                                })
                                .catch(function(data){
                                    //console.log("ERROR", data);
                                    ErrorHandle.handleError(data);
                                })*/
                            if($scope.scheduledDateModel != null)
                                $scope.transfer.scheduledDate = $scope.convertDate($scope.scheduledDateModel);
                            if($scope.selectize_priority != null)
                                $scope.transfer.priority = getPriorityType($scope.selectize_priority);

                            // Update Detail Tab
                            $scope.updateList = [];
                            for(var i = 0; i < $scope.list_op_detail.length; i++) {
                                if( $scope.list_op_detail[i].ADD_TO_UPDATE_LIST != undefined && $scope.list_op_detail[i].ADD_TO_UPDATE_LIST == true) {
                                    $scope.updateList.push($scope.list_op_detail[i]);
                                }
                            }
                            $scope.transfer.transferDetails = $scope.updateList;
                            $scope.transfer.removedTransferDetails = $scope.removeList;

                            // Update Operation Tab
                            $scope.updateListOperation = [];
                            for(var i = 0; i < $scope.list_op_item.length; i++) {
                                if( $scope.list_op_item[i].ADD_TO_UPDATE_LIST != undefined && $scope.list_op_item[i].ADD_TO_UPDATE_LIST == true) {
                                    $scope.updateListOperation.push($scope.list_op_item[i]);
                                }
                            }
                            $scope.transfer.transferItems = $scope.updateListOperation;
                            $scope.transfer.removedTransferItems = $scope.removeListItem;

                            /*if($scope.checkRowsIsEdited()) {
                                AlertService.error("transfer.messages.rowIsEdited");
                                return;
                            }*/

                            //console.log($scope.removeList);
                            // console.log($scope.transfer)
                            if($scope.operationTypeTransfer.type == 'manufacturing') {
                                $scope.transfer.transferItems = $scope.updatedTransferItems;
                            }
                            console.log($scope.transfer);
                            Transfer.update($scope.transfer)
                                .then(function(data){
                                    if ($scope.blockModal != null)
                                        $scope.blockModal.hide();

                                    if($scope.isValidate){
                                        $scope.validateTransfer()
                                        $scope.isValidate = false
                                    } else {
                                        $state.go('transfers-detail',{transferId: $scope.transfer.id }, { reload: true });
                                    }

                                })
                                .catch(function(data){
                                    //console.log('data',data);
                                    AlertService.error(data.data.title);
                                })
                        } else if (angular.element('#create_form').length){
                            // Create
                            if($scope.scheduledDateModel != null)
                                $scope.transfer.scheduledDate = $scope.convertDate($scope.scheduledDateModel);
                            if($scope.selectize_priority != null)
                                $scope.transfer.priority = getPriorityType($scope.selectize_priority);

                            $scope.transfer.transferDetails = $scope.list_op_detail;
                            $scope.transfer.transferItems = $scope.list_op_item;

                            /*if($scope.checkRowsIsEdited()) {
                                AlertService.error("transfer.messages.rowIsEdited");
                                return;
                            }*/

                            //console.log($scope.transfer)

                            Transfer.create($scope.transfer)
                                .then(function(data){
                                    $state.go('transfers',{}, { reload: true });
                                })
                                .catch(function(data){
                                    //console.log("ERROR", data);
                                    ErrorHandle.handleError(data);
                                })
                        }
                    }
                }

                if ( angular.element('#form_create_transfer').length ) {
                    $scope.required_msg = 'transfer.messages.required';

                    var $formValidate = $('#form_create_transfer');
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

                $scope.saveAndValidate = function () {
                    $scope.isValidate = true
                    $scope.submit()

                }
            }

            $scope.showNodataTabOperation = false;
            $scope.showNodataTabDetail = false;
            $scope.setTableEmptyStatus = function(tab, checkboxAll) {
                $scope[tab] = true;
                checkboxAll
                    .iCheck({
                        checkboxClass: 'icheckbox_md',
                        radioClass: 'iradio_md',
                        increaseArea: '20%'
                    })
                checkboxAll.prop('checked',false).iCheck('update');
            }

            // Detail
            if (angular.element('#transfer_detail').length) {
                Transfer.getOne($stateParams.transferId).then(function (data) {
                    OperationType.getOne(data.operationTypeId).then(function (operation_type) {
                        $scope.operationTypeTransfer = operation_type;
                        if($scope.operationTypeTransfer.type == 'manufacturing' ){
                            $scope.levelTransfer = data.moItems;
                        }
                    });

                    $scope.transfer = data;
                    $scope.status =  $scope.transfer.state;
                    $scope.urlSourceLink = '#/operation-types/'+ $scope.transfer.operationTypeId +'/details';
                    $scope.urlSourceLinkProduct = '#/products/'+ $scope.transfer.productVersionId +'/details';
                    $scope.urlLocName = '/api/operation-types/';
                    $scope.urlGetPartner = '/api/companies/';
                    $scope.urlGetLocation = '/api/locations/';
                    $scope.urlGetUser = '/api/users/';
                    $scope.attrName = 'name';
                    $scope.attrDisplayName = 'displayName';
                    $scope.attrUser = 'email';
                    //console.log($scope.bomDetail);
                    $scope.setDataComboboxField();

                    Transfer.getOperationTab("query=transferId==" + $stateParams.transferId + "&size=" + $scope.MAX_NUMBER_ITEMS).then(function (data) {
                        $scope.list_op_item = data.data;

                        if($scope.list_op_item.length == 0)
                            $scope.setTableEmptyStatus('showNodataTabOperation', $('.ts_checkbox_all'));
                    })

                    Transfer.getOperationDetailTab("query=transferId==" + $stateParams.transferId  + "&size=" + $scope.MAX_NUMBER_ITEMS).then(function (data) {
                        $scope.list_op_detail = data.data;
                        for (var i =0; i < $scope.list_op_detail.length; i++){
                            if($scope.list_op_detail[i].reserved > 0){
                                $scope.isReserved = true
                            }
                        }

                        if($scope.list_op_detail.length == 0)
                            $scope.setTableEmptyStatus('showNodataTabDetail', $('.ts_checkbox_all_op_detail'));
                    })

                    Location.getOne($scope.transfer.srcLocationId).then(function (location) {
                        $scope.scrLocationType = location.type
                    })
                })
                /*if(angular.isDefined($stateParams.transferId) && $stateParams.transferId != null)
                    newTableIdsRd.customParams += "transferId==" + $stateParams.transferId;
                TableMultiple.reloadPage(newTableIdsRd.idTable);*/

                /*if(angular.isDefined($stateParams.transferId) && $stateParams.transferId != null)
                    newTableIdsDetail.customParams += "transferId==" + $stateParams.transferId;
                TableMultiple.reloadPage(newTableIdsDetail.idTable);*/
                //end control for transfer detail

                // initialize tables
                $scope.$on('onLastRepeat', function (scope, element, attrs) {

                    var $ts_pager_filter = $("#table_op_tab_sorter"),
                        $columnSelector = $('#columnSelector'),
                        $ts_pager_detail_filter = $("#table_op_detail_tab_sorter"),
                        $columnDetailSelector = $('#columnDetailSelector'),
                        $ts_table_op_return = $('#table_op_return'),
                        $ts_table_detail_return = $('#table_detail_return');

                    // OPERATION
                    if($(element).closest($ts_pager_filter).length) {
                        // Initialize tablesorter
                        var ts_operation = $ts_pager_filter
                            .tablesorter({
                                theme: 'altair',
                                widthFixed: true,
                                widgets: ['zebra', 'filter','columnSelector'],
                                headers: {
                                    0: {
                                        sorter: false,
                                        parser: false
                                    }
                                },
                                widgetOptions : {
                                    // column selector widget
                                    columnSelector_container : $columnSelector,
                                    columnSelector_name : 'data-name',
                                    columnSelector_layout : '<li class="padding_md"><input type="checkbox"><label class="inline-label">{name}</label></li>',
                                    columnSelector_saveColumns: false
                                }
                            })
                            // initialize the pager plugin
                            //.tablesorterPager();

                        // replace column selector checkboxes
                        $columnSelector.children('li').each(function(index) {
                            var $this = $(this);

                            var id = index == 0 ? 'auto' : index;
                            $this.children('input').attr('id','column_'+id);
                            $this.children('label').attr('for','column_'+id);

                            $this.children('input')
                                .prop('checked',true)
                                .iCheck({
                                    checkboxClass: 'icheckbox_md',
                                    radioClass: 'iradio_md',
                                    increaseArea: '20%'
                                });

                            if(index != 0) {
                                $this.find('input')
                                    .on('ifChanged', function (ev) {
                                        $(ev.target).toggleClass('checked').change();
                                    })
                            }

                        });

                        $('#column_auto')
                            .on('ifChecked',function(ev) {
                                $(this)
                                    .closest('li')
                                    .siblings('li')
                                    .find('input').iCheck('disable');
                                $(ev.target).removeClass('checked').change();
                            })
                            .on('ifUnchecked',function(ev) {
                                $(this)
                                    .closest('li')
                                    .siblings('li')
                                    .find('input').iCheck('enable');
                                $(ev.target).addClass('checked').change();
                            });

                        // select/unselect table rows
                        $('.ts_checkbox_all')
                            .iCheck({
                                checkboxClass: 'icheckbox_md',
                                radioClass: 'iradio_md',
                                increaseArea: '20%'
                            })
                            .on('ifChecked',function() {
                                $ts_pager_filter
                                    .find('.ts_checkbox')
                                    // check all checkboxes in table
                                    .prop('checked',true)
                                    .iCheck('update')
                                    // add highlight to row
                                    .closest('tr')
                                    .addClass('row_highlighted');
                            })
                            .on('ifUnchecked',function() {
                                $ts_pager_filter
                                    .find('.ts_checkbox')
                                    // uncheck all checkboxes in table
                                    .prop('checked',false)
                                    .iCheck('update')
                                    // remove highlight from row
                                    .closest('tr')
                                    .removeClass('row_highlighted');
                            });

                        // select/unselect table row
                        $ts_pager_filter.find('.ts_checkbox')
                            .on('ifUnchecked',function() {
                                $(this).closest('tr').removeClass('row_highlighted');
                                $('.ts_checkbox_all').prop('checked',false).iCheck('update');
                            }).on('ifChecked',function() {
                            $(this).closest('tr').addClass('row_highlighted');
                        });
                    }
                    // DETAIL OPERATION
                    else if($(element).closest($ts_pager_detail_filter).length) {
                        // Initialize tablesorter
                        var ts_operation_detail = $ts_pager_detail_filter
                            .tablesorter({
                                theme: 'altair',
                                widthFixed: true,
                                widgets: ['zebra', 'filter','columnSelector'],
                                headers: {
                                    0: {
                                        sorter: false,
                                        parser: false
                                    }
                                },
                                widgetOptions : {
                                    // column selector widget
                                    columnSelector_container : $columnDetailSelector,
                                    columnSelector_name : 'data-name',
                                    columnSelector_layout : '<li class="padding_md"><input type="checkbox"><label class="inline-label">{name}</label></li>',
                                    columnSelector_saveColumns: false
                                }
                            })
                            // initialize the pager plugin
                            //.tablesorterPager();

                        // replace column selector checkboxes
                        $columnDetailSelector.children('li').each(function(index) {
                            var $this = $(this);

                            var id = index == 0 ? 'auto' : index;
                            $this.children('input').attr('id','column_'+id);
                            $this.children('label').attr('for','column_'+id);

                            $this.children('input')
                                .prop('checked',true)
                                .iCheck({
                                    checkboxClass: 'icheckbox_md',
                                    radioClass: 'iradio_md',
                                    increaseArea: '20%'
                                });

                            if(index != 0) {
                                $this.find('input')
                                    .on('ifChanged', function (ev) {
                                        $(ev.target).toggleClass('checked').change();
                                    })
                            }

                        });

                        $(".op-detail").find('#column_auto')
                            .on('ifChecked',function(ev) {
                                $(this)
                                    .closest('li')
                                    .siblings('li')
                                    .find('input').iCheck('disable');
                                $(ev.target).removeClass('checked').change();
                            })
                            .on('ifUnchecked',function(ev) {
                                $(this)
                                    .closest('li')
                                    .siblings('li')
                                    .find('input').iCheck('enable');
                                $(ev.target).addClass('checked').change();
                            });

                        // select/unselect table rows
                        $('.ts_checkbox_all_op_detail')
                            .iCheck({
                                checkboxClass: 'icheckbox_md',
                                radioClass: 'iradio_md',
                                increaseArea: '20%'
                            })
                            .on('ifChecked',function() {
                                $ts_pager_detail_filter
                                    .find('.ts_checkbox')
                                    // check all checkboxes in table
                                    .prop('checked',true)
                                    .iCheck('update')
                                    // add highlight to row
                                    .closest('tr')
                                    .addClass('row_highlighted');
                            })
                            .on('ifUnchecked',function() {
                                $ts_pager_detail_filter
                                    .find('.ts_checkbox')
                                    // uncheck all checkboxes in table
                                    .prop('checked',false)
                                    .iCheck('update')
                                    // remove highlight from row
                                    .closest('tr')
                                    .removeClass('row_highlighted');
                            });

                        // select/unselect table row
                        $ts_pager_detail_filter.find('.ts_checkbox')
                            .on('ifUnchecked',function() {
                                $(this).closest('tr').removeClass('row_highlighted');
                                $('.ts_checkbox_all_op_detail').prop('checked',false).iCheck('update');
                            }).on('ifChecked',function() {
                            $(this).closest('tr').addClass('row_highlighted');
                        });
                    }

                    else if($(element).closest($ts_table_op_return).length) {
                        // Initialize tablesorter
                        var table_op_return = $ts_table_op_return
                            .tablesorter({
                                theme: 'altair',
                                widthFixed: true,
                                widgets: ['zebra', 'filter','columnSelector'],
                                headers: {
                                    0: {
                                        sorter: false,
                                        parser: false
                                    }
                                }
                            })

                    }
                    else if($(element).closest($ts_table_detail_return).length) {
                        // Initialize tablesorter
                        var table_detail_return = $ts_table_detail_return
                            .tablesorter({
                                theme: 'altair',
                                widthFixed: true,
                                widgets: ['zebra', 'filter','columnSelector'],
                                headers: {
                                    0: {
                                        sorter: false,
                                        parser: false
                                    }
                                }
                            })

                    }

                });
            }

			$scope.CbxOperationTypeD = {
                Placeholder : 'Select operation type',
                TextField : 'displayName',
                ValueField : 'id',
                Size : "10",
                Api : "api/operation-types"
            }

            $scope.CbxLocationD = {
                Placeholder : 'Select location',
                TextField : 'completeName',
                ValueField : 'id',
                Size : "10",
                Api : "api/locations"
            }

            $scope.CbxPartnerD = {
                Placeholder : 'Select partner',
                TextField : 'name',
                ValueField : 'id',
                Size : "10",
                Api : "api/companies"
            }

            $scope.CbxProjectD = {
                Placeholder : 'Select project',
                TextField : 'name',
                ValueField : 'id',
                Size : "10",
                Api : "api/product-version"
            }

            $scope.CbxAssigneeD = {
                Placeholder : 'Select assignee',
                TextField : 'email',
                ValueField : 'id',
                Size : "10",
                Api : "api/users"
            }

			function getPriorityTypeName(name){
                for (var i=0; i<$scope.PRIORITY_TYPE.length;i++ ){
                    if ($scope.PRIORITY_TYPE[i].name == name){
                        return $scope.PRIORITY_TYPE[i].id;
                    }
                }
            }

            // Edit
            if (angular.element('#edit_form').length && $stateParams.transferId) {
			    $scope.ALLOW_EDIT = false;
			    // Operation Tab
                $scope.selectize_man_edit_options_operation = [];
                $scope.selectize_man_id_edit_options_operation = [];
                $scope.selectize_man_pn_edit_options_operation = [];
                $scope.selectize_man_edit_operation = [];
                $scope.selectize_man_id_edit_operation = [];
                $scope.selectize_man_pn_edit_operation = [];
                $scope.enabledManEditOperation = [];
                $scope.validateEditItemSuccessOperation = [];

                $scope.selectFromVNPTManPNEdit = [];
                $scope.selectFromManPNEdit = [];

                $scope.cbxSelectizeProductOperationEdit = [];
                $scope.cbxSelectizeProductOperationEditInit = [];

                $scope.cbxSelectizeDescriptionOperationEdit = [];
                $scope.cbxSelectizeDescriptionOperationEditInit = [];

                $scope.cbxSelectizeVNPTManPNOperationEdit = [];
                $scope.cbxSelectizeVNPTManPNOperationEditInit = [];

                $scope.cbxSelectizeManPNOperationEdit = [];
                $scope.cbxSelectizeManPNOperationEditInit = [];

                // Operation Detail Tab
			    $scope.selectize_man_edit_options = [];
                $scope.selectize_man_id_edit_options = [];
                $scope.selectize_man_pn_edit_options = [];
                $scope.selectize_man_edit = [];
                $scope.selectize_man_id_edit = [];
                $scope.selectize_man_pn_edit = [];
                $scope.enabledManEdit = [];
                $scope.validateEditItemSuccess = [];

                $scope.selectFromVNPTManPNEditDetail = [];
                $scope.selectFromManPNEditDetail = [];

                $scope.cbxSelectizeProductOperationEditDetail = [];
                $scope.cbxSelectizeProductOperationEditInitDetail = [];

                $scope.cbxSelectizeDescriptionOperationEditDetail = [];
                $scope.cbxSelectizeDescriptionOperationEditInitDetail = [];

                $scope.cbxSelectizeVNPTManPNOperationEditDetail = [];
                $scope.cbxSelectizeVNPTManPNOperationEditInitDetail = [];

                $scope.cbxSelectizeManPNOperationEditDetail = [];
                $scope.cbxSelectizeManPNOperationEditInitDetail = [];

                $scope.cbxSelectizeFromOperationEditDetail = [];
                $scope.cbxSelectizeFromOperationEditInitDetail = [];

                $scope.cbxSelectizeToOperationEditDetail = [];
                $scope.cbxSelectizeToOperationEditInitDetail = [];

                $scope.cbxSelectizeSourcePackageOperationEditDetail = [];
                $scope.cbxSelectizeSourcePackageOperationEditInitDetail = [];

                $scope.cbxSelectizeDestinationPackageOperationEditDetail = [];
                $scope.cbxSelectizeDestinationPackageOperationEditInitDetail = [];

                $scope.cbxSelectizeSerialLotOperationEditDetail = [];
                $scope.cbxSelectizeSerialLotOperationEditInitDetail = [];

                Transfer.getOperationTab("query=transferId=="+$stateParams.transferId + "&size=" + $scope.MAX_NUMBER_ITEMS)
                    .then(function (data) {
                        for(var i = 0; i < data.data.length; i++) {
                            $scope.selectize_man_edit_options_operation.push([])
                            $scope.selectize_man_id_edit_options_operation.push([])
                            $scope.selectize_man_pn_edit_options_operation.push([])
                            $scope.selectize_man_edit_operation.push([])
                            $scope.selectize_man_id_edit_operation.push([])
                            $scope.selectize_man_pn_edit_operation.push([])
                            $scope.enabledManEditOperation.push(false)
                            $scope.validateEditItemSuccessOperation.push(false)

                            $scope.createNewSelectizeProductOperation();
                        }

                        Transfer.getOperationDetailTab("query=transferId=="+$stateParams.transferId + "&size=" + $scope.MAX_NUMBER_ITEMS)
                            .then(function (data) {
                                for(var i = 0; i < data.data.length; i++) {
                                    $scope.selectize_man_edit_options.push([])
                                    $scope.selectize_man_id_edit_options.push([])
                                    $scope.selectize_man_pn_edit_options.push([])
                                    $scope.selectize_man_edit.push([])
                                    $scope.selectize_man_id_edit.push([])
                                    $scope.selectize_man_pn_edit.push([])
                                    $scope.enabledManEdit.push(false)
                                    $scope.validateEditItemSuccess.push(false)

                                    $scope.createNewSelectizeProductOperationDetail();
                                }

                                Transfer.getOne($stateParams.transferId).then(function (data) {
                                    OperationType.getOne(data.operationTypeId).then(function (operation_type) {
                                        $scope.operationTypeTransfer = operation_type;
                                        if($scope.operationTypeTransfer.type == 'manufacturing' ){
                                            $scope.levelTransfer = data.moItems;
                                        }
                                    });

                                    $scope.transfer = data;
                                    $scope.selectize_priority = getPriorityTypeName($scope.transfer.priority);
                                    $scope.scheduledDateModel =  $scope.convertToDateTime($scope.transfer.scheduledDate);
                                    $scope.status =  $scope.transfer.state;

                                    //get default list other projects
                                    var tmpOtherProducts = [];
                                    function allDoneOtherProducts() {
                                        //console.log('so sorry');
                                        $timeout(function () {
                                            $scope.cbxSelectizeOtherProject.Options = tmpOtherProducts;
                                        }, 100);
                                        // console.log(tmpOtherProducts);
                                        // console.log($scope.cbxSelectizeOtherProject.Options);
                                    }
                                    forEach($scope.transfer.otherProjects, function(item, index, arr) {
                                        //console.log("i am here");
                                        Product.getOneProductVersion(item).then(function (data) {
                                            tmpOtherProducts.push(data);
                                            // console.log(tmpOtherProducts);
                                        })
                                    }, allDoneOtherProducts);

                                    datepicker.value(new Date($scope.transfer.scheduledDate));
                                    datepicker.trigger("change");

                                    /*if(angular.isDefined($stateParams.transferId) && $stateParams.transferId != null)
                                        newTableIdsRd.customParams += "transferId==" + $stateParams.transferId;
                                    TableMultiple.reloadPage(newTableIdsRd.idTable);

                                    if(angular.isDefined($stateParams.transferId) && $stateParams.transferId != null)
                                        newTableIdsDetail.customParams += "transferId==" + $stateParams.transferId;
                                    TableMultiple.reloadPage(newTableIdsDetail.idTable);*/

                                    $scope.setDataComboboxField();

                                    Transfer.getOperationTab("query=transferId==" + $stateParams.transferId + "&size=" + $scope.MAX_NUMBER_ITEMS).then(function (data) {
                                        $scope.list_op_item = data.data;
                                    })

                                    Transfer.getOperationDetailTab("query=transferId==" + $stateParams.transferId + "&size=" + $scope.MAX_NUMBER_ITEMS).then(function (data) {
                                        $scope.list_op_detail = data.data;
                                    })

                                    $scope.validateLocation();
                                    $scope.watchAndUpdateFromLocation();
                                    $scope.watchAndUpdateToLocation();
                                })

                            })
                            .catch(function (data) {
                                ErrorHandle.handleError(data)
                            })

                    })
                    .catch(function (data) {
                        ErrorHandle.handleError(data)
                    })
            }


            /**********************************************************************************************************/
            /**********************************************************************************************************/
            /**************************************************** PHUONG ND *******************************************/

            $scope.checkRowsIsEdited = function () {
                if($scope.createItem.isEdited != undefined && $scope.createItem.isEdited == true)
                    return true;

                if($scope.createItemOperation.isEdited != undefined && $scope.createItemOperation.isEdited == true)
                    return true;

                for(var i = 0; i< $scope.list_op_item.length; i++) {
                    if($scope.list_op_item[i].editable != undefined && $scope.list_op_item[i].editable == true) {
                        return true;
                    }
                }

                for(var i = 0; i< $scope.list_op_detail.length; i++) {
                    if($scope.list_op_detail[i].editable != undefined && $scope.list_op_detail[i].editable == true) {
                        return true;
                    }
                }
                return false;
            }

            // Create OPERATION DETAIL TABS
            if (angular.element('#operation_detail_tab').length) {
                // remove single row
                $("#table_op_detail_tab_sorter").on('click','.ts_remove_row',function(e) {
                    e.preventDefault();

                    var $this = $(this);
                    var id = $this.closest('tr').attr('id');
                    var row_id = id.substr('operation_detail_'.length, id.length);
                    $scope.removeSub(row_id);
                    $scope.isTargetItemEditDetail = false;
                    //$this.closest('tr').remove();
                    //$("#table_op_detail_tab_sorter").trigger('update');
                });

                /*************************** ADD A NEW ROW ************************************************************/
                $scope.createItem = {"isEdited":false};

                $scope.validateCreateNewItemSuccess = false;
                $scope.isNewItem = false;

                $scope.selectize_man_options = [];

                $scope.selectize_man_config = {
                    plugins: {
                        'tooltip': ''
                    },
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select manufacturer...'
                };

                $scope.selectize_man_id_options = [];

                $scope.selectize_man_id_config = {
                    plugins: {
                        'tooltip': ''
                    },
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select manufacturer id...'
                };

                $scope.selectize_man_pn_options = [];

                $scope.selectize_man_pn_config = {
                    plugins: {
                        'tooltip': ''
                    },
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Man P/N...'
                };

                $scope.enabledMan = false;

                $scope.validateAddItem = function () {
                    $scope.validateCreateNewItemSuccess =
                        ($scope.createItem.productId != null) //&&
                        /*($scope.createItem.productName != null) &&
                        ($scope.createItem.manCode != null) &&
                        ($scope.createItem.manId != null) &&
                        ($scope.createItem.manPn != null)*/
                }

                /*$scope.$watch('createItem.productId', function(newval) {
                    $scope.validateAddItem();

                    if(newval != undefined && newval != null && newval > -1) {
                        Product.getOneMv(newval).then(function (data) {
                            //$scope.tempProduct = data;
                            $scope.selectize_man_options = [];
                            $scope.selectize_man_id_options = [];
                            if(data.manWithCode != '{}') {
                                //$scope.selectize_man_options = JSON.parse(data.manWithCode);
                                var ids_map = JSON.parse(data.manWithCode);
                                for (var key in ids_map) {
                                    if (ids_map.hasOwnProperty(key)) {
                                        $scope.selectize_man_options.push(ids_map[key])
                                        $scope.selectize_man_id_options.push(key)
                                    }
                                }
                                $scope.createItem.manpnConfigs = JSON.parse(data.manWithPns);
                                $scope.enabledMan = true;
                            } else {
                                $scope.selectize_man = "";
                                $scope.enabledMan = false;
                            }
                            $scope.createItem.productName = data.description;
                        }).catch(function(data){
                            AlertService.error("transfer.messages.canNotGetData");
                        })
                    }

                });

                $scope.$watch('selectize_man', function(newval) {
                    if(newval != undefined && newval != null) {
                        $scope.createItem.manCode = newval;
                        var index = -1;
                        for (var key in $scope.selectize_man_options) {
                            if ($scope.selectize_man_options.hasOwnProperty(key)) {
                                if($scope.selectize_man_options[key].value == newval){
                                    index = key;
                                }
                            }
                        }
                        if(index > -1) {
                            $scope.selectize_man_id = $scope.selectize_man_id_options[index].value;
                        }
                    } else {
                        $scope.createItem.manCode = null;
                    }
                    $scope.validateAddItem();
                });

                $scope.$watch('selectize_man_id', function(newval) {
                    if(newval != undefined && newval != null) {
                        $scope.createItem.manId = newval;
                        for (var key in $scope.createItem.manpnConfigs) {
                            if ($scope.createItem.manpnConfigs.hasOwnProperty(key)) {
                                if(key == newval) {
                                    $scope.selectize_man_pn_options = $scope.createItem.manpnConfigs[key];
                                }
                            }
                        }
                    } else {
                        $scope.createItem.manId = null;
                    }
                    $scope.validateAddItem();
                });

                $scope.$watch('selectize_man_pn', function(newval) {
                    if(newval != undefined && newval != null) {
                        $scope.createItem.manPn = newval;
                    } else {
                        $scope.createItem.manPn = null;
                    }
                    $scope.validateAddItem();
                });*/

                $scope.addNewItem = function () {
                    if($scope.isTargetItemDetail){
                        $scope.ALLOW_SHOW_NEW_ROW_TAB_DETAIL_AFTER_CREATE = true;
                        return
                    }
                    $scope.ALLOW_SHOW_NEW_ROW_TAB_DETAIL_AFTER_CREATE = false;

                    if(!$scope.isTargetItemDetail){
                        $timeout(function () {
                            $scope.isTargetItemDetail = !$scope.isTargetItemDetail
                        }, 100);
                    }
                    $scope.isNewItem = !$scope.isNewItem
                    var isEdited = $scope.createItem.isEdited;
                    $scope.createItem = {}
                    $scope.createItem.productId = null
                    $scope.createItem.isEdited = !isEdited;
                    $scope.createItem.doneQuantity = 0;
                    $scope.selectize_man_options = []
                    $scope.selectize_man_id_options = []
                    $scope.selectize_man_pn_options = []

                    $scope.cbxSelectizeProductOperationDetail.Options = [];
                    $scope.cbxSelectizeProductOperationDetail.ngModel = -1;
                    $scope.validateAddItem();
                }

                $scope.createNewItem = function () {
                    $('#form_create_operation_detail').parsley();

                    if($scope.form_create_operation_detail.$valid && $scope.validateCreateNewItemSuccess){
                        var exist = 0;
                        for(var i = 0; i < $scope.list_op_detail.length; i++) {
                            if($scope.list_op_detail[i].productId == $scope.createItem.productId) {
                                exist = 1;
                                break;
                            }
                        }

                        //if(exist == 0) {
                        $scope.createItem.ADD_TO_UPDATE_LIST = true;
                        if($scope.cbxSelectizeFromOperationDetail.ngModelObject != null &&
                            $scope.cbxSelectizeFromOperationDetail.ngModelObject != undefined) {
                            if($scope.cbxSelectizeFromOperationDetail.ngModelObject[0] != undefined)
                                $scope.createItem.srcLocationId = $scope.cbxSelectizeFromOperationDetail.ngModelObject[0].id;
                        }
                        if($scope.cbxSelectizeToOperationDetail.ngModelObject != null &&
                            $scope.cbxSelectizeToOperationDetail.ngModelObject != undefined) {
                            if($scope.cbxSelectizeToOperationDetail.ngModelObject[0] != undefined)
                                $scope.createItem.destLocationId = $scope.cbxSelectizeToOperationDetail.ngModelObject[0].id;
                        }

                        if($scope.cbxSelectizeSourcePackageOperationDetail.ngModelObject != null &&
                            $scope.cbxSelectizeSourcePackageOperationDetail.ngModelObject != undefined) {
                            if($scope.cbxSelectizeSourcePackageOperationDetail.ngModelObject[0] != undefined) {
                                $scope.createItem.srcPackageId = $scope.cbxSelectizeSourcePackageOperationDetail.ngModelObject[0].id;
                                Package.getOne($scope.createItem.srcPackageId).then(function (data) {
                                    var packageNumber = data.packageNumber;
                                    $scope.createItem.srcPackageNumber = packageNumber;

                                    if($scope.cbxSelectizeDestinationPackageOperationDetail.ngModelObject != null &&
                                        $scope.cbxSelectizeDestinationPackageOperationDetail.ngModelObject != undefined) {
                                        if($scope.cbxSelectizeDestinationPackageOperationDetail.ngModelObject[0] != undefined) {
                                            $scope.createItem.destPackageId = $scope.cbxSelectizeDestinationPackageOperationDetail.ngModelObject[0].id;
                                            Package.getOne($scope.createItem.destPackageId).then(function (data) {
                                                var packageNumber2 = data.packageNumber;
                                                $scope.createItem.destPackageNumber = packageNumber2;

                                                if($scope.cbxSelectizeSerialLotOperationDetail.ngModelObject != null &&
                                                    $scope.cbxSelectizeSerialLotOperationDetail.ngModelObject != undefined) {
                                                    if($scope.cbxSelectizeSerialLotOperationDetail.ngModelObject[0] != undefined) {
                                                        $scope.createItem.lotId = $scope.cbxSelectizeSerialLotOperationDetail.ngModelObject[0].id;
                                                        Lot.getOne($scope.createItem.lotId).then(function (data) {
                                                            var packageNumber3 = data.lotNumber;
                                                            $scope.createItem.traceNumber = packageNumber3;

                                                            $scope.setLocationBeforeCreate();

                                                        })
                                                    } else
                                                        $scope.setLocationBeforeCreate();
                                                } else {
                                                    $scope.setLocationBeforeCreate();
                                                }
                                            })
                                        } else
                                            $scope.setLocationBeforeCreate();
                                    } else {
                                        $scope.setLocationBeforeCreate();
                                    }
                                })
                            } else
                                $scope.setLocationBeforeCreate();
                        } else
                            $scope.setLocationBeforeCreate();

                        //} else {
                        //AlertService.error("VNPT P/N is already added")
                        //}
                    }
                }

                $scope.setLocationBeforeCreate = function() {
                    if($scope.createItem.srcLocationId != null) {
                        Location.getOne($scope.createItem.srcLocationId).then(function(data){
                            $scope.createItem.srcLocationName = data.displayName;
                            $scope.createItem.srcLocationCompleteName = data.completeName;

                            if($scope.createItem.destLocationId != null) {
                                Location.getOne($scope.createItem.destLocationId).then(function(data){
                                    $scope.createItem.destLocationName = data.displayName;
                                    $scope.createItem.destLocationCompleteName = data.completeName;

                                    $scope.createNewItemAfter();
                                })
                            } else
                                $scope.createNewItemAfter();
                        })
                    } else
                        $scope.createNewItemAfter();
                }

                $scope.createNewItemAfter = function() {
                    console.log($scope.createItem)
                    $scope.list_op_detail.push($scope.createItem)
                    $scope.selectize_man_edit_options.push([])
                    $scope.selectize_man_id_edit_options.push([])
                    $scope.selectize_man_pn_edit_options.push([])
                    $scope.selectize_man_edit.push([])
                    $scope.selectize_man_id_edit.push([])
                    $scope.selectize_man_pn_edit.push([])
                    $scope.enabledManEdit.push(false)
                    $scope.validateEditItemSuccess.push(false)

                    $timeout(function () {
                        if($scope.ALLOW_SHOW_NEW_ROW_TAB_DETAIL_AFTER_CREATE) {
                            $scope.isNewItem = true;
                            $scope.createItem = {}
                            $scope.createItem.productId = null
                            $scope.createItem.isEdited = false;
                            $scope.createItem.doneQuantity = 0;
                            $scope.selectize_man_options = []
                            $scope.selectize_man_id_options = []
                            $scope.selectize_man_pn_options = []

                            $scope.cbxSelectizeProductOperationDetail.Options = [];
                            $scope.cbxSelectizeProductOperationDetail.ngModel = -1;
                            $scope.validateAddItem();
                            $scope.ALLOW_SHOW_NEW_ROW_TAB_DETAIL_AFTER_CREATE = false;
                        } else {
                            $scope.isNewItem = false
                            $scope.isTargetItemDetail = false
                        }
                    })

                    $scope.createItem = {}
                    $scope.createItem.productId = null
                    $scope.createItem.isEdited = false;
                    $scope.selectize_man_options = []
                    $scope.selectize_man_id_options = []
                    $scope.selectize_man_pn_options = []

                    $scope.createNewSelectizeProductOperationDetail();
                    $('#table_op_detail_tab_sorter')
                        .trigger('destroy');
                }

                $scope.deleteNewOperationDetail = function(event) {
                    event.preventDefault();
                    $timeout(function () {
                        $scope.isNewItem = false;
                        $scope.isTargetItemDetail = false;
                    })
                    $scope.createItem = {}
                    $scope.createItem.productId = null
                    $scope.createItem.isEdited = false;
                    $scope.createItem.doneQuantity = 0;
                    $scope.selectize_man_options = []
                    $scope.selectize_man_id_options = []
                    $scope.selectize_man_pn_options = []

                    $scope.cbxSelectizeProductOperationDetail.Options = [];
                    $scope.cbxSelectizeProductOperationDetail.ngModel = -1;
                    $scope.validateAddItem();
                }

                $scope.isTargetItemDetail = false
                $scope.isTargetItemEditDetail = false
                var recordDetail = $('#newItemDetail')
                $scope.ALLOW_SHOW_NEW_ROW_TAB_DETAIL_AFTER_CREATE = false;
                $(window).click(function(event) {
                    //Create
                    if (recordDetail.has(event.target).length == 0 && !recordDetail.is(event.target)){
                        if($scope.isTargetItemDetail){
                            //check empty row
                            if(!$scope.validateCreateNewItemSuccess) {
                                $timeout(function () {
                                    $scope.isNewItem = false
                                    $scope.isTargetItemDetail = false
                                });
                            } else {
                                $scope.createNewItem()  //create item
                            }
                        }
                    } else {
                        $scope.isTargetItemDetail = true
                    }
                    //Edit
                    var editItem = $('#operation_detail_' + $scope.targetUpdatingOperationDetail)
                    if (editItem.has(event.target).length == 0 && !editItem.is(event.target)){
                        if($scope.isTargetItemEditDetail) {
                            if (angular.isDefined($scope.targetUpdatingOperationDetail)) {
                                $scope.save(event, $scope.targetUpdatingOperationDetail)
                            }
                        }
                    } else {
                        $scope.isTargetItemEditDetail = true
                    }
                });

                $scope.removeSub = function (index) {
                    if (index > -1) {
                        // console.log($scope.list_op_detail[index])
                        if($scope.list_op_detail[index].id != undefined) {
                            $scope.removeList.push($scope.list_op_detail[index].id);
                        }
                        $scope.list_op_detail.splice(index, 1);
                        $scope.selectize_man_edit_options.splice(index, 1);
                        $scope.selectize_man_id_edit_options.splice(index, 1);
                        $scope.selectize_man_pn_edit_options.splice(index, 1);
                        $scope.selectize_man_edit.splice(index, 1);
                        $scope.selectize_man_id_edit.splice(index, 1);
                        $scope.selectize_man_pn_edit.splice(index, 1);
                        $scope.enabledManEdit.splice(index, 1);

                        $scope.cbxSelectizeProductOperationEditDetail.splice(index, 1);
                        $scope.cbxSelectizeProductOperationEditInitDetail.splice(index, 1);

                        $scope.cbxSelectizeDescriptionOperationEditDetail.splice(index, 1);
                        $scope.cbxSelectizeDescriptionOperationEditInitDetail.splice(index, 1);

                        $scope.cbxSelectizeVNPTManPNOperationEditDetail.splice(index, 1);
                        $scope.cbxSelectizeVNPTManPNOperationEditInitDetail.splice(index, 1);

                        $scope.cbxSelectizeManPNOperationEditDetail.splice(index, 1);
                        $scope.cbxSelectizeManPNOperationEditInitDetail.splice(index, 1);

                        $scope.cbxSelectizeFromOperationEditDetail.splice(index, 1);
                        $scope.cbxSelectizeFromOperationEditInitDetail.splice(index, 1);

                        $scope.cbxSelectizeToOperationEditDetail.splice(index, 1);
                        $scope.cbxSelectizeToOperationEditInitDetail.splice(index, 1);

                        $scope.cbxSelectizeSourcePackageOperationEditDetail.splice(index, 1);
                        $scope.cbxSelectizeSourcePackageOperationEditInitDetail.splice(index, 1);

                        $scope.cbxSelectizeDestinationPackageOperationEditDetail.splice(index, 1);
                        $scope.cbxSelectizeDestinationPackageOperationEditInitDetail.splice(index, 1);

                        $scope.cbxSelectizeSerialLotOperationEditDetail.splice(index, 1);
                        $scope.cbxSelectizeSerialLotOperationEditInitDetail.splice(index, 1);
                    }
                }

                $scope.getOneEditOperationDetail = function(item, index) {
                    if(item.productId != null) {
                        Product.getOne(item.productId).then(function (data) {
                            $scope.cbxSelectizeProductOperationEditDetail[index].Options = [];
                            $scope.cbxSelectizeProductOperationEditDetail[index].Options.push(data);
                            $scope.cbxSelectizeProductOperationEditDetail[index].ngModel = item.productId;

                            if (item.manId != null) {
                                ProductMan.getOneByManAndProduct(item.manId, item.productId).then(function (data2) {
                                    if (item.manPn != null) {
                                        $scope.list_op_detail[index].setManPn = item.manPn;
                                    }

                                    $scope.cbxSelectizeVNPTManPNOperationEditDetail[index].Options = [];
                                    $scope.cbxSelectizeVNPTManPNOperationEditDetail[index].Options.push(data2)
                                    $scope.cbxSelectizeVNPTManPNOperationEditDetail[index].ngModel = data2.id;
                                }).catch(function (data) {
                                    AlertService.error("transfer.messages.canNotGetData");
                                })
                            }
                        }).catch(function (data) {
                            AlertService.error("transfer.messages.canNotGetData");
                        })
                    }

                    if(item.srcLocationId != null) {
                        if(item.srcLocationId != $scope.transfer.srcLocationId) {
                            Location.getOne(item.srcLocationId).then(function(data){
                                var obj = data;

                                Location.getOne($scope.transfer.srcLocationId).then(function(data){
                                    $scope.cbxSelectizeFromOperationEditDetail[index].Options = [];
                                    $scope.cbxSelectizeFromOperationEditInitDetail[index].resetScroll = true;
                                    $scope.cbxSelectizeFromOperationEditInitDetail[index].MoreParams = "completeName=='" + data.completeName +  "*'";
                                    $scope.cbxSelectizeFromOperationEditDetail[index].Options.push(obj);
                                    $scope.cbxSelectizeFromOperationEditDetail[index].ngModel = obj.id;
                                })
                            })
                        } else {
                            Location.getOne(item.srcLocationId).then(function (data) {
                                $scope.cbxSelectizeFromOperationEditDetail[index].Options = [];
                                $scope.cbxSelectizeFromOperationEditInitDetail[index].resetScroll = true;
                                $scope.cbxSelectizeFromOperationEditInitDetail[index].MoreParams = "completeName=='" + data.completeName +  "*'";
                                $scope.cbxSelectizeFromOperationEditDetail[index].Options.push(data);
                                $scope.cbxSelectizeFromOperationEditDetail[index].ngModel = data.id;
                            }).catch(function (data) {
                                AlertService.error("transfer.messages.canNotGetData");
                            })
                        }
                    }

                    if(item.destLocationId != null) {
                        if(item.destLocationId != $scope.transfer.destLocationId) {
                            Location.getOne(item.destLocationId).then(function(data){
                                var obj = data;

                                Location.getOne($scope.transfer.destLocationId).then(function(data){
                                    $scope.cbxSelectizeToOperationEditDetail[index].Options = [];
                                    $scope.cbxSelectizeToOperationEditInitDetail[index].resetScroll = true;
                                    $scope.cbxSelectizeToOperationEditInitDetail[index].MoreParams = "completeName=='" + data.completeName +  "*'";
                                    $scope.cbxSelectizeToOperationEditDetail[index].Options.push(obj);
                                    $scope.cbxSelectizeToOperationEditDetail[index].ngModel = obj.id;
                                })
                            })
                        } else {
                            Location.getOne(item.destLocationId).then(function (data) {
                                $scope.cbxSelectizeToOperationEditDetail[index].Options = [];
                                $scope.cbxSelectizeToOperationEditInitDetail[index].resetScroll = true;
                                $scope.cbxSelectizeToOperationEditInitDetail[index].MoreParams = "completeName=='" + data.completeName +  "*'";
                                $scope.cbxSelectizeToOperationEditDetail[index].Options.push(data);
                                $scope.cbxSelectizeToOperationEditDetail[index].ngModel = data.id;
                            }).catch(function (data) {
                                AlertService.error("transfer.messages.canNotGetData");
                            })
                        }
                    }

                    if(item.srcPackageId != null) {
                        Package.getOne(item.srcPackageId).then(function (data) {
                            $scope.cbxSelectizeSourcePackageOperationEditDetail[index].Options = [];
                            $scope.cbxSelectizeSourcePackageOperationEditDetail[index].Options.push(data);
                            $scope.cbxSelectizeSourcePackageOperationEditDetail[index].ngModel = item.srcPackageId;
                        }).catch(function (data) {
                            AlertService.error("transfer.messages.canNotGetData");
                        })
                    }

                    if(item.destPackageId != null) {
                        Package.getOne(item.destPackageId).then(function (data) {
                            $scope.cbxSelectizeDestinationPackageOperationEditDetail[index].Options = [];
                            $scope.cbxSelectizeDestinationPackageOperationEditDetail[index].Options.push(data);
                            $scope.cbxSelectizeDestinationPackageOperationEditDetail[index].ngModel = item.destPackageId;
                        }).catch(function (data) {
                            AlertService.error("transfer.messages.canNotGetData");
                        })
                    }

                    if(item.lotId != null) {
                        Lot.getOne(item.lotId).then(function (data) {
                            $scope.cbxSelectizeSerialLotOperationEditDetail[index].Options = [];
                            $scope.cbxSelectizeSerialLotOperationEditDetail[index].Options.push(data);
                            $scope.cbxSelectizeSerialLotOperationEditDetail[index].ngModel = item.lotId;
                        }).catch(function (data) {
                            AlertService.error("transfer.messages.canNotGetData");
                        })
                    }
                }

                $scope.edit = function($event,index){
                    if($scope.targetUpdatingOperationDetail == index)
                        return;

                    var idRemoveBtn = $('#operation_detail_remove_' + index);
                    if (idRemoveBtn.has($event.target).length == 0 && !idRemoveBtn.is($event.target)){
                        if(angular.isDefined($scope.targetUpdatingOperationDetail) && $scope.targetUpdatingOperationDetail !=index){
                            $scope.save($event,$scope.targetUpdatingOperationDetail)
                        }
                        $scope.entity = $scope.list_op_detail[index];
                        $scope.entity.index = index;
                        $scope.entity.editable = true;
                        $scope.entity.saveClass = '';
                        $scope.selectize_man_edit[index] = $scope.list_op_detail[index].manCode;
                        $scope.selectize_man_id_edit[index] = $scope.list_op_detail[index].manId;
                        $scope.selectize_man_pn_edit[index] = $scope.list_op_detail[index].manPn;
                        $scope.getOneEditOperationDetail($scope.list_op_detail[index], index)
                        $scope.targetUpdatingOperationDetail=index
                    }
                };

                $scope.delete = function($event,index,userIndex){
                    $event.preventDefault();
                    UIkit.modal.confirm('Remove this row (id:'+userIndex+')?', function(){
                        $scope.list_op_detail.splice(index,1);
                    });
                };

                $scope.save = function($event,index){
                    $event.preventDefault();
                    if(!$scope.validateEditItemSuccess[index])
                        AlertService.error("transfer.messages.rowNotValid");
                    else {
                        var exist = 0;
                        for(var i = 0; i < $scope.list_op_detail.length; i++) {
                            if((i != index) && ($scope.list_op_detail[i].productId == $scope.list_op_detail[index].productId)) {
                                exist = 1;
                                break;
                            }
                        }

                        //if(exist == 0) {
                        $scope.list_op_detail[index].editable = false;
                        $scope.list_op_detail[index].ADD_TO_UPDATE_LIST = true;
                        delete $scope.targetUpdatingOperationDetail
                        $timeout(function () {
                            $scope.isTargetItemEditDetail = false
                        })
                        //} else {
                        //AlertService.error("VNPT P/N is already used")
                        //}
                    }

                };

                if (angular.element('#form_create_operation_detail').length) {
                    $scope.required_msg = 'transfer.messages.required';

                    var $formValidate = $('#form_create_operation_detail');
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
                /******************************************************************************************************/

                /*************************** EDIT A ROW ***************************************************************/
                $scope.selectize_man_edit_options = [];
                $scope.selectize_man_id_edit_options = [];
                $scope.selectize_man_pn_edit_options = [];
                $scope.selectize_man_edit = [];
                $scope.selectize_man_id_edit = [];
                $scope.selectize_man_pn_edit = [];
                $scope.enabledManEdit = [];
                $scope.validateEditItemSuccess = [];

                $scope.validateEditItem = function (index) {
                    //console.log($scope.list_op_detail)
                    if($scope.list_op_detail.length > 0)
                        $scope.validateEditItemSuccess[index] =
                            ($scope.list_op_detail[index].productId != null) //&&
                            /*($scope.list_op_detail[index].productName != null) &&
                            ($scope.list_op_detail[index].manCode != null) &&
                            ($scope.list_op_detail[index].manId != null) &&
                            ($scope.list_op_detail[index].manPn != null)*/
                    else $scope.validateEditItemSuccess[index] = false;
                }

                $scope.getOneEdit = function(id, index) {
                    Product.getOneMv(id).then(function (data) {
                        //$scope.tempProduct = data;
                        $scope.selectize_man_edit_options[index] = [];
                        $scope.selectize_man_id_edit_options[index] = [];
                        if(data.manWithCode != '{}') {
                            //$scope.selectize_man_options = JSON.parse(data.manWithCode);
                            var ids_map = JSON.parse(data.manWithCode);
                            for (var key in ids_map) {
                                if (ids_map.hasOwnProperty(key)) {
                                    $scope.selectize_man_edit_options[index].push(ids_map[key])
                                    $scope.selectize_man_id_edit_options[index].push(key)
                                }
                            }
                            //$scope.editItem.manpnConfigs = JSON.parse(data.manWithPns);
                            $scope.list_op_detail[index].manpnConfigs = JSON.parse(data.manWithPns);
                            $scope.enabledManEdit[index] = true;
                        } else {
                            $scope.selectize_man_edit[index] = "";
                            $scope.enabledManEdit[index] = false;
                        }
                        //$scope.editItem.productName = data.description;
                        $scope.list_op_detail[index].productName = data.name;
                        $scope.list_op_detail[index].productDescription = data.description;
                    }).catch(function(data){
                        AlertService.error("transfer.messages.canNotGetData");
                    })
                }

                /*$scope.$watchGroup(['CbxProductDetail.ngModel', 'CbxProductDetail.indexCbx'], function(newVal, oldVal) {
                    if(newVal[0] != null && newVal[0].toString().length > 0){
                        //console.log(newVal[0])
                        //console.log(newVal[1])
                        var index = newVal[1];
                        $scope.validateEditItem(index);
                        $scope.getOneEdit(newVal[0], index);
                    }
                });

                $scope.$watchGroup(['CbxProductDesDetail.ngModel', 'CbxProductDesDetail.indexCbx'], function(newVal, oldVal) {
                    if(newVal[0] != null && newVal[0].toString().length > 0){

                        var index = newVal[1];
                        $scope.validateEditItem(index);
                        $scope.getOneEdit(newVal[0], index);
                    }
                });*/

                $scope.handleEditMan = function (index) {
                    //console.log(index)
                    var newval = $scope.selectize_man_edit[index];
                    if(newval != undefined && newval != null) {
                        $scope.list_op_detail[index].manCode = newval;
                        var pos = -1;
                        for (var key in $scope.selectize_man_edit_options[index]) {
                            if ($scope.selectize_man_edit_options[index].hasOwnProperty(key)) {
                                if($scope.selectize_man_edit_options[index][key].value == newval){
                                    pos = key;
                                }
                            }
                        }
                        if(pos > -1) {
                            if($scope.selectize_man_id_edit_options[index][pos] != null) {
                                $scope.selectize_man_id_edit[index] = $scope.selectize_man_id_edit_options[index][pos].value;
                            }
                        }
                    } else {
                        $scope.selectize_man_id_edit[index] = null;
                        $scope.list_op_detail[index].manCode = null;
                    }
                    $scope.handleEditManId(index);
                    $scope.validateEditItem(index);
                }

                $scope.handleEditManId = function (index) {
                    var newval = $scope.selectize_man_id_edit[index];
                    if(newval != undefined && newval != null) {
                        $scope.list_op_detail[index].manId = newval;
                        for (var key in $scope.list_op_detail[index].manpnConfigs) {
                            if ($scope.list_op_detail[index].manpnConfigs.hasOwnProperty(key)) {
                                if(key == newval) {
                                    $scope.selectize_man_pn_edit_options[index] = $scope.list_op_detail[index].manpnConfigs[key];
                                }
                            }
                        }
                    } else {
                        $scope.selectize_man_pn_edit[index] = null;
                        $scope.list_op_detail[index].manId = null;
                    }
                    $scope.validateEditItem(index);
                }

                $scope.handleEditManPn = function (index) {
                    var newval = $scope.selectize_man_pn_edit[index];
                    if(newval != undefined && newval != null) {
                        $scope.list_op_detail[index].manPn = newval;
                    } else {
                        $scope.list_op_detail[index].manPn = null;
                    }
                    $scope.validateEditItem(index);
                }
                /******************************************************************************************************/

                /********************************************* NEW ****************************************************/
                /****************************************** CREATE ONE ************************************************/
                $scope.selectFromVNPTManPNDetail = false;
                $scope.selectFromManPNDetail = false;
                //Cbx product load more
                $scope.cbxSelectizeProductOperationInitDetail = {
                    url: '/api/products', // ** api load data
                    OriginParams: "type==1", // ** init params -- default: null
                    MoreParams: null, // ** filter params => reload cbx options -- default: null
                    queryRelate : null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false,
                    IsShown: false
                }
                $scope.cbxSelectizeProductOperationDetail = {
                    ngModel : [], // ** value select -- array []
                    ngModelObject : [],
                    Options: [], // ** list options cbx, default: []
                    Scope : $scope,
                    Config: {
                        index: null,
                        placeholder : 'Select VNPT P/N...',
                        plugins: ['infinite_scroll'], //enable load more
                        maxItems: 1,
                        valueField: $scope.cbxSelectizeProductOperationInitDetail.valueField,
                        labelField: $scope.cbxSelectizeProductOperationInitDetail.labelField,
                        searchField: $scope.cbxSelectizeProductOperationInitDetail.searchField,
                        create: false,
                        render: {
                            option: function(data, escape) {
                                return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeProductOperationInitDetail.labelField]) + '</span>' + '</div>';
                            },
                            item: function(data, escape) {
                                return '<div class="item">' + escape(data[$scope.cbxSelectizeProductOperationInitDetail.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function(query, callback) {
                            //$scope.cbxSelectizeProductOperationDetail.ngModel = -1;
                            query = JSON.parse(query)
                            //console.log(query)
                            if($scope.cbxSelectizeProductOperationInitDetail.resetScroll){
                                //console.log('init query.page = 0')
                                query.page = 0;
                                callback($scope.cbxSelectizeProductOperationInitDetail.resetScroll);
                                $scope.cbxSelectizeProductOperationInitDetail.resetScroll = false;
                            }
                            $scope.cbxSelectizeProductOperationInitDetail.page = query.page || 0;
                            if(!$scope.cbxSelectizeProductOperationInitDetail.totalCount || $scope.cbxSelectizeProductOperationInitDetail.totalCount > ( ($scope.cbxSelectizeProductOperationInitDetail.page - 1) * $scope.cbxSelectizeProductOperationInitDetail.perPage) ){
                                var api = apiData.genApi($scope.cbxSelectizeProductOperationInitDetail.url, $scope.cbxSelectizeProductOperationInitDetail.searchField, query.search, $scope.cbxSelectizeProductOperationInitDetail.perPage, null, $scope.cbxSelectizeProductOperationInitDetail.OriginParams,query.page,$scope.cbxSelectizeProductOperationInitDetail.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxSelectizeProductOperationInitDetail.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                $scope.$watch('cbxSelectizeProductOperationDetail.ngModelObject', function(newVal) {
                    if(newVal != undefined && newVal != null) {
                        if(newVal[0] != undefined) {
                            // console.log(newVal)
                            if($scope.selectFromVNPTManPNDetail) {
                                $scope.selectFromVNPTManPNDetail = false;
                            } else if($scope.selectFromManPNDetail) {

                            } else {
                                $scope.cbxSelectizeVNPTManPNOperationDetail.Options = [];
                                $scope.cbxSelectizeVNPTManPNOperationInitDetail.resetScroll = true;
                                $scope.cbxSelectizeVNPTManPNOperationInitDetail.MoreParams = "productId==" + newVal[0].id;
                            }

                            $scope.createItem.productId = Number(newVal[0].id);
                            $scope.createItem.productName = newVal[0].name;
                            $scope.createItem.productDescription = newVal[0].description;
                        } else {
                            $scope.cbxSelectizeVNPTManPNOperationDetail.Options = [];
                            $scope.cbxSelectizeVNPTManPNOperationInitDetail.resetScroll = true;
                            $scope.cbxSelectizeVNPTManPNOperationInitDetail.MoreParams = "";
                            //$scope.cbxSelectizeVNPTManPNOperationDetail.ngModel = -1;

                            $scope.cbxSelectizeManPNOperationDetail.Options = [];
                            $scope.cbxSelectizeManPNOperationInitDetail.resetScroll = true;
                            $scope.cbxSelectizeManPNOperationInitDetail.MoreParams = "manufacturerPn!=null;manufacturerPn!=''";
                            //$scope.cbxSelectizeManPNOperationDetail.ngModel = -1;

                            $scope.createItem.productId = null;
                            $scope.createItem.productName = null;
                            $scope.createItem.productDescription = null;
                            $scope.createItem.manId = null;
                            $scope.createItem.manPn = null;
                            $scope.createItem.internalReference = null;
                            $scope.createItem.doneQuantity = 0;
                        }
                    }
                    $scope.validateAddItem();
                }, true);

                $scope.$watch('cbxSelectizeProductOperationInitDetail.IsShown', function(newVal) {
                    /*if(newVal != undefined && newVal != null) {
                        if(newVal) {
                            var height = $('#operation_detail_tab').height();
                            $("#operation_detail_tab").animate({
                                scrollTop:  height
                            });
                        }
                    }*/
                }, true);
                //end Cbx product load more

                //Cbx Description more
                $scope.cbxSelectizeDescriptionOperationInitDetail = {
                    url: '/api/products', // ** api load data
                    OriginParams: "type==1", // ** init params -- default: null
                    MoreParams: null, // ** filter params => reload cbx options -- default: null
                    queryRelate : null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'description', searchField: 'description', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false,
                    IsShown: false
                }
                $scope.cbxSelectizeDescriptionOperationDetail = {
                    ngModel : [], // ** value select -- array []
                    ngModelObject : [],
                    Options: [], // ** list options cbx, default: []
                    Scope : $scope,
                    Config: {
                        placeholder : 'Select Description...',
                        plugins: ['infinite_scroll'], //enable load more
                        maxItems: 1,
                        valueField: $scope.cbxSelectizeDescriptionOperationInitDetail.valueField,
                        labelField: $scope.cbxSelectizeDescriptionOperationInitDetail.labelField,
                        searchField: $scope.cbxSelectizeDescriptionOperationInitDetail.searchField,
                        create: false,
                        render: {
                            option: function(data, escape) {
                                return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeDescriptionOperationInitDetail.labelField]) + '</span>' + '</div>';
                            },
                            item: function(data, escape) {
                                return '<div class="item">' + escape(data[$scope.cbxSelectizeDescriptionOperationInitDetail.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function(query, callback) {
                            //$scope.cbxSelectizeDescriptionOperationDetail.ngModel = -1;
                            query = JSON.parse(query)
                            //console.log(query)
                            if($scope.cbxSelectizeDescriptionOperationInitDetail.resetScroll){
                                //console.log('init query.page = 0')
                                query.page = 0;
                                callback($scope.cbxSelectizeDescriptionOperationInitDetail.resetScroll);
                                $scope.cbxSelectizeDescriptionOperationInitDetail.resetScroll = false;
                            }
                            $scope.cbxSelectizeDescriptionOperationInitDetail.page = query.page || 0;
                            if(!$scope.cbxSelectizeDescriptionOperationInitDetail.totalCount || $scope.cbxSelectizeDescriptionOperationInitDetail.totalCount > ( ($scope.cbxSelectizeDescriptionOperationInitDetail.page - 1) * $scope.cbxSelectizeDescriptionOperationInitDetail.perPage) ){
                                var api = apiData.genApi($scope.cbxSelectizeDescriptionOperationInitDetail.url, $scope.cbxSelectizeDescriptionOperationInitDetail.searchField, query.search, $scope.cbxSelectizeDescriptionOperationInitDetail.perPage, null, $scope.cbxSelectizeDescriptionOperationInitDetail.OriginParams,query.page,$scope.cbxSelectizeDescriptionOperationInitDetail.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxSelectizeDescriptionOperationInitDetail.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                $scope.$watch('cbxSelectizeDescriptionOperationInitDetail.IsShown', function(newVal) {
                    /*if(newVal != undefined && newVal != null) {
                        if(newVal) {
                            var height = $('#operation_detail_tab').height();
                            $("#operation_detail_tab").animate({
                                scrollTop:  height
                            });
                        }
                    }*/
                }, true);
                //end Cbx Description load more

                //Cbx vnpt manpn load more
                $scope.cbxSelectizeVNPTManPNOperationInitDetail = {
                    url: '/api/product-man', // ** api load data
                    OriginParams: null, // ** init params -- default: null
                    MoreParams: null, // ** filter params => reload cbx options -- default: null
                    queryRelate : null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'internalReference', searchField: 'internalReference', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false,
                    IsShown: false
                }
                $scope.cbxSelectizeVNPTManPNOperationDetail = {
                    ngModel : [], // ** value select -- array []
                    ngModelObject : [],
                    Options: [], // ** list options cbx, default: []
                    Scope : $scope,
                    Config: {
                        placeholder : 'Select VNPT ManPN...',
                        plugins: ['infinite_scroll'], //enable load more
                        maxItems: 1,
                        valueField: $scope.cbxSelectizeVNPTManPNOperationInitDetail.valueField,
                        labelField: $scope.cbxSelectizeVNPTManPNOperationInitDetail.labelField,
                        searchField: $scope.cbxSelectizeVNPTManPNOperationInitDetail.searchField,
                        create: false,
                        render: {
                            option: function(data, escape) {
                                return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeVNPTManPNOperationInitDetail.labelField]) + '</span>' + '</div>';
                            },
                            item: function(data, escape) {
                                return '<div class="item">' + escape(data[$scope.cbxSelectizeVNPTManPNOperationInitDetail.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function(query, callback) {
                            //$scope.cbxSelectizeVNPTManPNOperationDetail.ngModel = -1;
                            query = JSON.parse(query)
                            // console.log(query)
                            if($scope.cbxSelectizeVNPTManPNOperationInitDetail.resetScroll){
                                //console.log('init query.page = 0')
                                query.page = 0;
                                callback($scope.cbxSelectizeVNPTManPNOperationInitDetail.resetScroll);
                                $scope.cbxSelectizeVNPTManPNOperationInitDetail.resetScroll = false;
                            }
                            $scope.cbxSelectizeVNPTManPNOperationInitDetail.page = query.page || 0;
                            if(!$scope.cbxSelectizeVNPTManPNOperationInitDetail.totalCount || $scope.cbxSelectizeVNPTManPNOperationInitDetail.totalCount > ( ($scope.cbxSelectizeVNPTManPNOperationInitDetail.page - 1) * $scope.cbxSelectizeVNPTManPNOperationInitDetail.perPage) ){
                                var api = apiData.genApi($scope.cbxSelectizeVNPTManPNOperationInitDetail.url, $scope.cbxSelectizeVNPTManPNOperationInitDetail.searchField, query.search, $scope.cbxSelectizeVNPTManPNOperationInitDetail.perPage, null, $scope.cbxSelectizeVNPTManPNOperationInitDetail.OriginParams,query.page,$scope.cbxSelectizeVNPTManPNOperationInitDetail.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxSelectizeVNPTManPNOperationInitDetail.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                $scope.$watch('cbxSelectizeVNPTManPNOperationDetail.ngModelObject', function(newVal) {
                    //$scope.cbxProductRdInit.MoreParams = "categoryId==1156";
                    if(newVal != undefined && newVal != null) {
                        if(newVal[0] != undefined) {
                            // console.log(newVal)
                            if($scope.selectFromManPNDetail) {
                                $scope.createItem.internalReference = newVal[0].internalReference;
                                $scope.selectFromManPNDetail = false;
                            } else {
                                $scope.cbxSelectizeManPNOperationDetail.Options = [];
                                $scope.cbxSelectizeManPNOperationInitDetail.resetScroll = true;
                                $scope.cbxSelectizeManPNOperationInitDetail.MoreParams = "productId==" + newVal[0].productId + ";manufacturerId==" + newVal[0].manufacturerId;
                                $scope.createItem.manId = newVal[0].manufacturerId;
                                $scope.createItem.internalReference = newVal[0].internalReference;
                                $scope.validateAddItem();

                                if($scope.createItem.productId == null || $scope.createItem.productId == undefined) {
                                    Product.getOne(newVal[0].productId).then(function (data) {
                                        $scope.cbxSelectizeProductOperationDetail.Options = [];
                                        $scope.cbxSelectizeProductOperationDetail.Options.push(data);
                                        $scope.selectFromVNPTManPNDetail = true;
                                        $scope.cbxSelectizeProductOperationDetail.ngModel = newVal[0].productId;
                                        //$scope.createItemOperation.productId = newVal[0].productId;
                                        $scope.validateAddItem();

                                    }).catch(function(data){
                                        AlertService.error("transfer.messages.canNotGetData");
                                    })
                                }
                            }
                        } else {
                            //$scope.cbxSelectizeProductOperationDetail.Options = [];
                            //$scope.cbxSelectizeProductOperationDetail.ngModel = -1;
                            //$scope.createItemOperation.productId = null;
                            $scope.cbxSelectizeManPNOperationDetail.Options = [];
                            $scope.cbxSelectizeManPNOperationInitDetail.resetScroll = true;
                            $scope.cbxSelectizeManPNOperationInitDetail.MoreParams = "manufacturerPn!=null;manufacturerPn!=''";
                            $scope.validateAddItem();
                        }
                    }
                }, true);

                $scope.$watch('cbxSelectizeVNPTManPNOperationInitDetail.IsShown', function(newVal) {
                    /*if(newVal != undefined && newVal != null) {
                        if(newVal) {
                            var height = $('#operation_detail_tab').height();
                            $("#operation_detail_tab").animate({
                                scrollTop:  height
                            });
                        }
                    }*/
                }, true);
                //end Cbx vnpt manpn load more

                //Cbx manpn load more
                $scope.cbxSelectizeManPNOperationInitDetail = {
                    url: '/api/product-man-pn', // ** api load data
                    OriginParams: null, // ** init params -- default: null
                    MoreParams: "manufacturerPn!=null;manufacturerPn!=''", // ** filter params => reload cbx options -- default: null
                    queryRelate : null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'manufacturerPn', searchField: 'manufacturerPn', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false,
                    IsShown: false
                }
                $scope.cbxSelectizeManPNOperationDetail = {
                    ngModel : [], // ** value select -- array []
                    ngModelObject : [],
                    Options: [], // ** list options cbx, default: []
                    Scope : $scope,
                    Config: {
                        placeholder : 'Select Man P/N...',
                        plugins: ['infinite_scroll'], //enable load more
                        maxItems: 1,
                        valueField: $scope.cbxSelectizeManPNOperationInitDetail.valueField,
                        labelField: $scope.cbxSelectizeManPNOperationInitDetail.labelField,
                        searchField: $scope.cbxSelectizeManPNOperationInitDetail.searchField,
                        create: false,
                        render: {
                            option: function(data, escape) {
                                return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeManPNOperationInitDetail.labelField]) + '</span>' + '</div>';
                            },
                            item: function(data, escape) {
                                return '<div class="item">' + escape(data[$scope.cbxSelectizeManPNOperationInitDetail.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function(query, callback) {
                            //$scope.cbxSelectizeManPNOperationDetail.ngModel = -1;
                            query = JSON.parse(query)
                            //console.log(query)
                            if($scope.cbxSelectizeManPNOperationInitDetail.resetScroll){
                                //console.log('init query.page = 0')
                                query.page = 0;
                                callback($scope.cbxSelectizeManPNOperationInitDetail.resetScroll);
                                $scope.cbxSelectizeManPNOperationInitDetail.resetScroll = false;
                            }
                            $scope.cbxSelectizeManPNOperationInitDetail.page = query.page || 0;
                            if(!$scope.cbxSelectizeManPNOperationInitDetail.totalCount || $scope.cbxSelectizeManPNOperationInitDetail.totalCount > ( ($scope.cbxSelectizeManPNOperationInitDetail.page - 1) * $scope.cbxSelectizeManPNOperationInitDetail.perPage) ){
                                var api = apiData.genApi($scope.cbxSelectizeManPNOperationInitDetail.url, $scope.cbxSelectizeManPNOperationInitDetail.searchField, query.search, $scope.cbxSelectizeManPNOperationInitDetail.perPage, null, $scope.cbxSelectizeManPNOperationInitDetail.OriginParams,query.page,$scope.cbxSelectizeManPNOperationInitDetail.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxSelectizeManPNOperationInitDetail.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                $scope.$watch('cbxSelectizeManPNOperationDetail.ngModelObject', function(newVal) {
                    if(newVal != undefined && newVal != null) {
                        if(newVal[0] != undefined) {
                            // console.log(newVal)

                            if($scope.createItem.productId == null ||
                                $scope.createItem.productId == undefined) {
                                $scope.createItem.manPn = newVal[0].manufacturerPn;
                                Product.getOne(newVal[0].productId).then(function (data) {
                                    $scope.cbxSelectizeProductOperationDetail.Options = [];
                                    $scope.cbxSelectizeProductOperationDetail.Options.push(data)

                                    $scope.selectFromManPNDetail = true;
                                    $scope.cbxSelectizeProductOperationDetail.ngModel = newVal[0].productId;
                                    //$scope.createItemOperation.productId = newVal[0].productId;

                                    ProductMan.getOneByManAndProduct(newVal[0].manufacturerId, newVal[0].productId).then(function (data) {
                                        $scope.cbxSelectizeVNPTManPNOperationDetail.Options = [];
                                        $scope.cbxSelectizeVNPTManPNOperationInitDetail.MoreParams = "internalReference==" + data.internalReference;
                                        $scope.cbxSelectizeVNPTManPNOperationDetail.Options.push(data)
                                        $scope.cbxSelectizeVNPTManPNOperationDetail.ngModel = data.id;
                                        $scope.createItem.manId = data.manufacturerId;
                                        $scope.createItem.internalReference = data.internalReference;
                                        $scope.validateAddItem();
                                    }).catch(function(data){
                                        AlertService.error("transfer.messages.canNotGetData");
                                    })

                                }).catch(function(data){
                                    AlertService.error("transfer.messages.canNotGetData");
                                })
                            } else {
                                $scope.createItem.manPn = newVal[0].manufacturerPn;
                                $scope.validateAddItem();
                            }
                        } else {
                            //$scope.cbxSelectizeProductOperationDetail.Options = [];
                            //$scope.cbxSelectizeProductOperationDetail.ngModel = -1;
                            //$scope.createItemOperation.productId = null;
                            $scope.validateAddItem();
                        }
                    }

                    //$scope.cbxProductRdInit.MoreParams = "categoryId==1156";
                }, true);

                $scope.$watch('cbxSelectizeManPNOperationInitDetail.IsShown', function(newVal) {
                    /*if(newVal != undefined && newVal != null) {
                        if(newVal) {
                            var height = $('#operation_detail_tab').height();
                            $("#operation_detail_tab").animate({
                                scrollTop:  height
                            });
                        }
                    }*/
                }, true);
                //end Cbx manpn load more

                //Cbx from load more
                $scope.cbxSelectizeFromOperationInitDetail = {
                    url: '/api/locations', // ** api load data
                    OriginParams: null, // ** init params -- default: null
                    MoreParams: null, // ** filter params => reload cbx options -- default: null
                    queryRelate : null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'displayName', searchField: 'completeName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false,
                    IsShown: false
                }
                $scope.cbxSelectizeFromOperationDetail = {
                    ngModel : [], // ** value select -- array []
                    ngModelObject : [],
                    Options: [], // ** list options cbx, default: []
                    Scope : $scope,
                    Config: {
                        placeholder : 'Select Location...',
                        plugins: ['infinite_scroll'], //enable load more
                        maxItems: 1,
                        valueField: $scope.cbxSelectizeFromOperationInitDetail.valueField,
                        labelField: $scope.cbxSelectizeFromOperationInitDetail.labelField,
                        searchField: $scope.cbxSelectizeFromOperationInitDetail.searchField,
                        create: false,
                        render: {
                            option: function(data, escape) {
                                return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeFromOperationInitDetail.labelField]) + '</span>' + '</div>';
                            },
                            item: function(data, escape) {
                                return '<div class="item">' + escape(data[$scope.cbxSelectizeFromOperationInitDetail.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function(query, callback) {
                            //$scope.cbxSelectizeFromOperationDetail.ngModel = -1;
                            query = JSON.parse(query)
                            //console.log(query)
                            if($scope.cbxSelectizeFromOperationInitDetail.resetScroll){
                                //console.log('init query.page = 0')
                                query.page = 0;
                                callback($scope.cbxSelectizeFromOperationInitDetail.resetScroll);
                                $scope.cbxSelectizeFromOperationInitDetail.resetScroll = false;
                            }
                            $scope.cbxSelectizeFromOperationInitDetail.page = query.page || 0;
                            if(!$scope.cbxSelectizeFromOperationInitDetail.totalCount || $scope.cbxSelectizeFromOperationInitDetail.totalCount > ( ($scope.cbxSelectizeFromOperationInitDetail.page - 1) * $scope.cbxSelectizeFromOperationInitDetail.perPage) ){
                                var api = apiData.genApi($scope.cbxSelectizeFromOperationInitDetail.url, $scope.cbxSelectizeFromOperationInitDetail.searchField, query.search, $scope.cbxSelectizeFromOperationInitDetail.perPage, null, $scope.cbxSelectizeFromOperationInitDetail.OriginParams,query.page,$scope.cbxSelectizeFromOperationInitDetail.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxSelectizeFromOperationInitDetail.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                $scope.$watch('cbxSelectizeFromOperationDetail.ngModelObject', function(newVal) {
                    //$scope.cbxProductRdInit.MoreParams = "categoryId==1156";
                    if(newVal != undefined && newVal != null) {
                        if(newVal[0] != undefined)
                            $scope.createItem.srcLocationId = newVal[0].id;
                        else
                            $scope.createItem.srcLocationId = null;
                    } else {
                        $scope.createItem.srcLocationId = null;
                    }
                }, true);

                $scope.$watch('cbxSelectizeFromOperationInitDetail.IsShown', function(newVal) {
                    /*if(newVal != undefined && newVal != null) {
                        if(newVal) {
                            var height = $('#operation_detail_tab').height();
                            $("#operation_detail_tab").animate({
                                scrollTop:  height
                            });
                        }
                    }*/
                }, true);

                //Cbx to load more
                $scope.cbxSelectizeToOperationInitDetail = {
                    url: '/api/locations', // ** api load data
                    OriginParams: null, // ** init params -- default: null
                    MoreParams: null, // ** filter params => reload cbx options -- default: null
                    queryRelate : null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'displayName', searchField: 'completeName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false,
                    IsShown: false
                }
                $scope.cbxSelectizeToOperationDetail = {
                    ngModel : [], // ** value select -- array []
                    ngModelObject : [],
                    Options: [], // ** list options cbx, default: []
                    Scope : $scope,
                    Config: {
                        placeholder : 'Select Location...',
                        plugins: ['infinite_scroll'], //enable load more
                        maxItems: 1,
                        valueField: $scope.cbxSelectizeToOperationInitDetail.valueField,
                        labelField: $scope.cbxSelectizeToOperationInitDetail.labelField,
                        searchField: $scope.cbxSelectizeToOperationInitDetail.searchField,
                        create: false,
                        render: {
                            option: function(data, escape) {
                                return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeToOperationInitDetail.labelField]) + '</span>' + '</div>';
                            },
                            item: function(data, escape) {
                                return '<div class="item">' + escape(data[$scope.cbxSelectizeToOperationInitDetail.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function(query, callback) {
                            //$scope.cbxSelectizeToOperationDetail.ngModel = -1;
                            query = JSON.parse(query)
                            //console.log(query)
                            if($scope.cbxSelectizeToOperationInitDetail.resetScroll){
                                //console.log('init query.page = 0')
                                query.page = 0;
                                callback($scope.cbxSelectizeToOperationInitDetail.resetScroll);
                                $scope.cbxSelectizeToOperationInitDetail.resetScroll = false;
                            }
                            $scope.cbxSelectizeToOperationInitDetail.page = query.page || 0;
                            if(!$scope.cbxSelectizeToOperationInitDetail.totalCount || $scope.cbxSelectizeToOperationInitDetail.totalCount > ( ($scope.cbxSelectizeToOperationInitDetail.page - 1) * $scope.cbxSelectizeToOperationInitDetail.perPage) ){
                                var api = apiData.genApi($scope.cbxSelectizeToOperationInitDetail.url, $scope.cbxSelectizeToOperationInitDetail.searchField, query.search, $scope.cbxSelectizeToOperationInitDetail.perPage, null, $scope.cbxSelectizeToOperationInitDetail.OriginParams,query.page,$scope.cbxSelectizeToOperationInitDetail.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxSelectizeToOperationInitDetail.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                $scope.$watch('cbxSelectizeToOperationDetail.ngModelObject', function(newVal) {
                    //$scope.cbxProductRdInit.MoreParams = "categoryId==1156";
                    if(newVal != undefined && newVal != null) {
                        if(newVal[0] != undefined)
                            $scope.createItem.destLocationId = newVal[0].id;
                        else
                            $scope.createItem.destLocationId = null;
                    } else {
                        $scope.createItem.destLocationId = null;
                    }
                }, true);

                $scope.$watch('cbxSelectizeToOperationInitDetail.IsShown', function(newVal) {
                    /*if(newVal != undefined && newVal != null) {
                        if(newVal) {
                            var height = $('#operation_detail_tab').height();
                            $("#operation_detail_tab").animate({
                                scrollTop:  height
                            });
                        }
                    }*/
                }, true);

                //Cbx Source Package load more
                $scope.cbxSelectizeSourcePackageOperationInitDetail = {
                    url: '/api/packages', // ** api load data
                    OriginParams: null, // ** init params -- default: null
                    MoreParams: null, // ** filter params => reload cbx options -- default: null
                    queryRelate : null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'packageNumber', searchField: 'packageNumber', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false,
                    IsShown: false
                }
                $scope.cbxSelectizeSourcePackageOperationDetail = {
                    ngModel : [], // ** value select -- array []
                    ngModelObject : [],
                    Options: [], // ** list options cbx, default: []
                    Scope : $scope,
                    Config: {
                        placeholder : 'Select source package...',
                        plugins: ['infinite_scroll'], //enable load more
                        maxItems: 1,
                        valueField: $scope.cbxSelectizeSourcePackageOperationInitDetail.valueField,
                        labelField: $scope.cbxSelectizeSourcePackageOperationInitDetail.labelField,
                        searchField: $scope.cbxSelectizeSourcePackageOperationInitDetail.searchField,
                        create: false,
                        render: {
                            option: function(data, escape) {
                                return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeSourcePackageOperationInitDetail.labelField]) + '</span>' + '</div>';
                            },
                            item: function(data, escape) {
                                return '<div class="item">' + escape(data[$scope.cbxSelectizeSourcePackageOperationInitDetail.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function(query, callback) {
                            //$scope.cbxSelectizeSourcePackageOperationDetail.ngModel = -1;
                            query = JSON.parse(query)
                            //console.log(query)
                            if($scope.cbxSelectizeSourcePackageOperationInitDetail.resetScroll){
                                //console.log('init query.page = 0')
                                query.page = 0;
                                callback($scope.cbxSelectizeSourcePackageOperationInitDetail.resetScroll);
                                $scope.cbxSelectizeSourcePackageOperationInitDetail.resetScroll = false;
                            }
                            $scope.cbxSelectizeSourcePackageOperationInitDetail.page = query.page || 0;
                            if(!$scope.cbxSelectizeSourcePackageOperationInitDetail.SourcePackagetalCount || $scope.cbxSelectizeSourcePackageOperationInitDetail.SourcePackagetalCount > ( ($scope.cbxSelectizeSourcePackageOperationInitDetail.page - 1) * $scope.cbxSelectizeSourcePackageOperationInitDetail.perPage) ){
                                var api = apiData.genApi($scope.cbxSelectizeSourcePackageOperationInitDetail.url, $scope.cbxSelectizeSourcePackageOperationInitDetail.searchField, query.search, $scope.cbxSelectizeSourcePackageOperationInitDetail.perPage, null, $scope.cbxSelectizeSourcePackageOperationInitDetail.OriginParams,query.page,$scope.cbxSelectizeSourcePackageOperationInitDetail.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxSelectizeSourcePackageOperationInitDetail.SourcePackagetalCount = parseInt( response.headers()["x-SourcePackagetal-count"], 10 ) ;
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                $scope.$watch('cbxSelectizeSourcePackageOperationDetail.ngModelObject', function(newVal) {
                    if(newVal != undefined && newVal != null) {
                        if(newVal[0] != undefined)
                            $scope.createItem.srcPackageId = newVal[0].id;
                        else
                            $scope.createItem.srcPackageId = null;
                    } else {
                        $scope.createItem.srcPackageId = null;
                    }
                }, true);

                $scope.$watch('cbxSelectizeSourcePackageOperationInitDetail.IsShown', function(newVal) {
                    /*if(newVal != undefined && newVal != null) {
                        if(newVal) {
                            var height = $('#operation_detail_tab').height();
                            $("#operation_detail_tab").animate({
                                scrollTop:  height
                            });
                        }
                    }*/
                }, true);

                //Cbx Destination Package load more
                $scope.cbxSelectizeDestinationPackageOperationInitDetail = {
                    url: '/api/packages', // ** api load data
                    OriginParams: null, // ** init params -- default: null
                    MoreParams: null, // ** filter params => reload cbx options -- default: null
                    queryRelate : null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'packageNumber', searchField: 'packageNumber', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false,
                    IsShown: false
                }
                $scope.cbxSelectizeDestinationPackageOperationDetail = {
                    ngModel : [], // ** value select -- array []
                    ngModelObject : [],
                    Options: [], // ** list options cbx, default: []
                    Scope : $scope,
                    Config: {
                        placeholder : 'Select destination package...',
                        plugins: ['infinite_scroll'], //enable load more
                        maxItems: 1,
                        valueField: $scope.cbxSelectizeDestinationPackageOperationInitDetail.valueField,
                        labelField: $scope.cbxSelectizeDestinationPackageOperationInitDetail.labelField,
                        searchField: $scope.cbxSelectizeDestinationPackageOperationInitDetail.searchField,
                        create: false,
                        render: {
                            option: function(data, escape) {
                                return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeDestinationPackageOperationInitDetail.labelField]) + '</span>' + '</div>';
                            },
                            item: function(data, escape) {
                                return '<div class="item">' + escape(data[$scope.cbxSelectizeDestinationPackageOperationInitDetail.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function(query, callback) {
                            //$scope.cbxSelectizeDestinationPackageOperationDetail.ngModel = -1;
                            query = JSON.parse(query)
                            //console.log(query)
                            if($scope.cbxSelectizeDestinationPackageOperationInitDetail.resetScroll){
                                //console.log('init query.page = 0')
                                query.page = 0;
                                callback($scope.cbxSelectizeDestinationPackageOperationInitDetail.resetScroll);
                                $scope.cbxSelectizeDestinationPackageOperationInitDetail.resetScroll = false;
                            }
                            $scope.cbxSelectizeDestinationPackageOperationInitDetail.page = query.page || 0;
                            if(!$scope.cbxSelectizeDestinationPackageOperationInitDetail.DestinationPackagetalCount || $scope.cbxSelectizeDestinationPackageOperationInitDetail.DestinationPackagetalCount > ( ($scope.cbxSelectizeDestinationPackageOperationInitDetail.page - 1) * $scope.cbxSelectizeDestinationPackageOperationInitDetail.perPage) ){
                                var api = apiData.genApi($scope.cbxSelectizeDestinationPackageOperationInitDetail.url, $scope.cbxSelectizeDestinationPackageOperationInitDetail.searchField, query.search, $scope.cbxSelectizeDestinationPackageOperationInitDetail.perPage, null, $scope.cbxSelectizeDestinationPackageOperationInitDetail.OriginParams,query.page,$scope.cbxSelectizeDestinationPackageOperationInitDetail.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxSelectizeDestinationPackageOperationInitDetail.DestinationPackagetalCount = parseInt( response.headers()["x-DestinationPackagetal-count"], 10 ) ;
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                $scope.$watch('cbxSelectizeDestinationPackageOperationDetail.ngModelObject', function(newVal) {
                    if(newVal != undefined && newVal != null) {
                        if(newVal[0] != undefined)
                            $scope.createItem.destPackageId = newVal[0].id;
                        else
                            $scope.createItem.destPackageId = null;
                    } else {
                        $scope.createItem.destPackageId = null;
                    }
                }, true);

                $scope.$watch('cbxSelectizeDestinationPackageOperationInitDetail.IsShown', function(newVal) {
                    /*if(newVal != undefined && newVal != null) {
                        if(newVal) {
                            var height = $('#operation_detail_tab').height();
                            $("#operation_detail_tab").animate({
                                scrollTop:  height
                            });
                        }
                    }*/
                }, true);

                //Cbx Lot/Serial load more
                $scope.cbxSelectizeSerialLotOperationInitDetail = {
                    url: '/api/lots', // ** api load data
                    OriginParams: null, // ** init params -- default: null
                    MoreParams: null, // ** filter params => reload cbx options -- default: null
                    queryRelate : null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'lotNumber', searchField: 'lotNumber', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false,
                    IsShown: false
                }
                $scope.cbxSelectizeSerialLotOperationDetail = {
                    ngModel : [], // ** value select -- array []
                    ngModelObject : [],
                    Options: [], // ** list options cbx, default: []
                    Scope : $scope,
                    Config: {
                        placeholder : 'Select lot/serial...',
                        plugins: ['infinite_scroll'], //enable load more
                        maxItems: 1,
                        valueField: $scope.cbxSelectizeSerialLotOperationInitDetail.valueField,
                        labelField: $scope.cbxSelectizeSerialLotOperationInitDetail.labelField,
                        searchField: $scope.cbxSelectizeSerialLotOperationInitDetail.searchField,
                        create: false,
                        render: {
                            option: function(data, escape) {
                                return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeSerialLotOperationInitDetail.labelField]) + '</span>' + '</div>';
                            },
                            item: function(data, escape) {
                                return '<div class="item">' + escape(data[$scope.cbxSelectizeSerialLotOperationInitDetail.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function(query, callback) {
                            //$scope.cbxSelectizeSerialLotOperationDetail.ngModel = -1;
                            query = JSON.parse(query)
                            //console.log(query)
                            if($scope.cbxSelectizeSerialLotOperationInitDetail.resetScroll){
                                //console.log('init query.page = 0')
                                query.page = 0;
                                callback($scope.cbxSelectizeSerialLotOperationInitDetail.resetScroll);
                                $scope.cbxSelectizeSerialLotOperationInitDetail.resetScroll = false;
                            }
                            $scope.cbxSelectizeSerialLotOperationInitDetail.page = query.page || 0;
                            if(!$scope.cbxSelectizeSerialLotOperationInitDetail.SerialLottalCount || $scope.cbxSelectizeSerialLotOperationInitDetail.SerialLottalCount > ( ($scope.cbxSelectizeSerialLotOperationInitDetail.page - 1) * $scope.cbxSelectizeSerialLotOperationInitDetail.perPage) ){
                                var api = apiData.genApi($scope.cbxSelectizeSerialLotOperationInitDetail.url, $scope.cbxSelectizeSerialLotOperationInitDetail.searchField, query.search, $scope.cbxSelectizeSerialLotOperationInitDetail.perPage, null, $scope.cbxSelectizeSerialLotOperationInitDetail.OriginParams,query.page,$scope.cbxSelectizeSerialLotOperationInitDetail.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxSelectizeSerialLotOperationInitDetail.SerialLottalCount = parseInt( response.headers()["x-SerialLottal-count"], 10 ) ;
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                $scope.$watch('cbxSelectizeSerialLotOperationDetail.ngModelObject', function(newVal) {
                    if(newVal != undefined && newVal != null) {
                        if(newVal[0] != undefined)
                            $scope.createItem.lotId = newVal[0].id;
                        else
                            $scope.createItem.lotId = null;
                    } else {
                        $scope.createItem.lotId = null;
                    }
                }, true);

                $scope.$watch('cbxSelectizeSerialLotOperationInitDetail.IsShown', function(newVal) {
                    /*if(newVal != undefined && newVal != null) {
                        if(newVal) {
                            var height = $('#operation_detail_tab').height();
                            $("#operation_detail_tab").animate({
                                scrollTop:  height
                            });
                        }
                    }*/
                }, true);

                /******************************************************************************************************/

                /************************************************* EDIT ROW *******************************************/
                $scope.selectFromVNPTManPNEditDetail = [];
                $scope.selectFromManPNEditDetail = [];

                $scope.cbxSelectizeProductOperationEditDetail = [];
                $scope.cbxSelectizeProductOperationEditInitDetail = [];

                $scope.cbxSelectizeDescriptionOperationEditDetail = [];
                $scope.cbxSelectizeDescriptionOperationEditInitDetail = [];

                $scope.cbxSelectizeVNPTManPNOperationEditDetail = [];
                $scope.cbxSelectizeVNPTManPNOperationEditInitDetail = [];

                $scope.cbxSelectizeManPNOperationEditDetail = [];
                $scope.cbxSelectizeManPNOperationEditInitDetail = [];

                $scope.cbxSelectizeFromOperationEditDetail = [];
                $scope.cbxSelectizeFromOperationEditInitDetail = [];

                $scope.cbxSelectizeToOperationEditDetail = [];
                $scope.cbxSelectizeToOperationEditInitDetail = [];

                $scope.cbxSelectizeSourcePackageOperationEditDetail = [];
                $scope.cbxSelectizeSourcePackageOperationEditInitDetail = [];

                $scope.cbxSelectizeDestinationPackageOperationEditDetail = [];
                $scope.cbxSelectizeDestinationPackageOperationEditInitDetail = [];

                $scope.cbxSelectizeSerialLotOperationEditDetail = [];
                $scope.cbxSelectizeSerialLotOperationEditInitDetail = [];

                $scope.createNewSelectizeProductOperationDetail = function () {
                    $scope.selectFromVNPTManPNEditDetail.push(false);
                    $scope.selectFromManPNEditDetail.push(false);

                    // Product
                    var cbxSelectizeProductOperationEditInitDetail = {
                        url: '/api/products', // ** api load data
                        OriginParams: "type==1", // ** init params -- default: null
                        MoreParams: null, // ** filter params => reload cbx options -- default: null
                        queryRelate : null, // ** init query relate cbx -- default: null
                        valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                        perPage: 10, totalCount: null, page: 0, resetScroll: false
                    }
                    $scope.cbxSelectizeProductOperationEditInitDetail.push(cbxSelectizeProductOperationEditInitDetail);
                    var cbxSelectizeProductOperationDetail = {
                        ngModel : [], // ** value select -- array []
                        ngModelObject : [],
                        Options: [], // ** list options cbx, default: []
                        Scope : $scope,
                        Config: {
                            index: null,
                            placeholder : 'Select VNPT P/N...',
                            plugins: ['infinite_scroll'], //enable load more
                            maxItems: 1,
                            valueField: cbxSelectizeProductOperationEditInitDetail.valueField,
                            labelField: cbxSelectizeProductOperationEditInitDetail.labelField,
                            searchField: cbxSelectizeProductOperationEditInitDetail.searchField,
                            create: false,
                            render: {
                                option: function(data, escape) {
                                    return  '<div class="option">' + '<span class="title">' + escape(data[cbxSelectizeProductOperationEditInitDetail.labelField]) + '</span>' + '</div>';
                                },
                                item: function(data, escape) {
                                    return '<div class="item">' + escape(data[cbxSelectizeProductOperationEditInitDetail.labelField]) + '</div>';
                                }
                            },
                            //use load event if use load more
                            load: function(query, callback) {
                                //cbxSelectizeProductOperationDetail.ngModel = -1;
                                query = JSON.parse(query)
                                //console.log(query)
                                if(cbxSelectizeProductOperationEditInitDetail.resetScroll){
                                    //console.log('init query.page = 0')
                                    query.page = 0;
                                    callback(cbxSelectizeProductOperationEditInitDetail.resetScroll);
                                    cbxSelectizeProductOperationEditInitDetail.resetScroll = false;
                                }
                                cbxSelectizeProductOperationEditInitDetail.page = query.page || 0;
                                if(!cbxSelectizeProductOperationEditInitDetail.totalCount || cbxSelectizeProductOperationEditInitDetail.totalCount > ( (cbxSelectizeProductOperationEditInitDetail.page - 1) * cbxSelectizeProductOperationEditInitDetail.perPage) ){
                                    var api = apiData.genApi(cbxSelectizeProductOperationEditInitDetail.url, cbxSelectizeProductOperationEditInitDetail.searchField, query.search, cbxSelectizeProductOperationEditInitDetail.perPage, null, cbxSelectizeProductOperationEditInitDetail.OriginParams,query.page,cbxSelectizeProductOperationEditInitDetail.queryRelate);
                                    $http.get(api).then(function (response) {
                                        cbxSelectizeProductOperationEditInitDetail.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                        callback(response.data);
                                    });
                                }
                            }
                        }
                    }
                    $scope.cbxSelectizeProductOperationEditDetail.push(cbxSelectizeProductOperationDetail)

                    // Description
                    var cbxSelectizeDescriptionOperationInitDetail = {
                        url: '/api/products', // ** api load data
                        OriginParams: "type==1", // ** init params -- default: null
                        MoreParams: null, // ** filter params => reload cbx options -- default: null
                        queryRelate : null, // ** init query relate cbx -- default: null
                        valueField: 'id', labelField: 'description', searchField: 'description', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                        perPage: 10, totalCount: null, page: 0, resetScroll: false
                    }
                    $scope.cbxSelectizeDescriptionOperationEditInitDetail.push(cbxSelectizeDescriptionOperationInitDetail);
                    var cbxSelectizeDescriptionOperationDetail = {
                        ngModel : [], // ** value select -- array []
                        ngModelObject : [],
                        Options: [], // ** list options cbx, default: []
                        Scope : $scope,
                        Config: {
                            placeholder : 'Select Description...',
                            plugins: ['infinite_scroll'], //enable load more
                            maxItems: 1,
                            valueField: cbxSelectizeDescriptionOperationInitDetail.valueField,
                            labelField: cbxSelectizeDescriptionOperationInitDetail.labelField,
                            searchField: cbxSelectizeDescriptionOperationInitDetail.searchField,
                            create: false,
                            render: {
                                option: function(data, escape) {
                                    return  '<div class="option">' + '<span class="title">' + escape(data[cbxSelectizeDescriptionOperationInitDetail.labelField]) + '</span>' + '</div>';
                                },
                                item: function(data, escape) {
                                    return '<div class="item">' + escape(data[cbxSelectizeDescriptionOperationInitDetail.labelField]) + '</div>';
                                }
                            },
                            //use load event if use load more
                            load: function(query, callback) {
                                //cbxSelectizeProductOperationDetail.ngModel = -1;
                                query = JSON.parse(query)
                                //console.log(query)
                                if(cbxSelectizeDescriptionOperationInitDetail.resetScroll){
                                    //console.log('init query.page = 0')
                                    query.page = 0;
                                    callback(cbxSelectizeDescriptionOperationInitDetail.resetScroll);
                                    cbxSelectizeDescriptionOperationInitDetail.resetScroll = false;
                                }
                                cbxSelectizeDescriptionOperationInitDetail.page = query.page || 0;
                                if(!cbxSelectizeDescriptionOperationInitDetail.totalCount || cbxSelectizeDescriptionOperationInitDetail.totalCount > ( (cbxSelectizeDescriptionOperationInitDetail.page - 1) * cbxSelectizeDescriptionOperationInitDetail.perPage) ){
                                    var api = apiData.genApi(cbxSelectizeDescriptionOperationInitDetail.url, cbxSelectizeDescriptionOperationInitDetail.searchField, query.search, cbxSelectizeDescriptionOperationInitDetail.perPage, null, cbxSelectizeDescriptionOperationInitDetail.OriginParams,query.page,cbxSelectizeDescriptionOperationInitDetail.queryRelate);
                                    $http.get(api).then(function (response) {
                                        cbxSelectizeDescriptionOperationInitDetail.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                        callback(response.data);
                                    });
                                }
                            }
                        }
                    }
                    $scope.cbxSelectizeDescriptionOperationEditDetail.push(cbxSelectizeDescriptionOperationDetail)

                    // VNPT Man PN
                    var cbxSelectizeVNPTManPNOperationInitDetail = {
                        url: '/api/product-man', // ** api load data
                        OriginParams: null, // ** init params -- default: null
                        MoreParams: null, // ** filter params => reload cbx options -- default: null
                        queryRelate : null, // ** init query relate cbx -- default: null
                        valueField: 'id', labelField: 'internalReference', searchField: 'internalReference', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                        perPage: 10, totalCount: null, page: 0, resetScroll: false
                    }
                    $scope.cbxSelectizeVNPTManPNOperationEditInitDetail.push(cbxSelectizeVNPTManPNOperationInitDetail);
                    var cbxSelectizeVNPTManPNOperationDetail = {
                        ngModel : [], // ** value select -- array []
                        ngModelObject : [],
                        Options: [], // ** list options cbx, default: []
                        Scope : $scope,
                        Config: {
                            placeholder : 'Select VNPT ManPN...',
                            plugins: ['infinite_scroll'], //enable load more
                            maxItems: 1,
                            valueField: cbxSelectizeVNPTManPNOperationInitDetail.valueField,
                            labelField: cbxSelectizeVNPTManPNOperationInitDetail.labelField,
                            searchField: cbxSelectizeVNPTManPNOperationInitDetail.searchField,
                            create: false,
                            render: {
                                option: function(data, escape) {
                                    return  '<div class="option">' + '<span class="title">' + escape(data[cbxSelectizeVNPTManPNOperationInitDetail.labelField]) + '</span>' + '</div>';
                                },
                                item: function(data, escape) {
                                    return '<div class="item">' + escape(data[cbxSelectizeVNPTManPNOperationInitDetail.labelField]) + '</div>';
                                }
                            },
                            //use load event if use load more
                            load: function(query, callback) {
                                //cbxSelectizeVNPTManPNOperationDetail.ngModel = -1;
                                query = JSON.parse(query)
                                // console.log(query)
                                if(cbxSelectizeVNPTManPNOperationInitDetail.resetScroll){
                                    //console.log('init query.page = 0')
                                    query.page = 0;
                                    callback(cbxSelectizeVNPTManPNOperationInitDetail.resetScroll);
                                    cbxSelectizeVNPTManPNOperationInitDetail.resetScroll = false;
                                }
                                cbxSelectizeVNPTManPNOperationInitDetail.page = query.page || 0;
                                if(!cbxSelectizeVNPTManPNOperationInitDetail.totalCount || cbxSelectizeVNPTManPNOperationInitDetail.totalCount > ( (cbxSelectizeVNPTManPNOperationInitDetail.page - 1) * cbxSelectizeVNPTManPNOperationInitDetail.perPage) ){
                                    var api = apiData.genApi(cbxSelectizeVNPTManPNOperationInitDetail.url, cbxSelectizeVNPTManPNOperationInitDetail.searchField, query.search, cbxSelectizeVNPTManPNOperationInitDetail.perPage, null, cbxSelectizeVNPTManPNOperationInitDetail.OriginParams,query.page,cbxSelectizeVNPTManPNOperationInitDetail.queryRelate);
                                    $http.get(api).then(function (response) {
                                        cbxSelectizeVNPTManPNOperationInitDetail.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                        callback(response.data);
                                    });
                                }
                            }
                        }
                    }
                    $scope.cbxSelectizeVNPTManPNOperationEditDetail.push(cbxSelectizeVNPTManPNOperationDetail)

                    // Man PN
                    var cbxSelectizeManPNOperationInitDetail = {
                        url: '/api/product-man-pn', // ** api load data
                        OriginParams: null, // ** init params -- default: null
                        MoreParams: "manufacturerPn!=null;manufacturerPn!=''", // ** filter params => reload cbx options -- default: null
                        queryRelate : null, // ** init query relate cbx -- default: null
                        valueField: 'id', labelField: 'manufacturerPn', searchField: 'manufacturerPn', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                        perPage: 10, totalCount: null, page: 0, resetScroll: false
                    }
                    $scope.cbxSelectizeManPNOperationEditInitDetail.push(cbxSelectizeManPNOperationInitDetail);
                    var cbxSelectizeManPNOperationDetail = {
                        ngModel : [], // ** value select -- array []
                        ngModelObject : [],
                        Options: [], // ** list options cbx, default: []
                        Scope : $scope,
                        Config: {
                            placeholder : 'Select Man P/N...',
                            plugins: ['infinite_scroll'], //enable load more
                            maxItems: 1,
                            valueField: cbxSelectizeManPNOperationInitDetail.valueField,
                            labelField: cbxSelectizeManPNOperationInitDetail.labelField,
                            searchField: cbxSelectizeManPNOperationInitDetail.searchField,
                            create: false,
                            render: {
                                option: function(data, escape) {
                                    return  '<div class="option">' + '<span class="title">' + escape(data[cbxSelectizeManPNOperationInitDetail.labelField]) + '</span>' + '</div>';
                                },
                                item: function(data, escape) {
                                    return '<div class="item">' + escape(data[cbxSelectizeManPNOperationInitDetail.labelField]) + '</div>';
                                }
                            },
                            //use load event if use load more
                            load: function(query, callback) {
                                //cbxSelectizeManPNOperationDetail.ngModel = -1;
                                query = JSON.parse(query)
                                //console.log(query)
                                if(cbxSelectizeManPNOperationInitDetail.resetScroll){
                                    //console.log('init query.page = 0')
                                    query.page = 0;
                                    callback(cbxSelectizeManPNOperationInitDetail.resetScroll);
                                    cbxSelectizeManPNOperationInitDetail.resetScroll = false;
                                }
                                cbxSelectizeManPNOperationInitDetail.page = query.page || 0;
                                if(!cbxSelectizeManPNOperationInitDetail.totalCount || cbxSelectizeManPNOperationInitDetail.totalCount > ( (cbxSelectizeManPNOperationInitDetail.page - 1) * cbxSelectizeManPNOperationInitDetail.perPage) ){
                                    var api = apiData.genApi(cbxSelectizeManPNOperationInitDetail.url, cbxSelectizeManPNOperationInitDetail.searchField, query.search, cbxSelectizeManPNOperationInitDetail.perPage, null, cbxSelectizeManPNOperationInitDetail.OriginParams,query.page,cbxSelectizeManPNOperationInitDetail.queryRelate);
                                    $http.get(api).then(function (response) {
                                        cbxSelectizeManPNOperationInitDetail.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                        callback(response.data);
                                    });
                                }
                            }
                        }
                    }
                    $scope.cbxSelectizeManPNOperationEditDetail.push(cbxSelectizeManPNOperationDetail)

                    // From
                    var cbxSelectizeFromOperationInitDetail = {
                        url: '/api/locations', // ** api load data
                        OriginParams: null, // ** init params -- default: null
                        MoreParams: null, // ** filter params => reload cbx options -- default: null
                        queryRelate : null, // ** init query relate cbx -- default: null
                        valueField: 'id', labelField: 'displayName', searchField: 'completeName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                        perPage: 10, totalCount: null, page: 0, resetScroll: false
                    }
                    $scope.cbxSelectizeFromOperationEditInitDetail.push(cbxSelectizeFromOperationInitDetail);
                    var cbxSelectizeFromOperationDetail = {
                        ngModel : [], // ** value select -- array []
                        ngModelObject : [],
                        Options: [], // ** list options cbx, default: []
                        Scope : $scope,
                        Config: {
                            placeholder : 'Select location...',
                            plugins: ['infinite_scroll'], //enable load more
                            maxItems: 1,
                            valueField: cbxSelectizeFromOperationInitDetail.valueField,
                            labelField: cbxSelectizeFromOperationInitDetail.labelField,
                            searchField: cbxSelectizeFromOperationInitDetail.searchField,
                            create: false,
                            render: {
                                option: function(data, escape) {
                                    return  '<div class="option">' + '<span class="title">' + escape(data[cbxSelectizeFromOperationInitDetail.labelField]) + '</span>' + '</div>';
                                },
                                item: function(data, escape) {
                                    return '<div class="item">' + escape(data[cbxSelectizeFromOperationInitDetail.labelField]) + '</div>';
                                }
                            },
                            //use load event if use load more
                            load: function(query, callback) {
                                //cbxSelectizeFromOperationDetail.ngModel = -1;
                                query = JSON.parse(query)
                                //console.log(query)
                                if(cbxSelectizeFromOperationInitDetail.resetScroll){
                                    //console.log('init query.page = 0')
                                    query.page = 0;
                                    callback(cbxSelectizeFromOperationInitDetail.resetScroll);
                                    cbxSelectizeFromOperationInitDetail.resetScroll = false;
                                }
                                cbxSelectizeFromOperationInitDetail.page = query.page || 0;
                                if(!cbxSelectizeFromOperationInitDetail.totalCount || cbxSelectizeFromOperationInitDetail.totalCount > ( (cbxSelectizeFromOperationInitDetail.page - 1) * cbxSelectizeFromOperationInitDetail.perPage) ){
                                    var api = apiData.genApi(cbxSelectizeFromOperationInitDetail.url, cbxSelectizeFromOperationInitDetail.searchField, query.search, cbxSelectizeFromOperationInitDetail.perPage, null, cbxSelectizeFromOperationInitDetail.OriginParams,query.page,cbxSelectizeFromOperationInitDetail.queryRelate);
                                    $http.get(api).then(function (response) {
                                        cbxSelectizeFromOperationInitDetail.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                        callback(response.data);
                                    });
                                }
                            }
                        }
                    }
                    $scope.cbxSelectizeFromOperationEditDetail.push(cbxSelectizeFromOperationDetail)

                    // To
                    var cbxSelectizeToOperationInitDetail = {
                        url: '/api/locations', // ** api load data
                        OriginParams: null, // ** init params -- default: null
                        MoreParams: null, // ** filter params => reload cbx options -- default: null
                        queryRelate : null, // ** init query relate cbx -- default: null
                        valueField: 'id', labelField: 'displayName', searchField: 'completeName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                        perPage: 10, totalCount: null, page: 0, resetScroll: false
                    }
                    $scope.cbxSelectizeToOperationEditInitDetail.push(cbxSelectizeToOperationInitDetail);
                    var cbxSelectizeToOperationDetail = {
                        ngModel : [], // ** value select -- array []
                        ngModelObject : [],
                        Options: [], // ** list options cbx, default: []
                        Scope : $scope,
                        Config: {
                            placeholder : 'Select location...',
                            plugins: ['infinite_scroll'], //enable load more
                            maxItems: 1,
                            valueField: cbxSelectizeToOperationInitDetail.valueField,
                            labelField: cbxSelectizeToOperationInitDetail.labelField,
                            searchField: cbxSelectizeToOperationInitDetail.searchField,
                            create: false,
                            render: {
                                option: function(data, escape) {
                                    return  '<div class="option">' + '<span class="title">' + escape(data[cbxSelectizeToOperationInitDetail.labelField]) + '</span>' + '</div>';
                                },
                                item: function(data, escape) {
                                    return '<div class="item">' + escape(data[cbxSelectizeToOperationInitDetail.labelField]) + '</div>';
                                }
                            },
                            //use load event if use load more
                            load: function(query, callback) {
                                //cbxSelectizeToOperationDetail.ngModel = -1;
                                query = JSON.parse(query)
                                //console.log(query)
                                if(cbxSelectizeToOperationInitDetail.resetScroll){
                                    //console.log('init query.page = 0')
                                    query.page = 0;
                                    callback(cbxSelectizeToOperationInitDetail.resetScroll);
                                    cbxSelectizeToOperationInitDetail.resetScroll = false;
                                }
                                cbxSelectizeToOperationInitDetail.page = query.page || 0;
                                if(!cbxSelectizeToOperationInitDetail.totalCount || cbxSelectizeToOperationInitDetail.totalCount > ( (cbxSelectizeToOperationInitDetail.page - 1) * cbxSelectizeToOperationInitDetail.perPage) ){
                                    var api = apiData.genApi(cbxSelectizeToOperationInitDetail.url, cbxSelectizeToOperationInitDetail.searchField, query.search, cbxSelectizeToOperationInitDetail.perPage, null, cbxSelectizeToOperationInitDetail.OriginParams,query.page,cbxSelectizeToOperationInitDetail.queryRelate);
                                    $http.get(api).then(function (response) {
                                        cbxSelectizeToOperationInitDetail.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                        callback(response.data);
                                    });
                                }
                            }
                        }
                    }
                    $scope.cbxSelectizeToOperationEditDetail.push(cbxSelectizeToOperationDetail)

                    // Source Package
                    var cbxSelectizeSourcePackageOperationInitDetail = {
                        url: '/api/packages', // ** api load data
                        OriginParams: null, // ** init params -- default: null
                        MoreParams: null, // ** filter params => reload cbx options -- default: null
                        queryRelate : null, // ** init query relate cbx -- default: null
                        valueField: 'id', labelField: 'packageNumber', searchField: 'packageNumber', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                        perPage: 10, totalCount: null, page: 0, resetScroll: false
                    }
                    $scope.cbxSelectizeSourcePackageOperationEditInitDetail.push(cbxSelectizeSourcePackageOperationInitDetail);
                    var cbxSelectizeSourcePackageOperationDetail = {
                        ngModel : [], // ** value select -- array []
                        ngModelObject : [],
                        Options: [], // ** list options cbx, default: []
                        Scope : $scope,
                        Config: {
                            placeholder : 'Select source package...',
                            plugins: ['infinite_scroll'], //enable load more
                            maxItems: 1,
                            valueField: cbxSelectizeSourcePackageOperationInitDetail.valueField,
                            labelField: cbxSelectizeSourcePackageOperationInitDetail.labelField,
                            searchField: cbxSelectizeSourcePackageOperationInitDetail.searchField,
                            create: false,
                            render: {
                                option: function(data, escape) {
                                    return  '<div class="option">' + '<span class="title">' + escape(data[cbxSelectizeSourcePackageOperationInitDetail.labelField]) + '</span>' + '</div>';
                                },
                                item: function(data, escape) {
                                    return '<div class="item">' + escape(data[cbxSelectizeSourcePackageOperationInitDetail.labelField]) + '</div>';
                                }
                            },
                            //use load event if use load more
                            load: function(query, callback) {
                                //cbxSelectizeSourcePackageOperationDetail.ngModel = -1;
                                query = JSON.parse(query)
                                //console.log(query)
                                if(cbxSelectizeSourcePackageOperationInitDetail.resetScroll){
                                    //console.log('init query.page = 0')
                                    query.page = 0;
                                    callback(cbxSelectizeSourcePackageOperationInitDetail.resetScroll);
                                    cbxSelectizeSourcePackageOperationInitDetail.resetScroll = false;
                                }
                                cbxSelectizeSourcePackageOperationInitDetail.page = query.page || 0;
                                if(!cbxSelectizeSourcePackageOperationInitDetail.totalCount || cbxSelectizeSourcePackageOperationInitDetail.totalCount > ( (cbxSelectizeSourcePackageOperationInitDetail.page - 1) * cbxSelectizeSourcePackageOperationInitDetail.perPage) ){
                                    var api = apiData.genApi(cbxSelectizeSourcePackageOperationInitDetail.url, cbxSelectizeSourcePackageOperationInitDetail.searchField, query.search, cbxSelectizeSourcePackageOperationInitDetail.perPage, null, cbxSelectizeSourcePackageOperationInitDetail.OriginParams,query.page,cbxSelectizeSourcePackageOperationInitDetail.queryRelate);
                                    $http.get(api).then(function (response) {
                                        cbxSelectizeSourcePackageOperationInitDetail.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                        callback(response.data);
                                    });
                                }
                            }
                        }
                    }
                    $scope.cbxSelectizeSourcePackageOperationEditDetail.push(cbxSelectizeSourcePackageOperationDetail)

                    // Destination Package
                    var cbxSelectizeDestinationPackageOperationInitDetail = {
                        url: '/api/packages', // ** api load data
                        OriginParams: null, // ** init params -- default: null
                        MoreParams: null, // ** filter params => reload cbx options -- default: null
                        queryRelate : null, // ** init query relate cbx -- default: null
                        valueField: 'id', labelField: 'packageNumber', searchField: 'packageNumber', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                        perPage: 10, totalCount: null, page: 0, resetScroll: false
                    }
                    $scope.cbxSelectizeDestinationPackageOperationEditInitDetail.push(cbxSelectizeDestinationPackageOperationInitDetail);
                    var cbxSelectizeDestinationPackageOperationDetail = {
                        ngModel : [], // ** value select -- array []
                        ngModelObject : [],
                        Options: [], // ** list options cbx, default: []
                        Scope : $scope,
                        Config: {
                            placeholder : 'Select destination package...',
                            plugins: ['infinite_scroll'], //enable load more
                            maxItems: 1,
                            valueField: cbxSelectizeDestinationPackageOperationInitDetail.valueField,
                            labelField: cbxSelectizeDestinationPackageOperationInitDetail.labelField,
                            searchField: cbxSelectizeDestinationPackageOperationInitDetail.searchField,
                            create: false,
                            render: {
                                option: function(data, escape) {
                                    return  '<div class="option">' + '<span class="title">' + escape(data[cbxSelectizeDestinationPackageOperationInitDetail.labelField]) + '</span>' + '</div>';
                                },
                                item: function(data, escape) {
                                    return '<div class="item">' + escape(data[cbxSelectizeDestinationPackageOperationInitDetail.labelField]) + '</div>';
                                }
                            },
                            //use load event if use load more
                            load: function(query, callback) {
                                //cbxSelectizeDestinationPackageOperationDetail.ngModel = -1;
                                query = JSON.parse(query)
                                //console.log(query)
                                if(cbxSelectizeDestinationPackageOperationInitDetail.resetScroll){
                                    //console.log('init query.page = 0')
                                    query.page = 0;
                                    callback(cbxSelectizeDestinationPackageOperationInitDetail.resetScroll);
                                    cbxSelectizeDestinationPackageOperationInitDetail.resetScroll = false;
                                }
                                cbxSelectizeDestinationPackageOperationInitDetail.page = query.page || 0;
                                if(!cbxSelectizeDestinationPackageOperationInitDetail.totalCount || cbxSelectizeDestinationPackageOperationInitDetail.totalCount > ( (cbxSelectizeDestinationPackageOperationInitDetail.page - 1) * cbxSelectizeDestinationPackageOperationInitDetail.perPage) ){
                                    var api = apiData.genApi(cbxSelectizeDestinationPackageOperationInitDetail.url, cbxSelectizeDestinationPackageOperationInitDetail.searchField, query.search, cbxSelectizeDestinationPackageOperationInitDetail.perPage, null, cbxSelectizeDestinationPackageOperationInitDetail.OriginParams,query.page,cbxSelectizeDestinationPackageOperationInitDetail.queryRelate);
                                    $http.get(api).then(function (response) {
                                        cbxSelectizeDestinationPackageOperationInitDetail.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                        callback(response.data);
                                    });
                                }
                            }
                        }
                    }
                    $scope.cbxSelectizeDestinationPackageOperationEditDetail.push(cbxSelectizeDestinationPackageOperationDetail)

                    // Serial/Lot
                    var cbxSelectizeSerialLotOperationInitDetail = {
                        url: '/api/lots', // ** api load data
                        OriginParams: null, // ** init params -- default: null
                        MoreParams: null, // ** filter params => reload cbx options -- default: null
                        queryRelate : null, // ** init query relate cbx -- default: null
                        valueField: 'id', labelField: 'lotNumber', searchField: 'lotNumber', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                        perPage: 10, totalCount: null, page: 0, resetScroll: false
                    }
                    $scope.cbxSelectizeSerialLotOperationEditInitDetail.push(cbxSelectizeSerialLotOperationInitDetail);
                    var cbxSelectizeSerialLotOperationDetail = {
                        ngModel : [], // ** value select -- array []
                        ngModelObject : [],
                        Options: [], // ** list options cbx, default: []
                        Scope : $scope,
                        Config: {
                            placeholder : 'Select lot/serial...',
                            plugins: ['infinite_scroll'], //enable load more
                            maxItems: 1,
                            valueField: cbxSelectizeSerialLotOperationInitDetail.valueField,
                            labelField: cbxSelectizeSerialLotOperationInitDetail.labelField,
                            searchField: cbxSelectizeSerialLotOperationInitDetail.searchField,
                            create: false,
                            render: {
                                option: function(data, escape) {
                                    return  '<div class="option">' + '<span class="title">' + escape(data[cbxSelectizeSerialLotOperationInitDetail.labelField]) + '</span>' + '</div>';
                                },
                                item: function(data, escape) {
                                    return '<div class="item">' + escape(data[cbxSelectizeSerialLotOperationInitDetail.labelField]) + '</div>';
                                }
                            },
                            //use load event if use load more
                            load: function(query, callback) {
                                //cbxSelectizeSerialLotOperationDetail.ngModel = -1;
                                query = JSON.parse(query)
                                //console.log(query)
                                if(cbxSelectizeSerialLotOperationInitDetail.resetScroll){
                                    //console.log('init query.page = 0')
                                    query.page = 0;
                                    callback(cbxSelectizeSerialLotOperationInitDetail.resetScroll);
                                    cbxSelectizeSerialLotOperationInitDetail.resetScroll = false;
                                }
                                cbxSelectizeSerialLotOperationInitDetail.page = query.page || 0;
                                if(!cbxSelectizeSerialLotOperationInitDetail.totalCount || cbxSelectizeSerialLotOperationInitDetail.totalCount > ( (cbxSelectizeSerialLotOperationInitDetail.page - 1) * cbxSelectizeSerialLotOperationInitDetail.perPage) ){
                                    var api = apiData.genApi(cbxSelectizeSerialLotOperationInitDetail.url, cbxSelectizeSerialLotOperationInitDetail.searchField, query.search, cbxSelectizeSerialLotOperationInitDetail.perPage, null, cbxSelectizeSerialLotOperationInitDetail.OriginParams,query.page,cbxSelectizeSerialLotOperationInitDetail.queryRelate);
                                    $http.get(api).then(function (response) {
                                        cbxSelectizeSerialLotOperationInitDetail.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                        callback(response.data);
                                    });
                                }
                            }
                        }
                    }
                    $scope.cbxSelectizeSerialLotOperationEditDetail.push(cbxSelectizeSerialLotOperationDetail)
                }

                $scope.lockChangeTwoTimeDetail = false;
                $scope.handleChangeVNPTPNEditDetail = function (index) {
                    if($scope.cbxSelectizeProductOperationEditDetail[index].ngModel != undefined){
                        var product_id = $scope.cbxSelectizeProductOperationEditDetail[index].ngModel;
                        if (product_id != null && product_id != undefined && product_id > -1) {
                            if($scope.selectFromVNPTManPNEditDetail[index]) {
                                $scope.selectFromVNPTManPNEditDetail[index] = false;
                                $scope.lockChangeTwoTimeDetail = true;
                            } else if($scope.selectFromManPNEditDetail[index]) {

                            } else {
                                if($scope.lockChangeTwoTimeDetail) {
                                    $scope.lockChangeTwoTimeDetail = false;
                                } else {
                                    $scope.cbxSelectizeVNPTManPNOperationEditDetail[index].Options = [];
                                    $scope.cbxSelectizeVNPTManPNOperationEditDetail[index].MoreParams = "";
                                    $scope.cbxSelectizeVNPTManPNOperationEditInitDetail[index].resetScroll = true;
                                    $scope.cbxSelectizeVNPTManPNOperationEditInitDetail[index].MoreParams = "productId==" + product_id;
                                }
                            }

                            $scope.list_op_detail[index].productId = Number(product_id);
                            Product.getOne(product_id).then(function (data) {
                                $scope.list_op_detail[index].productName = data.name;
                                $scope.list_op_detail[index].productDescription = data.description;
                            }).catch(function(data){
                                AlertService.error("transfer.messages.canNotGetData");
                            })
                        }
                    } else {
                        $scope.cbxSelectizeVNPTManPNOperationEditDetail[index].Options = [];
                        $scope.cbxSelectizeVNPTManPNOperationEditInitDetail[index].resetScroll = true;
                        $scope.cbxSelectizeVNPTManPNOperationEditInitDetail[index].MoreParams = "";
                        //$scope.cbxSelectizeVNPTManPNOperationEditDetail[index].ngModel = -1;

                        $scope.cbxSelectizeManPNOperationEditDetail[index].Options = [];
                        $scope.cbxSelectizeManPNOperationEditInitDetail[index].resetScroll = true;
                        $scope.cbxSelectizeManPNOperationEditInitDetail[index].MoreParams = "manufacturerPn!=null;manufacturerPn!=''";
                        //$scope.cbxSelectizeManPNOperationEditDetail[index].ngModel = -1;

                        $scope.list_op_detail[index].productId = null;
                        $scope.list_op_detail[index].productName = null;
                        $scope.list_op_detail[index].productDescription = null;
                        $scope.list_op_detail[index].manId = null;
                        $scope.list_op_detail[index].manPn = null;
                        $scope.list_op_detail[index].internalReference = null;
                        $scope.list_op_detail[index].doneQuantity = 0;
                    }
                    $scope.validateEditItem(index);
                }

                $scope.handleChangeVNPTManPNEditDetail = function (index) {
                    //console.log($scope.cbxSelectizeVNPTManPNOperationEditDetail[index])
                    if($scope.cbxSelectizeVNPTManPNOperationEditDetail[index].ngModel != undefined){
                        var product_man_id = $scope.cbxSelectizeVNPTManPNOperationEditDetail[index].ngModel;
                        if (product_man_id != null && product_man_id != undefined && product_man_id > -1) {
                            if($scope.selectFromVNPTManPNEditDetail[index]) {
                                $scope.selectFromVNPTManPNEditDetail[index] = false;
                            }
                            ProductMan.getOne(product_man_id).then(function (data) {
                                if($scope.selectFromManPNEditDetail[index]) {
                                    $scope.list_op_detail[index].internalReference = data.internalReference;
                                    $scope.selectFromManPNEditDetail[index] = false;
                                } else {
                                    var product_id = data.productId;
                                    var man_id = data.manufacturerId;
                                    $scope.cbxSelectizeManPNOperationEditDetail[index].Options = [];
                                    $scope.cbxSelectizeManPNOperationEditInitDetail[index].resetScroll = true;
                                    $scope.cbxSelectizeManPNOperationEditInitDetail[index].MoreParams = "productId==" + product_id + ";manufacturerId==" + man_id;
                                    $scope.list_op_detail[index].manId = man_id;
                                    $scope.list_op_detail[index].internalReference = data.internalReference;

                                    if($scope.list_op_detail[index].setManPn != null){
                                        ProductManPn.getOneByManProductManPn(man_id, product_id, "'"+$scope.list_op_detail[index].setManPn+"'").then(function (data3) {
                                            $scope.cbxSelectizeManPNOperationEditDetail[index].Options = [];
                                            $scope.cbxSelectizeManPNOperationEditDetail[index].Options.push(data3)
                                            $scope.cbxSelectizeManPNOperationEditDetail[index].ngModel = data3.id;
                                            $scope.list_op_detail[index].setManPn = null;
                                        }).catch(function (data) {
                                            AlertService.error("transfer.messages.canNotGetData");
                                        })
                                    }

                                    $scope.validateEditItem(index);

                                    if($scope.list_op_detail[index].productId == null ||
                                        $scope.list_op_detail[index].productId == undefined ||
                                        $scope.list_op_detail[index].productId != product_id) {
                                        Product.getOne(product_id).then(function (data) {
                                            $scope.cbxSelectizeProductOperationEditDetail[index].Options = [];
                                            $scope.cbxSelectizeProductOperationEditDetail[index].Options.push(data);
                                            $scope.selectFromVNPTManPNEditDetail[index] = true;
                                            $scope.cbxSelectizeProductOperationEditDetail[index].ngModel = product_id;
                                            //$scope.createItemOperation.productId = newVal[0].productId;
                                            $scope.validateEditItem(index);

                                        }).catch(function(data){
                                            AlertService.error("transfer.messages.canNotGetData");
                                        })
                                    }
                                }
                            }).catch(function(data){
                                AlertService.error("transfer.messages.canNotGetData");
                            })
                        } else {
                            $scope.cbxSelectizeProductOperationEditDetail[index].Options = [];
                            $scope.cbxSelectizeProductOperationEditDetail[index].ngModel = -1;
                            //$scope.createItemOperation.productId = null;
                            $scope.validateEditItem(index);
                        }
                    } else {
                        $scope.list_op_detail[index].manId = null;
                        $scope.list_op_detail[index].manPn = null;
                        $scope.list_op_detail[index].internalReference = null;
                    }
                }

                $scope.handleChangeManPNEditDetail = function (index) {
                    //console.log($scope.cbxSelectizeManPNOperationEditDetail[index])
                    if($scope.cbxSelectizeManPNOperationEditDetail[index].ngModel != undefined){
                        var product_man_pn_id = $scope.cbxSelectizeManPNOperationEditDetail[index].ngModel;
                        if (product_man_pn_id != null && product_man_pn_id != undefined && product_man_pn_id > -1) {
                            ProductManPn.getOne(product_man_pn_id).then(function (data) {
                                var product_id = data.productId;
                                var man_id = data.manufacturerId;
                                if($scope.list_op_detail[index].productId == null ||
                                    $scope.list_op_detail[index].productId == undefined ||
                                    $scope.list_op_detail[index].productId != product_id) {
                                    $scope.list_op_detail[index].manPn = data.manufacturerPn;
                                    Product.getOne(product_id).then(function (data) {
                                        $scope.cbxSelectizeProductOperationEditDetail[index].Options = [];
                                        $scope.cbxSelectizeProductOperationEditDetail[index].Options.push(data)

                                        $scope.selectFromManPNEditDetail[index] = true;
                                        $scope.cbxSelectizeProductOperationEditDetail[index].ngModel = data.id;
                                        //$scope.createItemOperation.productId = newVal[0].productId;

                                        ProductMan.getOneByManAndProduct(man_id, product_id).then(function (data2) {
                                            $scope.cbxSelectizeVNPTManPNOperationEditDetail[index].Options = [];
                                            $scope.cbxSelectizeVNPTManPNOperationEditDetail[index].Options.push(data2)
                                            $scope.cbxSelectizeVNPTManPNOperationEditDetail[index].ngModel = data2.id;
                                            $scope.list_op_detail[index].manId = data2.manufacturerId;
                                            $scope.list_op_detail[index].internalReference = data2.internalReference;
                                            $scope.validateEditItem(index);
                                        }).catch(function(data){
                                            AlertService.error("transfer.messages.canNotGetData");
                                        })

                                    }).catch(function(data){
                                        AlertService.error("transfer.messages.canNotGetData");
                                    })
                                } else {
                                    $scope.list_op_detail[index].manPn = data.manufacturerPn;
                                    $scope.validateEditItem(index);
                                }
                            }).catch(function(data){
                                AlertService.error("transfer.messages.canNotGetData");
                            })
                        } else {
                            $scope.cbxSelectizeProductOperationEditDetail[index].Options = [];
                            $scope.cbxSelectizeProductOperationEditDetail[index].ngModel = -1;
                            //$scope.createItemOperation.productId = null;
                            $scope.validateEditItem(index);
                        }
                    } else {
                        $scope.list_op_detail[index].manPn = null;
                    }
                }

                $scope.handleChangeFromEditDetail = function (index) {
                    if($scope.cbxSelectizeFromOperationEditDetail[index].ngModel != undefined){
                        var source_location_id = $scope.cbxSelectizeFromOperationEditDetail[index].ngModel;
                        if (source_location_id != null && source_location_id != undefined && source_location_id > -1) {
                            $scope.list_op_detail[index].srcLocationId = source_location_id;
                            Location.getOne(source_location_id).then(function (data) {
                                $scope.list_op_detail[index].srcLocationName = data.displayName
                                $scope.list_op_detail[index].srcLocationCompleteName = data.completeName
                            })
                        }
                    } else {
                        $scope.list_op_detail[index].srcLocationId = null;
                    }
                }

                $scope.handleChangeToEditDetail = function (index) {
                    if($scope.cbxSelectizeToOperationEditDetail[index].ngModel != undefined){
                        var destination_location_id = $scope.cbxSelectizeToOperationEditDetail[index].ngModel;
                        if (destination_location_id != null && destination_location_id != undefined && destination_location_id > -1) {
                            $scope.list_op_detail[index].destLocationId = destination_location_id;
                            Location.getOne(destination_location_id).then(function (data) {
                                $scope.list_op_detail[index].destLocationName = data.displayName
                                $scope.list_op_detail[index].destLocationCompleteName = data.completeName
                            })
                        }
                    } else {
                        $scope.list_op_detail[index].destLocationId = null;
                    }
                }

                $scope.handleChangeSourcePackageEditDetail = function (index) {
                    //console.log($scope.cbxSelectizeManPNOperationEditDetail[index])
                    if($scope.cbxSelectizeSourcePackageOperationEditDetail[index].ngModel != undefined){
                        var source_package_id = $scope.cbxSelectizeSourcePackageOperationEditDetail[index].ngModel;
                        if (source_package_id != null && source_package_id != undefined && source_package_id > -1) {
                            Package.getOne(source_package_id).then(function (data) {
                                var packageNumber = data.packageNumber;
                                $scope.list_op_detail[index].srcPackageId = source_package_id;
                                $scope.list_op_detail[index].srcPackageNumber = packageNumber;
                            }).catch(function(data){
                                AlertService.error("transfer.messages.canNotGetData");
                            })
                        }
                    } else {
                        $scope.list_op_detail[index].srcPackageId = null;
                        $scope.list_op_detail[index].srcPackageNumber = null;
                    }
                }

                $scope.handleChangeDestinationPackageEditDetail = function (index) {
                    //console.log($scope.cbxSelectizeManPNOperationEditDetail[index])
                    if($scope.cbxSelectizeDestinationPackageOperationEditDetail[index].ngModel != undefined){
                        var destination_package_id = $scope.cbxSelectizeDestinationPackageOperationEditDetail[index].ngModel;
                        if (destination_package_id != null && destination_package_id != undefined && destination_package_id > -1) {
                            Package.getOne(destination_package_id).then(function (data) {
                                var packageNumber = data.packageNumber;
                                $scope.list_op_detail[index].destPackageId = destination_package_id;
                                $scope.list_op_detail[index].destPackageNumber = packageNumber;
                            }).catch(function(data){
                                AlertService.error("transfer.messages.canNotGetData");
                            })
                        }
                    } else {
                        $scope.list_op_detail[index].destPackageId = null;
                        $scope.list_op_detail[index].destPackageNumber = null;
                    }
                }

                $scope.handleChangeSerialLotEditDetail = function (index) {
                    //console.log($scope.cbxSelectizeManPNOperationEditDetail[index])
                    if($scope.cbxSelectizeSerialLotOperationEditDetail[index].ngModel != undefined){
                        var lot_id = $scope.cbxSelectizeSerialLotOperationEditDetail[index].ngModel;
                        if (lot_id != null && lot_id != undefined && lot_id > -1) {
                            Lot.getOne(lot_id).then(function (data) {
                                var lotNumber = data.lotNumber;
                                $scope.list_op_detail[index].lotId = lot_id;
                                $scope.list_op_detail[index].traceNumber = lotNumber;
                            }).catch(function(data){
                                AlertService.error("transfer.messages.canNotGetData");
                            })
                        }
                    } else {
                        $scope.list_op_detail[index].lotId = null;
                        $scope.list_op_detail[index].traceNumber = null;
                    }
                }

                /******************************************************************************************************/
            }

            // Create OPERATION TABS
            if (angular.element('#operation_tab').length) {
                // initialize tables
                $scope.$on('onLastRepeat', function (scope, element, attrs) {
                    var $ts_pager_filter = $("#table_op_tab_sorter"),
                        $columnSelector = $('#columnSelector'),
                        $ts_pager_filter_detail = $("#table_op_detail_tab_sorter"),
                        $columnSelectorDetail= $('#columnSelectorDetail');

                    // OPERATION
                    if($(element).closest($ts_pager_filter).length) {
                        // Initialize tablesorter
                        var ts_operation = $ts_pager_filter
                            .tablesorter({
                                theme: 'altair',
                                widthFixed: true,
                                widgets: ['zebra', 'filter','columnSelector'],
                                headers: {
                                    /*0: {
                                        sorter: false,
                                        parser: false
                                    },*/
                                    6: {
                                        sorter: false,
                                        parser: false
                                    }
                                },
                                widgetOptions : {
                                    // column selector widget
                                    columnSelector_container : $columnSelector,
                                    columnSelector_name : 'data-name',
                                    columnSelector_layout : '<li class="padding_md"><input type="checkbox"><label class="inline-label">{name}</label></li>',
                                    columnSelector_saveColumns: false
                                }
                            })
                            // initialize the pager plugin
                            //.tablesorterPager();

                        // replace column selector checkboxes
                        $columnSelector.children('li').each(function(index) {
                            var $this = $(this);

                            var id = index == 0 ? 'auto' : index;
                            $this.children('input').attr('id','column_'+id);
                            $this.children('label').attr('for','column_'+id);

                            $this.children('input')
                                .prop('checked',true)
                                .iCheck({
                                    checkboxClass: 'icheckbox_md',
                                    radioClass: 'iradio_md',
                                    increaseArea: '20%'
                                });

                            if(index != 0) {
                                $this.find('input')
                                    .on('ifChanged', function (ev) {
                                        $(ev.target).toggleClass('checked').change();
                                    })
                            }

                        });

                        $('#column_auto')
                            .on('ifChecked',function(ev) {
                                $(this)
                                    .closest('li')
                                    .siblings('li')
                                    .find('input').iCheck('disable');
                                $(ev.target).removeClass('checked').change();
                            })
                            .on('ifUnchecked',function(ev) {
                                $(this)
                                    .closest('li')
                                    .siblings('li')
                                    .find('input').iCheck('enable');
                                $(ev.target).addClass('checked').change();
                            });

                        // select/unselect table rows
                        $('.ts_checkbox_all')
                            .iCheck({
                                checkboxClass: 'icheckbox_md',
                                radioClass: 'iradio_md',
                                increaseArea: '20%'
                            })
                            .on('ifChecked',function() {
                                $ts_pager_filter
                                    .find('.ts_checkbox')
                                    // check all checkboxes in table
                                    .prop('checked',true)
                                    .iCheck('update')
                                    // add highlight to row
                                    .closest('tr')
                                    .addClass('row_highlighted');
                            })
                            .on('ifUnchecked',function() {
                                $ts_pager_filter
                                    .find('.ts_checkbox')
                                    // uncheck all checkboxes in table
                                    .prop('checked',false)
                                    .iCheck('update')
                                    // remove highlight from row
                                    .closest('tr')
                                    .removeClass('row_highlighted');
                            });

                        // select/unselect table row
                        $ts_pager_filter.find('.ts_checkbox')
                            .on('ifUnchecked',function() {
                                $(this).closest('tr').removeClass('row_highlighted');
                                $('.ts_checkbox_all').prop('checked',false).iCheck('update');
                            }).on('ifChecked',function() {
                            $(this).closest('tr').addClass('row_highlighted');
                        });
                    }
                    // OPERATION DETAIL
                    else if($(element).closest($ts_pager_filter_detail).length) {
                        // Initialize tablesorter
                        var ts_operation_detail = $ts_pager_filter_detail
                            .tablesorter({
                                theme: 'altair',
                                widthFixed: true,
                                widgets: ['zebra', 'filter','columnSelector'],
                                headers: {
                                    /*0: {
                                        sorter: false,
                                        parser: false
                                    },*/
                                    12: {
                                        sorter: false,
                                        parser: false
                                    }
                                },
                                widgetOptions : {
                                    // column selector widget
                                    columnSelectorDetail_container : $columnSelectorDetail,
                                    columnSelectorDetail_name : 'data-name',
                                    columnSelectorDetail_layout : '<li class="padding_md"><input type="checkbox"><label class="inline-label">{name}</label></li>',
                                    columnSelectorDetail_saveColumns: false
                                }
                            })
                            // initialize the pager plugin
                            //.tablesorterPager();

                        // replace column selector checkboxes
                        $columnSelectorDetail.children('li').each(function(index) {
                            var $this = $(this);

                            var id = index == 0 ? 'auto' : index;
                            $this.children('input').attr('id','column_'+id);
                            $this.children('label').attr('for','column_'+id);

                            $this.children('input')
                                .prop('checked',true)
                                .iCheck({
                                    checkboxClass: 'icheckbox_md',
                                    radioClass: 'iradio_md',
                                    increaseArea: '20%'
                                });

                            if(index != 0) {
                                $this.find('input')
                                    .on('ifChanged', function (ev) {
                                        $(ev.target).toggleClass('checked').change();
                                    })
                            }

                        });

                        $(".op-detail").find('#column_auto')
                            .on('ifChecked',function(ev) {
                                $(this)
                                    .closest('li')
                                    .siblings('li')
                                    .find('input').iCheck('disable');
                                $(ev.target).removeClass('checked').change();
                            })
                            .on('ifUnchecked',function(ev) {
                                $(this)
                                    .closest('li')
                                    .siblings('li')
                                    .find('input').iCheck('enable');
                                $(ev.target).addClass('checked').change();
                            });

                        // select/unselect table rows
                        $('.ts_checkbox_all')
                            .iCheck({
                                checkboxClass: 'icheckbox_md',
                                radioClass: 'iradio_md',
                                increaseArea: '20%'
                            })
                            .on('ifChecked',function() {
                                $ts_pager_filter_detail
                                    .find('.ts_checkbox')
                                    // check all checkboxes in table
                                    .prop('checked',true)
                                    .iCheck('update')
                                    // add highlight to row
                                    .closest('tr')
                                    .addClass('row_highlighted');
                            })
                            .on('ifUnchecked',function() {
                                $ts_pager_filter_detail
                                    .find('.ts_checkbox')
                                    // uncheck all checkboxes in table
                                    .prop('checked',false)
                                    .iCheck('update')
                                    // remove highlight from row
                                    .closest('tr')
                                    .removeClass('row_highlighted');
                            });

                        // select/unselect table row
                        $ts_pager_filter_detail.find('.ts_checkbox')
                            .on('ifUnchecked',function() {
                                $(this).closest('tr').removeClass('row_highlighted');
                                $('.ts_checkbox_all').prop('checked',false).iCheck('update');
                            }).on('ifChecked',function() {
                            $(this).closest('tr').addClass('row_highlighted');
                        });
                    }
                });

                // remove single row
                $("#table_op_tab_sorter").on('click','.ts_remove_row',function(e) {
                    e.preventDefault();

                    var $this = $(this);
                    var id = $this.closest('tr').attr('id');
                    var row_id = id.substr('operation_'.length, id.length);
                    if($scope.removeSubOperation(row_id)) {
                        $scope.isTargetItemEdit = false;
                        //$this.closest('tr').remove();
                        //$("#table_op_tab_sorter").trigger('update');
                    }
                });

                /*************************** ADD A NEW ROW ************************************************************/
                $scope.createItemOperation = {"isEdited":false};

                $scope.validateCreateNewItemSuccessOperation = false;
                $scope.isNewItemOperation = false;

                $scope.selectize_man_options_operation = [];

                $scope.selectize_man_config_operation = {
                    plugins: {
                        'tooltip': ''
                    },
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select manufacturer...'
                };

                $scope.selectize_man_id_options_operation = [];

                $scope.selectize_man_id_config_operation = {
                    plugins: {
                        'tooltip': ''
                    },
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select manufacturer id...'
                };

                $scope.selectize_man_pn_options_operation = [];

                $scope.selectize_man_pn_config_operation = {
                    plugins: {
                        'tooltip': ''
                    },
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Man P/N...'
                };

                $scope.enabledManOperation = false;

                $scope.validateAddItemOperation = function () {
                    $scope.validateCreateNewItemSuccessOperation =
                        ($scope.createItemOperation.productId != null)
                    /*&& ($scope.createItemOperation.productName != null) &&
                    ($scope.createItemOperation.manCode != null) &&
                    ($scope.createItemOperation.manId != null) &&
                    ($scope.createItemOperation.manPn != null)*/
                }

                /*$scope.$watch('createItemOperation.productId', function(newval) {
                    $scope.validateAddItemOperation();

                    if(newval != undefined && newval != null && newval > -1) {
                        Product.getOneMv(newval).then(function (data) {
                            //$scope.tempProduct = data;
                            $scope.selectize_man_options_operation = [];
                            $scope.selectize_man_id_options_operation = [];
                            if(data.manWithCode != '{}') {
                                //$scope.selectize_man_options = JSON.parse(data.manWithCode);
                                var ids_map = JSON.parse(data.manWithCode);
                                for (var key in ids_map) {
                                    if (ids_map.hasOwnProperty(key)) {
                                        $scope.selectize_man_options_operation.push(ids_map[key])
                                        $scope.selectize_man_id_options_operation.push(key)
                                    }
                                }
                                $scope.createItemOperation.manpnConfigs = JSON.parse(data.manWithPns);
                                $scope.enabledManOperation = true;
                            } else {
                                $scope.selectize_man_operation = "";
                                $scope.enabledManOperation = false;
                            }
                            $scope.createItemOperation.productName = data.description;
                        }).catch(function(data){
                            AlertService.error("transfer.messages.canNotGetData");
                        })
                    }

                });

                $scope.$watch('selectize_man_operation', function(newval) {
                    if(newval != undefined && newval != null) {
                        $scope.createItemOperation.manCode = newval;
                        var index = -1;
                        for (var key in $scope.selectize_man_options_operation) {
                            if ($scope.selectize_man_options_operation.hasOwnProperty(key)) {
                                if($scope.selectize_man_options_operation[key].value == newval){
                                    index = key;
                                }
                            }
                        }
                        if(index > -1) {
                            $scope.selectize_man_id_operation = $scope.selectize_man_id_options_operation[index].value;
                        }
                    } else {
                        $scope.createItemOperation.manCode = null;
                    }
                    $scope.validateAddItemOperation();
                });

                $scope.$watch('selectize_man_id_operation', function(newval) {
                    if(newval != undefined && newval != null) {
                        $scope.createItemOperation.manId = newval;
                        for (var key in $scope.createItemOperation.manpnConfigs) {
                            if ($scope.createItemOperation.manpnConfigs.hasOwnProperty(key)) {
                                if(key == newval) {
                                    $scope.selectize_man_pn_options_operation = $scope.createItemOperation.manpnConfigs[key];
                                }
                            }
                        }
                    } else {
                        $scope.createItemOperation.manId = null;
                    }
                    $scope.validateAddItemOperation();
                });

                $scope.$watch('selectize_man_pn_operation', function(newval) {
                    if(newval != undefined && newval != null) {
                        $scope.createItemOperation.manPn = newval;
                    } else {
                        $scope.createItemOperation.manPn = null;
                    }
                    $scope.validateAddItemOperation();
                });*/

                $scope.addNewItemOperation = function () {
                    if($scope.isTargetItem){
                        $scope.ALLOW_SHOW_NEW_ROW_TAB_ITEM_AFTER_CREATE = true;
                        return
                    }
                    $scope.ALLOW_SHOW_NEW_ROW_TAB_ITEM_AFTER_CREATE = false;
                    if(!$scope.isTargetItem){
                        $timeout(function () {
                            $scope.isTargetItem = !$scope.isTargetItem
                        }, 100);
                    }
                    $scope.isNewItemOperation = !$scope.isNewItemOperation
                    var isEdited = $scope.createItemOperation.isEdited;
                    $scope.createItemOperation = {}
                    $scope.createItemOperation.productId = null
                    $scope.createItemOperation.isEdited = !isEdited;
                    $scope.createItemOperation.reserved = 0;
                    $scope.createItemOperation.initialQuantity = 0;
                    $scope.selectize_man_options_operation = []
                    $scope.selectize_man_id_options_operation = []
                    $scope.selectize_man_pn_options_operation = []

                    $scope.cbxSelectizeProductOperation.Options = [];
                    $scope.cbxSelectizeProductOperation.ngModel = -1;
                    $scope.validateAddItemOperation();
                }

                $scope.createNewItemOperation = function () {
                    $('#form_create_operation').parsley();

                    if($scope.form_create_operation.$valid && $scope.validateCreateNewItemSuccessOperation){
                        var exist = 0;
                        for(var i = 0; i < $scope.list_op_item.length; i++) {
                            if($scope.list_op_item[i].productId == $scope.createItemOperation.productId) {
                                exist = 1;
                                break;
                            }
                        }

                        //if(exist == 0) {
                        $scope.createItemOperation.ADD_TO_UPDATE_LIST = true;
                        if($scope.createItemOperation.initialQuantity == undefined || $scope.createItemOperation.initialQuantity == null)
                            $scope.createItemOperation.initialQuantity = 0;
                        // console.log($scope.createItemOperation)
                        $scope.list_op_item.push($scope.createItemOperation)
                        //$scope.addNewRowOperation($scope.createItemOperation);
                        $scope.selectize_man_edit_options_operation.push([])
                        $scope.selectize_man_id_edit_options_operation.push([])
                        $scope.selectize_man_pn_edit_options_operation.push([])
                        $scope.selectize_man_edit_operation.push([])
                        $scope.selectize_man_id_edit_operation.push([])
                        $scope.selectize_man_pn_edit_operation.push([])
                        $scope.enabledManEditOperation.push(false)
                        $scope.validateEditItemSuccessOperation.push(false)

                        $timeout(function () {
                            if ($scope.ALLOW_SHOW_NEW_ROW_TAB_ITEM_AFTER_CREATE) {
                                $scope.isNewItemOperation = true;
                                $scope.createItemOperation = {}
                                $scope.createItemOperation.productId = null
                                $scope.createItemOperation.isEdited = false;
                                $scope.createItemOperation.reserved = 0;
                                $scope.createItemOperation.initialQuantity = 0;
                                $scope.selectize_man_options_operation = []
                                $scope.selectize_man_id_options_operation = []
                                $scope.selectize_man_pn_options_operation = []

                                $scope.cbxSelectizeProductOperation.Options = [];
                                $scope.cbxSelectizeProductOperation.ngModel = -1;
                                $scope.validateAddItemOperation();
                                $scope.ALLOW_SHOW_NEW_ROW_TAB_ITEM_AFTER_CREATE = false;
                            } else {
                                $scope.isNewItemOperation = false
                                $scope.isTargetItem = false
                            }
                        })

                        $scope.createItemOperation = {}
                        $scope.createItemOperation.productId = null
                        $scope.createItemOperation.isEdited = false;
                        $scope.selectize_man_options_operation = []
                        $scope.selectize_man_id_options_operation = []
                        $scope.selectize_man_pn_options_operation = []

                        $scope.createNewSelectizeProductOperation()
                        $('#table_op_tab_sorter')
                            .trigger('destroy');
                        //} else {
                        //AlertService.error("VNPT P/N is already added")
                        //}
                    }
                }

                $scope.deleteNewItemOperation = function(event) {
                    event.preventDefault();
                    $timeout(function () {
                        $scope.isNewItemOperation = false;
                        $scope.isTargetItem = false;
                    })
                    $scope.isNewItemOperation = true;
                    $scope.createItemOperation = {}
                    $scope.createItemOperation.productId = null
                    $scope.createItemOperation.isEdited = false;
                    $scope.createItemOperation.reserved = 0;
                    $scope.createItemOperation.initialQuantity = 0;
                    $scope.selectize_man_options_operation = []
                    $scope.selectize_man_id_options_operation = []
                    $scope.selectize_man_pn_options_operation = []

                    $scope.cbxSelectizeProductOperation.Options = [];
                    $scope.cbxSelectizeProductOperation.ngModel = -1;
                    $scope.validateAddItemOperation();
                }

                $scope.isTargetItem = false
                $scope.isTargetItemEdit = false
                var record = $('#newItemOperation')
                $scope.ALLOW_SHOW_NEW_ROW_TAB_ITEM_AFTER_CREATE = false;
                $(window).click(function(event) {
                    //Create
                    if (record.has(event.target).length == 0 && !record.is(event.target)){
                        if($scope.isTargetItem){
                            //check empty row
                            if(!$scope.validateCreateNewItemSuccessOperation) {
                                $timeout(function () {
                                    $scope.isNewItemOperation = false
                                    $scope.isTargetItem = false
                                })
                            } else {
                                $scope.createNewItemOperation()  //create item
                            }
                        }
                    } else {
                        $scope.isTargetItem = true
                    }
                    //Edit
                    var editItem = $('#operation_' + $scope.targetUpdatingOperation)
                    if (editItem.has(event.target).length == 0 && !editItem.is(event.target)){
                        if($scope.isTargetItemEdit){
                            if(angular.isDefined($scope.targetUpdatingOperation)){
                                $scope.saveOperation(event,$scope.targetUpdatingOperation)
                            }
                        }
                    } else {
                        $scope.isTargetItemEdit = true
                    }
                });

                $scope.removeSubOperation = function (index) {
                    // check if detail tab has data
                    var exist = false;
                    for(var i = 0; i < $scope.list_op_detail.length; i++) {
                        if(($scope.list_op_detail[i].productId == $scope.list_op_item[index].productId) &&
                            ($scope.list_op_detail[i].manId == $scope.list_op_item[index].manId) &&
                            ($scope.list_op_detail[i].manPn == $scope.list_op_item[index].manPn)) {
                            exist = true;
                            break;
                        }
                    }
                    if(exist) {
                        AlertService.error("transfer.messages.canNotDeleteOperation");
                        return false;
                    }

                    if (index > -1) {
                        if($scope.list_op_item[index].id != undefined) {
                            $scope.removeListItem.push($scope.list_op_item[index].id);
                        }
                        $scope.list_op_item.splice(index, 1);
                        $scope.selectize_man_edit_options_operation.splice(index, 1);
                        $scope.selectize_man_id_edit_options_operation.splice(index, 1);
                        $scope.selectize_man_pn_edit_options_operation.splice(index, 1);
                        $scope.selectize_man_edit_operation.splice(index, 1);
                        $scope.selectize_man_id_edit_operation.splice(index, 1);
                        $scope.selectize_man_pn_edit_operation.splice(index, 1);
                        $scope.enabledManEditOperation.splice(index, 1);

                        $scope.cbxSelectizeProductOperationEdit.splice(index, 1);
                        $scope.cbxSelectizeProductOperationEditInit.splice(index, 1);

                        $scope.cbxSelectizeDescriptionOperationEdit.splice(index, 1);
                        $scope.cbxSelectizeDescriptionOperationEditInit.splice(index, 1);

                        $scope.cbxSelectizeVNPTManPNOperationEdit.splice(index, 1);
                        $scope.cbxSelectizeVNPTManPNOperationEditInit.splice(index, 1);

                        $scope.cbxSelectizeManPNOperationEdit.splice(index, 1);
                        $scope.cbxSelectizeManPNOperationEditInit.splice(index, 1);
                    }
                    return true;
                }

                $scope.editOperation = function($event,index){
                    if($scope.targetUpdatingOperation == index)
                        return;

                    var idRemoveBtn = $('#operation_remove_' + index);
                    if (idRemoveBtn.has($event.target).length == 0 && !idRemoveBtn.is($event.target)){
                        if(angular.isDefined($scope.targetUpdatingOperation) && $scope.targetUpdatingOperation !=index){
                            $scope.saveOperation($event,$scope.targetUpdatingOperation)
                        }
                        // check if detail tab has data
                        var exist = false;
                        for(var i = 0; i < $scope.list_op_detail.length; i++) {
                            if(($scope.list_op_detail[i].productId == $scope.list_op_item[index].productId) &&
                                ($scope.list_op_detail[i].manId == $scope.list_op_item[index].manId) &&
                                ($scope.list_op_detail[i].manPn == $scope.list_op_item[index].manPn)) {
                                exist = true;
                                break;
                            }
                        }
                        if(exist) {
                            AlertService.error("transfer.messages.canNotEditOperation");
                            return;
                        }

                        $event.preventDefault();
                        $scope.entity = $scope.list_op_item[index];
                        $scope.entity.index = index;
                        $scope.entity.editable = true;
                        $scope.entity.saveClass = '';
                        $scope.targetUpdatingOperation=index
                    }
                    //$scope.selectize_man_edit_operation[index] = $scope.list_op_item[index].manCode;
                    //$scope.selectize_man_id_edit_operation[index] = $scope.list_op_item[index].manId;
                    //$scope.selectize_man_pn_edit_operation[index] = $scope.list_op_item[index].manPn;

                    //console.log($scope.list_op_item[index])

                };

                $scope.saveOperation = function($event,index){
                    $event.preventDefault();
                    /*if(!$scope.validateEditItemSuccessOperation[index])
                        AlertService.error("transfer.messages.rowNotValid");
                    else {*/
                        var exist = 0;
                        for(var i = 0; i < $scope.list_op_item.length; i++) {
                            if((i != index) && ($scope.list_op_item[i].productId == $scope.list_op_item[index].productId)) {
                                exist = 1;
                                break;
                            }
                        }

                        //if(exist == 0) {
                        $scope.list_op_item[index].editable = false;
                        $scope.list_op_item[index].ADD_TO_UPDATE_LIST = true;
                        delete $scope.targetUpdatingOperation
                        $timeout(function () {
                            $scope.isTargetItemEdit = false
                        })

                        //} else {
                        //AlertService.error("VNPT P/N is already used")
                        //}
                    //}

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
                /******************************************************************************************************/

                /*************************** EDIT A ROW ***************************************************************/
                $scope.selectize_man_edit_options_operation = [];
                $scope.selectize_man_id_edit_options_operation = [];
                $scope.selectize_man_pn_edit_options_operation = [];
                $scope.selectize_man_edit_operation = [];
                $scope.selectize_man_id_edit_operation = [];
                $scope.selectize_man_pn_edit_operation = [];
                $scope.enabledManEditOperation = [];
                $scope.validateEditItemSuccessOperation = [];

                $scope.validateEditItemOperation = function (index) {
                    //console.log($scope.list_op_detail)
                    if($scope.list_op_item.length > 0)
                        $scope.validateEditItemSuccessOperation[index] =
                            ($scope.list_op_item[index].productId != null) //&&
                    /*($scope.list_op_item[index].productName != null) &&
                    ($scope.list_op_item[index].manCode != null) &&
                    ($scope.list_op_item[index].manId != null) &&
                    ($scope.list_op_item[index].manPn != null)*/
                    else $scope.validateEditItemSuccessOperation[index] = false;
                }

                $scope.getOneEditOperation = function(id, index) {
                    Product.getOneMv(id).then(function (data) {
                        //$scope.tempProduct = data;
                        $scope.selectize_man_edit_options_operation[index] = [];
                        $scope.selectize_man_id_edit_options_operation[index] = [];
                        if(data.manWithCode != '{}') {
                            //$scope.selectize_man_options = JSON.parse(data.manWithCode);
                            var ids_map = JSON.parse(data.manWithCode);
                            for (var key in ids_map) {
                                if (ids_map.hasOwnProperty(key)) {
                                    $scope.selectize_man_edit_options_operation[index].push(ids_map[key])
                                    $scope.selectize_man_id_edit_options_operation[index].push(key)
                                }
                            }
                            //$scope.editItem.manpnConfigs = JSON.parse(data.manWithPns);
                            $scope.list_op_item[index].manpnConfigs = JSON.parse(data.manWithPns);
                            $scope.enabledManEditOperation[index] = true;
                        } else {
                            $scope.selectize_man_edit_operation[index] = "";
                            $scope.enabledManEditOperation[index] = false;
                        }
                        //$scope.editItem.productName = data.description;
                        $scope.list_op_item[index].productName = data.name;
                        $scope.list_op_item[index].productDescription = data.description;
                    }).catch(function(data){
                        AlertService.error("transfer.messages.canNotGetData");
                    })
                }

                /*$scope.$watchGroup(['CbxProductRd.ngModel', 'CbxProductRd.indexCbx'], function(newVal, oldVal) {
                    if(newVal[0] != null && newVal[0].toString().length > 0){
                        //console.log(newVal[0])
                        //console.log(newVal[1])
                        var index = newVal[1];
                        $scope.validateEditItemOperation(index);
                        $scope.getOneEditOperation(newVal[0], index);
                    }
                });

                $scope.$watchGroup(['CbxProductDescriptionRd.ngModel', 'CbxProductDescriptionRd.indexCbx'], function(newVal, oldVal) {
                    if(newVal[0] != null && newVal[0].toString().length > 0){

                        var index = newVal[1];
                        $scope.validateEditItemOperation(index);
                        $scope.getOneEditOperation(newVal[0], index);
                    }
                });*/

                $scope.handleEditManOperation = function (index) {
                    //console.log(index)
                    var newval = $scope.selectize_man_edit_operation[index];
                    if(newval != undefined && newval != null) {
                        $scope.list_op_item[index].manCode = newval;
                        var pos = -1;
                        for (var key in $scope.selectize_man_edit_options_operation[index]) {
                            if ($scope.selectize_man_edit_options_operation[index].hasOwnProperty(key)) {
                                if($scope.selectize_man_edit_options_operation[index][key].value == newval){
                                    pos = key;
                                }
                            }
                        }
                        if(pos > -1) {
                            if($scope.selectize_man_id_edit_options_operation[index][pos] != null) {
                                $scope.selectize_man_id_edit_operation[index] = $scope.selectize_man_id_edit_options_operation[index][pos].value;
                            }
                        }
                    } else {
                        $scope.selectize_man_id_edit_operation[index] = null;
                        $scope.list_op_item[index].manCode = null;
                    }
                    $scope.handleEditManIdOperation(index);
                    $scope.validateEditItemOperation(index);
                }

                $scope.handleEditManIdOperation = function (index) {
                    var newval = $scope.selectize_man_id_edit_operation[index];
                    if(newval != undefined && newval != null) {
                        $scope.list_op_item[index].manId = newval;
                        for (var key in $scope.list_op_item[index].manpnConfigs) {
                            if ($scope.list_op_item[index].manpnConfigs.hasOwnProperty(key)) {
                                if(key == newval) {
                                    $scope.selectize_man_pn_edit_options_operation[index] = $scope.list_op_item[index].manpnConfigs[key];
                                }
                            }
                        }
                    } else {
                        $scope.selectize_man_pn_edit_operation[index] = null;
                        $scope.list_op_item[index].manId = null;
                    }
                    $scope.validateEditItemOperation(index);
                }

                $scope.handleEditManPnOperation = function (index) {
                    var newval = $scope.selectize_man_pn_edit_operation[index];
                    if(newval != undefined && newval != null) {
                        $scope.list_op_item[index].manPn = newval;
                    } else {
                        $scope.list_op_item[index].manPn = null;
                    }
                    $scope.validateEditItemOperation(index);
                }

                /********************************************* NEW ****************************************************/
                /****************************************** CREATE ONE ************************************************/
                $scope.selectFromVNPTManPN = false;
                $scope.selectFromManPN = false;
                //Cbx product load more
                $scope.cbxSelectizeProductOperationInit = {
                    url: '/api/products', // ** api load data
                    OriginParams: "type==1", // ** init params -- default: null
                    MoreParams: null, // ** filter params => reload cbx options -- default: null
                    queryRelate : null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false,
                    IsShown: false
                }
                $scope.cbxSelectizeProductOperation = {
                    ngModel : [], // ** value select -- array []
                    ngModelObject : [],
                    Options: [], // ** list options cbx, default: []
                    Scope : $scope,
                    Config: {
                        index: null,
                        placeholder : 'Select VNPT P/N...',
                        plugins: ['infinite_scroll'], //enable load more
                        maxItems: 1,
                        valueField: $scope.cbxSelectizeProductOperationInit.valueField,
                        labelField: $scope.cbxSelectizeProductOperationInit.labelField,
                        searchField: $scope.cbxSelectizeProductOperationInit.searchField,
                        create: false,
                        render: {
                            option: function(data, escape) {
                                return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeProductOperationInit.labelField]) + '</span>' + '</div>';
                            },
                            item: function(data, escape) {
                                return '<div class="item">' + escape(data[$scope.cbxSelectizeProductOperationInit.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function(query, callback) {
                            //$scope.cbxSelectizeProductOperation.ngModel = -1;
                            query = JSON.parse(query)
                            //console.log(query)
                            if($scope.cbxSelectizeProductOperationInit.resetScroll){
                                //console.log('init query.page = 0')
                                query.page = 0;
                                callback($scope.cbxSelectizeProductOperationInit.resetScroll);
                                $scope.cbxSelectizeProductOperationInit.resetScroll = false;
                            }
                            $scope.cbxSelectizeProductOperationInit.page = query.page || 0;
                            if(!$scope.cbxSelectizeProductOperationInit.totalCount || $scope.cbxSelectizeProductOperationInit.totalCount > ( ($scope.cbxSelectizeProductOperationInit.page - 1) * $scope.cbxSelectizeProductOperationInit.perPage) ){
                                var api = apiData.genApi($scope.cbxSelectizeProductOperationInit.url, $scope.cbxSelectizeProductOperationInit.searchField, query.search, $scope.cbxSelectizeProductOperationInit.perPage, null, $scope.cbxSelectizeProductOperationInit.OriginParams,query.page,$scope.cbxSelectizeProductOperationInit.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxSelectizeProductOperationInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                $scope.$watch('cbxSelectizeProductOperation.ngModelObject', function(newVal) {
                    if(newVal != undefined && newVal != null) {
                        if(newVal[0] != undefined) {
                            // console.log(newVal)
                            if($scope.selectFromVNPTManPN) {
                                $scope.selectFromVNPTManPN = false;
                            } else if($scope.selectFromManPN) {

                            } else {
                                $scope.cbxSelectizeVNPTManPNOperation.Options = [];
                                $scope.cbxSelectizeVNPTManPNOperationInit.resetScroll = true;
                                $scope.cbxSelectizeVNPTManPNOperationInit.MoreParams = "productId==" + newVal[0].id;
                            }

                            $scope.createItemOperation.productId = Number(newVal[0].id);
                            $scope.createItemOperation.productName = newVal[0].name;
                            $scope.createItemOperation.productDescription = newVal[0].description;
                        } else {
                            $scope.cbxSelectizeVNPTManPNOperation.Options = [];
                            $scope.cbxSelectizeVNPTManPNOperationInit.resetScroll = true;
                            $scope.cbxSelectizeVNPTManPNOperationInit.MoreParams = "";
                            //$scope.cbxSelectizeVNPTManPNOperation.ngModel = -1;

                            $scope.cbxSelectizeManPNOperation.Options = [];
                            $scope.cbxSelectizeManPNOperationInit.resetScroll = true;
                            $scope.cbxSelectizeManPNOperationInit.MoreParams = "manufacturerPn!=null;manufacturerPn!=''";
                            //$scope.cbxSelectizeManPNOperation.ngModel = -1;

                            $scope.createItemOperation.productId = null;
                            $scope.createItemOperation.productName = null;
                            $scope.createItemOperation.productDescription = null;
                            $scope.createItemOperation.manId = null;
                            $scope.createItemOperation.manPn = null;
                            $scope.createItemOperation.internalReference = null;
                            $scope.createItemOperation.initialQuantity = 0;
                        }
                    }
                    $scope.validateAddItemOperation();
                }, true);

                $scope.$watch('cbxSelectizeProductOperationInit.IsShown', function(newVal) {
                    /*if(newVal != undefined && newVal != null) {
                        if(newVal) {
                            var height = $('#operation_tab').height();
                            $("#operation_tab").animate({
                                scrollTop:  height
                            });
                        }
                    }*/
                }, true);
                //end Cbx product load more

                //Cbx Description more
                $scope.cbxSelectizeDescriptionOperationInit = {
                    url: '/api/products', // ** api load data
                    OriginParams: "type==1", // ** init params -- default: null
                    MoreParams: null, // ** filter params => reload cbx options -- default: null
                    queryRelate : null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'description', searchField: 'description', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false,
                    IsShown: false
                }
                $scope.cbxSelectizeDescriptionOperation = {
                    ngModel : [], // ** value select -- array []
                    ngModelObject : [],
                    Options: [], // ** list options cbx, default: []
                    Scope : $scope,
                    Config: {
                        placeholder : 'Select Description...',
                        plugins: ['infinite_scroll'], //enable load more
                        maxItems: 1,
                        valueField: $scope.cbxSelectizeDescriptionOperationInit.valueField,
                        labelField: $scope.cbxSelectizeDescriptionOperationInit.labelField,
                        searchField: $scope.cbxSelectizeDescriptionOperationInit.searchField,
                        create: false,
                        render: {
                            option: function(data, escape) {
                                return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeDescriptionOperationInit.labelField]) + '</span>' + '</div>';
                            },
                            item: function(data, escape) {
                                return '<div class="item">' + escape(data[$scope.cbxSelectizeDescriptionOperationInit.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function(query, callback) {
                            //$scope.cbxSelectizeDescriptionOperation.ngModel = -1;
                            query = JSON.parse(query)
                            //console.log(query)
                            if($scope.cbxSelectizeDescriptionOperationInit.resetScroll){
                                //console.log('init query.page = 0')
                                query.page = 0;
                                callback($scope.cbxSelectizeDescriptionOperationInit.resetScroll);
                                $scope.cbxSelectizeDescriptionOperationInit.resetScroll = false;
                            }
                            $scope.cbxSelectizeDescriptionOperationInit.page = query.page || 0;
                            if(!$scope.cbxSelectizeDescriptionOperationInit.totalCount || $scope.cbxSelectizeDescriptionOperationInit.totalCount > ( ($scope.cbxSelectizeDescriptionOperationInit.page - 1) * $scope.cbxSelectizeDescriptionOperationInit.perPage) ){
                                var api = apiData.genApi($scope.cbxSelectizeDescriptionOperationInit.url, $scope.cbxSelectizeDescriptionOperationInit.searchField, query.search, $scope.cbxSelectizeDescriptionOperationInit.perPage, null, $scope.cbxSelectizeDescriptionOperationInit.OriginParams,query.page,$scope.cbxSelectizeDescriptionOperationInit.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxSelectizeDescriptionOperationInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                $scope.$watch('cbxSelectizeDescriptionOperationInit.IsShown', function(newVal) {
                    /*if(newVal != undefined && newVal != null) {
                        if(newVal) {
                            var height = $('#operation_tab').height();
                            $("#operation_tab").animate({
                                scrollTop:  height
                            });
                        }
                    }*/
                }, true);
                //end Cbx Description load more

                //Cbx vnpt manpn load more
                $scope.cbxSelectizeVNPTManPNOperationInit = {
                    url: '/api/product-man', // ** api load data
                    OriginParams: null, // ** init params -- default: null
                    MoreParams: null, // ** filter params => reload cbx options -- default: null
                    queryRelate : null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'internalReference', searchField: 'internalReference', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false,
                    IsShown: false
                }
                $scope.cbxSelectizeVNPTManPNOperation = {
                    ngModel : [], // ** value select -- array []
                    ngModelObject : [],
                    Options: [], // ** list options cbx, default: []
                    Scope : $scope,
                    Config: {
                        placeholder : 'Select VNPT ManPN...',
                        plugins: ['infinite_scroll'], //enable load more
                        maxItems: 1,
                        valueField: $scope.cbxSelectizeVNPTManPNOperationInit.valueField,
                        labelField: $scope.cbxSelectizeVNPTManPNOperationInit.labelField,
                        searchField: $scope.cbxSelectizeVNPTManPNOperationInit.searchField,
                        create: false,
                        render: {
                            option: function(data, escape) {
                                return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeVNPTManPNOperationInit.labelField]) + '</span>' + '</div>';
                            },
                            item: function(data, escape) {
                                return '<div class="item">' + escape(data[$scope.cbxSelectizeVNPTManPNOperationInit.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function(query, callback) {
                            //$scope.cbxSelectizeVNPTManPNOperation.ngModel = -1;
                            query = JSON.parse(query)
                            // console.log(query)
                            if($scope.cbxSelectizeVNPTManPNOperationInit.resetScroll){
                                //console.log('init query.page = 0')
                                query.page = 0;
                                callback($scope.cbxSelectizeVNPTManPNOperationInit.resetScroll);
                                $scope.cbxSelectizeVNPTManPNOperationInit.resetScroll = false;
                            }
                            $scope.cbxSelectizeVNPTManPNOperationInit.page = query.page || 0;
                            if(!$scope.cbxSelectizeVNPTManPNOperationInit.totalCount || $scope.cbxSelectizeVNPTManPNOperationInit.totalCount > ( ($scope.cbxSelectizeVNPTManPNOperationInit.page - 1) * $scope.cbxSelectizeVNPTManPNOperationInit.perPage) ){
                                var api = apiData.genApi($scope.cbxSelectizeVNPTManPNOperationInit.url, $scope.cbxSelectizeVNPTManPNOperationInit.searchField, query.search, $scope.cbxSelectizeVNPTManPNOperationInit.perPage, null, $scope.cbxSelectizeVNPTManPNOperationInit.OriginParams,query.page,$scope.cbxSelectizeVNPTManPNOperationInit.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxSelectizeVNPTManPNOperationInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                $scope.$watch('cbxSelectizeVNPTManPNOperation.ngModelObject', function(newVal) {
                    //$scope.cbxProductRdInit.MoreParams = "categoryId==1156";
                    if(newVal != undefined && newVal != null) {
                        if(newVal[0] != undefined) {
                            // console.log(newVal)
                            if($scope.selectFromManPN) {
                                $scope.createItemOperation.internalReference = newVal[0].internalReference;
                                $scope.selectFromManPN = false;
                            } else {
                                $scope.cbxSelectizeManPNOperation.Options = [];
                                $scope.cbxSelectizeManPNOperationInit.resetScroll = true;
                                $scope.cbxSelectizeManPNOperationInit.MoreParams = "productId==" + newVal[0].productId + ";manufacturerId==" + newVal[0].manufacturerId;
                                $scope.createItemOperation.manId = newVal[0].manufacturerId;
                                $scope.createItemOperation.internalReference = newVal[0].internalReference;
                                $scope.validateAddItemOperation();

                                if($scope.createItemOperation.productId == null || $scope.createItemOperation.productId == undefined) {
                                    Product.getOne(newVal[0].productId).then(function (data) {
                                        $scope.cbxSelectizeProductOperation.Options = [];
                                        $scope.cbxSelectizeProductOperation.Options.push(data);
                                        $scope.selectFromVNPTManPN = true;
                                        $scope.cbxSelectizeProductOperation.ngModel = newVal[0].productId;
                                        //$scope.createItemOperation.productId = newVal[0].productId;
                                        $scope.validateAddItemOperation();

                                    }).catch(function(data){
                                        AlertService.error("transfer.messages.canNotGetData");
                                    })
                                }
                            }
                        } else {
                            //$scope.cbxSelectizeProductOperation.Options = [];
                            //$scope.cbxSelectizeProductOperation.ngModel = -1;
                            //$scope.createItemOperation.productId = null;
                            $scope.cbxSelectizeManPNOperation.Options = [];
                            $scope.cbxSelectizeManPNOperationInit.resetScroll = true;
                            $scope.cbxSelectizeManPNOperationInit.MoreParams = "manufacturerPn!=null;manufacturerPn!=''";
                            $scope.validateAddItemOperation();
                        }
                    }
                }, true);

                $scope.$watch('cbxSelectizeVNPTManPNOperationInit.IsShown', function(newVal) {
                    /*if(newVal != undefined && newVal != null) {
                        if(newVal) {
                            var height = $('#operation_tab').height();
                            $("#operation_tab").animate({
                                scrollTop:  height
                            });
                        }
                    }*/
                }, true);
                //end Cbx vnpt manpn load more

                //Cbx manpn load more
                $scope.cbxSelectizeManPNOperationInit = {
                    url: '/api/product-man-pn', // ** api load data
                    OriginParams: null, // ** init params -- default: null
                    MoreParams: "manufacturerPn!=null;manufacturerPn!=''", // ** filter params => reload cbx options -- default: null
                    queryRelate : null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'manufacturerPn', searchField: 'manufacturerPn', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false,
                    IsShown: false
                }
                $scope.cbxSelectizeManPNOperation = {
                    ngModel : [], // ** value select -- array []
                    ngModelObject : [],
                    Options: [], // ** list options cbx, default: []
                    Scope : $scope,
                    Config: {
                        placeholder : 'Select Man P/N...',
                        plugins: ['infinite_scroll'], //enable load more
                        maxItems: 1,
                        valueField: $scope.cbxSelectizeManPNOperationInit.valueField,
                        labelField: $scope.cbxSelectizeManPNOperationInit.labelField,
                        searchField: $scope.cbxSelectizeManPNOperationInit.searchField,
                        create: false,
                        render: {
                            option: function(data, escape) {
                                return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeManPNOperationInit.labelField]) + '</span>' + '</div>';
                            },
                            item: function(data, escape) {
                                return '<div class="item">' + escape(data[$scope.cbxSelectizeManPNOperationInit.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function(query, callback) {
                            //$scope.cbxSelectizeManPNOperation.ngModel = -1;
                            query = JSON.parse(query)
                            //console.log(query)
                            if($scope.cbxSelectizeManPNOperationInit.resetScroll){
                                //console.log('init query.page = 0')
                                query.page = 0;
                                callback($scope.cbxSelectizeManPNOperationInit.resetScroll);
                                $scope.cbxSelectizeManPNOperationInit.resetScroll = false;
                            }
                            $scope.cbxSelectizeManPNOperationInit.page = query.page || 0;
                            if(!$scope.cbxSelectizeManPNOperationInit.totalCount || $scope.cbxSelectizeManPNOperationInit.totalCount > ( ($scope.cbxSelectizeManPNOperationInit.page - 1) * $scope.cbxSelectizeManPNOperationInit.perPage) ){
                                var api = apiData.genApi($scope.cbxSelectizeManPNOperationInit.url, $scope.cbxSelectizeManPNOperationInit.searchField, query.search, $scope.cbxSelectizeManPNOperationInit.perPage, null, $scope.cbxSelectizeManPNOperationInit.OriginParams,query.page,$scope.cbxSelectizeManPNOperationInit.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxSelectizeManPNOperationInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                $scope.$watch('cbxSelectizeManPNOperation.ngModelObject', function(newVal) {
                    if(newVal != undefined && newVal != null) {
                        if(newVal[0] != undefined) {
                            // console.log(newVal)

                            if($scope.createItemOperation.productId == null ||
                                $scope.createItemOperation.productId == undefined) {
                                $scope.createItemOperation.manPn = newVal[0].manufacturerPn;
                                Product.getOne(newVal[0].productId).then(function (data) {
                                    $scope.cbxSelectizeProductOperation.Options = [];
                                    $scope.cbxSelectizeProductOperation.Options.push(data)

                                    $scope.selectFromManPN = true;
                                    $scope.cbxSelectizeProductOperation.ngModel = newVal[0].productId;
                                    //$scope.createItemOperation.productId = newVal[0].productId;

                                    ProductMan.getOneByManAndProduct(newVal[0].manufacturerId, newVal[0].productId).then(function (data) {
                                        $scope.cbxSelectizeVNPTManPNOperation.Options = [];
                                        $scope.cbxSelectizeVNPTManPNOperation.Options.push(data)
                                        $scope.cbxSelectizeVNPTManPNOperation.ngModel = data.id;
                                        $scope.createItemOperation.manId = data.manufacturerId;
                                        $scope.createItemOperation.internalReference = data.internalReference;
                                        $scope.validateAddItemOperation();
                                    }).catch(function(data){
                                        AlertService.error("transfer.messages.canNotGetData");
                                    })

                                }).catch(function(data){
                                    AlertService.error("transfer.messages.canNotGetData");
                                })
                            } else {
                                $scope.createItemOperation.manPn = newVal[0].manufacturerPn;
                                $scope.validateAddItemOperation();
                            }
                        } else {
                            //$scope.cbxSelectizeProductOperation.Options = [];
                            //$scope.cbxSelectizeProductOperation.ngModel = -1;
                            //$scope.createItemOperation.productId = null;
                            $scope.validateAddItemOperation();
                        }
                    }

                    //$scope.cbxProductRdInit.MoreParams = "categoryId==1156";
                }, true);

                $scope.$watch('cbxSelectizeManPNOperationInit.IsShown', function(newVal) {
                    /*if(newVal != undefined && newVal != null) {
                        if(newVal) {
                            var height = $('#operation_tab').height();
                            $("#operation_tab").animate({
                                scrollTop:  height
                            });
                        }
                    }*/
                }, true);
                //end Cbx manpn load more
                /******************************************************************************************************/

                /************************************************* EDIT ROW *******************************************/
                $scope.selectFromVNPTManPNEdit = [];
                $scope.selectFromManPNEdit = [];

                $scope.cbxSelectizeProductOperationEdit = [];
                $scope.cbxSelectizeProductOperationEditInit = [];

                $scope.cbxSelectizeDescriptionOperationEdit = [];
                $scope.cbxSelectizeDescriptionOperationEditInit = [];

                $scope.cbxSelectizeVNPTManPNOperationEdit = [];
                $scope.cbxSelectizeVNPTManPNOperationEditInit = [];

                $scope.cbxSelectizeManPNOperationEdit = [];
                $scope.cbxSelectizeManPNOperationEditInit = [];

                $scope.createNewSelectizeProductOperation = function () {
                    $scope.selectFromVNPTManPNEdit.push(false);
                    $scope.selectFromManPNEdit.push(false);

                    // Product
                    var cbxSelectizeProductOperationEditInit = {
                        url: '/api/products', // ** api load data
                        OriginParams: "type==1", // ** init params -- default: null
                        MoreParams: null, // ** filter params => reload cbx options -- default: null
                        queryRelate : null, // ** init query relate cbx -- default: null
                        valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                        perPage: 10, totalCount: null, page: 0, resetScroll: false
                    }
                    $scope.cbxSelectizeProductOperationEditInit.push(cbxSelectizeProductOperationEditInit);

                    var cbxSelectizeProductOperation = {
                        ngModel : [], // ** value select -- array []
                        ngModelObject : [],
                        Options: [], // ** list options cbx, default: []
                        Scope : $scope,
                        Config: {
                            index: null,
                            placeholder : 'Select VNPT P/N...',
                            plugins: ['infinite_scroll'], //enable load more
                            maxItems: 1,
                            valueField: cbxSelectizeProductOperationEditInit.valueField,
                            labelField: cbxSelectizeProductOperationEditInit.labelField,
                            searchField: cbxSelectizeProductOperationEditInit.searchField,
                            create: false,
                            render: {
                                option: function(data, escape) {
                                    return  '<div class="option">' + '<span class="title">' + escape(data[cbxSelectizeProductOperationEditInit.labelField]) + '</span>' + '</div>';
                                },
                                item: function(data, escape) {
                                    return '<div class="item">' + escape(data[cbxSelectizeProductOperationEditInit.labelField]) + '</div>';
                                }
                            },
                            //use load event if use load more
                            load: function(query, callback) {
                                //cbxSelectizeProductOperation.ngModel = -1;
                                query = JSON.parse(query)
                                //console.log(query)
                                if(cbxSelectizeProductOperationEditInit.resetScroll){
                                    //console.log('init query.page = 0')
                                    query.page = 0;
                                    callback(cbxSelectizeProductOperationEditInit.resetScroll);
                                    cbxSelectizeProductOperationEditInit.resetScroll = false;
                                }
                                cbxSelectizeProductOperationEditInit.page = query.page || 0;
                                if(!cbxSelectizeProductOperationEditInit.totalCount || cbxSelectizeProductOperationEditInit.totalCount > ( (cbxSelectizeProductOperationEditInit.page - 1) * cbxSelectizeProductOperationEditInit.perPage) ){
                                    var api = apiData.genApi(cbxSelectizeProductOperationEditInit.url, cbxSelectizeProductOperationEditInit.searchField, query.search, cbxSelectizeProductOperationEditInit.perPage, null, cbxSelectizeProductOperationEditInit.OriginParams,query.page,cbxSelectizeProductOperationEditInit.queryRelate);
                                    $http.get(api).then(function (response) {
                                        cbxSelectizeProductOperationEditInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                        callback(response.data);
                                    });
                                }
                            }
                        }
                    }
                    $scope.cbxSelectizeProductOperationEdit.push(cbxSelectizeProductOperation)

                    // Description
                    var cbxSelectizeDescriptionOperationInit = {
                        url: '/api/products', // ** api load data
                        OriginParams: "type==1", // ** init params -- default: null
                        MoreParams: null, // ** filter params => reload cbx options -- default: null
                        queryRelate : null, // ** init query relate cbx -- default: null
                        valueField: 'id', labelField: 'description', searchField: 'description', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                        perPage: 10, totalCount: null, page: 0, resetScroll: false
                    }
                    $scope.cbxSelectizeDescriptionOperationEditInit.push(cbxSelectizeDescriptionOperationInit);
                    var cbxSelectizeDescriptionOperation = {
                        ngModel : [], // ** value select -- array []
                        ngModelObject : [],
                        Options: [], // ** list options cbx, default: []
                        Scope : $scope,
                        Config: {
                            placeholder : 'Select Description...',
                            plugins: ['infinite_scroll'], //enable load more
                            maxItems: 1,
                            valueField: cbxSelectizeDescriptionOperationInit.valueField,
                            labelField: cbxSelectizeDescriptionOperationInit.labelField,
                            searchField: cbxSelectizeDescriptionOperationInit.searchField,
                            create: false,
                            render: {
                                option: function(data, escape) {
                                    return  '<div class="option">' + '<span class="title">' + escape(data[cbxSelectizeDescriptionOperationInit.labelField]) + '</span>' + '</div>';
                                },
                                item: function(data, escape) {
                                    return '<div class="item">' + escape(data[cbxSelectizeDescriptionOperationInit.labelField]) + '</div>';
                                }
                            },
                            //use load event if use load more
                            load: function(query, callback) {
                                //cbxSelectizeProductOperation.ngModel = -1;
                                query = JSON.parse(query)
                                //console.log(query)
                                if(cbxSelectizeDescriptionOperationInit.resetScroll){
                                    //console.log('init query.page = 0')
                                    query.page = 0;
                                    callback(cbxSelectizeDescriptionOperationInit.resetScroll);
                                    cbxSelectizeDescriptionOperationInit.resetScroll = false;
                                }
                                cbxSelectizeDescriptionOperationInit.page = query.page || 0;
                                if(!cbxSelectizeDescriptionOperationInit.totalCount || cbxSelectizeDescriptionOperationInit.totalCount > ( (cbxSelectizeDescriptionOperationInit.page - 1) * cbxSelectizeDescriptionOperationInit.perPage) ){
                                    var api = apiData.genApi(cbxSelectizeDescriptionOperationInit.url, cbxSelectizeDescriptionOperationInit.searchField, query.search, cbxSelectizeDescriptionOperationInit.perPage, null, cbxSelectizeDescriptionOperationInit.OriginParams,query.page,cbxSelectizeDescriptionOperationInit.queryRelate);
                                    $http.get(api).then(function (response) {
                                        cbxSelectizeDescriptionOperationInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                        callback(response.data);
                                    });
                                }
                            }
                        }
                    }
                    $scope.cbxSelectizeDescriptionOperationEdit.push(cbxSelectizeDescriptionOperation)

                    // VNPT Man PN
                    var cbxSelectizeVNPTManPNOperationInit = {
                        url: '/api/product-man', // ** api load data
                        OriginParams: null, // ** init params -- default: null
                        MoreParams: null, // ** filter params => reload cbx options -- default: null
                        queryRelate : null, // ** init query relate cbx -- default: null
                        valueField: 'id', labelField: 'internalReference', searchField: 'internalReference', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                        perPage: 10, totalCount: null, page: 0, resetScroll: false
                    }
                    $scope.cbxSelectizeVNPTManPNOperationEditInit.push(cbxSelectizeVNPTManPNOperationInit);
                    var cbxSelectizeVNPTManPNOperation = {
                        ngModel : [], // ** value select -- array []
                        ngModelObject : [],
                        Options: [], // ** list options cbx, default: []
                        Scope : $scope,
                        Config: {
                            placeholder : 'Select VNPT ManPN...',
                            plugins: ['infinite_scroll'], //enable load more
                            maxItems: 1,
                            valueField: cbxSelectizeVNPTManPNOperationInit.valueField,
                            labelField: cbxSelectizeVNPTManPNOperationInit.labelField,
                            searchField: cbxSelectizeVNPTManPNOperationInit.searchField,
                            create: false,
                            render: {
                                option: function(data, escape) {
                                    return  '<div class="option">' + '<span class="title">' + escape(data[cbxSelectizeVNPTManPNOperationInit.labelField]) + '</span>' + '</div>';
                                },
                                item: function(data, escape) {
                                    return '<div class="item">' + escape(data[cbxSelectizeVNPTManPNOperationInit.labelField]) + '</div>';
                                }
                            },
                            //use load event if use load more
                            load: function(query, callback) {
                                //cbxSelectizeVNPTManPNOperation.ngModel = -1;
                                query = JSON.parse(query)
                                // console.log(query)
                                if(cbxSelectizeVNPTManPNOperationInit.resetScroll){
                                    //console.log('init query.page = 0')
                                    query.page = 0;
                                    callback(cbxSelectizeVNPTManPNOperationInit.resetScroll);
                                    cbxSelectizeVNPTManPNOperationInit.resetScroll = false;
                                }
                                cbxSelectizeVNPTManPNOperationInit.page = query.page || 0;
                                if(!cbxSelectizeVNPTManPNOperationInit.totalCount || cbxSelectizeVNPTManPNOperationInit.totalCount > ( (cbxSelectizeVNPTManPNOperationInit.page - 1) * cbxSelectizeVNPTManPNOperationInit.perPage) ){
                                    var api = apiData.genApi(cbxSelectizeVNPTManPNOperationInit.url, cbxSelectizeVNPTManPNOperationInit.searchField, query.search, cbxSelectizeVNPTManPNOperationInit.perPage, null, cbxSelectizeVNPTManPNOperationInit.OriginParams,query.page,cbxSelectizeVNPTManPNOperationInit.queryRelate);
                                    $http.get(api).then(function (response) {
                                        cbxSelectizeVNPTManPNOperationInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                        callback(response.data);
                                    });
                                }
                            }
                        }
                    }
                    $scope.cbxSelectizeVNPTManPNOperationEdit.push(cbxSelectizeVNPTManPNOperation)

                    // Man PN
                    var cbxSelectizeManPNOperationInit = {
                        url: '/api/product-man-pn', // ** api load data
                        OriginParams: null, // ** init params -- default: null
                        MoreParams: "manufacturerPn!=null;manufacturerPn!=''", // ** filter params => reload cbx options -- default: null
                        queryRelate : null, // ** init query relate cbx -- default: null
                        valueField: 'id', labelField: 'manufacturerPn', searchField: 'manufacturerPn', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                        perPage: 10, totalCount: null, page: 0, resetScroll: false
                    }
                    $scope.cbxSelectizeManPNOperationEditInit.push(cbxSelectizeManPNOperationInit);
                    var cbxSelectizeManPNOperation = {
                        ngModel : [], // ** value select -- array []
                        ngModelObject : [],
                        Options: [], // ** list options cbx, default: []
                        Scope : $scope,
                        Config: {
                            placeholder : 'Select Man P/N...',
                            plugins: ['infinite_scroll'], //enable load more
                            maxItems: 1,
                            valueField: cbxSelectizeManPNOperationInit.valueField,
                            labelField: cbxSelectizeManPNOperationInit.labelField,
                            searchField: cbxSelectizeManPNOperationInit.searchField,
                            create: false,
                            render: {
                                option: function(data, escape) {
                                    return  '<div class="option">' + '<span class="title">' + escape(data[cbxSelectizeManPNOperationInit.labelField]) + '</span>' + '</div>';
                                },
                                item: function(data, escape) {
                                    return '<div class="item">' + escape(data[cbxSelectizeManPNOperationInit.labelField]) + '</div>';
                                }
                            },
                            //use load event if use load more
                            load: function(query, callback) {
                                //cbxSelectizeManPNOperation.ngModel = -1;
                                query = JSON.parse(query)
                                //console.log(query)
                                if(cbxSelectizeManPNOperationInit.resetScroll){
                                    //console.log('init query.page = 0')
                                    query.page = 0;
                                    callback(cbxSelectizeManPNOperationInit.resetScroll);
                                    cbxSelectizeManPNOperationInit.resetScroll = false;
                                }
                                cbxSelectizeManPNOperationInit.page = query.page || 0;
                                if(!cbxSelectizeManPNOperationInit.totalCount || cbxSelectizeManPNOperationInit.totalCount > ( (cbxSelectizeManPNOperationInit.page - 1) * cbxSelectizeManPNOperationInit.perPage) ){
                                    var api = apiData.genApi(cbxSelectizeManPNOperationInit.url, cbxSelectizeManPNOperationInit.searchField, query.search, cbxSelectizeManPNOperationInit.perPage, null, cbxSelectizeManPNOperationInit.OriginParams,query.page,cbxSelectizeManPNOperationInit.queryRelate);
                                    $http.get(api).then(function (response) {
                                        cbxSelectizeManPNOperationInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                        callback(response.data);
                                    });
                                }
                            }
                        }
                    }
                    $scope.cbxSelectizeManPNOperationEdit.push(cbxSelectizeManPNOperation)
                }

                $scope.lockChangeTwoTime = false;
                $scope.handleChangeVNPTPNEdit = function (index) {
                    if($scope.cbxSelectizeProductOperationEdit[index].ngModel != undefined){
                        var product_id = $scope.cbxSelectizeProductOperationEdit[index].ngModel;
                        if (product_id != null && product_id != undefined && product_id > -1) {
                            if($scope.selectFromVNPTManPNEdit[index]) {
                                $scope.selectFromVNPTManPNEdit[index] = false;
                                $scope.lockChangeTwoTime = true;
                            } else if($scope.selectFromManPNEdit[index]) {

                            } else {
                                if($scope.lockChangeTwoTime) {
                                    $scope.lockChangeTwoTime = false;
                                } else {
                                    $scope.cbxSelectizeVNPTManPNOperationEdit[index].Options = [];
                                    $scope.cbxSelectizeVNPTManPNOperationEdit[index].MoreParams = "";
                                    $scope.cbxSelectizeVNPTManPNOperationEditInit[index].resetScroll = true;
                                    $scope.cbxSelectizeVNPTManPNOperationEditInit[index].MoreParams = "productId==" + product_id;
                                }
                            }

                            $scope.list_op_item[index].productId = Number(product_id);
                            Product.getOne(product_id).then(function (data) {
                                $scope.list_op_item[index].productName = data.name;
                                $scope.list_op_item[index].productDescription = data.description;
                            }).catch(function(data){
                                AlertService.error("transfer.messages.canNotGetData");
                            })
                        }
                    } else {
                        $scope.cbxSelectizeVNPTManPNOperationEdit[index].Options = [];
                        $scope.cbxSelectizeVNPTManPNOperationEditInit[index].resetScroll = true;
                        $scope.cbxSelectizeVNPTManPNOperationEditInit[index].MoreParams = "";
                        //$scope.cbxSelectizeVNPTManPNOperationEdit[index].ngModel = -1;

                        $scope.cbxSelectizeManPNOperationEdit[index].Options = [];
                        $scope.cbxSelectizeManPNOperationEditInit[index].resetScroll = true;
                        $scope.cbxSelectizeManPNOperationEditInit[index].MoreParams = "manufacturerPn!=null;manufacturerPn!=''";
                        //$scope.cbxSelectizeManPNOperationEdit[index].ngModel = -1;

                        $scope.list_op_item[index].productId = null;
                        $scope.list_op_item[index].productName = null;
                        $scope.list_op_item[index].productDescription = null;
                        $scope.list_op_item[index].manId = null;
                        $scope.list_op_item[index].manPn = null;
                        $scope.list_op_item[index].internalReference = null;
                        $scope.list_op_item[index].initialQuantity = 0;
                    }
                    $scope.validateEditItemOperation(index);
                }

                $scope.handleChangeVNPTManPNEdit = function (index) {
                    //console.log($scope.cbxSelectizeVNPTManPNOperationEdit[index])
                    if($scope.cbxSelectizeVNPTManPNOperationEdit[index].ngModel != undefined){
                        var product_man_id = $scope.cbxSelectizeVNPTManPNOperationEdit[index].ngModel;
                        if (product_man_id != null && product_man_id != undefined && product_man_id > -1) {
                            if($scope.selectFromVNPTManPNEdit[index]) {
                                $scope.selectFromVNPTManPNEdit[index] = false;
                            }
                            ProductMan.getOne(product_man_id).then(function (data) {
                                if($scope.selectFromManPNEdit[index]) {
                                    $scope.list_op_item[index].internalReference = data.internalReference;
                                    $scope.selectFromManPNEdit[index] = false;
                                } else {
                                    var product_id = data.productId;
                                    var man_id = data.manufacturerId;
                                    $scope.cbxSelectizeManPNOperationEdit[index].Options = [];
                                    $scope.cbxSelectizeManPNOperationEditInit[index].resetScroll = true;
                                    $scope.cbxSelectizeManPNOperationEditInit[index].MoreParams = "productId==" + product_id + ";manufacturerId==" + man_id;
                                    $scope.list_op_item[index].manId = man_id;
                                    $scope.list_op_item[index].internalReference = data.internalReference;
                                    $scope.validateEditItemOperation(index);

                                    if($scope.list_op_item[index].productId == null ||
                                        $scope.list_op_item[index].productId == undefined ||
                                        $scope.list_op_item[index].productId != product_id) {
                                        Product.getOne(product_id).then(function (data) {
                                            $scope.cbxSelectizeProductOperationEdit[index].Options = [];
                                            $scope.cbxSelectizeProductOperationEdit[index].Options.push(data);
                                            $scope.selectFromVNPTManPNEdit[index] = true;
                                            $scope.cbxSelectizeProductOperationEdit[index].ngModel = product_id;
                                            //$scope.createItemOperation.productId = newVal[0].productId;
                                            $scope.validateEditItemOperation(index);

                                        }).catch(function(data){
                                            AlertService.error("transfer.messages.canNotGetData");
                                        })
                                    }
                                }
                            }).catch(function(data){
                                AlertService.error("transfer.messages.canNotGetData");
                            })
                        } else {
                            $scope.cbxSelectizeProductOperationEdit[index].Options = [];
                            $scope.cbxSelectizeProductOperationEdit[index].ngModel = -1;
                            //$scope.createItemOperation.productId = null;
                            $scope.validateEditItemOperation(index);
                        }
                    }
                }

                $scope.handleChangeManPNEdit = function (index) {
                    //console.log($scope.cbxSelectizeVNPTManPNOperationEdit[index])
                    if($scope.cbxSelectizeManPNOperationEdit[index].ngModel != undefined){
                        var product_man_pn_id = $scope.cbxSelectizeManPNOperationEdit[index].ngModel;
                        if (product_man_pn_id != null && product_man_pn_id != undefined && product_man_pn_id > -1) {
                            ProductManPn.getOne(product_man_pn_id).then(function (data) {
                                var product_id = data.productId;
                                var man_id = data.manufacturerId;
                                if($scope.list_op_item[index].productId == null ||
                                    $scope.list_op_item[index].productId == undefined ||
                                    $scope.list_op_item[index].productId != product_id) {
                                    $scope.list_op_item[index].manPn = data.manufacturerPn;
                                    Product.getOne(product_id).then(function (data) {
                                        $scope.cbxSelectizeProductOperationEdit[index].Options = [];
                                        $scope.cbxSelectizeProductOperationEdit[index].Options.push(data)

                                        $scope.selectFromManPNEdit[index] = true;
                                        $scope.cbxSelectizeProductOperationEdit[index].ngModel = data.id;
                                        //$scope.createItemOperation.productId = newVal[0].productId;

                                        ProductMan.getOneByManAndProduct(man_id, product_id).then(function (data2) {
                                            $scope.cbxSelectizeVNPTManPNOperationEdit[index].Options = [];
                                            $scope.cbxSelectizeVNPTManPNOperationEdit[index].Options.push(data2)
                                            $scope.cbxSelectizeVNPTManPNOperationEdit[index].ngModel = data2.id;
                                            $scope.list_op_item[index].manId = data2.manufacturerId;
                                            $scope.list_op_item[index].internalReference = data2.internalReference;
                                            $scope.validateEditItemOperation(index);
                                        }).catch(function(data){
                                            AlertService.error("transfer.messages.canNotGetData");
                                        })

                                    }).catch(function(data){
                                        AlertService.error("transfer.messages.canNotGetData");
                                    })
                                } else {
                                    $scope.list_op_item[index].manPn = data.manufacturerPn;
                                    $scope.validateEditItemOperation(index);
                                }
                            }).catch(function(data){
                                AlertService.error("transfer.messages.canNotGetData");
                            })
                        } else {
                            $scope.cbxSelectizeProductOperationEdit[index].Options = [];
                            $scope.cbxSelectizeProductOperationEdit[index].ngModel = -1;
                            //$scope.createItemOperation.productId = null;
                            $scope.validateEditItemOperation(index);
                        }
                    }
                }

                /******************************************************************************************************/
            }

            /**************************************************** PHUONG ND *******************************************/
            /**********************************************************************************************************/
            /**********************************************************************************************************/

            if (angular.element('#scrap_package_modal').length) {
                //CREATE SCRAP TRANSFER
                $scope.myColumnsDetail = ["VNPT P/N", "Description", "Man P/N", "Lot", "Package", "Quantity", "Owner", "Location", "Scrap Location", "Old VNPT P/N", "Manufacturer"];
                $scope.myColumnsShow = [];
                for (var i = 0; i < $scope.myColumnsDetail.length; i++) {
                    $scope.myColumnsShow.push(true);
                }
                var fieldsDetail = ["id", "productId", "productId", "manPn", "traceNumber", "reserved", "doneQuantity"];
                var fieldsTypeDetail = ["Number", "Number", "Number", "Text", "Text", "Text", "Number", "Number", "Text", "Text", "Number", "Number"];
                var loadFunctionDetail = Transfer.getOperationDetailTab;

                var newTableIdsDetail = {
                    idTable: "table_detail_transfer",
                    model: "list_op_detail",
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
                    loadFunction: loadFunctionDetail,
                    param_fields: fieldsDetail,
                    param_fields_type: fieldsTypeDetail,
                    handleAfterReload: null,
                    handleAfterReloadParams: null,
                    deleteCallback: null,
                    customParams: "",
                    pager_id: "table_op_detail_tab_pager",
                    selectize_page_id: "detail_selectize_page",
                    selectize_pageNum_id: "detail_selectize_pageNum"
                };
                TableMultiple.initTableIds($scope, newTableIdsDetail);

                $scope.$watch('newScrap.productId', function (newval) {
                    if ($scope.newScrap.productId != '' && $scope.newScrap.productId != undefined) {
                        Product.getOne($scope.newScrap.productId).then(function (data) {
                            $scope.newScrap.product = data;
                            $scope.newScrap.description = data.description;
                        });
                        $scope.cbxVnptPnsInit.OriginParams = buildSearch([$scope.newScrap.productId], "id=in=(", true);
                        $scope.cbxDescs1Init.OriginParams = buildSearch([$scope.newScrap.productId], "id=in=(", true);
                        $scope.cbxManPnsInit.OriginParams = buildSearch([$scope.newScrap.productId], "productId=in=(", true) + ';'
                            + buildSearch($scope.listManIds, "manufacturerId=in=(", true) + ';'
                            + buildSearch($scope.listManPns, "manufacturerPn=in=(", false);
                        $scope.cbxVnptManPnsInit.OriginParams = buildSearch([$scope.newScrap.productId], "productId=in=(", true) + ';'
                            + buildSearch($scope.listManIds, "manufacturerId=in=(", true);
                    }
                });
                $scope.$watch('newScrap.description', function (newval) {
                    if ($scope.newScrap.description != '' && $scope.newScrap.description != undefined) {
                        Product.getOne($scope.newScrap.productId).then(function (data) {
                            $scope.newScrap.product = data;
                            $scope.newScrap.productId = data.id;
                        });
                        $scope.cbxVnptPnsInit.OriginParams = buildSearch([$scope.newScrap.productId], "id=in=(", true);
                        $scope.cbxDescs1Init.OriginParams = buildSearch([$scope.newScrap.productId], "id=in=(", true);
                        $scope.cbxManPnsInit.OriginParams = buildSearch([$scope.newScrap.productId], "productId=in=(", true) + ';'
                            + buildSearch($scope.listManIds, "manufacturerId=in=(", true) + ';'
                            + buildSearch($scope.listManPns, "manufacturerPn=in=(", false);
                        $scope.cbxVnptManPnsInit.OriginParams = buildSearch([$scope.newScrap.productId], "productId=in=(", true) + ';'
                            + buildSearch($scope.listManIds, "manufacturerId=in=(", true);
                    }
                });
                $scope.$watch('newScrap.vnptManPnId', function (newval) {
                    if ($scope.newScrap.vnptManPnId != '' && $scope.newScrap.vnptManPnId != undefined) {
                        Scrap.getVnptManPnById($scope.newScrap.vnptManPnId).then(function (data) {
                            $scope.newScrap.vnptManPn = data;
                            Product.getOne(data.productId).then(function (data1) {
                                $scope.newScrap.product = data1;
                                $scope.cbxVnptPns.Options = [data1];
                                $scope.cbxDescs1.Options = [data1];
                                $scope.newScrap.productId = data1.id;
                                $scope.newScrap.description = data1.id;

                                $scope.cbxVnptPnsInit.OriginParams = buildSearch([$scope.newScrap.productId], "id=in=(", true);
                                $scope.cbxDescs1Init.OriginParams = buildSearch([$scope.newScrap.productId], "id=in=(", true);
                                $scope.cbxManPnsInit.OriginParams = buildSearch([$scope.newScrap.productId], "productId=in=(", true) + ';'
                                    + buildSearch([$scope.newScrap.vnptManPnId], "manufacturerId=in=(", true) + ';'
                                    + buildSearch([$scope.newScrap.vnptManPnId], "manufacturerPn=in=(", false);
                                $scope.cbxVnptManPnsInit.OriginParams = buildSearch([$scope.newScrap.productId], "productId=in=(", true) + ';'
                                    + buildSearch([$scope.newScrap.vnptManPnId], "manufacturerId=in=(", true);
                            });
                        });
                    }
                });
                $scope.$watch('newScrap.manPnId', function (newval) {
                    if ($scope.newScrap.manPnId != '' && $scope.newScrap.manPnId != undefined) {
                        Scrap.getManPnById($scope.newScrap.manPnId).then(function (data) {
                            $scope.newScrap.manPn = data;
                            Product.getOne(data.productId).then(function (data1) {
                                $scope.newScrap.product = data1;
                                $scope.cbxVnptPns.Options = [data1];
                                $scope.cbxDescs1.Options = [data1];
                                $scope.newScrap.productId = data1.id;
                                $scope.newScrap.description = data1.id;
                            });
                            Scrap.getProductMan(data.productId, data.manufacturerId).then(function (data2) {
                                $scope.cbxVnptManPns.Options = [data2];
                                $scope.newScrap.vnptManPn = data2;
                                $scope.newScrap.vnptManPnId = data2.id;
                            })
                        });
                    }
                });
                $scope.$watch('newScrap.ownerId', function (newval) {
                    if ($scope.newScrap.ownerId != '' && $scope.newScrap.ownerId != undefined) {
                        User.getUserById($scope.newScrap.ownerId).then(function (data) {
                            $scope.newScrap.owner = data;
                        });
                    }
                });
                $scope.$watch('newScrap.locationId', function (newval) {
                    if ($scope.newScrap.locationId != '' && $scope.newScrap.locationId != undefined) {
                        Location.getOne($scope.newScrap.locationId).then(function (data) {
                            $scope.newScrap.location = data;
                        });
                    }
                });
                $scope.$watch('newScrap.scrapLocationId', function (newval) {
                    if ($scope.newScrap.scrapLocationId != '' && $scope.newScrap.scrapLocationId != undefined) {
                        Location.getOne($scope.newScrap.scrapLocationId).then(function (data) {
                            $scope.newScrap.scrapLocation = data;
                        });
                    }
                });
                $scope.$watch('newScrap.lotId', function (newval) {
                    if ($scope.newScrap.lotId != '' && $scope.newScrap.lotId != undefined) {
                        Scrap.getLotById($scope.newScrap.lotId).then(function (data) {
                            $scope.newScrap.lot = data;
                        });
                    }
                });
                $scope.$watch('newScrap.packageId', function (newval) {
                    if ($scope.newScrap.packageId != '' && $scope.newScrap.packageId != undefined) {
                        Scrap.getPackageById($scope.newScrap.packageId).then(function (data) {
                            $scope.newScrap.package = data;
                        });
                    }
                });

                //PARTNER BOX
                $scope.cbxPartnersInit = {
                    url: '/api/companies', // ** api load data
                    OriginParams: 'active==true', // ** init params -- default: null
                    queryRelate: null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false
                }
                $scope.cbxPartners = { // ** replace name cbx
                    //ngModel : [], // ** value select -- array []
                    Options: [], // ** list options cbx, default: []
                    Table: null, // ** table filter
                    Column: null, // ** number column filter on table
                    Scope: $scope,
                    Config: {
                        plugins: ['infinite_scroll'],//enable load more
                        maxItems: 1,
                        valueField: $scope.cbxPartnersInit.valueField,
                        labelField: $scope.cbxPartnersInit.labelField,
                        searchField: $scope.cbxPartnersInit.searchField,
                        create: false,
                        render: {
                            option: function (data, escape) {
                                return '<div class="option">' +
                                    '<span class="title">' + escape(data[$scope.cbxPartnersInit.labelField]) + '</span>' +
                                    '</div>';
                            },
                            item: function (data, escape) {
                                //return '<div class="item"><a href="' + escape(data[$scope.cbxPartnersInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxPartnersInit.labelField]) + '</a></div>';
                                return '<div class="item">' + escape(data[$scope.cbxPartnersInit.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function (query, callback) {
                            query = JSON.parse(query)
                            if ($scope.cbxPartnersInit.resetScroll) {
                                query.page = 0;
                                callback($scope.cbxPartnersInit.resetScroll);
                                $scope.cbxPartnersInit.resetScroll = false;
                            }
                            $scope.cbxPartnersInit.page = query.page || 0;
                            if (!$scope.cbxPartnersInit.totalCount || $scope.cbxPartnersInit.totalCount > (($scope.cbxPartnersInit.page - 1) * $scope.cbxPartnersInit.perPage)) {
                                var api = apiData.genApi($scope.cbxPartnersInit.url, $scope.cbxPartnersInit.searchField, query.search, $scope.cbxPartnersInit.perPage, null, $scope.cbxPartnersInit.OriginParams, query.page, $scope.cbxPartnersInit.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxPartnersInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                //SOURCE LOCATION BOX
                $scope.cbxSrcLocationsInit = {
                    url: '/api/locations', // ** api load data
                    OriginParams: 'active==true', // ** init params -- default: null
                    queryRelate: null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'completeName', searchField: 'completeName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false
                }
                $scope.cbxSrcLocations = { // ** replace name cbx
                    //ngModel : [], // ** value select -- array []
                    Options: [], // ** list options cbx, default: []
                    Table: null, // ** table filter
                    Column: null, // ** number column filter on table
                    Scope: $scope,
                    Config: {
                        plugins: ['infinite_scroll'],//enable load more
                        maxItems: 1,
                        valueField: $scope.cbxSrcLocationsInit.valueField,
                        labelField: $scope.cbxSrcLocationsInit.labelField,
                        searchField: $scope.cbxSrcLocationsInit.searchField,
                        create: false,
                        render: {
                            option: function (data, escape) {
                                return '<div class="option">' +
                                    '<span class="title">' + escape(data[$scope.cbxSrcLocationsInit.labelField]) + '</span>' +
                                    '</div>';
                            },
                            item: function (data, escape) {
                                //return '<div class="item"><a href="' + escape(data[$scope.cbxSrcLocationsInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxSrcLocationsInit.labelField]) + '</a></div>';
                                return '<div class="item">' + escape(data[$scope.cbxSrcLocationsInit.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function (query, callback) {
                            query = JSON.parse(query)
                            if ($scope.cbxSrcLocationsInit.resetScroll) {
                                query.page = 0;
                                callback($scope.cbxSrcLocationsInit.resetScroll);
                                $scope.cbxSrcLocationsInit.resetScroll = false;
                            }
                            $scope.cbxSrcLocationsInit.page = query.page || 0;
                            if (!$scope.cbxSrcLocationsInit.totalCount || $scope.cbxSrcLocationsInit.totalCount > (($scope.cbxSrcLocationsInit.page - 1) * $scope.cbxSrcLocationsInit.perPage)) {
                                var api = apiData.genApi($scope.cbxSrcLocationsInit.url, $scope.cbxSrcLocationsInit.searchField, query.search, $scope.cbxSrcLocationsInit.perPage, null, $scope.cbxSrcLocationsInit.OriginParams, query.page, $scope.cbxSrcLocationsInit.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxSrcLocationsInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                //cbxVnptPns
                $scope.cbxVnptPnsInit = {
                    url: '/api/products', // ** api load data
                    OriginParams: null, // ** init params -- default: null
                    queryRelate: null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false
                }
                $scope.cbxVnptPns = { // ** replace name cbx
                    //ngModel : [], // ** value select -- array []
                    Options: [], // ** list options cbx, default: []
                    Table: null, // ** table filter
                    Column: null, // ** number column filter on table
                    Scope: $scope,
                    Config: {
                        placeholder: $translate.instant("scrap.placeholder.vnptPn"),
                        plugins: ['infinite_scroll'],//enable load more
                        maxItems: 1,
                        valueField: $scope.cbxVnptPnsInit.valueField,
                        labelField: $scope.cbxVnptPnsInit.labelField,
                        searchField: $scope.cbxVnptPnsInit.searchField,
                        create: false,
                        render: {
                            option: function (data, escape) {
                                return '<div class="option">' +
                                    '<span class="title">' + escape(data[$scope.cbxVnptPnsInit.labelField]) + '</span>' +
                                    '</div>';
                            },
                            item: function (data, escape) {
                                //return '<div class="item"><a href="' + escape(data[$scope.cbxVnptPnsInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxVnptPnsInit.labelField]) + '</a></div>';
                                return '<div class="item">' + escape(data[$scope.cbxVnptPnsInit.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function (query, callback) {
                            query = JSON.parse(query)
                            if ($scope.cbxVnptPnsInit.resetScroll) {
                                query.page = 0;
                                callback($scope.cbxVnptPnsInit.resetScroll);
                                $scope.cbxVnptPnsInit.resetScroll = false;
                            }
                            $scope.cbxVnptPnsInit.page = query.page || 0;
                            if (!$scope.cbxVnptPnsInit.totalCount || $scope.cbxVnptPnsInit.totalCount > (($scope.cbxVnptPnsInit.page - 1) * $scope.cbxVnptPnsInit.perPage)) {
                                var api = apiData.genApi($scope.cbxVnptPnsInit.url, $scope.cbxVnptPnsInit.searchField, query.search, $scope.cbxVnptPnsInit.perPage, null, $scope.cbxVnptPnsInit.OriginParams, query.page, $scope.cbxVnptPnsInit.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxVnptPnsInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                //cbxDescs1
                $scope.cbxDescs1Init = {
                    url: '/api/products', // ** api load data
                    OriginParams: null, // ** init params -- default: null
                    queryRelate: null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'description', searchField: 'description', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false
                }
                $scope.cbxDescs1 = { // ** replace name cbx
                    //ngModel : [], // ** value select -- array []
                    Options: [], // ** list options cbx, default: []
                    Table: null, // ** table filter
                    Column: null, // ** number column filter on table
                    Scope: $scope,
                    Config: {
                        placeholder: $translate.instant("scrap.placeholder.desc"),
                        plugins: ['infinite_scroll'],//enable load more
                        maxItems: 1,
                        valueField: $scope.cbxDescs1Init.valueField,
                        labelField: $scope.cbxDescs1Init.labelField,
                        searchField: $scope.cbxDescs1Init.searchField,
                        create: false,
                        render: {
                            option: function (data, escape) {
                                return '<div class="option">' +
                                    '<span class="title">' + escape(data[$scope.cbxDescs1Init.labelField]) + '</span>' +
                                    '</div>';
                            },
                            item: function (data, escape) {
                                //return '<div class="item"><a href="' + escape(data[$scope.cbxDescs1Init.valueField]) + '" target="_blank">' + escape(data[$scope.cbxDescs1Init.labelField]) + '</a></div>';
                                return '<div class="item">' + escape(data[$scope.cbxDescs1Init.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function (query, callback) {
                            query = JSON.parse(query)
                            if ($scope.cbxDescs1Init.resetScroll) {
                                query.page = 0;
                                callback($scope.cbxDescs1Init.resetScroll);
                                $scope.cbxDescs1Init.resetScroll = false;
                            }
                            $scope.cbxDescs1Init.page = query.page || 0;
                            if (!$scope.cbxDescs1Init.totalCount || $scope.cbxDescs1Init.totalCount > (($scope.cbxDescs1Init.page - 1) * $scope.cbxDescs1Init.perPage)) {
                                var api = apiData.genApi($scope.cbxDescs1Init.url, $scope.cbxDescs1Init.searchField, query.search, $scope.cbxDescs1Init.perPage, null, $scope.cbxDescs1Init.OriginParams, query.page, $scope.cbxDescs1Init.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxDescs1Init.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                //cbxVnptManPns
                $scope.cbxVnptManPnsInit = {
                    url: '/api/product-man', // ** api load data
                    OriginParams: null, // ** init params -- default: null
                    queryRelate: null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'internalReference', searchField: 'internalReference', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false
                }
                $scope.cbxVnptManPns = { // ** replace name cbx
                    //ngModel : [], // ** value select -- array []
                    Options: [], // ** list options cbx, default: []
                    Table: null, // ** table filter
                    Column: null, // ** number column filter on table
                    Scope: $scope,
                    Config: {
                        placeholder: $translate.instant("scrap.placeholder.vnptManPn"),
                        plugins: ['infinite_scroll'],//enable load more
                        maxItems: 1,
                        valueField: $scope.cbxVnptManPnsInit.valueField,
                        labelField: $scope.cbxVnptManPnsInit.labelField,
                        searchField: $scope.cbxVnptManPnsInit.searchField,
                        create: false,
                        render: {
                            option: function (data, escape) {
                                return '<div class="option">' +
                                    '<span class="title">' + escape(data[$scope.cbxVnptManPnsInit.labelField]) + '</span>' +
                                    '</div>';
                            },
                            item: function (data, escape) {
                                //return '<div class="item"><a href="' + escape(data[$scope.cbxVnptManPnsInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxVnptManPnsInit.labelField]) + '</a></div>';
                                return '<div class="item">' + escape(data[$scope.cbxVnptManPnsInit.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function (query, callback) {
                            query = JSON.parse(query)
                            if ($scope.cbxVnptManPnsInit.resetScroll) {
                                query.page = 0;
                                callback($scope.cbxVnptManPnsInit.resetScroll);
                                $scope.cbxVnptManPnsInit.resetScroll = false;
                            }
                            $scope.cbxVnptManPnsInit.page = query.page || 0;
                            if (!$scope.cbxVnptManPnsInit.totalCount || $scope.cbxVnptManPnsInit.totalCount > (($scope.cbxVnptManPnsInit.page - 1) * $scope.cbxVnptManPnsInit.perPage)) {
                                var api = apiData.genApi($scope.cbxVnptManPnsInit.url, $scope.cbxVnptManPnsInit.searchField, query.search, $scope.cbxVnptManPnsInit.perPage, null, $scope.cbxVnptManPnsInit.OriginParams, query.page, $scope.cbxVnptManPnsInit.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxVnptManPnsInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                //cbxManPns
                $scope.cbxManPnsInit = {
                    url: '/api/product-man-pn', // ** api load data
                    OriginParams: null, // ** init params -- default: null
                    queryRelate: null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'manufacturerPn', searchField: 'manufacturerPn', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false
                }
                $scope.cbxManPns = { // ** replace name cbx
                    //ngModel : [], // ** value select -- array []
                    Options: [], // ** list options cbx, default: []
                    Table: null, // ** table filter
                    Column: null, // ** number column filter on table
                    Scope: $scope,
                    Config: {
                        placeholder: $translate.instant("scrap.placeholder.manPn"),
                        plugins: ['infinite_scroll'],//enable load more
                        maxItems: 1,
                        valueField: $scope.cbxManPnsInit.valueField,
                        labelField: $scope.cbxManPnsInit.labelField,
                        searchField: $scope.cbxManPnsInit.searchField,
                        create: false,
                        render: {
                            option: function (data, escape) {
                                return '<div class="option">' +
                                    '<span class="title">' + escape(data[$scope.cbxManPnsInit.labelField]) + '</span>' +
                                    '</div>';
                            },
                            item: function (data, escape) {
                                //return '<div class="item"><a href="' + escape(data[$scope.cbxManPnsInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxManPnsInit.labelField]) + '</a></div>';
                                return '<div class="item">' + escape(data[$scope.cbxManPnsInit.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function (query, callback) {
                            query = JSON.parse(query)
                            if ($scope.cbxManPnsInit.resetScroll) {
                                query.page = 0;
                                callback($scope.cbxManPnsInit.resetScroll);
                                $scope.cbxManPnsInit.resetScroll = false;
                            }
                            $scope.cbxManPnsInit.page = query.page || 0;
                            if (!$scope.cbxManPnsInit.totalCount || $scope.cbxManPnsInit.totalCount > (($scope.cbxManPnsInit.page - 1) * $scope.cbxManPnsInit.perPage)) {
                                var api = apiData.genApi($scope.cbxManPnsInit.url, $scope.cbxManPnsInit.searchField, query.search, $scope.cbxManPnsInit.perPage, null, $scope.cbxManPnsInit.OriginParams, query.page, $scope.cbxManPnsInit.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxManPnsInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                //cbxOwners
                $scope.cbxOwnersInit = {
                    url: '/api/users', // ** api load data
                    OriginParams: null, // ** init params -- default: null
                    queryRelate: null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'email', searchField: 'email', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false
                }
                $scope.cbxOwners = { // ** replace name cbx
                    //ngModel : [], // ** value select -- array []
                    Options: [], // ** list options cbx, default: []
                    Table: null, // ** table filter
                    Column: null, // ** number column filter on table
                    Scope: $scope,
                    Config: {
                        plugins: ['infinite_scroll'],//enable load more
                        maxItems: 1,
                        valueField: $scope.cbxOwnersInit.valueField,
                        labelField: $scope.cbxOwnersInit.labelField,
                        searchField: $scope.cbxOwnersInit.searchField,
                        create: false,
                        render: {
                            option: function (data, escape) {
                                return '<div class="option">' +
                                    '<span class="title">' + escape(data[$scope.cbxOwnersInit.labelField]) + '</span>' +
                                    '</div>';
                            },
                            item: function (data, escape) {
                                //return '<div class="item"><a href="' + escape(data[$scope.cbxOwnersInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxOwnersInit.labelField]) + '</a></div>';
                                return '<div class="item">' + escape(data[$scope.cbxOwnersInit.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function (query, callback) {
                            query = JSON.parse(query)
                            if ($scope.cbxOwnersInit.resetScroll) {
                                query.page = 0;
                                callback($scope.cbxOwnersInit.resetScroll);
                                $scope.cbxOwnersInit.resetScroll = false;
                            }
                            $scope.cbxOwnersInit.page = query.page || 0;
                            if (!$scope.cbxOwnersInit.totalCount || $scope.cbxOwnersInit.totalCount > (($scope.cbxOwnersInit.page - 1) * $scope.cbxOwnersInit.perPage)) {
                                var api = apiData.genApi($scope.cbxOwnersInit.url, $scope.cbxOwnersInit.searchField, query.search, $scope.cbxOwnersInit.perPage, null, $scope.cbxOwnersInit.OriginParams, query.page, $scope.cbxOwnersInit.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxOwnersInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                //cbxLocations
                $scope.cbxLocationsInit = {
                    url: '/api/locations', // ** api load data
                    OriginParams: 'active==true', // ** init params -- default: null
                    queryRelate: null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'completeName', searchField: 'completeName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false
                }
                $scope.cbxLocations = { // ** replace name cbx
                    //ngModel : [], // ** value select -- array []
                    Options: [], // ** list options cbx, default: []
                    Table: null, // ** table filter
                    Column: null, // ** number column filter on table
                    Scope: $scope,
                    Config: {
                        plugins: ['infinite_scroll'],//enable load more
                        maxItems: 1,
                        valueField: $scope.cbxLocationsInit.valueField,
                        labelField: $scope.cbxLocationsInit.labelField,
                        searchField: $scope.cbxLocationsInit.searchField,
                        create: false,
                        render: {
                            option: function (data, escape) {
                                return '<div class="option">' +
                                    '<span class="title">' + escape(data[$scope.cbxLocationsInit.labelField]) + '</span>' +
                                    '</div>';
                            },
                            item: function (data, escape) {
                                //return '<div class="item"><a href="' + escape(data[$scope.cbxLocationsInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxLocationsInit.labelField]) + '</a></div>';
                                return '<div class="item">' + escape(data[$scope.cbxLocationsInit.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function (query, callback) {
                            query = JSON.parse(query)
                            if ($scope.cbxLocationsInit.resetScroll) {
                                query.page = 0;
                                callback($scope.cbxLocationsInit.resetScroll);
                                $scope.cbxLocationsInit.resetScroll = false;
                            }
                            $scope.cbxLocationsInit.page = query.page || 0;
                            if (!$scope.cbxLocationsInit.totalCount || $scope.cbxLocationsInit.totalCount > (($scope.cbxLocationsInit.page - 1) * $scope.cbxLocationsInit.perPage)) {
                                var api = apiData.genApi($scope.cbxLocationsInit.url, $scope.cbxLocationsInit.searchField, query.search, $scope.cbxLocationsInit.perPage, null, $scope.cbxLocationsInit.OriginParams, query.page, $scope.cbxLocationsInit.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxLocationsInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                //cbxScrapLocations
                $scope.cbxScrapLocationsInit = {
                    url: '/api/locations', // ** api load data
                    OriginParams: 'active==true;isScrapLocation==true', // ** init params -- default: null
                    queryRelate: null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'completeName', searchField: 'completeName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false
                }
                $scope.cbxScrapLocations = { // ** replace name cbx
                    //ngModel : [], // ** value select -- array []
                    Options: [], // ** list options cbx, default: []
                    Table: null, // ** table filter
                    Column: null, // ** number column filter on table
                    Scope: $scope,
                    Config: {
                        plugins: ['infinite_scroll'],//enable load more
                        maxItems: 1,
                        valueField: $scope.cbxScrapLocationsInit.valueField,
                        labelField: $scope.cbxScrapLocationsInit.labelField,
                        searchField: $scope.cbxScrapLocationsInit.searchField,
                        create: false,
                        render: {
                            option: function (data, escape) {
                                return '<div class="option">' +
                                    '<span class="title">' + escape(data[$scope.cbxScrapLocationsInit.labelField]) + '</span>' +
                                    '</div>';
                            },
                            item: function (data, escape) {
                                //return '<div class="item"><a href="' + escape(data[$scope.cbxScrapLocationsInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxScrapLocationsInit.labelField]) + '</a></div>';
                                return '<div class="item">' + escape(data[$scope.cbxScrapLocationsInit.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function (query, callback) {
                            query = JSON.parse(query)
                            if ($scope.cbxScrapLocationsInit.resetScroll) {
                                query.page = 0;
                                callback($scope.cbxScrapLocationsInit.resetScroll);
                                $scope.cbxScrapLocationsInit.resetScroll = false;
                            }
                            $scope.cbxScrapLocationsInit.page = query.page || 0;
                            if (!$scope.cbxScrapLocationsInit.totalCount || $scope.cbxScrapLocationsInit.totalCount > (($scope.cbxScrapLocationsInit.page - 1) * $scope.cbxScrapLocationsInit.perPage)) {
                                var api = apiData.genApi($scope.cbxScrapLocationsInit.url, $scope.cbxScrapLocationsInit.searchField, query.search, $scope.cbxScrapLocationsInit.perPage, null, $scope.cbxScrapLocationsInit.OriginParams, query.page, $scope.cbxScrapLocationsInit.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxScrapLocationsInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                //cbxMans
                $scope.cbxMansInit = {
                    url: '/api/companies', // ** api load data
                    OriginParams: '', // ** init params -- default: null
                    queryRelate: null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false
                }
                $scope.cbxMans = { // ** replace name cbx
                    //ngModel : [], // ** value select -- array []
                    Options: [], // ** list options cbx, default: []
                    Table: null, // ** table filter
                    Column: null, // ** number column filter on table
                    Scope: $scope,
                    Config: {
                        plugins: ['infinite_scroll'],//enable load more
                        maxItems: 1,
                        valueField: $scope.cbxMansInit.valueField,
                        labelField: $scope.cbxMansInit.labelField,
                        searchField: $scope.cbxMansInit.searchField,
                        create: false,
                        render: {
                            option: function (data, escape) {
                                return '<div class="option">' +
                                    '<span class="title">' + escape(data[$scope.cbxMansInit.labelField]) + '</span>' +
                                    '</div>';
                            },
                            item: function (data, escape) {
                                //return '<div class="item"><a href="' + escape(data[$scope.cbxMansInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxMansInit.labelField]) + '</a></div>';
                                return '<div class="item">' + escape(data[$scope.cbxMansInit.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function (query, callback) {
                            query = JSON.parse(query)
                            if ($scope.cbxMansInit.resetScroll) {
                                query.page = 0;
                                callback($scope.cbxMansInit.resetScroll);
                                $scope.cbxMansInit.resetScroll = false;
                            }
                            $scope.cbxMansInit.page = query.page || 0;
                            if (!$scope.cbxMansInit.totalCount || $scope.cbxMansInit.totalCount > (($scope.cbxMansInit.page - 1) * $scope.cbxMansInit.perPage)) {
                                var api = apiData.genApi($scope.cbxMansInit.url, $scope.cbxMansInit.searchField, query.search, $scope.cbxMansInit.perPage, null, $scope.cbxMansInit.OriginParams, query.page, $scope.cbxMansInit.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxMansInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                //cbxPackages
                $scope.cbxPackagesInit = {
                    url: '/api/packages', // ** api load data
                    OriginParams: '', // ** init params -- default: null
                    queryRelate: null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'packageNumber', searchField: 'packageNumber', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false
                }
                $scope.cbxPackages = { // ** replace name cbx
                    //ngModel : [], // ** value select -- array []
                    Options: [], // ** list options cbx, default: []
                    Table: null, // ** table filter
                    Column: null, // ** number column filter on table
                    Scope: $scope,
                    Config: {
                        plugins: ['infinite_scroll'],//enable load more
                        maxItems: 1,
                        valueField: $scope.cbxPackagesInit.valueField,
                        labelField: $scope.cbxPackagesInit.labelField,
                        searchField: $scope.cbxPackagesInit.searchField,
                        create: false,
                        render: {
                            option: function (data, escape) {
                                return '<div class="option">' +
                                    '<span class="title">' + escape(data[$scope.cbxPackagesInit.labelField]) + '</span>' +
                                    '</div>';
                            },
                            item: function (data, escape) {
                                //return '<div class="item"><a href="' + escape(data[$scope.cbxPackagesInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxPackagesInit.labelField]) + '</a></div>';
                                return '<div class="item">' + escape(data[$scope.cbxPackagesInit.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function (query, callback) {
                            query = JSON.parse(query)
                            if ($scope.cbxPackagesInit.resetScroll) {
                                query.page = 0;
                                callback($scope.cbxPackagesInit.resetScroll);
                                $scope.cbxPackagesInit.resetScroll = false;
                            }
                            $scope.cbxPackagesInit.page = query.page || 0;
                            if (!$scope.cbxPackagesInit.totalCount || $scope.cbxPackagesInit.totalCount > (($scope.cbxPackagesInit.page - 1) * $scope.cbxPackagesInit.perPage)) {
                                var api = apiData.genApi($scope.cbxPackagesInit.url, $scope.cbxPackagesInit.searchField, query.search, $scope.cbxPackagesInit.perPage, null, $scope.cbxPackagesInit.OriginParams, query.page, $scope.cbxPackagesInit.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxPackagesInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                //cbxLots
                $scope.cbxLotsInit = {
                    url: '/api/lots', // ** api load data
                    OriginParams: '', // ** init params -- default: null
                    queryRelate: null, // ** init query relate cbx -- default: null
                    valueField: 'id', labelField: 'lotNumber', searchField: 'lotNumber', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                    perPage: 10, totalCount: null, page: 0, resetScroll: false
                }
                $scope.cbxLots = { // ** replace name cbx
                    //ngModel : [], // ** value select -- array []
                    Options: [], // ** list options cbx, default: []
                    Table: null, // ** table filter
                    Column: null, // ** number column filter on table
                    Scope: $scope,
                    Config: {
                        plugins: ['infinite_scroll'],//enable load more
                        maxItems: 1,
                        valueField: $scope.cbxLotsInit.valueField,
                        labelField: $scope.cbxLotsInit.labelField,
                        searchField: $scope.cbxLotsInit.searchField,
                        create: false,
                        render: {
                            option: function (data, escape) {
                                return '<div class="option">' +
                                    '<span class="title">' + escape(data[$scope.cbxLotsInit.labelField]) + '</span>' +
                                    '</div>';
                            },
                            item: function (data, escape) {
                                //return '<div class="item"><a href="' + escape(data[$scope.cbxLotsInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxLotsInit.labelField]) + '</a></div>';
                                return '<div class="item">' + escape(data[$scope.cbxLotsInit.labelField]) + '</div>';
                            }
                        },
                        //use load event if use load more
                        load: function (query, callback) {
                            query = JSON.parse(query)
                            if ($scope.cbxLotsInit.resetScroll) {
                                query.page = 0;
                                callback($scope.cbxLotsInit.resetScroll);
                                $scope.cbxLotsInit.resetScroll = false;
                            }
                            $scope.cbxLotsInit.page = query.page || 0;
                            if (!$scope.cbxLotsInit.totalCount || $scope.cbxLotsInit.totalCount > (($scope.cbxLotsInit.page - 1) * $scope.cbxLotsInit.perPage)) {
                                var api = apiData.genApi($scope.cbxLotsInit.url, $scope.cbxLotsInit.searchField, query.search, $scope.cbxLotsInit.perPage, null, $scope.cbxLotsInit.OriginParams, query.page, $scope.cbxLotsInit.queryRelate);
                                $http.get(api).then(function (response) {
                                    $scope.cbxLotsInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                    callback(response.data);
                                });
                            }
                        }
                    }
                }

                //list add Scraps
                $scope.listScraps = [];
                //new model push to table
                $scope.newScrap = {
                    productId: "",
                    product: {},
                    description: "",
                    vnptManPnId: "",
                    vnptManPn: {},
                    manPnId: "",
                    manPn: {},
                    lotId: "",
                    lot: {},
                    packageId: "",
                    package: {},
                    quantity: 0,
                    locationId: "",
                    location: {},
                    scrapLocationId: "",
                    scrapLocation: {},

                    ownerId: "",
                    scheduledDate: "",
                    partnerId: "",
                    sourceDocument: ""
                }

                /*EXECUTION TABLE*/
                $scope.showAddItemScrap = false;
                $scope.addAnItemScrap = function () {
                    $scope.showAddItemScrap = true;
                    if(!$scope.isTargetScrap){
                        $timeout(function () {
                            $scope.isTargetScrap = !$scope.isTargetScrap
                        }, 100);
                    }
                }

                //SHOW HIDE COLUMNS
                $scope.myColumnsDetailScrap = ["VNPT P/N", "Description", "Man P/N", "Lot", "Package", "Quantity", "Owner", "Location", "Scrap Location", "Old VNPT P/N", "Manufacturer"];
                $scope.myColumnsShowScrap = [];
                for (var i = 0; i < $scope.myColumnsDetailScrap.length - 2; i++) {
                    $scope.myColumnsShowScrap.push(true);
                }

                //INIT LOAD (productId, manId, manPn) of transfer
                $scope.listDetailTransfer = [];
                $scope.listManPns = [];
                $scope.listProductIds = [];
                $scope.listManIds = [];
                $scope.originParamProduct = "";
                $scope.originParamProductMan = "";
                $scope.originParamManPn = "";

                function buildSearch(input, initString, isInt) {
                    var rtn = initString;
                    input.forEach(function (value) {
                        if (isInt) {
                            rtn = rtn + value + ",";
                        } else {
                            rtn = rtn + "'" + value + "'" + ",";
                        }
                    });
                    if (rtn.endsWith(',')) {
                        rtn = rtn.slice(0, -1) + ')';
                    } else {
                        rtn = rtn + ')';
                    }
                    //console.log(rtn);
                    return rtn;
                }

                $scope.initCreateScrap = function () {
                    Scrap.listDetailsOfTransfer($stateParams.transferId).then(function (data) {
                        $scope.listDetailTransfer = data;
                        data.forEach(function (value) {
                            if (value.manPn != undefined && value.manPn != null && value.manPn != '' && $scope.listManPns.indexOf(value.manPn) < 0) {
                                $scope.listManPns.push(value.manPn);
                            }
                            if (value.productId != undefined && $scope.listProductIds.indexOf(value.productId) < 0) $scope.listProductIds.push(value.productId);
                            if (value.manId != undefined && $scope.listManIds.indexOf(value.manId) < 0) $scope.listManIds.push(value.manId);
                        });

                        $scope.cbxVnptPnsInit.OriginParams = buildSearch($scope.listProductIds, "id=in=(", true);
                        $scope.cbxDescs1Init.OriginParams = buildSearch($scope.listProductIds, "id=in=(", true);
                        $scope.cbxManPnsInit.OriginParams = buildSearch($scope.listProductIds, "productId=in=(", true) + ';'
                            + buildSearch($scope.listManIds, "manufacturerId=in=(", true) + ';'
                            + buildSearch($scope.listManPns, "manufacturerPn=in=(", false);
                        $scope.cbxVnptManPnsInit.OriginParams = buildSearch($scope.listProductIds, "productId=in=(", true) + ';'
                            + buildSearch($scope.listManIds, "manufacturerId=in=(", true);
                        $scope.originParamProduct = angular.copy($scope.cbxVnptPnsInit.OriginParams);
                        $scope.originParamProductMan = angular.copy($scope.cbxVnptManPnsInit.OriginParams);
                        $scope.originParamManPn = angular.copy($scope.cbxManPnsInit.OriginParams);
                    })
                }

                //createNewItem
                $scope.createNewItemScrap = function () {
                    $scope.newScrap.srcLocationId = $scope.newScrap.locationId;
                    $scope.newScrap.destLocationId = $scope.newScrap.scrapLocationId;
                    $scope.newScrap.transferId = $stateParams.hasOwnProperty("transferId") ? $stateParams.transferId : 0;
                    $scope.newScrap.transferDetails = [
                        {
                            destLocationId: $scope.newScrap.scrapLocationId,
                            doneQuantity: $scope.newScrap.quantity,
                            manId: $scope.newScrap.manufacturerId,
                            manPn: $scope.newScrap.manPn.manufacturerPn,
                            productId: $scope.newScrap.productId,
                            productName: $scope.newScrap.product.name,
                            srcLocationId: $scope.newScrap.locationId,
                            transferId: $stateParams.hasOwnProperty("transferId") ? $stateParams.transferId : 0,
                            reserved: 0,
                            src_lot_number: $scope.newScrap.lot.lotNumber,
                            src_lot_id: $scope.newScrap.lotId,
                            src_package_number: $scope.newScrap.package.packageNumber,
                            src_package_id: $scope.newScrap.packageId
                        }
                    ];
                    $scope.newScrap.editable = false;

                    $scope.listScraps.push(angular.copy($scope.newScrap));
                    $scope.newScrap.productId = "";
                    $scope.newScrap.product = {};
                    $scope.newScrap.description = "";
                    $scope.newScrap.vnptManPnId = "";
                    $scope.newScrap.vnptManPn = {};
                    $scope.newScrap.manPnId = "";
                    $scope.newScrap.lotId = "";
                    $scope.newScrap.lot = {};
                    $scope.newScrap.packageId = "";
                    $scope.newScrap.package = {};
                    $scope.newScrap.quantity = 0;
                    $scope.newScrap.locationId = "";
                    $scope.newScrap.location = {};
                    $scope.newScrap.scrapLocationId = "";
                    $scope.newScrap.scrapLocation = {};
                    //console.log($scope.listScraps);
                    $scope.showAddItemScrap = false;
                    $scope.isTargetScrap = false;

                    $scope.cbxVnptPnsInit.OriginParams = angular.copy($scope.originParamProduct);
                    $scope.cbxVnptManPnsInit.OriginParams = angular.copy($scope.originParamProductMan);
                    $scope.cbxManPnsInit.OriginParams = angular.copy($scope.originParamManPn);
                }
                //cancelNewItem
                $scope.cancelNewItemScrap = function () {
                    $scope.showAddItemScrap = false;

                    $scope.cbxVnptPnsInit.OriginParams = angular.copy($scope.originParamProduct);
                    $scope.cbxVnptManPnsInit.OriginParams = angular.copy($scope.originParamProductMan);
                    $scope.cbxManPnsInit.OriginParams = angular.copy($scope.originParamManPn);

                    $scope.newScrap = {
                        productId: "",
                        product: {},
                        description: "",
                        vnptManPnId: "",
                        vnptManPn: {},
                        manPnId: "",
                        manPn: {},
                        lotId: "",
                        lot: {},
                        packageId: "",
                        package: {},
                        quantity: 0,
                        locationId: "",
                        location: {},
                        scrapLocationId: "",
                        scrapLocation: {},

                        ownerId: "",
                        scheduledDate: "",
                        partnerId: "",
                        sourceDocument: ""
                    }
                }

                $scope.isTargetScrap = false;
                $scope.isTargetScrapEdit = false;
                var row_add_item_scrap = $('#row_add_item_scrap')
                $(window).click(function(event) {
                    //Create
                    // console.log($scope.isTargetScrap)
                    if (row_add_item_scrap.has(event.target).length == 0 && !row_add_item_scrap.is(event.target)){
                        if($scope.isTargetScrap){
                            //check empty row
                            if((!angular.isDefined($scope.newScrap.productId) || $scope.newScrap.productId =='')
                                /*&& (!angular.isDefined($scope.toDate) || $scope.toDate =='')
                                && (!angular.isDefined($scope.nextNumber) || $scope.nextNumber =='')*/
                            ){
                                $scope.showAddItemScrap = false;
                                $scope.isTargetScrap = false;
                            } else {
                                $scope.createNewItemScrap();  //create item
                            }
                        }
                    } else {
                        $scope.isTargetScrap = true
                        console.log($scope.isTargetScrap)
                    }

                    //Edit
                    var editScrapRow = $('#scrapItem_' + $scope.targetUpdating)
                    if (editScrapRow.has(event.target).length == 0 && !editScrapRow.is(event.target)){
                        //console.log("NONE_TARGET")
                        if($scope.isTargetScrapEdit){
                            if(angular.isDefined($scope.targetUpdating)){
                                $scope.saveItemScrap(event,$scope.targetUpdating)
                            }
                        }
                    } else {
                        //console.log("TARGET")
                        $scope.isTargetScrapEdit = true
                    }
                });

                $scope.editItemScrap = function ($event,index) {
                    if(angular.isDefined($scope.targetUpdating)){
                        $scope.saveItemScrap($event,$scope.targetUpdating);
                    }
                    $scope.entity = $scope.listScraps[index];
                    $scope.entity.editable = true;

                    $scope.targetUpdating = index;
                }
                
                $scope.saveItemScrap = function ($event,index) {
                    if(true){ //conditions check
                        $scope.listScraps[index].editable = false;
                        delete $scope.targetUpdating;
                        $scope.isTargetScrapEdit = false;

                        //console.log("SAVE")
                    }
                }

                $scope.removeScrapItem = function (index) {
                    if(angular.isDefined($scope.targetUpdating)){
                        $scope.saveItemScrap($event,$scope.targetUpdating);
                    }
                    var tmp = [];
                    $scope.listScraps.forEach(function (value, index2) {
                        if(index2 != index){
                            tmp.push(value);
                        }
                    });
                    $scope.listScraps = tmp;
                }

                $scope.blockModal;
                $scope.blockUI = function () {
                    $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please Wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner.gif\' alt=\'\'>');
                }

                function allDone() {
                    //console.log("done");
                    if ($scope.blockModal != null)
                        $scope.blockModal.hide();
                    // $state.go('transfers-detail', {transferId: $stateParams.transferId}, {reload: true});
                    location.reload();
                }

                $scope.createScrap = function () {
                    $scope.blockUI();
                    forEach($scope.listScraps, function(value, index, arr) {
                        //console.log("each", value, index, arr);
                        var done = this.async();
                        //init 4 property
                        var tmp_time = $scope.newScrap.scheduledDate.toString().split("/");
                        value.scheduledDate = (new Date(tmp_time[1] + '/' + tmp_time[0] + '/' + tmp_time[2]).getTime());
                        value.ownerId = $scope.newScrap.ownerId;
                        value.partnerId = $scope.newScrap.partnerId;
                        value.sourceDocument = $scope.newScrap.sourceDocument;
                        Scrap.create(value).then(function (data) {
                            done();
                        });
                    }, allDone);
                }

                if (angular.element('#form_add_item_scrap').length) {
                    $('#form_add_item_scrap').parsley({
                        'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
                    }).on('form:validated', function () {
                        $scope.$apply();
                    }).on('field:validated', function (parsleyField) {
                        if ($(parsleyField.$element).hasClass('md-input')) {
                            $scope.$apply();
                        }
                    });
                }

                $scope.validateButton = function () {
                    if ($scope.form_add_item_scrap.$valid) {
                        $("#addItemScrapButton").removeClass("hideElement");
                        // console.log('true');
                        return true;
                    } else {
                        $("#addItemScrapButton").addClass("hideElement");
                        // console.log('false');
                        return false;
                    }
                }
            }

            /*
            * FOR CANCEL TRANSFER
            * */
            $scope.cancelTransfer = function () {
                UIkit.modal.confirm($translate.instant("transfer.common.msgConfirmCancel"), function () {
                    $scope.blockUI();
                    Transfer.cancelTransfer($scope.transfer).then(function (data) {
                        allDone();
                    }).catch(function(data){
                        if ($scope.blockModal != null)
                            $scope.blockModal.hide();
                        ErrorHandle.handleError(data);
                    })
                }, {
                    labels: {
                        'Ok': $translate.instant("transfer.common.okConfirm"),
                        'Cancel': $translate.instant("common-ui-element.button.Cancel")
                    }
                });
            }

            /*
            * FOR DELETE TRANSFER
            * */
            $scope.deleteTransfer = function () {
                UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                    $scope.blockUI();
                    Transfer.deleteOne($scope.transfer.id).then(function (data) {
                        if ($scope.blockModal != null)
                            $scope.blockModal.hide();
                        $state.go('transfers', {}, {reload : true});
                    }).catch(function(data){
                        if ($scope.blockModal != null)
                            $scope.blockModal.hide();
                        ErrorHandle.handleError(data);
                    })
                }, {
                    labels: {
                        'Ok': $translate.instant("common-ui-element.button.Delete"),
                        'Cancel': $translate.instant("common-ui-element.button.Cancel")
                    }
                });
            }

            /*VALIDATE BUTTON TASK 425*/
            $scope.validateShowEditButton = function () {
                //console.log($scope.status);
                //ui-sref="transfers-edit({transferId: transfer.id })"
                if($scope.status == 'done'){
                    $("#buttonEditTransfer").addClass("hideElement");
                    return true;
                } else {
                    $("#buttonEditTransfer").removeClass("hideElement");
                    return false;
                }
            }

            $scope.clickEditButton = function () {
                //console.log("click");
                $scope.blockUI();
                $timeout(function () {
                    if ($scope.blockModal != null)
                        $scope.blockModal.hide();
                }, 1000)
                $state.go("transfers-edit", {transferId: $scope.transfer.id });
            }

            /*FOR TRANSFER MANUFACTURING*/
            $scope.attrManufacturerCode = 'companyCode';
            $scope.attrProductDesc= 'description';
            $scope.attrProductName= 'name';

            $scope.updatedTransferItems = [];
            $scope.currentSate = $state.current.name;
            $scope.updateSelectedOptionsMO = function (option) {
                console.log(option);
                if(!option.selected){
                    $scope.updatedTransferItems.push(option);
                }else{
                    var tmp = [];
                    $scope.updatedTransferItems.forEach(function (item, index) {
                        if(item.id != option.id) tmp.push(option);
                    }) ;
                    $scope.updatedTransferItems = angular.copy(tmp);
                }
                console.log($scope.updatedTransferItems);
            }

            //validateCheckAvailabilityButton
            $scope.validateCheckAvailabilityButton = function () {
                //console.log($scope.status);
                //ui-sref="transfers-edit({transferId: transfer.id })"
                if($scope.transfer.currentDemand > $scope.transfer.capacity){
                    $("#buttonCheckAvailability").addClass("hideElement");
                    return true;
                } else {
                    $("#buttonCheckAvailability").removeClass("hideElement");
                    return false;
                }
            }
            /*END TRANSFER MANUFACTURING*/

        }
    ]);

