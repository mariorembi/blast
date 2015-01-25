/**
 * Stworzenie globalnej definicji aplikacji
 */
Blast = Ember.Application.create({
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
    wordLength: 11,
    scoreDropOff: 5,
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
            disabled: true
        }),
        Ember.Object.create({
            name: 'Results',
            resource: 'results',
            disabled: true
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
            records: this.store.findAll('sequenceRecord'),
            symbols: this.store.findAll('sequenceSymbol'),
            scoring: this.store.findAll('scoring')
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
            //FIXME validate configuration
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
            words: this.store.findAll('word'),
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
    stageCompleted: function () {
        return this.get('words.length') > 0;
    }.property('words'),
    _performNextStep: function () {
        var query = this.get('query');
        var self = this;
        wordSplit(query.get('sequence'), this.get('controllers.application.wordLength')).forEach(function (wordDescriptor) {
            var store = self.get('store');
            var word = store.createRecord('word', {
                startOffset: wordDescriptor.off,
                symbols: wordDescriptor.word,
                originalSequence: query
            });
            store.createRecord('wordRecordGroup', {word: word}).get('recordsToCheck').addObjects(self.model.records);
        });
        this.set('stageCompleted', true);
    },
    actions: {
        prevStage: function () {
            this.transitionToRoute('configuration');
        },
        resetStage: function () {
            this.store.unloadAll('word');
            this.store.unloadAll('wordRecordGroup');
            this.set('stageCompleted', false);
            this.get('controllers.application.stages').findBy('resource', 'search').set('disabled', true);
        },
        nextStep: function () {
            if (!this.get('stageCompleted')) {
                this._performNextStep();
            }
        },
        nextStage: function () {
            if (!this.get('stageCompleted')) {
                while (!this.get('stageCompleted')) {
                    this._performNextStep();
                }
                return;
            }
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
            wordRecordGroups: this.store.findAll('wordRecordGroup'),
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

Blast.SearchController = Ember.ObjectController.extend({
    needs: ['application'],
    stageCompleted: function () {
        return this.get('wordRecordGroups').find(function (wordRecordGroup) {
                return wordRecordGroup.get('recordsToCheck.length') > 0;
            }) === undefined;
    }.property('wordRecordGroups'),
    _performNextStep: function () {
        var query = this.get('query');
        var self = this;
        var currentWordRecordGroup = this.get('wordRecordGroups').find(function (wordRecordGroup) {
            return wordRecordGroup.get('recordsToCheck.length') > 0;
        });
        if (currentWordRecordGroup !== undefined) {
            var record = currentWordRecordGroup.get('recordsToCheck').shiftObject();
            var recordSequence = record.get('sequence');
            var word = currentWordRecordGroup.get('word');
            var wordSymbols = word.get('symbols');
            var wordStartOffset = word.get('startOffset');
            var store = self.get('store');
            var wordLength = wordSymbols.length;
            var matchedRecords = currentWordRecordGroup.get('matchedRecords');
            wordRecordHit(recordSequence, wordSymbols).forEach(function (startOffset) {
                matchedRecords.addObject(store.createRecord('matchedRecord', {
                    record: record,
                    startOffset: startOffset,
                    endOffset: startOffset + wordLength,
                    leftExtension: store.createRecord('extension').set('scores', []).set('dropOffs', []),
                    rightExtension: store.createRecord('extension').set('scores', []).set('dropOffs', []),
                    matchStartOffset: startOffset,
                    matchEndOffset: startOffset + wordLength,
                    queryStartOffset: wordStartOffset,
                    queryEndOffset: wordStartOffset + wordLength
                }));
            });
        } else {
            this.set('stageCompleted', true);
        }
    },
    actions: {
        prevStage: function () {
            this.transitionToRoute('init');
        },
        resetStage: function () {
            var self = this;
            this.get('wordRecordGroups').forEach(function (wordRecordGroup) {
                wordRecordGroup.get('recordsToCheck').addObjects(self.model.records);
                wordRecordGroup.get('matchedRecords').clear();
            });
            this.get('store').unloadAll('matchedRecord');
            this.set('stageCompleted', false);
            this.get('controllers.application.stages').findBy('resource', 'extend').set('disabled', true);
        },
        nextStep: function () {
            if (!this.get('stageCompleted')) {
                this._performNextStep();
            }
        },
        nextStage: function () {
            if (!this.get('stageCompleted')) {
                while (!this.get('stageCompleted')) {
                    this._performNextStep();
                }
                return;
            }
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
            symbols: this.store.findAll('sequenceSymbol'),
            scoring: this.store.findAll('scoring'),
            wordGroups: this.store.findAll('wordRecordGroup')
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
        var map = {};
        model.scoring.then(function (scoring) {
            scoring.forEach(function (scoreEntry) {
                var from = scoreEntry.get('fromSymbol.symbol');
                var to = scoreEntry.get('toSymbol.symbol');
                var score = scoreEntry.get('score');
                if (!map.hasOwnProperty(from)) {
                    map[from] = {};
                }
                map[from][to] = score;
            });
        });
        if (controller._expander == null) {
            controller._expander = new Expander();
        }
        controller._expander.similarityMatrix = map;
        controller._expander.maxPenalty = appController.get('scoreDropOff');
    }
});

Blast.ExtendController = Ember.ObjectController.extend({
    needs: ['application'],
    _expander: null,
    stageCompleted: function () {
        return this.get('wordGroups').every(function (wordGroup) {
            return wordGroup.get('matchedRecords').every(function (match) {
                return match.get('extended');
            });
        });
    }.property('wordGroups').volatile(),
    _performNextStep: function (forAll) {
        var matchedRecord = undefined;
        var wordGroupRef = this.get('wordGroups').find(function (wordGroup) {
            var find = wordGroup.get('matchedRecords').find(function (match) {
                if (match.get('extended')) {
                    match.set('active', false);
                    return false;
                } else {
                    matchedRecord = match;
                    return true;
                }
            });
            return find !== undefined;
        });
        if (matchedRecord !== undefined) {
            if (!matchedRecord.get('active')) {
                matchedRecord.set('active', true);
                this._expander.resetState();
                this._expander.record = matchedRecord.get('record.sequence');
                this._expander.sequence = wordGroupRef.get('word.originalSequence.sequence');
                this._expander.word = {
                    off: {
                        sequence: wordGroupRef.get('word.startOffset'),
                        record: matchedRecord.get('startOffset')
                    },
                    size: wordGroupRef.get('word.symbols.length'),
                    str: wordGroupRef.get('word.symbols')
                };
                var initialResult = this._expander.init();
                this._processStepResult(matchedRecord, initialResult);
                if (!forAll) {
                    this._updateMatchRanges(matchedRecord);
                    return;
                }
            }
            var results;
            if (forAll) {
                this._processStepResult(matchedRecord, this._expander.getAll());
                this._processBestMatchResult(matchedRecord, this._expander.getResult());
            } else {
                results = this._expander.getNext();
                if (results != null) {
                    this._processStepResult(matchedRecord, results);
                    this._updateMatchRanges(matchedRecord);
                } else {
                    this._processBestMatchResult(matchedRecord, this._expander.getResult());
                }
            }
        }
    },
    _processStepResult: function (matchRecord, results) {
        matchRecord.set('leftExtension.scores', results.left.score);
        matchRecord.set('leftExtension.dropOffs', results.left.penalty);
        matchRecord.set('rightExtension.scores', results.right.score);
        matchRecord.set('rightExtension.dropOffs', results.right.penalty);
    },
    _updateMatchRanges: function (matchRecord) {
        var word = this._expander.word;
        matchRecord.set('matchStartOffset', word.off.record);
        matchRecord.set('matchEndOffset', word.off.record + word.size);
        matchRecord.set('queryStartOffset', word.off.sequence);
        matchRecord.set('queryEndOffset', word.off.sequence + word.size);
    },
    _processBestMatchResult: function (matchRecord, result) {
        this._updateMatchRanges(matchRecord);
        matchRecord.set('extended', true);
        matchRecord.set('active', false);
        this.get('store').createRecord('result', {
            record: matchRecord.get('record'),
            startOffset: result.recordOff,
            endOffset: result.recordOff + result.size,
            score: result.score
        });
    },
    actions: {
        prevStage: function () {
            this.transitionToRoute('search');
        },
        resetStage: function () {
            this.get('wordGroups').forEach(function (wordGroup) {
                wordGroup.get('matchedRecords').every(function (match) {
                    match.set('active', false);
                    match.set('extended', false);
                    match.set('leftExtension.scores', []);
                    match.set('leftExtension.dropOffs', []);
                    match.set('rightExtension.scores', []);
                    match.set('rightExtension.dropOffs', []);
                    match.set('matchStartOffset', match.get('startOffset'));
                    match.set('matchEndOffset', match.get('endOffset'));
                    match.set('queryStartOffset', wordGroup.get('word.startOffset'));
                    match.set('queryEndOffset', wordGroup.get('word.startOffset') + wordGroup.get('word.symbols.length'));
                });
            });
            this.set('stageCompleted', false);
            this.get('controllers.application.stages').findBy('resource', 'results').set('disabled', true);
        },
        nextStep: function () {
            if (!this.get('stageCompleted')) {
                this._performNextStep(false);
            }
        },
        nextStage: function () {
            if (!this.get('stageCompleted')) {
                while (!this.get('stageCompleted')) {
                    this._performNextStep(true);
                }
                return;
            }
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
            records: this.store.findAll('sequenceRecord'),
            results: DS.PromiseArray.create({
                promise: this.store.findAll('result').then(function (results) {
                    return results.sortBy('score').reverse()
                })
            })
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
