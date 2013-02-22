define(
[
	'happy/app/BaseApp',
	'happy/utils/keyCode',

	'DataLoader',
	'Database',
	'TreeView',
	'TreeViewTimeline',
	'FeaturedCombinations',
	'FlavorBars',
	'CombinationRanking'
],
function (
	BaseApp,
	keyCode,

	DataLoader,
	Database,
	TreeView,
	TreeViewTimeline,
	FeaturedCombinations,
	FlavorBars,
	CombinationRanking
){
	var App = function(){
		var 
		self = this,
		database,
		treeView,
		treeViewTimeline,
		featuredCombinations,
		flavorBars,
		combinationRankingPositive,
		//host = "http://mixology.eu01.aws.af.cm/";
		host = "http://127.0.0.1:8000/";

		var setup = function(){	
			//self.setFPS(0);

			database = new Database();

			treeView = new TreeView(self.container);		
			featuredCombinations = new FeaturedCombinations(self.container);
			flavorBars = new FlavorBars(self.container);
			combinationRankingPositive = new CombinationRanking(self.container);

			var dataLoader = new DataLoader({
				api: host + 'api/',
				flavors: 'flavors',
				combinations: 'combinations'
			})
			dataLoader.combinationsUpdatedSignal.add(onCombinationsUpdated);
			dataLoader.flavorsLoadedSignal.add(onFlavorsLoaded);

			treeViewTimeline = new TreeViewTimeline(self.container, dataLoader);

			dataLoader.load();	

					
		}

		var onFlavorsLoaded = function(loader){
			database.flavors = loader.flavors;
			treeView.flavorsById = database.flavorsById;
			treeViewTimeline.flavorsById = database.flavorsById;
			flavorBars.flavorsById = database.flavorsById;
			combinationRankingPositive.flavorsById = database.flavorsById;
		}

		var firstRun = true;
		var onCombinationsUpdated = function(loader){
			database.add(loader.latestCombinations);
			treeView.data = database.tree;
			featuredCombinations.combinations = database.combinations;
			flavorBars.combinations = database.combinations;
			combinationRankingPositive.combinations = database.combinations;
			combinationRankingPositive.combinationsByUid = database.combinationsByUid;

			if(treeView.isAnimating) treeView.render();
			if(firstRun){
				firstRun = false;
				
				//featuredCombinations.stopSignal.addOnce(onFeaturedCombinationsStop);
				//featuredCombinations.start();
			}
		}

		var onResize = function(size){
			treeView.size = size;
			treeViewTimeline.size = size;
			featuredCombinations.size = size;
			flavorBars.size = size;
			combinationRankingPositive.size = size;
		}

		var onFeaturedCombinationsStop = function(){
			treeView.stopSignal.addOnce(onTreeViewStop);
			treeView.start(0,60);
		}
		var onTreeViewStop = function(){
			featuredCombinations.stopSignal.addOnce(onFeaturedCombinationsStop);
			featuredCombinations.start();
		}

		var onKeyUp = function(e) {	
			switch(keyCode.codeToChar(e.keyCode)){
				case 'SPACEBAR':
					self.toggleFullscreen();					
					break;
				case '0':
					removeAllSignals();			
					break;
				case '1':
					removeAllSignals();	
					treeViewTimeline.start();				
					break;
				case '2':
					removeAllSignals();	
					treeViewTimeline.exit(flavorBars.start);					
					break;
				case '3':
					removeAllSignals();	
					flavorBars.exit(combinationRankingPositive.start);			
					break;
				case '4':
					removeAllSignals();	
					combinationRankingPositive.start();			
					break;
				case '6':
					//removeAllSignals();	
					//treeViewTimeline.exit();				
					break;
				case '90':
					removeAllSignals();	
					featuredCombinations.stopSignal.addOnce(onFeaturedCombinationsStop);
					featuredCombinations.start();			
					break;
			}
		}

		var removeAllSignals = function(){
			treeView.stopSignal.removeAll();
			featuredCombinations.stopSignal.removeAll();
			flavorBars.stopSignal.removeAll();
		}

		var update = function(dt){
			treeView.update(dt);
			featuredCombinations.update(dt);
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