atom.declare("Game.Ship_cruiser_tesla", Game.Ship,
{	
	configure: function method()
	{
		this.quads = 24;
	
		this.solidW = 10;
		this.solidH = 135;
		this.baseThrust = 0.005;
		this.slowdown = 0.0005;
		this.maxThrust = 0.4;
		this.rotateSpeed = 0.0002;
		this.HP = 850;
		this.regenerateHP = 0.01;
		this.regenerateCooldown = 10000;
		this.debris = 7;
		this.debrisRadius = 20;
		this.type = "cruiser";
	
		this.textureMain = Controller.images.get("ship3");
		this.textureBroken = Controller.images.get("ship3_broken");
	
		method.previous.call(this);
		
		this.configureParts();
		
		this.redraw();
	},
	
	configureParts: function()
	{
		collider = 
		[
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];
		this.putCollider(collider);
	
		var turretsDist = 1000;
		var attackCooldown = 2000;
		var bulletLifeTime = 3000;
		var bulletDamage = 100;
		var bulletSize = 5;
		var turretRotationSpeed = 0.001;
	
		var turret1 = new Game.Part_turret_1(Controller.layerShips,
		{
			localPosition: new Point(-35, 15),
			angle: 0,
			attackDistance: turretsDist,
			attackCooldownValue: attackCooldown,
			bulletLifeTime: bulletLifeTime,
			bulletDamage: bulletDamage,
			bulletSize: bulletSize,
			rotationSpeed: turretRotationSpeed,
			parent: this,
			quads: [{x: 7, y: 13}]
		});
		this.putPart(turret1);
		
		var turret2 = new Game.Part_turret_1(Controller.layerShips,
		{
			localPosition: new Point(-35, 50),
			angle: 0,
			attackDistance: turretsDist,
			attackCooldownValue: attackCooldown,
			bulletLifeTime: bulletLifeTime,
			bulletDamage: bulletDamage,
			bulletSize: bulletSize,
			rotationSpeed: turretRotationSpeed,
			parent: this,
			quads: [{x: 7, y: 18}]
		});
		this.putPart(turret2);
		
		var turret3 = new Game.Part_turret_1(Controller.layerShips,
		{
			localPosition: new Point(35, -10),
			angle: 0,
			attackDistance: turretsDist,
			attackCooldownValue: attackCooldown,
			bulletLifeTime: bulletLifeTime,
			bulletDamage: bulletDamage,
			bulletSize: bulletSize,
			rotationSpeed: turretRotationSpeed,
			parent: this,
			quads: [{x: 16, y: 10}]
		});
		this.putPart(turret3);
		
		var turret4 = new Game.Part_turret_1(Controller.layerShips,
		{
			localPosition: new Point(35, 30),
			angle: 0,
			attackDistance: turretsDist,
			attackCooldownValue: attackCooldown,
			bulletLifeTime: bulletLifeTime,
			bulletDamage: bulletDamage,
			bulletSize: bulletSize,
			rotationSpeed: turretRotationSpeed,
			parent: this,
			quads: [{x: 16, y: 15}]
		});
		this.putPart(turret4);
		
		var engine1 = new Game.Part_engine_2(Controller.layerShips,
		{
			localPosition: new Point(-12, 84),
			angle: 0,
			parent: this,
			quads: [{x: 10, y: 22}]
		});
		this.putPart(engine1);
		
		var engine2 = new Game.Part_engine_2(Controller.layerShips,
		{
			localPosition: new Point(+12, 84),
			angle: 0,
			parent: this,
			quads: [{x: 13, y: 22}]
		});
		this.putPart(engine2);
		
		var engine3 = new Game.Part_engine_2(Controller.layerShips,
		{
			localPosition: new Point(+28, 60),
			angle: 0,
			parent: this,
			quads: [{x: 15, y: 19}]
		});
		this.putPart(engine3);
	},
	
	explode: function()
	{
		new Game.explosion(Controller.layerShips, 
		{
			explosion: "ship_explosion",
			size: 128,
			delay: 30,
			position: this.shape.center.clone()
		});
		
		var offset1 = 70;
		var movePoint1 = new Point(offset1 * Math.sin(this.angle), -offset1 * Math.cos(this.angle));
		
		new Game.explosion(Controller.layerShips, 
		{
			explosion: "ship_explosion",
			size: 128,
			delay: 50,
			position: new Point(this.shape.center.x + movePoint1.x, this.shape.center.y + movePoint1.y)
		});

		var offset2 = -70;
		var movePoint2 = new Point(offset2 * Math.sin(this.angle), -offset2 * Math.cos(this.angle));
		
		new Game.explosion(Controller.layerShips, 
		{
			explosion: "ship_explosion",
			size: 128,
			delay: 70,
			position: new Point(this.shape.center.x + movePoint2.x, this.shape.center.y + movePoint2.y)
		});
	},
	
	onUpdate: function method(time)
	{
		method.previous.call(this, time);
	}
});