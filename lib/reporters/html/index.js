'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _memory = require('../memory');

var _memory2 = _interopRequireDefault(_memory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (baseReporter = _memory2.default) => {
    const reporter = baseReporter();
    const template = _fs2.default.readFileSync(_path2.default.resolve(__dirname, './base.html'), { encoding: 'utf-8' });
    const compiled = _lodash2.default.template(template);

    return _extends({}, reporter, {
        getHtml() {
            return compiled({
                _: _lodash2.default,
                events: reporter.getEvents(),
                hierarchy: reporter.getHierarchy()
            });
        }
    });
};

module.exports = exports['default'];