define(
[
	'happy/utils/dom',

	'happy/_libs/signals',

	'FlavorSelector'
],
function (
	dom,

	Signal,

	FlavorSelector
){
	var FlavorGroup = function(flavors){
		var 
		self = this,
		node,
		selected,
		flavorSelectors,
		ready,
		readySignal,
		unreadySignal;

		var init = function(){
			node = document.createElement('div');
			dom.addClass(node, 'group');

			flavorSelectors = [];
			var cluster;
			for (var i = 0; i < flavors.length; i++) {
				if(i%7 == 0){
					cluster = document.createElement('div');
					dom.addClass(cluster, 'cluster');
					node.appendChild(cluster);
				}
				var flavorSelector = new FlavorSelector(flavors[i]);
				flavorSelector.selectedSignal.add(onFlavorSelected);
				flavorSelector.deselectedSignal.add(onFlavorDeselected);
				flavorSelectors.push(flavorSelector);
				cluster.appendChild(flavorSelector.node);
			};

			selected = [];

			readySignal = new Signal();
			unReadySignal = new Signal();
		};

		var onFlavorSelected = function(flavor){
			var alreadyIn = false;
			for (var i = selected.length - 1; i >= 0; i--) {
				if(flavor._id == selected[i]._id){
					alreadyIn = true;
					break;
				}					
			}

			if(!alreadyIn) selected.push(flavor);
			processChange();
		}
		var onFlavorDeselected = function(flavor){
			for (var i = selected.length - 1; i >= 0; i--) {
				if(flavor._id == selected[i]._id){
					selected.splice(i, 1);
					break;
				}
			};
			processChange();
		}
		var processChange = function(){
			if(selected.length == 2){
				if(!ready){
					for (var i = flavorSelectors.length - 1; i >= 0; i--) {
						flavorSelectors[i].active = false
					};
					ready = true;
					readySignal.dispatch(self);
				}
			}
			else{
				if(ready){
					for (var i = flavorSelectors.length - 1; i >= 0; i--) {
						flavorSelectors[i].active = true
					};
					ready = false;
					unreadySignal.dispatch(self);
				}
				
			}
		}
		var getNode = function(){
			return node;
		}
		var getSelected = function(){
			return selected;
		}
		var getReadySignal = function(){
			return readySignal;
		}
		var getUnreadySignal = function(){
			return unreadySignal;
		}

		Object.defineProperty(self, 'node', {
			get: getNode
		});
		Object.defineProperty(self, 'selected', {
			get: getSelected
		});
		Object.defineProperty(self, 'readySignal', {
			get: getReadySignal
		});
		Object.defineProperty(self, 'unReadySignal', {
			get: getUnreadySignal
		});

		init();
	}
	return FlavorGroup;
});