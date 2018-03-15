/*
* Angular Selectize
* v 1.2.3
* https://github.com/machineboy2045/angular-selectize
*/

/*global $:Selectize */

angular
    .module('selectize', [])
    .value('selectizeConfig', {})
    .directive("selectize", [
        'selectizeConfig',
        '$timeout',
        'apiData',
        '$q',
        'TableMultiple',
        'utils',
        function (selectizeConfig,$timeout,apiData,$q,TableMultiple,utils) {
            return {
                restrict: 'EA',
                require: '^ngModel',
                scope: {
                    ngModel: '=',
                    config: '=?',
                    options: '=?',
                    ngDisabled: '=',
                    ngRequired: '&',

                    //toanvd
                    ngModelObject: '=',

                    table: '=',
                    column: '=',
                    scopeController: '=',
                    valueRelatedBefore : '=',
                    fieldRelatedBefore : '=',
                    valueRelatedAfter : '=',
                    fieldRelatedAfter : '=',
                    apiAfter : '=',
                    keyFieldAfter : '=',
                    getFieldAfter : '=',

                    totalCount: '=',
                    page: '=',
                    perPage: '=',
                    queryRelate: '=',
                    resetScroll: '=',

                    moreParams: '=',
                    isShown: '='
                    //end toanvd
                },
                link: function (scope, element, attrs, modelCtrl) {
                    if (!Selectize) {
                        throw new Error("Selectize JavaScript library should be loaded before using this angular module.");
                    }

                    Selectize.defaults.maxItems = null; //default to tag editor
                    Selectize.defaults.hideSelected = true;

                    if(attrs.position) {
                        scope.posBottom = attrs.position;
                    }

                    Selectize.defaults.onDropdownOpen = function($dropdown) {
                        if(angular.isDefined(scope.isShown))
                            scope.isShown = true;
                        $dropdown
                            .hide()
                            .velocity('slideDown', {
                                begin: function() {
                                    if (typeof scope.posBottom !== 'undefined') {
                                        $dropdown.css({'margin-top':'0'})
                                    }
                                },
                                duration: 200,
                                easing: [ 0.4,0,0.2,1 ]
                            })
                    };
                    Selectize.defaults.onDropdownClose = function($dropdown) {
                        if(angular.isDefined(scope.isShown))
                            scope.isShown = false;
                        $dropdown
                            .show()
                            .velocity('slideUp', {
                                complete: function() {
                                    if (typeof posBottom !== 'undefined') {
                                        $dropdown.css({'margin-top': ''})
                                    }
                                },
                                duration: 200,
                                easing: [ 0.4,0,0.2,1 ]
                            });
                    };

                    Selectize.defaults.onChange = function() {
                        if(!!$(element).attr('data-parsley-id')) {
                            $(element).parsley().validate();
                        }
                    };

                    Selectize.defaults.onInitialize = function() {
                        if($(element)[0].selectize.isRequired) {
                            $timeout(function() {
                                $(element).prop('required', true);
                            });
                        }
                    };

                    var selectize, config = angular.extend({}, Selectize.defaults, selectizeConfig, scope.config);

                    modelCtrl.$isEmpty = function (val) {
                        return (val === undefined || val === null || !val.length); //override to support checking empty arrays
                    };

                    function createItem(input) {
                        var data = {};
                        data[config.labelField] = input;
                        data[config.valueField] = input;
                        return data;
                    }

                    function toggle(disabled) {
                        disabled ? selectize.disable() : selectize.enable();
                    }

                    var validate = function () {
                        var isInvalid = (scope.ngRequired() || attrs.required || config.required) && modelCtrl.$isEmpty(scope.ngModel);
                        modelCtrl.$setValidity('required', !isInvalid);
                    };

                    function generateOptions(data) {
                        if (!data)
                            return [];

                        data = angular.isArray(data) ? data : [data];

                        return $.map(data, function (opt) {
                            return typeof opt === 'string' ? createItem(opt) : opt;
                        });
                    }

                    function updateSelectize() {
                        validate();

                        selectize.$control.toggleClass('ng-valid', modelCtrl.$valid);
                        selectize.$control.toggleClass('ng-invalid', modelCtrl.$invalid);
                        selectize.$control.toggleClass('ng-dirty', modelCtrl.$dirty);
                        selectize.$control.toggleClass('ng-pristine', modelCtrl.$pristine);

                        var value = selectize.items.slice();
                        if (config.maxItems === 1) {
                            value = value[0];
                        }
                        if (!angular.equals(value, scope.ngModel)) {
                            selectize.addOption(generateOptions(scope.ngModel));
                            selectize.setValue(scope.ngModel);
                        }
                    }

                    var onChange = config.onChange,
                        onOptionAdd = config.onOptionAdd;

                    config.onChange = function () {
                        var args = arguments;
                        scope.$evalAsync(function () {
                            var value = selectize.items.slice();
                            if (config.maxItems === 1) {
                                value = value[0];
                            }
                            if (!angular.equals(value, scope.ngModel)) {
                                modelCtrl.$setViewValue(value);
                                if (onChange) {
                                    onChange.apply(this, args);
                                }
                            }
                        });
                    };

                    config.onOptionAdd = function (value, data) {
                        if (scope.options.indexOf(data) === -1)
                            scope.options.push(data);

                        if (onOptionAdd) {
                            onOptionAdd.apply(this, arguments);
                        }
                    };

                    // ngModel (ie selected items) is included in this because if no options are specified, we
                    // need to create the corresponding options for the items to be visible
                    //scope.options = generateOptions((scope.options || config.options || scope.ngModel).slice());

                    scope.generatedOptions = generateOptions( (scope.options || config.options || scope.ngModel).slice() );
                    scope.options.length = 0;
                    scope.generatedOptions.forEach(function (item) {
                        scope.options.push(item);
                    });

                    var angularCallback = config.onInitialize;

                    config.onInitialize = function () {
                        selectize = element[0].selectize;
                        //selectize.addOption(scope.options);
                        selectize.addOption(scope.generatedOptions);
                        selectize.setValue(scope.ngModel);

                        //provides a way to access the selectize element from an
                        //angular controller
                        if (angularCallback) {
                            angularCallback(selectize);
                        }

                        scope.$watch('options', function () {
                            scope.generatedOptions = generateOptions( (scope.options || config.options || scope.ngModel).slice() );
                            scope.options.length = 0;
                            scope.generatedOptions.forEach(function (item) {
                                scope.options.push(item);
                            });
                            selectize.clearOptions();
                            selectize.addOption(scope.generatedOptions);
                            selectize.setValue(scope.ngModel);
                            //selectize.clearOptions();
                            //selectize.addOption(scope.options);
                            //selectize.setValue(scope.ngModel);
                        }, true);

                        scope.$watchCollection('ngModel', updateSelectize);
                        scope.$watch('ngDisabled', toggle);
                    };

                    element.after('<div class="selectize_fix"></div>');

                    element.selectize(config);

                    element.on('$destroy', function () {
                        if (selectize) {
                            selectize.destroy();
                            element = null;
                        }
                    });

                    //toanvd
                    if(angular.isDefined(scope.table) && scope.table != null){
                        //console.log('watch ngModel process table');
                        scope.$watch('ngModel', function(newVal, oldVal) {
                            //console.log(newVal)
                            if(newVal != -1){
                                if(angular.isDefined(newVal) && newVal.length > 0) {
                                    scope.table.param_filter_list[scope.column] = newVal;
                                    scope.scopeController.handleFilter(scope.table.idTable);
                                }else{//if(oldVal != -1){
                                    scope.table.param_filter_list[scope.column] = "";
                                    TableMultiple.reloadPage(scope.table.idTable);
                                }
                            }
                        }, true);
                    }

                    //get ngModel Object
                    if(angular.isDefined(scope.ngModelObject)){
                        scope.$watch('ngModel', function(newVal, oldVal) {
                            //console.log('watch ngModel Object');
                            //console.log(newVal)
                            if(newVal != -1){
                                if(angular.isDefined(newVal) && newVal!= null){
                                    //console.log(scope.options)
                                    var arr_mapping = scope.options.filter(function( obj ) {
                                        if(angular.isDefined(obj[scope.config.valueField]))
                                            return obj[scope.config.valueField] == newVal;
                                    });
                                    scope.ngModelObject = utils.removeDuplicateArrayByProp(arr_mapping,scope.config.valueField);
                                }else{ //if(oldVal != -1){
                                    scope.ngModelObject = [];
                                }
                            }
                            //console.log(result)
                        }, true);
                    }

                    //Handle relate
                    if(angular.isDefined(scope.moreParams)){
                        scope.$watch('moreParams', function(newVal) {
                            // console.log('watch more Params');
                            // console.log(newVal)
                            if(newVal != null) scope.queryRelate = scope.moreParams;
                        }, true);
                    }

                    //Auto relate
                    scope.getValueRelatedAfter = function (api,value,field,attr) {
                        //Tìm giá trị để load lại theo cbx phía sau
                        var deferred = $q.defer();
                        apiData.getAttrByKey(api,field,value,attr).then(function (data) {
                            //console.log(data);
                            deferred.resolve(data);
                        })
                        return deferred.promise;
                    }
                    scope.genQueryRelate = function (value) {

                        //console.log(scope.ngModel)
                        // console.log(value)

                        if(angular.isDefined(scope.ngModel) && scope.ngModel.length > 0){
                            // console.log('k reset')
                        }else{
                            // console.log('reset');
                            scope.options = [];selectize.clearOptions();
                        }

                        if(angular.isDefined(scope.valueRelatedBefore) && scope.valueRelatedBefore.length > 0){
                            // console.log('before ')
                            //console.log(value.toString())
                            scope.queryRelate = value.toString().length > 0 ? scope.fieldRelatedBefore + '=in=(' + value.toString() + ')' : "" ;
                        }else if(angular.isDefined(scope.valueRelatedAfter) && scope.valueRelatedAfter.length > 0){
                            // console.log('after ')
                            //console.log(value.toString())
                            scope.queryRelate = value.toString().length > 0 ? scope.fieldRelatedAfter + '=in=(' + value.toString() + ')' : "";
                        }else scope.queryRelate = "";
                    }
                    if(angular.isDefined(scope.valueRelatedBefore)){
                        scope.$watch('valueRelatedBefore', function(newVal) {
                            // console.log('watch valueRelatedBefore');
                            //console.log(newVal)
                            scope.totalCount = null;scope.resetScroll = true;
                            if(angular.isDefined(newVal) && newVal.length > 0) {

                            }

                            scope.genQueryRelate(scope.valueRelatedBefore);
                        }, true);
                    }
                    if(angular.isDefined(scope.valueRelatedAfter)){
                        scope.$watch('valueRelatedAfter', function(newVal) {
                            // console.log('watch valueRelatedAfter');
                            scope.totalCount = null;scope.resetScroll = true;
                            if(angular.isDefined(newVal) && newVal.length > 0) {
                                //console.log(newVal);
                                scope.getValueRelatedAfter(scope.apiAfter, newVal, scope.keyFieldAfter, scope.getFieldAfter)
                                    .then(function(result) {
                                        /*scope.queryRelate = scope.fieldRelatedAfter + '=in=(' + result.toString() + ')';
                                        scope.totalCount = null;scope.resetScroll = true;*/

                                        scope.genQueryRelate(result);
                                    })
                                    .catch(function(fallback) {

                                    });
                            }else{
                                scope.genQueryRelate("");
                            }

                        }, true);
                    }

                    /*if(angular.isDefined(scope.moreParams)){
                        scope.$watch('resetScroll', function(newVal) {
                            if(newVal == true) scope.moreParams = "";//console.log(scope.moreParams)}
                        }, true);
                    }*/
                    //end toanvd
                }
            };
        }
    ]);

    // tooltip
    Selectize.define('tooltip', function (options) {
        var self = this;
        this.setup = (function () {
            var original = self.setup;
            return function () {
                original.apply(this, arguments);
                var $wrapper = this.$wrapper,
                    $input = this.$input;
                if ($input.attr('title')) {
                    $wrapper
                        .attr('title', $input.attr('title'))
                        .attr('data-uk-tooltip', $input.attr('data-uk-tooltip'));
                }
            };
        })();
    });

    // disable option
    // https://github.com/mondorobot/selectize-disable-options
    Selectize.define('disable_options', function(options) {
        var self = this;

        options = $.extend({
            'disableOptions': []
        }, options);

        self.onFocus = (function() {
            var original = self.onFocus;

            return function() {
                original.apply(this, arguments);

                $.each(options.disableOptions, function(index, option) {
                    self.$dropdown_content.find('[data-value="' + String(option) + '"]').addClass('option-disabled');
                });
            };
        })();

        self.onOptionSelect = (function() {
            var original = self.onOptionSelect;

            return function(e) {
                var value, $target, $option;

                if (e.preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                $target = $(e.currentTarget);

                if ($target.hasClass('option-disabled')) {
                    return;
                } else if ($target.hasClass('create')) {
                    self.createItem();
                } else {
                    value = $target.attr('data-value');
                    if (value) {
                        self.lastQuery = null;
                        self.setTextboxValue('');
                        self.addItem(value);
                        if (!self.settings.hideSelected && e.type && /mouse/.test(e.type)) {
                            self.setActiveOption(self.getOption(value));
                        }
                    }

                    self.blur();
                }
                return original.apply(this, arguments);
            };
        })();
    });

    //https://github.com/diegoleme/selectize.infinitescroll.js
    Selectize.define('infinite_scroll', function(options) {
    var self = this, page = 0;

    self.infinitescroll = {
        onScroll: function() {
            var scrollBottom = self.$dropdown_content[0].scrollHeight - (self.$dropdown_content.scrollTop() + self.$dropdown_content.height())
            //console.log(scrollBottom)
            if(scrollBottom < 300){
                //page++;
                //console.log(page)
                var query = JSON.stringify({
                    search: self.lastValue,
                    page: page
                })
                self.$dropdown_content.off('scroll')
                self.onSearchChange(query)
            }
        }
    };

    self.onFocus = (function() {
            //console.log('on focus')
            var original = self.onFocus;
            return function() {
                var query = JSON.stringify({
                    search: self.lastValue,
                    page: page
                })

                original.apply(self, arguments);
                self.onSearchChange(query)
            };
        })();

    self.onKeyUp = function(e) {
        //console.log('on key up')
        var self = this;

        if (self.isLocked) return e && e.preventDefault();
        var value = self.$control_input.val() || '';

        if (self.lastValue !== value) {
            var query = JSON.stringify({
                search: value,
                page: page = 0
            });

            self.lastValue = value;
            self.onSearchChange(query);
            self.refreshOptions();
            self.clearOptions();
            self.trigger('type', value);
        }
    };

    self.on('load',function(callback){

        //console.log(self.$dropdown_content.scrollTop())
        //console.log(self.$dropdown_content.innerHeight())
        //console.log(self.$dropdown_content[0].scrollHeight)
        //if(self.$dropdown_content.scrollTop() + 450 > self.$dropdown_content[0].scrollHeight)

        //scrollBottom = self.$dropdown_content[0].scrollHeight - (self.$dropdown_content.scrollTop() + self.$dropdown_content.height())
        //console.log(scrollBottom)
        //if(0 < scrollBottom && scrollBottom < 300) {
            //page++;
            //console.log(page)
        //}

        page++;
        if(callback == true) {
            self.loadedSearches.page = 0; page=0;
            //console.log('reset page')
            //self.clearOptions();
            //self.renderCache = {};
        }
        self.$dropdown_content.on('scroll', self.infinitescroll.onScroll);
    });

});