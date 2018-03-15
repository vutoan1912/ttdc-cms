angular
    .module('erpApp')
    .controller('WarehouseController', [
        '$scope',
        '$rootScope',
        '$state',
        '$timeout',
        '$compile',
        'Warehouse',
        '$stateParams',
        '$interval',
        'TableMultiple',
        '$translate',
        'TranslateCommonUI',
        'ErrorHandle',
        'AlertService',
        '$window',
        function ($scope, $rootScope, $state, $timeout, $compile, Warehouse, $stateParams, $interval, TableMultiple, $translate, TranslateCommonUI, ErrorHandle, AlertService, $window) {
            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, options) {
                if (toState.name == "warehouses" && (fromState.name == "warehouses-detail" || fromState.name == "warehouses-create" || fromState.name == "warehouses-edit")) {
                    $state.go('warehouses', {}, {reload: true});
                }
            });

            TranslateCommonUI.init($scope);
            $scope.warehouseTitle = "warehouse.common.Warehouse";
            $scope.configTitle = "warehouse.common.Configuration";
            $scope.managementTitle = "warehouse.common.WarehouseManagement";
            $scope.routeTitle = "warehouse.common.Route";

            $scope.columnsName = {
                Code: "warehouse.column.Code",
                Name: "warehouse.column.Name",
                LocationStock: "warehouse.column.LocationStock",
                Address: "warehouse.column.Address",
                Status: "warehouse.column.Status",
                Created: "warehouse.column.Created",
                Updated: "warehouse.column.Updated",
                CreatedBy: "warehouse.column.CreatedBy",
                UpdatedBy: "warehouse.column.UpdatedBy"
            }

            $scope.detail = {
                Name: "warehouse.detail.Name", // Field Name
                ShortName: "warehouse.detail.ShortName", // Field Short Name
                Address: "warehouse.detail.Address", // Field Address
                Created: "warehouse.detail.Created", // Field Created
                CreatedBy: "warehouse.detail.CreatedBy", // Field CreatedBy
                Updated: "warehouse.detail.Updated", // Field Updated
                UpdatedBy: "warehouse.detail.UpdatedBy", // Field UpdatedBy
                Config: "warehouse.detail.Config",
                IncomingShipment: "warehouse.detail.IncomingShipment",
                OutgoingShipment: "warehouse.detail.OutgoingShipment",
                IncomingOneStep: "warehouse.detail.IncomingOneStep",
                IncomingTwoSteps: "warehouse.detail.IncomingTwoSteps",
                IncomingThreeSteps: "warehouse.detail.IncomingThreeSteps",
                OutgoingShipOnly: "warehouse.detail.OutgoingShipOnly",
                OutgoingPickShip: "warehouse.detail.OutgoingPickShip",
                OutgoingPickPackShip: "warehouse.detail.OutgoingPickPackShip"
            }

            $scope.maxLengthRule = "warehouse.messages.maxLengthRule";
            $scope.maxLengthShortNameRule = "warehouse.messages.maxLengthShortNameRule";
            $scope.wrongPatternRule = "warehouse.messages.wrongPatternRule"

            //handler hide/show columns
            $scope.checkColumnAll = false
            $scope.checkboxType = "container-checkbox"
            $scope.myColumns = ["Name","Short Name", "Address", "Created", "CreatedBy", "Updated", "UpdatedBy", "Status"]
            $scope.myColumnsShow=[]
            for (var i=0; i<$scope.myColumns.length;i++){
                if(i < 4 || i == 7)
                    $scope.myColumnsShow.push(true)
                else
                    $scope.myColumnsShow.push(false)
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

            $scope.selectize_active_options = ["Active", "Inactive"];

            $scope.selectize_active_config = {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1
            };

            $scope.warehouse = {}
            $scope.status = "Inactive"
            $scope.active = false;
            var statusAction = {
                true: "Activate",
                false: "Deactivate"
            }
            var statusTitle = {
                true: "Active",
                false: "Inactive"
            }
            var statusStyle = {
                true: "uk-text-success uk-text-bold",
                false: "uk-text-danger uk-text-bold"
            }
            if ($scope.active) {
                $scope.status = "Active"
            }
            $scope.activeClass = statusStyle[$scope.active]

            $scope.handleIncomingRadio = function () {
                $scope.availableIncoming = [true, true, true];
                if($scope.warehouse.receptionSteps == "one_step") {
                    $('#radio_incoming_1').prop('checked', true).iCheck('update');
                    $scope.availableIncoming[0] = false;
                } else if($scope.warehouse.receptionSteps == "two_steps") {
                    $('#radio_incoming_2').prop('checked', true).iCheck('update');
                    $scope.availableIncoming[1] = false;
                } else if($scope.warehouse.receptionSteps == "three_steps") {
                    $('#radio_incoming_3').prop('checked', true).iCheck('update');
                    $scope.availableIncoming[2] = false;
                }
            }

            $('#radio_incoming_1')
                .on('ifChecked', function () {
                    $scope.warehouse.receptionSteps = "one_step";
                });
            $('#radio_incoming_2')
                .on('ifChecked', function () {
                    $scope.warehouse.receptionSteps = "two_steps";
                });
            $('#radio_incoming_3')
                .on('ifChecked', function () {
                    $scope.warehouse.receptionSteps = "three_steps";
                });

            $scope.handleOutgoingRadio = function () {
                $scope.availableOutgoing = [true, true, true];
                if($scope.warehouse.deliverySteps == "ship_only") {
                    $('#radio_outgoing_1').prop('checked', true).iCheck('update');
                    $scope.availableOutgoing[0] = false;
                } else if($scope.warehouse.deliverySteps == "pick_ship") {
                    $('#radio_outgoing_2').prop('checked', true).iCheck('update');
                    $scope.availableOutgoing[1] = false;
                } else if($scope.warehouse.deliverySteps == "pick_pack_ship") {
                    $('#radio_outgoing_3').prop('checked', true).iCheck('update');
                    $scope.availableOutgoing[2] = false;
                }
            }

            $('#radio_outgoing_1')
                .on('ifChecked', function () {
                    $scope.warehouse.deliverySteps = "ship_only";
                });
            $('#radio_outgoing_2')
                .on('ifChecked', function () {
                    $scope.warehouse.deliverySteps = "pick_ship";
                });
            $('#radio_outgoing_3')
                .on('ifChecked', function () {
                    $scope.warehouse.deliverySteps = "pick_pack_ship";
                });

            $scope.clickActiveLock = false;
            $scope.clickActive = function () {
                if(!$scope.clickActiveLock) {
                    $scope.clickActiveLock = true;
                    $scope.status = statusTitle[$scope.active];
                } else {
                    // continue click, need change
                    $scope.changeActive();
                }
            }

            $scope.changeActive = function () {
                $scope.active = !$scope.active;
                $scope.warehouse.active = !$scope.warehouse.active;

                if ($scope.active) {
                    $scope.status = "Active"
                } else {
                    $scope.status = "Inactive"
                }
                $scope.activeClass = statusStyle[$scope.active]
            }

            /*$scope.mouseHoverStatus = function(){
                $scope.active = !$scope.active
                $scope.status = statusAction[$scope.active]
                $scope.activeClass = statusStyle[$scope.active]
                // console.log("HOVER: "+$scope.status)
            };
            $scope.mouseLeaveStatus = function(){
                $scope.active = !$scope.active
                $scope.status = statusTitle[$scope.active]
                $scope.activeClass = statusStyle[$scope.active]
                // console.log("LEAVE: "+$scope.status)
                if($scope.clickActiveLock){
                    $scope.changeActive();
                    $scope.clickActiveLock = false;
                }
            };*/

            $scope.goToRoute = function () {
                //console.log($scope.warehouse.routeIds)
                $state.go("routes-warehouse", {list_id: $scope.warehouse.routeIds});
            }
            
            $scope.blockModal;
            $scope.blockUI = function(){
                $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please Wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner.gif\' alt=\'\'>');
            }

            /*$("#table_wh").css('min-height', $( window ).height() - 300);
            $("#table_wh").css('max-height', $( window ).height() - 300);
            angular.element($window).bind('resize', function(){
                $("#table_wh").css('min-height', $( window ).height() - 300);
                $("#table_wh").css('max-height', $( window ).height() - 300);
            });*/

            // Create
            if (angular.element('#form_create_warehouse').length) {
                $scope.warehouse = {
                    receptionSteps: "one_step",
                    deliverySteps: "ship_only",
                    active: false
                }
                $scope.changeActive();
                $scope.handleIncomingRadio();
                $scope.handleOutgoingRadio();

                $scope.submit = function() {
                    $('#form_create_warehouse').parsley();
                    if($scope.form_create_warehouse.$valid){
                        if (angular.element('#info_edit').length) {
                            // Edit
                            Warehouse.update($scope.warehouse.id, $scope.warehouse)
                                .then(function(data){
                                    $state.go('warehouses-detail',{warehouseId: $scope.warehouse.id });
                                })
                                .catch(function(data){
                                    //console.log("ERROR", data);
                                    ErrorHandle.handleError(data);
                                })
                        } else {
                            // Create
                            $scope.blockUI();
                            Warehouse.create($scope.warehouse)
                                .then(function(data){
                                    if($scope.blockModal != null)
                                        $scope.blockModal.hide();
                                    $state.go('warehouses');
                                })
                                .catch(function(data){
                                    //console.log("ERROR", data);
                                    if($scope.blockModal != null)
                                        $scope.blockModal.hide();
                                    ErrorHandle.handleError(data);
                                })
                        }
                    }
                }

                if ( angular.element('#form_create_warehouse').length ) {
                    $scope.required_msg = 'warehouse.messages.required';

                    var $formValidate = $('#form_create_warehouse');
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
            }

            // Detail
            if (angular.element('#info_detail').length) {
                //get warehouse and render detail page
                Warehouse.getOne($stateParams.warehouseId).then(function (data) {
                    $scope.warehouse = data
                    $scope.status = "Inactive"
                    $scope.active = $scope.warehouse.active

                    if ($scope.active) {
                        $scope.status = "Active"
                    }
                    $scope.activeClass = statusStyle[$scope.active]

                    $scope.handleIncomingRadio();
                    $scope.handleOutgoingRadio();
                })
            }

            // Edit
            if (angular.element('#info_edit').length) {
                //get warehouse and render edit page
                Warehouse.getOne($stateParams.warehouseId).then(function (data) {
                    $scope.warehouse = data
                    $scope.status = "Inactive"
                    $scope.active = $scope.warehouse.active

                    if ($scope.active) {
                        $scope.status = "Active"
                    }
                    $scope.activeClass = statusStyle[$scope.active]

                    $scope.handleIncomingRadio();
                    $scope.handleOutgoingRadio();
                })
            }

            // Delete
            $scope.deleteWarehouse = function () {
                UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                    Warehouse.deleteOne($stateParams.warehouseId).then(function (data) {
                        $state.go('warehouses');
                    }).catch(function(data) {
                        ErrorHandle.handleError(data)
                    })
                }, {
                    labels: {
                        'Ok': $translate.instant("common-ui-element.button.Delete"),
                        'Cancel': $translate.instant("common-ui-element.button.Cancel")
                    }
                });
            }

            // Handle active filter
            $scope.active_filter = "Active";
            $scope.handleActiveFilter = function () {
                if($scope.active_filter == "Active") {
                    $scope.TABLES['table_wh'].param_filter_list[4] = 1;
                } else if($scope.active_filter == "Inactive") {
                    $scope.TABLES['table_wh'].param_filter_list[4] = 0;
                }
                $scope.handleFilter('table_wh');
            }

            // Handle Delete Rows
            $scope.handleDeleteRows = function () {
                UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                    var ids = TableMultiple.getSelectedRowIDs('table_wh');
                    Warehouse.deleteMany(ids)
                        .then(function(data){
                            console.log(data)
                            if (data.length > 0) {
                                ErrorHandle.handleErrors(data);
                            } else {
                                AlertService.success('success.msg.delete');
                                TableMultiple.reloadPage(newTableIds.idTable);
                            }
                        })
                        .catch(function(data){
                            ErrorHandle.handleError(data);
                        })
                }, {
                    labels: {
                        'Ok': $translate.instant("common-ui-element.button.Delete"),
                        'Cancel': $translate.instant("common-ui-element.button.Cancel")
                    }
                });
            }

            var fields =    ["id",     "name",  "code", "address", "created", "createdBy", "updated", "updatedBy",  "active"];
            var fieldsType =["Number", "Text",  "Text", "Text",    "Number",  "Text",      "Number",  "Text",       "Number"];
            var loadFunction = Warehouse.getPage;
            var newTableIds = {
                idTable: "table_wh",
                model: "warehouses",
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
                pager_id: "table_wh_pager",
                selectize_page_id: "wh_selectize_page",
                selectize_pageNum_id: "wh_selectize_pageNum"
            }

            TableMultiple.initTableIds($scope, newTableIds);
            TableMultiple.sortDefault(newTableIds.idTable);
            TableMultiple.reloadPage(newTableIds.idTable);

            $scope.activate = function () {
                if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0){
                    Warehouse.activate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                        AlertService.success('success.msg.active')
                        TableMultiple.reloadPage(newTableIds.idTable);
                    }).catch(function(data){
                        ErrorHandle.handleError(data);
                    })
                }

            }

            $scope.deactivate = function () {
                if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0){
                    Warehouse.deactivate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                        AlertService.success('success.msg.inactive')
                        TableMultiple.reloadPage(newTableIds.idTable);
                    }).catch(function(data){
                        ErrorHandle.handleError(data);
                    })
                }
            }

            $scope.locationStock = {
                url : "/api/locations/",
                attr : "completeName"
            }

            $scope.CbxLocationStock = {
                Placeholder : 'Select location stock',
                TextField : 'completeName',
                ValueField : 'id',
                Size : "10",
                Api : "api/locations",
                Table : $scope.TABLES['table_wh'],
                Column : 2,
                Scope : $scope,
                ngModel : null
            }

            $scope.CbxActive = {
                Placeholder : 'Select status',
                Api : "api/warehouses",
                Table : $scope.TABLES['table_wh'],
                Column : 8,
                Scope : $scope,
                ngModel:{value:1, title:"Active"}
            }

            $scope.CbxCreatedBy ={
                url:'/api/users/search?query=',
                key:'email',
                attr:'email',
                prefix:'#/users/',
                suffix:'/detail'
            }

            $scope.CbxActivate = {
                activateService:Warehouse.activate,
                deactivateService:Warehouse.deactivate
            }

            $scope.DatetimeRange1 = {
                dateStart: null,
                dateEnd: null,
                Table: $scope.TABLES['table_wh'], // ** table filter
                Column: 4, // ** number column filter on table
                Scope: $scope
            }
            $scope.DatetimeRange2 = {
                dateStart: null,
                dateEnd: null,
                Table: $scope.TABLES['table_wh'], // ** table filter
                Column: 6, // ** number column filter on table
                Scope: $scope
            }
        }
    ]);

