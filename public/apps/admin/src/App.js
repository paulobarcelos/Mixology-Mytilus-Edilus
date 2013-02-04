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
		itemsContainer,
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
				addItem(name.value, color.value);
			});

			itemsContainer = document.createElement('div');
			self.container.appendChild(itemsContainer);

			refreshItems();
		}

		var refreshItems = function(){
			http.call({
				url: host + 'api/items?'+(new Date()).getTime() ,
				onSuccess: function(request){
					createItemList(JSON.parse(request.response));
				}
			})
		}
		var createItemList = function(data){
			while (itemsContainer.hasChildNodes()) {
				itemsContainer.removeChild(itemsContainer.lastChild);
			}
			arrayUtils.forEach(data, createSingleItem);
		}
		var createSingleItem = function(data){
			var item = document.createElement('div');
			item.style.color = data.color;
			item.style.backgroundColor	 = data.color;
			item.id = data._id; 

			var name = document.createElement('input');
			name.type = 'text';
			name.value = data.name;
			item.appendChild(name);

			var color = document.createElement('input');
			color.type = 'text';
			color.value = data.color;
			item.appendChild(color);

			var update = document.createElement('button');
			update.innerHTML = 'update';
			update.addEventListener('click', function(){
				updateItem(data._id, name.value, color.value);
			});
			item.appendChild(update);

			var del = document.createElement('button');
			del.innerHTML = 'delete';
			del.addEventListener('click', function(){
				deleteItem(data._id);
			});	
			item.appendChild(del);		

			itemsContainer.appendChild(item);
		}

		var addItem = function(name, color){
			var data = new FormData();
			data.append("name", name);
			data.append("color", color);

			http.call({
				url: host + 'api/items',
				method: 'POST',
				data: data,
				onSuccess: refreshItems
			});
		}
		var updateItem = function(id, name, color){
			var data = new FormData();
			data.append("name", name);
			data.append("color", color);

			http.call({
				url: host + 'api/items/' + id,
				method: 'PUT',
				data: data,
				onSuccess: refreshItems
			});
		}
		var deleteItem = function(id){

			http.call({
				url: host + 'api/items/' + id,
				method: 'DELETE',
				onSuccess: refreshItems
			})
		}

		self.setup = setup;
	}
	App.prototype = new BaseApp();
	return App;
});