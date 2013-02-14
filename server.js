var static = require('node-static');
var file = new static.Server('./public', {cache:0});
var port = 8080;
if(process && process.env && process.env.VCAP_APP_PORT ){
	port = process.env.VCAP_APP_PORT;
}

require('http').createServer(function (request, response) {
	request.addListener('end', function () {
		file.serve(request, response);
	});
}).listen(port);