/**
 * Stworzenie globalnej definicji aplikacji
 */
Blast = Ember.Application.create({

});

/**
 * Inicjalizacja aplikacji -> bazy danych
 */
Ember.onLoad('Ember.Application', function(Application) {
    Application.initializer({
        name: "registerDB",
        initialize: function(container, application) {
            console.log('-> registerDB');
            application.register('db:main', application.DataBase, {singleton:true});
            var db = container.lookup('db:main');
        }
    });
    Application.initializer({
        name: "injectDB",
        initialize: function(container, application) {
            console.log('-> injectDB');
            application.inject('controller', 'db', 'db:main');
            application.inject('route', 'db', 'db:main');
        }
    });
});

Blast.ApplicationAdapter = DS.FixtureAdapter.extend();

Blast.DataBase = Ember.Object.extend({
    init: function() {
        this.clearDataBase();
        //var nucleotids = ['AACTGCCAATGTCA', 'ACTGCAACGT', 'ACCCAAAATTGACATGGGT', 'AACC'];
        var nucleotids = createDataBase(5);
        console.log(nucleotids);
        localStorage.nucleotids = JSON.stringify(nucleotids);
    },
    find: function(key) {
        if (!Ember.isNone(key)) {
            var nucleotids = [];
            var storedNucleotids = JSON.parse(localStorage[key]);
            storedNucleotids.forEach(function(nucleotid) {
                nucleotids.pushObject(nucleotid);
            });
            return nucleotids;
        }
    },
    clearDataBase: function() {
        localStorage.clear();
    }
})

Blast.IndexRoute = Ember.Route.extend({
    model: function () {
        return {
            //TODO setup view model for 'index'
            query: this.store.find('querySequence', '1'),
            //TODO somehow call this with what this.store.find('querySequence') returned
            words: getWords('ACTGACCCATGAACATA', 4),
            //records: this.store.findAll('sequenceRecord')
            records: this.get('db').find('nucleotids')
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