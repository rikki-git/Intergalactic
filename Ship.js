atom.declare("Game.Ship", App.Element,
{	
	configure: function()
	{
		var position = this.settings.get("position");
		this.angle = this.settings.get("angle");
		this.team = this.settings.get("team");
		this.quadSize = new Size(8, 8);
		this.quadCoordOffset = new Point(this.quadSize.x * this.quads / 2, this.quadSize.y * this.quads / 2);
		this.thrustCurrent = 0;
		this.killed = false;
		this.HP_initial = this.HP;
		this.regenerateCooldownInitial = this.regenerateCooldown;
		this.zIndex = Controller.zIndexCounter;
		Controller.zIndexCounter++;
		
		var grid = [];
		for (var i = 0; i < this.quads; i++)
		{
			grid[i] = [];
			
			for (var j = 0; j < this.quads; j++)
			{
				grid[i][j] = { i: i, j: j };
			}
		}
		this.grid = grid;
		
		this.parts = [];
		
		var maxSize = Math.max(this.quadSize.x, this.quadSize.y) * this.quads + 10;
		
		this.shape = new Rectangle({
			center: position,
			size: new Size(maxSize, maxSize)
		});
		
		if (this.solidW != null)
		{
			this.paintRect = new Rectangle({
				center: PointZero,
				size: new Size(this.solidW, this.solidH)
			});
			
			this.painRectHP = new Rectangle({
				center: PointZero.clone(),
				size: new Size(this.solidW, this.solidH)
			});
		}
		
		this.controller = this.settings.get("controller");
		if (this.controller != null)
		{
			this.controller.ship = this;
			if (this.controller.isPlayer == true)
			{
				Controller.updateShieldStatus("online");
				Controller.updateEngineOnStatus("off");
				Controller.updateEngineOnlineStatus("online");
			}
		}
	},
	
	putPart: function(part)
	{
		this.parts.push(part);
		
		var quads = part.quads;
		
		for (var i=0; i<quads.length; i++)
		{
			var quad = quads[i];
			this.grid[quad.x][quad.y].part = part;
		}
	},
	
	putCollider: function(collider)
	{
		for(var i=0; i<collider.length; i++)
		{
			for(var j=0; j<collider[i].length; j++)
			{
				if (collider[i][j] == 1)
					this.grid[j][i].ship = this;
			}
		}
	},
	
	collide: function(point)
	{
		var inside = this.shape.hasPoint(point);
		if (!inside)
			return null;
		
		point = point.clone();
		
		point.rotate(-this.angle, this.shape.center);
		local = this.shape.center.diff(point);
		
		local.move(this.quadCoordOffset);
		
		var quad = this.getQuadFromLocal(local);
		if (quad == null)
			return null;
			
		var slot = this.grid[quad.x][quad.y];
		
		return slot;
	},
	
	doDamage: function(damage)
	{
		if (this.killed)
			return;
			
		this.HP -= damage;
		
		if (damage >= 0)
		{
			// Damage
	
			this.regenerateCooldown = this.regenerateCooldownInitial;
			
			if (damage == 0 && this.controller != null && this.controller.isPlayer == true)
			{
				var haveEngine = false;
				for (var i=0; i<this.parts.length; i++)
				{
					if (this.parts[i].killed == false && this.parts[i].type == "engine")
					{
						haveEngine = true;
						break;
					}
				}
				if (!haveEngine) Controller.updateEngineOnlineStatus("offline");
			}
			
			if (this.HP <= 0)
			{
				if (this.controller != null && this.controller.isPlayer == true)
					Controller.updateShieldStatus("offline");	
		
				var haveParts = false;
		
				for (var i=0; i<this.parts.length; i++)
				{
					if (this.parts[i].killed == false)
					{
						haveParts = true;
						break;
					}
				}
	
				this.HP = 0;
				
				if (!haveParts)
				{
					Controller.sound.play("part_explosion", this.shape.center);
					this.kill();
				}
			}
			else
			{
				if (this.controller != null && this.controller.isPlayer == true)
					Controller.updateShieldStatus("online");
			}
		}
		else
		{
			// Heal
			if (this.HP > this.HP_initial)
			{
				this.HP = this.HP_initial;
				
				if (this.controller != null && this.controller.isPlayer == true)
					Controller.updateShieldStatus("online");
			}
			else
			{
				if (this.controller != null && this.controller.isPlayer == true)
					Controller.updateShieldStatus("charging");
			}
		}
		
		if (this.solidW != null)
		{
			var HP_Size_h = this.HP / this.HP_initial * this.solidH;
			this.painRectHP.size = new Size(this.solidW, HP_Size_h);
			this.redraw();
		}
	},
	
	explode: function()
	{
		new Game.explosion(Controller.layerShips, 
		{
			explosion: "ship_explosion",
			size: 128,
			delay: 30,
			position: this.shape.center.clone()
		});
	},
	
	kill: function()
	{
		this.explode();
	
		if (this.textureBroken != null)
		{
			var debris = new Game.MapObject(Controller.layerShips,
			{
				position: this.shape.center.clone(),
				textureMain: this.textureBroken,
				angle: this.angle
			});
		}
	
		if (this.debris != null)
		{
			for (var i=0; i<this.debris; i++)
			{
				var debris = new Game.MapObject(Controller.layerShips,
				{
					position: this.shape.center.clone(),
					debris: this.debrisRadius
				});
			}
		}
	
		this.destroy();
		this.killed = true;
		Controller.killShip(this);
		
		if (this.controller != null && this.controller.isPlayer == true)
		{
			this.controller.ship = null;
			Controller.updateShieldStatus("");
			Controller.updateEngineOnStatus("");
			Controller.updateEngineOnlineStatus("");
		}
	},
	
	killPart: function(part)
	{
		var indx = -1;
		for (var i=0; i<this.parts.length; i++)
		{
			if (this.parts[i] == part)
			{
				indx = i;
				
				var quads = part.quads;
		
				for (var i=0; i<quads.length; i++)
				{
					var quad = quads[i];
					delete this.grid[quad.x][quad.y].part;
				}
				
				break;
			}
		}
		
		if (indx == -1)
		{
			console.warn("Part not found " + JSON.stringify(part));
			return;
		}
		
		this.partExplosion(part);
		this.parts.splice(indx, 1);
		this.doDamage(0);
		this.redraw();
	},
	
	// Не локальная позиция части
	partRealPosition: function(part)
	{
		var pos = new Point(this.shape.center.x + part.shape.center.x, this.shape.center.y + part.shape.center.y);
		pos.rotate(this.angle, this.shape.center);
		return pos;
	},
	
	// Не локальный угол части
	partRealAngle: function(part)
	{
		return this.angle + part.angle;
	},
	
	partExplosion: function(part)
	{
		new Game.explosion(Controller.layerShips, 
		{
			explosion: "explosion1",
			size: 64,
			position: this.partRealPosition(part)
		});
	},
	
	getQuadFromLocal: function(point)
	{
		var qx = Math.floor(point.x / this.quadSize.x);
		var qy = Math.floor(point.y / this.quadSize.y);
		
		if (qx < 0 || qx >= this.quads || qy < 0 || qy >= this.quads)
			return null;
		
		return new Point(qx, qy);
	},
	
	//------- SHIP CONTROL INTERFACE --------------
	thrust: function(time)
	{
		var thrust = this.baseThrust * time;
		this.thrustCurrent += thrust;
		
		var fullThrust = this.maxThrust;
		for(var i=0; i<this.parts.length; i++)
		{
			if (this.parts[i].killed == false && this.parts[i].buff_thrust != null)
				fullThrust += this.parts[i].buff_thrust;
		}
		
		if (this.thrustCurrent > fullThrust)
			this.thrustCurrent = fullThrust;
	},
	
	rotate: function(time, left)
	{
		if (left)
			this.angle -= this.rotateSpeed * time;
		else
			this.angle += this.rotateSpeed * time;
		this.redraw();
	},
	//---------------------------------------------
	
	updatePosition: function(time)
	{
		this.thrustCurrent -= this.slowdown * time;
		if (this.thrustCurrent < 0)
		{
			this.thrustCurrent = 0;
			return;
		}
		
		var movePoint = null;
		
		if (!Controller.mapRect.hasPoint(this.shape.center))
		{
			var pushX = 0;
			var pushY = 0;
			
			var pushSpeed = 0.01 * time;
			
			if (this.shape.center.x > 0) pushX = -pushSpeed; else pushX = pushSpeed;
			if (this.shape.center.y > 0) pushY = -pushSpeed; else pushY = pushSpeed;
			
			movePoint = new Point(pushX, pushY);
		}
		else
			movePoint = new Point(this.thrustCurrent * Math.sin(this.angle), -this.thrustCurrent * Math.cos(this.angle));
		
		if (this.controller != null && this.controller.isPlayer == true)
		{
			Controller.addLayersTranslate(movePoint);
		}
		
		this.shape.move(movePoint);
	},
	
	onUpdate: function(time)
	{
		this.regenerateCooldown -= time;
		if (this.HP < this.HP_initial && this.regenerateCooldown <= 0)
		{
			this.regenerateCooldown = 0;
			this.doDamage(-this.regenerateHP * time);
		}
	
		if (this.controller != null && this.controller.isPlayer == null)
			this.controller.onUpdate(time);
			
		this.updatePosition(time);
		
		for (var i=0; i<this.parts.length; i++)
		{
			this.parts[i].updateFunc(time);
		}
		
		this.redraw();
	},
	
	renderTo: function(ctx)
	{	
		ctx.save();
		
		ctx.translate(this.shape.center.x, this.shape.center.y);
		ctx.rotate(this.angle);
		
		if (this.paintRect != null && this.team != null)
		{
			ctx.fill(this.paintRect, Controller.teams.getColorDark(this.team));
			ctx.fill(this.painRectHP, Controller.teams.getColor(this.team))
		}
		
		if (this.textureMain != null)
		{
			ctx.drawImage({
				image: this.textureMain,
				center: PointZero
			});
		}
		
		for(var i=0; i<this.parts.length; i++)
		{
			var part = this.parts[i];
			part.drawFunc(ctx);
		}
		
		ctx.restore();
	}
});