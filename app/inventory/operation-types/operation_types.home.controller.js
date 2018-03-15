angular
    .module('erpApp')
    .controller('OperationTypesHomeController', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$compile',
        'OperationType',
        '$stateParams',
        '$interval',
        'TableMultiple',
        '$translate',
        '$window',
        'AlertService',
        '$state',
        '$filter',
        'Sequence',
        'Location',
        'Warehouse',
        'ErrorHandle',
        'apiData',
        '$http',
        function ($scope, $rootScope, $timeout, $compile, OperationType, $stateParams, $interval, TableMultiple, $translate, $window, AlertService, $state, $filter, Sequence, Location, Warehouse, ErrorHandle, apiData, $http) {
            $scope.chooseValue = {value: 1, title: "Active"}
            $scope.columnsName = {
                warehouse: "inventory.column.warehouse",
                opName: "inventory.column.opName",
                opType: "inventory.column.opType",
                opTypeReturn: "inventory.column.opTypeReturn",
                rs: "inventory.column.rs",
                amp: "inventory.column.amp",
                cnl: "inventory.column.cnl",
                uel: "inventory.column.uel",
                dsl: "inventory.column.dsl",
                ddl: "inventory.column.ddl",
                active: "masterdata.column.Active"
            }

            $scope.button = {
                Create: "masterdata.button.Create",
                Edit: "masterdata.button.Edit",
                Back: "masterdata.button.Back",
                Delete: "masterdata.button.Delete",
                Cancel: "masterdata.button.Cancel",
                Save: "masterdata.button.Save"
            }

            $scope.common = {
                Inventory: "inventory.common.Inventory",
                Preference: "inventory.common.Preference",
                Sequences: "inventory.common.Sequences",
                Sequence: "inventory.common.Sequence",
                ots: "inventory.common.ots",
                pal: "inventory.common.pal",
                locations: "inventory.common.locations"

            }

            $scope.msg = {
                from: "inventory.messages.from",
                to: "inventory.messages.to",
                dateValid: "inventory.messages.dateValid",
                selectDate: "inventory.messages.selectDate",
                required: "inventory.messages.required"
            }

            //init type dropdown
            $scope.selectize_type_options = [
                {name: 'Vendors', id: 'incoming'},
                {name: 'Customer', id: 'outcoming'},
                {name: 'Manufacturing Operation', id: 'manufacturing'},
                {name: 'Internal', id: 'internal'}
            ];

            $scope.urlOtName = '/api/operation-types/';
            $scope.urlWarehouseName = '/api/warehouses/';
            $scope.urlSeqName = '/api/sequences/';
            $scope.urlLocationName = '/api/locations/';
            $scope.attrName = 'name';
            $scope.attrCompleteName = 'completeName';
            $scope.CbxCreatedBy = {
                url: '/api/users/search?query=',
                key: 'email',
                attr: 'email',
                prefix: '#/users/',
                suffix: '/detail'
            }
            $scope.CbxActivate = {
                activateService: OperationType.activate,
                deactivateService: OperationType.deactivate
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

            var loadFunction = OperationType.getPage;
            var fields = ["id", "name", "warehouseId", "refSequenceId", "created", "createdBy", "updated", "updatedBy", "active"];
            var fieldsType = ["Number", "Text", "MultiNumber", "MultiNumber", "DateTime", "Text", "DateTime", "Text", "Number"]
            var newTableIds = {
                idTable: "table_ot",
                model: "operationTypes",
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


            TableMultiple.initTableIds($scope, newTableIds);
            TableMultiple.sortDefault(newTableIds.idTable);
            TableMultiple.reloadPage(newTableIds.idTable);

            //Cbx product load more
            $scope.cbxWarehouseInit = {
                url: '/api/warehouses', // ** api load data
                OriginParams: '', // ** init params -- default: null
                valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0
            }

            $scope.DatetimeRange1 = {
                dateStart: null,
                dateEnd: null,
                Table: $scope.TABLES['table_ot'], // ** table filter
                Column: 4, // ** number column filter on table
                Scope: $scope
            }
            $scope.DatetimeRange2 = {
                dateStart: null,
                dateEnd: null,
                Table: $scope.TABLES['table_ot'], // ** table filter
                Column: 6, // ** number column filter on table
                Scope: $scope
            }

            $scope.CbxWarehouse = {
                ngModel: [], // ** value select -- array []
                Options: [], // ** list options cbx, default: []
                Table: $scope.TABLES['table_ot'], // ** table filter
                Column: 2, // ** number column filter on table
                Scope: $scope,
                ValueRelatedAfter: [],
                FieldRelatedAfter: 'id',
                ApiAfter: "api/sequences/search?query=",
                ValueFieldAfter: 'id',
                AttrGetFromAfter: 'warehouseId',
                Config: {
                    placeholder:"Warehouse...",
                    plugins: ['infinite_scroll'], //enable load more
                    maxItems: null,
                    valueField: $scope.cbxWarehouseInit.valueField,
                    labelField: $scope.cbxWarehouseInit.labelField,
                    searchField: $scope.cbxWarehouseInit.searchField,
                    create: false,
                    render: {
                        option: function (data, escape) {
                            return '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxWarehouseInit.labelField]) + '</span>' + '</div>';
                        },
                        item: function (data, escape) {
                            return '<div class="item"><a href="' + escape(data[$scope.cbxWarehouseInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxWarehouseInit.labelField]) + '</a></div>';
                        }
                    },
                    //use load event if use load more
                    load: function (query, callback) {
                        query = JSON.parse(query)
                        $scope.cbxWarehouseInit.page = query.page || 0;
                        if (!$scope.cbxWarehouseInit.totalCount || $scope.cbxWarehouseInit.totalCount > ( ($scope.cbxWarehouseInit.page - 1) * $scope.cbxWarehouseInit.perPage)) {
                            var api = apiData.genApi($scope.cbxWarehouseInit.url, $scope.cbxWarehouseInit.searchField, query.search, $scope.cbxWarehouseInit.perPage, null, $scope.cbxWarehouseInit.OriginParams, query.page);
                            $http.get(api).then(function (response) {
                                $scope.cbxWarehouseInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                callback(response.data);
                            });
                        } else {
                            callback();
                        }
                    }
                }
            }

            $scope.cbxSequenceInit = {
                url: '/api/sequences', // ** api load data
                OriginParams: null, // ** init params -- default: null
                valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0
            }

            $scope.CbxSequence = { // ** replace name cbx
                ngModel: [], // ** value select -- array []
                Options: [], // ** list options cbx, default: []
                Table: $scope.TABLES['table_ot'], // ** table filter
                Column: 3, // ** number column filter on table
                Scope: $scope,
                ValueRelatedBefore: $scope.CbxWarehouse.ngModel,
                FieldRelatedBefore: 'warehouseId',
                Config: {
                    placeholder:"Reference sequences...",
                    plugins: ['infinite_scroll'],//able load more
                    maxItems: null,
                    valueField: $scope.cbxSequenceInit.valueField,
                    labelField: $scope.cbxSequenceInit.labelField,
                    searchField: $scope.cbxSequenceInit.searchField,
                    create: false,
                    render: {
                        option: function (data, escape) {
                            return '<div class="option">' +
                                '<span class="title">' + escape(data[$scope.cbxSequenceInit.labelField]) + '</span>' +
                                '</div>';
                        },
                        item: function (data, escape) {
                            return '<div class="item"><a href="' + escape(data[$scope.cbxSequenceInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxSequenceInit.labelField]) + '</a></div>';
                        }
                    },
                    //use load event if use load more
                    load: function (query, callback) {
                        query = JSON.parse(query)
                        $scope.cbxSequenceInit.page = query.page || 0;
                        if (!$scope.cbxSequenceInit.totalCount || $scope.cbxSequenceInit.totalCount > ( ($scope.cbxSequenceInit.page - 1) * $scope.cbxSequenceInit.perPage)) {
                            var api = apiData.genApi($scope.cbxSequenceInit.url, $scope.cbxSequenceInit.searchField, query.search, $scope.cbxSequenceInit.perPage, null, $scope.cbxSequenceInit.OriginParams, query.page);
                            $http.get(api).then(function (response) {
                                $scope.cbxSequenceInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                callback(response.data);
                            });
                        } else {
                            callback();
                        }
                    }
                }
            }

            $scope.activate = function () {
                if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0) {
                    OperationType.activate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                        AlertService.success('success.msg.active')
                        TableMultiple.reloadPage(newTableIds.idTable);
                    }).catch(function (data) {
                        ErrorHandle.handleError(data);
                    })
                }

            }

            $scope.deactivate = function () {
                if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0) {
                    OperationType.deactivate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                        AlertService.success('success.msg.inactive')
                        TableMultiple.reloadPage(newTableIds.idTable);
                    }).catch(function (data) {
                        ErrorHandle.handleError(data);
                    })
                }
            }

            $scope.deleteList = function (table_id) {
                // console.log($scope.TABLES[table_id].param_check_list)
                UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                    OperationType.deleteRecord($scope.TABLES[table_id].param_check_list).then(function (data) {
                        if (data.length > 0) {
                            ErrorHandle.handleErrors(data);
                        } else {
                            AlertService.success('success.msg.delete')
                        }
                        if ($scope.TABLES[table_id].param_check_list.length != data.length) {
                            TableMultiple.reloadPage(newTableIds.idTable);
                        }

                    }).catch(function (data) {
                        ErrorHandle.handleError(data);
                    })


                }, {
                    labels: {
                        'Ok': $translate.instant("common-ui-element.button.Delete"),
                        'Cancel': $translate.instant("common-ui-element.button.Cancel")
                    }
                });
            }

            //handler hide/show columns
            $scope.checkColumnAll = false
            $scope.checkboxType = "container-checkbox"
            $scope.myColumns = ["Operation Type Name", "Warehouse", "Reference Sequence", "Created", "Created By", "Update", "Updated By", "Active"]
            $scope.myColumnsShow = []
            $scope.defaultColumn = [0,1,2,7]
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

            $scope.CbxActive = {
                Placeholder: 'Select status',
                Api: "api/operation-types",
                Table: $scope.TABLES['table_ot'],
                Column: 8,
                Scope: $scope,
                ngModel: {value: 1, title: "Active"}
            }

        }
    ]);

