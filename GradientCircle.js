atom.declare("Game.GradientCircle", App.Element,
{		
	configure: function()
	{
		this.radius = this.settings.get("radius");
		
		this.shape = new Circle(this.settings.get("position"), this.radius);
		
		var surfaceSize = 3;
		
		this.circleInner1 = new Circle(this.shape.center, this.radius - this.radius / surfaceSize);
		this.circleInner2 = new Circle(this.shape.center, this.radius - this.radius / 5);
		
		this.circleShadow1 = new Circle(this.shape.center.x - this.radius / 2, this.shape.center.y - this.radius / 2, 0);
		this.circleShadow2 = new Circle(this.shape.center, this.radius - 10);
	
		var r = atom.number.random(130, 255);
		var g = atom.number.random(130, 255);
		var b = atom.number.random(130, 255);
	
		this.gradientColors = 
		{
			'0.0': "rgba(" + r.toString() + ", " + g.toString() + ", " + b.toString() + ", 1)",
			'1.0': "rgba(" + r.toString() + ", " + g.toString() + ", " + b.toString() + ", 0)"
		};
		
		this.gradientShadowColors =
		{
			"0.0": "rgba(255, 255, 255, 0.7)",
			"1.0": "rgba(255, 255, 255, 0)"
		};
		
		this.zIndex = Controller.zIndexMapObjects;
		Controller.zIndexMapObjects++;
		
		this.redraw();
	},

	onUpdate: function(time)
	{
		//this.redraw();
	},
	
	renderTo: function(ctx)
	{	
		if (this.gradient == null)
		{
			this.gradient = ctx.createGradient(this.circleInner1, this.circleInner2, this.gradientColors);
			this.gradientShadow = ctx.createGradient(this.circleShadow1, this.circleShadow2, this.gradientShadowColors);
		}
		
		ctx.fill(this.circleInner2, this.gradient);
		ctx.fill(this.circleInner1, this.gradientShadow);
	}
});