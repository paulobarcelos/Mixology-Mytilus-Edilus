define(
[
	'happy/app/BaseApp',

	'happy/utils/browser',
	'happy/utils/ajax',

	'happy/_libs/mout/array/forEach',

	'CombinationSelector',
	'RatingSelector',
	'CommentSelector',
	'EndScreen',
	'CombinationPublisher'
],
function (
	BaseApp,

	browser,
	ajax,

	forEach,

	CombinationSelector,
	RatingSelector,
	CommentSelector,
	EndScreen,
	CombinationPublisher
){
	var App = function(){
		var 
		self = this,
		user,
		flavors,
		combinationPublisher,
		combinationSelector,
		ratingSelector,
		endScreen,
		commentSelector,
		host = "http://mixology.eu01.aws.af.cm/";

		var setup = function(){	
			self.setFPS(0);

			var titleNode = document.createElement('h1');
			titleNode.innerHTML = "Mytilus Edulis";
			self.container.appendChild(titleNode);

			var dropCache = (window.location.search.indexOf('dropcache')!=-1);

			var userData = (dropCache) ? null : localStorage['user'];
			if(userData) onUserDataAcquired(userData);
			else {
				var browserInfo = browser.getInfo();
				var browserData = {
					browser: browserInfo.name + '::' + browserInfo.version + '::' + browserInfo.os
				}			
				ajax({
					url: host + 'api/users',
					//method: 'POST',
					//data: browserData,
					onSuccess: function(request){
						onUserDataAcquired(request.responseText);
					},
					onError: function(request){
						console.log('Error getting user from server.')
						console.log(request.status)			
					}
				});
			}

			var flavorsData = (dropCache) ? null : localStorage['flavors'];
			if(flavorsData) onFlavorsDataAcquired(flavorsData);
			else {
				ajax({
					url: host + 'api/flavors' + '?'+ (new Date()).getTime(),
					method: 'GET',
					onSuccess: function(request){
						onFlavorsDataAcquired(request.responseText);
					},
					onError: function(){
						console.log('Error getting flavors from server.')
					}
				});
			}

			window.addEventListener("load", hideAddressBar );
			window.addEventListener("orientationchange", hideAddressBar );
			hideAddressBar();
		}

		var onUserDataAcquired = function(data){
			localStorage['user'] = data;
			user = JSON.parse(data);
			if(flavors) init();
		}
		var onFlavorsDataAcquired = function(data){
			localStorage['flavors'] = data;
			flavors = JSON.parse(data);
			if(user) init();
		}
		
		var init = function(){
			combinationSelector = new CombinationSelector(flavors);
			self.container.appendChild(combinationSelector.node);

			ratingSelector = new RatingSelector();
			self.container.appendChild(ratingSelector.node);

			commentSelector = new CommentSelector();
			self.container.appendChild(commentSelector.node);
			commentSelector.sendSignal.add(onSend);

			endScreen = new EndScreen(self.container);

			combinationPublisher = new CombinationPublisher(host);
			combinationPublisher.start();
		}

		var onSend = function (commentSelector) {
			var data = {
				flavorIds: combinationSelector.selected,
				userId: user._id,
				rating: ratingSelector.value,
				comment: commentSelector.value
			}
			if(data.flavorIds.length < 3){
				alert("You need to selected the ingredients first!");
			}
			else onComplete(data);
		}

		var onComplete = function(data) {
			combinationPublisher.add(data);
			combinationSelector.reset();
			ratingSelector.reset();
			commentSelector.reset();
			hideAddressBar();
			endScreen.go(data.rating);
		}

		var hideAddressBar = function (){
			if(document.height <= window.outerHeight + 10) {
				setTimeout( function(){ window.scrollTo(0, 1); }, 50 );
			}
			else {
				setTimeout( function(){ window.scrollTo(0, 1); }, 0 );
			}
		}

		self.setup = setup;
	}
	App.prototype = new BaseApp();
	return App;
});