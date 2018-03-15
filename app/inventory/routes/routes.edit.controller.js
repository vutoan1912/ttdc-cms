

(function(){
    'use strict';
    angular.module('erpApp')
        .controller('EditRouteController',EditRouteController);

    EditRouteController.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        'Route',
        'PushRule',
        'ProcurementRule',
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
    function EditRouteController($rootScope,$scope,$state,Route,PushRule,ProcurementRule,Warehouse,Location,Product,Category,Supplier,OperationType,AlertService,$translate, variables,TableCommon,$http,$stateParams,$window,TranslateCommonUI,ErrorHandle,apiData) {
        var vm = this;
        TranslateCommonUI.init($scope);
        $scope.RouteService = Route;
        $scope.WarehouseService = Warehouse;
        $scope.PushRuleService = PushRule;
        $scope.ProcurementRuleService = ProcurementRule;

        //init ng-model
        $scope.routeModel = {};
        $scope.removedProcurmentIds = [];
        $scope.removedPushIds = [];
        $scope.updatedProcurementIds = [];
        $scope.updatedPushIds = [];

        //init function
        $scope.initFunction = function () {
            Route.getOne($stateParams.routeId).then(function (data) {
                $scope.routeModel = data;

                $scope.routeModel.pushRules.forEach(function (value) {
                    Location.getOne(value.srcLocationId).then(function (data) {
                        value.srcLocation = data;
                    })
                    Location.getOne(value.destLocationId).then(function (data) {
                        value.destLocation = data;
                    })
                    OperationType.getOne(value.operationTypeId).then(function (data) {
                        value.operationType = data;
                    })
                })
                $scope.routeModel.warehousesId = [];
                $scope.routeModel.warehouses.forEach(function (value) {
                    $scope.routeModel.warehousesId.push(value.id);
                })
                $scope.routeModel.procurementRules.forEach(function (value) {
                    Location.getOne(value.procurementLocationId).then(function (data) {
                        value.procurementLocation = data;
                    });
                    if(value.sourceLocationId){
                        Location.getOne(value.sourceLocationId).then(function (data) {
                            value.sourceLocation = data;
                        });
                    }
                    OperationType.getOne(value.operationTypeId).then(function (data) {
                        value.operationType = data;
                    })
                    if(value.action == $scope.listAction[0].value){
                        value.action = $scope.listAction[0];
                        value.actionId = 0;
                    }else if(value.action == $scope.listAction[1].value){
                        value.action = $scope.listAction[1];
                        value.actionId = 1;
                    }else {
                        value.action = $scope.listAction[2];
                        value.actionId = 2;
                    }
                    if(value.moveSupplyMethod){
                        if(value.moveSupplyMethod == $scope.listMoveSupplyMethod[0].value){
                            value.moveSupplyMethod = $scope.listMoveSupplyMethod[0];
                            value.moveSupplyMethodId = $scope.listMoveSupplyMethod[0].id;
                        }else{
                            value.moveSupplyMethod = $scope.listMoveSupplyMethod[1];
                            value.moveSupplyMethodId = $scope.listMoveSupplyMethod[1].id;
                        }
                    }
                })
                console.log($scope.routeModel);
            })

            Warehouse.getAll().then(function (data) {
                $scope.selectizeOptions.warehouses2 = data;
            })

            Location.getAll().then(function (data) {
                $scope.selectizeOptions.warehouses = data;
            })
        }

        //for select Warehouses
        $scope.selectizeOptions = {
            warehouses: [],
            warehouses2: []
        };
        $scope.selectizeWarehousesConfig = {
            plugins: {
                'remove_button': {
                    label     : ''
                }
            },
            maxItems: 5,
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            create: false,
            render: {
                option: function(roles_data, escape) {
                    return  '<div class="option">' +
                        '<span class="title">' + escape(roles_data.name) + '</span>' +
                        '</div>';
                },
                item: function(roles_data, escape) {
                    return '<div class="item">'  + escape(roles_data.name) + '</div>';
                }
            }
        };

        //select
        $scope.selectedWarehouse = function () {
            if(!$scope.routeModel.warehouseEnabled) {
                $scope.routeModel.warehousesId = []
            }
        }

        //addPushRule click
        $scope.newPushRule = {
            name: "",
            srcLocation: "",
            srcLocationId: 0,
            destLocation: "",
            destLocationId: 0,
            automaticMove: "",
            automatic: true,
            operationType: "",
            operationTypeId: 0
        };
        $scope.listOptionsAutomatic = [{id: 0, name: 'Manual Operation'}, {id: 1, name: 'Automatic No Step Added'}];
        
        //init config drop down
        $scope.selectize_config = {
            persist: true,
            maxItems: 1,
            valueField: 'id',
            labelField: 'name',
            searchField: ['name'],
            placeholder: "",
            maxOptions: 5,
            disabledField:'name'

        };
        //init operation type drop down
        $scope.selectize_ot_options = [];
        OperationType.getAll().then(function (data) {
            $scope.selectize_ot_options = data;
        })

        //for validate form create,update push rules, procurement rules
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
        $('#form_updatePushRule').parsley({
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
        $('#form_updateProcurementRule').parsley({
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
            $('#form_createPushRule').parsley();
            if($scope.form_createPushRule.$valid){
                $scope.cbxSrcLocations.Options.forEach(function (value) {
                    if($scope.newPushRule.srcLocation == value.id) {
                        $scope.newPushRule.srcLocation = value;
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
                $scope.routeModel.pushRules.push(angular.copy($scope.newPushRule));
                console.log($scope.routeModel.pushRules);
                $scope.newPushRule = {
                    name: "",
                    srcLocation: "",
                    srcLocationId: 0,
                    destLocation: "",
                    destLocationId: 0,
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
                $('#form_createPushRule').parsley().destroy();
                $('#form_createPushRule').parsley();
            }
        }
        $scope.removePushRuleInTable = function (index) {
            if($scope.routeModel.pushRules[index].hasOwnProperty("id")){
                $scope.removedPushIds.push($scope.routeModel.pushRules[index]['id']);
            }
            var rtn = [];
            $scope.routeModel.pushRules.forEach(function (value, index2) {
                if(index2 != index) rtn.push(value);
            })
            $scope.routeModel.pushRules = rtn;
        }

        $scope.indexUpdatedPushRule = -1;
        $scope.editPushRule = {
            name: "",
            srcLocation: "",
            srcLocationId: 0,
            destLocation: "",
            destLocationId: 0,
            automaticMove: "",
            automatic: true,
            operationType: "",
            operationTypeId: 0
        };
        $scope.editPushRuleInTable = function (index) {
            $scope.indexUpdatedPushRule = index;
            $scope.editPushRule = angular.copy($scope.routeModel.pushRules[index]);
            if($scope.editPushRule.automatic){
                $scope.editPushRule.automaticMove = 1;
            }else{
                $scope.editPushRule.automaticMove = 0;
            }

            //get Options for cbx
            Location.getOne($scope.editPushRule.srcLocationId).then(function (data) {
                $scope.cbxSrcLocations.Options = [];
                $scope.cbxSrcLocations.Options.push(data);
            })
            Location.getOne($scope.editPushRule.destLocationId).then(function (data) {
                $scope.cbxDestLocations.Options = [];
                $scope.cbxDestLocations.Options.push(data);
            })
            OperationType.getOne($scope.editPushRule.operationTypeId).then(function (data) {
                $scope.cbxOps.Options = [];
                $scope.cbxOps.Options.push(data);
            })
        }
        $scope.updatePushRule = function () {
            if($scope.form_updatePushRule.$valid){
                $scope.cbxSrcLocations.Options.forEach(function (value) {
                    if($scope.editPushRule.srcLocationId == value.id) {
                        $scope.editPushRule.srcLocation = value;
                    }
                })
                $scope.cbxDestLocations.Options.forEach(function (value) {
                    if($scope.editPushRule.destLocationId == value.id) {
                        $scope.editPushRule.destLocation = value;
                    }
                })
                $scope.listOptionsAutomatic.forEach(function (value) {
                    if($scope.editPushRule.automaticMove == value.id) {
                        $scope.editPushRule.automatic = (value.id == 1)? true : false;
                    }
                })
                $scope.cbxOps.Options.forEach(function (value) {
                    if($scope.editPushRule.operationTypeId == value.id) {
                        $scope.editPushRule.operationType = value;
                    }
                })
                $scope.routeModel.pushRules[$scope.indexUpdatedPushRule] = angular.copy($scope.editPushRule);

                //mark pushRule change by id
                console.log($scope.routeModel.pushRules[$scope.indexUpdatedPushRule]);
                if($scope.routeModel.pushRules[$scope.indexUpdatedPushRule].hasOwnProperty("id")){
                    $scope.updatedPushIds.push($scope.routeModel.pushRules[$scope.indexUpdatedPushRule]['id']);
                }
                console.log($scope.updatedPushIds);

                //close modal
                var modal = UIkit.modal("#modal_update_push_rule");
                if(modal.isActive()){
                    modal.hide();
                }

                //reinitialize parsley
                $('#form_updatePushRule').parsley().destroy()
                $('#form_updatePushRule').parsley();
            }
        }

        //addProcurementRule
        $scope.newProcurementRule = {
            name : "",
            action: {},
            actionId: -1,
            procurementLocation: {},
            procurementLocationId: 0,
            operationType: {},
            operationTypeId: 0,
            sourceLocation: {},
            sourceLocationId: null,
            moveSupplyMethod: {},
            moveSupplyMethodId: null
        };
        $scope.listAction = [{id: 0, name: 'Move From Another Location', value: 'move'},
            {id: 1, name: 'Manufacture ', value: 'manufacturer'}/*, {id: 2, name: 'Buy', value: 'buy'}*/];
        $scope.listMoveSupplyMethod = [{id: 0, name: 'Take From Stock', value: 'make_to_stock'},
            {id: 1, name: 'Create Procurement', value: 'make_to_order'}];
        $scope.addProcurementRule = function (type) {
            if($scope.form_createProcurementRule.$valid) {
                $scope.cbxProcureLocations.Options.forEach(function (value) {
                    if ($scope.newProcurementRule.procurementLocation == value.id) {
                        $scope.newProcurementRule.procurementLocation = value;
                        $scope.newProcurementRule.procurementLocationId = value.id;
                    }
                })
                $scope.cbxSrc2Locations.Options.forEach(function (value) {
                    if ($scope.newProcurementRule.sourceLocation == value.id) {
                        $scope.newProcurementRule.sourceLocation = value;
                        $scope.newProcurementRule.sourceLocationId = value.id;
                    }
                })
                $scope.listAction.forEach(function (value) {
                    if ($scope.newProcurementRule.action == value.id) {
                        $scope.newProcurementRule.action = value;
                        $scope.newProcurementRule.actionId = value.id;
                    }
                })
                $scope.cbxOps2.Options.forEach(function (value) {
                    if ($scope.newProcurementRule.operationType == value.id) {
                        $scope.newProcurementRule.operationType = value;
                        $scope.newProcurementRule.operationTypeId = value.id;
                    }
                })
                $scope.listMoveSupplyMethod.forEach(function (value) {
                    if(value.id == $scope.newProcurementRule.moveSupplyMethodId){
                        $scope.newProcurementRule.moveSupplyMethod = value;
                    }
                })
                $scope.routeModel.procurementRules.push(angular.copy($scope.newProcurementRule));
                console.log($scope.routeModel.procurementRules);
                $scope.newProcurementRule = {
                    name : "",
                    action: {},
                    actionId: 0,
                    procurementLocation: {},
                    procurementLocationId: 0,
                    operationType: {},
                    operationTypeId: 0,
                    sourceLocation: {},
                    sourceLocationId: "",
                    moveSupplyMethod: {},
                    moveSupplyMethodId: ""
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
        $scope.removeProcurementRuleInTable = function (index) {
            if($scope.routeModel.procurementRules[index].hasOwnProperty("id")){
                $scope.removedProcurmentIds.push($scope.routeModel.procurementRules[index]['id']);
            }
            var rtn = [];
            $scope.routeModel.procurementRules.forEach(function (value, index2) {
                if(index2 != index) rtn.push(value);
            })
            $scope.routeModel.procurementRules = rtn;
        }

        $scope.editProcurementRule = {
            name : "",
            action: {},
            actionId: 0,
            procurementLocation: {},
            procurementLocationId: 0,
            operationType: {},
            operationTypeId: 0,
            sourceLocation: {},
            sourceLocationId: "",
            moveSupplyMethod: {},
            moveSupplyMethodId: ""
        }
        $scope.indexUpdatedProcurementRule = -1;
        $scope.editProcurementRuleInTable = function (index) {
            $scope.indexUpdatedProcurementRule = index;
            $scope.editProcurementRule = angular.copy($scope.routeModel.procurementRules[index]);
            $scope.editProcurementRule.actionId = $scope.editProcurementRule.action.id;

            //get Options for cbx
            Location.getOne($scope.editProcurementRule.procurementLocationId).then(function (data) {
                $scope.cbxProcureLocations.Options = [];
                $scope.cbxProcureLocations.Options.push(data);
            })
            Location.getOne($scope.editProcurementRule.sourceLocationId).then(function (data) {
                $scope.cbxSrc2Locations.Options = [];
                $scope.cbxSrc2Locations.Options.push(data);
            })
            OperationType.getOne($scope.editProcurementRule.operationTypeId).then(function (data) {
                $scope.cbxOps2.Options = [];
                $scope.cbxOps2.Options.push(data);
            })
        }
        $scope.updateProcurementRule = function () {
            if($scope.form_updateProcurementRule.$valid){
                $scope.selectizeOptions.warehouses.forEach(function (value) {
                    if($scope.editProcurementRule.procurementLocationId == value.id) {
                        $scope.editPushRule.procurementLocation = value;
                    }
                    if($scope.editProcurementRule.sourceLocationId == value.id){
                        $scope.editProcurementRule.sourceLocation = value;
                    }
                })
                $scope.listAction.forEach(function (value) {
                    if($scope.editProcurementRule.actionId == value.id) {
                        $scope.editProcurementRule.action = value;
                    }
                })
                $scope.selectize_ot_options.forEach(function (value) {
                    if($scope.editProcurementRule.operationTypeId == value.id) {
                        $scope.editProcurementRule.operationType = value;
                    }
                })
                $scope.listMoveSupplyMethod.forEach(function (value) {
                    if(value.id == $scope.editProcurementRule.moveSupplyMethodId){
                        $scope.editProcurementRule.moveSupplyMethod = value;
                    }
                })
                $scope.routeModel.procurementRules[$scope.indexUpdatedProcurementRule] = angular.copy($scope.editProcurementRule);

                //mark pushRule change by id
                if($scope.routeModel.procurementRules[$scope.indexUpdatedProcurementRule].hasOwnProperty("id")){
                    $scope.updatedProcurementIds.push($scope.routeModel.procurementRules[$scope.indexUpdatedProcurementRule]['id']);
                }

                //close modal
                var modal = UIkit.modal("#modal_update_procurement_rule");
                if(modal.isActive()){
                    modal.hide();
                }

                //reinitialize parsley
                $('#form_updateProcurementRule').parsley().destroy()
                $('#form_updateProcurementRule').parsley();
            }
        }

        $scope.maxLengthRule = "warehouse.messages.maxLengthRule";
        $scope.required_msg = $translate.instant('admin.messages.required');
        //EVENT CLICK SAVE NEW ROUTE
        $scope.editRoute = function () {
            $('#form_editRoute').parsley();
            if($scope.form_editRoute.$valid){
                var warehouses = [];
                var procurementRules = [];
                var pushRules = [];
                $scope.routeModel.warehousesId.forEach(function (value) {
                    warehouses.push({id : value});
                });
                if(warehouses.length == 0){
                    $scope.routeModel.warehouseEnabled = false;
                }
                $scope.routeModel.warehouses = warehouses;
                console.log($scope.routeModel.procurementRules);
                $scope.routeModel.procurementRules.forEach(function (value, index) {
                    if(value.actionId == 0){
                        $scope.routeModel.procurementRules[index].action = $scope.listAction[0].value;
                    }else if(value.actionId == 1){
                        $scope.routeModel.procurementRules[index].action = $scope.listAction[1].value;
                    }else{
                        $scope.routeModel.procurementRules[index].action = $scope.listAction[2].value;
                    }

                    if(value.hasOwnProperty("moveSupplyMethod") && value.moveSupplyMethod.id == 0){
                        $scope.routeModel.procurementRules[index].moveSupplyMethod = $scope.listMoveSupplyMethod[0].value;
                    }else if(value.hasOwnProperty("moveSupplyMethod") && value.moveSupplyMethod.id == 1){
                        $scope.routeModel.procurementRules[index].moveSupplyMethod = $scope.listMoveSupplyMethod[1].value;
                    }else{
                        $scope.routeModel.procurementRules[index].moveSupplyMethod = null;
                    }

                    if(!$scope.routeModel.procurementRules[index].hasOwnProperty("id")){
                        procurementRules.push($scope.routeModel.procurementRules[index]);
                    }else if($scope.routeModel.procurementRules[index].hasOwnProperty("id") &&
                                $scope.updatedProcurementIds.indexOf($scope.routeModel.procurementRules[index]["id"]) >= 0){
                        procurementRules.push($scope.routeModel.procurementRules[index]);
                    }
                })

                $scope.routeModel.pushRules.forEach(function (value, index) {
                    if(!$scope.routeModel.pushRules[index].hasOwnProperty("id")){
                        pushRules.push($scope.routeModel.pushRules[index]);
                    }else if($scope.routeModel.pushRules[index].hasOwnProperty("id") &&
                        $scope.updatedPushIds.indexOf($scope.routeModel.pushRules[index]["id"]) >= 0){
                        pushRules.push($scope.routeModel.pushRules[index]);
                    }
                })

                $scope.routeModel.procurementRules = procurementRules;
                $scope.routeModel.pushRules = pushRules;

                $scope.routeModel.removedPushIds = $scope.removedPushIds;
                $scope.routeModel.removedProcurmentIds = $scope.removedProcurmentIds;
                console.log($scope.routeModel);
                Route.update($scope.routeModel).then(function (data) {
                    $state.go('routes-detail',{routeId:$scope.routeModel.id});
                }).catch(function (data) {
                    console.log("ERROR")
                    ErrorHandle.handleError(data);
                });
            }
        }

        $scope.deleteRouteById = function () {
            var id = $stateParams.routeId;
            Route.deleteByListIDs([id]).then(function (data) {
                if (data.length > 0){
                    var erMsg = $translate.instant('error.common.deleteError');
                    erMsg += data;
                    AlertService.error(erMsg);
                } else {
                    $state.go('routes',{}, {reload : true});
                }
            }).catch(function(data){
                ErrorHandle.handleError(data);
            })
        }

        $scope.validateButton = function () {
            if($scope.form_editRoute.$valid){
                $("#editRoute").removeClass("hideElement");
                return true;
            } else {
                $("#editRoute").addClass("hideElement");
                return false;
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