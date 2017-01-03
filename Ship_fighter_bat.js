atom.declare("Game.Ship_fighter_bat", Game.Ship,
{	
	configure: function method()
	{
		this.quads = 4;
	
		this.solidW = 7;
		this.solidH = 12;
		this.baseThrust = 0.03;
		this.slowdown = 0.005;
		this.maxThrust = 3;
		this.rotateSpeed = 0.0025;
		this.HP = 70;
		this.regenerateHP = 0.01;
		this.regenerateCooldown = 5000;
		this.debris = 2;
		this.debrisRadius = 7;
		this.type = "fighter";
	
		this.textureMain = Controller.images.get("ship4");
		this.textureBroken = Controller.images.get("ship4_broken");
	
		method.previous.call(this);
		
		this.configureParts();
		
		// Bat specific
		this.attackDistance = 500;
		this.attackCooldown = 0;
		this.attackCooldownValue = 700;
		this.bulletLifeTime = 1500;
		this.bulletDamage = 30;
		this.bulletSize = 2;
		
		this.redraw();
	},
	
	configureParts: function()
	{
		collider = 
		[
			[0, 0, 0, 0],
			[0, 1, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0]
		];
		this.putCollider(collider);
	},
	
	piupiu: function(time)
	{
		this.attackCooldown += time;
		if (this.attackCooldown > this.attackCooldownValue)
		{
			this.attackCooldown = 0;
			
			new Game.Bullet(Controller.layerShips, 
			{
				position: this.shape.center,
				angle: this.angle + (Math.random() - 0.5) / 10,
				speed: 0.4,
				lifeTime: this.bulletLifeTime,
				damage: this.bulletDamage,
				team: this.team,
				bulletSize: this.bulletSize
			});
		}
	},
	
	autoFire: function(time)
	{
		for (var i=0; i<Controller.ships.length; i++)
		{
			var ship = Controller.ships[i];
			if (ship.team == this.team)
				continue;
				
			var distance = this.shape.center.distanceTo(ship.shape.center);
			
			if (distance < this.attackDistance)
			{
				this.piupiu(time);
				break;
			}
		}
	},
	
	onUpdate: function method(time)
	{
		method.previous.call(this, time);
		this.autoFire(time);
	}
});