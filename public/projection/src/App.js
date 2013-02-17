define(
[
	'happy/app/BaseApp',
	'happy/utils/keyCode',

	'DataLoader',
	'Database',
	'TreeView'
],
function (
	BaseApp,
	keyCode,

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
			self.setFPS(0);

			database = new Database();

			treeView = new TreeView();
			self.container.appendChild(treeView.node)

			var dataLoader = new DataLoader({
				api: "http://mixology.eu01.aws.af.cm/api/",
				flavors: 'flavors',
				combinations: 'combinations'
			})
			dataLoader.combinationsUpdatedSignal.add(onCombinationsUpdated);
			dataLoader.flavorsLoadedSignal.add(onFlavorsLoaded);

			

			dataLoader.load();			
		}

		var onFlavorsLoaded = function(loader){
			database.flavors = loader.flavors;
			treeView.flavorsById = database.flavorsById;
		}

		var onCombinationsUpdated = function(loader){
			database.add(loader.latestCombinations);
			treeView.data = database.tree;
			treeView.render();
		}

		var onResize = function(size){
			treeView.size = size;
		}

		var onKeyUp = function(e) {	
			switch(keyCode.codeToChar(e.keyCode)){
				case 'SPACEBAR':
					self.toggleFullscreen();					
					break;
			}
		}

		var update = function(dt){
		
		}
		var draw = function(dt){
			
		}

		self.setup = setup;
		self.update = update;
		self.draw = draw;
		self.onResize = onResize;
		self.onKeyUp = onKeyUp;
	}
	App.prototype = new BaseApp();
	return App;
});