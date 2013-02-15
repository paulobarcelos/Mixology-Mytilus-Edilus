define(
[
	'happy/app/BaseApp',

	'CombinationsManager'
],
function (
	BaseApp,

	CombinationsManager
){
	var App = function(){
		var 
		self = this;

		var setup = function(){	
			var combinationsManager = new CombinationsManager({
				api: "http://mixology.eu01.aws.af.cm/api/",
				mainFlavorId: "5112e4e4a5bc689301000001",
				flavors: 'flavors',
				combinations: 'combinations',
				cacheFlavors: true			
			})

			combinationsManager.init();
			combinationsManager.updatedSignal.add(onCombinationsUpdated)

		}

		var onCombinationsUpdated = function(manager){
			console.log(manager.combinations)
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