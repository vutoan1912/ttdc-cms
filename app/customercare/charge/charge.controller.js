angular
    .module('erpApp')
    .controller('ChargeController', ChargeController);

    ChargeController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$compile',
        '$stateParams', '$interval', 'TableMultipleCustom', '$translate', 'TranslateCommonUI', 'ErrorHandle', 'AlertService',
        '$window', 'Principal', 'utils', 'apiData', '$http', 'User', '$q', '$filter','SubService',
        '$localStorage','$sessionStorage','API_URL'];
    function ChargeController(
        $scope, $rootScope, $state, $timeout, $compile, $stateParams, $interval, TableMultipleCustom,
        $translate, TranslateCommonUI, ErrorHandle, AlertService, $window, Principal, utils,
        apiData, $http, User, $q,$filter,SubService,$localStorage,$sessionStorage,API_URL) {

        TranslateCommonUI.init($scope);
        $scope.inventoryTitle = "transfer.common.Inventory";
        $scope.operationTitle = "transfer.common.Operation";
        $scope.button_validate = "transfer.button.Validate";
        $scope.required_msg = "transfer.messages.required";

        $scope.list_op_item = [];

        $scope.myColumnsRd = ["Số điện thoại", "Gói dịch vụ", "Số tiền", "Thời gian", "Kết quả trừ cước", "Tương tác trừ cước"];
        var fieldsRd =     ["msisdn", "cmd_code", "price", "action_time", "responseCode", "action"];
        var fieldsTypeRd = ["Text",   "Text",     "Number","DateTime",    "Number",       "Text"];
        var loadFunctionRd = SubService.getCharge;

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
        //TableMultipleCustom.reloadPage(newTableIdsRd.idTable);

        $scope.myColumnsShowRd = [];
        for (var i = 0; i < $scope.myColumnsRd.length; i++) {
            $scope.myColumnsShowRd.push(true);
        }

        $scope.list_op_item = [];
        $scope.getData = function () {

            var query = $scope.getCommonQuery(newTableIdsRd.idTable);

            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'GET',
                url: API_URL + '/api/sms/searchCharge?' + query,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {}
            };

            return $http(req).then(function(response){
                console.log(response)
                $scope.list_op_item = response.data;
                //return response;
            }, function(error){
                console.log(error)
                //return error;
            });
        }

        $scope.getCommonQuery = function(table_id) {
            var query = "";
            for (var i = 0; i < $scope.TABLES[table_id].param_filter_list.length; i++) {
                if ($scope.TABLES[table_id].param_filter_list[i] != null && $scope.TABLES[table_id].param_filter_list[i].length != "".length) {
                    if ($scope.TABLES[table_id].param_fields_type[i] =="Text") {
                        query += $scope.TABLES[table_id].param_fields[i] + '=' + $scope.TABLES[table_id].param_filter_list[i] + '&';
                    }else if($scope.TABLES[table_id].param_fields_type[i] =="DateTime") {
                        query += $scope.TABLES[table_id].param_filter_list[i];
                    } else if($scope.TABLES[table_id].param_fields_type[i] =="Number"){
                        query += $scope.TABLES[table_id].param_fields[i] + '=' + $scope.TABLES[table_id].param_filter_list[i] + '&';
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
            return query;
        }

        $scope.changeMsisdn = function () {
            $scope.getData();
        }
        
        /*$scope.radio_demo_inline = '1';
        $scope.chooseType = function () {
            $scope.TABLES[newTableIdsRd.idTable].param_filter_list[2] = $scope.radio_demo_inline;
            $scope.getData();
        };
        $scope.TABLES[newTableIdsRd.idTable].param_filter_list[2] = 1;*/

        $scope.DateTimeRange = {
            startDateTime: null,
            endDateTime: null,
            kstartDateTime: null,
            kendDateTime: null
        };

        $scope.$watchGroup(['DateTimeRange.kstartDateTime', 'DateTimeRange.kendDateTime'], function(newValues, oldValues, scope) {
            $scope.chooseDatetime();
        });

        $scope.chooseDatetime = function () {
            /*console.log($scope.DateTimeRange.startDateTime);
            console.log($scope.DateTimeRange.endDateTime);
            console.log($scope.DateTimeRange.kstartDateTime);
            console.log($scope.DateTimeRange.kendDateTime);*/

            //startDate=2018-02-28 20:03:10&endDate&=2018-02-28 20:03:10
            if($scope.DateTimeRange.kstartDateTime != null && $scope.DateTimeRange.kendDateTime != null){
                var startResult = genDateTime($scope.DateTimeRange.kstartDateTime);
                var endResult = genDateTime($scope.DateTimeRange.kendDateTime);
                $scope.TABLES[newTableIdsRd.idTable].param_filter_list[3] = 'startDate='+startResult+'&';
                $scope.TABLES[newTableIdsRd.idTable].param_filter_list[3] += 'endDate='+endResult+'&';
            }else if($scope.DateTimeRange.kstartDateTime != null){
                var startResult = genDateTime($scope.DateTimeRange.kstartDateTime);
                $scope.TABLES[newTableIdsRd.idTable].param_filter_list[3] = 'startDate='+startResult+'&';
                $scope.TABLES[newTableIdsRd.idTable].param_filter_list[3] += 'endDate&';
            }else if($scope.DateTimeRange.kendDateTime != null){
                var endResult = genDateTime($scope.DateTimeRange.kendDateTime);
                $scope.TABLES[newTableIdsRd.idTable].param_filter_list[3] = 'startDate&';
                $scope.TABLES[newTableIdsRd.idTable].param_filter_list[3] += 'endDate='+endResult+'&';
            }else{
                $scope.TABLES[newTableIdsRd.idTable].param_filter_list[3] = 'startDate&endDate&';
            }
            $scope.getData();
        };
        $scope.chooseDatetime();

        function genDateTime(datetime) {
            var result = $filter('date')(datetime, 'yyyy-MM-dd HH:mm:ss');
            return result;
        }
        
        $scope.getResponseCode = function (code) {
            switch(code) {
                case 0:
                    return "Success";
                    break;
                case 1:
                    return "Fail";
                    break;
                case 2:
                    return "Not enough money";
                    break;
                case 3:
                    return "System busy";
                    break;
                case 4:
                    return "Unknown";
                    break;
                case 5:
                    return "Max success inday";
                    break;
                case 6:
                    return "Max total request inday";
                    break;
                default:
                    return "Unknown";
            }
        }

    }

