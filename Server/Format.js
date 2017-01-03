load = function()
{
	function formatTest()
	{
		var formats =
		{
			".css": "text/css",
			".png": "image/png",
			".html": "text/html",
			".csv": "text/html",
			".js": "text/javascript",
			".ico": "image/x-icon",
		};
	
		this.cast = function(way)
		{
			for(i in formats)
			{
				if(way.indexOf(i) != -1) return formats[i];
			}
			
			return null;
		}
	}
	
	return new formatTest();
}

module.exports = load;