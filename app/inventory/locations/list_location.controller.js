

(function(){
    'use strict';
    angular.module('erpApp')
        .controller('ListLocationController',ListLocationController);

    ListLocationController.$inject = ['$rootScope','$scope','$state','Location','AlertService','$translate','variables', 'TableMultiple','$http','$stateParams','$window','TranslateCommonUI','ErrorHandle','$timeout'];
    function ListLocationController($rootScope,$scope, $state, Location, AlertService,$translate, variables, TableMultiple,$http,$stateParams,$window,TranslateCommonUI,ErrorHandle,$timeout) {
        var vm = this;
        angular.element($window).bind('resize', function(){
            $scope.fullsize = {
                "height":$( window ).height() - 300
            }
        });
        $scope.fullsize = {
            "height":$( window ).height() - 300
        }
        $scope.LocationService = Location;

        if($stateParams.id){
            $scope.id = $stateParams.id;

            Location.getOneModel($stateParams.id).then(function (data) {
               $scope.location_detail = data[0];
                $scope.urlSourceLink = '#/locations/details?id='  + $scope.location_detail.parentId;
                $scope.urlLocName = '/api/locations/';
                $scope.attrName = 'name';
                $scope.CbxActivate = {
                    activateService:Location.activate,
                    deactivateService:Location.deactivate
                };

            });

            $scope.deleteOne = function () {
                Location.deleteOne($stateParams.id).then(function () {
                    $state.go('locations');
                }).catch(function(data){
                    ErrorHandle.handleError(data);
                })
            }
        }else{
            $scope.myColumns = ["Location Name","Location Type", "Active","Created","Created By","Updated","Updated By"];
            $scope.myColumnsShow=[];
            for (var i=0; i<$scope.myColumns.length-5;i++){
                $scope.myColumnsShow.push(true);
            }
            for (var i=$scope.myColumns.length - 5; i<$scope.myColumns.length;i++){
                $scope.myColumnsShow.push(false);
            }
            $scope.checkColumnAll = false;
            $scope.handleColumn = function handleColumn() {
                $scope.checkColumnAll = !$scope.checkColumnAll;
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
            var loadFunction = Location.getPage;
            var fields = ["id", "completeName" , "type", "active","created","createdBy","updated","updatedBy"];
            var fieldsType = ["Number","Text","Text", "Number","DateTime","Text","DateTime","Text"];
            var newTableIds = {
                idTable: "table_ot",
                model: "list_location",
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
                customParams: "",
                pager_id: "table_ot_pager",
                selectize_page_id: "rd_selectize_page",
                selectize_pageNum_id: "rd_selectize_pageNum"
            }


            TableMultiple.initTableIds($scope, newTableIds);
            TableMultiple.sortDefault(newTableIds.idTable);
            TableMultiple.reloadPage(newTableIds.idTable);
            $scope.CbxActive = {
                Placeholder : 'Select status',
                Api : "",
                Table : $scope.TABLES['table_ot'],
                Column : 3,
                Scope : $scope,
                ngModel:{value:1, title:"Active"}
            };
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
                ]

            };
            $scope.CbxSearchType = {
                cbxplaceholder : 'Select type',
                cbxtextfield : 'name',
                cbxvaluefield : 'id',
                datasource :  $scope.selectType.options_type,
                column : "2",
                scopecontroller : $scope,
                ngmodel : null,
                table : $scope.TABLES['table_ot']
            };
            $scope.activate = function () {
                if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0){
                    Location.activate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                        AlertService.success('success.msg.active')
                        TableMultiple.reloadPage(newTableIds.idTable);
                    }).catch(function(data){
                        ErrorHandle.handleError(data);
                    })
                }

            }

            $scope.deactivate = function () {
                if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0){
                    Location.deactivate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                        AlertService.success('success.msg.inactive')
                        TableMultiple.reloadPage(newTableIds.idTable);
                    }).catch(function(data){
                        ErrorHandle.handleError(data);
                    })
                }
            }

            $scope.deleteList = function () {
                // console.log($scope.param_check_list)
                UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                    Location.deleteByListIDs($scope.TABLES[newTableIds.idTable].param_check_list).then(function (data) {
                        if (data.length > 0){
                            ErrorHandle.handleErrors(data);
                        } else {
                            AlertService.success('success.msg.delete')
                        }

                        TableMultiple.reloadPage(newTableIds.idTable);
                    }).catch(function(data){
                        ErrorHandle.handleError(data);
                    })

                }, {
                    labels: {
                        'Ok': $translate.instant("common-ui-element.button.Delete"),
                        'Cancel': $translate.instant("common-ui-element.button.Cancel")
                    }
                });
            }

        }
        $scope.CbxCreatedBy ={
            url:'/api/users/search?query=',
            key:'email',
            attr:'email',
            prefix:'#/users/',
            suffix:'/detail'
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
        };

        $scope.showType = function(type){
            switch (type) {
                case "view":
                    return "View";
                    break;
                case "vendor":
                    return "Vendor location";
                    break;
                case "customer":
                    return "Customer location";
                    break;
                case "internal":
                    return "Internal location";
                    break;
                case "transit":
                    return "Transit location";
                    break;
                case "inventory_loss":
                    return "Inventory loss";
                    break;
                case "production":
                    return "Production";
            }
        }
        $scope.DatetimeRange1 = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_ot'], // ** table filter
            Column: 4, // ** number column filter on table
            Scope: $scope
        }
        $scope.DatetimeRange2 = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_ot'], // ** table filter
            Column: 6, // ** number column filter on table
            Scope: $scope
        }

        $scope.goToStock = function () {
            $state.go('stock-quantity', {location_id: $scope.location_detail.id});
        }

        // $scope.inventoryTitle = "HHH";
        //
        // $( "#table_ot" ).after( $( "<div class=\"uk-alert\" data-uk-alert><span>"+$scope.inventoryTitle +"</span></div>") );

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