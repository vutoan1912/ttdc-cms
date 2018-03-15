angular
    .module('erpApp')
    .controller('TransfersController', [
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
        'Transfer',
        'apiData',
        '$http',
        function ($scope, $rootScope, $timeout, $compile, $stateParams, $interval, TableMultiple, $translate, $window, AlertService, $state, $filter, ErrorHandle, Transfer, apiData, $http) {
            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, options) {
                if (toState.name == "transfers" && (fromState.name == "transfers-detail" || fromState.name == "transfers-create" || fromState.name == "transfers-edit")) {
                    $state.go('transfers', {}, {reload: true});
                }
            });

            // list view
            angular.element($window).bind('resize', function(){
                $scope.fullsize = {
                    "height":$( window ).height() - 200
                }
            });

            $scope.fullsize = {
                "height":$( window ).height() - 200
            }
            var loadFunction = Transfer.getOrigins;
            var getChildFunction = Transfer.getPage;
            var fields = ["originTransferNumber", "transferNumber", "destLocationId", "partnerId", "sourceDocument", "backorderOfId", "scheduledDate", "assigneeId", "state", "created", "createdBy", "updated", "updatedBy", "active"];
            var fieldsType = ["Text", "Text", "MultiNumber", "MultiNumber", "Text", "Text", "DateTime", "MultiNumber", "Text", "DateTime", "Text", "DateTime", "Text", "Number"]
            var newTableIds = {
                idTable: "table_tf",
                model: "origins",
                parent_column: "originTransferNumber",
                child_column: "transferNumber",
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
                selectize_pageNum_options: ["10", "5", "25", "50"],
                selectize_pageNum_config: {
                    plugins: {
                        'tooltip': ''
                    },
                    create: false,
                    maxItems: 1
                },
                loadFunction: loadFunction,
                getChildFunction: getChildFunction,
                param_fields: fields,
                param_fields_type: fieldsType,
                handleAfterReload: null,
                handleAfterReloadParams: null,
                deleteCallback: null,
                customParams: "",
                pager_id: "table_ot_pager",
                selectize_page_id: "rd_selectize_page",
                selectize_pageNum_id: "rd_selectize_pageNum",
                isTreeTable: true,
                noPagination:true
            }


            TableMultiple.initTableIds($scope, newTableIds);
            TableMultiple.reloadPage(newTableIds.idTable);

            $scope.stateConfig = {
                create: false,
                maxItems: 1,
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
            };

            $scope.DatetimeRange1 = {
                dateStart: null,
                dateEnd: null,
                Table: $scope.TABLES['table_tf'], // ** table filter
                Column: 9, // ** number column filter on table
                Scope: $scope
            }
            $scope.DatetimeRange2 = {
                dateStart: null,
                dateEnd: null,
                Table: $scope.TABLES['table_tf'], // ** table filter
                Column: 11, // ** number column filter on table
                Scope: $scope
            }

            $scope.stateOptions = [
                {value:'draft',title:'draft'},
                {value:'waiting_other',title:'waiting_other'},
                {value:'waiting',title:'waiting'},
                {value:'ready',title:'ready'},
                {value:'done',title:'done'},
                {value:'cancelled',title:'cancelled'}
            ]

            $scope.CbxState = {
                Placeholder: 'Status...',
                Api: "api/transfers",
                Table: $scope.TABLES['table_tf'],
                Column: 8,
                Scope: $scope,
                ngModel: ''
            }

            $scope.CbxCreatedBy = {
                url: '/api/users/search?query=',
                key: 'email',
                attr: 'email',
                prefix: '#/users/',
                suffix: '/detail'
            }

            $scope.CbxOrigin = {
                url: '/api/transfers/search?query=',
                key: 'originTransferNumber',
                attr: 'originTransferNumber',
                prefix: '#/transfers/',
                suffix: '/details'
            }

            $scope.CbxLocationInit = {
                url: '/api/locations', // ** api load data
                OriginParams: null, // ** init params -- default: null
                valueField: 'id', labelField: 'completeName', searchField: 'completeName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0
            }

            $scope.CbxLocation = { // ** replace name cbx
                ngModel: [], // ** value select -- array []
                Options: [], // ** list options cbx, default: []
                Table: $scope.TABLES['table_tf'], // ** table filter
                Column: 2, // ** number column filter on table
                Scope: $scope,
                ValueRelatedBefore: '',
                FieldRelatedBefore: '',
                Config: {
                    placeholder:"Desc location...",
                    plugins: ['infinite_scroll'],//able load more
                    maxItems: null,
                    valueField: $scope.CbxLocationInit.valueField,
                    labelField: $scope.CbxLocationInit.labelField,
                    searchField: $scope.CbxLocationInit.searchField,
                    create: false,
                    render: {
                        option: function (data, escape) {
                            return '<div class="option">' +
                                '<span class="title">' + escape(data[$scope.CbxLocationInit.labelField]) + '</span>' +
                                '</div>';
                        },
                        item: function (data, escape) {
                            return '<div class="item"><a href="' + escape(data[$scope.CbxLocationInit.valueField]) + '" target="_blank">' + escape(data[$scope.CbxLocationInit.labelField]) + '</a></div>';
                        }
                    },
                    //use load event if use load more
                    load: function (query, callback) {
                        query = JSON.parse(query)
                        $scope.CbxLocationInit.page = query.page || 0;
                        if (!$scope.CbxLocationInit.totalCount || $scope.CbxLocationInit.totalCount > (($scope.CbxLocationInit.page - 1) * $scope.CbxLocationInit.perPage)) {
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

            $scope.CbxCompaniesInit = {
                url: '/api/companies', // ** api load data
                OriginParams: null, // ** init params -- default: null
                valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0
            }

            $scope.CbxCompanies = { // ** replace name cbx
                ngModel: [], // ** value select -- array []
                Options: [], // ** list options cbx, default: []
                Table: $scope.TABLES['table_tf'], // ** table filter
                Column: 3, // ** number column filter on table
                Scope: $scope,
                ValueRelatedBefore: '',
                FieldRelatedBefore: '',
                Config: {
                    placeholder:"Partner...",
                    plugins: ['infinite_scroll'],//able load more
                    maxItems: null,
                    valueField: $scope.CbxCompaniesInit.valueField,
                    labelField: $scope.CbxCompaniesInit.labelField,
                    searchField: $scope.CbxCompaniesInit.searchField,
                    create: false,
                    render: {
                        option: function (data, escape) {
                            return '<div class="option">' +
                                '<span class="title">' + escape(data[$scope.CbxCompaniesInit.labelField]) + '</span>' +
                                '</div>';
                        },
                        item: function (data, escape) {
                            return '<div class="item"><a href="' + escape(data[$scope.CbxCompaniesInit.valueField]) + '" target="_blank">' + escape(data[$scope.CbxCompaniesInit.labelField]) + '</a></div>';
                        }
                    },
                    //use load event if use load more
                    load: function (query, callback) {
                        query = JSON.parse(query)
                        $scope.CbxCompaniesInit.page = query.page || 0;
                        if (!$scope.CbxCompaniesInit.totalCount || $scope.CbxCompaniesInit.totalCount > (($scope.CbxCompaniesInit.page - 1) * $scope.CbxCompaniesInit.perPage)) {
                            var api = apiData.genApi($scope.CbxCompaniesInit.url, $scope.CbxCompaniesInit.searchField, query.search, $scope.CbxCompaniesInit.perPage, null, $scope.CbxCompaniesInit.OriginParams, query.page);
                            $http.get(api).then(function (response) {
                                $scope.CbxCompaniesInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                callback(response.data);
                            });
                        } else {
                            callback();
                        }
                    }
                }
            }

            $scope.CbxUserInit = {
                url: '/api/users', // ** api load data
                OriginParams: null, // ** init params -- default: null
                valueField: 'id', labelField: 'email', searchField: 'email', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0
            }

            $scope.CbxUser = { // ** replace name cbx
                ngModel: [], // ** value select -- array []
                Options: [], // ** list options cbx, default: []
                Table: $scope.TABLES['table_tf'], // ** table filter
                Column: 7, // ** number column filter on table
                Scope: $scope,
                ValueRelatedBefore: '',
                FieldRelatedBefore: '',
                Config: {
                    placeholder:"Assignee...",
                    plugins: ['infinite_scroll'],//able load more
                    maxItems: null,
                    valueField: $scope.CbxUserInit.valueField,
                    labelField: $scope.CbxUserInit.labelField,
                    searchField: $scope.CbxUserInit.searchField,
                    create: false,
                    render: {
                        option: function (data, escape) {
                            return '<div class="option">' +
                                '<span class="title">' + escape(data[$scope.CbxUserInit.labelField]) + '</span>' +
                                '</div>';
                        },
                        item: function (data, escape) {
                            return '<div class="item"><a href="' + escape(data[$scope.CbxUserInit.valueField]) + '" target="_blank">' + escape(data[$scope.CbxUserInit.labelField]) + '</a></div>';
                        }
                    },
                    //use load event if use load more
                    load: function (query, callback) {
                        query = JSON.parse(query)
                        $scope.CbxUserInit.page = query.page || 0;
                        if (!$scope.CbxUserInit.totalCount || $scope.CbxUserInit.totalCount > (($scope.CbxUserInit.page - 1) * $scope.CbxUserInit.perPage)) {
                            var api = apiData.genApi($scope.CbxUserInit.url, $scope.CbxUserInit.searchField, query.search, $scope.CbxUserInit.perPage, null, $scope.CbxUserInit.OriginParams, query.page);
                            $http.get(api).then(function (response) {
                                $scope.CbxUserInit.totalCount = parseInt(response.headers()["x-total-count"], 10);
                                callback(response.data);
                            });
                        } else {
                            callback();
                        }
                    }
                }
            }


            $scope.urlLocationName = "/api/locations/"
            $scope.attrLocationName = "completeName"
            $scope.urlCompanyName = '/api/companies/';
            $scope.urlTransferName = '/api/transfers/';
            $scope.urlUsersName = '/api/users/'
            $scope.attrTransferNumber = 'transferNumber'
            $scope.attrName = 'name';
            $scope.attrEmail = 'email';
            $scope.deleteList = function (table_id) {
                // console.log($scope.TABLES[table_id].param_check_list)
                UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                    Transfer.deleteRecord($scope.TABLES[table_id].param_check_list).then(function (data) {
                        if (data.length > 0) {
                            var message = {
                                "data":data[0]
                            }
                            ErrorHandle.handleError(message);
                            // var erMsg = $translate.instant('error.common.deleteError')
                            // erMsg += data
                            // AlertService.error(erMsg)
                        } else {
                            AlertService.success('success.msg.delete')
                        }
                        if ($scope.TABLES[table_id].param_check_list.length != data.length) {
                            TableMultiple.reloadPage(newTableIds.idTable);
                        }

                    }).catch(function (data) {
                        console.log(data)
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
            $scope.myColumns = ["Destination Location", "Partner", "Source Document", "Back Order Of", "Schedule Date", "Assignee", "Status", "Created", "Created By", "Update", "Updated By"]
            $scope.myColumnsShow = []
            $scope.defaultColumn = [ 2, 3, 5, 6]
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

            $scope.stateValue = {
                draft:$translate.instant('transfer.common.draft'),
                waiting_other:$translate.instant('transfer.common.waiting_other'),
                waiting:$translate.instant('transfer.common.waiting'),
                ready:$translate.instant('transfer.common.ready'),
                done:$translate.instant('transfer.common.done'),
                cancelled:$translate.instant('transfer.common.cancelled')

            }


            $scope.showState = function (state) {
                return  $scope.stateValue[state]
            }
        }


    ]);

