define(
[
	'happy/app/BaseApp',
	'happy/utils/http'
],
function (
	BaseApp,
	http
){
	var App = function(){
		var 
		self = this,
		user,
		flavors,
		host = "http://mixology.eu01.aws.af.cm/"; 

		var setup = function(){	
			self.setFPS(0);

			var userData = localStorage['user'];
			if(userData) onUserDataAcquired(userData);
			else {
				http.call({
					url: host + 'api/users',
					method: 'POST',
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
					url: host + 'api/flavors',
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
			console.log(user);
			if(flavors) onReady();
		}

		var onFlavorsDataAcquired = function(data){
			localStorage['flavors'] = data;
			flavors = JSON.parse(data);
			console.log(flavors);
			if(user) onReady();
		}

		var onReady = function(){
			console.log('ready!')
		}
		self.setup = setup;
	}
	App.prototype = new BaseApp();
	return App;
});