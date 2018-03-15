

(function(){
    'use strict';
    angular.module('erpApp')
        .controller('FormLocationController',FormLocationController);

    FormLocationController.$inject = ['$rootScope','$scope','$state','Location','AlertService','$translate','variables', 'TableCommon','$http','$stateParams','$window','TranslateCommonUI','ErrorHandle','$timeout', 'apiData'];
    function FormLocationController($rootScope,$scope, $state, Location, AlertService,$translate, variables, TableCommon,$http,$stateParams,$window,TranslateCommonUI,ErrorHandle,$timeout,apiData) {
        var vm = this;
        if($stateParams.type){
            if($stateParams.type == 0){
                $scope.backType = "locations";
            }else{
                $scope.backType = "locations.detail({id: "+$stateParams.type+"})";
            }

        }
        // $scope.CbxParentId = {
        //     Placeholder : 'Select parent',
        //     TextField : 'displayName',
        //     ValueField : 'id',
        //     Size : "10",
        //     Api : "api/locations",
        //     customsearch: 'completeName'
        // };

        $scope.CbxSequenceDInit = {
            url: '/api/locations', // ** api load data
            OriginParams: 'active==true;id>1', // ** init params -- default: null
            queryRelate : null, // ** init query relate cbx -- default: null
            valueField: 'id', labelField: 'displayName', searchField: 'completeName', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
            perPage: 10, totalCount: null, page: 0, resetScroll: false
        }
        $scope.CbxParentId = { // ** replace name cbx
            ngModel : [], // ** value select -- array []
            Options: [], // ** list options cbx, default: []
            Table : null, // ** table filter
            Column : null, // ** number column filter on table
            Scope : $scope,
            Config: {
                placeholder : 'Select sequences',
                plugins: ['infinite_scroll'],//enable load more
                maxItems: 1,
                valueField: $scope.CbxSequenceDInit.valueField,
                labelField: $scope.CbxSequenceDInit.labelField,
                searchField: $scope.CbxSequenceDInit.searchField,
                create: false,
                render: {
                    option: function(data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(data[$scope.CbxSequenceDInit.labelField]) + '</span>' +
                            '</div>';
                    },
                    item: function(data, escape) {
                        //return '<div class="item"><a href="' + escape(data[$scope.cbxSrc2UomCateInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxSrc2UomCateInit.labelField]) + '</a></div>';
                        return '<div class="item">' + escape(data[$scope.CbxSequenceDInit.labelField]) + '</div>';
                    }
                },
                //use load event if use load more
                load: function(query, callback) {
                    query = JSON.parse(query)
                    if($scope.CbxSequenceDInit.resetScroll){
                        query.page = 0;
                        callback($scope.CbxSequenceDInit.resetScroll);
                        $scope.CbxSequenceDInit.resetScroll = false;
                    }
                    $scope.CbxSequenceDInit.page = query.page || 0;
                    if(!$scope.CbxSequenceDInit.totalCount || $scope.CbxSequenceDInit.totalCount > ( ($scope.CbxSequenceDInit.page - 1) * $scope.CbxSequenceDInit.perPage) ){
                        var api = apiData.genApi($scope.CbxSequenceDInit.url, $scope.CbxSequenceDInit.searchField, query.search, $scope.CbxSequenceDInit.perPage, null, $scope.CbxSequenceDInit.OriginParams,query.page,$scope.CbxSequenceDInit.queryRelate);
                        $http.get(api).then(function (response) {
                            $scope.CbxSequenceDInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                            callback(response.data);
                        });
                    }
                }
            }
        }


        if($stateParams.id){
            $scope.flag_edit = 1; //edit
            $scope.backType = "locations.detail({id: "+$stateParams.id+"})";
            //edit
            Location.getOneModel($stateParams.id).then(function (data) {
                $scope.location = data[0];
                if($scope.location.parentId){
                    Location.getOneModel($scope.location.parentId).then(function (data) {
                        $scope.CbxParentId.ngModel = $scope.location.parentId;
                        $scope.CbxParentId.Options = [data[0]];
                    });
                }

            });
            $scope.submit = function() {
                if($scope.form_createLocation.$valid){
                    $scope.LocationService.update($scope.location)
                        .then(function(data){
                            AlertService.success("Update Location success!")
                            $timeout(function() {$state.go('locations.detail',{id: $scope.location.id });}, 1000);
                        })
                        .catch(function(data){
                            //console.log('data',data);
                            AlertService.error(data.data.title);
                        })
                }else{
                    AlertService.error('location.messages.errorUpdate');
                }
            };

            $scope.deleteOne = function () {
                Location.deleteOne($stateParams.id).then(function () {
                    $state.go('locations');
                }).catch(function(data){
                    ErrorHandle.handleError(data);
                })
            }

            $scope.CbxCreatedBy ={
                url:'/api/users/search?query=',
                key:'email',
                attr:'email',
                prefix:'#/users/',
                suffix:'/detail'
            };

        }else{
            //create
            $scope.flag_edit = 0; //create
            $scope.location = {};



            $scope.status = "global.common.archived";
            if ( angular.element('#info_detail').length ) {
                $scope.active = "true";
                var statusAction = {
                    true: "global.common.archive",
                    false: "global.common.archived"
                }
                var statusTitle = {
                    true: "global.common.active",
                    false: "global.common.archived"
                }
                var statusStyle ={
                    true: "uk-text-success uk-text-bold custom-active-txt",
                    false:"uk-text-danger uk-text-bold custom-active-txt"
                }
                if($scope.active){
                    $scope.status = "global.common.active"
                }
                $scope.activeClass = statusStyle[$scope.active]
                $scope.activeClass = statusStyle[$scope.active]
                $scope.mouseHoverStatus = function(){
                    $scope.active = !$scope.active
                    $scope.status = statusAction[$scope.active]
                    $scope.activeClass = statusStyle[$scope.active]
                };
                $scope.mouseLeaveStatus = function(){
                    // $scope.active = !$scope.active
                    // $scope.status = statusTitle[$scope.active]
                    // $scope.activeClass = statusStyle[$scope.active]
                    // console.log("LEAVE: "+$scope.status)
                };

            }
            $scope.showNameRequire = 0;
            $scope.submit = function() {
                $scope.location.active = $scope.active;
                if($scope.form_createLocation.$valid){
                    $scope.LocationService.create($scope.location)
                        .then(function(data){
                            AlertService.success("Create Location success!");
                            $state.go('locations');

                        })
                        .catch(function(data){
                            AlertService.error(data.data.title);
                        })
                }else{
                    AlertService.error('location.messages.errorCreate');
                    $scope.showNameRequire = 1;
                }
            };

        }
        $scope.CbxActivate = {
            activateService:Location.activate,
            deactivateService:Location.deactivate
        };

        TranslateCommonUI.init($scope);
        $scope.LocationService = Location;

        $scope.selectType = {
            options_type: [
                {
                    "id": "vendor",
                    "name": "Vendor location"
                },
                {
                    "id": "view",
                    "name": "View"
                },
                {
                    "id": "internal",
                    "name": "Internal location"
                },
                {
                    "id": "customer",
                    "name": "Customer location"
                },
                {
                    "id": "inventory_loss",
                    "name": "Inventory loss"
                },
                {
                    "id": "production",
                    "name": "Production"
                },

                {
                    "id": "transit",
                    "name": "Transit location"
                }
            ],
            options_removalStrategy: [
                'First in first out (FIFO)', 'Last in first out (LIFO)', 'First expired first out (FEFO)'
            ]

        };
        // $scope.list_parent_options = [{}];
        //
        // Location.getAll().then(function (data) {
        //     $scope.list_parent_options = data;
        // });
        $scope.select_config = {
            valueField: 'id',
            labelField: 'completeName',
            create: false,
            maxItems: 1,
            placeholder: 'Select parent...'
        };

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
    }

})();