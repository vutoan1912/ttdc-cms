angular
    .module('erpApp')
    .controller('SequenceController', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$compile',
        'Sequence',
        '$stateParams',
        '$interval',
        'TableCommon',
        '$translate',
        '$window',
        'AlertService',
        '$state',
        '$filter',
        'ErrorHandle',
        function ($scope, $rootScope, $timeout, $compile, Sequence, $stateParams, $interval, TableCommon, $translate,$window,AlertService,$state,$filter,ErrorHandle) {
            $scope.columnsName = {
                Code: "inventory.column.Code",
                Name: "inventory.column.Name",
                Prefix:"inventory.column.Prefix",
                Size:"inventory.column.Size",
                nextNumber:"inventory.column.nextNumber",
                Step:"inventory.column.Step",
                Implementation:"inventory.column.Implementation",
                Suffix:"inventory.column.Suffix",
                useSubsequence:"inventory.column.useSubsequence",
                from:"inventory.column.from",
                to:"inventory.column.to",
                active:"masterdata.column.Active"
            }

            $scope.button = {
                Create: "masterdata.button.Create",
                Edit: "masterdata.button.Edit",
                Back: "masterdata.button.Back",
                Delete: "masterdata.button.Delete",
                Cancel:"masterdata.button.Cancel",
                Save:"masterdata.button.Save",
                addItem:"masterdata.button.addItem",
                add:"masterdata.button.add"
            }

            $scope.common = {
                Inventory:"inventory.common.Inventory",
                Preference:"inventory.common.Preference",
                Sequences:"inventory.common.Sequences",
                Sequence:"inventory.common.Sequence",

            }

            $scope.msg = {
                from:"inventory.messages.from",
                to:"inventory.messages.to",
                dateValid:"inventory.messages.dateValid",
                selectDate:"inventory.messages.selectDate",
                required:"inventory.messages.required",
                insideValid:"inventory.messages.insideValid",
                containValid:"inventory.messages.containValid"
            }

            $scope.wrongPatternRule = "warehouse.messages.wrongPatternRule"

            $scope.CbxCreatedBy ={
                url:'/api/users/search?query=',
                key:'email',
                attr:'email',
                prefix:'#/users/',
                suffix:'/detail'
            }

            $scope.CbxActivate = {
                activateService:Sequence.activate,
                deactivateService:Sequence.deactivate
            }

            function convertToDate(timeValue) {
                var day = moment(timeValue, "DD/MM/YYYY HH:mm:ss");
                var result = day.toDate();
                return result
            }

            function genFromDate(time) {
                var date = $filter('date')(time, 'dd-MM-yyyy hh:mm:ss');
                return date
            }

            function genToDate(time) {
                var date = $filter('date')(time, 'dd-MM-yyyy hh:mm:ss');
                return date
            }


            if (angular.element('#info_detail').length) {
                //get product and render detail page
                Sequence.getOne($stateParams.sequenceId).then(function (data) {
                    $scope.sequence = data
                    $scope.subSequence = $scope.sequence.ranges
                    $scope.active = $scope.sequence.active
                    if ($scope.active == null) {
                        $scope.active = false
                    }

                    if ($scope.sequence.implementation == 0){
                        $scope.sequence.implementation = "Standard"
                    } else if ($scope.sequence.implementation == 1){
                        $scope.sequence.implementation = "No Gap"
                    }
                })
            }

            if (angular.element('#seq_create').length || angular.element('#seq_edit').length) {
                $scope.isAddNewItem = false
                $scope.required_msg = $translate.instant('admin.messages.required')
                $scope.maxLengthRule = "warehouse.messages.maxLengthRule";
                var $formValidate = $('#form_createseq');
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

                var $formValidateSub = $('#form_createsub');
                $formValidateSub
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

                var $dp_start = $('#uk_dp_start'),
                    $dp_end = $('#uk_dp_end');

                var start_date = UIkit.datepicker($dp_start, {
                    format:'DD-MM-YYYY 00:00:00'
                });

                start_date.options.maxDate = false;
                var end_date = UIkit.datepicker($dp_end, {
                    format:'DD-MM-YYYY 23:59:59'
                });

                $dp_start.on('change',function() {
                    end_date.options.minDate = $dp_start.val();
                });

                $dp_end.on('change',function() {
                    start_date.options.maxDate = $dp_end.val();
                });

                $scope.selectize_c_options = [
                    {name: 'Standard', id: '0'},
                    {name: 'No Gap', id: '1'}
                ];

                $scope.selectize_c_config = {
                    persist: true,
                    maxItems: 1,
                    valueField: 'id',
                    labelField: 'name',
                    searchField: ['name'],
                    placeholder: "Select implementation",
                    maxOptions: 10,

                };

                $scope.listFrom =[]
                $scope.listTo =[]
                $scope.fromDateValid = true
                $scope.toDateValid = true
                $scope.dateError=''

                if (angular.element('#seq_edit').length){
                    Sequence.getOne($stateParams.sequenceId).then(function (data) {
                        $scope.newSequence = data
                        $scope.subSequence = $scope.newSequence.ranges
                        for (var i=0; i< $scope.subSequence.length;i++){
                            $scope.subSequence[i].from = genFromDate($scope.subSequence[i].from)
                            $scope.subSequence[i].to = genToDate($scope.subSequence[i].to)
                            $scope.listFrom.push($scope.subSequence[i].from)
                            $scope.listTo.push($scope.subSequence[i].to)
                        }
                        $scope.active = $scope.newSequence.active
                        if ($scope.active == null) {
                            $scope.active = false
                        }

                        if ($scope.newSequence.implementation == 0){
                            $scope.selectize_c = "Standard"
                        } else if ($scope.newSequence.implementation == 1){
                            $scope.selectize_c = "No Gap"
                        }

                        // $scope.selectImple = function () {
                        //     if ($scope.selectize_c=="Standard"){
                        //         $scope.newSequence.implementation=0
                        //     } else if($scope.selectize_c=="No Gap"){
                        //         $scope.newSequence.implementation=1
                        //     }
                        // }

                        $scope.deleteOne = function () {
                            Sequence.deleteOne($scope.newSequence.id).then(function () {
                                $state.go('sequences');
                            }).catch(function(data){
                                ErrorHandle.handleError(data);
                            })
                        }

                    })
                } else {
                    $scope.newSequence={}
                    $scope.subSequence=[]
                    $scope.newSequence.useSubsequence = false
                    $scope.newSequence.implementation=0
                    $scope.newSequence.active = true

                    $scope.selectImple = function () {
                        if ($scope.selectize_c=="Standard"){
                            $scope.newSequence.implementation=0
                        } else if($scope.selectize_c=="No Gap"){
                            $scope.newSequence.implementation=1
                        }
                    }
                }

                $scope.edit = function($event,index){
                    // $event.preventDefault();
                    if(angular.isDefined($scope.targetUpdating) && $scope.targetUpdating != index){
                        $scope.save($event,$scope.targetUpdating)
                    }
                    $scope.entity = $scope.subSequence[index];
                    $scope.entity.index = index;
                    $scope.entity.editable = true;
                    $scope.entity.fromDateValid = true;
                    $scope.entity.toDateValid = true;
                    $scope.entity.fromRequire = true;
                    $scope.entity.toRequire = true;
                    $scope.entity.numRequire = true;
                    $scope.entity.saveClass = '';
                    $scope.entity.dateError ='';
                    $scope.targetUpdating = index


                    var $dp_start_edit = $('#uk_dp_start-'+index),
                        $dp_end_edit = $('#uk_dp_end-'+index),
                        $next_number_edit = $('#nextNumber-'+index);
                    var start_date_edit = UIkit.datepicker($dp_start_edit, {
                        format:'DD-MM-YYYY 00:00:00'
                    });

                    var end_date_edit = UIkit.datepicker($dp_end_edit, {
                        format:'DD-MM-YYYY 23:59:59'
                    });

                    end_date_edit.options.minDate = $dp_start_edit.val();
                    start_date_edit.options.maxDate = $dp_end_edit.val();
                    var old_start_date = $('#uk_dp_start-'+index).val()
                    var old_end_date = $('#uk_dp_end-'+index).val()

                    $dp_start_edit.on('change',function() {
                        if ($scope.listFrom.length > 0) {
                            var startDate = $('#uk_dp_start-'+index).val()
                            var endDate = $('#uk_dp_end-'+index).val()
                            $('#uk_dp_start-'+index).val(genFromDate(startDate))
                            if (startDate == ''){
                                $scope.entity.fromRequire = false
                                $scope.entity.saveClass  = 'custom-disabled'
                                return
                            }
                            var isValid = true
                            for (var i = 0; i < $scope.listFrom.length; i++) {
                                if($scope.listFrom[i] == old_start_date && $scope.listTo[i]==old_end_date){
                                    continue
                                }
                                var START = convertToDate(startDate)
                                var END = convertToDate(endDate)
                                var FROM = convertToDate($scope.listFrom[i])
                                var TO = convertToDate($scope.listTo[i])
                                if (START >= FROM && START <= TO) {
                                    isValid = false
                                    $scope.entity.dateError = $scope.msg.insideValid
                                    break
                                }

                                if(END > TO && START < TO){
                                    isValid = false
                                    $scope.entity.dateError = $scope.msg.containValid
                                    break
                                }

                            }
                            $scope.entity.fromDateValid = isValid
                            if (!isValid){
                                $scope.entity.saveClass  = 'custom-disabled'
                                return
                            }
                        }
                        $scope.entity.fromDateValid = true
                        $scope.entity.fromRequire = true
                        $scope.entity.saveClass  = ''
                        end_date_edit.options.minDate = $dp_start_edit.val();
                    });

                    $dp_end_edit.on('change',function() {
                        if ($scope.listFrom.length > 0) {
                            var startDate = $('#uk_dp_start-'+index).val()
                            var endDate = $('#uk_dp_end-'+index).val()
                            $('#uk_dp_end-'+index).val(genToDate(endDate))
                            if (endDate == ''){
                                $scope.entity.toRequire = false
                                $scope.entity.saveClass  = 'custom-disabled'
                                return
                            }
                            var isValid = true
                            for (var i = 0; i < $scope.listFrom.length; i++) {
                                if($scope.listFrom[i] == old_start_date && $scope.listTo[i]==old_end_date){
                                    continue
                                }
                                var START = convertToDate(startDate)
                                var END = convertToDate(endDate)
                                var FROM = convertToDate($scope.listFrom[i])
                                var TO = convertToDate($scope.listTo[i])
                                if (END >= FROM && END <= TO) {
                                    isValid = false
                                    $scope.entity.dateError = $scope.msg.insideValid
                                    break
                                }
                                if(START <= FROM && END >= TO){
                                    isValid = false
                                    $scope.entity.dateError = $scope.msg.containValid
                                    break
                                }
                            }
                            $scope.entity.toDateValid = isValid
                            if (!isValid){
                                $scope.entity.saveClass  = 'custom-disabled'
                                return
                            }


                        }
                        $timeout(function () {
                            $scope.entity.toDateValid = true
                            $scope.entity.toRequire = true
                            $scope.entity.saveClass  = ''
                            start_date_edit.options.maxDate = $dp_end_edit.val();
                        }, 100);

                    });

                    $next_number_edit.on('change',function () {
                        if($('#nextNumber-'+index).val()==''){
                            $scope.entity.numRequire = false
                            $scope.entity.saveClass  = 'custom-disabled'
                            return
                        }
                        $scope.entity.numRequire = true
                        $scope.entity.saveClass  = ''
                    })


                };

                $scope.removeSub = function (index) {
                    if (index > -1) {
                        $scope.subSequence.splice(index, 1);
                    }
                    reloadDateList()
                }

                $scope.save = function($event,index){
                    // $event.preventDefault();
                    if($scope.subSequence[index].fromDateValid &&
                        $scope.subSequence[index].toDateValid &&
                        $scope.subSequence[index].fromRequire &&
                        $scope.subSequence[index].toRequire &&
                        $scope.subSequence[index].numRequire ){
                        $scope.subSequence[index].editable = false;
                        reloadDateList()
                        delete $scope.targetUpdating
                        $timeout(function () {
                            $scope.isTargetEdit = false
                        },100)

                        return true
                    }
                    return false
                };

                $scope.delete = function($event,index,userIndex){
                    $event.preventDefault();
                    UIkit.modal.confirm('Remove this row (id:'+userIndex+')?', function(){
                        $scope.subSequence.splice(index,1);
                    });
                };


                $scope.fromDate =''
                $scope.toDate=''
                $scope.nextNumber=''
                $scope.isNewItem = false
                $scope.isTarget = false
                $scope.isTargetEdit = false

                $scope.addNewItem = function () {
                    $scope.isNewItem = !$scope.isNewItem
                    if(!$scope.isTarget){
                        $timeout(function () {
                            $scope.isTarget = !$scope.isTarget
                        });
                    }

                }

                $scope.createNewItem = function () {
                    $('#form_createsub').parsley();
                    if($scope.form_createsub.$valid && $scope.fromDateValid && $scope.toDateValid){
                        var newItem = {
                            from:$scope.fromDate,
                            to:$scope.toDate,
                            nextNumber:$scope.nextNumber
                        }
                        $scope.listFrom.push($('#uk_dp_start').val())
                        $scope.listTo.push($('#uk_dp_end').val())
                        $scope.subSequence.push(newItem)
                        $scope.fromDate=''
                        $scope.toDate=''
                        $scope.nextNumber=''
                        start_date.options.maxDate = false;
                        $timeout(function () {
                            $scope.isNewItem = false
                            $scope.isTarget = false
                        })

                        return true

                    }
                    return false
                }

                var record = $('#newRecord')
                $(window).click(function(event) {
                    //Create
                    if (record.has(event.target).length == 0 && !record.is(event.target)){
                        if($scope.isTarget){
                            //check empty row
                            if((!angular.isDefined($scope.fromDate) || $scope.fromDate =='')
                                && (!angular.isDefined($scope.toDate) || $scope.toDate =='')
                                && (!angular.isDefined($scope.nextNumber) || $scope.nextNumber =='')
                            ){
                                $scope.isNewItem = false
                                $scope.isTarget = false
                            } else {
                                $scope.createNewItem()  //create item
                            }
                        }
                    } else {
                        $scope.isTarget = true
                    }
                    //Edit
                    var editRedocr = $('#r_' + $scope.targetUpdating)
                    if (editRedocr.has(event.target).length == 0 && !editRedocr.is(event.target)){
                        if($scope.isTargetEdit){
                            if(angular.isDefined($scope.targetUpdating)){
                                $scope.save(event,$scope.targetUpdating)
                            }
                        }

                    } else {
                        $scope.isTargetEdit = true
                    }
                });

                $scope.fromDateValidation = function () {
                    if ($scope.listFrom.length > 0) {
                        var startDate = $('#uk_dp_start').val()
                        var endDate = $('#uk_dp_end').val()
                        for (var i = 0; i < $scope.listFrom.length; i++) {
                            var START = convertToDate(startDate)
                            var FROM = convertToDate($scope.listFrom[i])
                            var TO = convertToDate($scope.listTo[i])

                            if (START >= FROM && START <= TO) {
                                $timeout(function () {
                                    $scope.fromDateValid = false
                                    $scope.dateError = $scope.msg.insideValid
                                }, 100);

                                break
                            }

                            if (endDate !=''){
                                var END = convertToDate(endDate)
                                if(END >= TO && START <= TO){
                                    $scope.fromDateValid = false
                                    $scope.dateError = $scope.msg.containValid
                                    break
                                }
                            }

                        }
                        $scope.fromDateValid = true
                    }
                }
                $scope.toDateValidation = function () {
                    if($scope.listFrom.length >0){
                        var startDate = $('#uk_dp_start').val()
                        var endDate = $('#uk_dp_end').val()
                        for (var i=0;i < $scope.listFrom.length; i++){
                            var END = convertToDate(endDate)
                            var FROM = convertToDate($scope.listFrom[i])
                            var TO = convertToDate($scope.listTo[i])
                            if (END >= FROM && END <= TO) {
                                $scope.toDateValid = false
                                $scope.dateError = $scope.msg.insideValid
                                break
                            }

                            if (startDate !=''){
                                var START = convertToDate(startDate)
                                if(START <= FROM && END >= TO){
                                    $scope.toDateValid = false
                                    $scope.dateError = $scope.msg.containValid
                                    break
                                }
                            }

                        }
                    }
                    $scope.toDateValid = true
                }


                $scope.submit = function() {
                    $('#form_createseq').parsley();
                    if($scope.form_createseq.$valid){
                        if($scope.newSequence.useSubsequence){
                            $scope.newSequence.ranges = $scope.subSequence;
                        }

                        Sequence.create($scope.newSequence)
                            .then(function(){
                                $state.go('sequences');
                            })
                            .catch(function(data){
                                ErrorHandle.handleError(data);
                            })

                    }
                }

                $scope.update = function() {
                    $('#form_createseq').parsley();
                    if($scope.form_createseq.$valid){
                        if($scope.newSequence.useSubsequence){
                            $scope.newSequence.ranges = $scope.subSequence;
                        }

                        Sequence.update($scope.newSequence)
                            .then(function(){
                                $state.go('sequences-detail',{sequenceId: $scope.newSequence.id });
                            })
                            .catch(function(data){
                                ErrorHandle.handleError(data);
                            })
                    }
                }

                function reloadDateList() {
                    $scope.listFrom=[]
                    $scope.listTo=[]
                    for (var i=0; i< $scope.subSequence.length;i++){
                        $scope.listFrom.push($scope.subSequence[i].from)
                        $scope.listTo.push($scope.subSequence[i].to)
                    }
                }

            }

        }
    ]);

