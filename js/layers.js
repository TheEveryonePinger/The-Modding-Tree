addLayer("m", {
    name: "minute", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires(){
      return new Decimal(60).mul(Decimal.pow(0.8,getBuyableAmount(this.layer,11))).mul(Decimal.pow(0.9,getBuyableAmount(this.layer,12)))}, // Can be a function that takes requirement increases into account
    resource: "minutes", // Name of prestige currency
    baseResource: "seconds", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
      if (hasChallenge(this.layer,11))mult=mult.mul(2)
      if (inChallenge(this.layer,12)||inChallenge(this.layer,21))return new Decimal(0)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "m", description: "M: Reset for minute", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
  upgrades: {
    rows: 3,
    cols: 6,
    11: {
        description: "Gain more seconds",
        cost: new Decimal(1),
    },
    12: {
        description: "Gain more seconds based on time",
        cost: new Decimal(2),
    },
    13: {
        description: "Gain more seconds based on time played",
        cost: new Decimal(3),
    },
    14: {
        description: "Gain more seconds based on time played and minutes",
        cost: new Decimal(5),
    },
    21: {
        description: "Unlock a buyable",
        cost: new Decimal(10),
    },
    22: {
        description: "Unlock a buyable again",
        cost: new Decimal(15),
    },
    23: {
        description: "Unlock a buyable again increasing points",
        cost:new Decimal(30),
    },
    24: {
        description: "Unlock a buyable again increasing points based on upgrades",
        cost: new Decimal(50),
    },
    31: {
        description: "Add a challenge",
        cost: new Decimal(51),
    },
    32: {
        description: "Add a challenge that speeds up time",
        cost: new Decimal(52),
    },
    33: {
        description: "Add a challenge that speeds up time and unlocks a layer",
        cost: new Decimal(53),
    },
},
  buyables: {
    rows: 2,
    cols: 2,
    11: {unlocked(){return hasUpgrade(this.layer,21)},
        cost() { return new Decimal(10).tetrate(getBuyableAmount(this.layer,this.id)) },
        display() { return "Reduce the number of seconds in a minute by 20%\nCost: "+format(this.cost()) },
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },

    },
    12: {unlocked(){return hasUpgrade(this.layer,22)},
        cost() { return new Decimal(20).tetrate(getBuyableAmount(this.layer,this.id)) },
        display() { return "Reduce the number of seconds in a minute by 10%\nCost: "+format(this.cost()) },
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },

    },
    21: {unlocked(){return hasUpgrade(this.layer,23)},
        cost() { return new Decimal(100) },
        display() { return "Increase points by 100\nCost: "+format(this.cost()) },
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            player.points=player.points.plus(100)
        },

    },
    22: {unlocked(){return hasUpgrade(this.layer,24)},
        cost() { return new Decimal(getBuyableAmount(this.layer, this.id).add(1)).pow(2) },
        display() { return "Increase points by "+format(new Decimal(player.m.upgrades.length).pow(2))+" (based on upgrades)\nCost: "+format(this.cost()) },
        canAfford() { return player[this.layer].points.gte(this.cost())&&!inChallenge("m",21) },
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
          player.points=player.points.plus(new Decimal(player.m.upgrades.length).pow(2))
        },

    },
},
  challenges: {
    rows: 2,
    cols: 2,
    11: {unlocked(){return hasUpgrade(this.layer,31)},
        name: "Secondless",
        challengeDescription: "Time has stopped!",
        goal: new Decimal(100),
        rewardDescription: "You are gaining twice as many minutes"
    },
    12: {unlocked(){return hasUpgrade(this.layer,32)},
        name: "Secondless 2",
        challengeDescription: "Time has stopped and you can't gain minutes",
        goal: new Decimal(100),
        rewardDescription: "You are gaining twice as many seconds"
    },
    21: {unlocked(){return hasUpgrade(this.layer,33)},
        name: "Secondless 3",
        challengeDescription: "Time has stopped and you can't gain minutes and you can't use the last buyable",
        goal: new Decimal(100),
        rewardDescription: "You are unlocking a new layer at 3600 seconds"
    },

}
})
addLayer("h", {
    name: "hour", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "H", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#BBBBBB",
    requires(){
      return new Decimal(3600)}, // Can be a function that takes requirement increases into account
    resource: "minutes", // Name of prestige currency
    baseResource: "seconds", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "h", description: "H: Reset for hour", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return (player[this.layer].unlocked||player.points.gte(3600))&&hasChallenge("m",21)},
  
})
