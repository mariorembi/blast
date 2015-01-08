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

Blast.Router.map(function(){
   this.resource('configuration');
   this.resource('init');
   this.resource('search');
   this.resource('extend');
   this.resource('result');
   this.resource('about');
});

Blast.ApplicationAdapter = DS.FixtureAdapter.extend();

Blast.ApplicationController = Ember.ObjectController.extend({
   stages: [
       {
           name: 'Initialization Stage',
           resource: 'init',
           disabled: true
       },
       {
           name: 'Search Stage',
           resource: 'search',
           disabled: true
       },
       {
           name: 'Extend Stage',
           resource: 'extend',
           disabled: true
       },
       {
           name: 'Result Stage',
           resource: 'result',
           disabled: true
       }
   ]
});

Blast.IndexRoute = Ember.Route.extend({
    beforeModel: function(){
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
    wordLength: 4,
    newSequenceRecord: '',
    actions: {
        removeRecordSequence: function(sequenceRecord) {
            sequenceRecord.deleteRecord();
            return false;
        },
        addRecordSequence: function() {
            this.store.createRecord('sequenceRecord', {sequence: this.newSequenceRecord});
            this.set('newSequenceRecord','');
            return false;
        },
        removeAllRecords: function() {
            this.store.unloadAll('sequenceRecord');
            return false;
        }
    }
});

Blast.InitRoute = Ember.Route.extend({
    beforeModel: function(){
        if (this.controllerFor('application').stages.findBy('resource', 'init').disabled) {
            this.transitionTo('configuration');
        }
    },
    model: function () {
        return {
            //TODO setup view model for 'init'
        };
    }
});

Blast.SearchRoute = Ember.Route.extend({
    beforeModel: function(){
        if (this.controllerFor('application').stages.findBy('resource', 'search').disabled) {
            this.transitionTo('init');
        }
    },
    model: function () {
        return {
            //TODO setup view model for 'search'
        };
    }
});

Blast.ExtendRoute = Ember.Route.extend({
    beforeModel: function(){
        if (this.controllerFor('application').stages.findBy('resource', 'extend').disabled) {
            this.transitionTo('search');
        }
    },
    model: function () {
        return {
            //TODO setup view model for 'extend'
        };
    }
});

Blast.ResultRoute = Ember.Route.extend({
    beforeModel: function(){
        if (this.controllerFor('application').stages.findBy('resource', 'result').disabled) {
            this.transitionTo('search');
        }
    },
    model: function () {
        return {
            //TODO setup view model for 'result'
        };
    }
});