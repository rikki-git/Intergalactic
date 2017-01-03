atom.declare("Game.Aim", {
	calculate: function(position, angle, target)
	{
		var testDist = 1;
		var testAngleRight = angle + 0.5;
		var testAngleLeft = angle - 0.5;
		
		var bulletMoveToRight = new Point(position.x + testDist * Math.sin(testAngleRight), position.y - testDist * Math.cos(testAngleRight));
		var bulletMoveToLeft = new Point(position.x + testDist * Math.sin(testAngleLeft), position.y - testDist * Math.cos(testAngleLeft));
		
		var distBulletRight = bulletMoveToRight.distanceTo(target.shape.center);
		var distBulletLeft = bulletMoveToLeft.distanceTo(target.shape.center);
		
		if (Math.abs(distBulletRight - distBulletLeft) < 0.1)
			return 0;
		
		var c = 1;
		
		if( distBulletRight > distBulletLeft)
			c = -1;
		
		return c;
	},
	
	targetInFront: function(position, angle, target, sourceDist)
	{
		var testDist = 1;
		var bulletMovePoint = new Point(position.x + testDist * Math.sin(angle), position.y - testDist * Math.cos(angle));
		var bulletMove = bulletMovePoint.distanceTo(target.shape.center);
		return sourceDist > bulletMove;
	}
});