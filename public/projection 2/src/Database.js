define(
[
],
function (
){
	var Database = function(){
		var 
		self = this,
		
		flavors,
		flavorsById,

		combinations,
		combinationsByUid,
		combinationsByRating,
		tree;

		var init = function(){
			flavors = [];
			flavorsById = {}
			combinations = [];
			combinationsByUid = {};
			combinationsByRating = {};
			tree = {};
		}
		var add = function(data){
			combinations = combinations.concat(data)

			data.forEach(function (combination) {
				combination.flavorIds.forEach(function (id){
					flavorsById[id].combinations.push(combination);
					if(!combination.flavors) combination.flavors = [];
					combination.flavors.push(flavorsById[id]);
				});
				combination.flavors.sort(sortByIndex);
				var uid = generateCombinationUID(combination);
				combination.uid = uid
				if(!combinationsByUid[uid]) combinationsByUid[uid] = [];
				combinationsByUid[uid].push(combination);

				var rating = combination.rating;
				if(!combinationsByRating[rating]) combinationsByRating[rating] = [];
				combinationsByRating[rating].push(combination);				
			});

			combinations.forEach(function(combination){
				combination.flavors.sort(sortByCombinationCount);
				growBranch(tree, combination, combination.flavors.slice(0));
				tree.flavorIds.sort(sortByFlavorCreationDate);
			});
		}
		var growBranch = function(parent, combination, flavors){
			parent.branches = parent.branches || {};
			parent.flavorIds = parent.flavorIds || [];
			parent.combinations = parent.combinations || [];
			if(typeof parent.branchCount == "undefined") parent.branchCount = 0;
			
			parent.combinations.push(combination);
			var flavor = flavors.shift();

			if(flavor){
				if(!parent.branches[flavor._id]) {
					parent.branches[flavor._id] = {};
					parent.flavorIds.push(flavor._id);
					parent.branchCount ++;
				}
				growBranch(parent.branches[flavor._id], combination, flavors);
				parent.branches[flavor._id].flavorIds.sort(sortByFlavorCreationDate);
			}
		}
		var setFlavors = function (value) {
			flavors = value;
			flavors.forEach(function(flavor, index){
				flavor.combinations = [];
				flavor.index = index;
				flavorsById[flavor._id] = flavor;
			});
		}
		var getFlavors = function (){
			return flavors;
		}
		var getFlavorsById = function(){
			return flavorsById;
		}
		var getCombinations = function(){
			return combinations;
		}
		var getCombinationsByUid = function(){
			return combinationsByUid;
		}
		var getCombinationsByRating = function(){
			return combinationsByRating;
		}
		var getTree = function(){
			return tree;
		}
		var sortByCombinationCount = function(a,b){
			return b.combinations.length - a.combinations.length;
		}
		var sortByIndex = function(a,b){
			return a.index - b.index;
		}
		var sortByUIDCombinationCount = function(a,b){
			return combinationsByUid[b].length; - combinationsByUid[a].length
		}
		var generateCombinationUID = function(combination){
			var uid = '';
			combination.flavors.forEach(function(flavor){
				uid += flavor._id;
			});
			return uid;
		}
		var sortByFlavorCreationDate = function(a,b){
			return (new Date(flavorsById[b].created)).getTime() - (new Date(flavorsById[a].created)).getTime();
		}

		Object.defineProperty(self, 'add', {
			value: add
		});
		Object.defineProperty(self, 'flavors', {
			set: setFlavors,
			get: getFlavors
		});
		Object.defineProperty(self, 'flavorsById', {
			get: getFlavorsById
		});
		Object.defineProperty(self, 'combinations', {
			get: getCombinations
		});
		Object.defineProperty(self, 'combinationsByUid', {
			get: getCombinationsByUid
		});
		Object.defineProperty(self, 'combinationsByRating', {
			get: getCombinationsByRating
		});
		Object.defineProperty(self, 'tree', {
			get: getTree
		});
		
		init();
	}
	return Database;
});