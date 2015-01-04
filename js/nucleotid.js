// ------------ UTILITY FUNCTIONS FOR SEQUENCES --------------------

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

function getWords(nucleotid, wordSize) {
    var words = [];
    for (var i = 0; i <= nucleotid.length - wordSize; i++) {
        words.pushObject({off: i, str: nucleotid.substr(i, wordSize)});
    }
    return words;
}

// ----------- SEQUENCE EXTENSION SCORE (NOT OPTIMAL)--------------------------

function findBestExtention(sequence, word, wordPosition, nucleotid, matchPosition) {
    // Checking out of bounds
    if (matchPosition < 0 || (word.length + matchPosition > nucleotid.length)) {
        console.log("out of bounds");
        return {score: Number.MIN_VALUE, word: "", pos: -1};
    }
    if (wordPosition < 0) {
        console.log("out of bounds");
        return {score: Number.MIN_VALUE, word: "", pos: -1};
    }

    // Computing score for current extension
    console.log("checking word: " + word + " on position: " + wordPosition);
    var currentScore = 0;
    for (var i = 0; i < word.length; i++) {
        if (word[i] == nucleotid[matchPosition + i])
            currentScore++;
        else
            currentScore--;
    }
    console.log("Got score: " + currentScore + " on matching with position: " + matchPosition);

    // Extending word to left and right
    var leftExtendWord = sequence.substr(wordPosition - 1, word.length + 1);
    console.log("left extention");
    var leftScoreInfo = findBestExtention(sequence, leftExtendWord, wordPosition - 1, nucleotid, matchPosition - 1);

    console.log("right extention");
    var rightScoreInfo = {score: Number.MIN_VALUE, word: "", pos: -1};

    if ((wordPosition + word.length + 1) <= sequence.length) {
        var rightExtendWord = sequence.substr(wordPosition, word.length + 1);
        rightScoreInfo = findBestExtention(sequence, rightExtendWord, wordPosition, nucleotid, matchPosition);
    } else {
        console.log("out of bounds");
    }
    // Returning the biggest one
    if (currentScore > rightScoreInfo.score) {
        if (currentScore > leftScoreInfo.score)
            return {score: currentScore, word: word, pos: matchPosition};
        return leftScoreInfo;
    }
    if (rightScoreInfo.score > leftScoreInfo.score)
        return rightScoreInfo;
    return leftScoreInfo;
}

// ---------- SMITH-WATERMANN---------------------

function create2DArray(rows) {
    var array = [];
    for (var i = 0; i < rows; i++)
        array[i] = [];
    return array;
}

function initSWMatrix(rows, cols) {
    var matrix = create2DArray(rows);
    matrix[0][0] = {score: 0, direction: 'none'};
    for (var i = 1; i < rows; i++)
        matrix[i][0] = {score: 0, direction: 'none'};
    for (var i = 1; i < cols; i++)
        matrix[0][i] = {score: 0, direction: 'none'};
    return matrix;
}
var MATCH = 1;
var MISMATCH = -1;
var GAP = -1;

function SWCountScore(matrix, i, j, letterS, letterN) {
    var diagonalScore, leftScore, upScore;
    if (letterS == letterN)
        diagonalScore = matrix[i-1][j-1].score + MATCH;
    else
        diagonalScore = matrix[i-1][j-1].score + MISMATCH;

    leftScore = matrix[i-1][j].score + GAP;
    upScore = matrix[i][j-1].score + GAP;

    if (diagonalScore < 0 && upScore < 0 && leftScore < 0) {
        matrix[i][j] = {score: 0, direction: 'none'};
        return false;
    }
    if (diagonalScore >= upScore) {
        if (diagonalScore >= leftScore) {
            matrix[i][j] = {score: diagonalScore, direction: 'diagonal'};
        } else {
            matrix[i][j] = {score: leftScore, direction: 'left'};
        }
    } else {
        if (upScore >= leftScore) {
            matrix[i][j] = {score: upScore, direction: 'up'};
        } else {
            matrix[i][j] = {score: leftScore, direction: 'left'};
        }
    }
    return true;
}

function SWRetrieveMatches(matrix, i, j, sequence, nucleotid) {
    var sequenceMatch = "";
    var nucleotidMatch = "";

    while(1) {
        if (matrix[i][j].direction == 'none')
            break;
        if (matrix[i][j].direction == 'diagonal') {
            sequenceMatch += sequence[i-1];
            nucleotidMatch += nucleotid[j-1];
            i--;
            j--;
        }
        if (matrix[i][j].direction == 'up') {
            sequenceMatch += "-";
            nucleotidMatch += nucleotid[j-1];
            j--;
        }
        if (matrix[i][j].direction == 'left') {
            sequenceMatch += sequence[i-1];
            nucleotidMatch += "-";
            i--;
        }
    }

    // Matches are retrieved backwards
    return {sequenceMatch : sequenceMatch.split("").reverse().join(""),
            nucleotidMatch : nucleotidMatch.split("").reverse().join("")};

}

function printSWMatrix(matrix, sequence, nucleotid) {
    var stringLine = "   | -";
    for (var i = 0; i < nucleotid.length; i++)
        stringLine += (" | " + nucleotid[i]);
    console.log(stringLine);
    stringLine = "";
    for (var i = 0; i <= sequence.length; i++) {
        if (i == 0)
            stringLine += " -";
        else
            stringLine += (" " + sequence[i - 1]);
        for (var j = 0; j <= nucleotid.length; j++) {
            stringLine += (" | " + matrix[i][j].score.toString());
        }
        console.log(stringLine);
        stringLine = "";
    }
}

function smithWaterman(sequence, nucleotid) {
    var matrix = initSWMatrix(sequence.length + 1, nucleotid.length + 1);
    var maxInfo = {i : 0, j: 0, score: 0};

    for (var i = 1; i <= sequence.length; i++)
        for (var j = 1; j <= nucleotid.length; j++) {
            if (!SWCountScore(matrix, i, j, sequence[i - 1], nucleotid[j - 1]))
                continue;
            if (matrix[i][j].score > maxInfo.score) {
                maxInfo = {i : i, j: j, score: matrix[i][j].score};
            }
        }
    printSWMatrix(matrix, sequence, nucleotid);
    var matches = SWRetrieveMatches(matrix, maxInfo.i, maxInfo.j, sequence, nucleotid);

    return {sequenceMatch : matches.sequenceMatch, nucleotidMatch: matches.nucleotidMatch,
            score: maxInfo.score};
}