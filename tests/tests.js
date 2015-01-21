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
    equal(find("h2").text(), "BLAST - demo", "Main application header rendered");
    ok(find("li").length > 0, "There are some DB records in the list");
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

test('expander-simple', function() {
	var sequence = 'TTTAAATTT';
	var record = 'GGGGGGAAAGGGGGG';
	
	var expandTest = new Expander();
	ok(expandTest, 'Created Expander object');
	expandTest.word = {off: 3, size: 3, str: 'AAA'};
	expandTest.sequence = sequence;
	expandTest.maxPenalty = 2;
	
	var stepResult = expandTest.getNext();
	equal(stepResult.left.score.length, 1, "Step incrementation ok");
	equal(stepResult.right.score.length, 1, "Step incrementation ok");
	equal(stepResult.left.penalty[0], -1, "Step penalty ok");
	equal(stepResult.left.score[0], 2, "Step score ok");
	equal(stepResult.right.penalty[0], -1, "Step penalty ok");
	equal(stepResult.right.score[0], 2, "Step score ok");
	equal(expandTest.getResult().score, 3, 'Score match');
	equal(expandTest.getResult().from, 3, "Best result from");
	equal(expandTest.getResult().to, 6, "Best result to");
})
