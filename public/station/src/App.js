define(
[
	'happy/app/BaseApp',

	'happy/utils/ajax',
	'happy/utils/browser',
	'happy/utils/dom',

	'happy/_libs/mout/array/forEach',

	'CombinationSelector',
	'RatingSelector',
	'CommentSelector',
	'EndScreen',
	'CombinationPublisher'
],
function (
	BaseApp,

	ajax,
	browser,
	dom,

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

			var browserInfo = browser.getInfo();
			alert(browserInfo.name + '_' + browserInfo.version + '_' + browserInfo.os);


			var titleNode = document.createElement('h1');
			titleNode.innerHTML = "Mytilus Edulis";
			self.container.appendChild(titleNode);

			var dropcache = (window.location.search.indexOf('dropcache')!=-1);
			if(dropcache){
				localStorage.removeItem('user'); 
				localStorage.removeItem('flavors'); 
			}

			var userData = localStorage.getItem('user'); 
			if(userData) onUserDataAcquired(userData);
			else loadUserData();

			var flavorsData = localStorage.getItem('flavors'); 
			if(flavorsData) onFlavorsDataAcquired(flavorsData);
			else loadFlavorsData();

			window.addEventListener("load", hideAddressBar );
			window.addEventListener("orientationchange", hideAddressBar );
			hideAddressBar();
		}

		var loadUserData = function(){
			var browserInfo = browser.getInfo();
			var data = {
				browser: browserInfo.name + '_' + browserInfo.version + '_' + browserInfo.os
			}			
			/*ajax({
				url: host + 'api/users',
				method: 'POST',
				headers: {'Content-type': 'application/json'},
				data: JSON.stringify(data),
				onSuccess: function(request){
					onUserDataAcquired(request.responseText);
				},
				onError: function(request){
					console.log('Error getting user from server.')
					console.log(request.status)			
				}
			});*/

			$.ajax({
				url: host + 'api/users',
				type: "POST",
				dataType: 'json',
				contentType: 'application/json',
				async: false,
				data: JSON.stringify(data),
				success: function(reponse){
					onUserDataAcquired(JSON.stringify(reponse));
				},
				error: function(){
					console.log('Error getting user from server.')
					setTimeout(loadUserData, 2000);
				}
			})
		}
		var loadFlavorsData = function(){
			ajax({
				url: host + 'api/flavors' + '?'+ (new Date()).getTime(),
				method: 'GET',
				onSuccess: function(request){
					onFlavorsDataAcquired(request.responseText);
				},
				onError: function(){
					console.log('Error getting flavors from server.')
					setTimeout(loadFlavorsData, 2000);
				}
			});
		}

		var onUserDataAcquired = function(data){
			localStorage.setItem('user', data); 
			user = JSON.parse(data);
			if(flavors) init();
		}
		var onFlavorsDataAcquired = function(data){
			localStorage.setItem('flavors', data); 
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