'use strict';

var Immutable = require('immutable');

var CHANGE_EVENT = 'change';
var FILTER_EVENT = 'search';

/**
 * Binary tree Recurisve algorithm to find a node depend on a particular equality function
 * @param  {[type]}   nodes [description]
 * @param  {Function} fn    [description]
 * @return {[type]}         [description]
 */
function findNode(nodes, fn) {
	for (var i = 0; i < nodes.length; i++) {
		var node = nodes[i];
		if (fn(node)) {
			return node;
		} else if (node.childrenNodes) {
			var childNode = findNode(node.childrenNodes, fn);
			if (childNode) {
				return childNode;
			}
		}
	}
}

/**
 * Recurisve algorithm to find the parent node according to a particular equality function
 * @param  {[type]}   parentNode [description]
 * @param  {Function} fn         [description]
 * @return {[type]}              [description]
 */
function findParent(parentNode, fn) {
	if (parentNode.childrenNodes) {
		for (var i = 0; i < parentNode.childrenNodes.length; i++) {
			var node = parentNode.childrenNodes[i];
			if (fn(node)) {
				return parentNode;
			} else {
				var childNode = findParent(node, fn);
				if (childNode) {
					return childNode;
				}
			}
		}
	} else {
		return false;
	}
}

/**
 * recursive all the nodes in a tree, particular for visibility
 * @param  {[type]}   nodes [description]
 * @param  {Function} fn    [description]
 * @return {[type]}         [description]
 */
function recursive(node, compareFn, resultFn) {

	var childrenInvisible = true;
	var result = compareFn(node);

	if (node.childrenNodes) {
		for (var i = 0; i < node.childrenNodes.length; i++) {
			var n = node.childrenNodes[i];

			var childrenResult = recursive(n, compareFn, resultFn);
			if (childrenResult) {
				childrenInvisible = false;
			}
		}
	}

	return resultFn(node, result, childrenInvisible);
}

var TreeReducer = function TreeReducer(state, action) {

	switch (action.type) {

		case 'loading':
			return state;

		case 'create':

			if (action.parent_id == 0) {
				state[state.length] = {
					content: action.node.content,
					_id: action.node._id,
					checkable: true
				};
			} else {
				// alert('add : ' + action.content);
				var parentNode = findNode(state, function (node) {
					if (node._id === action.parent_id) {
						return node;
					}
				});

				if (parentNode) {
					var newNode = {
						content: action.node.content,
						_id: action.node._id,
						checkable: true
					};

					if (parentNode.childrenNodes) {
						parentNode.childrenNodes.push(newNode);
					} else {
						parentNode.childrenNodes = [newNode];
					}
				}
			}
			return state;

		case 'delete':
			// alert('delete : ' + action._id);
			var currentNode = findNode(state, function (node) {
				if (node._id === action._id) {
					return node;
				}
			});
			var parentNode = function () {
				for (var i = 0; i < state.length; i++) {
					var target = findParent(state[i], function (node) {
						if (node._id === action._id) {
							return true;
						}
					});
					if (target) {
						return target;
					}
				}
			}();

			if (currentNode && parentNode) {
				var index = parentNode.childrenNodes.indexOf(currentNode);
				parentNode.childrenNodes = parentNode.childrenNodes.slice(0, index).concat(parentNode.childrenNodes.slice(index + 1));
			}
			return state;

		case 'search':
			for (var i = 0; i < state.length; i++) {

				recursive(state[i], function compare(node) {
					node.invisible = false;
					if (node.content.indexOf(action.text) < 0) {
						return false;
					} else {
						return true;
					}
				}, function result(node, result, childrenInvisible) {
					if (result || !childrenInvisible) {
						return true;
					} else {
						node.invisible = true;
						return false;
					}
				});
			}
			return state;

		case 'load':
			return action.data;

			return [];
	}
};

module.exports = TreeReducer;