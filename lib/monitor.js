"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (fn, reporter, name) => (() => {
    var _ref = _asyncToGenerator(function* (...args) {
        const evt = reporter.newEvent && reporter.newEvent(fn, args, name);

        if (reporter.start) {
            reporter.start(evt);
        }

        try {
            const result = yield fn(...args);

            if (reporter.end) {
                reporter.end(evt, result);
            }

            return result;
        } catch (err) {
            if (reporter.error) {
                reporter.error(evt, err);
            }

            throw err;
        }
    });

    return function () {
        return _ref.apply(this, arguments);
    };
})();

module.exports = exports["default"];