define(
[
	'happy/utils/http'
],
function (
	http
){
	var CombinationPublisher = function(host){
		var 
		self = this,
		combinationsString,
		combinations;

		var start = function(){	
			combinationsString = localStorage['combinations'] || '[]';
			combinations = JSON.parse(combinationsString);
			publish();

			if(combinations.length) publish();
		}

		var add = function(data){
			// we need to clone the data
			var clone = {
				flavorIds: [],
				userId: data.userId,
				rating: data.rating,
				comment: data.comment
			};
			for(var i = 0; i < data.flavorIds.length; i++){
				clone.flavorIds[i] = String(data.flavorIds[i]);
			}

			combinations.push(clone);
			combinationsString = JSON.stringify(combinations);
			localStorage['combinations'] = combinationsString;

			if(combinations.length == 1) publish()
		}

		var publish = function(){
			if(!combinations.length) return;

			var data = new FormData();
			for(key in combinations[0]){
				data.append(key, combinations[0][key]);
			}

			http.call({
				url: host + 'api/combinations',
				method: 'POST',
				data: data,
				onSuccess: function(request){
					// remove from the queue and keep publishing!
					combinations.shift();
					combinationsString = JSON.stringify(combinations);
					localStorage['combinations'] = combinationsString;
					
					publish();
				},
				onError: function(){
					// wait a bit and repeat!
					setTimeout(publish, 3000);
				}
			});
		}

		Object.defineProperty(self, 'start', {
			value: start
		});
		Object.defineProperty(self, 'add', {
			value: add
		});
	}
	return CombinationPublisher;
});