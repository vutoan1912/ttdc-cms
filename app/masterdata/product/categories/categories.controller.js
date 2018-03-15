angular
    .module('erpApp')
    .controller('CategoriesController', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$compile',
        '$stateParams',
        '$interval',
        'Category',
        '$translate',
        function ($scope, $rootScope, $timeout, $compile, $stateParams, $interval, Category, $translate) {
            Category.getTree().then(function (data) {
                $("#tree").fancytree({

                    extensions: ["dnd","filter","edit"],
                    source: data,
                    activate: function(event, data) {
                        var node = data.node;
                        $("#echoActivated").text(node.title + ", key=" + node.key);
                    },
                    click: function(event, data) {
                        console.log(data.node.key)
                        var nodes = []
                        data.node.visit(function(node) {
                            nodes.push(node.key);  // or node.key, ...
                        });
                        if (nodes.length==0){
                            nodes.push(data.node.key)
                        }

                        var typeKey = getRootKey(data.node)
                        $rootScope.findByTree(nodes,data.node.key,typeKey)
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

                var $tFilter = $("#tree");
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
                        addCategory(node)
                        break;
                    case "edit":
                        $('#eparent').val(getParent(node));
                        $('#editBtn').click();
                        break;
                    case "rename":
                        alert("Clipoard is empty.");
                        break;
                    case "remove":
                        alert("Clipoard is empty.");
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

            function getRootKey(node) {
                var key =0
                while (node.key !=0){
                    key = node.key
                    node = node.parent
                }
                return key
            }

            function addCategory(node) {
                $('#parent').val(getParent(node));
                var category = {
                    "name": $("#cname").val(),
                    "parentId": node.key,
                    "description":$("#description").val()
                }
                $('#addBtn').click();
            }


        }
        ]);
