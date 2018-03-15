(function () {
    'use strict';
    angular.module('erpApp')
        .controller('ProductHomeController', ProductController);

    ProductController.$inject = ['$scope', '$rootScope', '$timeout', '$compile', 'Product', '$stateParams', '$interval', 'TableMultiple', '$translate', '$window', 'Category', 'ErrorHandle', '$state']

    function ProductController($scope, $rootScope, $timeout, $compile, Product, $stateParams, $interval, TableMultiple, $translate, $window, Category, ErrorHandle, $state) {
        $scope.category = {}
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, options) {
            if (toState.name == "products" && (fromState.name == "products-detail" || fromState.name == "products-create" || fromState.name == "products-edit")) {
                $state.go('products', {}, {reload: true});
            }
        });

        angular.element($window).bind('resize', function () {
            $scope.fullsize = {
                "height": $(window).height() - 300
            }
        });

        $scope.fullsize = {
            "height": $(window).height() - 300
        }

        $scope.button = {
            addCate: "masterdata.button.addCate",
            Rename: "masterdata.button.Rename",
            Remove: "masterdata.button.Remove",
            Create: "masterdata.button.Create",
            Edit: "masterdata.button.Edit",
            Back: "masterdata.button.Back",
            Delete: "masterdata.button.Delete",
            Clear: "masterdata.button.Clear",
        }

        $scope.common = {
            Search: "masterdata.common.Search",
            Home: "masterdata.common.Home",
            Products: "masterdata.common.Products",
            Product: "masterdata.common.Product",
            GenInfo: "masterdata.common.GenInfo",
            Inventory: "masterdata.common.Inventory",
            Purchase: "masterdata.common.Purchase",
            nodata: "masterdata.common.nodata",
            version: "masterdata.common.version",
            attFfile: "masterdata.common.attFfile"
        }

        $scope.msg = {
            "showCate": "masterdata.messages.showCate",
            "hideCate": "masterdata.messages.hideCate"
        }
        $scope.maxLengthRule = "error.common.maxLengthRule";
        $scope.required_msg = 'admin.messages.required'

        $scope.CbxCreatedBy = {
            url: '/api/users/search?query=',
            key: 'email',
            attr: 'email',
            prefix: '#/users/',
            suffix: '/detail'
        }

        //binding context to category tree
        function bindContextMenu(span) {
            // Add context menu to this node:
            $(span).contextMenu({menu: "myMenu"}, function (action, el, pos) {
                // The event was bound to the <span> tag, but the node object
                // is stored in the parent <li> tag
                var node = $.ui.fancytree.getNode(el);
                switch (action) {
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

        //action for category tree
        function handleAction(action, node) {
            switch (action) {
                case "add":
                    addCategory(node)
                    break;
                case "edit":
                    editCategory(node)
                    break;
                case "rename":
                    alert("Clipoard is empty.");
                    break;
                case "remove":
                    deleteCategory(node)
                    break;
                default:
                    alert("Unhandled clipboard action '" + action + "'");
            }
        };

        function getParent(node) {
            var relation = ""
            while (node.parent != null) {
                relation = node.title + "/" + relation
                node = node.parent
            }
            return relation
        }

        function getRootKey(node) {
            var key = 0
            while (node.key != 0) {
                key = node.key
                node = node.parent
            }
            return key
        }

        //create new category
        function addCategory(node) {
            $('#parent').val(getParent(node));
            $scope.treeNode = node
            var parentId = 1;
            if (node.key != 0) {
                parentId = node.key
            }
            $scope.category = {
                "name": $("#cname").val(),
                "parentId": parentId,
                "description": $("#description").val()
            }
            $('#addBtn').click();
        }

        //edit new category
        function editCategory(node) {
            $('#eparent').val(getParent(node));
            Category.getOne(node.key).then(function (data) {
                $scope.eCategory = data
                $scope.treeNode = node
                $("#ename").val($scope.eCategory.name)
                $("#edescription").val($scope.eCategory.description)
            })
            $('#editBtn').click();
        }

        $scope.createCategory = function () {
            console.log('hihi');
            Category.create($scope.category).then(function (data) {
                var child = {
                    "title": data.name,
                    "key": data.id,
                    "folder": true
                }
                $scope.treeNode.addChildren(child)
            })
                .catch(function (data) {
                    ErrorHandle.handleError(data);
                })
        }

        $scope.updateCategory = function () {
            Category.update($scope.eCategory).then(function (data) {
                $scope.treeNode.setTitle($scope.eCategory.name)
            }).catch(function (data) {
                ErrorHandle.handleError(data);
            })
        }

        function deleteCategory(node) {
            // console.log($scope.TABLES[table_id].param_check_list)
            UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                Category.deleteOne(node.key).then(function () {
                    node.remove()
                }).catch(function (data) {
                    ErrorHandle.handleError(data);
                })


            }, {
                labels: {
                    'Ok': $translate.instant("common-ui-element.button.Delete"),
                    'Cancel': $translate.instant("common-ui-element.button.Cancel")
                }
            });
        }


        // if (angular.element('#info_list').length) {
        // $("#table_content").css('min-height', $( window ).height() - 300);
        // $("#table_content").css('max-height', $( window ).height() - 300);
        // angular.element($window).bind('resize', function(){
        //     $("#table_content").css('min-height', $( window ).height() - 300);
        //     $("#table_content").css('max-height', $( window ).height() - 300);
        // });
        // var ts = angular.element(document.querySelector('#ts_pager_filter'))
        // angular.element($window).bind('mousewheel', function () {
        //     var translate = "translate(0,"+$window.pageYOffset+"px)";
        //     console.log(translate)
        //     console.log(ts.style.transform)
        //     ts.style.transform = translate;
        // })

        Category.getTree().then(function (data) {
            $("#tree").fancytree({

                extensions: ["dnd", "filter", "edit"],
                source: data,
                activate: function (event, data) {
                    var node = data.node;
                    $("#echoActivated").text(node.title + ", key=" + node.key);
                },
                click: function (event, data) {
                    var nodes = []
                    data.node.visit(function (node) {
                        nodes.push(node.key);  // or node.key, ...
                    });
                    if (nodes.length == 0) {
                        nodes.push(data.node.key)
                    }

                    var typeKey = getRootKey(data.node)
                    $rootScope.findByTree(nodes, data.node.key, typeKey)
                    if ($(".contextMenu:visible").length > 0) {
                        $(".contextMenu").hide();
                    }
                },
                createNode: function (event, data) {
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
                    dragStart: function (node, data) {
                        return true;
                    },
                    dragEnter: function (node, data) {
                        //               return true;
                        if (node.parent !== data.otherNode.parent)
                            return false;
                        return ["before", "after"];
                    },
                    dragDrop: function (node, data) {
                        data.otherNode.moveTo(node, data.hitMode);
                    }
                }
            });

            var $tFilter = $("#tree");
            var tree = $tFilter.fancytree("getTree");
            $("#filter_input").keyup(function (e) {
                var n,
                    opts = {
                        mode: "hide",
                        autoExpand: true,
                        leavesOnly: $("#leavesOnly").is(":checked")
                    },
                    match = $(this).val();

                if (e && e.which === $.ui.keyCode.ESCAPE || $.trim(match) === "") {
                    $("#tree_filter_reset").click();
                    return;
                }

                if ($("#tree_filter_regex").is(":checked")) {
                    // Pass function to perform match
                    n = tree.filterNodes(function (node) {
                        return new RegExp(match, "i").test(node.title);
                    }, opts);
                } else {
                    // Pass a string to perform case insensitive matching
                    n = tree.filterNodes(match, opts);
                }
                $("#tree_filter_reset").attr("disabled", false);

            });
            // reset filter

            $("#tree_filter_reset").click(function () {
                $("#filter_input").val('');
                tree.clearFilter();
            });

        })

        $scope.hideCategories = false;
        $scope.tableGrid = "uk-width-medium-7-10"
        $scope.showTree = function showTree() {
            $scope.hideCategories = !$scope.hideCategories;
            if ($scope.hideCategories) {
                $scope.tableGrid = "uk-width-medium-10-10"
            } else {
                $scope.tableGrid = "uk-width-medium-7-10"
            }
        }

        var $formValidate = $('#form_create_category');
        $formValidate
            .parsley({
                'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
            })
            .on('form:validated', function () {
                $scope.$apply();
            })
            .on('field:validated', function (parsleyField) {
                if ($(parsleyField.$element).hasClass('md-input')) {
                    $scope.$apply();
                }
            });

        var $formValidate2 = $('#form_edit_category');
        $formValidate2
            .parsley({
                'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
            })
            .on('form:validated', function () {
                $scope.$apply();
            })
            .on('field:validated', function (parsleyField) {
                if ($(parsleyField.$element).hasClass('md-input')) {
                    $scope.$apply();
                }
            });

        var fields = ["id", "id", "name", "categoryName", "description", "type", "uomName", "available_quantity", "quantity_on_hand", "cost", "name", "manNames", "manPnValues", "supplierNames", "created", "createdBy", "updated", "updatedBy", "active"];
        var fieldsType = ["Number", "Number", "Text", "Text", "Text", "Number", "Text", "Number", "Number", "Number", "Text", "Text", "Text", "Text", "DateTime", "Text", "DateTime", "Text", "Number"]
        var loadFunction = Product.getPageMv;
        var newTableIds = {
            idTable: "table_product",
            model: "products",
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
            loadFunction: loadFunction,
            param_fields: fields,
            param_fields_type: fieldsType,
            handleAfterReload: null,
            handleAfterReloadParams: null,
            deleteCallback: null,
            customParams: "",
            pager_id: "table_ot_pager",
            selectize_page_id: "rd_selectize_page",
            selectize_pageNum_id: "rd_selectize_pageNum"
        }


        TableMultiple.initTableIds($scope, newTableIds);
        TableMultiple.sortDefault(newTableIds.idTable);
        TableMultiple.reloadPage(newTableIds.idTable);

        $scope.CbxActive = {
            Placeholder: 'Select status',
            Api: "/api/products/advanced-search",
            Table: $scope.TABLES['table_product'],
            Column: 18,
            Scope: $scope,
            ngModel: {value: 1, title: "Active"}
        }

        $scope.DatetimeRange1 = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_product'], // ** table filter
            Column: 14, // ** number column filter on table
            Scope: $scope
        }
        $scope.DatetimeRange2 = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_product'], // ** table filter
            Column: 16, // ** number column filter on table
            Scope: $scope
        }


        $scope.activate = function () {
            if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0) {
                Product.activate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                    AlertService.success('success.msg.active')
                    TableMultiple.reloadPage(newTableIds.idTable);
                }).catch(function (data) {
                    ErrorHandle.handleError(data);
                })
            }

        }

        $scope.deactivate = function () {
            if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0) {
                Product.deactivate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                    AlertService.success('success.msg.inactive')
                    TableMultiple.reloadPage(newTableIds.idTable);
                }).catch(function (data) {
                    ErrorHandle.handleError(data);
                })
            }
        }

        //handler hide/show columns
        $scope.checkColumnAll = false
        $scope.checkboxType = "container-checkbox"
        $scope.myColumns = ["Id", "Name", "Category", "Description", "Type", "Uom", "VNPT ManPN", "Manufacture", "ManPN", "Supplier", "Created", "Created By", "Update", "Updated By", "Active"]
        $scope.myColumnsShow = []
        $scope.defaultColumn = [1,2,3,4,5,6,7,8,9,14]
        for (var i = 0; i < $scope.myColumns.length; i++) {
            $scope.myColumnsShow.push(false)
        }
        for (var i = 0; i < $scope.defaultColumn.length; i++) {
            $scope.myColumnsShow[$scope.defaultColumn[i]] = true
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

        //find by dropdown type
        $scope.types = ["Part", "Semi", "Final Product"]
        $scope.getType = function getType(type) {
            if (type == 1) {
                return "Part"
            }
            if (type == 2) {
                return "Semi"
            }
            if (type == 3) {
                return "Final Product"
            }

        }
        $scope.typesValue = [true, true, true]
        $scope.treeParams = ''
        $scope.filterByType = function () {
            var isTypeCheck = false
            var typeCheck = []
            for (var i = 0; i < $scope.typesValue.length; i++) {
                if ($scope.typesValue[i]) {
                    isTypeCheck = true
                    typeCheck.push(i + 1)
                }
            }
            if (isTypeCheck) {
                if ($scope.treeParams == '') {
                    newTableIds.customParams = "type=in=(" + typeCheck.toString() + ")"
                    $scope.TABLES[newTableIds.idTable].firstLoad = false
                    TableMultiple.reloadPage(newTableIds.idTable);
                } else {
                    newTableIds.customParams = $scope.treeParams + ";" + "type=in=(" + typeCheck.toString() + ")"
                    $scope.TABLES[newTableIds.idTable].firstLoad = false
                    TableMultiple.reloadPage(newTableIds.idTable);
                }
            } else {
                newTableIds.customParams = $scope.treeParams
                $scope.TABLES[newTableIds.idTable].firstLoad = false
                TableMultiple.reloadPage(newTableIds.idTable);
            }
        }

        //find by categories tree
        $rootScope.findByTree = function findByTree(nodes, key, typeKey) {
            $scope.treeParams = ''
            if ($scope.key == key) {
                return
            }
            $scope.key = key
            if (key == 0) {
                for (var i = 0; i < $scope.typesValue.length; i++) {
                    $scope.typesValue[i] = true
                }
                $scope.filterByType()
            } else {
                $scope.treeParams = "categoryId=in=(" + nodes.toString() + ")"
                if (typeKey > 0) {
                    for (var i = 0; i < $scope.typesValue.length; i++) {
                        if (i == typeKey - 1) {
                            $scope.typesValue[i] = true
                        } else {
                            $scope.typesValue[i] = false
                        }
                    }
                }
                $scope.filterByType()
            }

        }
        $scope.key = 0;


    }

})();


