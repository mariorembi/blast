/**
 * Created by Marcin on 2015-01-23.
 */

Blast.ScoringMatrixComponent = Ember.Component.extend({
    columnHeaders: function () {
        return DS.PromiseArray.create({
            promise: this.get('symbols').then(function (array) {
                return array.sortBy('symbol').map(function (item, idx, enumerable) {
                    return item.get('symbol');
                });
            })
        });
    }.property('symbols'),
    matrixRows: function () {
        var self = this;
        return DS.PromiseArray.create({
            promise: this.get('columnHeaders').then(function (array) {
                var rows = [];
                var scoring = self.get('scoring');
                array.forEach(function (symbol) {
                    rows.push({
                        rowHeader: symbol,
                        values: scoring.filter(function(item, idx, enumerable){
                            return item.get('fromSymbol.symbol') == symbol;
                        }).sortBy('toSymbol.symbol')
                    });
                });
                return rows;
            })
        });
    }.property('scoring', 'columnHeaders')
});

Blast.RecordExtensionComponent = Ember.Component.extend({
    tagName: 'pre',
    classNameBindings: ['highlightRecord'],
    highlightRecord: function () {
        return this.get('record.active');
    }.property('record.active'),
    sequencePrefixView: function () {
        return this.get('record.sequencePrefixView');
    }.property('record.sequence'),
    sequenceMatchView: function () {
        return this.get('record.sequenceMatchView');
    }.property('record.sequence'),
    sequenceSuffixView: function () {
        return this.get('record.sequenceSuffixView');
    }.property('record.sequence'),
    queryPrefixView: function () {
        return this.get('record.queryPrefixView');
    }.property('record.query'),
    queryMatchView: function () {
        return this.get('record.queryMatchView');
    }.property('record.query'),
    querySuffixView: function () {
        return this.get('record.querySuffixView');
    }.property('record.query'),
    scoreView: function () {
        return this.get('record.scoreView');
    }.property('record.score'),
    dropOffView: function () {
        return this.get('record.dropOffView');
    }.property('record.dropOff')
});