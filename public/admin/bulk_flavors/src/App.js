define(
[
	'happy/app/BaseApp',
	'happy/utils/http',

	'happy/_libs/mout/array/forEach',
	'happy/_libs/mout/array/indexOf'
],
function (
	BaseApp,
	http,
	forEach,
	indexOf
){
	var App = function(){
		var 
		self = this,
		host = "http://mixology.eu01.aws.af.cm/",
		action = 'flavors'; 

		var setup = function(){	
			self.setFPS(0);

			var formContainer = document.createElement('div');
			self.container.appendChild(formContainer);

			var bulk = document.createElement('textarea');
			bulk.placeholder = 'insert flavors string';
			formContainer.appendChild(bulk);

			var addBtn = document.createElement('button');
			addBtn.innerHTML = 'add';
			formContainer.appendChild(addBtn);			
			addBtn.addEventListener('click', function(){
				formContainer.removeChild(addBtn);
				var entries = bulk.value.split('|');
				var flavors = [];
				for (var i = 0; i < entries.length; i++) {
					var entry = entries[i].split(';');
					var flavor = {
						name: entry[0],
						color: entry[1],
						groups: entry[2]
					}
					flavors.push(flavor);
				};

				console.log(flavors);
				recursiveAdd(flavors);
			});

		}


		var recursiveAdd = function(flavors){
			var flavor = flavors[0];

			var data = new FormData();
			data.append("name", flavor.name);
			data.append("color", flavor.color);
			data.append("groups", flavor.groups);

			http.call({
				url: host + 'api/' + action,
				method: 'POST',
				data: data,
				onSuccess: function(){
					flavors.shift();
					recursiveAdd(flavors);
				},
				onError: function(){
					recursiveAdd(flavors);
				}
			});
		}


		self.setup = setup;
	}
	App.prototype = new BaseApp();
	return App;
});