atom.declare("Game.AI_fighter_bat", {

	initialize: function()
	{
		this.rotateValue = 0;
		this.rotateDown = 0;
		this.rotateDownV = 200; // сколько будем не крутиться
		this.rotateCooldown = 1000; // сколько будем крутиться
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
		
		this.ship.redraw();
		
		var aimingCoef = Controller.Aim.calculate(this.ship.shape.center, this.ship.angle, this.target);
		
		if (this.rotateDown > 0)
		{
			this.rotateDown -= time;
		}
		else
		{
			if (aimingCoef != 0)
			{
				this.rotateValue += time;
				if (this.rotateValue > this.rotateCooldown)
				{
					this.rotateDown = this.rotateDownV;
					this.rotateValue = 0;
				}
				
				this.ship.rotate(time, aimingCoef == -1);
			}
		}
		
		this.ship.thrust(time);
	}
});