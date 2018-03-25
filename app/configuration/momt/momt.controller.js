angular
    .module('erpApp')
    .controller('MOMTConfigController', MOMTConfigController);

    MOMTConfigController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$compile',
        '$stateParams', '$interval', 'TableMultipleCustom', '$translate', 'TranslateCommonUI', 'ErrorHandle', 'AlertService',
        '$window', 'Principal', 'utils', 'apiData', '$http', 'User', '$q', '$filter','ConfigurationService'];
    function MOMTConfigController(
        $scope, $rootScope, $state, $timeout, $compile, $stateParams, $interval, TableMultipleCustom,
        $translate, TranslateCommonUI, ErrorHandle, AlertService, $window, Principal, utils,
        apiData, $http, User, $q,$filter,ConfigurationService) {

        TranslateCommonUI.init($scope);
        $scope.inventoryTitle = "transfer.common.Inventory";
        $scope.operationTitle = "transfer.common.Operation";
        $scope.button_validate = "transfer.button.Validate";
        $scope.required_msg = "transfer.messages.required";

        $scope.list_op_item = [];

        $scope.myColumnsRd = ["Cú pháp", "Nội dung tin nhắn", "Trạng thái", "Thời gian"];
        var fieldsRd =     ["code",       "description", "status", "created_at"];
        var fieldsTypeRd = ["TextHidden", "Text",        "Number", "DateTime"];
        var loadFunctionRd = ConfigurationService.getMT;

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

        $scope.edit = {
            code: null,
            description: null
        }
        $scope.chooseMT = function (code, description) {
            $scope.edit = {
                code: code,
                description: description
            }
        }
        $scope.updateMT = function () {
            if($scope.edit.code != null && $scope.edit.code.length > 0){
                ConfigurationService.updateMT($scope.edit.code, $scope.edit.description).then(function (result) {
                    console.log(result)
                    if(result.data == 1){
                        UIkit.modal.alert('Update Success!');
                        TableMultipleCustom.reloadPage(newTableIdsRd.idTable);
                    } else
                        UIkit.modal.alert('Update Fail!');
                })
            }else{
                UIkit.modal.alert('Hãy chọn cú pháp cần sửa nội dung tại bảng bên dưới!');
            }
        }

    }

