/**
 * Ideas:
 * - one array for terrain, one for items and one for creatures. All arrays have mapsize X mapsize
 * - one array for map, map consist of tiles, each tile can hold 1 tarrain, 1 or 0 items, 1 or 0 creatures
 *
 * going for idea #2 first
 * 
 * TODO: need to look into whether these objects really need to be passed their coordinates when drawing
 */

/**
 * A map contains an array of tiles
 */
var AngbandMap = (function() {
	AngbandMap.prototype.tiles = [];

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

	AngbandMap.prototype.draw = function(context, x, y, fontHeight, fontWidth) {
		for (var i = this.tiles.length - 1; i >= 0; i--) {
			for (var j = this.tiles[i].length - 1; j >= 0; j--) {
				this.tiles[i][j].draw(context, x + i*fontWidth, y+j*fontHeight);
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

	AngbandTile.prototype.setTerrain = function(terrain) {
		this.terrain = terrain;
	};

	AngbandTile.prototype.draw = function(context, x, y) {
		if(typeof this.creature != 'undefined') {
			this.creature.draw(context, x, y);
		} else if(typeof this.item != 'undefined') {
			this.item.draw(context, x, y);
		} else {
			this.terrain.draw(context, x, y);
		}
	};

	return AngbandTile;
})();

var AngbandDrawableObject = (function() {
	AngbandDrawableObject.prototype.color = 'white';
	AngbandDrawableObject.prototype.symbol = '#';

	function AngbandDrawableObject() {
	};

	AngbandDrawableObject.prototype.draw = function(context, x, y) {
		context.fillStyle = this.color;
		context.fillText(this.symbol, x, y);
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