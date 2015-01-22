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
            name: 'Extend Stage',
            resource: 'extend',
            disabled: false
        }),
        Ember.Object.create({
            name: 'Results',
            resource: 'results',
            disabled: false
        })
    ],
    prevStageButtonDisabled: true,
    resetStageButtonDisabled: true,
    nextStepButtonDisabled: true,
    nextStageButtonDisabled: true,
    outletController: null,
    actions: {
        prevStage: function () {
            if (this.outletController) this.outletController._actions.prevStage.apply(this.outletController);
            return false;
        },
        resetStage: function () {
            if (this.outletController) this.outletController._actions.resetStage.apply(this.outletController);
            return false;
        },
        nextStep: function () {
            if (this.outletController) this.outletController._actions.nextStep.apply(this.outletController);
            return false;
        },
        nextStage: function () {
            if (this.outletController) this.outletController._actions.nextStage.apply(this.outletController);
            return false;
        }
    }
});

Blast.IndexRoute = Ember.Route.extend({
    beforeModel: function () {
        this.transitionTo('configuration');
    }
});

Blast.ConfigurationRoute = Ember.Route.extend({
    model: function () {
        return {
            query: this.store.find('querySequence', '1'),
            records: this.store.findAll('sequenceRecord')
        };
    },
    setupController: function (controller, model) {
        this._super(controller, model);
        var appController = controller.get('controllers.application');
        appController.set('prevStageButtonDisabled', true);
        appController.set('resetStageButtonDisabled', true);
        appController.set('nextStepButtonDisabled', true);
        appController.set('nextStageButtonDisabled', false);
        appController.set('outletController', controller);
    }
});

Blast.ConfigurationController = Ember.ObjectController.extend({
    needs: ['application'],
    newSequenceRecord: '',
    actions: {
        prevStage: Ember.K,
        resetStage: Ember.K,
        nextStep: Ember.K,
        nextStage: function () {
            //TODO validate configuration, update querySequence
            this.get('controllers.application.stages').findBy('resource', 'init').set('disabled', false);
            this.transitionToRoute('init');
        },
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
            query: this.store.find('querySequence', '1'),
            records: this.store.findAll('sequenceRecord')
        };
    },
    setupController: function (controller, model) {
        this._super(controller, model);
        var appController = controller.get('controllers.application');
        appController.set('prevStageButtonDisabled', false);
        appController.set('resetStageButtonDisabled', false);
        appController.set('nextStepButtonDisabled', false);
        appController.set('nextStageButtonDisabled', false);
        appController.set('outletController', controller);
    }
});

Blast.InitController = Ember.ObjectController.extend({
    needs: ['application'],
    actions: {
        prevStage: function () {
            this.transitionToRoute('configuration');
        },
        resetStage: function () {
            this.store.unloadAll('word');
        },
        nextStep: function () {
            //TODO check is stage completed & perform step
        },
        nextStage: function () {
            //TODO check is stage completed
            this.get('controllers.application.stages').findBy('resource', 'search').set('disabled', false);
            this.transitionToRoute('search');
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
    },
    setupController: function (controller, model) {
        this._super(controller, model);
        var appController = controller.get('controllers.application');
        appController.set('prevStageButtonDisabled', false);
        appController.set('resetStageButtonDisabled', false);
        appController.set('nextStepButtonDisabled', false);
        appController.set('nextStageButtonDisabled', false);
        appController.set('outletController', controller);
    }
});

Blast.SearchController = Ember.ObjectController.extend({
    needs: ['application'],
    actions: {
        prevStage: function () {
            this.transitionToRoute('init');
        },
        resetStage: function () {
            //TODO implement
        },
        nextStep: function () {
            //TODO check is stage completed & perform step
        },
        nextStage: function () {
            //TODO check is stage completed
            this.get('controllers.application.stages').findBy('resource', 'extend').set('disabled', false);
            this.transitionToRoute('extend');
        }
    }
});

Blast.ExtendRoute = Ember.Route.extend({
    beforeModel: function () {
        if (this.controllerFor('application').stages.findBy('resource', 'extend').get('disabled')) {
            this.transitionTo('search');
        }
    },
    model: function () {
        return {
            //TODO setup view model for 'extend'
            wordGroups: [
                Ember.Object.create({
                    word: 'ACT',
                    records: [
                        Ember.Object.create({
                            active: true,
                            sequencePrefixView: 'AAA',
                            sequenceMatchView: 'BBB',
                            sequenceSuffixView: 'CCC',
                            queryPrefixView: 'AAA',
                            queryMatchView: 'BBB',
                            querySuffixView: 'CCC',
                            scoreView: '  43 34  ',
                            dropOffView: '  00 00  '
                        }),
                        Ember.Object.create({
                            active: false,
                            sequencePrefixView: 'AAA',
                            sequenceMatchView: 'BBB',
                            sequenceSuffixView: 'CCC',
                            queryPrefixView: 'AAA',
                            queryMatchView: 'BBB',
                            querySuffixView: 'CCC',
                            scoreView: '  43 34  ',
                            dropOffView: '  00 00  '
                        })
                    ]
                }),
                Ember.Object.create({
                    word: 'ACT',
                    records: [
                        Ember.Object.create({
                            active: false,
                            sequencePrefixView: 'AAA',
                            sequenceMatchView: 'BBB',
                            sequenceSuffixView: 'CCC',
                            queryPrefixView: 'AAA',
                            queryMatchView: 'BBB',
                            querySuffixView: 'CCC',
                            scoreView: '  43 34  ',
                            dropOffView: '  00 00  '
                        }),
                        Ember.Object.create({
                            active: false,
                            sequencePrefixView: 'AAA',
                            sequenceMatchView: 'BBB',
                            sequenceSuffixView: 'CCC',
                            queryPrefixView: 'AAA',
                            queryMatchView: 'BBB',
                            querySuffixView: 'CCC',
                            scoreView: '  43 34  ',
                            dropOffView: '  00 00  '
                        })
                    ]
                })
            ]
        };
    },
    setupController: function (controller, model) {
        this._super(controller, model);
        var appController = controller.get('controllers.application');
        appController.set('prevStageButtonDisabled', false);
        appController.set('resetStageButtonDisabled', false);
        appController.set('nextStepButtonDisabled', false);
        appController.set('nextStageButtonDisabled', false);
        appController.set('outletController', controller);
    }
});

Blast.ExtendController = Ember.ObjectController.extend({
    needs: ['application'],
    actions: {
        prevStage: function () {
            this.transitionToRoute('evaluation');
        },
        resetStage: function () {
            //TODO implement
        },
        nextStep: function () {
            //TODO check is stage completed & perform step
        },
        nextStage: function () {
            //TODO check is stage completed
            this.get('controllers.application.stages').findBy('resource', 'results').set('disabled', false);
            this.transitionToRoute('results');
        }
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
            query: this.store.find('querySequence', '1'),
            //TODO setup view model for 'results'
            results: [
                Ember.Object.create({prefix: 'AAA', match: 'BBB', suffix: 'CCC'}),
                Ember.Object.create({prefix: 'AAA', match: 'BBB', suffix: 'CCC'}),
                Ember.Object.create({prefix: 'AAA', match: 'BBB', suffix: 'CCC'})
            ]
        };
    },
    setupController: function (controller, model) {
        this._super(controller, model);
        var appController = controller.get('controllers.application');
        appController.set('prevStageButtonDisabled', false);
        appController.set('resetStageButtonDisabled', true);
        appController.set('nextStepButtonDisabled', true);
        appController.set('nextStageButtonDisabled', true);
        appController.set('outletController', controller);
    }
});

Blast.ResultsController = Ember.ObjectController.extend({
    needs: ['application'],
    actions: {
        prevStage: function () {
            this.transitionToRoute('extend');
        },
        resetStage: Ember.K,
        nextStep: Ember.K,
        nextStage: Ember.K
    }
});

Ember.Handlebars.helper('highlight', function(value, options) {
    var escaped = Handlebars.Utils.escapeExpression(value);
    return new Ember.Handlebars.SafeString('<span class="highlight">' + escaped + '</span>');
});

Blast.RecordExtensionComponent = Ember.Component.extend({
    tagName: 'pre',
    classNameBindings: ['highlightRecord'],
    highlightRecord: false
});