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
	var hasClass = function (ele,cls) {
		return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
	}
	var addClass = function (ele,cls) {
		if (!this.hasClass(ele,cls)) ele.className += " "+cls;
	}
	var removeClass = function (ele,cls) {
		if (hasClass(ele,cls)) {
			var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
			ele.className=ele.className.replace(reg,' ');
		}
	}

	return {
		size: size,
		hasClass: hasClass,
		addClass: addClass,
		removeClass: removeClass,
	}
});