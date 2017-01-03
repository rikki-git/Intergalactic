atom.declare("Game.Part_turret_1", Game.Part, 
{
	configure: function method()
	{
		this.textureMain = Controller.images.get("part2");
		this.deadTexture = Controller.images.get("part2_broken");
		this.HP = 30;
		this.target = null;
		this.targetSearchTime = 0;
		this.targetSearchTimeValue = 1000;
		this.attackDistance = this.getDefaultOrSettings("attackDistance", 500);
		this.attackHuntDistance = 100;
		this.rotationSpeed =this.getDefaultOrSettings("rotationSpeed", 0.01);
		this.attackCooldownValue = this.getDefaultOrSettings("attackCooldownValue", 600);
		this.attackCooldown = atom.number.random(0, this.attackCooldownValue);
		this.bulletLifeTime = this.getDefaultOrSettings("bulletLifeTime", 1500);
		this.bulletDamage = this.getDefaultOrSettings("bulletDamage", 10);
		this.bulletSize = this.getDefaultOrSettings("bulletSize", 3);
		this.type = "turret";
		
		method.previous.call(this);
	},
	
	getDefaultOrSettings: function(name, defaultValue)
	{
		var settings_value = this.settings.get(name);
		if (settings_value == null) return defaultValue;
		else return settings_value;
	},
	
	searchTarget: function()
	{
		var targetList = [];
	
		for (var i=0; i<Controller.ships.length; i++)
		{
			var ship = Controller.ships[i];
			if (ship.team == this.parent.team)
				continue;
				
			var distance = this.parent.shape.center.distanceTo(ship.shape.center);
			
			if (distance > this.attackDistance)
				continue;
				
			targetList.push(ship);
		}
		
		if (targetList.length == 0)
			return;
		
		var indx = atom.number.random(0, targetList.length - 1);
		this.target = targetList[indx];
	},
	
	validateTarget: function()
	{
		if (this.target.killed != null && this.target.killed == true)
			return false;
			
		var distance = this.parent.shape.center.distanceTo(this.target.shape.center);
		if (distance > this.attackDistance + this.attackHuntDistance) 
			return false;
		
		return true;
	},
	
	// c - коэффициент, если лево = -1, право = 1
	rotate: function(time, c)
	{
		this.angle += c * this.rotationSpeed * time;
		this.parent.redraw();
	},
		
	piupiu: function(position, angle, time)
	{
		this.attackCooldown += time;
		if (this.attackCooldown > this.attackCooldownValue)
		{
			this.attackCooldown = 0;
			
			new Game.Bullet(Controller.layerShips, 
			{
				position: position,
				angle: angle + (Math.random() - 0.5) / 4,
				speed: 0.4,
				lifeTime: this.bulletLifeTime,
				damage: this.bulletDamage,
				team: this.parent.team,
				bulletSize: this.bulletSize
			});
		}
	},
	
	updateFunc: function(time)
	{
		if (this.killed)
			return;
	
		if (this.target == null)
		{
			this.targetSearchTime += time;
			
			if (this.targetSearchTime > this.targetSearchTimeValue)
			{
				this.targetSearchTime = 0;
				this.searchTarget();
			}
			
			return;
		}
		
		if (!this.validateTarget())
		{
			this.target = null;
			this.attackCooldown = 0;
			return;
		}
		
		var position = this.parent.partRealPosition(this);
		var angle = this.parent.partRealAngle(this);
		
		var aimingCoef = Controller.Aim.calculate(position, angle, this.target);
		
		if (aimingCoef == 0)
			this.piupiu(position, angle, time);
		else
			this.rotate(time, aimingCoef);
	}
});