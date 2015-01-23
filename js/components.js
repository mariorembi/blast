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
        var diff = this.get('record.queryRange.from') - this.get('record.sequenceRange.from');
        var blankPrefix = diff > 0 ? ' '.repeat(diff) : '';
        return blankPrefix + this.get('record.sequence').substr(0, this.get('record.sequenceRange.from'));
    }.property('record.sequence', 'record.sequenceRange.from', 'record.queryRange.from'),
    sequenceMatchView: function () {
        return this.get('record.sequence').substr(this.get('record.sequenceRange.from'), this.get('record.sequenceRange.length'));
    }.property('record.sequence', 'record.sequenceRange.from', 'record.sequenceRange.length'),
    sequenceSuffixView: function () {
        return this.get('record.sequence').substr(this.get('record.sequenceRange.from') + this.get('record.sequenceRange.length'));
    }.property('record.sequence', 'record.sequenceRange.from', 'record.sequenceRange.length'),
    queryPrefixView: function () {
        var diff = this.get('record.sequenceRange.from') - this.get('record.queryRange.from');
        var blankPrefix = diff > 0 ? ' '.repeat(diff) : '';
        return blankPrefix + this.get('record.query').substr(0, this.get('record.queryRange.from'));
    }.property('record.query', 'record.queryRange.from', 'record.sequenceRange.from'),
    queryMatchView: function () {
        return this.get('record.query').substr(this.get('record.queryRange.from'), this.get('record.queryRange.length'));
    }.property('record.query', 'record.queryRange.from', 'record.queryRange.length'),
    querySuffixView: function () {
        return this.get('record.query').substr(this.get('record.queryRange.from') + this.get('record.queryRange.length'));
    }.property('record.query', 'record.queryRange.from', 'record.queryRange.length'),
    scoreView: function () {
        var scoreStr = ' '.repeat(Math.max(this.get('record.sequenceRange.from'), this.get('record.queryRange.from')));
        var leftScore = this.get('record.leftExtension.score');
        scoreStr += leftScore.reverse().join('');
        var rightScore = this.get('record.rightExtension.score');
        //FIXME blank space between scores
        scoreStr += ' '.repeat(this.get('record.queryRange.length') - leftScore.length - rightScore.length);
        scoreStr += rightScore.join('');
        return scoreStr;
    }.property('record.leftExtension.score', 'record.rightExtension.score', 'record.sequenceRange.from', 'record.queryRange.from', 'record.queryRange.length'),
    dropOffView: function () {
        var scoreStr = ' '.repeat(Math.max(this.get('record.sequenceRange.from'), this.get('record.queryRange.from')));
        var leftDropOff = this.get('record.leftExtension.dropOff');
        var rightDropOff = this.get('record.rightExtension.dropOff');
        scoreStr += leftDropOff.reverse().join('');
        //FIXME blank space between drop-offs
        scoreStr += ' '.repeat(this.get('record.queryRange.length') - leftDropOff.length - rightDropOff.length);
        scoreStr += rightDropOff.join('');
        return scoreStr;
    }.property('record.leftExtension.dropOff', 'record.rightExtension.dropOff', 'record.sequenceRange.from', 'record.queryRange.from', 'record.queryRange.length')
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