angular
    .module('erpApp')
    .controller('PackagesController', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$compile',
        'Package',
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
        function ($scope, $rootScope, $timeout, $compile, Package, $stateParams, $interval, TableMultiple, $translate, $window, AlertService, $state, $filter, Sequence, Location, Warehouse, ErrorHandle, apiData, $http) {
            $scope.chooseValue = {value: 1, title: "Active"}

            $scope.msg = {
                from: "inventory.messages.from",
                to: "inventory.messages.to",
                dateValid: "inventory.messages.dateValid",
                selectDate: "inventory.messages.selectDate",
                required: "inventory.messages.required"
            }

            $scope.CbxCreatedBy = {
                url: '/api/users/search?query=',
                key: 'email',
                attr: 'email',
                prefix: '#/users/',
                suffix: '/detail'
            }
            $scope.CbxActivate = {
                activateService: Package.activate,
                deactivateService: Package.deactivate
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

            var loadFunction = Package.getPage;
            var fields = ["id", "packageNumber","packageType","location","company", "created", "createdBy", "updated", "updatedBy", "active"];
            var fieldsType = ["Number", "Text","Text","Text","Text","DateTime", "Text", "DateTime", "Text", "Number"]
            var newTableIds = {
                idTable: "table_package",
                model: "packages",
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
                pager_id: "table_package_pager",
                selectize_page_id: "rd_selectize_page",
                selectize_pageNum_id: "rd_selectize_pageNum"
            }


            TableMultiple.initTableIds($scope, newTableIds);
            TableMultiple.sortDefault(newTableIds.idTable);
            TableMultiple.reloadPage(newTableIds.idTable);

            $scope.DatetimeRange1 = {
                dateStart: null,
                dateEnd: null,
                Table: $scope.TABLES['table_package'], // ** table filter
                Column: 5, // ** number column filter on table
                Scope: $scope
            }
            $scope.DatetimeRange2 = {
                dateStart: null,
                dateEnd: null,
                Table: $scope.TABLES['table_package'], // ** table filter
                Column: 7, // ** number column filter on table
                Scope: $scope
            }

            $scope.activate = function () {
                if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0) {
                    Package.activate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                        AlertService.success('success.msg.active')
                        TableMultiple.reloadPage(newTableIds.idTable);
                    }).catch(function (data) {
                        ErrorHandle.handleError(data);
                    })
                }

            }

            $scope.deactivate = function () {
                if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0) {
                    Package.deactivate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
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
                    Package.deleteRecord($scope.TABLES[table_id].param_check_list).then(function (data) {
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
            $scope.myColumns = ["Display Name", "Package Type", "Location","Companies","Created", "Created By", "Update", "Updated By", "Active"]
            $scope.myColumnsShow = []
            $scope.defaultColumn = [0,1,2,3,8]
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
                Api: "api/packages",
                Table: $scope.TABLES['table_package'],
                Column: 9,
                Scope: $scope,
                ngModel: {value: 1, title: "Active"}
            }

        }
    ]);

