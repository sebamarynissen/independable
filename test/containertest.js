var expect = require('chai').expect;
var builder = require('./..');

describe('The container', function() {

    var container = builder();
    it('should raise errors when an undefined services is requested', function() {
        expect(function() {
            container.get();
        }).to.throw(Error);
    });

    it('should throw an error when trying to define something invalid', function() {
        expect(function() {
            container.define('this-is', 'forbidden');
        }).to.throw(Error);
        expect(function() {
            container.define('this-is-also-forbidden', {});
        });
    });

    it('should register services correctly', function() {

        container.register('string', 'a string');
        expect(container.get('string')).to.equal('a string');

        container.register({
            'some': 'very simple',
            'service': 'strings'
        });

        expect(container.get('some')).to.equal('very simple');
        expect(container.get('service')).to.equal('strings');

    });

    it('should define services correctly', function() {

        container.define('factory', function() {
            return 'A simple factory function';
        });
        expect(container.get('factory')).to.equal('A simple factory function');

        container.define({
            defined: function() {
                return 'as a factory function';
            },
            but: {
                'deps': ['defined'],
                get: function(defined) {
                    return 'should also work';
                }
            }
        });
        expect(container.get('defined')).to.equal('as a factory function');
        expect(container.get('but')).to.equal('should also work');

    });

    it('should treat dependencies correctly', function() {

        container.register('simple-dep', 'simple dep');
        container.define('dependent', {
            'deps': ['simple-dep'],
            get: function(simple) {
                return simple.split(' ');
            }
        });

        expect(container.get('dependent')).to.eql(['simple', 'dep']);

    });

    it('should contain a reference to itself', function() {

        container.register('random', 'okay');
        container.define('use-random', function() {
            return this.get('random');
        });
        expect(container.get('use-random')).to.equal('okay');
    });

});