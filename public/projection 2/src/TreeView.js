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

			var root = gui.addFolder('Root');

			guiData.rootZeroScaleBalance = 6.0000000001;
			root.add(guiData, 'rootZeroScaleBalance', 0,10);

			guiData.rootBranchCountScalePower = 0.441;
			root.add(guiData, 'rootBranchCountScalePower', 0, 0.51);

			guiData.offsetX = 0;
			root.add(guiData, 'offsetX', -300,300);

		

			
			var primary = gui.addFolder('Primary');

			guiData.primaryDistance = 60;
			primary.add(guiData, 'primaryDistance', 40,100);

			guiData.primaryDistanceAlternate = 70;
			primary.add(guiData, 'primaryDistanceAlternate', 40,100);

			guiData.primaryDistancePower = 0.440001;
			primary.add(guiData, 'primaryDistancePower', 0, 0.555);			

			guiData.primaryOpenAngle = 360;
			primary.add(guiData, 'primaryOpenAngle', 0,360);

			guiData.primaryStartAngle = 360;
			primary.add(guiData, 'primaryStartAngle', 0,360);

			
			var secondary = gui.addFolder('Secondary');

			guiData.secondaryDistance = 14;
			secondary.add(guiData, 'secondaryDistance', 0,35);

			guiData.secondaryDistanceAlternate = 20;
			secondary.add(guiData, 'secondaryDistanceAlternate', 0,35);

			guiData.secondaryDistancePower = 0.56;
			secondary.add(guiData, 'secondaryDistancePower', 0, 0.555);	

			guiData.secondaryOpenAngle = 270;
			secondary.add(guiData, 'secondaryOpenAngle', 0,360);

			guiData.secondaryStartAngle = 0;
			secondary.add(guiData, 'secondaryStartAngle', 0,360);


			guiData.combinationCountScale = 2.2222;
			gui.add(guiData, 'combinationCountScale', 0,20);

			gui.add(self, 'render');

			//gui.remember(guiData);

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
			rootHub = createHub('NULL', data, zeroHub, 0);

			transnformRootHub();
			
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

			var ballNode = document.createElement('div');
			ballNode.style.backgroundColor = flavor.color;
			dom.addClass(ballNode, 'ball');
			containerNode.appendChild(ballNode);

			var connectorNode = document.createElement('div');
			dom.addClass(connectorNode, 'connector');
			containerNode.appendChild(connectorNode);


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

			data.flavorIds.forEach(function(flavorId, childIndex){
				createHub(flavorId, data.branches[flavorId], hub, childIndex);
			});

			return hub;
		}

		var applyTransformsBulk = function(){
			hubs.forEach(applyTransformsSingle);
		}
		var applyTransformsSingle = function(hub){
			if(hub.flavor._id != 'root' && hub.parent.flavor._id != 'root'){
				if(hub.parent.parent.flavor._id == 'root'){
					var branchCountMultiplier = hub.parent.data.branchCount /  Math.pow(hub.parent.data.branchCount , guiData.primaryDistancePower);
					var distance = ((hub.index%2) ? guiData.primaryDistance : guiData.primaryDistanceAlternate ) * branchCountMultiplier;

					hub.ballTransformer.translate(distance, 0, 0);
					hub.linkTransformer.translate(distance, 0, 0);				
					hub.connectorTransformer.scale(distance, 1, 1);

					var angleTotal = guiData.primaryOpenAngle;
					var angleUnit = guiData.primaryOpenAngle / (hub.parent.data.branchCount);	
					var angleIndex = angleUnit * (hub.index );		
					var angle = guiData.primaryStartAngle - angleTotal / 2 + angleIndex;
					hub.containerTransformer.rotate(0,0,1,angle);
				}
				else{
					var branchCountMultiplier = hub.parent.data.branchCount /  Math.pow(hub.parent.data.branchCount , guiData.secondaryDistancePower);
					var distance = ((hub.index%2) ? guiData.secondaryDistance : guiData.secondaryDistanceAlternate ) * branchCountMultiplier;

					hub.ballTransformer.translate(distance, 0, 0);
					hub.linkTransformer.translate(distance, 0, 0);				
					hub.connectorTransformer.scale(distance, 1, 1);

					var angleTotal = guiData.secondaryOpenAngle;
					var angleUnit = guiData.secondaryOpenAngle / (hub.parent.data.branchCount);	
					var angleIndex = angleUnit * (hub.index);		
					var angle = guiData.secondaryStartAngle - angleTotal / 2 + angleIndex;
					hub.containerTransformer.rotate(0,0,1,angle);
				}

				//var scale = (hub.data.combinations.length / hub.parent.data.combinations.length) * guiData.combinationCountScale;
				//scale = map(scale, 0, 1, 0, 0.8);
				hub.containerTransformer.scale(0.9,0.9,0.9);	
			}
		}
		var transnformRootHub = function(){
			var scale = (size.y / 1500) * guiData.rootZeroScaleBalance;
			var nCount = 0;
			for(id in rootHub.data.branches){
				nCount += rootHub.data.branches[id].branchCount;
			}
			nCount - Math.min(1,nCount);

			scale = scale/ (Math.pow(nCount, guiData.rootBranchCountScalePower));
			rootHub.containerTransformer.scale(scale,scale,scale);	

			rootHub.containerTransformer.translate(size.x/2, size.y/2 + guiData.offsetX * scale, 0);

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
			if(rootHub){
				transnformRootHub();
			}
	
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