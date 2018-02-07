'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.htmlReporter = exports.memoryReporter = exports.nullReporter = undefined;

var _null = require('./null');

var _null2 = _interopRequireDefault(_null);

var _memory = require('./memory');

var _memory2 = _interopRequireDefault(_memory);

var _html = require('./html');

var _html2 = _interopRequireDefault(_html);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const nullReporter = exports.nullReporter = _null2.default;
const memoryReporter = exports.memoryReporter = _memory2.default;
const htmlReporter = exports.htmlReporter = _html2.default;