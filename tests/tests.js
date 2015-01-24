// in order to see the app running inside the QUnit runner
Blast.rootElement = '#ember-testing';

// Common test setup
Blast.setupForTesting();
Blast.injectTestHelpers();

// common QUnit module declaration
module("Integration tests", {
  setup: function() {
    // before each test, ensure the application is ready to run.
    Ember.run(Blast, Blast.advanceReadiness);
  },

  teardown: function() {
    // reset the application state between each test
    Blast.reset();
  }
});

// QUnit test case
test("/", function() {
  // async helper telling the application to go to the '/' route
  visit("/");

  // helper waiting the application is idle before running the callback
  andThen(function() {
    ok(find("nav").length > 0, "Main application navigation panel rendered");
    ok(find("#stage-navigator").length > 0, "Stage navigation panel rendered");
  });
});

module("Unit: Algorithm tests");

test('word splitting-size 1', function(){
    var sequence = 'ACTGACATCA';
    var words = wordSplit(sequence, 1);

    equal(words.length, sequence.length, "Amount of words ok");

    for (var i = 0; i < sequence.length; i++) {
        equal(words[i].word[0], sequence[i], "Sequence ok");
        equal(words[i].off, i, "Offset ok");
    }
});

test('word splitting-size whole', function() {
    var sequence = 'ACCTG';
    var words = wordSplit(sequence, sequence.length);

    equal(words.length, 1, "Amount of words ok");
    equal(words[0].word, sequence, "Sequence ok");
    equal(words[0].off, 0, "Offset ok");
})

test('record hit', function() {
    var word = 'AAA';
    var record = 'AAAAAAA';

    var result = wordRecordHit(record, word);
    equal(result.length, record.length - word.length + 1);
    for (var i = 0; i < result.length; i++) {
        equal(result[i], i, "Record and word hit");
    }
})

test('record hit 2', function() {
    var word = 'ACAC';
    var record = 'ACACACACACACAC';

    var result = wordRecordHit(record, word);
    equal(result.length, 6);
    for (var i = 0; i < result.length; i++) {
        equal(result[i], 2 * i, "Record and word hit");
    }
})

test('database search', function() {
	var word = 'AAAA';
	var database = ['AAAATTTTAAAA', 'TTTTTTTTTTT', 'TTTTAAAATTTT'];
	
	var result = wordDBHits(database, word);
	equal(result.length, 2, 'Amount of hits found in database');
	equal(result[0].id, 0, 'Offset of hit');
	equal(result[0].hits.length, 2, 'Amount of hits found for record');
	equal(result[0].hits[0], 0, 'Offset of hit');
	equal(result[0].hits[1], 8, 'Offset of hit');
	equal(result[1].hits.length, 1, 'Amount of hits found for record');
	equal(result[1].hits[0], 4, 'Offset of hit');
})

var test_expanding = function(sequence, record, word, map, maxPenalty, maxScore, expectedLeft, expectedRight, expectedResult) {
    var expandTest = new Expander();
    ok(expandTest, 'Created Expander object');
    expandTest.word = word;
    expandTest.sequence = sequence;
    expandTest.record = record;
    expandTest.maxPenalty = maxPenalty;
    expandTest.maxScore = maxScore;

    expandTest.similarityMatrix = map;

    var initResult = expandTest.init();
    equal(initResult.left.score.length, 1, "Init score ok");
    equal(initResult.right.score.length, 1, "Init score ok");
    equal(initResult.left.penalty.length, 1, "Init penalty ok");
    equal(initResult.right.penalty.length, 1, "Init penalty ok");
    equal(initResult.right.score[0], expectedRight.score[0], "Init score value ok");
    equal(initResult.left.score[0], expectedLeft.score[0], "Init score value ok");
    equal(initResult.right.penalty[0], expectedRight.penalty[0], "Init penalty value ok");
    equal(initResult.left.penalty[0], expectedLeft.penalty[0], "Init penalty value ok");
    var expectedLeftSize = 2;
    var expectedRightSize = 2;
    var stepResult = initResult;
    var steps = 1;
    for (var i = 1; i < 10; i++) {
        if ((stepResult = expandTest.getNext()) == null)
            break;
        ok(stepResult != null, "Step result gathered");
        console.log(stepResult.left);
        console.log(stepResult.right);
        equal(stepResult.left.score.length, expectedLeftSize, "Step left incrementation ok");
        equal(stepResult.right.score.length, expectedRightSize, "Step right incrementation ok");
        if ( i < stepResult.left.score.length) {
            console.log("i : " + i + "  length: " + stepResult.left.score.length);
            equal(stepResult.left.penalty[i], expectedLeft.penalty[i], "Step left penalty ok");
            equal(stepResult.left.score[i], expectedLeft.score[i], "Step left score ok");
        }
        if ( i < stepResult.right.score.length) {
            equal(stepResult.right.penalty[i], expectedRight.penalty[i], "Step right penalty ok");
            equal(stepResult.right.score[i], expectedRight.score[i], "Step right score ok");
        }
        expectedLeftSize = Math.min(expectedLeftSize + 1, expectedLeft.score.length);
        expectedRightSize = Math.min(expectedRightSize + 1, expectedRight.score.length);
        steps++;
    }

    equal(steps, Math.max(expectedLeft.score.length, expectedRight.score.length));
    var result = expandTest.getResult();
    deepEqual(result, expectedResult, "Result ok");
}

test('expander-simple', function() {
	var sequence = 'TTTAAATTT';
	var record = 'GGGGGGAAAGGGGGG';
    var word = {off: {sequence: 3, record: 6}, size: 3, str: 'AAA'};
    var expectedLeft = {score: [3,2,1], penalty: [0,1,2]};
    var expectedRight = expectedLeft;
    var expectedResult = {score: 3, sequenceOff: 3, recordOff: 6, size: 3};

    var map = {
        'A' : {'A' : 1, 'C' : -1, 'G' : -1, 'T' : -1},
        'C' : {'A' : -1, 'C' : 1, 'G' : -1, 'T' : -1},
        'G' : {'A' : -1, 'C' : -1, 'G' : 1, 'T' : -1},
        'T' : {'A' : -1, 'C' : -1, 'G' : -1, 'T' : 1}
    };

    test_expanding(sequence, record, word, map, 2, -1, expectedLeft, expectedRight, expectedResult);
})

test('expander-simple2', function() {
    var sequence = 'TTTTTGCGCAAAGGGGTTTTT';
    var record = 'CCCCCGGGGAAACCCCCCCCC';
    var word = {off: {sequence: 9, record: 9}, size: 3, str: 'AAA'};
    var expectedLeft = {score: [3,2,3,2,3,2,1], penalty: [0,1,0,1,0,1,2]};
    var expectedRight = {score: [3,2,1], penalty: [0,1,2]};
    var expectedResult = {score: 3, sequenceOff: 5, recordOff: 5, size: 7};
    var map = {
        'A' : {'A' : 1, 'C' : -1, 'G' : -1, 'T' : -1},
        'C' : {'A' : -1, 'C' : 1, 'G' : -1, 'T' : -1},
        'G' : {'A' : -1, 'C' : -1, 'G' : 1, 'T' : -1},
        'T' : {'A' : -1, 'C' : -1, 'G' : -1, 'T' : 1}
    };

    test_expanding(sequence, record, word, map, 2, -1, expectedLeft, expectedRight, expectedResult);
})
