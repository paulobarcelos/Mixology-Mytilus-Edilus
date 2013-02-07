define(
[
	'happy/app/BaseApp',

	'happy/utils/browser',
	'happy/utils/http',

	'happy/_libs/mout/array/forEach',

	'CombinationPublisher'
],
function (
	BaseApp,

	browser,
	http,

	forEach,

	CombinationPublisher
){
	var App = function(){
		var 
		self = this,
		user,
		flavors,
		sessionData,
		combinationPublisher,
		mytilusEdilusId = '5112e4e4a5bc689301000001',
		host = "http://mixology.eu01.aws.af.cm/",

		mainContainer,

		initialContainer,

		firstFlavorContainer,
		firstFlavorButton,

		secondFlavorContainer,
		secondFlavorButton,

		feebackContainer,
		ratingContainer,
		commentContainer,
		feebackButton,

		publishButton;

		var setup = function(){	
			self.setFPS(0);

			var userData = localStorage['user'];
			if(userData) onUserDataAcquired(userData);
			else {
				var browserInfo = browser.getInfo();
				var browserFormData = new FormData();
				browserFormData.append("browser", browserInfo.name + '::' + browserInfo.version + '::' + browserInfo.os);
				
				http.call({
					url: host + 'api/users',
					method: 'POST',
					data: browserFormData,
					onSuccess: function(request){
						onUserDataAcquired(request.response);
					},
					onError: function(){
						console.log('Error getting user from server.')
					}
				});
			}

			var flavorsData = localStorage['flavors'];
			if(flavorsData) onFlavorsDataAcquired(flavorsData);
			else {
				http.call({
					url: host + 'api/flavors' + '?'+ (new Date()).getTime(),
					method: 'GET',
					onSuccess: function(request){
						onFlavorsDataAcquired(request.response);
					},
					onError: function(){
						console.log('Error getting flavors from server.')
					}
				});
			}
		}

		var onUserDataAcquired = function(data){
			localStorage['user'] = data;
			user = JSON.parse(data);
			if(flavors) onReady();
		}
		var onFlavorsDataAcquired = function(data){
			localStorage['flavors'] = data;
			flavors = JSON.parse(data);
			if(user) onReady();
		}
		var onReady = function(){
			combinationPublisher = new CombinationPublisher(host);
			combinationPublisher.start();

			mainContainer = document.createElement('div');
			self.container.appendChild(mainContainer);

			initialContainer = document.createElement('div');
			initialContainer.innerHTML = 'Mytilys Edilus';

			firstFlavorContainer = document.createElement('select');
			forEach(flavors, function(flavor){
				var option = document.createElement('option');
				option.value = flavor._id;
				option.innerHTML = flavor.name;
				firstFlavorContainer.appendChild(option);
			});
			firstFlavorButton = document.createElement('a');
			firstFlavorButton.href = "#";
			firstFlavorButton.innerHTML = '+';
			firstFlavorButton.addEventListener('click', function(e){
				e.preventDefault();
				enterFirstFlavorStage();
			});

			secondFlavorContainer = document.createElement('select');
			forEach(flavors, function(flavor){
				var option = document.createElement('option');
				option.value = flavor._id;
				option.innerHTML = flavor.name;
				secondFlavorContainer.appendChild(option);
			});
			secondFlavorButton = document.createElement('a');
			secondFlavorButton.href = "#";
			secondFlavorButton.innerHTML = '+';
			secondFlavorButton.addEventListener('click', function(e){
				e.preventDefault();
				enterSecondFlavorStage();
			});

			feebackContainer = document.createElement('div');
			
			ratingContainer = document.createElement('select');
			forEach([1,2,3,4,5], function(i){
				var option = document.createElement('option');
				option.value = i;
				option.innerHTML = i;
				ratingContainer.appendChild(option);
			});
			feebackContainer.appendChild(ratingContainer);

			commentContainer = document.createElement('input');
			feebackContainer.appendChild(commentContainer);

			feebackButton = document.createElement('a');
			feebackButton.href = "#";
			feebackButton.innerHTML = 'continue';
			feebackButton.addEventListener('click', function(e){
				e.preventDefault();
				enterFeedbackStage();
			});

			publishButton = document.createElement('a');
			publishButton.href = "#";
			publishButton.innerHTML = 'send';
			publishButton.addEventListener('click', function(e){
				e.preventDefault();
				enterPublishStage();
			});

			enterInitialStage();
		}

		var enterInitialStage = function(){
			sessionData = {
				flavorIds: [],
				userId: user._id,
				rating: undefined,
				comment: ''
			}

			while (mainContainer.hasChildNodes()) mainContainer.removeChild(mainContainer.lastChild);
			mainContainer.appendChild(initialContainer);
			mainContainer.appendChild(firstFlavorButton);

		}
		var enterFirstFlavorStage = function(){
			sessionData.flavorIds.push(mytilusEdilusId);
			
			while (mainContainer.hasChildNodes()) mainContainer.removeChild(mainContainer.lastChild);
			mainContainer.appendChild(firstFlavorContainer);
			mainContainer.appendChild(secondFlavorButton);
		}
		var enterSecondFlavorStage = function(){
			sessionData.flavorIds.push(firstFlavorContainer.value);
			
			while (mainContainer.hasChildNodes()) mainContainer.removeChild(mainContainer.lastChild);
			mainContainer.appendChild(secondFlavorContainer);
			mainContainer.appendChild(feebackButton);
		}
		var enterFeedbackStage = function(){
			sessionData.flavorIds.push(secondFlavorContainer.value);
			
			while (mainContainer.hasChildNodes()) mainContainer.removeChild(mainContainer.lastChild);
			mainContainer.appendChild(ratingContainer);
			mainContainer.appendChild(commentContainer);
			mainContainer.appendChild(publishButton);
		}

		var enterPublishStage = function(){
			sessionData.rating = ratingContainer.value;
			sessionData.comment = commentContainer.value;
			combinationPublisher.add(sessionData);

			while (mainContainer.hasChildNodes()) mainContainer.removeChild(mainContainer.lastChild);

			enterInitialStage();
		}

		var detachFromParentNode = function(element){
			element.parentNode.removeChild(element);
		}

		self.setup = setup;
	}
	App.prototype = new BaseApp();
	return App;
});