angular
    .module('erpApp')
    .controller('SequenceHomeController', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$compile',
        'Sequence',
        '$stateParams',
        '$interval',
        'TableMultiple',
        '$translate',
        '$window',
        'AlertService',
        '$state',
        '$filter',
        'ErrorHandle',
        function ($scope, $rootScope, $timeout, $compile, Sequence, $stateParams, $interval, TableMultiple, $translate, $window, AlertService, $state, $filter, ErrorHandle) {
            $scope.button = {
                Create: "masterdata.button.Create",
                Edit: "masterdata.button.Edit",
                Back: "masterdata.button.Back",
                Delete: "masterdata.button.Delete",
                Cancel: "masterdata.button.Cancel",
                Save: "masterdata.button.Save",
                addItem: "masterdata.button.addItem",
                add: "masterdata.button.add"
            }

            $scope.common = {
                Inventory: "inventory.common.Inventory",
                Preference: "inventory.common.Preference",
                Sequences: "inventory.common.Sequences",
                Sequence: "inventory.common.Sequence",

            }

            $scope.msg = {
                from: "inventory.messages.from",
                to: "inventory.messages.to",
                dateValid: "inventory.messages.dateValid",
                selectDate: "inventory.messages.selectDate",
                required: "inventory.messages.required",
                insideValid: "inventory.messages.insideValid",
                containValid: "inventory.messages.containValid"
            }

            $scope.wrongPatternRule = "warehouse.messages.wrongPatternRule"

            $scope.CbxCreatedBy = {
                url: '/api/users/search?query=',
                key: 'email',
                attr: 'email',
                prefix: '#/users/',
                suffix: '/detail'
            }

            $scope.CbxActivate = {
                activateService: Sequence.activate,
                deactivateService: Sequence.deactivate
            }

            angular.element($window).bind('resize', function(){
                $scope.fullsize = {
                    "height":$( window ).height() - 300
                }
            });

            $scope.fullsize = {
                "height":$( window ).height() - 300
            }
            var fields = ["id", "name", "prefix", "length", "nextNumber", "step", "implementation", "created", "createdBy", "updated", "updatedBy", "active"];
            var fieldsType = ["Number", "Text", "Text", "Number", "Number", "Number", "Number", "DateTime", "Text", "DateTime", "Text", "Number"]
            var loadFunction = Sequence.getPage;

            var newTableIds = {
                idTable: "table_seq",
                model: "sequences",
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
                pager_id: "table_ot_pager",
                selectize_page_id: "rd_selectize_page",
                selectize_pageNum_id: "rd_selectize_pageNum"
            }


            TableMultiple.initTableIds($scope, newTableIds);
            TableMultiple.sortDefault(newTableIds.idTable);
            TableMultiple.reloadPage(newTableIds.idTable);

            $scope.CbxActive = {
                Placeholder: 'Select status',
                Api: "api/sequences",
                Table: $scope.TABLES['table_seq'],
                Column: 11,
                Scope: $scope,
                ngModel: {value: 1, title: "Active"}
            }

            $scope.DatetimeRange1 = {
                dateStart: null,
                dateEnd: null,
                Table: $scope.TABLES['table_seq'], // ** table filter
                Column: 7, // ** number column filter on table
                Scope: $scope
            }
            $scope.DatetimeRange2 = {
                dateStart: null,
                dateEnd: null,
                Table: $scope.TABLES['table_seq'], // ** table filter
                Column: 9, // ** number column filter on table
                Scope: $scope
            }

            //handler hide/show columns
            $scope.checkColumnAll = false
            $scope.checkboxType = "container-checkbox"
            $scope.myColumns = ["Name", "Prefix", "Sequence Size", "Next Number", "Step", "Implementation", "Created", "Created By", "Updated", "Updated By", "Active"]
            $scope.myColumnsShow = []
            $scope.defaultColumn = [0,1,2,3,4,5,10]
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

            $scope.getImplementation = function (im) {
                if (im == 0) {
                    return "Standard"
                } else if (im == 1) {
                    return "No Gap"
                }
            }


            $scope.activate = function () {
                if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0) {
                    Sequence.activate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                        AlertService.success('success.msg.active')
                        TableMultiple.reloadPage(newTableIds.idTable);
                    }).catch(function (data) {
                        ErrorHandle.handleError(data);
                    })
                }

            }

            $scope.deactivate = function () {
                if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0) {
                    Sequence.deactivate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                        AlertService.success('success.msg.inactive')
                        TableMultiple.reloadPage(newTableIds.idTable);
                    }).catch(function (data) {
                        ErrorHandle.handleError(data);
                    })
                }
            }

            $scope.deleteList = function () {
                // console.log($scope.TABLES[table_id].param_check_list)
                UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                    Sequence.deleteRecord($scope.TABLES[newTableIds.idTable].param_check_list).then(function (data) {
                        if (data.length > 0) {
                            ErrorHandle.handleErrors(data);
                        } else {
                            AlertService.success('success.msg.delete')
                        }
                        if ($scope.TABLES[newTableIds.idTable].param_check_list.length != data.length) {
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
        }
    ]);

