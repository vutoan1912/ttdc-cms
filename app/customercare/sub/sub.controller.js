angular
    .module('erpApp')
    .controller('SubController', SubController);

    SubController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$compile',
        '$stateParams', '$interval', 'TableMultipleCustom', '$translate', 'TranslateCommonUI', 'ErrorHandle', 'AlertService',
        '$window', 'Principal', 'utils', 'apiData', '$http', 'User', '$q', '$filter','SubService',
        '$localStorage','$sessionStorage','API_URL'];
    function SubController(
        $scope, $rootScope, $state, $timeout, $compile, $stateParams, $interval, TableMultipleCustom,
        $translate, TranslateCommonUI, ErrorHandle, AlertService, $window, Principal, utils,
        apiData, $http, User, $q,$filter,SubService,$localStorage,$sessionStorage,API_URL) {

        TranslateCommonUI.init($scope);
        $scope.inventoryTitle = "transfer.common.Inventory";
        $scope.operationTitle = "transfer.common.Operation";
        $scope.button_validate = "transfer.button.Validate";
        $scope.required_msg = "transfer.messages.required";

        $scope.list_op_item = [];

        $scope.myColumnsRd =  ["Số điện thoại", "Gói dịch vụ", "Kênh", "Thời gian đăng ký", "Thời gian hủy"];
        var fieldsRd =        ["msisdn", "cmd_code", "channel", "reg_time", "end_time"];
        var fieldsTypeRd =    ["Text",   "Text",     "Text",    "DateTime", "DateTime"];
        $scope.fieldsValue =  [null,      null,       null,      null,        null];

        $scope.myColumnsShowRd = [];
        for (var i = 0; i < $scope.myColumnsRd.length; i++) {
            $scope.myColumnsShowRd.push(true);
        }

        $scope.getData = function () {

            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'GET',
                url: API_URL + '/api/sms/checkSub?msisdn=' + $scope.fieldsValue[0],
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {}
            };

            return $http(req).then(function(response){
                console.log(response)
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

        $scope.register = function () {

            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'POST',
                url: API_URL + '/api/sms/registerCms?msisdn=' + $scope.fieldsValue[0],
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {}
            };

            return $http(req).then(function(response){
                console.log(response)
                UIkit.modal.alert('Success!');
            }, function(error){
                console.log(error)
                UIkit.modal.alert('Fail!');
            });
        }

        $scope.cancel = function () {

            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'POST',
                url: API_URL + '/api/sms/cancelCms?msisdn=' + $scope.fieldsValue[0],
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {}
            };

            return $http(req).then(function(response){
                console.log(response)
                UIkit.modal.alert('Success!');
            }, function(error){
                console.log(error)
                UIkit.modal.alert('Fail!');
            });
        }

        var $formValidate = $('#form_validation');
        console.log($formValidate)
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

