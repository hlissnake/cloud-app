let Ajax = require('ajax');

module.exports = {

	load : (callback) => {

		Ajax.get('/api/vi/tree', {}, (res)=>{
			callback(res);
		})
	},

	add : (data, callback) => {

		Ajax.send(
			'/api/vi/tree/add', 
			'PUT',
			{
				content : data.content,
				parent_id : data.parent_id
			},
			(res)=>{
				callback(res);
			}
		)
	}
};