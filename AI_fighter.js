atom.declare("Game.AI_fighter", {

	initialize: function()
	{
		this.nearFight = false;
	},

	searchTarget: function()
	{
		var targetList = [];
	
		for (var i=0; i<Controller.ships.length; i++)
		{
			var ship = Controller.ships[i];
			if (ship.team == this.ship.team)
				continue;
			
			targetList.push(ship)
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
		
		return true;
	},
	
	processNearFight: function(time)
	{
		if (!this.nearFight)
		{
			this.nearDeltaAnglePositive = Math.random() >= 0.5;
			this.nearDeltaSpent = 0;
			this.nearFight = true;
		}
		
		if (this.nearDeltaSpent < 200)
		{
			this.nearDeltaSpent += time;
			this.ship.rotate(time, this.nearDeltaAnglePositive);
		}
		
		this.ship.thrust(time);
	},
	
	onUpdate: function(time)
	{
		if (this.ship.killed)
			return;
	
		if (this.target == null)
		{
			this.searchTarget();
			return;
		}
		
		if (!this.validateTarget())
		{
			this.target = null;
			return;
		}
		
		var distance = this.ship.shape.center.distanceTo(this.target.shape.center);
		this.ship.redraw();
		
		if (!this.nearFight && distance < 200)
		{
			this.processNearFight(time);
			return;
		}	
		if (this.nearFight && distance < 300)
		{
			this.processNearFight(time);
			return;
		}
		
		var aimingCoef = Controller.Aim.calculate(this.ship.shape.center, this.ship.angle, this.target);
		this.nearFight = false;
		
		if (aimingCoef != 0)
		{
			this.ship.rotate(time, aimingCoef == -1);
		}
		this.ship.thrust(time);
	}
});