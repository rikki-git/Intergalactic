LibCanvas.extract();
atom.patching(window);

atom.dom(function ()
{		
	new Game.Controller('canvas');
});