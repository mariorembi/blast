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

    for (var i = 0; i < sequence.length; i++) {
        equal(words[i].str[0], sequence[i], "Sequence ok");
        equal(words[i].off, i, "Offset ok");
    }
});

test('word splitting-size whole', function() {
    var sequence = 'ACCTG';
    var words = wordSplit(sequence, sequence.length);

    equal(words.length, 1, "Words length ok");
    equal(words[0].str, sequence, "Sequence ok");
    equal(words[0].off, 0, "Offset ok");
})

test('database search', function() {
	var word = 'AAAA';
	var database = ['AAAATTTTAAAA', 'TTTTTTTTTTT', 'TTTTAAAATTTT'];
	
	var result = wordDBHits(database, word);
	equal(result.length, 2, 'Wrong amount of hits found in database');
	equal(result[0].id, 0, 'Hit not found, but should');
	equal(result[0].hits.length, 2, 'Wrong amount of hits found for record');
	equal(result[0].hits[0], 0, 'Wrong hit found');
	equal(result[0].hits[1], 8, 'Wrong hit found');
	equal(result[1].hits.length, 1, 'Wrong amount of hits found for record');
	equal(result[1].hits[0], 4, 'Wrong hit found');
})
