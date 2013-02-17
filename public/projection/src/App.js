define(
[
	'happy/app/BaseApp',

	'DataLoader',
	'Database',
	'TreeView'
],
function (
	BaseApp,

	DataLoader,
	Database,
	TreeView
){
	var App = function(){
		var 
		self = this,
		database,
		treeView;

		var setup = function(){	
			database = new Database();

			var dataLoader = new DataLoader({
				api: "http://mixology.eu01.aws.af.cm/api/",
				flavors: 'flavors',
				combinations: 'combinations'
			})
			dataLoader.combinationsUpdatedSignal.add(onCombinationsUpdated);
			dataLoader.flavorsLoadedSignal.add(onFlavorsLoaded);	

			treeView = new TreeView();
			treeView.inited = false;		
		}

		var onFlavorsLoaded = function(loader){
			database.flavors = loader.flavors;
			treeView.flavorsById = database.flavorsById;
		}

		var onCombinationsUpdated = function(loader){
			database.add(loader.latestCombinations)
			if(!treeView.inited){
				treeView.inited = true;
				treeView.render(database.tree)
				self.container.appendChild(treeView.node)
			}
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