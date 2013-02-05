define(
[
	'happy/app/BaseApp',

	'happy/utils/browser',
	'happy/utils/http',

	'happy/_libs/amd-utils/array'
],
function (
	BaseApp,
	browser,
	http,
	arrayUtils
){
	var App = function(){
		var 
		self = this,
		container,
		host = "http://mixology.eu01.aws.af.cm/",
		action = 'users'; 

		var setup = function(){	
			self.setFPS(0);

			var formContainer = document.createElement('div');
			self.container.appendChild(formContainer);

			var browserField = document.createElement('input');
			browserField.type = 'text';
			browserField.placeholder = 'browser';
			formContainer.appendChild(browserField);
			var browserInfo = browser.getInfo();
			browserField.value = browserInfo.name + '::' + browserInfo.version + '::' + browserInfo.os;

			var addBtn = document.createElement('button');
			addBtn.innerHTML = 'add';
			formContainer.appendChild(addBtn);			
			addBtn.addEventListener('click', function(){
				add(browserField.value);
			});

			container = document.createElement('div');
			self.container.appendChild(container);

			refresh();
		}

		var refresh = function(){
			http.call({
				url: host + 'api/' + action + '?'+(new Date()).getTime() ,
				onSuccess: function(request){
					createList(JSON.parse(request.response));
				}
			})
		}
		var createList = function(data){
			while (container.hasChildNodes()) {
				container.removeChild(container.lastChild);
			}
			arrayUtils.forEach(data, createSingle);
		}
		var createSingle = function(data){
			var item = document.createElement('div');

			var browserField = document.createElement('input');
			browserField.type = 'text';
			browserField.value = data.browser;
			browserField.placeholder = 'browser';
			item.appendChild(browserField);

			var createdField = document.createElement('input');
			createdField.type = 'text';
			createdField.value = data.created;
			createdField.placeholder = 'created';
			item.appendChild(createdField);

			var updateBtn = document.createElement('button');
			updateBtn.innerHTML = 'update';
			updateBtn.addEventListener('click', function(){
				update(data._id, browserField.value, createdField.value);
			});
			item.appendChild(updateBtn);

			var delBtn = document.createElement('button');
			delBtn.innerHTML = 'remove';
			delBtn.addEventListener('click', function(){
				remove(data._id);
			});	
			item.appendChild(delBtn);		

			container.appendChild(item);
		}

		var add = function(browser){
			var data = new FormData();
			data.append("browser", browser);

			http.call({
				url: host + 'api/' + action,
				method: 'POST',
				data: data,
				onSuccess: refresh
			});
		}
		var update = function(id, browser, created){
			var data = new FormData();
			data.append("browser", browser);
			data.append("created", created);

			http.call({
				url: host + 'api/' + action + '/' + id,
				method: 'PUT',
				data: data,
				onSuccess: refresh
			});
		}
		var remove = function(id){
			http.call({
				url: host + 'api/' + action + '/' + id,
				method: 'DELETE',
				onSuccess: refresh
			})
		}

		self.setup = setup;
	}
	App.prototype = new BaseApp();
	return App;
});