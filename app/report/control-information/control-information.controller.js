angular
    .module('erpApp')
    .controller('ControlInformationController', ControlInformationController);

    ControlInformationController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$compile',
        '$stateParams', '$interval', 'TableMultipleCustom', '$translate', 'TranslateCommonUI', 'ErrorHandle', 'AlertService',
        '$window', 'Principal', 'utils', 'apiData', '$http', 'User', '$q', '$filter','ReportService',
        '$localStorage','$sessionStorage','API_URL'];
    function ControlInformationController(
        $scope, $rootScope, $state, $timeout, $compile, $stateParams, $interval, TableMultipleCustom,
        $translate, TranslateCommonUI, ErrorHandle, AlertService, $window, Principal, utils,
        apiData, $http, User, $q,$filter,ReportService,$localStorage,$sessionStorage,API_URL) {

        TranslateCommonUI.init($scope);
        $scope.inventoryTitle = "transfer.common.Inventory";
        $scope.operationTitle = "transfer.common.Operation";
        $scope.button_validate = "transfer.button.Validate";
        $scope.required_msg = "transfer.messages.required";

        $scope.list_op_item = [];

        $scope.myColumnsRd = ["Khoảng ngày",  "Từ ngày",  "Đến ngày",  "Doanh thu charge 6000", "Số lượng charge 6000", "Doanh thu charge 3000","Số lượng charge 3000","Doanh thu MT","Số lượng MT","Tổng doanh thu"];
        var fieldsRd =       ["date",         "fromDate", "toDate",    "dt_6000",               "sl_6000",              "dt_charge_3000",       "sl_charge_3000",      "dt_mt",       "sl_mt",      "tong_dt"       ];
        var fieldsTypeRd =   ["DateTime",     "DateTime", "DateTime",  "Number",                "Number",               "Number",               "Number",              "Number",      "Number",     "Number"        ];
        var loadFunctionRd = ReportService.getControlInformation;

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

            //console.log(query)

            var req = {
                method: 'GET',
                url: API_URL + '/api/sms/getDoisoat?' + query,
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
                if($scope.TABLES[table_id].param_fields_type[i] =="TextFilter") {
                    if ($scope.TABLES[table_id].param_filter_list[i] != null && $scope.TABLES[table_id].param_filter_list[i].length != "".length) {
                        query += '&' + convertFieldFilter($scope.TABLES[table_id].param_fields[i]) + '=' + $scope.TABLES[table_id].param_filter_list[i];
                    }else{
                        query += '&' + convertFieldFilter($scope.TABLES[table_id].param_fields[i]);
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

        $scope.DateTimeRange = {
            startDateTime: dateNow() + ' 12:00 AM',
            endDateTime: dateNow() + ' 12:00 AM',
            kstartDateTime: kdateNow() + 'T17:00:00.000Z',
            kendDateTime: kdateNow() + 'T17:00:00.000Z'
        };

        // $scope.$watchGroup(['DateTimeRange.kstartDateTime', 'DateTimeRange.kendDateTime'], function(newValues, oldValues, scope) {
        //
        // });

        function kdateNow() {
            var today = new Date();
            var dd = today.getDate()-1;
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            if(dd<10) {
                dd = '0'+dd
            }
            if(mm<10) {
                mm = '0'+mm
            }
            today = yyyy + '-' + mm + '-' + dd;
            return today;
        }

        function dateNow() {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            today = mm + '/' + dd + '/' + yyyy;
            return today;
        }

        $scope.chooseDatetime = function () {

            if($scope.DateTimeRange.kstartDateTime != null && $scope.DateTimeRange.kendDateTime != null){
                var startResult = genDateTime($scope.DateTimeRange.kstartDateTime);
                var endResult = genDateTime($scope.DateTimeRange.kendDateTime);
                $scope.TABLES[newTableIdsRd.idTable].param_filter_list[0] = 'startDate='+startResult+'&';
                $scope.TABLES[newTableIdsRd.idTable].param_filter_list[0] += 'endDate='+endResult;
            }else if($scope.DateTimeRange.kstartDateTime != null){
                var startResult = genDateTime($scope.DateTimeRange.kstartDateTime);
                $scope.TABLES[newTableIdsRd.idTable].param_filter_list[0] = 'startDate='+startResult;
                $scope.TABLES[newTableIdsRd.idTable].param_filter_list[0] += 'endDate&';
            }else if($scope.DateTimeRange.kendDateTime != null){
                var endResult = genDateTime($scope.DateTimeRange.kendDateTime);
                $scope.TABLES[newTableIdsRd.idTable].param_filter_list[0] = 'startDate&';
                $scope.TABLES[newTableIdsRd.idTable].param_filter_list[0] += 'endDate='+endResult;
            }else{
                $scope.TABLES[newTableIdsRd.idTable].param_filter_list[0] = 'startDate&endDate';
            }
            $scope.getData();
        };

        function genDateTime(datetime) {
            var result = $filter('date')(datetime, 'yyyy-MM-dd');
            return result;
        }
        function convertFieldFilter(field)
        {
            var index = field.indexOf("_");
            //console.log(index)
            //console.log(field)
            var string_replace = field[index+1].toUpperCase();
            //console.log(string_replace)
            field = field.replace(field[index] + field[index+1], string_replace);
            if(field.indexOf("_") >= 0) convertFieldFilter(field);
            return field;
        }

    }

