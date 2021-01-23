let modInfo = {
	name: "The 5 hours Tree",
	id: "@everyone1",
	author: "@everyone",
	pointsName: "seconds",
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	
	offlineLimit: 5,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
  if (hasUpgrade("m",11)){
    gain=gain.plus(1)
  }
  if (hasUpgrade("m",12)){
    gain=gain.times(player.points.max(10).log10())
  }
  if (hasUpgrade("m",13)){
    gain=gain.times(new Decimal(player.timePlayed).max(10).log10())
  }
  if (hasUpgrade("m",13)){
    gain=gain.times(new Decimal(player.timePlayed).max(10).log10().plus(9).log10()).times(player.m.points.pow(0.2).max(1))
  }
  if (player.points.gte(60))gain=gain.div(player.points.div(60).pow(hasChallenge("m",12)?0:1))
  if (player.points.gte(3600))gain=gain.div(player.points.div(3600).pow(2))
  if (player.points.gte(17000))gain=gain.div(new Decimal(1000).div(new Decimal(18000).sub(player.points)))
  if (inChallenge("m",11)||inChallenge("m",12)||inChallenge("m",21)){
    return new Decimal(0)
  }
	return gain.min(5*3600)
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(1) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}