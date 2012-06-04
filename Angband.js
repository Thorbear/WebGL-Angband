/**
 * Automatically starts a new line when end of area is reached
 * if width is omitted, the remaining width of the current context canvas from the x-offset will be used
 * returns the amount of lines written
 * TODO: make function not split words unless absolutely nescessary
 */
CanvasRenderingContext2D.prototype.fillMultilineText = function(text, x, y, lineHeight, width) {
    if(typeof width == "undefined") {
        width = this.canvas.width - x;
    };

    // Find out how wide we can go
    var measure = 'M';
    while(this.measureText(measure).width < width-this.measureText('M').width) {
        measure += 'M';
    };

    // Draw text
    for (var i = 0; i < Math.ceil(text.length / measure.length); i++) {
        this.fillText(text.substring(i*measure.length, (i+1)*measure.length), x, y + i*lineHeight);
    };

    // Return amount of lines written
    return Math.ceil(text.length / measure.length);
};

var AngbandBirthMenu = (function() {
    AngbandBirthMenu.prototype.context = {};
    AngbandBirthMenu.prototype.keyEventHandler = {};
    AngbandBirthMenu.prototype.done = false;
    AngbandBirthMenu.prototype.doneCallback = '';
    AngbandBirthMenu.prototype.fontSize = 16;
    AngbandBirthMenu.prototype.padding = 20;
    AngbandBirthMenu.prototype.genders = [];
    AngbandBirthMenu.prototype.races = [];
    AngbandBirthMenu.prototype.classes = [];
    AngbandBirthMenu.prototype.stats = [];
    AngbandBirthMenu.prototype.choices = [0, 0, 0, 0];
    AngbandBirthMenu.prototype.numberOfChoices = [0, 0, 0, 0];
    AngbandBirthMenu.prototype.statChoices = [0,0,0,0,0,0];
    AngbandBirthMenu.prototype.statChoiceNumber = 0;
    AngbandBirthMenu.prototype.name = '';
    AngbandBirthMenu.prototype.currentMenu = 0;
    AngbandBirthMenu.prototype.MENU_SEX = 0;
    AngbandBirthMenu.prototype.MENU_RACE = 1;
    AngbandBirthMenu.prototype.MENU_CLASS = 2;
    AngbandBirthMenu.prototype.MENU_STATS = 3;
    AngbandBirthMenu.prototype.MENU_NAME = 4;

    function AngbandBirthMenu(context, keyEventHandler, genders, races, classes, stats) {
        this.context = context;
        this.keyEventHandler = keyEventHandler;
        this.genders = genders;
        this.numberOfChoices[0] = genders.length;
        this.races = races;
        this.numberOfChoices[1] = races.length;
        this.classes = classes;
        this.numberOfChoices[2] = classes.length;
        this.stats = stats;
        this.numberOfChoices[3] = stats.length;
    };

    /**
     * Callback will be passed 1 argument, a Character-object
     * TODO: find a way to step backwards out of this menu
     */
    AngbandBirthMenu.prototype.show = function(callback) {
        this.doneCallback = callback;

        this.tick();
    };

    AngbandBirthMenu.prototype.tick = function() {
        if(!this.done) {
            var obj = this;
            requestAnimFrame(function(){obj.tick()});
        } else {
            this.doneCallback(new Character(this.name, this.races[this.choices[1]], this.classes[this.choices[2]], this.statChoices));
        };

        this.resize();
        this.render();
        this.animate();
    };

    AngbandBirthMenu.prototype.resize = function() {
        this.context.canvas.height = window.innerHeight;
        this.context.canvas.width = window.innerWidth;
    };

    AngbandBirthMenu.prototype.render = function() {
        var menuTitle = 'Please select your character from the menu below:';
        var menuExplanation = "Use the movement keys to scroll the menu, Enter to select the current menu item.";
        var helpTexts = ["Your 'sex' does not have any significant gameplay effects.",
            "Your 'race' determines various intrinsic factors and bonuses.",
            "Your 'class' determines various intrinsic factors and bonuses.",
            "You may prioritize your stats for the character roll.",
            "Enter your character's name: "];
        var currentHelpText = 0;
        var currentLine = 0;

        // Save current context-state
        this.context.save();

        // Set black background
        this.context.fillStyle = 'rgb(0,0,0)';
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

        // Text-settings
        this.context.fillStyle = 'white';
        this.context.lineWidth = 2.5;
        this.context.font = 'bold ' + this.fontSize + 'px Courier';
        this.context.textAlign = 'left';
        this.context.textBaseline = 'top';
    
        // Print menu title
        currentLine += this.context.fillMultilineText(menuTitle, this.padding, this.padding + currentLine*this.fontSize, this.fontSize);
        currentLine++; // Empty line
        // Print menu explanation
        currentLine += this.context.fillMultilineText(menuExplanation, this.padding, this.padding + currentLine*this.fontSize, this.fontSize);
        currentLine++; // Empty line

        switch(this.currentMenu) {
            case this.MENU_NAME:
                currentHelpText++;
            case this.MENU_STATS:
                currentHelpText++;
            case this.MENU_CLASS:
                currentHelpText++;
            case this.MENU_RACE:
                currentHelpText++;
        };

        this.context.fillStyle = 'yellow';
        currentLine += this.context.fillMultilineText(helpTexts[currentHelpText], this.padding, this.padding + currentLine*this.fontSize, this.fontSize);
        currentLine++;


        switch(this.currentMenu) {
            case this.MENU_NAME:
                this.renderNameMenu(currentLine, helpTexts[currentHelpText]);

            case this.MENU_STATS:
                this.renderStatMenu(currentLine, 400);

            case this.MENU_CLASS:
                this.renderClassMenu(currentLine, 250);

            case this.MENU_RACE:
                this.renderRaceMenu(currentLine, 100);

            case this.MENU_SEX:
                this.renderSexMenu(currentLine);
                break;
        };

        // Restore previous context-state
        this.context.restore();
    };

    AngbandBirthMenu.prototype.renderSexMenu = function(currentLine) {
        for (var i = 0; i < this.genders.length; i++) {
            this.context.fillStyle = (this.choices[0] == i) ? 'cyan' : 'white';
            currentLine += this.context.fillMultilineText(this.genders[i], this.padding, this.padding + currentLine*this.fontSize, this.fontSize);
        };
    };

    AngbandBirthMenu.prototype.renderRaceMenu = function(currentLine, xOffset) {
        for (var i = 0; i < this.races.length; i++) {
            this.context.fillStyle = (this.choices[1] == i) ? 'cyan' : 'white';
            currentLine += this.context.fillMultilineText(this.races[i].name, this.padding+xOffset, this.padding + currentLine*this.fontSize, this.fontSize);
        };
    };

    AngbandBirthMenu.prototype.renderClassMenu = function(currentLine, xOffset) {
        for (var i = 0; i < this.classes.length; i++) {
            this.context.fillStyle = (this.choices[2] == i) ? 'cyan' : 'white';
            currentLine += this.context.fillMultilineText(this.classes[i].name, this.padding+xOffset, this.padding + currentLine*this.fontSize, this.fontSize);
        };
    };

    AngbandBirthMenu.prototype.renderStatMenu = function(currentLine, xOffset) {
        for (var i = 0; i < this.stats.length; i++) {
            this.context.fillStyle = 'white';
            if(this.choices[3] == i) {
                this.context.fillStyle = 'cyan';
            } else if(this.statChoices[i] > 0) {
                this.context.fillStyle = 'green';
            };
            
            currentLine += this.context.fillMultilineText(this.stats[i], this.padding+xOffset, this.padding + currentLine*this.fontSize, this.fontSize);
        };
    };

    AngbandBirthMenu.prototype.renderNameMenu = function(currentLine, menuText) {
        var menuTextWidth = this.context.measureText(menuText).width;
        this.context.fillStyle = 'white';
        this.context.fillMultilineText(this.name, this.padding+menuTextWidth, this.padding+(currentLine-2)*this.fontSize, this.fontSize);
    };

    AngbandBirthMenu.prototype.animate = function() {
        // Handle any keypress
        var recentlyPressedKeys = this.keyEventHandler.getKeys();
        for (var i = 0; i < recentlyPressedKeys.length; i++) {
            // HACK -- For entering name
            var alphabet = 'abcdefghijklmnopqrstuvwxyz';
            if(this.currentMenu == this.MENU_NAME) {
                if(recentlyPressedKeys[i].keyCode >= this.keyEventHandler.KEYPRESS_LCA && recentlyPressedKeys[i].keyCode <= this.keyEventHandler.KEYPRESS_LCZ) {
                    this.name += alphabet[recentlyPressedKeys[i].keyCode-this.keyEventHandler.KEYPRESS_LCA];
                };
                if(recentlyPressedKeys[i].keyCode == this.keyEventHandler.KEYPRESS_BACKSPACE) {
                    this.name = this.name.substring(0,this.name.length-1);
                };
            };

            switch(recentlyPressedKeys[i].keyCode) {
                case this.keyEventHandler.KEYPRESS_UPARROW:
                    // Needs exception for stat-menu
                    do {
                        this.choices[this.currentMenu]--;
                        if(this.choices[this.currentMenu] < 0) this.choices[this.currentMenu] = this.numberOfChoices[this.currentMenu]-1;
                    } while(this.currentMenu == this.MENU_STATS && this.statChoices[this.choices[this.currentMenu]] > 0);
                    break;
                case this.keyEventHandler.KEYPRESS_DOWNARROW:
                    // Needs exception for stat-menu
                    do {
                        this.choices[this.currentMenu] = (this.choices[this.currentMenu] + 1) % this.numberOfChoices[this.currentMenu];
                    } while(this.currentMenu == this.MENU_STATS && this.statChoices[this.choices[this.currentMenu]] > 0);
                    break;
                case this.keyEventHandler.KEYPRESS_ENTER:
                    switch(this.currentMenu) {
                        case this.MENU_NAME:
                            this.done = true;
                            break;
                        case this.MENU_STATS:
                            if(this.statChoices[this.choices[this.currentMenu]] > 0) break;
                            this.statChoiceNumber++;
                            this.statChoices[this.choices[this.currentMenu]] = this.statChoiceNumber;
                            if(this.statChoiceNumber > 5) {
                                this.currentMenu++;
                            }
                            break;
                        default:
                            this.currentMenu++;
                            break;
                    };
                    break;
            };
        };
    };

    return AngbandBirthMenu;
})();

var AngbandGame = (function() {
    AngbandGame.prototype.context = {};
    AngbandGame.prototype.keyEventHandler = {};
    AngbandGame.prototype.done = false;
    AngbandGame.prototype.doneCallback = '';
    AngbandGame.prototype.fontSize = 16;
    AngbandGame.prototype.padding = 20;
    AngbandGame.prototype.characterPosition = [1,1];
    AngbandGame.prototype.character = {};
    AngbandGame.prototype.map = {};

    function AngbandGame(context, keyEventHandler) {
        this.context = context;
        this.keyEventHandler = keyEventHandler;
        this.map = new AngbandMap(20,20);
    };

    /**
     * Callback will be passed 1 argument, a Character-object
     * TODO: find a way to step backwards out of this menu
     */
    AngbandGame.prototype.show = function(callback) {
        this.doneCallback = callback;

        this.tick();
    };

    AngbandGame.prototype.setCharacter = function(character) {
        this.character = character;
    };

    AngbandGame.prototype.tick = function() {
        if(!this.done) {
            var obj = this;
            requestAnimFrame(function(){obj.tick()});
        } else {
            this.doneCallback();
        };

        this.resize();
        this.render();
        this.animate();
    };

    AngbandGame.prototype.resize = function() {
        this.context.canvas.height = window.innerHeight;
        this.context.canvas.width = window.innerWidth;
    };

    AngbandGame.prototype.render = function() {
        var sidebar = {};
        sidebar.width = 150;
        sidebar.currentLine = 0;

        // Save current context-state
        this.context.save();

        // Set black background
        this.context.fillStyle = 'rgb(0,0,0)';
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

        // Text-settings
        this.context.fillStyle = 'white';
        this.context.lineWidth = 2.5;
        this.context.font = 'bold ' + this.fontSize + 'px Courier';
        this.context.textAlign = 'left';
        this.context.textBaseline = 'top';

        // Apply left-padding and top-padding
        this.context.translate(this.padding, this.padding);

        // Draw sidebar
        this.renderSidebar(sidebar);

        // Apply left-padding to account for the sidebar
        this.context.translate(sidebar.width, 0);

        // Draw map
        this.map.draw(this.context, this.fontSize, this.fontSize);
    
        // Draw character
        this.context.fillStyle = 'white';
        this.context.fillText('@', (this.fontSize*this.characterPosition[0]), (this.fontSize*this.characterPosition[1]));

        // Restore previous context-state
        this.context.restore();
    };

    AngbandGame.prototype.renderSidebar = function(sidebar) {
        this.context.fillStyle = 'cyan';
        // Name, race, class
        sidebar.currentLine += this.context.fillMultilineText(this.character.name, 0, sidebar.currentLine*this.fontSize, this.fontSize);
        sidebar.currentLine += this.context.fillMultilineText(this.character.race.name, 0, sidebar.currentLine*this.fontSize, this.fontSize);
        sidebar.currentLine += this.context.fillMultilineText(this.character.class.name, 0, sidebar.currentLine*this.fontSize, this.fontSize);
        sidebar.currentLine++; // Vertical space

        // Level, exp, gold
        sidebar.currentLine += this.context.fillMultilineText('Level: 1', 0, sidebar.currentLine*this.fontSize, this.fontSize);
        sidebar.currentLine += this.context.fillMultilineText('Exp: ' + this.character.experience, 0, sidebar.currentLine*this.fontSize, this.fontSize);
        sidebar.currentLine += this.context.fillMultilineText('Gold: ' + this.character.gold, 0, sidebar.currentLine*this.fontSize, this.fontSize);
        sidebar.currentLine++; // Vertical space

        // Stats
        for (var i = 0; i < this.character.stats.length; i++) {
            sidebar.currentLine += this.context.fillMultilineText(this.character.stats[i].shortName + ": " + this.character.stats[i].currentValue, 0, sidebar.currentLine*this.fontSize, this.fontSize);
        };
        sidebar.currentLine++; // Vertical space

        // cur/max HP
        sidebar.currentLine += this.context.fillMultilineText('HP: 10/10', 0, sidebar.currentLine*this.fontSize, this.fontSize);
    };

    AngbandGame.prototype.animate = function() {
        // Handle any keypress
        var recentlyPressedKeys = this.keyEventHandler.getKeys();
        for (var i = 0; i < recentlyPressedKeys.length; i++) {
            switch(recentlyPressedKeys[i].keyCode) {
                case this.keyEventHandler.KEYPRESS_UPARROW:
                    this.characterPosition[1]--;
                    break;
                case this.keyEventHandler.KEYPRESS_DOWNARROW:
                    this.characterPosition[1]++;
                    break;
                case this.keyEventHandler.KEYPRESS_LEFTARROW:
                    this.characterPosition[0]--;
                    break;
                case this.keyEventHandler.KEYPRESS_RIGHTARROW:
                    this.characterPosition[0]++;
                    break;
            };
        };
    };

    return AngbandGame;
})();

/**
 * Will need some major work, just making it very simple right now
 */
var AngbandKeyEventHandler = (function() {
    AngbandKeyEventHandler.prototype.eventStack = [];
    AngbandKeyEventHandler.prototype.KEYPRESS_BACKSPACE = 8;
    AngbandKeyEventHandler.prototype.KEYPRESS_ENTER = 13;
    AngbandKeyEventHandler.prototype.KEYPRESS_LEFTARROW = 37;
    AngbandKeyEventHandler.prototype.KEYPRESS_UPARROW = 38;
    AngbandKeyEventHandler.prototype.KEYPRESS_RIGHTARROW = 39;
    AngbandKeyEventHandler.prototype.KEYPRESS_DOWNARROW = 40;
    AngbandKeyEventHandler.prototype.KEYPRESS_LCA = 65;
    AngbandKeyEventHandler.prototype.KEYPRESS_LCZ = 90;

    function AngbandKeyEventHandler() {
        var obj = this;
        document.onkeydown = function(event) {obj.handleKeyDown(event)};
    };

    AngbandKeyEventHandler.prototype.handleKeyDown = function(event) {
        this.eventStack.push(event);
    };

    /**
     * Get's least recently pressed key
     * Removes this keypress from the event stack
     */
    AngbandKeyEventHandler.prototype.getKey = function() {
        return this.eventStack.shift();
    };

    /**
     * Get's all recently pressed keys
     * Empties the event stack
     */
    AngbandKeyEventHandler.prototype.getKeys = function() {
        return this.eventStack.splice(0);
    };

    /**
     * Empties the event stack
     */
    AngbandKeyEventHandler.prototype.clearKeys = function() {
        this.eventStack.splice(0);
    };

    return AngbandKeyEventHandler;
})();



function angbandStart() {
    var canvas = document.getElementById("gameCanvas");
    var context = canvas.getContext("2d");

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    var races = [];
    races.push(new CharacterRace("Human", [0,0,0,0,0,0], 10, 0));
    races.push(new CharacterRace("Half-Elf", [-1,1,0,1,-1,1], 9, 10));
    races.push(new CharacterRace("Elf", [-1,2,1,1,-2,1], 8, 20));
    races.push(new CharacterRace("Hobbit", [-2,2,1,3,2,1], 7, 10));
    races.push(new CharacterRace("Gnome", [-1,2,0,2,1,-2], 8, 25));
    races.push(new CharacterRace("Dwarf", [2,-3,2,-2,2,-3], 11, 20));
    races.push(new CharacterRace("Half-Orc", [2,-1,0,0,1,-4], 10, 10));
    races.push(new CharacterRace("Half-Troll", [4,-4,-2,-4,3,-6], 12, 20));
    races.push(new CharacterRace("Dunadan", [1,2,2,2,3,2], 10, 80));
    races.push(new CharacterRace("High-Elf", [1,3,-1,3,1,5], 10, 100));
    races.push(new CharacterRace("Kobold", [-1,-1,0,2,2,-2], 8, 15));

    var classes = [];
    classes.push(new CharacterClass("Warrior", [5,-2,-2,2,2,-1], 9, 0));
    classes.push(new CharacterClass("Mage", [-5,3,0,1,-2,1], 0, 30));
    classes.push(new CharacterClass("Priest", [-1,-3,3,-1,0,2], 2, 20));
    classes.push(new CharacterClass("Rogue", [2,1,-2,3,1,-1], 6, 25));
    classes.push(new CharacterClass("Ranger", [2,2,0,1,1,1], 4, 30));
    classes.push(new CharacterClass("Paladin", [3,-3,1,0,2,2], 6, 35));

    var genders = ['Male', 'Female'];
    var stats = ['Strength', 'Intelligence', 'Wisdom', 'Dexterity', 'Constitution', 'Charisma'];

    var keyHandler = new AngbandKeyEventHandler();
    var birthMenu = new AngbandBirthMenu(context, keyHandler, genders, races, classes, stats);
    var angbandGame = new AngbandGame(context, keyHandler);
    birthMenu.show(function(character){
        angbandGame.setCharacter(character);
        angbandGame.show();
    });

};