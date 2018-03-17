angular
    .module('erpApp')
    .controller('MOMTController', MOMTController);

    MOMTController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$compile',
        '$stateParams', '$interval', 'TableMultipleCustom', '$translate', 'TranslateCommonUI', 'ErrorHandle', 'AlertService',
        '$window', 'Principal', 'utils', 'apiData', '$http', 'User', '$q', '$filter','SubService'];
    function MOMTController(
        $scope, $rootScope, $state, $timeout, $compile, $stateParams, $interval, TableMultipleCustom,
        $translate, TranslateCommonUI, ErrorHandle, AlertService, $window, Principal, utils,
        apiData, $http, User, $q,$filter,SubService) {

        TranslateCommonUI.init($scope);
        $scope.inventoryTitle = "transfer.common.Inventory";
        $scope.operationTitle = "transfer.common.Operation";
        $scope.button_validate = "transfer.button.Validate";
        $scope.required_msg = "transfer.messages.required";

        $scope.list_op_item = [];

        $scope.myColumnsRd = ["Số điện thoại", "Gói dịch vụ", "MO/MT", "Thời gian", "Kênh", "Nội dung"];
        var fieldsRd =     ["msisdn", "cmd_code", "type", "action_time", "channel", "content"];
        var fieldsTypeRd = ["Text",   "Text",     "Text",  "DateTime",   "Text",    "Text"];
        var loadFunctionRd = SubService.getMOMT;

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

        $scope.radio_demo_inline = '1';
        $scope.chooseType = function () {
            //console.log($scope.radio_demo_inline);
            $scope.TABLES['table_op_tab'].param_filter_list[2] = $scope.radio_demo_inline;
            $scope.handleFilter('table_op_tab');
        };

        $scope.TABLES['table_op_tab'].param_filter_list[2] = 1;

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
                $scope.TABLES['table_op_tab'].param_filter_list[3] = 'startDate='+startResult+'&';
                $scope.TABLES['table_op_tab'].param_filter_list[3] += 'endDate='+endResult+'&';
            }else if($scope.DateTimeRange.kstartDateTime != null){
                var startResult = genDateTime($scope.DateTimeRange.kstartDateTime);
                $scope.TABLES['table_op_tab'].param_filter_list[3] = 'startDate='+startResult+'&';
                $scope.TABLES['table_op_tab'].param_filter_list[3] += 'endDate&';
            }else if($scope.DateTimeRange.kendDateTime != null){
                var endResult = genDateTime($scope.DateTimeRange.kendDateTime);
                $scope.TABLES['table_op_tab'].param_filter_list[3] = 'startDate&';
                $scope.TABLES['table_op_tab'].param_filter_list[3] += 'endDate='+endResult+'&';
            }else{
                $scope.TABLES['table_op_tab'].param_filter_list[3] = 'startDate&endDate&';
            }
            $scope.handleFilter('table_op_tab');
        };
        $scope.chooseDatetime();

        function genDateTime(datetime) {
            var result = $filter('date')(datetime, 'yyyy-MM-dd HH:mm:ss');
            return result;
        }

    }

