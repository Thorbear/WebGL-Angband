var Klasse = (function() {
	Klasse.prototype.publicVariabel;

	function Klasse() {
		this.publicVariabel = 2;
	};

	Klasse.prototype.publicMetode = function() {
		this.publicVariabel++;
	};

	return Klasse;
})();

var foo = new Klasse();

foo.publicMetode();

foo.publicVariabel