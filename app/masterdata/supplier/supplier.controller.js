

(function(){
    'use strict';
    angular.module('erpApp')
        .controller('SupplierController',SupplierController);

    SupplierController.$inject = ['$rootScope','$scope','$state','Supplier','AlertService','$translate','variables', 'TableMultiple','$http','$stateParams','TranslateCommonUI', '$window'];
    function SupplierController($rootScope,$scope, $state, Supplier, AlertService,$translate, variables, TableMultiple,$http,$stateParams,TranslateCommonUI,$window) {
        var vm = this;
        TranslateCommonUI.init($scope);

            $scope.myColumns = ["Supplier Name","Supplier Alias","Contact Name","Quanlity","Created","Created By"];
            $scope.myColumnsShow=[];
            for (var i=0; i<$scope.myColumns.length;i++){
                $scope.myColumnsShow.push(true);
            }
            $scope.CbxCreatedBy ={
                url:'/api/users/search?query=',
                key:'email',
                attr:'email',
                prefix:'#/users/',
                suffix:'/detail'
            };

            var fields = ["id", "name" , "alias", "contactName","rating","created","createdBy"];
            var fieldsType = ["Number","Text","Text","Text","Text","Number","Text"]
            // var loadFunction = Supplier.getPage;
            // TableCommon.initData($scope, "list_man", fields,fieldsType, loadFunction, function () {
            //     // delete callback
            //     alert("ID: "+ $scope.param_check_list);
            // });
            // TableCommon.moreParamReloadPage("type==sup;active==1");

            var loadFunction = Supplier.getPage;
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
                customParams: "type==sup",
                pager_id: "table_ot_pager",
                selectize_page_id: "rd_selectize_page",
                selectize_pageNum_id: "rd_selectize_pageNum"
            }


            TableMultiple.initTableIds($scope, newTableIds);
            TableMultiple.sortDefault(newTableIds.idTable);
            TableMultiple.reloadPage(newTableIds.idTable);

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
                if($scope.check.list.length > 0){
                    var array_rating = $scope.check.list.toString();
                    newTableIds.customParams = "type==sup;rating=in=(" + array_rating+")";
                    TableMultiple.reloadPage(newTableIds.idTable);
                    //TableCommon.moreParamReloadPage("type==man;rating=in=("+array_rating+")");
                }else{
                    newTableIds.customParams = "type==sup";
                    TableMultiple.reloadPage(newTableIds.idTable);
                    // TableCommon.moreParamReloadPage("type==man");
                }
            });

        angular.element($window).bind('resize', function(){
            $scope.fullsize = {
                "height":$( window ).height() - 300
            }
        });
        $scope.fullsize = {
            "height":$( window ).height() - 300
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
                console.log("HOVER: "+$scope.status)
            };
            $scope.mouseLeaveStatus = function(){
                $scope.active = !$scope.active
                $scope.status = statusTitle[$scope.active]
                $scope.activeClass = statusStyle[$scope.active]
                console.log("LEAVE: "+$scope.status)
            };
        }


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

        // function moveScroll(){
        //     var scroll = $(window).scrollTop();
        //     var anchor_top = $("#ts_pager_filter").offset().top;
        //     var anchor_bottom = $("#bottom_anchor").offset().top;
        //     if (scroll>anchor_top && scroll<anchor_bottom) {
        //         var clone_table = $("#clone");
        //         if(clone_table.length == 0){
        //             clone_table = $("#ts_pager_filter").clone();
        //             clone_table.attr('id', 'clone');
        //             clone_table.css({position:'fixed' ,
        //                 'pointer-events': 'none',
        //                 top: '120px'});
        //             clone_table.width($("#ts_pager_filter").width());
        //             $("#table-container").append(clone_table);
        //             $("#clone").css({visibility:'hidden'});
        //             $("#clone thead").css({visibility:'visible'
        //             });
        //         }
        //     } else {
        //         $("#clone").remove();
        //     }
        // }
        // $(window).scroll(moveScroll);

    }

})();