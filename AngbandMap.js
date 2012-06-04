/**
 * Ideas:
 * - one array for terrain, one for items and one for creatures. All arrays have mapsize X mapsize
 * - one array for map, map consist of tiles, each tile can hold 1 tarrain, 1 or 0 items, 1 or 0 creatures
 *
 * going for idea #2 first
 * 
 */

/**
 * A map contains an array of tiles
 */
var AngbandMap = (function() {
	AngbandMap.prototype.tiles = [];
	AngbandMap.prototype.entities = [];

	function AngbandMap(width, height) {
		// Initialize map
		for (var i = width - 1; i >= 0; i--) {
			this.tiles[i] = [];
			for (var j = height - 1; j >= 0; j--) {
				this.tiles[i][j] = new AngbandTile();
				if(i > 0 && i < width-1 && j > 0 && j < height -1) {
					this.tiles[i][j].setTerrain(new AngbandFloor());
				};
			};
		};
	};

	AngbandMap.prototype.isWall = function(x, y) {
		return this.tiles[x][y].isWall();
	};

	AngbandMap.prototype.addCreature = function(creature, x, y) {
		if(this.tiles[x][y].hasCreature()) {
			throw new Error("Tile already has a creature");
		} else {
			creature.entityID = this.entities.length;
			creature.position = [x,y];
			this.entities.push(creature);
			this.tiles[x][y].addCreature(creature);
			return creature.entityID; // caller's reference
		};
	};

	/**
	 * moves the creature x tiles horizontally and y tiles vertically
	 */
	AngbandMap.prototype.moveCreature = function(id, x, y) {
		if(id >= this.entities.length || id < 0) {
			throw new Error("No such entity");
		} else {
			var creature = this.entities[id];
			var newX = creature.position[0] + x;
			var newY = creature.position[1] + y;
			if(this.tiles[newX][newY].isWall()) {
				throw new Error("There is a wall in the way!");
			} else {
				this.tiles[creature.position[0]][creature.position[1]].removeCreature();
				creature.position = [newX, newY];
				this.tiles[newX][newY].addCreature(creature);
			};
		};
	};

	AngbandMap.prototype.draw = function(context, fontHeight, fontWidth) {
		for (var i = this.tiles.length - 1; i >= 0; i--) {
			for (var j = this.tiles[i].length - 1; j >= 0; j--) {
				context.save();
				context.translate(i*fontWidth, j*fontHeight);
				this.tiles[i][j].draw(context);
				context.restore();
			};
		};
	};

	return AngbandMap;
})();

/**
 * A tile MUST have 1 terrain object
 * A tile may have 1 or 0 items
 * A tile may have 1 or 0 monsters
 */
var AngbandTile = (function() {
	AngbandTile.prototype.terrain = {};
	AngbandTile.prototype.item;
	AngbandTile.prototype.creature;

	function AngbandTile() {
		this.terrain = new AngbandWall();
	};

	AngbandTile.prototype.isWall = function() {
		return this.terrain instanceof AngbandWall;
	};

	AngbandTile.prototype.hasCreature = function() {
		return (typeof this.creature != 'undefined');
	};

	AngbandTile.prototype.addCreature = function(creature) {
		if(typeof this.creature == 'undefined') {
			this.creature = creature;
			return true;
		} else { // This tile already has a creature
			return false;
		};
	};

	AngbandTile.prototype.removeCreature = function() {
		var creature = this.creature;
		delete this.creature;
		return creature;
	};

	AngbandTile.prototype.setTerrain = function(terrain) {
		this.terrain = terrain;
	};

	AngbandTile.prototype.draw = function(context) {
		if(typeof this.creature != 'undefined') {
			this.creature.draw(context);
		} else if(typeof this.item != 'undefined') {
			this.item.draw(context);
		} else {
			this.terrain.draw(context);
		}
	};

	return AngbandTile;
})();

var AngbandDrawableObject = (function() {
	AngbandDrawableObject.prototype.color = 'white';
	AngbandDrawableObject.prototype.symbol = '#';

	function AngbandDrawableObject() {
	};

	AngbandDrawableObject.prototype.draw = function(context) {
		context.fillStyle = this.color;
		context.fillText(this.symbol, 0, 0);
	};

	return AngbandDrawableObject;
})();

var AngbandWall = (function() {
	AngbandWall.prototype = new AngbandDrawableObject;

	function AngbandWall() {
		this.color = 'white';
		this.symbol = '#';
	};

	return AngbandWall;
})();

var AngbandFloor = (function() {
	AngbandFloor.prototype = new AngbandDrawableObject;

	function AngbandFloor() {
		this.color = 'white';
		this.symbol = '.';
	};

	return AngbandFloor;
})();