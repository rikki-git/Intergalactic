atom.declare("Game.PlayerController",
{
	initialize: function()
	{
		this.isPlayer = true;
		this.ghostSpeed = 0.3;
		this.position = new Point(0, 0);
		this.thrustOn = false;
		
		var keyboard = Controller.keyboard;
		keyboard.events.add( 'aup', function () 
		{
			if (Controller.PlayerController.ship == null)
				return;
		
			Controller.PlayerController.thrustOn = !Controller.PlayerController.thrustOn;
			
			if (Controller.PlayerController.thrustOn) Controller.updateEngineOnStatus("on");
			else Controller.updateEngineOnStatus("off");
		});
	},
	
	controllShip: function(time)
	{
		this.position = this.ship.shape.center;
	
		if (Controller.cruiseControll_left && Controller.cruiseControll_right)
		{
			this.ship.thrust(time);
			return;
		}
	
		if (Controller.cruiseControll_left)
		{
			this.ship.thrust(time);
			this.ship.rotate(time, false);
			return;
		}
		
		if (Controller.cruiseControll_right)
		{
			this.ship.thrust(time);
			this.ship.rotate(time, true);
			return;
		}
	
		var keyboard = Controller.keyboard;
		if (keyboard.key("aleft")) this.ship.rotate(time, true);
		if (keyboard.key("aright")) this.ship.rotate(time, false);
		
		if (this.thrustOn)
			this.ship.thrust(time);
	},
	
	controllGhost: function(time)
	{
		var keyboard = Controller.keyboard;
		var dx = 0;
		var dy = 0;
		
		var speed = this.ghostSpeed * time;
		
		if (keyboard.key("aup")) dy -= speed;
		if (keyboard.key("adown")) dy += speed;
		if (keyboard.key("aleft")) dx -= speed;
		if (keyboard.key("aright")) dx += speed;
		
		var movePoint = new Point(dx, dy);
		Controller.addLayersTranslate(movePoint);
		this.position = new Point(this.position.x + dx, this.position.y + dy);
	},
	
	onUpdate: function(time)
	{
		if (this.ship != null)
			this.controllShip(time);
		else
			this.controllGhost(time);
	}
});