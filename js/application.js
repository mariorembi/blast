/**
 * Stworzenie globalnej definicji aplikacji
 */
Blast = Ember.Application.create({
    LOG_TRANSITIONS: true,
    LOG_TRANSITIONS_INTERNAL: true,
    ready: function () {
        var store = this.__container__.lookup('store:main');
        store.createRecord('sequenceRecord', {sequence: 'ATTTAGCAA'});
        store.createRecord('sequenceRecord', {sequence: 'AGACCATTA'});
        store.createRecord('sequenceRecord', {sequence: 'GATTACAAG'});
        return this;
    }
});

Blast.Router.map(function () {
    this.resource('configuration');
    this.resource('init');
    this.resource('search');
    this.resource('evaluation');
    this.resource('extend');
    this.resource('results');
    this.resource('about');
});

Blast.ApplicationAdapter = DS.FixtureAdapter.extend();

Blast.ApplicationController = Ember.ObjectController.extend({
    wordLength: 4,
    scoreThreshold: 40,
    stages: [
        Ember.Object.create({
            name: 'Initialization Stage',
            resource: 'init',
            disabled: true
        }),
        Ember.Object.create({
            name: 'Search Stage',
            resource: 'search',
            disabled: true
        }),
        Ember.Object.create({
            name: 'Evaluation Stage',
            resource: 'evaluation',
            disabled: true
        }),
        Ember.Object.create({
            name: 'Extend Stage',
            resource: 'extend',
            disabled: true
        }),
        Ember.Object.create({
            name: 'Results',
            resource: 'results',
            disabled: true
        })
    ]
});

Blast.IndexRoute = Ember.Route.extend({
    beforeModel: function () {
        this.transitionTo('configuration');
    }
});

Blast.ConfigurationRoute = Ember.Route.extend({
    model: function () {
        return {
            //TODO setup view model for 'index'
            query: this.store.find('querySequence', '1'),
            records: this.store.findAll('sequenceRecord')
        };
    }
});

Blast.ConfigurationController = Ember.ObjectController.extend({
    needs: ['application'],
    newSequenceRecord: '',
    actions: {
        removeRecordSequence: function (sequenceRecord) {
            sequenceRecord.deleteRecord();
            return false;
        },
        addRecordSequence: function () {
            this.store.createRecord('sequenceRecord', {sequence: this.newSequenceRecord});
            this.set('newSequenceRecord', '');
            return false;
        },
        removeAllRecords: function () {
            this.store.unloadAll('sequenceRecord');
            return false;
        },
        startAlgorithm: function () {
            //TODO update querySequence & enable next stage
            this.get('controllers.application.stages').findBy('resource', 'init').set('disabled', false);
            this.transitionToRoute('init');
        }
    }
});

Blast.InitRoute = Ember.Route.extend({
    beforeModel: function () {
        if (this.controllerFor('application').stages.findBy('resource', 'init').get('disabled')) {
            this.transitionTo('configuration');
        }
    },
    model: function () {
        return {
            //TODO setup view model for 'init'
            query: this.store.find('querySequence', '1')
        };
    }
});

Blast.InitController = Ember.ObjectController.extend({
    needs: ['application'],
    actions: {
        prevStage: function () {
            this.transitionTo('configuration');
        },
        resetStage: function () {
            this.store.unloadAll('word');
        },
        nextStep: function () {
            //TODO check is stage completed & perform step
        },
        nextStage: function () {
            //TODO check is stage completed
            this.transitionTo('search');
        }
    }
});

Blast.SearchRoute = Ember.Route.extend({
    beforeModel: function () {
        if (this.controllerFor('application').stages.findBy('resource', 'search').get('disabled')) {
            this.transitionTo('init');
        }
    },
    model: function () {
        return {
            //TODO setup view model for 'search'
        };
    }
});

Blast.EvaluationRoute = Ember.Route.extend({
    beforeModel: function () {
        if (this.controllerFor('application').stages.findBy('resource', 'evaluation').get('disabled')) {
            this.transitionTo('search');
        }
    },
    model: function () {
        return {
            //TODO setup view model for 'search'
        };
    }
});

Blast.ExtendRoute = Ember.Route.extend({
    beforeModel: function () {
        if (this.controllerFor('application').stages.findBy('resource', 'extend').get('disabled')) {
            this.transitionTo('evaluation');
        }
    },
    model: function () {
        return {
            //TODO setup view model for 'extend'
        };
    }
});

Blast.ResultsRoute = Ember.Route.extend({
    beforeModel: function () {
        if (this.controllerFor('application').stages.findBy('resource', 'results').get('disabled')) {
            this.transitionTo('extend');
        }
    },
    model: function () {
        return {
            //TODO setup view model for 'results'
        };
    }
});