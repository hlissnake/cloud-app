'use strict';

let TreeModel = require('./model');
let express = require('express');
let route = express.Router();

let AllTreeNodes = [];

const generateTreeStructrue = (tree_nodes) => {
	let nodes = [];
	let res_nodes = [];

	tree_nodes.forEach((node, i) => {
		nodes[ nodes.length ] = node.toJSON();
	})

	// debugger
	nodes.forEach((node, i) => {
		if (node.parent === '0') {
			res_nodes[res_nodes.length] = node;
		}
		node.childrenNodes = [];
	})

	// debugger
	nodes.forEach((subNode, i) => {
		if (subNode.parent !== '0') {

			nodes.forEach((parentNode, i) => {
				if( parentNode._id.toJSON() === subNode.parent ) {
					parentNode.childrenNodes.push(subNode)
					return false;
				}
			})
		}
	})
	// debugger

	AllTreeNodes = res_nodes;

	return res_nodes;
}

// curl http://localhost:8001/api/vi/tree
route.get('/tree', (req, res, next) => {

	console.log('retrive all tree data')

	TreeModel.find()
		.exec((err, tree_nodes) => {
			if(err) {
				res.send({
					succ: false
				})
			} else {
				res.send({
					data: generateTreeStructrue( tree_nodes ),
					succ: true
				});
			}
			next();
		})
});

// curl -H "Content-Type:application/json" http://localhost:8001/api/vi/tree/:id
route.get('/tree/:id', (req, res, next) => {

	console.log('retrive ' + req.params.id + ' tree data')

	TreeModel.findOne({ _id : req.params.id})
		.exec((err, tree_node) => {
			if(err) {
				res.send({
					succ: false
				})
			} else {
				res.send({
					data: tree_node,
					succ: true
				});
			}
			next();
		})
});

route.post('/tree/:id', (req, res, next) => {

	console.log('update ' + req.params.id + ' tree data')
	res.send('update ' + req.params.id + ' tree data');
	next();
});

// curl -i -X PUT -H "Content-Type:application/json" http://localhost:8001/api/vi/tree/add -d '{"content":"JavaScript"}'
route.put('/tree/add', (req, res, next) => {

	console.log('add tree data')

	const params = req.body; console.log(params.content, params.parent_id);

	TreeModel.create({
		parent : params.parent_id,
		content : params.content,
		checkable : params.checkable || true,
		children : []
	}, (err, tree_node) => {
		if(err) {
			res.send({
				succ: false
			})
		} else {
			TreeModel.update(
				{ _id : params.parent_id },
				{ $push : 
					{ children : tree_node._id }
				},
				() => {
					console.log('updated parent node ', tree_node.id)
				}
			)
			debugger
			res.send({
				data: tree_node,
				succ: true
			});
		}
		next();
	});
});

route.delete('/tree/:id', (req, res, next) => {

	console.log('delete ' + req.params.id + ' tree data')
	res.send('delete ' + req.params.id + ' tree data');
	next();
});

module.exports = route;