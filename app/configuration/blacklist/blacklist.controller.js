angular
    .module('erpApp')
    .controller('BlacklistController', BlacklistController);

    BlacklistController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$compile',
        '$stateParams', '$interval', 'TableMultipleCustom', '$translate', 'TranslateCommonUI', 'ErrorHandle', 'AlertService',
        '$window', 'Principal', 'utils', 'apiData', '$http', 'User', '$q', '$filter','ConfigurationService','API_URL'];
    function BlacklistController(
        $scope, $rootScope, $state, $timeout, $compile, $stateParams, $interval, TableMultipleCustom,
        $translate, TranslateCommonUI, ErrorHandle, AlertService, $window, Principal, utils,
        apiData, $http, User, $q,$filter,ConfigurationService,API_URL) {

        TranslateCommonUI.init($scope);
        $scope.inventoryTitle = "transfer.common.Inventory";
        $scope.operationTitle = "transfer.common.Operation";
        $scope.button_validate = "transfer.button.Validate";
        $scope.required_msg = "transfer.messages.required";

        $scope.list_op_item = [];

        $scope.myColumnsRd = ["Số điện thoại", "Ngày tạo", "Action"];
        var fieldsRd =     ["msisdn", "created_at", "action"];
        var fieldsTypeRd = ["TextHidden",   "Text", "Text"];
        var loadFunctionRd = ConfigurationService.getBlacklist;

        var newTableIdsRd = {
            idTable: "table_op_tab",
            model: "list_op_item",
            param_allow_show_tooltip: "true",
            tree_query: "",
            firstLoad: false,
            param_current_page: 1,
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
        TableMultipleCustom.reloadPage(newTableIdsRd.idTable);

        $scope.myColumnsShowRd = [];
        for (var i = 0; i < $scope.myColumnsRd.length; i++) {
            $scope.myColumnsShowRd.push(true);
        }

        $scope.deleteBlacklist = function (msisdn) {
            ConfigurationService.deleteBlacklist(msisdn).then(function (result) {
                console.log(result)
                if(result.data == 1){
                    UIkit.modal.alert('Delete Success!');
                    TableMultipleCustom.reloadPage(newTableIdsRd.idTable);
                } else
                    UIkit.modal.alert('Delete Fail!');
            })
        }

        $scope.addBlacklist = function (msisdn) {
            ConfigurationService.addBlacklist(msisdn).then(function (result) {
                console.log(result)
                if(result.data == 1){
                    UIkit.modal.alert('Add blacklist Success!');
                    TableMultipleCustom.reloadPage(newTableIdsRd.idTable);
                } else
                    UIkit.modal.alert('Add blacklist Fail!');
            })
        }


        $scope.exportBlacklist = function (msisdn) {
            $window.location = API_URL + '/api/export/blacklist';
        }
    }

