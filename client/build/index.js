'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Immutable = require('immutable');
var Redux = require('redux');

var Tree = require('./ui/tree');
var TreeAction = require('./action');
var TreeReducer = require('./reducer');
var TreeData = require('./data');

var TreeStore = Redux.createStore(TreeReducer, []);

var App = React.createClass({
	displayName: 'App',


	getInitialState: function getInitialState() {
		return {
			nodes: []
		};
	},

	componentDidMount: function componentDidMount() {
		// TreeStore.subscribe(me._onChange);
	},

	componentWillUnmount: function componentWillUnmount() {
		// TreeStore.unsubscribe(this._onChange);
	},

	filterKeyword: function filterKeyword(e) {
		TreeStore.dispatch(TreeAction.search(e.target.value));
	},

	inputNodeName: function inputNodeName(e) {
		this.rootNodeName = e.target.value;
	},

	addRootNode: function addRootNode() {
		if (this.rootNodeName) {
			this._addNode(this.rootNodeName, 0);
		}
	},

	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement(
				'div',
				{ className: 'tree-search' },
				React.createElement('input', { type: 'text', placeholder: 'keyword', className: 'tree-keyword-search', onChange: this.filterKeyword }),
				React.createElement('span', { className: 'tree-search-mark' })
			),
			React.createElement(
				'div',
				{ className: 'tree-add' },
				React.createElement('input', { type: 'text', placeholder: 'add new root node name', className: 'tree-add-node', onChange: this.inputNodeName }),
				React.createElement(
					'button',
					{ onClick: this.addRootNode },
					'Add Root Node'
				)
			),
			this.props.nodes.map(function (node, i) {
				return React.createElement(Tree, { node: Immutable.Map(node),
					addNode: this._addNode,
					deleteNode: this._deleteNode,
					key: node._id });
			}.bind(this))
		);
	},

	_onChange: function _onChange() {
		this.setState({
			nodes: TreeStore.getState()
		});
	},

	_addNode: function _addNode(content, id) {
		TreeStore.dispatch(TreeAction.createAsync(content, id, TreeStore));
	},

	_deleteNode: function _deleteNode(id) {
		TreeStore.dispatch(TreeAction.delete(id));
	}
});

TreeStore.subscribe(render);

// Mocking for API request
TreeData.load(function (res) {
	res.succ && TreeStore.dispatch(TreeAction.load(res.data));
});

function render() {
	ReactDOM.render(React.createElement(App, { nodes: TreeStore.getState() }), document.getElementById('tree'));
}