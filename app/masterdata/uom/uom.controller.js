angular
    .module('erpApp')
    .controller('UomController', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$compile',
        'Uom',
        '$stateParams',
        'utils',
        '$interval',
        'UomCategory',
        'TableMultiple',
        '$translate',
        'AlertService',
        '$state',
        'ErrorHandle',
        'apiData',
        '$http',
        function ($scope,$rootScope,$timeout,$compile,Uom,$stateParams,utils,$interval,UomCategory,TableMultiple,$translate,AlertService,$state,ErrorHandle,apiData,$http) {
            var vm = this;
            var oldName = null;
            var oldDescription = null;
            var oldParent = null;
            $scope.$on('$stateChangeSuccess',function(event,  toState, toParams, fromState, fromParams, options){
               if(toState.name == "uoms" && (fromState.name == "uoms-detail" || fromState.name == "uoms-create" || fromState.name == "uoms-edit")){
                   $state.go('uoms', {}, { reload: true });
               }
            });
            if (!$stateParams.type) {

                UomCategory.getTree().then(function (data) {
                    $("#treeUom").fancytree({
                        extensions: ["dnd","filter","edit"],
                        source: data,
                        activate: function(event, data) {
                            var node = data.node;
                            $("#echoActivated").text(node.title + ", key=" + node.key);
                        },
                        click: function(event, data) {
                            var nodes = []
                            data.node.visit(function(node) {
                                nodes.push(node.key);  // or node.key, ...
                            });
                            if (nodes.length==0){
                                nodes.push(data.node.key)
                            }

                            // var typeKey = getRootKey(data.node)
                            $rootScope.findByTree(nodes,data.node.key)
                            if( $(".contextMenu:visible").length > 0 ){
                                $(".contextMenu").hide();
                            }
                        },
                        createNode: function(event, data){
                            bindContextMenu(data.node.span);
                        },
                        filter: {
                            mode: "hide"  // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
                        }
                        ,
                        dnd: {
                            preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
                            preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
                            autoExpandMS: 400,
                            dragStart: function(node, data) {
                                return true;
                            },
                            dragEnter: function(node, data) {
                                //               return true;
                                if(node.parent !== data.otherNode.parent)
                                    return false;
                                return ["before", "after"];
                            },
                            dragDrop: function(node, data) {
                                data.otherNode.moveTo(node, data.hitMode);
                            }
                        }
                    });

                    var $tFilter = $("#treeUom");
                    var tree = $tFilter.fancytree("getTree");
                    $("#filter_input").keyup(function(e){
                        var n,
                            opts = {
                                mode: "hide",
                                autoExpand: true,
                                leavesOnly: $("#leavesOnly").is(":checked")
                            },
                            match = $(this).val();

                        if(e && e.which === $.ui.keyCode.ESCAPE || $.trim(match) === ""){
                            $("#tree_filter_reset").click();
                            return;
                        }

                        if($("#tree_filter_regex").is(":checked")) {
                            // Pass function to perform match
                            n = tree.filterNodes(function(node) {
                                return new RegExp(match, "i").test(node.title);
                            }, opts);
                        } else {
                            // Pass a string to perform case insensitive matching
                            n = tree.filterNodes(match, opts);
                        }
                        $("#tree_filter_reset").attr("disabled", false);

                    });
                    // reset filter

                    $("#tree_filter_reset").click(function(){
                        $("#filter_input").val('');
                        tree.clearFilter();
                    });

                })

                function bindContextMenu(span) {
                    // Add context menu to this node:
                    $(span).contextMenu({menu: "myMenu"}, function(action, el, pos) {
                        // The event was bound to the <span> tag, but the node object
                        // is stored in the parent <li> tag
                        var node = $.ui.fancytree.getNode(el);
                        switch( action ) {
                            case "add":
                            case "edit":
                            case "remove":
                            case "rename":
                                handleAction(action, node);
                                break;
                            default:
                                alert("Todo: appply action '" + action + "' to node " + node);
                        }
                    });
                };

                function handleAction(action, node) {
                    switch( action ) {
                        case "add":
                            $scope.treeNode = node
                            $('#cname').val('');
                            $('#cdescription').val('');

                            UomCategory.getAllByQuery("query=id>1")
                                .then(function(data){
                                    $scope.cbxSrc2CreateCate.Options = data;
                                    $scope.cbxSrc2CreateCate.ngModel = parseInt(node.key);
                                })
                            $('#addBtn').click();
                            break;
                        case "edit":
                            $scope.treeNode = node
                            oldName = null;
                            oldDescription = null;
                            oldParent = null;

                            $('#ename').val('');
                            $('#edescription').val('');

                            UomCategory.getById(node.key)
                                .then(function(data){
                                    $('#ename').val(data.name);
                                    $scope.category.name = data.name;
                                    oldName = data.name;
                                    oldDescription = data.description;
                                    oldParent = data.parentId;
                                    $('#edescription').val(data.description);
                                    $scope.category.description = data.description;

                                    UomCategory.getAllByQuery("query=id>1")
                                        .then(function(data1){
                                            $scope.cbxSrc2EditCate.Options = data1;
                                            $scope.cbxSrc2EditCate.ngModel = data.parentId;
                                        })

                                })


                            $('#editBtn').click();
                            break;
                        case "rename":
                            break;
                        case "remove":
                            deleteCategory(node);
                            break;
                        default:
                            alert("Unhandled clipboard action '" + action + "'");
                    }
                };

                $('#form_create_category')
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

                $scope.createCategory = function() {
                    // if($('#parent').val() == '' || $('#parent').val() == 'null') $scope.category.parentId = null;
                    // else $scope.category.parentId = $scope.treeNode.key;
                    if($scope.cbxSrc2CreateCate.ngModel == null) $scope.category.parentId = 1;
                    else $scope.category.parentId = $scope.cbxSrc2CreateCate.ngModel
                    if($scope.form_create_category.$valid){
                        UomCategory.create($scope.category)
                            .then(function(data){
                             if($scope.category.parentId == null) {
                                 window.location.reload();
                                 // var child = {
                                 //     "title": data.name,
                                 //     "key": data.id,
                                 //     "folder": true
                                 // }
                                 // var rootNode = $("#treeUom").fancytree("getRootNode");
                                 // rootNode.addChildren(child);
                             } else {
                                 window.location.reload();
                                 // var child = {
                                 //     "title": data.name,
                                 //     "key": data.id,
                                 //     "folder": true
                                 // }
                                 // $scope.treeNode.addChildren(child)
                             }
                            })
                            .catch(function(data){
                                ErrorHandle.handleError(data);
                            })
                    }
                };

                $scope.validateCreateCateButton = function () {
                    if($('#cname').val() != '' && $("#cname").val().length <= 255){
                        $("#createCate").removeClass("hideElement");
                        return true;
                    } else {
                        $("#createCate").addClass("hideElement");
                        return false;
                    }
                }

                $('#form_edit_category')
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

                $scope.editCategory = function() {

                    if($scope.cbxSrc2EditCate.ngModel == null) $scope.category.parentId = 1;
                    else $scope.category.parentId = $scope.cbxSrc2EditCate.ngModel

                    $scope.category.id = $scope.treeNode.key;


                    console.log('$scope.category  ' + $scope.category);
                    // if($scope.form_edit_category.$valid){
                        UomCategory.update($scope.category)
                            .then(function(){
                                // if($scope.category.parentId == null) {
                                    window.location.reload();
                                // }
                                // else $scope.treeNode.setTitle($scope.category.name)
                            })
                            .catch(function(data){
                                ErrorHandle.handleError(data);
                            })
                    // }
                };

                $scope.validateEditCateButton = function () {
                    if(($scope.category.name != null && $scope.category.name != '' && $scope.category.name != oldName && $scope.category.name.length <= 255)
                        || ($scope.category.description != '' && $scope.category.description != oldDescription)
                        || $scope.cbxSrc2EditCate.ngModel != oldParent){
                        $("#editCate").removeClass("hideElement");
                        return true;
                    } else {
                            $("#editCate").addClass("hideElement");
                            return false;
                    }
                }

            }

            $scope.cbxSrc2CreateCateInit = {
                url: '/api/uom-category', // ** api load data
                OriginParams: 'active==true;id>1', // ** init params -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.cbxSrc2CreateCate = { // ** replace name cbx
                ngModel : '', // ** value select -- array []
                Options: [], // ** list options cbx, default: []
                Table : null, // ** table filter
                Column : null, // ** number column filter on table
                Scope : $scope,
                Config: {
                    plugins: ['infinite_scroll'],//enable load more
                    maxItems: 1,
                    valueField: $scope.cbxSrc2CreateCateInit.valueField,
                    labelField: $scope.cbxSrc2CreateCateInit.labelField,
                    searchField: $scope.cbxSrc2CreateCateInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' +
                                '<span class="title">' + escape(data[$scope.cbxSrc2CreateCateInit.labelField]) + '</span>' +
                                '</div>';
                        },
                        item: function(data, escape) {
                            //return '<div class="item"><a href="' + escape(data[$scope.cbxSrc2CreateCateInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxSrc2CreateCateInit.labelField]) + '</a></div>';
                            return '<div class="item">' + escape(data[$scope.cbxSrc2CreateCateInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        query = JSON.parse(query)
                        if($scope.cbxSrc2CreateCateInit.resetScroll){
                            query.page = 0;
                            callback($scope.cbxSrc2CreateCateInit.resetScroll);
                            $scope.cbxSrc2CreateCateInit.resetScroll = false;
                        }
                        $scope.cbxSrc2CreateCateInit.page = query.page || 0;
                        if(!$scope.cbxSrc2CreateCateInit.totalCount || $scope.cbxSrc2CreateCateInit.totalCount > ( ($scope.cbxSrc2CreateCateInit.page - 1) * $scope.cbxSrc2CreateCateInit.perPage) ){
                            var api = apiData.genApi($scope.cbxSrc2CreateCateInit.url, $scope.cbxSrc2CreateCateInit.searchField, query.search, $scope.cbxSrc2CreateCateInit.perPage, null, $scope.cbxSrc2CreateCateInit.OriginParams,query.page,$scope.cbxSrc2CreateCateInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.cbxSrc2CreateCateInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

            $scope.cbxSrc2UomEditCateInit = {
                url: '/api/uom-category', // ** api load data
                OriginParams: 'active==true;id>1', // ** init params -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.cbxSrc2EditCate = { // ** replace name cbx
                ngModel : '', // ** value select -- array []
                Options: [], // ** list options cbx, default: []
                Table : null, // ** table filter
                Column : null, // ** number column filter on table
                Scope : $scope,
                Config: {
                    plugins: ['infinite_scroll'],//enable load more
                    maxItems: 1,
                    valueField: $scope.cbxSrc2UomEditCateInit.valueField,
                    labelField: $scope.cbxSrc2UomEditCateInit.labelField,
                    searchField: $scope.cbxSrc2UomEditCateInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' +
                                '<span class="title">' + escape(data[$scope.cbxSrc2UomEditCateInit.labelField]) + '</span>' +
                                '</div>';
                        },
                        item: function(data, escape) {
                            return '<div class="item">' + escape(data[$scope.cbxSrc2UomEditCateInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        query = JSON.parse(query)
                        if($scope.cbxSrc2UomEditCateInit.resetScroll){
                            query.page = 0;
                            callback($scope.cbxSrc2UomEditCateInit.resetScroll);
                            $scope.cbxSrc2UomEditCateInit.resetScroll = false;
                        }
                        $scope.cbxSrc2UomEditCateInit.page = query.page || 0;
                        if(!$scope.cbxSrc2UomEditCateInit.totalCount || $scope.cbxSrc2UomEditCateInit.totalCount > ( ($scope.cbxSrc2UomEditCateInit.page - 1) * $scope.cbxSrc2UomEditCateInit.perPage) ){
                            var api = apiData.genApi($scope.cbxSrc2UomEditCateInit.url, $scope.cbxSrc2UomEditCateInit.searchField, query.search, $scope.cbxSrc2UomEditCateInit.perPage, null, $scope.cbxSrc2UomEditCateInit.OriginParams,query.page,$scope.cbxSrc2UomEditCateInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.cbxSrc2UomEditCateInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

            $scope.uom = {};
            if($stateParams.type){
                if($stateParams.type == 0){
                    $scope.backType = "uoms";
                }else{
                    $scope.backType = "uoms-detail({uomId: "+$stateParams.type+"})";
                }

            }

            $scope.status = "Inactive"
            $scope.active = $scope.uom.active = true;
            var statusStyle = {
                true: "uk-text-success uk-text-bold",
                false: "uk-text-danger uk-text-bold"
            }
            if ($scope.active) {
                $scope.status = "Active"
            }
            $scope.activeClass = statusStyle[$scope.active]

            $scope.changeActive = function () {
                $scope.active = !$scope.active;
                $scope.uom.active = !$scope.uom.active;
                if ($scope.active) {
                    $scope.status = "Active"
                } else {
                    $scope.status = "Inactive"
                }
                $scope.activeClass = statusStyle[$scope.active]
            }

            $scope.urlCategory = "/api/uom-category/";
            $scope.attr = "name";

            $scope.hideCategories = false;
            $scope.tableGrid = "uk-width-medium-7-10"
            $scope.showTree = function showTree() {
                $scope.hideCategories = !$scope.hideCategories;
                if ($scope.hideCategories){
                    $scope.tableGrid = "uk-width-medium-10-10"
                } else {
                    $scope.tableGrid = "uk-width-medium-7-10"
                }
            };


            var queryCategory = "query=id>1"
            UomCategory.getByPage(queryCategory).then(function (data) {
                $scope.CbxStatus = {
                    Placeholder : 'Select category',
                    TextField : 'name',
                    ValueField : 'id',
                    Table : $scope.TABLES['tb_uom'],
                    Column : 3,
                    Scope : $scope,
                    ngModel : null,
                    DataSource : data
                }
            });

            $scope.uom_category_tree_options = [{}];
            var queryCategory = "query="
            UomCategory.getByPage(queryCategory).then(function (data) {
                $scope.uom_category_tree_options = data;
            });

            $scope.submit = function() {
                $('#form_createuom').parsley();
                if($scope.form_createuom.$valid){
                    Uom.create($scope.uom)
                        .then(function(){
                            $state.go('uoms');
                        })
                        .catch(function(data){
                            ErrorHandle.handleError(data);
                        })
                }
            };

            if ( angular.element('#form_createuom').length ) {
                $scope.required_msg = $translate.instant('admin.messages.required');
                $('#form_createuom')
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
            };

            // initialize tables

            var fields = ["id", "id", "name","categoryId","type", "rounding", "factor", "active","created","createdBy","updated","updatedBy"];
            var fieldsType =  ["Number","Number","Text","Number","Text","Number","Number", "Number","DateTime","Text","DateTime","Text"];
            var loadFunction = Uom.getByPage;

            var newTableIdsRd = {
                idTable: "tb_uom",// **
                model: "uoms",// **
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
                selectize_pageNum_options: ["5", "10", "25", "50"],
                selectize_pageNum_config: {
                    plugins: {
                        'tooltip': ''
                    },
                    create: false,
                    maxItems: 1
                },
                loadFunction: loadFunction,// **
                param_fields: fields,// **
                param_fields_type: fieldsType,// **
                handleAfterReload: null,
                handleAfterReloadParams: null,
                deleteCallback: null,
                customParams: "",// **
                pager_id: "table_uom_pager",// **
                selectize_page_id: "rd_selectize_page",// **
                selectize_pageNum_id: "rd_selectize_pageNum"// **
            }

            TableMultiple.initTableIds($scope, newTableIdsRd);
            TableMultiple.reloadPage(newTableIdsRd.idTable);

            $scope.deleteList = function (table_id) {
                // console.log($scope.TABLES[table_id].param_check_list)
                UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                    Uom.deleteByListIDs($scope.TABLES[table_id].param_check_list).then(function (data) {
                        if (data.length > 0){
                            ErrorHandle.handleErrors(data);
                        } else {
                            AlertService.success('success.msg.delete')
                        }
                        if($scope.TABLES[table_id].param_check_list.length != data.length ){
                            TableMultiple.reloadPage(newTableIdsRd.idTable);
                        }
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

            $scope.activateByListId = function () {
                if ($scope.TABLES[newTableIdsRd.idTable].param_check_list.length > 0){
                    Uom.activateByListIDs($scope.TABLES[newTableIdsRd.idTable].param_check_list).then(function () {
                        AlertService.success('success.msg.active')
                        TableMultiple.reloadPage(newTableIdsRd.idTable);
                    }).catch(function(data){
                        ErrorHandle.handleError(data);
                    })
                }

            }

            $scope.deactivateByListId = function () {
                if ($scope.TABLES[newTableIdsRd.idTable].param_check_list.length > 0){
                    Uom.deactivateByListIDs($scope.TABLES[newTableIdsRd.idTable].param_check_list).then(function () {
                        AlertService.success('success.msg.inactive')
                        TableMultiple.reloadPage(newTableIdsRd.idTable);
                    }).catch(function(data){
                        ErrorHandle.handleError(data);
                    })
                }
            }

            $scope.DatetimeRange1 = {
                dateStart: null,
                dateEnd: null,
                Table : $scope.TABLES['tb_uom'], // ** table filter
                Column : 8, // ** number column filter on table
                Scope : $scope
            }
            $scope.DatetimeRange2 = {
                dateStart: null,
                dateEnd: null,
                Table : $scope.TABLES['tb_uom'], // ** table filter
                Column : 10, // ** number column filter on table
                Scope : $scope
            }

            $scope.CbxCreatedBy ={
                url:'/api/users/search?query=',
                key:'email',
                attr:'email',
                prefix:'#/users/',
                suffix:'/detail'
            }

            $scope.columnsName = {
                Id:"masterdata.column.Id",
                Name:"masterdata.column.Unit",
                Category: "masterdata.column.Category",
                Type:"masterdata.column.UomType",
                Rounding:"masterdata.column.Rounding",
                Ratio:"masterdata.column.Ratio",
                Status:"masterdata.column.Status",
                cname:"masterdata.column.cname",
                parent:"masterdata.column.parent",
                Description: "masterdata.column.Description",
            }

            $scope.button = {
                addCate:"masterdata.button.addCate",
                Rename:"masterdata.button.Rename",
                Remove:"masterdata.button.Remove",
                Create:"masterdata.button.Create",
                Edit:"masterdata.button.Edit",
                Back:"masterdata.button.Back",
                Delete:"masterdata.button.Delete",
                New:"masterdata.button.New",
                Clear:"masterdata.button.Clear",
            }

            $scope.common = {
                Search:"masterdata.common.Search",
                Home:"masterdata.common.Home",
                Uom:"masterdata.column.Unit",
                Create:"masterdata.button.Create",
                Save:"masterdata.button.Save",
                Cancel:"masterdata.button.Cancel",
                Configuration:"masterdata.common.configuration",
                Close:"masterdata.button.Close",
            }

            $scope.maxLengthRule = "masterdata.messages.maxLengthRule";
            $scope.wrongPatternRule = "masterdata.messages.wrongPatternRule"

            $scope.category = {};
            $scope.key = 0;

            $scope.CbxActive = {
                Placeholder : 'Select status',
                Api : "api/uom",
                Table : $scope.TABLES['tb_uom'],
                Column : 7,
                Scope : $scope,
                ngModel:{value:1, title:"Active"}
            };

            $rootScope.findByTree = function findByTree(nodes, key) {
                // $scope.uom.category = category;
                if ($scope.key == key){
                    return
                }
                $scope.key = key;
                if (key == 1) {
                    $scope.TABLES[newTableIdsRd.idTable].customParams = ""
                    TableMultiple.reloadPage(newTableIdsRd.idTable);
                } else {
                    $scope.TABLES[newTableIdsRd.idTable].customParams = "categoryId=in=(" + key.toString() + ")";
                    TableMultiple.reloadPage(newTableIdsRd.idTable);
                }

            }

            function deleteCategory (node) {
                // console.log($scope.TABLES[table_id].param_check_list)
                UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                    UomCategory.deleteById(node.key).then(function () {
                        node.remove()
                    }).catch(function(data){
                        ErrorHandle.handleError(data);
                    })


                }, {
                    labels: {
                        'Ok': $translate.instant("common-ui-element.button.Delete"),
                        'Cancel': $translate.instant("common-ui-element.button.Close")
                    }
                });
            }

            //handler hide/show columns
            $scope.checkColumnAll = true
            $scope.checkboxType = "container-checkbox-dis"
            $scope.myColumns = ["Id","Unit of Measure","Category","Type","Rounding precision","Ratio","Status","Created","Created By","Update","Updated By"]
            $scope.myColumnsShow=[]
            for (var i=0; i<$scope.myColumns.length;i++){
                $scope.myColumnsShow.push(true)
            }

            $scope.handleColumn = function handleColumn() {
                $scope.checkColumnAll = !$scope.checkColumnAll
                if ($scope.checkColumnAll) {
                    for (var i = 0; i < $scope.myColumnsShow.length; i++) {
                        $scope.myColumnsShow[i] = true
                        $scope.checkboxType = "container-checkbox-dis"
                    }
                } else {
                    $scope.checkboxType = "container-checkbox"
                }
            }

            $scope.checkColumn = function () {
                if ($scope.checkColumnAll) {
                    for (var i = 0; i < $scope.myColumnsShow.length; i++) {
                        $scope.myColumnsShow[i] = true
                        $scope.checkboxType = "container-checkbox-dis"
                    }
                } else {
                    $scope.checkboxType = "container-checkbox"
                }
            }


            $scope.validateButton = function () {
                if($scope.form_createuom.$valid && $("#unit").val().length <= 255){
                    $("#createUom").removeClass("hideElement");
                    return true;
                } else {
                    $("#createUom").addClass("hideElement");
                    return false;
                }
            }

            $scope.showClear = function () {
                if($("#filter_input").val() != ''){
                    return false;
                } return true
            }

            $scope.cbxSrc2UomCateInit = {
                url: '/api/uom-category', // ** api load data
                OriginParams: 'active==true;id>1', // ** init params -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'name', searchField: 'name', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.cbxSrc2UomCate = { // ** replace name cbx
                ngModel : '', // ** value select -- array []
                Options: [], // ** list options cbx, default: []
                Table : null, // ** table filter
                Column : null, // ** number column filter on table
                Scope : $scope,
                Config: {
                    placeholder : 'Select category',
                    plugins: ['infinite_scroll'],//enable load more
                    maxItems: 1,
                    valueField: $scope.cbxSrc2UomCateInit.valueField,
                    labelField: $scope.cbxSrc2UomCateInit.labelField,
                    searchField: $scope.cbxSrc2UomCateInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' +
                                '<span class="title">' + escape(data[$scope.cbxSrc2UomCateInit.labelField]) + '</span>' +
                                '</div>';
                        },
                        item: function(data, escape) {
                            //return '<div class="item"><a href="' + escape(data[$scope.cbxSrc2UomCateInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxSrc2UomCateInit.labelField]) + '</a></div>';
                            return '<div class="item">' + escape(data[$scope.cbxSrc2UomCateInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        query = JSON.parse(query)
                        if($scope.cbxSrc2UomCateInit.resetScroll){
                            query.page = 0;
                            callback($scope.cbxSrc2UomCateInit.resetScroll);
                            $scope.cbxSrc2UomCateInit.resetScroll = false;
                        }
                        $scope.cbxSrc2UomCateInit.page = query.page || 0;
                        if(!$scope.cbxSrc2UomCateInit.totalCount || $scope.cbxSrc2UomCateInit.totalCount > ( ($scope.cbxSrc2UomCateInit.page - 1) * $scope.cbxSrc2UomCateInit.perPage) ){
                            var api = apiData.genApi($scope.cbxSrc2UomCateInit.url, $scope.cbxSrc2UomCateInit.searchField, query.search, $scope.cbxSrc2UomCateInit.perPage, null, $scope.cbxSrc2UomCateInit.OriginParams,query.page,$scope.cbxSrc2UomCateInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.cbxSrc2UomCateInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

            $scope.uom_type_options = [
                {
                    "id": "Reference Unit of Measure for this category",
                    "name": "Reference Unit of Measure for this category"
                },
                {
                    "id": "Smaller than the reference Unit of Measure",
                    "name": "Smaller than the reference Unit of Measure"
                },
                {
                    "id": "Bigger than the reference Unit of Measure",
                    "name": "Bigger than the reference Unit of Measure"
                }
            ];
            $scope.cbxSrc2UomTypeInit = {
                url: '', // ** api load data
                OriginParams: '', // ** init params -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: 'id', labelField: 'id', searchField: 'id', // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }
            $scope.cbxSrc2UomType = { // ** replace name cbx
                ngModel : '', // ** value select -- array []
                Options: $scope.uom_type_options, // ** list options cbx, default: []
                Table : null, // ** table filter
                Column : null, // ** number column filter on table
                Scope : $scope,
                Config: {
                    placeholder : 'Select type',
                    plugins: ['infinite_scroll'],//enable load more
                    maxItems: 1,
                    valueField: $scope.cbxSrc2UomTypeInit.valueField,
                    labelField: $scope.cbxSrc2UomTypeInit.labelField,
                    searchField: $scope.cbxSrc2UomTypeInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' +
                                '<span class="title">' + escape(data[$scope.cbxSrc2UomTypeInit.labelField]) + '</span>' +
                                '</div>';
                        },
                        item: function(data, escape) {
                            //return '<div class="item"><a href="' + escape(data[$scope.cbxSrc2UomTypeInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxSrc2UomCateInit.labelField]) + '</a></div>';
                            return '<div class="item">' + escape(data[$scope.cbxSrc2UomTypeInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        query = JSON.parse(query)
                        if($scope.cbxSrc2UomTypeInit.resetScroll){
                            query.page = 0;
                            callback($scope.cbxSrc2UomTypeInit.resetScroll);
                            $scope.cbxSrc2UomTypeInit.resetScroll = false;
                        }
                        $scope.cbxSrc2UomTypeInit.page = query.page || 0;
                        if(!$scope.cbxSrc2UomTypeInit.totalCount || $scope.cbxSrc2UomTypeInit.totalCount > ( ($scope.cbxSrc2UomTypeInit.page - 1) * $scope.cbxSrc2UomTypeInit.perPage) ){
                            var api = apiData.genApi($scope.cbxSrc2UomTypeInit.url, $scope.cbxSrc2UomTypeInit.searchField, query.search, $scope.cbxSrc2UomTypeInit.perPage, null, $scope.cbxSrc2UomTypeInit.OriginParams,query.page,$scope.cbxSrc2UomTypeInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.cbxSrc2UomTypeInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

        }
    ]);