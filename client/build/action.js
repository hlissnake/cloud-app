'use strict';

var Data = require('./data');

var TreeAction = {

	createAsync: function createAsync(content, parent_id, store) {
		var _this = this;

		var Action = this;

		Data.add({
			content: content,
			parent_id: parent_id
		}, function (res) {
			if (res.succ) {
				store.dispatch(_this.create(res.data, parent_id));
			} else {
				// store.dispatch(this.error())
			}
		});

		return {
			type: 'loading'
		};
	},

	create: function create(node, parent_id) {
		return {
			type: 'create',
			node: node,
			parent_id: parent_id
		};
	},

	delete: function _delete(id) {
		return {
			type: 'delete',
			_id: id
		};
	},

	search: function search(text) {
		return {
			type: 'search',
			text: text
		};
	},

	load: function load(data) {
		return {
			type: 'load',
			data: data
		};
	}
};

module.exports = TreeAction;