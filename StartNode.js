var Server = function()
{
	var This = this;
	
	var fs = require("fs");
	var http = require("http");
	var formatTest = require(__dirname + "/Server/Format.js")();
	require(__dirname + "/Server/Log.js")(This);
	
	This.request = function(req, response)
	{
		if(req.url == "/")
			req.url += "Game.html";
		
		var way = (__dirname + "/" + req.url).replace(/\//g, "\\");
		var format = formatTest.cast(req.url);
		var reader = format == "text/html" ? "utf8" : "binary";
		
		fs.readFile(way, reader, function (err, data) 
		{
			if (err) 
			{
				This.warning("Page not found: " + way);
				response.writeHead(404, {"Content-Type": "text/html; charset=UTF-8"});
				response.end("404. Page not found.");
				return;
			}
			else
			{
				if(format != null)
					response.writeHead(200, {"Content-Type": format});
			
				response.write(data, reader);
				response.end();
				return;
			}
		});
	};
	
	var server = http.createServer(This.request);
	server.listen(80);
	This.log("Start");
};

new Server();