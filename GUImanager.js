atom.declare("Game.GUImanager", 
{
	initialize: function() {},
	
	PatchController: function()
	{
		Controller.currentShieldStatus = "none";
		Controller.currentEngineOnStatus = "none";
		Controller.currentEngineOnlineStatus = "none";
		
		Controller.updateShieldStatus = this.updateShieldStatus;
		Controller.updateEngineOnStatus = this.updateEngineOnStatus;
		Controller.updateEngineOnlineStatus = this.updateEngineOnlineStatus;
		
		Controller.updateShieldStatus("");
		Controller.updateEngineOnStatus("");
		Controller.updateEngineOnlineStatus("");
	},
	
	updateShieldStatus: function(status)
	{
		if (Controller.currentShieldStatus == status)
			return;
		
		Controller.currentShieldStatus = status;
	
		var online = document.getElementById("shield_online");
		var offline = document.getElementById("shield_offline");
		var charging = document.getElementById("shield_charging");
		
		online.style.display = "none";
		offline.style.display = "none";
		charging.style.display = "none";
		
		switch(status)
		{
			case "online": online.style.display = "block"; break;
			case "offline": 
				offline.style.display = "block"; 
				Controller.sound.play("shield_offline", null);
				break;
			case "charging": charging.style.display = "block"; break;
		}
	},
	
	updateEngineOnStatus: function(status)
	{
		if (Controller.currentEngineOnStatus == status)
			return;
		
		Controller.currentEngineOnStatus = status;
		
		var on = document.getElementById("engine_on");
		var off = document.getElementById("engine_off");
		
		on.style.display = "none";
		off.style.display = "none";
		
		if (GameSettings.touchMode)
			return;
		
		switch(status)
		{
			case "on": on.style.display = "block"; break;
			case "off": off.style.display = "block"; break;
		}
	},
	
	updateEngineOnlineStatus: function(status)
	{
		if (Controller.currentEngineOnlineStatus == status)
			return;
		
		Controller.currentEngineOnlineStatus = status;
		
		var online = document.getElementById("engine_online");
		var offline = document.getElementById("engine_offline");
		
		online.style.display = "none";
		offline.style.display = "none";
		
		if (GameSettings.touchMode)
			return;
		
		switch(status)
		{
			case "online": online.style.display = "block"; break;
			case "offline": 
				Controller.sound.play("engine_offline", null);
				offline.style.display = "block"; 
				break;
		}
	}
});