define(
[
	'happy/utils/dom',

	'happy/_libs/mout/array/forEach',
	'happy/_libs/signals',

	'GroupSelector',
	'FlavorGroup'
],
function (
	dom,

	forEach,
	Signal,

	GroupSelector,
	FlavorGroup

){
	var CombinationSelector = function(mainFlavor, groups){
		var 
		self = this,
		node,
		groupSelectorsNode,
		flavorsNode,

		namesNode,
		simpleFlavorsNamesNode,
		mainFlavorNameNode,

		groupSelectors,
		flavorGroups,

		selected,
		ready,
		readySignal,
		unReadySignal,
		changedSignal;

		var init = function(){
			node = document.createElement('div');
			dom.addClass(node, 'combination-selector');

			groupSelectorsNode = document.createElement('div');
			dom.addClass(groupSelectorsNode, 'tabs');
			node.appendChild(groupSelectorsNode);

			flavorsNode = document.createElement('div');
			dom.addClass(flavorsNode, 'group-container');
			node.appendChild(flavorsNode);

			namesNode = document.createElement('div');
			dom.addClass(namesNode, 'names');

			simpleFlavorsNamesNode = document.createElement('div');
			dom.addClass(simpleFlavorsNamesNode, 'simple');
			namesNode.appendChild(simpleFlavorsNamesNode);
			
			mainFlavorNameNode = document.createElement('div');
			dom.addClass(mainFlavorNameNode, 'main');
			mainFlavorNameNode.innerHTML = mainFlavor.name;
			namesNode.appendChild(mainFlavorNameNode);

			ready = false;
			selected = [];
			readySignal = new Signal();
			unreadySignal = new Signal();
			changedSignal = new Signal();

			groupSelectors = {};
			flavorGroups = {};
			for(id in groups){
				flavorGroups[id] = new FlavorGroup(groups[id]);
				flavorGroups[id].changedSignal.add(onFlavorGroupChanged);
				

				groupSelectors[id] = new GroupSelector(id);
				groupSelectors[id].selectedSignal.add(onGroupSelected);

				groupSelectorsNode.appendChild(groupSelectors[id].node);

			}

			for(id in groups){
				groupSelectors[id].select();
				break;
			}
		}

		var onGroupSelected = function(group){
			for(id in groups){
				if(id != group.id) groupSelectors[id].deselect();
			}
			dom.empty(flavorsNode);
			flavorsNode.appendChild(flavorGroups[group.id].node);
			flavorsNode.appendChild(namesNode);

			selected = flavorGroups[group.id].selected;
			processChange();
		}

		var onFlavorGroupChanged = function (flavorGroup) {
			selected = flavorGroup.selected;
			processChange();
		}

		var processChange = function(){
			dom.empty(simpleFlavorsNamesNode);
			forEach(selected, function(flavorSelector){
				var nameNode = document.createElement('div');
				nameNode.innerHTML = flavorSelector.flavor.name;
				simpleFlavorsNamesNode.appendChild(nameNode);
			});

			if(selected.length == 2){
				if(!ready){
					ready = true;
					readySignal.dispatch(self);
				}
			}
			else{
				if(ready){
					ready = false;
					unreadySignal.dispatch(self);
				}
			}

			changedSignal.dispatch(self);
		}

		var getNode = function(){
			return node;
		}

		Object.defineProperty(self, 'node', {
			get: getNode
		});

		init();
	}
	return CombinationSelector;
});