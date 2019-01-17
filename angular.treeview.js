/*
 @license Angular Treeview version 0.1.6
 ⓒ 2013 AHN JAE-HA http://github.com/eu81273/angular.treeview
 License: MIT


 [TREE attribute]
 angular-treeview: the treeview directive
 tree-id : each tree's unique id.
 tree-model : the tree model on $scope.
 node-id : each node's id
 node-label : each node's label
 node-children: each node's children
 on-selected-node: function called when a node is selected
 show-leafs: should the node of type 'file' (without children) be displayed
 <div
 angular-treeview="true"
 tree-id="tree"
 tree-model="roleList"
 node-id="roleId"
 node-label="roleName"
 node-children="children"
 on-selected-node="onSelectedNode(node)"
 show-leafs="true">
 </div>
 */

(function (angular) {
    'use strict';

    angular.module('angularTreeview', [])
        .directive('treeModel', ['$compile', '$parse', function ($compile, $parse) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    //tree id
                    var treeId = attrs.treeId;

                    //tree model
                    var treeModel = attrs.treeModel;

                    //node id
                    var nodeId = attrs.nodeId || 'id';

                    //node label
                    var nodeLabel = attrs.nodeLabel || 'label';

                    //children
                    var nodeChildren = attrs.nodeChildren || 'children';

                    // show leafs
                    var showLeafs = true;
                    if (attrs.showLeafs) {
                        showLeafs = attrs.showLeafs === 'true';
                    }

                    // drop
                    var droppable = (attrs.droppable === 'true');
                    var dropArg = '';
                    if (attrs.droppable === 'true') {
                        dropArg = ' ui-on-Drop="' + treeId + '.onDrop($data, node, node.id)"';
                    }

                    //tree template
                    var template =
                        '<ul>' +
                        '<li ' + dropArg + ' data-ng-repeat="node in ' + treeModel + '"  ng-switch="node.collapsed">' + '<i class="collapsed" data-ng-show="node.' + nodeChildren + '&& node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                        '<i class="expanded" data-ng-show="node.' + nodeChildren + ' && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                        '<i class="normal" data-ng-show="!node.' + nodeChildren + ' && ' + showLeafs + '"></i> ' +
                        '<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)" ng-if="' + showLeafs + '  && !node.' + nodeChildren + '">{{node.' + nodeLabel + '}}</span>' +
                        '<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)" ng-if="node.' + nodeChildren + '">{{node.' + nodeLabel + '}}</span>' +
                        '<div data-ng-hide="node.collapsed" show-leafs="' + showLeafs + '" droppable="' + droppable + '" ' + dropArg + ' data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeLabel + ' data-node-children=' + nodeChildren + '  ng-switch-when="false"></div>' +
                        '</li>' +
                        '</ul>';


                    //check tree id, tree model
                    if (treeId && treeModel) {

                        //root node
                        if (attrs.angularTreeview) {

                            //create tree object if not exists
                            scope[treeId] = scope[treeId] || {};

                            //if node head clicks,
                            scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function (selectedNode) {

                                //Collapse or Expand
                                selectedNode.collapsed = !selectedNode.collapsed;

                                if (angular.isFunction(scope[treeId].treeSelectNodeHeadCallBack)) {
                                    scope[treeId].treeSelectNodeHeadCallBack(selectedNode);
                                }
                            };

                            //if node label clicks,
                            scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function (selectedNode) {

                                //remove highlight from previous node
                                if (scope[treeId].currentNode && scope[treeId].currentNode.selected) {
                                    scope[treeId].currentNode.selected = undefined;
                                }

                                //set highlight to selected node
                                selectedNode.selected = 'selected';

                                //set currentNode
                                scope[treeId].currentNode = selectedNode;

                                if (attrs.onSelectedNode) {
                                    var fn = $parse(attrs.onSelectedNode);
                                    fn(scope, {node: selectedNode});
                                }

                            };

                            scope[treeId].onDrop = scope[treeId].onDrop || function ($data, node, nodeId) {
                                if (attrs.onDrop) {
                                    var fn = $parse(attrs.onDrop);
                                    fn(scope, {$data: $data, node: node});
                                }
                            };
                        }

                        //Rendering template.
                        element.html('').append($compile(template)(scope));
                    }
                }
            };
        }
        ])
    ;
})
(angular);
