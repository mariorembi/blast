// ------------ UTILITY FUNCTIONS FOR SEQUENCES --------------------

//--------------RANDOM NUCLEOTID CREATION---------------------------
function createNucleotid(minSize, maxSize) {
    var nucleotid = "";
    var possible = "ACTG";
    var randomSize = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;

    for (var i = 0; i < randomSize; i++) {
        nucleotid += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return nucleotid;
}

function createDataBase(size) {
    var db = [];

    for (var i = 0; i < size; i++) {
        db.pushObject(createNucleotid(30, 50));
    }

    return db;
}

//------------NUCLEOTID WORDS -----------------------------------------

function wordSplit(sequence, wordSize) {
    var words = [];
    for (var i = 0; i <= sequence.length - wordSize; i++) {
        words.pushObject({off: i, word: sequence.substr(i, wordSize)});
    }
    return words;
}

function wordRecordHit(record, word) {
	var hits = [];
	var off = record.indexOf(word);
	if (off == -1) {
		return hits;
	}
	hits.pushObject(off);
	// hits won't overlap
	var nextHits = wordHit(record.substr(off + wordSize), word);
	if (nextHits.length > 0)
		hits.concat(nextHits);
	return hits;
}

function wordDBHits(database, word) {
	var hits = [];
	for (id = 0; id < database.length; id++) {
		var hitsPerRecord = wordRecordHit(database[id], word);
		if (hitsPerRecord.length > 0)
			hits.pushObject({id: id, hits: hitsPerRecord});
	}
	return hits;
}

var countScore(a, b, similarityMatrix) {
	if (a.length != b.length)
		return 0;
	var score = 0;
	for (var i = 0; i < a.length; i++) {
		score += similarityMatrix[a[i]][b[i]];
	}
	return score;
}

function Expander () {
	this.similarityMatrix = {};
	this.record = [];
	this.sequence = [];
	this.word = {off: 0, size: 0, str: []};
	this.sequenceHitOff = 0;
	// Settings of exapnding stop condition
	this.minScore = -1;
	this.maxPenalty = -1;
	
	//state
	var leftOff = 0;
	var rightOff = 0;
	var leftStop = false;
	var rightStop = false;
	var wordScore = 0;
	
	var expandRight = [];
	var expandLeft = [];
	
	this.init() {
		this.leftOff = this.word.off - 1;
		if (this.leftOff < 0)
			this.leftOff = 0;
		this.rightOff = this.word.off + this.word.size;
		if (this.rightOff - 1 >= this.sequence.length)
			this.rightOff = this.sequence.length -1;
		
		wordScore = countScore(this.word.str, this.word.str, similarityMatrix);
	}
	//public
	this.getNext() {
		return {left: {score: [0], penalty: [0]}, right: {score: [0], penalty: [0]}};
		
	}
	this.getAll() {
		return {left: {score: [0], penalty: [0]}, reight: {score: [0], penalty: [0]}};
		
	}
	this.getResult() {
		return {score: 4, from: 0, to: 1};
	}
	
	
}



