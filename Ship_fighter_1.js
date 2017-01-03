atom.declare("Game.Ship_fighter_1", Game.Ship,
{	
	configure: function method()
	{
		this.quads = 8;
	
		this.solidW = 10;
		this.solidH = 50;
		this.baseThrust = 0.03;
		this.slowdown = 0.005;
		this.maxThrust = 1;
		this.rotateSpeed = 0.002;
		this.HP = 250;
		this.regenerateHP = 0.01;
		this.regenerateCooldown = 10000;
		this.debris = 3;
		this.debrisRadius = 10;
		this.type = "fighter";
	
		this.textureMain = Controller.images.get("ship2");
		this.textureBroken = Controller.images.get("ship2_broken");
	
		method.previous.call(this);
		
		this.configureParts();
		
		this.redraw();
	},
	
	configureParts: function()
	{
		collider = 
		[
			[0, 0, 0, 1, 1, 0, 0, 0],
			[0, 0, 1, 1, 1, 1, 0, 0],
			[0, 0, 1, 1, 1, 1, 0, 0],
			[0, 0, 1, 1, 1, 1, 0, 0],
			[0, 0, 1, 1, 1, 1, 0, 0],
			[0, 0, 1, 1, 1, 1, 0, 0],
			[0, 0, 1, 1, 1, 1, 0, 0],
			[0, 0, 0, 1, 1, 0, 0, 0]
		];
		this.putCollider(collider);
	
		var turret1 = new Game.Part_turret_1(Controller.layerShips,
		{
			localPosition: new Point(-12, 4),
			angle: 0,
			parent: this,
			quads: [{x: 2, y: 4}]
		});
		this.putPart(turret1);
		
		var turret2 = new Game.Part_turret_1(Controller.layerShips,
		{
			localPosition: new Point(12, 4),
			angle: 0,
			parent: this,
			quads: [{x: 5, y: 4}]
		});
		this.putPart(turret2);
		
		var engine1 = new Game.Part_engine_1(Controller.layerShips,
		{
			localPosition: new Point(0, 28),
			angle: 0,
			parent: this,
			quads: [{x: 3, y: 7}, {x: 4, y: 7}]
		});
		this.putPart(engine1);
	},
	
	onUpdate: function method(time)
	{
		method.previous.call(this, time);
	}
});