atom.declare("Game.Part_engine_1", Game.Part, 
{
	configure: function method()
	{
		this.textureMain = Controller.images.get("engine1");
		this.deadTexture = Controller.images.get("engine1_broken");
		this.HP = 60;
		this.buff_thrust = 1.3;
		this.type = "engine";
		method.previous.call(this);
	}
});