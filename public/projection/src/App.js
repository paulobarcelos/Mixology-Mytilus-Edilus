define(
[
	'happy/app/BaseApp',

	'DataLoader',
	'Database'
],
function (
	BaseApp,

	DataLoader,
	Database
){
	var App = function(){
		var 
		self = this,
		database;

		var setup = function(){	
			database = new Database();

			var dataLoader = new DataLoader({
				api: "http://mixology.eu01.aws.af.cm/api/",
				flavors: 'flavors',
				combinations: 'combinations'
			})
			dataLoader.combinationsUpdatedSignal.add(onCombinationsUpdated);
			dataLoader.flavorsLoadedSignal.add(onFlavorsLoaded);			
		}

		var onFlavorsLoaded = function(loader){
			database.flavors = loader.flavors;
		}

		var onCombinationsUpdated = function(loader){
			database.add(loader.latestCombinations)
		}

		var update = function(dt){

		}
		var draw = function(dt){
			
		}

		self.setup = setup;
		self.update = update;
		self.draw = draw;
	}
	App.prototype = new BaseApp();
	return App;
});