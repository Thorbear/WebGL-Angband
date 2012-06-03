/**
 * MAngband uses a table of hardcoded values for the exp needed to gain a level
 * the modifiers increase this value (ie. value is 200, modifier is 40%, exp to adv will be 280)
 * TODO: change this to direct calculations
 * 
 * Not sure if this class needs to know its own position on the map
 *
 * TODO: add inventory and equipment
 */
var Character = (function() {
	Character.prototype.statNames = ['Strength', 'Intelligence', 'Wisdom', 'Dexterity', 'Constitution', 'Charisma'];
	Character.prototype.statShortNames = ['STR', 'INT', 'WIS', 'DEX', 'CON', 'CHR'];
	Character.prototype.name = '';
	Character.prototype.experience = 0;
	Character.prototype.gold = 0;
	Character.prototype.race = {};
	Character.prototype.class = {};
	Character.prototype.stats = [{},{},{},{},{},{}];
	Character.prototype.position = [0,0];

	function Character(name, characterRace, characterClass, statPriority) {
		this.name = name;
		this.race = characterRace;
		this.class = characterClass;
		
		/* Generate birth stats based on priority and race/class */
		this.birth(statPriority);
	};

	Character.prototype.birth = function(statPriority) {
		/* Generate unordered list of stat values */
		var generatedStats = [];
		var statGenerator = new CharacterStat();
		generatedStats.push(statGenerator.roll(17));
		generatedStats.push(statGenerator.roll(16));
		generatedStats.push(statGenerator.roll(15));
		for(var i = 0; i < 3; i++) {
			generatedStats.push(statGenerator.roll(5));
		};
		/* Sort the list and apply names and race/class modifiers */
		for (var i = 0; i < this.stats.length; i++) {
			this.stats[i] = new CharacterStat(this.statNames[i], this.statShortNames[i], generatedStats[statPriority[i]-1]);
			this.stats[i].add(this.race.getStatModifier(i));
			this.stats[i].add(this.class.getStatModifier(i));
		};
	};

	return Character;
})();

var CharacterStat = (function() {
	CharacterStat.prototype.name = '';
	CharacterStat.prototype.shortName = '';
	CharacterStat.prototype.maxValue = 0;
	CharacterStat.prototype.currentValue = 0;

	function CharacterStat(name, shortName, value) {
		this.name = name;
		this.shortName = shortName;
		this.maxValue = value;
		this.currentValue = this.maxValue;
	};

	CharacterStat.prototype.add = function(value) {
		this.maxValue += value;
		this.currentValue = this.maxValue;
	};

	/**
	 * Static method, does not change any values on any object
	 */
	CharacterStat.prototype.roll = function(minValue) {
		/* formula = 5 + 1d3 + 1d4 + 1d5 */
		var value = 0;
		while(value < minValue) {
			value = 5 + Math.floor((Math.random()*3)+1) + Math.floor((Math.random()*4)+1) + Math.floor((Math.random()*5)+1);
		}
		return value;
	};

	return CharacterStat;
})();

/**
 * CharacterRace and CharacterClass are suprisingly similar, might want to merge these somehow later.
 * The reason for separating them would be to prevent a Human Human, or Ranger Ranger combination
 * (a charater can only have 1 race and 1 class, and cannot have a race as a class or vice versa)
 */
var CharacterRace = (function() {
	CharacterRace.prototype.name = '';
	CharacterRace.prototype.stats = [0,0,0,0,0,0,0];
	CharacterRace.prototype.hitpointModifier = 0;
	CharacterRace.prototype.experienceModifier = 0;

	function CharacterRace(name, stats, hitpointModifier, experienceModifier) {
		this.name = name;
		this.stats = stats;
		this.hitpointModifier = hitpointModifier;
		this.experienceModifier = experienceModifier;
	};

	CharacterRace.prototype.getStatModifier = function(index) {
		return this.stats[index];
	};

	return CharacterRace;
})();

var CharacterClass = (function() {
	CharacterClass.prototype.name = '';
	CharacterClass.prototype.stats = [0,0,0,0,0,0];
	CharacterClass.prototype.hitpointModifier = 0;
	CharacterClass.prototype.experienceModifier = 0;

	function CharacterClass(name, stats, hitpointModifier, experienceModifier) {
		this.name = name;
		this.stats = stats;
		this.hitpointModifier = hitpointModifier;
		this.experienceModifier = experienceModifier;
	};

	CharacterClass.prototype.getStatModifier = function(index) {
		return this.stats[index];
	};

	return CharacterClass;
})();