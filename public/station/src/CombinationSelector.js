define(
[
	'happy/utils/dom',
	'happy/_libs/signals',

	'GroupSelector',
	'FlavorGroup'
],
function (
	dom,
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

		groupSelectors,
		flavorGroups,
		readySignal,
		unReadySignal;

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
			

			var mainFlavorName = document.createElement('div');
			dom.addClass(mainFlavorName, 'main');
			mainFlavorName.innerHTML = mainFlavor.name;
			namesNode.appendChild(mainFlavorName);

			groupSelectors = {};
			flavorGroups = {};
			for(id in groups){
				flavorGroups[id] = new FlavorGroup(groups[id]);
				groupSelectors[id] = new GroupSelector(id);
				groupSelectors[id].selectedSignal.add(onGroupSelected);

				groupSelectorsNode.appendChild(groupSelectors[id].node);

			}

			for(id in groups){
				groupSelectors[id].select();
				break;
			}

			selected = [];

			readySignal = new Signal();
			unReadySignal = new Signal();
		}

		var onGroupSelected = function(group){
			for(id in groups){
				if(id != group.id) groupSelectors[id].deselect();
			}
			while (flavorsNode.hasChildNodes()) flavorsNode.removeChild(flavorsNode.lastChild);
			flavorsNode.appendChild(flavorGroups[group.id].node);
			flavorsNode.appendChild(namesNode);
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