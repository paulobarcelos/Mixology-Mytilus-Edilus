define(
[
	'happy/utils/http',

	'happy/_libs/mout/object/mixIn'
],
function (
	http,

	mixIn
){
	var dummyFunction = function(){};

	var CombinationsManager = function(options){
		var 
		self = this,
		defaults = {
			api : 'http://mixology.org/api/',
			flavors : 'flavors',
			combinations : 'combinations',
			cacheFlavors: true,
			mainFlavorId : '0',
			onUpdate: dummyFunction
		},
		settings = mixIn({}, defaults, options),
		flavors = [],
		combinations = [],
		combinationsTree = [];

		var init = function(){	
			var flavorsData = (settings.cacheFlavors) ? localStorage['flavors'] : [];
			if(flavorsData) onFlavorDataReady(flavorsData);
			else {
				http.call({
					url: settings.api + settings.flavors + '?'+ (new Date()).getTime(),
					method: 'GET',
					onSuccess: function(request){
						onFlavorDataReady(request.response);
					},
					onError: function(){
						console.log('Error getting flavors from server.')
					}
				});
			}
		}

		var onFlavorDataReady = function(data){
			if(settings.cacheFlavors) localStorage['flavors'] = data;
			flavors = JSON.parse(data);
			fetchCombinations();
		}
		var fetchCombinations = function(){

			http.call({
				url: settings.api + settings.combinations + '?'+ (new Date()).getTime(),
				method: 'GET',
				onSuccess: function(request){
					parseCombinations(request.response);
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


			console.log(rawCombinations);
			settings.onUpdate.apply(window, [self]);
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
	}
	return CombinationsManager;
});