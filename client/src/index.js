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

	getInitialState : function(){
		return {
			nodes : []
		}
	},

	componentDidMount : function(){
		// TreeStore.subscribe(me._onChange);
	},

	componentWillUnmount : function(){
		// TreeStore.unsubscribe(this._onChange);
	},

	filterKeyword : function(e){
		TreeStore.dispatch(TreeAction.search(e.target.value));
	},

	inputNodeName : function(e){
		this.rootNodeName = e.target.value;
	},

	addRootNode : function(){
		if(this.rootNodeName) {
			this._addNode(this.rootNodeName, 0);
		}
	},

	render : function(){
		return (
			<div>
				<div className="tree-search">
					<input type="text" placeholder="keyword" className="tree-keyword-search" onChange={this.filterKeyword}/>
					<span className="tree-search-mark"></span>
				</div>
				<div className="tree-add">
					<input type="text" placeholder="add new root node name" className="tree-add-node" onChange={this.inputNodeName} />
					<button onClick={this.addRootNode}>Add Root Node</button>
				</div>
			{
				this.props.nodes.map(function(node, i){
					return (
						<Tree node={Immutable.Map(node)}
							addNode={this._addNode}
							deleteNode={this._deleteNode} 
							key={node._id} ></Tree>
					)
				}.bind(this))
			}
			</div>
		)
	},

	_onChange : function(){
		this.setState({
			nodes : TreeStore.getState()
		})
	},

	_addNode : function(content, id){
		TreeStore.dispatch(TreeAction.createAsync(content, id, TreeStore));
	},

	_deleteNode : function(id){
		TreeStore.dispatch(TreeAction.delete(id))
	}
});

TreeStore.subscribe(render);

// Mocking for API request
TreeData.load(function(res){
	res.succ && TreeStore.dispatch(TreeAction.load(res.data))
});

function render(){
	ReactDOM.render(
		<App nodes={TreeStore.getState()} />,
		document.getElementById('tree')
	);
}
