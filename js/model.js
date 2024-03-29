/**
 * Definicja encji opisującej dozwolone symbole słownika sekwencji DNA
 */
Blast.SequenceSymbol = DS.Model.extend({
    symbol: DS.attr('string')
});

/**
 * Definicja encji opisującej wyszukiwaną sekwencję DNA
 */
Blast.QuerySequence = DS.Model.extend({
   sequence: DS.attr('string')
});

/**
 * Definicja encji opisującej słowa wygenerowane na podstawie wyszukiwanej sekwencji DNA
 */
Blast.Word = DS.Model.extend({
    symbols: DS.attr('string'),
    startOffset: DS.attr('number'),
    originalSequence: DS.belongsTo('querySequence')
});

/**
 * Definicja encji definiującej rekord "bazy danych" zawierającej sekwencje DNA
 */
Blast.SequenceRecord = DS.Model.extend({
    sequence: DS.attr('string'),
    description: DS.attr('string')
});

/**
 * Definicja encji przechowującej rozwinięcie oceny dla rozszerzenia dopasowania
 * @type {*|void}
 */
Blast.Extension = DS.Model.extend({
    scores: DS.attr(), //as array
    dropOffs: DS.attr() //as array
});

/**
 * Definicja encji definiującej rekord "bazy danych", który zawiera dopasowanie słowa
 */
Blast.MatchedRecord = DS.Model.extend({
    record: DS.belongsTo('sequenceRecord'),
    startOffset: DS.attr('number'),
    endOffset: DS.attr('number'),
    active: DS.attr('boolean', {defaultValue: false}),
    extended: DS.attr('boolean', {defaultValue: false}),
    leftExtension: DS.belongsTo('extension'),
    rightExtension: DS.belongsTo('extension'),
    matchStartOffset: DS.attr('number'),
    matchEndOffset: DS.attr('number'),
    queryStartOffset: DS.attr('number'),
    queryEndOffset: DS.attr('number')
});
/**
 * Definicja encji definiującej relację słowa z rekordami bazy danych - grupuje rekordy sprawdzone i te które jeszcze zostały do sprawdzenia
 */
Blast.WordRecordGroup = DS.Model.extend({
   word: DS.belongsTo('word'),
   recordsToCheck: DS.hasMany('sequenceRecord'),
   matchedRecords: DS.hasMany('matchedRecord')
});

Blast.Result = DS.Model.extend({
    record: DS.belongsTo('sequenceRecord'),
    startOffset: DS.attr('number'),
    endOffset: DS.attr('number'),
    score: DS.attr('number')
});

/**
 * Definicja encji opisującej ocenę za dopasowanie jednego symbolu słowa wyszukiwanej sekwencji do symbolu sekwencji<br/>
 * Ocena dodatnia oznacza nagrodę, natomiast ujemna - karę za błędne dopasowanie symbolu
 */
Blast.Scoring = DS.Model.extend({
    fromSymbol: DS.belongsTo('sequenceSymbol'),
    toSymbol: DS.belongsTo('sequenceSymbol'),
    score: DS.attr('number')
});
