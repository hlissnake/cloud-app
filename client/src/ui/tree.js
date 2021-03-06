var React = require('react');
var Immutable = require('immutable');

var Tree = React.createClass({

	propTypes : {
		checked : React.PropTypes.bool.isRequired,
		node : React.PropTypes.object.isRequired,
		addNode : React.PropTypes.func.isRequired,
		deleteNode : React.PropTypes.func.isRequired
	},

	getDefaultProps : function(){
		return {
			checked : false
		}
	},

	getInitialState : function(){
		return {
			checked : !!this.props.checked,
			expand : true
		}
	},

	componentWillReceiveProps : function(nextProps){
		// this.props.node = Immutable.Map(this.props.node);
		this.setState({
			checked : nextProps.checked
		});
	},

	shouldComponentUpdate : function(nextProps, nextState){
		return this.state.checked != nextState.checked || 
			   	this.props.node != nextProps.node ||
				this.state.selected != nextState.selected || 
				this.state.expand != nextState.expand;
	},

	componentWillMount : function(){
		// this.props.node = Immutable.Map(this.props.node);
	},

	_onExpand : function(e){
		e.stopPropagation();
		this.setState({
			expand : !this.state.expand
		})
	},

	_onCheckboxClick : function(checked){

		this.childrenCheck = checked;
		// this.props.checkParent && this.props.checkParent(checked);
		this.setState({
			checked : checked
		});
	},

	_onSelected : function(){
		this.setState({
			selected : !this.state.selected
		})
	},

	_addChild : function(e){
		e.stopPropagation();
		var text = prompt("Please enter the new node's value");
		if(text) {
			this.props.addNode(text, this.props.node.get('_id'));
		}
	},

	_deleteNode : function(e){
		e.stopPropagation();
		var result = confirm("Do you really want to delete this node?");
		if(result) {
			this.props.deleteNode(this.props.node.get('_id'));
		}
	},

	render : function(){

		if(this.props.node.get('invisible')) return false;

		var isOpen = this.state.expand;
		var childrenNodes = this.props.node.get('childrenNodes');
		var hasChildren =  childrenNodes && childrenNodes.length ? true : false;

		return (
			<div className="tree-item">
			    <div className={"tree-item-title" + (this.state.selected ? " tree-item-selected" : "")} 
			    	 onClick={this._onSelected}>

			        <span className={ 
			        	( hasChildren ? "tree-expand-icon " : "" ) + 
			        	( isOpen ? "tree-expand-icon-minus" : "tree-expand-icon-plus") + 
			        	" tree-icon" }
			        	onClick={this._onExpand} >
			        </span>

			        { this.props.node.get('checkable') ? 
			        	<CheckBox onCheck={this._onCheckboxClick} checked={this.state.checked}></CheckBox> : [] }

			        <span className="tree-item-lable">{this.props.node.get('content')}</span>

			        <span className="tree-item-add" onClick={this._addChild}> + </span>

			        <span className="tree-item-delete" onClick={this._deleteNode}> X </span>

			    </div>

			    { hasChildren && isOpen ? 
			    	<ul className="tree-item-children" key={this.props.node.get('_id')}>
					{
						childrenNodes.map(function(node, i){
							return (
								<Tree node={ Immutable.Map(node) } 
									checked={this.childrenCheck} 
									addNode={this.props.addNode} 
									deleteNode={this.props.deleteNode}
									key={node._id} ></Tree>
							)
						}.bind(this))
					}
					</ul> : [] 
				}

			</div>
		)
	}
});

var CheckBox = React.createClass({

	onCheckboxClick : function(e){
		e.stopPropagation();
		this.props.onCheck && this.props.onCheck(!this.props.checked);
	},

	render : function(){
		return (
			<span onClick={this.onCheckboxClick} 
				  className={"tree-check-icon tree-icon " + 
							(this.props.checked ? "tree-check-icon-checked" : "tree-check-icon-unchecked") } 
			></span>
		)
	}
});

module.exports = Tree;