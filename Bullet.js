atom.declare("Game.Bullet", App.Element,
{
	configure: function()
	{
		this.textureMain = Controller.images.get("bullet");
		this.angle = this.settings.get("angle");
		this.speed = this.settings.get("speed");
		this.team = this.settings.get("team");
		this.lifeTime = 1500;
		if (this.settings.get("lifeTime") != null) this.lifeTime = this.settings.get("lifeTime");
		this.damage = 10;
		if (this.settings.get("damage") != null) this.damage = this.settings.get("damage");
		this.zIndex = Controller.zIndexCounter + 1;
		this.bulletSize = 3;
		if (this.settings.get("bulletSize") != null) this.bulletSize = this.settings.get("bulletSize");
	
		this.shape = new Rectangle({
			center: this.settings.get("position"),
			size: new Size(50, 50)
		});
		
		this.solid = new Circle(this.settings.get("position"), this.bulletSize);
	},
	
	renderTo: function(ctx)
	{
		ctx.fill(this.solid, Controller.teams.getColor(this.team))
	},
	
	kill: function()
	{
		this.destroy();
	
		new Game.explosion(Controller.layerShips, 
		{
			explosion: "bulletExplosion",
			size: 32,
			position: this.shape.center,
			delay: 60
		});
	},
	
	onUpdate: function(time)
	{
		this.lifeTime -= time;
		if (this.lifeTime < 0)
		{
			this.kill();
			return;
		}
	
		if (this.memoizationMove == null)
		{
			this.memoizationMove = new Point(this.speed * Math.sin(this.angle), -this.speed * Math.cos(this.angle));
		}
		
		var movePoint = new Point(this.memoizationMove.x * time, this.memoizationMove.y * time);
		this.shape.move(movePoint);
		this.solid.move(movePoint);
		
		for (var i=0; i<Controller.ships.length; i++)
		{
			var ship = Controller.ships[i];
			if (ship.team == this.team || ship.killed)
				continue;
			
			var slot = ship.collide(this.shape.center);
			if(slot == null)
				continue;
			
			if (slot.part != null && slot.part.killed != null && slot.part.killed == false)
			{
				slot.part.doDamage(this.damage);
				Controller.sound.play("shoot_part", this.shape.center);
				this.kill();
				return;
			}
			else
			{
				if (slot.ship != null && slot.ship.killed == false && slot.ship.HP > 0)
				{
					slot.ship.doDamage(this.damage);
					Controller.sound.play("shoot", this.shape.center);
					this.kill();
					return;
				}
			}
		}
		this.redraw();
	}
});