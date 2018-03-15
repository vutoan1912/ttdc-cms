angular
    .module('erpApp')
    .controller('UomCategoriesController', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$compile',
        '$stateParams',
        '$interval',
        'UomCategory',
        '$translate',
        function ($scope, $rootScope, $timeout, $compile, $stateParams, $interval, UomCategory, $translate) {

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
                        $('#parent').val(getParent(node));
                        $scope.category.parentId = node.key;
                        $('#addBtn').click();
                        break;
                    case "edit":
                        var urlEdit = getParent(node).split('/');
                        $('#ename').val(urlEdit[urlEdit.length - 2]);
                        $('#eparent').val(getParent(node).replace(urlEdit[urlEdit.length - 2] + '/', ''));
                        $scope.category.id = node.key;
                        $scope.category.parentId = node.parent.key;
                        $('#editBtn').click();
                        break;
                    case "rename":
                        break;
                    case "remove":
                        UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                            //$("#ts_pager_filter").trigger('update');
                            $rootScope.removeCategory(node.key);
                        }, {
                            labels: {
                                'Ok': $translate.instant("common-ui-element.button.Delete"),
                                'Cancel': $translate.instant("common-ui-element.button.Cancel")
                            }
                        });
                        break;
                    default:
                        alert("Unhandled clipboard action '" + action + "'");
                }
            };

            function getParent(node) {
                var relation =""
                while (node.parent !=null){
                    relation = node.title + "/"+relation
                    node = node.parent
                }
                return relation
            }

        }]);
