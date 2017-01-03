var load = function(obj)
{
	obj.log = function (data)
	{
		console.log((new Date).toLocaleTimeString() + " " + data.toString());
	}
	
	obj.warning = function (data)
	{
		this.log("WARNING! " + data);
	}
}

module.exports = load;