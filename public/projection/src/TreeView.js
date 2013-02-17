define(
[
	'happy/utils/dom',
	'happy/utils/vendorPrefix',

	'happy/_libs/dat.gui',
	'happy/_libs/mout/math/clamp',
	'happy/_libs/mout/math/map',

	'Transformer'
],
function (
	dom,
	vendorPrefix,

	Gui,
	clamp,
	map,

	Transformer
){
	var TreeView = function(){
		var 
		self = this,
		flavorsById,
		data,
		node,
		rootHub,
		size,
		hubs;

		var 
		gui,
		guiData;

		var init = function(){
			node = document.createElement('div');
			dom.addClass(node, 'tree');
			
			destroy();

			gui = new Gui();
			guiData = {};

			guiData.offsetX = -100;
			gui.add(guiData, 'offsetX', -1000,0);

			guiData.primaryDistance = 600;
			gui.add(guiData, 'primaryDistance', 0,1000);

			guiData.secondaryDistance = 200;
			gui.add(guiData, 'secondaryDistance', 0,1000);

			guiData.primaryOpenAngle = 170;
			gui.add(guiData, 'primaryOpenAngle', 0,360);

			guiData.primaryStartAngle = 270;
			gui.add(guiData, 'primaryStartAngle', 0,360);

			guiData.secondaryOpenAngle = 270;
			gui.add(guiData, 'secondaryOpenAngle', 0,360);

			guiData.secondaryStartAngle = 0;
			gui.add(guiData, 'secondaryStartAngle', 0,360);

			guiData.combinationCountScale = 2.2222;
			gui.add(guiData, 'combinationCountScale', 0,20);

			gui.add(self, 'render');

			gui.remember(guiData);

		}
		var setData = function(value){
			data = value;
			console.log(data)
		}
		var render = function(){
			destroy();
			var zeroHub = {
				linkNode: node
			}
			rootHub = createHub('NULL', data, zeroHub);
		}

		var createHub = function(flavorId, data, parent, index){
			var flavor;
			if(flavorsById[flavorId]){
				flavor = flavorsById[flavorId];
			}
			else {
				flavor = {
					_id: 'root',
					color: 'rgba(0,0,0,0)'
				}
			}
			
			var containerNode = document.createElement('div');
			containerNode.id = flavor._id;
			dom.addClass(containerNode, 'hub');
			parent.linkNode.appendChild(containerNode);

			var connectorNode = document.createElement('div');
			dom.addClass(connectorNode, 'connector');
			containerNode.appendChild(connectorNode);

			var ballNode = document.createElement('div');
			ballNode.style.backgroundColor = flavor.color;
			dom.addClass(ballNode, 'ball');
			containerNode.appendChild(ballNode);

			var linkNode = document.createElement('div');
			dom.addClass(linkNode, 'link');
			containerNode.appendChild(linkNode);
			
			var hub = {
				flavor: flavor,
				containerNode: containerNode,
				containerTransformer: new Transformer(containerNode),
				ballNode: ballNode,				
				ballTransformer: new Transformer(ballNode),
				connectorNode: connectorNode,				
				connectorTransformer: new Transformer(connectorNode),
				linkNode: linkNode,				
				linkTransformer: new Transformer(linkNode),
				data: data,
				parent: parent,
				index: index
			}

			hub.containerTransformer.origin(0, 50);
			hub.connectorTransformer.origin(0, 50);

			applyTransformsSingle(hub);
			
			hubs.push(hub);

			var childIndex = 0;
			for(flavorId in data.branches){
				createHub(flavorId, data.branches[flavorId], hub, childIndex);
				childIndex++;
			}

			return hub;
		}

		var applyTransformsBulk = function(){
			hubs.forEach(applyTransformsSingle);
		}
		var applyTransformsSingle = function(hub){
			if(hub.flavor._id != 'root' && hub.parent.flavor._id != 'root'){
				if(hub.parent.parent.flavor._id == 'root'){
					hub.ballTransformer.translate(guiData.primaryDistance, 0, 0);
					hub.linkTransformer.translate(guiData.primaryDistance, 0, 0);
					hub.connectorTransformer.scale(guiData.primaryDistance, 1, 1);
					var angleTotal = guiData.primaryOpenAngle;
					var angleUnit = guiData.primaryOpenAngle / (hub.parent.data.branchCount -1);	
					var angleIndex = angleUnit * hub.index;		
					var angle = guiData.primaryStartAngle - angleTotal / 2 + angleIndex;
					hub.containerTransformer.rotate(0,0,1,angle);
				}
				else{
					hub.ballTransformer.translate(guiData.secondaryDistance, 0, 0);
					hub.linkTransformer.translate(guiData.secondaryDistance, 0, 0);
					hub.connectorTransformer.scale(guiData.secondaryDistance, 1, 1);
					var angleTotal = guiData.secondaryOpenAngle;
					var angleUnit = guiData.secondaryOpenAngle / (hub.parent.data.branchCount-1);	
					var angleIndex = angleUnit * hub.index;		
					var angle = guiData.secondaryStartAngle - angleTotal / 2 + angleIndex;
					hub.containerTransformer.rotate(0,0,1,angle);
				}

				var scale = (hub.data.combinations.length / hub.parent.data.combinations.length) * guiData.combinationCountScale;
				scale = map(scale, 0, 1, 0, 0.8);
				hub.containerTransformer.scale(scale,scale,1);	
			}
		}	
		var destroy = function(){
			dom.empty(node);
			rootHub = null;
			hubs = [];
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

		var setSize = function (value){
			size = value;
			if(rootHub)rootHub.containerTransformer.translate(size.x/2, size.y + guiData.offsetX, 0);
	
		}
		var getSize = function (){
			return size;
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
		Object.defineProperty(self, 'data', {
			set: setData
		});
		Object.defineProperty(self, 'flavorsById', {
			set: setFlavorsById,
			get: getFlavorsById
		});
		Object.defineProperty(self, 'size', {
			set: setSize,
			get: getSize
		});

		
		init();
	}
	return TreeView;
});