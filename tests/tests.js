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
    var words = getWords(sequence, 1);

    for (var i = 0; i < sequence.length; i++) {
        equal(words[i].str[0], sequence[i], "Sequence ok");
        equal(words[i].off, i, "Offset ok");
    }
});

test('word splitting-size whole', function() {
    var sequence = 'ACCTG';
    var words = getWords(sequence, sequence.length);

    equal(words.length, 1, "Words length ok");
    equal(words[0].str, sequence, "Sequence ok");
    equal(words[0].off, 0, "Offset ok");
})

test('Smith-Watermann-simple1', function() {
    var sw = smithWaterman('PELICAN', 'COELACANTH');
    equal(sw.sequenceMatch, 'ELICAN', "Sequence match ok");
    equal(sw.nucleotidMatch, 'ELACAN', "Nucleotid match ok");
    equal(sw.score, 4, "Score ok");
});

test('Smith-Watermann-simple2', function() {
    var sw = smithWaterman('ACCTGA', 'GATTCCTGACT');
    equal(sw.sequenceMatch, 'CCTGA', "Sequence match ok");
    equal(sw.nucleotidMatch, 'CCTGA', "Nucleotid match ok");
    equal(sw.score, 5, "Score ok");
});

test('Best extension-simple', function() {
    var sequence = 'ACCTGA';
    var nucleotid = 'GATTCCTGACT';
    var word = 'CCTG';

    var scoreInfo = findBestExtention(sequence, word, 1, nucleotid, 4);
    equal(scoreInfo.word, 'CCTGA', "Sequence ok");
    equal(scoreInfo.score, 5, "Score ok");
    equal(scoreInfo.pos, 4, "Offset ok");
});