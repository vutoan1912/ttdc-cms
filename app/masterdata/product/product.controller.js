(function(){
    'use strict';
    angular.module('erpApp')
        .controller('ProductController',ProductController);

    ProductController.$inject= ['$scope', '$rootScope', '$timeout', '$compile', 'Product', '$stateParams', '$interval', 'TableMultiple', '$translate', '$window', 'Category','ErrorHandle','$state']
    function ProductController ($scope, $rootScope, $timeout, $compile, Product, $stateParams, $interval, TableMultiple, $translate,$window,Category,ErrorHandle,$state) {
        $scope.category = {}
        $scope.columnsName = {
            Id: "masterdata.column.Id",
            Name: "masterdata.column.Name",
            Category: "masterdata.column.Category",
            Description: "masterdata.column.Description",
            Type: "masterdata.column.Type",
            Uom: "masterdata.column.Uom",
            Created: "masterdata.column.Created",
            Active: "masterdata.column.Active",
            Cost: "masterdata.column.Cost",
            QoH:"masterdata.column.QoH",
            AQ:"masterdata.column.AQ",
            PM:"masterdata.column.PM",
            attach:"masterdata.column.attach",
            cname:"masterdata.column.cname",
            parent:"masterdata.column.parent"
        }

        $scope.button = {
            addCate: "masterdata.button.addCate",
            Rename: "masterdata.button.Rename",
            Remove: "masterdata.button.Remove",
            Create: "masterdata.button.Create",
            Edit: "masterdata.button.Edit",
            Back: "masterdata.button.Back",
            Delete: "masterdata.button.Delete",
            Clear:"masterdata.button.Clear",
        }

        $scope.common = {
            Search: "masterdata.common.Search",
            Home: "masterdata.common.Home",
            Products: "masterdata.common.Products",
            Product: "masterdata.common.Product",
            GenInfo: "masterdata.common.GenInfo",
            Inventory: "masterdata.common.Inventory",
            Purchase: "masterdata.common.Purchase",
            nodata: "masterdata.common.nodata",
            version:"masterdata.common.version",
            attFfile:"masterdata.common.attFfile"
        }

        $scope.msg = {
            "showCate":"masterdata.messages.showCate",
            "hideCate":"masterdata.messages.hideCate"
        }
        $scope.maxLengthRule = "error.common.maxLengthRule";
        $scope.required_msg = 'admin.messages.required'

        $scope.CbxCreatedBy ={
            url:'/api/users/search?query=',
            key:'email',
            attr:'email',
            prefix:'#/users/',
            suffix:'/detail'
        }

        if (angular.element('#info_detail').length) {
            //get product and render detail page
            Product.getOneMv($stateParams.productId).then(function (data) {
                $scope.nodataMsg = false
                $scope.manTable = []
                $scope.product = data
                $scope.manTable = $scope.product.man
                if ($scope.manTable.length > 0) {
                    $scope.nodataMsg = true
                }

                $scope.status = "Inactive"

                $scope.active = $scope.product.active
                var statusAction = {
                    true: "Activate",
                    false: "Deactivate"
                }
                var statusTitle = {
                    true: "Active",
                    false: "Inactive"
                }
                var statusStyle = {
                    true: "uk-text-success uk-text-bold",
                    false: "uk-text-danger uk-text-bold"
                }
                if ($scope.active) {
                    $scope.status = "Active"
                }
                $scope.activeClass = statusStyle[$scope.active]
                // $scope.mouseHoverStatus = function () {
                //     $scope.active = !$scope.active
                //     $scope.status = statusAction[$scope.active]
                //     $scope.activeClass = statusStyle[$scope.active]
                // };
                // $scope.mouseLeaveStatus = function () {
                //     $scope.active = !$scope.active
                //     $scope.status = statusTitle[$scope.active]
                //     $scope.activeClass = statusStyle[$scope.active]
                // };
                //get bom count
                if ($scope.product.type == 3){
                    Product.countRdBoM($stateParams.productId).then(function (data) {
                        $scope.rd_bom_count = data
                    })
                } else {
                    $scope.rd_bom_count=''
                }
                
                Product.getOnhandQuantity($stateParams.productId).then(function (data) {
                    $scope.onhandQuantity = data
                })

                Product.getAvailableQuantity($stateParams.productId).then(function (data) {
                    $scope.availableQuantity = data
                })

                $scope.goToBoM = function () {
                    if ($scope.product.type == 3){
                        $state.go('bom', {product_id: $scope.product.id});
                    }
                }

                $scope.goToProductMove = function () {
                    $state.go('product-move', {product_id: $scope.product.id});
                }

                $scope.goToStockOnHand = function () {
                    $state.go('stock-quantity', {product_id: $scope.product.id});
                }
            })


            //handler attachments
            var fileSeq =1
            $('#attachmentBtn').change(function(e){
                var fileName = e.target.files[0].name;
                list_file_size +=e.target.files[0].size
                if (list_file_size > 2000000000){
                    alert ("file qua to")
                }
                if ($('#input_att_1').val().length ==0){
                    $('#input_att_1').val(fileName)
                } else {
                    fileSeq +=1
                    var newId = "att_btn" + fileSeq
                    var newFile = '<div class="uk-input-group" id="att_btn_' + fileSeq + '">'
                    newFile +='<input readonly type="text" class="md-input" id="' + newId + '">'
                    newFile +='<span  class="uk-input-group-addon custom-cursor-poiter" onclick="{{removeFile(event)}}" >'
                    newFile +='<i id="btn_' + fileSeq + '" class="material-icons" href="#"  class="material-icons">&#xE14C;</i></span></div>'
                    $('#listFile').append(newFile)
                    $('#' +newId).val(fileName)

                }

            });

        }

        $scope.getType = function getType(type) {
            if (type == 1) {
                return "Part"
            }
            if (type == 2) {
                return "Semi"
            }
            if (type == 3) {
                return "Final Product"
            }

        }

        $scope.parseManPn = function parseManPn(manPn) {
            if(manPn[0]){
                return manPn.toString()
            } else {
                return "N/A"
            }
        }

        $scope.showClear = function () {
            if($("#filter_input").val() != ''){
                return false;
            } return true
        }

    }

    var list_file_size= 0
    function removeFile(event) {
        $('#inputAtt').val('')
        if (event.target.id == 'btn_1'){
            $('#input_att_1').val('')
        } else {
            $('#'+'att_'+event.target.id).remove()
        }
    }
})();


