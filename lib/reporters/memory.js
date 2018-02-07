'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const durationToMs = duration => duration[0] * 1000 + duration[1] / 1000000; /* eslint-disable no-param-reassign */


const findParent = (route, root) => {
    let cursor = root;
    const parentRoute = [...route];
    parentRoute.pop(); // Remove child

    parentRoute.forEach(step => {
        const child = cursor.children.find(c => c.name === step);
        cursor = child;
    });

    return cursor;
};

const insertHitInHierarchy = (hit, root) => {
    const route = hit.name.split('.');
    const duration = durationToMs(hit.duration);

    Array.from({ length: route.length }, (x, i) => i).forEach(level => {
        const resolverName = route[level];
        const levelRoute = route.filter((_, i) => i <= level);

        const parent = level === 0 ? root : findParent(levelRoute, root);

        let child = parent.children.find(c => c.name === resolverName);

        if (!child) {
            child = {
                name: resolverName,
                value: 0,
                children: []
            };

            parent.children.push(child);
        }

        child.value += duration;

        if (level === 0) {
            root.value += duration;
        }
    });
};

const handleEventEnd = (hit, hierarchy) => {
    hit.end = process.hrtime();
    hit.endDate = new Date();
    hit.duration = process.hrtime(hit.start);
    insertHitInHierarchy(hit, hierarchy);

    return hit;
};

exports.default = () => {
    let events;
    let hierarchy;

    const reset = () => {
        events = [];
        hierarchy = { name: 'root', value: 0, children: [] };
    };

    reset();

    return {
        newEvent: (fn, args, name) => {
            const hit = { id: _uuid2.default.v4(), name };
            events.push(hit);
            return hit;
        },
        start: hit => {
            hit.start = process.hrtime();
            hit.startDate = new Date();
        },
        end: hit => {
            handleEventEnd(hit, hierarchy);
            hit.error = null;
        },
        error: (hit, _error) => {
            handleEventEnd(hit, hierarchy);
            hit.error = _error;
        },
        getEvents: () => events,
        getHierarchy: () => hierarchy,
        reset
    };
};

module.exports = exports['default'];