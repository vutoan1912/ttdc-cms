

(function(){
    'use strict';
    angular.module('erpApp')
        .controller('ManufacturerDetailController',ManufacturerController);

    ManufacturerController.$inject = ['$rootScope','$scope','$state','Manufacturer','AlertService','$translate','variables', 'TableCommon','$http','$stateParams','$window','TranslateCommonUI'];
    function ManufacturerController($rootScope,$scope, $state, Manufacturer, AlertService,$translate, variables, TableCommon,$http,$stateParams,$window,TranslateCommonUI) {
        var vm = this;
        TranslateCommonUI.init($scope);

        $scope.id = $stateParams.id;
        Manufacturer.getOneModel($stateParams.id).then(function (data) {
            $scope.man_detail = data[0];
            var fields = ["id", "name","description" , "manPnValues", "supplierNames","created","createdBy"];
            var fieldsType = ["Number","Text","Text","Text","Text","Number","Text"];
            var loadFunction = Manufacturer.getAllMv;
            var handleAfterReload = Manufacturer.handleAfterReload;
            TableCommon.initCustomData($scope, handleAfterReload, $scope.man_detail);

            //$scope.selectize_page_options = [];
            TableCommon.initData($scope, "list_part", fields,fieldsType, loadFunction, function () {
                // delete callback
                // alert("ID: "+ $scope.param_check_list);
                //console.log($scope.selectize_page_options);
                alert("ID: " + $scope.param_check_list);
            });
            var n = $scope.man_detail.name.indexOf("&");
            if(n!=-1){
                var nameSearch = $scope.man_detail.name.substring(0, n);
                var moreParam  = 'manNames=="*'+nameSearch+'*"';
            }else{
                var moreParam  = 'manNames=="*'+$scope.man_detail.name+'*"';
            }

            TableCommon.moreParamReloadPage(moreParam);
            $scope.myColumnsDetail = ["VNPT MAN PN","Description","Manufacturer PN","Supplier","Created","Created By"];
            $scope.myColumnsShowDetail=[];
            for (var i=0; i<$scope.myColumnsDetail.length-2;i++){
                $scope.myColumnsShowDetail.push(true);
            }
            Manufacturer.getAllSupOfMan($stateParams.id).then(function (data) {
                    $scope.number_suppplier = data.length;
            });
        });

        $scope.selectize_pageNum_options = [];
        $scope.selectize_page_options = [];

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
        $scope.CbxCreatedBy ={
            url:'/api/users/search?query=',
            key:'email',
            attr:'email',
            prefix:'#/users/',
            suffix:'/detail'
        };

        $scope.list_li = ['1','2','3','4','5'];
        
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
                    TableCommon.moreParamReloadPage("type==man;rating=in=("+array_rating+")");
                }else{
                    TableCommon.moreParamReloadPage("type==man");
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

        // function moveScroll(){
        //     var scroll = $(window).scrollTop();
        //     var anchor_top = $("#ts_pager_filter").offset().top;
        //     var anchor_bottom = $("#bottom_anchor").offset().top;
        //     if (scroll>anchor_top && scroll<anchor_bottom) {
        //         var clone_table = $("#clone");
        //         if(clone_table.length == 0){
        //           clone_table = $("#ts_pager_filter").clone();
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