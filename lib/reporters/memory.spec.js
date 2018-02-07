'use strict';

var _lolex = require('lolex');

var _lolex2 = _interopRequireDefault(_lolex);

var _memory = require('./memory');

var _memory2 = _interopRequireDefault(_memory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Memory Reporter', () => {
    let clock;
    let reporter;

    const newEvent = (name, ticks = 15) => {
        const evt = reporter.newEvent(null, null, name);
        reporter.start(evt);
        clock.tick(ticks);
        reporter.end(evt);
    };

    beforeEach(() => {
        clock = _lolex2.default.install({
            now: new Date('2018-01-01 14:00'),
            toFake: ['hrtime']
        });

        reporter = (0, _memory2.default)();
    });

    it('should build a hierarchy from event hits', () => {
        newEvent('model.id');
        newEvent('model.id');
        newEvent('model.name');

        expect(reporter.getHierarchy()).toEqual({
            name: 'root',
            value: 45,
            children: [{
                name: 'model',
                value: 45,
                children: [{
                    name: 'id',
                    value: 30,
                    children: []
                }, {
                    name: 'name',
                    value: 15,
                    children: []
                }]
            }]
        });
    });

    afterEach(() => {
        clock.uninstall();
    });
});