angular
    .module('erpApp')
    .controller('InventoryReportController', [
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
        'apiData',
        '$http',
        'ErrorHandle',
        'Product',
        'ProductMan',
        'Package',
        'Lot',
        'Warehouse',
        'InventoryReport',
        'StockQuantityReport',
        'Location',
        function ($scope, $rootScope, $timeout, $compile, $stateParams, $interval, TableMultiple, $translate, $window, AlertService, $state, apiData, $http, ErrorHandle, Product, ProductMan, Package, Lot, Warehouse, InventoryReport,StockQuantityReport,Location) {
            // Combobox Warehouse
            $scope.cbxSelectizeIRWInit = {
                url: '/api/warehouses', // ** api load data
                OriginParams: null, // ** init params -- default: null
                MoreParams: null, // ** filter params => reload cbx options -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.cbxSelectizeIRW = {
                ngModel : [], // ** value select -- array []
                ngModelObject : [],
                Options: [], // ** list options cbx, default: []
                Scope : $scope,
                Config: {
                    index: null,
                    placeholder : 'Select warehouse...',
                    plugins: ['infinite_scroll'], //enable load more
                    maxItems: 1,
                    valueField: $scope.cbxSelectizeIRWInit.valueField,
                    labelField: $scope.cbxSelectizeIRWInit.labelField,
                    searchField: $scope.cbxSelectizeIRWInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeIRWInit.labelField]) + '</span>' + '</div>';
                        },
                        item: function(data, escape) {
                            return '<div class="item">' + escape(data[$scope.cbxSelectizeIRWInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        query = JSON.parse(query)
                        //console.log(query)
                        if($scope.cbxSelectizeIRWInit.resetScroll){
                            //console.log('init query.page = 0')
                            query.page = 0;
                            callback($scope.cbxSelectizeIRWInit.resetScroll);
                            $scope.cbxSelectizeIRWInit.resetScroll = false;
                        }
                        $scope.cbxSelectizeIRWInit.page = query.page || 0;
                        if(!$scope.cbxSelectizeIRWInit.totalCount || $scope.cbxSelectizeIRWInit.totalCount > ( ($scope.cbxSelectizeIRWInit.page - 1) * $scope.cbxSelectizeIRWInit.perPage) ){
                            var api = apiData.genApi($scope.cbxSelectizeIRWInit.url, $scope.cbxSelectizeIRWInit.searchField, query.search, $scope.cbxSelectizeIRWInit.perPage, null, $scope.cbxSelectizeIRWInit.OriginParams,query.page,$scope.cbxSelectizeIRWInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.cbxSelectizeIRWInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

            // Combobox Location
            $scope.cbxSelectizeIRLInit = {
                url: '/api/locations', // ** api load data
                OriginParams: null, // ** init params -- default: null
                MoreParams: null, // ** filter params => reload cbx options -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'completeName', searchField: 'completeName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.cbxSelectizeIRL = {
                ngModel : [], // ** value select -- array []
                ngModelObject : [],
                Options: [], // ** list options cbx, default: []
                Scope : $scope,
                Config: {
                    index: null,
                    placeholder : 'Select location...',
                    plugins: ['infinite_scroll'], //enable load more
                    maxItems: 1,
                    valueField: $scope.cbxSelectizeIRLInit.valueField,
                    labelField: $scope.cbxSelectizeIRLInit.labelField,
                    searchField: $scope.cbxSelectizeIRLInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeIRLInit.labelField]) + '</span>' + '</div>';
                        },
                        item: function(data, escape) {
                            return '<div class="item">' + escape(data[$scope.cbxSelectizeIRLInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        query = JSON.parse(query)
                        //console.log(query)
                        if($scope.cbxSelectizeIRLInit.resetScroll){
                            //console.log('init query.page = 0')
                            query.page = 0;
                            callback($scope.cbxSelectizeIRLInit.resetScroll);
                            $scope.cbxSelectizeIRLInit.resetScroll = false;
                        }
                        $scope.cbxSelectizeIRLInit.page = query.page || 0;
                        if(!$scope.cbxSelectizeIRLInit.totalCount || $scope.cbxSelectizeIRLInit.totalCount > ( ($scope.cbxSelectizeIRLInit.page - 1) * $scope.cbxSelectizeIRLInit.perPage) ){
                            var api = apiData.genApi($scope.cbxSelectizeIRLInit.url, $scope.cbxSelectizeIRLInit.searchField, query.search, $scope.cbxSelectizeIRLInit.perPage, null, $scope.cbxSelectizeIRLInit.OriginParams,query.page,$scope.cbxSelectizeIRLInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.cbxSelectizeIRLInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

            // Combobox Product Name
            $scope.cbxSelectizeIRPNameInit = {
                url: '/api/product-man', // ** api load data
                OriginParams: null, // ** init params -- default: null
                MoreParams: null, // ** filter params => reload cbx options -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'internalReference', searchField: 'internalReference', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.cbxSelectizeIRPName = {
                ngModel : [], // ** value select -- array []
                ngModelObject : [],
                Options: [], // ** list options cbx, default: []
                Scope : $scope,
                Config: {
                    index: null,
                    placeholder : 'Select product name...',
                    plugins: ['infinite_scroll'], //enable load more
                    maxItems: 1,
                    valueField: $scope.cbxSelectizeIRPNameInit.valueField,
                    labelField: $scope.cbxSelectizeIRPNameInit.labelField,
                    searchField: $scope.cbxSelectizeIRPNameInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeIRPNameInit.labelField]) + '</span>' + '</div>';
                        },
                        item: function(data, escape) {
                            return '<div class="item">' + escape(data[$scope.cbxSelectizeIRPNameInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        query = JSON.parse(query)
                        //console.log(query)
                        if($scope.cbxSelectizeIRPNameInit.resetScroll){
                            //console.log('init query.page = 0')
                            query.page = 0;
                            callback($scope.cbxSelectizeIRPNameInit.resetScroll);
                            $scope.cbxSelectizeIRPNameInit.resetScroll = false;
                        }
                        $scope.cbxSelectizeIRPNameInit.page = query.page || 0;
                        if(!$scope.cbxSelectizeIRPNameInit.totalCount || $scope.cbxSelectizeIRPNameInit.totalCount > ( ($scope.cbxSelectizeIRPNameInit.page - 1) * $scope.cbxSelectizeIRPNameInit.perPage) ){
                            var api = apiData.genApi($scope.cbxSelectizeIRPNameInit.url, $scope.cbxSelectizeIRPNameInit.searchField, query.search, $scope.cbxSelectizeIRPNameInit.perPage, null, $scope.cbxSelectizeIRPNameInit.OriginParams,query.page,$scope.cbxSelectizeIRPNameInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.cbxSelectizeIRPNameInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

            // Combobox Product Description
            $scope.cbxSelectizeIRPDescriptionInit = {
                url: '/api/products', // ** api load data
                OriginParams: null, // ** init params -- default: null
                MoreParams: null, // ** filter params => reload cbx options -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'description', searchField: 'description', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.cbxSelectizeIRPDescription = {
                ngModel : [], // ** value select -- array []
                ngModelObject : [],
                Options: [], // ** list options cbx, default: []
                Scope : $scope,
                Config: {
                    index: null,
                    placeholder : 'Select product description...',
                    plugins: ['infinite_scroll'], //enable load more
                    maxItems: 1,
                    valueField: $scope.cbxSelectizeIRPDescriptionInit.valueField,
                    labelField: $scope.cbxSelectizeIRPDescriptionInit.labelField,
                    searchField: $scope.cbxSelectizeIRPDescriptionInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeIRPDescriptionInit.labelField]) + '</span>' + '</div>';
                        },
                        item: function(data, escape) {
                            return '<div class="item">' + escape(data[$scope.cbxSelectizeIRPDescriptionInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        query = JSON.parse(query)
                        //console.log(query)
                        if($scope.cbxSelectizeIRPDescriptionInit.resetScroll){
                            //console.log('init query.page = 0')
                            query.page = 0;
                            callback($scope.cbxSelectizeIRPDescriptionInit.resetScroll);
                            $scope.cbxSelectizeIRPDescriptionInit.resetScroll = false;
                        }
                        $scope.cbxSelectizeIRPDescriptionInit.page = query.page || 0;
                        if(!$scope.cbxSelectizeIRPDescriptionInit.totalCount || $scope.cbxSelectizeIRPDescriptionInit.totalCount > ( ($scope.cbxSelectizeIRPDescriptionInit.page - 1) * $scope.cbxSelectizeIRPDescriptionInit.perPage) ){
                            var api = apiData.genApi($scope.cbxSelectizeIRPDescriptionInit.url, $scope.cbxSelectizeIRPDescriptionInit.searchField, query.search, $scope.cbxSelectizeIRPDescriptionInit.perPage, null, $scope.cbxSelectizeIRPDescriptionInit.OriginParams,query.page,$scope.cbxSelectizeIRPDescriptionInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.cbxSelectizeIRPDescriptionInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

            // Combobox Package
            $scope.cbxSelectizeIRPkInit = {
                url: '/api/packages', // ** api load data
                OriginParams: null, // ** init params -- default: null
                MoreParams: null, // ** filter params => reload cbx options -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'packageNumber', searchField: 'packageNumber', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.cbxSelectizeIRPk = {
                ngModel : [], // ** value select -- array []
                ngModelObject : [],
                Options: [], // ** list options cbx, default: []
                Scope : $scope,
                Config: {
                    index: null,
                    placeholder : 'Select package...',
                    plugins: ['infinite_scroll'], //enable load more
                    maxItems: 1,
                    valueField: $scope.cbxSelectizeIRPkInit.valueField,
                    labelField: $scope.cbxSelectizeIRPkInit.labelField,
                    searchField: $scope.cbxSelectizeIRPkInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeIRPkInit.labelField]) + '</span>' + '</div>';
                        },
                        item: function(data, escape) {
                            return '<div class="item">' + escape(data[$scope.cbxSelectizeIRPkInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        query = JSON.parse(query)
                        //console.log(query)
                        if($scope.cbxSelectizeIRPkInit.resetScroll){
                            //console.log('init query.page = 0')
                            query.page = 0;
                            callback($scope.cbxSelectizeIRPkInit.resetScroll);
                            $scope.cbxSelectizeIRPkInit.resetScroll = false;
                        }
                        $scope.cbxSelectizeIRPkInit.page = query.page || 0;
                        if(!$scope.cbxSelectizeIRPkInit.totalCount || $scope.cbxSelectizeIRPkInit.totalCount > ( ($scope.cbxSelectizeIRPkInit.page - 1) * $scope.cbxSelectizeIRPkInit.perPage) ){
                            var api = apiData.genApi($scope.cbxSelectizeIRPkInit.url, $scope.cbxSelectizeIRPkInit.searchField, query.search, $scope.cbxSelectizeIRPkInit.perPage, null, $scope.cbxSelectizeIRPkInit.OriginParams,query.page,$scope.cbxSelectizeIRPkInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.cbxSelectizeIRPkInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

            // Combobox Serial/Lot
            $scope.cbxSelectizeIRSLInit = {
                url: '/api/lots', // ** api load data
                OriginParams: null, // ** init params -- default: null
                MoreParams: null, // ** filter params => reload cbx options -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'lotNumber', searchField: 'lotNumber', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.cbxSelectizeIRSL = {
                ngModel : [], // ** value select -- array []
                ngModelObject : [],
                Options: [], // ** list options cbx, default: []
                Scope : $scope,
                Config: {
                    index: null,
                    placeholder : 'Select lot/serial number...',
                    plugins: ['infinite_scroll'], //enable load more
                    maxItems: 1,
                    valueField: $scope.cbxSelectizeIRSLInit.valueField,
                    labelField: $scope.cbxSelectizeIRSLInit.labelField,
                    searchField: $scope.cbxSelectizeIRSLInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' + '<span class="title">' + escape(data[$scope.cbxSelectizeIRSLInit.labelField]) + '</span>' + '</div>';
                        },
                        item: function(data, escape) {
                            return '<div class="item">' + escape(data[$scope.cbxSelectizeIRSLInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        query = JSON.parse(query)
                        //console.log(query)
                        if($scope.cbxSelectizeIRSLInit.resetScroll){
                            //console.log('init query.page = 0')
                            query.page = 0;
                            callback($scope.cbxSelectizeIRSLInit.resetScroll);
                            $scope.cbxSelectizeIRSLInit.resetScroll = false;
                        }
                        $scope.cbxSelectizeIRSLInit.page = query.page || 0;
                        if(!$scope.cbxSelectizeIRSLInit.totalCount || $scope.cbxSelectizeIRSLInit.totalCount > ( ($scope.cbxSelectizeIRSLInit.page - 1) * $scope.cbxSelectizeIRSLInit.perPage) ){
                            var api = apiData.genApi($scope.cbxSelectizeIRSLInit.url, $scope.cbxSelectizeIRSLInit.searchField, query.search, $scope.cbxSelectizeIRSLInit.perPage, null, $scope.cbxSelectizeIRSLInit.OriginParams,query.page,$scope.cbxSelectizeIRSLInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.cbxSelectizeIRSLInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

            $scope.selectDateTitle = "inventory.reporting.inventory-report.date.select"

            $scope.$watch('inventory_report.warehouseId', function(newval) {
                if(newval != undefined && newval != null) {
                    Warehouse.getOne(newval).then(function (data) {
                        $scope.cbxSelectizeIRL.Options = [];
                        $scope.cbxSelectizeIRLInit.resetScroll = true;
                        $scope.cbxSelectizeIRLInit.MoreParams = "completeName=='*/" + data.code +  "*'";
                    })
                } else {
                    $scope.cbxSelectizeIRL.Options = [];
                    $scope.cbxSelectizeIRLInit.resetScroll = true;
                    $scope.cbxSelectizeIRLInit.MoreParams = "";;
                }
            });

            $scope.list_product = []

            $scope.newRow = {};

            $scope.validateItem = function () {
                if($scope.newRow.name != null &&
                    $scope.newRow.description != null)
                    return true;
                else return false;
            }

            $scope.isNewItem = false;
            $scope.addNewItem = function () {
                if($scope.isNewItem) {
                    // Save item
                    $scope.saveItem();
                } else
                    $scope.isNewItem = true;
            }

            $scope.saveItem = function (callback) {
                if(!$scope.submit())
                    return;

                // if validate
                if($scope.validateItem()) {
                    var newData = {};
                    ProductMan.getOne($scope.newRow.name).then(function (data) {
                        newData.pName = data.internalReference;

                        Product.getOne($scope.newRow.description).then(function (data) {
                            newData.productId = Number($scope.newRow.name);
                            newData.pDescription = data.description;

                            if($scope.newRow.package != null) {
                                Package.getOne($scope.newRow.package).then(function (data) {
                                    newData.destPackageId = Number($scope.newRow.package);
                                    newData.pPackage = data.packageNumber;

                                    if($scope.newRow.serialLot != null) {
                                        Lot.getOne($scope.newRow.serialLot).then(function (data) {
                                            newData.lotId = Number($scope.newRow.serialLot);
                                            newData.pSerialLot = data.lotNumber;

                                            $scope.list_product.push(newData);
                                            $scope.newRow = {};

                                            if(callback != null) {
                                                callback("OK")
                                            }
                                        })
                                    } else {
                                        newData.lotId = null;
                                        newData.pSerialLot = null;

                                        $scope.list_product.push(newData);
                                        $scope.newRow = {};

                                        if(callback != null) {
                                            callback("OK")
                                        }
                                    }
                                })
                            } else {
                                newData.destPackageId = null;
                                newData.pPackage = null;

                                if($scope.newRow.serialLot != null) {
                                    Lot.getOne($scope.newRow.serialLot).then(function (data) {
                                        newData.lotId = Number($scope.newRow.serialLot);
                                        newData.pSerialLot = data.lotNumber;

                                        $scope.list_product.push(newData);
                                        $scope.newRow = {};

                                        if(callback != null) {
                                            callback("OK")
                                        }
                                    })
                                } else {
                                    newData.lotId = null;
                                    newData.pSerialLot = null;

                                    $scope.list_product.push(newData);
                                    $scope.newRow = {};

                                    if(callback != null) {
                                        callback("OK")
                                    }
                                }
                            }
                        })
                    })
                }
            }

            $scope.IsRemoveItem = false;
            $scope.inventory_remove_item = function (event, index) {
                $scope.IsRemoveItem = true;
                event.preventDefault();
                if (index > -1) {
                    $scope.list_product.splice(index, 1);
                }
            }

            $scope.inventory_remove_new_row = function (event) {
                event.preventDefault();
                $scope.newRow = {}
                $scope.isNewItem = false;
            }

            $(window).click(function(event) {
                if($scope.isNewItem) {
                    var newRowId = $('#newRowID')
                    var addNewRowId = $('#addNewRowID')

                    if (newRowId.has(event.target).length == 0 && !newRowId.is(event.target)){
                        if (addNewRowId.has(event.target).length == 0 && !addNewRowId.is(event.target)){
                            if($scope.IsRemoveItem) {
                                $scope.IsRemoveItem = false;
                                return;
                            }
                            // save item
                            $scope.saveItem(function (result) {
                                if(result === "OK")
                                    $scope.isNewItem = false;
                            });
                        }
                    }
                }
            });

            $scope.submit = function() {
                $('#form_create_newRow').parsley();
                if($scope.form_create_newRow.$valid)
                    return true;
                else
                    return false;
            }

            if (angular.element('#form_create_newRow').length) {
                $scope.required_msg = $translate.instant('admin.messages.required')
                var $formValidate = $('#form_create_newRow');
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

            // Datetime
            $scope.convertDate = function(dateString, type) {
                if(dateString == null || dateString.length == 0) {
                    if(type != undefined && type != null) {
                        if(type == "end") {
                            var today = new Date();
                            var newDate = (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear() +" 23:59:59";
                            return new Date(newDate).getTime()
                        }

                    }
                    return null;
                }

                // format DD/MM/YYYY
                var date = dateString.split("/");
                var newDate = date[1] + "/" + date[0] + "/" + date[2];
                if(type != undefined && type != null) {
                    if(type == "start")
                        newDate += " 00:00:00";
                    else
                        newDate += " 23:59:59";
                }

                return (new Date(newDate).getTime());
            }

            $scope.convertToDateTime = function (timestamp) {
                var date = new Date(timestamp);
                var newDate = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
                return newDate;
            }

            // Model to POST
            $scope.inventory_report = {}

            function genOriginQuery(originParam) {
                if($scope.inventory_report.products.length >0){
                    var productId_query ="("
                    for (var i =0; i < $scope.inventory_report.products.length; i++){

                        var tmp = "(productId==" + $scope.inventory_report.products[i].productId
                        if($scope.inventory_report.products[i].destPackageId !=null){
                            tmp += ";packageId==" + $scope.inventory_report.products[i].destPackageId
                        }

                        if($scope.inventory_report.products[i].lotId !=null){
                            tmp += ";lotId==" + $scope.inventory_report.products[i].lotId
                        }
                        tmp +=")"
                        productId_query +=tmp
                        if(i < $scope.inventory_report.products.length -1 ){
                            productId_query += ','
                        }
                    }
                    productId_query +=")"
                    if(originParam == ""){
                        originParam +=productId_query
                    } else {
                        originParam += ";" + productId_query
                    }
                }
                return originParam
            }

            function genReport(originParam) {
                $scope.blockModal;
                $scope.blockUI = function(){
                    $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please Wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner.gif\' alt=\'\'>');
                }

                $scope.blockUI();
                InventoryReport.sendReport($scope.inventory_report)
                    .then(function(data){
                        if($scope.blockModal != null)
                            $scope.blockModal.hide();
                        $state.go('inventory-report-detail', {reportData: data, inputData: $scope.inventory_report, originParam:originParam });
                    })
                    .catch(function(data){
                        if($scope.blockModal != null)
                            $scope.blockModal.hide();
                        ErrorHandle.handleError(data);
                    })
            }

            $scope.clickReport = function () {
                if($scope.isNewItem)
                    return;

                $scope.inventory_report.products = []
                for(var i = 0; i < $scope.list_product.length; i++)
                    $scope.inventory_report.products.push($scope.list_product[i]);

                $scope.inventory_report.beginDate = $scope.convertDate($scope.beginingDate, "start");
                $scope.inventory_report.endDate = $scope.convertDate($scope.endDate, "end");

                /*if($scope.inventory_report.warehouseId != null)
                    $scope.inventory_report.warehouseId = Number($scope.inventory_report.warehouseId)
                if($scope.inventory_report.locationId != null)
                    $scope.inventory_report.locationId = Number($scope.inventory_report.locationId)*/

                var originParam = ""
                if(angular.isDefined($scope.inventory_report) && $scope.inventory_report!=null){
                    console.log($scope.inventory_report)
                    if(angular.isDefined($scope.inventory_report.locationId) && $scope.inventory_report.locationId !=''){
                        originParam += "locationId==" + $scope.inventory_report.locationId
                        originParam = genOriginQuery(originParam)
                        genReport(originParam)
                    } else if (angular.isDefined($scope.inventory_report.warehouseId) && $scope.inventory_report.warehouseId !=''){
                        Location.getPage('query=completeName=="*/' + $scope.cbxSelectizeIRW.ngModelObject[0].code +'*"').then(function (response) {
                            var locations = response.data
                            var location_list =''
                            for (var i=0; i < locations.length; i ++){
                                location_list += locations[i].id
                                if(i < locations.length -1){
                                    location_list +=','
                                }
                            }
                            if(location_list !=''){
                                originParam += "locationId=in=(" +location_list +")"
                            }
                            originParam = genOriginQuery(originParam)
                            genReport(originParam)
                        })
                    } else {
                        genReport(originParam)
                    }
                } else {
                    genReport(originParam)
                }
            }

            $scope.clickDiscard = function () {
                if($scope.isNewItem)
                    return;
            }

            /*======================================= DETAIL =========================================================*/
            if (angular.element('#inventory_report_detail').length) {
                $scope.warehouseType = "ALL";
                $scope.urlWarehouseName = '/api/warehouses/';
                $scope.attrWarehouseName = 'name';

                if($stateParams.inputData != null) {
                    $scope.beginingDate = $scope.convertToDateTime($stateParams.inputData.beginDate);
                    if($stateParams.inputData.endDate != null)
                        $scope.endDate = $scope.convertToDateTime($stateParams.inputData.endDate);
                    else {
                        $scope.endDate = $scope.convertToDateTime(new Date());
                    }

                    if($stateParams.inputData.warehouseId == null)
                        $scope.warehouseType = "ALL";
                    else {
                        $scope.warehouseType = "ONE";
                        $scope.warehouseIdReport = Number($stateParams.inputData.warehouseId);
                    }
                }

                $scope.list_product_summary = [];
                if($stateParams.reportData != null)
                    $scope.list_product_summary = $stateParams.reportData;

                // Build product version column
                $scope.list_column_product_version = [];
                $scope.list_column_product_version_date = [];

                for(var i = 0; i < $scope.list_product_summary.length; i++) {
                    if($scope.list_product_summary[i].quantities != undefined && $scope.list_product_summary[i].quantities!= null) {
                        for(var j = 0; j < $scope.list_product_summary[i].quantities.length; j++) {
                            var key = $scope.list_product_summary[i].quantities[j].productVersion;
                            if(key == "All")
                                continue;

                            var exist = false;
                            for(var k = 0; k < $scope.list_column_product_version.length; k++) {
                                if($scope.list_column_product_version[k] == key){
                                    exist = true;
                                    break;
                                }
                            }
                            if(!exist){
                                $scope.list_column_product_version.push(key);
                                $scope.list_column_product_version_date.push({
                                    "colTranslate": "inventory.reporting.inventory-report.summary.beginTime",
                                    "colKey": key,
                                    "colType": "begin"
                                });
                                $scope.list_column_product_version_date.push({
                                    "colTranslate": "inventory.reporting.inventory-report.summary.endTime",
                                    "colKey": key,
                                    "colType": "end"
                                });
                            }
                        }
                    }
                }

                $scope.getQuantity = function(key, type, quantities) {
                    if(quantities == null || quantities == undefined || quantities.length == 0)
                        return 0;

                    for(var i = 0; i < quantities.length; i++) {
                        if(quantities[i].productVersion == key) {
                            return quantities[i][type];
                        }
                    }

                    return 0;
                }

                $scope.getSumQuantity = function(key, type) {
                    var sum = 0;
                    for(var i = 0; i < $scope.list_product_summary.length; i++) {
                        if($scope.list_product_summary[i].quantities != undefined && $scope.list_product_summary[i].quantities != null) {
                            for(var j = 0; j < $scope.list_product_summary[i].quantities.length; j++) {
                                var pv = $scope.list_product_summary[i].quantities[j].productVersion;
                                if(pv == key){
                                    sum += $scope.list_product_summary[i].quantities[j][type];
                                }
                            }
                        }
                    }
                    return sum;
                }

                $scope.isGroupByLocation = true
                $scope.isGroupByCategory = false
                angular.element($window).bind('resize', function(){
                    $scope.fullsize = {
                        "height":$( window ).height() - 350
                    }
                });

                $scope.fullsize = {
                    "height":$( window ).height() - 350
                }
                var loadFunction = StockQuantityReport.groupByLocation;
                if($scope.$stateParams.originParam == null){
                    $scope.$stateParams.originParam =''
                }
                var fields = ["productName", "locationName", "packageNumber", "traceNumber", "reserved", "onhand"];
                var fieldsType = ["Text", "Text", "Text", "Text", "Number", "Number"]
                var newTableIds = {
                    idTable: "table_tf",
                    model: "origins",
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
                    param_fields: fields,
                    param_fields_type: fieldsType,
                    handleAfterReload: null,
                    handleAfterReloadParams: null,
                    deleteCallback: null,
                    customParams: $scope.$stateParams.originParam,
                    pager_id: "table_ot_pager",
                    selectize_page_id: "rd_selectize_page",
                    selectize_pageNum_id: "rd_selectize_pageNum",
                    noPagination:true
                }


                TableMultiple.initTableIds($scope, newTableIds);
                TableMultiple.reloadPage(newTableIds.idTable);


                $scope.selectize_a_config = {
                    maxItems: 1,
                    placeholder: 'Group by.....',
                    valueField: 'value',
                    labelField: 'title',
                    searchField: 'title'
                };

                $scope.groupByOptions =  [
                    {
                        value: "locationId",
                        title: "Warehouse"
                    },
                    {
                        value: "productCategoryId",
                        title:"Category"

                    }
                ]

                $scope.groupBy = "locationId"
                $scope.handleGroupBy = function () {
                    if($scope.groupBy == "productCategoryId"){
                        $scope.TABLES['table_tf'].loadFunction = StockQuantityReport.groupByCategory
                        TableMultiple.reloadPage(newTableIds.idTable);
                    } else {
                            $scope.TABLES['table_tf'].loadFunction = StockQuantityReport.groupByLocation
                            TableMultiple.reloadPage(newTableIds.idTable);
                    }

                }

                $scope.expandAndCollapseOrigin = function(table_id,object,index){
                    // var parentValue = object.originTransferNumber
                    if(!angular.isDefined(object.expand)) {
                        object.expand = false
                    }
                    object.expand = ! object.expand
                    if (object.expand){
                        query ="query="

                        if($scope.groupBy == "locationId"){
                            query += "locationId==" + object.locationId
                        } else {
                            query += "productCategoryId==" + object.productCategoryId
                        }

                        if($scope.getCommonQuery(table_id) !=''){
                            query += ";" +$scope.getCommonQuery(table_id)
                        }
                        StockQuantityReport.getPage(query).then(function (response) {
                            object.child = response.data
                        })
                    } else {
                        object.child = []
                    }
                }
            }
            /*======================================= END DETAIL =====================================================*/
        }
    ]);

