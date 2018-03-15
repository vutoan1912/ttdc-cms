angular
    .module('erpApp')
    .controller('BomRdDetailController', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$compile',
        'BomService',
        '$stateParams',
        '$interval',
        'TableCommon',
        '$translate',
        '$window',
        'TranslateCommonUI',
        'masterdataService',
        'apiData',
        function ($scope, $rootScope, $timeout, $compile, BomService, $stateParams, $interval, TableCommon, $translate,$window,TranslateCommonUI,masterdataService,apiData) {

            TranslateCommonUI.init($scope);
            BomService.init($scope);
            masterdataService.init($scope);

            $scope.usable = true;

            /*$scope.bomDetail = {
                productId: null,
                productVersion: null,
                quantity: null,
                name: null,
                reference: null
            };*/

            $scope.bomDetail = {}
            //console.log($stateParams.id);
            BomService.getDetail($stateParams.id).then(function (data) {
                $scope.bomDetail = data;
                //console.log($scope.bomDetail);
            })

            var fields = ["level","productName","productQuantity","uomId","reference","manNames","manPns"];
            var fieldsType = ["Text","Text","NumberRange","Number","Text","Text","Text"];

            var loadFunction = BomService.getBomComponents;
            var buildingParam = $stateParams.id + '/components?';
            TableCommon.initBuildingParam($scope,buildingParam);
            TableCommon.initData($scope, "bomcomponents", fields, fieldsType, loadFunction, function () {
                // delete callback
                //alert("ID: " + $scope.param_check_list);
            });
            TableCommon.reloadPage();

            $scope.urlUomName = '/api/uom/';
            $scope.attrUomName = 'name';

            $scope.urlProductName = '/api/products/';
            $scope.attrProductName = 'name';
            $scope.inputIdProductName = 'product';
            $scope.suffixProductName = '#/products/';
            $scope.prefixProductName = '/details';

            $scope.urlProductVersion = '/api/product-version/';
            $scope.attrProductVersion = 'name';
            $scope.inputIdProductVersion = 'productversion';

            $scope.cutString = function(string){
                if(!string){
                    return '';
                }
                if(string.length > 22)
                    return string.substring(0, 22) + '...';
                else
                    return string;
            }

            $scope.spaceString = function(string){
                if(!string){
                    return '';
                }
                var rtn = '';
                var new_string = string;
                while(new_string.length > 22){
                    var tmp = new_string.substring(0, 22);
                    new_string = new_string.substring(22, new_string.length);
                    rtn = rtn + tmp + ' ';
                }
                rtn = rtn + new_string;

                return rtn;
            }

            $scope.myColumns = ["No.","Level","Product","Quantity","UoM","Reference","Man Name","Man P/N"];
            $scope.myColumnsShow=[];
            for (var i=0; i<$scope.myColumns.length-2;i++){
                $scope.myColumnsShow.push(true);
            }
            for (var i=$scope.myColumns.length - 2; i<$scope.myColumns.length;i++){
                $scope.myColumnsShow.push(false);
            }
            $scope.checkColumnAll = false;
            $scope.handleColumn = function handleColumn() {
                //$scope.checkColumnAll = !$scope.checkColumnAll;
                if ($scope.checkColumnAll){
                    for (var i=0; i < $scope.myColumnsShow.length;i++){
                        $scope.myColumnsShow[i] = true;
                        //  $scope.checkboxType = "container-checkbox-dis"
                    }
                } else {
                    for (var i=0; i < $scope.myColumnsShow.length;i++){
                        $scope.myColumnsShow[i] = false;
                        //  $scope.checkboxType = "container-checkbox-dis"
                    }
                    // $scope.checkboxType = "container-checkbox"
                }
            }

            $scope.status = "Inactive";
            if ( angular.element('#info_detail').length ) {
                $scope.active = "true";
                var statusAction = {
                    true: "Activate",
                    false: "Deactivate"
                }
                var statusTitle = {
                    true: "Active",
                    false: "Inactive"
                }
                var statusStyle ={
                    true: "uk-text-success uk-text-bold",
                    false:"uk-text-danger uk-text-bold"
                }
                if($scope.active){
                    $scope.status = "Active"
                }
                $scope.activeClass = statusStyle[$scope.active]
                $scope.mouseHoverStatus = function(){
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
                };
            }

            //Filter table offline
            function arrayDiffIndex(a, b, c) {
                var i = 0;
                return a.filter(function() {
                    if(b[i] != a[i]){
                        c.push(i);
                    }
                    //console.log(i)
                    //console.log(c)
                    i++;
                    return c;
                });
            };
            //var diffValues = arrayDiff(newTags, oldTags);
            $scope.$watch('param_filter_list', function(new_filter, old_filter) {
                if(angular.isDefined($scope.bomcomponents)){
                    //console.log(new_filter);
                    //console.log(old_filter);
                    //console.log($scope.table_data_origin)

                    var diffIndexes = [];
                    arrayDiffIndex(old_filter, new_filter, diffIndexes);
                    //console.log(diffIndexes);
                    $('#filter_col_'+diffIndexes[0]).addClass("loading");

                    $scope.bomcomponents = $scope.table_data_origin;

                    var array_result = $scope.bomcomponents;
                    var i = 0;
                    angular.forEach(new_filter, function(value) {
                        //console.log(value);
                        var checkFilter = true;
                        if((typeof value) != 'object') {
                            value = value.toString();
                            if(value.length <= 0) checkFilter = false;
                        }
                        //console.log(value);
                        if(checkFilter){
                            array_result = [];
                            angular.forEach($scope.bomcomponents, function(object) {
                                // console.log(object[fields[i]]);
                                if(angular.isDefined(object[fields[i]])){
                                    if(fieldsType[i] == "NumberRange"){
                                        if(value.from == null || value.to == null){
                                            if(object[fields[i]] == null) array_result.push(object);
                                        } else {
                                            if(object[fields[i]] >= value.from && object[fields[i]] <= value.to) array_result.push(object);
                                        }
                                    }else if(fieldsType[i] == "Number"){
                                        if(object[fields[i]] == value) array_result.push(object);
                                    }else{
                                        if(object[fields[i]].toString().includes(value)) array_result.push(object);
                                    }
                                }
                            });
                        }
                        $scope.bomcomponents = array_result;
                        i++;
                    });

                    $('#filter_col_'+diffIndexes[0]).removeClass("loading");
                }
            }, true);

            //Filter UOM
            $scope.cbxUom = {
                keySearch : "name",
                size : "10",
                api : "api/uom",
                chooseUom : null
            };
            $scope.uomDataSource = {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        // console.log(options);
                        apiData.getCbxSearchTable(options, $scope.cbxUom.api, $scope.cbxUom.keySearch, $scope.cbxUom.size).then(function (data) {
                            options.success(data);
                        })
                    }
                }
            };
            $scope.selectUom = function () {
                // console.log($scope.cbxUom.chooseUom);
                if(angular.isDefined($scope.cbxUom.chooseUom) && $scope.cbxUom.chooseUom != null){
                    $scope.param_filter_list[3] = $scope.cbxUom.chooseUom.id;
                } else {
                    $scope.param_filter_list[3] = "";
                }
            }

            $scope.CbxActivate = {
                activateService:BomService.activate,
                deactivateService:BomService.deactivate
            };

            //filter number old
            /*$scope.numberFilter = {
                min : 1,
                max: 200,
                ngModel: {from: 1, to: 200}
            }
            $scope.$watch('numberFilter.ngModel', function(newVal, oldVal) {
                //console.log(newVal)
                if(angular.isDefined(newVal) && newVal != null && newVal != oldVal){
                    $scope.param_filter_list[2] = newVal;
                } else {
                    $scope.param_filter_list[2] = {
                        "from": $scope.numberFilter.minValue,
                        "to": $scope.numberFilter.maxValue
                    };
                }
            }, true);*/

            //filter number range
            $scope.numberFilter = {
                min : 0,
                max: 200,
                numberStart: null,
                numberEnd: null,
                ngModel: {from: 0, to: 200}
            }
            $scope.$watch('numberFilter.ngModel', function(newVal, oldVal) {
                //console.log(newVal)
                if(angular.isDefined(newVal) && newVal != null && newVal != oldVal){
                    $scope.param_filter_list[2] = newVal;
                } else {
                    $scope.param_filter_list[2] = {
                        "from": $scope.numberFilter.min,
                        "to": $scope.numberFilter.max
                    };
                    //console.log($scope.param_filter_list[2])
                }
            }, true);

            /*$("#tbl_rd_detail").css('min-height', $( window ).height() - 264);
            $("#tbl_rd_detail").css('max-height', $( window ).height() - 264);
            angular.element($window).bind('resize', function(){
                $("#tbl_rd_detail").css('min-height', $( window ).height() - 264);
                $("#tbl_rd_detail").css('max-height', $( window ).height() - 264);
            });*/
        }
    ])

    .controller('BomManDetailController', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$compile',
        'BomService',
        '$stateParams',
        '$interval',
        'TableCommon',
        '$translate',
        '$window',
        'TranslateCommonUI',
        'masterdataService',
        'apiData',
        function ($scope, $rootScope, $timeout, $compile, BomService, $stateParams, $interval, TableCommon, $translate,$window,TranslateCommonUI,masterdataService,apiData) {

            TranslateCommonUI.init($scope);
            BomService.init($scope);
            masterdataService.init($scope);

            $scope.usable = true;

            $scope.bomDetail = {}
            //console.log($stateParams.id);
            BomService.getDetail($stateParams.id).then(function (data) {
                $scope.bomDetail = data;
                //console.log($scope.bomDetail);
            })

            var fields = ["level","productName","productOldName","productQuantity","uomId","operationId","reference","partType","note"];
            var fieldsType = ["Text","Text","Text","NumberRange","Number","Number","Text","Number","Text"];

            var loadFunction = BomService.getBomComponents;
            var buildingParam = $stateParams.id + '/components?';
            TableCommon.initBuildingParam($scope,buildingParam);
            TableCommon.initData($scope, "bomcomponents", fields, fieldsType, loadFunction, function () {
                // delete callback
                //alert("ID: " + $scope.param_check_list);
            });
            TableCommon.reloadPage();

            $scope.urlUomName = '/api/uom/';
            $scope.attrUomName = 'name';

            $scope.urlProductName = '/api/products/';
            $scope.attrProductName = 'name';
            $scope.inputIdProductName = 'product';
            $scope.suffixProductName = '#/products/';
            $scope.prefixProductName = '/details';

            $scope.urlProductVersion = '/api/product-version/';
            $scope.attrProductVersion = 'name';
            $scope.inputIdProductVersion = 'productversion';

            $scope.urlBomRdVersion = '/api/boms/';
            $scope.attrBomRdVersion = 'name';
            $scope.inputIdBomRdVersion = 'bomrdversion';
            $scope.suffixBomRdVersion = '#/bom/rd/detail/';
            $scope.prefixBomRdVersion = '';

            $scope.urlRouting = '/api/routing/';
            $scope.attrRouting = 'name';
            $scope.inputIdRouting = 'routing';
            $scope.suffixRouting = '#';
            $scope.prefixRouting = '';

            $scope.urlOperationName = '/api/routing-operation/';
            $scope.attrOperationName = 'name';

            $scope.cutString = function(string){
                if(!string){
                    return '';
                }
                if(string.length > 22)
                    return string.substring(0, 22) + '...';
                else
                    return string;
            }

            $scope.spaceString = function(string){
                if(!string){
                    return '';
                }
                var rtn = '';
                var new_string = string;
                while(new_string.length > 22){
                    var tmp = new_string.substring(0, 22);
                    new_string = new_string.substring(22, new_string.length);
                    rtn = rtn + tmp + ' ';
                }
                rtn = rtn + new_string;

                return rtn;
            }

            $scope.myColumns = ["Level","Product","Old P/N","Quantity","UoM","Routing Operation","Reference","Material Type","Note"];
            $scope.myColumnsShow=[];
            for (var i=0; i<$scope.myColumns.length-2;i++){
                $scope.myColumnsShow.push(true);
            }
            for (var i=$scope.myColumns.length - 2; i<$scope.myColumns.length;i++){
                $scope.myColumnsShow.push(false);
            }
            $scope.checkColumnAll = false;
            $scope.handleColumn = function handleColumn() {
                //$scope.checkColumnAll = !$scope.checkColumnAll;
                if ($scope.checkColumnAll){
                    for (var i=0; i < $scope.myColumnsShow.length;i++){
                        $scope.myColumnsShow[i] = true;
                        //  $scope.checkboxType = "container-checkbox-dis"
                    }
                } else {
                    for (var i=0; i < $scope.myColumnsShow.length;i++){
                        $scope.myColumnsShow[i] = false;
                        //  $scope.checkboxType = "container-checkbox-dis"
                    }
                    // $scope.checkboxType = "container-checkbox"
                }
            }

            $scope.status = "Inactive";
            if ( angular.element('#info_detail').length ) {
                $scope.active = "true";
                var statusAction = {
                    true: "Activate",
                    false: "Deactivate"
                }
                var statusTitle = {
                    true: "Active",
                    false: "Inactive"
                }
                var statusStyle ={
                    true: "uk-text-success uk-text-bold",
                    false:"uk-text-danger uk-text-bold"
                }
                if($scope.active){
                    $scope.status = "Active"
                }
                $scope.activeClass = statusStyle[$scope.active]
                $scope.mouseHoverStatus = function(){
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
                };
            }

            $scope.getPartType = function (value) {
                switch(value) {
                    case 2:
                        return "Phụ";
                        break;
                    case 3:
                        return "Tiêu hao";
                        break;
                    case 4:
                        return "Output";
                        break;
                    default:
                        return "Chính";
                }
            }

            //Filter table offline
            function arrayDiffIndex(a, b, c) {
                var i = 0;
                return a.filter(function() {
                    if(b[i] != a[i]){
                        c.push(i);
                    }
                    //console.log(i)
                    //console.log(c)
                    i++;
                    return c;
                });
            };
            //var diffValues = arrayDiff(newTags, oldTags);
            $scope.$watch('param_filter_list', function(new_filter, old_filter) {
                if(angular.isDefined($scope.bomcomponents)){
                    //console.log(new_filter);
                    //console.log(old_filter);
                    //console.log($scope.table_data_origin)

                    var diffIndexes = [];
                    arrayDiffIndex(old_filter, new_filter, diffIndexes);
                    //console.log(diffIndexes);
                    $('#filter_col_'+diffIndexes[0]).addClass("loading");

                    $scope.bomcomponents = $scope.table_data_origin;

                    var array_result = $scope.bomcomponents;
                    var i = 0;
                    angular.forEach(new_filter, function(value) {
                        //console.log(value);
                        var checkFilter = true;
                        if((typeof value) != 'object') {
                            value = value.toString();
                            if(value.length <= 0) checkFilter = false;
                        }
                        //console.log(value);
                        if(checkFilter){
                            array_result = [];
                            angular.forEach($scope.bomcomponents, function(object) {
                                // console.log(object[fields[i]]);
                                if(angular.isDefined(object[fields[i]])){
                                    if(fieldsType[i] == "NumberRange"){
                                        if(value.from == null || value.to == null){
                                            if(object[fields[i]] == null) array_result.push(object);
                                        } else {
                                            if(object[fields[i]] >= value.from && object[fields[i]] <= value.to) array_result.push(object);
                                        }
                                    }else if(fieldsType[i] == "Number"){
                                        if(object[fields[i]] == value) array_result.push(object);
                                    }else{
                                        if(object[fields[i]].toString().includes(value)) array_result.push(object);
                                    }
                                }
                            });
                        }
                        $scope.bomcomponents = array_result;
                        i++;
                    });

                    $('#filter_col_'+diffIndexes[0]).removeClass("loading");
                }
            }, true);

            //Filter UOM
            $scope.cbxUom = {
                keySearch : "name",
                size : "10",
                api : "api/uom",
                chooseUom : null
            };
            $scope.uomDataSource = {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        // console.log(options);
                        apiData.getCbxSearchTable(options, $scope.cbxUom.api, $scope.cbxUom.keySearch, $scope.cbxUom.size).then(function (data) {
                            options.success(data);
                        })
                    }
                }
            };
            $scope.selectUom = function () {
                // console.log($scope.cbxUom.chooseUom);
                if(angular.isDefined($scope.cbxUom.chooseUom) && $scope.cbxUom.chooseUom != null){
                    $scope.param_filter_list[4] = $scope.cbxUom.chooseUom.id;
                } else {
                    $scope.param_filter_list[4] = "";
                }
            }

            //Filter routing operation
            $scope.cbxRoutingOperation = {
                keySearch : "name",
                size : "10",
                api : "api/routing-operation",
                choose : null
            };
            $scope.routingOperationDataSource = {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        // console.log(options);
                        apiData.getCbxSearchTable(options, $scope.cbxRoutingOperation.api, $scope.cbxRoutingOperation.keySearch, $scope.cbxRoutingOperation.size).then(function (data) {
                            // console.log(data);
                            options.success(data);
                        })
                    }
                }
            };
            $scope.selectRoutingOperation = function () {
                // console.log($scope.cbxRoutingOperation.choose);
                if(angular.isDefined($scope.cbxRoutingOperation.choose) && $scope.cbxRoutingOperation.choose != null){
                    $scope.param_filter_list[5] = $scope.cbxRoutingOperation.choose.id;
                } else {
                    $scope.param_filter_list[5] = "";
                }
            }

            //Filter material type
            $scope.cbxMaterialType = {
                choose : null
            };
            $scope.materialTypeDataSource = [
                {id:1, name: 'Chính'},
                {id:2, name: 'Phụ'},
                {id:3, name: 'Tiêu hao'},
                {id:4, name: 'Output'}
            ];
            $scope.selectMaterialType = function () {
                if(angular.isDefined($scope.cbxMaterialType.choose) && $scope.cbxMaterialType.choose != null){
                    $scope.param_filter_list[7] = $scope.cbxMaterialType.choose.id;
                } else {
                    $scope.param_filter_list[7] = "";
                }
            }

            $scope.CbxActivate = {
                activateService:BomService.activate,
                deactivateService:BomService.deactivate
            };

            //filter number range
            $scope.numberFilter = {
                min : 0,
                max: 200,
                numberStart: null,
                numberEnd: null,
                ngModel: {from: 0, to: 200}
            }
            $scope.$watch('numberFilter.ngModel', function(newVal, oldVal) {
                // console.log(newVal)
                if(angular.isDefined(newVal) && newVal != null && newVal != oldVal){
                    $scope.param_filter_list[3] = newVal;
                } else {
                    $scope.param_filter_list[3] = {
                        "from": $scope.numberFilter.min,
                        "to": $scope.numberFilter.max
                    };
                }
            }, true);

            /*$("#tbl_man_detail").css('min-height', $( window ).height() - 264);
            $("#tbl_man_detail").css('max-height', $( window ).height() - 264);
            angular.element($window).bind('resize', function(){
                $("#tbl_man_detail").css('min-height', $( window ).height() - 264);
                $("#tbl_man_detail").css('max-height', $( window ).height() - 264);
            });*/
        }
    ])
;