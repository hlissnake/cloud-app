let Data = require('./data')

var TreeAction = {

	createAsync : function(content, parent_id, store){
		var Action = this;

		Data.add({
			content, 
			parent_id
		}, (res) => {
			if(res.succ) {
				store.dispatch( this.create( res.data, parent_id ) )
			} else {
				// store.dispatch(this.error())
			}
		});

		return {
			type : 'loading'
	    };
	},

	create : function(node, parent_id){
		return {
			type : 'create',
			node : node,
			parent_id : parent_id
	    };
	},

	delete : function(id){
		return {
	    	type : 'delete',
	    	id : id
	    };
	},

	search : function(text){
		return {
	    	type : 'search',
	    	text : text
	    };
	},

	load : function(data){
		return {
			type : 'load',
			data : data
		}
	}
}

module.exports = TreeAction;
