(function(){
    'use strict';
    angular.module('erpApp')
        .controller('UomDetailController',UomDetailController);

    UomDetailController.$inject = ['$rootScope','$scope','$state','$stateParams','Uom','UomCategory','AlertService','$translate','variables'];
    function UomDetailController($rootScope,$scope, $state, $stateParams, Uom, UomCategory, AlertService,$translate, variables) {
        var vm = this;

        $scope.common = {
            Search:"masterdata.common.Search",
            Home:"masterdata.common.Home",
            Uom:"masterdata.column.Unit",
            ViewDetail:"masterdata.button.ViewDetail",
            Edit:"masterdata.button.Edit",
            Cancel:"masterdata.button.Cancel",
            Create:"masterdata.button.Create",
            Configuration:"masterdata.common.configuration",
            Delete:"common-ui-element.button.Delete",
        }


        $scope.uom_category_config = {
            valueField: 'id',
            labelField: 'name',
            create: false,
            maxItems: 1,
            placeholder: 'Select Category...'
        };


        $scope.uom_category_options = [{}];

        UomCategory.getAll().then(function (data) {
            $scope.uom_category_options = data;
        });

        $scope.uom_type_config = {
            valueField: 'id',
            labelField: 'name',
            create: false,
            maxItems: 1,
            placeholder: 'Select Type...'
        };

        $scope.uom_type_options = [
            {
                "id": "Reference Unit of Measure for this category",
                "name": "Reference Unit of Measure for this category"
            },
            {
                "id": "Smaller than the reference Unit of Measure",
                "name": "Smaller than the reference Unit of Measure"
            },
            {
                "id": "Bigger than the reference Unit of Measure",
                "name": "Bigger than the reference Unit of Measure"
            }
        ];

        var statusStyle = {
            true: "uk-text-success uk-text-bold",
            false: "uk-text-danger uk-text-bold"
        }

        $scope.uom = {};

        Uom.getUomById($stateParams.uomId).then(function (data) {
            $scope.uom = data;
            $scope.status = "Inactive"
            $scope.active = $scope.uom.active
            if ($scope.active) {
                $scope.status = "Active"
            }
            $scope.activeClass = statusStyle[$scope.active]

            UomCategory.getById($scope.uom.categoryId).then(function (data1) {
                $scope.uom.category = data1.name;
            })

        })

        $scope.CbxActivate = {
            activateService:Uom.activateByListIDs,
            deactivateService:Uom.deactivateByListIDs
        }

        $scope.deleleUomById = function (uomId) {
            UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                Uom.deleteById($scope.uom.id).then(function () {
                    $state.go('uoms');
                }).catch(function(data){
                    ErrorHandle.handleError(data);
                })


            }, {
                labels: {
                    'Ok': $translate.instant("common-ui-element.button.Delete"),
                    'Cancel': $translate.instant("common-ui-element.button.Close")
                }
            });
        }

    }

})();