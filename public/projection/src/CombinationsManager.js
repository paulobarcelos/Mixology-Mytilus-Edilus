define(
[
	'happy/utils/ajax',

	'happy/_libs/mout/array/forEach',
	'happy/_libs/mout/object/mixIn',
	'happy/_libs/signals'
],
function (
	ajax,

	forEach,
	mixIn,

	Signal
){
	var CombinationsManager = function(options){
		var 
		self = this,
		defaults = {
			api : 'http://mixology.org/api/',
			flavors : 'flavors',
			combinations : 'combinations',
			cacheFlavors: true,
			mainFlavorId : '0'
		},
		settings = mixIn({}, defaults, options),
		flavors = [],
		flavorsIndexedById = {},
		combinations = [],
		combinationsTree = [],
		updatedSignal = new Signal();

		var init = function(){	
			var flavorsData = (settings.cacheFlavors) ? localStorage['flavors'] : '[]';
			if(flavorsData) onFlavorDataReady(flavorsData);
			else {
				ajax({
					url: settings.api + settings.flavors + '?'+ (new Date()).getTime(),
					method: 'GET',
					onSuccess: function(request){
						onFlavorDataReady(request.responseText);
					},
					onError: function(){
						console.log('Error getting flavors from server.')
					}
				});
			}
		}

		var onFlavorDataReady = function(data){
			if(settings.cacheFlavors){
				localStorage['flavors'] = data;
			}
			flavors = JSON.parse(data);
			flavorsIndexedById = {};
			forEach(flavors, function(flavor){
				flavorsIndexedById[flavor._id] = flavor;
			});
			fetchCombinations();
		}
		var fetchCombinations = function(){

			ajax({
				url: settings.api + settings.combinations + '?'+ (new Date()).getTime(),
				method: 'GET',
				onSuccess: function(request){
					parseCombinations(request.responseText);
					setTimeout(fetchCombinations, 5000);
					
				},
				onError: function(){
					console.log('Error getting combinations from server.');
					setTimeout(fetchCombinations, 5000);
					
				}
			});
		}
		var parseCombinations = function(json){
			var rawCombinations = JSON.parse(json);
			if(rawCombinations.length == combinations.length) return;

			combinations = rawCombinations;
			forEach(combinations, function(combination){
				combination.flavors = [];
				for (var i = combination.flavorIds.length - 1; i >= 0; i--) {
					var flavor = flavorsIndexedById[combination.flavorIds[i]];
					combination.flavors.push(flavor);
				};
			});


			updatedSignal.dispatch(self);
		}

		var getFlavors = function(){
			return flavors;
		}
		var getCombinations = function(){
			return combinations;
		}
		var getCombinationsTree = function(){
			return combinationsTree;
		}
		var getUpdatedSignal = function(){
			return updatedSignal;
		}

		Object.defineProperty(self, 'init', {
			value: init
		});
		Object.defineProperty(self, 'flavors', {
			get: getFlavors
		});
		Object.defineProperty(self, 'combinations', {
			get: getCombinations
		});
		Object.defineProperty(self, 'combinationsTree', {
			get: getCombinationsTree
		});
		Object.defineProperty(self, 'updatedSignal', {
			get: getUpdatedSignal
		});
	}
	return CombinationsManager;
});