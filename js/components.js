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

Blast.WordSearchComponent = Ember.Component.extend({
    tagName: 'div',
    classNames: ['form-group']
});

Blast.RecordExtensionComponent = Ember.Component.extend({
    tagName: 'pre',
    classNameBindings: ['highlightRecord'],
    highlightRecord: function () {
        return this.get('record.active');
    }.property('record.active'),
    sequencePrefixView: function () {
        var diff = this.get('record.queryStartOffset') - this.get('record.matchStartOffset');
        var blankPrefix = diff > 0 ? ' '.repeat(diff) : '';
        return (blankPrefix + this.get('record.record.sequence').substr(0, this.get('record.matchStartOffset'))).scatter();
    }.property('record.record.sequence', 'record.matchStartOffset', 'record.queryStartOffset'),
    sequenceMatchView: function () {
        return (this.get('record.record.sequence').substring(this.get('record.matchStartOffset'), this.get('record.matchEndOffset'))).scatter();
    }.property('record.record.sequence', 'record.matchStartOffset', 'record.matchEndOffset'),
    sequenceSuffixView: function () {
        return (this.get('record.record.sequence').substring(this.get('record.matchStartOffset') + this.get('record.matchEndOffset'))).scatter();
    }.property('record.record.sequence', 'record.matchStartOffset', 'record.matchEndOffset'),
    queryPrefixView: function () {
        var diff = this.get('record.matchStartOffset') - this.get('record.queryStartOffset');
        var blankPrefix = diff > 0 ? ' '.repeat(diff) : '';
        return (blankPrefix + this.get('word.originalSequence.sequence').substring(0, this.get('record.queryStartOffset'))).scatter();
    }.property('word.originalSequence.sequence', 'record.queryStartOffset', 'record.matchStartOffset'),
    queryMatchView: function () {
        return (this.get('word.originalSequence.sequence').substring(this.get('record.queryStartOffset'), this.get('record.queryEndOffset'))).scatter();
    }.property('word.originalSequence.sequence', 'record.queryStartOffset', 'record.queryEndOffset'),
    querySuffixView: function () {
        return (this.get('word.originalSequence.sequence').substring(this.get('record.queryStartOffset') + this.get('record.queryEndOffset'))).scatter();
    }.property('word.originalSequence.sequence', 'record.queryStartOffset', 'record.queryEndOffset'),
    scoreView: function () {
        var callback = function (number) {
            return number.asScatteredString();
        };
        var scoreStr = ' '.repeat(Math.max(this.get('record.matchStartOffset'), this.get('record.queryStartOffset'))).scatter();
        var leftScore = this.get('record.leftExtension.scores');
        scoreStr += leftScore.map(callback).join('');
        var rightScore = this.get('record.rightExtension.scores');
        //FIXME blank space between scores
        scoreStr += ' '.repeat(this.get('record.queryEndOffset') - this.get('record.queryStartOffset') - leftScore.length - rightScore.length).scatter();
        scoreStr += rightScore.map(callback).join('');
        return scoreStr;
    }.property('record.leftExtension.scores', 'record.rightExtension.scores', 'record.matchStartOffset', 'record.queryStartOffset', 'record.queryEndOffset'),
    dropOffView: function () {
        var callback = function (number) {
            return number.asScatteredString();
        };
        var scoreStr = ' '.repeat(Math.max(this.get('record.matchStartOffset'), this.get('record.queryStartOffset'))).scatter();
        var leftDropOff = this.get('record.leftExtension.dropOffs');
        var rightDropOff = this.get('record.rightExtension.dropOffs');
        scoreStr += leftDropOff.map(callback).join('');
        //FIXME blank space between drop-offs
        scoreStr += ' '.repeat(this.get('record.queryEndOffset') - this.get('record.queryStartOffset') - leftDropOff.length - rightDropOff.length).scatter();
        scoreStr += rightDropOff.map(callback).join('');
        return scoreStr;
    }.property('record.leftExtension.dropOffs', 'record.rightExtension.dropOffs', 'record.matchStartOffset', 'record.queryStartOffset', 'record.queryEndOffset')
});

Blast.ResultItemComponent = Ember.Component.extend({
    tagName: "li",
    classNames: ['list-group-item'],
    prefix: function(){
        return this.get('result.record.sequence').substr(0, this.get('result.startOffset'));
    }.property('result.record.sequence', 'result.startOffset'),
    match: function(){
        return this.get('result.record.sequence').substring(this.get('result.startOffset'), this.get('result.endOffset'));
    }.property('result.record.sequence', 'result.startOffset', 'result.endOffset'),
    suffix: function(){
        return this.get('result.record.sequence').substr(this.get('result.endOffset'));
    }.property('result.record.sequence', 'result.endOffset')
})