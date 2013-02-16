define(
[
	'happy/app/BaseApp',

	'CombinationsManager',
	'Database'
],
function (
	BaseApp,

	CombinationsManager,
	Database
){
	var App = function(){
		var 
		self = this,
		database;

		var setup = function(){	
			var combinationsManager = new CombinationsManager({
				api: "http://mixology.eu01.aws.af.cm/api/",
				flavors: 'flavors',
				combinations: 'combinations'
			})
			combinationsManager.updatedSignal.add(onCombinationsUpdated);

			database = new Database();
		}

		var onCombinationsUpdated = function(manager, data){
			database.add(data)
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