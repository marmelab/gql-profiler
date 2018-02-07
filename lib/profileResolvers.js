'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _monitor = require('./monitor');

var _monitor2 = _interopRequireDefault(_monitor);

var _reporters = require('./reporters');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const traverseResolvers = (resolvers, reporter, getResolverName, namePrefix) => {
    const wrapped = {};

    Object.keys(resolvers).forEach(key => {
        const resolver = resolvers[key];
        const name = getResolverName(namePrefix, key, resolver);

        if (typeof resolver === 'object') {
            wrapped[key] = traverseResolvers(resolver, reporter, getResolverName, name);
        } else if (typeof resolver === 'function') {
            wrapped[key] = (0, _monitor2.default)(resolver, reporter, name);
        } else {
            wrapped[key] = resolver;
        }
    });

    return wrapped;
};

const defaultOptions = {
    enabled: true,
    disableInProduction: true,
    env: process && process.env && process.env.NODE_ENV === 'production',
    reporter: _reporters.nullReporter,
    getResolverName: (prefix = 'ROOT', key) => prefix === 'ROOT' ? key : `${prefix}.${key}`
};

exports.default = (resolvers, options = {}) => {
    const config = _extends({}, defaultOptions, options);

    if (!config.enabled || config.disableInProduction && config.env === 'production') {
        return resolvers;
    }

    const reporter = typeof config.reporter === 'function' ? config.reporter() : config.reporter;

    return traverseResolvers(resolvers, reporter, config.getResolverName);
};

module.exports = exports['default'];