'use strict';

var React = require('react');
var Immutable = require('immutable');

var Tree = React.createClass({
	displayName: 'Tree',


	propTypes: {
		checked: React.PropTypes.bool.isRequired,
		node: React.PropTypes.array.isRequired,
		addNode: React.PropTypes.func.isRequired,
		deleteNode: React.PropTypes.func.isRequired
	},

	getDefaultProps: function getDefaultProps() {
		return {
			checked: false
		};
	},

	getInitialState: function getInitialState() {
		return {
			checked: !!this.props.checked,
			expand: true
		};
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		// this.props.node = Immutable.Map(this.props.node);
		this.setState({
			checked: nextProps.checked
		});
	},

	shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
		return this.state.checked != nextState.checked || this.props.node != nextProps.node || this.state.selected != nextState.selected || this.state.expand != nextState.expand;
	},

	componentWillMount: function componentWillMount() {
		// this.props.node = Immutable.Map(this.props.node);
	},

	_onExpand: function _onExpand(e) {
		e.stopPropagation();
		this.setState({
			expand: !this.state.expand
		});
	},

	_onCheckboxClick: function _onCheckboxClick(checked) {

		this.childrenCheck = checked;
		// this.props.checkParent && this.props.checkParent(checked);
		this.setState({
			checked: checked
		});
	},

	_onSelected: function _onSelected() {
		this.setState({
			selected: !this.state.selected
		});
	},

	_addChild: function _addChild(e) {
		e.stopPropagation();
		var text = prompt("Please enter the new node's value");
		if (text) {
			this.props.addNode(text, this.props.node.get('_id'));
		}
	},

	_deleteNode: function _deleteNode(e) {
		e.stopPropagation();
		var result = confirm("Do you really want to delete this node?");
		if (result) {
			this.props.deleteNode(this.props.node.get('_id'));
		}
	},

	render: function render() {

		if (this.props.node.get('invisible')) return false;

		var isOpen = this.state.expand;
		var childrenNodes = this.props.node.get('childrenNodes');
		var hasChildren = childrenNodes && childrenNodes.length ? true : false;

		return React.createElement(
			'div',
			{ className: 'tree-item' },
			React.createElement(
				'div',
				{ className: "tree-item-title" + (this.state.selected ? " tree-item-selected" : ""),
					onClick: this._onSelected },
				React.createElement('span', { className: (hasChildren ? "tree-expand-icon " : "") + (isOpen ? "tree-expand-icon-minus" : "tree-expand-icon-plus") + " tree-icon",
					onClick: this._onExpand }),
				this.props.node.get('checkable') ? React.createElement(CheckBox, { onCheck: this._onCheckboxClick, checked: this.state.checked }) : [],
				React.createElement(
					'span',
					{ className: 'tree-item-lable' },
					this.props.node.get('content')
				),
				React.createElement(
					'span',
					{ className: 'tree-item-add', onClick: this._addChild },
					' + '
				),
				React.createElement(
					'span',
					{ className: 'tree-item-delete', onClick: this._deleteNode },
					' X '
				)
			),
			hasChildren && isOpen ? React.createElement(
				'ul',
				{ className: 'tree-item-children', key: this.props.node.get('_id') },
				childrenNodes.map(function (node, i) {
					return React.createElement(Tree, { node: Immutable.Map(node),
						checked: this.childrenCheck,
						addNode: this.props.addNode,
						deleteNode: this.props.deleteNode,
						key: node._id });
				}.bind(this))
			) : []
		);
	}
});

var CheckBox = React.createClass({
	displayName: 'CheckBox',


	onCheckboxClick: function onCheckboxClick(e) {
		e.stopPropagation();
		this.props.onCheck && this.props.onCheck(!this.props.checked);
	},

	render: function render() {
		return React.createElement('span', { onClick: this.onCheckboxClick,
			className: "tree-check-icon tree-icon " + (this.props.checked ? "tree-check-icon-checked" : "tree-check-icon-unchecked")
		});
	}
});

module.exports = Tree;