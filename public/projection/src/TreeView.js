define(
[
	'happy/utils/dom'
],
function (
	dom
){
	var TreeView = function(){
		var 
		self = this,
		flavorsById,
		node,
		branches;

		var init = function(){
			node = document.createElement('div');
			dom.addClass(node, 'tree');

		}
		var render = function(data){
			console.log(data)
			destroy();
			for(flavorId in data.branches){
				createBranch(flavorId, data.branches[flavorId]);
			}			
		}

		var createBranch = function(flavorId, branchData, parent){
			var flavor = flavorsById[flavorId];
			
			var element = document.createElement('div');
			element.style.backgroundColor = flavor.color;
			element.id = flavor._id;
			dom.addClass(element, 'branch');
			node.appendChild(element);

			var elementConnector = document.createElement('div');
			dom.addClass(elementConnector, 'connector');
			node.appendChild(elementConnector);
			
			var branch = {
				flavor: flavor,
				node: element,
				connectorNode: elementConnector,
				data: branchData
			}

			branches.push(branch);

			for(flavorId in branchData.branches){
				createBranch(flavorId, branchData.branches[flavorId], branch);
			}
		}
		var destroy = function(){
			branches = [];
		}
		var getNode = function (){
			return node;
		}

		var getFlavorsById = function (){
			return flavorsById;
		}

		var setFlavorsById = function (value){
			flavorsById = value;
		}


		Object.defineProperty(self, 'render', {
			value: render
		});
		Object.defineProperty(self, 'destroy', {
			value: destroy
		});
		Object.defineProperty(self, 'node', {
			get: getNode
		});
		Object.defineProperty(self, 'flavorsById', {
			set: setFlavorsById,
			get: getFlavorsById
		});

		
		init();
	}
	return TreeView;
});