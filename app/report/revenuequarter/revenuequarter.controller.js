angular
    .module('erpApp')
    .controller('RevenueQuarterController', RevenueQuarterController);

    RevenueQuarterController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$compile',
        '$stateParams', '$interval', 'TableMultipleCustom', '$translate', 'TranslateCommonUI', 'ErrorHandle', 'AlertService',
        '$window', 'Principal', 'utils', 'apiData', '$http', 'User', '$q', '$filter','ReportService',
        '$localStorage','$sessionStorage','API_URL'];
    function RevenueQuarterController(
        $scope, $rootScope, $state, $timeout, $compile, $stateParams, $interval, TableMultipleCustom,
        $translate, TranslateCommonUI, ErrorHandle, AlertService, $window, Principal, utils,
        apiData, $http, User, $q,$filter,ReportService,$localStorage,$sessionStorage,API_URL) {

        TranslateCommonUI.init($scope);
        $scope.inventoryTitle = "transfer.common.Inventory";
        $scope.operationTitle = "transfer.common.Operation";
        $scope.button_validate = "transfer.button.Validate";
        $scope.required_msg = "transfer.messages.required";

        $scope.list_op_item = [];

        $scope.myColumnsRd = ["Gói dịch vụ", "Doanh thu", "Doanh thu quý trước", "Tỷ lệ","Lũy kế năm", "Quý"];
        var fieldsRd =       ["cmd_code", "dt",       "dt_quytruoc", "tyle",   "luyke_nam", "type"];
        var fieldsTypeRd =   ["Text",     "Number",   "Number",      "Number", "Number",    "Number" ];
        $scope.fieldsValue =  [null,       null,       null,          null,     null     ,   null ];
        var loadFunctionRd = ReportService.getRevenueQuarter;

        var newTableIdsRd = {
            idTable: "table_op_tab",
            model: "list_op_item",
            param_allow_show_tooltip: "true",
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
            selectize_pageNum_options: ["5", "10", "25", "50"],
            selectize_pageNum_config: {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1
            },
            loadFunction: loadFunctionRd,
            param_fields: fieldsRd,
            param_fields_type: fieldsTypeRd,
            handleAfterReload: null,
            handleAfterReloadParams: null,
            deleteCallback: null,
            customParams: "",
            pager_id: "table_op_tab_pager",
            selectize_page_id: "rd_selectize_page",
            selectize_pageNum_id: "rd_selectize_pageNum"
        };
        TableMultipleCustom.initTableIds($scope, newTableIdsRd);

        $scope.myColumnsShowRd = [];
        for (var i = 0; i < $scope.myColumnsRd.length; i++) {
            $scope.myColumnsShowRd.push(true);
        }

        $scope.getData = function () {

            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);
            $scope.chooseType();

            var query = $scope.getCommonQuery(newTableIdsRd.idTable);
            var req = {
                method: 'GET',
                url: API_URL + '/api/sms/getDoanhthuQuy?' + query,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {}
            };

            return $http(req).then(function(response){
                console.log(response)
                $scope.fieldsValue[0] = response.data[fieldsRd[0]];
                $scope.fieldsValue[1] = response.data[fieldsRd[1]];
                $scope.fieldsValue[2] = response.data[fieldsRd[2]];
                $scope.fieldsValue[3] = response.data[fieldsRd[3]];
                $scope.fieldsValue[4] = response.data[fieldsRd[4]];
                //return response;
            }, function(error){
                console.log(error)
                //return error;
            });
        }

        $scope.getCommonQuery = function(table_id) {
            var query = "";
            console.log($scope.TABLES[table_id].param_filter_list.length)
            for (var i = 0; i < $scope.TABLES[table_id].param_filter_list.length; i++) {
                if ($scope.TABLES[table_id].param_filter_list[i] != null && $scope.TABLES[table_id].param_filter_list[i].length != "".length) {
                    console.log($scope.TABLES[table_id].param_fields_type[i])
                    if ($scope.TABLES[table_id].param_fields_type[i] =="Text") {
                        query += $scope.TABLES[table_id].param_fields[i] + '=' + $scope.TABLES[table_id].param_filter_list[i] + '&';
                    }else if($scope.TABLES[table_id].param_fields_type[i] =="DateTime") {
                        console.log(2)
                        query += $scope.TABLES[table_id].param_filter_list[i];
                    } else if($scope.TABLES[table_id].param_fields_type[i] =="Number"){
                        query += $scope.TABLES[table_id].param_fields[i] + '=' + $scope.TABLES[table_id].param_filter_list[i];
                    } else if($scope.TABLES[table_id].param_fields_type[i] =="MultiText" && $scope.TABLES[table_id].param_filter_list[i].length > 0) {
                        var searchValue = $scope.TABLES[table_id].param_filter_list[i].toString();
                        query += $scope.TABLES[table_id].param_fields[i] + '=in=("' + searchValue.replace(/,/g , '","') + '");';
                    } else if($scope.TABLES[table_id].param_fields_type[i] =="MultiNumber" && $scope.TABLES[table_id].param_filter_list[i].length > 0) {
                        query += $scope.TABLES[table_id].param_fields[i] + '=in=(' + $scope.TABLES[table_id].param_filter_list[i].toString() + ');';
                    }
                }
                if($scope.TABLES[table_id].param_fields_type[i] =="NumberRange") {
                    if($scope.TABLES[table_id].param_filter_list[i] == null){
                        query += $scope.TABLES[table_id].param_fields[i] + "=='null';";
                    }else{
                        query += $scope.TABLES[table_id].param_fields[i] + '>=' + $scope.TABLES[table_id].param_filter_list[i].from + ';' + $scope.TABLES[table_id].param_fields[i] + '<=' + $scope.TABLES[table_id].param_filter_list[i].to + ';';
                    }
                }
            }
            query += $scope.TABLES[table_id].customParams + $scope.TABLES[table_id].tree_query;
            if (query.slice(-1) == ';')
                query = query.substr(0, query.length - 1);

            if(angular.isDefined($scope.TABLES[table_id].noPagination) && $scope.TABLES[table_id].noPagination == true){
                return query
            }
            console.log(query)
            return query;
        }

        $scope.radio_demo_inline = '1';
        $scope.chooseType = function () {
            //console.log($scope.radio_demo_inline);
            $scope.TABLES[newTableIdsRd.idTable].param_filter_list[5] = $scope.radio_demo_inline;
        };

        $scope.TABLES['table_op_tab'].param_filter_list[5] = 1;

    }

