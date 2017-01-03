atom.declare("Game.Teams",
{
	initialize: function()
	{
		var collection = 
		{
			blue:
			{
				color: "#6C3AD8",
				colorDark: "#45268E"
			},
			
			red:
			{
				color: "#FF4242",
				colorDark: "#AF2D2D"
			},
			
			yellow:
			{
				color: "#FFD800",
				colorDark: "#BC9D00"
			}
		};
		
		this.collection = collection;
	},
	
	getColor: function(team)
	{
		return this.collection[team].color;
	},
	
	getColorDark: function(team)
	{
		return this.collection[team].colorDark;
	}
});