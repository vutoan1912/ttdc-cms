

(function(){
    'use strict';
    angular.module('erpApp')
        .controller('SupplierDetailController',SupplierDetailController);

    SupplierDetailController.$inject = ['$rootScope','$scope','$state','Supplier','AlertService','$translate','variables', 'TableCommon','$http','$stateParams','TranslateCommonUI', '$window'];
    function SupplierDetailController($rootScope,$scope, $state, Supplier, AlertService,$translate, variables, TableCommon,$http,$stateParams,TranslateCommonUI,$window) {
        var vm = this;
        TranslateCommonUI.init($scope);
        if($stateParams.id){
            $scope.id = $stateParams.id;
            Supplier.getOneModel($stateParams.id).then(function (data) {
                $scope.man_detail = data[0];
                $scope.myColumnsDetail = ["VNPT PN","Description","Manufacturer Alias","Manufacturer PN","Created","Created By"];
                $scope.myColumnsShowDetail=[];
                for (var i=0; i<$scope.myColumnsDetail.length-2;i++){
                    $scope.myColumnsShowDetail.push(true);
                }
                var fields = ["id", "name","description", "manNames" , "manPnValues","created","createdBy"];
                var fieldsType = ["Number","Text","Text","Text","Text","Number","Text"]
                var loadFunction = Supplier.getAllMv;
                var handleAfterReload = Supplier.handleAfterReload;
                TableCommon.initCustomData($scope, handleAfterReload, $scope.man_detail);
                TableCommon.initData($scope, "list_part", fields,fieldsType, loadFunction, function () {
                    // delete callback
                    alert("ID: " + $scope.param_check_list);
                });

                var n = $scope.man_detail.name.indexOf("&");
                if(n!=-1){
                    var nameSearch = $scope.man_detail.name.substring(0, n);
                    var moreParam  = 'supplierNames=="*'+nameSearch+'*"';
                }else{
                    var moreParam  = 'supplierNames=="*'+$scope.man_detail.name+'*"';
                }
                TableCommon.moreParamReloadPage(moreParam);
                Supplier.getAllManOfSup($stateParams.id).then(function (data) {
                    $scope.number_man = data.length;
                });
            })
            $scope.selectize_pageNum_options = [];
            $scope.selectize_page_options = [];
            $scope.selectize_page = 1;
            $scope.CbxCreatedBy ={
                url:'/api/users/search?query=',
                key:'email',
                attr:'email',
                prefix:'#/users/',
                suffix:'/detail'
            };
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