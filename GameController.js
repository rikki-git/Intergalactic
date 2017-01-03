var Controller = null;
var PointZero = new Point(0, 0);
var SizeZero = new Size(0, 0);
var AnimationSheets = {};

atom.declare("Game.Controller",
{
	initialize: function() 
	{
		document.getElementById("setupForm").style.display = "none";
		document.getElementById("loadingImg").style.display = "block";
	
		atom.ImagePreloader.run(
		{
			ship1: "Textures/ship1.png",
			part1: "Textures/part1.png",
			triangle: "Textures/triangle.png",
			point: "Textures/point.png",
			animation1: "Textures/animation1.png",
			ship2: "Textures/ship2.png",
			part2: "Textures/part2.png",
			part2_broken: "Textures/part2_broken.png",
			explosion1: "Textures/explosion1.png",
			bullet: "Textures/bullet.png",
			bulletExplosion: "Textures/bulletExplosion.png",
			engine1: "Textures/engine1.png",
			engine1_broken: "Textures/engine1_broken.png",
			ship_explosion: "Textures/ship_explosion.png",
			ship3: "Textures/ship3.png",
			engine2: "Textures/engine2.png",
			engine2_broken: "Textures/engine2_broken.png",
			ship3_broken: "Textures/ship3_broken.png",
			ship2_broken: "Textures/ship2_broken.png",
			debris1: "Textures/debris/d1.png",
			debris2: "Textures/debris/d2.png",
			debris3: "Textures/debris/d3.png",
			debris4: "Textures/debris/d4.png",
			debris5: "Textures/debris/d5.png",
			debris6: "Textures/debris/d6.png",
			debris7: "Textures/debris/d7.png",
			debris8: "Textures/debris/d8.png",
			ship4: "Textures/ship4.png",
			ship4_broken: "Textures/ship4_broken.png"
		}, this.run, this);
		//}, this.debugDelay, this);
	},
	
	debugDelay: function(images)
	{
		var contr = this;
		setTimeout(function() { contr.run(images) }, 1000);
	},
	
	run: function(images)
	{
		document.getElementById("loadingImg").style.display = "none";
	
		if(GameSettings.touchMode)
		{
			document.getElementById("btn_controll_left").style.display = "block";
			document.getElementById("btn_controll_right").style.display = "block";
		}
	
		Controller = this;
	
		var div_CanvasSize = document.getElementById("div_CanvasSize");
		this.fieldSize = new Size(div_CanvasSize.clientWidth, div_CanvasSize.clientHeight);
		var app = new App({size: this.fieldSize});
		app.resources.set("images", images);
		this.images = images;
		this.Aim = new Game.Aim();
		this.translatedOffset = new Point(0, 0);
		this.cruiseControll_left = false;
		this.cruiseControll_right = false;
		this.playerColor = "#FFD800";
	
		this.mapSize = new Size(8000, 7000);
		this.mapSizeStopShips = new Size(this.mapSize.x - 500, this.mapSize.y - 500);
		this.mapRect = new Rectangle({center: PointZero, size: this.mapSizeStopShips});
		
		var mapAspect = this.mapSize.x / this.mapSize.y;
		var miniMapWidth = this.fieldSize.x / 5;
		this.miniMapSize = new Size(miniMapWidth, miniMapWidth / mapAspect);
		
		this.mouse = new Mouse(app.container.bounds);
		this.mouse.events.add('click', this.mouseClick);
	
		this.teams = new Game.Teams();
	
		this.keyboard = new atom.Keyboard();
		
		this.layerBackground = app.createLayer("background");
		this.layerShips = app.createLayer({name: "ships", invoke: true, intersection: 'all'});
		this.layerMinimap = app.createLayer({name: "minimap", invoke: true});
		this.layerMinimap.ctx.size = new Size(this.miniMapSize.x, this.miniMapSize.y);
		
		var Minimap = new Game.Minimap(this.layerMinimap, {});
		
		this.zIndexMapObjects = 0;
		this.drawBackground(this.layerBackground.ctx);
		
		this.GUImanager = new Game.GUImanager();
		this.GUImanager.PatchController();
		
		this.sound = new Game.SoundPlayer({});
		
		this.ships = [];
		this.zIndexCounter = 1000;
		var spawnPlayer = GameSettings.spawnPlayer; //1 fighter_1, 2 cruiser_tesla, 3 fighter_bat
		
		var fighterCount = GameSettings.fighterCount;
		var cruiserCount = GameSettings.cruiserCount;
		var batCount = GameSettings.batCount;
		this.PlayerController = new Game.PlayerController();
		var spawnArea = this.mapSizeStopShips;
		
		for (var i=0; i<cruiserCount; i++)
		{
			var controller = new Game.AI_fighter();
			if (spawnPlayer == 2 && i==cruiserCount - 1)
				controller = this.PlayerController;
	
			var Ship2 = new Game.Ship_cruiser_tesla(this.layerShips,
			{
				position: new Point(-spawnArea.x/2 * Math.random(), spawnArea.y * (Math.random() - 0.5)),
				angle: 1,
				controller: controller,
				team: "red"
			});
			this.ships.push(Ship2);
			
			var Ship3 = new Game.Ship_cruiser_tesla(this.layerShips,
			{
				position: new Point(+spawnArea.x/2 * Math.random(), spawnArea.y * (Math.random() - 0.5)),
				angle: 1,
				controller: new Game.AI_fighter(),
				team: "blue"
			});
			this.ships.push(Ship3);
		}
				
		for (var i=0; i<fighterCount; i++)
		{
			var controller = new Game.AI_fighter();
			if (spawnPlayer == 1 && i==fighterCount - 1)
				controller = this.PlayerController;
	
			var Ship2 = new Game.Ship_fighter_1(this.layerShips,
			{
				position: new Point(-spawnArea.x/2 * Math.random(), spawnArea.y * (Math.random() - 0.5)),
				angle: 1,
				controller: controller,
				team: "red"
			});
			this.ships.push(Ship2);
			
			var Ship3 = new Game.Ship_fighter_1(this.layerShips,
			{
				position: new Point(+spawnArea.x/2 * Math.random(), spawnArea.y * (Math.random() - 0.5)),
				angle: 1,
				controller: new Game.AI_fighter(),
				team: "blue"
			});
			this.ships.push(Ship3);
		}
		
		for (var i=0; i<batCount; i++)
		{
			var controller = new Game.AI_fighter();
			if (spawnPlayer == 3 && i==batCount - 1)
				controller = this.PlayerController;
	
			var Ship2 = new Game.Ship_fighter_bat(this.layerShips,
			{
				position: new Point(-spawnArea.x/2 * Math.random(), spawnArea.y * (Math.random() - 0.5)),
				angle: 1,
				controller: controller,
				team: "red"
			});
			this.ships.push(Ship2);
			
			var Ship3 = new Game.Ship_fighter_bat(this.layerShips,
			{
				position: new Point(+spawnArea.x/2 * Math.random(), spawnArea.y * (Math.random() - 0.5)),
				angle: 1,
				controller: new Game.AI_fighter_bat(),
				team: "blue"
			});
			this.ships.push(Ship3);
		}
		
		this.translatedOffset = new Point(this.fieldSize.x/2, this.fieldSize.y/2);
		if (this.PlayerController.ship != null)
		{
			var playerCener = this.PlayerController.ship.shape.center;
			this.translatedOffset = new Point(-playerCener.x + this.fieldSize.x/2 , -playerCener.y + this.fieldSize.y/2);
		}
		this.layerShips.dom.canvas.ctx.translate(this.translatedOffset);
		
		this.fpsMeter();
		
		document.getElementById("btn_controll_left").onclick = function()
		{
			Controller.cruiseControll_left = !Controller.cruiseControll_left;
			Controller.updateCruiseButtons();
		};
		
		document.getElementById("btn_controll_right").onclick = function()
		{
			Controller.cruiseControll_right = !Controller.cruiseControll_right;
			Controller.updateCruiseButtons();
		};
	},
	
	updateCruiseButtons: function()
	{
		var spriteLeft = "url(Textures/btnGreen.png)";
		var spriteRight = "url(Textures/btnGreen.png)";
	
		if (Controller.cruiseControll_left)
			spriteLeft = "url(Textures/btnGreenPress.png)";
		
		if (Controller.cruiseControll_right)
			spriteRight = "url(Textures/btnGreenPress.png)";
	
		document.getElementById("btn_controll_left").style.backgroundImage = spriteLeft;
		document.getElementById("btn_controll_right").style.backgroundImage = spriteRight;
	},
	
	addLayersTranslate: function(point)
	{
		this.translatedOffset = new Point(this.translatedOffset.x - point.x, this.translatedOffset.y - point.y);
		this.layerShips.dom.canvas.ctx.translate(point, true);
	},
	
	killShip: function(ship)
	{
		var indx = -1;
		for (var i = 0; i<this.ships.length; i++)
		{
			if (this.ships[i] == ship)
			{
				indx = i;
				break;
			}
		}
		
		if (indx == -1)
		{
			console.warn("Ship not found to splice " + JSON.stringify(ship));
			return;
		}

		this.ships.splice(i, 1);
	},
	
	// Context not saved
	mouseClick: function()
	{
		// debug bullet
		return;
	
		var point = Controller.mouse.point.clone();
		
		point = new Point(point.x - Controller.translatedOffset.x, point.y - Controller.translatedOffset.y);
		
		new Game.Bullet(Controller.layerShips, 
			{
				position: point,
				angle: -2,
				speed: 0.1,
				team: "yellow"
			});
	},
	
	drawBackground: function(ctx)
	{
		ctx.fillAll(
			ctx.createGradient(
			new Circle(this.fieldSize.x/2, this.fieldSize.y/2, this.fieldSize.x / 10),
			new Circle(this.fieldSize.x/2, this.fieldSize.y/2, this.fieldSize.x / 2), {
				'0.0': '#0C0038',
				'0.5': '#080028',
				'1.0': '#050019'
			})
		);
		
		new Game.GradientCircle(Controller.layerShips,
		{
			position: new Point(0, 0),
			radius: 500
		});
	},
	
	fpsMeter: function () 
	{
		var fps = atom.trace(), time = [], last = Date.now();

		atom.frame.add(function () 
		{
			if (time.length > 5) time.shift();

			time.push(Date.now() - last);
			last = Date.now();

			fps.value = Math.ceil(1000 / time.average()) + " FPS";
		});
	}
});