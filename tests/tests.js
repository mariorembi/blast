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