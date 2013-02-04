var static = require('node-static');
var file = new static.Server('./public', {cache:0});
require('http').createServer(function (request, response) {
	request.addListener('end', function () {
		file.serve(request, response);
	});
}).listen(process.env.VCAP_APP_PORT || 8080);