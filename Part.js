atom.declare("Game.Part", App.Element, 
{
	configure: function()
	{
		this.localPosition = this.settings.get("localPosition");
		this.parent = this.settings.get("parent");
		this.angle = this.settings.get("angle");
		this.quads = this.settings.get("quads");
		this.killed = false;
	
		this.shape = new Rectangle({
			center: this.localPosition,
			size: SizeZero
		});
	},
	
	doDamage: function(damage)
	{
		if (this.killed)
			return;
	
		this.HP -= damage;
		
		if (this.HP <= 0)
			this.kill();
	},
	
	kill: function()
	{
		this.killed = true;
		this.destroy();
		Controller.sound.play("part_explosion", this.parent.shape.center);
		
		if (this.deadTexture != null)
		{
			this.textureMain = this.deadTexture;
			this.parent.partExplosion(this);
			this.parent.doDamage(0);
		}
		else
			this.parent.killPart(this);
		
		this.parent.redraw();
	},
	
	updateFunc: function(time)
	{
	},
	
	drawFunc: function(ctx)
	{
		if (this.textureMain != null)
		{
			ctx.drawImage({
				image: this.textureMain,
				center: this.localPosition,
				angle: this.angle
			});
		}
	}
});