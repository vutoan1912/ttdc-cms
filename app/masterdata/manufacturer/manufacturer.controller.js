

(function(){
    'use strict';
    angular.module('erpApp')
        .controller('ManufacturerController',ManufacturerController);

    ManufacturerController.$inject = ['$rootScope','$scope','$state','Manufacturer','AlertService','$translate','variables', 'TableMultiple','$http','$stateParams','$window','TranslateCommonUI','$timeout'];
    function ManufacturerController($rootScope,$scope, $state, Manufacturer, AlertService,$translate, variables, TableMultiple,$http,$stateParams,$window,TranslateCommonUI,$timeout) {

        var vm = this;
        angular.element($window).bind('resize', function(){
            $scope.fullsize = {
                "height":$( window ).height() - 400
            }
        });
        $scope.fullsize = {
            "height":$( window ).height() - 400
        }

        TranslateCommonUI.init($scope);
        $scope.myColumns = ["Manufacturer Code","Manufacturer Name","Manufacturer Alias","Quality","Created","Created By"];
        $scope.myColumnsShow=[];
        for (var i=0; i<$scope.myColumns.length;i++){
            $scope.myColumnsShow.push(true);
        }

        var fields = ["id", "companyCode","name" , "alias", "rating","created","createdBy"];
        var fieldsType = ["Number","Text","Text","Text","Text","DateTime","Text"];
        var loadFunction = Manufacturer.getPage;
        var newTableIds = {
            idTable: "table_ot",
            model: "list_man",
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
            customParams: "type==man",
            pager_id: "table_ot_pager",
            selectize_page_id: "rd_selectize_page",
            selectize_pageNum_id: "rd_selectize_pageNum"
        }


        TableMultiple.initTableIds($scope, newTableIds);
        TableMultiple.sortDefault(newTableIds.idTable);
        TableMultiple.reloadPage(newTableIds.idTable);

        $scope.DatetimeRange1 = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_ot'], // ** table filter
            Column: 5, // ** number column filter on table
            Scope: $scope
        }
        $scope.CbxCreatedBy ={
            url:'/api/users/search?query=',
            key:'email',
            attr:'email',
            prefix:'#/users/',
            suffix:'/detail'
        };

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
                console.log("HOVER: "+$scope.status)
            };
            $scope.mouseLeaveStatus = function(){
                $scope.active = !$scope.active
                $scope.status = statusTitle[$scope.active]
                $scope.activeClass = statusStyle[$scope.active]
                console.log("LEAVE: "+$scope.status)
            };
        }
        $scope.check = {// List checked for delete many
            list: []
        };

        $scope.list_li = ['0','1','2','3','4','5'];
        
        $scope.checkListChoose = function (item) {
            // console.log(item);
            var exist = $scope.check.list.indexOf(parseInt(item));
            if (exist != -1) {
                // Xóa phần tử 1 mảng
                    $scope.check.list.splice(exist,1);

            } else {
                // Thêm phần tử vào mảng
                $scope.check.list.push(parseInt(item));
            }
            // console.log($scope.check.list);
        };
        $scope.$watchCollection('check.list', function() {
            if(!$stateParams.id){
                if($scope.check.list.length > 0){
                    var array_rating = $scope.check.list.toString();
                    newTableIds.customParams = "type==man;rating=in=(" + array_rating+")";
                    TableMultiple.reloadPage(newTableIds.idTable);
                    //TableCommon.moreParamReloadPage("type==man;rating=in=("+array_rating+")");
                }else{
                    newTableIds.customParams = "type==man";
                    TableMultiple.reloadPage(newTableIds.idTable);
                   // TableCommon.moreParamReloadPage("type==man");
                }
            }


        });
        $scope.cutString = function(string){
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

        $scope.$watch('TABLES[\'table_ot\'].selectize_pageNum', function() {
            var elem =  document.getElementById("table_ot");

            function transformTable() {
                // reset display styles so column widths are correct when measured below
                angular.element(elem.querySelectorAll('thead, tbody, tfoot')).css('display', '');
                // wrap in $timeout to give table a chance to finish rendering
                $timeout(function () {
                    // set widths of columns
                    angular.forEach(elem.querySelectorAll('tr:first-child th'), function (thElem, i) {

                        var tdElems = elem.querySelector('tbody tr:first-child td:nth-child(' + (i + 1) + ')');
                        var tfElems = elem.querySelector('tfoot tr:first-child td:nth-child(' + (i + 1) + ')');

                         var columnWidth = thElem.offsetWidth;
                        console.log(columnWidth);
                        if (tdElems && i >0) {
                           // tdElems.style.width = columnWidth  + 'px';
                            tdElems.style.width =  '20%';
                        }
                        if (thElem && i >0) {
                            //thElem.style.width = columnWidth  + 'px';
                            thElem.style.width = '20%';
                        }
                        if (tfElems && i >0) {
                            tfElems.style.width = columnWidth + 'px';
                        }
                    });

                    // set css styles on thead and tbody
                    angular.element(elem.querySelectorAll('thead, tfoot')).css('display', 'block');

                    angular.element(elem.querySelectorAll('tbody')).css({
                        'display': 'block',
                        'height': 'inherit',
                        'overflow': 'auto'
                    });

                });
            }

            transformTable();



        });


    }

})();