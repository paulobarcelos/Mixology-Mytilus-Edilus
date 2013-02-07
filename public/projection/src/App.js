define(
[
	'happy/app/BaseApp',

	'happy/utils/browser',
	'happy/utils/http',

	'happy/_libs/mout/array/forEach',

	'CombinationsManager'
],
function (
	BaseApp,

	browser,
	http,

	forEach,

	CombinationsManager
){
	var App = function(){
		var 
		self = this,
		combinationsManager;

		var setup = function(){	
			combinationsManager = new CombinationsManager({
				api: "http://mixology.eu01.aws.af.cm/api/",
				mainFlavorId: "5111553bb26ab4d518000001",
				flavors: 'flavors',
				combinations: 'combinations',
				cacheFlavors: true,
				onUpdate: function(manager){console.log('Combinations updated')}				
			})

			combinationsManager.init();

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