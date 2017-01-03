LibCanvas.extract();
atom.patching(window);

var GameSettings;

atom.dom(function ()
{
	GameSettings = 
	{
		spawnPlayer: 1,
		fighterCount: 4,
		cruiserCount: 3,
		batCount: 5,
		touchMode: false
	};
	
	if (localStorage["GameSettings"] != null)
	{
		try
		{
			var settings = JSON.parse(localStorage["GameSettings"]);
			if(settings == null)
				throw new Error("Saved data = null");
			
			GameSettings = settings;
		}
		catch (error)
		{
			console.error(error);
		}
	}
	
	document.getElementById("pt_1").checked = GameSettings.spawnPlayer == 1;
	document.getElementById("pt_2").checked = GameSettings.spawnPlayer == 2;
	document.getElementById("pt_3").checked = GameSettings.spawnPlayer == 3;
	
	document.getElementById("shipCount_fighter").value = GameSettings.batCount;
	document.getElementById("shipCount_corvette").value = GameSettings.fighterCount;
	document.getElementById("shipCount_cruiser").value = GameSettings.cruiserCount;
	
	document.getElementById("touchMode").checked = GameSettings.touchMode;
	
	var playBtn = document.getElementById("playButton");
	playBtn.addEventListener("click", PlayBtnClick, false);
});
	
function PlayBtnClick()
{
	if (document.getElementById("pt_1").checked) GameSettings.spawnPlayer = 1;
	else if (document.getElementById("pt_2").checked) GameSettings.spawnPlayer = 2;
	else GameSettings.spawnPlayer = 3;
	
	GameSettings.batCount = parseInt(document.getElementById("shipCount_fighter").value);
	GameSettings.fighterCount = parseInt(document.getElementById("shipCount_corvette").value);
	GameSettings.cruiserCount = parseInt(document.getElementById("shipCount_cruiser").value);
	
	if (isNaN(GameSettings.batCount) || GameSettings.batCount < 0) GameSettings.batCount = 0;
	if (isNaN(GameSettings.fighterCount) || GameSettings.fighterCount < 0) GameSettings.fighterCount = 0;
	if (isNaN(GameSettings.cruiserCount) || GameSettings.cruiserCount < 0) GameSettings.cruiserCount = 0;
	
	GameSettings.touchMode = document.getElementById("touchMode").checked;
	
	localStorage["GameSettings"] = JSON.stringify(GameSettings);
	new Game.Controller('canvas');
}