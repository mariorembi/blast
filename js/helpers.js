/**
 * Created by Marcin on 2015-01-23.
 */

Ember.Handlebars.helper('highlight', function(value, options) {
    return new Ember.Handlebars.SafeString('<span class="highlight">' + Handlebars.Utils.escapeExpression(value) + '</span>');
});

Ember.Handlebars.helper('make-offset', function(value, options){
    return ' '.repeat(value);
});


String.prototype.repeat = function(times) {
    times = times || 0;
    return new Array(times + 1).join(this);
};