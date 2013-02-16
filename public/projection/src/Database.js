define(
[
	'happy/_libs/crossfilter'

],
function (
	crossfilter
){
	var Database = function(){
		var 
		self = this,
		combinations,
		dimensions;

		var init = function(){
			combinations = crossfilter();
			dimensions = {
				rating: combinations.dimension(function(d) { 
					return d.rating;
				})
			}
			
		}
		var add = function(data){
			data.forEach(combinations.add)

			dimensions.rating.filterAll();
			dimensions.rating.filter([4,5]);
			
			console.log(dimensions.rating.top(5));
		}

		Object.defineProperty(self, 'add', {
			value: add
		});

		init();
	}
	return Database;
});