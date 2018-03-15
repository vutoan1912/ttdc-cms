

(function(){
    'use strict';
    angular.module('erpApp')
        .controller('SubSupplierDetailController',SubSupplierDetailController);

    SubSupplierDetailController.$inject = ['$rootScope','$scope','$state','Supplier','AlertService','$translate','variables', 'TableCommon','$http','$stateParams'];
    function SubSupplierDetailController($rootScope,$scope, $state, Supplier, AlertService,$translate, variables, TableCommon,$http,$stateParams) {
        var vm = this;
        $scope.myColumns = ["Manufacturer Alias","Manufacturer Address","Manufacturer Phone","Manufacturer Email","Quality"];
        $scope.myColumnsShow=[];
        for (var i=0; i<$scope.myColumns.length;i++){
            $scope.myColumnsShow.push(true);
        }
        if($stateParams.id){
            $scope.id = $stateParams.id;
            Supplier.getOneModel($stateParams.id).then(function (data) {
                $scope.man_detail = data[0];
            });
            var fields = ["id", "alias" , "addressLine_1", "phoneNumber","email","rating"];
            var fieldsType = ["Number","Text","Text","Text","Text","Text","Text"];
            Supplier.idSup = $scope.id;
            var loadFunction = Supplier.getPageManOfSupp;
            TableCommon.initData($scope, "list_sup", fields,fieldsType, loadFunction, function () {
                // delete callback
                // alert("ID: "+ $scope.param_check_list);
            });
            TableCommon.reloadPage();
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


        function moveScroll(){
            var scroll = $(window).scrollTop();
            var anchor_top = $("#ts_pager_filter").offset().top;
            var anchor_bottom = $("#bottom_anchor").offset().top;
            if (scroll>anchor_top && scroll<anchor_bottom) {
                var clone_table = $("#clone");
                if(clone_table.length == 0){
                    clone_table = $("#ts_pager_filter").clone();
                    clone_table.attr('id', 'clone');
                    clone_table.css({position:'fixed' ,
                        'pointer-events': 'none',
                        top: '120px'});
                    clone_table.width($("#ts_pager_filter").width());
                    $("#table-container").append(clone_table);
                    $("#clone").css({visibility:'hidden'});
                    $("#clone thead").css({visibility:'visible'
                    });
                }
            } else {
                $("#clone").remove();
            }
        }
        $(window).scroll(moveScroll);

        $scope.cutString = function(string){
            if(!string){
                return '';
            }
            var rtn = '';
            var new_string = string;
            while(new_string.length > 20){
                var tmp = new_string.substring(0, 20);
                new_string = new_string.substring(20, new_string.length);
                rtn = rtn + tmp + ' ';
            }
            rtn = rtn + new_string;

            return rtn;
        }

    }

})();