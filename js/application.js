/**
 * Stworzenie globalnej definicji aplikacji
 */
Blast = Ember.Application.create({

});

Blast.ApplicationAdapter = DS.FixtureAdapter.extend();

Blast.IndexRoute = Ember.Route.extend({
    model: function () {
        return {
            //TODO setup view model for 'index'
            query: this.store.find('querySequence', '1'),
            records: this.store.findAll('sequenceRecord')
        };
    }
});

Blast.InitRoute = Ember.Route.extend({
    model: function () {
        return {
            //TODO setup view model for 'init'
        };
    }
});

Blast.SearchRoute = Ember.Route.extend({
    model: function () {
        return {
            //TODO setup view model for 'search'
        };
    }
});

Blast.ExtendRoute = Ember.Route.extend({
    model: function () {
        return {
            //TODO setup view model for 'extend'
        };
    }
});

Blast.ResultRoute = Ember.Route.extend({
    model: function () {
        return {
            //TODO setup view model for 'result'
        };
    }
});