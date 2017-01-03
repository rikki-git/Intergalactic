atom.declare("Game.SoundPlayer",
{
	initialize: function() 
	{
		this.sounds = {};
		this.createSound("shoot1", "Sounds/shoot1.mp3", 5);
		this.createSound("shoot2", "Sounds/shoot2.mp3", 5);
		this.createSound("shoot_part", "Sounds/shoot_part.mp3", 5);
		this.createSound("part_explosion1", "Sounds/part_explosion1.mp3", 5);
		this.createSound("part_explosion2", "Sounds/part_explosion2.mp3", 5);
		this.createSound("shield_offline", "Sounds/shield_offline.mp3", 1);
		this.createSound("engine_offline", "Sounds/engine_offline.mp3", 1);
		this.createSound("playerShoot", "Sounds/playerShoot.mp3", 5);
	},
	
	randomSound: function(name)
	{
		switch (name)
		{
			case "shoot": return atom.number.random(1, 2).toString(); break;
			case "part_explosion": return atom.number.random(1, 2).toString(); break;
		}
		
		return "";
	},
	
	play: function(name, source)
	{
		if (source != null)
			if (source.distanceTo(Controller.PlayerController.position) > 500)
				return;

		name = name + Controller.sound.randomSound(name);
	
		var sound = Controller.sound.sounds[name];
		if (sound == null)
		{
			console.warn("Sound not founded: " + name);
			return;
		}

		sound.raw[sound.currentIndex].play();
		sound.currentIndex++;
		if (sound.currentIndex >= sound.raw.length)
			sound.currentIndex = 0;
	},
	
	createSound: function(name, src, count)
	{
		var soundArray = [];
	
		for (var i=0; i<count; i++)
		{
			var sound = document.createElement("audio");
			sound.src = src;
			sound.setAttribute("preload", "auto");
			sound.setAttribute("controls", "none");
			sound.style.display = "none";
			document.body.appendChild(sound);
			soundArray.push(sound);
		}
		
		this.sounds[name] = 
		{
			raw: soundArray,
			currentIndex: 0
		}
	}
});