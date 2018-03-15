(function(){
    'use strict';
    angular.module('erpApp')
        .controller('UomEditController',UomEditController);

    UomEditController.$inject = ['$rootScope','$scope','$state','$stateParams','Uom','UomCategory','AlertService','$translate','variables','ErrorHandle','apiData','$http',];
    function UomEditController($rootScope,$scope, $state, $stateParams, Uom, UomCategory, AlertService,$translate, variables, ErrorHandleErrorHandle,apiData,$http) {
        var vm = this;

        $scope.common = {
            Search:"masterdata.common.Search",
            Home:"masterdata.common.Home",
            Uom:"masterdata.column.Unit",
            Edit:"masterdata.button.Edit",
            Save:"masterdata.button.Save",
            Cancel:"masterdata.button.Cancel",
            Configuration:"masterdata.common.configuration",
        }

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
        })

        var queryCategory = "query=id>1"
        UomCategory.getByPage(queryCategory).then(function (data) {

            $scope.cbxSrc2UomCateInit = {
                url: '/api/uom-category', // ** api load data
                OriginParams: 'active==true;id>1', // ** init params -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.cbxSrc2UomCate = { // ** replace name cbx
                ngModel : $scope.uom.categoryId, // ** value select -- array []
                Options: data, // ** list options cbx, default: []
                Table : null, // ** table filter
                Column : null, // ** number column filter on table
                Scope : $scope,
                Config: {
                    plugins: ['infinite_scroll'],//enable load more
                    maxItems: 1,
                    valueField: $scope.cbxSrc2UomCateInit.valueField,
                    labelField: $scope.cbxSrc2UomCateInit.labelField,
                    searchField: $scope.cbxSrc2UomCateInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' +
                                '<span class="title">' + escape(data[$scope.cbxSrc2UomCateInit.labelField]) + '</span>' +
                                '</div>';
                        },
                        item: function(data, escape) {
                            //return '<div class="item"><a href="' + escape(data[$scope.cbxSrc2UomCateInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxSrc2UomCateInit.labelField]) + '</a></div>';
                            return '<div class="item">' + escape(data[$scope.cbxSrc2UomCateInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        query = JSON.parse(query)
                        if($scope.cbxSrc2UomCateInit.resetScroll){
                            query.page = 0;
                            callback($scope.cbxSrc2UomCateInit.resetScroll);
                            $scope.cbxSrc2UomCateInit.resetScroll = false;
                        }
                        $scope.cbxSrc2UomCateInit.page = query.page || 0;
                        if(!$scope.cbxSrc2UomCateInit.totalCount || $scope.cbxSrc2UomCateInit.totalCount > ( ($scope.cbxSrc2UomCateInit.page - 1) * $scope.cbxSrc2UomCateInit.perPage) ){
                            var api = apiData.genApi($scope.cbxSrc2UomCateInit.url, $scope.cbxSrc2UomCateInit.searchField, query.search, $scope.cbxSrc2UomCateInit.perPage, null, $scope.cbxSrc2UomCateInit.OriginParams,query.page,$scope.cbxSrc2UomCateInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.cbxSrc2UomCateInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

        });

        $scope.CbxActivate = {
            activateService:Uom.activateByListIDs,
            deactivateService:Uom.deactivateByListIDs
        }

        // $scope.changeActive = function () {
        //     // UIkit.modal.confirm($translate.instant("masterdata.messages.changeStatusUom"), function () {
        //         $scope.active = !$scope.active;
        //         $scope.uom.active = !$scope.uom.active;
        //         if ($scope.active) {
        //             $scope.status = "Active"
        //         } else {
        //             $scope.status = "Inactive"
        //         }
        //         $scope.activeClass = statusStyle[$scope.active]
        //
        //     // }, {
        //     //     labels: {
        //     //         'Ok': $translate.instant("masterdata.button.Yes"),
        //     //         'Cancel': $translate.instant("masterdata.button.No")
        //     //     }
        //     // });
        // }

        $scope.submit = function() {
            $('#form_createuom').parsley();
            if($scope.form_createuom.$valid){
                Uom.update($scope.uom)
                    .then(function(data){
                        $state.go('uoms-detail',{uomId: $scope.uom.id });
                    })
                    .catch(function(data){
                        ErrorHandle.handleError(data);
                    })
            }
        };

        if ( angular.element('#form_createuom').length ) {
            $scope.required_msg = $translate.instant('admin.messages.required')
            var $formValidate = $('#form_createuom');
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

        $scope.validateButton = function () {
            if($scope.form_createuom.$valid && $("#unit").val().length <= 255){
                $("#editUom").removeClass("hideElement");
                return true;
            } else {
                $("#editUom").addClass("hideElement");
                return false;
            }
        }

        $scope.maxLengthRule = "masterdata.messages.maxLengthRule";
        $scope.wrongPatternRule = "masterdata.messages.wrongPatternRule"

        $scope.cbxSrc2UomCateInit = {
            url: '/api/uom-category', // ** api load data
            OriginParams: 'active==true;id>1', // ** init params -- default: null
            queryRelate : null, // ** init query relate cbx -- default: null
            valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
            perPage: 10, totalCount: null, page: 0, resetScroll: false
        }
        $scope.cbxSrc2UomCate = { // ** replace name cbx
            ngModel : $scope.uom.categoryId, // ** value select -- array []
            Options: [], // ** list options cbx, default: []
            Table : null, // ** table filter
            Column : null, // ** number column filter on table
            Scope : $scope,
            Config: {
                placeholder : 'Select category',
                plugins: ['infinite_scroll'],//enable load more
                maxItems: 1,
                valueField: $scope.cbxSrc2UomCateInit.valueField,
                labelField: $scope.cbxSrc2UomCateInit.labelField,
                searchField: $scope.cbxSrc2UomCateInit.searchField,
                create: false,
                render: {
                    option: function(data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(data[$scope.cbxSrc2UomCateInit.labelField]) + '</span>' +
                            '</div>';
                    },
                    item: function(data, escape) {
                        //return '<div class="item"><a href="' + escape(data[$scope.cbxSrc2UomCateInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxSrc2UomCateInit.labelField]) + '</a></div>';
                        return '<div class="item">' + escape(data[$scope.cbxSrc2UomCateInit.labelField]) + '</div>';
                    }
                },
                //use load event if use load more
                load: function(query, callback) {
                    query = JSON.parse(query)
                    if($scope.cbxSrc2UomCateInit.resetScroll){
                        query.page = 0;
                        callback($scope.cbxSrc2UomCateInit.resetScroll);
                        $scope.cbxSrc2UomCateInit.resetScroll = false;
                    }
                    $scope.cbxSrc2UomCateInit.page = query.page || 0;
                    if(!$scope.cbxSrc2UomCateInit.totalCount || $scope.cbxSrc2UomCateInit.totalCount > ( ($scope.cbxSrc2UomCateInit.page - 1) * $scope.cbxSrc2UomCateInit.perPage) ){
                        var api = apiData.genApi($scope.cbxSrc2UomCateInit.url, $scope.cbxSrc2UomCateInit.searchField, query.search, $scope.cbxSrc2UomCateInit.perPage, null, $scope.cbxSrc2UomCateInit.OriginParams,query.page,$scope.cbxSrc2UomCateInit.queryRelate);
                        $http.get(api).then(function (response) {
                            $scope.cbxSrc2UomCateInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                            callback(response.data);
                        });
                    }
                }
            }
        }

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
        $scope.cbxSrc2UomTypeInit = {
            url: '', // ** api load data
            OriginParams: '', // ** init params -- default: null
            queryRelate : null, // ** init query relate cbx -- default: null
            valueField: 'id', labelField: 'id', searchField: 'id', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
            perPage: 10, totalCount: null, page: 0, resetScroll: false
        }
        $scope.cbxSrc2UomType = { // ** replace name cbx
            ngModel : '', // ** value select -- array []
            Options: $scope.uom_type_options, // ** list options cbx, default: []
            Table : null, // ** table filter
            Column : null, // ** number column filter on table
            Scope : $scope,
            Config: {
                placeholder : 'Select type',
                plugins: ['infinite_scroll'],//enable load more
                maxItems: 1,
                valueField: $scope.cbxSrc2UomTypeInit.valueField,
                labelField: $scope.cbxSrc2UomTypeInit.labelField,
                searchField: $scope.cbxSrc2UomTypeInit.searchField,
                create: false,
                render: {
                    option: function(data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(data[$scope.cbxSrc2UomTypeInit.labelField]) + '</span>' +
                            '</div>';
                    },
                    item: function(data, escape) {
                        //return '<div class="item"><a href="' + escape(data[$scope.cbxSrc2UomTypeInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxSrc2UomCateInit.labelField]) + '</a></div>';
                        return '<div class="item">' + escape(data[$scope.cbxSrc2UomTypeInit.labelField]) + '</div>';
                    }
                },
                //use load event if use load more
                load: function(query, callback) {
                    query = JSON.parse(query)
                    if($scope.cbxSrc2UomTypeInit.resetScroll){
                        query.page = 0;
                        callback($scope.cbxSrc2UomTypeInit.resetScroll);
                        $scope.cbxSrc2UomTypeInit.resetScroll = false;
                    }
                    $scope.cbxSrc2UomTypeInit.page = query.page || 0;
                    if(!$scope.cbxSrc2UomTypeInit.totalCount || $scope.cbxSrc2UomTypeInit.totalCount > ( ($scope.cbxSrc2UomTypeInit.page - 1) * $scope.cbxSrc2UomTypeInit.perPage) ){
                        var api = apiData.genApi($scope.cbxSrc2UomTypeInit.url, $scope.cbxSrc2UomTypeInit.searchField, query.search, $scope.cbxSrc2UomTypeInit.perPage, null, $scope.cbxSrc2UomTypeInit.OriginParams,query.page,$scope.cbxSrc2UomTypeInit.queryRelate);
                        $http.get(api).then(function (response) {
                            $scope.cbxSrc2UomTypeInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                            callback(response.data);
                        });
                    }
                }
            }
        }


    }

})();