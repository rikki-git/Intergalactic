atom.declare("Game.MapObject", App.Element,
{		
	configure: function()
	{
		this.shape = new Rectangle({
			center: this.settings.get("position"),
			size: new Size(300, 300)
		});
		
		var debris = this.settings.get("debris");
		
		this.angle = this.settings.get("angle");
		if (this.angle == null) this.angle = Math.random() * 7;
		this.textureMain = this.settings.get("textureMain");
		
		if (this.textureMain == null)
		{
			if (debris != null)
			{
				var debrisCount = 8;
				var dId = atom.number.random(1, debrisCount);
				this.textureMain = Controller.images.get("debris" + dId.toString());
				this.debrisSlow = 0.0001;
				this.debrisSpeed = 0.06 + Math.random() * 0.1;
				this.shape.move(new Point(debris * Math.sin(this.angle), -debris * Math.cos(this.angle)));
			}
			else 
			{
				var fogCount = 6;
				var fId = atom.number.random(1, fogCount);
				this.textureMain = Controller.images.get("fog" + fId.toString());
			}
		}
		
		this.zIndex = Controller.zIndexMapObjects;
		Controller.zIndexMapObjects++;
		
		this.redraw();
	},

	onUpdate: function(time)
	{
		if (this.debrisSpeed != null)
		{
			var thrustCurrent = this.debrisSpeed * time;
			movePoint = new Point(thrustCurrent * Math.sin(this.angle), -thrustCurrent * Math.cos(this.angle));
			this.shape.move(movePoint);
			this.debrisSpeed -= this.debrisSlow * time;
			
			if(this.debrisSpeed <= 0) this.debrisSpeed = null;
		}
	
		this.redraw();
	},
	
	renderTo: function(ctx)
	{	
		ctx.drawImage({
			image: this.textureMain,
			center: this.shape.center,
			angle: this.angle
		});
	}
});