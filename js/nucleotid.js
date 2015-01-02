/**
 * Funkcje pomocnicze do obsługi nukleotydów
 */


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
    console.log(nucleotid);
    console.log(wordSize);
    var words = [];
    for (var i = 0; i <= nucleotid.length - wordSize; i++) {
        words.pushObject(nucleotid.substr(i, wordSize));
    }
    return words;
}
