

(function(){
    'use strict';
    angular.module('erpApp')
        .controller('CreateRouteController',CreateRouteController);
    CreateRouteController.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        'Route',
        'Warehouse',
        'Location',
        'Product',
        'Category',
        'Supplier',
        'OperationType',
        'AlertService',
        '$translate',
        'variables',
        'TableCommon',
        '$http',
        '$stateParams',
        '$window',
        'TranslateCommonUI',
        'ErrorHandle',
        'apiData'
    ];
    function CreateRouteController($rootScope,$scope,$state,Route,Warehouse,Location,Product,Category,Supplier,OperationType,AlertService,$translate, variables,TableCommon,$http,$stateParams,$window,TranslateCommonUI,ErrorHandle,apiData) {
        var vm = this;
        TranslateCommonUI.init($scope);
        $scope.RouteService = Route;
        $scope.WarehouseService = Warehouse;

        //init ng-model
        $scope.routeModel = {
            name: "",
            warehouseEnabled: false,
            pushRules: {},
            procurementRules: {},
            warehouses: []
        }
        
        //addPushRule click
        $scope.newPushRule = {
            name: "",
            sourceLocation: "",
            srcLocationId: 0,
            destLocation: "",
            destLocationId: 0,
            automaticMoveId: "",
            automaticMove: "",
            automatic: true,
            operationType: "",
            operationTypeId: 0
        };
        $scope.listPushRule = [];
        $scope.listOptionsAutomatic = [{id: 0, name: 'Manual Operation'}, {id: 1, name: 'Automatic No Step Added'}];

        //for validate form create push rules, procurement rules
        $('#form_createPushRule').parsley({
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
        $('#form_createProcurementRule').parsley({
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

        $scope.addPushRule = function (type) {
            if($scope.form_createPushRule.$valid){
                $scope.cbxSrcLocations.Options.forEach(function (value) {
                    if($scope.newPushRule.sourceLocation == value.id) {
                        $scope.newPushRule.sourceLocation = value;
                        $scope.newPushRule.srcLocationId = value.id;
                    }
                })
                $scope.cbxDestLocations.Options.forEach(function (value) {
                    if($scope.newPushRule.destLocation == value.id) {
                        $scope.newPushRule.destLocation = value;
                        $scope.newPushRule.destLocationId = value.id;
                    }
                })
                $scope.listOptionsAutomatic.forEach(function (value) {
                    if($scope.newPushRule.automaticMove == value.id) {
                        $scope.newPushRule.automaticMove = value;
                        $scope.newPushRule.automatic = (value.id == 1)? true : false;
                    }
                })
                $scope.cbxOps.Options.forEach(function (value) {
                    if($scope.newPushRule.operationType == value.id) {
                        $scope.newPushRule.operationType = value;
                        $scope.newPushRule.operationTypeId = value.id;
                    }
                })
                $scope.listPushRule.push(angular.copy($scope.newPushRule));
                console.log($scope.listPushRule);
                $scope.newPushRule = {
                    name: "",
                    sourceLocation: "",
                    srcLocationId: 0,
                    destLocation: "",
                    destLocationId: 0,
                    automaticMoveId: "",
                    automaticMove: "",
                    automatic: true,
                    operationType: "",
                    operationTypeId: 0
                };

                //close modal
                var modal = UIkit.modal("#modal_new_push_rule");
                if(modal.isActive() && type == 1){
                    modal.hide();
                }

                //reinitialize parsley
                $('#form_createPushRule').parsley().destroy()
                $('#form_createPushRule').parsley();
            }
        }
        $scope.removePushRule = function (index) {
            var rtn = [];
            $scope.listPushRule.forEach(function (value, index2) {
                if(index2 != index) rtn.push(value);
            })
            $scope.listPushRule = rtn;
        }

        //addProcurementRule
        $scope.newProcurementRule = {
            name: "",
            action: -1,
            procurementLocation: null,
            operationType: null,
            sourceLocation: null,
            moveSupplyMethod: null,
            moveSupplyMethodId: -1
        };
        $scope.listProcurementRule = [];
        $scope.listAction = [{id: 0, name: 'Move From Another Location', value: 'move'},
            {id: 1, name: 'Manufacture ', value: 'manufacturer'}/*, {id: 2, name: 'Buy', value: 'buy'}*/];
        $scope.listMoveSupplyMethod = [{id: 0, name: 'Take From Stock', value: 'make_to_stock'},
            {id: 1, name: 'Create Procurement', value: 'make_to_order'}];
        //add Procurement Rule to List
        $scope.addProcurementRule = function (type) {
            if($scope.form_createProcurementRule.$valid){
                $scope.cbxProcureLocations.Options.forEach(function (value) {
                    if($scope.newProcurementRule.procurementLocation == value.id) {
                        $scope.newProcurementRule.procurementLocation = value;
                        $scope.newProcurementRule.procurementLocationId = value.id;
                    }
                })
                $scope.cbxSrc2Locations.Options.forEach(function (value) {
                    if($scope.newProcurementRule.sourceLocation == value.id){
                        $scope.newProcurementRule.sourceLocation = value;
                        $scope.newProcurementRule.sourceLocationId = value.id;
                    }
                })
                $scope.listAction.forEach(function (value) {
                    if($scope.newProcurementRule.action == value.id) {
                        $scope.newProcurementRule.action = value;
                    }
                })
                $scope.cbxOps2.Options.forEach(function (value) {
                    if($scope.newProcurementRule.operationType == value.id) {
                        $scope.newProcurementRule.operationType = value;
                        $scope.newProcurementRule.operationTypeId = value.id;
                    }
                })
                $scope.listMoveSupplyMethod.forEach(function (value) {
                    if($scope.newProcurementRule.moveSupplyMethod == value.id){
                        $scope.newProcurementRule.moveSupplyMethod = value;
                        $scope.newProcurementRule.moveSupplyMethodId = value.id;
                    }
                })

                $scope.listProcurementRule.push(angular.copy($scope.newProcurementRule));
                $scope.newProcurementRule = {
                    name: "",
                    action: "",
                    procurementLocation: "",
                    operationType: "",
                    sourceLocation: "",
                    moveSupplyMethod: "",
                    moveSupplyMethodId: -1
                };

                //close modal
                var modal = UIkit.modal("#modal_new_procurement_rule");
                if(modal.isActive() && type == 1){
                    modal.hide();
                }

                //reinitialize parsley
                $('#form_createProcurementRule').parsley().destroy()
                $('#form_createProcurementRule').parsley();
            }
        }

        //remove ProcurementRule
        $scope.removeProcurementRule = function (index) {
            var rtn = [];
            $scope.listProcurementRule.forEach(function (value, index2) {
                if(index2 != index) rtn.push(value);
            })
            $scope.listProcurementRule = rtn;
        }

        //validate button save (show blue when validated)
        $scope.validateButton = function () {
            if($scope.form_createRoute.$valid){
                $("#createRoute").removeClass("hideElement");
                return true;
            } else {
                $("#createRoute").addClass("hideElement");
                return false;
            }
        }

        //EVENT CLICK SAVE NEW ROUTE
        $scope.maxLengthRule = "warehouse.messages.maxLengthRule";
        $scope.required_msg = $translate.instant('admin.messages.required');
        $scope.createRoute = function () {
            $('#form_createRoute').parsley();
            if($scope.form_createRoute.$valid){
                var warehouses = [];
                $scope.routeModel.warehouses.forEach(function (value) {
                    warehouses.push({id : value});
                });
                console.log($scope.listProcurementRule);
                $scope.listProcurementRule.forEach(function (value, index) {
                    $scope.listProcurementRule[index].action = value.action.value;
                    if(value.moveSupplyMethodId != -1){
                        $scope.listProcurementRule[index].moveSupplyMethod = $scope.listProcurementRule[index].moveSupplyMethod.value;
                    }else{
                        $scope.listProcurementRule[index].moveSupplyMethod = null;
                    }
                });
                var route = {
                    name: $scope.routeModel.name,
                    warehouseEnabled: ($scope.routeModel.warehouses.length > 0)? true:false,
                    warehouses: warehouses,
                    pushRules: $scope.listPushRule,
                    procurementRules: $scope.listProcurementRule
                };
                console.log(route);
                Route.create(route).then(function (data) {
                    $state.go('routes',{});
                }).catch(function (data) {
                    console.log("ERROR")
                    ErrorHandle.handleError(data);
                });
            }
        }

        /* FOR POP-UP PUSH RULE */
        //NEW SRCLOCATION BOX
        $scope.cbxSrcLocationsInit = {
            url: '/api/locations', // ** api load data
            OriginParams: 'active==true', // ** init params -- default: null
            queryRelate : null, // ** init query relate cbx -- default: null
            valueField: 'id', labelField: 'completeName', searchField: 'completeName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
            perPage: 10, totalCount: null, page: 0, resetScroll: false
        }
        $scope.cbxSrcLocations = { // ** replace name cbx
            //ngModel : [], // ** value select -- array []
            Options: [], // ** list options cbx, default: []
            Table : null, // ** table filter
            Column : null, // ** number column filter on table
            Scope : $scope,
                Config: {
                    plugins: ['infinite_scroll'],//enable load more
                    maxItems: 1,
                    valueField: $scope.cbxSrcLocationsInit.valueField,
                    labelField: $scope.cbxSrcLocationsInit.labelField,
                    searchField: $scope.cbxSrcLocationsInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' +
                                '<span class="title">' + escape(data[$scope.cbxSrcLocationsInit.labelField]) + '</span>' +
                                '</div>';
                        },
                        item: function(data, escape) {
                            //return '<div class="item"><a href="' + escape(data[$scope.cbxSrcLocationsInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxSrcLocationsInit.labelField]) + '</a></div>';
                            return '<div class="item">' + escape(data[$scope.cbxSrcLocationsInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        query = JSON.parse(query)
                        if($scope.cbxSrcLocationsInit.resetScroll){
                            query.page = 0;
                            callback($scope.cbxSrcLocationsInit.resetScroll);
                            $scope.cbxSrcLocationsInit.resetScroll = false;
                        }
                        $scope.cbxSrcLocationsInit.page = query.page || 0;
                        if(!$scope.cbxSrcLocationsInit.totalCount || $scope.cbxSrcLocationsInit.totalCount > ( ($scope.cbxSrcLocationsInit.page - 1) * $scope.cbxSrcLocationsInit.perPage) ){
                            var api = apiData.genApi($scope.cbxSrcLocationsInit.url, $scope.cbxSrcLocationsInit.searchField, query.search, $scope.cbxSrcLocationsInit.perPage, null, $scope.cbxSrcLocationsInit.OriginParams,query.page,$scope.cbxSrcLocationsInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.cbxSrcLocationsInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
            }
        }

        //NEW DESTLOCATION BOX
        $scope.cbxDestLocationsInit = {
            url: '/api/locations', // ** api load data
            OriginParams: 'active==true', // ** init params -- default: null
            queryRelate : null, // ** init query relate cbx -- default: null
            valueField: 'id', labelField: 'completeName', searchField: 'completeName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
            perPage: 10, totalCount: null, page: 0, resetScroll: false
        }
        $scope.cbxDestLocations = { // ** replace name cbx
            //ngModel : [], // ** value select -- array []
            Options: [], // ** list options cbx, default: []
            Table : null, // ** table filter
            Column : null, // ** number column filter on table
            Scope : $scope,
            Config: {
                plugins: ['infinite_scroll'],//enable load more
                maxItems: 1,
                valueField: $scope.cbxDestLocationsInit.valueField,
                labelField: $scope.cbxDestLocationsInit.labelField,
                searchField: $scope.cbxDestLocationsInit.searchField,
                create: false,
                render: {
                    option: function(data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(data[$scope.cbxDestLocationsInit.labelField]) + '</span>' +
                            '</div>';
                    },
                    item: function(data, escape) {
                        //return '<div class="item"><a href="' + escape(data[$scope.cbxDestLocationsInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxDestLocationsInit.labelField]) + '</a></div>';
                        return '<div class="item">' + escape(data[$scope.cbxDestLocationsInit.labelField]) + '</div>';
                    }
                },
                //use load event if use load more
                load: function(query, callback) {
                    query = JSON.parse(query)
                    if($scope.cbxDestLocationsInit.resetScroll){
                        query.page = 0;
                        callback($scope.cbxDestLocationsInit.resetScroll);
                        $scope.cbxDestLocationsInit.resetScroll = false;
                    }
                    $scope.cbxDestLocationsInit.page = query.page || 0;
                    if(!$scope.cbxDestLocationsInit.totalCount || $scope.cbxDestLocationsInit.totalCount > ( ($scope.cbxDestLocationsInit.page - 1) * $scope.cbxDestLocationsInit.perPage) ){
                        var api = apiData.genApi($scope.cbxDestLocationsInit.url, $scope.cbxDestLocationsInit.searchField, query.search, $scope.cbxDestLocationsInit.perPage, null, $scope.cbxDestLocationsInit.OriginParams,query.page,$scope.cbxDestLocationsInit.queryRelate);
                        $http.get(api).then(function (response) {
                            $scope.cbxDestLocationsInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                            callback(response.data);
                        });
                    }
                }
            }
        }

        //NEW OPERATIONTYPE BOX
        $scope.cbxOpsInit = {
            url: '/api/operation-types', // ** api load data
            OriginParams: 'active==true', // ** init params -- default: null
            queryRelate : null, // ** init query relate cbx -- default: null
            valueField: 'id', labelField: 'displayName', searchField: 'displayName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
            perPage: 10, totalCount: null, page: 0, resetScroll: false
        }
        $scope.cbxOps = { // ** replace name cbx
            //ngModel : [], // ** value select -- array []
            Options: [], // ** list options cbx, default: []
            Table : null, // ** table filter
            Column : null, // ** number column filter on table
            Scope : $scope,
            Config: {
                plugins: ['infinite_scroll'],//enable load more
                maxItems: 1,
                valueField: $scope.cbxOpsInit.valueField,
                labelField: $scope.cbxOpsInit.labelField,
                searchField: $scope.cbxOpsInit.searchField,
                create: false,
                render: {
                    option: function(data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(data[$scope.cbxOpsInit.labelField]) + '</span>' +
                            '</div>';
                    },
                    item: function(data, escape) {
                        //return '<div class="item"><a href="' + escape(data[$scope.cbxOpsInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxOpsInit.labelField]) + '</a></div>';
                        return '<div class="item">' + escape(data[$scope.cbxOpsInit.labelField]) + '</div>';
                    }
                },
                //use load event if use load more
                load: function(query, callback) {
                    query = JSON.parse(query)
                    if($scope.cbxOpsInit.resetScroll){
                        query.page = 0;
                        callback($scope.cbxOpsInit.resetScroll);
                        $scope.cbxOpsInit.resetScroll = false;
                    }
                    $scope.cbxOpsInit.page = query.page || 0;
                    if(!$scope.cbxOpsInit.totalCount || $scope.cbxOpsInit.totalCount > ( ($scope.cbxOpsInit.page - 1) * $scope.cbxOpsInit.perPage) ){
                        var api = apiData.genApi($scope.cbxOpsInit.url, $scope.cbxOpsInit.searchField, query.search, $scope.cbxOpsInit.perPage, null, $scope.cbxOpsInit.OriginParams,query.page,$scope.cbxOpsInit.queryRelate);
                        $http.get(api).then(function (response) {
                            $scope.cbxOpsInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                            callback(response.data);
                        });
                    }
                }
            }
        }

        //NEW WAREHOUSE BOX
        $scope.cbxWarehousesInit = {
            url: '/api/warehouses', // ** api load data
            OriginParams: 'active==true', // ** init params -- default: null
            queryRelate : null, // ** init query relate cbx -- default: null
            valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
            perPage: 10, totalCount: null, page: 0, resetScroll: false
        }
        $scope.cbxWarehouses = { // ** replace name cbx
            //ngModel : [], // ** value select -- array []
            Options: [], // ** list options cbx, default: []
            Table : null, // ** table filter
            Column : null, // ** number column filter on table
            Scope : $scope,
            Config: {
                plugins: ['infinite_scroll'],//enable load more
                maxItems: null,
                valueField: $scope.cbxWarehousesInit.valueField,
                labelField: $scope.cbxWarehousesInit.labelField,
                searchField: $scope.cbxWarehousesInit.searchField,
                create: false,
                render: {
                    option: function(data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(data[$scope.cbxWarehousesInit.labelField]) + '</span>' +
                            '</div>';
                    },
                    item: function(data, escape) {
                        //return '<div class="item"><a href="' + escape(data[$scope.cbxWarehousesInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxWarehousesInit.labelField]) + '</a></div>';
                        return '<div class="item">' + escape(data[$scope.cbxWarehousesInit.labelField]) + '</div>';
                    }
                },
                //use load event if use load more
                load: function(query, callback) {
                    query = JSON.parse(query)
                    if($scope.cbxWarehousesInit.resetScroll){
                        query.page = 0;
                        callback($scope.cbxWarehousesInit.resetScroll);
                        $scope.cbxWarehousesInit.resetScroll = false;
                    }
                    $scope.cbxWarehousesInit.page = query.page || 0;
                    if(!$scope.cbxWarehousesInit.totalCount || $scope.cbxWarehousesInit.totalCount > ( ($scope.cbxWarehousesInit.page - 1) * $scope.cbxWarehousesInit.perPage) ){
                        var api = apiData.genApi($scope.cbxWarehousesInit.url, $scope.cbxWarehousesInit.searchField, query.search, $scope.cbxWarehousesInit.perPage, null, $scope.cbxWarehousesInit.OriginParams,query.page,$scope.cbxWarehousesInit.queryRelate);
                        $http.get(api).then(function (response) {
                            $scope.cbxWarehousesInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                            callback(response.data);
                        });
                    }
                }
            }
        }

        /* FOR POP-UP PROCUREMENT RULE */
        //PROCUREMENT LOCATION BOX
        $scope.cbxProcureLocationsInit = {
            url: '/api/locations', // ** api load data
            OriginParams: 'active==true', // ** init params -- default: null
            queryRelate : null, // ** init query relate cbx -- default: null
            valueField: 'id', labelField: 'completeName', searchField: 'completeName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
            perPage: 10, totalCount: null, page: 0, resetScroll: false
        }
        $scope.cbxProcureLocations = { // ** replace name cbx
            //ngModel : [], // ** value select -- array []
            Options: [], // ** list options cbx, default: []
            Table : null, // ** table filter
            Column : null, // ** number column filter on table
            Scope : $scope,
            Config: {
                plugins: ['infinite_scroll'],//enable load more
                maxItems: 1,
                valueField: $scope.cbxProcureLocationsInit.valueField,
                labelField: $scope.cbxProcureLocationsInit.labelField,
                searchField: $scope.cbxProcureLocationsInit.searchField,
                create: false,
                render: {
                    option: function(data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(data[$scope.cbxProcureLocationsInit.labelField]) + '</span>' +
                            '</div>';
                    },
                    item: function(data, escape) {
                        //return '<div class="item"><a href="' + escape(data[$scope.cbxProcureLocationsInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxProcureLocationsInit.labelField]) + '</a></div>';
                        return '<div class="item">' + escape(data[$scope.cbxProcureLocationsInit.labelField]) + '</div>';
                    }
                },
                //use load event if use load more
                load: function(query, callback) {
                    query = JSON.parse(query)
                    if($scope.cbxProcureLocationsInit.resetScroll){
                        query.page = 0;
                        callback($scope.cbxProcureLocationsInit.resetScroll);
                        $scope.cbxProcureLocationsInit.resetScroll = false;
                    }
                    $scope.cbxProcureLocationsInit.page = query.page || 0;
                    if(!$scope.cbxProcureLocationsInit.totalCount || $scope.cbxProcureLocationsInit.totalCount > ( ($scope.cbxProcureLocationsInit.page - 1) * $scope.cbxProcureLocationsInit.perPage) ){
                        var api = apiData.genApi($scope.cbxProcureLocationsInit.url, $scope.cbxProcureLocationsInit.searchField, query.search, $scope.cbxProcureLocationsInit.perPage, null, $scope.cbxProcureLocationsInit.OriginParams,query.page,$scope.cbxProcureLocationsInit.queryRelate);
                        $http.get(api).then(function (response) {
                            $scope.cbxProcureLocationsInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                            callback(response.data);
                        });
                    }
                }
            }
        }

        //SOURCE LOCATION FOR PROCUREMENT
        $scope.cbxSrc2LocationsInit = {
            url: '/api/locations', // ** api load data
            OriginParams: 'active==true', // ** init params -- default: null
            queryRelate : null, // ** init query relate cbx -- default: null
            valueField: 'id', labelField: 'completeName', searchField: 'completeName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
            perPage: 10, totalCount: null, page: 0, resetScroll: false
        }
        $scope.cbxSrc2Locations = { // ** replace name cbx
            //ngModel : [], // ** value select -- array []
            Options: [], // ** list options cbx, default: []
            Table : null, // ** table filter
            Column : null, // ** number column filter on table
            Scope : $scope,
            Config: {
                plugins: ['infinite_scroll'],//enable load more
                maxItems: 1,
                valueField: $scope.cbxSrc2LocationsInit.valueField,
                labelField: $scope.cbxSrc2LocationsInit.labelField,
                searchField: $scope.cbxSrc2LocationsInit.searchField,
                create: false,
                render: {
                    option: function(data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(data[$scope.cbxSrc2LocationsInit.labelField]) + '</span>' +
                            '</div>';
                    },
                    item: function(data, escape) {
                        //return '<div class="item"><a href="' + escape(data[$scope.cbxSrc2LocationsInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxSrc2LocationsInit.labelField]) + '</a></div>';
                        return '<div class="item">' + escape(data[$scope.cbxSrc2LocationsInit.labelField]) + '</div>';
                    }
                },
                //use load event if use load more
                load: function(query, callback) {
                    query = JSON.parse(query)
                    if($scope.cbxSrc2LocationsInit.resetScroll){
                        query.page = 0;
                        callback($scope.cbxSrc2LocationsInit.resetScroll);
                        $scope.cbxSrc2LocationsInit.resetScroll = false;
                    }
                    $scope.cbxSrc2LocationsInit.page = query.page || 0;
                    if(!$scope.cbxSrc2LocationsInit.totalCount || $scope.cbxSrc2LocationsInit.totalCount > ( ($scope.cbxSrc2LocationsInit.page - 1) * $scope.cbxSrc2LocationsInit.perPage) ){
                        var api = apiData.genApi($scope.cbxSrc2LocationsInit.url, $scope.cbxSrc2LocationsInit.searchField, query.search, $scope.cbxSrc2LocationsInit.perPage, null, $scope.cbxSrc2LocationsInit.OriginParams,query.page,$scope.cbxSrc2LocationsInit.queryRelate);
                        $http.get(api).then(function (response) {
                            $scope.cbxSrc2LocationsInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                            callback(response.data);
                        });
                    }
                }
            }
        }

        $scope.cbxOps2Init = {
            url: '/api/operation-types', // ** api load data
            OriginParams: 'active==true', // ** init params -- default: null
            queryRelate : null, // ** init query relate cbx -- default: null
            valueField: 'id', labelField: 'displayName', searchField: 'displayName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
            perPage: 10, totalCount: null, page: 0, resetScroll: false
        }
        $scope.cbxOps2 = { // ** replace name cbx
            //ngModel : [], // ** value select -- array []
            Options: [], // ** list options cbx, default: []
            Table : null, // ** table filter
            Column : null, // ** number column filter on table
            Scope : $scope,
            Config: {
                plugins: ['infinite_scroll'],//enable load more
                maxItems: 1,
                valueField: $scope.cbxOps2Init.valueField,
                labelField: $scope.cbxOps2Init.labelField,
                searchField: $scope.cbxOps2Init.searchField,
                create: false,
                render: {
                    option: function(data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(data[$scope.cbxOps2Init.labelField]) + '</span>' +
                            '</div>';
                    },
                    item: function(data, escape) {
                        //return '<div class="item"><a href="' + escape(data[$scope.cbxOps2Init.valueField]) + '" target="_blank">' + escape(data[$scope.cbxOps2Init.labelField]) + '</a></div>';
                        return '<div class="item">' + escape(data[$scope.cbxOps2Init.labelField]) + '</div>';
                    }
                },
                //use load event if use load more
                load: function(query, callback) {
                    query = JSON.parse(query)
                    if($scope.cbxOps2Init.resetScroll){
                        query.page = 0;
                        callback($scope.cbxOps2Init.resetScroll);
                        $scope.cbxOps2Init.resetScroll = false;
                    }
                    $scope.cbxOps2Init.page = query.page || 0;
                    if(!$scope.cbxOps2Init.totalCount || $scope.cbxOps2Init.totalCount > ( ($scope.cbxOps2Init.page - 1) * $scope.cbxOps2Init.perPage) ){
                        var api = apiData.genApi($scope.cbxOps2Init.url, $scope.cbxOps2Init.searchField, query.search, $scope.cbxOps2Init.perPage, null, $scope.cbxOps2Init.OriginParams,query.page,$scope.cbxOps2Init.queryRelate);
                        $http.get(api).then(function (response) {
                            $scope.cbxOps2Init.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                            callback(response.data);
                        });
                    }
                }
            }
        }

        /*********/
        $scope.enabledWarehouse = function () {
            if(!$scope.routeModel.warehouseEnabled){
                $scope.routeModel.warehouses = [];
                $scope.cbxWarehouses.ngModel = [];
            }
        }
    }
})();