define(
[],
function(){
	var size = function(element){
		var x = element.offsetWidth;
		var y = element.offsetHeight;
		return {
			x: x,
			y: y
		}
	}
	var addClass = function (element, className){
		element.className += (' ' + className);
	}
	var removeClass = function (element, className){
		var re = new RegExp("/(?:^|\s)" + className + "(?!\S)/g","g");
 	 	element.className.replace(re,'');
	}

	return {
		size: size,
		addClass: addClass,
		removeClass: removeClass,
	}
});