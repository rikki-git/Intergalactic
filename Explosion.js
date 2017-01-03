atom.declare("Game.explosion", App.Element,
{
	configure: function () 
	{
		var size = this.settings.get("size");
		this.zIndex = Controller.zIndexCounter + 1;
	
		this.shape = new Rectangle({
			center: this.settings.get("position"),
			size: new Size(size, size)
		});
	
		var delay = this.settings.get("delay");
		if (delay == null)
			delay = 30;
	
		var explosion = this.settings.get("explosion");
	
		var animationSheet = null;
		if (AnimationSheets[explosion] == null)
		{
			AnimationSheets[explosion] = new Animation.Sheet({
				frames: new Animation.Frames(Controller.images.get(explosion), size, size),
				delay : delay
			});
		}
	
		var animationSheet = AnimationSheets[explosion];
		
		this.animation = new Animation(
		{
			sheet   : animationSheet,
			onUpdate: this.redraw,
			onStop  : this.destroy
		});
	},

	renderTo: function (ctx) 
	{
		var image = this.animation.get();
	
		if (image)
		{
			ctx.drawImage(
			{
				image: image,
				center: this.shape.center,
				angle: 0
			});
		}
	}
});