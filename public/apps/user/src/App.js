define(
[
	'happy/app/BaseApp',
	'happy/utils/http',
],
function (
	BaseApp,
	http
){
	var App = function(){
		var 
		self = this,

		audioContext,
		output,
		stirAudio,
		chopAudio,
		wineAudio,	
		stirInteraction,
		chopInteraction,
		wineInteraction,
		mixer,
		gui;

		var setup = function(){	

		}

		var update = function(dt, time) {
			if(stirAudio.isReady && chopAudio.isReady && wineAudio.isReady){
		
		}
		var draw = function(dt, time) {

		}

		var onKeyUp = function(e){
			stirInteraction.onKeyUp(e);
			chopInteraction.onKeyUp(e);
			wineInteraction.onKeyUp(e);
		}

		var onKeyDown = function(e){
			stirInteraction.onKeyDown(e);
			chopInteraction.onKeyDown(e);
			wineInteraction.onKeyDown(e);
		}



		self.setup = setup;

	}
	App.prototype = new BaseApp();
	return App;
});