define(
[
	'happy/app/BaseApp',
	'happy/utils/http',

	'happy/_libs/amd-utils/array'
],
function (
	BaseApp,
	http,
	arrayUtils
){
	var App = function(){
		var 
		self = this,
		flavorsContainer,
		host = "http://mixology.eu01.aws.af.cm/"; 

		var setup = function(){	
			self.setFPS(0);

			var formContainer = document.createElement('div');
			self.container.appendChild(formContainer);

			var name = document.createElement('input');
			name.type = 'text';
			name.placeholder = 'name';
			formContainer.appendChild(name);

			var color = document.createElement('input');
			color.type = 'text';
			color.placeholder = 'color';
			formContainer.appendChild(color);

			var button = document.createElement('button');
			button.innerHTML = 'add';
			formContainer.appendChild(button);			
			button.addEventListener('click', function(){
				addFlavor(name.value, color.value);
			});

			flavorsContainer = document.createElement('div');
			self.container.appendChild(flavorsContainer);

			refreshFlavors();
		}

		var refreshFlavors = function(){
			http.call({
				url: host + 'api/flavors?'+(new Date()).getTime() ,
				onSuccess: function(request){
					createFlavorList(JSON.parse(request.response));
				}
			})
		}
		var createFlavorList = function(data){
			while (flavorsContainer.hasChildNodes()) {
				flavorsContainer.removeChild(flavorsContainer.lastChild);
			}
			arrayUtils.forEach(data, createSingleFlavor);
		}
		var createSingleFlavor = function(data){
			var flavor = document.createElement('div');
			flavor.style.color = data.color;
			flavor.style.backgroundColor	 = data.color;
			flavor.id = data._id; 

			var name = document.createElement('input');
			name.type = 'text';
			name.value = data.name;
			flavor.appendChild(name);

			var color = document.createElement('input');
			color.type = 'text';
			color.value = data.color;
			flavor.appendChild(color);

			var update = document.createElement('button');
			update.innerHTML = 'update';
			update.addEventListener('click', function(){
				updateFlavor(data._id, name.value, color.value);
			});
			flavor.appendChild(update);

			var del = document.createElement('button');
			del.innerHTML = 'delete';
			del.addEventListener('click', function(){
				deleteFlavor(data._id);
			});	
			flavor.appendChild(del);		

			flavorsContainer.appendChild(flavor);
		}

		var addFlavor = function(name, color){
			var data = new FormData();
			data.append("name", name);
			data.append("color", color);

			http.call({
				url: host + 'api/flavors',
				method: 'POST',
				data: data,
				onSuccess: refreshFlavors
			});
		}
		var updateFlavor = function(id, name, color){
			var data = new FormData();
			data.append("name", name);
			data.append("color", color);

			http.call({
				url: host + 'api/flavors/' + id,
				method: 'PUT',
				data: data,
				onSuccess: refreshFlavors
			});
		}
		var deleteFlavor = function(id){

			http.call({
				url: host + 'api/flavors/' + id,
				method: 'DELETE',
				onSuccess: refreshFlavors
			})
		}

		self.setup = setup;
	}
	App.prototype = new BaseApp();
	return App;
});