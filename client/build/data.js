'use strict';

var Ajax = require('ajax');

module.exports = {

	load: function load(callback) {

		Ajax.get('/api/vi/tree', {}, function (res) {
			callback(res);
		});
	},

	add: function add(data, callback) {

		Ajax.send('/api/vi/tree/add', 'PUT', {
			content: data.content,
			parent_id: data.parent_id
		}, function (res) {
			callback(res);
		});
	}
};