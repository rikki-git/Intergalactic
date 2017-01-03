atom.declare("Game.Minimap", App.Element,
{
	configure: function() 
	{
		this.shape = new Rectangle({
			center: new Point(Controller.miniMapSize.x / 2, Controller.miniMapSize.y / 2),
			size: new Size(Controller.miniMapSize.x - 10, Controller.miniMapSize.y - 10)
		});
		
		this.shapeInner = new Rectangle({
			center: new Point(Controller.miniMapSize.x / 2, Controller.miniMapSize.y / 2),
			size: new Size(Controller.miniMapSize.x - 12, Controller.miniMapSize.y - 12)
		});
		
		this.resizeCoefX = this.shape.size.x / Controller.mapSize.x;
		this.resizeCoefY = this.shape.size.y / Controller.mapSize.y;
		this.sizeX2 = this.shape.size.x / 2;
		this.sizeY2 = this.shape.size.y / 2;
	},
	
	// Обновление всяких разных объектов
	objectsUpdate: function(time)
	{
		Controller.PlayerController.onUpdate(time);
	},
	
	onUpdate: function(time)
	{ 
		this.objectsUpdate(time);
		this.redraw(); 
	},
	
	renderTo: function(ctx)
	{
		ctx.clip(this.shape);
		
		ctx.fill(this.shape, "green");
		ctx.fill(this.shapeInner, "black");
		
		for (var i=0; i<Controller.ships.length; i++)
		{
			var ship = Controller.ships[i];
			
			var shipRelX = ship.shape.center.x * this.resizeCoefX + this.sizeX2;
			var shipRelY = ship.shape.center.y * this.resizeCoefY + this.sizeY2;
			
			if (ship.controller != null && ship.controller.isPlayer == true)
			{
				var shipShape = new LibCanvas.Shapes.Circle(new Point(shipRelX, shipRelY), 3);
				ctx.fill(shipShape, Controller.playerColor);
			}
			else
			{
				var shipShape = null;
				var shipPos = new Point(shipRelX, shipRelY);
				
				if (ship.type == "cruiser")
					shipShape = new Rectangle({center: shipPos, size: new Size(6, 6)});
				else
					shipShape = new LibCanvas.Shapes.Circle(shipPos, 2);
				
				ctx.fill(shipShape, Controller.teams.getColor(ship.team));
			}
		}
		
		if (Controller.PlayerController.ship == null)
		{
			var playerRelX = Controller.PlayerController.position.x * this.resizeCoefX + this.sizeX2;
			var playerRelY = Controller.PlayerController.position.y * this.resizeCoefY + this.sizeY2;
			var translateOffset = new Circle(new Point(playerRelX, playerRelY), 5);
			ctx.fill(translateOffset, "white");
		}
	}
});