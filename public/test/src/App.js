define(
[
	'happy/app/BaseApp'
],
function (
	BaseApp
){
	var App = function(){
	}
	App.prototype = new BaseApp();
	return App;
});