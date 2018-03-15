angular
    .module('erpApp')
    .controller('OperationTypesController', [
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
        function ($scope, $rootScope, $timeout, $compile, OperationType, $stateParams, $interval, TableMultiple, $translate,$window,AlertService,$state,$filter,Sequence,Location,Warehouse,ErrorHandle,apiData,$http) {
            $scope.chooseValue = {value:1, title:"Active"}
            $scope.columnsName = {
                warehouse: "inventory.column.warehouse",
                opName: "inventory.column.opName",
                opType: "inventory.column.opType",
                opTypeReturn: "inventory.column.opTypeReturn",
                rs: "inventory.column.rs",
                amp:"inventory.column.amp",
                cnl:"inventory.column.cnl",
                uel:"inventory.column.uel",
                dsl:"inventory.column.dsl",
                ddl:"inventory.column.ddl",
                active:"masterdata.column.Active"
            }

            $scope.button = {
                Create: "masterdata.button.Create",
                Edit: "masterdata.button.Edit",
                Back: "masterdata.button.Back",
                Delete: "masterdata.button.Delete",
                Cancel:"masterdata.button.Cancel",
                Save:"masterdata.button.Save"
            }

            $scope.common = {
                Inventory:"inventory.common.Inventory",
                Preference:"inventory.common.Preference",
                Sequences:"inventory.common.Sequences",
                Sequence:"inventory.common.Sequence",
                ots:"inventory.common.ots",
                pal:"inventory.common.pal",
                locations:"inventory.common.locations"

            }

            $scope.msg = {
                from:"inventory.messages.from",
                to:"inventory.messages.to",
                dateValid:"inventory.messages.dateValid",
                selectDate:"inventory.messages.selectDate",
                required:"inventory.messages.required"
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
            $scope.CbxCreatedBy ={
                url:'/api/users/search?query=',
                key:'email',
                attr:'email',
                prefix:'#/users/',
                suffix:'/detail'
            }
            $scope.CbxActivate = {
                activateService:OperationType.activate,
                deactivateService:OperationType.deactivate
            }
            $scope.newOt = {}
            $scope.CbxWarehouseDInit = {
                url: '/api/warehouses', // ** api load data
                OriginParams: 'active==true;id>1', // ** init params -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.CbxWarehouseD = { // ** replace name cbx
                ngModel : '', // ** value select -- array []
                Options: [], // ** list options cbx, default: []
                Table : null, // ** table filter
                Column : null, // ** number column filter on table
                Scope : $scope,
                Config: {
                    placeholder : 'Select warehouses',
                    plugins: ['infinite_scroll'],//enable load more
                    maxItems: 1,
                    valueField: $scope.CbxWarehouseDInit.valueField,
                    labelField: $scope.CbxWarehouseDInit.labelField,
                    searchField: $scope.CbxWarehouseDInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' +
                                '<span class="title">' + escape(data[$scope.CbxWarehouseDInit.labelField]) + '</span>' +
                                '</div>';
                        },
                        item: function(data, escape) {
                            //return '<div class="item"><a href="' + escape(data[$scope.cbxSrc2UomCateInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxSrc2UomCateInit.labelField]) + '</a></div>';
                            return '<div class="item">' + escape(data[$scope.CbxWarehouseDInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        // $scope.newOt.warehouseId = -1
                        query = JSON.parse(query)
                        if($scope.CbxWarehouseDInit.resetScroll){
                            query.page = 0;
                            callback($scope.CbxWarehouseDInit.resetScroll);
                            $scope.CbxWarehouseDInit.resetScroll = false;
                        }
                        $scope.CbxWarehouseDInit.page = query.page || 0;
                        if(!$scope.CbxWarehouseDInit.totalCount || $scope.CbxWarehouseDInit.totalCount > ( ($scope.CbxWarehouseDInit.page - 1) * $scope.CbxWarehouseDInit.perPage) ){
                            var api = apiData.genApi($scope.CbxWarehouseDInit.url, $scope.CbxWarehouseDInit.searchField, query.search, $scope.CbxWarehouseDInit.perPage, null, $scope.CbxWarehouseDInit.OriginParams,query.page,$scope.CbxWarehouseDInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.CbxWarehouseDInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }


            $scope.CbxSequenceDInit = {
                url: '/api/sequences', // ** api load data
                OriginParams: 'active==true;id>1', // ** init params -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.CbxSequenceD = { // ** replace name cbx
                ngModel : '', // ** value select -- array []
                Options: [], // ** list options cbx, default: []
                Table : null, // ** table filter
                Column : null, // ** number column filter on table
                Scope : $scope,
                Config: {
                    placeholder : 'Select sequences',
                    plugins: ['infinite_scroll'],//enable load more
                    maxItems: 1,
                    valueField: $scope.CbxSequenceDInit.valueField,
                    labelField: $scope.CbxSequenceDInit.labelField,
                    searchField: $scope.CbxSequenceDInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' +
                                '<span class="title">' + escape(data[$scope.CbxSequenceDInit.labelField]) + '</span>' +
                                '</div>';
                        },
                        item: function(data, escape) {
                            //return '<div class="item"><a href="' + escape(data[$scope.cbxSrc2UomCateInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxSrc2UomCateInit.labelField]) + '</a></div>';
                            return '<div class="item">' + escape(data[$scope.CbxSequenceDInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        // $scope.newOt.refSequenceId = -1
                        query = JSON.parse(query)
                        if($scope.CbxSequenceDInit.resetScroll){
                            query.page = 0;
                            callback($scope.CbxSequenceDInit.resetScroll);
                            $scope.CbxSequenceDInit.resetScroll = false;
                        }
                        $scope.CbxSequenceDInit.page = query.page || 0;
                        if(!$scope.CbxSequenceDInit.totalCount || $scope.CbxSequenceDInit.totalCount > ( ($scope.CbxSequenceDInit.page - 1) * $scope.CbxSequenceDInit.perPage) ){
                            var api = apiData.genApi($scope.CbxSequenceDInit.url, $scope.CbxSequenceDInit.searchField, query.search, $scope.CbxSequenceDInit.perPage, null, $scope.CbxSequenceDInit.OriginParams,query.page,$scope.CbxSequenceDInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.CbxSequenceDInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

            $scope.CbxOTReturnInit = {
                url: '/api/operation-types', // ** api load data
                OriginParams: 'active==true;id>1', // ** init params -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'displayName', searchField: 'displayName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.CbxOTReturn = { // ** replace name cbx
                ngModel : '', // ** value select -- array []
                Options: [], // ** list options cbx, default: []
                Table : null, // ** table filter
                Column : null, // ** number column filter on table
                Scope : $scope,
                Config: {
                    placeholder : 'Select sequences',
                    plugins: ['infinite_scroll'],//enable load more
                    maxItems: 1,
                    valueField: $scope.CbxOTReturnInit.valueField,
                    labelField: $scope.CbxOTReturnInit.labelField,
                    searchField: $scope.CbxOTReturnInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' +
                                '<span class="title">' + escape(data[$scope.CbxOTReturnInit.labelField]) + '</span>' +
                                '</div>';
                        },
                        item: function(data, escape) {
                            //return '<div class="item"><a href="' + escape(data[$scope.cbxSrc2UomCateInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxSrc2UomCateInit.labelField]) + '</a></div>';
                            return '<div class="item">' + escape(data[$scope.CbxOTReturnInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        // $scope.newOt.returnOperationId = -1
                        query = JSON.parse(query)
                        if($scope.CbxOTReturnInit.resetScroll){
                            query.page = 0;
                            callback($scope.CbxOTReturnInit.resetScroll);
                            $scope.CbxOTReturnInit.resetScroll = false;
                        }
                        $scope.CbxOTReturnInit.page = query.page || 0;
                        if(!$scope.CbxOTReturnInit.totalCount || $scope.CbxOTReturnInit.totalCount > ( ($scope.CbxOTReturnInit.page - 1) * $scope.CbxOTReturnInit.perPage) ){
                            var api = apiData.genApi($scope.CbxOTReturnInit.url, $scope.CbxOTReturnInit.searchField, query.search, $scope.CbxOTReturnInit.perPage, null, $scope.CbxSequenceDInit.OriginParams,query.page,$scope.CbxSequenceDInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.CbxOTReturnInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }


            $scope.CbxLocationDInit = {
                url: '/api/locations', // ** api load data
                OriginParams: 'active==true;id>1', // ** init params -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'completeName', searchField: 'completeName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.CbxLocationD = { // ** replace name cbx
                ngModel : '', // ** value select -- array []
                Options: [], // ** list options cbx, default: []
                Table : null, // ** table filter
                Column : null, // ** number column filter on table
                Scope : $scope,
                Config: {
                    placeholder : 'Select location',
                    plugins: ['infinite_scroll'],//enable load more
                    maxItems: 1,
                    valueField: $scope.CbxLocationDInit.valueField,
                    labelField: $scope.CbxLocationDInit.labelField,
                    searchField: $scope.CbxLocationDInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' +
                                '<span class="title">' + escape(data[$scope.CbxLocationDInit.labelField]) + '</span>' +
                                '</div>';
                        },
                        item: function(data, escape) {
                            //return '<div class="item"><a href="' + escape(data[$scope.cbxSrc2UomCateInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxSrc2UomCateInit.labelField]) + '</a></div>';
                            return '<div class="item">' + escape(data[$scope.CbxLocationDInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        // $scope.newOt.defaultDestLocationId = -1
                        query = JSON.parse(query)
                        if($scope.CbxLocationDInit.resetScroll){
                            query.page = 0;
                            callback($scope.CbxLocationDInit.resetScroll);
                            $scope.CbxLocationDInit.resetScroll = false;
                        }
                        $scope.CbxLocationDInit.page = query.page || 0;
                        if(!$scope.CbxLocationDInit.totalCount || $scope.CbxLocationDInit.totalCount > ( ($scope.CbxLocationDInit.page - 1) * $scope.CbxLocationDInit.perPage) ){
                            var api = apiData.genApi($scope.CbxLocationDInit.url, $scope.CbxLocationDInit.searchField, query.search, $scope.CbxLocationDInit.perPage, null, $scope.CbxLocationDInit.OriginParams,query.page,$scope.CbxLocationDInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.CbxLocationDInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

            $scope.CbxLocationS = { // ** replace name cbx
                ngModel : '', // ** value select -- array []
                Options: [], // ** list options cbx, default: []
                Table : null, // ** table filter
                Column : null, // ** number column filter on table
                Scope : $scope,
                Config: {
                    placeholder : 'Select location',
                    plugins: ['infinite_scroll'],//enable load more
                    maxItems: 1,
                    valueField: $scope.CbxLocationDInit.valueField,
                    labelField: $scope.CbxLocationDInit.labelField,
                    searchField: $scope.CbxLocationDInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' +
                                '<span class="title">' + escape(data[$scope.CbxLocationDInit.labelField]) + '</span>' +
                                '</div>';
                        },
                        item: function(data, escape) {
                            //return '<div class="item"><a href="' + escape(data[$scope.cbxSrc2UomCateInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxSrc2UomCateInit.labelField]) + '</a></div>';
                            return '<div class="item">' + escape(data[$scope.CbxLocationDInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        // $scope.newOt.defaultSrcLocationId = -1
                        query = JSON.parse(query)
                        if($scope.CbxLocationDInit.resetScroll){
                            query.page = 0;
                            callback($scope.CbxLocationDInit.resetScroll);
                            $scope.CbxLocationDInit.resetScroll = false;
                        }
                        $scope.CbxLocationDInit.page = query.page || 0;
                        if(!$scope.CbxLocationDInit.totalCount || $scope.CbxLocationDInit.totalCount > ( ($scope.CbxLocationDInit.page - 1) * $scope.CbxLocationDInit.perPage) ){
                            var api = apiData.genApi($scope.CbxLocationDInit.url, $scope.CbxLocationDInit.searchField, query.search, $scope.CbxLocationDInit.perPage, null, $scope.CbxLocationDInit.OriginParams,query.page,$scope.CbxLocationDInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.CbxLocationDInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }


            function mapType(type){
                for (var i=0; i<$scope.selectize_type_options.length;i++ ){
                    if ($scope.selectize_type_options[i].id == type){
                        return $scope.selectize_type_options[i].name
                    }
                }
            }

            //detail view
            if (angular.element('#ot_detail').length) {
                OperationType.getOne($stateParams.otId).then(function (data) {
                    $scope.ot = data
                    $scope.active = $scope.ot.active
                    if ($scope.active == null) {
                        $scope.active = false
                    }

                    $scope.urlReturnOtLink = '#/operation-types/'+ $scope.ot.returnOperationId +'/details'
                    $scope.urlWarehouseLink = '#/warehouses/'+ $scope.ot.warehouseId +'/details'
                    $scope.urlSeqLink = '#/sequences/' + $scope.ot.refSequenceId +'/details'
                    $scope.urlSourceLink = '#/locations/details?id='  + $scope.ot.defaultSrcLocationId
                    $scope.urlDesLink = '#/locations/details?id='  + $scope.ot.defaultDestLocationId
                    $scope.ot.type = mapType($scope.ot.type)
                })
            }


            //create and edit view
            if (angular.element('#ot_create').length || angular.element('#ot_edit').length) {
                //validation
                $scope.maxLengthRule = "warehouse.messages.maxLengthRule";
                $scope.required_msg = $translate.instant('admin.messages.required')
                var $formValidate = $('#form_createot');
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

                //init config dropdown
                $scope.seqValid = true
                $scope.typeValid = true
                $scope.selectize_config = {
                    persist: true,
                    maxItems: 1,
                    valueField: 'id',
                    labelField: 'name',
                    searchField: ['name'],
                    placeholder: "Select type",
                    maxOptions: 10,
                };

                $scope.disableLocations=[]
                $scope.selectize_location_config = {
                    persist: true,
                    maxItems: 1,
                    valueField: 'id',
                    labelField: 'name',
                    searchField: ['name'],
                    placeholder: "Search",
                    maxOptions: 10
                };


                //init reference sequence dropdown
                $scope.selectize_seq_options = [];
                Sequence.getAll().then(function (data) {
                    $scope.selectize_seq_options = data
                })

                //init warehouse dropdown
                $scope.selectize_wh_options = [];
                Warehouse.getAll().then(function (data) {
                    $scope.selectize_wh_options = data
                })

                //init location dropdown
                $scope.selectize_location_options = [];
                Location.getAll().then(function (data) {
                    $scope.selectize_location_options = data
                })
                $scope.selectSource = function () {
                    $scope.disableLocations =[$scope.newOt.defaultSrcLocationId]
                    console.log($scope.disableLocations)
                }
                $scope.selectDes = function () {
                    $scope.disableLocations =[$scope.newOt.defaultDestLocationId]
                }


                //init operation_type object
                //edit view
                if (angular.element('#ot_edit').length){
                    OperationType.getOne($stateParams.otId).then(function (data) {
                        $scope.newOt = data
                        $scope.active = $scope.newOt.active
                        if ($scope.active == null) {
                            $scope.active = false
                        }
                    })

                    Sequence.getAll().then(function (sData) {
                        console.log($scope.newOt.refSequenceId)
                        sData = addCurrentSelect(sData,$scope.newOt.refSequenceId,Sequence)
                        $scope.CbxSequenceD.ngModel=$scope.newOt.refSequenceId
                        $scope.CbxSequenceD.Options=sData

                    })

                    Warehouse.getAll().then(function (wData) {
                        wData = addCurrentSelect(wData,$scope.newOt.warehouseId,Warehouse)
                        $scope.CbxWarehouseD.ngModel=$scope.newOt.warehouseId
                        $scope.CbxWarehouseD.Options=wData

                    })

                    Location.getAll().then(function (srcData) {
                        srcData = addCurrentSelect(srcData,$scope.newOt.defaultSrcLocationId,Location)
                        $scope.CbxLocationS.ngModel=$scope.newOt.defaultSrcLocationId
                        $scope.CbxLocationS.Options=srcData

                    })

                    Location.getAll().then(function (desData) {
                        desData = addCurrentSelect(desData,$scope.newOt.defaultDestLocationId,Location)
                        $scope.CbxLocationD.ngModel=$scope.newOt.defaultDestLocationId
                        $scope.CbxLocationD.Options=desData

                    })
                    
                    $scope.deleteOne = function () {
                        OperationType.deleteOne($scope.newOt.id).then(function () {
                            $state.go('operation-types');
                        }).catch(function(data){
                            ErrorHandle.handleError(data);
                        })
                    }
                } else {
                    //create view
                    $scope.newOt={}
                    $scope.newOt.active = true
                }

                //create new
                $scope.submit = function() {
                    $('#form_createseq').parsley();
                    if($scope.form_createot.$valid){
                        if($scope.newOt.refSequenceId == null){
                            return
                        }
                        OperationType.create($scope.newOt)
                            .then(function(){
                                $state.go('operation-types');
                            })
                            .catch(function(data){
                                ErrorHandle.handleError(data);
                            })

                    }
                }

                //edit update
                $scope.update = function() {
                    console.log($scope.newOt)
                    $('#form_createseq').parsley();
                    if($scope.form_createot.$valid){
                        if($scope.newOt.refSequenceId == null){
                            return
                        }
                        OperationType.update($scope.newOt)
                            .then(function(){
                                $state.go('operation-types-detail',{otId: $scope.newOt.id });
                            })
                            .catch(function(data){
                                ErrorHandle.handleError(data);
                            })
                    }
                }

                function addCurrentSelect(data,currentId,serviceGetOne){
                    var isContain = false
                    for (var i=0; i< data.length; i++){
                        if (data[i].id == currentId){
                            isContain = true
                        }
                    }
                    if (!isContain){
                        serviceGetOne.getOne(currentId).then(function (one) {
                            data.push(one)
                        })
                    }
                    return data
                }

            }

        }
    ]);

