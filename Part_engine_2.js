atom.declare("Game.Part_engine_2", Game.Part, 
{
	configure: function method()
	{
		this.textureMain = Controller.images.get("engine2");
		this.deadTexture = Controller.images.get("engine2_broken");
		this.HP = 30;
		this.buff_thrust = 0.2;
		this.type = "engine";
		method.previous.call(this);
	}
});