define(
[
	'happy/app/BaseApp',
	'happy/utils/keyCode',

	'DataLoader',
	'Database',
	'TreeView',
	'FeaturedFlavors'
],
function (
	BaseApp,
	keyCode,

	DataLoader,
	Database,
	TreeView,
	FeaturedFlavors
){
	var App = function(){
		var 
		self = this,
		database,
		treeView,
		featuredFlavors;

		var setup = function(){	
			//self.setFPS(0);

			database = new Database();

			treeView = new TreeView(self.container);
			treeView.stopSignal.add(onTreeViewStop);

			featuredFlavors = new FeaturedFlavors(self.container);
			featuredFlavors.stopSignal.add(onFeaturedFlavorsStop);

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

		var firstRun = true;
		var onCombinationsUpdated = function(loader){
			database.add(loader.latestCombinations);
			treeView.data = database.tree;
			featuredFlavors.combinations = database.combinations;

			if(treeView.isAnimating) treeView.render();
			if(firstRun){
				firstRun = false;
				featuredFlavors.start();
			}
		}

		var onResize = function(size){
			treeView.size = size;
			featuredFlavors.size = size;
		}

		var onFeaturedFlavorsStop = function(){
			treeView.start(0,60);
		}
		var onTreeViewStop = function(){
			featuredFlavors.start();
		}

		var onKeyUp = function(e) {	
			switch(keyCode.codeToChar(e.keyCode)){
				case 'SPACEBAR':
					self.toggleFullscreen();					
					break;
				case 'A':
					treeView.startAnimation(0,20, function(){console.log('end!')});					
					break;
				case 'B':
					featuredFlavors.start(4);					
					break;
			}
		}

		var update = function(dt){
			treeView.update(dt);
			featuredFlavors.update(dt);
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