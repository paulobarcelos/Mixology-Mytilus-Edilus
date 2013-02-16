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
			combinations : 'combinations'
		},
		settings,
		flavors,
		flavorsById,
		combinations,
		updatedSignal;

		var init = function(){
			settings = mixIn({}, defaults, options);
			flavors = [];
			flavorsById = {};
			combinations = [];;
			updatedSignal = new Signal();

			loadFlavorsData();
		}
		var loadFlavorsData = function(){
			ajax({
				url: settings.api + settings.flavors + '?'+ (new Date()).getTime(),
				method: 'GET',
				onSuccess: function(request){
					onFlavorsDataAcquired(request.responseText);
				},
				onError: function(){
					console.log('Error getting flavors from server.')
					setTimeout(loadFlavorsData, 5000);
				}
			});
		}
		var onFlavorsDataAcquired = function(data){
			flavors = JSON.parse(data);
			flavorsById = {};
			forEach(flavors, function(flavor){
				flavorsById[flavor._id] = flavor;
			});
			fetchCombinations();
		}
		var fetchCombinations = function(){
			var query = {
				cacheBuster: (new Date()).getTime()
			}

			if(combinations.length){
				query.search = {
					created: {
						$gt: combinations[combinations.length-1].created
					}
				} 
			}
			var queryString = '?';
			for(key in query){
				queryString +=  key + '=' + encodeURIComponent(JSON.stringify(query[key])) + '&';
			}

			ajax({
				url: settings.api + settings.combinations + queryString,
				method: 'GET',
				onSuccess: function(request){
					parseCombinations(request.responseText);
					setTimeout(fetchCombinations, 10000);
					
				},
				onError: function(){
					console.log('Error getting combinations from server.');
					setTimeout(fetchCombinations, 10000);
					
				}
			});
		}
		var parseCombinations = function(json){
			var newCombinations = JSON.parse(json);
			if(!newCombinations.length) return

			var parsedNewCombinations = [];
			forEach(newCombinations, function(combination){
				combination.flavors = [];
				for (var i = combination.flavorIds.length - 1; i >= 0; i--) {
					var id = combination.flavorIds[i];
					var flavor = flavorsById[id];
					combination.flavors.push(flavor);
				};
				combinations.push(combination);
				parsedNewCombinations.push(combination)
			});

			updatedSignal.dispatch(self, parsedNewCombinations);
		}

		var getFlavors = function(){
			return flavors;
		}
		var getFlavorsById = function(){
			return flavorIds;
		}
		var getCombinations = function(){
			return combinations;
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
		Object.defineProperty(self, 'flavorsById', {
			get: getFlavorsById
		});
		Object.defineProperty(self, 'combinations', {
			get: getCombinations
		});
		Object.defineProperty(self, 'updatedSignal', {
			get: getUpdatedSignal
		});

		init();
	}
	return CombinationsManager;
});