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
	var off = 0;
	var ind;

	while ((index = record.indexOf(word, off)) > -1) {
		hits.push(index);
		off = index + 1;
	}

	return hits;
}

function wordDBHits(database, word) {
	var hits = [];
	for (var id = 0; id < database.length; id++) {
		var hitsPerRecord = wordRecordHit(database[id], word);
		if (hitsPerRecord.length > 0) {
			hits.pushObject({id: id, hits: hitsPerRecord});
		}
	}
	return hits;
}

function countScore(a, b, similarityMatrix) {
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
	this.word = {off: {sequence:0, record: 0}, size: 0, str: []};
	this.maxScore = -1;
	this.maxPenalty = -1;
	
	//state
	var leftOff = {sequence: 0, record: 0};
	var rightOff = {sequence: 0, record: 0};
	var leftStop = false;
	var rightStop = false;
	var wordScore = 0;
	
	var expandRight = {score: [], penalty: []};
	var expandLeft = {score: [], penalty: []};
	
	this.init = function() {
		leftOff.sequence = this.word.off.sequence;
        leftOff.record = this.word.off.record;
		rightOff.sequence = this.word.off.sequence + this.word.size - 1;
        rightOff.record = this.word.off.record  + this.word.size - 1;
		
		wordScore = countScore(this.word.str, this.word.str, this.similarityMatrix);
        expandLeft.score.push(wordScore);
        expandLeft.penalty.push(0);

        expandRight.score.push(wordScore);
        expandRight.penalty.push(0);
        console.log("Expander left size: " + expandLeft.score.length);
        return {left: expandLeft, right: expandRight};
	}
	//public
    this.updateExpansion = function(expansion, off) {
        console.log("Compare " + this.sequence[off.sequence] + " and " + this.record[off.record]);
        var score = this.similarityMatrix[this.sequence[off.sequence]][this.record[off.record]];
        var newScore = expansion.score[expansion.score.length - 1] + score;

        var newPenalty = 0;
        if (score < 0) {
            newPenalty = expansion.penalty[expansion.penalty.length - 1] + Math.abs(score);
        } else {
            newPenalty = expansion.penalty[expansion.penalty.length - 1] - score;
        }
        newPenalty = Math.max(0, newPenalty);

        if (this.maxPenalty != -1 && newPenalty > this.maxPenalty) {
            return true;
        }
        if (this.maxScore != -1 && newScore > this.maxScore) {
            return true;
        }
        expansion.penalty.push(newPenalty);
        expansion.score.push(newScore);
        console.log("New score: " + newScore + ", New penalty: " + newPenalty);
        return false;

    }
    this.getNext = function() {
        console.log("Left off sequence: " + leftOff.sequence + " record: " + leftOff.record);
        console.log("Right off sequence: " + rightOff.sequence + " record: " + rightOff.record);
        if (!leftStop) {
            leftOff.sequence--;
            leftOff.record--;
            if (leftOff.sequence < 0 ) {
                leftStop = true;
                leftOff.sequence++;
            } else if (leftOff.record < 0){
                leftStop = true;
                leftOff.record++;
            } else {
                console.log("Getting left " + leftOff.sequence);
                leftStop = this.updateExpansion(expandLeft, leftOff);
            }
        }
        if (!rightStop) {
            rightOff.sequence++;
            rightOff.record++;
            if (rightOff.sequence >= this.sequence.length) {
                rightStop = true;
                rightOff.sequence--;
            } else if (rightOff.record >= this.record.length) {
                rightStop = true;
                rightOff.record--;
            } else {
                console.log("Getting right " + rightOff.sequence);
                rightStop = this.updateExpansion(expandRight, rightOff);
            }
        }
        if (leftStop && rightStop)
            return null;
        console.log(expandLeft.score);
        console.log(expandLeft.penalty);
        console.log(expandRight.score);
        console.log(expandRight.penalty);
		return {left: expandLeft, right: expandRight};
	}

	this.getAll = function() {
		while (this.getNext() != null) ;
        return {left: expandLeft, right: expandRight};
	}
    var getBest = function(table) {
        var maxVal = 0;
        var maxInd;
        for (var i = 0; i < table.length; i++) {
            if (table[i] >= maxVal) {
                maxInd = i;
                maxVal = table[i];
            }
        }
        return maxInd;
    }
	this.getResult = function() {
        if (!leftStop && !rightStop)
            return null;
        var leftBest = getBest(expandLeft.score);
        var rightBest = getBest(expandRight.score);
        console.log("Left best: " + leftBest + " right best: " + rightBest);
        var leftOff = this.word.off.record - leftBest;
        var size = this.word.off.record - leftOff + this.word.size + rightBest;
        var bestSubRec = this.record.substr(leftOff, size);

        leftOff = this.word.off.sequence - leftBest;
        var bestSubSeq = this.sequence.substr(leftOff, size);
        console.log(bestSubRec);
        console.log(bestSubSeq);
        var bestScore = countScore(bestSubRec, bestSubSeq, this.similarityMatrix);
		return {score: bestScore, sequenceOff: leftOff, recordOff: this.word.off.record - leftBest, size: size};
	}

    this.reset = function() {
        this.similarityMatrix = {};
        this.record = [];
        this.sequence = [];
        this.word = {off: {sequence:0, record: 0}, size: 0, str: []};
        this.maxScore = -1;
        this.maxPenalty = -1;

        //state
        leftOff = {sequence: 0, record: 0};
        rightOff = {sequence: 0, record: 0};
        leftStop = false;
        rightStop = false;
        wordScore = 0;
        expandRight = {score: [], penalty: []};
        expandLeft = {score: [], penalty: []};
    }

	
}



